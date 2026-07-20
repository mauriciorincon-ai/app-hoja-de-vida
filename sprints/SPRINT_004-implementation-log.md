# Sprint 004 — Bitácora de implementación

**Branch:** `sprint-004/la-vitrina-completa` (nace de `main` `04bfb65`)
**Orden:** `portafolio/hoja-de-vida/ordenes/SPRINT_004-orden.md` (planeadora, RO)
**Plan aprobado:** 2026-07-20 · **«construye»** recibido tras fijar modelo Opus 4.8 [1m]
**Ciclo:** sprint 4 de 4 — **ÚLTIMO del ciclo H1 (CIERRE DE CICLO)**

## Desviación del plan

_(sin desviaciones al momento — se anotan aquí con fecha si aparecen)_

## Decisiones de diseño tomadas en el plan (aprobadas)

1. **Roadmap = sección `#roadmap` en la HOME**, no página propia (la orden permitía ambas):
   menos superficie nueva de Lighthouse, el nav ya es de anclas, y el roadmap gana visibilidad
   de visitantes. La votación es una isla client mínima bajo el fold.
2. **Brochures solo para las 2 apps `en-produccion`** (`hoja-de-vida`, `chat-hoja-de-vida`) —
   regla "solo lo real". Las `en-exploracion` viven en el roadmap, no tienen brochure.
3. **Chunks de brochure al índice del chat: NO** (opcional que la orden dejaba al builder).
   Mantiene "cero IA nueva" y evita re-verificar el estándar 7. Verificado en el código: el
   builder solo lee `id/nombre/estado/descripcion` de `apps.yaml` (`build-chat-index.mjs`
   L206-213), así que los campos nuevos se ignoran sin romper el build ni la paridad.
4. **`appsSchema` pasa a `.strict()`** — hoy Zod hace strip silencioso de claves desconocidas:
   un typo en el YAML se tragaría sin fallar. Con `.strict()` el build es fail-safe de verdad.
5. **CI:** job nuevo `integration` (Supabase local + dbtests) → se añade a la ruleset
   `main-protegida` en este mismo sprint (regla 2026-07-10).
6. **Contadores honestos:** la sección SSG no embebe conteos; la isla los pide al montar y
   muestra lo que devuelve la RPC. Fallo ⇒ "votación no disponible" + botones deshabilitados.
   Jamás optimistic UI.

## Fase 0 — Setup, deltas del kit y humo de credenciales

### Deltas del kit aplicados (v1.6.2 → v1.7.4)

| Delta           | Archivo                                                                          | Qué entró                                                                                                               |
| --------------- | -------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------- |
| v1.6.2          | `CLAUDE.md` § Workflow · `.claude/commands/plan-sprint.md` (pasos 7+8)           | Gate de arranque: aprobar ≠ arrancar; bloque de modelo/esfuerzo + espera de «construye»                                 |
| v1.6.3 / v1.7.3 | `CLAUDE.md` regla 7                                                              | Carnada canónica **PARTIDA** (se arma solo en el archivo de prueba) + doble hook + "si no bloquea, el gate está muerto" |
| v1.6.4          | `.claude/skills/testing-patterns.md`                                             | Sección **e2e con BD real (Supabase) en CI** — los 4 antídotos K3–K6 + strict-mode por proyecto + nube temprana         |
| v1.7.1          | `CLAUDE.md` § Cierre de CICLO + regla 10                                         | Bloque de cierre de ciclo: BLUEPRINT.html + design-sync + guía + gate ⭐ que no se difiere                              |
| v1.7.2          | `.claude/skills/testing-patterns.md` (reglas 6–8) · `.claude/skills/repo-app.md` | Anti-flakiness CommonJS/`role=alert`/checkbox async + **Lighthouse solo audita páginas públicas** (devtools descartado) |
| v1.7.3          | `.claude/skills/testing-patterns.md` (regla 9) · `plan-sprint.md` (paso 4)       | Pantalla cubierta ⇒ suite entera en su fase + § riesgos de integración obligatoria en el plan                           |
| v1.7.4          | `.claude/skills/ia-embebida.md` (§7 y §8) · `plan-sprint.md` (fase 0)            | Humo del proveedor real día 0 + el mock es proveedor de primera clase (jamás intercept de red)                          |

