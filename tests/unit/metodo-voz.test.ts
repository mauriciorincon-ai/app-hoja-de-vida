import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";
import {
  hallazgosDeVoz,
  problemasDeVozEnDiccionario,
  problemasDeVozEnPieza,
  textosDelAutor,
} from "@/lib/metodo/voz-impersonal";

/**
 * LA VOZ DE «MÉTODOS» (S14). Las publicaciones no hablan en primera persona ni
 * dicen «entrevista»: el gate se prueba por los DOS lados —lo que atrapa y lo
 * que NO debe atrapar (un texto publicado con un falso positivo es peor que una
 * regresión que se escapa: «diseño» también es un sustantivo)— y después se
 * ejerce sobre lo real: la sección `metodo` del diccionario en los dos idiomas.
 * Las piezas de `data/metodo/` se barren en `metodo-voz-piezas.test.ts`.
 */

const termino = (t: string, i: "es" | "en") => hallazgosDeVoz(t, i).map((h) => h.termino);

describe("el motor: lo que atrapa", () => {
  it.each([
    ["Mi método de trabajo", ["Mi"]],
    ["Lo que yo hice", ["yo", "hice"]],
    ["Comparten conmigo nuestros datos", ["conmigo", "nuestros"]],
    ["Diseñé la plataforma y la medí en cada cambio", ["Diseñé", "medí"]],
    ["Empiezo por el recorrido y separo lo común", ["Empiezo", "separo"]],
    ["Cómo llevo un prototipo a producción", ["llevo"]],
    ["Guardo la copia y evalúo cada cambio", ["Guardo", "evalúo"]],
    ["Sé que funciona y tengo la prueba", ["Sé", "tengo"]],
    ["Mantengo el índice y presento el resultado", ["Mantengo", "presento"]],
    ["No he operado agentes en contenedor", ["he"]],
    ["Una pregunta de entrevista", ["entrevista"]],
    ["El entrevistador pregunta", ["entrevistador"]],
    // Fuera de las comillas la voz se sigue juzgando.
    ["Diseñé la respuesta «no sé»", ["Diseñé"]],
    // Una cita larga (un párrafo entero entre comillas) ya no es invisible al gate (S14-B4).
    [`Dice «${"Reparto el trabajo y guardo la copia de cada versión. ".repeat(4)}» sin más`, ["guardo", "guardo", "guardo", "guardo"]],
  ])("es: «%s»", (texto, esperados) => {
    expect(termino(texto, "es")).toEqual(esperados);
  });

  it.each([
    ["I designed the platform", ["I"]],
    ["My method, and what we built", ["My", "we"]],
    ["I’m sure our team agrees", ["I’m", "our"]],
    ["I've seen it myself", ["I've", "myself"]],
    ["Each page answers an interview question", ["interview"]],
    ["The interviewer asks", ["interviewer"]],
    ["It is up to us", ["us"]],
    ["I wrote “I don’t know” myself", ["I", "myself"]],
  ])("en: «%s»", (texto, esperados) => {
    expect(termino(texto, "en").sort()).toEqual([...esperados].sort());
  });
});

describe("el motor: lo que NO debe atrapar", () => {
  it.each([
    "El diseño de la plataforma y el uso de Spark",
    "Microsoft Fabric, memoria, permite el medio y el mismo semi-modelo",
    "Los conocimientos del equipo y el trabajo de cada documento",
    "En Vesting se diseñó la plataforma y se midió cada cambio",
    "El DP-600 se obtuvo en diciembre de 2024",
    "El costo es de US$20 al mes y el techo de US$20",
    "Cómo se debe llevar un prototipo de IA a producción",
    // Un sustantivo y un condicional que también es de tercera persona: se lee la pieza.
    "El reparto del trabajo entre especialistas se sabe de antemano",
    "La búsqueda léxica seguiría ahí y la prueba se pagaría sola",
    "Quien decide: producto, operaciones y líderes de proceso",
    // Lo citado es la voz de otro: la respuesta fija del chat, no la del autor.
    "Diez legítimas recibían «eso se me escapa» y una recibe «no sé»",
  ])("es: «%s»", (texto) => {
    expect(hallazgosDeVoz(texto, "es")).toEqual([]);
  });

  it.each([
    "AI and data platforms, i.e. the I/O layer and e.g. the cache",
    "The cost is US$20 a month; use the same measure",
    "Whoever decides reads dashboards built on the same meaning",
    "Phase 1 of the AI program",
    "The thresholds are examples of the method",
    "A legitimate question gets “I don’t know”",
  ])("en: «%s»", (texto) => {
    expect(hallazgosDeVoz(texto, "en")).toEqual([]);
  });
});

describe("lo que el autor escribe: solo los `{ es, en }`", () => {
  const pieza = {
    bloques: [
      {
        n: 4,
        nota: { es: "Quien diseñó la plataforma", en: "Who designed the platform" },
        fuentes: [{ titulo: "What we learned about our data", editor: "Microsoft Learn" }],
      },
    ],
  };

  it("el título de una fuente citada es de un tercero: no entra", () => {
    expect(textosDelAutor(pieza).map((t) => t.ruta)).toEqual(["bloques.0.nota", "bloques.0.nota"]);
    expect(problemasDeVozEnPieza("data/metodo/x.yaml", pieza)).toEqual([]);
  });

  it("un texto en primera persona rompe nombrando archivo, campo, idioma y lo que dice", () => {
    const mala = structuredClone(pieza);
    mala.bloques[0].nota = { es: "Diseñé la plataforma", en: "I designed the platform" };
    const problemas = problemasDeVozEnPieza("data/metodo/x.yaml", mala);
    expect(problemas).toHaveLength(2);
    expect(problemas[0]).toMatch(/data\/metodo\/x\.yaml: bloques\.0\.nota \(es\): voz personal «Diseñé»/);
    expect(problemas[1]).toMatch(/data\/metodo\/x\.yaml: bloques\.0\.nota \(en\): voz personal «I»/);
  });
});

describe("la sección `metodo` del diccionario es impersonal, en los dos idiomas", () => {
  for (const idioma of ["es", "en"] as const) {
    it(`messages/${idioma}.json › metodo y el nombre del menú`, () => {
      const m = JSON.parse(readFileSync(`messages/${idioma}.json`, "utf8"));
      const problemas = [
        ...problemasDeVozEnDiccionario(`messages/${idioma}.json`, m.metodo, idioma, "metodo"),
        ...problemasDeVozEnDiccionario(`messages/${idioma}.json`, m.nav.metodo, idioma, "nav.metodo"),
      ];
      expect(problemas, "\n" + problemas.join("\n")).toEqual([]);
    });
  }
});
