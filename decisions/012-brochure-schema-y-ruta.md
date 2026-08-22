# ADR-012 — Brochure animada por app: schema y ruta SSG

- **Status:** accepted (2026-07-20)
- **Context:** Sprint 004 (branch `sprint-004/la-vitrina-completa`), pieza "brochure animada
  por app" de la VISION v1.1 (pedido directo del usuario).

## Context

La VISION v1.1 pide que "cada app no sea solo un link a GitHub: tiene su propia página tipo
brochure con animaciones que muestran sus funcionalidades en movimiento" (mismo motion system;
regla "solo lo real"). El schema de `apps.yaml` (ADR-007) describe la card del showcase pero no
el contenido rico de una página dedicada: hero, funcionalidades, métricas, stack.

## Decision

Extender `appsSchema` **aditivamente** con un campo opcional `brochure` por app (Zod `.strict()`,
como todo el pack S4):

- `brochure.tagline` (ES/EN) — subtítulo del hero.
- `brochure.intro` (ES/EN) — párrafo de apertura; **candidato LCP** de la página.
- `brochure.funcionalidades[]` — `{ titulo, descripcion }` bilingües, `.min(1)`; se muestran "en
  movimiento" con `Reveal`/`Stagger` bajo el fold.
- `brochure.metricas[]` — `{ valor, sufijo, etiqueta }`; cifras reales animadas con `Counter`.
- `brochure.stack[]` — strings universales (nombres de tecnología), no localizados (igual que
  `proyectos.stack`).

**La presencia de `brochure` da de alta la página** `/[locale]/apps/<id>` vía
`generateStaticParams` (data-driven, como el case study de ADR-009). **Solo se le pone `brochure`
a apps `en-produccion`** (funcionalidad real); las `en-exploracion` no tienen brochure — su lugar
es el roadmap. Es una regla de contenido, no del schema: el schema permite `brochure` en cualquier
estado, pero el contenido solo lo pone donde es honesto (documentado en el manual).

**Ruta 100% SSG.** El hero/candidato-LCP nace estático (sin wrapper de motion; patrón
`lcp-nace-estatico`); el motion JS vive bajo el fold; `prefers-reduced-motion` a doble cinturón
(el del motion system). Metadata con `alternates.languages` (es/en/x-default) + JSON-LD. Enlazada
desde la card del showcase; agregada a `sitemap.ts` y a las URLs de Lighthouse.

**CTA:** reutiliza el flujo existente — enlace a `/#contacto` (el formulario) + los `enlaces` de
la app (GitHub). No inventa un endpoint nuevo.

## Consequences

- Agregar una brochure = editar `apps.yaml` + push (cero código), consistente con "contenido =
  datos versionados". El build FALLA si el `brochure` está malformado (fail-safe).
- Las rutas nuevas son públicas ⇒ entran a la auditoría Lighthouse y a los budgets vigentes
  (LCP 3850, ADR-006). El hero estático las mantiene dentro del presupuesto.
- El builder del índice del chat (`build-chat-index.mjs`) ignora `brochure` (solo lee
  id/nombre/estado/descripcion) — sin impacto en el índice ni en la paridad ES/EN. Integrar los
  chunks de brochure al índice queda como opción futura declarada (no en este sprint: "cero IA
  nueva").
