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

---

## Fase 2 — la base en borrador: los 24 documentos

### 2.1 · Lo que hay

| Medida                          | Valor                                                  |
| ------------------------------- | -------------------------------------------------------- |
| Documentos                      | **24**, todos `estado: borrador`                        |
| Subsecciones                    | **132** (4–6 por documento, como pedía el plan)         |
| Palabras de prosa               | **~16 450** (sin contar comentarios)                    |
| Marcas `[CONFIRMAR]`            | **52**                                                  |
| Documentos aprobados e indexados | **0** — y el build lo imprime en cada corrida           |

Índice para corregirlos uno a uno: `data/a-fondo/README.md`, en el orden del mapa aprobado (de la
trayectoria a las capacidades), con el número de `[CONFIRMAR]` de cada uno a la vista.

**Fuentes:** la hoja de vida fusionada (fuera del repo) · `cv.{es,en}.yaml` · los 5 case studies ·
`apps.yaml` · `vitrina.yaml` · los 6 brochure-export · las 26 fichas técnicas de agentes,
investigaciones y tableros · `data/fichas/` · el manual.

### 2.2 · Las 52 marcas `[CONFIRMAR]` son la señal de que el método funcionó

Ninguna cifra, fecha ni logro se escribió sin fuente. Donde la fuente no existía, quedó la marca con
**qué falta y por qué importa** — nunca un dato plausible. Las que más pesan:

- **`fundacion-ctic`**: el rol actual sigue sin una sola cifra, en la hoja de vida y en el sitio. Es
  el vacío más importante de los 24 y tiene subsección propia que lo dice de frente.
- **`vesting`**: falta el tamaño (volumen, clientes integrados), qué se capturaba de cada agente y
  cuántos agentes se vigilaban a la vez.
- **`banco-pichincha`**: qué predecían los modelos, y las dos discrepancias de fondo (el −35% y los
  «modelos semánticos»).
- **`certificaciones`**: desde cuándo va la ruta del AI-103, si su temario sigue siendo el del
  AI-102, y si entra al sitio.
- **`analitica-predictiva`**: de PyTorch, TensorFlow, Watson Studio, Orange, SPSS y SAS, cuáles se
  usaron en un trabajo real y cuáles vienen de formación. Un documento que no distingue lo dominado
  de lo visto se cae en la primera entrevista técnica.
- **`procesos-y-simulacion`**: dónde se usaron Bizagi y FlexSim. Hoy están en la hoja de vida sin un
  uso asociado y **no aparecen en las skills del sitio**.

### 2.3 · Cero terceros — la tercera capa, que es mi lectura

El barrido mecánico pasó limpio sobre los 24. Pero la regla dice que los nombres propios no los caza
un regex, así que leí: barrí los 24 documentos buscando mayúsculas que no fueran organizaciones,
productos o lugares ya publicados.

**Un hallazgo, y lo aparté.** La hoja de vida nombra la consultoría de Ceinfes por su razón social,
que **lleva el nombre de una persona**. Lo escribí en el primer borrador y lo retiré: `cv.es.yaml`
tampoco lo publica —dice solo «Ceinfes»— y un nombre propio de tercero no viaja a un archivo de este
repositorio sin visto bueno del dueño. Queda como `[CONFIRMAR]` dentro del documento, con la razón
escrita.

Es exactamente el caso que el plan anticipó al exigir tres capas en vez de una.

### 2.4 · El gate de credenciales del S7 se puso ROJO, y tenía razón

Al terminar de escribir, `pnpm test` cayó con **15 huérfanas**: `AI-103` y `AI-102` nombrados en
`a-fondo/certificaciones.es.md` y `a-fondo/como-aprendo.es.md` sin existir en `certificaciones`.

El gate nació el 2026-09-10 con una regla de un solo estado: **una credencial nombrada es una
credencial listada**. El canal nuevo destapó el caso que le faltaba: **un documento cuyo TEMA es el
estado de una credencial** —una descontinuada, una en curso— tiene que escribir el código
justamente para decir que NO se tiene.

