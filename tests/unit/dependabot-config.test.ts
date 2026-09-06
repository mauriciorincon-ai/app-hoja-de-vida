import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";
import { parse } from "yaml";

/**
 * `.github/dependabot.yml` es configuración que decide qué PRs llegan y con
 * qué adentro — y ya se arrastró dos veces (PRs #10 y #14, 2026-09-05/06):
 * un mayor sin soporte metido en el lote semanal ponía rojo el PR entero y
 * bloqueaba 35 bumps sanos, semana tras semana.
 *
 * Nadie corre dependabot en local, así que la invariante se vigila AQUÍ
 * (regla 14): si alguien vuelve a dejar el grupo de npm sin `update-types`, o
 * mete `major` en él, este test lo nombra antes de que el lote se rehaga.
 */
type Grupo = { patterns?: string[]; "update-types"?: string[] };
type Entrada = {
  "package-ecosystem": string;
  "open-pull-requests-limit"?: number;
  groups?: Record<string, Grupo>;
  ignore?: { "dependency-name": string; "update-types"?: string[] }[];
};

const config = parse(readFileSync(".github/dependabot.yml", "utf8")) as {
  version: number;
  updates: Entrada[];
};

const npm = config.updates.find((u) => u["package-ecosystem"] === "npm");

describe("dependabot.yml — el lote semanal nunca arrastra un mayor (regla 17)", () => {
  it("cada ecosistema abre como máximo UN PR (techo total de dos)", () => {
    expect(config.version).toBe(2);
    expect(config.updates.length).toBeGreaterThan(0);
    for (const u of config.updates) {
      expect(u["open-pull-requests-limit"], u["package-ecosystem"]).toBe(1);
    }
  });

  it("el ecosistema npm existe y agrupa TODO en un solo lote", () => {
    expect(npm).toBeDefined();
    const grupos = Object.entries(npm?.groups ?? {});
    expect(grupos).toHaveLength(1);
    expect(grupos[0]?.[1].patterns).toEqual(["*"]);
  });

  it("el lote de npm solo lleva minor y patch — jamás major", () => {
    for (const [nombre, g] of Object.entries(npm?.groups ?? {})) {
      const tipos = g["update-types"];
      expect(
        tipos,
        `el grupo «${nombre}» no declara update-types: sin él los mayores entran al lote`,
      ).toBeDefined();
      expect(tipos, `el grupo «${nombre}» admite major`).not.toContain("major");
      expect(tipos?.slice().sort()).toEqual(["minor", "patch"]);
    }
  });

  it("los mayores sin soporte de sus plugins siguen ignorados (segunda barrera)", () => {
    const ignorados = (npm?.ignore ?? [])
      .filter((i) => i["update-types"]?.includes("version-update:semver-major"))
      .map((i) => i["dependency-name"]);
    expect(ignorados).toEqual(expect.arrayContaining(["eslint", "typescript"]));
  });
});
