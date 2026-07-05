# ADR-005: i18n — next-intl with /es /en routes (SSG)

- **Status:** accepted
- **Date:** 2026-07-05
- **Sprint:** 001

## Context

Structural bilingual requirement: `/es` and `/en` routes with hreflang, visible toggle that
preserves the section, and 100% of content statically rendered (ATS/SEO gate: `curl` returns
full text without JS). Candidate named in the sprint plan: next-intl.

## Decision

**next-intl v4** with the `[locale]` segment pattern:

- `src/i18n/routing.ts` — `defineRouting({ locales: ['es','en'], defaultLocale: 'es' })`.
- `src/proxy.ts` — locale redirect (`/` → `/es`) only; never touches `/api` or static files.
- `generateStaticParams` + `setRequestLocale` in the locale layout → both locales prerendered
  as static HTML at build time (verified in the build output: `● /es`, `● /en`).
- hreflang via `alternates.languages` in `generateMetadata` (+ `x-default` → `/es`).

## Rationale

- next-intl is the de-facto App Router i18n lib: typed messages, static rendering support,
  and `createNavigation` helpers that keep locale switching one line.
- Division of labor: **UI chrome strings** (nav, form labels, errors) live in
  `messages/{es,en}.json`; **CV content** lives in `data/cv.{es,en}.yaml` — the language is
  never resolved with loose strings inside components (CLAUDE.md rule).

## Consequences

- Language toggle uses next-intl's `usePathname`/`router.replace` with the target locale plus
  the current hash, preserving the visitor's section.
- S2's chat index will be generated per locale from the same YAML sources.
