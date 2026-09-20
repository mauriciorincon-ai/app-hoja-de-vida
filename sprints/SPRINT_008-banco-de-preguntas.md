# Banco de preguntas — el corpus medido con preguntas de afuera

> **Generado por `pnpm corpus:informe` el 2026-09-20. No se edita a mano.**
> Banco: `tests/fixtures/banco-de-preguntas.es.yaml` — **136 preguntas** de 10 familias, 15 preguntas ajenas y 3 huecos declarados.
>
> **HOY** = el índice publicado, tal como está en disco: **494 fragmentos** (los 24 documentos siguen en `borrador`, así que el chat todavía no ve nada de ellos).
> **M2** = el índice que existirá cuando los apruebes: **494 fragmentos**.
> El `top-4` es el que de verdad entra al contexto del modelo.

---

## El número

| | HOY | M2 |
| --- | --- | --- |
| Preguntas con su fuente en el top-4 | 136/136 (100 %) | **136/136 (100 %)** |
| …y además de primeras | 99 (73 %) | **99 (73 %)** |
| Preguntas que reciben «eso se me escapa» | 0 | **0** |


**Cómo leer las dos filas.** La primera es el gate: la fuente que declaré para esa pregunta entra al top-4, que es lo que el modelo ve. La segunda es más dura de lo que parece: cuenta solo cuando esa fuente llega **de primeras**, y no cuenta los casos —muchos— en que la primera es otra fuente igual de buena («¿Qué hizo en Cafam?» arranca por el hito de la trayectoria y no por el documento a fondo). Se deja estricta a propósito: así el número solo sube cuando el contenido mejora de verdad.

**Y la columna HOY no es una nota baja: es el tamaño del cambio.** Está en 100 % porque las fuentes que estas preguntas necesitan son justo los 24 documentos que todavía no están aprobados. Lo que dice esa columna es cuántas de estas preguntas contesta hoy la hoja de vida sola.

### Por familia (M2)

| Familia | Preguntas | Con su fuente en top-4 | De primeras |
| --- | --- | --- | --- |
| trayectoria | 25 | 25 (100 %) | 16 (64 %) |
| forma-de-trabajar | 12 | 12 (100 %) | 9 (75 %) |
| certificaciones | 10 | 10 (100 %) | 5 (50 %) |
| ia-y-agentes | 16 | 16 (100 %) | 13 (81 %) |
| plataforma-y-datos | 17 | 17 (100 %) | 12 (71 %) |
| bi-y-analitica | 13 | 13 (100 %) | 8 (62 %) |
| gobierno | 9 | 9 (100 %) | 9 (100 %) |
| procesos | 6 | 6 (100 %) | 5 (83 %) |
| vitrina | 15 | 15 (100 %) | 12 (80 %) |
| encaje | 13 | 13 (100 %) | 10 (77 %) |

## Las que no traen su fuente

Ninguna: las 136 preguntas del banco traen al menos una de sus fuentes esperadas dentro del top-4.

## Lo que cambia al aprobar

**0 preguntas** que hoy reciben la respuesta fija «eso se me escapa» pasan a tener respuesta con fuente:


## Huecos declarados

Preguntas que un reclutador hace y que **el corpus no contesta hoy**, con el documento donde iría la respuesta. No las inventé: cada una necesita algo que solo tú sabes.

- **¿Cuáles son sus expectativas salariales?** → `lo-que-busco`
  - Es una decisión tuya, no un dato que falte. Hoy la pregunta recibe la respuesta fija. Si decides poner una banda o decir «conversemos», va en la subsección `condiciones`.
- **¿Cuál es su disponibilidad para empezar?** → `lo-que-busco`
  - Depende de tu situación contractual de hoy, que no está escrita en ninguna parte y no tiene por qué estarlo sin que tú lo decidas.
- **¿Tiene disponibilidad para viajar?** → `lo-que-busco`
  - Ni la hoja de vida ni el sitio lo dicen. Una línea en `condiciones` lo cierra, pero la línea es tuya.

---

## El detalle, pregunta por pregunta (M2)

### trayectoria

**☑️ ¿Dónde trabaja Henry actualmente?**

- top-4: contacto, a-fondo-como-trabajo-como-hablo-con-el-negocio~2, perfil, a-fondo-fundacion-ctic-el-rol-actual
- primer fragmento: «Bogotá, Colombia · Abierto a reubicación internacional y trabajo remoto. Email: mauricio.hmrc@gmail.com. LinkedIn: https://www.linkedin.com/in/henry-mauricio-rincon · GitHub: https://github.com/mauriciorincon-ai»

**☑️ ¿Qué hace en la Fundación CTIC?**

- top-4: trayectoria-0, a-fondo-fundacion-ctic-analitica-por-procesos~1, a-fondo-fundacion-ctic-lo-que-reune, a-fondo-fundacion-ctic-sistema-de-gestion-de-ia~1
- primer fragmento: «2025 — hoy: Profesional de Analítica, Fundación CTIC. Analítica y gobierno de datos para decisiones administrativas y asistenciales en salud. Lidero la estrategia de IA y la implementación de ISO/IEC 42001. Modelos de an…»

**✅ ¿Tiene experiencia con datos del sector salud?**

- top-4: a-fondo-fundacion-ctic-el-rol-actual, a-fondo-gobierno-de-datos-y-de-ia-experiencia-y-formacion, a-fondo-origenes-cuantos-anos~1, a-fondo-gobierno-de-datos-y-de-ia-tres-veces~1
- primer fragmento: «Desde **marzo de 2025** trabajo como Profesional de Analítica en la **Fundación CTIC**, una institución del sector **salud**. Es el contexto más exigente en el que he trabajado en calidad, seguridad, privacidad, trazabil…»

**☑️ ¿Qué hizo en Vesting?**

- top-4: a-fondo-agentes-en-produccion-n8n, a-fondo-agentes-en-produccion-el-proceso-core, a-fondo-vesting-el-puente, trayectoria-1
- primer fragmento: «Los flujos de los agentes de Vesting corrían sobre **n8n**: conectar servicios, organizar secuencias, ejecutar reglas e integrar componentes. Pero la arquitectura no era una colección de flujos visuales: el valor estaba…»

**✅ ¿Cuánto tiempo estuvo en Vesting y con qué cargo?**

- top-4: a-fondo-vesting-el-tamano-de-lo-construido, a-fondo-vesting-monitoreo-de-agentes~1, trayectoria-1, a-fondo-vesting-el-puente
- primer fragmento: «Las cifras del ecosistema al cierre de la etapa: | Qué | Cuánto | | ------------------------------------- | ----------------------------------------------- | | Clientes integrados a la plataforma | **12** | | Agentes en…»
- nota: El hito de la trayectoria es tan buena fuente como el documento a fondo: es el que trae el periodo y el cargo exactos.

**☑️ ¿Por qué salió de Vesting?**

- top-4: a-fondo-agentes-en-produccion-monitorear-un-agente, a-fondo-agentes-en-produccion-el-proceso-core, a-fondo-vesting-el-puente, trayectoria-1
- primer fragmento: «Un agente puede estar disponible y responder con fluidez mientras la calidad de sus resultados se deteriora; o responder bien con una latencia, un costo o unos reintentos que lo vuelven inviable. Por eso el monitoreo de…»
- nota: El corpus no dice por qué salió, y está bien que no lo diga. Lo que se exige aquí es que traiga el documento de Vesting: con esas fuentes delante, el modelo contesta lo que sí consta y declara lo que no.

**✅ ¿Ha trabajado en un banco?**

- top-4: a-fondo-banco-pichincha-programa-de-formacion, a-fondo-banco-pichincha-el-problema-real, a-fondo-banco-pichincha-modelos-predictivos, a-fondo-origenes-del-proceso-a-la-ia
- primer fragmento: «Para sostener la adopción diseñé y dicté un **programa de formación a 12 profesionales** del banco. No enseñaba funciones de una herramienta: recorría la solución analítica completa, sobre situaciones reales de los parti…»

**✅ ¿Qué hizo en Banco Pichincha?**

- top-4: a-fondo-banco-pichincha-el-problema-real, a-fondo-banco-pichincha-lo-que-pichincha-consolido, trayectoria-2, a-fondo-banco-pichincha-gobierno-de-datos
- primer fragmento: «Entré a **Banco Pichincha en marzo de 2023** como Analista Senior de Analítica y Reportes y estuve hasta julio del mismo año. Fueron cinco meses, y fue mi paso por el **sector financiero**: en **banca** el dato tiene due…»

**✅ ¿Tiene experiencia en el sector financiero?**

- top-4: a-fondo-banco-pichincha-el-problema-real, a-fondo-fabric-en-la-practica-power-bi~1, a-fondo-fundacion-ctic-el-rol-actual, a-fondo-gobierno-de-datos-y-de-ia-experiencia-y-formacion
- primer fragmento: «Entré a **Banco Pichincha en marzo de 2023** como Analista Senior de Analítica y Reportes y estuve hasta julio del mismo año. Fueron cinco meses, y fue mi paso por el **sector financiero**: en **banca** el dato tiene due…»

**☑️ ¿Qué hizo en Cafam?**

- top-4: a-fondo-origenes-el-hilo~2, trayectoria-4, a-fondo-cafam-lo-que-cafam-consolido, casestudy-cafam
- primer fragmento: «- **Estudio de tiempos y suplementos por fatiga**, en Inglopres: un tiempo observado no es un estándar hasta que reconoce el esfuerzo de quien lo ejecuta. - **Balanceo de líneas y teoría de restricciones**, en Ceinfes: e…»

**✅ ¿Ha participado en la implementación de un sistema de gestión de bodega?**

- top-4: a-fondo-cafam-el-contexto~1, a-fondo-fundacion-ctic-sistema-de-gestion-de-ia~1, a-fondo-fundacion-ctic-sistema-de-gestion-de-ia~2, casestudy-cafam
- primer fragmento: «Entré a **Cafam en octubre de 2020** como Analista de Sistemas de Información y de Proyectos y estuve hasta junio de 2021. Mi responsabilidad fue la implementación de un **WMS** —un sistema de gestión de almacenes, en es…»

**✅ ¿Cuál es el equipo más grande que ha liderado?**

