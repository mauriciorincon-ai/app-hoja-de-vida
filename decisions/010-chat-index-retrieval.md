# ADR-010: Chat knowledge index — build-time chunks + MiniSearch lexical retrieval

- **Status:** accepted
- **Date:** 2026-07-06
- **Sprint:** 003

## Context

The chat must ground every answer in the site's real content, cite navigable sources, and
keep working when the LLM provider is down (local-search fallback in the browser). The main
corpus is the owner's incrementally-written story (`data/historia/historia.{es,en}.md`, G-Plan
adjustment) plus the structured YAML. No DB; runtime cost US$0; embeddings explicitly out of
scope this sprint (SPRINT_003 decision — revisit as an iteration if lexical quality
disappoints).

## Decision

1. **Build-time index per locale** (`scripts/build-chat-index.mjs`, chained in `build` like
   the PDF script): curated chunks from `cv.{locale}.yaml` (identidad/trayectoria/logros/
   proyectos+casestudies/certificaciones/skills), `apps.yaml`, and the historia sections with
   content. Output: `public/chat-index.{es,en}.json` (gitignored, regenerated every build).
2. **One asset, two consumers:** the API route reads the JSON from disk server-side
   (`outputFileTracingIncludes` guarantees it ships with the serverless function); the client
   fetches the same URL **lazily, only when entering fallback mode** — it never enters the
   initial bundle.
3. **Retrieval: MiniSearch** (`minisearch`, ~8KB, zero deps, isomorphic) with fuzzy+prefix
   matching and title boost — the same `src/lib/ia/retrieval.ts` module runs server-side (RAG
   top-k) and client-side (fallback search). Rejected: Orama (heavier for the same lexical
   job), hand-rolled scoring (re-implementing BM25 badly), embeddings (needs a provider call
   at build + vector math in the client fallback — out of scope by order).
4. **Citations via anchors:** every chunk carries `ancla` — a locale-agnostic destination
   (`#trayectoria`, `/proyectos/vesting`). The story is not rendered as a page, so each
   historia section declares its own anchor in its marker comment
   (`<!-- seccion: id | ancla: ... -->`), defaulting to `#trayectoria`; citations therefore
   always navigate to something visible.
5. **ES/EN parity enforced at build:** a historia section with content in one language and
   not the other (or missing its twin) kills the build with a per-section diagnostic. Empty
   skeleton sections are fine — the chat starts on YAML alone.

## Consequences

- Editing YAML or historia + push = re-indexed chat, zero code (the house pattern).
- The off-topic guardrail reuses the retriever: a question that matches nothing relevant in
  the index is answered statically without touching the provider.
- Lexical quality on very short queries is the known risk; logged for the summary if it
  shows up in real use (iteration path: build-time embeddings, same chunk source).
