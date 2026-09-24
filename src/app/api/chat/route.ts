import {
  createUIMessageStream,
  createUIMessageStreamResponse,
  type ModelMessage,
} from "ai";
import { NextResponse } from "next/server";
import {
  breakerAbierto,
  registrarExito,
  registrarFalla,
} from "@/lib/ia/breaker";
import { streamRespuesta } from "@/lib/ia/client";
import { logUsoChat } from "@/lib/ia/cost";
import {
  construirSystemPrompt,
  esOffTopic,
  RESPUESTA_OFFTOPIC,
} from "@/lib/ia/guardrails";
import { getChatIndex } from "@/lib/ia/index-server";
import { chatHabilitado, resolverProveedor } from "@/lib/ia/provider";
import { TOP_K_CONTEXTO } from "@/lib/ia/retrieval";
import {
  chatRequestSchema,
  type ChatUIMessage,
  type Fuente,
} from "@/lib/ia/schemas";
import { secretoSesion } from "@/lib/chat-registro/codigo";
import type { EntradaRegistro, Sesion } from "@/lib/chat-registro/schemas";
import { sesionDeRequest } from "@/lib/chat-registro/sesion";
import {
  gateHabilitado,
  resolverStore,
  type RegistroStore,
} from "@/lib/chat-registro/store";
import { logger } from "@/lib/logger";
import { checkRateLimit } from "@/lib/rate-limit";

/**
 * El chat de la CV Viva (S3, estándar 7). Orden de defensas:
 * kill-switch → rate limit por IP → Zod → guardrail off-topic (estática,
 * CERO llamadas al proveedor) → circuit breaker → RAG con citas en streaming.
 * Cualquier falla del proveedor degrada al cliente a búsqueda local — el
 * chat nunca muere.
 *
 * Desde ADR-024 hay una defensa más antes del guardrail —la SESIÓN: sin la
 * cookie firmada que emite /api/chat/verificar no hay chat (401)— y una
 * consecuencia después: cada pregunta respondida se REGISTRA (quién, qué,
 * respuesta, fuentes, modo, costo) en el almacén del registro. Es la única
 * salida del LLM que se persiste, y se persiste tal cual, como texto.
 */

const CHAT_RATE_LIMIT = { limit: 10, windowMs: 60_000 };
/** e2e: todo sale de localhost; el límite se apaga como en la votación y el registro. */
const limiteApagado = () => process.env.DISABLE_RATE_LIMIT === "1";

/** Respuesta estática como stream UIMessage (el cliente no distingue transporte). */
function respuestaEstatica(texto: string): Response {
  const stream = createUIMessageStream<ChatUIMessage>({
    execute: ({ writer }) => {
      writer.write({ type: "start" });
      writer.write({ type: "data-offtopic", data: true });
      writer.write({ type: "text-start", id: "estatica" });
      writer.write({ type: "text-delta", id: "estatica", delta: texto });
      writer.write({ type: "text-end", id: "estatica" });
      writer.write({ type: "finish" });
    },
  });
  return createUIMessageStreamResponse({ stream });
}