**Extra aplicado (no estaba en la lista de 7, se declara):** reglas **11, 12 y 13** del CLAUDE.md
del kit (guía de prueba acumulativa · prohibido entregar por artifacts · código primero) — el repo
se estampó desde kit v1.0.0 y nunca las recibió; este sprint entrega la primera guía acumulativa,
así que la regla que la gobierna debe vivir en la constitución de la app.

### Humo del hook gitleaks

Carnada canónica armada por concatenación **solo en un archivo temporal de prueba** (nunca escrita
armada en un archivo del repo). `git commit` → **BLOQUEADO** (`leaks found: 1`, gitleaks 8.30.1).
Archivo de prueba eliminado del working tree tras verificar. El gate está vivo.

### Setup de Supabase local — dos quirks resueltos (impuesto de primera vez del Mac)

1. **Conflicto de puertos:** el stack de `app-inmobiliaria` ya corría y ocupaba los puertos 5432x
   por defecto. No se detiene otro proyecto — este proyecto usa su propio juego de puertos
   (**+100**: api 54421 · db 54422 · shadow 54420 · pooler 54429 · studio 54423 · smtp 54424).
   Documentado en `supabase/config.toml`. En CI no hay conflicto (un solo stack), los puertos
   custom son inocuos.
2. **`vector` no arranca sobre Colima/virtiofs:** el contenedor de logs de analytics monta el
   socket de Docker y falla con `mkdir …docker.sock: operation not supported`. **Fix:**
   `[analytics] enabled = false` — Logflare no hace falta para la votación (solo db + api).
   Quirk NUEVO (no estaba en el patrón `supabase-en-ci-y-cloud`): candidato a destilación.

Humo local: `curl .../rest/v1/` con la anon key local → **200**. Stack operativo.

## Fase 1 — Capa de datos (Supabase: tabla votes + RPC atómico)

**Migración** `supabase/migrations/20260720120000_votes.sql`:

- Tabla `votes (id, app, feature, created_at)` — **CERO PII** (Ley 1581); checks de forma/longitud
  del slug en la BD. El conteo es `COUNT(*)` agregado, no un contador mutable (sin carrera de
  escritura, histórico intacto).
- **RLS encendida y SIN políticas** — ningún rol del Data API toca la tabla directo.
- RPC `emitir_voto(p_app, p_feature)` **SECURITY DEFINER**: inserta y devuelve el conteo REAL en la
  misma transacción (jamás optimistic UI). RPC `conteo_votos()` STABLE: agregado (app, feature,
  total) para pintar los contadores.
- **GRANTs/REVOKEs explícitos (antídoto K3–K6):** anon solo `EXECUTE` de las dos RPC; `REVOKE ALL`
  de la tabla a anon/authenticated; service_role con acceso pleno explícito.

**Superficie de acceso verificada en local (la prueba doblemente invisible de inmobiliaria):**

| Acción del anon                       | Resultado                   |
| ------------------------------------- | --------------------------- |
| `rpc/emitir_voto` ×2 misma feature    | `1`, luego `2` (atómico)    |
| `rpc/conteo_votos`                    | `[{app,feature,total:2}]`   |
| `GET /rest/v1/votes` (tabla directa)  | `42501 permission denied` ✓ |
| `POST /rest/v1/votes` (tabla directa) | `42501 permission denied` ✓ |
| `rpc/emitir_voto` con slug inválido   | `22023 app inválida` ✓      |

**Cliente** `src/lib/votes/{schemas,client}.ts` (server-only): Zod `.strict()` en input y en la
respuesta de la RPC; `VotesUnavailableError` cuando falta config o la BD falla (el route lo traduce
a "votación no disponible", nunca a un cero inventado); `votacionEnabled()` respeta
`VOTACION_ENABLED`.

**Tests:** 10 unit (`tests/unit/votes-client.test.ts`, cliente Supabase falso) + **5 dbtest contra
Postgres real** (`tests/integration/votes-client.dbtest.ts`, aserciones relativas N→N+1 incl.
10 votos concurrentes atómicos). Patrón `*.dbtest.ts` + `vitest.db.config.ts` + script `test:db`
separan la suite de BD de la de `quality` (sin BD). `pnpm typecheck` limpio.

## Fase 2 — Roadmap + votación

