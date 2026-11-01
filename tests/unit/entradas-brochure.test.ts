import {
  mkdirSync,
  mkdtempSync,
  readdirSync,
  rmSync,
  writeFileSync,
} from "node:fs";
import { tmpdir } from "node:os";
import path from "node:path";
import { describe, expect, it } from "vitest";
import { entradasBrochure } from "../../scripts/entradas-brochure.mjs";
import nextConfig from "../../next.config";
import { SLUGS_CASA } from "@/lib/brochure/config";
import { getFichasVitrina } from "@/lib/vitrina/loader";

/**
 * EL BROCHURE COMO ENTRADA, APP POR APP (S30, «1b»). El interruptor es el contenido: una app abre
 * `/portafolio/apps/<app>` en su brochure cuando su v2 llegó por copia, y la casa siempre. Nadie
 * escribe la lista: se mide del disco, y el proxy la recibe del build.
 */

const conV2 = () =>
  readdirSync("content/vitrina")
    .filter((f) => f.endsWith(".contenido.json"))
    .map((f) => f.replace(".contenido.json", ""));

describe("las apps que abren en su brochure", () => {
  it("son la casa y las que tienen su contenido v2, medidas del disco", () => {
    expect(entradasBrochure()).toEqual(
      [...new Set([...SLUGS_CASA, ...conV2()])].sort(),
    );
    // La piloto ya tiene su v2: abre en su brochure.
    expect(entradasBrochure()).toContain("inmobiliaria");
  });

  it("cada una es de la casa o una app del Portafolio (un v2 suelto no inventa una app)", () => {
    const apps = new Set<string>([
      ...SLUGS_CASA,
      ...getFichasVitrina().map((f) => f.ancla.slug),
    ]);
    for (const slug of entradasBrochure())
      expect(apps.has(slug), slug).toBe(true);
  });

  it("copiar el v2 de una app la pasa; sin carpetas, nadie (raíz temporal)", () => {
    const raiz = mkdtempSync(path.join(tmpdir(), "entradas-"));
    try {
      expect(entradasBrochure(raiz)).toEqual([]);
      const vitrina = path.join(raiz, "content", "vitrina");
      mkdirSync(path.join(vitrina, "casa"), { recursive: true });
      writeFileSync(
        path.join(vitrina, "casa", "hoja-de-vida.brochure-export.json"),
        "{}",
      );
      writeFileSync(path.join(vitrina, "habla.brochure-export.json"), "{}");
      // La casa abre en su brochure aunque no tenga v2; una app con ficha, todavía no.
      expect(entradasBrochure(raiz)).toEqual(["hoja-de-vida"]);
      writeFileSync(path.join(vitrina, "habla.contenido.json"), "{}");
      expect(entradasBrochure(raiz)).toEqual(["habla", "hoja-de-vida"]);
    } finally {
      rmSync(raiz, { recursive: true, force: true });
    }
  });

  it("next.config.ts le pasa al proxy la misma lista que leen las páginas", () => {
    expect(nextConfig.env?.CV_ENTRADAS_BROCHURE).toBe(
      entradasBrochure().join(","),
    );
  });
});