- top-4: a-fondo-cafam-el-equipo-de-veinte~2, a-fondo-cafam-el-equipo-de-veinte~1, casestudy-cafam, a-fondo-como-trabajo-como-lidero~2
- primer fragmento: «El reto de coordinación no era repartir casos de prueba. Era asegurar **cobertura**, evitar duplicidades, mantener consistencia en la ejecución y hacer visible qué partes del sistema estaban validadas, cuáles pendientes…»

**☑️ ¿Tiene experiencia en transporte masivo?**

- top-4: a-fondo-analitica-predictiva-dos-modelos~1, a-fondo-cm-operaciones-la-operacion-de-una-ciudad~1, a-fondo-origenes-cuantos-anos~1, a-fondo-fabric-en-la-practica-power-bi~1
- primer fragmento: «He llevado modelos de **machine learning** a producción en dos contextos que no se parecen: la planeación de la demanda en transporte masivo y la anticipación del comportamiento de clientes en banca. El método viaja; el…»

**✅ ¿Qué trabajo hizo para TransMilenio?**

- top-4: a-fondo-cm-operaciones-la-automatizacion, a-fondo-transmilenio-cm-las-mesas-del-sitp, a-fondo-agentes-en-produccion-n8n, a-fondo-origenes-el-hilo~2
- primer fragmento: «Automaticé las actividades recurrentes de preparación, validación y consolidación de la información de la operación de TransMilenio, con scripts en **Excel y VBA** y bases en **SQLite** consultadas en SQL: cada semana ll…»

**☑️ ¿Qué es el análisis post-operacional que menciona?**

- top-4: trayectoria-3, a-fondo-transmilenio-cm-la-automatizacion, a-fondo-transmilenio-cm-el-problema, a-fondo-transmilenio-cm-la-adopcion
- primer fragmento: «2021 — 2022: Análisis Post-Operacional, C&M Consultores (TransMilenio). Adopción de BI (+35% de eficiencia), ETL que unificó fuentes (+70%) y predicción de demanda con scikit-learn. Impulsé la adopción de BI en la operac…»

**☑️ ¿Qué hizo en Ceinfes?**

- top-4: a-fondo-origenes-el-hilo~2, a-fondo-ceinfes-lo-que-dejo, trayectoria-6, a-fondo-ceinfes-el-encargo~1
- primer fragmento: «- **Estudio de tiempos y suplementos por fatiga**, en Inglopres: un tiempo observado no es un estándar hasta que reconoce el esfuerzo de quien lo ejecuta. - **Balanceo de líneas y teoría de restricciones**, en Ceinfes: e…»

**✅ ¿Ha presentado resultados ante una junta directiva?**

- top-4: a-fondo-ceinfes-la-junta-directiva, a-fondo-ceinfes-lo-que-dejo, trayectoria-6, a-fondo-como-trabajo-como-hablo-con-el-negocio~1
- primer fragmento: «En Ceinfes presenté **informes estratégicos a la junta directiva** por primera vez en mi trayectoria. Los informes eran **semanales, cada viernes**, y salían de los mismos KPIs de la operación. De ellos salieron decision…»

**✅ ¿Cuál fue su primer empleo al salir de la universidad?**

- top-4: a-fondo-origenes-el-primer-trabajo~1, a-fondo-inglopres-la-operacion, a-fondo-origenes-el-primer-trabajo~2, a-fondo-cm-operaciones-la-operacion-de-una-ciudad~1
- primer fragmento: «Mi primer empleo, en **Inglopres desde agosto de 2016**, fue como Ingeniero de Procesos: una operación de alquiler y venta de maquinaria pesada, un **ERP** (Odoo) que había que implementar para integrar áreas que trabaja…»

**✅ ¿Ha liderado la implementación de un ERP?**

- top-4: a-fondo-inglopres-el-erp~1, casestudy-cafam, a-fondo-cafam-el-equipo-de-veinte~2, a-fondo-cafam-el-equipo-de-veinte~1
- primer fragmento: «Lideré la implementación de un **ERP —Odoo—**, el sistema de planificación de recursos empresariales con el que Inglopres pasó de registros dispersos a un solo lugar. El objetivo declarado era aumentar la eficiencia oper…»

**✅ ¿Tiene experiencia en cadena de suministro y logística?**

- top-4: a-fondo-inglopres-cadena-e-iso, trayectoria-7, a-fondo-procesos-y-simulacion-iso-9001, a-fondo-fabric-en-la-practica-power-bi~1
- primer fragmento: «Lideré iniciativas de optimización de la **cadena de suministro** para reducir costos operativos y coordinar mejor los recursos. En una operación de maquinaria pesada eso se juega en tres variables: el **tiempo de respue…»

**✅ ¿En qué industrias o sectores ha trabajado?**

- top-4: a-fondo-origenes-cuantos-anos~1, a-fondo-origenes-del-proceso-a-la-ia, a-fondo-lo-que-busco-que-ofrezco~2, a-fondo-fundacion-ctic-el-rol-actual
- primer fragmento: «Mi formación formal es el pregrado en Ingeniería Industrial de la Javeriana, con énfasis en Inteligencia Analítica de Datos, y el programa de Diseño Industrial; no tengo maestría, especialización ni otro posgrado: la pro…»

**✅ ¿Cuántos años de experiencia profesional tiene?**

- top-4: a-fondo-origenes-cuantos-anos~2, a-fondo-origenes-cuantos-anos~1, a-fondo-fabric-en-la-practica-power-bi~1, a-fondo-gobierno-de-datos-y-de-ia-experiencia-y-formacion
- primer fragmento: «Si la pregunta es qué tan grande es mi experiencia con IA comparada con la de datos: los datos ocupan ocho de esos años; la IA aplicada, con agentes en producción, empieza en agosto de 2023 en Vesting y sigue hoy en CTIC…»

**☑️ ¿Ha trabajado en una startup?**

- top-4: trayectoria-1, a-fondo-vesting-una-startup-sin-plataforma~2, a-fondo-como-trabajo-que-valoro~1, a-fondo-vesting-una-startup-sin-plataforma~1
- primer fragmento: «2024: Líder de Estrategia de Datos, Vesting — startup de agentes de automatización. Ecosistema de datos para agentes de IA en Microsoft Fabric, desde cero: arquitectura, gobernanza, monitoreo de agentes en tiempo real y…»

**✅ ¿Ha trabajado para entidades públicas o con operación de ciudad?**

- top-4: a-fondo-cm-operaciones-la-operacion-de-una-ciudad~1, a-fondo-cm-operaciones-la-operacion-de-una-ciudad~2, casestudy-transmilenio-cm, a-fondo-lo-que-busco-condiciones
- primer fragmento: «Entré a **C&M Consorcio 2018 en noviembre de 2018** como Analista de Operaciones Junior, dentro de la supervisión de **TransMilenio**, y estuve hasta mayo de 2020: **18 meses**. Fue mi entrada al transporte masivo y la p…»

**✅ ¿Qué pasó entre mayo de 2022 y marzo de 2023?**

- top-4: a-fondo-origenes-los-tres-saltos~2, a-fondo-origenes-cuantos-anos~1, a-fondo-transmilenio-cm-el-problema, a-fondo-banco-pichincha-el-problema-real
- primer fragmento: «| Periodo | Rol y organización | Qué cambió de escala | | --------------------------- | ------------------------------------------------------------- | --------------------------------------------------------------------…»

### forma-de-trabajar

**✅ ¿Cómo trabaja Henry cuando llega a un problema nuevo?**

- top-4: a-fondo-como-trabajo-primero-el-proceso~1, a-fondo-como-trabajo-primero-el-proceso~2, a-fondo-lo-que-busco-el-problema-que-quiero, a-fondo-banco-pichincha-el-problema-real
- primer fragmento: «Soy ingeniero industrial antes que ingeniero de datos, y esa forma de mirar sigue siendo mi mayor ventaja: los problemas que parecen de tecnología casi siempre son de proceso. Un tablero no arregla la falta de claridad o…»

**☑️ ¿Cómo lidera un equipo?**

- top-4: a-fondo-cafam-el-equipo-de-veinte~1, a-fondo-como-trabajo-como-lidero~2, a-fondo-cafam-el-equipo-de-veinte~2, a-fondo-como-trabajo-como-lidero~1
- primer fragmento: «Lideré un equipo mixto de **20 personas** durante la fase de pruebas: **14 de Cafam y 6 de Oracle**, que acababa de adquirir el producto y lo estaba implantando con sus propios especialistas. La combinación reunía los do…»

**✅ ¿Cómo se comunica con las áreas de negocio?**

- top-4: a-fondo-como-trabajo-como-hablo-con-el-negocio~2, a-fondo-como-trabajo-como-hablo-con-el-negocio~1, casestudy-banco-pichincha, a-fondo-banco-pichincha-programa-de-formacion
- primer fragmento: «Toda cifra tiene identidad y procedencia. Si no puedo explicar de dónde sale, cómo se transformó y cuándo se actualizó, no la presento. En Vesting trabajé directamente con los fundadores; en CTIC tengo línea directa con…»

**✅ ¿Qué valora en un proyecto?**

- top-4: a-fondo-como-trabajo-que-valoro~2, a-fondo-como-trabajo-que-valoro~1, a-fondo-procesos-y-simulacion-estudio-del-trabajo, a-fondo-bi-que-se-adopta-formacion-y-adopcion
- primer fragmento: «También valoro que un proyecto deje activos reutilizables —patrones, componentes, pruebas, documentación— y que aprenda después de implementarse: las necesidades cambian, los modelos se degradan, los usuarios descubren u…»

**☑️ ¿Es un perfil más de procesos o más de tecnología?**

- top-4: perfil, a-fondo-procesos-y-simulacion-la-raiz, a-fondo-ceinfes-gestion-por-procesos~1, a-fondo-inglopres-lo-que-dejo
- primer fragmento: «Henry Rincón — Ingeniero Industrial · Analytics & AI Engineer. De la ingeniería industrial a los agentes de IA: datos, plataformas y decisiones. Líder de datos e ingeniero de IA (AI-103 y AI-300, en curso) · Analytics En…»

**✅ ¿Por qué estudió ingeniería industrial?**

- top-4: a-fondo-origenes-por-que-industrial~1, a-fondo-origenes-por-que-industrial~2, a-fondo-origenes-el-hilo~2, a-fondo-origenes-el-primer-trabajo~2
- primer fragmento: «Elegí **Ingeniería Industrial** porque quería entender cómo funcionan las organizaciones como sistemas completos y, sobre todo, cómo podían funcionar mejor. Me interesaba una disciplina que conectara procesos, personas,…»

