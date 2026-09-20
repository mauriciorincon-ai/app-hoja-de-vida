# Bitácora — reescritura del corpus «a fondo» (v2)

> PR de contenido sin sprint (canal de contenido, CLAUDE.md). Rama `contenido/a-fondo-v2`
> desde `main`. El plan, las preguntas, las respuestas del dueño y los cuatro informes de
> auditoría viven FUERA del repo (`~/Documents/hoja-de-vida-henry/a-fondo-auditoria/`): citan
> datos que todavía no se decidió publicar. Aquí queda lo que el repo puede contar: qué se
> cambió, qué gate nació, en qué paso salió rojo y a quién nombró.

---

## F0 — Preparación

**Qué se hizo.** Se copiaron a `data/a-fondo/` los 24 documentos que el dueño reescribió entre
el 2026-09-12 y el 2026-09-19 (de 14.268 a ~100.000 palabras). Siguen todos en
`estado: borrador`: el índice del chat no los ve y no se les exige gemelo en inglés.

**Arreglo mecánico, y solo mecánico.** Un barrido sobre los 24 —frontmatter, ids de subsección,
títulos, llaves y backticks sueltos, encabezados de tercer nivel, bloques de código sin cerrar y
párrafos repetidos dentro del mismo documento— encontró seis defectos en cinco archivos:

| Archivo                     | Defecto                                                                     | Arreglo                                                                    |
| --------------------------- | --------------------------------------------------------------------------- | -------------------------------------------------------------------------- |
| `certificaciones.es.md`     | el id `el-dp-600` y su título, tres veces: dos encabezados sin cuerpo        | se borran los dos vacíos; queda el que tiene la prosa                      |
| `cm-operaciones.es.md`      | una llave `}` suelta en su propia línea, dentro de `tableros-e-informes`     | se borra la línea                                                          |
| `fundacion-ctic.es.md`      | un backtick suelto en su propia línea, al cierre de `gobierno-institucional` | se borra la línea                                                          |
| `como-trabajo.es.md`        | el párrafo «El segundo criterio…» pegado dos veces seguidas                  | se borra la segunda copia                                                  |
| `vesting.es.md`             | el párrafo «La interacción entre las personas y el agente…» en dos secciones | se borra la copia de `monitoreo-de-agentes`; queda la de `el-proceso-core` |

Ningún cambio de contenido: ni una cifra, ni una fecha, ni una frase reescrita. Eso es F2.

**Aduana, después del arreglo:** `tests/unit/a-fondo.test.ts` y `a-fondo-contenido.test.ts`,
**174 pasando**. Antes del arreglo, las dos suites caían en el mismo sitio —el id duplicado
`el-dp-600`— porque el parser lanza en el primer defecto y no llega a ver el resto: por eso el
barrido corrió como script aparte, fuera del test, antes de tocar nada.

### Medición base: el corpus revisado contra el buscador de hoy

Sin recalibrar nada, con los 24 simulados como aprobados (`simularAprobacion`):

| Medida                                    | `main` (originales) | Revisados (F0) | Umbral del gate |
| ----------------------------------------- | ------------------: | -------------: | --------------- |
| Palabras                                  |              14.268 |        100.399 | —               |
| Documentos                                |                  24 |             24 | —               |
| Golden set (cada doc contesta lo suyo)    |                 4/4 |     **5 rojos** | 100 %           |
| Banco de preguntas, fuente en el top-4    |             131/131 |    **27 rojos** | 131/131         |
| Banco, primera fuente acertada            |            ≥ 60 %   | **58 % (76/131)** | ≥ 60 %        |
| Ajenas bloqueadas por el guardrail        |                 9/9 |      **7 de 9** | 9/9             |

Las dos ajenas que el corpus grande deja pasar son «¿va a llover mañana en Madrid?» y «¿cuál es
la receta del ajiaco?». No es que el guardrail se haya aflojado: el umbral `UMBRAL_ON_TOPIC = 1`
está calibrado contra 28 fragmentos, y con ~620 la puntuación léxica de cualquier pregunta sube.
Es el riesgo nº 2 del plan del S8, cobrado. Se recalibra **midiendo**, en F4, no antes.

