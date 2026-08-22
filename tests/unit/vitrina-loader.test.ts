import { describe, expect, it } from "vitest";
import {
  getFicha,
  getFichasVitrina,
  getManifestVitrina,
} from "@/lib/vitrina/loader";

/**
 * Ingesta y anclaje de la vitrina (S5). El manifest es lo que hace honesta a la
 * vitrina: muestra la versión ANCLADA de cada app, no promete tiempo real.
 */

describe("loader de la vitrina", () => {
  it("carga las 6 fichas del portafolio", () => {
    expect(getFichasVitrina()).toHaveLength(6);
  });

  it("ancla la procedencia de cada ficha (slug · fecha · versión)", () => {
    for (const { ancla } of getFichasVitrina()) {
      expect(ancla.slug).toMatch(/^[a-z0-9-]+$/);
      expect(ancla.actualizado).toMatch(/^\d{4}-\d{2}-\d{2}$/);
      expect(ancla.schemaVersion).toBe("1.0.0");
      expect(ancla.archivo).toContain(ancla.slug);
      expect(ancla.versionRepo.length).toBeGreaterThan(0);
    }
  });

  it("las selladas van primero y su fecha de sello no es null", () => {
    const manifest = getManifestVitrina();
    const selladas = manifest.filter((a) => a.estado === "sellado");
    // habla llega sellada (2026-08-08) — la orden pide mostrarlo.
    expect(selladas.length).toBeGreaterThan(0);
    expect(manifest[0].estado).toBe("sellado");
    for (const a of selladas) expect(a.selladoEn).not.toBeNull();
    for (const a of manifest.filter((x) => x.estado === "inicial")) {
      expect(a.selladoEn).toBeNull();
    }
  });

  it("el orden es estable entre llamadas (no depende del sistema de archivos)", () => {
    const a = getManifestVitrina().map((x) => x.slug);
    const b = getManifestVitrina().map((x) => x.slug);
    expect(a).toEqual(b);
  });

  it("getFicha encuentra por slug y devuelve undefined si no existe", () => {
    const ficha = getFicha("habla");
    expect(ficha?.ancla.slug).toBe("habla");
    expect(ficha?.export.app.nombre.length).toBeGreaterThan(0);
    expect(getFicha("no-existe")).toBeUndefined();
  });

  it("ninguna ficha entrega enlaces, y todas explican por qué", () => {
    for (const { export: exp } of getFichasVitrina()) {
      expect(exp.enlaces.produccion).toBeNull();
      expect(exp.enlaces.repositorio).toBeNull();
      expect(exp.enlaces.razon.length).toBeGreaterThan(0);
      expect(exp.enlaces.razon_repositorio.length).toBeGreaterThan(0);
    }
  });

  it("toda métrica de toda ficha llega con su fuente", () => {
    const fuentes = new Set<string>();
    for (const { export: exp } of getFichasVitrina()) {
      for (const m of exp.metricas) fuentes.add(m.fuente);
    }
    // Las tres que el portafolio usa hoy; el contrato admite `estimacion`.
    expect([...fuentes].sort()).toEqual(["calculada", "declarado", "medido"]);
  });
});
