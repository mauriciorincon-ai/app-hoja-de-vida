# ADR-027: Scroll entrances in CSS, without a motion library

- **Status:** accepted (supersedes ADR-002)
- **Date:** 2026-09-27
- **Context:** revision after PR #54 (the `/es` Lighthouse margin)

## Context

ADR-002 chose Motion (framer-motion v12) for the motion system. Every entrance primitive
(`Reveal`, `Stagger`, `StaggerItem`, `CifraQueLlama`, the Skills icons), the `Counter` and the
`TimelineTrack` were client components importing it, so its core (~45 KB gzip across three
chunks) shipped with every page and hydrated ~180 animated elements on the home.

PR #54 removed JetBrains Mono from the pre-paint window and `/es` settled at 0.91–0.92 with a
one-point margin. The CI reports showed what remained: the simulated LCP (3.2–3.4 s) is the cost
of the ~270 KB gzip of JavaScript requested before the observed paint, and the home's TBT
(90–225 ms on the runner, the highest of the 15 URLs) is hydration. Neither React nor the Next
runtime can be removed; the motion library could.

## Measured (local, Lighthouse mobile, `cpuSlowdownMultiplier` 12, five runs of `/es`)

| Build                                    | performance | LCP (sim.)  | TBT       | JS gzip before paint |
| ---------------------------------------- | ----------- | ----------- | --------- | -------------------- |
| `main` after #54                         | 0.88–0.92   | 3.33–3.40 s | 90–225 ms | ~270 KB              |
| E1: `Reveal`/`Stagger` as plain elements | 0.91–0.92   | 3.32–3.37 s | 70–129 ms | —                    |
| E2: no motion import anywhere (shim)     | 0.94 ×5     | 3.02–3.07 s | 57–77 ms  | 222 KB               |
| **This ADR, as built**                   | **0.94 ×5** | 3.02–3.05 s | 57–70 ms  | 220 KB               |

E1 showed that the scroll reveals alone were not the lever; E2 showed the library was.

## Decision

Entrances are CSS transitions driven by data attributes, with one small client observer.

- `Reveal`, `Stagger`, `StaggerItem`, `CifraQueLlama` and `IconoSkill` are **server
  components**. They write `data-reveal="<variant>"`, `data-reveal-group` (with `data-stagger`
  and `data-delay`) and `data-reveal-item="<variant>"` (with `data-hijos` for an item that
  orchestrates its own children, and `data-retraso` plus an inline `--reveal-delay` for an
  item with an absolute delay).
- `globals.css` holds, per variant, the hidden state (`:not([data-visto])`), the duration and
  the easing — the numbers of the design system, unchanged. Leaving the viewport returns to the
  hidden state without a transition, so the entrance repeats on the next pass (`once: false`).
- `Revelador` (client, renders nothing, lives in the locale layout and rescans on every route
  change) observes every `[data-reveal]` and `[data-reveal-group]` with one
  `IntersectionObserver` per threshold (the former `amount`), toggles `data-visto`, and
  distributes each group's delays with `retrasos.ts`.
- `retrasos.ts` is a pure function over the DOM that reproduces the timing **measured with
  Playwright on the library version** (`muestras/2026-09-27-tbt/arranques-antes.txt`): direct
  items at `delay + stagger × i`; an item with `hijos` starts its children at
  `its own delay + hijos.delay + hijos.escalon × j`, header and chips in one count in DOM order;
  an item with `data-retraso` keeps its absolute delay and takes no turn. (The icon strokes ran
  with an absolute delay under the library and were reproduced so first; on the owner's review the
  same day they became children of the card's header, so each stroke follows its own card — see
  the log's «Revisión del dueño».)
- `Counter` and `TimelineTrack` stay client components (they hold state) with their own
  `IntersectionObserver` / scroll listener; `usePrefiereQuieto` replaces `useReducedMotion`
  (`useSyncExternalStore`, `null` on the server — rule 5(a) unchanged). The timeline fill is
  written straight into the element's `transform` from the scroll event, without a re-render.
- `prefers-reduced-motion`: the existing CSS belt (`[data-motion]`) already forces the final
  state; it now also cancels transitions. **Without JavaScript** a `<noscript>` style in the
  layout shows everything — before, 134 elements shipped with `opacity: 0` inline and stayed
  invisible below the hero.
- The `motion` dependency is removed from `package.json`.

## Verified against the library version

Start times of every measured piece match within 15–30 ms (the observer's callback), with the
same durations: Logros 40/105/189/355 ms (was 34/100/183/333), Estudios 38/171/305 (38/155/289),
Skills cards 65/248/448 (48/231/431), card 0 header 865 (831), chips 965/1065/1165
(931/1030/1131), icon strokes 1065/1265 in every card (1047/1247), vitrina chips at their own
absolute delay (`muestras/2026-09-27-tbt/arranques-despues.txt`).

**A pre-existing bug surfaced by the measurement:** the Contacto title (`maskReveal`) never
entered, with the library or without it. The text is translated 110 % downwards inside an
`overflow-hidden` container, so an `IntersectionObserver` on the text itself reports 0 % visible
forever. `Reveal` now observes the container. An e2e in `home.spec.ts` guards it.

## Consequences

- No client component per section; the home hydrates ~40 fewer animated elements.
- A new variant needs its CSS: `tests/unit/motion-variantes-css.test.ts` fails naming the
  variant if `globals.css` lacks its hidden state or duration. The same test fails if any file
  imports `motion/react` again, or `package.json` brings it back.
- The delay model has a unit test against the measured numbers
  (`tests/unit/motion-retrasos.test.ts`).
- Scrubbed or pinned scroll choreography (ADR-002's escape hatch) would now be a new ADR with
  CSS scroll-driven animations or a library loaded after `load`, never in the pre-paint window.
