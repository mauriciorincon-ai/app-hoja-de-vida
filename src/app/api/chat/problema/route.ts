import { NextResponse } from "next/server";
import { secretoSesion } from "@/lib/chat-registro/codigo";
import { problemaSchema } from "@/lib/chat-registro/schemas";
import { resolverStore } from "@/lib/chat-registro/store";
import { logger } from "@/lib/logger";
import { checkRateLimit } from "@/lib/rate-limit";
import { sendProblemaChatEmail } from "@/lib/resend";

/** e2e: todo sale de localhost, el límite se apaga como en las otras rutas. */
const limiteApagado = () => process.env.DISABLE_RATE_LIMIT === "1";

/**
 * «¿Algo no funciona? Avísame» (revisión 2026-09-24): el aviso de un visitante
 * atascado en la puerta del chat. Defensas: rate limit por IP (3/10 min) →
 * honeypot → Zod → correo al dueño con respuesta al visitante y con el
 * diagnóstico de la puerta. NO depende de que la puerta funcione —sin secreto
 * ni almacén sigue respondiendo—: existe justo para cuando no funciona.
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
  const log = logger.child({ requestId, route: "chat/problema" });

  if (!limiteApagado() && !checkRateLimit(`problema:${ip}`, LIMITE).allowed) {
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

  const parsed = problemaSchema.safeParse(body);
  if (!parsed.success) {
    log.warn(
      { issues: parsed.error.issues.map((i) => i.path.join(".")) },
      "validation failed",
    );
    return NextResponse.json({ error: "invalid_fields" }, { status: 400 });
  }
  const problema = { ...parsed.data, nombre: sanitize(parsed.data.nombre) };

  // El estado de la puerta en el momento del aviso: qué pieza falta, si falta.
  const diagnostico = {
    secreto: Boolean(secretoSesion()),
    almacen: Boolean(resolverStore()),
    correo: Boolean(process.env.RESEND_API_KEY),
  };

  try {
    const envio = await sendProblemaChatEmail(problema, diagnostico);
    log.info(
      {
        paso: problema.paso,
        diagnostico,
        simulated: envio.simulated,
        ms: Date.now() - start,
      },
      "aviso de problema en la puerta del chat",
    );
    return NextResponse.json({ ok: true, simulated: envio.simulated });
  } catch (error) {
    log.error(
      { err: error, ms: Date.now() - start },
      "falló el envío del aviso de problema",
    );
    return NextResponse.json({ error: "send_failed" }, { status: 502 });
  }
}