Tres salidas había, y dos eran malas:

1. **Meter el AI-103 en `cv.*.yaml`** para que el test pasara. **Descartada**: es la discrepancia 1
   del informe y la orden dice que nada se corrige sin el OK del dueño. Un gate no se satisface
   tomando por él una decisión que es suya.
2. **Quitar los códigos de la prosa.** Descartada: el dueño pidió expresamente que el contenido se
   oriente a «DP-600 vigente, AI-103 en desarrollo». Reescribir para que quepa es la versión de
   texto de editar una ficha ajena «para que quepa».
3. **Afinar el invariante**, que es lo que se hizo.

**Qué cambió exactamente.** Ahora hay **dos estados declarables** en vez de uno: el código está en
`certificaciones` (se tiene), **o** está en `data/credenciales-nombradas.yaml` **con su razón
escrita** (se nombra y se dice por qué no se tiene). Un código que no esté en ninguna de las dos
rompe igual que antes.

**La promesa del gate no se debilitó, se completó:** sigue siendo imposible afirmar una credencial
que no se tiene, y ahora además es imposible **mencionar** una sin declarar por qué. Antes ese caso
no estaba prohibido: estaba fuera del alcance del gate. De hecho el manual llevaba dos días
explicando la descontinuación del AI-102 sin que nada lo vigilara.

**Los dos rojos, en el mismo commit:**

| Rojo | Mutación                                         | Qué imprimió                                                                                     |
| ---- | ------------------------------------------------ | -------------------------------------------------------------------------------------------------- |
| A    | retirar `AI-103` de la lista declarada           | 11 huérfanas nombradas con archivo: `AI-103 en a-fondo/certificaciones.es.md`, `…/como-aprendo.es.md` |
| B    | dejar una declaración con `razon` vacía          | `credenciales-nombradas.yaml: «AI-103» sin razón. Nombrar una credencial que no se tiene es una decisión, y una decisión sin razón escrita no es declarable.` |

Y la `[CONFIRMAR]` de la decisión de fondo vive **dentro del propio archivo de datos**, junto al
código: si el AI-103 entra a `certificaciones`, su entrada aquí se borra.

### 2.5 · Verificación de la fase 2

| Comprobación     | Resultado                                                               |
| ---------------- | ------------------------------------------------------------------------- |
| `pnpm test`      | **551 pasan / 551** · 29 archivos (503 al cerrar la fase 1)              |
| `pnpm typecheck` | limpio                                                                   |
| `pnpm lint`      | limpio                                                                   |
| `pnpm build`     | OK — `28 chunks (0 de 24 documentos «a fondo» aprobados e indexados)`    |
| Aduana sobre los 24 | limpia: nombre, destino, privacidad y paridad                         |
| Lectura de terceros | hecha y registrada arriba — un hallazgo, apartado                     |

El índice publicado **no creció ni un chunk**, y eso es exactamente lo correcto: 24 borradores no se
indexan. La base entera está escrita y el chat todavía no la ve — que es lo que permite corregirla
sin publicar medio documento.

---

## Fase 3 — el chat sobre el corpus nuevo

### 3.1 · El troceo con tope, medido antes de elegir el número

El tope no se eligió por intuición. Medidas las 132 subsecciones escritas: **mediana 101 palabras,
percentil 90 en 143, la más larga 247**. A 180 se trocean 5 subsecciones (4 %); a 120 se trocearían
33 (25 %), que es partir por partir. **`TOPE_PALABRAS_CHUNK = 180`: el tope corta la cola, no el
cuerpo.**

Tres decisiones dentro del troceo, y las tres tienen su prueba:

- **Se corta por párrafo, nunca a media frase.** Un fragmento cortado a mitad de oración, citado, se
  lee truncado. Un párrafo que ya excede el tope por sí solo **viaja entero**: el tope cede antes
  que la legibilidad de la cita.
