import "server-only";
import { readFileSync } from "node:fs";
import path from "node:path";
import { createRetriever, type Retriever } from "./retrieval";
import { parseChatIndex, type ChatIndex } from "./schemas";

/**
 * Carga server-side del índice del chat (el mismo asset que el cliente
 * fetchea en modo fallback). Se lee de disco una vez por instancia y por
 * locale; `outputFileTracingIncludes` en next.config garantiza que los JSON
 * viajen con la función serverless.
 */

type Entry = { index: ChatIndex; retriever: Retriever };
const cache = new Map<string, Entry>();

export function getChatIndex(locale: "es" | "en"): Entry {
  let entry = cache.get(locale);
  if (!entry) {
    const fileName = `chat-index.${locale}.json`;
    const filePath = path.join(process.cwd(), "public", fileName);
    const index = parseChatIndex(
      JSON.parse(readFileSync(filePath, "utf8")),
      `public/${fileName}`,
    );
    entry = { index, retriever: createRetriever(index.chunks) };
    cache.set(locale, entry);
  }
  return entry;
}
