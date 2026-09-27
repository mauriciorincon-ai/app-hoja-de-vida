// @ts-check
/**
 * LAS CIFRAS DE LA FUNDACIÓN CTIC SE ESCRIBEN APROXIMADAS (decisión del dueño, 2026-09-27).
 *
 * CTIC no autorizó publicar sus cifras internas exactas. El PR #57 las pasó a
 * aproximadas en todo el sitio con un barrido por patrón, y el harness de
 * hiring encontró ese mismo día once residuos exactos —la tabla del
 * documento de CTIC entera, el logro de la HOME y varias frases del inglés,
 * que viene partido en líneas y esquivó un barrido que leía línea a línea—.
 * Un barrido a mano es una promesa; esto es el gate que la cumple.
 *
 * Qué se vigila: la cifra EXACTA junto al sustantivo que la hace de CTIC. Las
 * formas aprobadas son las de la tabla de abajo, y ninguna lleva el número
 * exacto: «más de 40», «más de 20», «un tercio», «la mitad», «unos 20»,
 * «unos 15», «una decena», «unas pocas», «las primeras», «unos 75».
 *
 * | Cifra interna                   | ES                                   | EN                                  |
 * | ------------------------------- | ------------------------------------ | ----------------------------------- |
 * | 42 productos analíticos         | más de 40 productos                  | more than 40 products               |
 * | 23 tableros                     | la mitad de ellos · más de 20        | half of them · more than 20         |
 * | 23 instrumentos (8 · 15)        | más de 20 · un tercio · el resto     | more than 20 · a third · the rest   |
 * | 12 oportunidades · 7 evaluadas  | más de 10 · la mitad                 | more than 10 · half of them         |
 * | 3 priorizadas · 2 documentadas  | unas pocas · las primeras            | a few · the first ones              |
 * | 20 líderes · 15 procesos        | unos 20 · unos 15                    | some 20 · some 15                   |
 * | 10 planes de análisis           | una decena                           | some ten                            |
 * | 75 usuarios                     | unos 75                              | some 75                             |
 *
 * Qué NO se vigila, a propósito: los números de otras experiencias que
 * comparten sustantivo —«hasta 23 agentes» de Vesting, «12 profesionales» de
 * Pichincha, «un equipo de 20» de Cafam—. Los patrones exigen el sustantivo
 * de CTIC pegado al número; se prefiere no cazar una frase a cazarla mal.
 *
 * El texto se lee con los saltos de línea como espacios (misma longitud, así
 * que el desplazamiento sigue dando la línea): el inglés del corpus está
 * partido a ~100 columnas y «identify 12\nartificial intelligence
 * opportunities» es exactamente el residuo que el barrido línea a línea no vio.
 */

/** Delante de estas palabras el número ya es aproximado. */
const APROX = String.raw`(?<!(?:unos|unas|some|about|roughly|around|cerca de|más de|more than|~)\s+)`;

