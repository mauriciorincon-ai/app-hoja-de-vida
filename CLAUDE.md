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
impacto (S1) + profundidad y PDF ATS (S2) + chat con la HV (S3) + roadmap con votación real y
brochures por app (S4). **Ciclo H1 CERRADO — MVP funcional completo.** Desde S5 abre el ciclo
**H2: la VITRINA** — esta app es el DESTINO del portafolio a nivel de brochure re-expresado.
Principio rector: **simplicidad optimizada sin sacrificar impacto al visitante.**
Contrato de alcance: `portafolio/hoja-de-vida/VISION.md` (planeadora, aprobada 2026-07-04).

## Stack

- **Frontend:** Next.js 16 (ADR-001) + TypeScript strict + Tailwind v4 + shadcn/ui, **SSG-first** (todo el
  contenido en HTML estático — gate ATS/SEO), i18n por rutas `/es` `/en` (lib → ADR).
- **Backend/BD/Auth:** **Supabase desde S4** — votación anónima del roadmap (tabla `votes` + RPC
  `SECURITY DEFINER`, RLS encendida y sin políticas, GRANTs explícitos, cero PII; ADR-011). El
  otro endpoint sigue siendo el formulario → Resend (S1). Sin auth: no hay usuarios.
- **IA embebida:** **el chat con la HV, desde S3** — multi-proveedor vía Vercel AI SDK con
  **adapter conmutable por env** (Groq inicial · Gemini / Azure AI Foundry / Claude / self-host
  OpenAI-compatible), presupuesto runtime ≤ US$20/mes, guardrails + circuit breaker con fallback
  a búsqueda local (ADR-003 el adapter, ADR-010 el índice/retrieval). Patrón obligatorio: skill
  `ia-embebida`.
- **Tests:** Vitest (unit/integration) + Playwright (e2e) + Testing Library + @axe-core/playwright.
- **Deploy:** Vercel Hobby (preview por PR, prod desde `main`) — **hosting resuelto en ADR-004**
  (la cláusula no comercial de Hobby aplica y esta app es vitrina personal, no comercial).
  **Observabilidad:** Pino + Sentry + Vercel Analytics/PostHog.

## Estructura

```
src/
├─ app/[locale]/   (App Router, rutas /es /en)
├─ components/     (UI sin lógica de negocio; home/ · motion/ · forms/)
├─ engine/         (motores puros, sin side-effects, cobertura >80%)
├─ lib/            (content.ts · i18n.ts · resend.ts · analytics.ts)
│  ├─ ia/          (S3 — patrón IA-embebida: schemas · provider · retrieval · guardrails)
│  └─ votes/       (S4 — votación: schemas.ts · client.ts · roadmap.ts)
└─ types/
data/              (cv.es.yaml · cv.en.yaml · apps.yaml · historia/ — LA fuente de contenido)
content/vitrina/   (S5 — los brochure-export.json de las apps hermanas; NO se editan a mano)
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
   desde S3; nunca texto libre directo a la BD.
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
14. **Un gate se demuestra FALLANDO (regla dura del pipeline).** Todo gate nuevo que este repo
    agregue —job de CI, hook, aserción, umbral, script de verificación— nace con su **demo**: un
    cambio deliberado que lo pone en **rojo**, registrado en
    `sprints/SPRINT_NNN-implementation-log.md` (qué se cambió, en qué paso salió rojo, a quién
    nombró). Un gate que nunca se vio fallar no es un gate, es decorado — y decorado que da falsa
    tranquilidad (precedente: dos "todo bien" seguidos con una carnada floja de gitleaks,
    2026-07-15). **Y su hermana: un gate que nunca EJECUTÓ tampoco es un gate.** `skipped` no es
    verde: un job con `needs:` sobre otro que falló queda saltado y GitHub lo lista entre los
    requeridos **sin alarma**. Antes de cerrar, **cada check requerido debe tener conclusión propia
    `success`** (`gh pr checks`), y si uno corrió por primera vez en este PR se dice en el summary
    — sin histórico no puede afirmarse ni regresión ni no-regresión.
15. **El bundle publicable del design system es un ARTEFACTO DEL REPO (kit v1.17.0).**
    `design-sync/` se versiona aquí como **espejo 1:1** de lo publicado en Claude Design, con
    jerarquía fija: `design-system.md` (fuente de verdad) → `design-sync/` (bundle) → el proyecto
    remoto (**jamás se edita allá**). **Todo sprint que toque UI actualiza el bundle en su MISMO
    PR**; publicar puede esperar al cierre de ciclo, y así el cierre es un delta pequeño y nunca
    una reconstrucción.
16. **CERO ENLACES: la producción se MUESTRA, jamás se ENTREGA (regla dura del pipeline, F0 #8).**
    Ningún archivo de este repo público ni campo de GitHub contiene la URL de producción o de
    previews: ni el `README.md`, ni el campo About/website del repo, ni el `BLUEPRINT.html`
    (documenta dominio y protección como "qué ve quién sin sesión" **sin escribir la URL** — la URL
    exacta vive en la planeadora, que es privada), ni el manual, ni la guía (su campo de URL se
    llena EN USO), ni `package.json`. El CTA público es la **«lista de espera»** — sin promesa de
    otorgamiento. **La limpieza del campo homepage es RECURRENTE:** la GitHub App de Vercel lo
    reescribe tras cada deploy de producción — se re-verifica tras CADA merge a `main`, y JAMÁS se
    automatiza con un PAT de administración como secret en un repo público. Los documentos que
    NARRAN el barrido escriben los patrones **sin el literal** (clase de carácter, p. ej.
    `vercel[.]app`): un summary que cita el patrón tal cual rompe el grep. **El barrido corre sobre
    TODOS los archivos versionados** (jamás con include-list de extensiones):
    `git grep -nE "vercel[.]app|workers[.]dev|pages[.]dev" -- ':!pnpm-lock.yaml'`
    **Y todo comando que sea un gate viaja ENTRE BACKTICKS y se prueba copiándolo del RENDER**
    (kit v1.24.0): sin backticks el markdown come las barras invertidas y entrega un grep que no
    encuentra nada nunca — un gate muerto que pasa en verde para siempre.
17. **PRs de dependencias: máximo DOS abiertos y el lockfile NO se pelea (kit v1.24.0).**
    dependabot con techo real de 2 (limit 1 por ecosistema, todo agrupado). Se mergean **DE A UNO,
    dejando a dependabot REGENERAR** entre merges (`@dependabot rebase` puede no obedecer, y el
    hand-merge del lockfile le rompe el parser). Si un conflicto de lockfile TOCA resolverse a
    mano: la resolución **parte del lado que trae los bumps** y se verifica dependencia por
    dependencia que quedó la versión MÁS NUEVA de ambos lados — pnpm degrada en silencio y la CI
    pasa VERDE porque **ninguna puerta compara el resultado contra la INTENCIÓN del PR**: leer la
    salida del install ES el gate. `pnpm peers check` corre en `quality` (es lo único que ve un
    peer insatisfecho). Overrides: en `pnpm-workspace.yaml`, jamás en `package.json`.

## Estándares (los 6+1, gates en CI)

Testing · CI/CD · Observabilidad · Seguridad · Performance (contra `perf-budget.json`) · UX+A11y ·
**IA embebida responsable** (desde S3). Detalle canónico: `estandares/estandares.md` de la
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
