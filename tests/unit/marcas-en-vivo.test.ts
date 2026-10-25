import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";
import { ausenciaAfirmada, marcarRespuesta } from "../en-vivo/marcas";

/**
 * Las marcas de la pasada en vivo se prueban AQUÍ, en la CI, con textos escritos
 * a mano: la pasada llama a un proveedor real y solo corre en la máquina del
 * dueño, pero sus detectores no pueden salir sin haber visto fallar (regla 15).
 */
describe("ausenciaAfirmada", () => {
  it.each([
    ["es", "Henry nunca ha trabajado con Databricks."],
    ["es", "Henry no hizo el examen del AI-102."],
    ["es", "No tiene esa certificación."],
    ["es", "No existe evidencia de eso."],
    ["en", "He has never used Databricks."],
    ["en", "He doesn't hold that certification."],
    ["en", "That is not listed in the résumé."],
  ] as const)("[%s] «%s» afirma una ausencia", (idioma, texto) => {
    expect(ausenciaAfirmada(texto, idioma).length).toBeGreaterThan(0);
  });

  it.each([
    ["es", "Henry lideró la estrategia de datos en Vesting [2] y construyó el ecosistema en Fabric [1]."],
    ["es", "No solo diseñó los tableros: también formó al equipo [3]."],
    ["en", "Henry led the data strategy at Vesting [2] and built the platform on Fabric [1]."],
  ] as const)("[%s] «%s» no afirma ninguna", (idioma, texto) => {
    expect(ausenciaAfirmada(texto, idioma)).toEqual([]);
  });
});

describe("marcarRespuesta", () => {
  it("cuenta lo citado, separa lo inventado y ve la voz del dueño", () => {
    const m = marcarRespuesta("Construí el ecosistema [1] y lideré el equipo [2] [7].", "es", 4);
    expect(m.citadas).toEqual([1, 2]);
    expect(m.inventadas).toEqual([7]);
    expect(m.voz).toEqual(["Construí", "lideré"]);
  });

  it("ve las credenciales sin obtener cuando nadie las preguntó", () => {
    expect(marcarRespuesta("Tiene el DP-600 y no el AI-102 [1].", "es", 4).credencialesSinObtener).toEqual(["AI-102"]);
    expect(marcarRespuesta("Tiene el DP-600 [1].", "es", 4).credencialesSinObtener).toEqual([]);
  });

  it("Foundry: la forma completa va primero, o es una marca", () => {
    expect(marcarRespuesta("Usó Microsoft Foundry (antes Azure AI Foundry) y luego Foundry [1].", "es", 4).foundrySinForma).toBe(false);
    expect(marcarRespuesta("Usó Foundry [1].", "es", 4).foundrySinForma).toBe(true);
    expect(marcarRespuesta("Usó Foundry y luego Microsoft Foundry (antes Azure AI Foundry) [1].", "es", 4).foundrySinForma).toBe(true);
    expect(marcarRespuesta("No habla de plataformas [1].", "es", 4).foundrySinForma).toBe(false);
  });

  it("una respuesta limpia no trae ninguna marca", () => {
    const m = marcarRespuesta("Henry estudió Ingeniería Industrial en la Javeriana [1].", "es", 4);
    expect(m.voz).toEqual([]);
    expect(m.ausencia).toEqual([]);
    expect(m.inventadas).toEqual([]);
    expect(m.citadas).toEqual([1]);
  });
});

/** La regla 25: lo que llama a un proveedor real no corre en NINGUNA suite por defecto. */
describe("la pasada en vivo no se cuela en las suites por defecto", () => {
  const leer = (f: string) => readFileSync(f, "utf8");

  it("la config de vitest por defecto no incluye tests/en-vivo", () => {
    expect(leer("vitest.config.mts")).not.toMatch(/en-vivo|en_vivo/);
  });

  it("solo `pnpm test:en-vivo` la corre, con su config y su orden explícita", () => {
    const pkg = JSON.parse(leer("package.json")) as { scripts: Record<string, string> };
    expect(pkg.scripts["test:en-vivo"]).toContain("EN_VIVO=1");
    expect(pkg.scripts["test:en-vivo"]).toContain("vitest.vivo.config.ts");
    for (const [nombre, comando] of Object.entries(pkg.scripts)) {
      if (nombre === "test:en-vivo") continue;
      expect(comando, `el script «${nombre}» no debe llamar a la pasada en vivo`).not.toMatch(/en-vivo|vivo\.config/);
    }
  });

  it("la CI no la menciona", () => {
    expect(leer(".github/workflows/ci.yml")).not.toMatch(/en-vivo|en_vivo|vivo\.config/);
  });

  it("la config de la pasada solo incluye archivos con el prefijo en_vivo_", () => {
    expect(leer("vitest.vivo.config.ts")).toContain("tests/en-vivo/**/en_vivo_*.test.ts");
  });
});