**✅ ¿Qué estudió y en qué universidad?**

- top-4: a-fondo-origenes-por-que-industrial~1, estudios, a-fondo-procesos-y-simulacion-estudio-del-trabajo, a-fondo-inglopres-el-estudio-del-trabajo
- primer fragmento: «Elegí **Ingeniería Industrial** porque quería entender cómo funcionan las organizaciones como sistemas completos y, sobre todo, cómo podían funcionar mejor. Me interesaba una disciplina que conectara procesos, personas,…»

**✅ ¿Tiene formación en diseño?**

- top-4: a-fondo-origenes-por-que-industrial~1, a-fondo-origenes-por-que-industrial~2, a-fondo-gobierno-de-datos-y-de-ia-experiencia-y-formacion, a-fondo-bi-que-se-adopta-formacion-y-adopcion
- primer fragmento: «Elegí **Ingeniería Industrial** porque quería entender cómo funcionan las organizaciones como sistemas completos y, sobre todo, cómo podían funcionar mejor. Me interesaba una disciplina que conectara procesos, personas,…»

**✅ ¿Cómo pasó de la ingeniería de procesos a los datos?**

- top-4: a-fondo-origenes-del-proceso-a-la-ia, a-fondo-origenes-por-que-industrial~1, a-fondo-origenes-el-hilo~3, a-fondo-origenes-el-primer-trabajo~1
- primer fragmento: «**Del proceso al indicador** (Ceinfes y C&M Consorcio). Dejé de mejorar una actividad y pasé a dirigir y supervisar operaciones enteras a través de sus datos: KPIs por área, tableros de desempeño, un histórico para que c…»

**✅ ¿Qué lo diferencia de otros candidatos de datos?**

- top-4: a-fondo-lo-que-busco-que-ofrezco~1, a-fondo-lo-que-busco-que-ofrezco~2, a-fondo-los-tableros-que-demuestran, a-fondo-transmilenio-cm-el-problema
- primer fragmento: «Si la pregunta es por qué contratarme a mí y no a otro perfil de datos, la respuesta es la combinación: conecto dimensiones que suelen estar separadas: procesos, datos, experiencia de usuario, plataformas analíticas, apl…»

**☑️ ¿Cómo documenta lo que hace?**

- top-4: a-fondo-agentes-en-produccion-el-proceso-core, a-fondo-gobierno-de-datos-y-de-ia-gobierno-de-mi-proceso, a-fondo-como-aprendo-criterios-de-aprendizaje, a-fondo-lo-que-busco-condiciones
- primer fragmento: «En Vesting definí, documenté y validé el proceso central para diseñar e implementar agentes: once etapas, del caso de uso a la operación observable, que están numeradas en el documento de Vesting. Sirvió como marco para…»

**✅ ¿Cómo maneja el trabajo con personas que no le reportan?**

- top-4: a-fondo-como-trabajo-como-lidero~2, a-fondo-como-trabajo-como-lidero~1, a-fondo-fundacion-ctic-el-rol-actual, a-fondo-inglopres-el-estudio-del-trabajo
- primer fragmento: «En Cafam no bajamos los errores con más supervisión sino escribiendo antes de empezar qué contaba como caso probado y quién lo firmaba. Después de Cafam pasé a liderar procesos completos que integran a muchas personas qu…»

### certificaciones

**☑️ ¿Qué certificaciones tiene?**

- top-4: a-fondo-como-aprendo-evidencia-certificaciones~2, a-fondo-como-aprendo-evidencia-certificaciones~1, certificaciones, a-fondo-certificaciones-como-se-conectan
- primer fragmento: «Las cuatro de IBM siguen el mismo patrón: tres en 2022 —el Certificado Profesional en Ciencia de Datos, Python y SQL, entre mayo y noviembre— en los meses que dediqué a estudiar entre dos empleos, y R en 2024, en paralel…»

**✅ ¿Tiene la certificación DP-600 de Microsoft Fabric?**

- top-4: a-fondo-fabric-en-la-practica-que-significa-el-dp-600, a-fondo-certificaciones-el-dp-600~1, a-fondo-certificaciones-la-tabla~1, a-fondo-certificaciones-el-ai-300
- primer fragmento: «El **DP-600** —Fabric Analytics Engineer Associate, obtenido en diciembre de 2024— valida el recorrido completo de una solución analítica sobre **Microsoft Fabric**: seleccionar el almacén, preparar y transformar, diseña…»

**☑️ ¿Está certificado en inteligencia artificial de Azure?**

- top-4: a-fondo-gobierno-de-datos-y-de-ia-estrategia-iso-42001~2, a-fondo-apps-pipeline-codigo-primero, a-fondo-certificaciones-el-ai-103, a-fondo-plataforma-y-despliegue-desplegar-y-operar-ia
- primer fragmento: «El sistema de gestión comprende hoy **23 instrumentos** —políticas, procedimientos, matrices, criterios de evaluación y mecanismos de seguimiento—, **8 terminados y 15 en construcción**. La norma se adopta como referente…»

**✅ ¿Tiene certificaciones de ciencia de datos de IBM?**

- top-4: a-fondo-certificaciones-las-de-ibm, certificaciones, a-fondo-como-aprendo-evidencia-certificaciones~2, a-fondo-certificaciones-la-tabla~1
- primer fragmento: «Mi base en ciencia de datos son **cuatro credenciales de IBM**, en dos etapas y alrededor de los tres lenguajes del análisis: **Python**, **SQL** y **R**. En **2022** completé el Certificado Profesional en Ciencia de Dat…»

**☑️ ¿Cuánto tardó en obtener la certificación de Fabric?**

- top-4: a-fondo-fabric-en-la-practica-que-significa-el-dp-600, a-fondo-vesting-el-puente, a-fondo-como-aprendo-los-plazos, a-fondo-certificaciones-el-dp-600~1
- primer fragmento: «El **DP-600** —Fabric Analytics Engineer Associate, obtenido en diciembre de 2024— valida el recorrido completo de una solución analítica sobre **Microsoft Fabric**: seleccionar el almacén, preparar y transformar, diseña…»

**✅ ¿Cómo aprende una tecnología que no conoce?**

- top-4: a-fondo-como-aprendo-criterios-de-aprendizaje, a-fondo-como-aprendo-evidencia-construido~3, a-fondo-plataforma-y-despliegue-como-la-cubro~1, a-fondo-ceinfes-gestion-por-procesos~2
- primer fragmento: «Seis criterios, y una capacidad no está aprendida hasta cumplir los seis: 1. **Funcional:** la pieza resuelve el problema y supera escenarios representativos, no solo el recorrido ideal. 2. **Arquitectónico:** puedo just…»

**☑️ ¿Qué hace cuando el puesto pide algo que no ha usado nunca?**

- top-4: pieza-apps-nutri-kids-limites~1, pieza-apps-habla-limites~1, a-fondo-como-aprendo-criterios-de-aprendizaje, a-fondo-procesos-y-simulacion-bizagi-en-la-practica
- primer fragmento: «Límite: No califica al niño: sin calorías, peso, IMC, percentiles ni «cumplimiento». Límite: Hace red para una sola cosa: las preguntas abiertas del chat — y ahí viaja únicamente el plan. Límite: Sin servidor de datos, c…»

**✅ ¿Tiene posgrado, maestría o especialización?**

- top-4: a-fondo-origenes-cuantos-anos~1, agentes-asistente-posgrado~1, a-fondo-gobierno-de-datos-y-de-ia-experiencia-y-formacion, agentes-asistente-posgrado-bloques
- primer fragmento: «Mi formación formal es el pregrado en Ingeniería Industrial de la Javeriana, con énfasis en Inteligencia Analítica de Datos, y el programa de Diseño Industrial; no tengo maestría, especialización ni otro posgrado: la pro…»
- nota: La respuesta honesta son los dos pregrados de la Javeriana. Antes de la corrección de la fase 4 esta pregunta traía un párrafo que decía «esa posición exige posgrado», que era el texto de la oferta y no el suyo.

**✅ ¿Se está certificando en algo en este momento?**

- top-4: a-fondo-certificaciones-la-tabla~2, a-fondo-banco-pichincha-modelos-predictivos, a-fondo-vesting-monitoreo-de-agentes~1, a-fondo-inglopres-el-equipo-de-doce
- primer fragmento: «**Cinco credenciales obtenidas** —el DP-600 y cuatro de IBM— y **dos rutas en curso**: en este momento me estoy certificando en el AI-103 y en el AI-300. Dos códigos que aparecen en mi historia y no en la tabla: el **AI-…»

**☑️ ¿Qué certificación piensa sacar después?**

- top-4: a-fondo-analitica-predictiva-monitoreo-del-modelo, a-fondo-certificaciones-las-de-ibm, a-fondo-como-trabajo-primero-el-proceso~2, a-fondo-como-trabajo-primero-el-proceso~1
- primer fragmento: «Un modelo se degrada sin avisar. La **deriva** —de los datos de entrada, de la relación que el modelo aprendió, de la población— es el riesgo que la **validación** inicial no cubre, y se vigila en producción: distribució…»

### ia-y-agentes

**✅ ¿Tiene experiencia con inteligencia artificial generativa?**

- top-4: a-fondo-rag-y-el-chat-que-demuestra, a-fondo-vesting-monitoreo-de-agentes~2, a-fondo-apps-pipeline-codigo-primero, a-fondo-certificaciones-el-ai-103
- primer fragmento: «Que puedo diseñar una solución de IA generativa como un sistema y no como una llamada a un modelo: contenido versionado, índice construido y validado, recuperación proporcional al problema, alcance delimitado antes de ga…»

**☑️ ¿Ha construido agentes de inteligencia artificial?**

- top-4: a-fondo-vesting-monitoreo-de-agentes~2, a-fondo-certificaciones-el-ai-103, a-fondo-vesting-monitoreo-de-agentes~1, a-fondo-agentes-en-produccion-dos-experiencias
- primer fragmento: «Las métricas técnicas prueban que el agente respondió; no que la respuesta sirvió. Por eso los tableros operativos, para producto y operaciones, permitían recorrer una anomalía hasta los eventos de la sesión. Un agente d…»

