# ADR-002: Motion library — Motion (framer-motion v12) over GSAP

- **Status:** accepted
- **Date:** 2026-07-05
- **Sprint:** 001

## Context

The motion system (Reveal, Stagger, Counter, TimelineTrack) needs scroll-triggered entrance
animations with exact numeric specs (distilled reference in the planner, READ-ONLY), a global
`prefers-reduced-motion` hook with e2e verification, and transform/opacity-only scroll
animations under a Lighthouse ≥90 mobile budget. Candidates per the sprint plan: Framer Motion
vs GSAP.

## Decision

**Motion v12** (`motion` package, the continuation of framer-motion), used through
`LazyMotion` + `m` components with the `domAnimation` feature bundle.

## Rationale

- Declarative React API: `whileInView` + `viewport={{ once: true }}` covers every entrance
  primitive without imperative timeline management; `useInView` + custom rAF covers Counter.
- First-class `useReducedMotion()` hook → single global gate, trivially testable in Playwright
  with `reducedMotion: 'reduce'`.
- Bundle: LazyMotion + domAnimation ≈ 15–20 kB gzip, tree-shaken via npm — fits the 300 kB
  script budget. GSAP + ScrollTrigger is comparable in size but adds an imperative layer and
  its scroll plugin exceeds what these four primitives need.
- The distilled reference's specs are duration/easing/stagger numbers — both libraries can
  express them; Motion keeps them colocated with JSX as variants.

## Consequences

- All motion components live in `src/components/motion/` and are client components; sections
  render full content in static HTML and animate on top (ATS/SEO gate unaffected).
- Custom cubic-beziers from the reference are defined once as easing arrays mirroring the CSS
  variables in `globals.css`.
- If S2+ ever needs scrubbed/pinned scroll choreography, revisit GSAP in a new ADR.
