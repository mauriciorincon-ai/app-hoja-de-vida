import { readFileSync } from "node:fs";
import path from "node:path";
import { describe, expect, it } from "vitest";
import { rutasDeDatos } from "../../scripts/destinos.mjs";

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

  it("toda app medida es un brochure (su entrada) y lleva el presupuesto del brochure; ninguna es un `/brochure` (S31)", () => {
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
    // Desde el S31 el brochure es la entrada de TODAS las apps: toda URL `/portafolio/apps/<app>` medida lo es.
    const entradas = urls.filter((u) =>
      /^\/(?:es|en)\/portafolio\/apps\/[^/]+$/.test(u),
    );
    expect(entradas.length, "Lighthouse mide alguna entrada").toBeGreaterThan(
      0,
    );
    for (const u of entradas) expect(delBrochure(aplica(u)), u).toBe(true);
    // Su `/brochure` es un 301: no se mide (Lighthouse mediría la redirección, no la página).
    expect(urls.filter((u) => u.endsWith("/brochure"))).toEqual([]);
    // Y el presupuesto del brochure no se cuela en la simulación de una app (no es un brochure).
    expect(delBrochure(aplica("/es/portafolio/apps/planlang/simulacion"))).toBe(
      false,
    );
  });
});
