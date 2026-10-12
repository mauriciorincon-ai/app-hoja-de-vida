# ADR-029: An app's simulation is shown on its own page, in a same-origin frame loaded on request

- **Status:** accepted
- **Date:** 2026-10-12
- **Context:** out-of-sprint improvement, requested by the owner after the content PR #73

## Context

Some apps of the pipeline are private and are never published. Their house can still deliver a
**static simulation** of the product: planlang ships a package of 216 files (its showcase of two
demos, labelled «Simulación · no operativo»), which PR #73 copied to `public/piezas/planlang/`.
The planner asked for it to be shown inside this site, «a static page with an iframe of the same
site» (planlang SPRINT_002; Big-D brief, C21), and registered it as a bounded exception to the
zero-links rule: the product is **shown** here, never handed over by a link to elsewhere.

After #73 the package was served but **no page linked to it**: it was published and invisible.

Two facts shaped the page:

1. The language router sends every path without a dot to a 404, so the package is only
   reachable through explicit `.html` files (`/piezas/planlang/es.html`), never through its
   folder.
2. The package is a whole app. Loaded eagerly in the frame, the page measured **342 KB of
   scripts** against the 300 KB budget (CV Viva 197 KB + package 136 KB), and since the frame is
   same-origin its scripts share the page's main thread: total blocking time went from ~30 ms on
   a regular sheet to 142–286 ms against a 200 ms budget.

## Decision

1. **Data, not code.** `data/simulaciones.yaml` lists each simulation: `slug`, `carpeta`
   (under `public/piezas/`), the entry `.html` per language and a one-sentence note from CV
   Viva. `src/lib/vitrina/simulaciones.ts` (pure) validates it and the build **fails** naming the
   entry when a slug has no export, when an entry file does not exist, when an entry is not a
   relative `.html`, or when an app is listed twice. Adding Big-D's demo is copying its package
   and adding one entry.
2. **One route per simulation**, `/vitrina/apps/<slug>/simulacion`, sibling of `detalle`, fully
   static, with `dynamicParams = false`: any other app gets a 404. The technical sheet of an
   app with a simulation offers it in its closing row («Ver la simulación»).
3. **The frame is loaded on request (a facade).** The page opens with a panel and two actions:
   «Abrir la simulación aquí» mounts the `<iframe>` and moves focus into it (the button that
   was pressed disappears, so focus must not fall to `<body>`), and «pantalla completa» is a
   plain link to the entry `.html`, which also works without JavaScript. What Lighthouse
   measures is what a visitor lives: a light page (198 KB of scripts, TBT 12–56 ms locally,
   performance 0.95–0.96), and the package's weight only for whoever opens it.
4. **No `sandbox`.** The package is same-origin and its playground needs scripts; `sandbox`
   with `allow-scripts allow-same-origin` isolates nothing and would only break its internal
   navigation.
5. **Accessibility is audited up to the frame.** axe scans the page in both states, excluding
   the frame's interior: that content belongs to another house and, like every piece of
   content arriving from outside, is not edited here. A one-off scan of seven package pages
   found zero violations; anything found later is reported to the app's session.
6. **The route enters the CI Lighthouse list** with the normal budget.

## Consequences

- planlang's simulation is reachable from its sheet in Spanish and English, and is in the
  sitemap.
- One more click for the visitor who wants it inline. Accepted: the alternative was raising the
  budget for this route and still risking TBT in CI, i.e. weakening a gate to fit the page.
- A package that grows does not slow CV Viva's page; it only slows itself, and the house that
  owns it is the one that can fix it.
