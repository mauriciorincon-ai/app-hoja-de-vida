# ADR-006: Perf budget — interactive 4000ms and LCP 3500ms renegotiated; font strategy

- **Status:** accepted (amended in Sprint 003 — see Amendment below)
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
3. **`largest-contentful-paint` budget renegotiated: 2500 → 3500ms.** After making the LCP
   element fully static, LCP stayed at ~3.4s: the candidate became the **headline**, whose
   late re-registration is the **Fraunces font-swap repaint** under simulated slow-4G. The
   alternatives were rejected deliberately:
   - `display: optional` on Fraunces would strip the product's editorial identity (its
     declared differentiator) from every cold first visit — the exact visit that matters
     for a recruiter.
   - The text is visible from FCP (≤1.5s, budget kept) in a metrics-adjusted fallback;
     nothing is invisible to the user at any point, and CLS stays 0.

## Rationale

- The standards allow performance debt "con budget renegociado explícito" via ADR.
- TTI is a deprecated lab metric (replaced by INP in Core Web Vitals 2024); this page is
  fully static HTML with content readable before hydration, and its only interaction
  surface (form, below the fold) hydrates well before a user scrolls to it. The 3.6s lab
  value under 4x throttle corresponds to ~0.9s real CPU on a mid-range device.
- The user-experienced gates stay strict: FCP ≤1500ms (content readable), CLS ≤0.1
  (measured 0), INP ≤200ms. The renegotiated lines (TTI, LCP) are the two whose lab
  definition punishes framework hydration and brand-font swap on simulated slow-4G,
  not actual invisible content.

## Consequences

- If S2 adds meaningful client JS (chat), revisit: the 4000ms line is a ceiling, not a
  license. INP stays budgeted at ≤200ms (DoD).
- Report upstream to kit-app: the default budget's `interactive 3500` is unreachable for
  any Next-16 client-interactive page under mobile simulation; suggest 4000ms default or
  replacing the metric with TBT.

## Amendment (Sprint 003, 2026-07-06): LCP 3500 → 3850ms — engineering margin

S2 left a boundary flake on record: HOME `/en` measured ~3515ms against the 3500ms line —
a budget pinned exactly at the typical measured value turns CI into a coin flip
(`wiki/patterns/lcp-nace-estatico.md`, budget corollary). Before widening the line, the
remaining real-improvement levers were re-evaluated and all are already applied or were
deliberately rejected:

- Fraunces ships one static weight (500), latin subset, self-hosted and preloaded by
  `next/font` — no payload left to trim.
- The LCP element is fully static HTML (no motion wrapper); what re-registers LCP is the
  documented Chrome behavior on the brand-font swap repaint under simulated slow-4G.
- The only remaining lever, `display: optional` on Fraunces, was rejected above (strips the
  editorial identity from exactly the cold first visit that matters for a recruiter) — that
  decision stands.

Therefore: **`largest-contentful-paint` budget 3500 → 3850ms (~10% engineering margin)**.
FCP ≤1500, CLS ≤0.1 and INP ≤200 stay strict; content remains visible from FCP at all
times. The 3850 line still fails on any real regression (the S2 detail-page bug was
3.6–4.1s — it would still trip).

## Amendment (2026-09-26): JetBrains Mono is preloaded

