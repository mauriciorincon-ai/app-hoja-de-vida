# CV Viva (app-hoja-de-vida) — constitución de la app (Claude Code)

> Auto-cargado en cada sesión de este repo. Esta app pertenece al pipeline **AI-APPs**; su plan
> vive en la casa planeadora. Estampada desde kit-app v1.0.0 el 2026-07-04 (Sprint 001).

## Las dos casas (regla dura)

| Casa | Path | Escritor único | Qué vive ahí |
|---|---|---|---|
| **Planeadora** | `C:\Code\hr01-develop-ai-apps\` | su propia sesión | brief, VISION, sprints (plan+retro), órdenes de construcción, método, estándares |
| **Esta app** | este repo | **tú** | código, tests, ADRs de implementación, bitácora y summary del sprint |

- ✅ Puedes **leer** la planeadora (agregada como `additionalDirectories`, o por path absoluto).
- ❌ **Nunca escribes** en la planeadora. Si el plan necesita cambio, lo anotas en tu
  `sprints/SPRINT_NNN-implementation-log.md` bajo `## Desviación del plan` y avisas al usuario.
- El avance de implementación vive **solo aquí** — la planeadora te lee, tú no le reportas a mano.

## Qué es esta app

**CV Viva** — hoja de vida interactiva bilingüe (ES/EN): experiencia scroll-animada de alto
impacto + brochure de apps del pipeline + (S2) chat con la HV + (S3) roadmap con votación.
Principio rector: **simplicidad optimizada sin sacrificar impacto al visitante.**
Contrato de alcance: `portafolio/hoja-de-vida/VISION.md` (planeadora, aprobada 2026-07-04).

## Stack

- **Frontend:** Next.js 15 + TypeScript strict + Tailwind + shadcn/ui, **SSG-first** (todo el
  contenido en HTML estático — gate ATS/SEO), i18n por rutas `/es` `/en` (lib → ADR).
- **Backend/BD/Auth:** **ninguno en Sprint 1** (único endpoint: formulario → Resend). Supabase
  entra en S3 (votación anónima) — RLS desde la primera tabla cuando exista.
- **IA embebida:** **ninguna en Sprint 1.** En S2: chat multi-proveedor vía Vercel AI SDK con
  **adapter conmutable por env** (Azure AI Foundry / Claude API / Gemini / Groq / self-host
  OpenAI-compatible) — presupuesto runtime ≤ US$20/mes, guardrails + circuit breaker con
  fallback a búsqueda local. Patrón obligatorio: skill `ia-embebida`. El proveedor inicial se
  decide en ADR-003 (S2) con precios vigentes.
- **Tests:** Vitest (unit/integration) + Playwright (e2e) + Testing Library + @axe-core/playwright.
- **Deploy:** Vercel (preview por PR, prod desde `main`; ⚠ verificar cláusula no comercial de
  Hobby en ADR de hosting — alternativa: Cloudflare Pages). **Observabilidad:** Pino + Sentry +
  Vercel Analytics/PostHog.

## Estructura

```
src/
├─ app/[locale]/   (App Router, rutas /es /en)
├─ components/     (UI sin lógica de negocio; home/ · motion/ · forms/)
├─ engine/         (motores puros, sin side-effects, cobertura >80%)
├─ lib/            (content.ts · i18n.ts · resend.ts · analytics.ts)
│  └─ ia/          (S2 — patrón IA-embebida: schemas.ts · client.ts · guardrails.ts · persist.ts)
└─ types/
data/              (cv.es.yaml · cv.en.yaml · apps.yaml — LA fuente de contenido)
tests/{unit,integration,e2e}/
design-system.md          (fuente de verdad visual — se crea en el sprint 1, skill diseno-ui)
docs/MANUAL-DE-USO.md     (manual de uso general — OBLIGATORIO, vivo desde el sprint 1)
sprints/SPRINT_NNN-implementation-log.md · SPRINT_NNN-summary.md
decisions/NNN-titulo.md   (ADRs de implementación)
```

## Reglas de desarrollo

1. **TypeScript strict.** Sin `any` ni `@ts-ignore` sin justificación en comentario.
2. **Tests con cada feature.** Motores puros >80%, UI >50%, ≥1 e2e por feature core.
3. **Motor separado de UI.** Lógica pura en `engine/`/`lib/`; componentes sin lógica de negocio.
4. **Toda salida de LLM que se persista pasa por esquema Zod** (skill `ia-embebida`) — aplica
   desde S2; nunca texto libre directo a la BD.
5. **A11y desde el inicio:** tabindex, aria-labels, contraste AA, `prefers-reduced-motion`.
6. **Commits convencionales**; branch `sprint-NNN/<tema>`; **jamás push directo a `main`** (hook lo
   bloquea); PR con CI verde + preview probado.
7. **Secrets solo en `.env.local` (gitignored) y Vercel env vars** (hook gitleaks bloquea fugas).
8. **Presupuesto de esfuerzo:** ~12 pasos por pantalla; si lo excedes, detente y simplifica o consulta.
9. **Manual de uso vivo (`docs/MANUAL-DE-USO.md`, obligatorio).** Toda feature que llegue a `main`
   queda documentada ahí **en el mismo sprint**: qué hace, cómo se usa, y — clave en esta app —
   **cómo alimentar la CV Viva** (editar `data/*.yaml` + push). En español llano.
