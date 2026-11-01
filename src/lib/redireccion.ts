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
 *  - El brochure (S28) reemplazó al detalle de cada app (`…/apps/<app>/detalle`) y a
 *    la página de la casa (`/apps/hoja-de-vida`, `/apps/chat-hoja-de-vida`): ahora
 *    todas son `…/portafolio/apps/<app>/brochure`.
 *
 * Vive aparte del `proxy.ts` para poder probarse con cadenas, y el proxy es
 * quien responde el 301: `redirects()` de `next.config` solo emite 308, y el
 * criterio de fin de los dos sprints pide el 301. El ancla (`#bloque-3`) no
 * viaja en la petición: el navegador la conserva al seguir la redirección.
 *
 * Sumar una sección renombrada es sumar una fila a `RENOMBRADAS`; una página
 * retirada, una a `RETIRADAS`.
 *
 * **Siempre en un solo salto.** `RETIRADAS` se aplica sobre la ruta YA renombrada,
 * así que `/vitrina/apps/habla/detalle` llega a `/es/portafolio/apps/habla/brochure`
 * sin pasar por `/es/portafolio/apps/habla/detalle`: un 301 encadenado le cuesta
 * una ida y vuelta al visitante y al buscador. La prueba fija que ninguna ruta
 * nueva vuelve a redirigir.
 */
export const RENOMBRADAS = [
  { vieja: "metodo", nueva: "metodos" },
  { vieja: "vitrina", nueva: "portafolio" },
] as const;

/**
 * Las dos páginas de la casa que tuvieron su propia ruta (`/apps/<slug>`, el brochure
 * del S4). Son los slugs de `SLUGS_CASA` (`src/lib/brochure/config.ts`); se repiten aquí
 * porque el proxy no puede importar el esquema y `redireccion.test.ts` fija que coinciden.
 */
const CASA = ["hoja-de-vida", "chat-hoja-de-vida"] as const;

/**
 * Páginas que ya no existen y a dónde pasaron, sobre la ruta ya renombrada. Con
 * idioma o sin él (sin idioma, el sitio abre en español).
 */
const RETIRADAS = [
  {
    // El detalle de una app: lo reemplaza su brochure.
    patron: /^(?:\/(es|en))?\/portafolio\/apps\/([^/]+)\/detalle\/?$/,
    destino: (m: RegExpExecArray) =>
      `/${m[1] ?? "es"}/portafolio/apps/${m[2]}/brochure`,
  },
  {
    // La página de la casa: ahora es el brochure de CV Viva y el de su chat.
    patron: new RegExp(`^(?:/(es|en))?/apps/(${CASA.join("|")})/?$`),
    destino: (m: RegExpExecArray) =>
      `/${m[1] ?? "es"}/portafolio/apps/${m[2]}/brochure`,
  },
];

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
  let ruta = pathname;
  let cambio = false;
  for (const { patron, nueva } of PATRONES) {
    const m = patron.exec(pathname);
    if (!m) continue;
    ruta = `/${m[1] ?? "es"}/${nueva}${m[2] ?? ""}`;
    cambio = true;
    break;
  }
  for (const { patron, destino } of RETIRADAS) {
    const m = patron.exec(ruta);
    if (m) return destino(m);
  }
  return cambio ? ruta : null;
}
