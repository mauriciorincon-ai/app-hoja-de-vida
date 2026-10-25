/**
 * LAS RUTAS VIEJAS QUE SE REDIRIGEN (motor puro).
 *
 * Una sección que cambia de nombre cambia de ruta, y los enlaces que ya
 * circulan (una cita del chat, un marcador, el sitemap que Google leyó) no
 * pueden dejar de servir. La ruta vieja se redirige **de forma permanente** a
 * la nueva, en los dos idiomas y con el mismo resto de la ruta:
 *
 *  - «Mi método» (`/metodo`) pasó a «Métodos» (`/metodos`) en el S14,
 *    2026-10-18: son publicaciones, no respuestas de entrevista.
 *  - La «vitrina» (`/vitrina`) pasó a «Portafolio» (`/portafolio`) en el S23,
 *    2026-10-25: el dueño quiso una sola palabra para todo el sitio.
 *
 * Vive aparte del `proxy.ts` para poder probarse con cadenas, y el proxy es
 * quien responde el 301: `redirects()` de `next.config` solo emite 308, y el
 * criterio de fin de los dos sprints pide el 301. El ancla (`#bloque-3`) no
 * viaja en la petición: el navegador la conserva al seguir la redirección.
 *
 * Sumar una sección renombrada es sumar una fila a `RENOMBRADAS`.
 */
export const RENOMBRADAS = [
  { vieja: "metodo", nueva: "metodos" },
  { vieja: "vitrina", nueva: "portafolio" },
] as const;

/**
 * `/<vieja>` o `/<vieja>/…`, con idioma (`/es`, `/en`) o sin él. Exacta: ni
 * `//<vieja>` ni `/es//<vieja>` (barras de más) ni `/Metodo` (mayúscula) son
 * la ruta vieja; el sitio no normaliza mayúsculas ni barras en ninguna otra
 * ruta y estas dan 404 como cualquier otra.
 */
const PATRONES = RENOMBRADAS.map((r) => ({
  ...r,
  patron: new RegExp(`^(?:/(es|en))?/${r.vieja}(/.*)?$`),
}));

/**
 * La ruta nueva de una ruta vieja, o `null` si no lo es. Sin idioma, la raíz
 * del sitio abre en español (`localeDetection: false`). La ruta nueva y
 * cualquier otra cosa que solo se parezca (`/es/metodo-x`, `/es/vitrinas`) no
 * se tocan.
 */
export function rutaNueva(pathname: string): string | null {
  for (const { patron, nueva } of PATRONES) {
    const m = patron.exec(pathname);
    if (!m) continue;
    return `/${m[1] ?? "es"}/${nueva}${m[2] ?? ""}`;
  }
  return null;
}