export async function POST(request: Request): Promise<Response> {
  const requestId = crypto.randomUUID();
  const start = Date.now();
  const ip =
    request.headers.get("x-real-ip") ??
    request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ??
    "unknown";
  const log = logger.child({ requestId, route: "chat" });

  // 1. Kill-switch (defensa en profundidad: el server tampoco pinta el
  //    lanzador cuando CHAT_ENABLED=false)
  if (!chatHabilitado()) {
    log.warn({ ms: Date.now() - start }, "chat apagado por kill-switch");
    return NextResponse.json({ error: "chat_disabled" }, { status: 503 });
  }

  // 2. Rate limit por IP (ventana propia del chat)
  const { allowed } = limiteApagado()
    ? { allowed: true }
    : checkRateLimit(`chat:${ip}`, CHAT_RATE_LIMIT);
  if (!allowed) {
    log.warn({ ip, ms: Date.now() - start }, "chat rate limited");
    return NextResponse.json({ error: "rate_limited" }, { status: 429 });
  }

  // 3. Validación Zod del input
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "invalid_body" }, { status: 400 });
  }
  const parsed = chatRequestSchema.safeParse(body);
  if (!parsed.success) {
    log.warn(
      { issues: parsed.error.issues.map((i) => i.path.join(".")) },
      "chat input inválido",
    );
    return NextResponse.json({ error: "invalid_fields" }, { status: 400 });
  }
  const { locale, messages } = parsed.data;
  const pregunta = [...messages].reverse().find((m) => m.role === "user");
  if (!pregunta) {
    return NextResponse.json({ error: "invalid_fields" }, { status: 400 });
  }

  // 3b. La sesión (ADR-024): la barrera es del visitante, no del contenido.
  let sesion: Sesion | null = null;
  let store: RegistroStore | null = null;
  if (gateHabilitado()) {
    const secreto = secretoSesion();
    store = resolverStore();
    if (!secreto || !store) {
      log.error(
        { secreto: Boolean(secreto), store: Boolean(store) },
        "barrera del chat sin configurar",
      );
      return NextResponse.json(
        { error: "registro_no_disponible" },
        { status: 503 },
      );
    }
    sesion = sesionDeRequest(request, secreto);
    if (!sesion) {
      log.info({ ms: Date.now() - start }, "sin sesión — registro requerido");
      return NextResponse.json(
        { error: "registro_requerido" },
        { status: 401 },
      );
    }
  }
  const registrar = (
    entrada: Omit<EntradaRegistro, "nombre" | "email" | "locale">,
  ) => {
    if (!sesion || !store) return;
    store
      .registrar({
        ...entrada,
        nombre: sesion.nombre,
        email: sesion.email,
        locale,
      })
      .catch((err: unknown) =>
        log.error({ err }, "no se pudo registrar la conversación"),
      );
  };

  const { retriever } = getChatIndex(locale);

  // 4. Guardrail de entrada: off-topic responde estático, sin gastar tokens.
  //    Búsqueda ESTRICTA (sin fuzzy) — "gatos" no es "datos".
  if (esOffTopic(retriever.topKStrict(pregunta.content))) {
    log.info(
      { ms: Date.now() - start },
      "chat offtopic — respuesta estática (cero tokens)",
    );
    registrar({
      pregunta: pregunta.content,
      respuesta: RESPUESTA_OFFTOPIC[locale],
      fuentes: [],
      modo: "offtopic",
      ms: Date.now() - start,
    });
    return respuestaEstatica(RESPUESTA_OFFTOPIC[locale]);
  }

  // 5. Circuit breaker + proveedor configurado — si no, el cliente degrada
  //    a búsqueda local sobre el mismo índice (aviso honesto en la UI).
  if (breakerAbierto()) {
    log.warn({ ms: Date.now() - start }, "breaker abierto — fallback local");
    return NextResponse.json({ error: "fallback" }, { status: 503 });
  }
  const modelo = resolverProveedor();
  if (!modelo) {
    log.warn(
      { provider: process.env.CHAT_PROVIDER ?? "groq" },
      "proveedor sin configurar — fallback local",
    );
    return NextResponse.json({ error: "fallback" }, { status: 503 });
  }

  // 6. RAG: top-k como contexto numerado + streaming con citas
  const contexto = retriever.topK(pregunta.content, TOP_K_CONTEXTO);
  const fuentes: Fuente[] = contexto.map((f, i) => ({
    n: i + 1,
    codigo: f.chunk.codigo,
    titulo: f.chunk.titulo,
    ancla: f.chunk.ancla,
    destino: f.chunk.destino,
  }));
  const system = construirSystemPrompt(locale, contexto);
  const modelMessages: ModelMessage[] = messages.map((m) => ({
    role: m.role,
    content: m.content,
  }));

  // Los errores del proveedor viajan DENTRO del stream mergeado: el onError
  // que los ve es el de toUIMessageStream. Registra la falla en el breaker y
  // devuelve la señal "provider_error" — el cliente degrada a búsqueda local.
  const alFallarProveedor = (error: unknown): string => {
    registrarFalla();
    log.error(
      {
        err: error,
        proveedor: modelo.proveedor,
        modelo: modelo.modelId,
        ms: Date.now() - start,
      },
      "proveedor falló — el cliente degrada a búsqueda local",
    );
    return "provider_error";
  };

  const stream = createUIMessageStream<ChatUIMessage>({
    execute: async ({ writer }) => {
      writer.write({ type: "start" });
      writer.write({ type: "data-fuentes", data: fuentes });

      const result = streamRespuesta({
        modelo,
        system,
        messages: modelMessages,
      });
      writer.merge(
        result.toUIMessageStream({
          sendStart: false,
          onError: alFallarProveedor,
        }),
      );

      try {
        const [usage, texto] = await Promise.all([
          result.totalUsage,
          result.text,
        ]);
        registrarExito();
        logUsoChat(log, {
          proveedor: modelo.proveedor,
          modelo: modelo.modelId,
          ms: Date.now() - start,
          usage,
        });
        registrar({
          pregunta: pregunta.content,
          respuesta: texto,
          fuentes: fuentes.map((f) => ({
            codigo: f.codigo,
            titulo: f.titulo,
            ancla: f.ancla,
          })),
          modo: "ia",
          proveedor: modelo.proveedor,
          modelo: modelo.modelId,
          tokensIn: usage.inputTokens,
          tokensOut: usage.outputTokens,
          ms: Date.now() - start,
        });
      } catch {
        // el onError del stream mergeado ya registró la falla
      }
    },
    onError: alFallarProveedor,
  });

  return createUIMessageStreamResponse({ stream });
}
