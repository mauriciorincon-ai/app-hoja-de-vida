# ADR-028: One official name per app, applied where the export is read

- **Status:** accepted (amended the same day: the first version kept the chat and the e-mails on the export's name; the owner asked for the same name everywhere)
- **Date:** 2026-10-06
- **Context:** Sprint 009 (two categories of apps and the dashboards carousel)

## Context

Sprint 009 groups the apps of `/vitrina/apps` into two blocks, Professional and Personal, and
the owner fixed the name each app carries («Habla San», «Nutrikids», «Anonimizador Velo»,
«Dash Agent»…). Those names differ from the ones inside the exports in `content/vitrina/`
(«Hablemos San», «Nutri-Kids», «Velo», «Dash Agent AI»). The exports are produced by the
sister apps and **are not edited here** (the same rule as every other piece of content that
arrives from outside), so the mismatch cannot be fixed by editing the export.

The first cut of this ADR applied the alias only where the visitor reads the grid and kept the
chat, the manifest and the e-mails on the export's name. The owner rejected that on review:
**every name must be the same everywhere**. Two spellings of one product on one site read as a
mistake, and the chat is the place where a recruiter is most likely to copy a name.

## Decision

1. **One name per app, no translation.** `data/categorias-apps.yaml` holds, next to the
   category of each app, `slug` + `nombre: "…"` — a single string, the same in Spanish and in
   English (a product name is not translated).
2. **The alias is applied once, where the export is read.** `getFichasVitrina()`
   (`src/lib/vitrina/loader.ts`) returns each export with `app.nombre` and the anchor already
   set to the official name, and the app's own former name replaced inside the export's texts.
   Everything downstream inherits it with no per-site plumbing: the card, the technical sheet
   and its detail page, the neighbour links, the proposals form, the waiting-list selector, the
   manifest, the notification e-mails. The `content/` file is never touched; this is a read with
   an alias.
3. **The build scripts that read the exports directly apply the same function.** The chat index
   (`scripts/fichas-al-indice.mjs`) and the citation names (`scripts/destinos.mjs`) import
   `scripts/nombre-oficial.mjs`, the same pure module the loader uses. One copy, so the loader
   and the chat cannot drift apart.
4. **The owner's own texts use the same name.** `data/cv.*.yaml`, `data/fichas/` and
   `data/a-fondo/` (the chat corpus) say the official name, so the HOME, the PDF and the chat
   read the same as the grid. A test sweeps `data/`, `messages/` and `src/` for the name each
   export carries when it differs from the official one, and fails listing the files
   (`tests/unit/vitrina-categorias-apps.test.ts`). It is computed from the exports, so the day
   another app arrives with a different name, the gate watches it on its own.
5. **Replacement is by whole word and never doubles a prefix.** `Velo` becomes `Anonimizador
   Velo` where it stands alone and is left alone inside `Anonimizador Velo`, `Velocidad`, `velo`
   or `Velo-x`.
6. **Fail-safe, like the rest of the content**: an export with no category breaks the build and
   names its slug; a slug declared with no export is ignored until its export arrives; a slug
   cannot be in both categories.
7. **The order of each list is the order on the page.** `getFichasVitrina()` keeps its own order
   (sealed first, then by date) because the manifest and the chat depend on it; the apps page
   and the neighbour links derive the showcase order separately (`ordenDeEscaparate`).

## Consequences

- The alias is invisible at the call site, which is what keeps it consistent; it also means a
  new surface that reads `content/vitrina/` **directly** (not through the loader) would bring
  the export's name back. The sweep test does not see that, because it reads source files, not
  runtime output; `tests/unit/vitrina-categorias-apps.test.ts` therefore also checks the loader,
  the chat index and the citation names against the YAML.
- The cleaner fix is at the source: when the sister apps rename themselves in their exports, the
  alias becomes redundant and harmless (`conNombreOficial` returns the export untouched when the
  names already match). Until then the alias is the owner's decision recorded here.
- Two frozen artifacts keep the old name on purpose: the dated design reference
  `docs/contrato-ficha-tecnica/referencia.html`/`.png` (approved on 2026-09-05) and the older
  ADRs and sprint records, which describe what was true when they were written.
