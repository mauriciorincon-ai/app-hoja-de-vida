# CV Viva (app-hoja-de-vida) — constitución de la app (Claude Code)

> Auto-cargado en cada sesión de este repo. Esta app pertenece al pipeline **AI-APPs**; su plan
> vive en la casa planeadora. Estampada desde kit-app v1.0.0 el 2026-07-04 (Sprint 001).

## Las dos casas (regla dura)

| Casa           | Path                            | Escritor único   | Qué vive ahí                                                                     |
| -------------- | ------------------------------- | ---------------- | -------------------------------------------------------------------------------- |
| **Planeadora** | `C:\Code\hr01-develop-ai-apps\` | su propia sesión | brief, VISION, sprints (plan+retro), órdenes de construcción, método, estándares |
| **Esta app**   | este repo                       | **tú**           | código, tests, ADRs de implementación, bitácora y summary del sprint             |

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
7. **Secrets solo en `.env.local` (gitignored) y Vercel env vars.** Doble protección gitleaks: hook
   `pre-commit` de git (`githooks/`, commits manuales) + hook PreToolUse de Claude Code (escrituras
   del agente). Si un commit con secreto de prueba NO es bloqueado, el gate está muerto — repáralo
   antes de seguir. **Carnada canónica verificada (kit v1.6.3; viaja PARTIDA aquí para no disparar
   el hook al comitear este archivo): ármala concatenando `AWS_ACCESS_KEY_ID=` + `AKIAQ7RTZ4PX` +
   `KM2WNB3S` SOLO en el archivo de prueba del hook.** No improvises el secreto de prueba: las
   reglas modernas de gitleaks exigen alfabeto real (base32 tras `AKIA`) y entropía, y una carnada
   floja pasa en silencio dando falsa tranquilidad (lección 2026-07-15: dos falsos "todo bien"
   seguidos). Si gitleaks sube de versión mayor, re-verificar la carnada en sandbox.
8. **Presupuesto de esfuerzo:** ~12 pasos por pantalla; si lo excedes, detente y simplifica o consulta.
9. **Manual de uso vivo (`docs/MANUAL-DE-USO.md`, obligatorio).** Toda feature que llegue a `main`
   queda documentada ahí **en el mismo sprint**: qué hace, cómo se usa, y — clave en esta app —
   **cómo alimentar la CV Viva** (editar `data/*.yaml` + push). En español llano.
10. **Diseño vanguardista con gate (`design-system.md` + skill `diseno-ui`).** El sprint 1 crea el
    `design-system.md` desde los tokens del prototipo (READ-ONLY, ver abajo); toda pantalla lo
    obedece. Cada sprint con UI cierra con el checklist de revisión de diseño + aprobación visual
    del usuario sobre la preview. Enlazable a Claude Design vía `/design-sync`. **Al CERRAR un
    ciclo la publicación del design system consolidado es obligatoria** (ver § Cierre de CICLO).
11. **Guía de prueba viva y ACUMULATIVA (`docs/GUIA-DE-PRUEBA.html`, OBLIGATORIA en todo sprint
    con UI).** HTML **autocontenido** (cero CDNs; casillas en `localStorage` con **prefijo
    versionado por sprint**, para que una regresión sin correr jamás aparezca marcada por el sprint
    anterior): qué probar, cómo y qué resultado esperar, por bloques. **Es bola de nieve:** la
    última versión contiene **TODAS las pruebas vigentes**; el sprint N hereda ENTERAS las del N−1
    — jamás las resume en un "verificar que sigue funcionando" (comprimir borra la regresión). Cada
    prueba lleva su **origen en su línea** (`Nuevo · SN` · `Mejorado en SN` · `SN` = heredada ⇒
    regresión) con filtros por origen; una prueba solo se elimina si su feature dejó de existir,
    declarado en el historial del pie. Marca el **gate mínimo ⭐** (filtro propio, criterio FIJO):
    solo lo que ninguna automatización puede verificar — juicio humano sobre el contenido,
    aprobación visual, hardware real; lo que la CI ya respalda queda fuera. **Kit de prueba:** si un
    paso requiere documento/código/dataset, se entrega en `docs/kit-de-prueba/` enlazado desde su
    bloque.
12. **PROHIBIDO entregar por artifacts de Claude o cualquier plataforma externa.** Todo entregable
    —guías, reportes, documentos visuales— es un **archivo del repo** (HTML autocontenido o
    Markdown) que el usuario pueda abrir, versionar y llevarse. Sin excepciones, ni "para verlo
    rápido".
13. **Código primero, IA generativa después.** Toda funcionalidad nativa interna se resuelve
    PRIMERO con programación — código, librerías, algoritmos deterministas — antes de acudir a IA
    generativa. Activar una feature LLM exige un ADR que justifique por qué el código no alcanza.
    La IA es acento con fallback determinista, jamás columna vertebral.

## Estándares (los 6+1, gates en CI)

Testing · CI/CD · Observabilidad · Seguridad · Performance (contra `perf-budget.json`) · UX+A11y ·
**IA embebida responsable** (desde S2). Detalle canónico: `estandares/estandares.md` de la
planeadora (read-only). Ítem rojo ⇒ deuda técnica explícita en el summary o el sprint no cierra.

## Workflow de un sprint

**Apertura** — el usuario trae la **orden de construcción**
(`portafolio/hoja-de-vida/ordenes/SPRINT_NNN-orden.md` de la planeadora). Léela entera + sus
referencias (SPRINT_NNN.md, VISION.md, brief, prototipo y motion READ-ONLY).
**Plan mode primero, siempre.** **La aprobación del plan NO arranca la construcción** (gate de
arranque, kit v1.6.2): aprobado el plan, emite el **bloque de arranque** — tu recomendación de
**modelo y esfuerzo** para el sprint (por fase si difiere; el usuario los fija con `/model`) +
espacio para sus ajustes — y espera su **«construye»** explícito antes de tocar cualquier archivo.
El plan incluye SIEMPRE la sección **«Riesgos de integración con lo existente»** (kit v1.7.3) y la
fase 0 corre el **humo de credenciales** (kit v1.7.4) antes de construir contra ellas.
Branch `sprint-NNN/<tema>`.

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

**Cierre de CICLO (método v1.8.1 — cuando este sprint es el ÚLTIMO de un ciclo H1/fase/MVP; la
orden lo declara).** Además de la DoD del sprint, el ciclo entrega:

1. **`docs/BLUEPRINT.html`** — as-built de TODA la infraestructura que sostiene la app (plantilla
   `kit-app/docs/BLUEPRINT.plantilla.html`: **HTML autocontenido con diagrama SVG embebido**,
   jamás mermaid ni CDNs + tabla por pieza + **costo real/mes** desglosado + **punto único de
   falla**). Se escribe con lo DESPLEGADO de verdad, no con lo planeado; es **vivo y acumulativo**
   (el ciclo siguiente lo actualiza y declara los cambios en el historial del pie). Jamás incluye
   secretos ni URLs privadas de administración — solo qué gestor los guarda.
2. **Design system publicado en Claude Design** (`/design-sync`) — durante el ciclo es bajo
   demanda; al cierre, obligatorio.
3. **Guía de prueba ACUMULATIVA al día** (regla 11) + su kit de prueba.
4. **Gate ⭐ del usuario** sobre esa guía — cuando el ciclo acumula gates diferidos, el gate del
   cierre los paga y **jamás se difiere** (lo único pausable es el momento de ejecutarlo).

Todo ciclo tiene MÍNIMO 3 sprints (regla dura 2026-07-17).

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

## Outcome [¿Se logró el outcome del SPRINT_NNN.md? Sí/No/Parcial + 1 frase]

## Qué se construyó [features/pantallas/componentes]

## DoD — checklist [los 6+1 estándares, uno a uno, con evidencia breve]

## Métricas técnicas [cumplidas vs. no, del SPRINT_NNN.md]

## Decisiones no anticipadas [ADR-NNN: resumen]

## Bugs + resoluciones

## Qué salió bien / qué generó fricción

## Sugerencias de mejora al método [¿algo de metodo/metodo.md debería cambiar?]

## Deuda técnica aceptada [qué, por qué, sprint de pago]

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
