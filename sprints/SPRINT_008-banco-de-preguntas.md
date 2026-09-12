# Banco de preguntas — el corpus medido con preguntas de afuera

> **Generado por `pnpm corpus:informe` el 2026-09-12. No se edita a mano.**
> Banco: `tests/fixtures/banco-de-preguntas.es.yaml` — **131 preguntas** de 10 familias, 15 preguntas ajenas y 5 huecos declarados.
>
> **HOY** = el índice publicado, tal como está en disco: **28 fragmentos** (los 24 documentos siguen en `borrador`, así que el chat todavía no ve nada de ellos).
> **M2** = el índice que existirá cuando los apruebes: **159 fragmentos**.
> El `top-4` es el que de verdad entra al contexto del modelo.

---

## El número

| | HOY | M2 |
| --- | --- | --- |
| Preguntas con su fuente en el top-4 | 16/131 (12 %) | **131/131 (100 %)** |
| …y además de primeras | 10 (8 %) | **85 (65 %)** |
| Preguntas que reciben «eso se me escapa» | 18 | **0** |


**Cómo leer las dos filas.** La primera es el gate: la fuente que declaré para esa pregunta entra al top-4, que es lo que el modelo ve. La segunda es más dura de lo que parece: cuenta solo cuando esa fuente llega **de primeras**, y no cuenta los casos —muchos— en que la primera es otra fuente igual de buena («¿Qué hizo en Cafam?» arranca por el hito de la trayectoria y no por el documento a fondo). Se deja estricta a propósito: así el número solo sube cuando el contenido mejora de verdad.

**Y la columna HOY no es una nota baja: es el tamaño del cambio.** Está en 12 % porque las fuentes que estas preguntas necesitan son justo los 24 documentos que todavía no están aprobados. Lo que dice esa columna es cuántas de estas preguntas contesta hoy la hoja de vida sola.

### Por familia (M2)

| Familia | Preguntas | Con su fuente en top-4 | De primeras |
| --- | --- | --- | --- |
| trayectoria | 24 | 24 (100 %) | 12 (50 %) |
| forma-de-trabajar | 12 | 12 (100 %) | 7 (58 %) |
| certificaciones | 10 | 10 (100 %) | 4 (40 %) |
| ia-y-agentes | 16 | 16 (100 %) | 10 (63 %) |
| plataforma-y-datos | 17 | 17 (100 %) | 10 (59 %) |
| bi-y-analitica | 13 | 13 (100 %) | 10 (77 %) |
| gobierno | 9 | 9 (100 %) | 8 (89 %) |
| procesos | 6 | 6 (100 %) | 5 (83 %) |
| vitrina | 12 | 12 (100 %) | 11 (92 %) |
| encaje | 12 | 12 (100 %) | 8 (67 %) |

## Las que no traen su fuente

Ninguna: las 131 preguntas del banco traen al menos una de sus fuentes esperadas dentro del top-4.

## Lo que cambia al aprobar

**18 preguntas** que hoy reciben la respuesta fija «eso se me escapa» pasan a tener respuesta con fuente:

- ¿Tiene experiencia en el sector financiero?
- ¿En qué industrias o sectores ha trabajado?
- ¿Qué valora en un proyecto?
- ¿Cómo documenta lo que hace?
- ¿Cómo aprende una tecnología que no conoce?
- ¿Tiene posgrado, maestría o especialización?
- ¿Tiene experiencia con Docker y Kubernetes?
- ¿Sabe de MLOps?
- ¿En qué lenguajes de programación trabaja?
- ¿Qué base estadística tiene?
- ¿Ha usado Bizagi o FlexSim?
- ¿Cuántas aplicaciones ha publicado?
- ¿Qué investigaciones ha hecho?
- ¿Ha escrito artículos o papers?
- ¿Cómo verifica las cifras que publica?
- ¿Por qué debería contratarlo a él y no a otro?
- ¿Qué lo motiva profesionalmente?
- ¿Qué haría en sus primeros noventa días en el puesto?

## Huecos declarados

Preguntas que un reclutador hace y que **el corpus no contesta hoy**, con el documento donde iría la respuesta. No las inventé: cada una necesita algo que solo tú sabes.

- **¿Cuáles son sus expectativas salariales?** → `lo-que-busco`
  - Es una decisión del dueño, no un dato que falte. Hoy la pregunta recibe la respuesta fija. Si decide poner una banda o decir «conversemos», va en la subsección `condiciones`.
- **¿Cuál es su disponibilidad para empezar?** → `lo-que-busco`
  - Depende de su situación contractual actual, que no está escrita en ninguna parte y no tiene por qué estarlo sin su decisión.
- **¿Qué nivel de inglés tiene?** → `lo-que-busco`
  - El corpus menciona el curso intensivo con IELTS en Melbourne, pero no declara un nivel. El informe de discrepancias tiene el detalle: el respaldo es de hace doce años y está por debajo del B2 que declara la hoja de vida. Es una decisión suya qué declarar.
- **¿Tiene disponibilidad para viajar?** → `lo-que-busco`
  - Ni la hoja de vida ni el sitio lo dicen. Una línea en `condiciones` lo cierra, pero la línea es suya.
- **¿Qué pasó entre mayo de 2022 y marzo de 2023?** → `origenes`
  - Es el único hueco largo del recorrido —diez meses— y está señalado en el informe de discrepancias y en los COMPLEMENTOS de la hoja de vida. Nadie puede escribirlo sino él.

---

## El detalle, pregunta por pregunta (M2)

### trayectoria

**✅ ¿Dónde trabaja Henry actualmente?**

- top-4: a-fondo-fundacion-ctic-el-rol-actual, contacto, perfil, a-fondo-como-trabajo-como-hablo-con-el-negocio
- primer fragmento: «**Actualmente trabajo en la Fundación CTIC**, desde febrero de 2025, como Profesional de Analítica. Es mi rol actual y el contexto más exigente en el que he trabajado en cuanto a gobierno del dato, por una razón evidente…»

**✅ ¿Qué hace en la Fundación CTIC?**

- top-4: a-fondo-fundacion-ctic-tableros-por-procesos, trayectoria-0, a-fondo-fundacion-ctic-el-rol-actual, casestudy-fundacion-ctic
- primer fragmento: «He desarrollado dashboards y tableros de control **por procesos**, usando herramientas analíticas para el seguimiento de indicadores clave. Y he diseñado e implementado planes de mejora basados en el análisis de resultad…»

**☑️ ¿Tiene experiencia con datos del sector salud?**

- top-4: a-fondo-origenes-de-la-plataforma-a-la-ia, a-fondo-fundacion-ctic-gobierno-institucional, a-fondo-fundacion-ctic-el-rol-actual, casestudy-fundacion-ctic
- primer fragmento: «En agosto de 2023 entré a Vesting, una startup de agentes de automatización, como Líder de Estrategia de Datos. Construí desde cero el ecosistema de datos en Microsoft Fabric para la analítica de sus agentes de IA, y el…»

**☑️ ¿Qué hizo en Vesting?**

- top-4: trayectoria-1, casestudy-vesting, a-fondo-vesting-el-contexto, a-fondo-vesting-el-puente
- primer fragmento: «2023 — 2025: Líder de Estrategia de Datos, Vesting — startup de agentes de automatización. Ecosistema de datos para agentes de IA en Microsoft Fabric, desde cero: arquitectura, gobernanza, monitoreo de agentes en tiempo…»

**☑️ ¿Cuánto tiempo estuvo en Vesting y con qué cargo?**

- top-4: a-fondo-agentes-en-produccion-monitorear-no-es-mirar-si-esta-arriba, trayectoria-1, casestudy-vesting, a-fondo-origenes-de-la-plataforma-a-la-ia
- primer fragmento: «En Vesting implementé sistemas de captura, almacenamiento y análisis para el monitoreo en tiempo real de los agentes en producción. Un agente no falla como falla un servicio. No se cae: responde distinto. Puede seguir co…»
- nota: El hito de la trayectoria es tan buena fuente como el documento a fondo: es el que trae el periodo y el cargo exactos.

**☑️ ¿Por qué salió de Vesting?**

- top-4: a-fondo-agentes-en-produccion-monitorear-no-es-mirar-si-esta-arriba, trayectoria-1, casestudy-vesting, a-fondo-vesting-el-contexto
- primer fragmento: «En Vesting implementé sistemas de captura, almacenamiento y análisis para el monitoreo en tiempo real de los agentes en producción. Un agente no falla como falla un servicio. No se cae: responde distinto. Puede seguir co…»
- nota: El corpus no dice por qué salió, y está bien que no lo diga. Lo que se exige aquí es que traiga el documento de Vesting: con esas fuentes delante, el modelo contesta lo que sí consta y declara lo que no.

**☑️ ¿Ha trabajado en un banco?**

- top-4: a-fondo-como-trabajo-la-adopcion-es-el-indicador, trayectoria-2, a-fondo-banco-pichincha-el-problema-real, casestudy-banco-pichincha
- primer fragmento: «En inteligencia de negocios el problema difícil no es construir el tablero: es que lo usen. En Banco Pichincha el área producía tableros que el negocio no terminaba de adoptar; lo que cambió las cosas no fue una herramie…»

**☑️ ¿Qué hizo en Banco Pichincha?**

- top-4: trayectoria-2, a-fondo-banco-pichincha-el-problema-real, casestudy-banco-pichincha, a-fondo-banco-pichincha-gobierno-de-datos
- primer fragmento: «2023: Analista Senior de Analítica, Banco Pichincha. BI adoptado por 50+ usuarios, ETL con −35% de tiempos, modelos predictivos con >90% de precisión y co-liderazgo de la gobernanza de datos. Dashboards adoptados por 50+…»

**✅ ¿Tiene experiencia en el sector financiero?**

