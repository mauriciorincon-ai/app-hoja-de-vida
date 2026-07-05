import { NextResponse } from "next/server";
import { logger } from "@/lib/logger";
import { checkRateLimit } from "@/lib/rate-limit";
import { sendSolicitudEmail } from "@/lib/resend";
import { solicitudSchema } from "@/lib/schemas";

/** Colapsa saltos de línea y recorta: los campos van a un email plano. */
function sanitize(value: string): string {
  return value.replace(/[\r\n\t]+/g, " ").trim();
}

export async function POST(request: Request): Promise<NextResponse> {
  const requestId = crypto.randomUUID();
  const start = Date.now();
  const ip =
    request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ?? "unknown";
  const log = logger.child({ requestId, route: "solicitar-acceso" });

  const { allowed } = checkRateLimit(ip);
  if (!allowed) {
    log.warn({ ip, ms: Date.now() - start }, "rate limited");
    return NextResponse.json({ error: "rate_limited" }, { status: 429 });
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    log.warn({ ms: Date.now() - start }, "invalid json body");
    return NextResponse.json({ error: "invalid_body" }, { status: 400 });
  }

  // Honeypot: los bots llenan `website`; se responde éxito sin enviar nada.
  if (
    typeof body === "object" &&
    body !== null &&
    "website" in body &&
    body.website !== ""
  ) {
    log.warn({ ms: Date.now() - start }, "honeypot triggered");
    return NextResponse.json({ ok: true });
  }

  const parsed = solicitudSchema.safeParse(body);
  if (!parsed.success) {
    log.warn(
      {
        issues: parsed.error.issues.map((i) => i.path.join(".")),
        ms: Date.now() - start,
      },
      "validation failed",
    );
    return NextResponse.json({ error: "invalid_fields" }, { status: 400 });
  }

  const solicitud = {
    ...parsed.data,
    nombre: sanitize(parsed.data.nombre),
    app: sanitize(parsed.data.app),
    mensaje: sanitize(parsed.data.mensaje),
  };

  try {
    const result = await sendSolicitudEmail(solicitud);
    if (result.simulated) {
      log.warn(
        { app: solicitud.app, ms: Date.now() - start },
        "RESEND_API_KEY ausente: envío simulado",
      );
    } else {
      log.info(
        { app: solicitud.app, emailId: result.id, ms: Date.now() - start },
        "solicitud enviada",
      );
    }
    return NextResponse.json({ ok: true });
  } catch (error) {
    log.error(
      { err: error, app: solicitud.app, ms: Date.now() - start },
      "fallo el envío",
    );
    return NextResponse.json({ error: "send_failed" }, { status: 502 });
  }
}
