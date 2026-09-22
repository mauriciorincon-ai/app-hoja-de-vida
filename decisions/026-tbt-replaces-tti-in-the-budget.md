# ADR-026: Total Blocking Time replaces Time to Interactive in the perf budget

- **Status:** accepted
- **Date:** 2026-09-22
- **Sprint:** none (content PR #38 — the gate blocked the merge and had to be answered)
- **Amends:** ADR-006 (which set `interactive: 4000`) — its own "Consequences" already
  proposed this exact move in Sprint 001 and it was never executed.

## Context

`/es/vitrina/tableros` failed the `interactive ≤ 4000 ms` budget on a branch that does not
touch a single rendered file. Two full CI runs, nine measurements:

| run | values (ms) | result |
| --- | --- | --- |
| `41be69c` | 4047 · 4031 · 4003 | red |
| `41be69c` re-run, same commit | — | green |
| `6ba7ca8` | 4134 · 4011 · 4007 | red |

**Six of nine over the line.** The distribution is centred *on* the ceiling, so the gate
fails more often than it passes — it had become a coin flip, and a gate that reds at random
teaches everyone to ignore reds.

Three facts decided this:

1. **The page is not slow.** In the green run, `categories:performance ≥ 0.9` passed on all
   fifteen URLs, that one included. Since Lighthouse 10, TTI carries **zero weight** in that
   score: Google removed it for being noisy and poorly correlated with real experience, and
   put Total Blocking Time in its place.
2. **The branch cannot be the cause.** `git diff --name-only origin/main...HEAD` touches
   nothing under `src/`, `public/` or the published data, so the page is served exactly as on
   `main`. (The `data/a-fondo/` corpus can never reach it either: the chat panel mounts via
   `dynamic` only on click and the index is fetched inside the panel, so Lighthouse — which
   never opens it — never requests it.)
3. **This repo predicted it.** ADR-006 already called TTI "a deprecated lab metric" and its
   Consequences said, verbatim: *"suggest 4000ms default or replacing the metric with TBT"*.
   Its Sprint 003 amendment then established the corollary — *"a budget pinned exactly at the
   typical measured value turns CI into a coin flip"* — and applied it to LCP only. TTI was
   left pinned at its measured value for two months. This is the unpaid half of that decision.

## Decision

**`interactive` leaves `perf-budget.json`; `total-blocking-time ≤ 200 ms` takes its place.**
`first-contentful-paint ≤ 1500`, `largest-contentful-paint ≤ 3850` and
`cumulative-layout-shift ≤ 0.1` are unchanged, as are the resource-size ceilings and the
separate `categories:* ≥ 0.9` assertions.

This is **not** a loosened ceiling: it stops measuring a metric its own vendor deprecated and
starts measuring the one that replaced it. The thing being watched changed; nothing was
excused.

### Where 200 ms comes from — measured, not guessed

Measuring locally would lie (this Mac is far faster than the runner), and `lhci assert` prints
values only for assertions that **fail**. So the number was obtained by shipping the budget at
**0** for one run, deliberately red, which printed the real figure for all fifteen URLs:

| | TBT |
| --- | --- |
| worst per-URL median (`/es`) | 84 ms |
| best per-URL median | 26 ms |
| `/es/vitrina/tableros` — the page that failed TTI | **38 ms** |
| all 45 runs | p50 43 · p90 67 ms |
| values above 200 ms, out of 45 | **1** |

The page that had been blocking every merge sits mid-table on actual main-thread blocking,
which is the clearest possible confirmation that TTI was measuring the framework's hydration
and not anything a visitor feels.

200 ms is **Lighthouse's own "good" threshold** for TBT and matches the INP ≤ 200 ms already
in the DoD, so the line is borrowed, not invented. It leaves 2.4× headroom over the worst
median and 3× over p90 — enough that it will not flake, little enough that a real regression
trips it: any page that starts blocking the main thread lands in the hundreds, not the tens.

## Consequences

- **The one outlier is a cold start, and it is watched.** The single value above 200 ms (1107)
  was the first run of the first URL, with the server just booted; `median-run` did not select
  it, and TTI never failed on `/es` for the same reason. If it ever does select one, the fix is
  to **warm the server before collecting**, not to raise the ceiling.
- **Rule 14, three questions.** *Can it fail?* — proven before it existed: had the metric name
  been wrong, Lighthouse would have dropped it in silence, so a ceiling of 0 that failed is the
  proof the gate is reachable. *Did it run?* — yes, its own `success` on this PR. *Was it seen
  red?* — yes, at 0, in commit `5e1c97f`, on this branch, recorded in the log.
- **Report upstream to kit-app:** ADR-006 already filed this recommendation and it sat
  unexecuted for two months. The kit's default budget should ship `total-blocking-time`, not
  `interactive` — the same trap is stamped into every app made from it.
