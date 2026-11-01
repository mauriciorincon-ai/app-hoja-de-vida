import { readFileSync } from "node:fs";
import path from "node:path";
import { describe, expect, it } from "vitest";
import { rutasDeDatos } from "../../scripts/destinos.mjs";
import { entradasBrochure } from "../../scripts/entradas-brochure.mjs";

/**
 * LAS URL DE LIGHTHOUSE EXISTEN (Sprint 022). `lhci collect` recorre cada una
 * en la CI y una página que da 404 rompe el job: al pausar un frente, la ficha
 * que la lista seguía nombrando dejó de existir y nada lo avisaba hasta el PR.
 * Cada ruta de `lighthouse-urls.json` tiene que ser una ruta que el sitio
 * construye hoy (salen de los mismos datos que las pintan).
 */
describe("lighthouse-urls.json", () => {
  const urls: string[] = JSON.parse(
    readFileSync(path.join(process.cwd(), "lighthouse-urls.json"), "utf8"),
  );
  const rutas = rutasDeDatos() as Set<string>;

  it("no está vacía y cada URL lleva su idioma", () => {
    expect(urls.length).toBeGreaterThan(0);
    for (const u of urls) expect(u, u).toMatch(/^\/(es|en)(\/|$)/);
  });

  it("cada URL es una página que el sitio construye", () => {
    const huerfanas = urls.filter((u) => {
      const ruta = u.replace(/^\/(es|en)/, "") || "/";
      if (rutas.has(ruta)) return false;
      // La simulación de una app vive bajo la ficha de la app (ADR-029).
      const m = ruta.match(/^(\/portafolio\/apps\/[^/]+)\/simulacion$/);
      return !(m && rutas.has(m[1]));
    });
    expect(huerfanas, "URL de Lighthouse sin página").toEqual([]);
  });

  it("un brochure medido lleva el presupuesto del brochure, también en su entrada (S30)", () => {
    type Presupuesto = {
      path: string;
      resourceSizes: { resourceType: string }[];
    };
    const presupuestos: Presupuesto[] = JSON.parse(
      readFileSync(path.join(process.cwd(), "perf-budget.json"), "utf8"),
    );
    // La ruta de Lighthouse es estilo robots.txt: `*` cualquier cosa, `$` el final.
    const casa = (patron: string, url: string) =>
      new RegExp(
        `^${patron.replace(/[.+?^{}()|[\]\\]/g, "\\$&").replace(/\*/g, ".*")}`,
      ).test(url);
    // Lighthouse aplica el ÚLTIMO presupuesto cuya ruta casa.
    const aplica = (url: string) =>
      presupuestos.filter((b) => casa(b.path, url)).at(-1);
    const delBrochure = (b?: Presupuesto) =>
      !!b?.resourceSizes.some((r) => r.resourceType === "document");
    const entradas = new Set(entradasBrochure());
    const brochures = urls.filter((u) => {
      const m = u.match(
        /^\/(?:es|en)\/portafolio\/apps\/([^/]+)(\/brochure)?$/,
      );
      return !!m && (m[2] === "/brochure" || entradas.has(m[1]!));
    });
    expect(brochures.length, "Lighthouse mide algún brochure").toBeGreaterThan(
      0,
    );
    for (const u of brochures) expect(delBrochure(aplica(u)), u).toBe(true);
    // Y una ficha no hereda el del brochure.
    expect(delBrochure(aplica("/es/portafolio/apps/habla"))).toBe(false);
  });
});