- top-4: a-fondo-banco-pichincha-el-problema-real, a-fondo-agentes-en-produccion-dos-experiencias, a-fondo-analitica-predictiva-dos-modelos, a-fondo-plataforma-y-despliegue-el-mundo-microsoft
- primer fragmento: «Entré a Banco Pichincha en marzo de 2023 como Analista Senior de Analítica y Reportes, y estuve hasta julio de 2023. Es mi paso por el **sector financiero**, y en banca eso cambia el peso de todo lo que sigue. El área pr…»

**☑️ ¿Qué hizo en Cafam?**

- top-4: trayectoria-4, casestudy-cafam, a-fondo-cafam-el-contexto, proyecto-cafam
- primer fragmento: «2020 — 2021: Analista de Sistemas de Información, Cafam. Lideré 20 personas en la implementación del WMS: −25% de errores y +15% de eficiencia operativa. Lideré un equipo de 20 personas en las pruebas de implementación d…»

**✅ ¿Ha participado en la implementación de un sistema de gestión de bodega?**

- top-4: a-fondo-cafam-el-contexto, a-fondo-ceinfes-gestion-por-procesos, casestudy-cafam, a-fondo-como-trabajo-como-lidero
- primer fragmento: «Entré a Cafam en octubre de 2020 como Analista de Sistemas de Información y de Proyectos, y estuve hasta junio de 2021. El encargo era la implementación de un sistema de gestión de almacenes en su operación logística. Ca…»

**☑️ ¿Cuál es el equipo más grande que ha liderado?**

- top-4: casestudy-cafam, a-fondo-cafam-el-equipo-de-veinte, a-fondo-como-trabajo-como-lidero, proyecto-cafam
- primer fragmento: «Cafam implementaba un WMS en su operación logística: un cambio de sistema crítico donde cada error de datos se paga en la bodega. Asegurar la calidad de la implementación coordinando al equipo de pruebas más grande que h…»

**✅ ¿Tiene experiencia en transporte masivo?**

- top-4: a-fondo-cm-operaciones-adherencia-a-protocolos, a-fondo-bi-que-se-adopta-adopcion-medida, a-fondo-cm-operaciones-la-operacion-de-una-ciudad, a-fondo-analitica-predictiva-dos-modelos
- primer fragmento: «Aseguré la adherencia a protocolos operativos. En una operación de transporte masivo eso significa comprobar, con datos y no con impresiones, que lo que se ejecutó coincide con lo que estaba definido: frecuencias, cumpli…»

**☑️ ¿Qué trabajo hizo para TransMilenio?**

- top-4: a-fondo-los-tableros-que-demuestran, a-fondo-transmilenio-cm-la-automatizacion, a-fondo-transmilenio-cm-las-mesas-del-sitp, a-fondo-transmilenio-cm-unificar-las-fuentes
- primer fragmento: «Ingeniería de datos de extremo a extremo sobre datos que cualquiera puede descargar y contrastar: ingesta de fuentes heterogéneas, modelado dimensional, verificación contra el origen, medición de cobertura y visualizació…»

**☑️ ¿Qué es el análisis post-operacional que menciona?**

- top-4: trayectoria-3, a-fondo-transmilenio-cm-el-problema, a-fondo-transmilenio-cm-unificar-las-fuentes, a-fondo-transmilenio-cm-las-mesas-del-sitp
- primer fragmento: «2021 — 2022: Análisis Post-Operacional, C&M Consultores (TransMilenio). Adopción de BI (+35% de eficiencia), ETL que unificó fuentes (+70%) y predicción de demanda con scikit-learn. Impulsé la adopción de BI en la operac…»

**☑️ ¿Qué hizo en Ceinfes?**

- top-4: trayectoria-6, a-fondo-ceinfes-el-encargo, a-fondo-ceinfes-la-junta-directiva, a-fondo-ceinfes-equipos-multidisciplinarios
- primer fragmento: «2017 — 2018: Coordinador de Operaciones, Ceinfes. KPIs e informes a junta directiva; transición a gestión por procesos con métodos ágiles. KPIs de logística, RRHH y digitalización; informes a junta directiva. Transición…»

**✅ ¿Ha presentado resultados ante una junta directiva?**

- top-4: a-fondo-ceinfes-la-junta-directiva, a-fondo-como-trabajo-como-hablo-con-el-negocio, trayectoria-6, a-fondo-ceinfes-el-encargo
- primer fragmento: «Presenté informes estratégicos a la junta directiva. Es la primera vez que me toca esa sala y lo que aprendí ahí lo sigo usando: una junta no quiere el detalle, quiere la consecuencia. El detalle tiene que existir y tien…»

**✅ ¿Cuál fue su primer empleo al salir de la universidad?**

- top-4: a-fondo-origenes-el-primer-trabajo, a-fondo-inglopres-la-operacion, a-fondo-inglopres-el-equipo-de-doce, a-fondo-origenes-de-la-plataforma-a-la-ia
- primer fragmento: «Entré a Inglopres en agosto de 2016 como Ingeniero de Procesos. Lideré la implementación de un sistema de planificación de recursos empresariales que integró los procesos de la organización, y diseñé las estructuras de b…»

**✅ ¿Ha liderado la implementación de un ERP?**

- top-4: a-fondo-inglopres-el-erp, casestudy-cafam, a-fondo-las-investigaciones-las-siete, proyecto-cafam
- primer fragmento: «Lideré la implementación de un sistema de planificación de recursos empresariales que integró los procesos de la organización. El efecto declarado fue un aumento de la eficiencia operativa y de la calidad del servicio. I…»

**✅ ¿Tiene experiencia en cadena de suministro y logística?**

- top-4: a-fondo-inglopres-cadena-e-iso, trayectoria-7, a-fondo-origenes-el-primer-trabajo, a-fondo-procesos-y-simulacion-iso-9001
- primer fragmento: «Encabecé proyectos de optimización de la cadena de suministro con dos objetivos: reducir costos operativos y asegurar el cumplimiento de la norma ISO 9001:2015. La norma fue mi primera escuela de rigor documental. Bajo I…»

**✅ ¿En qué industrias o sectores ha trabajado?**

- top-4: a-fondo-origenes-de-la-plataforma-a-la-ia, a-fondo-origenes-por-que-industrial, a-fondo-analitica-predictiva-dos-modelos, a-fondo-origenes-el-primer-trabajo
- primer fragmento: «En agosto de 2023 entré a Vesting, una startup de agentes de automatización, como Líder de Estrategia de Datos. Construí desde cero el ecosistema de datos en Microsoft Fabric para la analítica de sus agentes de IA, y el…»

**✅ ¿Cuántos años de experiencia profesional tiene?**

- top-4: a-fondo-origenes-de-la-plataforma-a-la-ia, a-fondo-agentes-en-produccion-dos-experiencias, trayectoria-0, a-fondo-como-aprendo-evidencia-certificaciones
- primer fragmento: «En agosto de 2023 entré a Vesting, una startup de agentes de automatización, como Líder de Estrategia de Datos. Construí desde cero el ecosistema de datos en Microsoft Fabric para la analítica de sus agentes de IA, y el…»

**☑️ ¿Ha trabajado en una startup?**

- top-4: a-fondo-origenes-de-la-plataforma-a-la-ia, trayectoria-1, a-fondo-vesting-el-contexto, a-fondo-fundacion-ctic-el-rol-actual
- primer fragmento: «En agosto de 2023 entré a Vesting, una startup de agentes de automatización, como Líder de Estrategia de Datos. Construí desde cero el ecosistema de datos en Microsoft Fabric para la analítica de sus agentes de IA, y el…»

**✅ ¿Ha trabajado para entidades públicas o con operación de ciudad?**

- top-4: a-fondo-cm-operaciones-la-operacion-de-una-ciudad, casestudy-transmilenio-cm, a-fondo-los-tableros-los-seis, a-fondo-apps-pipeline-que-hay-construido
- primer fragmento: «Entré a C&M Consorcio 2018 en noviembre de 2018, en la supervisión de TransMilenio, como Analista de Operaciones Junior, y estuve hasta mayo de 2020. Fue mi entrada al transporte masivo y al primer problema de datos de e…»

### forma-de-trabajar

**☑️ ¿Cómo trabaja Henry cuando llega a un problema nuevo?**

- top-4: a-fondo-lo-que-busco-el-problema-que-quiero, a-fondo-banco-pichincha-el-problema-real, a-fondo-como-trabajo-primero-el-proceso, a-fondo-como-trabajo-la-adopcion-es-el-indicador
- primer fragmento: «**Lo que me motiva** es seguir en la frontera entre la plataforma de datos y la inteligencia artificial: donde se decide cómo viven los datos, cómo se gobiernan y cómo un modelo o un agente llega a producción y se puede…»

**☑️ ¿Cómo lidera un equipo?**

- top-4: a-fondo-cafam-el-equipo-de-veinte, a-fondo-como-trabajo-como-lidero, a-fondo-inglopres-el-equipo-de-doce, casestudy-cafam
- primer fragmento: «Lideré un equipo de veinte personas en las pruebas de implementación del sistema. Es el equipo más grande que he coordinado y el resultado quedó medido: los errores bajaron un veinticinco por ciento y la eficiencia opera…»

**☑️ ¿Cómo se comunica con las áreas de negocio?**

- top-4: casestudy-banco-pichincha, a-fondo-banco-pichincha-el-problema-real, a-fondo-bi-que-se-adopta-el-problema-dificil, a-fondo-como-trabajo-la-adopcion-es-el-indicador
- primer fragmento: «El área de analítica y reportes del banco producía tableros que el negocio no terminaba de adoptar, con procesos ETL lentos y modelos fuera de producción. Convertir el BI en una herramienta que el negocio use a diario y…»

**✅ ¿Qué valora en un proyecto?**

