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

## Fase 2 — La vitrina en el DS propio · ADR-013 y mirada M1

**ADR-013 escrito ANTES de construir** (`decisions/013-vitrina-exports-vs-yaml.md`): conviven sin
puente de datos. Hallazgo que lo decide: los dos conjuntos **no se solapan** (cero slugs en común),
así que no hay duplicación que sincronizar sino dos modelos de brochure con orígenes distintos.

### Construido

- `src/components/vitrina/ficha.tsx` — la ficha re-expresada. Server component, **cero JS de
  cliente**: el desplegable es `<details>` nativo (accesible por teclado y con todo el contenido en
  el HTML estático). Muestra chip INICIAL/SELLADO, promesa, para-quién/diferencial, **métricas con
  su badge de `fuente`** (un pastel del DS por procedencia), funcionalidades por grupo con el ◆ del
  grupo estrella, **descartadas visibles**, privacidad, stack, **la razón en lugar del enlace**, CTA
  de lista de espera y el **anclaje** (de qué export es la ficha).
- `src/app/[locale]/vitrina/page.tsx` — ruta SSG con hero estático (LCP-safe) + `nav`/`sitemap`.
- Chrome bilingüe (`messages/*.json`, namespace `vitrina`) con paridad de claves verificada.

**Decisión de diseño:** los booleanos de `privacidad` se muestran **sin colorear de bueno/malo**: la
polaridad cambia por clave (`local_only: true` es bueno; `red_saliente: true` no lo sería) y solo la
app sabe cuál es cuál. El `detalle` lleva la explicación.

### Pasada de capturas del builder (contrapeso del ⭐ diferido) — 3 defectos que la CI no vio

| # | Defecto | Cómo se vio | Fix |
| --- | --- | --- | --- |
| 1 | **La ficha era INVISIBLE.** `Reveal` usa `viewport.amount: 0.25`; una ficha mide ~4000px y el 25% son 1000px — **más que el viewport**, así que el umbral no se alcanza JAMÁS y el bloque se queda en `opacity: 0` para siempre. La CI en verde: el contenido sí está en el HTML | Captura de escritorio: media página en blanco | Es la trampa documentada en el kit v1.23.0. `Reveal` gana prop `amount` (default 0.25 — **cero cambio** para las pantallas existentes) y la vitrina pasa `"some"`: revela en cuanto asoma un pixel |
| 2 | **Orden de encabezados roto** (`h1` → `h3`, saltando `h2`) | Lectura de la estructura + axe | Nombre de app `h3`→`h2`; grupos y descartadas `h4`→`h3` |
| 3 | **La vitrina no era alcanzable desde el nav** | Captura del header | Añadida como **ruta** (no ancla) al nav de escritorio y al panel móvil |

Barrido de control sobre las 5 rutas × 2 viewports buscando más bloques invisibles: los `opacity: 0`
de la HOME son **comportamiento esperado** (`once: false` revierte la entrada al salir de pantalla),
no defectos — se verificó con captura de sanidad de la HOME en móvil.

### axe EN LA MISMA FASE (regla 9 + kit v1.24.1 — el sprint estrena la regla)

