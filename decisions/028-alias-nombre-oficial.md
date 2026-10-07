# ADR-028: Official-name alias for the apps, kept in CV Viva and never in the export

- **Status:** accepted
- **Date:** 2026-10-06
- **Context:** Sprint 009 (two categories of apps and the dashboards carousel)

## Context

Sprint 009 groups the apps of `/vitrina/apps` into two blocks, Professional and Personal, and
the owner fixed the name each app carries there («Habla San», «Nutrikids», «Anonimizador
Velo»…). Those names differ from the ones inside the exports in `content/vitrina/` («Hablemos
San», «Nutri-Kids», «Velo»). The exports are produced by the sister apps and **are not edited
here** (the same rule as every other piece of content that arrives from outside), and a
mismatch between the two cannot be fixed by editing either side.

## Decision

1. **The alias lives only in CV Viva**, in `data/categorias-apps.yaml`, next to the category
   that holds the app: `slug` + `nombre: { es, en }`. The export is never touched.
2. **It is applied where a visitor reads the name**: the card in `/vitrina/apps`, the
   technical sheet and its detail page (heading, `<title>`, neighbour links), the proposals
   form title and the waiting-list selector label. `nombreVisible(categorias, slug,
nombreDelExport, locale)` in `src/lib/vitrina/categorias-apps.ts` is the single place that
   resolves it; an app that is not in the YAML falls back to its export name.
3. **It is not applied where the name is an identifier**: the chat index, the manifest
   (`getManifestVitrina`), the notification e-mails and the owner's CV text keep the export's
   name. The submitted value of the waiting-list form is the slug, so the e-mail still names
   the app by its export.
4. **Fail-safe, like the rest of the content**: an export with no category breaks the build
   and names its slug; a slug declared with no export is ignored until its export arrives;
   a slug cannot be in both categories (`tests/unit/vitrina-categorias-apps.test.ts`).
5. **The order of each list is the order on the page.** `getFichasVitrina()` keeps its own
   order (sealed first, then by date) because the manifest, the chat and the neighbour links
   depend on it; the apps page does not reorder it.

## Consequences

- A visitor may see «Habla San» on the apps page while the owner's CV and the chat say
  «Hablemos San». This is the owner's choice and is recorded here so that it is not read as a
  typo; changing it is one line of the YAML.
- The names in `en` are written by hand: «Velo Anonymizer» is a translation of the descriptor,
  the others are the same proper name in both languages.
- The alias cannot reach the chat, which answers from the export and the `a-fondo` corpus.
  If the owner wants the chat to say the official name, it is a content change in those
  sources, not in this mechanism.
