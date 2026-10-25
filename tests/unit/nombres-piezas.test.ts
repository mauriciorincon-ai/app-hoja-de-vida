import { existsSync, readdirSync, readFileSync, statSync } from "node:fs";
import path from "node:path";
import { parse } from "yaml";
import { describe, expect, it } from "vitest";
import { leerFichas, chunksDePieza } from "../../scripts/fichas-al-indice.mjs";
import { conNombreDePieza } from "../../scripts/nombre-oficial.mjs";
import { getPiezas } from "@/lib/vitrina/piezas";
import { parseNombresPiezas } from "@/lib/vitrina/nombres-piezas";

/**
 * EL NOMBRE QUE EL SITIO DA A UNA PIEZA (S22, extiende el ADR-028).
 *
 * El dueño pidió quitar la palabra «Harness» de los nombres de los agentes: todos lo
 * son, y con ella el orden alfabético queda raro. La ficha es de otra casa y no se
 * edita (regla dura 2), así que el nombre se aplica al LEER la ficha. Cuatro gates:
 * el YAML no apunta a nada que no exista · el nombre llega al escaparate y al chat ·
 * ningún texto del sitio conserva el nombre viejo · el reemplazo no duplica ni muta.
 */

const RAIZ = process.cwd();
const YAML = "data/nombres-piezas.yaml";
const nombres = parse(readFileSync(path.join(RAIZ, YAML), "utf8")) as Record<
  string,
  Record<string, string>
>;

describe("data/nombres-piezas.yaml", () => {
  it("cada slug declarado tiene su ficha en content/<frente>/", () => {
    const huerfanos: string[] = [];
    for (const [frente, piezas] of Object.entries(nombres))
      for (const slug of Object.keys(piezas))
        if (
          !existsSync(
            path.join(RAIZ, "content", frente, `${slug}.ficha-tecnica.json`),
          )
        )
          huerfanos.push(`${frente}/${slug}`);
    expect(huerfanos, "un nombre para una pieza que ya no existe").toEqual([]);
  });

  it("un frente que no existe o un nombre vacío rompen con el archivo y el campo", () => {
    expect(() => parseNombresPiezas({ agente: { x: "Y" } }, YAML)).toThrowError(
      /data\/nombres-piezas\.yaml[\s\S]*agente[\s\S]*no es un frente/,
    );
    expect(() =>
      parseNombresPiezas({ agentes: { x: "  " } }, YAML),
    ).toThrowError(/agentes\.x[\s\S]*vacío/);
    expect(parseNombresPiezas(null, YAML)).toEqual({});
  });
});

describe("el nombre llega al escaparate y al chat", () => {
  it("ningún agente de la vitrina lleva «Harness» en su nombre y el orden queda alfabético", () => {
    const agentes = getPiezas("agentes");
    expect(
      agentes.map((a) => a.pieza.nombre).filter((n) => /harness/i.test(n)),
    ).toEqual([]);
    const sellados = agentes
      .filter((a) => a.pieza.estado === "sellado")
      .map((a) => a.pieza.nombre);
    expect(sellados).toContain("Paper Computacional");
    expect(sellados.indexOf("Paper Computacional")).toBeLessThan(
      sellados.indexOf("Presentaciones CINE"),
    );
  });

  it("el índice del chat llama a la pieza como la página", () => {
    const { piezas } = leerFichas();
    const ficha = piezas.find(
      (p: { frente: string; ficha: { pieza: { slug: string } } }) =>
        p.frente === "agentes" &&
        p.ficha.pieza.slug === "harness-paper-computacional",
    )!;
    expect(ficha.ficha.pieza.nombre).toBe("Paper Computacional");
    expect(chunksDePieza(ficha, "es")[0].titulo).toMatch(
      /^Agentes — Paper Computacional/,
    );
    // …y la ficha de content/ no se tocó: el alias es una lectura.
    const crudo = JSON.parse(
      readFileSync(
        path.join(
          RAIZ,
          "content/agentes/harness-paper-computacional.ficha-tecnica.json",
        ),
        "utf8",
      ),
    );
    expect(crudo.pieza.nombre).toBe("Harness Paper Computacional");
  });
});

describe("el nombre viejo no queda en ningún texto del sitio", () => {
  const CARPETAS = ["data", "src", "messages", "docs", "public"];
  const BINARIOS = /\.(png|jpe?g|webp|gif|ico|pdf|woff2?|ttf|otf|mp4|webm)$/i;
  const VIEJO =
    /Harness\s+Paper\s+Computacional|Computational\s+Paper\s+Harness\b/;
  function archivos(dir: string): string[] {
    const abs = path.join(RAIZ, dir);
    if (!existsSync(abs)) return [];
    return readdirSync(abs).flatMap((n) => {
      const rel = path.join(dir, n);
      if (statSync(path.join(RAIZ, rel)).isDirectory()) return archivos(rel);
      return BINARIOS.test(n) ||
        /^public[\\/](chat-index|piezas)[\\/.]/.test(rel)
        ? []
        : [rel];
    });
  }

  it("el barrido da 0 fuera de content/ (la ficha de la otra casa conserva el suyo)", () => {
    const halladas: string[] = [];
    for (const rel of CARPETAS.flatMap(archivos))
      readFileSync(path.join(RAIZ, rel), "utf8")
        .split("\n")
        .forEach((linea, i) => {
          if (VIEJO.test(linea))
            halladas.push(`${rel.split(path.sep).join("/")}:${i + 1}`);
        });
    expect(halladas, "el sitio llama a la pieza «Paper Computacional»").toEqual(
      [],
    );
  });
});

describe("conNombreDePieza", () => {
  const ficha = {
    pieza: { nombre: "Harness Paper Computacional", slug: "x" },
    promesa: { tagline: "El Harness Paper Computacional no inventa cifras" },
    nunca: [
      "Pasar por el Harness Paper Computacionales",
      "ver Harness Paper Computacional.",
    ],
  };

  it("cambia el nombre en cada texto y no muta la ficha original", () => {
    const antes = JSON.stringify(ficha);
    const nueva = conNombreDePieza(ficha, "Paper Computacional");
    expect(nueva.pieza.nombre).toBe("Paper Computacional");
    expect(nueva.promesa.tagline).toBe(
      "El Paper Computacional no inventa cifras",
    );
    expect(nueva.nunca[1]).toBe("ver Paper Computacional.");
    expect(JSON.stringify(ficha)).toBe(antes);
  });

  it("una palabra pegada al nombre no se toca y el mismo nombre devuelve la misma ficha", () => {
    expect(conNombreDePieza(ficha, "Paper Computacional").nunca[0]).toBe(
      "Pasar por el Harness Paper Computacionales",
    );
    expect(conNombreDePieza(ficha, "Harness Paper Computacional")).toBe(ficha);
  });
});
