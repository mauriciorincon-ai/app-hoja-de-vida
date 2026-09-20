import { NextResponse } from "next/server";
import {
  codigoCoincide,
  hashCodigo,
  secretoSesion,
} from "@/lib/chat-registro/codigo";
import { verificacionConNombreSchema } from "@/lib/chat-registro/schemas";
import { cabeceraSetCookie, emitirSesion } from "@/lib/chat-registro/sesion";
import { gateHabilitado, resolverStore } from "@/lib/chat-registro/store";
import { logger } from "@/lib/logger";
import { checkRateLimit } from "@/lib/rate-limit";

/** e2e: todo sale de localhost, el límite se apaga como en las otras rutas. */
const limiteApagado = () => process.env.DISABLE_RATE_LIMIT === "1";

/**
 * Paso 2 de la barrera del chat: correo + código → cookie de sesión firmada
 * (30 días). El nombre viaja en el cuerpo porque el código no lo guarda: lo
 * que la sesión certifica es el correo (el código llegó ahí); el nombre es
 * lo que el visitante dijo llamarse, y así se registra.
 */

const LIMITE = { limit: 10, windowMs: 10 * 60_000 };

export async function POST(request: Request): Promise<NextResponse> {
  const requestId = crypto.randomUUID();
  const start = Date.now();
  const ip =
    request.headers.get("x-real-ip") ??
    request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ??
    "unknown";
  const log = logger.child({ requestId, route: "chat/verificar" });

  if (!gateHabilitado()) {
    return NextResponse.json({ error: "gate_off" }, { status: 404 });
  }
  const secreto = secretoSesion();
  const store = resolverStore();
  if (!secreto || !store) {
    return NextResponse.json(
      { error: "registro_no_disponible" },
      { status: 503 },
    );
  }
  if (!limiteApagado() && !checkRateLimit(`verificar:${ip}`, LIMITE).allowed) {
    log.warn({ ip, ms: Date.now() - start }, "rate limited");
    return NextResponse.json({ error: "rate_limited" }, { status: 429 });
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "invalid_body" }, { status: 400 });
  }
  const parsed = verificacionConNombreSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: "invalid_fields" }, { status: 400 });
  }
  const nombre = parsed.data.nombre.replace(/[\r\n\t]+/g, " ").trim();
  const { email, codigo } = parsed.data;

  let resultado;
  try {
    resultado = await store.verificarCodigo(
      email,
      hashCodigo(codigo, email, secreto),
      codigoCoincide,
    );
  } catch (error) {
    log.error({ err: error, ms: Date.now() - start }, "no se pudo verificar");
    return NextResponse.json(
      { error: "registro_no_disponible" },
      { status: 503 },
    );
  }
  if (!resultado.ok) {
    log.warn(
      { motivo: resultado.motivo, ms: Date.now() - start },
      "código rechazado",
    );
    return NextResponse.json({ error: resultado.motivo }, { status: 401 });
  }

  const { valor } = emitirSesion({ nombre, email }, secreto);
  log.info({ ms: Date.now() - start }, "sesión de chat emitida");
  return NextResponse.json(
    { ok: true, nombre },
    { headers: { "Set-Cookie": cabeceraSetCookie(valor) } },
  );
}
