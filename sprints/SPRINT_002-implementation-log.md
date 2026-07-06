# Sprint 002 — Bitácora de implementación (Profundidad primero)

- **Branch:** `sprint-002/profundidad`
- **Orden:** `portafolio/hoja-de-vida/ordenes/SPRINT_002-orden.md` (planeadora, RO)
- **Plan aprobado:** 2026-07-05 (plan mode)

## Desviación del plan

1. **Numeración de ADRs:** la orden asigna ADR-007 a la estrategia PDF, pero ADR-007 ya existe
   en este repo (extensiones de schema del content pack, integrado post-S1). PDF → **ADR-008**;
   formato case study (YAML vs MDX) → **ADR-009**. ADR-003 sigue reservado para el LLM (S3).
2. **`verificacion`/`perfil`/`skills`/`certificaciones` ya existían** en schema+YAML desde la
   integración del content pack v1 — la orden pide crearlos; este sprint solo agrega
   `bullets[]`, `slug` y `casestudy`, y **renderiza** lo que ya estaba guardado.
3. **Frase del chat en `perfil`:** el texto del pack §3 termina con "pregúntaselo al chat de
   esta hoja de vida"; el chat es S3 → se recorta del YAML hasta que exista (regla "solo lo
   real"). Se restituye en S3.
4. **perf-budget:** se mantiene ADR-006 (interactive 4000 / LCP 3500); el delta kit v1.1.0
   (TBT ≤300, LCP 3000) es para apps recién estampadas y adoptarlo aquí no fue ordenado.
5. **Traducción EN adelantada a Fase 1** (el plan del sprint la ponía al final de la UI): los
   tests de paridad ES/EN y el `slug` requerido rompen con EN incompleto; traducir junto al ES
   elimina el riesgo #1 del sprint sin costo extra.

## Fase 0 — Setup (2026-07-05)

- Branch `sprint-002/profundidad` creada.
- **Hook pre-commit gitleaks (delta kit v1.1.0):** `githooks/pre-commit` copiado del kit +
  `git config core.hooksPath githooks` ✔. ⚠ `gitleaks` NO está instalado en la máquina — el
  hook degrada a aviso; pendiente del usuario: `winget install Gitleaks.Gitleaks`.
- **Ruleset verificada por API:** `protect-main` (id 18536159) activa; PR requerido; status
  checks requeridos `quality`/`e2e`/`lighthouse`; sin force-push/deletion. El to-do manual de
  la orden ya estaba resuelto desde S1.
- Deps: `pdfkit` (prod, corre en build) · `pdf-parse` + `@types/pdfkit` (dev).

## Fase 1 — Motor (2026-07-05)

- Schema extendido (aditivo): `trayectoria[].bullets` (default `[]`), `proyectos[].slug`
  (kebab, requerido), `proyectos[].casestudy {contexto, reto, acciones[], impacto[]}` opcional.
