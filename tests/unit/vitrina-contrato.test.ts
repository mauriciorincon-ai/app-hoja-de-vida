import { readFileSync, readdirSync } from "node:fs";
import path from "node:path";
import { describe, expect, it } from "vitest";
import { brochureExportSchema, versionCompatible } from "@/lib/vitrina/schemas";

/**
 * Test del CONTRATO v1.0.0 sobre los exports REALES de `content/vitrina/`
 * (S5, regla dura 3 de la orden). Vigila FORMA, no vigencia: no puede saber si
 * un valor sigue siendo cierto — eso lo garantiza cada app midiendo al generar
 * su export.
 *
 * Las tres mutaciones que la orden exige ver fallar están abajo, cada una
 * partiendo de un export REAL: total desincronizado · métrica sin fuente ·
 * enlace colado. La demo EN VIVO (mutar el archivo real y ver el rojo del
 * build) queda registrada en `sprints/SPRINT_005-implementation-log.md`.
 */

const VITRINA_DIR = path.join(process.cwd(), "content", "vitrina");
const SUFIJO = ".brochure-export.json";

const archivos = readdirSync(VITRINA_DIR)
  .filter((f) => f.endsWith(SUFIJO))
  .sort();

function leer(archivo: string): unknown {
  return JSON.parse(readFileSync(path.join(VITRINA_DIR, archivo), "utf8"));
}

/** Copia profunda para mutar sin tocar el archivo ni contaminar otros casos. */
function clonar<T>(valor: T): T {
  return structuredClone(valor);
}

describe("contrato brochure-export v1.0.0 — los exports reales", () => {
  it("llegaron los 6 exports del portafolio", () => {
    expect(archivos).toHaveLength(6);
  });

  it.each(archivos)("%s cumple el contrato", (archivo) => {
    const result = brochureExportSchema.safeParse(leer(archivo));
    if (!result.success) {
      throw new Error(
        `${archivo} incumple el contrato:\n` +
          result.error.issues
            .map((i) => `  - ${i.path.join(".")}: ${i.message}`)
            .join("\n"),
      );
    }
    expect(result.success).toBe(true);
  });

  it.each(archivos)("%s declara una schema_version compatible", (archivo) => {
    const exp = brochureExportSchema.parse(leer(archivo));
    expect(versionCompatible(exp.schema_version)).toBe(true);
  });

  it.each(archivos)("%s no entrega ningún enlace (cero enlaces)", (archivo) => {
    const exp = brochureExportSchema.parse(leer(archivo));
    expect(exp.enlaces.produccion).toBeNull();
    expect(exp.enlaces.repositorio).toBeNull();
    // La razón es CONTENIDO: es lo que la vitrina muestra en lugar del enlace.
    expect(exp.enlaces.razon.length).toBeGreaterThan(0);
    expect(exp.enlaces.razon_repositorio.length).toBeGreaterThan(0);
  });

  it.each(archivos)("%s cuadra sus grupos con el total", (archivo) => {
    const exp = brochureExportSchema.parse(leer(archivo));
    const suma = exp.funcionalidades.grupos.reduce(
      (acc, g) => acc + g.features.length,
      0,
    );
    expect(suma).toBe(exp.funcionalidades.total);
  });

  it.each(archivos)("%s da fuente a TODAS sus métricas", (archivo) => {
    const exp = brochureExportSchema.parse(leer(archivo));
    expect(exp.metricas.length).toBeGreaterThan(0);
    for (const m of exp.metricas) {
      expect(m.fuente).toBeTruthy();
    }
  });
});

describe("el contrato RECHAZA — las 3 mutaciones de la orden", () => {
  const base = leer(archivos[0]) as Record<string, unknown>;

  it("MUTACIÓN 1 · total desincronizado ⇒ rojo", () => {
    const roto = clonar(base) as {
      funcionalidades: { total: number };
    };
    roto.funcionalidades.total = roto.funcionalidades.total + 1;

    const result = brochureExportSchema.safeParse(roto);
    expect(result.success).toBe(false);
    const mensajes = result.error!.issues.map((i) => i.message).join(" ");
    expect(mensajes).toMatch(/total declarado/);
  });

  it("MUTACIÓN 2 · métrica sin fuente ⇒ rojo", () => {
    const roto = clonar(base) as {
      metricas: Array<Record<string, unknown>>;
    };
    delete roto.metricas[0].fuente;

    const result = brochureExportSchema.safeParse(roto);
    expect(result.success).toBe(false);
    expect(result.error!.issues.some((i) => i.path.includes("fuente"))).toBe(
      true,
    );
  });

  it("MUTACIÓN 3 · enlace colado ⇒ rojo", () => {
    const roto = clonar(base) as {
      enlaces: Record<string, unknown>;
    };
    roto.enlaces.produccion = "https://ejemplo.invalid/app";

    const result = brochureExportSchema.safeParse(roto);
    expect(result.success).toBe(false);
    expect(
      result.error!.issues.some((i) => i.path.includes("produccion")),
    ).toBe(true);
  });

  it("y también rechaza un repositorio colado", () => {
    const roto = clonar(base) as { enlaces: Record<string, unknown> };
    roto.enlaces.repositorio = "https://github.invalid/org/repo";
    expect(brochureExportSchema.safeParse(roto).success).toBe(false);
  });

  it("rechaza una clave desconocida (.strict — el export no inventa campos)", () => {
    const roto = clonar(base) as Record<string, unknown>;
    roto.campo_que_no_existe = "x";
    expect(brochureExportSchema.safeParse(roto).success).toBe(false);
  });

  it("rechaza una fuente fuera del enum de cuatro", () => {
    const roto = clonar(base) as { metricas: Array<Record<string, unknown>> };
    roto.metricas[0].fuente = "me lo dijo un pajarito";
    expect(brochureExportSchema.safeParse(roto).success).toBe(false);
  });

  it("rechaza un mayor de schema distinto (campos con otro significado)", () => {
    expect(versionCompatible("2.0.0")).toBe(false);
    expect(versionCompatible("1.4.2")).toBe(true);
  });
});
