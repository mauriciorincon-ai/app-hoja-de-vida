# Revisión 2026-09-27 — Los 41 hallazgos del harness de hiring

> Rama `revision/hallazgos-hiring-copilot`, un PR. Un agente externo —el harness de hiring que lee
> este sitio en modo solo lectura— entregó 41 hallazgos sobre `main` en 07ee134: contradicciones
> entre los YAML, el corpus «a fondo» y las fichas de `content/`. La orden del dueño: _«los que son
> reales solucionalos inmediato, los que no aclárale al agente qué pasó»_.
>
> Cada hallazgo se verificó primero contra el repositorio (línea por línea, en los dos idiomas)
> antes de tocar nada. Este documento es a la vez la bitácora del PR y la **respuesta al agente**:
> qué se corrigió, qué no era un defecto y por qué, y qué depende de un hecho que solo el dueño
> conoce. El agente lee `main`; cuando este PR se mergee, lee esto.

## Resumen

| Grupo                                                         | Hallazgos                                                                                                                                                            |
| ------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Reales, corregidos en este PR**                             | 1, 4, 6, 11, 12, 13, 14 (definición), 15, 16, 17, 18, 19 (cifra), 21, 22, 23, 24, 25, 26f, 26h, 28, 29, 31, 35, 36, 37, 38, 39 (CTIC), 40, 41                        |
| **Reales, pero el hecho lo tiene el dueño** (propuesta abajo) | 2 (hecho con una redacción neutra, reversible), 3, 5, 7, 8, 9, 10, 14 (artefacto), 19 (definiciones de «sellado»), 26a, 26b, 26c, 26d, 26e, 26g, 26i, 30, 39 (Cafam) |
| **No es un defecto** (aclarado al agente, § 3)                | 32, 33                                                                                                                                                               |
| **Fuera de este repositorio** (fichas de otras casas, § 3)    | 20, 27, 34                                                                                                                                                           |

Además, el agente dejó pasar dos cifras vecinas que la verificación sí vio, y también se corrigen:
el documento del chat decía «136 preguntas de afuera» con **146** en el banco y «75 propias» con
**77** en el golden set; y decía que Groq corre Llama 3.3 70B cuando desde agosto de 2026 corre
gpt-oss-120b (Groq retiró aquel modelo).

## 1. Lo corregido, hallazgo por hallazgo

Todo en español e inglés. Los YAML son datos del sitio; el corpus es prosa del dueño y se tocó
con la mano más corta posible: una palabra, un paréntesis, un reordenamiento. La lista completa de
frases suyas tocadas está en § 4, para que las vete si quiere.

- **1 · «llevo agentes de IA a producción».** El propio corpus reserva «producción» para Vesting y
  describe CTIC como experimentación y prototipos (lo dijo el dueño el 2026-09-26). El resumen del
  hero pasa a **«he llevado agentes de IA a producción»** (`cv.{es,en}.yaml`), y en `origenes`
  la frase queda _«la IA aplicada empieza en agosto de 2023 en Vesting, con agentes en producción,
  y sigue hoy en la Fundación CTIC con experimentación y prototipos»_: los agentes en producción se
  quedan con Vesting, que es donde estuvieron.
- **2 · Dash Agent AI «concebida en la Fundación CTIC».** La frase mezclaba el _cuándo_ (2026,
  durante la etapa en CTIC) con el _dónde_, y «la empresa» era ambigua. Queda: _«que concebí y
  diseñé completamente en 2026, en mi propio pipeline de apps y bien después de Vesting. No es un
  puente desde la plataforma de Vesting»_. Es una redacción neutra que no afirma nada nuevo; **si
  la construiste con tiempo o medios de CTIC, dímelo y se reescribe** (§ 2).
