/**
 * «VITRINA» → «PORTAFOLIO» (Sprint 023, 2026-10-25) — lo puro.
 *
 * El dueño quiso UNA sola palabra en todo el sitio. Lo que escribe esta casa
 * (mensajes, datos, corpus) se cambia una vez, en el archivo. Lo que escriben
 * OTRAS casas (los exports de las apps, las fichas de agentes, investigaciones
 * y tableros, los complementos de la planeadora) no se edita aquí —regla dura
 * 2—: se cambia al LEERLO, como el nombre oficial de las apps (ADR-028), hasta
 * que cada casa mande el suyo con la palabra nueva.
 *
 * Es una función de texto y vive en un `.mjs` sin dependencias, importado por
 * el loader de la vitrina y por los scripts de build que leen esos archivos sin
 * pasar por él (el índice del chat), como `nombre-oficial.mjs`: una sola copia,
 * no puede desfasarse.
 *
 * CONCORDANCIA. «vitrina» es femenina y «portafolio», masculina: cambiar solo
 * la palabra deja «de la portafolio». Se cambia con su determinante:
 * «de la vitrina» → «del portafolio» · «a la vitrina» → «al portafolio» ·
 * «la / una / esta / esa / nuestra vitrina» → «el / un / este / ese / nuestro
 * portafolio» · «la propia vitrina» → «el propio portafolio» · «las vitrinas» →
 * «los portafolios». Con «mi / su / tu» o sin determinante solo cambia el
 * sustantivo. En inglés, «showcase» → «portfolio» (sin género).
 *
 * Lo que NO se toca: la palabra dentro de una ruta, un nombre de archivo o un
 * identificador (`content/vitrina`, `data/vitrina.yaml`, `los-agentes-de-la-
 * vitrina`, `paquete:vitrina`): solo la palabra suelta.
 *
 * Un adjetivo o un participio que concuerda con «vitrina» («la vitrina es
 * estática») no lo arregla una regla general: va en `FRASES`, cada una con su
 * concordancia. En el corpus del dueño esas frases NO se tocan, se listan.
 */

/**
 * Frases completas con concordancia, antes de la regla general. [patrón, texto].
 * @type {ReadonlyArray<readonly [RegExp, string]>}
 */
export const FRASES = [
  [/\bLa vitrina es estática\b/g, "El portafolio es estático"],
  [/\bla vitrina es estática\b/g, "el portafolio es estático"],
];

const PREVIO = "(?<![\\p{L}\\p{N}_/.\\-#@:])";
const SIGUE = "(?![\\p{L}\\p{N}_/-]|\\.(?:yaml|json|md|ts|mjs|html)\\b)";

const ES = new RegExp(
  `${PREVIO}((?:de|a)(\\s+)la(\\s+)|la(\\s+)(?:propia(\\s+))?|una(\\s+)|esta(\\s+)|esa(\\s+)|nuestra(\\s+)|propia(\\s+)|las(\\s+))?(vitrinas?)${SIGUE}`,
  "giu",
);
const EN = new RegExp(`${PREVIO}(showcases?)${SIGUE}`, "giu");

/** Conserva la mayúscula inicial (o todas) de la palabra que se reemplaza. */
function conMayuscula(original, nueva) {
  if (original === original.toUpperCase() && original.length > 1) {
    return nueva.toUpperCase();
  }
  return original[0] === original[0].toUpperCase() &&
    original[0] !== original[0].toLowerCase()
    ? nueva[0].toUpperCase() + nueva.slice(1)
    : nueva;
}

/** El determinante en masculino (ya sin su espacio): «la» → «el», etc. */
const MASCULINO = {
  la: "el",
  una: "un",
  esta: "este",
  esa: "ese",
  nuestra: "nuestro",
  propia: "propio",
  las: "los",
};

/**
 * @param {string} texto
 * @returns {string}
 */
export function sinVitrina(texto) {
  let t = texto;
  for (const [patron, nuevo] of FRASES) t = t.replace(patron, nuevo);
  t = t.replace(ES, (todo, det) => {
    const m = /(vitrinas?)$/iu.exec(todo);
    const nombre = m ? m[1] : "vitrina";
    const plural = /s$/iu.test(nombre);
    const nuevoNombre = conMayuscula(
      nombre,
      plural ? "portafolios" : "portafolio",
    );
    if (!det) return nuevoNombre;
    // Separa el determinante de su espacio: «De la », «la propia », «Las ».
    const partes = /^(de|a)(\s+)la(\s+)$/iu.exec(det);
    if (partes) {
      const contraido = partes[1].toLowerCase() === "de" ? "del" : "al";
      return `${conMayuscula(partes[1], contraido)}${partes[3]}${nuevoNombre}`;
    }
    const propia = /^la(\s+)propia(\s+)$/iu.exec(det);
    if (propia) {
      const el = conMayuscula(det.slice(0, 2), "el");
      return `${el}${propia[1]}propio${propia[2]}${nuevoNombre}`;
    }
    const simple = /^(la|una|esta|esa|nuestra|propia|las)(\s+)$/iu.exec(det);
    if (simple) {
      const masc = MASCULINO[simple[1].toLowerCase()];
      return `${conMayuscula(simple[1], masc)}${simple[2]}${nuevoNombre}`;
    }
    return todo;
  });
  t = t.replace(EN, (todo) =>
    conMayuscula(todo, /s$/iu.test(todo) ? "portfolios" : "portfolio"),
  );
  return t;
}

/**
 * La palabra nueva en cada texto de un árbol de datos, sin mutarlo ni tocar
 * las claves.
 * @template T
 * @param {T} v
 * @returns {T}
 */
export function sinVitrinaEnTodo(v) {
  if (typeof v === "string") return /** @type {T} */ (sinVitrina(v));
  if (Array.isArray(v)) return /** @type {T} */ (v.map(sinVitrinaEnTodo));
  if (v && typeof v === "object") {
    return /** @type {T} */ (
      Object.fromEntries(
        Object.entries(v).map(([k, x]) => [k, sinVitrinaEnTodo(x)]),
      )
    );
  }
  return v;
}
