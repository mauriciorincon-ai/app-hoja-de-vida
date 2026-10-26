import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";
import { RESPUESTA_REHUSO } from "@/lib/ia/rehuso";
import {
  ausenciaAfirmada,
  marcarRespuesta,
  motivoAtribuido,
} from "../en-vivo/marcas";

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
    [
      "es",
      "Henry lideró la estrategia de datos en Vesting [2] y construyó el ecosistema en Fabric [1].",
    ],
    ["es", "No solo diseñó los tableros: también formó al equipo [3]."],
    [
      "en",
      "Henry led the data strategy at Vesting [2] and built the platform on Fabric [1].",
    ],
  ] as const)("[%s] «%s» no afirma ninguna", (idioma, texto) => {
    expect(ausenciaAfirmada(texto, idioma)).toEqual([]);
  });
});

/**
 * Pasada del 2026-10-25: el modelo respondió con el rehúso fijo («I can't answer
 * that from Henry's résumé…») y el marcador lo contó como «ausencia afirmada» por
 * el «can't». Es la voz del asistente, no una afirmación sobre Henry: el texto
 * fijo se descuenta antes de buscar. Una ausencia dicha DESPUÉS de él sigue marcada.
 */
describe("ausenciaAfirmada · el rehúso fijo no es una afirmación", () => {
  it.each(["es", "en"] as const)(
    "[%s] el texto fijo, solo, no marca nada",
    (idioma) => {
      expect(ausenciaAfirmada(RESPUESTA_REHUSO[idioma], idioma)).toEqual([]);
    },
  );

  it("una ausencia afirmada junto al rehúso sí se marca", () => {
    expect(
      ausenciaAfirmada(
        `${RESPUESTA_REHUSO.en} He has never used Databricks.`,
        "en",
      ),
    ).toEqual(["never"]);
    expect(
      ausenciaAfirmada(
        `${RESPUESTA_REHUSO.es} Henry nunca ha usado Databricks.`,
        "es",
      ),
    ).toEqual(["nunca"]);
  });
});

describe("marcarRespuesta", () => {
  it("cuenta lo citado, separa lo inventado y ve la voz del dueño", () => {
    const m = marcarRespuesta(
      "Construí el ecosistema [1] y lideré el equipo [2] [7].",
      "es",
      4,
    );
    expect(m.citadas).toEqual([1, 2]);
    expect(m.inventadas).toEqual([7]);
    expect(m.voz).toEqual(["Construí", "lideré"]);
  });

  it("ve las credenciales sin obtener cuando nadie las preguntó", () => {
    expect(
      marcarRespuesta("Tiene el DP-600 y no el AI-102 [1].", "es", 4)
        .credencialesSinObtener,
    ).toEqual(["AI-102"]);
    expect(
      marcarRespuesta("Tiene el DP-600 [1].", "es", 4).credencialesSinObtener,
    ).toEqual([]);
  });

  it("Foundry: la forma completa va primero, o es una marca", () => {
    expect(
      marcarRespuesta(
        "Usó Microsoft Foundry (antes Azure AI Foundry) y luego Foundry [1].",
        "es",
        4,
      ).foundrySinForma,
    ).toBe(false);
    expect(marcarRespuesta("Usó Foundry [1].", "es", 4).foundrySinForma).toBe(
      true,
    );
    expect(
      marcarRespuesta(
        "Usó Foundry y luego Microsoft Foundry (antes Azure AI Foundry) [1].",
        "es",
        4,
      ).foundrySinForma,
    ).toBe(true);
    expect(
      marcarRespuesta("No habla de plataformas [1].", "es", 4).foundrySinForma,
    ).toBe(false);
  });

  it("una respuesta limpia no trae ninguna marca", () => {
    const m = marcarRespuesta(
      "Henry estudió Ingeniería Industrial en la Javeriana [1].",
      "es",
      4,
    );
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
    const pkg = JSON.parse(leer("package.json")) as {
      scripts: Record<string, string>;
    };
    expect(pkg.scripts["test:en-vivo"]).toContain("EN_VIVO=1");
    expect(pkg.scripts["test:en-vivo"]).toContain("vitest.vivo.config.ts");
    for (const [nombre, comando] of Object.entries(pkg.scripts)) {
      if (nombre === "test:en-vivo") continue;
      expect(
        comando,
        `el script «${nombre}» no debe llamar a la pasada en vivo`,
      ).not.toMatch(/en-vivo|vivo\.config/);
    }
  });

  it("la CI no la menciona", () => {
    expect(leer(".github/workflows/ci.yml")).not.toMatch(
      /en-vivo|en_vivo|vivo\.config/,
    );
  });

  it("la config de la pasada solo incluye archivos con el prefijo en_vivo_", () => {
    expect(leer("vitest.vivo.config.ts")).toContain(
      "tests/en-vivo/**/en_vivo_*.test.ts",
    );
  });
});

