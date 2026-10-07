/**
 * EL NOMBRE OFICIAL DE LAS APPS (Sprint 009, ADR-028) — lo puro.
 *
 * Los exports de `content/vitrina/` no se editan aquí y cada uno trae el nombre
 * con el que su app se llama a sí misma. El nombre oficial vive en
 * `data/categorias-apps.yaml` y se aplica al LEER el export. Lo aplican el
 * loader de la vitrina (`src/lib/vitrina/loader.ts`) y los scripts de build que
 * leen los exports sin pasar por él (el índice del chat y los destinos): por eso
 * esta lógica está en un `.mjs` sin dependencias y se importa desde los dos
 * lados, como `anios.mjs`. Una sola copia: no puede desfasarse.
 */

const ESCAPE = /[.*+?^${}()|[\]\\]/g;

/**
 * El nombre `viejo` como palabra suelta: ni pegado a otra letra («Velocidad») ni
 * a un guion o guion bajo.
 * @param {string} viejo
 * @returns {RegExp}
 */
export function palabraSuelta(viejo) {
  const v = viejo.replace(ESCAPE, "\\$&");
  return new RegExp(`(?<![\\p{L}\\p{N}_-])${v}(?![\\p{L}\\p{N}_-])`, "gu");
}

/**
 * Cambia `viejo` por `oficial` en un texto. Si el oficial CONTIENE al viejo (su
 * nombre corto dentro del largo), las apariciones que ya son el oficial se
 * respetan: reemplazar a ciegas duplicaría el prefijo.
 * @param {string} texto
 * @param {string} viejo
 * @param {string} oficial
 * @returns {string}
 */
export function cambiarNombre(texto, viejo, oficial) {
  if (viejo === oficial) return texto;
  const reemplazar = (/** @type {string} */ t) =>
    t.replace(palabraSuelta(viejo), oficial);
  return oficial.includes(viejo)
    ? texto.split(oficial).map(reemplazar).join(oficial)
    : reemplazar(texto);
}

/**
 * El export con el nombre oficial: `app.nombre` pasa a ser el oficial y, en cada
 * texto del export, el nombre con el que la app se llamaba a sí misma se cambia
 * por el oficial. No muta el original ni toca el archivo de `content/`.
 * @template {{ app: { nombre: string } }} T
 * @param {T} exp
 * @param {string} oficial
 * @returns {T}
 */
export function conNombreOficial(exp, oficial) {
  const viejo = exp.app.nombre;
  if (viejo === oficial) return exp;
  /** @param {unknown} v @returns {unknown} */
  const cambiar = (v) => {
    if (typeof v === "string") return cambiarNombre(v, viejo, oficial);
    if (Array.isArray(v)) return v.map(cambiar);
    if (v && typeof v === "object") {
      return Object.fromEntries(
        Object.entries(v).map(([k, x]) => [k, cambiar(x)]),
      );
    }
    return v;
  };
  return /** @type {T} */ (cambiar(exp));
}