Los cinco documentos que ya no contestan su propia pregunta de prueba: `analitica-predictiva`
(«¿Qué herramientas de machine learning usa?»), `bi-que-se-adopta`, `como-trabajo`,
`lo-que-busco` («¿Está abierto a reubicarse o a trabajo remoto?») y `vesting` («¿Qué es el
proceso core replicable de agentes?»). Es la misma causa que los 27 del banco: la prosa creció y
las palabras concretas con las que alguien pregunta —herramienta, ciudad, cifra— se diluyeron.

**El índice publicado no se movió:** 28 fragmentos, «0 de 24 documentos aprobados e indexados».
Todo el corpus sigue en borrador y el sitio en `main` responde exactamente igual que antes.

---

## F1 — Arquitectura y los gates nuevos

### Los seis gates que nacieron rojos

`scripts/a-fondo-coherencia.mjs` (motores puros) + `tests/unit/a-fondo-coherencia.test.ts`.
Los seis van en el mismo commit que su rojo (regla 14) y **se quedan rojos durante toda la
reescritura**: son la lista de tareas de F2 y F3, y el número de ofensores es la medida del
avance. Cada aserción imprime la lista entera, no el primer ofensor.

| Gate                      | Qué exige                                                                                      | Rojo de partida | A quién nombró                                                                          |
| ------------------------- | ---------------------------------------------------------------------------------------------- | --------------: | ---------------------------------------------------------------------------------------- |
| Cifras del sitio          | Todo conteo de piezas o credenciales coincide con `content/` y `cv.es.yaml`                    |          **15** | «siete aplicaciones» ×5 · «seis credenciales» ×4 · «cinco credenciales de IBM» ×4 · «treinta y tres piezas» · «siete piezas» |
| Fechas de cargos          | Una fecha nombrada en una frase de permanencia cae dentro de esa permanencia                   |           **7** | Cafam y C&M Consultores intercambiadas en `origenes` y `transmilenio-cm`; CTIC en febrero |
| Densidad                  | Subsección ≤ 400 palabras y con ≥ 1 dato concreto                                              |         **151** | 70 subsecciones largas (hasta 949) y 81 sin una sola cifra, fecha, herramienta ni empresa |
| Léxico obligatorio        | Cada documento dice las palabras con las que se pregunta por su tema                           |          **21** | `plataforma-y-despliegue` sin Docker, Kubernetes, Vertex AI, CI/CD, GitHub Actions, Vercel, Sentry ni Git |
| Sin párrafos repetidos    | Ningún bloque de ≥ 25 palabras vive en dos sitios                                              |          **11** | 59 palabras repetidas dentro de `vesting · el-puente`; el control en rojo en dos documentos |
| Normas con año correcto   | `ISO/IEC 42001` solo `:2023` o sin año; `ISO 9001` solo `:2015`                                |           **8** | cinco archivos con `:2025`                                                                |

**Y los motores saben aprobar, no solo reprobar.** Con el corpus entero en rojo, los seis gates
demuestran que fallan pero no que sepan pasar. Doce pruebas más, sobre documentos de juguete,
le dan a cada motor un caso limpio y uno roto y exigen que los distinga nombrando al ofensor.
Ahí se cazó un falso positivo del gate de fechas antes de que llegara al corpus: con «de» suelto
en la lista de conectores, la frase «lo que aprendí en Cafam lo apliqué en marzo de 2024» se leía
como una afirmación de permanencia, porque «marzo **de** 2024» lleva un «de» dentro. El conector
ahora tiene que venir pegado a un mes o a un año.

