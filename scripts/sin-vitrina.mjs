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
 * la palabra deja «de la portafolio». Se cambia con lo que la acompaña, todo
 * lo contiguo que sea determinante o adjetivo de uso común (`MASCULINO`):
 * «de la vitrina» → «del portafolio» · «a la vitrina» → «al portafolio» ·
 * «la / una / esta / esa / nuestra / toda la / otra / misma / única / alguna
 * vitrina» → «el / un / este / ese / nuestro / todo el / otro / mismo / único /
 * algún portafolio» · «de la propia vitrina» → «del propio portafolio» ·
 * «las vitrinas» → «los portafolios» · «las demás vitrinas» → «los demás
 * portafolios». Con «mi / su / tu» o sin determinante solo cambia el
 * sustantivo. En inglés, «showcase» → «portfolio» (sin género).
 *
 * Si tras cambiar queda una concordancia rota (`CONCORDANCIA_ROTA`: «la
 * portafolio», «el vitrina», «una de los portafolios») o hay un adjetivo entre
 * el determinante y la palabra que no se puede concordar solo («la nueva
 * vitrina»), `sinVitrina` LANZA: el build falla con la frase a la vista, y se
 * agrega a `FRASES`. Mejor un build rojo que «la nueva portafolio» publicado.
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

/**
 * Femenino → masculino de lo que va junto a «vitrina»: los determinantes y los
 * adjetivos de uso común que la preceden («la propia vitrina», «toda la
 * vitrina»). Un adjetivo fuera de esta lista no se arregla con una regla: va en
 * `FRASES`.
 */
const MASCULINO = new Map(
  Object.entries({
    la: "el",
    las: "los",
    una: "un",
    unas: "unos",
    esta: "este",
    estas: "estos",
    esa: "ese",
    esas: "esos",
    aquella: "aquel",
    aquellas: "aquellos",
    nuestra: "nuestro",
    nuestras: "nuestros",
    propia: "propio",
    propias: "propios",
    misma: "mismo",
    mismas: "mismos",
    otra: "otro",
    otras: "otros",
    única: "único",
    únicas: "únicos",
    toda: "todo",
    todas: "todos",
    alguna: "algún",
    algunas: "algunos",
    ninguna: "ningún",
    primera: "primer",
    primeras: "primeros",
    última: "último",
    últimas: "últimos",
    // Sin género: no cambian, pero dejan pasar el determinante hasta la palabra.
    demás: "demás",
    gran: "gran",
    mejor: "mejor",
    peor: "peor",
    mayor: "mayor",
    menor: "menor",
    actual: "actual",
    principal: "principal",
  }),
);

const DETERMINANTES = [...MASCULINO.keys()]
  .sort((x, y) => y.length - x.length)
  .join("|");

