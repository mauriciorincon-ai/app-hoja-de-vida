/**
 * MODO MANTENIMIENTO (2026-09-24, pedido del dueño: «fácil de poner y
 * quitar»). Un interruptor en Vercel: la variable `MANTENIMIENTO` en
 * Production + Redeploy. Motor puro, probado en
 * `tests/unit/mantenimiento.test.ts`.
 *
 * Solo `on` lo enciende —sin distinguir mayúsculas ni espacios—. Cualquier
 * otro valor, la variable vacía o ausente, o un error de tipeo («onn»,
 * «true») deja el sitio ARRIBA: el error barato es no apagar, nunca apagar
 * sin querer.
 */
export function enMantenimiento(
  valor: string | undefined = process.env.MANTENIMIENTO,
): boolean {
  return valor?.trim().toLowerCase() === "on";
}

/**
 * Cuánto le pide a Google que espere antes de volver (`Retry-After`, en
 * segundos). Con un 503 y este encabezado, un buscador entiende que la caída
 * es temporal y no reemplaza el sitio por la página de mantenimiento.
 */
export const REINTENTO_SEGUNDOS = 1800;

/** El idioma de la página de mantenimiento: el de la ruta; la raíz, español. */
export function idiomaDeRuta(pathname: string): "es" | "en" {
  return /^\/en(\/|$)/.test(pathname) ? "en" : "es";
}
