# Revisión 2026-09-27 — Las respuestas del dueño a los hallazgos del harness

> Rama `revision/respuestas-del-dueno`, un PR aparte, como pidió el dueño: _«el dueño lo mergea y el
> harness actualiza su banco una sola vez»_. Es la segunda mitad de
> `REV-2026-09-27-hallazgos-hiring-copilot-bitacora.md`: allí quedaron 19 decisiones con propuesta;
> aquí llegan 14 respuestas (relevadas por el harness, en un bloque del mismo día) y lo que cambió
> con cada una. El complemento del mismo día (3, 10, 14, 26b, 26e y la ampliación del 7) llegó
> antes del merge y va en esta misma rama: **no queda ninguna pregunta pendiente.**

## Las respuestas y lo que cambió

Todo en español e inglés; los YAML son datos del sitio y el corpus es prosa del dueño, tocada con
la mano más corta que la respuesta permitía.

- **2 · Dash Agent AI.** _«La construyó con sus propios medios y fuera de la Fundación CTIC»_. La
  frase de `agentes-en-produccion` lo dice ahora explícito: _«que concebí y diseñé completamente en
  2026, con mis propios medios y fuera de la Fundación CTIC, en mi propio pipeline de apps y bien
  después de Vesting»_.
- **5 · Skills sin rastro en el corpus.** Con la convención de calificativos ya existente (raya,
  espacio, minúscula): **prototipo** → Databricks, Snowflake y Microsoft Purview; **en estudio** →
  Airflow y PySpark; **retiradas** → dbt y Apache Iceberg; el resto (Hugging Face, Ollama, Copilot
  Studio, Azure OpenAI, Azure AI Search, Fabric Data Agents, Power Apps, Power Automate, Cursor,
  GitHub Copilot, Gemini CLI) es uso real y queda sin calificativo. La decisión también se cuenta en
  `plataforma-y-despliegue` (#lo-que-no-he-hecho), donde el dueño ya explicaba por qué retira
  herramientas: así el chat sabe contestar «¿ha usado dbt?» con un no, con fecha. El chip de `dbt`
  en la muestra del design system (`design-sync/…/tarjeta-de-skills.html`) pasa a `Airflow`.
- **7 · `lo-que-busco`.** Opción A: _«Busco una posición»_ → _«Estoy abierto a una posición»_;
  _«Busco una organización»_ → _«Me interesa una organización»_; y **sale entero** el párrafo de
  condiciones económicas de #condiciones («No tengo restricciones geográficas predeterminadas… la
  compensación total, el costo de vida…»). La señal de reubicación de `identidad.ubicacion` no se
  toca: es decisión documentada del dueño.
- **7 · Las cifras internas de CTIC, no autorizadas.** _«Pásalas a aproximados en todo el sitio»_.
  El esquema, aplicado a las ~250 menciones del CV, los casos y los 25 documentos, en los dos
  idiomas:

  | Cifra exacta                                                    | Ahora                                                                                                             |
  | --------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------- |
  | 42 productos analíticos                                         | **más de 40** productos                                                                                           |
  | 23 tableros de control (de 42)                                  | **la mitad** de ellos tableros de control · «más de 20» donde va solo                                             |
  | 23 instrumentos · 8 terminados y 15 en construcción             | **más de 20** instrumentos · **un tercio** terminados y el resto en construcción                                  |
  | 12 oportunidades · 7 evaluadas · 3 priorizadas · 2 documentadas | **más de 10** oportunidades · **la mitad** evaluadas · **unas pocas** priorizadas · **las primeras** documentadas |
  | 20 líderes de 15 procesos                                       | **unos** 20 líderes de **unos** 15 procesos                                                                       |
  | 10 planes de análisis                                           | **una decena** de planes                                                                                          |
  | «unos 75 usuarios»                                              | ya era aproximado; sin cambio                                                                                     |

  La banda de cifras del caso CTIC pasa a `+40`, `~20`, `+10` y `+20` (el `prefijo` que ya usan los
  logros), y `casos-de-estudio.test.ts` sigue exigiendo que cada valor aparezca en el documento y en
  los bullets. Tres frases del corpus que argumentaban con las cifras exactas («los 42 productos y
  los 20 líderes no llevan «cerca de» porque están contados») se reescribieron para decir la verdad
  nueva: están contados, pero van redondeados porque son cifras internas de la institución. El
  documento de CTIC lo declara en su primera subsección: las cifras van _«agregadas, redondeadas y
  sin nombrar ningún proceso»_.

