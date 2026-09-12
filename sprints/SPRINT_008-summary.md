---
sprint: 008
app: hoja-de-vida
status: closed
opened: 2026-09-12
closed: 2026-09-12
branch: sprint-008/el-detalle
pr: <se completa al abrir el PR>
---

# Sprint 008 Summary — CV Viva

## Outcome

**Parcial, y el corte es una decisión del dueño, no una deuda técnica.** El canal del corpus
profundo existe entero —formato, aduana, troceo, citas, golden set, banco de preguntas— y la base
de 24 documentos está escrita. **Lo que no se logró es publicar el primer documento aprobado (M1) y
con él M2**, porque el dueño decidió corregir los 24 antes de aprobar ninguno: «Definitivamente
primero lo corrijo, es una labor larga, así que quiero iniciarla cuanto antes».

## Qué se construyó

**El canal `a-fondo`** (ADR-019): `data/a-fondo/<slug>.<locale>.md`, frontmatter Zod + subsecciones
`##` con `<!-- seccion: id -->`. **Sin páginas de ningún tipo** —decisión del dueño: «ese detalle no
lo puede ver NADIE»—, así que los documentos son combustible y la cita `[n]` navega al `ancla` del
documento, que es algo **visible** del sitio.

**Su aduana**, que rompe el build nombrando archivo y campo: frontmatter inválido · id de subsección
duplicado · paridad ES/EN rota en un aprobado · privacidad mecánica (correo, teléfono, siete dígitos,
dirección web, dominio suelto) · nombre de archivo que miente · **destino de cita inexistente** ·
**`[CONFIRMAR]` en un documento aprobado**.

**El catálogo de destinos derivado** (`scripts/destinos.mjs`): las anclas de la HOME se leen de qué
componentes monta `page.tsx` dentro de `<main>` y qué `id` declara cada uno; las rutas, de los mismos
datos que generan las páginas. 17 anclas y 52 rutas, y **vale para todos los chunks**, no solo para
los del canal nuevo.

**La base: 24 documentos en borrador** —132 subsecciones, 14 268 palabras, 30 `[CONFIRMAR]`— con
`data/a-fondo/README.md` como índice de corrección, con su tabla **generada**.

**El troceo con tope** (180 palabras, ventanas por párrafo, suelo de 40) y **un solo
`TOP_K_CONTEXTO`**, exportado y medido, donde antes había dos números distintos en dos archivos.

**El banco de preguntas** (fase 4b, a pedido del dueño): 131 preguntas escritas desde afuera, con la
fuente que debería contestar cada una, como gate permanente; su informe se genera con
`pnpm corpus:informe`.

**Deudas del kit y de la casa pagadas de paso:** el veto de `ink-3` como texto pasa de prosa a test
(y cazó tres violaciones vivas) · Lighthouse con 3 corridas y mediana · **el gate de categorías
Lighthouse que `/deploy-check` prometía desde hacía siete sprints y no existía** · CLAUDE.md reglas
5, 14 y 16 · `/deploy-check` §3/§8/§9 y `/audita-sprint` «Quién audita la Fase 1».

## DoD — checklist (los 6+1)

| Estándar           | Estado | Evidencia                                                                                                                                                                               |
| ------------------ | ------ | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Testing**        | ✅     | 758 unitarias (eran 615) en 31 archivos · golden set 48/48 · banco 131/131 · e2e completo verde                                                                                         |
| **CI/CD**          | ✅     | Los dos gates nuevos de Lighthouse **corren por primera vez en este PR** — sin histórico, no puede afirmarse regresión ni no-regresión                                                  |
| **Observabilidad** | ✅     | Sin endpoints nuevos. El build imprime la cuenta real: «28 chunks (0 de 24 documentos aprobados e indexados)»                                                                           |
| **Seguridad**      | ✅     | `pnpm audit --audit-level high` limpio · gitleaks en cada commit · **cero terceros identificables** con lectura registrada sobre los 24 · barrido cero enlaces tras el último `git add` |
| **Performance**    | ✅     | Sin rutas nuevas. `budgetsFile` + categorías ≥0,9, mediana de 3 corridas sobre 15 URLs                                                                                                  |
| **UX + A11y**      | ✅     | Tres violaciones de contraste vivas corregidas (`not-found`, el placeholder del chat, el `/` del encabezado) y el veto convertido en test                                               |
| **IA embebida**    | ✅     | Retrieval determinista · guardrails medidos con 131+15 preguntas · el golden set es un test, no un juicio de LLM · cero llamadas nuevas al proveedor                                    |

