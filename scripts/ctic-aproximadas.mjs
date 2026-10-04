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
 * exacto: «más de 25», «más de 20» (instrumentos), «un tercio», «la mitad»
 * (oportunidades), «unos 20», «unos 15», «una decena», «unas pocas», «las
 * primeras», «unos 75».
 *
 * EL 2026-10-04 EL DUEÑO CORRIGIÓ LA CIFRA DE PRODUCTOS. «Yo no creé 40 tableros
 * o más, yo creé 25 o más», y «para mí es una sola cifra»: en CTIC hay UNA
 * cifra de productos analíticos en Power BI, «más de 25», y los tableros no
 * llevan número propio —ni «la mitad», ni «más de 20»—, porque esas dos
 * formas se calcularon sobre el total viejo. `CIFRAS_RETIRADAS_DE_CTIC` veta
 * las formas viejas aunque sean aproximadas: no son exactas, son falsas.
 *
 * | Cifra interna                   | ES                                   | EN                                  |
 * | ------------------------------- | ------------------------------------ | ----------------------------------- |
 * | productos analíticos (Power BI) | más de 25 productos                  | more than 25 products               |
 * | tableros                        | sin cifra propia: «entre ellos»      | no figure of their own: «among them» |
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
  // EL HUECO DE FORMA (hallazgo del harness, 2026-10-04): «—23 of them control
  // dashboards—» pasó porque todos los patrones de arriba exigen el sustantivo
  // PEGADO al número. Aquí median una a cuatro palabras de enlace («of them»,
  // «de ellos», «son», «control», «analíticos»…). Las palabras de enlace son una
  // lista cerrada a propósito: con palabras libres, «7 investigaciones y 6
  // tableros» de la vitrina casaría y el gate cazaría mal.
  {
    patron: new RegExp(
      String.raw`${APROX}\b\d{1,3}\s+(?:(?:of\s+them|of\s+which|de\s+ellos|de\s+los\s+cuales|are|were|son|eran|de\s+control|control|analíticos|analytical|analytics|en\s+Power\s+BI|in\s+Power\s+BI)\s+){1,4}(?:tableros|dashboards|productos|products|soluciones|solutions)\b`,
      "gi",
    ),
    que: "un número de CTIC separado de su sustantivo («23 of them control dashboards») → sin cifra propia",
  },
];

/**
 * LAS CIFRAS QUE EL DUEÑO RETIRÓ (2026-10-04). No son exactas: son falsas. La
 * de productos pasó de «más de 40» a «más de 25», y las que se calcularon sobre
 * el total viejo —la mitad son tableros, más de 20 tableros— se fueron con él.
 * Juzgan sin lookbehind de aproximación, porque la forma vetada YA es aproximada.
 *
 * @type {{ patron: RegExp, que: string }[]}
 */
export const CIFRAS_RETIRADAS_DE_CTIC = [
  {
    patron:
      /\b(?:más\s+de|more\s+than)\s+40\s+(?:[\wáéíóú]+\s+){0,2}?(?:productos|soluciones|tableros|informes|products|solutions|dashboards|reports)\b/gi,
    que: "«más de 40 productos» → «más de 25 productos analíticos en Power BI»",
  },
  {
    patron: /[«"]\s*(?:más\s+de|more\s+than)\s+40\s*[»"]/gi,
    que: "la forma «más de 40» citada → «más de 25»",
  },
  {
    patron: /\bvalor:\s*40\s+sufijo:\s*"\+"\s+etiqueta:\s*"(?:productos anal|analytics products|tableros)/gi,
    que: "el logro de la HOME en 40+ → `valor: 25` con «+»",
  },
  {
    patron: /\bvalor:\s*40\s+prefijo:\s*"\+"\s+etiqueta:\s*"(?:productos anal|analytics products|tableros)/gi,
    que: "la cifra del caso de CTIC en +40 → `valor: 25` con prefijo «+»",
  },
  {
    patron:
      /\b(?:la\s+mitad\s+de\s+ellos(?:\s+son)?|de\s+los\s+cuales\s+la\s+mitad\s+son|half\s+of\s+them(?:\s+are)?|of\s+which\s+half\s+are)\s+(?:tableros|(?:control\s+)?dashboards)\b/gi,
    que: "«la mitad de ellos tableros» → sin cifra propia: «tableros de control entre ellos»",
  },
  {
    patron: /\b(?:más\s+de|more\s+than)\s+20\s+(?:tableros|(?:control\s+)?dashboards)\b/gi,
    que: "«más de 20 tableros» → sin cifra propia: «tableros de control entre ellos»",
  },
];

/** Filas de tabla de CTIC que el dueño retiró: la de tableros, y la de productos en 40. */
const FILA_RETIRADA = new RegExp(
  String.raw`^\|.*(?:\|\s*tableros\s+de\s+control\s*(?=\|)|\|\s*dashboards\s*(?=\|)|(?:productos\s+analíticos|analytical\s+products)[^|]*\|\s*(?:más\s+de|more\s+than)\s+40).*\|\s*$`,
  "i",
);

