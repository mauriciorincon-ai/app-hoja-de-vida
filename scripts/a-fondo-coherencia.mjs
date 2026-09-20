/**
 * COHERENCIA DEL CORPUS «A FONDO» (v2) — los gates que nacieron de la auditoría
 * de la reescritura del dueño (2026-09-19).
 *
 * La aduana de `a-fondo.mjs` vigila la FORMA: frontmatter, ids, privacidad,
 * destino, paridad. No puede ver lo que rompió la reescritura, que fue el
 * FONDO: un conteo que el sitio desmiente, una fecha de empleo cambiada de
 * empresa, una subsección de mil palabras sin un solo dato, una palabra que
 * quien pregunta usa y el documento no dice, un párrafo que vive en tres
 * documentos, una norma con el año equivocado.
 *
 * Los seis motores de aquí son PUROS —reciben documentos y fixtures, devuelven
 * listas de problemas— y se prueban desde `tests/unit/a-fondo-coherencia.test.ts`.
 * La verdad de las cifras NO se escribe: se DERIVA del repositorio (las piezas
 * de `content/`, las credenciales de `cv.es.yaml`), igual que el catálogo de
 * destinos. Si mañana entra una pieza nueva a la vitrina, el gate se mueve
 * solo y nombra a los documentos que se quedaron con el número viejo.
 */

import { readFileSync, readdirSync, existsSync } from "node:fs";
import path from "node:path";
import process from "node:process";
import { parse } from "yaml";

const ROOT = process.cwd();

/** Sin tildes y en minúsculas: así se comparan las palabras, no los acentos. */
export function normalizar(texto) {
  return texto
    .normalize("NFD")
    .replace(/\p{Diacritic}/gu, "")
    .toLowerCase();
}

// ───────────────────────────────────────────────────────────────────────────
// CIFRAS DEL SITIO
// ───────────────────────────────────────────────────────────────────────────

/** Los números escritos con letras, que es como los escribe el corpus. */
export const NUMEROS_ES = new Map(
  Object.entries({
    un: 1, uno: 1, una: 1, dos: 2, tres: 3, cuatro: 4, cinco: 5, seis: 6,
    siete: 7, ocho: 8, nueve: 9, diez: 10, once: 11, doce: 12, trece: 13,
    catorce: 14, quince: 15, dieciseis: 16, diecisiete: 17, dieciocho: 18,
    diecinueve: 19, veinte: 20, veintiuno: 21, veintidos: 22, veintitres: 23,
    veinticuatro: 24, veinticinco: 25, veintiseis: 26, veintisiete: 27,
    veintiocho: 28, veintinueve: 29, treinta: 30, "treinta y uno": 31,
    "treinta y dos": 32, "treinta y tres": 33, "treinta y cuatro": 34,
    "treinta y cinco": 35, cuarenta: 40, "cuarenta y dos": 42,
  }),
);

const ALTERNATIVAS_NUMERO = [...NUMEROS_ES.keys()]
  .sort((a, b) => b.length - a.length)
  .join("|");

/**
 * LA VERDAD, DERIVADA. Ninguna de estas cifras se escribe a mano: salen de los
 * mismos archivos con los que se construyen las páginas.
 */
export function verdadesDelSitio() {
  const cuenta = (rel) =>
    existsSync(path.join(ROOT, rel))
      ? readdirSync(path.join(ROOT, rel)).filter((f) => f.endsWith(".json")).length
      : 0;

  const apps = cuenta("content/vitrina");
  const agentes = cuenta("content/agentes");
  const investigaciones = cuenta("content/investigaciones");
  const tableros = cuenta("content/tableros");

  const cv = parse(readFileSync(path.join(ROOT, "data/cv.es.yaml"), "utf8"));
  const certificaciones = cv.certificaciones ?? [];

  return {
    apps,
    piezas: apps + agentes + investigaciones + tableros,
    "agentes-vitrina": agentes,
    investigaciones,
    tableros,
    "credenciales-obtenidas": certificaciones.filter((c) => !c.estado).length,
    "credenciales-ibm": certificaciones.filter((c) => !c.estado && /^IBM/i.test(c.nombre)).length,
    "credenciales-en-curso": certificaciones.filter((c) => c.estado === "en curso").length,
  };
}

