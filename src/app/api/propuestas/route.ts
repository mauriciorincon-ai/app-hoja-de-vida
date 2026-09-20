import { NextResponse } from "next/server";
import { logger } from "@/lib/logger";
import { propuestaSchema } from "@/lib/propuestas";
import { checkRateLimit } from "@/lib/rate-limit";
import { sendPropuestaEmail } from "@/lib/resend";
import { getManifestVitrina } from "@/lib/vitrina/loader";

/** Colapsa saltos de línea y recorta: el texto va a un email plano. */
function sanitize(value: string): string {
  return value.replace(/[\r\n\t]+/g, " ").trim();
}

/**
 * Recibe una propuesta de funcionalidad para una app hermana y la manda por
 * correo (2026-09-13). Mismas defensas que el formulario de contacto: rate
 * limit por IP, honeypot silencioso, Zod, y la app tiene que existir en el
 * manifiesto de la vitrina. Sin RESEND_API_KEY el envío se simula. CERO PII
 * persistida: nada se guarda; la IP solo vive en el rate limit en memoria.
 */
export async function POST(request: Request): Promise<NextResponse> {
  const requestId = crypto.randomUUID();
  const start = Date.now();
  const ip =
    request.headers.get("x-real-ip") ??
    request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ??
    "unknown";
  const log = logger.child({ requestId, route: "propuestas" });

  const { allowed } = checkRateLimit(`propuesta:${ip}`);
  if (!allowed) {
    log.warn({ ms: Date.now() - start }, "rate limited");
    return NextResponse.json({ error: "rate_limited" }, { status: 429 });
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    log.warn({ ms: Date.now() - start }, "invalid json body");
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

  const parsed = propuestaSchema.safeParse(body);
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

  const ancla = getManifestVitrina().find((a) => a.slug === parsed.data.app);
  if (!ancla) {
    log.warn(
      { app: parsed.data.app, ms: Date.now() - start },
      "app desconocida",
    );
    return NextResponse.json({ error: "invalid_fields" }, { status: 400 });
  }

  const propuesta = {
    ...parsed.data,
    propuesta: sanitize(parsed.data.propuesta),
  };

  try {
    const result = await sendPropuestaEmail(propuesta, ancla.nombre);
    if (result.simulated) {
      log.warn(
        { app: propuesta.app, ms: Date.now() - start },
        "RESEND_API_KEY ausente: envío simulado",
      );
    } else {
      log.info(
        { app: propuesta.app, emailId: result.id, ms: Date.now() - start },
        "propuesta enviada",
      );
    }
    return NextResponse.json({ ok: true });
  } catch (error) {
    log.error(
      { err: error, app: propuesta.app, ms: Date.now() - start },
      "fallo el envío",
    );
    return NextResponse.json({ error: "send_failed" }, { status: 502 });
  }
}
