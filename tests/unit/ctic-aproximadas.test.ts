import { readFileSync, readdirSync } from "node:fs";
import { describe, expect, it } from "vitest";
import { problemasDeCticExacta } from "../../scripts/ctic-aproximadas.mjs";

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