/**
 * Un conteo del corpus contra su verdad. El patrón de cada concepto vive en
 * `tests/fixtures/cifras-a-fondo.yaml` y es DELIBERADAMENTE estrecho: se
 * prefiere no cazar una frase a cazarla mal. Lo que el gate NO puede
 * desambiguar solo —«veintisiete agentes» de Vesting frente a los trece de la
 * vitrina— se declara en `salvedades`, con su razón escrita.
 */
export function problemasDeCifras(docs, conceptos, verdades) {
  const problemas = [];
  for (const concepto of conceptos) {
    const valor = verdades[concepto.id];
    if (valor === undefined) {
      throw new Error(
        `cifras-a-fondo.yaml: el concepto «${concepto.id}» no tiene verdad derivable. ` +
          `Añádela a verdadesDelSitio() o quita el concepto: un gate sin sujeto no vigila nada.`,
      );
    }
    const sustantivos = concepto.sustantivos.map((s) => normalizar(s)).join("|");
    const re = new RegExp(
      `\\b(\\d{1,3}|${ALTERNATIVAS_NUMERO})\\s+(?:${sustantivos})\\b`,
      "g",
    );
    const salvedades = (concepto.salvedades ?? []).map((s) => normalizar(s.frase));
    const contextos = (concepto.contexto ?? []).map((s) => normalizar(s));

    for (const doc of docs) {
      for (const sub of doc.subsecciones) {
        const texto = normalizar(sub.texto);
        for (const m of texto.matchAll(re)) {
          // El id de la subsección cuenta como contexto: «las-de-ibm» dice de qué
          // habla la subsección entera, y el autor no va a repetir «de IBM» en
          // cada frase de una subsección que se llama así.
          const vecindad =
            normalizar(sub.id).replace(/-/g, " ") +
            " " +
            texto.slice(Math.max(0, m.index - 80), m.index + 120);
          if (contextos.length && !contextos.some((c) => vecindad.includes(c))) continue;
          if (salvedades.some((s) => vecindad.includes(s))) continue;
          const dicho = /^\d+$/.test(m[1]) ? Number(m[1]) : NUMEROS_ES.get(m[1]);
          if (dicho === valor) continue;
          problemas.push(
            `${doc.archivo} · «${sub.id}»: dice «${m[0]}» y ${concepto.etiqueta} son ${valor} ` +
              `(${concepto.fuente}). Una cifra que el propio sitio desmiente es la más cara de todas: ` +
              `el visitante puede contarla.`,
          );
        }
      }
    }
  }
  return problemas;
}

// ───────────────────────────────────────────────────────────────────────────
// FECHAS DE CARGOS
// ───────────────────────────────────────────────────────────────────────────

export const MESES = new Map(
  Object.entries({
    enero: 1, febrero: 2, marzo: 3, abril: 4, mayo: 5, junio: 6, julio: 7,
    agosto: 8, septiembre: 9, setiembre: 9, octubre: 10, noviembre: 11, diciembre: 12,
  }),
);

const RE_MES_ANIO = new RegExp(
  `\\b(${[...MESES.keys()].join("|")})\\s+(?:de\\s+)?(\\d{4})\\b`,
  "g",
);

/**
 * Un rango es lo que declara una permanencia: «entre X y Y», «desde X»,
 * «hasta X», «de X a Y». El conector tiene que venir PEGADO a un mes o a un
 * año, o el gate se dispara con cualquier frase: un «de» suelto está en casi
 * todas, y «marzo de 2024» lleva uno dentro. Medido: con el «de» suelto en la
 * lista, «lo que aprendí en Cafam lo apliqué en marzo de 2024» se leía como
 * una afirmación de permanencia y salía en rojo.
 */
const RE_RANGO = new RegExp(
  `\\b(?:entre|desde|hasta|a partir de)\\s+(?:${[...MESES.keys()].join("|")}|\\d{4})\\b` +
    `|\\bde\\s+(?:${[...MESES.keys()].join("|")})\\s+(?:de\\s+)?\\d{4}\\s+a\\s+`,
  "i",
);

const aMes = (anio, mes) => anio * 12 + mes;