**✅ ¿Qué es el proceso core replicable de agentes?**

- top-4: a-fondo-vesting-el-proceso-core~1, trayectoria-1, casestudy-vesting, proyecto-vesting
- primer fragmento: «Además del ecosistema, estructuré, documenté y validé el **proceso core** con el que se diseñaron e implementaron los **27 agentes** del inventario. El activo no era un agente: era la capacidad de construir el siguiente…»

**✅ ¿Cómo monitorea un agente de IA en producción?**

- top-4: a-fondo-vesting-monitoreo-de-agentes~1, a-fondo-vesting-monitoreo-de-agentes~2, a-fondo-agentes-en-produccion-dos-experiencias, a-fondo-agentes-en-produccion-monitorear-un-agente
- primer fragmento: «Construí el **monitoreo en tiempo real** de los agentes en producción: **23 a la vez** en el punto más alto. La observabilidad tenía que responder algo más profundo que «¿está disponible?»: qué solicitud recibió cada age…»

**✅ ¿Qué frameworks de agentes ha usado?**

- top-4: a-fondo-agentes-en-produccion-el-proceso-core, a-fondo-ceinfes-balanceo-de-digitalizacion~2, a-fondo-certificaciones-el-ai-103, a-fondo-agentes-en-produccion-monitorear-un-agente
- primer fragmento: «En Vesting definí, documenté y validé el proceso central para diseñar e implementar agentes: once etapas, del caso de uso a la operación observable, que están numeradas en el documento de Vesting. Sirvió como marco para…»
- nota: Pasa, pero floja: el documento llega al top-4 sin nombrar un solo framework, porque el corpus no dice con qué están construidos los trece agentes. Es uno de los cinco huecos que la simulación M2 puso en primer lugar, y la respuesta solo la tiene el dueño.

**☑️ ¿Ha trabajado con modelos de lenguaje grandes?**

- top-4: a-fondo-analitica-predictiva-las-herramientas~1, a-fondo-agentes-en-produccion-arkhe~1, a-fondo-banco-pichincha-modelos-predictivos, a-fondo-los-tableros-el-stack
- primer fragmento: «Los lenguajes de programación con los que trabajo son Python, R, SQL y DAX; el nivel más avanzado es Python. No presento las herramientas como equivalentes. Esta es la lista honesta: | Herramienta | Nivel | Dónde | | ---…»

**✅ ¿Qué arquitecturas RAG ha implementado?**

- top-4: a-fondo-rag-y-el-chat-lo-que-estas-usando, a-fondo-rag-y-el-chat-recuperacion-lexica, a-fondo-rag-y-el-chat-proveedor-y-costo, a-fondo-rag-y-el-chat-que-demuestra
- primer fragmento: «Si esta respuesta la generó el chat de esta página, estás usando una implementación real de la arquitectura que describo: un sistema de generación aumentada por recuperación —**RAG**— que construí para responder sobre mi…»

**☑️ ¿Cómo funciona el chat de esta página?**

- top-4: a-fondo-apps-pipeline-esta-misma-pagina, a-fondo-rag-y-el-chat-lo-que-estas-usando, a-fondo-rag-y-el-chat-los-guardrails~1, app-chat-hoja-de-vida
- primer fragmento: «**CV Viva** forma parte del portafolio: una aplicación en **Next.js** con generación estática, bilingüe, construida en 8 sprints, con **pruebas automatizadas** en tres niveles, accesibilidad verificada, presupuesto de re…»

**✅ ¿Usa embeddings o búsqueda vectorial?**

- top-4: a-fondo-rag-y-el-chat-recuperacion-lexica, a-fondo-rag-y-el-chat-degradacion-controlada, casestudy-banco-pichincha, a-fondo-banco-pichincha-la-adopcion-medida
- primer fragmento: «La recuperación es **léxica**, con **MiniSearch** —el algoritmo **BM25**— y sin **embeddings** ni base de datos vectorial. Es una decisión registrada, no una etapa incompleta: el contenido está lleno de nombres, fechas,…»

**✅ ¿Con qué proveedor de modelos trabaja?**

- top-4: a-fondo-rag-y-el-chat-proveedor-y-costo, a-fondo-banco-pichincha-modelos-predictivos, a-fondo-como-trabajo-como-lidero~1, a-fondo-agentes-en-produccion-fuentes-o-vacio
- primer fragmento: «El proveedor generativo se elige por configuración, sin tocar código, entre cinco adaptados: **Groq** —el inicial, con Llama 3.3 70B—, **Gemini** 2.5 Flash, **Azure** con Microsoft Foundry, **Claude** y cualquier servici…»

**✅ ¿Cómo evita que el modelo invente respuestas?**

- top-4: a-fondo-rag-y-el-chat-los-guardrails~2, a-fondo-agentes-en-produccion-fuentes-o-vacio, a-fondo-rag-y-el-chat-los-guardrails~1, a-fondo-analitica-predictiva-ingenieria-de-variables
- primer fragmento: «Sobre las citas, la verdad exacta: los chips que acompañan una respuesta son las cuatro fuentes que la recuperación entregó al modelo, y cada uno navega a su sección del sitio. No existe hoy un validador que compruebe qu…»

**✅ ¿Ha llevado un modelo de machine learning a producción?**

- top-4: a-fondo-analitica-predictiva-dos-modelos~1, a-fondo-banco-pichincha-modelos-predictivos, a-fondo-analitica-predictiva-en-produccion, a-fondo-certificaciones-el-ai-300
- primer fragmento: «He llevado modelos de **machine learning** a producción en dos contextos que no se parecen: la planeación de la demanda en transporte masivo y la anticipación del comportamiento de clientes en banca. El método viaja; el…»

**✅ ¿Qué postura tiene sobre el uso responsable de la inteligencia artificial?**

- top-4: a-fondo-gobierno-de-datos-y-de-ia-estrategia-iso-42001~1, a-fondo-gobierno-de-datos-y-de-ia-estrategia-iso-42001~2, a-fondo-fundacion-ctic-estrategia-institucional-de-ia, a-fondo-fundacion-ctic-lo-que-reune
- primer fragmento: «Lidero la estrategia institucional de IA de la Fundación CTIC sobre **UNE-ISO/IEC 42001:2025**, la adopción española de **ISO/IEC 42001**: la IA no como una colección de iniciativas sino como una capacidad que necesita d…»

**✅ ¿Ha trabajado con procesamiento de lenguaje natural?**

- top-4: a-fondo-analitica-predictiva-las-herramientas~1, a-fondo-los-tableros-el-stack, a-fondo-cm-operaciones-la-automatizacion, a-fondo-fabric-en-la-practica-lago-y-almacen~1
- primer fragmento: «Los lenguajes de programación con los que trabajo son Python, R, SQL y DAX; el nivel más avanzado es Python. No presento las herramientas como equivalentes. Esta es la lista honesta: | Herramienta | Nivel | Dónde | | ---…»

**✅ ¿Qué tan grande es su experiencia con IA comparada con la de datos?**

- top-4: a-fondo-origenes-cuantos-anos~2, a-fondo-gobierno-de-datos-y-de-ia-experiencia-y-formacion, a-fondo-vesting-la-gobernanza, a-fondo-vesting-el-puente
- primer fragmento: «Si la pregunta es qué tan grande es mi experiencia con IA comparada con la de datos: los datos ocupan ocho de esos años; la IA aplicada, con agentes en producción, empieza en agosto de 2023 en Vesting y sigue hoy en CTIC…»

**✅ ¿Ha construido prompts o sistemas con instrucciones para un modelo?**

- top-4: a-fondo-rag-y-el-chat-los-guardrails~1, a-fondo-analitica-predictiva-donde-lo-aplico-hoy, a-fondo-las-investigaciones-se-mide-el-vacio~2, a-fondo-analitica-predictiva-la-estadistica
- primer fragmento: «El alcance del chat no depende de una instrucción. El orden real de las defensas en el servidor: 1. **Interruptor general**: si el chat está apagado, el servidor tampoco pinta el botón. 2. **Límite de frecuencia**: 10 pr…»

### plataforma-y-datos

**✅ ¿Qué experiencia tiene con Microsoft Fabric?**

- top-4: a-fondo-fabric-en-la-practica-power-bi~1, a-fondo-fabric-en-la-practica-power-bi~2, a-fondo-fabric-en-la-practica-lo-publico, a-fondo-plataforma-y-despliegue-el-mundo-microsoft~1
- primer fragmento: «**Power BI** atraviesa toda mi trayectoria: el análisis de la operación de TransMilenio, el BI de control del WMS en Cafam, la adopción por más de 50 usuarios en Banco Pichincha y hoy los 42 productos analíticos de la Fu…»

**☑️ ¿Ha diseñado una arquitectura de datos desde cero?**

- top-4: casestudy-vesting, trayectoria-1, a-fondo-lo-que-busco-que-ofrezco~2, a-fondo-fabric-en-la-practica-lago-y-almacen~2
- primer fragmento: «Vesting, una startup de agentes de automatización, crecía sin infraestructura de datos: la analítica de sus agentes de IA no tenía dónde vivir y cada integración de datos de clientes era artesanal. Construir desde cero e…»

**☑️ ¿Qué es un lakehouse y lo ha usado?**

- top-4: a-fondo-plataforma-y-despliegue-como-la-cubro~1, a-fondo-fabric-en-la-practica-lago-y-almacen~1, a-fondo-fabric-en-la-practica-lago-y-almacen~2, a-fondo-fabric-en-la-practica-lo-publico
- primer fragmento: «Dos razones. La primera es de equivalencia: un lago sobre almacenamiento distribuido, un almacén analítico columnar, un orquestador de pipelines y una capa semántica existen en las tres nubes con nombres distintos. Lo qu…»

**✅ ¿Sabe modelado semántico?**

- top-4: a-fondo-fabric-en-la-practica-modelado-semantico~1, a-fondo-fabric-en-la-practica-modelado-semantico~2, a-fondo-banco-pichincha-modelos-semanticos-y-optimizacion, a-fondo-los-tableros-que-son
- primer fragmento: «El **modelo semántico** es la capa menos visible y la que más determina el valor: donde las tablas se vuelven entidades del negocio, las relaciones adquieren significado y las reglas de cálculo se vuelven **medidas** que…»

