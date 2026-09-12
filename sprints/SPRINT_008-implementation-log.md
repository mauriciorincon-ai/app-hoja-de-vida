# Sprint 008 — EL DETALLE · bitácora de implementación

> Branch `sprint-008/el-detalle` · ciclo H2, sprint 4 de ≥4 · gate ⭐ DIFERIDO con contrapesos ·
> orden: `portafolio/hoja-de-vida/ordenes/SPRINT_008-orden.md` (planeadora, RO).
> **Contrato de fases:** al terminar cada fase me detengo con su resumen y espero «continúa».

---

## Fase 0 — deltas del kit v1.26.0, deudas heredadas e inventario

### 0.1 · Humo de credenciales — NINGUNA nueva

El sprint no aprovisiona nada: el canal `a-fondo` es contenido versionado y el chat sigue con el
proveedor que ya está configurado. Las credenciales heredadas (Resend, Supabase, el proveedor del
chat) **no se tocan**. La fase 3 sí ejercita el retriever, pero el retriever es lexical y corre en
proceso — sin red y sin llave. Se declara para que la ausencia sea explícita y no un olvido
(kit v1.7.4).

---

### 0.2 · Gate de tokens de tinta vetados como texto (kit v1.26.0 → regla 5-b)

**Qué se construyó:** `tests/unit/design-tokens-vetados.test.ts` — barrido de `src/**/*.{ts,tsx,css}`
que lee su lista de `design-system.md`, del bloque `tokens-vetados-como-texto` (nuevo, legible por
máquina, entre dos marcas HTML). La fila `ink-3` de la tabla de paleta dejó de decir «Texto
terciario, labels de eje» —la frase que autorizaba la reincidencia— y ahora dice **«Decorativo:
bordes, rellenos, trazos — JAMÁS texto»**.

**Por qué hacía falta:** axe cazó `ink-3` como texto **dos veces en esta misma app** (S6 en las doce
rutas de la vitrina, post-S7 en la tarjeta de estudio). Las dos veces la defensa fue prosa en el
design system. La prosa no corre.

**Alcance deliberado — vetado como TEXTO, no vetado a secas.** `border-ink-3`, `bg-ink-3`,
`decoration-ink-3`, `fill` y `stroke` siguen permitidos: un borde punteado y un trazo de dibujo no
son texto, y prohibirlos habría obligado a diez excepciones —que es una lista que nadie mantiene—.

#### La demo en rojo (regla 14: viaja en el MISMO commit)

Este gate **no necesitó mutación para nacer en rojo**: había tres violaciones vivas en `main`. Se
demostraron las cuatro ramas.

| Rama                            | Cómo se puso en rojo                                | A quién nombró                                                                                                  |
| ------------------------------- | --------------------------------------------------- | --------------------------------------------------------------------------------------------------------------- |
| Clase de Tailwind `text-<token>` | **Sola, contra `main`** — sin tocar nada            | `src/app/[locale]/not-found.tsx:13` · `src/components/chat/chat-panel.tsx:303` · `src/components/header.tsx:228` |
| CSS `color: var(--color-…)`     | Mutación: una regla `.mutacion-demo-a` en globals.css | `src/app/globals.css:320`                                                                                       |
| CSS `color: <hex>` suelto       | Mutación: `.mutacion-demo-b { color: #9C9A90 }`      | `src/app/globals.css:321`                                                                                       |
| El bloque del design system desaparece | Mutación: renombrada la marca de inicio       | Error propio: «design-system.md ya no declara el bloque…» — un gate que se queda sin lista **no se calla**       |

Las dos mutaciones de CSS se revirtieron; las tres violaciones vivas se corrigen abajo.

**La tercera pregunta de la regla 14 (kit v1.26.0) — ¿puede fallar siquiera?** Sí, y de cuatro
maneras distintas, todas demostradas arriba. Ninguna regla anterior lo hacía inalcanzable: el
`pnpm lint` no mira clases de Tailwind, y axe solo veía el token **si la ruta con el texto entraba
al scan** — por eso el de la tarjeta de estudio tardó un sprint entero en aparecer.

#### Las tres correcciones