/**
 * Una fecha nombrada en la misma frase que una empresa tiene que caer DENTRO
 * de la permanencia en esa empresa. No se exige que sea el inicio o el fin
 * —«en diciembre de 2024, mientras estaba en Vesting» es legítimo—: se exige
 * que no esté fuera. Es la regla más floja que caza el error real, y por eso
 * casi no tiene falsos positivos.
 *
 * Solo mira frases que además declaran un rango («entre», «desde», «hasta»,
 * «de … a …»): son las que afirman una permanencia. Una mención suelta de un
 * mes junto al nombre de una empresa no es una afirmación de fechas.
 */
export function problemasDeFechas(docs, cargos) {
  const problemas = [];
  const preparados = cargos.map((c) => ({
    ...c,
    alias: [c.empresa, ...(c.alias ?? [])].map((a) => normalizar(a)),
    desde: aMes(...c.inicio.split("-").map(Number)),
    hasta: c.fin ? aMes(...c.fin.split("-").map(Number)) : Infinity,
  }));

  for (const doc of docs) {
    for (const sub of doc.subsecciones) {
      for (const frase of sub.texto.split(/(?<=[.;:])\s+|\n/)) {
        if (!RE_RANGO.test(normalizar(frase))) continue;
        const plano = normalizar(frase);
        const nombrados = preparados.filter((c) => c.alias.some((a) => plano.includes(a)));
        if (nombrados.length !== 1) continue;
        const cargo = nombrados[0];

        for (const m of plano.matchAll(RE_MES_ANIO)) {
          const punto = aMes(Number(m[2]), MESES.get(m[1]));
          if (punto >= cargo.desde && punto <= cargo.hasta) continue;
          problemas.push(
            `${doc.archivo} · «${sub.id}»: sitúa «${m[0]}» en ${cargo.empresa}, y ahí estuvo ` +
              `de ${cargo.inicio} a ${cargo.fin ?? "hoy"}. Revisa la frase: ` +
              `«${frase.trim().slice(0, 110)}…»`,
          );
        }
      }
    }
  }
  return problemas;
}

/** La verdad mensual del fixture no puede contradecir los años que publica el sitio. */
export function problemasDeCargosContraElSitio(cargos) {
  const cv = parse(readFileSync(path.join(ROOT, "data/cv.es.yaml"), "utf8"));
  const problemas = [];
  for (const cargo of cargos) {
    if (!cargo.organizacion_sitio) continue;
    const hito = (cv.trayectoria ?? []).find(
      (t) => normalizar(t.organizacion).includes(normalizar(cargo.organizacion_sitio)),
    );
    if (!hito) {
      problemas.push(
        `cargos-a-fondo.yaml: «${cargo.empresa}» dice «organizacion_sitio: ` +
          `${cargo.organizacion_sitio}» y cv.es.yaml no tiene ese hito en trayectoria.`,
      );
      continue;
    }
    const anios = [...hito.periodo.matchAll(/\d{4}/g)].map((m) => Number(m[0]));
    const desde = Number(cargo.inicio.slice(0, 4));
    const hasta = cargo.fin ? Number(cargo.fin.slice(0, 4)) : new Date().getFullYear();
    const minSitio = Math.min(...anios);
    const maxSitio = /hoy|actual|present/i.test(hito.periodo) ? hasta : Math.max(...anios);
    if (desde > maxSitio || hasta < minSitio) {
      problemas.push(
        `cargos-a-fondo.yaml: «${cargo.empresa}» va de ${cargo.inicio} a ${cargo.fin ?? "hoy"} ` +
          `y cv.es.yaml publica «${hito.periodo}». Los dos no pueden ser ciertos.`,
      );
    }
  }
  return problemas;
}

// ───────────────────────────────────────────────────────────────────────────
// DENSIDAD
// ───────────────────────────────────────────────────────────────────────────

const RE_DATO = [
  /\d/,
  /\b(?:enero|febrero|marzo|abril|mayo|junio|julio|agosto|septiembre|octubre|noviembre|diciembre)\b/i,
];