- top-4: a-fondo-como-trabajo-que-valoro, a-fondo-vesting-el-proceso-core, a-fondo-cafam-el-bi-de-control, a-fondo-banco-pichincha-programa-de-formacion
- primer fragmento: «Tres cosas, en este orden. Que el problema sea real y se pueda medir. Que haya alguien del negocio dispuesto a usar lo que salga. Y que se pueda dejar funcionando sin mí — documentado, reproducible y con un proceso que o…»

**✅ ¿Es un perfil más de procesos o más de tecnología?**

- top-4: a-fondo-procesos-y-simulacion-la-raiz, perfil, a-fondo-ceinfes-gestion-por-procesos, a-fondo-como-trabajo-primero-el-proceso
- primer fragmento: «Soy ingeniero industrial de la Javeriana con énfasis en Inteligencia Analítica de Datos, y estudié también Diseño Industrial. Mi formación es de procesos, optimización y soporte a la decisión antes que de software. Esa r…»

**✅ ¿Por qué estudió ingeniería industrial?**

- top-4: a-fondo-origenes-por-que-industrial, a-fondo-procesos-y-simulacion-la-raiz, a-fondo-origenes-de-la-plataforma-a-la-ia, a-fondo-origenes-el-primer-trabajo
- primer fragmento: «Estudié Ingeniería Industrial en la Pontificia Universidad Javeriana, con énfasis en Inteligencia Analítica de Datos, entre 2009 y 2016. El énfasis no es un detalle de la ficha: es donde aparecen por primera vez el model…»

**✅ ¿Qué estudió y en qué universidad?**

- top-4: a-fondo-origenes-por-que-industrial, estudios, a-fondo-como-aprendo-la-guia-del-ai-103, a-fondo-certificaciones-el-ai-103
- primer fragmento: «Estudié Ingeniería Industrial en la Pontificia Universidad Javeriana, con énfasis en Inteligencia Analítica de Datos, entre 2009 y 2016. El énfasis no es un detalle de la ficha: es donde aparecen por primera vez el model…»

**☑️ ¿Tiene formación en diseño?**

- top-4: a-fondo-banco-pichincha-programa-de-formacion, a-fondo-bi-que-se-adopta-que-hago-distinto, a-fondo-procesos-y-simulacion-la-raiz, casestudy-banco-pichincha
- primer fragmento: «Diseñé un programa de formación en analítica que mejoró la productividad operativa en un veinte por ciento. Va de la mano con lo anterior: la adopción tiene dos mitades, y la segunda es que la gente sepa leer lo que está…»

**✅ ¿Cómo pasó de la ingeniería de procesos a los datos?**

- top-4: a-fondo-origenes-del-proceso-al-indicador, a-fondo-origenes-el-primer-trabajo, a-fondo-procesos-y-simulacion-modelar-antes, a-fondo-origenes-de-la-plataforma-a-la-ia
- primer fragmento: «En Ceinfes, entre finales de 2017 y finales de 2018, el trabajo dejó de ser el proceso y pasó a ser lo que el proceso produce. Desarrollé indicadores clave para logística, digitalización de datos y programación de recurs…»

**✅ ¿Qué lo diferencia de otros candidatos de datos?**

- top-4: a-fondo-procesos-y-simulacion-por-que-me-hace-mejor, a-fondo-los-tableros-que-demuestran, a-fondo-banco-pichincha-gobierno-de-datos, a-fondo-procesos-y-simulacion-la-raiz
- primer fragmento: «Tres razones concretas. **Sé qué medir.** Un indicador sale de entender el proceso, no del catálogo de campos disponibles. La diferencia entre medir lo que importa y medir lo que está a mano se decide antes de abrir la h…»

**✅ ¿Cómo documenta lo que hace?**

- top-4: a-fondo-procesos-y-simulacion-por-que-me-hace-mejor, a-fondo-agentes-en-produccion-el-proceso-core, a-fondo-inglopres-cadena-e-iso, a-fondo-procesos-y-simulacion-iso-9001
- primer fragmento: «Tres razones concretas. **Sé qué medir.** Un indicador sale de entender el proceso, no del catálogo de campos disponibles. La diferencia entre medir lo que importa y medir lo que está a mano se decide antes de abrir la h…»

**☑️ ¿Cómo maneja el trabajo con personas que no le reportan?**

- top-4: a-fondo-bi-que-se-adopta-que-hago-distinto, a-fondo-gobierno-de-datos-y-de-ia-lo-transversal, a-fondo-agentes-en-produccion-sistemas-de-trabajo, a-fondo-cafam-el-equipo-de-veinte
- primer fragmento: «Tres cosas, y ninguna es sobre la herramienta. **Diseño contra una decisión, no contra un conjunto de datos.** Antes de la primera pantalla pregunto qué decisión toma esta persona, cada cuánto y con qué información hoy.…»

### certificaciones

**☑️ ¿Qué certificaciones tiene?**

- top-4: a-fondo-como-aprendo-evidencia-certificaciones, a-fondo-certificaciones-como-se-conectan, a-fondo-certificaciones-las-de-ibm, a-fondo-certificaciones-el-ritmo
- primer fragmento: «**Cuatro certificaciones en dos años, trabajando a tiempo completo.** Tres de IBM en 2022 —Python para Ciencia de Datos, SQL para Ciencia de Datos y el Certificado Profesional en Ciencia de Datos— y Ciencia de Datos Apli…»

**✅ ¿Tiene la certificación DP-600 de Microsoft Fabric?**

- top-4: a-fondo-fabric-en-la-practica-que-significa-el-dp-600, a-fondo-certificaciones-el-dp-600, a-fondo-fabric-en-la-practica-lo-publico, certificaciones
- primer fragmento: «La certificación **Fabric Analytics Engineer Associate** cubre preparación, transformación y optimización de datos con Power BI, Synapse, Data Factory y Lakehouse, más seguridad, gobernanza y soluciones escalables con ap…»

**☑️ ¿Está certificado en inteligencia artificial de Azure?**

- top-4: a-fondo-apps-pipeline-en-exploracion, a-fondo-certificaciones-el-ai-103, a-fondo-gobierno-de-datos-y-de-ia-iso-42001, a-fondo-vesting-monitoreo-de-agentes
- primer fragmento: «Dos piezas están declaradas como exploración, no como construidas, y lo digo con esa palabra a propósito: - **Analítica end-to-end en Fabric**: un pipeline público con datos abiertos de Colombia, de ingesta a lago, model…»

**✅ ¿Tiene certificaciones de ciencia de datos de IBM?**

- top-4: a-fondo-certificaciones-las-de-ibm, a-fondo-como-aprendo-evidencia-certificaciones, certificaciones, a-fondo-certificaciones-como-se-conectan
- primer fragmento: «Cuatro certificaciones, en dos tandas y con los dos lenguajes de programación del análisis de datos: **En Python, durante 2022.** El Certificado Profesional en Ciencia de Datos (mayo a noviembre) con Pandas, NumPy, Matpl…»

**☑️ ¿Cuánto tardó en obtener la certificación de Fabric?**

- top-4: a-fondo-fabric-en-la-practica-que-significa-el-dp-600, a-fondo-certificaciones-el-dp-600, certificaciones, a-fondo-origenes-de-la-plataforma-a-la-ia
- primer fragmento: «La certificación **Fabric Analytics Engineer Associate** cubre preparación, transformación y optimización de datos con Power BI, Synapse, Data Factory y Lakehouse, más seguridad, gobernanza y soluciones escalables con ap…»

**☑️ ¿Cómo aprende una tecnología que no conoce?**

- top-4: a-fondo-plataforma-y-despliegue-por-que-es-mas-chica, a-fondo-como-aprendo-evidencia-construido, a-fondo-como-aprendo-como-aprendo-en-concreto, a-fondo-ceinfes-equipos-multidisciplinarios
- primer fragmento: «Por dos razones concretas. La primera es de equivalencia. Un lago sobre almacenamiento distribuido, un almacén analítico columnar, un orquestador de tuberías y una capa semántica existen en las tres nubes con nombres dis…»

**✅ ¿Qué hace cuando el puesto pide algo que no ha usado nunca?**

- top-4: a-fondo-como-aprendo-que-significa-para-quien-contrata, a-fondo-las-investigaciones-que-tiene-que-ver, a-fondo-inglopres-el-erp, a-fondo-bi-que-se-adopta-el-problema-dificil
- primer fragmento: «Que la brecha entre lo que sé hoy y lo que necesita el puesto es una variable de tiempo, y el tiempo está medido en las cuatro ocasiones anteriores. Si el puesto exige una nube, un framework o una herramienta que **nunca…»

**☑️ ¿Tiene posgrado, maestría o especialización?**

- top-4: a-fondo-agentes-en-produccion-fuentes-o-vacio, estudios, a-fondo-origenes-por-que-industrial, a-fondo-los-tableros-publicar-los-limites
- primer fragmento: «Los trece agentes de mi vitrina comparten una regla que es mi postura completa sobre IA generativa: **ninguna afirmación sale de la memoria del modelo.** El experto en la norma ISO 42001 cita el apartado y la página de s…»
- nota: La respuesta honesta son los dos pregrados de la Javeriana. Antes de la corrección de la fase 4 esta pregunta traía un párrafo que decía «esa posición exige posgrado», que era el texto de la oferta y no el suyo.

**☑️ ¿Se está certificando en algo en este momento?**

- top-4: a-fondo-apps-pipeline-en-exploracion, a-fondo-rag-y-el-chat-el-indice, a-fondo-como-aprendo-evidencia-certificaciones, a-fondo-lo-que-busco-como-trabajo-con-quien-contrata
- primer fragmento: «Dos piezas están declaradas como exploración, no como construidas, y lo digo con esa palabra a propósito: - **Analítica end-to-end en Fabric**: un pipeline público con datos abiertos de Colombia, de ingesta a lago, model…»

**✅ ¿Qué certificación piensa sacar después?**

