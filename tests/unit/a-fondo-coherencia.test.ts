import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";
import { parse } from "yaml";
import { leerDocumentos } from "../../scripts/a-fondo.mjs";
import { buildChunks } from "../../scripts/build-chat-index.mjs";
import { leerFichas } from "../../scripts/fichas-al-indice.mjs";
import {
  conPortada,
  fixture,
  problemasDeCargosContraElSitio,
  problemasDeCifras,
  problemasDeDensidad,
  problemasDeFechas,
  problemasDeLexico,
  problemasDeNormas,
  problemasDeRepetidos,
  verdadesDelSitio,
  vocabularioConcreto,
} from "../../scripts/a-fondo-coherencia.mjs";

/**
 * LOS SEIS GATES DE COHERENCIA DEL CORPUS «A FONDO» (v2).
 *
 * Nacen de la auditoría de la reescritura del dueño (2026-09-19), que midió
 * algo incómodo: el corpus creció de 14.268 a 100.399 palabras y el buscador
 * EMPEORÓ — de 194 verdes a 36 rojos. La aduana de `a-fondo.test.ts` no podía
 * verlo porque vigila la forma; estos vigilan el fondo.
 *
 * Los seis nacen ROJOS y en el mismo commit que los introduce (regla 14), y se
 * quedan rojos durante toda la reescritura: son la lista de tareas de F2 y F3,
 * y el número de ofensores es la medida del avance. Los conteos de partida
 * están en `sprints/CONTENIDO-a-fondo-v2-bitacora.md`. Por eso cada aserción
 * imprime la LISTA ENTERA y no solo el primer ofensor: un gate que nombra uno
 * de ciento cincuenta obliga a correrlo ciento cincuenta veces.
 *
 * EL SÉPTIMO GATE QUE NO SE ESCRIBIÓ. El plan de la auditoría pedía un gate de
 * «medición del buscador»: golden al 100 %, banco con la primera fuente por
 * encima del 60 %, ajenas bloqueadas. Al preguntarle la tercera pregunta de la
 * regla 14 —¿puede fallar?— la respuesta fue que ya falla, en otro sitio:
 * `a-fondo-golden.test.ts` y `banco-de-preguntas.test.ts` afirman exactamente
 * eso y hoy están en rojo por ello. Escribirlo de nuevo habría sido decorado.
 * Lo que sí era nuevo —dejar el número por escrito en cada corte— es
 * disciplina de bitácora, no una aserción.
 */

const docs = leerDocumentos("es");
const lista = (problemas: string[]) => "\n" + problemas.map((p) => `  · ${p}`).join("\n");

/**
 * El tamaño del índice NO se puede leer de `public/chat-index.es.json`: ese
 * archivo está en `.gitignore` y en una copia limpia no existe hasta después
 * del build, que corre DESPUÉS de los tests. Así que se deriva igual que lo
 * deriva el build, construyendo los fragmentos aquí. Es la misma función.
 */
const leerYaml = (f: string) => parse(readFileSync(`data/${f}`, "utf8"));

const fragmentosDelIndice = buildChunks({
  cv: leerYaml("cv.es.yaml"),
  apps: leerYaml("apps.yaml"),
  aFondo: docs,
  locale: "es",
  fichas: leerFichas(),
}).length;