- Contenido ES **y EN** poblado (desviación #5): bullets para 8 roles + 5 case studies, todo
  desde la extracción de CVs y el pack §8 — cero cifras nuevas. Slugs: `vesting`,
  `banco-pichincha`, `transmilenio-cm`, `cafam`, `fundacion-ctic`.
- `scripts/generate-cv-pdf.mjs` (ADR-008): pdfkit + Helvetica + sanitizador WinAnsi;
  `build` = script + `next build`; `public/cv/` gitignored.
- Tests: 42 unit/integration (schema nuevo, paridad de la capa de profundidad, PDF con
  pdf-parse). **Gotcha:** pdfjs-dist referencia `DOMMatrix` al evaluar el módulo — en el
  runner se stubbea (la extracción de texto no usa canvas) y el test corre con
  `@vitest-environment node`.

## Fase 2 — UI (2026-07-05)

- Disclosure en `TimelineTrack`: botón `aria-expanded`/`aria-controls`, bullets SIEMPRE en el
  HTML (gate ATS), colapso visual grid `0fr→1fr` con `motion-reduce:transition-none`, labels
  por props (el namespace no viaja al cliente), evento `hito_expandido`.
- Secciones nuevas: `perfil.tsx`, `skills.tsx`, `certificaciones.tsx` (link "Verificar ↗" solo
  con `verificacion` no vacío). Orden HOME: Hero → Perfil → Trayectoria → Logros → Proyectos →
  Skills → Certificaciones → Apps → Contacto (bandas paper-0/1 alternan sin tocar lo existente).
- Detalle `/[locale]/proyectos/[slug]`: template único data-driven (`casestudy` presente =
  página), JSON-LD Article+BreadcrumbList, hreflang, breadcrumb, tracker
  `proyecto_detalle_visto`. Header ganó `enHome` (anchors absolutos fuera de la HOME).
- `/cv`: página imprimible (variantes `print:` de Tailwind) + `CvDownloadButton`
  (`cv_descargado`); CTA "CV (PDF)" fijo en el header y link en Contacto.
- `sitemap.ts` data-driven (HOME + /cv + case studies ×2 locales con alternates).
- Build: 22 páginas SSG (10 de detalle + /cv ×2) + 2 PDFs generados.

## Fase 3 — e2e (2026-07-05)

- Nuevos: `detalle.spec.ts` (flujo completo + ATS + 404), `cv.spec.ts` (página + PDF 200
  `application/pdf`), disclosure en `home.spec.ts` (click + teclado + aria), reduced-motion
  extendido (disclosure sin animación, detalle en estado final), axe sobre 6 rutas.
- CI: Lighthouse ahora audita `/`, `/es/proyectos/vesting` y `/es/cv` (budget ADR-006, path
  `/*` del perf-budget.json aplica a todas).
- **46/46 e2e verdes.** Mitigaciones de contención en chromium desktop: `test.slow()` en axe
  (la HOME con capa de profundidad excede 30s bajo 5 workers) y timeout 15s en navegación
  client-side (patrón del S1).
- `pnpm audit`: 1 moderate transitiva (`postcss` vía `@sentry/nextjs>next`) — preexistente,
  bajo el umbral del gate (high); se paga cuando Next/Sentry actualicen.

## Fase 4 — Cierre + gate Lighthouse (2026-07-05/06)

- PR #3 creado; primera CI: quality ✔ e2e ✔ **lighthouse ✘** en las DOS rutas nuevas:
  - `/es/proyectos/vesting` LCP 3634ms (>3500): el h1 usaba `anim-mask-up` — un elemento
    enmascarado no registra paint hasta revelarse (mismo mecanismo del hero en S1). El h1 ES
    el candidato LCP de la página → ahora pinta estático (coreografía en eyebrow/chips).
  - `/es/cv` CLS 0.125 (>0.1): JetBrains Mono sin preload + uso ESTRUCTURAL en /cv (headings
    de sección, contacto, periodos) → el swap tardío reacomodaba la página entera. Fix:
    `display: "optional"` (patrón ADR-006, como Inter). Verificación local: CLS 0.0000.
- **Lección reafirmada para el patrón wiki:** todo candidato LCP nace estático; y una fuente
  con `display: swap` sin preload es deuda de CLS en cuanto una ruta la use como fuente de
  layout (no solo de acentos).
- Nota herramienta: lhci/lighthouse local en Windows muere con EPERM al limpiar temporales de
  Chrome (chrome-launcher) — el JSON del reporte sí queda escrito; extraer métricas de ahí.
- Segunda iteración del LCP: el h1 estático NO bastó — el breakdown de Lighthouse
  (`lcp-breakdown-insight`) identificó el elemento real: el **párrafo de Contexto** dentro de
  un `Reveal` (elementRenderDelay ~8s). Contexto/Reto estáticos → CI verde.

## Gate de diseño (2026-07-05, 2 rondas)

- **Ronda 1 (aprobación general + 2 ajustes):** "muy muy buen trabajo… mejor de lo que me
  hubiera imaginado". Ajustes: (a) descendentes y/g recortados en el titular del hero —
  leading 1.02 → 1.12 + tamaño máx 4.5 → 4.25rem; (b) más aprovechamiento del ancho: perfil,
  logros y párrafos de detalle/cv sin topes estrechos.
- **Ronda 2:** (a) la "y" seguía tocando el borde → colchón `pb-[0.1em]/-mb-[0.1em]` en los
  bloques overflow-hidden + keyframe mask-up 110% → 120% (que el texto oculto no se asome por
  el padding); (b) el perfil a 2 columnas NO gustó — el usuario quería UNA columna a todo el
  ancho. Lección: ante feedback de espacio, preguntar la forma esperada antes de proponer un
  layout distinto.
- CI verde en ambas rondas (los fixes de estilo no movieron ningún gate). **PR #3 mergeado
  por el usuario (2026-07-05); producción desplegada. Sprint 002 cerrado.**