- top-4: a-fondo-certificaciones-como-se-conectan, a-fondo-certificaciones-las-de-ibm, a-fondo-como-trabajo-primero-el-proceso, a-fondo-analitica-predictiva-las-herramientas
- primer fragmento: «Vistas juntas, las certificaciones dibujan el mismo arco que mi trayectoria. Las de IBM cubren el análisis y el modelo: qué se puede aprender de un conjunto de datos. El DP-600 cubre la plataforma: dónde viven esos datos…»

### ia-y-agentes

**✅ ¿Tiene experiencia con inteligencia artificial generativa?**

- top-4: a-fondo-agentes-en-produccion-dos-experiencias, a-fondo-gobierno-de-datos-y-de-ia-iso-42001, a-fondo-las-investigaciones-las-siete, a-fondo-como-aprendo-por-que-existe
- primer fragmento: «Cuando digo que tengo experiencia con **inteligencia artificial generativa** y con agentes de IA, me refiero a dos cosas que conviene separar. La primera es **profesional**: en Vesting, una startup de agentes de automati…»

**☑️ ¿Ha construido agentes de inteligencia artificial?**

- top-4: a-fondo-vesting-monitoreo-de-agentes, a-fondo-agentes-en-produccion-dos-experiencias, a-fondo-lo-que-busco-el-problema-que-quiero, a-fondo-bi-que-se-adopta-cuando-la-herramienta-estorba
- primer fragmento: «Implementé sistemas de captura, almacenamiento y análisis para el monitoreo en tiempo real de agentes de inteligencia artificial, optimizando su control. Esta es la parte del trabajo que menos gente ha hecho y la que más…»

**✅ ¿Qué es el proceso core replicable de agentes?**

- top-4: a-fondo-agentes-en-produccion-el-proceso-core, a-fondo-vesting-el-proceso-core, trayectoria-1, casestudy-vesting
- primer fragmento: «En Vesting definí, documenté y validé el proceso central para diseñar e implementar agentes de IA, creando un marco replicable para la entrega de los servicios. La idea de fondo es la misma que hace funcionar una planta:…»

**✅ ¿Cómo monitorea un agente de IA en producción?**

- top-4: a-fondo-agentes-en-produccion-monitorear-no-es-mirar-si-esta-arriba, a-fondo-vesting-monitoreo-de-agentes, a-fondo-agentes-en-produccion-dos-experiencias, a-fondo-agentes-en-produccion-fuentes-o-vacio
- primer fragmento: «En Vesting implementé sistemas de captura, almacenamiento y análisis para el monitoreo en tiempo real de los agentes en producción. Un agente no falla como falla un servicio. No se cae: responde distinto. Puede seguir co…»

**☑️ ¿Qué frameworks de agentes ha usado?**

- top-4: a-fondo-plataforma-y-despliegue-el-mundo-microsoft, a-fondo-como-aprendo-que-significa-para-quien-contrata, a-fondo-agentes-en-produccion-monitorear-no-es-mirar-si-esta-arriba, a-fondo-como-aprendo-evidencia-construido
- primer fragmento: «Mi experiencia profunda de plataforma es Microsoft, y es profunda de verdad: Microsoft Fabric, Azure Synapse, Data Factory, Lakehouse, Power BI y el modelado semántico, certificados por el DP-600 y aplicados durante año…»
- nota: Pasa, pero floja: el documento llega al top-4 sin nombrar un solo framework, porque el corpus no dice con qué están construidos los trece agentes. Es uno de los cinco huecos que la simulación M2 puso en primer lugar, y la respuesta solo la tiene el dueño.

**☑️ ¿Ha trabajado con modelos de lenguaje grandes?**

- top-4: a-fondo-gobierno-de-datos-y-de-ia-lo-transversal, a-fondo-analitica-predictiva-en-produccion, a-fondo-rag-y-el-chat-lo-que-estas-usando, a-fondo-analitica-predictiva-las-herramientas
- primer fragmento: «Gobernar sirve de poco si no se puede atravesar la organización, y atravesarla casi siempre significa trabajar con **personas que no me reportan**, cuya colaboración no se puede ordenar. Lo he hecho tres veces en sitios…»

**✅ ¿Qué arquitecturas RAG ha implementado?**

- top-4: a-fondo-rag-y-el-chat-lo-que-estas-usando, a-fondo-rag-y-el-chat-que-demuestra, casestudy-vesting, a-fondo-rag-y-el-chat-los-guardarrailes
- primer fragmento: «Si esta respuesta te llegó por el chat de esta página, estás usando lo que este documento describe. Es una arquitectura de generación aumentada por recuperación —RAG— sobre un **modelo de lenguaje grande**, construida po…»

**✅ ¿Cómo funciona el chat de esta página?**

- top-4: a-fondo-rag-y-el-chat-los-guardarrailes, a-fondo-rag-y-el-chat-lo-que-estas-usando, a-fondo-apps-pipeline-esta-misma-pagina, a-fondo-rag-y-el-chat-nunca-se-cae
- primer fragmento: «El chat solo responde sobre mi trayectoria, y eso se sostiene con tres capas. La primera es la de **fuera de alcance**: la pregunta se busca en el índice y, si nada supera el umbral de relevancia, se contesta con un text…»

**✅ ¿Usa embeddings o búsqueda vectorial?**

- top-4: a-fondo-rag-y-el-chat-recuperacion-lexica, a-fondo-apps-pipeline-esta-misma-pagina, casestudy-banco-pichincha, a-fondo-banco-pichincha-el-problema-real
- primer fragmento: «La búsqueda es léxica, con MiniSearch, y no usa vectores ni un proveedor de embeddings. Es una decisión deliberada y está escrita como tal: **código primero, IA generativa después.** Para un corpus de este tamaño, la bús…»

**☑️ ¿Con qué proveedor de modelos trabaja?**

- top-4: a-fondo-analitica-predictiva-en-produccion, a-fondo-analitica-predictiva-las-herramientas, a-fondo-analitica-predictiva-dos-modelos, a-fondo-rag-y-el-chat-nunca-se-cae
- primer fragmento: «Lo digo con cuidado porque es la palabra que más se usa a la ligera. Un modelo en producción no es un modelo que alcanzó buena precisión en un cuaderno: es uno del que alguien depende. Eso implica cosas que no son de mod…»

**✅ ¿Cómo evita que el modelo invente respuestas?**

- top-4: a-fondo-rag-y-el-chat-lo-que-estas-usando, a-fondo-rag-y-el-chat-los-guardarrailes, a-fondo-analitica-predictiva-dos-modelos, a-fondo-rag-y-el-chat-nunca-se-cae
- primer fragmento: «Si esta respuesta te llegó por el chat de esta página, estás usando lo que este documento describe. Es una arquitectura de generación aumentada por recuperación —RAG— sobre un **modelo de lenguaje grande**, construida po…»

**✅ ¿Ha llevado un modelo de machine learning a producción?**

- top-4: a-fondo-analitica-predictiva-en-produccion, a-fondo-analitica-predictiva-dos-modelos, a-fondo-banco-pichincha-modelos-en-produccion, a-fondo-analitica-predictiva-la-estadistica
- primer fragmento: «Lo digo con cuidado porque es la palabra que más se usa a la ligera. Un modelo en producción no es un modelo que alcanzó buena precisión en un cuaderno: es uno del que alguien depende. Eso implica cosas que no son de mod…»

**✅ ¿Qué postura tiene sobre el uso responsable de la inteligencia artificial?**

- top-4: a-fondo-gobierno-de-datos-y-de-ia-iso-42001, a-fondo-bi-que-se-adopta-adopcion-medida, a-fondo-como-aprendo-por-que-existe, a-fondo-las-investigaciones-que-tiene-que-ver
- primer fragmento: «La norma ISO 42001 es el estándar de sistemas de gestión de inteligencia artificial: el marco con el que una organización demuestra que gobierna su IA. Construí un agente experto en esa norma y está publicado en mi vitri…»

**☑️ ¿Ha trabajado con procesamiento de lenguaje natural?**

- top-4: a-fondo-origenes-de-la-plataforma-a-la-ia, a-fondo-fundacion-ctic-el-rol-actual, a-fondo-rag-y-el-chat-lo-que-estas-usando, perfil
- primer fragmento: «En agosto de 2023 entré a Vesting, una startup de agentes de automatización, como Líder de Estrategia de Datos. Construí desde cero el ecosistema de datos en Microsoft Fabric para la analítica de sus agentes de IA, y el…»

**☑️ ¿Qué tan grande es su experiencia con IA comparada con la de datos?**

- top-4: a-fondo-gobierno-de-datos-y-de-ia-que-es-gobernar, a-fondo-origenes-de-la-plataforma-a-la-ia, a-fondo-agentes-en-produccion-dos-experiencias, a-fondo-gobierno-de-datos-y-de-ia-lo-transversal
- primer fragmento: «Quitando la palabra grande, gobernar un dato es responder cuatro preguntas y poder demostrar las respuestas: qué significa, de dónde vino, quién puede verlo y qué pasa cuando cambia. La cuarta es la que más se olvida y l…»

**✅ ¿Ha construido prompts o sistemas con instrucciones para un modelo?**

- top-4: a-fondo-agentes-en-produccion-sistemas-de-trabajo, a-fondo-apps-pipeline-que-hay-construido, a-fondo-las-investigaciones-las-siete, a-fondo-lo-que-busco-los-dos-tipos-de-rol
- primer fragmento: «La otra cosa que comparten es que ninguno es un chat. Son sistemas con controles que se pueden poner en rojo. El constructor de tableros de Power BI escribe el reporte en el formato nativo de la herramienta con una habil…»

### plataforma-y-datos

**☑️ ¿Qué experiencia tiene con Microsoft Fabric?**