describe("coherencia del corpus a fondo", () => {
  it("hay documentos que vigilar (si no, estos seis gates no vigilan nada)", () => {
    expect(docs.length).toBeGreaterThan(0);
  });

  it("las cifras del corpus son las que el sitio publica", () => {
    // `conPortada`: el `resumen` y el `cuando_usar` son el primer fragmento que
    // el chat cita de cada documento, así que sus cifras se juzgan igual que las
    // de la prosa.
    const problemas = problemasDeCifras(conPortada(docs), fixture("cifras-a-fondo.yaml").conceptos, {
      ...verdadesDelSitio(),
      "fragmentos-indice": fragmentosDelIndice,
    });
    expect(problemas, lista(problemas)).toEqual([]);
  });

  it("el fixture de cargos no contradice los años de cv.es.yaml", () => {
    const problemas = problemasDeCargosContraElSitio(fixture("cargos-a-fondo.yaml").cargos);
    expect(problemas, lista(problemas)).toEqual([]);
  });

  it("ninguna fecha cae fuera de la permanencia en su empresa", () => {
    const problemas = problemasDeFechas(docs, fixture("cargos-a-fondo.yaml").cargos);
    expect(problemas, lista(problemas)).toEqual([]);
  });

  it("cada subsección cabe en un fragmento citable y trae un dato", () => {
    const problemas = problemasDeDensidad(docs, { vocabulario: vocabularioConcreto() });
    expect(problemas, lista(problemas)).toEqual([]);
  });

  it("cada documento dice las palabras con las que preguntan por su tema", () => {
    const problemas = problemasDeLexico(docs, fixture("lexico-a-fondo.yaml"));
    expect(problemas, lista(problemas)).toEqual([]);
  });

  /**
   * EL GEMELO INGLÉS TAMBIÉN SE TROCEA. Los otros cinco gates derivan su verdad
   * de `cv.es.yaml` y de un fixture de léxico en español, así que miran solo el
   * español. La densidad no: contar palabras y exigir un dato concreto no
   * depende del idioma, y el troceo en ventanas de 180 palabras es el mismo
   * para los dos índices. Dejarlo fuera era vigilar medio corpus.
   * (Hallazgo 2026-09-21: cuatro subsecciones inglesas llevaban meses entre 401
   * y 403 palabras sin que nada lo dijera.)
   */
  it("las subsecciones en inglés también caben en un fragmento citable", () => {
    const problemas = problemasDeDensidad(leerDocumentos("en"), {
      tope: 400,
      vocabulario: vocabularioConcreto(),
    });
    expect(problemas, lista(problemas)).toEqual([]);
  });

  it("ningún bloque de prosa vive en dos sitios a la vez", () => {
    const problemas = problemasDeRepetidos(docs);
    expect(problemas, lista(problemas)).toEqual([]);
  });

  it("las normas llevan el año que de verdad tienen", () => {
    const problemas = problemasDeNormas(docs);
    expect(problemas, lista(problemas)).toEqual([]);
  });
});

/**
 * LOS MOTORES, CONTRA DOCUMENTOS DE JUGUETE.
 *
 * El bloque de arriba mide el corpus real y hoy está entero en rojo. Eso
 * demuestra que los seis gates FALLAN, pero no que sepan APROBAR: un gate que
 * solo sabe decir que no es tan inútil como uno que solo sabe decir que sí.
 * Aquí cada motor recibe un documento limpio y uno roto, y tiene que
 * distinguirlos — con el ofensor nombrado, que es lo que se le pide a un rojo.
 */
const doc = (slug: string, subsecciones: { id: string; texto: string }[]) => ({
  slug,
  titulo: slug,
  estado: "borrador",
  ancla: "#perfil",
  archivo: `data/a-fondo/${slug}.es.md`,
  preguntas_de_prueba: ["¿a?", "¿b?"],
  subsecciones: subsecciones.map((s) => ({ ...s, titulo: s.id })),
});

const CONCEPTO_APPS = [
  { id: "apps", etiqueta: "las apps hermanas", fuente: "content/vitrina", sustantivos: ["aplicaciones", "apps"] },
];
const CARGOS = [{ empresa: "Cafam", alias: [], inicio: "2020-10", fin: "2021-06" }];

