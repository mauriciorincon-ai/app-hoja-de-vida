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

- Fase 1: schemas Zod + loader YAML fail-safe + `data/*.yaml` placeholder marcado + rate-limit
  - tests unit.
