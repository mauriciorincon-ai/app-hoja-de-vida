# ADR-011 — Votación anónima del roadmap sobre Supabase

- **Status:** accepted (2026-07-20)
- **Context:** Sprint 004 (branch `sprint-004/la-vitrina-completa`). Primera capa de datos de la
  app: el roadmap público con votación anónima, MVP de la VISION v1.1 sin construir hasta ahora.

## Context

La VISION pide que los visitantes voten las próximas features "con un clic, sin registrarse", y la
regla de producto es dura: **los contadores muestran conteos reales o no se muestran**. Además,
regla legal (Ley 1581): **cero PII** — la votación no puede almacenar IP ni identidad. Es la
primera vez que la app tiene base de datos; el pipeline ya destiló el impuesto de "Supabase en CI"
(`wiki/patterns/supabase-en-ci-y-cloud.md`, K1–K6 de Innmobiliaria).

## Decision

**Supabase free** como capa de datos; el sitio sigue SSG y la votación vive en route handlers.

**Esquema y superficie de acceso (patrón de Innmobiliaria ADR-002):**

- Tabla `votes (id, app, feature, created_at)` — **cero PII**. El conteo es `COUNT(*)` agregado, no
  un contador mutable: sin carrera de escritura sobre una celda, histórico intacto.
- **RLS encendida y SIN políticas** para el Data API: ningún rol anónimo lee ni escribe la tabla
  directamente.
- Dos RPC **SECURITY DEFINER**: `emitir_voto(app, feature)` inserta y devuelve el conteo REAL
  resultante en la misma transacción (jamás optimistic UI); `conteo_votos()` devuelve el agregado.
- **GRANTs/REVOKEs explícitos** (antídoto K3–K6): el stack no otorga privilegios por defecto; el
  anon solo tiene `EXECUTE` de las dos RPC. Verificado: `SELECT`/`INSERT` directos del anon →
  `42501 permission denied`.

**Contador honesto (el gate de producto):** el número siempre sale de la RPC en el momento
(`GET /votos` con `force-dynamic` + `no-store`). Si la BD no responde, el route devuelve 503 y la
UI declara "votación no disponible" con los botones deshabilitados — nunca un conteo inventado ni
un ISR que lo congele.

**Anti-abuso en capas honestas:** rate limit por IP en el route (en memoria, se apaga solo en CI
con `DISABLE_RATE_LIMIT`) + dedup de mejor esfuerzo por navegador (`localStorage`, prefijo
versionado por sprint) + inserción atómica en la RPC. El dedup por navegador es **borrable** —
límite declarado en el manual y aceptado: es el precio de no pedir registro ni guardar PII.

## Consequences

- El contenido del roadmap es data-driven desde `apps.yaml` (`roadmap:` por app); editar el YAML +
  push actualiza la votación. Cambiar el `id` de una feature reinicia su conteo (documentado).
- Nueva superficie de CI: job `integration` que arranca Supabase real, corre los dbtests y el e2e
  de votación en navegador — **añadido a la ruleset `main-protegida` el mismo sprint**
  (regla 2026-07-10).
- Degradación con gracia: sin BD la votación es "no disponible" pero el resto del sitio (SSG) y el
  chat (fallback local) siguen — la BD no es punto único de falla del sitio.
- Costo US$0: 2º proyecto del org en el free tier de Supabase.
