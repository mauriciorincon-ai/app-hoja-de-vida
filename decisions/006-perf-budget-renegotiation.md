# ADR-006: Perf budget — interactive renegotiated to 4000ms; font strategy for LCP

- **Status:** accepted
- **Date:** 2026-07-05
- **Sprint:** 001

## Context

The kit's default `perf-budget.json` asserts `interactive ≤3500ms` and
`largest-contentful-paint ≤2500ms` under Lighthouse mobile simulation (4x CPU throttle,
slow-4G). Across five CI runs on clean runners, after removing every structural cost we
controlled (LCP independent of JS via pure-CSS entrances, zod out of the client bundle,
server-component showcase, deferred Motion features, trimmed i18n payload, font subsetting):

- **TTI was flat at 3.62–3.64s** — the remaining cost is Next 16 + React 19 hydration of the
  interactive page itself (~230KB compressed script floor), not app code.
- **LCP was dominated by the webfont swap repaint**: with `font-display: swap`, the arrival
  of Inter re-registers the LCP candidate (documented Chrome behavior). Content is actually
  visible from FCP (~1.4s) in a metric-adjusted fallback.

## Decision

1. **Body font (Inter) uses `font-display: optional`** — no late swap, so LCP registers at
   first paint. First uncached visit renders the size-adjusted fallback; cached visits render
   Inter. Fraunces (display headline) keeps `swap` — it carries the brand voice and is not
   the mobile LCP candidate.
2. **`interactive` budget renegotiated: 3500 → 4000ms** in `perf-budget.json`.

## Rationale

- The standards allow performance debt "con budget renegociado explícito" via ADR.
- TTI is a deprecated lab metric (replaced by INP in Core Web Vitals 2024); this page is
  fully static HTML with content readable before hydration, and its only interaction
  surface (form, below the fold) hydrates well before a user scrolls to it. The 3.6s lab
  value under 4x throttle corresponds to ~0.9s real CPU on a mid-range device.
- LCP ≤2500ms (a real Core Web Vital) is **kept**, met via the font strategy above.

## Consequences

- If S2 adds meaningful client JS (chat), revisit: the 4000ms line is a ceiling, not a
  license. INP stays budgeted at ≤200ms (DoD).
- Report upstream to kit-app: the default budget's `interactive 3500` is unreachable for
  any Next-16 client-interactive page under mobile simulation; suggest 4000ms default or
  replacing the metric with TBT.