- **Suelo de ventana: `MINIMO_PALABRAS_VENTANA = 40`.** La primera versión producía colas de 23, 30
  y 31 palabras — chunks que pueden ganar el top-k por un término suelto y, citados, no dicen nada.
  Ahora la cola corta se funde con su vecina aunque pase el tope. Efecto medido: **de las 5
  subsecciones que exceden 180, solo 2 se parten de verdad**; las otras 3 se quedan enteras porque
  su cola no llegaba al suelo.
- **El sufijo de ventana es `~n`, no `-n`.** Un id de subsección admite `[a-z0-9-]`, así que con `-`
  la ventana 1 de `el-ai-103` y una subsección llamada `el-ai-103-1` colisionarían. Con `~` la
  colisión es **imposible por construcción**, no improbable.

| Configuración | Chunks | Chunk más largo | Contexto peor caso (k=4) |
| ------------- | -----: | --------------: | -----------------------: |
| Sin tope      |    132 |             247 |                      816 |
| Tope 180      |    134 |             195 |                      738 |

Las ventanas conservan la **misma ancla**: la cita lleva al mismo sitio visible. Solo cambia el
título, que dice `(1/2)` para que el chip del chat no repita.

### 3.2 · `TOP_K_CONTEXTO`: uno solo, exportado, y con su número medido

Hasta el S7 este número vivía **dos veces y con dos valores**: `TOP_K_CONTEXTO = 4` privado dentro
de `src/app/api/chat/route.ts`, y un **`3` escrito a mano** en `chat-panel.tsx` para el modo de
búsqueda local. El golden set no podía ejercitar ninguno, porque ninguno era importable.

Ahora vive en `src/lib/ia/retrieval.ts`, exportado, y es el valor por defecto del retriever. **El 4
sale de medir**, contra el corpus completo (162 fragmentos, 48 preguntas de prueba):

| k | Aciertos | % |
| - | -------- | - |
| 1 | 32/48 | 67 % |
| 2 | 42/48 | 88 % |
| 3 | 45/48 | 94 % |
| **4** | **48/48** | **100 %** |
| 5 | 48/48 | 100 % |

Con 3 fuentes fallan tres preguntas —`vesting`, `fabric-en-la-practica` y `transmilenio-cm`—; con 4
no falla ninguna y subir a 5 no aporta nada, solo contexto y factura. **El fallback local mostraba
menos evidencia que la que el modelo recibía**, y nada comparaba los dos números.

### 3.3 · El umbral off-topic: lo que la medición dijo fue que no hay umbral

Se midieron 9 preguntas legítimas y 9 ajenas contra los dos corpus:

| Corpus                      | On-topic mínimo | Off-topic máximo | ¿Separa? |
| --------------------------- | --------------- | ---------------- | -------- |
| 28 fragmentos (el publicado) | 0,00 («¿sabe Kubernetes?» — no hay nada que responder) | 3,41 | **NO** |
| 162 fragmentos (simulado)    | 6,55 («¿sabe Kubernetes?») | 16,64 («escribe una función en rust que ordene una lista») | **NO** |

El puntaje de MiniSearch **suma sobre los términos que casan**, así que una pregunta ajena larga con
tres palabras comunes puntúa más que una pregunta legítima corta. Subir el umbral hasta bloquear la
primera bloquea también la segunda. **Los dos grupos se solapan en los dos corpus.**

**La decisión, declarada:** `UMBRAL_ON_TOPIC` se queda en **1**, que significa «casó algo
sustantivo». Lo que se cuela pasa al modelo y ahí lo para el prompt grounding-only. El peor fallo
posible de este chat **no es gastar tokens en un chiste: es responder «eso se me escapa» a una
pregunta legítima sobre la trayectoria.** El comentario del constante ya no dice «calibrado»: dice
qué garantiza y qué no, con los números.

**La mitad que SÍ se arregló fueron las stopwords.** «cuéntame un chiste **sobre** gatos» puntuaba
**4,28 y pasaba el guardrail** — con el corpus de hoy, en producción, desde el S3. El único término
que casaba era la preposición «sobre», presente en 42 de 162 fragmentos. **El test no lo veía porque
preguntaba «chiste *de* gatos»**, y «de» sí era stopword: una prueba que pasaba por la redacción de
su ejemplo, no por el comportamiento del sistema. Entraron a `STOPWORDS` las preposiciones y los
imperativos dirigidos al asistente (`escribe`, `hazme`, `dime`…): son instrucción, no tema. Las dos
formas de la pregunta puntúan ahora 0.

