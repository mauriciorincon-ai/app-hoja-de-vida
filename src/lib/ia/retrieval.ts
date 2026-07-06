import MiniSearch from "minisearch";
import type { ChatChunk } from "./schemas";

/**
 * Retrieval lexical sobre el índice build-time (ADR-010). ISOMÓRFICO a
 * propósito: el server lo usa para el top-k del RAG y el cliente lo usa en
 * modo fallback (búsqueda local con el mismo asset) — el chat nunca muere.
 *
 * Dos modos de búsqueda:
 * - `topK` (fuzzy + prefix): recall alto para armar el contexto del LLM y
 *   para la búsqueda local del fallback.
 * - `topKStrict` (términos exactos): precisión alta para el guardrail
 *   off-topic — sin fuzzy, "gatos" jamás coincide con "datos".
 */

/** Stopwords ES/EN: sin esto, "en", "de", "the" hacen match con todo. */
const STOPWORDS = new Set([
  "que",
  "con",
  "para",
  "las",
  "los",
  "del",
  "por",
  "una",
  "uno",
  "unos",
  "unas",
  "este",
  "esta",
  "esto",
  "estos",
  "estas",
  "sus",
  "como",
  "cual",
  "cuales",
  "donde",
  "cuando",
  "quien",
  "tiene",
  "tienes",
  "hay",
  "muy",
  "mas",
  "más",
  "qué",
  "cómo",
  "cuál",
  "dónde",
  "cuándo",
  "quién",
  "the",
  "and",
  "for",
  "with",
  "what",
  "which",
  "who",
  "how",
  "does",
  "did",
  "has",
  "have",
  "his",
  "her",
  "was",
  "were",
  "are",
  "about",
  "you",
  "your",
]);

/** Siglas cortas con significado real en este CV. */
const SIGLAS = new Set(["ia", "bi", "ai", "ml", "ia."]);

function processTerm(term: string): string | null {
  const t = term.toLowerCase();
  if (STOPWORDS.has(t)) return null;
  if (t.length < 3 && !SIGLAS.has(t)) return null;
  return t;
}

export type ScoredChunk = { chunk: ChatChunk; score: number };

export type Retriever = {
  topK: (query: string, k?: number) => ScoredChunk[];
  topKStrict: (query: string, k?: number) => ScoredChunk[];
};

type Hit = {
  id: string;
  titulo: string;
  texto: string;
  ancla: string;
  score: number;
};

export function createRetriever(chunks: ChatChunk[]): Retriever {
  const mini = new MiniSearch<ChatChunk>({
    fields: ["titulo", "texto"],
    storeFields: ["id", "titulo", "texto", "ancla"],
    processTerm,
  });
  mini.addAll(chunks);

  const toScored = (hits: Hit[], k: number): ScoredChunk[] =>
    hits.slice(0, k).map((r) => ({
      chunk: { id: r.id, titulo: r.titulo, texto: r.texto, ancla: r.ancla },
      score: r.score,
    }));

  return {
    topK(query, k = 4) {
      return toScored(
        mini.search(query, {
          boost: { titulo: 2 },
          prefix: true,
          fuzzy: 0.2,
          processTerm,
        }) as unknown as Hit[],
        k,
      );
    },
    topKStrict(query, k = 4) {
      return toScored(
        mini.search(query, {
          boost: { titulo: 2 },
          processTerm,
        }) as unknown as Hit[],
        k,
      );
    },
  };
}