| Archivo                           | Antes                    | Después                  | Razón                                                                                                         |
| --------------------------------- | ------------------------ | ------------------------ | --------------------------------------------------------------------------------------------------------------- |
| `src/app/[locale]/not-found.tsx:13` | `text-ink-3`           | `text-ink-2`             | El «404» es texto que el lector de pantalla anuncia; no es decorado                                            |
| `src/components/chat/chat-panel.tsx:303` | `placeholder:text-ink-3` | `placeholder:text-ink-2` | El placeholder es texto: WCAG 1.4.3 le aplica igual que al resto                                        |
| `src/components/header.tsx:228`   | `text-ink-3`             | `text-ink-2`             | Es la barra `/` entre ES y EN, `aria-hidden`. Se **conserva el glifo** y solo se oscurece: cambiarlo por un divisor de borde habría movido el diseño sin mirada del usuario |

---

### 0.3 · Lighthouse: tres corridas, mediana — y la casilla que nadie medía

**Delta del kit v1.26.0:** una corrida no mide. Se pasa a `--numberOfRuns=3` con
`aggregationMethod: median-run`.

**Deuda colateral HEREDADA que se paga aquí.** `/deploy-check` §8 de esta app afirma, desde que se
copió del kit, que «esta casilla SÍ tiene gate mecánico: el job `lighthouse` corre
`lhci assert --config=./lighthouse-categorias.json` sobre las URLs de `lighthouse-urls.json`».
**Ninguno de los dos archivos existía en este repo** y `ci.yml` nunca corrió ese assert: la app se
estampó desde el kit v1.0.0 y el gate llegó al kit en la v1.12.0, sin viajar nunca hasta aquí. El
job medía **solo `perf-budget.json`**, que mide tiempos y pesos — otra cosa. Es decir: la casilla
«≥90 en Performance, Best Practices, Accessibility y SEO» se marcó en **siete `/deploy-check`
seguidos** sin que nadie la hubiera medido jamás. Exactamente la ilusión que la regla 14 persigue,
solo que esta vez el gate no era decorado: **no existía**, y el comando afirmaba que sí.

**Forma del job (tres pasos donde había uno):** un `lhci collect` y **dos** `lhci assert`, porque
LHCI declara `assert.budgetsFile` mutuamente excluyente con `assert.assertions`. Y `lhci assert`
**no acepta `--aggregationMethod` como bandera suelta** (sus únicas opciones son `--config`,
`--preset`, `--assertions`, `--budgetsFile`, `--includePassedAssertions`, `--lhr`): por eso la
mediana viaja dentro de cada config, y por eso nace `lighthouse-budget.json` como envoltorio del
budget. Verificado en vivo que `budgetsFile` + `aggregationMethod` **sí** conviven — la
exclusividad es solo con `assertions`.

Los tres archivos nuevos llevan nombre **no auto-descubrible** a propósito: LHCI auto-carga
`lighthouserc.json`, y si estos lo fueran, el assert de budgets los cargaría solo y estallaría por
la exclusividad mutua.

#### La medición local, antes de encender nada

15 URLs, una corrida cada una (`lhci collect --numberOfRuns=1`), en este equipo:

| Categoría      | Resultado                                                   |
| -------------- | ------------------------------------------------------------- |
| Accessibility  | **100** en las 15                                            |
| SEO            | **100** en las 15                                            |
| Best Practices | **96** en las 15 — siempre, y por la misma causa (abajo)     |
| Performance    | 92–95 en 14 · **89** en la raíz `/`                          |

**El 89 de la raíz era la corrida, no la página.** Repetida tres veces: 90, 91, 91 → mediana **91**.
Es la demostración de por qué el kit pide tres: con una sola corrida, este gate habría nacido rojo
por ruido. Y midiendo `/es` en las mismas tres corridas: 92, 92, 92 — **cero variación**.

**Por eso la raíz sale de la lista y entra `/es`.** `/` es un 307 que resuelve el `Accept-Language`
del runner: medía unas veces `/en`, otras el salto. Un presupuesto de performance no es el sitio
para vigilar un redirect. **Pero que hoy no lo vigile nadie más es un hueco real** — queda en el
inventario 0.5, no disimulado.

**El −4 permanente de Best Practices** es `errors-in-console`: `/_vercel/insights/script.js`
devuelve 404 fuera de Vercel, y el job mide con `pnpm start` en el runner. No es un defecto del
sitio: es el arnés. Quedan 6 puntos de margen sobre el umbral 0.9 y se declara para que nadie
persiga ese 96 creyendo que hay algo roto.

#### La demo en rojo (regla 14)

Umbral subido a `0.999` sobre los datos ya recolectados:

