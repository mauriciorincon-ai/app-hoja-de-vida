/**
 * Años cumplidos desde un mes dado — el cálculo del logro «años de trayectoria
 * profesional» (corrección de contenido 2026-09-12, punto 11 del informe de
 * discrepancias del S8: «que deje de envejecer solo»). Una sola implementación
 * para el Zod (`src/lib/schemas.ts`) y el índice del chat (`build-chat-index.mjs`).
 *
 * `desde` es "YYYY-MM". Cuenta años COMPLETOS: desde 2016-08, vale 10 hasta
 * julio de 2027 y 11 desde agosto de 2027.
 */
export const DESDE_RE = /^\d{4}-(0[1-9]|1[0-2])$/;

/** @param {string} desde  @param {Date} [hoy] */
export function aniosCumplidos(desde, hoy = new Date()) {
  if (!DESDE_RE.test(desde)) throw new Error(`desde inválido: ${desde}`);
  const [y, m] = desde.split("-").map(Number);
  const meses = (hoy.getFullYear() - y) * 12 + (hoy.getMonth() + 1 - m);
  return Math.floor(meses / 12);
}

/** ¿El mes `desde` está en el futuro respecto a `hoy`? */
export function esFuturo(desde, hoy = new Date()) {
  const [y, m] = desde.split("-").map(Number);
  return y * 12 + m > hoy.getFullYear() * 12 + hoy.getMonth() + 1;
}
