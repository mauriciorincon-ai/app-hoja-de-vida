# Sprint 005 — Bitácora de implementación

**Branch:** `sprint-005/la-vitrina-de-los-seis` (nace de `main` `9141388`, con el S4 mergeado)
**Orden:** `portafolio/hoja-de-vida/ordenes/SPRINT_005-orden.md` (planeadora, RO)
**Plan aprobado:** 2026-08-22 · **«construye»** recibido tras fijar modelo Opus 5 [1m]
**Ciclo:** H2, sprint **1 de ≥3** — abre el ciclo de LA VITRINA. Gate ⭐ **DIFERIDO** al acumulado
del ciclo H2 (contrapesos exigibles: pasada de capturas + e2e de reduced-motion).

## Desviación del plan

_(sin desviaciones al momento — se anotan aquí con fecha si aparecen)_

## Decisiones tomadas en el plan (aprobadas por el usuario al dar «construye»)

Las tres sub-decisiones del ADR-013 se preguntaron explícitamente y el usuario eligió las tres
recomendaciones:

1. **Ubicación (A):** la vitrina vive en **ruta dedicada `/[locale]/vitrina`**, no como sección de
   la HOME. Razón: las 6 fichas son ricas (dash trae 5 grupos + 9 métricas + descartadas); en la
   HOME inflarían el LCP y competirían con el CV. Lighthouse la audita como ruta propia.
2. **Enlaces del showcase propio (B):** **se dejan como están.** Cambio de mi recomendación
   inicial tras releer la letra de la orden: el grep obligatorio caza URLs de **deploy**
   (`vercel[.]app|workers[.]dev|pages[.]dev`) y un enlace a GitHub no lo dispara; la regla de cero
   enlaces de la orden gobierna «esta entrega» = la vitrina (cuyos exports traen `produccion: null`
   y `repositorio: null`). Retirarlos habría sido cambiar contenido ya publicado fuera del alcance.
3. **Bilingüismo (C):** los exports son **monolingües en español** y **no se editan** (regla dura
   4). Se muestran en su idioma original; el _chrome_ (rótulos, secciones, badges de `fuente`, CTA)
   sí es ES/EN, con nota discreta en `/en` de que las fichas conservan la voz de cada app.

## Fase 0 — Deltas del kit, constitución y cero-enlaces

### Estado de arranque verificado

| Verificación                      | Resultado                                                                                                                       |
| --------------------------------- | ------------------------------------------------------------------------------------------------------------------------------- |
| PR #6 (S4)                        | **MERGED** 2026-08-22 — la rama del S5 nace de `main` con el H1 completo                                                        |
| `content/vitrina/`                | **NO EXISTE** — el paso `[TÚ]` de copia de los 6 exports está pendiente ⇒ **bloquea la F1**                                     |
| Humo de credenciales (kit v1.7.4) | **NINGUNO aplica** — la vitrina es SSG + datos del repo; sin credenciales nuevas ni heredadas en juego. Se declara, no se omite |

### Deltas del kit aplicados (v1.22.0 → v1.24.1)

| Delta         | Archivo                                            | Qué entró                                                                                                                                                                  |
| ------------- | -------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| v1.23.1       | `.github/dependabot.yml` (**creado** — no existía) | Techo real de 2 PRs: `limit 1` por ecosistema (npm + github-actions), todo agrupado con `patterns: ["*"]`                                                                  |
| v1.24.0       | `.github/workflows/ci.yml` job `quality`           | `pnpm peers check` entre el install y el typecheck — único gate que ve un peer insatisfecho. Verificado en local: `No peer dependency issues found`                        |
| v1.24.0       | `CLAUDE.md` regla **18**                           | PRs de dependencias: máx. 2 abiertos, merge de a uno dejando a dependabot regenerar, resolución de lockfile desde el lado de los bumps, overrides en `pnpm-workspace.yaml` |
| v1.22–v1.24.0 | `CLAUDE.md` regla **17**                           | CERO ENLACES + limpieza RECURRENTE del homepage + patrones sin literal en documentos que narran el barrido + **comando del gate entre backticks**                          |
| kit v1.12.0   | `CLAUDE.md` regla **15**                           | Un gate se demuestra FALLANDO + su hermana (un gate que nunca EJECUTÓ tampoco es gate; `skipped` no es verde)                                                              |
| kit v1.17.0   | `CLAUDE.md` regla **16**                           | El bundle `design-sync/` es artefacto del repo y se actualiza en el MISMO PR que toca UI                                                                                   |
| v1.24.1       | `.claude/skills/testing-patterns.md` regla 9       | «pantalla tocada ⇒ su suite entera en su fase» ahora nombra **axe explícitamente** (origen: el contraste del S4 que se coló una fase)                                      |

