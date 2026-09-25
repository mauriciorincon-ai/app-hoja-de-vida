# ADR-009 — Case study format: structured YAML over MDX

- **Status:** accepted (2026-07-05)
- **Sprint:** 002 (Profundidad primero)

## Context

The 5 case study pages (`/{locale}/proyectos/<slug>`) need a content format. The sprint
plan left it open: YAML vs MDX.

## Decision

**Structured YAML** inside the existing `data/cv.{es,en}.yaml`: each project gains
`slug` plus an optional `casestudy { contexto, reto, acciones[], impacto[] }`.

- The narrative is deliberately FIXED (context → challenge → what I did → impact): four
  fields, not free prose. That makes it **data**, which is what the app's core pattern
  ("content = versioned data validated by Zod, build fails on malformed content")
  already handles. MDX would bypass that validation.
- Keeps the acceptance criterion literally true: _adding a case study = editing YAML,
  zero code_ — a project with `casestudy` present gets its page via
  `generateStaticParams`; without it, no page.
- One template for all five (sprint rule: no per-page effects), so per-page markup
  freedom — MDX's main selling point — is explicitly unwanted.
- ES/EN parity is testable mechanically (same slugs, same shape) because both files
  share one schema.

### Rejected: MDX

Adds a compile pipeline and per-file components for 5 documents with identical
structure; free-form prose can't be schema-validated; bilingual parity would rest on
convention instead of tests.

## Consequences

- Long narrative text lives in YAML block scalars (`>-`) — fine for paragraphs, and the
  owner edits it like all other content (docs/MANUAL-DE-USO.md).
- If a future case study truly needs rich embedded media, that's a new ADR (likely a
  `media[]` field before reaching for MDX).

## Amendment — 2026-09-24: the shape grows from four lists to an editorial piece, and the schema enforces it

**Why.** The owner asked on 2026-09-13 (⭐ gate, block C) for case studies of the three roles
that had none — C&M Consorcio, Ceinfes and Inglopres — "once the a-fondo corpus is done". The
corpus was finished and approved on 2026-09-20/21 (25 documents, ~148k words per language) and
the case studies did not follow; the existing five were still `contexto · reto · acciones[] ·
impacto[]`, four short lists. His verdict on 2026-09-24: the Vesting page was "as simple as it
was before all that effort". The depth existed; the page did not show it.

**Decision.** Still structured YAML, still one template, still zero code per case. The
`casestudy` object becomes:

| Field | Shape | What it is |
| --- | --- | --- |
| `titular` | string | the thesis of the case, under the title |
| `contexto`, `reto` | string | unchanged; rendered side by side from `md` |
| `cifras` | 3–4 × `{valor, prefijo?, sufijo?, decimales?, etiqueta}` | a figures band, same recipe as the HOME achievements (`Counter`) |
| `capitulos` | 3–6 × `{titulo, texto}` | "How I did it", numbered; **replaces `acciones`** |
| `impacto` | string[] | unchanged |
| `leccion` | string | "What I take with me": one sentence from the owner's own corpus, as an editorial quote |

All fields are **required**. The old thin shape no longer compiles — that is the invariant that
keeps a case from ever sliding back to four sentences. The page also derives, without new data,
the role from the trajectory entry that points to the case, and the previous/next case in
trajectory order (`src/lib/casos.ts`).

**Gates that a schema cannot express** (`tests/unit/casos-de-estudio.test.ts`, each shown red in
the commit that introduced it):

1. every trajectory entry has its case study;
2. every figure in the band appears in `data/a-fondo/<slug>.es.md`, as digits or as a Spanish
   number word — a figure the approved corpus does not state is an invented figure;
3. measured minimalism: headline ≤ 40 words, chapter title ≤ 8, chapter text ≤ 70, figure label
   ≤ 9, lesson ≤ 45 (the owner asked for "minimalist and elegant");
4. ES/EN parity: same figure values, same number of chapters and impact items.

**Consequences.** The chat index emits one chunk for the case (thesis, context, challenge,
figures, impact, lesson) and one per chapter; the Spanish question bank moved from 106 to 107
first-hit answers. The three a-fondo documents of the new cases now cite their case page instead
of `#trayectoria`. Axe covers all sixteen case pages. `acciones` is gone from the schema, the
builder and the tests.
