import { NextResponse } from "next/server";
import { secretoSesion } from "@/lib/chat-registro/codigo";
import { registroLocalSchema } from "@/lib/chat-registro/schemas";
import { sesionDeRequest } from "@/lib/chat-registro/sesion";
import { gateHabilitado, resolverStore } from "@/lib/chat-registro/store";
import { logger } from "@/lib/logger";
import { checkRateLimit } from "@/lib/rate-limit";

/** e2e: todo sale de localhost, el límite se apaga como en las otras rutas. */
const limiteApagado = () => process.env.DISABLE_RATE_LIMIT === "1";

/**
 * El registro de las respuestas que el cliente produjo SOLO: en modo búsqueda
 * local (proveedor caído) el servidor no vio la respuesta, así que el panel la
 * manda aquí. Exige la misma sesión que el chat; sin ella, 401.
 */
export async function POST(request: Request): Promise<NextResponse> {
  const log = logger.child({
    requestId: crypto.randomUUID(),
    route: "chat/log",
  });
  if (!gateHabilitado()) return NextResponse.json({ ok: true, skipped: true });
  const secreto = secretoSesion();
  const store = resolverStore();
  if (!secreto || !store) {
    return NextResponse.json(
      { error: "registro_no_disponible" },
      { status: 503 },
    );
  }
  const sesion = sesionDeRequest(request, secreto);
  if (!sesion)
    return NextResponse.json({ error: "registro_requerido" }, { status: 401 });
  if (
    !limiteApagado() &&
    !checkRateLimit(`log:${sesion.email}`, { limit: 20, windowMs: 60_000 })
      .allowed
  ) {
    return NextResponse.json({ error: "rate_limited" }, { status: 429 });
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "invalid_body" }, { status: 400 });
  }
  const parsed = registroLocalSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: "invalid_fields" }, { status: 400 });
  }
  try {
    await store.registrar({
      nombre: sesion.nombre,
      email: sesion.email,
      locale: parsed.data.locale,
      pregunta: parsed.data.pregunta,
      respuesta: parsed.data.respuesta,
      fuentes: parsed.data.fuentes,
      modo: "local",
    });
    return NextResponse.json({ ok: true });
  } catch (error) {
    log.error({ err: error }, "no se pudo registrar la respuesta local");
    return NextResponse.json(
      { error: "registro_no_disponible" },
      { status: 503 },
    );
  }
}