**Numeración alineada con el kit:** la constitución local llegaba a la regla 13 («Código primero»),
que en el kit es la **14** — con ese desfase «regla 17/18» no existían aquí. Se renumeró 13 → 14 y
se añadieron 15–18 con la numeración del kit, para que una referencia cruzada por número signifique
lo mismo en las dos casas. Referencias internas verificadas antes de renumerar (solo apuntaban a
las reglas 10 y 11): ninguna se rompió.

`pnpm-workspace.yaml` ya tenía los overrides en el sitio correcto y `package.json` no tiene
`pnpm.overrides` — sin acción (regla 18 ya cumplida).

### Auditoría del CLAUDE.md contra el código (v1.24.0 — deuda declarada del S4)

**Resultado: CON DERIVA — 6 correcciones.** La constitución describía lo planeado, no lo
construido; es el documento que toda sesión nueva lee primero y con más fe, así que su deriva se
hereda como verdad.

| #   | Afirmación vieja                                                                              | Realidad del código                                   | Corrección                                                                                                                                           |
| --- | --------------------------------------------------------------------------------------------- | ----------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------- |
| 1   | «Next.js 15»                                                                                  | `next 16.2.10` (ADR-001 se llama _framework-next-16_) | → Next.js 16 (ADR-001) + Tailwind **v4**                                                                                                             |
| 2   | «Supabase entra en **S3**»                                                                    | La votación entró en **S4** (ADR-011)                 | → «Supabase desde S4», con la superficie real (RPC `SECURITY DEFINER`, RLS sin políticas, cero PII)                                                  |
| 3   | «En **S2**: chat multi-proveedor… ADR-003 (S2)»                                               | El chat entró en **S3** (ADR-003 + ADR-010)           | → «el chat con la HV, desde S3», citando ambos ADR                                                                                                   |
| 4   | «⚠ verificar cláusula no comercial de Hobby en ADR de hosting — alternativa Cloudflare Pages» | **ADR-004 `hosting-vercel-hobby` lo resolvió en S1**  | → «hosting resuelto en ADR-004». _Es exactamente el caso que motivó esta auditoría en Innmobiliaria: una advertencia caducada que sobrevive sprints_ |
| 5   | «IA embebida responsable (desde **S2**)» ×2                                                   | Desde **S3**                                          | → S3 en ambos sitios                                                                                                                                 |
| 6   | Estructura: `lib/ia/ (S2)`, `data/` sin `historia/`, sin `lib/votes/`                         | `lib/votes/` (S4) y `data/historia/` (S3) existen     | → árbol real + `content/vitrina/` (S5)                                                                                                               |

Además se actualizó «Qué es esta app»: describía la app hasta S3 en futuro; ahora declara el **H1
cerrado (MVP funcional completo)** y la apertura del **ciclo H2 = la vitrina**.

### Cero enlaces (regla 17) — barrido y limpieza

Comando del gate (entre backticks, probado desde el render):

`git grep -nE "vercel[.]app|workers[.]dev|pages[.]dev" -- ':!pnpm-lock.yaml'`

| Hallazgo                                                                                | Gravedad                                                                                                        | Acción                                                                                                                                                      |
| --------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `docs/GUIA-DE-PRUEBA.html` — **URL de preview REAL del S4 commiteada**                  | **Alta** (la guía publicaba la dirección de acceso)                                                             | Reemplazada por un marcador «— pégala aquí al empezar —» + nota: la dirección la trae la orden o el deploy de la rama y se pega EN USO, no viaja en el repo |
| `docs/BLUEPRINT.html` ×2 — el literal del dominio del proveedor en el SVG y en la tabla | Media (rompía la binariedad del gate)                                                                           | Reescrito a «subdominio del proveedor (Vercel) — la URL exacta NO se publica aquí (regla 17)»                                                               |
| **Campo `homepage` del repo en GitHub** = la URL de producción                          | **Alta** — es la violación viva que la regla 17 predice (la GitHub App de Vercel lo reescribe tras cada deploy) | Limpiado con `gh repo edit --homepage ""`; verificado vacío. **Re-verificar tras CADA merge a `main`**                                                      |

Grep final: **limpio** ✓ · `package.json` sin `homepage` ✓