- **4 · La tarjeta del chat en `apps.yaml`.** Tres afirmaciones viejas del S4: «nunca se cae»,
  «nada de lo que produce el modelo se guarda» y la métrica «0 respuestas persistidas». Desde el
  2026-09-21 cada pregunta queda registrada con nombre y correo (lo dice el corpus y lo dice el
  chat antes de responder). La tarjeta ahora dice eso, «fallback local si el proveedor falla», y la
  métrica es **«4 fuentes por respuesta, medidas»** (el top-k, que sí es un número medido).
- **6 · Cafam, «BI de control operativo».** Era el BI de control **de la implementación** (así lo
  llama el caso y el corpus). Bullet e impacto del caso, en los dos idiomas.
- **11 · CTIC, «cerca de 60 % menos esfuerzo».** El corpus lo califica como estimación sobre el
  propio trabajo; el CV lo daba como resultado institucional. Bullet, impacto del caso y la tabla
  de `como-trabajo` llevan ahora **«(estimado sobre mi propio trabajo)»** / «(estimado)».
- **12 · Pichincha, «+35 % en predicciones».** El corpus dice «hasta un 35 %» y pide leer las
  cifras «dentro de las métricas de cada caso»; el CV había perdido las dos salvedades. Bullet e
  impacto: **«hasta +35 % en predicciones, según la métrica de cada modelo»**; en `como-trabajo`,
  «mejoraron hasta un 35 %». El 90 % no se toca: es cifra del caso y la vigila
  `casos-de-estudio.test.ts`.