```
2 result(s) for http://localhost:3000/es :
  ✘ categories.performance failure for minScore assertion
        expected: >=0.999   found: 0.92   all values: 0.92, 0.92, 0.92
  ✘ categories.best-practices failure for minScore assertion
        expected: >=0.999   found: 0.96   all values: 0.96, 0.96, 0.96
Assertion failed. Exiting with status code 1.
```

Nombra URL, categoría, el valor que juzgó y **las tres corridas de las que salió** — que es, de
paso, la prueba de que `median-run` está activo (`found: 0.91` sobre `0.9, 0.91, 0.91`).
**La tercera pregunta — ¿puede fallar siquiera?** Sí: ninguna regla anterior lo alcanza, porque el
budget no mira categorías. Es literalmente lo que llevaba siete sprints sin medirse.

#### Lo que cuesta

El job `lighthouse` tardó **11 min 24 s** en el último merge a `main` (run 34702203857), con 15
URLs × 1 corrida. Descontando install y build (~3 min), la recolección son ~8,5 min → ~34 s por
corrida. **Con 45 corridas la estimación es ~26 min de recolección, ~29 min de job.** Se declara
como estimación y se corrige con el número real de la primera corrida de CI de este PR. Si al
usuario le parece demasiado para cada PR, la palanca es la lista de URLs —que ahora es un archivo
de datos, no YAML— y no el número de corridas.

---

### 0.4 · CLAUDE.md y comandos al día (deltas del kit v1.26.0)

**Ojo a la numeración:** las reglas de esta app van **corridas uno** respecto al kit. Las 5 / 15 /
17 del kit son aquí la **5, la 14 y la 16**.

| Dónde                        | Qué ganó                                                                                                                                    |
| ---------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------- |
| `CLAUDE.md` regla 5          | (a) la forma del árbol jamás depende de `useReducedMotion()`, con sus dos gates nombrados · (b) tokens de tinta vetados como texto, con el suyo |
| `CLAUDE.md` regla 14         | La **tercera pregunta**: ¿puede este gate FALLAR siquiera? Las tres juntas: ¿lo viste fallar? · ¿lo viste correr? · ¿puede fallar?             |
| `CLAUDE.md` regla 16         | El barrido corre **después del último `git add`**, y cubre código y comentarios de tests                                                       |
| `/deploy-check` §3           | Las dos casillas de la regla 5, con el nombre del test que las sostiene                                                                       |
| `/deploy-check` §8           | La verdad sobre desde cuándo hay gate en ESTA app (el S8, no el S1) · tres corridas y mediana · el 96 de Best Practices explicado             |
| `/deploy-check` §9           | Cuándo se barre (tras el último `git add`) y qué más cubre                                                                                    |
| `/audita-sprint`             | **«Quién audita la Fase 1»**: auditor independiente con el diff delante, tres formas en orden de preferencia, y la tercera se DECLARA          |

La regla 5-a ya estaba **implementada** desde la revisión post-S7 (los gates existen y corren); lo
que faltaba era estar escrita. Se documenta ahora para que la próxima sesión no tenga que
redescubrirla con dos CI rojas.

---

### 0.5 · Inventario de lo que quedó SIN SUJETO (solo inventario — no se toca nada)

Regla del método v1.27.0: una prueba cuyo sujeto desapareció no se borra ni se disimula, **se
inventaría**. El S7 abrió los cuatro frentes de la vitrina, y con eso dejó sin sujeto la rama
«frente en preparación» entera.

| #   | Qué                                                                                  | Dónde                                  | Estado hoy                                                                         |
| --- | ------------------------------------------------------------------------------------ | -------------------------------------- | ------------------------------------------------------------------------------------ |
| 1   | «cada frente en preparación tiene su página, lo declara y no promete fecha»          | `tests/e2e/vitrina.spec.ts:395`        | **SALTADA** — `EN_PREPARACION.length === 0`                                          |
| 2   | «del portal se entra a un frente en preparación, y de ahí a los otros»                | `tests/e2e/vitrina.spec.ts:421`        | **SALTADA** — misma causa                                                            |
| 3   | «un frente EN PREPARACIÓN no publica sus piezas aunque las tenga en `content/`» (404) | `tests/e2e/vitrina.spec.ts:764`        | **SALTADA** — misma causa                                                            |
| 4   | El bucle sobre `EN_PREPARACION` dentro de la prueba del portal                        | `tests/e2e/vitrina.spec.ts:461`        | **VERDE SIN EJERCER** — ya lo confiesa con una anotación `sin sujeto` (bien hecho)    |
| 5   | El redirect de la raíz `/` → idioma                                                   | `src/proxy.ts`                         | **SIN PRUEBA** — ni e2e ni integración; y desde el 0.3 tampoco lo mira Lighthouse    |

