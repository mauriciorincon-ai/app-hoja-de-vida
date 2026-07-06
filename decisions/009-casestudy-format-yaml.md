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
