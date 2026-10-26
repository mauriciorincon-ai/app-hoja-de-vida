import { describe, expect, it } from "vitest";
import { createRetriever, TOP_K_CONTEXTO } from "@/lib/ia/retrieval";
import { chatChunkSchema, type ChatChunk } from "@/lib/ia/schemas";
import { corpusSimulado } from "../../scripts/evaluar-corpus.mjs";

/**
 * LA PREGUNTA POR LA SALIDA DE VESTING TRAE SU SECCIÓN (S25). El dueño cambió el
 * título de esa sección, que prometía un «por qué», a «Cómo cerré mi etapa en
 * Vesting…» (decisión 10a: el título prometía un motivo que el párrafo no da). El
 * título viejo era lo que llevaba la pregunta «¿por qué salió?» al fragmento: con el
 * nuevo, «Why did he leave Vesting?» lo dejaba fuera de los 14 primeros y el modelo
 * contestaba con otras fuentes. La recuperación es léxica y sin raíces: el alias
 * (`build-chat-index.mjs`, `ALIAS_DE_SECCION`) le devuelve las palabras con que se
 * pregunta por la salida. Trae su rojo: sin el alias, «Why did he leave Vesting?» no
 * la trae entre los cuatro que van al modelo.
 */

const SECCION = "a-fondo-vesting-por-que-sali-y-el-puente";
const esDeLaSeccion = (id: string) =>
  id === SECCION || id.startsWith(`${SECCION}~`);

const PREGUNTAS = {
  en: [
    "Why did he leave Vesting?",
    "When did he leave Vesting?",
    "Why did Henry quit Vesting?",
  ],
  es: [
    "¿Por qué salió de Vesting?",
    "¿Cuándo salió de Vesting?",
    "¿Por qué dejó Vesting?",
  ],
} as const;

const chunksDe = (locale: "es" | "en"): ChatChunk[] =>
  corpusSimulado(locale).map((c: unknown) => chatChunkSchema.parse(c));

const sinAliasDeLaSeccion = (chunks: ChatChunk[]): ChatChunk[] =>
  chunks.map(({ alias, ...resto }) =>
    esDeLaSeccion(resto.id) || !alias ? resto : { ...resto, alias },
  );

const puesto = (chunks: ChatChunk[], pregunta: string) =>
  createRetriever(chunks)
    .topK(pregunta, TOP_K_CONTEXTO)
    .findIndex((h) => esDeLaSeccion(h.chunk.id));

for (const locale of ["es", "en"] as const) {
  describe(`[${locale}] la salida de Vesting trae su sección entre las que van al modelo`, () => {
    const chunks = chunksDe(locale);
    it("la sección lleva el alias y ningún otro fragmento de Vesting lo lleva", () => {
      const conAlias = chunks.filter((c) => c.alias && esDeLaSeccion(c.id));
      expect(conAlias.length).toBeGreaterThanOrEqual(1);
      expect(
        chunks.filter(
          (c) => c.alias && c.id.includes("vesting") && !esDeLaSeccion(c.id),
        ),
      ).toEqual([]);
    });
    it.each(PREGUNTAS[locale])("«%s»: la sección va primera", (pregunta) => {
      expect(puesto(chunks, pregunta)).toBe(0);
    });
  });
}

describe("su rojo: sin el alias, la pregunta en inglés no la trae", () => {
  it("«Why did he leave Vesting?» deja la sección fuera de los cuatro", () => {
    expect(
      puesto(sinAliasDeLaSeccion(chunksDe("en")), "Why did he leave Vesting?"),
    ).toBe(-1);
  });
});