## Métricas técnicas — los 15 criterios de la orden

| #   | Criterio                                                        | Estado                                                                                                                                                                                                                                           |
| --- | --------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| 1   | 12 documentos migrados con igualdad de prosa; historia retirada | **Con desviación** — la historia **no tenía prosa** (el build imprimía «0 secciones con contenido» desde S3): la igualdad habría probado el vacío. Se sustituyó por un **test de conservación** contra un fixture congelado. Historia retirada ✔ |
| 2   | Aduana con cuatro rojos demostrados                             | **Completo y excedido** — seis rojos en la fase 1, uno más en la 4b                                                                                                                                                                              |
| 3   | `/detalle` y `/detalle/<slug>`                                  | **No implementado** — decisión del dueño: sin página ni puertas                                                                                                                                                                                  |
| 4   | «Leer el detalle» en HOME y case study                          | **No implementado** — misma decisión                                                                                                                                                                                                             |
| 5   | Chunks por subsección con tope; citas; fallback legible         | **Con desviación** — tope ✔, fallback ✔; la cita navega al `ancla` visible y no a una página que no existe                                                                                                                                       |
| 6   | `TOP_K_CONTEXTO` y `UMBRAL_ON_TOPIC` recalibrados con números   | **Completo** — y rehecho en la 4b con 131 preguntas                                                                                                                                                                                              |
| 7   | Golden set con su rojo                                          | **Completo en ES** — en EN no hay documentos todavía (nacen al aprobar)                                                                                                                                                                          |
| 8   | E2e ES/EN: pregunta → cita → navegación → encabezado enfocado   | **No aplica** — no hay página a la que navegar. El e2e del chat existente sigue verde                                                                                                                                                            |
| 9   | Axe y Lighthouse en rutas nuevas                                | **Con desviación** — no hay rutas nuevas; Lighthouse ganó mediana de 3 y el gate de categorías                                                                                                                                                   |
| 10  | Barrido cero enlaces · cero terceros                            | **Completo**                                                                                                                                                                                                                                     |
| 11  | Guía v8 · MANUAL · ADR-019 · CLAUDE.md · inventario S7          | **Completo**                                                                                                                                                                                                                                     |
| 12  | `/audita-sprint` fase 1 independiente · summary en el PR        | **Completo**                                                                                                                                                                                                                                     |
| 13  | Informe de validación contra la hoja de vida                    | **Completo, sin aplicar** — 12 discrepancias entregadas; **ninguna se corrigió** porque ninguna tiene todavía el visto bueno del dueño                                                                                                           |
| 14  | Base completa en borrador con su índice                         | **Completo** — 24 documentos, 132 subsecciones, 30 `[CONFIRMAR]`, README índice, rojo demostrado                                                                                                                                                 |
| 15  | **≥1 documento aprobado y publicado, con su cita del chat**     | **NO LOGRADO** — el corte declarado, abajo                                                                                                                                                                                                       |

## El corte declarado

**M1 y M2 quedan pendientes del dueño.** La orden cerraba el sprint con al menos un documento
aprobado y publicado; el dueño decidió lo contrario cuando vio el tamaño de la corrección, y tiene
razón en el orden: aprobar un documento sin haberlo corregido es publicar mi prosa, no la suya.

