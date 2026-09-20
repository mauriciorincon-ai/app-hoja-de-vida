import { NextResponse } from "next/server";
import {
  codigoDePrueba,
  generarCodigo,
  hashCodigo,
  secretoSesion,
} from "@/lib/chat-registro/codigo";
import { enviarCodigo } from "@/lib/chat-registro/email";
import { registroSchema } from "@/lib/chat-registro/schemas";
import { gateHabilitado, resolverStore } from "@/lib/chat-registro/store";
import { logger } from "@/lib/logger";
import { checkRateLimit } from "@/lib/rate-limit";

/** e2e: todo sale de localhost, el límite se apaga como en las otras rutas. */
const limiteApagado = () => process.env.DISABLE_RATE_LIMIT === "1";

/**
 * Paso 1 de la barrera del chat (ADR-024): nombre + correo → código por email.
 * Defensas: gate encendida → rate limit por IP (3/10 min) y por correo
 * (3/10 min) → honeypot → Zod → guardar hash → enviar. Nunca devuelve el
 * código al cliente; en modo simulado (sin RESEND_API_KEY) lo deja en el log.
 */

const LIMITE = { limit: 3, windowMs: 10 * 60_000 };

function sanitize(value: string): string {
  return value.replace(/[\r\n\t]+/g, " ").trim();
}

export async function POST(request: Request): Promise<NextResponse> {
  const requestId = crypto.randomUUID();
  const start = Date.now();
  const ip =
    request.headers.get("x-real-ip") ??
    request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ??
    "unknown";
  const log = logger.child({ requestId, route: "chat/registro" });

  if (!gateHabilitado()) {
    return NextResponse.json({ error: "gate_off" }, { status: 404 });
  }
  const secreto = secretoSesion();
  const store = resolverStore();
  if (!secreto || !store) {
    log.error(
      { secreto: Boolean(secreto), store: Boolean(store) },
      "barrera del chat sin configurar (CHAT_SESSION_SECRET o almacén)",
    );
    return NextResponse.json(
      { error: "registro_no_disponible" },
      { status: 503 },
    );
  }

  if (!limiteApagado() && !checkRateLimit(`registro:${ip}`, LIMITE).allowed) {
    log.warn({ ip, ms: Date.now() - start }, "rate limited (ip)");
    return NextResponse.json({ error: "rate_limited" }, { status: 429 });
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "invalid_body" }, { status: 400 });
  }
  if (
    typeof body === "object" &&
    body !== null &&
    "website" in body &&
    body.website !== ""
  ) {
    log.warn({ ms: Date.now() - start }, "honeypot triggered");
    return NextResponse.json({ ok: true });
  }

  const parsed = registroSchema.safeParse(body);
  if (!parsed.success) {
    log.warn(
      { issues: parsed.error.issues.map((i) => i.path.join(".")) },
      "validation failed",
    );
    return NextResponse.json({ error: "invalid_fields" }, { status: 400 });
  }
  const { email, locale } = parsed.data;
  const nombre = sanitize(parsed.data.nombre);

  if (!limiteApagado() && !checkRateLimit(`registro:${email}`, LIMITE).allowed) {
    log.warn({ ms: Date.now() - start }, "rate limited (email)");
    return NextResponse.json({ error: "rate_limited" }, { status: 429 });
  }

  const codigo = codigoDePrueba() ?? generarCodigo();
  try {
    await store.guardarCodigo(email, hashCodigo(codigo, email, secreto));
  } catch (error) {
    log.error(
      { err: error, ms: Date.now() - start },
      "no se pudo guardar el código",
    );
    return NextResponse.json(
      { error: "registro_no_disponible" },
      { status: 503 },
    );
  }

  try {
    const envio = await enviarCodigo({ to: email, nombre, codigo, locale });
    if (envio.simulated) {
      // Sin proveedor de correo: el código vive solo en este log (dev/preview).
      log.warn(
        { codigo, ms: Date.now() - start },
        "RESEND_API_KEY ausente: código simulado",
      );
    } else {
      log.info({ emailId: envio.id, ms: Date.now() - start }, "código enviado");
    }
    return NextResponse.json({ ok: true, simulated: envio.simulated });
  } catch (error) {
    log.error(
      { err: error, ms: Date.now() - start },
      "falló el envío del código",
    );
    return NextResponse.json({ error: "send_failed" }, { status: 502 });
  }
}