/**
 * S25 (fila B.1 de la pasada del 024): «¿Por qué salió de Vesting?» salía con un motivo que el
 * corpus no da. El marcador se prueba con las frases REALES de esa pasada (deben marcarse) y con
 * lo que el corpus sí cuenta, en tercera persona (no debe marcarse): una marca que se dispara con
 * todo no avisa de nada. Es un piso: la lectura del motivo la hace quien revisa el informe.
 */
describe("motivoAtribuido · los motivos que el modelo añadió a la salida de Vesting", () => {
  it.each([
    [
      "es",
      "pues consideró que había cumplido con el objetivo de crear una plataforma de datos operativa",
    ],
    [
      "es",
      "Esta decisión le permitió consolidar y transferir su aporte a Vesting",
    ],
    ["es", "Henry salió de Vesting porque quería enfocarse en nuevos retos"],
    [
      "es",
      "con el deseo de entregar una infraestructura madura y autosuficiente",
    ],
    ["es", "Su salida se debió a que la startup ya no dependía de él"],
    ["es", "decidió dejar Vesting para explorar otras opciones"],
    [
      "en",
      "His departure was therefore driven by the desire to hand over a mature, self-sufficient data and AI infrastructure",
    ],
    [
      "en",
      "ensuring that Vesting could maintain momentum while he pursued the next phase of his career",
    ],
    [
      "en",
      "allowing him to transition to new challenges. This strategic exit reflects his focus",
    ],
    ["en", "He left Vesting because he wanted to move on"],
    ["en", "He moved on, prompted by a wish to build something new"],
  ] as const)("[%s] «%s» se marca", (idioma, texto) => {
    expect(motivoAtribuido(texto, idioma).length).toBeGreaterThan(0);
  });

  it.each([
    [
      "es",
      "Henry concluyó su etapa en Vesting en enero de 2025, después de dejar el ecosistema y el proceso documentados [4].",
    ],
    [
      "es",
      "Había establecido una plataforma de datos operativa en Microsoft Fabric y un proceso de once etapas con el que la startup podía desarrollar nuevas soluciones sin depender de él [4].",
    ],
    [
      "en",
      "Henry concluded his tenure at Vesting in January 2025 after he had built and documented the platform [1].",
    ],
    [
      "en",
      "an eleven-stage process that enabled the startup to develop new solutions consistently without relying on him [1].",
    ],
    // La marca solo se aplica donde se pide un porqué, pero estas frases corrientes de otras respuestas no deben saltar por las marcas de intención:
    [
      "es",
      "Desarrolla proyectos propios para explorar arquitecturas, agentes y sistemas RAG [2].",
    ],
    ["es", "Usa MiniSearch para buscar fragmentos del corpus [1]."],
    ["es", "La próxima fase del roadmap de Probeta DS [3]."],
    ["es", "decidió dejar de usar embeddings y recuperar por léxico [2]."],
    ["en", "He chose to focus on lexical retrieval [1]."],
    ["en", "The next step in the pipeline is the audit [2]."],
    ["en", "The schema is validated with Zod [3]."],
  ] as const)("[%s] «%s» no se marca", (idioma, texto) => {
    expect(motivoAtribuido(texto, idioma)).toEqual([]);
  });

  it.each(["es", "en"] as const)(
    "[%s] el rehúso fijo, solo, no marca nada",
    (idioma) => {
      expect(motivoAtribuido(RESPUESTA_REHUSO[idioma], idioma)).toEqual([]);
    },
  );

  it("entra en las marcas de cada respuesta, junto a la voz y la ausencia", () => {
    const m = marcarRespuesta(
      "Su salida fue por el deseo de dedicarse a otro reto [1].",
      "es",
      4,
    );
    expect(m.motivos.length).toBeGreaterThan(0);
    expect(
      marcarRespuesta(
        "Henry lideró la estrategia de datos en Vesting [1].",
        "es",
        4,
      ).motivos,
    ).toEqual([]);
  });
});