**✅ ¿Qué nivel tiene con Power BI?**

- top-4: a-fondo-fabric-en-la-practica-power-bi~2, a-fondo-fabric-en-la-practica-power-bi~1, agentes-constructor-tableros-powerbi-limites, skills
- primer fragmento: «La ingeniería industrial aporta el proceso —tableros por proceso, no por área, con indicadores de resultado conectados a las condiciones que los producen— y el diseño industrial la interacción: jerarquía, navegación comp…»

**✅ ¿Sabe DAX?**

- top-4: a-fondo-fabric-en-la-practica-modelado-semantico~1, a-fondo-fabric-en-la-practica-modelado-semantico~2, tableros-energia-y-clima-cifras~1, a-fondo-las-investigaciones-operaciones-bajo-variabilidad~1
- primer fragmento: «El **modelo semántico** es la capa menos visible y la que más determina el valor: donde las tablas se vuelven entidades del negocio, las relaciones adquieren significado y las reglas de cálculo se vuelven **medidas** que…»

**✅ ¿Ha construido procesos ETL?**

- top-4: a-fondo-banco-pichincha-el-etl-y-la-preparacion, a-fondo-procesos-y-simulacion-construir-procesos, a-fondo-fundacion-ctic-analitica-por-procesos~1, a-fondo-inglopres-lo-que-dejo
- primer fragmento: «Optimicé los procesos **ETL** de preparación de información de las soluciones de Power BI, con **Power Query**, y los tiempos de análisis **bajaron un 35 %**, con más consistencia en los resultados. Estructuré las consul…»

**✅ ¿Qué tan fuerte es en SQL?**

- top-4: a-fondo-cafam-calidad-en-sql~2, a-fondo-analitica-predictiva-las-herramientas~1, a-fondo-cafam-calidad-en-sql~1, a-fondo-analitica-predictiva-las-herramientas~2
- primer fragmento: «Aprendí que la calidad no es una propiedad abstracta: un dato puede ser válido en su formato y no ser lo bastante oportuno, completo o consistente para una decisión concreta. Y que los controles van dentro del pipeline,…»

**✅ ¿Tiene experiencia con Azure?**

- top-4: a-fondo-plataforma-y-despliegue-el-mundo-microsoft~1, a-fondo-fabric-en-la-practica-power-bi~1, a-fondo-gobierno-de-datos-y-de-ia-experiencia-y-formacion, a-fondo-fabric-en-la-practica-power-bi~2
- primer fragmento: «Mi experiencia en la **nube** está en el ecosistema **Microsoft** y en **Azure**, y ahí está la profundidad: **Microsoft Fabric**, **Power BI**, modelos semánticos, lakehouses, warehouses y pipelines, y hoy **Microsoft F…»

**✅ ¿Conoce Google Cloud, Vertex AI o BigQuery?**

- top-4: a-fondo-plataforma-y-despliegue-lo-que-no-he-hecho, app-agente-gemini-vertex, a-fondo-plataforma-y-despliegue-como-la-cubro~2, a-fondo-plataforma-y-despliegue-como-la-cubro~1
- primer fragmento: «**Google Cloud** —**Vertex AI**, **BigQuery**, despliegue productivo en ese ecosistema— y **contenedores en producción** con **Docker** y **Kubernetes** no están en mi experiencia profesional. Mi mundo es Microsoft y en…»

**✅ ¿Tiene experiencia con Docker y Kubernetes?**

- top-4: a-fondo-plataforma-y-despliegue-lo-que-no-he-hecho, a-fondo-fabric-en-la-practica-power-bi~1, a-fondo-gobierno-de-datos-y-de-ia-experiencia-y-formacion, a-fondo-fabric-en-la-practica-power-bi~2
- primer fragmento: «**Google Cloud** —**Vertex AI**, **BigQuery**, despliegue productivo en ese ecosistema— y **contenedores en producción** con **Docker** y **Kubernetes** no están en mi experiencia profesional. Mi mundo es Microsoft y en…»

**✅ ¿Sabe de MLOps?**

- top-4: a-fondo-plataforma-y-despliegue-desplegar-y-operar-ia, a-fondo-analitica-predictiva-monitoreo-del-modelo, a-fondo-plataforma-y-despliegue-lo-que-no-he-hecho, a-fondo-certificaciones-el-ai-300
- primer fragmento: «Desplegar aplicaciones y operar IA comparten fundamentos —versiones, automatización, pruebas, observabilidad—, pero una solución inteligente añade componentes probabilísticos que evolucionan solos: datos, modelos, contex…»

**☑️ ¿Ha trabajado con big data o procesamiento distribuido?**

- top-4: trayectoria-1, proyecto-vesting, casestudy-vesting, a-fondo-vesting-la-arquitectura~1
- primer fragmento: «2024: Líder de Estrategia de Datos, Vesting — startup de agentes de automatización. Ecosistema de datos para agentes de IA en Microsoft Fabric, desde cero: arquitectura, gobernanza, monitoreo de agentes en tiempo real y…»

**☑️ ¿Ha construido pipelines de datos que corran solos?**

- top-4: a-fondo-fabric-en-la-practica-pipelines, a-fondo-vesting-el-tamano-de-lo-construido, a-fondo-analitica-predictiva-donde-lo-aplico-hoy, a-fondo-como-aprendo-evidencia-construido~3
- primer fragmento: «La preparación empieza con **Power Query** y los pipelines de Fabric: conexión con las fuentes, preparación, construcción de las tablas del modelo, como pasos separados y con nombres que se entienden. En Banco Pichincha…»

**☑️ ¿Qué hace para asegurar la calidad de los datos?**

- top-4: casestudy-cafam, a-fondo-fundacion-ctic-gobierno-y-calidad~1, a-fondo-cafam-calidad-en-sql~2, a-fondo-cafam-calidad-en-sql~1
- primer fragmento: «Cafam implementaba un WMS en su operación logística: un cambio de sistema crítico donde cada error de datos se paga en la bodega. Asegurar la calidad de la implementación coordinando al equipo de pruebas más grande que h…»

**✅ ¿Sabe de integración continua y despliegue automático?**

- top-4: a-fondo-plataforma-y-despliegue-lo-que-no-he-hecho, a-fondo-plataforma-y-despliegue-lo-que-despliego~1, a-fondo-plataforma-y-despliegue-lo-que-despliego~2, a-fondo-plataforma-y-despliegue-el-mundo-microsoft~1
- primer fragmento: «**Google Cloud** —**Vertex AI**, **BigQuery**, despliegue productivo en ese ecosistema— y **contenedores en producción** con **Docker** y **Kubernetes** no están en mi experiencia profesional. Mi mundo es Microsoft y en…»

**✅ ¿Qué diferencia hay entre un data lake y un data warehouse para él?**

- top-4: a-fondo-fabric-en-la-practica-lago-y-almacen~1, a-fondo-fabric-en-la-practica-lago-y-almacen~2, a-fondo-vesting-la-arquitectura~1, trayectoria-1
- primer fragmento: «En Vesting diseñé sobre Fabric un ecosistema de **120 tablas y 20 GB** que combinaba almacenamiento analítico, procesamiento distribuido y estructuras de consumo. La regla era asignar cada carga al mecanismo adecuado seg…»

### bi-y-analitica

**✅ ¿Cómo logra que la gente use los tableros que construye?**

- top-4: a-fondo-banco-pichincha-el-problema-real, a-fondo-bi-que-se-adopta-el-problema-dificil, a-fondo-lo-que-busco-el-problema-que-quiero, a-fondo-bi-que-se-adopta-cuando-la-herramienta-estorba~1
- primer fragmento: «Entré a **Banco Pichincha en marzo de 2023** como Analista Senior de Analítica y Reportes y estuve hasta julio del mismo año. Fueron cinco meses, y fue mi paso por el **sector financiero**: en **banca** el dato tiene due…»

**☑️ ¿Tiene experiencia en inteligencia de negocios?**

- top-4: a-fondo-vesting-monitoreo-de-agentes~2, a-fondo-banco-pichincha-modelos-predictivos, a-fondo-banco-pichincha-lo-que-pichincha-consolido, a-fondo-rag-y-el-chat-que-demuestra
- primer fragmento: «Las métricas técnicas prueban que el agente respondió; no que la respuesta sirvió. Por eso los tableros operativos, para producto y operaciones, permitían recorrer una anomalía hasta los eventos de la sesión. Un agente d…»

**☑️ ¿Cuántos usuarios han adoptado los tableros que ha hecho?**

- top-4: a-fondo-fundacion-ctic-analitica-por-procesos~1, casestudy-banco-pichincha, a-fondo-transmilenio-cm-la-adopcion, a-fondo-bi-que-se-adopta-adopcion-medida~1
- primer fragmento: «He construido **42 productos analíticos** en Power BI —entre ellos **23 tableros de control**— que hoy usan **20 líderes** de **15 procesos** administrativos y asistenciales y unos **75 usuarios**. Las dos audiencias tra…»

**✅ ¿Ha desarrollado modelos predictivos?**

- top-4: a-fondo-banco-pichincha-modelos-predictivos, a-fondo-analitica-predictiva-dos-modelos~2, a-fondo-analitica-predictiva-dos-modelos~1, trayectoria-2
- primer fragmento: «Entrené y llevé a producción modelos de **machine learning** —con **scikit-learn**— para predecir **fuga de clientes, mora y riesgo**: anticipar qué cliente puede irse, qué obligación puede dejar de pagarse y qué operaci…»

**☑️ ¿Qué herramientas usa para machine learning?**

- top-4: a-fondo-banco-pichincha-modelos-predictivos, a-fondo-analitica-predictiva-dos-modelos~1, a-fondo-analitica-predictiva-las-herramientas~1, a-fondo-certificaciones-el-ai-300
- primer fragmento: «Entrené y llevé a producción modelos de **machine learning** —con **scikit-learn**— para predecir **fuga de clientes, mora y riesgo**: anticipar qué cliente puede irse, qué obligación puede dejar de pagarse y qué operaci…»

**✅ ¿Qué tan avanzado es en Python?**

- top-4: a-fondo-analitica-predictiva-las-herramientas~1, a-fondo-apps-pipeline-que-hay-construido~1, estudios, a-fondo-analitica-predictiva-las-herramientas~2
- primer fragmento: «Los lenguajes de programación con los que trabajo son Python, R, SQL y DAX; el nivel más avanzado es Python. No presento las herramientas como equivalentes. Esta es la lista honesta: | Herramienta | Nivel | Dónde | | ---…»