Qué falta exactamente, y quién lo hace:

1. **Él corrige** los 24 documentos y resuelve los 30 `[CONFIRMAR]` y las 12 discrepancias.
2. **Él aprueba** el primero (`estado: aprobado`).
3. **Yo traduzco** el gemelo `.en.md` y él aprueba el inglés.
4. El build lo indexa y **ahí se pagan M1 y M2**, que están escritas como ⭐ o9 y o10 de la guía.

Mientras tanto, **el índice publicado no se movió**: 28 fragmentos, byte por byte los mismos que
antes del sprint. El visitante no ve ninguna diferencia, y es lo correcto.

## Decisiones no anticipadas

- **ADR-019 — el canal a fondo**: el formato, el `estado` que manda dos cosas a la vez, la cita
  hacia lo visible, el destino verificado, la pregunta abierta como parte del formato y el banco de
  preguntas como prueba del contenido.
- **`data/credenciales-nombradas.yaml`**: el gate del S7 («toda credencial nombrada está en
  `certificaciones`») se puso rojo con 15 huérfanos al escribir el corpus. Ni meter el AI-103 en el
  YAML (sería declarar una credencial que no tiene) ni reescribir la prosa para esquivar el gate:
  se extendió el invariante con un **segundo estado declarable** — nombrada y no obtenida, con su
  razón escrita.

## Bugs + resoluciones

| Qué                                                                                                                  | Cómo se resolvió                                                                                                                     |
| -------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------ |
| `ancla: #apps` sin comillas → YAML lo lee como comentario y el campo llega vacío                                     | Comillas en todas las anclas; el manual insiste en ello con la razón                                                                 |
| El `#apps` muerto vivía en **dos** sitios (el esqueleto y cuatro chunks de `apps.yaml`)                              | El catálogo de destinos derivado: la regla, no el síntoma                                                                            |
| Tres errores de typecheck que vitest no veía (`/s`, un `never[]` inferido del `.mjs`, un fixture con `historia: []`) | Corregidos; `pnpm typecheck` entra al ritmo de verificación de cada fase                                                             |
| Una afirmación falsa **mía** en un comentario de `ci.yml` («el redirect lo cubre el e2e de rutas»)                   | Verificado que nada lo cubre: el comentario se reescribió y el hueco entró al inventario                                             |
| Cuatro subsecciones repetían **la oferta de trabajo casi palabra por palabra**                                       | Reescritas; secuestraban el top-4 de todas las preguntas de ese perfil y metían la redacción de un tercero en un repositorio público |
| Los 30 `[CONFIRMAR]` entraban al índice simulado como prosa                                                          | La aduana los prohíbe en un aprobado; la simulación los quita antes de medir                                                         |
| `data/a-fondo/README.md` declaraba 53 preguntas abiertas; son 30                                                     | Contaba la línea de la plantilla de los 24 archivos. La tabla pasa a **generarse**                                                   |
| Deshice un demo con `git checkout --` y me llevé trabajo sin commitear                                               | Repuesto y verificado; anotado en la bitácora: para demostrar un rojo sobre trabajo sin commitear, la copia va aparte                |

## Qué salió bien / qué generó fricción

**Bien.** Medir en vez de suponer, tres veces seguidas: el `#apps` muerto salió de derivar el
catálogo; la historia vacía salió de leer la salida del build en vez de la orden; y las 17 preguntas
rojas del banco salieron de preguntarle al corpus con palabras que no eran las suyas. Ninguno de los
tres estaba en el plan.

**Fricción.** El sprint construyó un canal cuyo producto —el contenido— no puede terminarlo quien lo
construye. Eso deja el cierre con un criterio de aceptación sin cumplir por diseño, y obliga a
declarar el corte en vez de esconderlo en un «parcial».

## Sugerencias de mejora al método

