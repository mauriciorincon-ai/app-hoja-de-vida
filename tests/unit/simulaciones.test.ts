import { existsSync, readFileSync, readdirSync } from "node:fs";
import path from "node:path";
import { parse } from "yaml";
import { describe, expect, it } from "vitest";
import { parseSimulaciones, rutaDeEntrada } from "@/lib/vitrina/simulaciones";

/**
 * LAS SIMULACIONES (2026-10-12): `data/simulaciones.yaml` contra el disco.
 * El motor es puro; aquí se le dan el mundo real (exports y archivos de
 * public/) y mundos inventados para ver cada rojo.
 */

const EXPORTS = new Set(
  readdirSync("content/vitrina")
    .filter((f) => f.endsWith(".brochure-export.json"))
    .map((f) => f.replace(".brochure-export.json", "")),
);
const MUNDO_REAL = {
  appsConExport: EXPORTS,
  existe: (ruta: string) => existsSync(path.join("public", ruta)),
};
const real = () =>
  parse(readFileSync("data/simulaciones.yaml", "utf8")) as unknown;

const una = (cambios: Record<string, unknown> = {}) => ({
  simulaciones: [
    {
      slug: "planlang",
      carpeta: "planlang",
      entrada: { es: "es.html", en: "en.html" },
      nota: { es: "Una frase.", en: "One sentence." },
      ...cambios,
    },
  ],
});
const todoExiste = { appsConExport: new Set(["planlang"]), existe: () => true };

describe("las simulaciones de las apps", () => {
  it("el YAML real valida contra los exports y los archivos de public/", () => {
    const sims = parseSimulaciones(
      real(),
      "data/simulaciones.yaml",
      MUNDO_REAL,
    );
    expect(sims.map((s) => s.slug)).toContain("planlang");
  });

  it("la ruta pública de la entrada cuelga de /piezas/<carpeta>/", () => {
    const [s] = parseSimulaciones(una(), "x", todoExiste);
    expect(rutaDeEntrada(s, "es")).toBe("/piezas/planlang/es.html");
    expect(rutaDeEntrada(s, "en")).toBe("/piezas/planlang/en.html");
  });

  it("una app sin export rompe la carga y se nombra", () => {
    expect(() =>
      parseSimulaciones(una({ slug: "fantasma" }), "x", {
        appsConExport: new Set(["planlang"]),
        existe: () => true,
      }),
    ).toThrow(/fantasma: no es una app con export/);
  });

  it("un archivo de entrada que no existe rompe la carga y se nombra", () => {
    expect(() =>
      parseSimulaciones(una(), "x", {
        appsConExport: new Set(["planlang"]),
        existe: (r) => r !== "piezas/planlang/en.html",
      }),
    ).toThrow(
      /planlang\.entrada\.en: public\/piezas\/planlang\/en\.html no existe/,
    );
  });

  it("la entrada es un .html relativo: ni carpeta suelta, ni «/» inicial, ni «..»", () => {
    for (const es of ["es", "/es.html", "../fuera.html", "es/"]) {
      expect(
        () =>
          parseSimulaciones(
            una({ entrada: { es, en: "en.html" } }),
            "x",
            todoExiste,
          ),
        es,
      ).toThrow(/entrada\.es/);
    }
  });

  it("una app no puede tener dos simulaciones", () => {
    const d = una();
    d.simulaciones.push({ ...d.simulaciones[0] });
    expect(() => parseSimulaciones(d, "x", todoExiste)).toThrow(
      /ya tiene simulación/,
    );
  });
});
