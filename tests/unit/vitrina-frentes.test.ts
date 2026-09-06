import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";
import { parse } from "yaml";
import { parseVitrina, vitrinaSchema } from "@/lib/schemas";
import {
  frentesEnPreparacion,
  getFrente,
  getFrentes,
} from "@/lib/vitrina/categorias";

/**
 * Los frentes de la vitrina (post-S5, ADR-015): `data/vitrina.yaml` es
 * contenido versionado y pasa por el mismo fail-safe que el resto — un YAML
 * que miente sobre un frente rompe el build, no la vitrina.
 */

const real = parse(readFileSync("data/vitrina.yaml", "utf8")) as {
  categorias: { id: string; estado: string }[];
};

function conCambio(
  mutar: (c: { id: string; estado: string }[]) => void,
): unknown {
  const copia = structuredClone(real);
  mutar(copia.categorias);
  return copia;
}

describe("data/vitrina.yaml — los frentes", () => {
  it("el YAML real valida y trae los cuatro frentes en orden", () => {
    const v = parseVitrina(real, "data/vitrina.yaml");
    expect(v.categorias.map((c) => c.id)).toEqual([
      "apps",
      "agentes",
      "investigaciones",
      "tableros",
    ]);
  });

  it("«apps» es obligatorio: es el único frente con fuente de piezas", () => {
    const sinApps = conCambio((cs) => cs.splice(0, 1));
    const r = vitrinaSchema.safeParse(sinApps);
    expect(r.success).toBe(false);
    expect(JSON.stringify(r.error?.issues)).toContain("falta el frente «apps»");
  });

  it("un frente sin renderizador NO puede declararse abierto (nombra al culpable)", () => {
    const tramposo = conCambio((cs) => {
      const t = cs.find((c) => c.id === "tableros");
      if (t) t.estado = "abierta";
    });
    const r = vitrinaSchema.safeParse(tramposo);
    expect(r.success).toBe(false);
    const issue = r.error?.issues[0];
    expect(issue?.path).toEqual(["categorias", 3, "estado"]);
    expect(issue?.message).toContain("«tableros» no puede estar abierta");
  });

  it("dos frentes con el mismo id rompen (serían la misma ruta)", () => {
    const repetido = conCambio((cs) => {
      cs[2].id = "agentes";
    });
    const r = vitrinaSchema.safeParse(repetido);
    expect(r.success).toBe(false);
    expect(JSON.stringify(r.error?.issues)).toContain("frente repetido");
  });

  it("un estado fuera del vocabulario honesto rompe", () => {
    const inventado = conCambio((cs) => {
      cs[1].estado = "casi-lista";
    });
    expect(vitrinaSchema.safeParse(inventado).success).toBe(false);
  });
});

describe("lib/vitrina/categorias — la cuenta de piezas", () => {
  it("«apps» cuenta los exports reales; los frentes en preparación tienen cero", () => {
    const apps = getFrente("apps");
    expect(apps?.piezas).toBe(6);
    for (const f of frentesEnPreparacion()) expect(f.piezas).toBe(0);
  });

  it("tres frentes en preparación, y «apps» no está entre ellos", () => {
    const ids = frentesEnPreparacion().map((f) => f.id);
    expect(ids).toEqual(["agentes", "investigaciones", "tableros"]);
  });

  it("el orden del portal es el del YAML", () => {
    expect(getFrentes().map((f) => f.id)).toEqual(
      real.categorias.map((c) => c.id),
    );
  });

  it("un frente que no existe es undefined, no un error", () => {
    expect(getFrente("no-existe")).toBeUndefined();
  });
});
