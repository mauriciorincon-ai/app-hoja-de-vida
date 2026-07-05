# ADR-001: Framework — Next.js 16 App Router (SSG)

- **Status:** accepted
- **Date:** 2026-07-05
- **Sprint:** 001

## Context

The build order (SPRINT_001-orden.md) specifies Next.js 15 App Router with SSG. The kit-app
scaffold stamped this repo with Next.js 16.2.10 + React 19 already installed and building.
The alternative considered in the brief (ADR-001 there: Astro vs Next.js) was already resolved
in favor of Next.js by the kit default.

## Decision

Keep **Next.js 16.2.10** (App Router, SSG via `generateStaticParams` + `setRequestLocale`).
Do not downgrade to 15.

## Rationale

- The scaffold ships 16; downgrading means churning react/eslint-config/lockfile for zero
  functional benefit — SSG output and App Router APIs are identical for this app's surface.
- Approved by the user on 2026-07-05 (plan approval). Logged as plan deviation in
  `sprints/SPRINT_001-implementation-log.md`.
- Note: Next 16 deprecates `middleware.ts` in favor of `proxy.ts` — adopted from the start.

## Consequences

- The planner's sprint doc references Next 15; the planner reads this ADR + the log for the
  retrospective (this repo never writes to the planner).
- Tailwind v4 (CSS-first) comes with the scaffold: design tokens live in `@theme` inside
  `src/app/globals.css` instead of a `tailwind.config.ts` (which no longer exists in v4).
