---
sprint: 001
app: hoja-de-vida
status: closed
opened: 2026-07-04
closed: 2026-07-05
branch: sprint-001/home-que-enamora
pr: https://github.com/mauriciorincon-ai/app-hoja-de-vida/pull/1
---

# Sprint 001 Summary — CV Viva

## Outcome

**Sí.** La HOME completa existe en `/es` y `/en`: hero → trayectoria → logros → proyectos →
apps showcase → contacto, con motion system de specs numéricas, formulario de solicitud
end-to-end, y el 100% del contenido indexable sin JavaScript. **CI completa verde en el PR #1**
(quality + e2e + lighthouse contra budget con ADR-006). **El email de solicitud llegó en
producción** (verificado por el usuario en la preview con Resend configurado). Feedback del
gate de diseño aplicado (coreografía de timeline comprimida; animaciones replay en ambos
sentidos de scroll). Restan: veredicto visual final del usuario + merge + branch protection.

## Qué se construyó

- **Motor de contenido:** `data/cv.{es,en}.yaml` + `apps.yaml` validados con Zod en build
  (build FALLA con contenido malformado); contrato "editar YAML + push = deploy".
- **Motion system** (`src/components/motion/`): `Reveal` (fadeInUp/blurIn/maskReveal/
  scaleInBlur), `Stagger` (80ms), `Counter` (1800ms ease-out-cubic, valor final en HTML
  estático), `TimelineTrack` (rail SVG 1.4s + nodos sincronizados) — todo tras
  `prefers-reduced-motion` con doble cinturón (props condicionales + CSS pre-hidratación).
- **HOME 6 secciones** + header sticky con toggle ES/EN que conserva la sección + footer +
  404/error localizados + página de confirmación.
- **Formulario solicitar acceso** con 5 estados + endpoint (`POST /api/solicitar-acceso`):
  validación Zod server, honeypot (200 silencioso), rate limit 5/min/IP, sanitización,
  Resend con modo simulado sin API key, logs Pino con request-id/timing.
- **SEO/ATS:** SSG puro, JSON-LD Person+WebSite (con escape anti-breakout), hreflang
  absoluto, sitemap, robots.
- **Design system propio** (`design-system.md`): paleta paper/ink+pasteles del prototipo
  re-aplicada a layout editorial; Fraunces/Inter/JetBrains Mono; tokens en `@theme`.

## DoD — checklist (6+1)

- ✅ **Testing:** 29 unit/integration (parser, form, endpoint con Resend mockeado y
  negativos) + 9 e2e ×2 proyectos (happy path completo, reduced-motion, honeypot, rate
  limit, axe) — 18/18 verdes local. Cobertura `src/lib` ~90%.
- ✅ **CI/CD:** Actions verde completa en el PR #1 (typecheck+lint+tests+build+audit, e2e,
  lighthouse); preview Vercel por PR funcionando y probada por el usuario. 🟡 Branch
  protection en `main`: pendiente (acción del usuario en GitHub Settings).
- ✅ **Observabilidad:** Pino estructurado en el endpoint; Sentry activable por env (cliente
  lazy — sin DSN no descarga); eventos `home_visit`/`idioma_cambiado`/`app_card_clicked`/
  `solicitud_enviada`/`solicitud_fallida` en Vercel Analytics.
- ✅ **Seguridad:** gitleaks (hook del kit) + `pnpm audit` sin high/critical; rate limit por
  `x-real-ip` (no spoofeable) + honeypot + sanitización; secrets solo en env.
- ✅ **Performance:** gate Lighthouse de CI **verde** contra `perf-budget.json` con
  renegociación documentada (ADR-006): FCP ≤1500 y CLS ≤0.1 estrictos (CLS medido: 0);
  interactive 4000ms y LCP 3500ms renegociados (piso de hidratación Next/React y repaint
  del font-swap de Fraunces — contenido siempre visible desde FCP). Scripts ~230KB
  comprimido (budget 300KB).
- ✅ **UX/A11y:** axe AA limpio en `/es` y `/en` (e2e); teclado end-to-end (skip-link, toggle,
  form); `prefers-reduced-motion` verificado en e2e; 5 estados del form. 🟡 **Gate de
  revisión de diseño: pendiente aprobación visual del usuario sobre la preview.**
- ✅ **IA embebida:** N/A este sprint (S2).
- ✅ **Manual de uso:** `docs/MANUAL-DE-USO.md` — alimentar la CV Viva, agregar apps,
  idiomas, cómo llegan las solicitudes.

## Métricas técnicas

- HOME 100% desde `data/` en ES y EN ✅ (e2e lee los YAML — editar contenido no rompe nada)
- `curl /es` y `/en` devuelve todo el texto sin JS ✅ (e2e) · JSON-LD válido ✅
- App dummy en `apps.yaml` = card nueva sin código ✅ (test) · Reduced-motion e2e ✅
- Lighthouse en CI: ✅ budget verde (con ADR-006) · Email en producción: ✅ verificado por
  el usuario (Resend + env vars en Vercel; el email llegó a su bandeja)