describe("los motores de coherencia, uno a uno", () => {
  it("cifras: pasa con el número correcto y nombra el incorrecto", () => {
    const verdades = { apps: 6 };
    expect(
      problemasDeCifras([doc("x", [{ id: "s", texto: "Publiqué seis aplicaciones." }])], CONCEPTO_APPS, verdades),
    ).toEqual([]);
    const rojo = problemasDeCifras(
      [doc("x", [{ id: "s", texto: "Publiqué siete aplicaciones." }])],
      CONCEPTO_APPS,
      verdades,
    );
    expect(rojo).toHaveLength(1);
    expect(rojo[0]).toContain("«siete aplicaciones»");
    expect(rojo[0]).toContain("son 6");
  });

  it("cifras: la salvedad calla la frase que no habla de lo mismo", () => {
    const conceptos = [{ ...CONCEPTO_APPS[0], salvedades: [{ frase: "de power bi", razon: "otro conteo" }] }];
    expect(
      problemasDeCifras([doc("x", [{ id: "s", texto: "Construí tres aplicaciones de Power BI." }])], conceptos, { apps: 6 }),
    ).toEqual([]);
  });

  // ─────────────────────────────────────────────────────────────────────
  // LAS CIFRAS DEL PROPIO REPOSITORIO (2026-09-21) y sus tres mecanismos.
  //
  // El rojo de nacimiento fue REAL y está en la bitácora: el corpus decía «21
  // decisiones de arquitectura» con 24 en `decisions/`. Estas pruebas son la
  // otra mitad de la regla 14 —demostrar que además sabe APROBAR— y fijan por
  // qué existe cada mecanismo, que es lo que se olvida en seis meses.
  // ─────────────────────────────────────────────────────────────────────

  it("cifras del repo: nombra la cuenta de decisiones que envejeció sola", () => {
    const adr = [
      {
        id: "decisiones-arquitectura",
        etiqueta: "las decisiones de arquitectura",
        fuente: "decisions/",
        sustantivos: ["decisiones"],
        contexto: ["de arquitectura"],
        ventana: 22,
      },
    ];
    const verdades = { "decisiones-arquitectura": 24 };
    expect(
      problemasDeCifras([doc("x", [{ id: "s", texto: "Lleva 24 decisiones de arquitectura." }])], adr, verdades),
    ).toEqual([]);
    const rojo = problemasDeCifras(
      [doc("x", [{ id: "s", texto: "Lleva 21 decisiones de arquitectura." }])],
      adr,
      verdades,
    );
    expect(rojo).toHaveLength(1);
    expect(rojo[0]).toContain("«21 decisiones»");
    // Y no se dispara con decisiones que no son las de arquitectura.
    expect(
      problemasDeCifras([doc("x", [{ id: "s", texto: "Tomé tres decisiones difíciles." }])], adr, verdades),
    ).toEqual([]);
  });

  it("cifras del repo: `contexto_previo` separa el tamaño del índice del top-k", () => {
    // El mismo sustantivo, tres órdenes de magnitud: «el índice de N fragmentos»
    // frente a «la recuperación de los cuatro fragmentos». El sujeto va DELANTE.
    const indice = [
      {
        id: "fragmentos-indice",
        etiqueta: "los fragmentos del índice",
        fuente: "el builder",
        sustantivos: ["fragmentos"],
        contexto_previo: ["indice de"],
        ventana_previa: 24,
      },
    ];
    const verdades = { "fragmentos-indice": 1437 };
    // El top-k no se juzga: no lo precede «índice de».
    expect(
      problemasDeCifras(
        [doc("x", [{ id: "s", texto: "La recuperación de los cuatro fragmentos corre en memoria." }])],
        indice,
        verdades,
      ),
    ).toEqual([]);
    // El tamaño del índice sí, y en rojo cuando es de otra época.
    const rojo = problemasDeCifras(
      [doc("x", [{ id: "s", texto: "Trabaja sobre un índice de 494 fragmentos." }])],
      indice,
      verdades,
    );
    expect(rojo).toHaveLength(1);
    expect(rojo[0]).toContain("«494 fragmentos»");
  });

  it("cifras del repo: un `hito` declarado es historia, no una afirmación sobre hoy", () => {
    const indice = [
      {
        id: "fragmentos-indice",
        etiqueta: "los fragmentos del índice",
        fuente: "el builder",
        sustantivos: ["fragmentos"],
        contexto_previo: ["indice de"],
        ventana_previa: 24,
        hitos: [{ valor: 28, razon: "el índice al nacer" }],
      },
    ];
    const verdades = { "fragmentos-indice": 1437 };
    expect(
      problemasDeCifras([doc("x", [{ id: "s", texto: "Nació con un índice de 28 fragmentos." }])], indice, verdades),
    ).toEqual([]);
    // Un número que NO está declarado como hito sigue siendo rojo.
    expect(
      problemasDeCifras([doc("x", [{ id: "s", texto: "Nació con un índice de 30 fragmentos." }])], indice, verdades),
    ).toHaveLength(1);
  });

  it("cifras del repo: la `tolerancia` evita que el gate sea circular", () => {
    // Corregir el tamaño del índice cambia el tamaño del índice. Con banda, una
    // cifra honesta del orden de magnitud pasa; una de otra época, no.
    const indice = [
      {
        id: "fragmentos-indice",
        etiqueta: "los fragmentos del índice",
        fuente: "el builder",
        sustantivos: ["fragmentos"],
        contexto_previo: ["indice de"],
        ventana_previa: 24,
        tolerancia: 0.05,
      },
    ];
    const verdades = { "fragmentos-indice": 1437 };
    expect(
      problemasDeCifras([doc("x", [{ id: "s", texto: "Hoy es un índice de 1400 fragmentos." }])], indice, verdades),
    ).toEqual([]);
    expect(
      problemasDeCifras([doc("x", [{ id: "s", texto: "Hoy es un índice de 494 fragmentos." }])], indice, verdades),
    ).toHaveLength(1);
  });

  it("cifras del repo: lee el separador de miles, o es ciego por encima de 999", () => {
    // Hallazgo del 2026-09-21, al estrenar el concepto del tamaño del índice:
    // la expresión solo capturaba tres dígitos, así que «1.437 fragmentos» se
    // leía como «437» y se reportaba como cifra desmentida. Un gate que además
    // de no ver, ve mal.
    const indice = [
      {
        id: "fragmentos-indice",
        etiqueta: "los fragmentos del índice",
        fuente: "el builder",
        sustantivos: ["fragmentos"],
        contexto_previo: ["indice de"],
        ventana_previa: 24,
      },
    ];
    expect(
      problemasDeCifras([doc("x", [{ id: "s", texto: "Un índice de 1.437 fragmentos." }])], indice, {
        "fragmentos-indice": 1437,
      }),
    ).toEqual([]);
    const rojo = problemasDeCifras(
      [doc("x", [{ id: "s", texto: "Un índice de 1.437 fragmentos." }])],
      indice,
      { "fragmentos-indice": 2000 },
    );
    expect(rojo).toHaveLength(1);
    expect(rojo[0]).toContain("«1.437 fragmentos»");
  });

  it("cifras del repo: un concepto sin verdad derivable no se queda callado", () => {
    // Un gate cuyo sujeto desaparece tiene que romper, no aprobar en silencio.
    expect(() =>
      problemasDeCifras(
        [doc("x", [{ id: "s", texto: "Lleva 24 decisiones de arquitectura." }])],
        [{ id: "inventado", etiqueta: "x", fuente: "y", sustantivos: ["decisiones"] }],
        {},
      ),
    ).toThrow(/no tiene verdad derivable/);
  });

  it("cifras: con `ventana` el contexto tiene que seguir al sustantivo, no solo estar cerca", () => {
    const ibm = [{ id: "ibm", etiqueta: "las de IBM", fuente: "cv", sustantivos: ["credenciales"], contexto: ["de ibm"], ventana: 12 }];
    expect(problemasDeCifras([doc("x", [{ id: "s", texto: "Tengo cuatro credenciales de IBM." }])], ibm, { ibm: 4 })).toEqual([]);
    expect(problemasDeCifras([doc("x", [{ id: "s", texto: "Cinco credenciales obtenidas: el DP-600 y cuatro de IBM." }])], ibm, { ibm: 4 })).toEqual([]);
    expect(problemasDeCifras([doc("x", [{ id: "s", texto: "Tengo cinco credenciales de IBM." }])], ibm, { ibm: 4 })).toHaveLength(1);
  });

  it("cifras: un concepto sin verdad derivable se planta, no pasa en silencio", () => {
    expect(() => problemasDeCifras([], CONCEPTO_APPS, {})).toThrow(/no tiene verdad derivable/);
  });

  it("fechas: acepta una fecha de dentro y nombra la de fuera", () => {
    expect(
      problemasDeFechas([doc("x", [{ id: "s", texto: "Entre octubre de 2020 y junio de 2021 trabajé en Cafam." }])], CARGOS),
    ).toEqual([]);
    const rojo = problemasDeFechas(
      [doc("x", [{ id: "s", texto: "Entre julio de 2021 y mayo de 2022 trabajé en Cafam." }])],
      CARGOS,
    );
    expect(rojo).toHaveLength(2);
    expect(rojo[0]).toContain("«julio de 2021»");
    expect(rojo[0]).toContain("Cafam");
  });

  it("fechas: la fila de una tabla «agosto 2016 – junio 2017 | Cafam» también es un rango", () => {
    expect(
      problemasDeFechas([doc("x", [{ id: "s", texto: "| octubre 2020 – junio 2021 | Analista, Cafam |" }])], CARGOS),
    ).toEqual([]);
    const rojo = problemasDeFechas([doc("x", [{ id: "s", texto: "| julio 2021 – mayo 2022 | Analista, Cafam |" }])], CARGOS);
    expect(rojo).toHaveLength(2);
    expect(rojo[0]).toContain("Cafam");
  });

  it("fechas: una mención sin rango no es una afirmación de permanencia", () => {
    expect(
      problemasDeFechas([doc("x", [{ id: "s", texto: "Lo que aprendí en Cafam lo apliqué en marzo de 2024." }])], CARGOS),
    ).toEqual([]);
  });

  it("densidad: pasa la subsección corta y con dato; nombra la larga y la seca", () => {
    expect(
      problemasDeDensidad([doc("x", [{ id: "s", texto: "Lideré un equipo de 20 personas en Cafam." }])], { vocabulario: ["Cafam"] }),
    ).toEqual([]);
    const seca = problemasDeDensidad([doc("x", [{ id: "s", texto: "Una idea sin ningún dato concreto." }])], {});
    expect(seca[0]).toContain("ni una cifra");
    const larga = problemasDeDensidad([doc("x", [{ id: "s", texto: `dato 1 ${"palabra ".repeat(500)}` }])], { tope: 400 });
    expect(larga[0]).toContain("tope 400");
  });

  it("léxico: pasa si el término está, sin tildes ni mayúsculas; si no, lo nombra", () => {
    expect(problemasDeLexico([doc("x", [{ id: "s", texto: "Modelé el proceso en BPMN." }])], { x: ["bpmn"] })).toEqual([]);
    expect(problemasDeLexico([doc("x", [{ id: "s", texto: "Modelé el proceso con notación." }])], { x: ["BPMN"] })[0]).toContain("«BPMN»");
  });

  it("léxico: una frase partida por un salto de línea sigue siendo la frase", () => {
    expect(problemasDeLexico([doc("x", [{ id: "s", texto: "Hice estudio de\ntiempos en la planta." }])], { x: ["estudio de tiempos"] })).toEqual([]);
  });

  it("léxico: un slug que no existe es un gate sin sujeto y se dice", () => {
    expect(problemasDeLexico([], { fantasma: ["algo"] })[0]).toContain("gate sin sujeto");
  });

  it("repetidos: ignora lo corto y caza el bloque que vive en dos documentos", () => {
    const frase = Array.from({ length: 30 }, (_, i) => `palabra${i}`).join(" ");
    expect(problemasDeRepetidos([doc("a", [{ id: "s", texto: "una frase corta" }]), doc("b", [{ id: "s", texto: "otra frase corta" }])])).toEqual([]);
    const rojo = problemasDeRepetidos([doc("a", [{ id: "s", texto: frase }]), doc("b", [{ id: "s", texto: frase }])]);
    expect(rojo).toHaveLength(1);
    expect(rojo[0]).toContain("a.es.md");
    expect(rojo[0]).toContain("b.es.md");
  });

  it("normas: acepta el año correcto y el sin año, y nombra el inventado", () => {
    expect(problemasDeNormas([doc("x", [{ id: "s", texto: "Implemento ISO/IEC 42001:2023 y conozco ISO 9001." }])])).toEqual([]);
    expect(problemasDeNormas([doc("x", [{ id: "s", texto: "Implemento UNE-ISO/IEC 42001:2025, la adopción española." }])])).toEqual([]);
    const rojo = problemasDeNormas([doc("x", [{ id: "s", texto: "Implemento ISO/IEC 42001:2025." }])]);
    expect(rojo[0]).toContain("«ISO/IEC 42001:2025»");
    expect(rojo[0]).toContain("es de 2023");
  });
});