**Ninguna cifra de estos gates está escrita a mano.** Las verdades se derivan del repositorio,
como el catálogo de destinos: las piezas se cuentan en `content/` (6 apps · 13 agentes · 7
investigaciones · 6 tableros = 32) y las credenciales en `cv.es.yaml` (5 obtenidas, 4 de IBM, 2
en curso). Si mañana entra una pieza a la vitrina, el gate se mueve solo y nombra a los
documentos que se quedaron con el número viejo. El vocabulario concreto del gate de densidad
sale de `cv.skills`, `cv.trayectoria` y `cv.proyectos` por la misma razón.

**Lo único que sí se escribe a mano son los meses de cada cargo** (`tests/fixtures/cargos-a-fondo.yaml`),
porque el sitio publica el periodo por años («2021 — 2022») y contra años no se puede ver que
Cafam y C&M estén intercambiadas: caen en años vecinos. Para que el fixture no se convierta en
una segunda verdad paralela, un séptimo caso lo cruza contra `cv.trayectoria` y falla si los dos
no pueden ser ciertos a la vez. Hoy está verde.

### El séptimo gate que NO se escribió

El plan pedía un gate de «medición del buscador»: golden al 100 %, banco con la primera fuente
por encima del 60 %, ajenas bloqueadas. Al hacerle la tercera pregunta de la regla 14 —¿puede
fallar?— la respuesta fue que **ya falla, en otro sitio**: `a-fondo-golden.test.ts` y
`banco-de-preguntas.test.ts` afirman exactamente eso y hoy están en rojo por ello. Escribirlo de
nuevo habría sido decorado. Lo que sí era nuevo —dejar el número por escrito en cada corte— es
disciplina de bitácora, no una aserción, y vive en las tablas de esta bitácora.

### Arquitectura: quién es el dueño de cada hecho

La regla que ordena la reescritura es **un hecho, un dueño**. En un buscador léxico la
redundancia no es inofensiva: los duplicados compiten por el top-4 y desplazan al documento que
sí tenía el dato. Los demás lo citan en una línea y remiten.

| Hecho                                                     | Dueño                       | Quién lo cita y remite                        |
| --------------------------------------------------------- | --------------------------- | --------------------------------------------- |
| Los ocho empleos, con sus fechas                          | `origenes`                  | cada documento de proyecto, solo el suyo      |
| Cada proyecto (qué pasó, con qué, con qué resultado)      | su documento de proyecto    | las capacidades, con una línea de evidencia   |
| Las credenciales: código, nombre, estado, fecha           | `certificaciones`           | `como-aprendo` (los plazos), `fabric` (DP-600) |
| Los plazos y el método de aprendizaje                     | `como-aprendo`              | `origenes` (una línea)                        |
| La escalera indicador → agente                            | `como-trabajo`              | nadie más: aparece UNA vez en el corpus       |
| El proceso core de agentes y los 27 de Vesting            | `agentes-en-produccion`     | `vesting` (una línea, remite)                 |
| Los 13 agentes publicados, uno a uno                      | `los-agentes-de-la-vitrina` (nuevo) | `apps-pipeline`, `agentes-en-produccion` |
| Fabric por dentro (lakehouse, Direct Lake, RLS, medallón) | `fabric-en-la-practica`     | `vesting`, `banco-pichincha`                  |
| El gobierno, las tres veces                               | `gobierno-de-datos-y-de-ia` | `fundacion-ctic`, `vesting`, `banco-pichincha` |
| Lo que no se ha hecho (Docker, Kubernetes, Vertex AI)     | `plataforma-y-despliegue`   | `como-aprendo` (una línea)                    |
| El chat por dentro, con sus números                       | `rag-y-el-chat`             | `apps-pipeline`                               |
| La fábrica en números (dos casas, CI, ADRs, cero enlaces) | `apps-pipeline`             | `como-aprendo`                                |

**Documentos que cambian de forma en F2:** `agentes-en-produccion` se parte en dos y nace
`los-agentes-de-la-vitrina.es.md` (ancla `/vitrina/agentes`); `apps-pipeline` gana
`la-fabrica-en-numeros` y, si pasa de 3.600 palabras, suelta `el-metodo.es.md`. No se crea un
documento por app hermana: las seis fichas ya publican eso y la palanca es **indexarlas** (F4).