/** @type {{ patron: RegExp, que: string }[]} */
export const CIFRAS_EXACTAS_DE_CTIC = [
  {
    patron: new RegExp(String.raw`${APROX}\b42\s+(?:productos|soluciones|analytic\w*|products|solutions)\b`, "gi"),
    que: "42 productos → «más de 40»",
  },
  {
    patron: /\b(?:los|the|of the)\s+42\s+(?:productos|analytic\w*|products)\b/gi,
    que: "los 42 productos → «los más de 40»",
  },
  {
    patron: /\bvalor:\s*42\s+etiqueta:\s*"(?:productos anal|analytics products)/gi,
    que: "el logro de 42 productos → valor 40 con sufijo «+»",
  },
  {
    patron: new RegExp(
      String.raw`${APROX}\b23\s+(?:a la fecha|to date|tableros|dashboards|instrumentos|instruments|institutional)\b`,
      "gi",
    ),
    que: "23 tableros o instrumentos → «más de 20»",
  },
  {
    patron: /\b(?:con|with)\s+23\s+(?:instrumentos|instruments)\b/gi,
    que: "23 instrumentos → «más de 20»",
  },
  {
    patron: new RegExp(String.raw`${APROX}\b12\s+(?:[\wáéíóú]+\s+){0,2}(?:oportunidades|opportunities)\b`, "gi"),
    que: "12 oportunidades → «más de 10»",
  },
  {
    patron: /\b7\s+(?:casos de uso|use cases)\b/gi,
    que: "7 casos evaluados → «la mitad»",
  },
  {
    patron: /\b2\s+(?:de las|of the)\s+3\s+(?:iniciativas|prioritized|initiatives)\b/gi,
    que: "2 de las 3 iniciativas → «las primeras de las priorizadas»",
  },
  {
    patron: /\b3\s+(?:iniciativas priorizadas|prioritized initiatives)\b/gi,
    que: "3 priorizadas → «unas pocas»",
  },
  {
    patron: /\b8\s+(?:son\s+|are\s+|están\s+)?(?:terminados|finished)\b/gi,
    que: "8 instrumentos terminados → «un tercio»",
  },
  {
    patron: /\b15\s+(?:son\s+|are\s+|están\s+)?(?:en construcción|under construction)\b/gi,
    que: "15 en construcción → «el resto»",
  },
  {
    patron: new RegExp(String.raw`${APROX}\b20\s+(?:líderes|leaders)\b`, "gi"),
    que: "20 líderes → «unos 20»",
  },
  {
    patron: new RegExp(
      String.raw`${APROX}\b15\s+(?:procesos|processes|administrative|administrativos)\b`,
      "gi",
    ),
    que: "15 procesos → «unos 15»",
  },
  {
    patron: new RegExp(String.raw`${APROX}\b75\s+(?:usuarios|users)\b`, "gi"),
    que: "75 usuarios → «unos 75»",
  },
  {
    patron: /\b(?:(?:los|the)\s+)?10\s+(?:planes|analysis plans)\b/gi,
    que: "10 planes → «una decena»",
  },
];

/**
 * Una fila de tabla con una métrica de CTIC cuyo valor es un entero pelado
 * («| 42 |», «| 3 · 2 |»). Solo se juzga en un archivo que habla de CTIC.
 */
const FILA_METRICA = new RegExp(
  String.raw`^\|.*(?:productos analíticos|analytical products|tableros de control|\|\s*dashboards\s*(?=\|)|líderes respaldados|leaders supported|planes de análisis|analysis plans|oportunidades identificadas|opportunities identified|casos de uso evaluados|use cases formally evaluated|iniciativas priorizadas|initiatives prioritized|instrumentos|instruments).*\|\s*(\d+(?:\s*·\s*\d+)?)\s*\|\s*$`,
  "i",
);

/**
 * @param {{ archivo: string, texto: string }[]} archivos
 * @returns {string[]} un problema por cifra exacta, con archivo y línea
 */
export function problemasDeCticExacta(archivos) {
  /** @type {string[]} */
  const problemas = [];
  for (const { archivo, texto } of archivos) {
    const plano = texto.replace(/\n/g, " ");
    const linea = (/** @type {number} */ i) => texto.slice(0, i).split("\n").length;
    for (const { patron, que } of CIFRAS_EXACTAS_DE_CTIC) {
      for (const m of plano.matchAll(new RegExp(patron.source, patron.flags))) {
        problemas.push(
          `${archivo}:${linea(m.index ?? 0)}: «${m[0].replace(/\s+/g, " ")}» — ${que}. ` +
            `Toda cifra de la Fundación CTIC se escribe aproximada: CTIC no autorizó las exactas.`,
        );
      }
    }
    if (!/CTIC/.test(texto)) continue;
    texto.split("\n").forEach((fila, i) => {
      const m = fila.match(FILA_METRICA);
      if (m) {
        problemas.push(
          `${archivo}:${i + 1}: la fila de tabla dice «${m[1]}» — toda cifra de la Fundación CTIC ` +
            `se escribe aproximada («más de 40», «unos 20 · unos 15», «unas pocas · las primeras»…).`,
        );
      }
    });
  }
  return problemas;
}
