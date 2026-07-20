---
sprint: 004
app: hoja-de-vida
status: closed
opened: 2026-07-20
closed: 2026-07-20
branch: sprint-004/la-vitrina-completa
pr: https://github.com/mauriciorincon-ai/app-hoja-de-vida/pull/6
---

# Sprint 004 Summary — CV Viva

## Outcome

**Sí (los 3, con un matiz de gate).** Se construyeron las dos piezas que faltaban del MVP funcional
de la VISION v1.1 — **roadmap público con votación anónima** (primera capa de datos de la app,
contador REAL o "no disponible") y **página brochure animada por app real** — más todos los cierres
de ciclo (BLUEPRINT.html, guía v1 acumulativa, deltas del kit, deuda de nav móvil). El único
elemento que depende del usuario es el **gate ⭐ ACUMULADO S1–S4** y el `/design-sync` (skill de
invocación solo-usuario), declarados como sus acciones de cierre.

## Qué se construyó

- **Roadmap con votación (O1):** capa de datos Supabase (tabla `votes`, RLS sin políticas, RPC
  `emitir_voto`/`conteo_votos` SECURITY DEFINER, GRANTs explícitos, **cero PII**); route handlers
  `/api/roadmap/votar` y `/votos` (rate limit, Zod `.strict()`, validación contra el YAML);
  sección `#roadmap` SSG + isla `RoadmapVoting` con estados honestos y dedup localStorage
  versionado. **Contador honesto:** el número sale siempre de la BD; BD caída ⇒ "no disponible" +
  botones off, jamás un cero inventado.
- **Brochures animadas (O2):** `/[locale]/apps/[slug]` SSG (4 rutas, solo apps `en-produccion`),
  hero/intro estáticos (LCP-safe), funcionalidades/métricas con el motion system, reduced-motion a
  doble cinturón, JSON-LD + hreflang, enlazadas desde el showcase, en sitemap.
- **Endurecimiento:** nav móvil accesible (deuda S1 pagada); e2e de votación contra Postgres real;
  job de CI `integration` (Supabase real) añadido a la ruleset; Lighthouse audita las brochures.
- **Cierre de ciclo (O3):** deltas kit v1.6.2→v1.7.4 (+reglas 11–13); BLUEPRINT.html as-built;
  guía v1 ACUMULATIVA S1–S4 + kit de prueba; MANUAL actualizado; ADR-011 (votación) y ADR-012
  (brochure).

## DoD — checklist (6+1)

- ✅ **Testing:** 129 unit/integration (`quality`, 92% cobertura) + 9 dbtest contra Postgres real +
  88 e2e (chromium+mobile) incl. votación real (+ teclado y estado rate-limited), regresión de la
  superficie RLS (anon directo → 42501), brochures, nav móvil, axe. Regla 9 aplicada: home y header
  re-corrieron sus suites enteras en su fase.
- ✅ **CI/CD:** pipeline de 4 jobs (quality·e2e·integration·lighthouse); `integration` corre la
  votación contra Postgres real; **añadido a la ruleset `main-protegida` el mismo sprint**.
- ✅ **Observabilidad:** eventos `roadmap_visto`/`voto_emitido`/`voto_rechazado`/`brochure_vista`;
  logs Pino en los route handlers (request-id, latencia, resultado); cero PII.
- ✅ **Seguridad:** anon key sin escritura directa (solo RPC, verificado: tabla directa → 42501);
  Zod `.strict()` en input; rate limit por IP; keys solo en env; **humo de credenciales día 0**
  (Supabase local 200; GROQ real pendiente de [TÚ]); hook gitleaks probado con carnada partida.
- ✅ **Performance:** brochures nacen estáticas ([[lcp-nace-estatico]]); votación es isla mínima
  bajo el fold; rutas públicas nuevas en Lighthouse con budgets vigentes (LCP 3850, ADR-006).
- ✅ **UX/A11y:** axe AA 16/16 (roadmap + brochures incluidos); teclado end-to-end en votación y
  nav móvil; reduced-motion fail-safe; estados completos (votado/no-disponible/rate-limited).
- ✅ **IA embebida:** sin features nuevas; el builder del índice ignora los campos nuevos del YAML
  (verificado) — no se re-abrió el estándar 7.

## Métricas técnicas

- Cobertura `quality`: **92%** (umbral 70%). Tests: 129 + 9 dbtest + 88 e2e = **226**.
- Rutas SSG nuevas: 4 brochures + roadmap en la HOME. Superficie de datos: 1 tabla + 2 RPC.
- Costo real: **US$0** (todo free tier). Presupuesto ≤US$10/mes cumplido con holgura.

## Decisiones no anticipadas

- **ADR-011 (votación/Supabase):** RLS sin políticas + RPC SECURITY DEFINER + GRANTs explícitos
  (antídotos K3–K6 de Innmobiliaria). **ADR-012 (brochure):** schema aditivo `.strict()` + ruta
  SSG data-driven; solo apps `en-produccion` (regla de contenido, no del schema).
- **`appsSchema` a `.strict()`** (más allá de lo pedido): antes hacía strip silencioso de claves
  desconocidas; ahora un typo en el YAML rompe el build (fail-safe real).

## Bugs + resoluciones

- **Contraste del eyebrow "Roadmap"** (`text-ink-3`, ratio 2.7 < 4.5 AA): axe lo cazó al añadir la
  ruta al scan. `ink-3` es el tono decorativo del design system, no para texto real → `text-ink-2`.
  Lección: correr axe en la MISMA fase que toca la UI, no diferirlo (casó una regresión de la
  sección del sprint anterior).