Y el test de guardrails gana un caso nuevo que **documenta la limitación en vez de esconderla**:
«una pregunta ajena que comparte vocabulario SÍ pasa — y eso está decidido», con la contraparte
(`¿sabe Kubernetes?` sigue pasando) que impide que alguien «arregle» el umbral rompiendo lo que
importa.

### 3.4 · El golden set

`tests/unit/a-fondo-golden.test.ts`. Cada documento declara sus `preguntas_de_prueba` y el test
exige que **cada pregunta traiga su documento en el top-4 del retriever real**. Sumar un documento
suma sus preguntas al gate sin que nadie edite `tests/`.

**Se mide con los borradores forzados a aprobado, y eso es deliberado.** Si solo mirara los
aprobados tendría **cero sujetos** y pasaría en verde sin vigilar nada — el gate decorativo que la
tercera pregunta de la regla 14 persigue, y justo lo que inventarié en la fase 0. Que un borrador no
entre al índice publicado lo vigila `a-fondo.test.ts`: son dos preguntas distintas, cada una con su
gate.

**Siete preguntas mal asignadas, corregidas con la medición delante.** La primera corrida dio 41/48.
Los fallos no eran del retriever: eran preguntas que describían mejor a OTRO documento. «¿Qué
modelos predictivos ha construido?» colgaba de `transmilenio-cm` y traía `analitica-predictiva` —
que es la respuesta correcta. «¿Qué hizo Henry en TransMilenio?» es ambigua por construcción: hay
**dos** roles en TransMilenio. Se reescribieron las siete para que cada una discrimine su documento;
el criterio fue el mismo en todas: **si una pregunta trae un documento distinto pero correcto, la
mal escrita es la pregunta.** De 41/48 a 48/48.

**Los rojos, en el mismo commit:**

| Rojo | Mutación | Qué imprimió |
| ---- | -------- | ------------ |
| Pregunta que no describe a su documento | poner «¿Qué certificaciones de IBM tiene Henry?» en `vesting` | `«…» no trajo «vesting» en el top-4. Trajo: a-fondo-certificaciones-las-de-ibm, …` |
| `TOP_K_CONTEXTO = 3` (el valor que usaba el cliente) | — | **3 rojos**: `fabric-en-la-practica`, `transmilenio-cm`, `vesting`. La unificación del constante queda justificada por evidencia, no por gusto |
| Anular el tope de chunk (`1000`) | — | 2 rojos: las ventanas dejan de existir y el peor caso deja de estar acotado |

### 3.5 · M1 — listo, y esperando una palabra tuya

La maquinaria está completa y verde: el corpus trocea, el retriever encuentra, el `k` es uno solo,
la cita apunta al ancla del documento y el golden set lo defiende con 48 aserciones.

**Lo único que falta para M1 es que un documento esté `aprobado`**, y esa es una decisión del dueño,
no mía. El índice publicado sigue en 28 fragmentos porque los 24 están en borrador — que es
exactamente lo que el diseño promete.

### 3.6 · Verificación de la fase 3

| Comprobación     | Resultado                                          |
| ---------------- | ---------------------------------------------------- |
| `pnpm test`      | **615 pasan / 615** · 30 archivos (551 en la fase 2) |
| `pnpm test:e2e`  | **321 pasan / 321** · chromium + móvil              |
| `pnpm typecheck` | limpio                                              |
| `pnpm lint`      | limpio                                              |
| `pnpm build`     | OK — 28 chunks, 0 de 24 aprobados                   |

Los dos e2e que el corpus nuevo podía mover —el del chat y el del fallback— pasan. El cambio de 3 a
4 fuentes en el fallback solo añade evidencia; no mueve el orden.

