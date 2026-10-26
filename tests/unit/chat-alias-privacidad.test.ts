import { describe, expect, it } from "vitest";
import { createRetriever, TOP_K_CONTEXTO } from "@/lib/ia/retrieval";
import { chatChunkSchema, type ChatChunk } from "@/lib/ia/schemas";
import { corpusSimulado } from "../../scripts/evaluar-corpus.mjs";

/**
 * «WHAT DATA DO YOU KEEP ABOUT ME?» TRAE LA PRIVACIDAD DEL CHAT (S25, fila B.2 de
 * la pasada en vivo del 024). La pasada encontró que en inglés esa pregunta no
 * recuperaba la sección «Qué datos guarda este chat…» y el modelo rehusaba una
 * pregunta que el sitio sí sabe contestar. Causa: recuperación léxica y sin
 * raíces; el documento dice «stores» y la pregunta, «keep». El arreglo es un
 * alias de esos dos tramos (`build-chat-index.mjs`, `ALIAS_PRIVACIDAD`), solo en
 * inglés. Esta prueba fija las tres formulaciones medidas y trae su propio
 * rojo: sin el alias, ninguna de las tres trae la sección.
 */

const SECCION = "a-fondo-rag-y-el-chat-que-datos-guarda-el-chat";
const esDeLaSeccion = (id: string) =>
  id === SECCION || id.startsWith(`${SECCION}~`);

const PREGUNTAS = {
  en: [
    "What data do you keep about me?",
    "What information do you hold about me?",
    "Do you save my data?",
  ],
  es: ["¿Qué datos guardan sobre mí?", "¿Qué datos guarda el chat sobre mí?"],
} as const;

const chunksDe = (locale: "es" | "en"): ChatChunk[] =>
  corpusSimulado(locale).map((c: unknown) => chatChunkSchema.parse(c));

const sinAlias = (chunks: ChatChunk[]): ChatChunk[] =>
  chunks.map(({ alias: _alias, ...resto }) => {
    void _alias;
    return resto;
  });

const puestoDeLaSeccion = (chunks: ChatChunk[], pregunta: string) =>
  createRetriever(chunks)
    .topK(pregunta, 12)
    .findIndex((h) => esDeLaSeccion(h.chunk.id));

describe("la sección de privacidad del chat lleva su alias (solo en inglés)", () => {
  it("la sección tiene dos tramos y los dos llevan el alias; ningún otro fragmento de privacidad", () => {
    const en = chunksDe("en");
    const tramos = en.filter((c) => esDeLaSeccion(c.id));
    expect(tramos.length).toBeGreaterThanOrEqual(2);
    for (const c of tramos) expect(c.alias, c.id).toContain("keep");
    // «Datos personales» y las demás familias de privacidad NO llevan alias (llenaban el contexto):
    // las únicas secciones con alias son las que declara `chat-alias-estudios.test.ts`.
    expect(
      [
        ...new Set(
          en.filter((c) => c.alias).map((c) => c.id.replace(/~\d+$/, "")),
        ),
      ].sort(),
    ).toEqual([
      "a-fondo-rag-y-el-chat-que-datos-guarda-el-chat",
      "a-fondo-vesting-por-que-sali-y-el-puente",
      "estudios",
    ]);
  });

  it("en español no hace falta: la sección no lleva alias", () => {
    for (const c of chunksDe("es").filter((c) => esDeLaSeccion(c.id))) {
      expect(c.alias, c.id).toBeUndefined();
    }
  });
});

describe("las tres formulaciones en inglés traen la sección entre los dos primeros puestos", () => {
  const chunks = chunksDe("en");
  it.each(PREGUNTAS.en)("«%s»", (pregunta) => {
    const puesto = puestoDeLaSeccion(chunks, pregunta);
    expect(
      puesto,
      `puesto ${puesto + 1} de ${TOP_K_CONTEXTO} útiles`,
    ).toBeGreaterThanOrEqual(0);
    expect(puesto).toBeLessThanOrEqual(1);
  });

  it("su rojo: sin el alias, ninguna de las tres la trae entre los 12 primeros", () => {
    for (const pregunta of PREGUNTAS.en) {
      expect(puestoDeLaSeccion(sinAlias(chunks), pregunta), pregunta).toBe(-1);
    }
  });
});

describe("el español sigue trayéndola, con o sin alias (no se tocó)", () => {
  const chunks = chunksDe("es");
  it.each(PREGUNTAS.es)("«%s»", (pregunta) => {
    const puesto = puestoDeLaSeccion(chunks, pregunta);
    expect(puesto).toBeGreaterThanOrEqual(0);
    expect(puesto).toBeLessThan(TOP_K_CONTEXTO);
  });
});