- top-4: a-fondo-plataforma-y-despliegue-el-mundo-microsoft, a-fondo-vesting-la-arquitectura, a-fondo-fabric-en-la-practica-gobierno-tecnico, a-fondo-fabric-en-la-practica-que-significa-el-dp-600
- primer fragmento: «Mi experiencia profunda de plataforma es Microsoft, y es profunda de verdad: Microsoft Fabric, Azure Synapse, Data Factory, Lakehouse, Power BI y el modelado semántico, certificados por el DP-600 y aplicados durante año…»

**☑️ ¿Ha diseñado una arquitectura de datos desde cero?**

- top-4: casestudy-vesting, trayectoria-1, a-fondo-vesting-la-arquitectura, a-fondo-plataforma-y-despliegue-lo-que-traigo
- primer fragmento: «Vesting, una startup de agentes de automatización, crecía sin infraestructura de datos: la analítica de sus agentes de IA no tenía dónde vivir y cada integración de datos de clientes era artesanal. Construir desde cero e…»

**☑️ ¿Qué es un lakehouse y lo ha usado?**

- top-4: a-fondo-plataforma-y-despliegue-el-mundo-microsoft, a-fondo-plataforma-y-despliegue-por-que-es-mas-chica, a-fondo-rag-y-el-chat-lo-que-estas-usando, a-fondo-fabric-en-la-practica-lago-y-almacen
- primer fragmento: «Mi experiencia profunda de plataforma es Microsoft, y es profunda de verdad: Microsoft Fabric, Azure Synapse, Data Factory, Lakehouse, Power BI y el modelado semántico, certificados por el DP-600 y aplicados durante año…»

**✅ ¿Sabe modelado semántico?**

- top-4: a-fondo-fabric-en-la-practica-modelado-semantico, a-fondo-procesos-y-simulacion-modelar-antes, a-fondo-fabric-en-la-practica-gobierno-tecnico, a-fondo-procesos-y-simulacion-por-que-me-hace-mejor
- primer fragmento: «Es la capa que menos se ve y la que más decide. Un modelo semántico bien hecho es el que permite que «ingreso» signifique lo mismo en los siete tableros del área; uno mal hecho es la razón por la que dos personas llegan…»

**✅ ¿Qué nivel tiene con Power BI?**

- top-4: a-fondo-fabric-en-la-practica-power-bi, skills, a-fondo-agentes-en-produccion-sistemas-de-trabajo, a-fondo-certificaciones-el-dp-600
- primer fragmento: «Power BI aparece en toda mi trayectoria desde el énfasis de la carrera: los tableros de la operación de Bogotá, el control de la implementación en Cafam, la adopción por más de cincuenta usuarios en Pichincha, los tabler…»

**✅ ¿Sabe DAX?**

- top-4: a-fondo-banco-pichincha-etl-y-modelos-semanticos, trayectoria-2, skills, a-fondo-fabric-en-la-practica-modelado-semantico
- primer fragmento: «Implementé soluciones avanzadas de extracción, transformación y carga —procesos **ETL**— que redujeron los tiempos en un treinta y cinco por ciento, y centralicé y optimicé el análisis de datos con DAX Studio y Tabular E…»

**✅ ¿Ha construido procesos ETL?**

- top-4: a-fondo-banco-pichincha-etl-y-modelos-semanticos, a-fondo-como-aprendo-evidencia-construido, a-fondo-procesos-y-simulacion-modelar-antes, a-fondo-procesos-y-simulacion-por-que-me-hace-mejor
- primer fragmento: «Implementé soluciones avanzadas de extracción, transformación y carga —procesos **ETL**— que redujeron los tiempos en un treinta y cinco por ciento, y centralicé y optimicé el análisis de datos con DAX Studio y Tabular E…»

**✅ ¿Qué tan fuerte es en SQL?**

- top-4: a-fondo-cafam-calidad-en-sql, a-fondo-certificaciones-las-de-ibm, a-fondo-agentes-en-produccion-monitorear-no-es-mirar-si-esta-arriba, casestudy-cafam
- primer fragmento: «Supervisé la calidad de los datos con SQL en múltiples sistemas, con un aumento del veinte por ciento en precisión y fiabilidad del sistema de gestión de almacenes. «Múltiples sistemas» es la parte importante: el problem…»

**✅ ¿Tiene experiencia con Azure?**

- top-4: a-fondo-plataforma-y-despliegue-el-mundo-microsoft, a-fondo-apps-pipeline-en-exploracion, a-fondo-agentes-en-produccion-dos-experiencias, skills
- primer fragmento: «Mi experiencia profunda de plataforma es Microsoft, y es profunda de verdad: Microsoft Fabric, Azure Synapse, Data Factory, Lakehouse, Power BI y el modelado semántico, certificados por el DP-600 y aplicados durante año…»

**☑️ ¿Conoce Google Cloud, Vertex AI o BigQuery?**

- top-4: app-agente-gemini-vertex, a-fondo-plataforma-y-despliegue-lo-que-no-he-hecho, a-fondo-plataforma-y-despliegue-como-la-cubro, a-fondo-apps-pipeline-en-exploracion
- primer fragmento: «Agente autónomo con Gemini + Vertex AI (en-exploracion): Agente con herramientas (LangChain) sobre el stack de GCP: el complemento multi-cloud de mi certificación Azure.»

**✅ ¿Tiene experiencia con Docker y Kubernetes?**

- top-4: a-fondo-plataforma-y-despliegue-lo-que-no-he-hecho, a-fondo-agentes-en-produccion-dos-experiencias, a-fondo-plataforma-y-despliegue-el-mundo-microsoft, a-fondo-agentes-en-produccion-que-me-llevo
- primer fragmento: «**Google Cloud** —Vertex AI, BigQuery, despliegue productivo en ese ecosistema— y **contenedores en producción** con Docker y Kubernetes no están en mi experiencia profesional. Mi mundo es Microsoft y en Microsoft es don…»

**✅ ¿Sabe de MLOps?**

- top-4: a-fondo-plataforma-y-despliegue-lo-que-no-he-hecho, a-fondo-como-aprendo-por-que-existe, a-fondo-los-tableros-publicar-los-limites, a-fondo-ceinfes-gestion-por-procesos
- primer fragmento: «**Google Cloud** —Vertex AI, BigQuery, despliegue productivo en ese ecosistema— y **contenedores en producción** con Docker y Kubernetes no están en mi experiencia profesional. Mi mundo es Microsoft y en Microsoft es don…»

**☑️ ¿Ha trabajado con big data o procesamiento distribuido?**

- top-4: trayectoria-1, a-fondo-fabric-en-la-practica-lago-y-almacen, proyecto-vesting, a-fondo-vesting-la-arquitectura
- primer fragmento: «2023 — 2025: Líder de Estrategia de Datos, Vesting — startup de agentes de automatización. Ecosistema de datos para agentes de IA en Microsoft Fabric, desde cero: arquitectura, gobernanza, monitoreo de agentes en tiempo…»

**☑️ ¿Ha construido pipelines de datos que corran solos?**

- top-4: a-fondo-apps-pipeline-que-hay-construido, a-fondo-vesting-la-arquitectura, a-fondo-como-aprendo-evidencia-construido, a-fondo-procesos-y-simulacion-por-que-me-hace-mejor
- primer fragmento: «El pipeline produce cuatro tipos de pieza, y todas están publicadas en la vitrina de este sitio: - **Seis aplicaciones completas**, con interfaz, cada una con su promesa, sus funcionalidades y sus cifras: Velo, Dash Agen…»

**☑️ ¿Qué hace para asegurar la calidad de los datos?**

- top-4: casestudy-cafam, a-fondo-cafam-calidad-en-sql, a-fondo-procesos-y-simulacion-por-que-me-hace-mejor, a-fondo-origenes-el-primer-trabajo
- primer fragmento: «Cafam implementaba un WMS en su operación logística: un cambio de sistema crítico donde cada error de datos se paga en la bodega. Asegurar la calidad de la implementación coordinando al equipo de pruebas más grande que h…»

**✅ ¿Sabe de integración continua y despliegue automático?**

- top-4: a-fondo-plataforma-y-despliegue-lo-que-despliego, a-fondo-plataforma-y-despliegue-lo-que-no-he-hecho, a-fondo-apps-pipeline-que-demuestra-cada-familia, a-fondo-gobierno-de-datos-y-de-ia-la-continuacion
- primer fragmento: «Aparte de la plataforma de datos, mantengo seis aplicaciones publicadas y en funcionamiento. Eso significa integración continua con controles de calidad que bloquean la publicación, pruebas unitarias, de integración y de…»

**✅ ¿Qué diferencia hay entre un data lake y un data warehouse para él?**

- top-4: a-fondo-fabric-en-la-practica-lago-y-almacen, a-fondo-certificaciones-el-dp-600, a-fondo-fabric-en-la-practica-que-significa-el-dp-600, a-fondo-plataforma-y-despliegue-el-mundo-microsoft
- primer fragmento: «En Vesting diseñé el ecosistema integrando Big Data, Data Warehouse y procesamiento distribuido: un lago de datos —un **lakehouse**— y un almacén analítico conviviendo bajo el mismo gobierno. No es redundancia: son dos c…»

### bi-y-analitica

**✅ ¿Cómo logra que la gente use los tableros que construye?**

- top-4: a-fondo-banco-pichincha-el-problema-real, a-fondo-apps-pipeline-como-se-construyen, a-fondo-los-tableros-publicar-los-limites, a-fondo-bi-que-se-adopta-adopcion-medida
- primer fragmento: «Entré a Banco Pichincha en marzo de 2023 como Analista Senior de Analítica y Reportes, y estuve hasta julio de 2023. Es mi paso por el **sector financiero**, y en banca eso cambia el peso de todo lo que sigue. El área pr…»

**✅ ¿Tiene experiencia en inteligencia de negocios?**

