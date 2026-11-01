# ADR-030: One brochure template for the twelve replaces the detail page and the house pages

- **Status:** accepted (2026-10-31)
- **Supersedes:** ADR-012 (the S4 brochure schema and route), the detail layer of ADR-013 (the S5 `/detalle`
  page) and the exception of ADR-014 (the ambient loop of the climax signature)
- **Context:** Sprint 028, «Sentada 4c: el brochure, una sola plantilla para las doce». The owner approved
  the mock-up on 2026-10-31 (`referencias-ui/brochure/maqueta/`, planner house, read-only).

## Context

An app of the portfolio had two pages for the same job: a **technical sheet** (`/portafolio/apps/<app>`, the
two-minute infographic, ADR-016) and a **detail page** (`…/detalle`, ADR-013) built from the same export with
cards that opened by themselves and an animated signature. The two house apps, CV Viva and its chat, had a
third thing: a hand-written brochure at `/apps/<id>` driven by a block in `data/apps.yaml` (ADR-012). Three
renderers, three vocabularies, and the detail page was the only technical page without numbered sections
(OM-29).

The planner house delivered, with the owner, a mock-up of a brochure that does the job once: a cover with its
figures and screens, «before and after», one chapter per feature group with its flow and questions, the
process, the method with its sources, and a closing. The owner approved it for all twelve (the ten apps and
the two of the house), and asked that the **ambient motion of the mock-up stays**.

## Decision

