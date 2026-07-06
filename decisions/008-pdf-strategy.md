# ADR-008 — ATS PDF strategy: pdfkit at build time

- **Status:** accepted (2026-07-05)
- **Sprint:** 002 (Profundidad primero)
- **Note:** the build order assigned ADR-007 to this decision, but ADR-007 was already
  taken by the content-pack schema extensions — deviation logged in the sprint log.

## Context

The #1 screener need is a downloadable, ATS-parseable PDF of the CV. The sprint plan
mandates: generated at **build time** from the same YAML that powers the web (single
source of truth — they can never drift), real selectable text (NOT a screenshot), and an
automated test proving the text can be copied/parsed.

## Decision

**pdfkit in a build script** (`scripts/generate-cv-pdf.mjs`), chained explicitly in
`package.json` (`"build": "node scripts/generate-cv-pdf.mjs && next build"` — pnpm does
not run `prebuild` lifecycle scripts by default). Outputs
`public/cv/Henry-Rincon-CV-{ES,EN}.pdf` (gitignored — build artifacts, not sources).

- **Helvetica (standard-14 font, no embedding):** maximum ATS compatibility; WinAnsi
  charset covers Spanish accents. A sanitizer maps the few out-of-set chars used by the
  content (− → -, → → ->) and strips anything non Latin-1.
- **Single-column sequential layout:** guaranteed reading order for parsers — text
  structure over visual design, per the sprint's risk mitigation.
- Zod validation is NOT duplicated in the script: `next build` (which runs right after)
  already fails on malformed YAML via `src/lib/content.ts`.

### Rejected

- **@react-pdf/renderer:** heavy dependency, React 19 peer-compat risk, and JSX adds
  nothing to a text-first document.
- **Headless-Chrome print-to-PDF at build:** Vercel build containers don't ship Chrome;
  would couple the build to a browser install.
- **Print-CSS only:** doesn't produce a downloadable file nor an automatable acceptance
  test. (The `/cv` route still offers a print-friendly HTML page for humans.)

## Acceptance evidence

`tests/integration/cv-pdf.test.ts` generates both PDFs to a temp dir with the real
script and extracts their text with `pdf-parse`: name, real metrics ("50+ usuarios"),
certification IDs and university must be present; out-of-charset chars must not.
E2E (`tests/e2e/cv.spec.ts`): the download link returns 200 `application/pdf` > 0 bytes.