**Qué NO cubre `tests/unit/frente-en-preparacion.test.tsx`**, que es el sustituto que el S7 dejó:
prueba el **componente** `FrenteEnPreparacion` (encabezado accesible, que no promete fecha, que no
enlaza afuera). No prueba nada de la **ruta**: ni el `data-estado="en-preparacion"` del `header`,
ni que haya **un solo** CTA y sea la lista de espera, ni el `#contacto-vitrina`, ni la frase «Sin
fecha prometida» en el HTML servido, ni —lo más caro— **el 404 de una pieza cuyo frente está
cerrado**, que es la regla de negocio de verdad: las fichas existen en `content/` y no deben
publicarse. Eso hoy **no lo sostiene nadie**.

La corrección del plan, dicha con todas las letras: **el plan suponía un cuarto caso en las
brochures** (`tests/e2e/brochure.spec.ts:74`, «una app sin brochure no tiene página»). **No está
saltado:** `apps.yaml` tiene dos apps sin brochure (`fabric-analitica-e2e`, `agente-gemini-vertex`),
así que esa prueba corre. El cuarto caso real es el nº 4 de la tabla. Los `test.skip` de
`votacion.spec.ts` dependen de `SUPABASE_URL` —no son «sin sujeto», son entorno— y los de
`reduced-motion.spec.ts` tienen sujeto de sobra en el contenido actual.

**No se decide aquí.** Va al recálculo posterior al sprint, con tres salidas sobre la mesa: nace un
quinto frente y todo revive · se sustituyen por pruebas de ruta con un frente de mentira en un
fixture · se retiran declarándolo. La tercera es legítima; lo que no lo es, es dejarlas saltadas en
silencio otro sprint más.

---

### 0.6 · Verificación de la fase 0

| Comprobación                                                         | Resultado                                   |
| -------------------------------------------------------------------- | ------------------------------------------- |
| `pnpm test`                                                          | **390 pasan / 390** · 26 archivos           |
| Cobertura global                                                     | 92,8 % stmts · 82,7 % branches · 93,8 % func |
| `pnpm typecheck`                                                     | limpio                                      |
| `pnpm lint`                                                          | limpio                                      |
| `pnpm build`                                                         | OK                                          |
| `git grep -nE "vercel[.]app\|workers[.]dev\|pages[.]dev" -- ':!pnpm-lock.yaml'` | vacío                             |
| `ci.yml` parsea y el job `lighthouse` tiene sus 3 pasos              | verificado con el parser de `yaml`          |

Los dos gates nuevos **no se han visto correr en CI todavía**: el workflow dispara en
`pull_request` y en push a `main`, y el PR del sprint se abre al cierre. Hasta entonces, de la
regla 14 están pagadas las preguntas «¿lo viste fallar?» y «¿puede fallar?»; **«¿lo viste
correr?» queda pendiente y se declara** — es exactamente la mitad de la regla que no se puede dar
por buena con corridas locales.

---

## Fase 1 — el canal, su aduana, la migración y el informe

### 1.1 · Por qué el canal se llama «a fondo» y no «detalle»

La palabra ya significa otras dos cosas en esta app: el case study de un proyecto
(`messages.detalle`, `DetalleVisitTracker`) y el último tramo de la ficha larga de una app
(`/vitrina/apps/<slug>/detalle`). Un tercer significado cuesta más que un nombre nuevo, cada vez
que alguien lee el código. → `data/a-fondo/<slug>.<locale>.md`. **Desviación 3**, declarada.

### 1.2 · Las piezas

| Archivo                                     | Qué es                                                                                         |
| ------------------------------------------- | ------------------------------------------------------------------------------------------------ |
| `scripts/a-fondo.mjs`                       | El motor: frontmatter Zod, parser de subsecciones, las cinco reglas de aduana, el troceo         |
| `scripts/destinos.mjs`                      | El catálogo de destinos, **derivado** de la HOME y de los datos                                  |
| `scripts/build-chat-index.mjs`              | Reescrito sobre el canal nuevo; la historia sale, la aduana entra                                |
| `data/a-fondo/*.es.md` (12)                 | La migración                                                                                     |
| `data/a-fondo/README.md`                    | El índice del canal, para corregir documento por documento                                       |
| `tests/fixtures/historia-esqueleto-s3.json` | El esqueleto congelado el día que se retiró — referencia del test de conservación                |
| `decisions/019-canal-a-fondo.md`            | ADR-019                                                                                          |

