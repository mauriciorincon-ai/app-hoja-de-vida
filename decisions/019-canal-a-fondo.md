# ADR-019: «A fondo» — a deep-corpus channel with no pages, and every citation target verified

- **Status:** accepted
- **Date:** 2026-09-12
- **Sprint:** 008
- **Supersedes:** the `data/historia/` part of ADR-010 (the channel, not the retrieval)

## Context

The chat promises «verify it yourself»: it answers only from the site's evidence and cites a
navigable source. Until this sprint that evidence was 28 chunks pulled from the YAML files plus
a story the owner was meant to write.

Three facts shaped this decision, and all three were discovered by reading the repo rather than
the order:

1. **The story was never written.** `data/historia/historia.{es,en}.md` were twelve headings,
   each with its marker and a `<!-- guía: -->` comment. The ~40 words per section that the order
   describes as content **were the guide**. The build printed it on every run —
   `0 secciones de historia con contenido` — for five sprints and nobody read the line.
2. **A citation pointed nowhere.** The `apps-pipeline` section's anchor was `#apps`, a HOME
   section retired in the post-S7 revision when the roadmap moved to the vitrina. The same dead
   anchor was also live in four chunks built from `apps.yaml`. No gate saw either: not the
   build, not the tests, not axe, not Lighthouse.
3. **«Detalle» already means two other things** in this app — a project's case study
   (`messages.detalle`, `DetalleVisitTracker`) and the last stretch of an app's long sheet
   (`/vitrina/apps/<slug>/detalle`).

The owner also decided, before a line was written, that **these documents must not be readable
by anyone**: they are reference material that makes the chat's answers better and more concrete,
not a section of the site.

## Decision

1. **The channel is `data/a-fondo/<slug>.<locale>.md`** — one document per topic. Frontmatter
   validated with Zod; body in Markdown with `##` subsections carrying `<!-- seccion: id -->`,
   the same two marks the story used, so the owner learns no new format.
2. **No pages at all.** No `/a-fondo` route, no index, no links from the HOME or the case
   studies, no Markdown library. The documents are fuel. **A citation navigates to the
   document's `ancla`, which is something visible** — exactly what ADR-010 had already decided
   for the story. The promise survives: what the reader verifies is the page, not the source.
3. **`estado` drives two things at once.** A `borrador` is neither indexed nor required to have
   an English twin; an `aprobado` is indexed **and** requires ES/EN parity subsection by
   subsection. This is what lets the whole base live in Spanish while the owner corrects it,
   without breaking the build and without the chat ever citing half a translation.
4. **The customs house runs in the build and breaks it naming file and field:** invalid
   frontmatter · duplicate subsection id · broken ES/EN parity in an approved document ·
   mechanical privacy (emails, phones, seven-plus digit numbers, web addresses) · a filename
   that lies about its slug · **a citation target that does not exist**.
5. **The destination catalogue is derived, not maintained** (`scripts/destinos.mjs`): HOME
   anchors are read from `page.tsx` — which components it mounts inside `<main>`, and which
   `id=` each of those declares — and routes are read from the same data that generates the
   pages. It applies to **every** chunk, not only the new channel's, because the dead `#apps`
   lived in chunks built from a YAML file.
6. **The engine lives in `scripts/a-fondo.mjs`**, next to the story's, and is tested from vitest
   the same way. With no pages, the build is its only consumer; putting it under `src/lib/`
   would have implied a reader that does not exist.
7. **An open question (`[CONFIRMAR: …]`) is part of the format, and it has two mechanical
   consequences** (added in phase 4b). An **approved** document may not carry one — the customs
   house stops the build — because the chat would quote it verbatim to a visitor: the author's
   question to himself, published as if it were evidence. And **the simulation strips them
   before measuring**, because it measures the index that will exist *after* approval, and
   approving is precisely having resolved them. Measured: 29 blocks, 1 282 words, 9 % of the
   corpus — enough to shift BM25's length normalisation against the very fragments that most
   need fixing.
8. **The content is tested with questions from OUTSIDE** (`tests/fixtures/banco-de-preguntas.es.yaml`,
   phase 4b). Each document's own `preguntas_de_prueba` were written with the document in front
   of the writer, so they use its words; a recruiter uses theirs. Since retrieval is **lexical**
   (ADR-010), a term the corpus does not contain cannot be retrieved however well the work was
   done — so the bank is also a **vocabulary audit**. 131 questions in 10 families, each
   declaring the sources that would answer it; the gate is that at least one lands in the real
   `top-4`. The readable report is generated by the test (`pnpm corpus:informe`), never written
   by hand — the same pattern as `docs/contrato-ficha-tecnica/`.

## Consequences

- **Outcome O2 of the order falls entirely**, with acceptance criteria 3 and 4, the two new
  Lighthouse URLs, axe over new routes and any Markdown library. Declared as a deviation.
- The story is retired. Its twelve sections migrated keeping id, title, destination and guide
  word for word, verified by a conservation test against a frozen fixture
  (`tests/fixtures/historia-esqueleto-s3.json`). **The order asked for a «prose equality
  test»; there was no prose to compare**, so equality would have proven the void.
- `#apps` is corrected to `#vitrina` in both places it lived, and the rule that killed it now
  runs on every build.
- A privacy sweep that a regex can perform is only one of three layers. **Proper names are not
  caught by a regex**: the template's checklist and the builder's reading of every PR are the
  other two, and they are not optional.
- Drafts mean the published index barely grows this sprint, so the retrieval recalibration
  cannot be measured against the final corpus. Measured against the full base forced to
  approved, as a simulation, and declared as such.
- The bank made the corpus fail 17 of 131 questions on its first run, and **every one of the
  17 was a content problem, not a retrieval bug**: the corpus said «extracción, transformación y
  carga» and never «ETL»; it said «el lago y el almacén» and never «lakehouse»; it never said
  «MLOps», «actualmente», «sector financiero», «modelos de lenguaje», «personas que no me
  reportan» or «qué me motiva». Sixteen corrections to thirteen documents later, 131/131.
- `TOP_K_CONTEXTO = 4` is now confirmed by two independent sets that agree on the same number:
  the 48-question golden set (94 % at k=3, 100 % at k=4) and the 131-question bank (95 % at
  k=3, 100 % at k=4).
- **The off-topic guardrail gets weaker as the corpus grows, and it is now measured:** of 15
  alien questions, the 28-fragment index blocks 13 and the 159-fragment one blocks 9. It is not
  repaired by raising the threshold — at 7, ten legitimate questions get «that's outside what I
  know» to buy three aliens. The correctness guarantee stays in the grounding-only prompt; the
  threshold is a token saving. Each alien question now declares which side of that border it
  sits on, so moving the threshold breaks a test that names the direction.

## Alternatives considered

- **Pages under `/a-fondo` behind a `noindex`, or a secret path.** Rejected by the owner: a URL
  that exists is a URL that leaks. No page is the only door that cannot be left ajar.
- **Keeping the name «detalle».** Rejected: a third meaning for a word that already carries two
  costs more than a new name, every time anyone reads the code.
- **One big file per locale, as the story was.** Rejected: 24 topics in one file makes every
  edit a merge conflict, and the aduana could not name «the file» usefully.
- **The engine under `src/lib/`.** Rejected: `src/lib/` is for what the app renders. Nothing
  renders these documents.
