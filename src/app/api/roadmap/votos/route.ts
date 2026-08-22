import { NextResponse } from "next/server";
import { logger } from "@/lib/logger";
import {
  leerConteo,
  votacionEnabled,
  VotesUnavailableError,
} from "@/lib/votes/client";

/**
 * Conteo agregado de votos del roadmap (S4). La sección lo pide al montar para
 * pintar contadores REALES. Sin caché (`no-store`): el número siempre sale de
 * la BD, jamás de un ISR que lo congele. Si la BD falla, responde 503 y la UI
 * declara "votación no disponible" en vez de mostrar ceros inventados.
 */

export const dynamic = "force-dynamic";

export async function GET(): Promise<NextResponse> {
  const requestId = crypto.randomUUID();
  const start = Date.now();
  const log = logger.child({ requestId, route: "roadmap/votos" });

  if (!votacionEnabled()) {
    return NextResponse.json({ error: "unavailable" }, { status: 503 });
  }

  try {
    const conteo = await leerConteo();
    log.info({ filas: conteo.length, ms: Date.now() - start }, "conteo leído");
    return NextResponse.json(
      { conteo },
      { headers: { "cache-control": "no-store" } },
    );
  } catch (error) {
    if (error instanceof VotesUnavailableError) {
      log.error({ ms: Date.now() - start }, "BD no disponible");
      return NextResponse.json({ error: "unavailable" }, { status: 503 });
    }
    throw error;
  }
}