/**
 * EL VOCABULARIO CONCRETO, derivado. Las herramientas y las organizaciones que
 * el sitio ya publica: `cv.skills` (los cinco grupos), las organizaciones de
 * `cv.trayectoria` y los slugs de los proyectos. No se escribe a mano por la
 * misma razón que las cifras: si el sitio gana una skill, el gate la acepta
 * sin que nadie toque el fixture.
 */
export function vocabularioConcreto() {
  const cv = parse(readFileSync(path.join(ROOT, "data/cv.es.yaml"), "utf8"));
  const terminos = new Set();
  for (const grupo of cv.skills ?? []) {
    for (const item of grupo.items ?? []) {
      // «RAG y agentes — en construcción pública (ver showcase)» → «RAG y agentes»
      terminos.add(item.split("—")[0].trim());
    }
  }
  for (const hito of cv.trayectoria ?? []) {
    terminos.add(String(hito.organizacion).split("—")[0].trim());
  }
  for (const proyecto of cv.proyectos ?? []) {
    if (proyecto.titulo) terminos.add(proyecto.titulo);
  }
  return [...terminos].filter((t) => t.length >= 3);
}

/**
 * Una subsección es un fragmento citable: una idea CON un dato. El tope de
 * palabras no es estética — el troceo del índice parte en ~180 palabras, y una
 * subsección de mil produce seis fragmentos que compiten entre sí por la misma
 * cita y se hunden todos por la normalización de longitud del buscador.
 */
export function problemasDeDensidad(docs, { tope = 400, vocabulario = [] } = {}) {
  const problemas = [];
  const terminos = vocabulario.map((v) => normalizar(v));
  for (const doc of docs) {
    for (const sub of doc.subsecciones) {
      const palabras = sub.texto.split(/\s+/).filter(Boolean).length;
      if (palabras > tope) {
        problemas.push(
          `${doc.archivo} · «${sub.id}»: ${palabras} palabras (tope ${tope}). ` +
            `Pártela por ideas: el índice trocea en 180 y una subsección larga se hunde entera.`,
        );
      }
      const plano = normalizar(sub.texto);
      const tieneDato =
        RE_DATO.some((re) => re.test(sub.texto)) ||
        terminos.some((t) => plano.includes(t));
      if (!tieneDato) {
        problemas.push(
          `${doc.archivo} · «${sub.id}»: ni una cifra, ni una fecha, ni una herramienta, ni una ` +
            `empresa. Un fragmento sin sustantivo concreto no contesta ninguna pregunta.`,
        );
      }
    }
  }
  return problemas;
}

// ───────────────────────────────────────────────────────────────────────────
// LÉXICO OBLIGATORIO
// ───────────────────────────────────────────────────────────────────────────

/**
 * La recuperación es LÉXICA: una palabra que el corpus no dice no existe para
 * quien pregunta. Por eso cada documento declara los términos con los que
 * afuera se pregunta por su tema, y el gate exige que estén en el cuerpo.
 * El fixture sale del banco de preguntas y de `cv.skills`, no de la intuición.
 */
export function problemasDeLexico(docs, lexico) {
  const problemas = [];
  const porSlug = new Map(docs.map((d) => [d.slug, d]));
  for (const [slug, terminos] of Object.entries(lexico)) {
    const doc = porSlug.get(slug);
    if (!doc) {
      problemas.push(
        `lexico-a-fondo.yaml: declara «${slug}» y no existe data/a-fondo/${slug}.es.md. ` +
          `Un léxico sin documento es un gate sin sujeto.`,
      );
      continue;
    }
    const cuerpo = normalizar(doc.subsecciones.map((s) => s.texto).join("\n"));
    const faltan = terminos.filter((t) => !cuerpo.includes(normalizar(t)));
    if (faltan.length) {
      problemas.push(
        `${doc.archivo}: no dice ${faltan.map((t) => `«${t}»`).join(", ")}. ` +
          `Afuera se pregunta con esas palabras y el buscador es léxico: si el documento no las ` +
          `escribe, la pregunta no lo encuentra.`,
      );
    }
  }
  return problemas;
}

// ───────────────────────────────────────────────────────────────────────────
// SIN PÁRRAFOS REPETIDOS
// ───────────────────────────────────────────────────────────────────────────