/**
 * @param {{ archivo: string, texto: string }[]} archivos
 * @returns {string[]} un problema por cifra retirada, con archivo y línea
 */
export function problemasDeCifrasRetiradasDeCtic(archivos) {
  /** @type {string[]} */
  const problemas = [];
  for (const { archivo, texto } of archivos) {
    const plano = texto.replace(/\n/g, " ");
    const linea = (/** @type {number} */ i) => texto.slice(0, i).split("\n").length;
    for (const { patron, que } of CIFRAS_RETIRADAS_DE_CTIC) {
      for (const m of plano.matchAll(new RegExp(patron.source, patron.flags))) {
        problemas.push(
          `${archivo}:${linea(m.index ?? 0)}: «${m[0].replace(/\s+/g, " ")}» — ${que}. ` +
            `El dueño corrigió la cifra el 2026-10-04: en CTIC hay una sola, más de 25.`,
        );
      }
    }
    if (!/CTIC/.test(texto)) continue;
    texto.split("\n").forEach((fila, i) => {
      if (FILA_RETIRADA.test(fila)) {
        problemas.push(
          `${archivo}:${i + 1}: la fila de tabla lleva una cifra retirada — en CTIC hay una sola ` +
            `fila de productos, «más de 25», y ninguna de tableros.`,
        );
      }
    });
  }
  return problemas;
}

/**
 * Una fila de tabla con una métrica de CTIC cuyo valor es un entero pelado
 * («| 42 |», «| 3 · 2 |»). Solo se juzga en un archivo que habla de CTIC.
 */
const FILA_METRICA = new RegExp(
  String.raw`^\|.*(?:productos analíticos|analytical products|tableros de control|\|\s*dashboards\s*(?=\|)|líderes respaldados|leaders supported|planes de análisis|analysis plans|oportunidades identificadas|opportunities identified|casos de uso evaluados|use cases formally evaluated|iniciativas priorizadas|initiatives prioritized|instrumentos|instruments).*\|\s*(\d+(?:\s*·\s*\d+)?)\s*\|\s*$`,
  "i",
);

/**
 * LO QUE EL SITIO TODAVÍA NO PUEDE AFIRMAR DE CTIC (hallazgo del harness, 2026-09-27).
 *
 * El corpus dice que el sistema de gestión de IA está en ESTRUCTURACIÓN y que el
 * dueño no lo declara «completamente implementado» hasta que pueda demostrarse
 * formalmente (`fundacion-ctic`, «certificacion-y-madurez»). El perfil del CV
 * decía «la implementación de ISO/IEC 42001» y el documento del chat «formalicé
 * implementando ISO/IEC 42001»: el sitio contradecía al corpus, y un
 * reclutador que lea las dos cosas se queda con la más grande.
 *
 * Se veta la implementación DE la norma como hecho, no la palabra: «la
 * implementación empieza igual: por el contexto» describe cómo arranca un
 * sistema de gestión y sigue en pie. Si el día llega y puede demostrarse, esta
 * lista se vacía con la misma decisión del dueño que lo declare.
 */
const NORMA = String.raw`(?:la\s+norma\s+|the\s+)?(?:UNE-)?ISO(?:\/IEC)?\s*42001`;

/** @type {{ patron: RegExp, que: string }[]} */
export const AFIRMACIONES_VETADAS_DE_CTIC = [
  {
    patron: new RegExp(String.raw`\bimplementaci[oó]n\s+de\s+${NORMA}`, "gi"),
    que: "«la implementación de ISO/IEC 42001» → «la estructuración del sistema de gestión bajo ISO/IEC 42001»",
  },
  {
    patron: new RegExp(String.raw`\b(?:implement[eé]|implementando|formalic[eé]\s+implementando)\s+${NORMA}`, "gi"),
    que: "«implementé ISO/IEC 42001» → «estructuro el sistema de gestión bajo ISO/IEC 42001»",
  },
  {
    patron: new RegExp(String.raw`${NORMA}\s+implementation\b`, "gi"),
    que: "«the ISO/IEC 42001 implementation» → «the structuring of the ISO/IEC 42001 management system»",
  },
  {
    patron: new RegExp(String.raw`\b(?:implemented|implementing)\s+${NORMA}`, "gi"),
    que: "«implementing ISO/IEC 42001» → «structuring the ISO/IEC 42001 management system»",
  },
];

/**
 * LIDERA LA ESTRUCTURACIÓN, NO LA ESTRATEGIA (decisión del dueño, 2026-10-04).
 *
 * «No que yo lidero toda la estrategia de IA en CTIC, sino liderar la
 * estructuración…». Su LinkedIn separa dos cosas: LIDERA la estructuración de
 * la estrategia institucional de IA, y PARTICIPA en la estructuración del
 * sistema de gestión. Se vetan las formas que afirman liderar o dirigir la
 * estrategia misma, la adopción, el gobierno o la implementación de una norma.
 * La forma aprobada —«lidero la estructuración de la estrategia»— no casa
 * porque entre el verbo y «estrategia» está «la estructuración de». La
 * estrategia de DATOS de Vesting (su cargo allí era Líder de Estrategia de
 * Datos) queda fuera a propósito.
 */