1. **One template for twelve.** `/portafolio/apps/<app>/brochure` (SSG, `dynamicParams = false`, both locales
   = 24 pages). The ten apps come from the loader; the two of the house come from `content/vitrina/casa/`
   through their own reader (`src/lib/brochure/casa.ts`), because they are not portfolio apps: they have no
   category (`repartirApps` rejects an export without one), their complement cannot live in `data/fichas/`
   (`ficha-tecnica-contrato` demands exactly the exports' complements) and their count must never join the
   ten. They are deliveries like any other: copied byte for byte (`scripts/copiar-entrega.mjs`), never edited.
2. **Data, not code.** The page is built by a pure model (`src/lib/brochure/modelo.ts`) from export + captures
   - complement + the optional **contract v2** (`content/vitrina/<app>.contenido.json`, a **draft**: its own
     file, optional, on the checkpoint list) + `data/brochure.yaml` (accent, «synthetic data» flag, search hint).
     A block with no data is not painted; the number-01 section always exists (in v1 it comes from the export).
     The flow engine (`flujo.ts`, pure) is a port of the mock-up's, checked against golden outputs generated once
     from the mock-up's own functions.
3. **The twelve counts stay at ten.** Apps are counted by suffix (`.brochure-export.json`,
   `.ficha-tecnica.json`), so a `.contenido.json` never turns ten apps into eleven.
4. **The retired routes redirect in one hop.** `/…/apps/<app>/detalle`, `/apps/hoja-de-vida` and
   `/apps/chat-hoja-de-vida`, with or without locale and also from the pre-«Portafolio» `/vitrina` paths, answer
   one 301 to the brochure (`RETIRADAS` is applied to the already-renamed path). A unit test fixes that no
   destination redirects again, and `tests/unit/rutas-retiradas.test.ts` fixes that nothing in the repo names the
   old routes any more. Removed with them: `FichaApp`, `TarjetaGrupo`, `AperturaPorLectura`, the five
   signatures, their CSS, `src/lib/brochure.ts` and the `brochure` block of `data/apps.yaml` (the schema is
   strict: a YAML that still carries it fails the build, naming it).
5. **Ambient motion, with a pause.** The loops of the mock-up (ribbon, waves, badges, the cover) stay, because
   they are the approved piece. ADR-014's exception («one loop, only in the climax signature») is **replaced**
   by a visible pause control in the ribbon strip (`[data-b-quieto]`, WCAG 2.2.2, level A), and with
   `prefers-reduced-motion` nothing moves. The tree never depends on `useReducedMotion()` (rule 7). Only
   `transform`/`opacity` animate on scroll.
6. **The mock-up's `ink-3` as text on dark is a token of its own.** `--tenue-oscuro` has a measured contrast on
   the dark sections and is allowed in exactly six rules, which `tests/unit/brochure-contraste.test.ts` lists;
   a seventh use (in a light section) fails the test. The six accents are checked pair by pair (≥ 4.5:1) and
   the sheet is checked against the same table (no loose hex).
7. **OM-29 closes without touching the sheet.** `numerarSecciones` already numbered every technical sheet (the
   four fronts share one renderer); the only page without numbers was the detail, which is gone. A test
   (`tests/e2e/numeracion.spec.ts`) fixes consecutive numbers in the sheets of the open fronts and in the twelve
   brochures. The sheet's `s03` is now «Qué aporta» / «What it brings» and its button «Ver brochure».

## Performance budget

The brochure is the heaviest page of the site by markup (all the text of an app, in the HTML, so that ATS and
no-JS readers get it). `perf-budget.json` gains an entry `/*/brochure$` (Lighthouse applies the **last**
matching entry, so it repeats the timings): FCP 1500, LCP 3850, TBT 200, CLS 0.05; document 120 KB, images
300 KB, scripts 300 KB, total 800 KB. Seen to fail with a document of 1 KB before trusting it.

Measured on mobile Lighthouse with the CPU slowed ×12 (local, three runs): the pilot (Innmobiliaria) went from
**0.80 to 0.92** (LCP 4.5 → 3.3 s, TBT ≈ 200 → ≈ 60 ms); the six brochures measured sit at 0.92–0.94, and
accessibility went from 0.94 to 1.0. What moved the needle, found with the long-animation-frame API
(`forcedStyleAndLayoutDuration`) rather than by guessing:

- every image visible at load is **deferred** (it arrives without `src`, the island sets it near the view):
  what the HTML requests before the first paint takes bandwidth from the text, which is the mobile LCP;
- the Recorrido slides and the preview texts are painted by the client **on first use** (an event plus
  `flushSync`), not shipped in the HTML — their text is already in each chapter;
- `content-visibility: auto` on the sections (with `contain-intrinsic-size`), reset to `visible` when printing
  and after the first jump (`data-b-entero`), so a jump lands on the right place;
- the cards' equal height is measured lazily, when a chapter opens, and written on its own grid instead of the
  root (a custom property on the root restyles the whole tree: 225–246 ms of forced layout at mount).

Tried and **not kept**: `<Suspense>` per chapter (React moves big completed boundaries to a `<div hidden>` plus a
script, which breaks the no-JS HTML) and `<Activity>` (no measurable gain).

## Deviations from the approved mock-up

All are declared again in the sprint's closing and in the fidelity matrix the owner reviews:

1. **The pause control** (point 5) — the one intentional difference the plan announced.
2. **The cover text enters by rising, without fading** — the fade delayed the mobile LCP; the scene and the
   figures still fade (rule 7: an animation does not negotiate the budget).
3. **The first screen of the cover is deferred** — on desktop it arrives when the page finishes loading.
4. **Recorrido and preview are painted on first use** by `recorrido.tsx`, not by `next/dynamic` as planned
   (same chunk; the saving is HTML weight).
5. **`content-visibility` on the sections** and the **lazy card equalisation** (see above).
6. Known and unchanged by this decision: the site header and its ES|EN switch replace the mock-up's black bar;
   the assistant's button is the site's; Fraunces is loaded without the optical-size axis (≈ 4 % wider); and the
   flow engine's column correction.

## Consequences

- The detail page and the house pages are gone; their visitors reach the brochure by a 301. The technical sheet
  keeps its role (the two-minute read, the waiting list) and points to the brochure.
- A new app is a delivery plus one line in `data/brochure.yaml`; the build fails naming the file and the field
  if either is missing or malformed.
- Contract v2 is a draft: until it is fixed with the planner, it lives in its own optional file and does not
  touch the v1 export. The `gaps` and `_lee_esto` notes of the planner's package are not part of the contract.
- English: apps without a v2 `en` block show their export's Spanish text, as the technical sheet already did,
  and the cover says so in one line (`textoEnEs`; the page's `description` is not the Spanish tagline either).
  **This includes the two house apps**, which had their English in `data/apps.yaml` (the `brochure` block this
  decision removes) and now wait for the planner's English; the «De esta casa» tiles read the `descripcion`
  of the same YAML in English meanwhile. The attribute `lang` of the page stays the page's: the chrome is in
  the page's language and only the delivered text is Spanish, as on the technical sheet.

## Addendum (Sprint 031, 2026-11-01): the brochure is the entry of every app

The owner decided it ("lo que necesito es reemplazar las fichas por el brochure, punto") and Sprint 030's
app-by-app switch is gone. `/portafolio/apps/<app>` paints the brochure for the ten apps and the house,
with or without the v2 content (the v2 enriches the page and brings its English; it no longer changes the
door). `scripts/entradas-brochure.mjs` and the `CV_ENTRADAS_BROCHURE` variable are deleted, and the proxy
sends the `/brochure` of any app (and the retired `/detalle` and the house's `/apps/<slug>`) to the entry in a
single 301. The technical sheet (ADR-016) is no longer an app's page: it stays only for agents, researches and
boards. The complement `data/fichas/<slug>.yaml` stays (the brochure reads its roadmap and milestones, and it is
the planner's contract) and so do `armar.ts` and the contract tests that assemble a sheet from it.