### Un ancla corregida

`rag-y-el-chat` citaba a `/vitrina/apps`, el escaparate de las apps. El documento explica el
chat de ESTE sitio, y el chat vive en la HOME: ahora cita a `#vitrina`. La aduana de destinos
sigue verde (126 casos).

### Lo que F1 dejó para después, y por qué

Las `preguntas_de_prueba` suben de 2 a 3 por documento **en F2, documento a documento**, no
ahora. El golden set exige que cada pregunta traiga a su documento en el top-4: escribir hoy la
tercera pregunta contra una prosa que F2 va a reescribir entera sería escribirla dos veces. El
mínimo del esquema (`a-fondo.mjs`) sube a 3 en F3, cuando los 25 cumplan.

---

## F2 — Reescritura. Grupo 1: trayectoria

### `inglopres` — el documento patrón

Se reescribe primero el más pequeño del corpus para fijar el patrón antes de aplicarlo a los
otros veintitrés. Es además el que la auditoría llamó «el mejor calibrado»: si las diez reglas
no lo mejoran, no mejoran ninguno.

| Medida                | Antes | Después |
| --------------------- | ----: | ------: |
| Palabras              | 1.291 |   1.182 |
| Subsecciones          |     5 |       7 |
| La más larga          |   424 |     214 |
| Subsecciones sin dato |     1 |       0 |
| Preguntas de prueba   |     2 |       3 |
| Gates en rojo         |     5 |       0 |

**Qué cambió, regla por regla:**

- **Un hecho, un dueño.** Salen de aquí tres cosas que tenían otro dueño: ISO/IEC 42001 y los
  agentes de IA (van a `gobierno-de-datos-y-de-ia`; este es un documento de 2016), el método de
  ISO 9001 como escuela de rigor (va a `procesos-y-simulacion`; aquí queda solo el hecho de
  haberla vivido) y «no ser el punto obligatorio de todas las decisiones» (va a `como-trabajo`).
- **Un fragmento, una idea con un dato.** `cadena-e-iso` mezclaba cuatro planos en 424 palabras.
  Se parte: el estudio del trabajo gana subsección propia y la cadena se queda con lo suyo.
- **Léxico.** Entra **SQL**, que el banco de preguntas esperaba de este documento y que no
  aparecía ni una vez, ni en la versión vieja ni en la revisada.
- **Tecnicismos con soporte.** «Holguras por fatiga» pasa a **«suplementos por fatiga»**: en
  estudio del trabajo el término castellano es ese, «holgura» es el *slack* de programación de
  proyectos. El propio dueño escribe «suplementos» en `las-investigaciones`. Se nombran además
  el método (estudio de tiempos, cronometraje, ritmo, tiempo estándar) y los conceptos de cadena
  que faltaban (tiempo de respuesta, nivel de servicio, disponibilidad del parque).
- **HICE antes que APRENDÍ.** `cadena-e-iso` iba 15/70; el epílogo de carrera que colgaba del
  final de la subsección de liderazgo sale a su propia subsección de cierre, de 76 palabras.
- **Honestidad publicada.** Se restituyen los tres `[CONFIRMAR]` que la revisión había borrado
  sin responder: el tamaño de la operación, la versión de Odoo y las disciplinas del equipo de
  doce. Se añade uno nuevo: si el estudio de tiempos fue formal o una estimación razonada.

**Efecto colateral medido:** al encoger `inglopres`, el golden set pasó de 5 documentos en rojo
a 4. `como-trabajo` volvió a contestar «¿Cómo lidera equipos y habla con los stakeholders?»
porque dejó de competir con la reflexión de liderazgo que vivía aquí. Es la primera evidencia de
que el problema no era el tamaño del corpus sino la competencia entre duplicados.

