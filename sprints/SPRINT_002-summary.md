---
sprint: 002
app: hoja-de-vida
status: closed
opened: 2026-07-05
closed: 2026-07-05
branch: sprint-002/profundidad
pr: https://github.com/mauriciorincon-ai/app-hoja-de-vida/pull/3
---

# Sprint 002 Summary — CV Viva

## Outcome

**Sí.** Un reclutador puede, sin contactar a nadie: (a) expandir cualquier hito del timeline
y leer los logros completos con métricas; (b) abrir cualquiera de los 5 case studies en su
URL propia, en ES o EN; (c) descargar un PDF ATS-parseable generado de los mismos YAML que
la web; (d) ver Perfil, Certificaciones y Skills en la HOME — todo en HTML estático y con el
motion system existente.

## Qué se construyó

- **Disclosure inline en el timeline:** botón "Ver logros completos" por hito (8 roles con
  bullets reales); patrón disclosure accesible (aria-expanded/controls, teclado); bullets
  siempre en el HTML (gate ATS) con colapso solo visual; evento `hito_expandido`.
- **5 páginas de case study** `/{locale}/proyectos/<slug>` (template único, data-driven:
  proyecto con `casestudy` en YAML = página automática): narrativa contexto → reto → qué
  hice → impacto, JSON-LD Article+BreadcrumbList, hreflang, sitemap, breadcrumb, tracker.
- **Secciones nuevas de la HOME:** Perfil, Skills (4 grupos), Certificaciones (con espacio
  `verificacion:` listo para los links Credly/Learn).
- **`/cv` imprimible + PDF ATS:** `scripts/generate-cv-pdf.mjs` (pdfkit, ADR-008) corre en
  cada build y produce `Henry-Rincon-CV-{ES,EN}.pdf`; CTA "CV (PDF)" fijo en el header,
  botón en `/cv`, link en Contacto; evento `cv_descargado`.
- **Schema Zod extendido** (aditivo): `bullets[]`, `slug`, `casestudy{...}` — el build sigue
  fallando con contenido malformado; paridad ES/EN vigilada por tests.
- Delta kit v1.1.0 pagado: hook `pre-commit` gitleaks activado (`githooks/` +
  `core.hooksPath`).

## DoD — checklist (6+1)

- ✅ **Testing:** 42 unit/integration (schema, paridad capa 2, PDF generado + texto extraído
  con pdf-parse) + 46 e2e (disclosure con teclado, detalle ES/EN + 404, descarga PDF
  200/application/pdf, ATS de rutas nuevas) — todo verde local y en CI.
- ✅ **CI/CD:** pipeline verde; Lighthouse ahora audita también `/es/proyectos/vesting` y
  `/es/cv`; ruleset `protect-main` verificada por API (checks quality/e2e/lighthouse
  requeridos — el pendiente del S1 ya estaba resuelto).
- ✅ **Observabilidad:** eventos `hito_expandido`, `proyecto_detalle_visto`, `cv_descargado`
  (Vercel Analytics, patrón existente).
- ⚠ **Seguridad:** sin superficies nuevas (cero endpoints); audit sin high/critical (queda
  1 moderate transitiva preexistente: postcss vía @sentry/nextjs>next). Hook pre-commit
  gitleaks ACTIVO pero **gitleaks no está instalado en la máquina del usuario** — el hook
  avisa sin escanear hasta que corra `winget install Gitleaks.Gitleaks` (pendiente usuario).
- ✅ **Performance:** budget ADR-006 también en rutas nuevas (CI verde); el PDF es asset
  estático (no entra al bundle).
- ✅ **UX/A11y:** axe AA limpio en 6 rutas; disclosure por teclado; reduced-motion verificado
  en e2e también para disclosure y detalle; gate de diseño con visto bueno visual del
  usuario sobre la preview.
- ✅ **IA embebida:** N/A (S3).
- ✅ **Manual de uso:** 4 features nuevas documentadas (bullets, case studies cero-código,
  verificación de certs, PDF autoactualizable).

## Métricas técnicas

- 22 páginas SSG (antes 6) + 2 PDFs por build; 42 unit/integration + 46 e2e (antes 33+18).
- Cobertura src/lib: 89% statements (umbral 70%).

## Decisiones no anticipadas

- **ADR-008 (PDF):** pdfkit en script de build con Helvetica estándar y sanitizador WinAnsi;
  rechazados @react-pdf/renderer y Chrome headless. _(La orden lo numeraba ADR-007, ya
  ocupado por las extensiones del content pack — desviación de numeración.)_
- **ADR-009 (formato):** casestudy como YAML estructurado de 4 campos, no MDX — conserva la
  validación Zod y el criterio "agregar case study = editar YAML".

## Bugs + resoluciones

- pdfjs-dist (pdf-parse) referencia `DOMMatrix` al evaluar el módulo y jsdom/node no lo
  traen → stub mínimo en el test (la extracción de texto no usa canvas) + entorno node.
- El botón del disclosure cambia de accessible name al expandirse → el e2e localiza por
  `aria-controls` estable, no por nombre.
- axe en la HOME (ahora más pesada) excede 30s bajo 5 workers → `test.slow()`; navegación
  client-side lenta bajo carga → timeout 15s (patrón heredado del S1).
