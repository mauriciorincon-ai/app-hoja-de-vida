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

## Alternatives considered

- **Pages under `/a-fondo` behind a `noindex`, or a secret path.** Rejected by the owner: a URL
  that exists is a URL that leaks. No page is the only door that cannot be left ajar.
- **Keeping the name «detalle».** Rejected: a third meaning for a word that already carries two
  costs more than a new name, every time anyone reads the code.
- **One big file per locale, as the story was.** Rejected: 24 topics in one file makes every
  edit a merge conflict, and the aduana could not name «the file» usefully.
- **The engine under `src/lib/`.** Rejected: `src/lib/` is for what the app renders. Nothing
  renders these documents.