- **Carrera en el e2e de votación** (varios tests votaban la misma feature con `fullyParallel`):
  cada test×proyecto vota una feature distinta (patrón strict-mode por-proyecto).
- **`DISABLE_RATE_LIMIT` leído al cargar el módulo** (no testeable): movido a lectura por-request.
- **Falso positivo de gitleaks** en el runbook (`ANON_KEY=<...>` placeholder): reescrito sin imitar
  una asignación `KEY=valor`.
- **Carrera en la ventana "cargando" de la isla de votación** (cazada por el remate de auditoría
  fase 1): botones habilitados + dedup sembrado en `.finally` (tarde) ⇒ un voto durante la carga
  podía quedar oculto y un ya-votante votar de nuevo. Fix: botones off mientras carga; dedup
  sembrado en los callbacks de la promesa (mismo lote que habilita los botones); `setConteos` con
  merge. No violaba el contador honesto (nunca un número inventado). Evento `roadmap_visto` (muerto)
  ahora emitido.
- **Auditoría final pre-cierre (independiente del remate del build):** cero críticos/altos. Se
  cerraron 3 gaps de cobertura de test que dejaban claims del DoD sin respaldo automatizado:
  (a) teclado end-to-end en la votación y (b) render del estado rate-limited — ambos como e2e con
  red interceptada (no exigen BD); (c) regresión de la superficie "doblemente invisible" (anon
  directo a `votes` → 42501) como `votes-rls.dbtest.ts` contra Postgres real. Un endurecimiento
  opcional (`dynamicParams=false` en las rutas SSG) se **evaluó y descartó**: convierte el 404
  limpio vía `notFound()` en un `NoFallbackError` que ensucia logs/Sentry, sin beneficio a esta
  escala.

## Qué salió bien / qué generó fricción

- **Bien:** el impuesto Supabase-en-CI ya destilado (K3–K6) hizo la capa de datos casi sin
  fricción; el contador honesto quedó verificado end-to-end (curl sin BD → 503, e2e BD-caída →
  botones off); el `mock`/`stdout:pipe` y los patrones wiki pagaron su promesa.
- **Fricción:** dos quirks NUEVOS del Supabase local en Mac/Colima (conflicto de puertos con
  Innmobiliaria → puertos +100; `vector`/analytics no arranca sobre virtiofs → `enabled=false`) —
  candidatos a destilar en `supabase-en-ci-y-cloud`.

## Sugerencias de mejora al método

- **Añadir al patrón `supabase-en-ci-y-cloud` los dos quirks del Mac** (puertos por-proyecto cuando
  coexisten 2 stacks; `[analytics] enabled=false` sobre Colima/virtiofs). El impuesto de "2º stack
  local en el mismo host" no estaba pagado.
- **Regla 9 debería mencionar axe explícitamente:** "pantalla tocada ⇒ su suite entera **incluido
  el scan axe** en la misma fase". Diferir axe a F4 dejó pasar un contraste a F2 (se cazó, pero una
  fase tarde).

## Deuda técnica aceptada

- **Chunks de brochure al índice del chat:** NO integrados (opción declarada). Pago: iteración
  futura si se quiere que el chat cite las brochures. Sin impacto hoy (el builder los ignora).
- **`/design-sync` y gate ⭐ ACUMULADO:** acciones [TÚ] del cierre (el skill es solo-usuario; el
  gate jamás se difiere a otro sprint — solo su momento). Re-emitidas en el checklist del PR.
- **No tocadas (declaradas a su momento):** dark mode (fase 2) · embeddings del retrieval · postcss
  moderate · rate limit global · `verificacion:` de certs.

## Archivos clave (máx. 10)

1. `supabase/migrations/20260720120000_votes.sql` — tabla + RPC + GRANTs (antídoto K3–K6).
2. `src/lib/votes/client.ts` — cliente server-only, Zod, `VotesUnavailableError`.
3. `src/app/api/roadmap/votar/route.ts` — voto con defensa en capas + contador honesto.
4. `src/components/home/roadmap-voting.tsx` — isla de votación con estados honestos y dedup.
5. `src/app/[locale]/apps/[slug]/page.tsx` — brochure SSG animada (LCP-safe).
6. `src/lib/schemas.ts` — `roadmap`/`brochure` + `appsSchema.strict()`.
7. `.github/workflows/ci.yml` — job `integration` con Postgres real.
8. `docs/GUIA-DE-PRUEBA.html` — guía v1 acumulativa S1–S4.
9. `docs/BLUEPRINT.html` — as-built del ciclo H1.
10. `decisions/011-votacion-supabase.md` + `012-brochure-schema-y-ruta.md`.

## Cómo probar

1. `git checkout sprint-004/la-vitrina-completa && pnpm install`
2. **Unit/integration:** `pnpm test` (129, 92% cobertura).
3. **BD real:** `supabase start` → `eval "$(supabase status -o env | sed 's/="/=/; s/"$//')"` →
   `export SUPABASE_URL=$API_URL SUPABASE_ANON_KEY=$ANON_KEY` → `pnpm test:db` (7).
4. **e2e:** con esas env exportadas, `pnpm test:e2e` (84, incluye votación real). Sin ellas la
   votación corre en modo "no disponible" (honesto).
5. **Manual:** abrir `docs/GUIA-DE-PRUEBA.html` → gate mínimo ⭐ (10 pruebas, ~30 min).
