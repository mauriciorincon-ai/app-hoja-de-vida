import { describe, expect, it } from "vitest";
import {
  createRetriever,
  PESO_ALIAS,
  TOP_K_CONTEXTO,
} from "@/lib/ia/retrieval";
import { chatChunkSchema, type ChatChunk } from "@/lib/ia/schemas";
import { corpusSimulado } from "../../scripts/evaluar-corpus.mjs";

/**
 * «¿QUÉ ESTUDIÓ HENRY?» CITA «ESTUDIOS» (S24, OM-17). La recuperación es
 * léxica y sin raíces: «estudió» no es «Estudios», y el chunk `estudios` se
 * quedaba fuera de los primeros cuatro (en español cabía al puesto 11; en
 * inglés, por «case study» y «work study», ni entre los 12 primeros). La
 * pregunta se salvaba en el banco porque su fila también esperaba `origenes`.
 *
 * El arreglo es un campo `alias` del fragmento, con los verbos con que se
 * pregunta por él y él no dice (`build-chat-index.mjs`), y un peso medido
 * (`PESO_ALIAS`, `retrieval.ts`). Esta prueba fija las CUATRO formulaciones
 * que el dueño y un visitante usarían, y trae su propio rojo: sin el alias, la
 * misma pregunta NO trae «Estudios».
 */

const PREGUNTAS = {
  es: ["¿Qué estudió Henry?", "¿Dónde estudió Henry?"],
  en: ["What did Henry study?", "Where did Henry study?"],
} as const;

const chunksDe = (locale: "es" | "en"): ChatChunk[] =>
  corpusSimulado(locale).map((c: unknown) => chatChunkSchema.parse(c));

const sinAlias = (chunks: ChatChunk[]): ChatChunk[] =>
  chunks.map(({ alias: _alias, ...resto }) => {
    void _alias;
    return resto;
  });

describe("el chunk de estudios lleva su alias", () => {
  it.each(["es", "en"] as const)(
    "[%s] solo ese fragmento lo trae",
    (locale) => {
      const conAlias = chunksDe(locale).filter((c) => c.alias);
      expect(conAlias.map((c) => c.id)).toEqual(["estudios"]);
    },
  );
});

describe("las cuatro formulaciones traen «Estudios» entre las citas", () => {
  for (const locale of ["es", "en"] as const) {
    const retriever = createRetriever(chunksDe(locale));
    it.each(PREGUNTAS[locale])(`[${locale}] «%s»`, (pregunta) => {
      const ids = retriever
        .topK(pregunta, TOP_K_CONTEXTO)
        .map((h) => h.chunk.id);
      expect(ids, `trajo: ${ids.join(", ")}`).toContain("estudios");
      // Con margen: de primeras o casi, no colgada del cuarto puesto.
      expect(ids.indexOf("estudios")).toBeLessThanOrEqual(1);
    });
  }
});

describe("el rojo: sin el alias, la misma pregunta NO trae «Estudios»", () => {
  for (const locale of ["es", "en"] as const) {
    const retriever = createRetriever(sinAlias(chunksDe(locale)));
    it.each(PREGUNTAS[locale])(`[${locale}] «%s»`, (pregunta) => {
      const ids = retriever
        .topK(pregunta, TOP_K_CONTEXTO)
        .map((h) => h.chunk.id);
      expect(ids).not.toContain("estudios");
    });
  }
});

describe("el peso del alias", () => {
  it("es el medido (×8): bajarlo deja el inglés sin la cita", () => {
    expect(PESO_ALIAS).toBe(8);
  });
});
