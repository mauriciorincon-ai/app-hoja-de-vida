# Sprint 001 — Bitácora de implementación (CV Viva)

> Orden: `portafolio/hoja-de-vida/ordenes/SPRINT_001-orden.md` (planeadora, READ-ONLY).
> Branch: `sprint-001/home-que-enamora`. Plan aprobado por el usuario el 2026-07-05.

## Desviación del plan

1. **Next.js 16.2.10 en vez de 15** — el kit-app estampó 16; downgrade sería churn sin beneficio.
   Aprobado por el usuario (2026-07-05). Detalle: `decisions/001-framework-next-16.md`.
2. **Tokens en `@theme` (Tailwind v4), no en `tailwind.config.ts`** — el scaffold trae Tailwind
   v4 CSS-first; ese archivo ya no existe en v4. Mismo resultado. Ver ADR-001 § Consequences.
3. **Dependencia `ai` v7 preinstalada por el kit** — no se usa este sprint (LLM es S2); queda en
   package.json sin importarse (no entra al bundle).
4. **`middleware.ts` → `proxy.ts`** — convención nueva de Next 16 (deprecation warning en build).

## 2026-07-05 — Fase 0: setup

- Branch `sprint-001/home-que-enamora` creado desde `main`.
- Migración `app/` → `src/app/` + paths `@/* → ./src/*`.
- Deps: `next-intl`, `motion`, `yaml`, `resend`, `@sentry/nextjs`, `@vercel/analytics`,
  `server-only`; dev: `@playwright/test`, `@vitest/coverage-v8`, `@vitejs/plugin-react`,
  `jsdom`, `@testing-library/jest-dom`. Builds nativos aprobados en `pnpm-workspace.yaml`
  (`@swc/core`, `@sentry/cli`, `@parcel/watcher`).
- Scripts que la CI exigía y no existían: `typecheck`, `test` (vitest+coverage), `test:e2e`.
- shadcn/ui inicializado (CLI v5: base radix, preset nova) + button/input/textarea/label/card.
  Nota: la CLI nueva ya no acepta `-b neutral` (ahora `-b` = base library radix|base).
- i18n next-intl: routing es/en (default es), `proxy.ts`, mensajes de chrome UI en
  `messages/{es,en}.json`, layout `[locale]` con Fraunces/Inter/JetBrains Mono (`next/font`,
  swap) + hreflang. Build verde: `/es` y `/en` prerenderizadas (● SSG).
- Tokens del prototipo portados a `@theme` en `globals.css`; variables semánticas de shadcn
  remapeadas a la paleta paper/ink (modo claro único; dark = deuda de diseño).
- `design-system.md` creado en la raíz (fuente de verdad visual).
- ADRs: 001 (Next 16), 002 (Motion/framer-motion v12), 004 (Vercel Hobby — cláusula no
  comercial verificada para uso personal), 005 (next-intl). 003 reservado para S2 (LLM).
- Configs de test: `vitest.config.ts` (jsdom, coverage v8 sobre `src/lib/**`, umbral 70%),
  `playwright.config.ts` (chromium + Pixel 7, webServer con build de producción).
- Smoke: `pnpm typecheck && pnpm lint && pnpm build` verdes. Commit `bc5a01b`.

### Pendiente inmediato

- ~~Fase 1~~ (completada, ver abajo).

## 2026-07-05 — Fases 1–3: motor, UI e integración

- **Fase 1 (motor):** schemas Zod (`cv`/`apps`/`solicitud` con honeypot), loader YAML fail-safe
  (build rompe con error legible), rate-limit ventana deslizante, `data/*.yaml` con placeholders
  marcados. 22 tests unit, >90% cobertura en `src/lib`.
- **Fase 2 (UI):** motion system (`Reveal`/`Stagger`/`Counter`/`TimelineTrack`, specs numéricas
  exactas de la referencia) + 6 secciones HOME + header con toggle ES/EN que conserva sección +
  formulario con 5 estados + 404/error localizados + JSON-LD + hreflang absoluto.
- **Fase 3 (integración):** endpoint `/api/solicitar-acceso` (Pino con request-id/timing,
  honeypot → 200 silencioso, rate limit 429, sanitización, Resend con modo simulado sin API
  key), sitemap/robots, 7 tests de integración del endpoint, 9 e2e × 2 proyectos
  (chromium + Pixel 7): happy path completo, reduced-motion, negativos de form y axe AA.
  **18/18 e2e + 29 unit/integration verdes.**