- **Gate Lighthouse en rutas nuevas (2 iteraciones de CI):**
  - LCP 3.6–4.1s en el detalle: el elemento LCP resultó ser el **párrafo de Contexto**
    dentro de un `Reveal` (opacity 0 hasta hidratación, elementRenderDelay ~8s en el
    breakdown) — no el h1 como se asumió primero. Fix: Contexto/Reto estáticos, motion
    solo bajo el fold.
  - CLS 0.125 en `/cv`: JetBrains Mono sin preload + uso ESTRUCTURAL en esa ruta → el swap
    tardío reacomodaba la página. Fix: `display: "optional"` (patrón ADR-006). CLS → 0.
- **Gate de diseño (2 rondas de feedback):** los bloques `overflow-hidden` del mask con
  leading 1.02 recortaban los descendentes (y, g) del titular — leading 1.12 + colchón
  `pb-[0.1em]/-mb-[0.1em]` en la ventana de recorte + keyframe a 120% para que el texto
  oculto no se asome. Y el intento de perfil a 2 columnas fue rechazado por el usuario:
  quería UNA columna a todo el ancho — preguntar antes de "mejorar" de más.

## Qué salió bien / qué generó fricción

- **Bien:** el adelanto del content pack (perfil/certs/skills ya en YAML validado) dejó las
  secciones nuevas como trabajo de solo-render; el patrón "contenido = datos" hizo que los
  case studies y el PDF salieran de la misma fuente sin duplicación; EN traducido junto al
  ES eliminó el riesgo #1 del sprint.
- **Bien (2):** el gate de Lighthouse en CI **funcionó como diseñado** — cazó dos
  regresiones reales de performance en rutas nuevas antes de producción; y el breakdown
  de LCP de Lighthouse (elemento + fases) diagnosticó la causa raíz en una iteración.
- **Fricción:** el ecosistema pdfjs en test runners (polyfills DOM); una vulnerabilidad
  moderate transitiva sin fix disponible aguas arriba; lhci/lighthouse local en Windows
  muere con EPERM al limpiar temporales (el JSON del reporte sí queda — extraer de ahí).

## Sugerencias de mejora al método

- La orden asumía numeración de ADRs que el repo ya había consumido — sugerencia: las
  órdenes referencien ADRs por tema ("el ADR del PDF") y no por número, o la planeadora lea
  `decisions/` antes de emitir.
- "Traducción EN al final" como mitigación de riesgo resultó peor que traducir en línea
  (los tests de paridad rompen con EN incompleto); si el builder es un LLM, traducir junto
  al origen cuesta ~0 y elimina el riesgo — candidato a regla del método.
- **Patrones candidatos a la wiki (los mejores aprendizajes del sprint):**
  1. **"Todo candidato LCP nace estático"** — regla operativa para CADA ruta nueva:
     identificar el bloque de texto/imagen más grande del viewport móvil y prohibirle
     envolturas que arranquen en opacity 0 (Reveal/mask). En S1 fue el resumen del hero;
     en S2 reapareció DOS veces (h1 y párrafo de Contexto del detalle). Es sistémico, no
     anecdótico: merece checklist en la orden de construcción.
  2. **Una fuente con `display: swap` sin preload es deuda de CLS latente** — explota en
     cuanto una ruta la usa como fuente de layout (mono en /cv) y no solo de acentos. La
     tríada estable del repo: fuente de marca swap (identidad) + resto optional.
  3. **Bloques `overflow-hidden` para mask reveals recortan descendentes** con leading
     apretado (<1.12 aprox. en Fraunces): revisar y/g/p en el gate visual, o dejar el
     colchón pb/-mb de fábrica en el componente.

## Deuda técnica aceptada

- gitleaks sin instalar en la máquina del usuario (hook degradado a aviso) — pago: usuario,
  `winget install Gitleaks.Gitleaks`, esta semana.
- 1 moderate transitiva (postcss) — pago: cuando Next/Sentry publiquen el bump.
- `verificacion:` de certificaciones vacío ([AJUSTAR-LUEGO] del pack) — pago: cuando el
  usuario entregue los links.
- Nav del header solo desktop (heredada del S1) — pago: S3 si el feedback lo pide.

## Archivos clave (máx. 10)

- `src/lib/schemas.ts` · `data/cv.es.yaml` · `data/cv.en.yaml`
- `scripts/generate-cv-pdf.mjs` · `tests/integration/cv-pdf.test.ts`
- `src/components/motion/timeline-track.tsx` (disclosure)
- `src/app/[locale]/proyectos/[slug]/page.tsx` · `src/app/[locale]/cv/page.tsx`
- `src/components/home/{perfil,skills,certificaciones}.tsx`
- `decisions/008-pdf-strategy.md` + `decisions/009-casestudy-format-yaml.md`

## Cómo probar

1. `pnpm build && pnpm start` → `/es`: expandir hitos (mouse y Tab+Enter), ver Perfil/
   Skills/Certificaciones.
2. `/es/proyectos/vesting` (y los otros 4) en ES/EN; toggle de idioma conserva la ruta;
   slug falso → 404.
3. Botón "CV (PDF)" del header o `/es/cv` → abrir el PDF → seleccionar y copiar texto.
4. Romper un `casestudy:` en el YAML → `pnpm build` falla con diagnóstico.
5. Suite: `pnpm typecheck && pnpm lint && pnpm test && pnpm test:e2e`.