Rojo a la primera: **`color-contrast` 2.7:1** en los dos párrafos de anclaje/fecha, por usar
`text-ink-3` (#9c9a90). **Es la MISMA lección del S4 repitiéndose**: `ink-3` es el tono decorativo
del design system (labels de eje), no un tono de texto legible. Subidos a `text-ink-2` → **axe 20/20
verde**. Haber corrido axe en esta fase —y no en la de integración— lo cazó el mismo día.

**Estado:** 174 unit/integration + 88 e2e verdes. `reduced-motion` verificado por captura: la ficha
se ve completa y sin movimiento.

### Gate de mirada M1 — PENDIENTE del usuario

La vitrina renderiza **UNA sola ficha** (`FICHAS_VISIBLES = 1` en la ruta) hasta que el usuario
apruebe cómo se ve. Al aprobar pasa a las 6 y se presenta M2.

### Mirada M1 — NO APROBADA (2026-08-22)

**Veredicto del usuario:** _«No la apruebo porque es puro texto y cero imágenes, nada que ver, y las
tarjetas tienen una animación especial que hemos venido trabajando desde la planeadora»_ ·
aclaración: _«no son imágenes sino diseños que representan las visuales de la aplicación»_.

Dos faltas mías, ambas por asumir en vez de ir a leer:

1. **Cero representación visual.** La ficha es un muro de texto. El contrato del export no trae
   campo de imagen y di el asunto por cerrado, en vez de preguntar de dónde sale lo visual. Lo que
   falta NO son capturas de las apps: son **diseños que representan la visual de cada aplicación**,
   dibujados desde cero **en el design system de esta casa** (misma lógica de "re-expresar ≠
   calcar": la representación se dibuja en el lenguaje de CV Viva, no se copia de la app).
2. **La animación de las tarjetas.** Existe un patrón trabajado en la planeadora —«apertura por
   lectura», banco de técnicas §7, que el CHANGELOG del kit v1.22.0 manda adoptar **ENTERA, con sus
   trampas y sus tests**— y yo puse un `<details>` genérico. Lo tenía anotado en el plan y no lo
   apliqué.

**Acción:** se detiene la construcción de las 5 fichas restantes (correcto: para esto existe M1).
Se lee la especificación del patrón en la planeadora y el material visual real de las 6 apps, se
rehace la ficha, y M1 se vuelve a presentar. El plan de miradas no cambia de orden: M1 se repite.

### Consulta a la planeadora sobre las muestras (a pedido del usuario)

El usuario pidió preguntar a la planeadora «cómo hicimos los brochure». La respuesta cierra la duda
y **corrige mi primer intento**:

**La regla del banco §7 es de DOS caras, no una** (`kit-app/docs/BROCHURE-banco-de-tecnicas.md`
L180-187, enmienda kit v1.23.0):

1. Si la pieza **ENSEÑA LA APP** ⇒ **capturas de la app CORRIENDO** (Playwright, datos sintéticos
   seeded, WebP como `data:` URI, script re-ejecutable). **Jamás mockups SVG dibujados a mano.**
2. El **SVG con tokens** queda para **ilustraciones ABSTRACTAS que no pretenden ser la app**.

La corrección de Innmobiliaria aplicó **las dos en el mismo PR**: tira visual diagramática donde la
tarjeta no enseña la app, capturas reales en la sección que sí. Y el detonante fue **la misma frase
que me dijo el usuario**: _«las tarjetas deberían tener elementos visuales, no solo texto»_ →
_«Cada una gana su tira visual diagramática con los tokens de la marca. **Es esquemática a
propósito: no finge ser una captura.**»_

**Mi primer dibujo caía del lado prohibido:** tenía marco de teléfono, cabecera «Hoy» y una tarjeta
de cápsula — o sea, fingía una pantalla. Rehecho como **tira esquemática**: sin marco de app, sin
cromo de interfaz; cuatro columnas iguales con las IDEAS de la app (idea del día · la voz sube · no
se guarda · racha de días) y su rótulo mono. El `figcaption` lo declara: «No es una captura de
pantalla».

**Gramática compartida** para las seis tiras: viewBox 320×92, cuatro columnas de 80 centradas en
40·120·200·280, dibujo arriba y rótulo debajo, trazos de 1.5 y rótulos mono de 6px (a 7px se
tocaban entre columnas), topada a 460px de ancho (estirarla rompe la tipografía del dibujo).

**Material real disponible si se quiere sumar la cara 1 de la regla:** anonimizador tiene 10 WebP y
inmobiliaria 4, ya producidos con sus scripts y embebidos en sus brochures. Ojo con el presupuesto:
`perf-budget.json` topa el total de la ruta en 1000 KB y solo las de Velo pesan ~360 KB — entrarían
con `lazy` y/o una ficha por ruta. Las otras 4 apps no tienen capturas (dash es repo privado).

### Rechazo nº 2 de la mirada M1 — «quitaste las tarjetas»

Veredicto del usuario: la sección de las 24 funcionalidades era **puro texto**, y —lo grave— *«las
tarjetas tienen una animación especial que hemos venido trabajando desde la planeadora … y lo
primero que haces es quitarlas»*. Tenía razón: **apliqué el patrón al envoltorio en vez de a las
tarjetas.** La ficha entera era UNA tarjeta desplegable gigante y los grupos de funcionalidades
caían dentro como listas de texto.

**Lo que dice el molde, leído esta vez completo** (`kit-app/docs/BROCHURE.plantilla.html` L244-287):
la capa 1 «Qué hace» son **4–6 TARJETAS**, una por grupo de features, cada una con su índice, su
**icono del design system de la app**, su nombre en verbo humano, la línea que provoca abrirla y el
chevron; y dentro, una `.feature` por funcionalidad. El `brochure-export.json` transporta esa
anatomía **exacta**: `funcionalidades.grupos[]` trae `orden · estrella · nombre · linea · features[]`
— es decir, el contrato ya venía modelado como tarjetas y yo lo aplané a listas.

**Corrección aplicada:**

- La **ficha deja de ser desplegable** y vuelve a ser el mini-brochure de las cuatro capas: portada
  (estado · nombre · promesa · tira · para quién / diferencial) y cifras **siempre a la vista** —
  la portada de un brochure es lo único que jamás se esconde—, luego las tarjetas, luego lo fino en
  acordeones nativos `<details>`, luego el acceso.
- **Un grupo = una tarjeta** (`src/components/vitrina/tarjeta-grupo.tsx`), y la apertura por lectura
  gobierna ESAS. Es lo que manda el patrón: se abre por lectura «si las tarjetas concentran la mayor
  parte de la información» — eso son los grupos, no el envoltorio.
- **No se anidan dos niveles de apertura** a propósito: la tarjeta madre y la hija compensarían el
  MISMO alto dos veces en el cierre por arriba (`scrollBy` de T3), y ese es justo el salto de 1291px
  que el patrón nació para matar.

### Los iconos: se traen, no se inventan (regla 8 del molde)

Los 6 iconos de las tarjetas de habla están copiados **verbatim** de `app-habla/docs/BROCHURE.html`
(24×24, trazo, `pathLength="1"`): brote · bocadillo · micrófono · diana · brújula · engranaje. Los
grupos 7 y 8 del export no tienen tarjeta en el brochure (allá son escenas a página completa), así
que sus iconos se dibujaron **aquí** en la misma familia y quedan declarados en el componente.

**→ Sugerencia a la planeadora (contrato del export):** `brochure-export.json` v1.0.0 **no
transporta el icono**, así que el único vínculo con el origen es una copia fechada — exactamente lo
que la regla 8 quiere evitar («sin desincronizarse»). Propuesta: campo `grupos[].icono` (el `d` de
las figuras) en un v1.1.0 menor y retrocompatible.

### Dos defectos cazados por la pasada de capturas (ninguno los vio la CI)

1. **Los ocho iconos salían EN BLANCO.** Dos causas encadenadas: (a) la tarjeta no llevaba el
   atributo que dispara el trazado, y (b) —el de fondo— el reposo del icono era
   `stroke-dashoffset: 1`, o sea **invisible**, y la transición se quedó colgada sin llegar nunca a
   0. Arreglo: **el estado por defecto pasa a ser el icono DIBUJADO** y el efecto vive entero dentro
   de una `@keyframes`; si el disparo no llega, el icono se ve igual. Es la misma lección del umbral
   porcentual (kit v1.23.0): *lo que no se puede garantizar que se dispare no puede ser lo único que
   hace visible el contenido.*
2. **`pathLength` no existe como propiedad CSS.** La tira lo declaraba en la hoja de estilos, donde
   se ignora en silencio: las líneas quedaban partidas en guiones de 1px. Va como **atributo del
   SVG**.

### axe: el mismo tono por tercera vez, y un hueco de cobertura

- `color-contrast` 2.7:1 en el índice de la tarjeta y en el número de cada feature: **`ink-3` es el
  tono DECORATIVO del DS**, no un tono de texto. Tercera reincidencia (S4 en el roadmap, S5 en el
  anclaje). Queda comentado en el CSS junto al token.
- **Hueco descubierto:** al pasar «lo fino» a `<details>`, ese contenido **salía del scan de axe** —
  la ruta habría pasado en verde por no haber sido mirada. `tests/e2e/axe.spec.ts` ahora **despliega
  todo** (details abiertos + tarjetas en `data-abierta`) antes de analizar, genérico para cualquier
  ruta que estrene un plegable. Es lo que pide el banco: «axe con el detalle abierto». **20/20.**

### Nota de método: el servidor de desarrollo contamina los e2e

Seis pruebas de axe fallaron por *timeout* del footer mientras `pnpm dev` corría en el 3000:
Playwright reusa ese servidor y bajo carga paralela no responde. Se apaga el dev, se corre la
suite, se vuelve a levantar. (Ya estaba en la memoria del proyecto como «servidor zombi puerto
3000»; ahora también aquí, porque la falla se disfraza de flaky.)

### Las visuales de las interfaces: SÍ se puede, y así se hace

Veredicto del usuario: *«¿quién te dijo que unos iconos son imágenes? necesito visuales de las
interfaces aquí»*. Tiene razón y la regla del banco también: **si la pieza enseña LA APP, van
capturas de la app CORRIENDO**. Los iconos son señalética, no muestra.

**Comprobado en caliente:** las seis apps hermanas están clonadas como hermanas de este repo y con
dependencias instaladas. `app-habla` levanta en 250 ms sin ninguna credencial. Cuatro de las seis no
piden variables de entorno (habla · anonimizador · dash-agent-ai · inmobiliaria, que ya trae su
`.env.local`); **ds** pide 4 y las tiene; **nutri-kids** pide 6 y no tiene `.env.local` — es la
única con un bloque `[TÚ]` pendiente.

**Corrección de un dato que di antes:** dije que anonimizador tenía 10 capturas y inmobiliaria 4
listas para embeber. No es así: esos WebP son capturas **del propio brochure**, y los PNG de
`ds-bundle/_screenshots` son fichas de componentes del design system. **Ninguna de las seis tenía
capturas de pantalla de la app listas para usar** — hay que producirlas.

**`scripts/capturas-vitrina.mjs`** (nuevo, `pnpm capturas:vitrina [app]`): levanta el servidor de
desarrollo de la app hermana en un puerto propio, conduce su UI real —onboarding incluido— con datos
**sintéticos declarados en el propio archivo** (cero datos de personas, repo público), fotografía las
escenas configuradas a 390×844 DPR 2 con `reducedMotion` (para no fotografiar un cuadro a media
animación) y las guarda en `public/vitrina/` como WebP vía `cwebp`. Requisito documentado en la
cabecera: `brew install webp`.

**Peso:** las 3 de habla suman 156 KB en disco; servidas por `next/image` al tamaño de pantalla
pesan una fracción. A 3 por app × 6 apps ≈ 940 KB en disco — cabe bajo el techo de 1000 KB por ruta
del `perf-budget.json`, pero **se mide con Lighthouse antes de cerrar M2**, no se supone.

**La tira esquemática no se borra:** queda como respaldo declarado para la app que aún no esté
fotografiada. Lo que jamás se pone es un relleno que aparente ser la app.

**axe cazó una de verdad:** en móvil la tira de capturas desborda y se arrastra, y una región que se
desplaza **tiene que alcanzarse con el teclado** (`scrollable-region-focusable`) — si no, quien no
usa ratón ni dedo no llega nunca a la segunda ni a la tercera pantalla. Lleva `tabIndex` y nombre
accesible. 20/20.

### Corrección de sitio: las capturas van EN LAS TARJETAS, no en la portada

Veredicto del usuario: la portada con la tira estaba perfecta como estaba; las pantallas reales se
necesitan **dentro de las tarjetas de «Qué hace»**. Yo las había puesto como carrusel en la portada
— sitio equivocado.

**Ahora:** la portada recupera la tira esquemática intacta, y **cada tarjeta lleva la pantalla real
de lo que su grupo cuenta** (`CapturaGrupo`, mapeo slug→orden→archivo en `capturas.tsx`): 01 la
cápsula de hoy · 02 los juegos · 03 el estudio · 04 el objetivo · 05 el rumbo (VACÍO a propósito:
es la pantalla real antes de jugar, sin historial fabricado) · 06 ajustes. Los grupos 07 y 08 no
son pantallas sino compromisos transversales — sin captura, sin relleno. En escritorio la captura
es columna a la derecha de las features (`md:flex-row-reverse`); en móvil llega primero, topada a
210px. Siempre `loading="lazy"`: nace dentro de una tarjeta plegada.

El script ganó 3 escenas (estudio · rumbo · ajustes; mismo contexto ⇒ el onboarding de la escena 1
persiste). Las 6 pesan 297 KB en disco. La coreografía `escalona` pasó de hijo directo a
descendiente (`.tarjeta-detalle-cuerpo .escalona`) porque las features viven un nivel más adentro.
La tira horizontal de portada se eliminó con su CSS y su llave `capturasEtiqueta`.

Verde: typecheck · lint · 174 unit · axe 20/20 (dev apagado) · build de producción.
