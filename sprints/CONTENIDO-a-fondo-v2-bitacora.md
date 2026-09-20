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

### Decisión del dueño (2026-09-20): sin `[CONFIRMAR]` en el corpus, una sola hoja de respuestas

El dueño rechazó el mecanismo de dejar `[CONFIRMAR]` en cada subsección: él ya resolvió los de
la primera versión y no va a volver a hacerlo por pedazos. Regla nueva, que sustituye al punto 5
del plan:

- **Un dato que falta no se inventa y no se marca en el corpus**: la prosa se escribe sin ese
  dato (sin la cifra, sin la versión), con proporción, y la pregunta vive en UNA sola hoja fuera
  del repo, con opciones para marcar y un valor por defecto que se ejecuta si no la marca.
- **Lo interpretable se estima y se declara** en esa hoja como «lo escribo así», para que él
  corrija solo lo falso.
- **No se le pide nada por pedazos.** Las 113 preguntas de la auditoría (A abiertas, B, C, D)
  están en esa única hoja, con el paso de la clave del chat incluido.

Los cuatro `[CONFIRMAR]` que F2 había puesto en `inglopres` se retiraron; el corpus queda con
cero. La aduana sigue prohibiéndolos en un `aprobado`, que ahora es inalcanzable por
construcción y no por disciplina.

### Grupo 1 cerrado: `inglopres` · `ceinfes` · `cm-operaciones` · `origenes`

| Documento        | Antes | Después | Subsecciones | Rojos propios antes → después |
| ---------------- | ----: | ------: | -----------: | ----------------------------: |
| `inglopres`      | 1.291 |   1.182 |        5 → 7 |                         5 → 0 |
| `ceinfes`        | 2.105 |   1.445 |        6 → 8 |                         5 → 0 |
| `cm-operaciones` | 2.309 |   1.043 |        5 → 6 |                         7 → 0 |
| `origenes`       | 7.523 |   1.336 |        7 → 6 |                        11 → 0 |

**Desviación declarada del plan: el volumen quedó por debajo de los objetivos de §3** (1.500–1.800
· 2.000–2.400 · 1.400–1.700 · 1.800–2.200). Los objetivos se fijaron suponiendo que las
respuestas del dueño traerían cifras nuevas —hojas por jornada, estaciones, rutas, tamaño de
equipos—. El dueño decidió el 2026-09-20 que lo que falta no se marca ni se inventa: se escribe
sin ese dato. Sin cifras que sostenerlo, «proporcional al volumen de información» significa más
corto. Si las respuestas de `RESPUESTAS.md` traen los números, cada documento gana la subsección
que los aloja; no se rellena antes.

**Qué se hizo, además de lo que dicen los gates:**

- `ceinfes` gana una **tabla de los tres frentes** (qué hace · qué pasa si falla), una lista de
  KPIs con nombre, el método nombrado —balanceo de líneas, cuello de botella, teoría de
  restricciones, capacidad teórica frente a efectiva— y una subsección nueva: la programación de
  aplicadores a más de 100 colegios tratada como **problema de asignación con ventanas de
  tiempo**. «Metodologías ágiles» vuelve literal junto a Kanban: el banco espera este documento y
  solo este para esa pregunta, y la revisión había cambiado la frase.
- `cm-operaciones` pierde el epílogo duplicado (949 → 74 palabras) y gana vocabulario de
  transporte con soporte: apelotonamiento de buses (*bus bunching*), regularidad de intervalos
  (*headway*), control de intervalo, indicadores *lagging* y *leading*, auditoría de cumplimiento
  contractual. Se **restituye el puente a las dos investigaciones de la vitrina** que la revisión
  había borrado, y los «18 meses». «Memoria estadística» pasa a «histórico operacional».