### Bug real encontrado por el e2e de reduced-motion (aprendizaje)

El patrón "si reduced → render `<div>` plano en vez de `m.div`" dejaba contenido **invisible**:
al hidratarse, `useReducedMotion` pasa de false (SSR) a true y React reutiliza el elemento sin
limpiar los estilos inline (`opacity:0`) que framer había aplicado, y el atributo `data-motion`
desaparecía junto con el cinturón CSS. Solución doble:

1. El componente motion **nunca cambia de forma**: siempre `m.div`; con reduce solo se omiten
   las props de animación.
2. Cinturón CSS en `globals.css`: `@media (prefers-reduced-motion: reduce) { [data-motion]
{ ... !important } }` cubre el HTML pre-hidratación (estado final desde el primer paint).

Otros ajustes por e2e/axe: contraste `ink-3`→`ink-2` en textos pequeños (AA), marcador
`data-hydrated` en el form para esperar hidratación en e2e, axe corre con reduced-motion
(estado final, no frames intermedios), alerts scopeados al form (el route-announcer de Next
también es `role=alert`).

## 2026-07-05 — Fase 4: calidad y cierre

- **Sentry** activable por env (server: `instrumentation.ts`; cliente: import dinámico solo si
  hay `NEXT_PUBLIC_SENTRY_DSN` — sin DSN el chunk ni se descarga). `.env.example` documenta
  todas las variables. `pnpm audit`: 0 high/critical (1 moderate en postcss transitivo).
- **Manual de uso** completo: alimentar la CV Viva (YAML), agregar apps, idiomas, solicitudes.
- **Bug del kit encontrado:** `perf-budget.json` traía `_comment`, propiedad que Lighthouse CI
  **rechaza** (la CI habría fallado siempre). Removido — reportar al kit-app en la retro.
- **Performance (hallazgos estructurales, corregidos):**
  1. El hero animaba con framer `onMount` → el LCP (titular) quedaba invisible hasta hidratar
     JS (LCP ~12s móvil throttled). **Fix:** entradas above-the-fold en CSS puro (`.anim-*` en
     globals.css, mismas specs numéricas) — el LCP pinta sin JavaScript.
  2. zod entraba al bundle del cliente vía la validación del form (~50KB + parse). **Fix:**
     validación client a mano; el schema zod queda solo en el endpoint (fuente de verdad).
  3. `AppsShowcase` era client component completo solo por un handler de tracking → toda la
     sección se hidrataba y serializaba ambos idiomas al flight payload. **Fix:** server
     component + `AppCardCta` client mínimo.
  4. `backdrop-blur` removido del header sticky (raster costoso en software rendering).
- **Lighthouse local NO concluyente:** esta laptop (Chrome del usuario + builds en paralelo)
  infla FCP/TBT hasta lo físicamente imposible para HTML estático servido por localhost
  (FCP 4.8s). Métricas desktop sin throttle: FCP 1.4s · LCP 2.2s · CLS 0. **El gate real es
  el job `lighthouse` de la CI** (runner limpio); si el budget `interactive ≤3500ms` fallara
  ahí, el plan B es reemplazar framer por IntersectionObserver nativo + CSS en los reveals
  de sección (la infraestructura `.anim-*` ya existe).
- e2e endurecidos: aserciones del toggle con timeout 15s (flake bajo 6 workers locales);
  aserción ATS por idioma (`CV Viva`/`Living CV`) — antes pasaba de chiripa porque el prop
  bilingüe completo viajaba serializado al cliente.
- **Suites finales: 29 unit/integration + 18/18 e2e verdes.**

## 2026-07-05 — PR #1 y primer run de CI

- PR #1 abierto por el usuario; Vercel ya conectado (check "Vercel Preview Comments" verde).
- **Segundo bug del kit:** `ci.yml` fija `pnpm/action-setup` a **pnpm 9**, pero el scaffold se
  estampó con pnpm 11 (lockfile + `allowBuilds` en `pnpm-workspace.yaml`, campos que pnpm 9 no
  reconoce) → `actions/setup-node` (cache pnpm) falló y todo el job quality cayó. Fix local:
  `version: 11`. **Reportar al kit-app junto con el de `perf-budget.json`.**