1. **Un corpus que alimenta un buscador léxico necesita una prueba de vocabulario, no solo de
   formato.** La orden pedía golden set —preguntas escritas con el documento delante—, y eso no
   puede encontrar lo que el banco encontró: que el corpus decía «extracción, transformación y
   carga» y nunca «ETL», ni «lakehouse», ni «MLOps». Propuesta: **todo canal de contenido que
   alimente recuperación léxica entrega un banco de preguntas escritas desde fuera**, con su
   informe generado.
2. **Un sprint cuyo entregable depende del contenido del dueño debería declarar el corte en la
   orden**, no descubrirlo al final. La orden cerraba con «≥1 documento aprobado»; la enmienda del
   mismo día ya decía que la base la redacta el constructor. Entre esas dos cosas hay un turno del
   dueño que el plan del sprint no puede comprimir.
3. **La regla 14 tiene una cuarta pregunta práctica:** para demostrar un rojo sobre trabajo sin
   commitear, la copia de seguridad va aparte. `git checkout --` no distingue la mutación del
   trabajo.

## Deuda técnica aceptada

| Qué                                                                                               | Por qué                                                           | Pago                                                        |
| ------------------------------------------------------------------------------------------------- | ----------------------------------------------------------------- | ----------------------------------------------------------- |
| **M1 y M2 sin pagar**                                                                             | Dependen de la corrección del dueño                               | El PR de contenido donde apruebe el primer documento        |
| Los `.en.md` no existen                                                                           | Un borrador no exige gemelo, a propósito                          | Se traducen al aprobar, documento por documento             |
| Golden set y banco solo en ES                                                                     | No hay documentos en EN todavía                                   | `banco-de-preguntas.en.yaml` nace con la primera traducción |
| 3 e2e de la vitrina saltados desde el S7 + el 404 de una pieza en un frente cerrado sin sustituto | Inventariado en la fase 0, no resuelto: la orden pedía inventario | El recálculo del ciclo H2                                   |
| El redirect de `/` a `/es` no lo cubre ningún test                                                | Encontrado al verificar una afirmación mía falsa                  | Sprint siguiente, con el resto del inventario               |
| Las 6 ⭐ del S8 diferidas                                                                         | Sprint intermedio del ciclo H2 (4 de ≥4)                          | Recorrido de cierre del ciclo, con las 25 acumuladas        |

## Archivos clave

1. `scripts/a-fondo.mjs` — el motor del canal: aduana, troceo, preguntas abiertas
2. `scripts/destinos.mjs` — el catálogo de destinos derivado de la HOME y de los datos
3. `scripts/evaluar-corpus.mjs` — el motor del banco de preguntas y sus informes
4. `data/a-fondo/` — los 24 documentos y su README índice
5. `tests/fixtures/banco-de-preguntas.es.yaml` — 131 preguntas de afuera
6. `tests/unit/banco-de-preguntas.test.ts` · `a-fondo-golden.test.ts` — los dos gates del contenido
7. `src/lib/ia/retrieval.ts` — `TOP_K_CONTEXTO` único, medido y exportado
8. `decisions/019-canal-a-fondo.md`
9. `sprints/SPRINT_008-informe-discrepancias.md` · `SPRINT_008-banco-de-preguntas.md`
10. `docs/GUIA-DE-PRUEBA.html` v8 · `docs/MANUAL-DE-USO.md`

## Cómo probar

1. `pnpm test` — 758 unitarias, con el golden set y las 131 del banco.
2. `pnpm build` — la última línea dice la cuenta real: `28 chunks (0 de 24 documentos aprobados)`.
3. `pnpm corpus:informe` — regenera el informe del banco y la tabla del índice.
4. **La guía**: `docs/GUIA-DE-PRUEBA.html`, bloque **O**. Las seis ⭐ son de lectura y de juicio
   sobre el contenido — son justamente lo que ninguna automatización puede hacer por el dueño.