- `origenes` vuelve a ser **el arco y no la hoja de vida narrada**: la **tabla de los ocho
  empleos** con periodo mes a mes, el hilo con los métodos de ingeniería industrial nombrados, y
  «cuántos años» con la cuenta real —diez desde agosto de 2016, ocho con los datos en el centro
  desde Ceinfes, **105 meses de trabajo efectivo**— y la comparación datos frente a IA que el
  banco pregunta. Lo que salió (≈6.200 palabras) ya vivía en sus dueños.
- **Un término del léxico estaba mal puesto**: «post-operacional» en `cm-operaciones` es el cargo
  de C&M Consultores (2021–2022), no de este rol. Se cambia por «supervisión» y «cumplimiento»,
  que es lo que este documento es y lo que el banco pregunta.
- **Dos mejoras al motor** salidas de usarlo: el vocabulario derivado parte las organizaciones
  por paréntesis y guion —«C&M Consorcio (TransMilenio)» son dos nombres que el corpus usa por
  separado—, y el gate de fechas lee también los rangos con guion de una tabla («agosto 2016 –
  junio 2017»), con su caso de juguete en rojo y en verde. Sin eso, la tabla de `origenes` habría
  quedado fuera de vigilancia.

**Marcador de los seis gates:** 213 → **163**. Densidad 135 · léxico 17 · repetidos 11; cifras,
fechas y normas en cero. Golden set: 4 documentos en rojo, todos de los grupos siguientes.

### Las respuestas del dueño (2026-09-20, 113 puntos) aplicadas al grupo 1

El dueño marcó la hoja única. Lo que cambió en los cuatro documentos ya escritos, con su fuente:

- `inglopres`: parque de unas 120 unidades entre máquinas y vehículos (C5); el equipo de doce eran
  operarios y técnicos (C6); el 95 % se medía en encuesta a clientes (C7); SQLite era la base del
  análisis y Odoo tenía la suya (C1); estudio de tiempos formal con tabla de suplementos de la
  OIT (C2); BPMN con Bizagi y simulación con FlexSim (C3). **El efecto del ERP lleva una cifra
  estimada** («del orden de un 20 %»): el dueño pidió expresamente asignar cifras razonables
  porque se midió en su momento y no las conserva (C8). Va con «del orden de» y no entra al sitio.
- `ceinfes`: más de 100 colegios **al año** (C9); 7 + 12 + 20 personas directas y ~50 profesores
  (C10); ~250 hojas por jornada, 2 estaciones de escaneo, ~10 % de captura manual (C11);
  indicadores nombrados a propuesta del builder (C12); junta **semanal, los viernes**, con las
  decisiones que salieron de ella (C13); la programación pasó de Google Calendar a una macro en
  VBA que la optimizaba (C14); Scrum por sprints además de Kanban (C15); Bizagi (C3).
- `cm-operaciones`: ~150 rutas de 10 concesionarios, las cinco fuentes nombradas —recaudo, flota
  y GPS, programación, novedades, PQR— (B5, C16); dos informes semanales y un consolidado mensual;
  bases semanales organizadas en SQLite (C1, C18); tiempos de procesamiento −40 % como mínimo (C16).
- `origenes`: Bizagi y FlexSim por empresa (C3); el cargo completo de Pichincha y su equipo de 5
  (C29, C31); los meses de 2022–2023 fueron de estudio: tres de las cuatro IBM son de entonces (A9b).
- **Gate de normas:** el dueño implementa **UNE-ISO/IEC 42001:2025**, la adopción española de la
  :2023 (A4). El gate acepta el prefijo UNE- con ese año y sigue vetando «ISO/IEC 42001:2025» a
  secas; caso de juguete añadido.

### Grupo 2 cerrado: `cafam` · `transmilenio-cm` · `banco-pichincha` · `vesting` · `fundacion-ctic`

| Documento         | Antes | Después | Subsecciones | Rojos propios |
| ----------------- | ----: | ------: | -----------: | ------------: |
| `cafam`           | 2.818 |   1.405 |        7 → 7 |        4 → 0 |
| `transmilenio-cm` | 2.827 |   1.115 |        7 → 7 |        6 → 0 |
| `banco-pichincha` | 4.173 |   1.138 |        9 → 8 |        9 → 0 |
| `vesting`         | 3.861 |   1.282 |        8 → 7 |        7 → 0 |
| `fundacion-ctic`  | 4.624 |   1.271 |       10 → 7 |       11 → 0 |

