import { readFileSync, readdirSync } from "node:fs";
import { describe, expect, it } from "vitest";
import {
  problemasDeAfirmacionesDeCtic,
  problemasDeCifrasRetiradasDeCtic,
  problemasDeCticExacta,
  problemasDeLiderazgoDeCtic,
} from "../../scripts/ctic-aproximadas.mjs";

/**
 * LAS CIFRAS DE CTIC, APROXIMADAS EN TODO EL SITIO (decisión del dueño, 2026-09-27).
 *
 * Lo que se barre es lo que el visitante o el chat pueden leer: los YAML que
 * arman el sitio y el corpus «a fondo» en los DOS idiomas —el inglés es donde
 * el barrido a mano del PR #57 dejó más residuos—. Las bitácoras y el manual
 * NO se barren: cuentan la conversión «42 → más de 40», y esa historia es
 * justamente la que tiene que quedar escrita.
 *
 * Demo de la regla 14 en `sprints/REV-2026-09-27-residuos-ctic-bitacora.md`.
 */

const lista = (problemas: string[]) =>
  "\n" + problemas.map((p) => `  · ${p}`).join("\n");

const leer = (archivo: string) => ({
  archivo,
  texto: readFileSync(archivo, "utf8"),
});

const archivosDelSitio = [
  ...readdirSync("data/a-fondo")
    .filter((f) => f.endsWith(".md") && f !== "README.md")
    .map((f) => `data/a-fondo/${f}`),
  ...readdirSync("data")
    .filter((f) => f.endsWith(".yaml"))
    .map((f) => `data/${f}`),
  ...readdirSync("data/fichas")
    .filter((f) => f.endsWith(".yaml") || f.endsWith(".json"))
    .map((f) => `data/fichas/${f}`),
].map(leer);

describe("cifras de la Fundación CTIC", () => {
  it("ninguna cifra interna exacta en el sitio ni en el corpus, en español ni en inglés", () => {
    const problemas = problemasDeCticExacta(archivosDelSitio);
    expect(problemas, lista(problemas)).toEqual([]);
  });
});

describe("el motor, contra textos de juguete", () => {
  const juzgar = (texto: string) =>
    problemasDeCticExacta([{ archivo: "x.md", texto }]);

  it("aprueba las formas aproximadas", () => {
    expect(
      juzgar(
        "En la Fundación CTIC: más de 40 productos analíticos, la mitad de ellos tableros de control, " +
          "unos 20 líderes de unos 15 procesos y unos 75 usuarios; más de 10 oportunidades, " +
          "the more than 40 products, some 20 leaders of some 15 processes, about 75 users.",
      ),
    ).toEqual([]);
  });

  it("no juzga los números de otras experiencias que comparten sustantivo", () => {
    expect(
      juzgar(
        "En Vesting, hasta 23 agentes vigilados; en Pichincha, 12 profesionales; en Cafam, un equipo de 20.",
      ),
    ).toEqual([]);
  });

  it("caza la cifra exacta aunque el inglés la parta en dos líneas, y nombra la línea", () => {
    const rojo = juzgar(
      "intro\nthe strategy has made it possible to identify 12\nartificial intelligence opportunities",
    );
    expect(rojo).toHaveLength(1);
    expect(rojo[0]).toContain("x.md:2");
    expect(rojo[0]).toContain("12 oportunidades");
  });

  it("caza la fila de tabla con el entero pelado en un archivo de CTIC", () => {
    const tabla =
      "Fundación CTIC\n| Analítica | productos analíticos en uso | 42 |\n| IA | iniciativas priorizadas · documentadas | 3 · 2 |";
    const rojo = juzgar(tabla);
    expect(rojo).toHaveLength(2);
    expect(rojo[0]).toContain("x.md:2");
    expect(
      juzgar(
        tabla
          .replace("| 42 |", "| más de 40 |")
          .replace("| 3 · 2 |", "| unas pocas · las primeras |"),
      ),
    ).toEqual([]);
  });

  it("caza el logro de la HOME escrito exacto", () => {
    const rojo = juzgar(
      '  - valor: 42\n    etiqueta: "productos analíticos en uso en salud"',
    );
    expect(rojo).toHaveLength(1);
    expect(rojo[0]).toContain("valor 40");
  });
});

describe("lo que el sitio todavía no puede afirmar de CTIC", () => {
  it("ninguna página ni documento declara implementada ISO/IEC 42001, en español ni en inglés", () => {
    const problemas = problemasDeAfirmacionesDeCtic(archivosDelSitio);
    expect(problemas, lista(problemas)).toEqual([]);
  });

  const juzgar = (texto: string) => problemasDeAfirmacionesDeCtic([{ archivo: "x.md", texto }]);

  it("caza las cuatro formas que el harness y el barrido encontraron, aunque vengan partidas", () => {
    expect(juzgar("la estrategia y la\n    implementación de ISO/IEC 42001.")).toHaveLength(1);
    expect(juzgar("y que formalicé implementando ISO/IEC 42001.")).toHaveLength(1);
    expect(juzgar("the\n    strategy and the ISO/IEC 42001 implementation.")).toHaveLength(1);
    const rojo = juzgar("intro\nwhich I formalized by implementing ISO/IEC 42001.");
    expect(rojo).toHaveLength(1);
    expect(rojo[0]).toContain("x.md:2");
  });

  it("aprueba la estructuración y deja en pie la descripción de cómo arranca una norma", () => {
    expect(
      juzgar(
        "la estrategia y la estructuración del sistema de gestión bajo ISO/IEC 42001. " +
          "the structuring of the ISO/IEC 42001 management system. " +
          "ISO/IEC 42001 comparte la misma estructura de alto nivel, y la implementación empieza igual. " +
          "and the implementation starts the same way.",
      ),
    ).toEqual([]);
  });
});