El motor vive en `scripts/` y no en `src/lib/` por una razón y no por comodidad: **`src/lib/` es
para lo que la app renderiza, y aquí no hay nada que renderizar.** Sin páginas, el único consumidor
del canal es el build. Se prueba desde vitest exactamente igual que se probaba `parseHistoria`.

### 1.3 · El catálogo de destinos: el invariante, no el síntoma

El síntoma era `ancla: #apps` en la sección `apps-pipeline` del esqueleto. El invariante es que
**el destino de una cita tiene que existir**, y la lista de destinos no se mantiene a mano: se
deriva.

- **Anclas de la HOME, en dos saltos:** qué componentes monta `page.tsx` dentro de `<main>`, y qué
  `id="…"` declara cada uno de esos archivos. El segundo salto solo mira los del primero, y eso
  importa: `roadmap.tsx` declara `id="roadmap"` y vive en `components/home/`, **pero la HOME ya no
  lo monta** — el roadmap se fue a `/vitrina/apps`. Listarlo habría sido revivir el error de
  `#apps` con otro nombre. Hay un test que exige justo eso.
- **Rutas:** de los mismos datos que generan las páginas (`cv.*.yaml`, `apps.yaml`,
  `vitrina.yaml`, `content/`). Hoy: **17 anclas y 52 rutas**.

Y la regla corre sobre **todos** los chunks, no solo los del canal nuevo. Fue lo correcto: el
`#apps` muerto vivía **en dos sitios a la vez** — el esqueleto de la historia y los cuatro chunks
que salen de `apps.yaml`. Se corrigieron los dos; el de las apps pasa a `#vitrina`.

### 1.4 · Un hallazgo de YAML que conviene no volver a sufrir

El primer `ancla: #apps` sin comillas **no llegó siquiera al gate**: YAML lee `#` como comienzo de
comentario y el campo llega `null`. Lo cazó el schema («`ancla`: expected string, received null»),
que es donde debía cazarse. Por eso el manual insiste en que el ancla **va entre comillas**, y por
eso el diagnóstico nombra el campo.

### 1.5 · Los seis rojos, en el mismo commit (regla 14)

| #   | Rojo                          | Cómo se puso rojo                                               | Qué imprimió                                                                                                  |
| --- | ----------------------------- | --------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------- |
| 1   | Frontmatter inválido          | `estado: casi-listo`                                            | `data/a-fondo/vesting.es.md: frontmatter inválido:` → `  - estado: Invalid option: expected one of "borrador"\|"aprobado"` |
| 2   | Id de subsección duplicado    | dos `<!-- seccion: arquitectura -->` en el mismo documento      | `id de subsección duplicado "arquitectura". Dos subsecciones con el mismo id producen dos chunks que compiten por la misma cita.` |
| 3a  | Aprobado sin gemelo           | `estado: aprobado` con dos subsecciones y sin `.en.md`          | `está «aprobado» y no existe su gemelo data/a-fondo/vesting.en.md — un idioma ciego es peor que un PR que espera.` |
| 3b  | Paridad rota POR SUBSECCIÓN   | gemelo inglés al que le falta una subsección                    | `vesting: las subsecciones no coinciden entre idiomas — falta(n) en inglés: proceso-core.`                     |
| 4   | Privacidad                    | correo + teléfono + documento + dominio en una subsección       | **6 hallazgos con línea exacta**: correo, teléfono internacional, teléfono agrupado, «siete dígitos seguidos», y los dos dominios |
| 5   | Destino inexistente           | **SOLO — el `#apps` que el esqueleto traía roto de verdad**     | `«ancla: #apps» no existe en el sitio. Una cita que no lleva a ninguna parte rompe la promesa del chat.`       |
| 5b  | Destino inexistente en CHUNKS | devolver `#apps` al chunk de las apps (la segunda fuga real)    | `✖ Destinos de cita inexistentes` × 4: `app-hoja-de-vida`, `app-chat-hoja-de-vida`, `app-fabric-analitica-e2e`, `app-agente-gemini-vertex` |
| 6   | Un borrador se cuela al índice | quitar `if (doc.estado !== "aprobado") continue;`               | 2 tests en rojo: «un BORRADOR no aporta ni un chunk» y «el a fondo aprobado entra por subsección…»             |

