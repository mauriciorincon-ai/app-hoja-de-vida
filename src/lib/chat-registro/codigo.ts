import "server-only";
import { createHash, randomInt, timingSafeEqual } from "node:crypto";
import { CODIGO_DIGITOS } from "./schemas";

/**
 * El código de un solo uso. Se genera con `randomInt` (no `Math.random`), se
 * guarda SOLO su hash con un secreto de servidor (pepper), y se compara en
 * tiempo constante. El código en claro existe únicamente en el email.
 */

export function generarCodigo(): string {
  return String(randomInt(0, 10 ** CODIGO_DIGITOS)).padStart(
    CODIGO_DIGITOS,
    "0",
  );
}

export function hashCodigo(
  codigo: string,
  email: string,
  secreto: string,
): string {
  return createHash("sha256")
    .update(`${secreto} ${email.toLowerCase()} ${codigo}`)
    .digest("hex");
}

export function codigoCoincide(
  hashGuardado: string,
  hashRecibido: string,
): boolean {
  const a = Buffer.from(hashGuardado, "hex");
  const b = Buffer.from(hashRecibido, "hex");
  return a.length === b.length && timingSafeEqual(a, b);
}

/** El secreto que firma sesiones y códigos. Sin él, la barrera no puede operar. */
export function secretoSesion(): string | null {
  const s = process.env.CHAT_SESSION_SECRET;
  return s && s.length >= 32 ? s : null;
}

/**
 * Código fijo para pruebas: SOLO se honra con el almacén en memoria (e2e y
 * dev sin correo). En producción el almacén es Supabase y esto es null.
 */
export function codigoDePrueba(): string | null {
  const c = process.env.CHAT_CODIGO_PRUEBA;
  return process.env.CHAT_GATE_STORE === "memory" && c && /^[0-9]{6}$/.test(c)
    ? c
    : null;
}