- top-4: a-fondo-bi-que-se-adopta-adopcion-medida, a-fondo-bi-que-se-adopta-que-hago-distinto, a-fondo-bi-que-se-adopta-procedencia, a-fondo-bi-que-se-adopta-cuando-la-herramienta-estorba
- primer fragmento: «Por eso el número que persigo es cuánta gente lo usa, y lo tengo medido en cuatro sitios distintos: - **Banco Pichincha (2023):** dashboards adoptados por más de cincuenta usuarios, con un veinticinco por ciento de mejor…»

**✅ ¿Cuántos usuarios han adoptado los tableros que ha hecho?**

- top-4: a-fondo-bi-que-se-adopta-adopcion-medida, casestudy-banco-pichincha, a-fondo-como-trabajo-la-adopcion-es-el-indicador, a-fondo-transmilenio-cm-la-adopcion
- primer fragmento: «Por eso el número que persigo es cuánta gente lo usa, y lo tengo medido en cuatro sitios distintos: - **Banco Pichincha (2023):** dashboards adoptados por más de cincuenta usuarios, con un veinticinco por ciento de mejor…»

**✅ ¿Ha desarrollado modelos predictivos?**

- top-4: a-fondo-banco-pichincha-modelos-en-produccion, a-fondo-analitica-predictiva-dos-modelos, a-fondo-analitica-predictiva-en-produccion, a-fondo-analitica-predictiva-donde-lo-aplico-hoy
- primer fragmento: «Desarrollé modelos de aprendizaje automático con scikit-learn, con una precisión superior al noventa por ciento y una mejora del treinta y cinco por ciento en las predicciones. «En producción» es la parte que importa. La…»

**✅ ¿Qué herramientas usa para machine learning?**

- top-4: a-fondo-analitica-predictiva-las-herramientas, casestudy-banco-pichincha, a-fondo-banco-pichincha-la-adopcion-medida, a-fondo-como-trabajo-primero-el-proceso
- primer fragmento: «**Python con scikit-learn** es mi herramienta principal para modelado, y es la que usé en los dos casos de producción. **Pandas y NumPy** para la manipulación, **Matplotlib y Seaborn** para la exploración, **Jupyter** pa…»

**✅ ¿Qué tan avanzado es en Python?**

- top-4: a-fondo-certificaciones-las-de-ibm, estudios, a-fondo-certificaciones-el-dp-600, a-fondo-analitica-predictiva-las-herramientas
- primer fragmento: «Cuatro certificaciones, en dos tandas y con los dos lenguajes de programación del análisis de datos: **En Python, durante 2022.** El Certificado Profesional en Ciencia de Datos (mayo a noviembre) con Pandas, NumPy, Matpl…»

**✅ ¿En qué lenguajes de programación trabaja?**

- top-4: a-fondo-certificaciones-las-de-ibm, a-fondo-origenes-del-proceso-al-indicador, a-fondo-transmilenio-cm-la-adopcion, a-fondo-ceinfes-los-indicadores
- primer fragmento: «Cuatro certificaciones, en dos tandas y con los dos lenguajes de programación del análisis de datos: **En Python, durante 2022.** El Certificado Profesional en Ciencia de Datos (mayo a noviembre) con Pandas, NumPy, Matpl…»

**☑️ ¿Tiene experiencia con R además de Python?**

- top-4: a-fondo-lo-que-busco-los-dos-tipos-de-rol, a-fondo-agentes-en-produccion-dos-experiencias, a-fondo-certificaciones-las-de-ibm, a-fondo-analitica-predictiva-las-herramientas
- primer fragmento: «**Ingeniería de IA.** Construir: arquitecturas de recuperación aumentada, agentes con herramientas, modelos en producción, la plataforma que los sostiene y la observabilidad que permite confiar en ellos. Aquí traigo diez…»
- nota: Medido: «¿Programa en R?» NO funciona, y no es un hueco de contenido. La recuperación es léxica y descarta los términos de menos de tres letras para no llenar de ruido cada consulta; con «R» indexada, la expansión por prefijo trae «reglas», «resultado», «recuperación»… y el fragmento que sí habla de R pierde. Se probó y se revirtió. Una pregunta cuya única palabra con contenido es una letra suelta es invisible para este chat, y está declarado como límite conocido de ADR-010.

**☑️ ¿Qué base estadística tiene?**

- top-4: a-fondo-certificaciones-las-de-ibm, a-fondo-analitica-predictiva-la-estadistica, a-fondo-analitica-predictiva-las-herramientas, a-fondo-cm-operaciones-la-automatizacion
- primer fragmento: «Cuatro certificaciones, en dos tandas y con los dos lenguajes de programación del análisis de datos: **En Python, durante 2022.** El Certificado Profesional en Ciencia de Datos (mayo a noviembre) con Pandas, NumPy, Matpl…»

**✅ ¿Ha hecho predicción de demanda?**

- top-4: a-fondo-transmilenio-cm-prediccion-de-demanda, a-fondo-plataforma-y-despliegue-lo-que-no-he-hecho, a-fondo-analitica-predictiva-dos-modelos, trayectoria-3
- primer fragmento: «Desarrollé un modelo de predicción de la demanda con scikit-learn para optimizar decisiones estratégicas, con un aumento del veinte por ciento en el rendimiento del sistema. Es mi primer modelo de aprendizaje automático…»

**✅ ¿Usa scikit-learn, pandas y numpy?**

- top-4: a-fondo-analitica-predictiva-las-herramientas, a-fondo-certificaciones-las-de-ibm, a-fondo-como-aprendo-evidencia-construido, proyecto-banco-pichincha
- primer fragmento: «**Python con scikit-learn** es mi herramienta principal para modelado, y es la que usé en los dos casos de producción. **Pandas y NumPy** para la manipulación, **Matplotlib y Seaborn** para la exploración, **Jupyter** pa…»

**✅ ¿Qué precisión alcanzaron los modelos que puso en producción?**

- top-4: a-fondo-analitica-predictiva-dos-modelos, a-fondo-analitica-predictiva-en-produccion, a-fondo-banco-pichincha-modelos-en-produccion, a-fondo-analitica-predictiva-la-estadistica
- primer fragmento: «**Predicción de demanda en transporte masivo (C&M Consultores, 2021–2022).** Desarrollé un modelo de predicción de la demanda con scikit-learn para optimizar decisiones estratégicas, con un aumento del veinte por ciento…»

**☑️ ¿Ha automatizado reportes o tareas repetitivas?**

- top-4: casestudy-transmilenio-cm, a-fondo-transmilenio-cm-la-automatizacion, trayectoria-3, a-fondo-bi-que-se-adopta-cuando-la-herramienta-estorba
- primer fragmento: «El análisis post-operacional del sistema TransMilenio dependía de fuentes heterogéneas y reportes manuales: la operación de la ciudad generaba datos más rápido de lo que podían analizarse. Unificar las fuentes, acelerar…»

### gobierno

**✅ ¿Tiene experiencia en gobierno de datos?**

- top-4: a-fondo-gobierno-de-datos-y-de-ia-tres-veces, a-fondo-origenes-de-la-plataforma-a-la-ia, a-fondo-gobierno-de-datos-y-de-ia-que-es-gobernar, a-fondo-gobierno-de-datos-y-de-ia-la-continuacion
- primer fragmento: «He montado gobierno de datos tres veces, en tres contextos que no se parecen: **Banco Pichincha (2023).** Co-lideré el desarrollo de un sistema de gobernanza que mejoró la seguridad, la calidad y la confiabilidad en la g…»

**✅ ¿Conoce la norma ISO 42001?**

- top-4: a-fondo-gobierno-de-datos-y-de-ia-iso-42001, a-fondo-procesos-y-simulacion-iso-9001, a-fondo-inglopres-cadena-e-iso, a-fondo-lo-que-busco-los-dos-tipos-de-rol
- primer fragmento: «La norma ISO 42001 es el estándar de sistemas de gestión de inteligencia artificial: el marco con el que una organización demuestra que gobierna su IA. Construí un agente experto en esa norma y está publicado en mi vitri…»

**✅ ¿Qué entiende por gobierno de inteligencia artificial?**

- top-4: a-fondo-gobierno-de-datos-y-de-ia-iso-42001, a-fondo-las-investigaciones-las-siete, a-fondo-lo-que-busco-el-problema-que-quiero, a-fondo-bi-que-se-adopta-procedencia
- primer fragmento: «La norma ISO 42001 es el estándar de sistemas de gestión de inteligencia artificial: el marco con el que una organización demuestra que gobierna su IA. Construí un agente experto en esa norma y está publicado en mi vitri…»

**✅ ¿Ha definido políticas, estándares o lineamientos de datos?**

- top-4: a-fondo-fundacion-ctic-gobierno-institucional, a-fondo-gobierno-de-datos-y-de-ia-tres-veces, a-fondo-origenes-el-primer-trabajo, a-fondo-cm-operaciones-adherencia-a-protocolos
- primer fragmento: «He gestionado procesos de limpieza, integración y estandarización de datos, garantizando su confiabilidad y su alineación con las políticas institucionales. Es la tercera vez que hago gobierno de datos —tras Banco Pichin…»

**✅ ¿Cómo maneja datos personales o sensibles?**

- top-4: a-fondo-fundacion-ctic-el-rol-actual, a-fondo-gobierno-de-datos-y-de-ia-lo-transversal, a-fondo-gobierno-de-datos-y-de-ia-que-es-gobernar, a-fondo-cm-operaciones-la-operacion-de-una-ciudad
- primer fragmento: «**Actualmente trabajo en la Fundación CTIC**, desde febrero de 2025, como Profesional de Analítica. Es mi rol actual y el contexto más exigente en el que he trabajado en cuanto a gobierno del dato, por una razón evidente…»

**✅ ¿Ha liderado iniciativas transversales en organizaciones grandes?**