describe("la cifra de productos de CTIC es una sola: más de 25 (decisión del dueño, 2026-10-04)", () => {
  it("ningún «más de 40», «40+», «la mitad de ellos tableros» ni «más de 20 tableros» de CTIC", () => {
    const problemas = problemasDeCifrasRetiradasDeCtic(archivosDelSitio);
    expect(problemas, lista(problemas)).toEqual([]);
  });

  const juzgar = (texto: string) => problemasDeCifrasRetiradasDeCtic([{ archivo: "x.md", texto }]);

  it("caza la cifra vieja, sus dependientes y el logro, aunque vengan partidos", () => {
    expect(juzgar("En la Fundación CTIC, más de 40\nproductos analíticos.")).toHaveLength(1);
    expect(juzgar("more than 40 analytical products —half of them control dashboards—")).toHaveLength(2);
    expect(juzgar("incluidos más de 20 tableros de control")).toHaveLength(1);
    expect(juzgar('  - valor: 40\n    sufijo: "+"\n    etiqueta: "productos analíticos en uso en salud"')).toHaveLength(1);
    expect(juzgar('        - valor: 40\n          prefijo: "+"\n          etiqueta: "analytics products in use in Power BI"')).toHaveLength(1);
  });

  it("caza las filas de tabla retiradas en un archivo de CTIC", () => {
    const tabla =
      "Fundación CTIC\n| Analítica | productos analíticos en uso o seguimiento | más de 40 |\n| Analítica | tableros de control | más de 20 |";
    expect(juzgar(tabla)).toHaveLength(2);
  });

  it("aprueba la cifra nueva y no juzga los 40 de otras experiencias", () => {
    expect(
      juzgar(
        "más de 25 productos analíticos en Power BI, tableros de control entre ellos; " +
          "more than 25 analytics products in Power BI; −40 % en el tiempo de procesamiento; " +
          "coordinaba cerca de 40 personas; la mitad de las oportunidades evaluadas.",
      ),
    ).toEqual([]);
  });
});

describe("en CTIC el dueño lidera la estructuración, no la estrategia (decisión del dueño, 2026-10-04)", () => {
  it("ninguna página ni documento afirma liderar la estrategia, la adopción o el gobierno de la IA", () => {
    const problemas = problemasDeLiderazgoDeCtic(archivosDelSitio);
    expect(problemas, lista(problemas)).toEqual([]);
  });

  const juzgar = (texto: string) => problemasDeLiderazgoDeCtic([{ archivo: "x.md", texto }]);

  it("caza las formas vetadas en los dos idiomas, aunque vengan partidas", () => {
    expect(juzgar("Hoy lidero la adopción y el gobierno de la IA.")).toHaveLength(1);
    expect(juzgar("Desde marzo de 2025 lidero la estrategia institucional de IA.")).toHaveLength(1);
    expect(juzgar("aquí dirijo la forma en que una institución mide y decide")).toHaveLength(1);
    expect(juzgar("me resulta natural liderar la implementación de una norma")).toHaveLength(1);
    expect(juzgar("Since March 2025 I have led the institutional artificial\nintelligence strategy")).toHaveLength(1);
    expect(juzgar("into the\nleadership of the artificial intelligence strategy")).toHaveLength(1);
    expect(juzgar("Today I lead AI adoption and governance")).toHaveLength(1);
  });

  it("aprueba la estructuración y deja en paz la estrategia de datos de Vesting", () => {
    expect(
      juzgar(
        "Lidero la estructuración de la estrategia institucional de inteligencia artificial y participo en " +
          "la estructuración del sistema de gestión. I lead the structuring of the institutional AI strategy. " +
          "En Vesting lideré la estrategia de datos; at Vesting I led the data strategy.",
      ),
    ).toEqual([]);
  });
});

describe("el hueco de forma: un número de CTIC separado de su sustantivo (hallazgo del harness, 2026-10-04)", () => {
  const juzgar = (texto: string) => problemasDeCticExacta([{ archivo: "x.md", texto }]);

  it("caza «23 of them control dashboards» y sus variantes", () => {
    expect(juzgar("—23 of them control dashboards—")).toHaveLength(1);
    expect(juzgar("—23 de ellos tableros de control—")).toHaveLength(1);
  });

  it("no caza los conteos de la vitrina ni las formas aproximadas", () => {
    expect(
      juzgar("13 agentes, 7 investigaciones y 6 tableros; 33 tableros de referencia; more than 25 analytics products"),
    ).toEqual([]);
  });
});
