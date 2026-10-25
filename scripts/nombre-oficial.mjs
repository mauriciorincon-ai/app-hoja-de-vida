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
  return /** @type {T} */ (cambiarEnTodo(exp, viejo, oficial));
}

/**
 * Cambia `viejo` por `oficial` en cada texto de un árbol de datos, sin mutarlo.
 * @param {unknown} v
 * @param {string} viejo
 * @param {string} oficial
 * @returns {unknown}
 */
function cambiarEnTodo(v, viejo, oficial) {
  if (typeof v === "string") return cambiarNombre(v, viejo, oficial);
  if (Array.isArray(v)) return v.map((x) => cambiarEnTodo(x, viejo, oficial));
  if (v && typeof v === "object") {
    return Object.fromEntries(
      Object.entries(v).map(([k, x]) => [k, cambiarEnTodo(x, viejo, oficial)]),
    );
  }
  return v;
}

/**
 * Lo mismo para la ficha técnica de un agente, una investigación o un tablero
 * (2026-10-24, extiende el ADR-028): `pieza.nombre` pasa a ser el oficial y, en
 * cada texto de la ficha, el nombre con el que la otra casa la llamó se cambia por
 * el oficial. La ficha de `content/` no se edita: es una lectura con alias.
 * @template {{ pieza: { nombre: string } }} T
 * @param {T} ficha
 * @param {string} oficial
 * @returns {T}
 */
export function conNombreDePieza(ficha, oficial) {
  const viejo = ficha.pieza.nombre;
  if (viejo === oficial) return ficha;
  return /** @type {T} */ (cambiarEnTodo(ficha, viejo, oficial));
}