**Qué entró de las respuestas del dueño:**

- `cafam`: Oracle WMS Cloud, con Oracle recién dueño del producto (B1); medicamentos (B2); 14 de
  Cafam + 6 de Oracle y los roles de los 15 usuarios del BI (B3); las VBA siguieron corriendo (B3);
  la validación por medicamentos con criterio 80-20 (C21); FlexSim sobre el despacho de
  medicamentos y BPMN con Bizagi (C3, C65); SAS como herramienta complementaria (C62); las cuatro
  cifras del case study con su nombre técnico: exactitud de registro de inventario (C20).
- `transmilenio-cm`: fechas correctas y «Fuerza Operativa» (B4); las cinco fuentes nombradas
  (B5); Power BI en la frase del hecho (C23); demanda por franja horaria con actualización
  mensual (C24); validación con RMSE respetando el orden temporal (C25); el modelo corrió diez
  meses y quién lo usaba (C26); +35 % «de eficiencia de los procesos analíticos» (A12).
  **«Dieciocho meses» no se restituye aquí:** este rol fue de once (julio 2021 – mayo 2022); los
  dieciocho son del primero en TransMilenio y ya están en `cm-operaciones`.
- `banco-pichincha`: cargo completo (C31); equipo de 5 (C29); fuga, mora y riesgo contextualizados
  y en producción (B7); scikit-learn (C30); 12 profesionales (C28); +20 % «de productividad en la
  preparación y uso de la información» (A14); Bizagi (C3). El documento pasa de 4.173 a 1.138
  palabras: era el tercero más largo del grupo con el rol más corto, y el 40 % era doctrina que
  ya tenía dueño en `bi-que-se-adopta`, `analitica-predictiva`, `gobierno` y `fabric`.
- `vesting`: **la subsección nueva «El tamaño de lo construido»** con la tabla —12 clientes, 27
  agentes en inventario, 23 vigilados a la vez, 1.000 eventos por día, 20 GB, 120 tablas, tiempo
  real— y lo que se capturaba (A11, A17); Big Data, Data Warehouse y procesamiento distribuido
  restituidos con el sitio; combinación de modos de almacenamiento (C37); workspaces separados
  por cliente (C38); n8n (C39); **el proceso core en once etapas** numeradas —la descomposición en
  once es del builder sobre el propio texto del dueño, que fijó el número (A17)—; la frase del
  ingeniero industrial y la planta, y el DP-600 obtenido en el rol, recuperados del original (C34);
  la salida en enero de 2025 con la línea que eligió (A17b). **Dash Agent AI no vuelve:** el dueño
  aclaró que lo concibió y diseñó por completo en CTIC (C35).
- `fundacion-ctic`: marzo de 2025 (A8); UNE-ISO/IEC 42001:2025 (A4); 23 instrumentos, 8
  terminados y 15 en construcción (A15); 42 productos, 23 tableros, 20 líderes, 15 procesos, ~75
  usuarios, «cerca del 60 %», 10 planes, 12 oportunidades, 7 casos, 3 priorizados, 2 documentados
  (A16, C43); planes de mejora diseñados, no implementados (C41); el agente experto en ISO 42001
  (C42); IPS, habilitación, indicadores de calidad, habeas data / Ley 1581, anonimización y las
  cuatro reglas de calidad (B10); línea directa con la Dirección de Planeación y tres
  subdirecciones (C56). Las dos subsecciones que decían lo mismo se fundieron en una; la
  «convergencia de la trayectoria» salió a `origenes`, que es su dueño; la tabla de avance es el
  único lugar donde viven las cifras.