## Fase 1 — Ingesta, contrato y anclaje (O1)

### Los 6 exports: llegada y procedencia

El paso de copia estaba asignado a `[TÚ]` porque *la sesión de otra app* no puede leer el repo
privado de dash — pero desde esta máquina los 6 `docs/brochure-export.json` sí son alcanzables, así
que corrí el comando **textual de la orden** y desbloqueé la fase. Nada se editó: son la voz de cada
app (regla dura 4).

| slug | schema | actualizado | estado | sellado_en | funcs | grupos | métricas | descartadas |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| habla | 1.0.0 | 2026-08-21 | **sellado** | 2026-08-08 | 24 | 8 | 14 | 0 |
| inmobiliaria | 1.0.0 | 2026-08-22 | inicial | null | 13 | 4 | 9 | 0 |
| nutri-kids | 1.0.0 | 2026-08-22 | inicial | null | 19 | 5 | 10 | 0 |
| anonimizador | 1.0.0 | 2026-08-21 | inicial | null | 14 | 5 | 12 | 0 |
| ds | 1.0.0 | 2026-08-20 | inicial | null | 33 | 5 | 11 | 0 |
| dash-agent-ai | 1.0.0 | 2026-08-19 | inicial | null | 12 | 5 | 9 | 1 |

**Totales de la vitrina:** 115 funcionalidades · 32 grupos · 65 métricas · 1 descartada.
**Verificación previa a codificar (los 6 pasan):** grupos suman = `total` en los 6 · `produccion` y
`repositorio` en `null` en los 6 · toda métrica con `fuente`. **Nada que reportar a la planeadora.**

### Forma real del contrato (medida, no supuesta)

Se midió la varianza entre los 6 antes de escribir el schema, para no rechazar un export válido:
todos los campos resultaron **universales** salvo `privacidad`, que confirma ser un **MENÚ** (11
claves booleanas distintas entre apps: `local_only`, `red_saliente`, `escribe_en_las_fuentes`,
`usa_ia`, `consentimiento_explicito`, `datos_del_menor_solo_en_dispositivo`, …). Por eso su schema
es `{ detalle }` obligatorio + `catchall(boolean)`: cada app declara solo lo que puede AFIRMAR.
Las `fuente` en uso hoy son 3 de las 4 del contrato (`medido` · `calculada` · `declarado`).

### Qué se construyó

- `src/lib/vitrina/schemas.ts` — contrato v1.0.0 en Zod, `.strict()` en todo objeto de forma fija.
  Hace mecánicas las 3 reglas duras: `produccion`/`repositorio` **tipados `z.null()`** (un enlace
  no es "campo raro", es un error de tipo), `fuente` como enum de 4, y **validación cruzada**
  `superRefine` de grupos = total. `versionCompatible()` rechaza un mayor distinto (campos con otro
  significado) en vez de adivinar.
- `src/lib/vitrina/loader.ts` — server-only, mismo patrón fail-safe que `lib/content.ts`: **el build
  FALLA** con un diagnóstico que nombra archivo y campo, y el mensaje recuerda que los exports no se
  editan aquí sino que se reportan. Manifest de anclaje (slug · fecha del export · schema · estado ·
  sello · ciclo · versión del repo) y **orden estable y explícito** (selladas primero, luego por
  fecha desc, desempate por slug) — el orden no depende del sistema de archivos.
- Tests: `vitrina-contrato.test.ts` (38) + `vitrina-loader.test.ts` (7) = **45 verdes**.

### Demo EN ROJO del gate del contrato (regla 15 + regla dura 3 de la orden)

Las 3 mutaciones de la orden, aplicadas a exports **reales** y revertidas después:

| # | Mutación | Archivo real | Gate y resultado |
| --- | --- | --- | --- |
| 1 | `funcionalidades.total` 12 → 13 | `dash-agent-ai` | **`pnpm test`** (el comando del CI) → **FAIL**, `total declarado 13 ≠ 12 features en los grupos` |
| 2 | `delete metricas[0].fuente` | `ds` | **FAIL**, `metricas.0.fuente: Invalid option: expected one of "medido"\|"calculada"\|"declarado"\|"estimacion"` |
| 3 | `enlaces.produccion = "https://…"` | `habla` | **FAIL**, `enlaces.produccion: Invalid input: expected null, received string` |

Cada rojo **nombró el archivo culpable y el campo**. Restaurados los 6 desde respaldo: **38/38 verde**
y `git diff` de `content/vitrina/` vacío — los exports quedaron byte a byte intactos.