// Un «de» o «a» opcional, y una o más palabras de `MASCULINO`, pegadas a «vitrina».
const ES = new RegExp(
  `${PREVIO}((?:(?:de|a)\\s+)?(?:(?:${DETERMINANTES})\\s+)+)?(vitrinas?)${SIGUE}`,
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

/**
 * El determinante, ya con su concordancia: «de la propia » → «del propio »,
 * «Toda la » → «Todo el ». Conserva los espacios (y los saltos de línea) tal cual.
 * @param {string} det
 */
function concordar(det) {
  const piezas = det.match(/\S+|\s+/gu) ?? [];
  let salida = "";
  for (let i = 0; i < piezas.length; i++) {
    const pieza = piezas[i];
    const baja = pieza.toLowerCase();
    // «de la» / «a la» se contraen: «del» / «al» (el espacio que sigue a «la» se conserva).
    if (
      (baja === "de" || baja === "a") &&
      piezas[i + 2]?.toLowerCase() === "la"
    ) {
      salida += conMayuscula(pieza, baja === "de" ? "del" : "al");
      i += 2;
      continue;
    }
    const masculino = MASCULINO.get(baja);
    salida += masculino ? conMayuscula(pieza, masculino) : pieza;
  }
  return salida;
}

/**
 * Lo que puede ir entre un determinante y «vitrina» sin que la concordancia se
 * rompa, además de `MASCULINO`: palabras de función («esta en la vitrina»).
 * Cualquier otra palabra ahí («la nueva vitrina») es un adjetivo femenino que
 * `sinVitrina` no puede arreglar sola: lanza.
 */
const SIN_GENERO = new Set(
  "de del en con para por a al y o e u que como desde sin hacia hasta entre sobre ya no se es lo".split(
    " ",
  ),
);

const ADJETIVO_SIN_MAPA = new RegExp(
  `${PREVIO}(?:la|las|una|unas|esta|estas|esa|esas|aquella|aquellas|nuestra|nuestras|toda|todas|alguna|algunas|ninguna|mi|mis|tu|tus|su|sus)\\s+(\\p{L}+)\\s+vitrinas?${SIGUE}`,
  "giu",
);

/**
 * @param {string} que
 * @param {string} texto
 * @param {number} indice
 * @param {string} frase
 */
function falla(que, texto, indice, frase) {
  const contexto = texto.slice(
    Math.max(0, indice - 40),
    indice + frase.length + 40,
  );
  return new Error(
    `sinVitrina: ${que} «${frase}» en «${contexto.replace(/\s+/g, " ")}»: agrégala a FRASES (scripts/sin-vitrina.mjs) con su concordancia.`,
  );
}

/**
 * El rastro de cambiar la palabra sin su concordancia: un determinante o un
 * adjetivo femenino delante de «portafolio», uno masculino delante de
 * «vitrina», o «una de los portafolios». Es la regla de `sinVitrina` y también
 * el barrido de `tests/unit/sin-vitrina.test.ts` sobre lo que escribe esta casa.
 * @type {ReadonlyArray<RegExp>}
 */
export const CONCORDANCIA_ROTA = [
  new RegExp(
    `(?<![\\p{L}\\p{N}_])(?:${[...MASCULINO]
      .filter(([f, m]) => f !== m)
      .map(([f]) => f)
      .join("|")})\\s+portafolios?(?![\\p{L}\\p{N}_-])`,
    "giu",
  ),
  new RegExp(
    `${PREVIO}(?:el|los|un|unos|este|estos|ese|esos|aquel|aquellos|nuestro|nuestros|propio|propios|mismo|mismos|otro|otros|único|únicos|todo|todos|algún|algunos|ningún|primer|primeros|último|últimos|del|al)\\s+vitrinas?${SIGUE}`,
    "giu",
  ),
  /(?<![\p{L}\p{N}_])(?:una|unas|otra|alguna|ninguna|primera|última)\s+de\s+(?:los|estos|esos|aquellos)\s+portafolios\b/giu,
];

/**
 * @param {string} texto
 * @returns {string}
 */
export function sinVitrina(texto) {
  let t = texto;
  for (const [patron, nuevo] of FRASES) t = t.replace(patron, nuevo);
  for (const m of t.matchAll(ADJETIVO_SIN_MAPA)) {
    const medio = m[1].toLowerCase();
    if (MASCULINO.has(medio) || SIN_GENERO.has(medio)) continue;
    throw falla("adjetivo sin concordancia automática", t, m.index ?? 0, m[0]);
  }
  t = t.replace(ES, (todo, det) => {
    const m = /(vitrinas?)$/iu.exec(todo);
    const nombre = m ? m[1] : "vitrina";
    const nuevoNombre = conMayuscula(
      nombre,
      /s$/iu.test(nombre) ? "portafolios" : "portafolio",
    );
    return `${det ? concordar(det) : ""}${nuevoNombre}`;
  });
  t = t.replace(EN, (todo) =>
    conMayuscula(todo, /s$/iu.test(todo) ? "portfolios" : "portfolio"),
  );
  for (const patron of CONCORDANCIA_ROTA) {
    const roto = new RegExp(patron.source, patron.flags).exec(t);
    if (roto) throw falla("concordancia rota", t, roto.index, roto[0]);
  }
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

/**
 * Las apps cuyo propio producto se llama «vitrina» (decisión del dueño por la
 * planeadora, 2026-10-27, pedido 026): planlang tiene una pantalla que se llama
 * así —«la vitrina: siete pantallas en español e inglés, sin servidor»— y
 * leerla «portafolio» le cambia el sentido. Lo suyo (export, complemento y
 * tabla de capturas) se lee tal cual; el resto del sitio sigue diciendo
 * «portafolio». Una sola lista, usada por todos los lectores.
 * @type {ReadonlyArray<string>}
 */
export const CONSERVAN_VITRINA = ["planlang"];

/**
 * `sinVitrinaEnTodo` para lo que escribe la app `slug`: la palabra nueva,
 * salvo en las apps que conservan la suya.
 * @template T
 * @param {string} slug
 * @param {T} v
 * @returns {T}
 */
export function sinVitrinaDe(slug, v) {
  return CONSERVAN_VITRINA.includes(slug) ? v : sinVitrinaEnTodo(v);
}