**Marcador de los gates sobre el corpus entero:** 213 → **209**.

### Barrido de hechos decididos (adelanto de F3)

Mientras el dueño responde las preguntas por documento, se aplicó lo que **no depende de
ninguna respuesta nueva**: las correcciones que ya salen de sus respuestas al bloque A del
2026-09-19. Son cambios de dato, no de prosa, y por eso no esperan al turno de cada documento.

| Corrección                                                            | Dónde                                  | Decisión |
| --------------------------------------------------------------------- | -------------------------------------- | -------- |
| `ISO/IEC 42001` pierde el año en los 24 documentos                     | 5 archivos con `:2025`, 3 con `:2023`  | A4: la edición publicada es :2023 y la adopción colombiana está sin verificar, así que la prosa no compromete ninguna |
| Cafam y C&M Consultores dejan de estar intercambiadas                  | `origenes`, `transmilenio-cm`          | A7 |
| Fundación CTIC empieza en marzo, no en febrero                         | `origenes`                             | A8 |
| «Siete aplicaciones» → seis hermanas más CV Viva, que es el sitio      | `apps-pipeline`, `como-aprendo`, `plataforma-y-despliegue` | A10 |
| «Treinta y tres piezas» → treinta y dos                                | `como-aprendo`                         | A10 |
| «Seis credenciales» → cinco · «cinco de IBM» → cuatro                  | `certificaciones`, `como-aprendo`, `gobierno-de-datos-y-de-ia` | A5 |
| «Estas siete piezas» → «estas siete investigaciones»                   | `las-investigaciones`                  | desambiguación: son piezas, pero decir cuáles evita el conteo ambiguo |

**Y el sitio, en lo que el bloque A resolvió:**

- **El DP-100 sale de `certificaciones` y entra el AI-300.** Microsoft retiró el DP-100 el 1 de
  junio de 2026 y declaró el AI-300 como su reemplazo. El DP-100 pasa a
  `data/credenciales-nombradas.yaml` con su razón, como en su día el AI-102, para que el corpus
  pueda explicar por qué ya no está.
- **El AI-103 recupera su nombre oficial:** «Azure AI Apps and Agents Developer Associate», no
  «Azure AI Engineer Associate». El sitio publicaba el nombre viejo.
- **Y una corrección al propio dueño.** Al responder A1 nombró el AI-300 como «Aplicaciones y
  agentes de Azure AI»: ese es el AI-103. El **AI-300 es Machine Learning Operations Engineer
  Associate** — MLOps y GenAIOps, es decir operar, evaluar y monitorear. Verificado en Microsoft
  Learn. Encaja con su propia respuesta A2 (el AI-300 reemplaza al DP-100) y con lo que el corpus
  ya dice del AI-300 en cinco de sus seis menciones. La nota de la credencial se escribió con el
  alcance correcto.
- Titular, frase del chat, `cv.en.yaml`, guía de prueba y manual quedan alineados.

Con eso, el **gate de credenciales nombradas vuelve a verde** (estaba en rojo: el AI-300 se
nombraba en trece documentos sin existir en el sitio).

**Marcador de los seis gates:** 213 → 209 → **181**.

| Gate                    | Rojos |
| ----------------------- | ----: |
| Cifras del sitio        | **0** |
| Fechas de cargos        | **0** |
| Normas con año correcto | **0** |
| Densidad                |   149 |
| Léxico obligatorio      |    20 |
| Sin párrafos repetidos  |    12 |

El de repetidos subió de 11 a 12, y es un hallazgo, no una regresión: al quitar el año de la
norma, dos párrafos sobre ISO/IEC 42001 —uno en `fundacion-ctic`, otro en
`gobierno-de-datos-y-de-ia`— resultaron ser el mismo texto. El año distinto los disfrazaba.

**Estado de la suite:** 29 de 32 archivos en verde. Los tres rojos son exactamente el trabajo
pendiente: el golden set (5), el banco de preguntas (31) y tres de los seis gates de coherencia.

