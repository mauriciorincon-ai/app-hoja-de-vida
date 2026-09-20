import "server-only";
import { createHmac, timingSafeEqual } from "node:crypto";
import { SESION_VIGENCIA_MS, sesionSchema, type Sesion } from "./schemas";

/**
 * Sesión firmada en cookie (HMAC-SHA256, sin dependencias). Payload en
 * base64url + firma. No es un JWT y no lo necesita: un solo emisor, un solo
 * lector, un solo secreto. La cookie es httpOnly, sameSite=lax y secure en
 * producción.
 */

export const COOKIE_SESION = "cv_chat";

const b64u = (s: string) => Buffer.from(s).toString("base64url");
const firmar = (payload: string, secreto: string) =>
  createHmac("sha256", secreto).update(payload).digest("base64url");

export function emitirSesion(
  { nombre, email }: { nombre: string; email: string },
  secreto: string,
  ahora = Date.now(),
): { valor: string; sesion: Sesion } {
  const sesion: Sesion = { nombre, email, exp: ahora + SESION_VIGENCIA_MS };
  const payload = b64u(JSON.stringify(sesion));
  return { valor: `${payload}.${firmar(payload, secreto)}`, sesion };
}

/** null si la cookie falta, está mal firmada, malformada o vencida. */
export function leerSesion(
  valor: string | undefined | null,
  secreto: string,
  ahora = Date.now(),
): Sesion | null {
  if (!valor) return null;
  const [payload, firma] = valor.split(".");
  if (!payload || !firma) return null;
  const esperada = firmar(payload, secreto);
  const a = Buffer.from(firma);
  const b = Buffer.from(esperada);
  if (a.length !== b.length || !timingSafeEqual(a, b)) return null;
  try {
    const parsed = sesionSchema.safeParse(
      JSON.parse(Buffer.from(payload, "base64url").toString("utf8")),
    );
    if (!parsed.success || parsed.data.exp <= ahora) return null;
    return parsed.data;
  } catch {
    return null;
  }
}

/** Lee la cookie de sesión de una Request (sin next/headers: sirve en tests). */
export function sesionDeRequest(
  request: Request,
  secreto: string,
): Sesion | null {
  const cookie = request.headers.get("cookie") ?? "";
  const par = cookie
    .split(";")
    .map((c) => c.trim())
    .find((c) => c.startsWith(`${COOKIE_SESION}=`));
  return leerSesion(
    par ? decodeURIComponent(par.slice(COOKIE_SESION.length + 1)) : null,
    secreto,
  );
}

export function cabeceraSetCookie(
  valor: string,
  maxAgeMs = SESION_VIGENCIA_MS,
): string {
  const secure = process.env.NODE_ENV === "production" ? "; Secure" : "";
  return (
    `${COOKIE_SESION}=${encodeURIComponent(valor)}; Path=/; HttpOnly; ` +
    `SameSite=Lax; Max-Age=${Math.floor(maxAgeMs / 1000)}${secure}`
  );
}