/**
 * La misma doctrina vivía en tres o cuatro documentos a la vez. En un buscador
 * léxico eso no es redundancia inofensiva: los duplicados compiten entre sí por
 * el top-4 y desplazan al documento que sí tenía el dato. Un hecho, un dueño.
 */
export function problemasDeRepetidos(docs, { ventana = 25 } = {}) {
  const piezas = [];
  for (const doc of docs) {
    for (const sub of doc.subsecciones) {
      piezas.push({
        etiqueta: `${doc.archivo} · «${sub.id}»`,
        tokens: normalizar(sub.texto).replace(/[^\p{L}\p{N}\s]/gu, " ").split(/\s+/).filter(Boolean),
      });
    }
  }
  const mapa = new Map();
  piezas.forEach((pieza, p) => {
    for (let i = 0; i + ventana <= pieza.tokens.length; i++) {
      const clave = pieza.tokens.slice(i, i + ventana).join(" ");
      if (!mapa.has(clave)) mapa.set(clave, []);
      mapa.get(clave).push({ p, i });
    }
  });

  const problemas = [];
  const consumido = new Set();
  piezas.forEach((pieza, p) => {
    for (let i = 0; i + ventana <= pieza.tokens.length; i++) {
      if (consumido.has(`${p}:${i}`)) continue;
      const clave = pieza.tokens.slice(i, i + ventana).join(" ");
      const donde = mapa.get(clave);
      if (donde.length < 2) continue;
      let fin = i;
      while (
        fin + 1 + ventana <= pieza.tokens.length &&
        (mapa.get(pieza.tokens.slice(fin + 1, fin + 1 + ventana).join(" ")) ?? []).length > 1
      ) {
        fin += 1;
      }
      for (let k = i; k <= fin; k++) for (const d of mapa.get(pieza.tokens.slice(k, k + ventana).join(" ")) ?? []) consumido.add(`${d.p}:${d.i}`);
      const etiquetas = [...new Set(donde.map((d) => piezas[d.p].etiqueta))];
      const largo = fin - i + ventana;
      problemas.push(
        `${largo} palabras repetidas en ${donde.length} lugares (${etiquetas.join(" · ")}): ` +
          `«${pieza.tokens.slice(i, i + 14).join(" ")}…». Un hecho, un dueño: el resto lo cita en ` +
          `una línea y remite.`,
      );
    }
  });
  return problemas;
}

// ───────────────────────────────────────────────────────────────────────────
// NORMAS CON AÑO CORRECTO
// ───────────────────────────────────────────────────────────────────────────

/**
 * ISO/IEC 42001 se publicó en 2023. El corpus revisado escribía «:2025» en
 * ocho sitios y «:2023» en seis, a veces en el mismo documento. Un año
 * inventado en una norma es la clase de error que un auditor detecta en un
 * segundo, y el dueño lidera justo la implementación de esa norma.
 *
 * Sin año también vale: es la forma que usa el perfil del sitio y la que no
 * compromete a una edición mientras la adopción colombiana esté sin verificar.
 */
export const NORMAS = [
  { patron: /ISO(?:\/IEC)?\s*42001(?::(\d{4}))?/g, nombre: "ISO/IEC 42001", anio: "2023" },
  { patron: /ISO\s*9001(?::(\d{4}))?/g, nombre: "ISO 9001", anio: "2015" },
];

export function problemasDeNormas(docs) {
  const problemas = [];
  for (const doc of docs) {
    for (const sub of doc.subsecciones) {
      for (const norma of NORMAS) {
        for (const m of sub.texto.matchAll(new RegExp(norma.patron.source, "g"))) {
          if (!m[1] || m[1] === norma.anio) continue;
          problemas.push(
            `${doc.archivo} · «${sub.id}»: escribe «${m[0]}». ${norma.nombre} es de ${norma.anio}; ` +
              `se escribe «${norma.nombre}:${norma.anio}» o sin año, nunca con otro.`,
          );
        }
      }
    }
  }
  return problemas;
}

/** Carga un fixture YAML de tests/fixtures/. */
export function fixture(nombre) {
  return parse(readFileSync(path.join(ROOT, "tests", "fixtures", nombre), "utf8"));
}