- top-4: a-fondo-gobierno-de-datos-y-de-ia-lo-transversal, casestudy-cafam, a-fondo-como-trabajo-como-lidero, logros
- primer fragmento: «Gobernar sirve de poco si no se puede atravesar la organización, y atravesarla casi siempre significa trabajar con **personas que no me reportan**, cuya colaboración no se puede ordenar. Lo he hecho tres veces en sitios…»

**✅ ¿Conoce normas ISO y trabajo bajo estándares?**

- top-4: a-fondo-gobierno-de-datos-y-de-ia-iso-42001, a-fondo-origenes-el-primer-trabajo, a-fondo-lo-que-busco-los-dos-tipos-de-rol, a-fondo-inglopres-cadena-e-iso
- primer fragmento: «La norma ISO 42001 es el estándar de sistemas de gestión de inteligencia artificial: el marco con el que una organización demuestra que gobierna su IA. Construí un agente experto en esa norma y está publicado en mi vitri…»

**☑️ ¿Cómo asegura la trazabilidad de la información?**

- top-4: trayectoria-4, a-fondo-vesting-la-gobernanza, a-fondo-gobierno-de-datos-y-de-ia-tres-veces, a-fondo-las-investigaciones-trazabilidad
- primer fragmento: «2020 — 2021: Analista de Sistemas de Información, Cafam. Lideré 20 personas en la implementación del WMS: −25% de errores y +15% de eficiencia operativa. Lideré un equipo de 20 personas en las pruebas de implementación d…»

**✅ ¿Quién decide quién puede ver qué datos en sus plataformas?**

- top-4: a-fondo-vesting-la-gobernanza, a-fondo-gobierno-de-datos-y-de-ia-tres-veces, a-fondo-fabric-en-la-practica-gobierno-tecnico, a-fondo-gobierno-de-datos-y-de-ia-que-es-gobernar
- primer fragmento: «Implementé un modelo de gobernanza y estandarización de datos para garantizar integridad y confiabilidad en la integración de información de clientes y sistemas. Con datos de varios clientes en la misma plataforma, la es…»

### procesos

**✅ ¿Sabe modelar procesos en BPMN?**

- top-4: a-fondo-procesos-y-simulacion-modelar-antes, a-fondo-ceinfes-gestion-por-procesos, a-fondo-procesos-y-simulacion-por-que-me-hace-mejor, a-fondo-como-trabajo-primero-el-proceso
- primer fragmento: «Mi hoja de vida declara **Bizagi** para modelado de procesos y **FlexSim** para simulación. Son herramientas de ingeniería industrial y explican de dónde salen dos costumbres mías. La primera: antes de construir nada, di…»

**✅ ¿Ha hecho simulación de procesos o de operaciones?**

- top-4: a-fondo-procesos-y-simulacion-modelar-antes, a-fondo-procesos-y-simulacion-por-que-me-hace-mejor, trayectoria-6, a-fondo-procesos-y-simulacion-la-simulacion
- primer fragmento: «Mi hoja de vida declara **Bizagi** para modelado de procesos y **FlexSim** para simulación. Son herramientas de ingeniería industrial y explican de dónde salen dos costumbres mías. La primera: antes de construir nada, di…»

**✅ ¿Ha usado Bizagi o FlexSim?**

- top-4: a-fondo-procesos-y-simulacion-modelar-antes, a-fondo-rag-y-el-chat-lo-que-estas-usando, a-fondo-plataforma-y-despliegue-el-mundo-microsoft, a-fondo-como-aprendo-que-significa-para-quien-contrata
- primer fragmento: «Mi hoja de vida declara **Bizagi** para modelado de procesos y **FlexSim** para simulación. Son herramientas de ingeniería industrial y explican de dónde salen dos costumbres mías. La primera: antes de construir nada, di…»

**☑️ ¿Tiene experiencia en mejora continua y optimización de procesos?**

- top-4: trayectoria-0, casestudy-fundacion-ctic, a-fondo-transmilenio-cm-las-mesas-del-sitp, a-fondo-procesos-y-simulacion-por-que-me-hace-mejor
- primer fragmento: «2025 — hoy: Profesional de Analítica, Fundación CTIC. Analítica y gobierno de datos para decisiones administrativas y asistenciales en salud. Modelos de análisis y visualización para líderes administrativos y asistencial…»

**✅ ¿Ha trabajado con metodologías ágiles?**

- top-4: a-fondo-ceinfes-gestion-por-procesos, trayectoria-6, a-fondo-fundacion-ctic-el-rol-actual, a-fondo-origenes-de-la-plataforma-a-la-ia
- primer fragmento: «Lideré la transición a un modelo de Gestión de Procesos basado en Sistemas de Información, y dirigí proyectos tecnológicos estratégicos con metodologías ágiles, apoyándome en Kanban para el trabajo con el área de tecnolo…»

**✅ ¿Para qué le sirve la ingeniería industrial en un puesto de datos?**

- top-4: a-fondo-origenes-por-que-industrial, a-fondo-origenes-de-la-plataforma-a-la-ia, a-fondo-origenes-el-primer-trabajo, a-fondo-origenes-del-indicador-a-la-plataforma
- primer fragmento: «Estudié Ingeniería Industrial en la Pontificia Universidad Javeriana, con énfasis en Inteligencia Analítica de Datos, entre 2009 y 2016. El énfasis no es un detalle de la ficha: es donde aparecen por primera vez el model…»

### vitrina

**✅ ¿Qué ha construido por su cuenta, fuera del trabajo?**

- top-4: a-fondo-apps-pipeline-que-hay-construido, a-fondo-rag-y-el-chat-los-guardarrailes, a-fondo-transmilenio-cm-las-mesas-del-sitp, a-fondo-como-aprendo-evidencia-construido
- primer fragmento: «El pipeline produce cuatro tipos de pieza, y todas están publicadas en la vitrina de este sitio: - **Seis aplicaciones completas**, con interfaz, cada una con su promesa, sus funcionalidades y sus cifras: Velo, Dash Agen…»

**☑️ ¿Cuántas aplicaciones ha publicado?**

- top-4: a-fondo-los-tableros-publicar-los-limites, a-fondo-plataforma-y-despliegue-lo-que-despliego, a-fondo-apps-pipeline-que-hay-construido, a-fondo-como-aprendo-evidencia-construido
- primer fragmento: «Cada tablero publica lo que **no** puede decir. El de energía y clima pone sus propios límites a la vista; el de empresas mide en una página cuánta parte del universo cubre de verdad. Un tablero que solo muestra lo que s…»

**✅ ¿Tiene código público o repositorios que se puedan revisar?**

- top-4: a-fondo-apps-pipeline-esta-misma-pagina, a-fondo-apps-pipeline-por-que-en-publico, a-fondo-apps-pipeline-como-se-construyen, a-fondo-fabric-en-la-practica-lo-publico
- primer fragmento: «CV Viva —lo que estás leyendo— es una de las seis aplicaciones, y su repositorio es público. Es una hoja de vida que se construye a sí misma, en público: contenido en archivos versionados, generación estática, y un chat…»

**✅ ¿Qué tableros ha publicado con datos abiertos?**

- top-4: a-fondo-los-tableros-los-seis, a-fondo-los-tableros-que-son, a-fondo-los-tableros-publicar-los-limites, a-fondo-los-tableros-las-identidades
- primer fragmento: «**Banca colombiana bajo la lupa.** Once años de estados financieros de las ochenta y una entidades de crédito del país, con las identidades contables del origen corridas enteras. **Las empresas de Colombia en cifras.** O…»

**✅ ¿Ha trabajado con datos abiertos o fuentes públicas?**

- top-4: a-fondo-los-tableros-que-demuestran, a-fondo-los-tableros-los-seis, a-fondo-apps-pipeline-que-demuestra-cada-familia, a-fondo-los-tableros-que-son
- primer fragmento: «Ingeniería de datos de extremo a extremo sobre datos que cualquiera puede descargar y contrastar: ingesta de fuentes heterogéneas, modelado dimensional, verificación contra el origen, medición de cobertura y visualizació…»

**✅ ¿Sabe leer estados financieros o datos contables?**

- top-4: a-fondo-los-tableros-los-seis, a-fondo-los-tableros-las-identidades, a-fondo-procesos-y-simulacion-modelar-antes, a-fondo-los-tableros-que-son
- primer fragmento: «**Banca colombiana bajo la lupa.** Once años de estados financieros de las ochenta y una entidades de crédito del país, con las identidades contables del origen corridas enteras. **Las empresas de Colombia en cifras.** O…»

**✅ ¿Qué investigaciones ha hecho?**

- top-4: a-fondo-las-investigaciones-que-son, a-fondo-las-investigaciones-las-siete, a-fondo-plataforma-y-despliegue-lo-que-no-he-hecho, a-fondo-las-investigaciones-congelar-el-criterio
- primer fragmento: «Siete investigaciones publicadas en la vitrina de este sitio, cada una con su ficha técnica. No son ensayos de opinión: cada una parte de una revisión de literatura medida y declara con números qué es lo que nadie ha hec…»

**✅ ¿Ha escrito artículos o papers?**

- top-4: a-fondo-las-investigaciones-trazabilidad, a-fondo-procesos-y-simulacion-iso-9001, a-fondo-agentes-en-produccion-sistemas-de-trabajo, a-fondo-plataforma-y-despliegue-lo-que-traigo
- primer fragmento: «El otro harness, el de papers computacionales, tiene una regla igual de dura: **ningún número llega al documento sin existir antes como fila de su registro**. Nada de cifras escritas a mano en el texto; todas se leen de…»

**✅ ¿Qué agentes tiene publicados en su portafolio?**

- top-4: a-fondo-agentes-en-produccion-monitorear-no-es-mirar-si-esta-arriba, a-fondo-agentes-en-produccion-dos-experiencias, a-fondo-apps-pipeline-como-se-construyen, a-fondo-lo-que-busco-que-ofrezco
- primer fragmento: «En Vesting implementé sistemas de captura, almacenamiento y análisis para el monitoreo en tiempo real de los agentes en producción. Un agente no falla como falla un servicio. No se cae: responde distinto. Puede seguir co…»

