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
import {
  chatRequestSchema,
  type ChatUIMessage,
  type Fuente,
} from "@/lib/ia/schemas";
import { logger } from "@/lib/logger";
import { checkRateLimit } from "@/lib/rate-limit";

/**
 * El chat de la CV Viva (S3, estándar 7). Orden de defensas:
 * kill-switch → rate limit por IP → Zod → guardrail off-topic (estática,
 * CERO llamadas al proveedor) → circuit breaker → RAG con citas en streaming.
 * Cualquier falla del proveedor degrada al cliente a búsqueda local — el
 * chat nunca muere. Nada de lo que produce el LLM se persiste.
 */

const CHAT_RATE_LIMIT = { limit: 10, windowMs: 60_000 };
const TOP_K_CONTEXTO = 4;

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
  const { allowed } = checkRateLimit(`chat:${ip}`, CHAT_RATE_LIMIT);
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

  const { retriever } = getChatIndex(locale);

  // 4. Guardrail de entrada: off-topic responde estático, sin gastar tokens.
  //    Búsqueda ESTRICTA (sin fuzzy) — "gatos" no es "datos".
  if (esOffTopic(retriever.topKStrict(pregunta.content))) {
    log.info(
      { ms: Date.now() - start },
      "chat offtopic — respuesta estática (cero tokens)",
    );
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
    titulo: f.chunk.titulo,
    ancla: f.chunk.ancla,
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
        const usage = await result.totalUsage;
        registrarExito();
        logUsoChat(log, {
          proveedor: modelo.proveedor,
          modelo: modelo.modelId,
          ms: Date.now() - start,
          usage,
        });
      } catch {
        // el onError del stream mergeado ya registró la falla
      }
    },
    onError: alFallarProveedor,
  });

  return createUIMessageStreamResponse({ stream });
}