- **13 · Vesting con la etiqueta «Big Data».** Con 20 GB y 1.000 eventos al día la etiqueta resta
  credibilidad; la fuerza está en el diseño, que el caso ya cuenta. Fuera de los tres sitios del
  CV y de `vesting` (#la-arquitectura): queda «Data Warehouse y procesamiento distribuido sobre un
  lakehouse». La pregunta del banco sobre big data sigue verde (`fabric-en-la-practica` la contesta).
- **14 · ARKHÉ, dos definiciones de la misma medición.** `lo-que-busco` usa ahora las mismas dos
  métricas que `agentes-en-produccion` —_tokens consumidos por tarea completada_ y _proporción de
  instrucciones cumplidas_— y los dos documentos declaran **«sin un artefacto publicado»**.
  Publicar el artefacto es decisión del dueño (§ 2).
- **15 · Nota del AI-103.** Era una frase mía del PR #55 y el corpus no la respaldaba: CTIC no
  practica Azure. Queda **«En preparación: apps y agentes de IA en Azure con Microsoft Foundry, la
  ruta que hoy curso»**, que es lo que dice `plataforma-y-despliegue`.
- **16 · 102/131 frente a 136/136.** Eran dos mediciones distintas del mismo banco: antes y después
  de la corrección de vocabulario de la fase F4 (unas treinta palabras que las preguntas decían y el
  corpus no), con cinco preguntas más en el banco. El documento del chat lo dice ahora al pie de
  la tabla del top-k. Y las cifras en presente pasan a las de hoy: **146 de afuera y 77 propias**
  (con un gate nuevo, § 5).
- **17 · Tres tamaños de índice «de entonces».** Los 28 eran el índice publicado del sprint 8 y
  los 162 el índice simulado de ese mismo sprint (la base en borrador forzada a aprobado). El
  párrafo de las stopwords fecha ahora cada número, y los hitos del fixture de cifras dicen de
  dónde salen 162 y 159.
- **18 · Cómo se evalúa la generación.** El documento decía «verifico que cada afirmación esté
  sustentada» como si fuera una suite, y dos subsecciones después admitía que no existe un
  validador de salida. Queda: _«no existe todavía un validador automático: la verificación es de
  lectura, sobre las respuestas del golden set»_; y la lista de fallas provocadas ya no incluye
  «respuestas que intentan introducir información no recuperada», que hoy la caza la lectura, no
  un gate.
- **19 · Papers: cinco o siete.** `apps-pipeline` implicaba siete manuscritos; son **cinco** (los
  que nombra `las-investigaciones` y la ficha de ARKHÉ). Corregida la frase. Las dos definiciones
  de «sellado» y el estado del Harness Design Science son del dueño (§ 2).
- **21 · «Costo en herramientas: 0 pesos».** Ahora **«0 pesos, salvo la GPU alquilada del Taller de
  Animación»**, en la lista y en el resumen del documento.
- **22 · Los YAML atrás del corpus.** (a) La métrica decía 6 proveedores porque contaba el `mock`
  de pruebas: son **5** (Groq, Gemini, Microsoft Foundry, Claude, OpenAI-compatible), y la
  descripción los nombra completos. (b) El brochure de CV Viva decía que sus features «se votan»
  cuando el roadmap propio se retiró el 2026-09-13: la feature es ahora **«Roadmap votable por app
  hermana»**, que es lo que sigue existiendo. (c) `vitrina.yaml`: agentes en futuro («se mostrará»)
  → presente; investigaciones («la construcción empieza ahora») → «el estado real de cada una vive
  en su ficha»; tableros («los primeros están en selección») → «cada uno se publica ya construido».
  (d) «Azure AI Foundry» → **Microsoft Foundry** en `apps.yaml` y en la Super guía del corpus.
- **23 · El «nunca» del ERP.** _«El ERP nunca describe a las empresas donde viví el problema más
  allá de nombrarlas como origen, ni nombra proveedores en tono acusatorio»_: conserva el «nunca»
  y deja de contradecir el origen en Inglopres.
- **24 · PyTorch y TensorFlow sin calificativo.** **«PyTorch — en exploración»**, **«TensorFlow — en
  exploración»**, con la convención de «Google Cloud — en exploración». Y «Scikit-Learn» pasa a
  «scikit-learn», como en todo el corpus.
- **25 · scikit-learn «en Vesting».** Ningún documento describe un modelo de Vesting; el propio
  corpus dice que los modelos en producción fueron en banca y transporte. Fuera «y en Vesting» de la
  frase y de la tabla de `analitica-predictiva`.
- **26f · «Cuatro sectores» seguidos de siete.** Son **siete**.
- **26h · Los 10 planes con tres rótulos.** Un solo rótulo, el que usan el CV y los demás documentos:
  **«planes de análisis en seguimiento»**.
- **28 · Cargos.** Los del CV son ahora los exactos que el corpus da: **«Analista de Operaciones
  Junior»**, **«Analista de Sistemas de Información y de Proyectos»** y **«Profesional de Análisis
  Post-Operacional»** (en inglés, «Junior Operations Analyst», «Information Systems and Projects
  Analyst», «Post-Operational Analysis Professional»). Si el dueño prefiere los cortos en la HOME,
  es un cambio de una línea, pero la verificación de antecedentes compara con el certificado.
- **29 · La tarjeta del rol actual no decía IA.** Descripción: «Analítica, gobierno de datos y
  estrategia de IA (ISO/IEC 42001)…»; stack del proyecto CTIC: + «Estrategia de IA», «ISO/IEC
  42001», «Power BI»; stack de Vesting: + «n8n», «Power BI» (Spark no: el corpus de Vesting no lo
  nombra).
- **31 · Etiqueta del +70 %.** «más **precisión y** velocidad de análisis con ETL unificado».
- **35 · «150 reglas» que suman 149.** Añadido «149 fichas tituladas más la ficha de discrepancia»,
  que es lo que explica la ficha del Experto Fiscal.
- **36 · «Uso personal» frente a «cada cliente recibe un repositorio».** _«Son herramientas de uso
  personal con entregables y evidencia —incluso las diseñadas para entregar un repositorio por
  cliente no han tenido usuarios distintos de mí—»_.
- **37 · Google Cloud, dicho exacto.** «…ni de Vertex AI; la API de Gemini sí la uso: es uno de los
  proveedores del chat de este sitio».
- **38 · El 45 % sin fuente.** La ficha del agente lo trae como cifra declarada por el proveedor sin
  nombrarlo, así que el corpus no puede citar más que eso: queda **«cifra auto-reportada por el
  proveedor, sin medición independiente»**. Si el dueño quiere nombrar la plataforma, se hace en la
  ficha (otra casa) y el corpus la sigue.
- **39 · «la Directora de Planeación».** En una sola institución, el cargo con género identifica a
  una persona. Queda **«la Dirección de Planeación y las subdirecciones»** en `fundacion-ctic` y
  `como-trabajo`. Los cargos de Cafam se quedan (§ 2).
- **40 · «Unos 105 meses».** Con los meses del fixture de cargos son 104 distintos (noviembre de
  2018 se contaba dos veces) y la cifra crece cada mes: queda **«unos 104 meses de trabajo efectivo
  a septiembre de 2026, ocho años y ocho meses»**, fechada.
- **41 · «ten years of experience».** «a ten-year career», que es lo que dice el español.

## 2. Lo que decide el dueño — con la propuesta lista para aplicar

> **Actualización del mismo día:** el dueño contestó 2, 5, 7, 8, 9, 19, 26a, 26c, 26d, 26g, 26i, 27, 30 y 39;
> lo aplicado está en `REV-2026-09-27-respuestas-del-dueno-bitacora.md` (PR aparte). El complemento
> del mismo día cerró 3, 10, 14, 26b y 26e en la misma rama: no queda ninguna pendiente.

Ninguno de estos se inventa. Cada uno se resuelve con una frase suya; la propuesta va escrita para
que baste un «sí» o una corrección.

| #   | La pregunta                                                                                                                                                                                                                                                     | Propuesta                                                                                                                                                                                                                                |
| --- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| 2   | ¿Dash Agent AI se construyó con tiempo o medios de CTIC?                                                                                                                                                                                                        | Si NO: la redacción nueva ya está bien. Si SÍ: hay que decirlo como corresponde y revisar la palabra «propia».                                                                                                                           |
| 3   | ¿El agente experto en ISO 42001 se usa hoy sobre los 23 instrumentos reales de CTIC?                                                                                                                                                                            | Si SÍ: la ficha está vieja (0 corridas, piloto ficticio) y se corrige en origen; conviene decir qué entra al modelo. Si NO: el CV y tres documentos pasan de «para revisarlos» / «reviso con él» a «construido para apoyar la revisión». |
| 5   | Las 18 skills sin rastro en el corpus (Databricks, Snowflake, dbt, Iceberg, Airflow, PySpark, Hugging Face, Ollama, Copilot Studio, Azure OpenAI, Azure AI Search, Purview, Fabric Data Agents, Power Apps, Power Automate, Cursor, GitHub Copilot, Gemini CLI) | Marcar cada una con su nivel usando la convención existente («— en exploración», «— en preparación»), o retirar las que no se han usado. Necesito el nivel de cada una: uso real · prototipo · estudio.                                  |
| 7   | `lo-que-busco` dice «busco una posición», reubicación «si las condiciones económicas son favorables» y «mis primeros 90 días». Un colega de CTIC puede preguntárselo al chat.                                                                                   | Opción A: bajar el tono a «abierto a», y retirar el párrafo de condiciones económicas. Opción B: dejarlo, a sabiendas. Y aparte: confirmar que CTIC autorizó publicar 12/7/3/2, 23 instrumentos y 42 productos.                          |
| 8   | ¿Python y SQL de IBM son cursos del Certificado Profesional (mayo–noviembre de 2022)?                                                                                                                                                                           | Verificar en Credly/Coursera. Si están anidados, el logro pasa de «5 certificaciones» a «3» y el corpus se ajusta (el gate de cifras se mueve solo al quitar entradas del YAML).                                                         |
| 9   | Enlaces de verificación vacíos y DP-600 «vigente» (los Associate vencen al año; diciembre de 2024 exige renovación en 2025).                                                                                                                                    | Pasarme los enlaces de Credly/Microsoft Learn y la fecha de renovación; el campo `verificacion` ya se renderiza como «Verificar ↗» en la HOME.                                                                                           |
| 10  | «Diez meses en uso» del modelo de demanda en un cargo de once meses, con el ETL como condición previa.                                                                                                                                                          | ¿Siguió en uso tras tu salida? Si sí, una frase lo dice. Si no, la cifra baja (es cifra del caso: cambia en tres sitios y el test lo vigila).                                                                                            |
| 14  | Las cifras de ARKHÉ (−52 %, 71→93 %, 120 escenarios) no tienen artefacto público.                                                                                                                                                                               | Publicar la tabla de escenarios en la ficha de ARKHÉ (en origen), o dejar el «sin un artefacto publicado» que ya quedó.                                                                                                                  |
| 19  | Dos definiciones de «sellado» (apps-pipeline: terminó el gate de pruebas del usuario; vitrina: cerró una corrida real) y el Harness Design Science «inicial» con dos instanciaciones cerradas.                                                                  | Fijar una definición y aplicarla en fichas y corpus; el estado del harness se corrige en origen si corresponde.                                                                                                                          |
| 26a | «Cerca de 40 directas» en Ceinfes frente a «el de 20 es el equipo más grande que he liderado» (Cafam).                                                                                                                                                          | ¿Las 40 eran directas o a través de coordinadores? Según eso, Ceinfes o Cafam se corrige.                                                                                                                                                |
| 26b | «Después de Cafam pasé a liderar procesos» frente a 5 personas a cargo en Pichincha (2023).                                                                                                                                                                     | Añadir «salvo el equipo de BI de cinco en Pichincha».                                                                                                                                                                                    |
| 26c | Iniciativas transversales: cuatro (con Pichincha) o tres.                                                                                                                                                                                                       | ¿Cuenta Pichincha (gobierno co-liderado, con equipo propio)? Y «20 líderes de 15 procesos» es público de la analítica, no alcance de la estrategia de IA: lo corrijo cuando confirmes.                                                   |
| 26d | Gobierno «tres veces» (banca, Vesting, salud) frente a Ceinfes como «mi primer gobierno de datos».                                                                                                                                                              | Dejar «tres veces» y llamar a Ceinfes «primer contacto» (ya lo dice), quitando el «primer gobierno» del encabezado.                                                                                                                      |
| 26e | El mismo −40 % en C&M Consorcio y en C&M Consultores, sobre la misma tarea.                                                                                                                                                                                     | ¿Es la misma automatización heredada? Si sí, una de las dos debe decirlo; si son dos, distinguir la tarea.                                                                                                                               |
| 26g | «Mi formación como ingeniero y diseñador» sin título de diseño.                                                                                                                                                                                                 | «como ingeniero, con estudios de diseño industrial».                                                                                                                                                                                     |
| 26i | «Lidero la estrategia» frente a «contribuir».                                                                                                                                                                                                                   | Usar en `origenes` la frase de `fundacion-ctic`: «liderar la estructuración de la estrategia y contribuir a incorporar los principios de la norma».                                                                                      |
| 30  | IELTS sin banda ni año, con el logo del British Council junto a otra institución.                                                                                                                                                                               | Dar la banda y el año, o escribir «B2 (autoevaluado)»; y decidir si el logo se queda (el British Council administra el IELTS, pero puede leerse como afiliación).                                                                        |
| 39  | Cafam: los lectores del BI de control enumerados por cargo exacto.                                                                                                                                                                                              | Son cargos de una organización grande, hace seis años; no identifican a una persona como el de CTIC. Propongo dejarlos; si prefieres «15+ decisores del proyecto», es un cambio de una frase.                                            |

## 3. Respuesta al agente — lo que no era un defecto o no se corrige aquí

- **32 · Cafam, «organización que acababa de comprar el producto».** La lectura del agente fue
  que Cafam compró el producto. No: el corpus dice tres veces, en tres documentos, que **Oracle
  acababa de adquirir el producto** (un WMS de un tercero) y lo implantaba con sus propios
  especialistas. La frase es consistente con `origenes` y con `gobierno-de-datos-y-de-ia`. Sin
  cambio.
- **33 · «Ingeniero Industrial» de cara a España.** No es un dato falso: es el título colombiano.
  La homologación aplica a ejercer la profesión regulada, no a un rol de datos o IA. Sin cambio;
  si el dueño prepara una versión para España, ahí se valora «Ingeniería Industrial (Colombia)».
- **20 · Las 33,27 h de ARKHÉ y el techo de 7,16 h.** Las dos fichas son de otras casas
  (`content/investigaciones/`) y **este repositorio no las edita, ni para que cuadren** (regla del
  canal de contenido). La ficha del Harness Design Science explica el 7,16: fue una medición que
  el espectro de agencia reutiliza como techo. El rótulo se corrige en origen y se re-entrega.
- **27 · La ficha de Hiring Copilot** (v1.1.1 frente a 1.5.0, «doce comandos» frente a 14,
  hitos en v1.1.0, «1 work-item cerrado» con 16 criterios cumplidos). Misma regla: la ficha es
  copia idéntica de la que produce la Fábrica y la frase del corpus la refleja. **La corrección
  nace en el harness y se re-entrega** (como la orden del 2026-09-12); al entrar la ficha nueva,
  el corpus se actualiza con ella en un PR de contenido. Lo de «busca un rol de nivel medio-alto en
  Colombia o en Europa» y el «escenario de doce candidaturas» también viven en esa ficha.
- **34 · Nutri-Kids** (214 frente a «212 pruebas»; 94 frente a «39 corridas»). Es el
  `brochure-export.json` de la app hermana: se corrige en el repositorio de Nutri-Kids y se
  re-exporta. El corpus repite 214/94 porque cita el brochure; seguirá al brochure.
- **5, 8, 9, 10 y los de la tabla de § 2** no se corrigieron porque dependen de un hecho que el
  agente tampoco tiene; están en manos del dueño con la propuesta escrita.

## 4. Frases del dueño que se tocaron en el corpus

Para que las vete una a una si no está de acuerdo (todas en los dos idiomas):

| Documento                   | Subsección                                                                                                                                  | Cambio                                                                                                                                        |
| --------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------- |
| `origenes`                  | cuantos-anos                                                                                                                                | «105 meses… ocho años y nueve meses» → «104 meses… a septiembre de 2026, ocho años y ocho meses»; los agentes en producción se atan a Vesting |
| `agentes-en-produccion`     | dash-agent-ai · la-medicion                                                                                                                 | «en la Fundación CTIC» → «en mi propio pipeline de apps»; «la empresa» → «Vesting»; + «sin un artefacto publicado»                            |
| `lo-que-busco`              | precision-y-economia-de-tokens                                                                                                              | Las dos métricas con el nombre de `agentes-en-produccion`; + «sin un artefacto publicado»                                                     |
| `apps-pipeline`             | estados-honestos · exploracion-gemini-vertex · las-tres-preguntas                                                                           | «siete… manuscritos» → «cinco tienen su manuscrito»; + «la API de Gemini sí la uso»; 75/136 → 77/146                                          |
| `las-investigaciones`       | los-nunca-eticos                                                                                                                            | El «nunca» del ERP reformulado                                                                                                                |
| `analitica-predictiva`      | las-herramientas · nivel-por-herramienta                                                                                                    | Fuera «y en Vesting»                                                                                                                          |
| `los-agentes-de-la-vitrina` | portada · que-son · aprendizaje-uno-por-uno · conocimiento-uno-por-uno · lo-que-comparten                                                   | GPU del Taller; «uso personal» matizado; Microsoft Foundry; 149 + 1                                                                           |
| `gobierno-de-datos-y-de-ia` | iso-42001                                                                                                                                   | + «cifra auto-reportada por el proveedor, sin medición independiente»                                                                         |
| `fundacion-ctic`            | el-rol-actual · planes-de-mejora · tabla                                                                                                    | «la Directora» → «la Dirección»; un solo rótulo para los 10 planes                                                                            |
| `como-trabajo`              | entender-el-sistema · tabla · junta-directiva-y-mesas-sitp · valor                                                                          | «cuatro» → «siete sectores»; «(estimado)»; «la Directora» → «la Dirección»; «hasta un 35 %»                                                   |
| `vesting`                   | la-arquitectura                                                                                                                             | Fuera «Big Data»                                                                                                                              |
| `rag-y-el-chat`             | portada · embeddings-condicionados · stopwords-medidas · proveedor-intercambiable · evaluacion-del-rag · medicion-del-top-k · que-demuestra | 136 → 146, 75 → 77; stopwords fechadas; Groq con gpt-oss-120b; la generación se verifica leyendo; la aclaración 102/131 vs 136/136            |

## 5. Regla 14 — el gate nuevo: las dos suites del chat

El hallazgo 16 dejó ver una cifra que envejece sola: el documento del chat dice con cuántas
preguntas se evalúa, y el banco crece con cada revisión del corpus (una fila por pregunta que el
corpus no contestaba: #50, #53…) sin que nadie vuelva al documento. Es el mismo defecto que el
gate de cifras ya cura para las piezas y las credenciales, así que se le añaden dos conceptos a
`tests/fixtures/cifras-a-fondo.yaml` con la verdad derivada de los fixtures que corren en la CI:

- **`preguntas-de-afuera`** = la lista `preguntas` de `banco-de-preguntas.es.yaml` (hoy 146). Hito:
  131 (el banco del sprint 8). **136 no es hito a propósito**: como hito, el gate lo habría
  admitido en presente para siempre. La tabla del 20 de septiembre de 2026 que lo usa se salva por
  su contexto («fuentes por respuesta», «con tres fuentes»), y dos subconjuntos del banco («entre
  esos dos números viven 30 preguntas legítimas», «con el umbral en 7, diez preguntas legítimas»)
  por el suyo.
- **`preguntas-propias`** = la suma de `preguntas_de_prueba` de los documentos en español (hoy
  77). Hito: 48 (el golden set del sprint 8).

**¿Lo vi fallar? Sí, dos veces.** Primero en rojo natural, antes de tocar los números: el gate
nombró `rag-y-el-chat` (portada, evaluacion-del-rag, que-demuestra) y `apps-pipeline`
(las-tres-preguntas) con «75 preguntas propias» contra 77; y nombró los dos subconjuntos («30
preguntas legítimas», «diez preguntas legítimas»), que son verdaderos y ganaron su salvedad. Con
136 todavía como hito, los «136» en presente pasaban en verde: por eso 136 dejó de ser hito.
Después, por mutación: con los números ya corregidos, un solo `146 → 136` en
`#evaluacion-del-rag` devolvió _«dice «136 preguntas legitimas» y las preguntas del banco escritas
desde afuera son 146 … Se admite: hoy son 146; 131 como historia»_. Restaurado, verde.
**¿Lo vi correr?** En `pnpm test`, 1353 verdes. **¿Puede fallar?** Sí: la próxima fila del banco
lo pone en rojo hasta que el documento del chat diga el número nuevo.

## Verificación

- `pnpm test`: 51 archivos, **1353 pruebas** en verde (el banco de preguntas, el golden set en los
  dos idiomas, los seis gates de coherencia, casos de estudio, paridad ES/EN).
- `pnpm corpus:informe`: regenerado (`sprints/SPRINT_008-banco-de-preguntas.md`).
- `pnpm typecheck` y `pnpm lint` limpios (el script de coherencia cambió).
- `pnpm build`: el índice del chat se reconstruye con 25 de 25 documentos (1.521 fragmentos en
  español, 1.513 en inglés).
- e2e `chat`, `home` y `cv` en el puerto 3100 contra el build nuevo: en verde (la cita a
  `/proyectos/vesting` y el fallback local siguen respondiendo con el corpus corregido).
- Barrido de enlaces tras el último `git add`: los dos comandos de la regla 16, limpios.