El rojo **5 no necesitó mutación**: era el estado real del repositorio. El 5b tampoco es hipotético
— es el mismo destino muerto que vivía en el índice publicado desde la revisión post-S7.

**La tercera pregunta (¿puede fallar siquiera?):** las seis pueden, y ninguna regla anterior las
alcanzaba. El schema de `chatChunkSchema` valida que `ancla` sea un string **no vacío**, no que
exista; y la paridad de la historia comparaba «tiene texto / no tiene texto» por sección, nunca el
**conjunto** de subsecciones.

### 1.6 · La privacidad, calibrada contra los documentos reales

Seis patrones: correo · teléfono internacional · teléfono agrupado · siete dígitos seguidos
(cédula, NIT, teléfono local) · dirección web · dominio suelto.

**Lo que NO dispara**, con test propio para cada caso: `2009 — 2016`, `2016-2017`, `ISO 9001:2015`,
`DP-600`, `1.234.567`, `Next.js 16.3.4`, `data/cv.es.yaml`. Son las siete formas en que un barrido
de privacidad mal calibrado convierte un documento correcto en un rojo, y el autor aprende a
ignorarlo.

**Y lo que ningún regex caza: los nombres propios.** Por eso la regla vive en **tres capas** —este
barrido, el checklist de la cabecera de cada documento y mi lectura en cada PR— y no en una.

### 1.7 · La migración y el test de conservación

La orden pedía un **«test de igualdad de prosa»** entre la historia y el canal nuevo. **No había
prosa que comparar:** `data/historia/historia.{es,en}.md` eran 12 encabezados con su marca y su
guía, y cero contenido — el build lo imprimía en cada corrida (`0 secciones de historia con
contenido`) desde el S3. Una prueba de igualdad habría probado el vacío y habría pasado en verde
para siempre. **Desviación 1**, declarada.

Lo que sí se puede conservar, y es lo que valía, son **los 12 ids, sus títulos, sus destinos y las
guías que escribió el dueño**. El esqueleto se congeló en `tests/fixtures/historia-esqueleto-s3.json`
el día que se retiró, y el test exige contra él: cada id tiene su documento, con el mismo título y
el mismo destino —salvo `#apps → #vitrina`, con la razón escrita en la aserción— y **la guía
sobrevive palabra por palabra** dentro del documento. Si alguien borra un documento migrado, el
test lo nombra. Es un gate durable, no una comprobación de un solo uso.

`data/historia/` retirada, y con ella `parseHistoria` y `checkHistoriaParity`. Lo que seguía
valiendo se reescribió sobre el canal nuevo: el barrido de credenciales de `content.test.ts` ahora
recorre los 12 documentos en vez de los 2 archivos de la historia.

### 1.8 · Informe de discrepancias

`sprints/SPRINT_008-informe-discrepancias.md` — **12 diferencias** entre lo publicado y la hoja de
vida fusionada, en los dos idiomas, ordenadas por peso, cada una con su pregunta. **Nada
corregido**, como manda la orden. Ninguna cifra del sitio resultó inventada ni contradictoria: las
veinte cifras duras coinciden palabra por palabra.

Las dos de peso alto: **el AI-103 no existe en el sitio** (el AI-102 se retiró y nada ocupó su
lugar, y la orden pide orientar el contenido a él) y **Fundación CTIC sigue sin una sola cifra**,
en los dos documentos a la vez. Las dos que son cifra o afirmación y por tanto no pueden esperar:
el −35% de Banco Pichincha mide «procesamiento» en la hoja de vida y «análisis» en el sitio, y
«modelos semánticos» es una interpretación del sitio que la hoja de vida no hace.

La hoja de vida **no entró al repositorio** y ningún dato de contacto aparece en el informe.

### 1.9 · Verificación de la fase 1

| Comprobación   | Resultado                                                        |
| -------------- | ------------------------------------------------------------------ |
| `pnpm test`    | **503 pasan / 503** · 29 archivos (eran 390 / 26 al cerrar la fase 0) |
| `pnpm typecheck` | limpio                                                           |
| `pnpm lint`    | limpio                                                            |
| `pnpm build`   | OK — `28 chunks (0 de 12 documentos «a fondo» aprobados e indexados)` |

Tres roturas de typecheck que solo vio `tsc`, no vitest, y que valen una línea: el flag `/s` de una
expresión regular no está disponible con el target de este repo; el `= []` por defecto de `aFondo`
hacía que TS infiriera `never[]` desde el `.mjs`; y un fixture de los tests de guardrails seguía
nombrando `historia`. Corregidas.