**✅ ¿Cómo verifica las cifras que publica?**

- top-4: a-fondo-los-tableros-los-seis, a-fondo-apps-pipeline-que-hay-construido, a-fondo-los-tableros-que-son, a-fondo-los-tableros-publicar-los-limites
- primer fragmento: «**Banca colombiana bajo la lupa.** Once años de estados financieros de las ochenta y una entidades de crédito del país, con las identidades contables del origen corridas enteras. **Las empresas de Colombia en cifras.** O…»

**✅ ¿Con qué está hecha esta página web?**

- top-4: a-fondo-apps-pipeline-esta-misma-pagina, a-fondo-gobierno-de-datos-y-de-ia-iso-42001, a-fondo-rag-y-el-chat-lo-que-estas-usando, a-fondo-como-aprendo-la-guia-del-ai-103
- primer fragmento: «CV Viva —lo que estás leyendo— es una de las seis aplicaciones, y su repositorio es público. Es una hoja de vida que se construye a sí misma, en público: contenido en archivos versionados, generación estática, y un chat…»

**✅ ¿Sus aplicaciones tienen pruebas automatizadas?**

- top-4: a-fondo-plataforma-y-despliegue-lo-que-despliego, a-fondo-como-aprendo-evidencia-construido, a-fondo-apps-pipeline-que-demuestra-cada-familia, casestudy-cafam
- primer fragmento: «Aparte de la plataforma de datos, mantengo seis aplicaciones publicadas y en funcionamiento. Eso significa integración continua con controles de calidad que bloquean la publicación, pruebas unitarias, de integración y de…»

### encaje

**✅ ¿Qué tipo de rol está buscando?**

- top-4: a-fondo-lo-que-busco-los-dos-tipos-de-rol, a-fondo-rag-y-el-chat-lo-que-estas-usando, a-fondo-fundacion-ctic-el-rol-actual, a-fondo-cm-operaciones-lo-que-preparo
- primer fragmento: «**Ingeniería de IA.** Construir: arquitecturas de recuperación aumentada, agentes con herramientas, modelos en producción, la plataforma que los sostiene y la observabilidad que permite confiar en ellos. Aquí traigo diez…»

**✅ ¿Está dispuesto a reubicarse a otro país?**

- top-4: a-fondo-lo-que-busco-condiciones, a-fondo-apps-pipeline-en-exploracion, a-fondo-agentes-en-produccion-monitorear-no-es-mirar-si-esta-arriba, a-fondo-como-trabajo-que-valoro
- primer fragmento: «**Vivo en Bogotá, Colombia**, y estoy abierto a reubicarme a otro país y a trabajar en remoto. La reubicación internacional no es una concesión que hago por una vacante: está declarada en la cabecera de este sitio desde…»

**☑️ ¿Trabaja en remoto?**

- top-4: contacto, a-fondo-lo-que-busco-condiciones, a-fondo-como-trabajo-como-hablo-con-el-negocio, a-fondo-lo-que-busco-como-trabajo-con-quien-contrata
- primer fragmento: «Bogotá, Colombia · Abierto a reubicación internacional y trabajo remoto. Email: mauricio.hmrc@gmail.com. LinkedIn: https://www.linkedin.com/in/henry-mauricio-rincon · GitHub: https://github.com/mauriciorincon-ai»

**☑️ ¿En qué ciudad vive?**

- top-4: casestudy-transmilenio-cm, proyecto-transmilenio-cm, a-fondo-cm-operaciones-la-operacion-de-una-ciudad, a-fondo-lo-que-busco-condiciones
- primer fragmento: «El análisis post-operacional del sistema TransMilenio dependía de fuentes heterogéneas y reportes manuales: la operación de la ciudad generaba datos más rápido de lo que podían analizarse. Unificar las fuentes, acelerar…»

**✅ ¿Ha vivido o estudiado fuera del país?**

- top-4: a-fondo-lo-que-busco-condiciones, a-fondo-las-investigaciones-se-mide-el-vacio, a-fondo-los-tableros-los-seis, a-fondo-las-investigaciones-que-tiene-que-ver
- primer fragmento: «**Vivo en Bogotá, Colombia**, y estoy abierto a reubicarme a otro país y a trabajar en remoto. La reubicación internacional no es una concesión que hago por una vacante: está declarada en la cabecera de este sitio desde…»

**✅ ¿Cómo lo contacto?**

- top-4: contacto, a-fondo-cm-operaciones-lo-que-preparo, a-fondo-cafam-el-contexto, a-fondo-cm-operaciones-tableros-e-informes
- primer fragmento: «Bogotá, Colombia · Abierto a reubicación internacional y trabajo remoto. Email: mauricio.hmrc@gmail.com. LinkedIn: https://www.linkedin.com/in/henry-mauricio-rincon · GitHub: https://github.com/mauriciorincon-ai»

**☑️ ¿Por qué debería contratarlo a él y no a otro?**

- top-4: a-fondo-procesos-y-simulacion-por-que-me-hace-mejor, a-fondo-lo-que-busco-que-ofrezco, a-fondo-bi-que-se-adopta-el-problema-dificil, a-fondo-como-trabajo-que-valoro
- primer fragmento: «Tres razones concretas. **Sé qué medir.** Un indicador sale de entender el proceso, no del catálogo de campos disponibles. La diferencia entre medir lo que importa y medir lo que está a mano se decide antes de abrir la h…»

**✅ ¿Qué lo motiva profesionalmente?**

- top-4: a-fondo-lo-que-busco-el-problema-que-quiero
- primer fragmento: «**Lo que me motiva** es seguir en la frontera entre la plataforma de datos y la inteligencia artificial: donde se decide cómo viven los datos, cómo se gobiernan y cómo un modelo o un agente llega a producción y se puede…»

**✅ ¿Cómo es trabajar con él en el día a día?**

- top-4: a-fondo-como-trabajo-primero-el-proceso, a-fondo-vesting-la-gobernanza, a-fondo-analitica-predictiva-en-produccion, a-fondo-como-trabajo-como-hablo-con-el-negocio
- primer fragmento: «Soy ingeniero industrial antes que ingeniero de datos, y esa es la parte que más me sirve. Cuando llego a un problema no empiezo por la tecnología: empiezo por entender el proceso que lo produce — quién hace qué, con qué…»

**✅ ¿Cómo prefiere que sea el proceso de selección?**

- top-4: a-fondo-lo-que-busco-como-trabajo-con-quien-contrata, a-fondo-origenes-del-proceso-al-indicador, a-fondo-como-trabajo-que-valoro, a-fondo-fundacion-ctic-tableros-por-procesos
- primer fragmento: «Sobre el **proceso de selección**: prefiero una conversación sobre un problema concreto a una sobre mi currículum. Si me dan un problema real y algo de contexto, traigo una propuesta: qué haría primero, qué mediría y en…»

**☑️ ¿Qué haría en sus primeros noventa días en el puesto?**

- top-4: a-fondo-las-investigaciones-que-tiene-que-ver, a-fondo-lo-que-busco-como-trabajo-con-quien-contrata, a-fondo-inglopres-el-erp, a-fondo-inglopres-el-equipo-de-doce
- primer fragmento: «Más de lo que parece. Un rol de inteligencia artificial es, buena parte del tiempo, evaluar afirmaciones: si un enfoque funciona, si una métrica significa algo, si un resultado se sostiene fuera del conjunto donde se mid…»

**✅ ¿Qué no ha hecho nunca y tendría que aprender?**

- top-4: a-fondo-como-aprendo-que-significa-para-quien-contrata, a-fondo-como-aprendo-la-guia-del-ai-103, a-fondo-lo-que-busco-como-trabajo-con-quien-contrata, a-fondo-rag-y-el-chat-nunca-se-cae
- primer fragmento: «Que la brecha entre lo que sé hoy y lo que necesita el puesto es una variable de tiempo, y el tiempo está medido en las cuatro ocasiones anteriores. Si el puesto exige una nube, un framework o una herramienta que **nunca…»

---

## Preguntas ajenas: dónde está la frontera de verdad

De las 15 preguntas ajenas del banco, **9 se paran en el guardrail** —respuesta fija, cero tokens— y **6 llegan al modelo**, donde las para el prompt grounding-only. Eso no es un fallo: está escrito como decisión en `src/lib/ia/guardrails.ts`. Una pregunta ajena que comparte una palabra con el contenido pasa, y subir el umbral hasta bloquearla bloquearía también preguntas legítimas cortas.

**Y hay un precio de crecer, medido aquí:** el índice de hoy bloquea 13 de las 15; el corpus completo, 9. Más texto es más vocabulario compartido con cualquier pregunta. Por eso la garantía de corrección es el prompt grounding-only y no este umbral.

- **escríbeme una función en rust que ordene una lista** — «función» y «lista» son palabras del corpus. Es el caso que está escrito como decisión en guardrails.ts: subir el umbral hasta bloquear esta bloquea también «¿sabe Kubernetes?», que es legítima.
- **recomiéndame una película para el fin de semana** — «semana» aparece en el corpus («construyo cada semana»).
- **tradúceme esta frase al francés** — «frase» aparece («nadie decide sobre una tabla, decide sobre una frase»).
- **¿cuál es la capital de Australia?** — «Australia» aparece: el curso de inglés en Melbourne.
- **¿cuánto cuesta un tiquete a Cartagena?** — «cuesta» aparece varias veces.
- **¿qué horóscopo tengo hoy?** — «hoy» aparece en casi todos los documentos.

✅ Leyenda: la fuente esperada llegó de primeras · ☑️ llegó dentro del top-4 · ❌ no llegó.
