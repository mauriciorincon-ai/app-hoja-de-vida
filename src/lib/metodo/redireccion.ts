/**
 * LA RUTA VIEJA DE «MÉTODOS» (S14, 2026-10-18). Motor puro.
 *
 * La sección nació como «Mi método» en `/metodo/<slug>` (S10) y, por decisión
 * del dueño, pasó a «Métodos» en `/metodos/<slug>`: son publicaciones, no
 * respuestas de entrevista. Los enlaces que ya circulan (una cita del chat, un
 * marcador, el sitemap que Google leyó) no pueden dejar de servir, así que la
 * ruta vieja se redirige **de forma permanente** a la nueva, en los dos
 * idiomas y con el mismo resto de la ruta.
 *
 * Vive aparte del `proxy.ts` para poder probarse con cadenas, y el proxy es
 * quien responde el 301: `redirects()` de `next.config` solo emite 308, y el
 * criterio de fin del sprint pide el 301. El ancla (`#bloque-3`) no viaja en
 * la petición: el navegador la conserva al seguir la redirección.
 */

/** `/metodo` o `/metodo/…`, con idioma (`/es`, `/en`) o sin él. */
const RUTA_VIEJA = /^\/(?:(es|en)(?=\/))?\/?metodo(\/.*)?$/;

/**
 * La ruta nueva de una ruta vieja de la sección, o `null` si no lo es.
 * Sin idioma, la raíz del sitio abre en español (`localeDetection: false`).
 * `/es/metodos…` y cualquier otra cosa que solo se parezca (`/es/metodo-x`)
 * no se tocan.
 */
export function rutaNuevaDeMetodo(pathname: string): string | null {
  const m = RUTA_VIEJA.exec(pathname);
  if (!m) return null;
  const idioma = m[1] ?? "es";
  return `/${idioma}/metodos${m[2] ?? ""}`;
}