## Decisiones no anticipadas

- **ADR-001:** Next 16.2.10 (el kit estampó 16; la orden decía 15) — aprobado por el usuario.
- **ADR-002:** Motion (framer-motion v12) sobre GSAP — LazyMotion ~tree-shaken.
- **ADR-004:** Vercel Hobby (uso personal no comercial OK); fallback Cloudflare Pages.
- **ADR-005:** next-intl con `[locale]` SSG + proxy.ts (convención nueva de Next 16).

## Bugs + resoluciones

1. **Contenido invisible con reduced-motion (encontrado por el e2e):** cambiar `m.div`→`div`
   al detectar reduce dejaba estilos inline huérfanos (`opacity:0`). Fix: el wrapper nunca
   cambia de forma + cinturón CSS `[data-motion]` para pre-hidratación.
2. **LCP dependía de JavaScript:** el hero animaba con framer al montar → titular invisible
   hasta hidratar. Fix: entradas above-the-fold en CSS puro (mismas specs).
3. **`perf-budget.json` del kit inválido:** la propiedad `_comment` hace fallar Lighthouse
   CI. Removida — **reportar al kit-app**.
4. zod en el bundle cliente (~50KB) vía validación del form → validación a mano en cliente,
   schema solo en el server.

## Qué salió bien / qué generó fricción

**Bien:** el orden motor→UI→e2e hizo que los gates de aceptación fueran tests desde el día 1;
la referencia de motion destilada (números exactos) eliminó decisiones de diseño en caliente;
los YAML con placeholders marcados desbloquearon la ingeniería sin contenido real.
**Fricción:** Lighthouse local inservible en laptop cargada (el gate debe vivir en CI);
carreras de hidratación en e2e (resueltas con marcador `data-hydrated`); la CLI nueva de
shadcn cambió flags (`-b` ya no es color).

## Sugerencias de mejora al método

1. El kit-app debería estampar `perf-budget.json` **sin `_comment`** (rompe lhci) y con los
   scripts `typecheck`/`test`/`test:e2e` ya en el package.json del scaffold.
2. Documentar en el kit que Lighthouse local es orientativo: el gate es el job de CI.
3. El patrón "m.div nunca cambia de forma + cinturón CSS reduced-motion" merece entrar a la
   wiki de patterns de la planeadora.

## Reportes al kit-app (para la retro — 4 bugs/incoherencias del scaffold)

1. `perf-budget.json` con `_comment` — propiedad que Lighthouse CI rechaza (CI rota siempre).
2. `ci.yml` fija pnpm 9 pero el scaffold estampa pnpm 11 (lockfile + `allowBuilds`).
3. `ci.yml` usa Node 20 pero pnpm 11 exige Node ≥22.13 (`node:sqlite`).
4. El budget default (interactive 3500 / LCP 2500) es inalcanzable para una página Next 16
   interactiva con fuente de marca bajo simulación móvil — sugerir TBT en vez de TTI y
   documentar el efecto del font-swap en LCP.

## Deuda técnica aceptada

- **Dark mode:** no existe (decisión del prototipo: light-first). Pago: cuando el usuario lo
  pida (registrada como deuda de diseño).
- **Contenido real:** placeholders `[PLACEHOLDER]` en `data/*.yaml` a la espera del
  inventario del usuario (gap #1 de la orden — no bloqueó ingeniería).
- **Rate limit en memoria por instancia** (serverless): suficiente a esta escala; revisar si
  hay abuso real (ADR-004).
- **Budgets renegociados (ADR-006):** interactive 4000ms / LCP 3500ms — techo, no licencia;
  re-evaluar cuando S2 agregue el chat (más JS cliente).

## Archivos clave (máx. 10)

1. `src/lib/schemas.ts` — contratos Zod del contenido y la solicitud
2. `src/lib/content.ts` — loader YAML fail-safe (build rompe si está malformado)
3. `src/components/motion/reveal.tsx` — primitivas de entrada + patrón reduced-motion
4. `src/components/motion/timeline-track.tsx` — rail SVG sincronizado
5. `src/app/[locale]/page.tsx` — HOME + JSON-LD
6. `src/app/api/solicitar-acceso/route.ts` — endpoint completo
7. `src/app/globals.css` — tokens `@theme` + animaciones CSS + cinturón reduced-motion
8. `data/cv.es.yaml` · `data/apps.yaml` — la fuente de contenido
9. `design-system.md` — fuente de verdad visual
10. `tests/e2e/home.spec.ts` — happy path del sprint

## Cómo probar

```bash
pnpm install && pnpm dev            # http://localhost:3000/es (y /en)
pnpm test                           # 29 unit/integration + cobertura
pnpm test:e2e                       # build prod + 18 e2e (chromium + Pixel 7)
# Romper data/cv.es.yaml a propósito → pnpm build falla con el campo exacto
# DevTools → Rendering → prefers-reduced-motion → todo visible sin animación
```