The mono voice (`display: optional`, per this ADR's pattern) shipped with `preload: false` since
Sprint 001 on the grounds that it paints metrics and dates, "mostly below the fold". Measured on
2026-09-26 with the Chrome DevTools Protocol (`CSS.getPlatformFontsForNode`, cold cache): the
first visit painted the HOME figures, the case-study figure band and `/cv` in **Arial** (the
`next/font` fallback) in 30 of 30 loads, throttled or not. Without a preload the font is only
requested once CSS needs it, which is always too late for `optional`'s block period. The HOME
figures are the largest numbers on the site, and the first visit is the only one a recruiter
makes: the same argument this ADR used to keep Fraunces as `swap`.

With the preload: JetBrains Mono in 15 of 15 cold loads unthrottled, with CPU throttling alone
(4× and 6×), and on a good 4G profile (40 ms, 9 Mb/s). On Lighthouse's slow-4G profile the
fallback still wins; that is what `optional` promises (no late swap, CLS stays 0).

Cost, measured locally with Lighthouse 12 (median of 3, mobile, simulated throttling):

| URL                     | perf before → after | LCP before → after | TBT before → after | CLS |
| ----------------------- | ------------------- | ------------------ | ------------------ | --- |
| `/es`                   | 91 → 90             | 3409 → 3585 ms     | 59 → 64 ms         | 0   |
| `/es/proyectos/vesting` | 94 → 94             | 3115 → 3128 ms     | 50 → 30 ms         | 0   |
| `/es/cv`                | 94 → 93             | 3123 → 3124 ms     | 56 → 68 ms         | 0   |

The HOME pays about 176 ms of simulated LCP for one more preloaded file (the 40 KB latin
variable font). Budgets are unchanged: the CI Lighthouse job (15 URLs, median of 3) is the gate
that decides whether this fits. An e2e (`tests/e2e/home.spec.ts`) asks the engine which font
actually painted the figures, so a regression back to Arial fails in CI.

## Amendment (2026-09-26, evening): JetBrains Mono swaps into a calibrated fallback

The morning's preload left `/es` on the edge of the 0.90 performance floor: after it, the CI
Lighthouse job failed `/es` at 0.89 twice in a row on a PR that did not touch the page, and passed
on `main` with the same page. Lighthouse's simulated LCP (lantern) counts **every request that
started before the observed LCP** (all non-low-priority-image nodes), so a preloaded font is paid
in full even when the LCP element is plain text in another face.

Measured locally with `lhci collect` (median of 3, all 15 CI URLs) at `cpuSlowdownMultiplier` 12,
which reproduces the CI's 0.89 on `/es`:

| Option                                                    | `/es` perf | worst URL | max CLS |
| --------------------------------------------------------- | ---------- | --------- | ------- |
| main (preload + `optional`)                               | 0.89       | 0.89      | 0.000   |
| B: `swap`, no preload, next/font fallback (Arial)         | 0.91       | **0.78**  | **0.257** |
| D: `swap`, no preload, **calibrated monospace fallback**  | 0.91       | 0.91      | 0.000   |

B was rejected: Arial is proportional, and the swap moved `/es/vitrina/agentes/hr-develop-ai-apps`
by CLS 0.257 (the same failure mode that sent `/cv` to `optional` in Sprint 2). D keeps the swap
and removes the shift: `adjustFontFallback: false` and two local `@font-face` fallbacks in
`globals.css`, calibrated from the font's metrics read with fontkit (advance 0.6 em, ascent 1.02,
descent 0.30, no line gap): "JBM Fallback Menlo" (Menlo / DejaVu Sans Mono, advance 1233/2048,
size-adjust 99.66 %) and "JBM Fallback Courier" (Courier New / Liberation Mono / Cousine, advance
1229/2048, size-adjust 99.98 %), each with ascent/descent/line-gap overrides.

At Lighthouse's default CPU, all 15 URLs pass both CI assertions (budget and categories); worst
median 0.91, `/es` 0.92/0.92/0.92 (it was 0.90/0.91/0.91). The figures still reach JetBrains Mono on
the first visit, now by swapping instead of by preloading; on a slow connection the visitor may
see a similar monospace face for a moment, and nothing moves.

Two e2e tests in `tests/e2e/home.spec.ts` guard it: the existing one (which font painted the
figures, now after `document.fonts.ready`) and a new one: the page's figures carry the calibrated
fallback chain, the fallback resolves to one of the calibrated local faces, and it occupies the
same box as JetBrains Mono (width within 0.5 %, line height within 0.5 px). **If the mono font
changes, the fallback must be recalibrated.**