const SIN_DATOS = String.raw`(?!\s+de\s+datos)(?!\s+(?:and|y)\s+(?:the\s+|la\s+)?(?:data|datos))`;

/** @type {{ patron: RegExp, que: string }[]} */
export const LIDERAZGO_VETADO_DE_CTIC = [
  {
    patron: new RegExp(
      String.raw`\b(?:lidero|lideré|liderar|liderando|lidera|lideraba)\s+(?:actualmente\s+|además\s+|hoy\s+|Henry\s+)?(?:en\s+la\s+Fundación\s+CTIC\s+)?(?:la|una)\s+estrategia${SIN_DATOS}\b`,
      "gi",
    ),
    que: "«lidero la estrategia» → «lidero la estructuración de la estrategia»",
  },
  {
    patron: /\bliderazgo\s+de\s+la\s+estrategia\b/gi,
    que: "«el liderazgo de la estrategia» → «la estructuración de la estrategia»",
  },
  {
    patron: /\blider(?:o|é|ar|ando)\s+la\s+adopción\s+y\s+el\s+gobierno\b/gi,
    que: "«lidero la adopción y el gobierno de la IA» → «lidero la estructuración de la estrategia»",
  },
  {
    patron: /\b(?:dirijo|liderar|lidero)\s+la\s+forma\s+en\s+que\s+una\s+institución\b/gi,
    que: "«dirijo la forma en que una institución adopta la IA» → «lidero la estructuración…»",
  },
  {
    patron: /\blider(?:o|é|ar|ando)\s+la\s+implementación\s+de\s+(?:una|la)\s+norma\b/gi,
    que: "«liderar la implementación de una norma» → «liderar la estructuración de un sistema de gestión»",
  },
  {
    patron: new RegExp(
      String.raw`\b(?:I\s+)?(?:lead|led|leading|leads|have\s+led)\s+(?:currently\s+)?(?:at\s+Fundación\s+CTIC\s+)?(?:the|an|a)\s+(?:institutional\s+)?(?:artificial\s+intelligence\s+|AI\s+)?strategy\b`,
      "gi",
    ),
    que: "«I lead the AI strategy» → «I lead the structuring of the AI strategy»",
  },
  {
    patron: /\b(?:How\s+does\s+Henry|Henry)\s+lead\s+the\b/gi,
    que: "«How does Henry lead the strategy» → sin presuponer el liderazgo",
  },
  {
    patron: /\bleadership\s+of\s+the\s+(?:AI\s+|artificial\s+intelligence\s+)?strategy\b/gi,
    que: "«the leadership of the AI strategy» → «the structuring of the AI strategy»",
  },
  {
    patron: /\b(?:I\s+)?lead\s+AI\s+adoption\b/gi,
    que: "«I lead AI adoption and governance» → «I lead the structuring of the AI strategy»",
  },
  {
    patron: /\b(?:I\s+direct|leading|lead)\s+the\s+way\s+(?:an|a)\s+(?:health\s+)?institution\b/gi,
    que: "«I direct the way an institution adopts AI» → «I lead the structuring…»",
  },
  {
    patron: /\blead(?:ing)?\s+the\s+implementation\s+of\s+a\s+standard\b/gi,
    que: "«lead the implementation of a standard» → «lead the structuring of a management system»",
  },
];

/**
 * @param {{ archivo: string, texto: string }[]} archivos
 * @returns {string[]} un problema por forma de liderazgo vetada, con archivo y línea
 */
export function problemasDeLiderazgoDeCtic(archivos) {
  /** @type {string[]} */
  const problemas = [];
  for (const { archivo, texto } of archivos) {
    const plano = texto.replace(/\n/g, " ");
    for (const { patron, que } of LIDERAZGO_VETADO_DE_CTIC) {
      for (const m of plano.matchAll(new RegExp(patron.source, patron.flags))) {
        const linea = texto.slice(0, m.index ?? 0).split("\n").length;
        problemas.push(
          `${archivo}:${linea}: «${m[0].replace(/\s+/g, " ")}» — ${que}. En CTIC el dueño lidera la ` +
            `estructuración de la estrategia y participa en la del sistema de gestión.`,
        );
      }
    }
  }
  return problemas;
}

/**
 * @param {{ archivo: string, texto: string }[]} archivos
 * @returns {string[]} un problema por afirmación vetada, con archivo y línea
 */
export function problemasDeAfirmacionesDeCtic(archivos) {
  /** @type {string[]} */
  const problemas = [];
  for (const { archivo, texto } of archivos) {
    const plano = texto.replace(/\n/g, " ");
    for (const { patron, que } of AFIRMACIONES_VETADAS_DE_CTIC) {
      for (const m of plano.matchAll(new RegExp(patron.source, patron.flags))) {
        const linea = texto.slice(0, m.index ?? 0).split("\n").length;
        problemas.push(
          `${archivo}:${linea}: «${m[0].replace(/\s+/g, " ")}» — ${que}. El sistema de gestión de ` +
            `IA de CTIC está en estructuración y no se declara implementado hasta poder demostrarlo.`,
        );
      }
    }
  }
  return problemas;
}

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