**Contenido** (`data/apps.yaml`): campo `roadmap:` por app (id + titulo/descripcion ES+EN).
`hoja-de-vida` estrena 5 features del buzón de la VISION (mapa C4, máquina del tiempo, sello de
verificación, selector de audiencia, PWA offline); `chat-hoja-de-vida` 2 (embeddings, memoria).
Las apps `en-exploracion` no tienen roadmap ⇒ no aparecen en la votación. **Contenido inicial —
el usuario lo cura en el gate ⭐.**

**Schema** (`src/lib/schemas.ts`): `appsSchema` entero pasa a **`.strict()`** (antes hacía strip
silencioso — un typo se tragaba; ahora el build falla). Nuevo `roadmapFeature` (slug + textos
bilingües). El par (app.id, feature.id) es la clave del voto. `RoadmapFeature` exportado.

**Route handlers** (patrón de solicitar-acceso: requestId + Pino + rate limit namespaced + Zod):

- `POST /api/roadmap/votar` — kill-switch → rate limit `vote:${ip}` (12/min, apagable con
  `DISABLE_RATE_LIMIT=1` solo en CI, leído por request) → Zod `.strict()` → `esFeatureValida`
  contra el YAML → RPC. Devuelve el `total` REAL de la BD. BD caída ⇒ 503, jamás conteo inventado.
- `GET /api/roadmap/votos` — `force-dynamic` + `cache-control: no-store`: el conteo siempre sale
  de la BD, nunca de un ISR congelado. Sin config/BD ⇒ 503.
- `src/lib/votes/roadmap.ts` (server-only): `appsConRoadmap`/`esFeatureValida`/`paresVotables`
  derivan del contenido — fuente única de "qué es votable".

**UI:** sección server `#roadmap` (`src/components/home/roadmap.tsx`) con encabezado + títulos y
descripciones de cada feature en HTML **estático** (ATS/SEO/LCP); isla client `RoadmapVoting`
(conteos reales al montar, estados votable/ya-votaste/no-disponible/rate-limited, dedup
`localStorage` prefijo `cvviva:voto:s004:`, teclado, `aria-label` por feature). Nav gana `roadmap`
(ES/EN). Eventos analytics `roadmap_visto`/`voto_emitido`/`voto_rechazado` (+ `brochure_vista`).

**Verificación del contador honesto (gate de producto):** build de prod SIN env de Supabase →
`curl /es` y `/en` traen los títulos de features en el HTML estático; `GET /votos` y `POST /votar`
devuelven **503** (la UI mostrará "no disponible", nunca un cero). Confirmado end-to-end.

**Tests F2:** 8 schema nuevos (roadmap + `.strict()`) · 3 unit de `roadmap.ts` · 11 integration
del route (cliente mockeado: happy/503/400×3/429/rate-off) · 2 dbtest del route (punta a punta
contra Postgres real). `home.spec` extendido (regla 9): sección roadmap en el recorrido, conteo
data-driven de features, títulos en HTML estático — **8/8 verde en chromium + mobile**. Suite
`quality` completa: 89% cobertura. typecheck + lint limpios.

**Pendiente de F4 (declarado):** el e2e interactivo de votación (votar→contador sube; BD caída
forzada→botones off) necesita el webServer de Playwright con Supabase local — va con el job
`integration` de CI en la fase 4.

## Fase 3 — Brochures animadas por app

**Schema + ADR-012** (`decisions/012-brochure-schema-y-ruta.md`): campo `brochure` opcional en cada
app (`.strict()`): `tagline`/`intro` (ES/EN), `funcionalidades[]` (`.min(1)`), `metricas[]`
(valor+sufijo+etiqueta, cifras reales), `stack[]`. Su presencia da de alta la página. `Brochure`
exportado.

**Contenido** (`data/apps.yaml`): brochure para las **2 apps `en-produccion`** (`hoja-de-vida`,
`chat-hoja-de-vida`) — funcionalidades, métricas verificables y stack reales. Las `en-exploracion`
NO tienen brochure (regla "solo lo real").

