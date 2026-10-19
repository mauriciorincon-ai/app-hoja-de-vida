import { readdirSync, readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";
import { parse } from "yaml";
import { problemasDeVozEnPieza } from "@/lib/metodo/voz-impersonal";

/**
 * LAS PIEZAS DE «MÉTODOS» EN VOZ IMPERSONAL (S14). Cada archivo de
 * `data/metodo/` se barre con el motor de `voz-impersonal.ts`: ni primera
 * persona ni «entrevista» en lo que el autor escribe, en español y en inglés.
 * La evidencia nombra el proyecto («En Vesting se diseñó…») y el criterio va
 * rotulado como posición del autor. Una pieza nueva entra a esta prueba SOLA.
 * El motor se prueba por los dos lados en `metodo-voz.test.ts`.
 */

const archivos = readdirSync("data/metodo").filter((f) => f.endsWith(".yaml"));

describe("las piezas de data/metodo/ están en voz impersonal", () => {
  it("hay piezas que barrer", () => {
    expect(archivos.length).toBeGreaterThan(0);
  });

  for (const f of archivos) {
    it(`data/metodo/${f}`, () => {
      const pieza = parse(readFileSync(`data/metodo/${f}`, "utf8"));
      const problemas = problemasDeVozEnPieza(`data/metodo/${f}`, pieza);
      expect(problemas, "\n" + problemas.join("\n")).toEqual([]);
    });
  }
});
