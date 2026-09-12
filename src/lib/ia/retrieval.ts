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

/**
 * Stopwords ES/EN: sin esto, "en", "de", "the" hacen match con todo.
 *
 * S8 — la segunda tanda, medida y no intuida. Con el corpus de 28 fragmentos, la
 * pregunta «cuéntame un chiste **sobre** gatos» puntuaba 4,28 y pasaba el
 * guardrail: el único término que casaba era la preposición «sobre», presente en
 * 42 fragmentos. El test de off-topic no lo veía porque usaba «chiste **de**
 * gatos», y «de» sí estaba en esta lista. Entran aquí las **preposiciones y los
 * imperativos dirigidos al asistente** —«escribe», «hazme», «dime»—: son
 * instrucciones, no tema, y su único efecto era sumar puntaje a preguntas ajenas.
 */
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
  // S8 — preposiciones que no son tema (medidas: «sobre» aparecía en 42 de 162
  // fragmentos y sostenía sola un falso on-topic).
  "sobre",
  "desde",
  "entre",
  "hasta",
  "sin",
  "tras",
  "ante",
  "bajo",
  "contra",
  "segun",
  "según",
  "durante",
  "mediante",
  "from",
  "into",
  "over",
  "under",
  "between",
  "during",
  "through",
  // S8 — imperativos dirigidos al asistente: instrucción, no tema.
  "dime",
  "dame",
  "hazme",
  "haz",
  "escribe",
  "escribeme",
  "escríbeme",
  "explica",
  "explicame",
  "explícame",
  "cuentame",
  "cuéntame",
  "hablame",
  "háblame",
  "tell",
  "write",
  "give",
  "make",
  "show",
  "explain",
]);

/** Siglas cortas con significado real en este CV. */
const SIGLAS = new Set(["ia", "bi", "ai", "ml", "ia."]);

function processTerm(term: string): string | null {
  const t = term.toLowerCase();
  if (STOPWORDS.has(t)) return null;
  if (t.length < 3 && !SIGLAS.has(t)) return null;
  return t;
}

/**
 * CUÁNTAS FUENTES entran a una respuesta. **Uno solo, y exportado** (S8).
 *
 * Hasta el S7 este número vivía DOS veces y con DOS valores: `TOP_K_CONTEXTO = 4`
 * privado dentro de la ruta del chat, y un `3` escrito a mano en el panel del
 * cliente para el modo de búsqueda local. El golden set no podía ejercitar
 * ninguno de los dos, porque ninguno era importable.
 *
 * El 4 sale de MEDIR contra el corpus completo (24 documentos × sus preguntas de
 * prueba = 48 consultas, 162 fragmentos):
 *
 *   k=1 → 67 %   k=2 → 88 %   k=3 → 94 %   k=4 → **100 %**   k=5 → 100 %
 *
 * Es decir: con 3 fuentes, 3 de cada 48 preguntas no traen su propio documento.
 * Con 4 no falla ninguna y subir a 5 no aporta nada — solo contexto y factura.
 */
export const TOP_K_CONTEXTO = 4;

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
    topK(query, k = TOP_K_CONTEXTO) {
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
    topKStrict(query, k = TOP_K_CONTEXTO) {
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