**Página SSG** `/[locale]/apps/[slug]` (`src/app/[locale]/apps/[slug]/page.tsx`): template único
data-driven (`generateStaticParams` desde `appsConBrochure()`), 4 rutas (2 apps × 2 locales). El
**hero + tagline + intro nacen ESTÁTICOS** (candidato LCP, patrón `lcp-nace-estatico`); métricas
con `Counter`, funcionalidades con `Reveal`/`Stagger` bajo el fold; reduced-motion a doble cinturón
del motion system. Metadata con `alternates.languages` (es/en/x-default) + JSON-LD
`SoftwareApplication`. CTA a `/#contacto` (reutiliza el formulario) + enlaces reales.
`src/lib/brochure.ts` (server-only) = fuente única de "qué app tiene brochure".

**Integración:** enlace "Ver la app" desde la card del showcase (`apps-showcase.tsx`); `sitemap.ts`
extendido con las brochures (+hreflang); tracker `brochure_vista`; messages ES/EN.

**Verificación:** build → 4 rutas SSG. `curl` sin JS trae hero+funcionalidades+stack en ES y EN;
showcase enlaza a `/apps/<slug>`; app sin brochure → **404**; sitemap incluye las brochures.

**Tests F3:** 3 unit de `brochure.ts` · e2e `brochure.spec.ts` (navegación DESDE el showcase por la
UI, no solo goto; contenido estático bilingüe; 404; CTA→#contacto) · rutas de brochure añadidas al
scan de axe. **axe AA 16/16 verde** (8 rutas × 2 proyectos). Suite `quality`: 129 tests, 92%
cobertura. typecheck + lint limpios.

**Bug cazado por axe (que F2 no vio — no corrí axe en F2):** el eyebrow "Roadmap" usaba `text-ink-3`
(#9c9a90) sobre paper-0 → contraste 2.7 (< 4.5 AA). `ink-3` es el tono decorativo del design
system, no para texto real. Corregido a `text-ink-2`. Lección: **correr axe en la misma fase que
toca la UI**, no diferirlo — casó una regresión de contraste en la sección del sprint anterior.

## Fase 4 — Endurecimiento

**Nav móvil (deuda S1, pagada):** el `<nav>` de escritorio era `hidden md:flex` sin alternativa en
móvil — las rutas nuevas (roadmap, brochures) lo volvieron impostergable. Disclosure hamburguesa
accesible en `header.tsx`: `aria-expanded`/`aria-controls`, iconos Lucide, **Escape cierra y
devuelve el foco al botón**, cada enlace cierra el menú. Strings `abrirMenu`/`cerrarMenu`/`menu`
ES+EN.

**e2e nuevos:**

- `votacion.spec.ts` — **BD caída forzada** (intercept 503 del GET): aviso honesto visible + TODOS
  los botones deshabilitados + conteo "—" (corre siempre). **Votar sube el contador REAL** contra
  Postgres + **segundo voto rechazado** (dedup): corren contra Supabase local; cada test×proyecto
  vota una feature distinta (sin carrera, patrón strict-mode por-proyecto).
- `nav-movil.spec.ts` — abre/cierra, teclado (Escape→foco al botón), navega por la UI, y el toggle
  solo existe en móvil. Selector estable por `aria-controls` (el accessible name cambia al abrir).
- Rutas de brochure añadidas al scan de axe (16/16 AA).

**Playwright config:** `stdout/stderr: "pipe"` (antídoto K3 — sin esto los logs Pino del server son
invisibles en CI); el webServer pasa `SUPABASE_URL/ANON_KEY` (por `...process.env`) +
`VOTACION_ENABLED` + `DISABLE_RATE_LIMIT=1`.

**CI:** job nuevo **`integration`** (Supabase local vía `supabase/setup-cli` → `supabase start` →
export de env con el `sed` anti-comillas → humo de la credencial → `pnpm test:db` → e2e de votación
en navegador contra Postgres real). **Añadido a la ruleset `main-protegida`** el mismo sprint
(regla 2026-07-10): checks ahora `quality`/`e2e`/`lighthouse`/`integration`. Lighthouse audita las
2 rutas de brochure (públicas nuevas); el roadmap ya entra por `/` (HOME).

**Regla 9:** el header vive en todas las páginas ⇒ **suite e2e ENTERA re-corrida**: 84 tests
verde en chromium + mobile (home, chat, form, detalle, reduced-motion, axe, brochure, nav-movil,
votacion). typecheck + lint limpios.
