import { NextResponse } from "next/server";
import { logger } from "@/lib/logger";
import { checkRateLimit } from "@/lib/rate-limit";
import {
  emitirVoto,
  votacionEnabled,
  VotesUnavailableError,
} from "@/lib/votes/client";
import { esFeatureValida } from "@/lib/votes/roadmap";
import { votarInputSchema } from "@/lib/votes/schemas";

/**
 * Emite un voto del roadmap (S4, ADR-011). Orden de defensas:
 * kill-switch/config → rate limit por IP → Zod .strict() → validación de que
 * (app, feature) existe en apps.yaml → RPC atómica. El total que devuelve es el
 * REAL de la BD tras insertar; si la BD falla, responde 503 y la UI muestra
 * "votación no disponible" — jamás un conteo inventado. CERO PII: no se loguea
 * ni almacena la IP más allá del rate limit en memoria.
 */

const VOTO_RATE_LIMIT = { limit: 12, windowMs: 60_000 };

// En CI todo sale de localhost: una ventana por IP haría fallar los e2e. Se
// apaga SOLO con esta env var (jamás en producción); el gate del rate limit se
// reubica a un test dedicado del route (no se pierde). Se lee por request (no
// al cargar el módulo) para que sea testeable y respete cambios de entorno.
function rateLimitApagado(): boolean {
  return process.env.DISABLE_RATE_LIMIT === "1";
}

export async function POST(request: Request): Promise<NextResponse> {
  const requestId = crypto.randomUUID();
  const start = Date.now();
  const ip =
    request.headers.get("x-real-ip") ??
    request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ??
    "unknown";
  const log = logger.child({ requestId, route: "roadmap/votar" });

  if (!votacionEnabled()) {
    log.warn({ ms: Date.now() - start }, "votación no configurada/apagada");
    return NextResponse.json({ error: "unavailable" }, { status: 503 });
  }

  if (!rateLimitApagado()) {
    const { allowed } = checkRateLimit(`vote:${ip}`, VOTO_RATE_LIMIT);
    if (!allowed) {
      log.warn({ ms: Date.now() - start }, "rate limited");
      return NextResponse.json({ error: "rate_limited" }, { status: 429 });
    }
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    log.warn({ ms: Date.now() - start }, "invalid json body");
    return NextResponse.json({ error: "invalid_body" }, { status: 400 });
  }

  const parsed = votarInputSchema.safeParse(body);
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

  const { app, feature } = parsed.data;

  // El voto solo cuenta si (app, feature) existe en el roadmap del contenido.
  if (!esFeatureValida(app, feature)) {
    log.warn({ app, feature, ms: Date.now() - start }, "feature desconocida");
    return NextResponse.json({ error: "unknown_feature" }, { status: 400 });
  }

  try {
    const total = await emitirVoto(app, feature);
    log.info({ app, feature, total, ms: Date.now() - start }, "voto emitido");
    return NextResponse.json({ ok: true, app, feature, total });
  } catch (error) {
    if (error instanceof VotesUnavailableError) {
      log.error({ app, feature, ms: Date.now() - start }, "BD no disponible");
      return NextResponse.json({ error: "unavailable" }, { status: 503 });
    }
    throw error;
  }
}