**✅ ¿En qué lenguajes de programación trabaja?**

- top-4: a-fondo-analitica-predictiva-las-herramientas~1, a-fondo-analitica-predictiva-las-herramientas~2, a-fondo-ceinfes-equipos-multidisciplinarios, a-fondo-ceinfes-la-programacion-de-recursos
- primer fragmento: «Los lenguajes de programación con los que trabajo son Python, R, SQL y DAX; el nivel más avanzado es Python. No presento las herramientas como equivalentes. Esta es la lista honesta: | Herramienta | Nivel | Dónde | | ---…»

**☑️ ¿Tiene experiencia con R además de Python?**

- top-4: a-fondo-los-tableros-el-stack, a-fondo-como-aprendo-evidencia-certificaciones~2, a-fondo-fabric-en-la-practica-power-bi~1, a-fondo-analitica-predictiva-las-herramientas~1
- primer fragmento: «Los seis se construyen con el mismo stack, declarado en cada ficha: **Power BI Desktop**, **Power Query** en lenguaje M para la preparación, **DAX** para las medidas, el reporte en **PBIR escrito por script** —doce págin…»
- nota: Medido: «¿Programa en R?» NO funciona, y no es un hueco de contenido. La recuperación es léxica y descarta los términos de menos de tres letras para no llenar de ruido cada consulta; con «R» indexada, la expansión por prefijo trae «reglas», «resultado», «recuperación»… y el fragmento que sí habla de R pierde. Se probó y se revirtió. Una pregunta cuya única palabra con contenido es una letra suelta es invisible para este chat, y está declarado como límite conocido de ADR-010.

**☑️ ¿Qué base estadística tiene?**

- top-4: a-fondo-certificaciones-las-de-ibm, a-fondo-analitica-predictiva-la-estadistica, a-fondo-agentes-en-produccion-n8n, trayectoria-5
- primer fragmento: «Mi base en ciencia de datos son **cuatro credenciales de IBM**, en dos etapas y alrededor de los tres lenguajes del análisis: **Python**, **SQL** y **R**. En **2022** completé el Certificado Profesional en Ciencia de Dat…»

**✅ ¿Ha hecho predicción de demanda?**

- top-4: a-fondo-transmilenio-cm-prediccion-de-demanda~1, a-fondo-transmilenio-cm-prediccion-de-demanda~2, a-fondo-plataforma-y-despliegue-lo-que-no-he-hecho, a-fondo-analitica-predictiva-en-produccion
- primer fragmento: «Desarrollé con **scikit-learn** un modelo de aprendizaje automático para predecir la **demanda del sistema por ruta y franja horaria**, con actualización mensual, para fortalecer la planeación y la programación de flota.…»

**✅ ¿Usa scikit-learn, pandas y numpy?**

- top-4: a-fondo-analitica-predictiva-las-herramientas~1, a-fondo-certificaciones-las-de-ibm, proyecto-banco-pichincha, casestudy-banco-pichincha
- primer fragmento: «Los lenguajes de programación con los que trabajo son Python, R, SQL y DAX; el nivel más avanzado es Python. No presento las herramientas como equivalentes. Esta es la lista honesta: | Herramienta | Nivel | Dónde | | ---…»

**✅ ¿Qué precisión alcanzaron los modelos que puso en producción?**

- top-4: a-fondo-analitica-predictiva-en-produccion, a-fondo-banco-pichincha-modelos-predictivos, a-fondo-analitica-predictiva-dos-modelos~2, casestudy-banco-pichincha
- primer fragmento: «Uso con cuidado la expresión «modelo en producción». Un modelo no está en producción por tener una métrica alta en un notebook: lo está cuando sus predicciones entran en un proceso real, llegan dentro del ciclo de decisi…»

**✅ ¿Ha automatizado reportes o tareas repetitivas?**

- top-4: a-fondo-cm-operaciones-la-automatizacion, casestudy-transmilenio-cm, trayectoria-3, a-fondo-como-trabajo-como-lidero~2
- primer fragmento: «Automaticé las actividades recurrentes de preparación, validación y consolidación de la información de la operación de TransMilenio, con scripts en **Excel y VBA** y bases en **SQLite** consultadas en SQL: cada semana ll…»

### gobierno

**✅ ¿Tiene experiencia en gobierno de datos?**

- top-4: a-fondo-gobierno-de-datos-y-de-ia-experiencia-y-formacion, a-fondo-gobierno-de-datos-y-de-ia-tres-veces~2, a-fondo-gobierno-de-datos-y-de-ia-tres-veces~1, a-fondo-lo-que-busco-que-ofrezco~1
- primer fragmento: «Algunas posiciones de estrategia y gobierno de IA piden posgrado. Mi formación es Ingeniería Industrial y Diseño Industrial en la Javeriana, cinco credenciales obtenidas —el DP-600 y cuatro de IBM— y dos rutas en curso,…»

**✅ ¿Conoce la norma ISO 42001?**

- top-4: a-fondo-gobierno-de-datos-y-de-ia-iso-42001, a-fondo-gobierno-de-datos-y-de-ia-estrategia-iso-42001~1, a-fondo-gobierno-de-datos-y-de-ia-estrategia-iso-42001~2, a-fondo-procesos-y-simulacion-iso-9001
- primer fragmento: «Construí el **Experto ISO 42001**, uno de los 13 agentes de mi vitrina, como evidencia de cómo trabajo con IA generativa y conocimiento normativo. No usa la memoria del modelo como autoridad sobre la norma: cada afirmaci…»

**✅ ¿Qué entiende por gobierno de inteligencia artificial?**

- top-4: a-fondo-gobierno-de-datos-y-de-ia-tres-veces~1, a-fondo-gobierno-de-datos-y-de-ia-estrategia-iso-42001~1, a-fondo-fundacion-ctic-gobierno-y-calidad~2, a-fondo-gobierno-de-datos-y-de-ia-estrategia-iso-42001~2
- primer fragmento: «He asumido responsabilidades de **gobierno de datos** e inteligencia artificial en tres contextos distintos, y en cada uno el problema era otro: | Dónde | Alcance | El problema que había que gobernar | | ----------------…»

**✅ ¿Ha definido políticas, estándares o lineamientos de datos?**

