import { NextResponse } from "next/server";
import { logger } from "@/lib/logger";
import { checkRateLimit } from "@/lib/rate-limit";
import { sendSolicitudEmail } from "@/lib/resend";
import { APP_OTRA, ETIQUETA_APP_OTRA, solicitudSchema } from "@/lib/schemas";
import { getManifestVitrina } from "@/lib/vitrina/loader";

/** Colapsa saltos de línea y recorta: los campos van a un email plano. */
function sanitize(value: string): string {
  return value.replace(/[\r\n\t]+/g, " ").trim();
}

export async function POST(request: Request): Promise<NextResponse> {
  const requestId = crypto.randomUUID();
  const start = Date.now();
  // x-real-ip lo fija la plataforma (no spoofeable por el cliente);
  // x-forwarded-for queda de fallback para dev/local y tests
  const ip =
    request.headers.get("x-real-ip") ??
    request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ??
    "unknown";
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
    mensaje: sanitize(parsed.data.mensaje),
  };

  // La lista de espera solo admite las apps publicadas en la vitrina (o
  // «otra»): el desplegable es la única fuente, y el manifiesto es la verdad.
  let etiquetaApp: string | undefined;
  if (solicitud.app) {
    const ancla = getManifestVitrina().find((a) => a.slug === solicitud.app);
    if (solicitud.app === APP_OTRA) etiquetaApp = ETIQUETA_APP_OTRA;
    else if (ancla) etiquetaApp = ancla.nombre;
    else {
      log.warn(
        { app: solicitud.app, ms: Date.now() - start },
        "app desconocida",
      );
      return NextResponse.json({ error: "invalid_fields" }, { status: 400 });
    }
  }
  const ctx = { motivo: solicitud.motivo, app: solicitud.app };

  try {
    const result = await sendSolicitudEmail(solicitud, etiquetaApp);
    if (result.simulated) {
      log.warn(
        { ...ctx, ms: Date.now() - start },
        "RESEND_API_KEY ausente: envío simulado",
      );
    } else {
      log.info(
        { ...ctx, emailId: result.id, ms: Date.now() - start },
        "solicitud enviada",
      );
    }
    return NextResponse.json({ ok: true });
  } catch (error) {
    log.error({ err: error, ...ctx, ms: Date.now() - start }, "fallo el envío");
    return NextResponse.json({ error: "send_failed" }, { status: 502 });
  }
}
