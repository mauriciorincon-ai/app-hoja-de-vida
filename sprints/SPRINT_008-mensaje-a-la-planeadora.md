# Mensaje a la planeadora — cierre del Sprint 008 y qué viene

> Redactado el 2026-09-12 desde el repo de la app (`app-hoja-de-vida`). Para pegar en la sesión de
> la planeadora (`hr01-develop-ai-apps`). La app no escribe allá: este archivo es la copia
> versionada de lo que se le dijo. El summary formal queda en `sprints/SPRINT_008-summary.md` y
> dentro del PR (#25).

---

Hola. Te informo del Sprint 008 «El detalle» de CV Viva. **El sprint entrega el canal completo y la
base escrita, pero un criterio de aceptación no se cumple y la razón es una decisión mía**, así que
te pido que lo tengas en cuenta para el recálculo del ciclo.

## 1. Lo que se hizo

El chat respondía con 28 fragmentos sacados de los YAML. Ahora existe el canal del corpus profundo
que le faltaba:

- **`data/a-fondo/<slug>.<locale>.md`** — un documento por tema, frontmatter validado con Zod,
  subsecciones marcadas, y un `estado` que manda dos cosas a la vez: un `borrador` no se indexa
  **y** no exige gemelo en inglés; un `aprobado` hace las dos.
- **Su aduana**, que rompe el build nombrando archivo y campo: frontmatter · ids duplicados ·
  paridad ES/EN de los aprobados · privacidad mecánica · nombre de archivo que miente · **el destino
  de la cita tiene que existir** · **ningún `[CONFIRMAR]` en un aprobado**.
- **El catálogo de destinos derivado** de la HOME y de los datos — no es una lista mantenida a mano.
- **La base: 24 documentos, 132 subsecciones, 14 268 palabras, 30 `[CONFIRMAR]`**, en borrador, con
  su índice de corrección.
- **Un banco de 131 preguntas** escritas desde afuera como gate permanente del contenido.
- **Deudas pagadas de paso:** el veto de `ink-3` como texto pasa de prosa a test · Lighthouse con
  mediana de 3 corridas · y **el gate de categorías que `/deploy-check` prometía desde hacía siete
  sprints sin que nadie lo midiera**.

## 2. El criterio 15 no se cumple, y es decisión mía

Tu orden cerraba el sprint con **≥1 documento aprobado y publicado**. No lo hay, y no es una deuda
técnica: **decidí corregir los 24 documentos antes de aprobar ninguno.** Aprobar uno sin corregirlo
sería publicar la prosa del constructor, no la mía, y la corrección es un trabajo mío de semanas.

Con eso caen también **M1 y M2**, que quedan escritas como pruebas ⭐ de la guía y se pagan cuando yo
apruebe el primer documento, por PR de contenido sin sprint.

**El índice publicado no se movió:** 28 fragmentos antes y después. Para el visitante, este sprint es
invisible — y es lo correcto.

## 3. Las siete desviaciones

| #   | Desviación                                                                                                                                                                            | Qué cae de tu orden                                                                                                                 |
| --- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------- |
| 1   | La historia **no tenía prosa** (12 encabezados y cero contenido; el build lo imprimía desde el S3): el «test de igualdad de prosa» habría probado el vacío → **test de conservación** | AC 1, en su forma                                                                                                                   |
| 2   | **Los documentos no se publican: sin página ni puertas** (decisión mía: eso no lo puede ver nadie)                                                                                    | **Outcome O2 entero** · AC 3 · AC 4 · AC 8 · la parte de citas del AC 5 · las dos URLs de Lighthouse del AC 9 · M1 y M2 redefinidas |
| 3   | `data/a-fondo/` en vez de `data/detalle/` — «detalle» ya significa otras dos cosas en la app                                                                                          | Solo el nombre                                                                                                                      |
| 4   | **Una regla de aduana más** de las que pedías: el destino de la cita debe existir                                                                                                     | Añade                                                                                                                               |
| 5   | El documento de «brechas» se reemplaza por «cómo aprendo» (decisión mía: callarlas)                                                                                                   | Cambia el mapa, ningún AC                                                                                                           |
| 6   | Sin librería de Markdown — consecuencia mecánica de la nº 2                                                                                                                           | El «render en build» del AC 3 queda sin sujeto                                                                                      |
| 7   | **El banco de preguntas** — lo pedí yo a mitad del sprint                                                                                                                             | Añade                                                                                                                               |

## 4. Tres cosas que creo que el método debería cambiar

1. **Un corpus que alimenta un buscador léxico necesita una prueba de vocabulario, no solo de
   formato.** Tu orden pedía un golden set: preguntas escritas con el documento delante, que usan
   sus palabras. Eso no puede encontrar lo que encontró el banco — que el corpus decía «extracción,
   transformación y carga» y nunca «ETL», ni «lakehouse», ni «MLOps», y que a «¿qué lo motiva?»
   respondía «eso se me escapa». **Propuesta: todo canal de contenido que alimente recuperación
   léxica entrega un banco de preguntas escritas desde fuera, con su informe generado.**
2. **Un sprint cuyo entregable depende de contenido que solo yo puedo escribir debería declarar el
   corte en la orden**, no descubrirlo al final. Entre «la base la redacta el constructor» (tu
   enmienda) y «≥1 documento aprobado» hay un turno mío que ningún plan puede comprimir.
3. **La regla del gate que se demuestra fallando tiene una cuarta pregunta práctica:** para
   demostrar un rojo sobre trabajo sin commitear, la copia de seguridad va aparte. `git checkout --`
   no distingue la mutación de prueba del trabajo real, y se llevó por delante dos cambios.

## 5. La auditoría independiente encontró lo que el constructor no podía ver

La corrió un auditor sin haber construido, con el diff delante. **Cuatro hallazgos Altos ciertos**, y
los tres primeros son los tres sitios donde la bitácora afirmaba algo que el diff no sostenía:

- **`#apps` seguía vivo en dos enlaces que un visitante pulsa** —el CTA principal del hero y el
  breadcrumb de cada brochure— mientras la bitácora afirmaba haberlos corregido. Y el sprint había
  construido justo la herramienta para cazarlo, apuntada a los datos y no a la interfaz.
- Un regex que **borraba prosa en silencio** si la marca `[CONFIRMAR]` iba en medio de una frase.
- El gate de credenciales **debilitado** mientras la bitácora decía lo contrario.
- Y cuatro de las siete desviaciones que **no existían en el repositorio**, solo en el plan.

Los cuatro están pagados en el PR, cada uno con su rojo demostrado. **Confirma la regla: nadie audita
bien lo que acaba de escribir.**

## 6. Estado del cierre

- **Gate ⭐ diferido**, como permitía tu orden para un sprint intermedio: **6 pruebas ⭐ nuevas** al
  acumulado del ciclo H2 (31 en total, ~3 h). Las condiciones se cumplen: diferimiento declarado en
  el summary, guía **acumulativa** v8 con filtro del acumulado, y los contrapesos (pasada del
  builder + e2e de reduced-motion).
- **Las 6 ⭐ del S8 son casi todas de lectura** —leer el corpus, buscar nombres de terceros,
  contrastar cifras—, que es lo único que ninguna automatización puede hacer por mí.
- Verificación: 768 unitarias · 321 e2e · typecheck · lint · build · audit limpios · barrido cero
  enlaces vacío. **Los dos gates de Lighthouse corren por primera vez en este PR**: sin histórico no
  se puede afirmar ni regresión ni no-regresión.

## 7. Lo que te pido para la planeación

1. **El siguiente sprint no depende de mi corrección**: los documentos se aprueban por PRs de
   contenido sin sprint, uno a uno, a mi ritmo.
2. **El recálculo del ciclo H2** tiene que recoger lo que el S7 dejó sin sujeto y que este sprint
   inventarió sin resolver: los 3 e2e saltados de la vitrina, el cuarto de las brochures, el 404 de
   una pieza en un frente cerrado, y **el redirect de `/` a `/es`, que hoy no lo cubre ningún test**
   (se descubrió al verificar una afirmación falsa en un comentario de la CI).
3. **La deuda declarada** está en el summary con sprint de pago asignado: dos campos del frontmatter
   sin lector, cinco umbrales nuevos sin su rojo registrado, el fragmento de una ruta sin validar, y
   ocho hallazgos menores de la auditoría.