10. **Diseño vanguardista con gate (`design-system.md` + skill `diseno-ui`).** El sprint 1 crea el
   `design-system.md` desde los tokens del prototipo (READ-ONLY, ver abajo); toda pantalla lo
   obedece. Cada sprint con UI cierra con el checklist de revisión de diseño + aprobación visual
   del usuario sobre la preview. Enlazable a Claude Design vía `/design-sync`.

## Estándares (los 6+1, gates en CI)

Testing · CI/CD · Observabilidad · Seguridad · Performance (contra `perf-budget.json`) · UX+A11y ·
**IA embebida responsable** (desde S2). Detalle canónico: `estandares/estandares.md` de la
planeadora (read-only). Ítem rojo ⇒ deuda técnica explícita en el summary o el sprint no cierra.

## Workflow de un sprint

**Apertura** — el usuario trae la **orden de construcción**
(`portafolio/hoja-de-vida/ordenes/SPRINT_NNN-orden.md` de la planeadora). Léela entera + sus
referencias (SPRINT_NNN.md, VISION.md, brief, prototipo y motion READ-ONLY).
**Plan mode primero, siempre.** Branch `sprint-NNN/<tema>`.

**Durante** — construye por fases (setup → motor → UI → integración → e2e). Mantén viva la
bitácora `sprints/SPRINT_NNN-implementation-log.md`. ADRs en `decisions/` para decisiones no
anticipadas. `/self-review` tras cada bloque; `/run-tests` frecuente.

**Referencias READ-ONLY de la planeadora (regla de extracción):**
- `referencias-ui/hoja-de-vida/HV Web/design-system.md` → **SÍ**: paleta pastel editorial,
  tipografía (Fraunces/Inter/JetBrains Mono), radios, sombras, microcopy sobrio.
  **NO**: el layout dashboard 3-columnas del prototipo (concepto viejo — CV Viva es scroll
  editorial mobile-first).
- `referencias-ui/hoja-de-vida/motion/` → **SÍ**: `motion-vocabulary.md` + recetas 01/02/09/10
  como spec numérica de `Reveal`/`Counter`/`TimelineTrack`/`Hero` (leer `LEEME-DESTILACION.md`).
  **NO**: three.js/WebGL, animaciones infinitas, andamiaje de deck, CDNs (libs por npm).
- ❌ Nunca importes archivos ni copies código tal cual ni heredes gaps (testing/a11y/perf).

**Cierre — summary OBLIGATORIO.** Con la DoD completa: `/deploy-check` → genera
`sprints/SPRINT_NNN-summary.md` (plantilla abajo) → PR → merge con CI verde. **Sin summary el
sprint NO está cerrado** (es lo que la planeadora lee para la retrospectiva).

### Plantilla del summary

```markdown
---
sprint: NNN
app: hoja-de-vida
status: closed
opened: YYYY-MM-DD
closed: YYYY-MM-DD
branch: sprint-NNN/<tema>
pr: <link>
---
# Sprint NNN Summary — CV Viva
## Outcome            [¿Se logró el outcome del SPRINT_NNN.md? Sí/No/Parcial + 1 frase]
## Qué se construyó   [features/pantallas/componentes]
## DoD — checklist    [los 6+1 estándares, uno a uno, con evidencia breve]
## Métricas técnicas  [cumplidas vs. no, del SPRINT_NNN.md]
## Decisiones no anticipadas  [ADR-NNN: resumen]
## Bugs + resoluciones
## Qué salió bien / qué generó fricción
## Sugerencias de mejora al método  [¿algo de metodo/metodo.md debería cambiar?]
## Deuda técnica aceptada  [qué, por qué, sprint de pago]
## Archivos clave (máx. 10) · ## Cómo probar
```

## Patrones de dominio de esta app

- **Contenido = datos versionados.** TODO el contenido vive en `data/cv.es.yaml`, `data/cv.en.yaml`
  y `data/apps.yaml`, validado con Zod en build (**el build FALLA si el contenido está
  malformado** — fail-safe). Editar YAML + push = la CV Viva se actualiza. Ningún texto de
  contenido hardcodeado en componentes.
- **Motion system central en `src/components/motion/`** (`Reveal`, `Stagger`, `Counter`,
  `TimelineTrack`): specs numéricas de la referencia destilada; hook global de
  `prefers-reduced-motion` sin excepciones; solo `transform`/`opacity` en animaciones de scroll;
  performance vigilada por Lighthouse CI (las animaciones no negocian el budget).
- **Bilingüe estructural:** cada entrada de contenido existe en ES y EN; rutas `/es` `/en` +
  hreflang; el idioma jamás se resuelve con strings sueltos en componentes.
- **ATS/SEO como gate:** `curl` de cualquier ruta devuelve el contenido íntegro sin JS; JSON-LD
  (`Person`, `WebSite`) válido; sitemap + robots generados.
- **Showcase data-driven:** agregar/cambiar una app del pipeline en el brochure = editar
  `data/apps.yaml` (estados: en construcción / en exploración), cero cambios de código.

## Idioma

Español en conversación y bitácoras. Inglés en código, commits, nombres y ADRs.
El contenido de la app es bilingüe ES/EN (vive en `data/`, no en el código).