**Un ajuste al gate de cifras:** «23 tableros de control» en CTIC disparaba el conteo de los
tableros de la vitrina (6). El concepto `tableros` exige ahora contexto de vitrina o de datos
públicos, como ya lo exigía el de agentes; «seis tableros construidos sobre datos públicos»
sigue vigilado.

**Marcador de los seis gates:** 163 → **122**. Densidad 105 · léxico 12 · repetidos 5.
Golden set: 3 documentos en rojo, todos de los grupos siguientes.

### Grupo 2, segunda mitad: `lo-que-busco` · `certificaciones` · `como-aprendo` · `como-trabajo`

| Documento         | Antes | Después | Subsecciones | Rojos propios |
| ----------------- | ----: | ------: | -----------: | ------------: |
| `lo-que-busco`    | 4.342 |   1.063 |        8 → 6 |        6 → 0 |
| `certificaciones` | 3.216 |   1.037 |        7 → 6 |        7 → 0 |
| `como-aprendo`    | 4.680 |   1.113 |       12 → 6 |       12 → 0 |
| `como-trabajo`    | 5.406 |   1.137 |        8 → 6 |       10 → 0 |

- `lo-que-busco`: cuatro tipos de rol en tabla, el cuarto de BI y analítica que el dueño añadió
  (C47); cualquier zona horaria (C45); inglés B2 (C46); los cuatro números de la vitrina y el
  agente ISO 42001 (C48); las tres cifras de ARKHÉ como cálculos propios (C44); Bogotá, remoto y
  reubicación con las palabras con las que se pregunta. La arquitectura agéntica completa sale a
  `agentes-en-produccion`, que es su dueño.
- `certificaciones`: **tabla de credenciales** con código, nombre oficial, estado y fecha; AI-103
  y AI-300 con su nombre correcto, desde julio de 2026 y con sus módulos (A1, A3); el DP-100
  retirado y el AI-102 descontinuado, nombrados con su razón; Synapse, Data Factory y Watsonx
  fuera (C49); la Super guía AI-103 como la pieza de la vitrina que es. `el-ritmo` se va a
  `como-aprendo`.
- `como-aprendo`: **tabla de plazos con fechas** —Fabric y el DP-600 en cinco meses sobre una
  plataforma con menos de un año en el mercado (C50), Codex, Antigravity y Claude Code en un mes
  desde su salida (C51), este sitio en ocho sprints desde julio de 2026, AI-103 y AI-300— y la
  **tabla de las seis apps con sus pruebas, coberturas y ADR medidos** desde `content/vitrina/`.
  Todas en operación sostenida y Hablemos San la más avanzada (C68). Código primero y control en
  rojo remiten a `apps-pipeline` (C52).
- `como-trabajo`: de 5.406 palabras sin una sola cifra a un índice de capacidades con
  evidencia en cada rasgo: **tabla de equipos** (20 en Cafam, 12 en Inglopres, ~40 en Ceinfes, 5 en
  Pichincha) y «después de Cafam pasé a liderar procesos completos» (C55); la junta semanal de
  Ceinfes y las mesas del SITP, los fundadores de Vesting y la línea directa en CTIC (C56); las
  tres adopciones medidas; process mining como método y no como caso (C53); la escalera reporte →
  agente vive aquí y solo aquí. Se borran `como-decido-que-construir`, `la-confianza-se-disena` y
  `como-aprendo-y-evoluciono` (C57), que tenían dueño en otros documentos.
- **Gate de cifras:** los conceptos «de IBM» y «en curso» exigen ahora que el calificador siga al
  sustantivo (`ventana`), porque «cinco credenciales obtenidas —el DP-600 y cuatro de IBM— y dos
  rutas en curso» disparaba dos conceptos vecinos que no eran suyos. Caso de juguete añadido.
- Léxico de `fabric`: salen Synapse (C49) y «medallón» (no hay fuente de que lo use); entran
  OneLake y Power Query.

**Marcador de los seis gates:** 122 → **81**. Densidad 71 · léxico 10 · **repetidos 0**.

