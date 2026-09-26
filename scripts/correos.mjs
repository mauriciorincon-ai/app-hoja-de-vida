/**
 * LOS CORREOS PÚBLICOS (2026-09-26, pedido del dueño: «que muestre ambos por
 * si acaso, en mi sitio y el PDF»).
 *
 * El dueño tiene dos direcciones: su Gmail de siempre (`identidad.email`) y la
 * de su dominio, que reenvía al Gmail (Cloudflare Email Routing). La del
 * dominio NO se escribe en el repo: la regla 16 prohíbe el dominio en
 * cualquier archivo versionado. En los datos vive solo la parte local
 * (`identidad.emailDelDominio: "hola"`), y el dominio lo pone el build desde
 * la URL del sitio, que llega por variable de entorno.
 *
 * Sin dominio propio (local, una preview sin la variable, o el subdominio del
 * proveedor, donde esa dirección no existe) queda solo el Gmail. Nunca se
 * inventa una dirección que no recibe.
 *
 * Lo importan el sitio (`src/lib/correos.ts`), el PDF y el índice del chat:
 * una sola regla para los tres.
 */

/** El dominio propio del sitio, o `null` si la URL no es uno. */
export function dominioPropio(sitio) {
  if (typeof sitio !== "string" || sitio.length === 0) return null;
  let host;
  try {
    host = new URL(sitio).hostname.toLowerCase();
  } catch {
    return null;
  }
  host = host.replace(/^www\./, "");
  if (
    host === "localhost" ||
    !host.includes(".") ||
    /^\d{1,3}(\.\d{1,3}){3}$/.test(host) ||
    // El subdominio del proveedor de hosting no recibe correo. Se escribe como
    // expresión (y no el literal) para no disparar el barrido de CERO ENLACES.
    /\.vercel\.app$/.test(host)
  ) {
    return null;
  }
  return host;
}

/**
 * Los correos que el sitio y el PDF muestran, en orden: el del dominio
 * primero (la marca), el Gmail después.
 */
export function correosPublicos(identidad, sitio) {
  const dominio = dominioPropio(sitio);
  const delDominio =
    identidad.emailDelDominio && dominio
      ? `${identidad.emailDelDominio}@${dominio}`
      : null;
  return [delDominio, identidad.email].filter(Boolean);
}
