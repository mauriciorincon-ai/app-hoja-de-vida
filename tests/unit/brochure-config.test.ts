import { readdirSync, readFileSync } from "node:fs";
import path from "node:path";
import { describe, expect, it } from "vitest";
import { parse } from "yaml";
import { ACENTOS, type Contenido } from "@/lib/brochure/contenido";
import { parseConfigBrochure, SLUGS_CASA } from "@/lib/brochure/config";

/**
 * `data/brochure.yaml` (S28): el acento de cada app y si lleva «datos sintéticos». Tienen que estar
 * las doce —las diez del Portafolio, de las que `content/vitrina/` es la verdad, y las dos de la
 * casa— y el acento del contenido v2, si lo hay, no puede contradecir al de aquí.
 */

const ARCHIVO = "data/brochure.yaml";
const config = parseConfigBrochure(
  parse(readFileSync(ARCHIVO, "utf8")),
  ARCHIVO,
);
const EN_DISCO = readdirSync("content/vitrina")
  .filter((f) => f.endsWith(".brochure-export.json"))
  .map((f) => f.replace(".brochure-export.json", ""));

describe("data/brochure.yaml", () => {
  it("están las diez apps del Portafolio y las dos de la casa, ni una más ni una menos", () => {
    expect(Object.keys(config.apps).sort()).toEqual(
      [...EN_DISCO, ...SLUGS_CASA].sort(),
    );
    expect(EN_DISCO).toHaveLength(10);
  });

  it("el acento es uno de la paleta y se usan los seis (dos apps por acento)", () => {
    const usados = Object.values(config.apps).map((a) => a.acento);
    for (const a of usados) expect(ACENTOS).toContain(a);
    for (const acento of ACENTOS)
      expect(
        usados.filter((u) => u === acento),
        acento,
      ).toHaveLength(2);
  });

  it("«datos sintéticos» es verdad en las diez apps y falso solo en la casa", () => {
    for (const [slug, c] of Object.entries(config.apps))
      expect(c.datos_sinteticos, slug).toBe(
        !(SLUGS_CASA as readonly string[]).includes(slug),
      );
  });

  it("el acento del contenido v2 de cada app es el de este archivo", () => {
    for (const f of readdirSync("content/vitrina").filter((x) =>
      x.endsWith(".contenido.json"),
    )) {
      const v2 = JSON.parse(
        readFileSync(path.join("content/vitrina", f), "utf8"),
      ) as Contenido;
      expect(v2.acento, f).toBe(config.apps[v2.app]?.acento);
    }
  });
});

describe("la lectura es fail-safe", () => {
  it.each([
    [
      "un acento fuera de la paleta",
      { apps: { x: { acento: "menta", datos_sinteticos: true } } },
      /acento/,
    ],
    [
      "una clave que no existe",
      { apps: { x: { acento: "sage", datos_sinteticos: true, extra: 1 } } },
      /Unrecognized key/i,
    ],
    [
      "sin «datos_sinteticos»",
      { apps: { x: { acento: "sage" } } },
      /datos_sinteticos/,
    ],
    [
      "un slug que no es kebab-case",
      { apps: { "Mi App": { acento: "sage", datos_sinteticos: true } } },
      /apps\.Mi App/,
    ],
    ["una raíz con otra clave", { apps: {}, otra: 1 }, /Unrecognized key/i],
  ])("rompe con el archivo y el campo ante %s", (_caso, crudo, esperado) => {
    expect(() => parseConfigBrochure(crudo, "data/brochure.yaml")).toThrow(
      esperado,
    );
    expect(() => parseConfigBrochure(crudo, "data/brochure.yaml")).toThrow(
      /data\/brochure\.yaml/,
    );
  });
});