- **8 · IBM.** _«Python y SQL son cursos del Certificado Profesional»_. Salen de `certificaciones`
  las dos entradas (con las notas que les escribí el mismo día) y el Certificado Profesional lleva
  ahora _«con sus cursos de Python y SQL para ciencia de datos»_ en su nota; el logro pasa de **5 a
  3** certificaciones profesionales («DP-600 de Microsoft y 2 de IBM: el Certificado Profesional,
  con sus cursos de Python y SQL, y R»). El gate de cifras deriva «credenciales obtenidas» del YAML,
  así que nombró de una vez las quince frases del corpus que decían «cinco» y «cuatro de IBM»
  (`certificaciones`, `como-aprendo`, `gobierno-de-datos-y-de-ia`, `origenes`): todas dicen ahora
  tres y dos, con la tabla de `certificaciones` en una sola fila de IBM 2022.
- **9 · DP-600.** Certificada y vigente, dicho por el dueño; los enlaces de verificación los da
  cuando se los pidan. Sin cambio en el repositorio.
- **19 · «Sellado» = se alcanzó el MVP.** Una sola definición en `apps-pipeline` (#estados-honestos)
  y en `los-agentes-de-la-vitrina` (#sellado-e-inicial): sellado es la pieza que alcanzó su MVP
  —cerró una corrida completa con su entregable real, con gates ejercitados y versión estampada—;
  inicial, la construida y verificada que no ha llegado a su MVP. El estado de las fichas de otras
  casas (el Harness Design Science) se corrige en su origen.
- **26a · Ceinfes.** _«Las ~40 eran a través de coordinadores»_: _«coordinaba cerca de 40 a través
  de coordinadores —unas 7 en programación…»_. Cafam (20) sigue siendo el equipo más grande liderado
  directamente, sin cambio.
- **26c · Cuatro iniciativas transversales.** `como-trabajo` (#personas-que-no-me-reportan) pasa
  de «tres veces» a **cuatro**, con la frase de Pichincha: _«co-lideré la gobernanza de datos con
  áreas que no me reportaban, y las reglas solo valieron cuando cada una las hizo suyas»_.
- **26d · Gobierno «tres veces».** El encabezado de `ceinfes` pasa de «mi primer gobierno de
  datos» a «mi primer contacto con el gobierno de datos», que es lo que el párrafo ya decía.
- **26g · «Ingeniero y diseñador».** Queda «mi formación como ingeniero», y el párrafo sigue
  explicando lo que aportó el Diseño Industrial. (La forma larga «con estudios de diseño
  industrial» dejó la subsección en 403 palabras y el gate de densidad la paró.)
- **26i · «Lidero» frente a «contribuir».** `origenes` usa ahora la frase de `fundacion-ctic`:
  _«lidero la estructuración de la estrategia de inteligencia artificial de la Fundación CTIC y
  contribuyo a incorporar los principios de la norma»_.
- **27 · La ficha nueva de Hiring Copilot.** Copiada tal cual desde el origen
  (`harness-creator/productos/fichas-cv-viva (en desarrollo)/fichas/ah-hiring-copilot…`) a
  `content/agentes/hiring-copilot.ficha-tecnica.json`: v1.5.0, catorce comandos sobre ocho módulos,
  122 criterios binarios (31 cumplidos), 6 gates humanos, 8 de 9 controles con carnada, 2 de 12
  work-items cerrados, 26 decisiones, y ya sin «un rol de nivel medio-alto en Colombia o en Europa»
  ni «doce candidaturas». El corpus la sigue: el párrafo, la tabla y los «14 comandos» de
  `los-agentes-de-la-vitrina`.
- **30 · IELTS.** _«Banda 5,5, año 2014»_: la nota del curso en `cv.{es,en}.yaml` dice «Inglés B2
  (equivalencia de IELTS 5,5, 2014)», y lo mismo `origenes` y `lo-que-busco`. El logo se queda.
- **39 · Cafam.** _«15+ decisores directivos»_ en `como-trabajo` y en `cafam` (#el-bi-de-control),
  en lugar de la lista de cargos.

## El complemento del mismo día

El harness trajo un segundo bloque con las cinco respuestas que faltaban. Tres ya estaban resueltas
en este PR o no cambiaban nada: la **ampliación del 7** (tableros, líderes, procesos y planes ya iban
aproximados), el **3** (el agente ISO 42001 revisa instrumentos anonimizados: el texto de
`fundacion-ctic` se queda como está) y el **14** (ARKHÉ se queda «sin un artefacto publicado»). Las
otras tres son cambios, y van en la misma rama porque el PR seguía sin mergear: un solo merge, y el
harness actualiza su banco una sola vez.

- **10 · El modelo de demanda de TransMilenio.** _«Siguió en uso después de la salida del dueño, sin
  fecha de fin conocida»_: sale «diez meses» de todo el sitio y entra **«siguió en uso después de mi
  salida»** (ES) / **«stayed in use after I left»** (EN). La cifra del caso «10 meses en uso» se
  reemplaza por **«+20 % de rendimiento del sistema con el modelo de demanda»**, que el documento y
  los bullets ya decían; `casos-de-estudio.test.ts` lo exige en las dos lenguas.
- **26b · La excepción de Pichincha.** `como-trabajo` (#equipos-que-he-liderado): _«Después de Cafam
  mi liderazgo cambió de forma —con la excepción del equipo de BI de cinco personas que lideré en
  Banco Pichincha en 2023—: pasé a liderar procesos completos…»_.
- **26e · Los dos −40 %.** Cada uno dice ahora qué análisis alimentaba y nombra VBA y Power Query:
  en C&M Consorcio (2018–2020), la automatización ETL de las bases semanales para **los informes de
  supervisión del desempeño de las rutas**; en C&M Consultores (2021–2022), los scripts ETL para **el
  análisis post-operacional para la planeación**, «transformaciones distintas de las de la
  supervisión de rutas de 2018–2020, porque alimentaban otro análisis».

### Frases tocadas por el complemento (las dos lenguas)

| Dónde                                   | Frase                                                                                                                              |
| --------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------- |
| `cv.{es,en}.yaml`                       | bullet de C&M Consultores (modelo de demanda, y scripts ETL); cifra del caso (10 meses → +20 %); capítulo «Predecir la demanda»; capítulo «Automatizar con controles»; bullet, resumen e impacto de C&M Consorcio (ETL con VBA, Power Query y SQL para los informes de supervisión) |
| `transmilenio-cm`                       | resumen; #el-modelo-de-demanda (dos frases); #la-automatizacion (primera frase); tabla de resultados (dos filas); #lo-que-consolido («el modelo de demanda funcionó con esa lógica») |
| `cm-operaciones`                        | #la-automatizacion: herramientas y destino de la automatización                                                                    |
| `analitica-predictiva`                  | #dos-modelos, #de-modelo-a-capacidad, #probeta-ds: «diez meses» → «siguió en uso después de mi salida»                             |
| `bi-que-se-adopta`                      | #cm-consorcio (Power Query y «de esos informes… con la automatización ETL»); #la-forma-correcta (el modelo)                         |
| `como-trabajo`                          | #equipos-que-he-liderado (la excepción de Pichincha); #seguimiento-visible (el modelo)                                              |
| `origenes`                              | #transmilenio (el modelo y los scripts ETL)                                                                                        |
| `procesos-y-simulacion`                 | #el-metodo-hoy (el modelo)                                                                                                         |

## Lo que los gates atajaron por el camino

Ninguna puerta nueva en este PR; las existentes trabajaron:

- **El banco de preguntas** cayó dos veces, y las dos fueron información. _«¿Qué hizo en Cafam?»_
  dejó de traer `cafam` en el top-4 (la frase nueva de Pichincha movió las ventanas de
  `como-trabajo` y un fragmento suyo con «Cafam» subió un puesto). El arreglo no fue tocar la
  ventana sino el `cuando_usar` de `cafam`, que ahora dice con las palabras del que pregunta: «qué
  hizo Henry en Cafam». Y _«¿Ha usado dbt o Airflow?»_ perdió a `skills` al salir `dbt` de la
  tarjeta: la respuesta honesta —dbt no, Airflow en estudio— vive ahora en `plataforma-y-despliegue`,
  que entra como segunda fuente esperada de esa pregunta y de la de Purview (que, con «prototipo»,
  también la contesta).
- **El gate de densidad** paró la forma larga de 26g (403 palabras en `certificaciones`).
- **El gate de cifras** hizo la lista de las frases con «cinco credenciales» y «cuatro de IBM».
- **`casos-de-estudio.test.ts`** exigió que los valores nuevos de la banda de CTIC (40, 20, 10, 20)
  estén en el documento y en los bullets, en los dos idiomas.

## Verificación

- `pnpm test`: 51 archivos, **1353 pruebas** en verde.
- `pnpm corpus:informe`: regenerado, 158 en verde; el banco sigue en 146 legítimas.
- `pnpm build`: el índice del chat con 25 de 25 documentos.
- e2e `chat`, `home`, `cv` y `vitrina` en el puerto 3100 contra el build nuevo: **135 en verde**, 13
  saltados por diseño (la banda de cifras de CTIC, las certificaciones y las skills se leen ya con
  los valores nuevos).
- Barrido de enlaces tras el último `git add`: los dos comandos de la regla 16, limpios.