- top-4: a-fondo-gobierno-de-datos-y-de-ia-que-es-gobernar, a-fondo-ceinfes-balanceo-de-digitalizacion~2, a-fondo-fundacion-ctic-gobierno-y-calidad~1, a-fondo-las-investigaciones-datos-sinteticos-y-limites
- primer fragmento: «Gobernar un dato es poder responder cinco preguntas sobre él: de dónde viene y qué reglas lo transformaron (**linaje**), qué significa y quién responde por esa definición (**roles**), quién puede usarlo y para qué (**pol…»

**✅ ¿Cómo maneja datos personales o sensibles?**

- top-4: a-fondo-gobierno-de-datos-y-de-ia-que-es-gobernar, a-fondo-fundacion-ctic-gobierno-y-calidad~1, a-fondo-vesting-una-startup-sin-plataforma~1, pieza-apps-anonimizador-funcionalidades~1
- primer fragmento: «Gobernar un dato es poder responder cinco preguntas sobre él: de dónde viene y qué reglas lo transformaron (**linaje**), qué significa y quién responde por esa definición (**roles**), quién puede usarlo y para qué (**pol…»

**✅ ¿Ha liderado iniciativas transversales en organizaciones grandes?**

- top-4: a-fondo-gobierno-de-datos-y-de-ia-lo-transversal, a-fondo-fundacion-ctic-estrategia-institucional-de-ia, a-fondo-gobierno-de-datos-y-de-ia-estrategia-iso-42001~1, a-fondo-cafam-el-equipo-de-veinte~2
- primer fragmento: «El gobierno genera poco valor dentro de un solo equipo. He trabajado tres veces en iniciativas transversales donde la colaboración no podía ordenarse: las mesas con la dirección de los concesionarios del SITP, el equipo…»

**✅ ¿Conoce normas ISO y trabajo bajo estándares?**

- top-4: a-fondo-procesos-y-simulacion-iso-9001, a-fondo-gobierno-de-datos-y-de-ia-iso-42001, a-fondo-inglopres-el-estudio-del-trabajo, a-fondo-origenes-el-primer-trabajo~1
- primer fragmento: «En Inglopres trabajé el aseguramiento de calidad bajo **ISO 9001:2015** en la cadena de suministro, mi primera escuela formal de trazabilidad: no basta afirmar que el proceso funciona; hay que establecer qué resultado se…»

**✅ ¿Cómo asegura la trazabilidad de la información?**

- top-4: a-fondo-gobierno-de-datos-y-de-ia-que-es-gobernar, a-fondo-procesos-y-simulacion-iso-9001, trayectoria-4, a-fondo-fundacion-ctic-el-rol-actual
- primer fragmento: «Gobernar un dato es poder responder cinco preguntas sobre él: de dónde viene y qué reglas lo transformaron (**linaje**), qué significa y quién responde por esa definición (**roles**), quién puede usarlo y para qué (**pol…»

**✅ ¿Quién decide quién puede ver qué datos en sus plataformas?**

- top-4: a-fondo-vesting-el-proceso-core~2, a-fondo-procesos-y-simulacion-la-raiz, a-fondo-vesting-monitoreo-de-agentes~2, a-fondo-como-aprendo-por-que-existe-y-como-decido
- primer fragmento: «1. **Caso de uso**: qué problema se resuelve y qué acción habilita. 2. **Usuarios y decisión**: quién lo usa y qué decide con él. 3. **Especificación funcional**: cada actividad con entradas, reglas, salidas y criterios…»

### procesos

**✅ ¿Sabe modelar procesos en BPMN?**

- top-4: a-fondo-procesos-y-simulacion-bizagi-en-la-practica, a-fondo-procesos-y-simulacion-la-raiz, a-fondo-ceinfes-gestion-por-procesos~1, a-fondo-inglopres-el-erp~1
- primer fragmento: «Con **Bizagi** modelo procesos en **BPMN**: actividades, decisiones, responsables, eventos, entradas, resultados y transferencias entre áreas. Su valor no es el diagrama: es un lenguaje común para contrastar cómo debería…»

**☑️ ¿Ha hecho simulación de procesos o de operaciones?**

- top-4: a-fondo-las-investigaciones-datos-sinteticos-y-limites, a-fondo-las-investigaciones-operaciones-bajo-variabilidad~1, a-fondo-procesos-y-simulacion-capacidad-y-variabilidad~1, a-fondo-procesos-y-simulacion-preguntas-pendientes
- primer fragmento: «Varias de las 7 líneas —las 197.046 experiencias de los convoyes, las curvas de fatiga— se evalúan con datos sintéticos o simulación porque no hay datos públicos suficientes o no se puede usar información operacional. Lo…»

**✅ ¿Ha usado Bizagi o FlexSim?**

- top-4: a-fondo-procesos-y-simulacion-bizagi-en-la-practica, a-fondo-cafam-el-contexto~2, skills, a-fondo-origenes-el-hilo~2
- primer fragmento: «Con **Bizagi** modelo procesos en **BPMN**: actividades, decisiones, responsables, eventos, entradas, resultados y transferencias entre áreas. Su valor no es el diagrama: es un lenguaje común para contrastar cómo debería…»

**✅ ¿Tiene experiencia en mejora continua y optimización de procesos?**

- top-4: a-fondo-ceinfes-gestion-por-procesos~2, a-fondo-fabric-en-la-practica-power-bi~1, trayectoria-0, a-fondo-banco-pichincha-modelos-semanticos-y-optimizacion
- primer fragmento: «Ahí aprendí de dónde sale la resistencia: no de la tecnología, sino de que hacer visible el proceso obliga a resolver ambigüedades que durante años se compensaron con experiencia, comunicación informal y decisiones indiv…»

**✅ ¿Ha trabajado con metodologías ágiles?**

- top-4: a-fondo-ceinfes-gestion-por-procesos~1, trayectoria-6, a-fondo-procesos-y-simulacion-estudio-del-trabajo, a-fondo-fundacion-ctic-el-rol-actual
- primer fragmento: «Lideré la transición de Ceinfes hacia un modelo de **gestión por procesos** sustentado en sistemas de información, y dirigí los proyectos tecnológicos que lo soportaban con **metodologías ágiles**. Con el área de tecnolo…»

**✅ ¿Para qué le sirve la ingeniería industrial en un puesto de datos?**

- top-4: a-fondo-origenes-por-que-industrial~2, a-fondo-origenes-por-que-industrial~1, a-fondo-origenes-cuantos-anos~1, a-fondo-origenes-el-hilo~3
- primer fragmento: «Las tres cosas siguen definiendo el perfil. La ingeniería me permite estructurar la complejidad. Los datos me permiten observarla y explicarla con evidencia. El diseño me obliga a convertir ese conocimiento en algo que a…»

### vitrina

**✅ ¿Qué ha construido por su cuenta, fuera del trabajo?**

- top-4: a-fondo-apps-pipeline-por-que-en-publico, a-fondo-fundacion-ctic-el-rol-actual, a-fondo-agentes-en-produccion-el-proceso-core, a-fondo-inglopres-lo-que-dejo
- primer fragmento: «Un currículum afirma; una pieza publicada demuestra: por eso he publicado seis aplicaciones y 32 piezas en total. Durante diez años exigí que cada indicador conservara su procedencia y que cada conclusión tuviera evidenc…»

**✅ ¿Cuántas aplicaciones ha publicado?**

- top-4: a-fondo-apps-pipeline-por-que-en-publico, a-fondo-ceinfes-los-indicadores~1, a-fondo-certificaciones-el-ai-103, a-fondo-como-aprendo-evidencia-construido~3
- primer fragmento: «Un currículum afirma; una pieza publicada demuestra: por eso he publicado seis aplicaciones y 32 piezas en total. Durante diez años exigí que cada indicador conservara su procedencia y que cada conclusión tuviera evidenc…»

**✅ ¿Tiene código público o repositorios que se puedan revisar?**

- top-4: a-fondo-apps-pipeline-codigo-primero, a-fondo-apps-pipeline-la-fabrica-en-numeros~1, a-fondo-apps-pipeline-por-que-en-publico, a-fondo-apps-pipeline-la-fabrica-en-numeros~2
- primer fragmento: «Regla 13 del pipeline: no incorporar IA generativa por defecto. Antes de usar un modelo hay que demostrar qué característica del problema exige interpretación, generación, recuperación contextual o coordinación flexible,…»

**✅ ¿Qué tableros ha publicado con datos abiertos?**

- top-4: a-fondo-los-tableros-que-son, a-fondo-los-tableros-el-stack, a-fondo-los-tableros-los-seis~1, a-fondo-los-tableros-cobertura-y-limites~1
- primer fragmento: «Construí desde cero **seis tableros** sobre **datos abiertos** y los publiqué sellados en la vitrina, cada uno con su ficha técnica. No son ejercicios de diseño: son productos analíticos completos, de la evaluación de la…»

**✅ ¿Ha trabajado con datos abiertos o fuentes públicas?**

- top-4: a-fondo-los-tableros-el-stack, a-fondo-los-tableros-que-son, a-fondo-los-tableros-que-demuestran, a-fondo-los-tableros-los-seis~1
- primer fragmento: «Los seis se construyen con el mismo stack, declarado en cada ficha: **Power BI Desktop**, **Power Query** en lenguaje M para la preparación, **DAX** para las medidas, el reporte en **PBIR escrito por script** —doce págin…»

**✅ ¿Sabe leer estados financieros o datos contables?**

- top-4: a-fondo-los-tableros-los-seis~1, tableros-banca-colombiana, a-fondo-los-tableros-que-demuestran, tableros-empresas-de-colombia
- primer fragmento: «| Tablero | Universo | La identidad que cierra | | ---------------------------------------------- | ------------------------------------------------------------------------ | ---------------------------------------------…»

**✅ ¿Qué investigaciones ha hecho?**

- top-4: a-fondo-las-investigaciones-se-mide-el-vacio~3, a-fondo-plataforma-y-despliegue-lo-que-no-he-hecho, a-fondo-las-investigaciones-procesos-y-decision~1, a-fondo-las-investigaciones-los-harnesses~1
- primer fragmento: «Un vacío contado sigue teniendo límites: demuestra que la condición no se encontró en el corpus revisado bajo ese método, no que sea imposible que exista fuera de la búsqueda. La formulación correcta no es «nadie lo ha h…»

**☑️ ¿Ha escrito artículos o papers?**

- top-4: a-fondo-los-agentes-de-la-vitrina-investigacion-y-fabrica~1, a-fondo-procesos-y-simulacion-iso-9001, a-fondo-las-investigaciones-que-son, agentes-hr-develop-ai-apps-limites
- primer fragmento: «| Agente | Estado | Qué promete | Cifra medida | | -------------------------------- | ------- | ---------------------------------------------------------------------------------------------------- | ---------------------…»

**☑️ ¿Qué agentes tiene publicados en su portafolio?**

- top-4: a-fondo-como-aprendo-evidencia-construido~3, a-fondo-agentes-en-produccion-dos-experiencias, a-fondo-las-investigaciones-que-son, a-fondo-agentes-en-produccion-fuentes-o-vacio
- primer fragmento: «A las seis aplicaciones se suman **13 agentes** publicados, **7 investigaciones** y **6 tableros** sobre datos públicos: **32 piezas** en cuatro familias, cada una con una forma distinta de aprender. Las aplicaciones exi…»

**✅ ¿Para qué sirven los trece agentes de la vitrina?**

- top-4: a-fondo-los-agentes-de-la-vitrina-que-son, a-fondo-los-agentes-de-la-vitrina-lo-que-comparten, a-fondo-los-agentes-de-la-vitrina-investigacion-y-fabrica~1, a-fondo-los-agentes-de-la-vitrina-investigacion-y-fabrica~2
- primer fragmento: «La vitrina publica **13 agentes**, cada uno con su ficha técnica: promesa, cifras con procedencia, límites, «nunca» y el proceso dibujado. Son sistemas de trabajo que corren sobre **Claude Code** dentro de un **harness**…»

**✅ ¿Qué es un harness y cómo lo usa en sus agentes?**

- top-4: a-fondo-los-agentes-de-la-vitrina-que-son, a-fondo-plataforma-y-despliegue-desplegar-y-operar-ia, a-fondo-las-investigaciones-los-harnesses~1, a-fondo-vesting-el-proceso-core~2
- primer fragmento: «La vitrina publica **13 agentes**, cada uno con su ficha técnica: promesa, cifras con procedencia, límites, «nunca» y el proceso dibujado. Son sistemas de trabajo que corren sobre **Claude Code** dentro de un **harness**…»

**✅ ¿Cómo controla la calidad de lo que producen sus agentes con Claude Code?**

- top-4: a-fondo-los-agentes-de-la-vitrina-lo-que-comparten, a-fondo-los-agentes-de-la-vitrina-que-son, a-fondo-vesting-el-proceso-core~1, a-fondo-como-trabajo-el-instrumento-para-cada-decision
- primer fragmento: «- **Gates humanos con token exacto.** Ningún agente cruza una puerta —encender una GPU, cerrar un sprint, integrar una ficha— sin la palabra literal de la persona. Entre 5 y 8 gates por agente. - **Carnadas.** Un control…»

**✅ ¿Cómo verifica las cifras que publica?**

- top-4: a-fondo-los-tableros-cobertura-y-limites~2, a-fondo-plataforma-y-despliegue-lo-que-despliego~2, a-fondo-los-tableros-los-seis~1, a-fondo-los-tableros-las-identidades~1
- primer fragmento: «Y cada ficha publica sus **«nunca»**: nunca sumar consolidados con individuales, porque serían la misma matriz contada dos veces; nunca usar la suma de países como total global; nunca restar dos series de temperatura con…»

**✅ ¿Con qué está hecha esta página web?**

- top-4: a-fondo-apps-pipeline-esta-misma-pagina, a-fondo-rag-y-el-chat-lo-que-estas-usando, a-fondo-plataforma-y-despliegue-lo-que-no-he-hecho, agentes-biblioteca-tendencias-genai-cifras~3
- primer fragmento: «**CV Viva** forma parte del portafolio: una aplicación en **Next.js** con generación estática, bilingüe, construida en 8 sprints, con **pruebas automatizadas** en tres niveles, accesibilidad verificada, presupuesto de re…»

**☑️ ¿Sus aplicaciones tienen pruebas automatizadas?**

- top-4: a-fondo-certificaciones-el-ai-103, a-fondo-plataforma-y-despliegue-desplegar-y-operar-ia, a-fondo-apps-pipeline-esta-misma-pagina, a-fondo-como-aprendo-evidencia-construido~2
- primer fragmento: «Desde **julio de 2026** curso la ruta del examen **AI-103**, que conduce a **Microsoft Certified: Azure AI Apps and Agents Developer Associate**: llevo 21 módulos. No la presento como obtenida: mientras no apruebe el exa…»

### encaje

**☑️ ¿Qué tipo de rol está buscando?**

- top-4: a-fondo-rag-y-el-chat-lo-que-estas-usando, a-fondo-lo-que-busco-los-roles-que-me-encajan~1, a-fondo-vesting-el-puente, a-fondo-como-aprendo-criterios-de-aprendizaje
- primer fragmento: «Si esta respuesta la generó el chat de esta página, estás usando una implementación real de la arquitectura que describo: un sistema de generación aumentada por recuperación —**RAG**— que construí para responder sobre mi…»

**✅ ¿Está dispuesto a reubicarse a otro país?**

- top-4: a-fondo-lo-que-busco-condiciones, a-fondo-como-trabajo-que-valoro~1, a-fondo-lo-que-busco-que-ofrezco~2, a-fondo-plataforma-y-despliegue-el-mundo-microsoft~2
- primer fragmento: «- **Ubicación:** vivo en **Bogotá, Colombia**. Trabajo presencial, híbrido o **remoto**. - **Reubicación:** dispuesto a **reubicarme** a otra ciudad o a otro país, si la oportunidad representa una evolución real y las co…»

**✅ ¿Trabaja en remoto?**

- top-4: a-fondo-lo-que-busco-condiciones, contacto, a-fondo-como-trabajo-como-hablo-con-el-negocio~2, a-fondo-fundacion-ctic-el-rol-actual
- primer fragmento: «- **Ubicación:** vivo en **Bogotá, Colombia**. Trabajo presencial, híbrido o **remoto**. - **Reubicación:** dispuesto a **reubicarme** a otra ciudad o a otro país, si la oportunidad representa una evolución real y las co…»

**✅ ¿Qué nivel de inglés tiene?**

- top-4: a-fondo-lo-que-busco-condiciones, a-fondo-analitica-predictiva-las-herramientas~1, a-fondo-analitica-predictiva-las-herramientas~2, tableros-gasto-del-estado-bloques
- primer fragmento: «- **Ubicación:** vivo en **Bogotá, Colombia**. Trabajo presencial, híbrido o **remoto**. - **Reubicación:** dispuesto a **reubicarme** a otra ciudad o a otro país, si la oportunidad representa una evolución real y las co…»

**✅ ¿En qué ciudad vive?**

- top-4: a-fondo-lo-que-busco-condiciones, casestudy-transmilenio-cm, proyecto-transmilenio-cm, a-fondo-cm-operaciones-la-operacion-de-una-ciudad~2
- primer fragmento: «- **Ubicación:** vivo en **Bogotá, Colombia**. Trabajo presencial, híbrido o **remoto**. - **Reubicación:** dispuesto a **reubicarme** a otra ciudad o a otro país, si la oportunidad representa una evolución real y las co…»

**✅ ¿Ha vivido o estudiado fuera del país?**

- top-4: a-fondo-lo-que-busco-condiciones, a-fondo-rag-y-el-chat-fuera-de-alcance, a-fondo-apps-pipeline-por-que-en-publico, tableros-ciclo-monetario-cifras~4
- primer fragmento: «- **Ubicación:** vivo en **Bogotá, Colombia**. Trabajo presencial, híbrido o **remoto**. - **Reubicación:** dispuesto a **reubicarme** a otra ciudad o a otro país, si la oportunidad representa una evolución real y las co…»

**✅ ¿Cómo lo contacto?**

- top-4: contacto, a-fondo-apps-pipeline-el-contrato-de-las-fichas, a-fondo-los-agentes-de-la-vitrina-produccion-de-piezas~1, a-fondo-lo-que-busco-como-trabajo-con-quien-contrata
- primer fragmento: «Bogotá, Colombia · Abierto a reubicación internacional y trabajo remoto. Email: mauricio.hmrc@gmail.com. LinkedIn: https://www.linkedin.com/in/henry-mauricio-rincon · GitHub: https://github.com/mauriciorincon-ai»

**✅ ¿Por qué debería contratarlo a él y no a otro?**

- top-4: a-fondo-lo-que-busco-que-ofrezco~1, a-fondo-lo-que-busco-condiciones, a-fondo-fundacion-ctic-gobierno-y-calidad~2, a-fondo-agentes-en-produccion-n8n
- primer fragmento: «Si la pregunta es por qué contratarme a mí y no a otro perfil de datos, la respuesta es la combinación: conecto dimensiones que suelen estar separadas: procesos, datos, experiencia de usuario, plataformas analíticas, apl…»

**✅ ¿Qué lo motiva profesionalmente?**

- top-4: a-fondo-lo-que-busco-el-problema-que-quiero, investigaciones-espectro-agencia-limites, agentes-biblioteca-tendencias-genai-cifras~1, pieza-apps-anonimizador-funcionalidades~4
- primer fragmento: «Quiero trabajar en problemas que exijan conectar datos, analítica e inteligencia artificial dentro de una capacidad empresarial completa: donde no basta construir un modelo o un tablero, sino que hay que integrarlos con…»

**☑️ ¿Cómo es trabajar con él en el día a día?**

- top-4: a-fondo-certificaciones-el-dp-600~1, a-fondo-lo-que-busco-como-trabajo-con-quien-contrata, a-fondo-como-trabajo-como-hablo-con-el-negocio~2, a-fondo-como-trabajo-como-lidero~2
- primer fragmento: «Preparé el **DP-600** entre julio y noviembre de 2024 y obtuve la credencial en **diciembre de 2024**, mientras trabajaba a tiempo completo y construía en Vesting un ecosistema de datos sobre **Microsoft Fabric**. Fabric…»

**✅ ¿Cómo prefiere que sea el proceso de selección?**

- top-4: a-fondo-lo-que-busco-como-trabajo-con-quien-contrata, a-fondo-origenes-del-proceso-a-la-ia, a-fondo-como-trabajo-como-lidero~2, a-fondo-gobierno-de-datos-y-de-ia-gobierno-de-mi-proceso
- primer fragmento: «Prefiero una conversación sobre un problema real a un recorrido por el currículum. Con un problema y contexto suficiente puedo decir qué entendería primero, qué información necesitaría, qué hipótesis validaría y cuál ser…»

**✅ ¿Qué haría en sus primeros noventa días en el puesto?**

- top-4: a-fondo-lo-que-busco-como-trabajo-con-quien-contrata, a-fondo-origenes-el-primer-trabajo~1, a-fondo-inglopres-lo-que-dejo, a-fondo-como-trabajo-como-hablo-con-el-negocio~1
- primer fragmento: «Prefiero una conversación sobre un problema real a un recorrido por el currículum. Con un problema y contexto suficiente puedo decir qué entendería primero, qué información necesitaría, qué hipótesis validaría y cuál ser…»

**☑️ ¿Qué no ha hecho nunca y tendría que aprender?**

- top-4: a-fondo-los-agentes-de-la-vitrina-aprendizaje~2, a-fondo-como-aprendo-por-que-existe-y-como-decido, a-fondo-plataforma-y-despliegue-lo-que-no-he-hecho, agentes-biblioteca-tendencias-genai-limites
- primer fragmento: «La Super guía no ejecuta nada en Azure: propone los comandos y los corres tú, porque ejecutar es el aprendizaje. El Asistente prepara y no suplanta: no escribe los entregables evaluables del estudiante. Hiring Copilot en…»

---

## Preguntas ajenas: dónde está la frontera de verdad

De las 15 preguntas ajenas del banco, **6 se paran en el guardrail** —respuesta fija, cero tokens— y **9 llegan al modelo**, donde las para el prompt grounding-only. Eso no es un fallo: está escrito como decisión en `src/lib/ia/guardrails.ts`. Una pregunta ajena que comparte una palabra con el contenido pasa, y subir el umbral hasta bloquearla bloquearía también preguntas legítimas cortas.

**Y hay un precio de crecer, medido aquí:** el índice de hoy bloquea 6 de las 15; el corpus completo, 6. Más texto es más vocabulario compartido con cualquier pregunta. Por eso la garantía de corrección es el prompt grounding-only y no este umbral.

- **¿va a llover mañana en Madrid?** — Desde que las fichas de la vitrina entran al índice (ADR-021), «mañana» aparece en la ficha de Hablemos San («cada mañana»). La ficha es de otra casa y no se edita aquí; la pregunta llega al modelo y el prompt la declina.
- **¿cuál es la receta del ajiaco?** — Con las fichas en el índice (ADR-021), «receta» aparece en los límites de la ficha de ARKHÉ. En los documentos a fondo la palabra se retiró («publica los componentes, no la fórmula»); la ficha es de otra casa.
- **¿quién ganó el mundial de fútbol?** — «mundial» aparece en la ficha del tablero de energía y clima. En los documentos a fondo se retiraron «ganó» y «total mundial»; la ficha no se edita aquí.
- **escríbeme una función en rust que ordene una lista** — «función» y «lista» son palabras del corpus. Es el caso que está escrito como decisión en guardrails.ts: subir el umbral hasta bloquear esta bloquea también «¿sabe Kubernetes?», que es legítima.
- **recomiéndame una película para el fin de semana** — «semana» aparece en el corpus («construyo cada semana»).
- **tradúceme esta frase al francés** — «frase» aparece («nadie decide sobre una tabla, decide sobre una frase»).
- **¿cuál es la capital de Australia?** — «Australia» aparece: el curso de inglés en Melbourne.
- **¿cuánto cuesta un tiquete a Cartagena?** — «cuesta» aparece varias veces.
- **¿qué horóscopo tengo hoy?** — «hoy» aparece en casi todos los documentos.

✅ Leyenda: la fuente esperada llegó de primeras · ☑️ llegó dentro del top-4 · ❌ no llegó.
