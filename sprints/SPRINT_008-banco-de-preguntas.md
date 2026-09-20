# Banco de preguntas — el corpus medido con preguntas de afuera

> **Generado por `pnpm corpus:informe` el 2026-09-20. No se edita a mano.**
> Banco: `tests/fixtures/banco-de-preguntas.es.yaml` — **136 preguntas** de 10 familias, 15 preguntas ajenas y 3 huecos declarados.
>
> **HOY** = el índice publicado, tal como está en disco: **1412 fragmentos** (los 24 documentos siguen en `borrador`, así que el chat todavía no ve nada de ellos).
> **M2** = el índice que existirá cuando los apruebes: **1412 fragmentos**.
> El `top-4` es el que de verdad entra al contexto del modelo.

---

## El número

| | HOY | M2 |
| --- | --- | --- |
| Preguntas con su fuente en el top-4 | 136/136 (100 %) | **136/136 (100 %)** |
| …y además de primeras | 103 (76 %) | **103 (76 %)** |
| Preguntas que reciben «eso se me escapa» | 0 | **0** |


**Cómo leer las dos filas.** La primera es el gate: la fuente que declaré para esa pregunta entra al top-4, que es lo que el modelo ve. La segunda es más dura de lo que parece: cuenta solo cuando esa fuente llega **de primeras**, y no cuenta los casos —muchos— en que la primera es otra fuente igual de buena («¿Qué hizo en Cafam?» arranca por el hito de la trayectoria y no por el documento a fondo). Se deja estricta a propósito: así el número solo sube cuando el contenido mejora de verdad.

**Y la columna HOY no es una nota baja: es el tamaño del cambio.** Está en 100 % porque las fuentes que estas preguntas necesitan son justo los 24 documentos que todavía no están aprobados. Lo que dice esa columna es cuántas de estas preguntas contesta hoy la hoja de vida sola.

### Por familia (M2)

| Familia | Preguntas | Con su fuente en top-4 | De primeras |
| --- | --- | --- | --- |
| trayectoria | 25 | 25 (100 %) | 14 (56 %) |
| forma-de-trabajar | 12 | 12 (100 %) | 10 (83 %) |
| certificaciones | 10 | 10 (100 %) | 9 (90 %) |
| ia-y-agentes | 16 | 16 (100 %) | 13 (81 %) |
| plataforma-y-datos | 17 | 17 (100 %) | 11 (65 %) |
| bi-y-analitica | 13 | 13 (100 %) | 11 (85 %) |
| gobierno | 9 | 9 (100 %) | 7 (78 %) |
| procesos | 6 | 6 (100 %) | 4 (67 %) |
| vitrina | 15 | 15 (100 %) | 13 (87 %) |
| encaje | 13 | 13 (100 %) | 11 (85 %) |

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

- top-4: contacto, a-fondo-fundacion-ctic-el-rol-actual~1, a-fondo-procesos-y-simulacion-de-las-preguntas-a-las-investigaciones~1, a-fondo-gobierno-de-datos-y-de-ia-experiencia-en-lo-que-gobierno~1
- primer fragmento: «Bogotá, Colombia · Abierto a reubicación internacional y trabajo remoto. Email: mauricio.hmrc@gmail.com. LinkedIn: https://www.linkedin.com/in/henry-mauricio-rincon · GitHub: https://github.com/mauriciorincon-ai»

**✅ ¿Qué hace en la Fundación CTIC?**

- top-4: a-fondo-fundacion-ctic-el-limite-de-confidencialidad, a-fondo-procesos-y-simulacion-por-que-me-hace-mejor-disenando~2, trayectoria-0, a-fondo-fundacion-ctic-convergencia-de-la-trayectoria~2
- primer fragmento: «Todo lo que comunico sobre esta experiencia conserva un límite que considero innegociable: no expongo datos de pacientes ni información clínica; tampoco detalles sensibles de los procesos, ni conocimiento interno cuya di…»

**✅ ¿Tiene experiencia con datos del sector salud?**

- top-4: a-fondo-fundacion-ctic-gobierno-y-calidad, a-fondo-origenes-cuantos-anos~2, a-fondo-vesting-trazabilidad-y-naturaleza-de-la-informacion~2, a-fondo-gobierno-de-datos-y-de-ia-gobierno-en-salud~1
- primer fragmento: «He gestionado procesos de limpieza, integración y estandarización de datos orientados a fortalecer su calidad, consistencia y confiabilidad, en alineación con las políticas y necesidades institucionales. Esta experiencia…»

**☑️ ¿Qué hizo en Vesting?**

- top-4: a-fondo-agentes-en-produccion-que-me-llevo~1, a-fondo-vesting-especificacion-del-agente~1, a-fondo-gobierno-de-datos-y-de-ia-gobierno-en-vesting~2, a-fondo-gobierno-de-datos-y-de-ia-acceso-y-cambio~1
- primer fragmento: «Vesting y ARKHÉ representan dos etapas diferentes de una misma evolución profesional. En Vesting construí la plataforma de datos y estructuré el proceso que sirvió como marco para desarrollar 27 agentes en un entorno pro…»

**☑️ ¿Cuánto tiempo estuvo en Vesting y con qué cargo?**

- top-4: a-fondo-bi-que-se-adopta-adopcion-con-nombre-de-cargo~2, a-fondo-vesting-el-tamano-de-lo-construido~1, a-fondo-como-aprendo-los-plazos~1, a-fondo-transmilenio-cm-las-cinco-fuentes~2
- primer fragmento: «En C&M Consorcio 2018, entre noviembre de 2018 y mayo de 2020, desarrollé tableros e informes de desempeño orientados al control y la transparencia de la supervisión de TransMilenio: 2 informes semanales, 1 consolidado m…»
- nota: El hito de la trayectoria es tan buena fuente como el documento a fondo: es el que trae el periodo y el cargo exactos.

**☑️ ¿Por qué salió de Vesting?**

- top-4: a-fondo-agentes-en-produccion-el-proceso-core~1, a-fondo-vesting-el-tamano-de-lo-construido~2, a-fondo-vesting-por-que-sali-y-el-puente~1, a-fondo-banco-pichincha-lo-que-pichincha-consolido~2
- primer fragmento: «En Vesting definí, documenté y validé el proceso core para diseñar e implementar agentes de inteligencia artificial: once etapas, del caso de uso a la operación observable, que están numeradas en el documento de Vesting.…»
- nota: El corpus no dice por qué salió, y está bien que no lo diga. Lo que se exige aquí es que traiga el documento de Vesting: con esas fuentes delante, el modelo contesta lo que sí consta y declara lo que no.

**☑️ ¿Ha trabajado en un banco?**

- top-4: a-fondo-como-trabajo-equipos-que-he-liderado~2, a-fondo-como-trabajo-equipos-que-he-liderado~3, a-fondo-banco-pichincha-modelos-predictivos~1, a-fondo-banco-pichincha-programa-de-formacion~1
- primer fragmento: «| Dónde | Cuándo | Equipo | Resultado | | ------------------- | ------------------------------- | --------------------------------------------------------------------------------------------------------------------------…»

**✅ ¿Qué hizo en Banco Pichincha?**

- top-4: a-fondo-banco-pichincha-deuda-tecnica-del-modelo, a-fondo-banco-pichincha-la-cadena-completa~1, a-fondo-gobierno-de-datos-y-de-ia-gobierno-en-banca~3, a-fondo-banco-pichincha-lo-que-pichincha-consolido~2
- primer fragmento: «También comprendí en Banco Pichincha que un modelo semántico acumula deuda técnica cuando crece sin principios comunes. La duplicación de medidas, las relaciones ambiguas, los cálculos innecesariamente complejos y los no…»

**✅ ¿Tiene experiencia en el sector financiero?**

- top-4: a-fondo-banco-pichincha-el-problema-real~1, a-fondo-las-investigaciones-de-experiencia-a-pregunta~2, a-fondo-fundacion-ctic-gobierno-y-calidad, a-fondo-analitica-predictiva-dos-modelos~1
- primer fragmento: «Ingresé a Banco Pichincha en marzo de 2023 como Analista Senior de Analítica y Reportes y permanecí en la organización hasta julio del mismo año. Fueron cinco meses, y fue mi paso por el sector financiero: en banca el da…»

**☑️ ¿Qué hizo en Cafam?**

- top-4: a-fondo-origenes-el-hilo~2, a-fondo-como-trabajo-seguimiento-visible~3, a-fondo-cafam-resultados-en-cifras~2, trayectoria-4
- primer fragmento: «- **Estudio de tiempos y suplementos por fatiga**, en Inglopres, con la tabla de la OIT: un tiempo observado no es un estándar hasta que reconoce el esfuerzo de quien lo ejecuta. - **Balanceo de líneas y teoría de restri…»

**✅ ¿Ha participado en la implementación de un sistema de gestión de bodega?**

- top-4: a-fondo-cafam-el-contexto~1, a-fondo-fundacion-ctic-inventario-y-ciclo-de-vida~1, a-fondo-cafam-el-contexto~3, a-fondo-fundacion-ctic-sistema-de-gestion-de-ia~2
- primer fragmento: «Ingresé a Cafam en octubre de 2020 como Analista de Sistemas de Información y de Proyectos y permanecí en la organización hasta junio de 2021. Mi responsabilidad se concentró en la implementación de un WMS —un sistema de…»

**✅ ¿Cuál es el equipo más grande que ha liderado?**

- top-4: a-fondo-cafam-el-equipo-de-veinte~1, a-fondo-cafam-el-equipo-de-veinte~2, a-fondo-como-trabajo-equipos-que-he-liderado~1, casestudy-cafam
- primer fragmento: «Lideré un equipo mixto de veinte personas durante la fase de pruebas: catorce integrantes de Cafam y seis profesionales de Oracle, organización que acababa de comprar el producto y lo estaba implantando con sus propios e…»

**☑️ ¿Tiene experiencia en transporte masivo?**

- top-4: a-fondo-origenes-cuantos-anos~2, a-fondo-cm-operaciones-la-operacion-de-una-ciudad~1, a-fondo-las-investigaciones-experiencia-y-metodo~2, a-fondo-las-investigaciones-de-experiencia-a-pregunta~1
- primer fragmento: «En ese arco hay ocho empleos en ocho organizaciones y siete sectores: maquinaria pesada, evaluación educativa, transporte masivo, logística de medicamentos, banca, una startup de agentes de IA y, hoy, la salud. Sumados,…»

**☑️ ¿Qué trabajo hizo para TransMilenio?**

- top-4: a-fondo-como-trabajo-junta-directiva-y-mesas-sitp~2, a-fondo-origenes-el-hilo~2, a-fondo-transmilenio-cm-lo-que-enseno-el-modelo~2, a-fondo-origenes-del-indicador-a-la-plataforma~1
- primer fragmento: «La segunda escuela fueron las **mesas de trabajo con la dirección de los concesionarios del SITP**, en C&M Consultores, para la Fuerza Operativa de TransMilenio. Allí la audiencia no me reportaba ni tenía por qué creerme…»

**✅ ¿Qué es el análisis post-operacional que menciona?**

- top-4: a-fondo-transmilenio-cm-que-es-el-analisis-post-operacional~2, a-fondo-transmilenio-cm-que-es-el-analisis-post-operacional~1, trayectoria-3, a-fondo-transmilenio-cm-el-problema~1
- primer fragmento: «Lo distingue del análisis de supervisión —mi etapa anterior en el mismo sistema, entre 2018 y 2020— el horizonte y el destinatario. La supervisión mira el cumplimiento de cada servicio y sustenta consecuencias; el anális…»

**☑️ ¿Qué hizo en Ceinfes?**

- top-4: a-fondo-como-trabajo-junta-directiva-y-mesas-sitp~2, a-fondo-origenes-el-hilo~2, a-fondo-ceinfes-lo-que-dejo, a-fondo-ceinfes-el-encargo~1
- primer fragmento: «La segunda escuela fueron las **mesas de trabajo con la dirección de los concesionarios del SITP**, en C&M Consultores, para la Fuerza Operativa de TransMilenio. Allí la audiencia no me reportaba ni tenía por qué creerme…»

**✅ ¿Ha presentado resultados ante una junta directiva?**

- top-4: a-fondo-ceinfes-la-junta-directiva~2, a-fondo-ceinfes-la-junta-directiva~1, a-fondo-como-trabajo-junta-directiva-y-mesas-sitp~1, a-fondo-como-trabajo-junta-directiva-y-mesas-sitp~3
- primer fragmento: «También comprendí que presentar resultados no es suficiente. La información debe organizarse alrededor de la decisión que busca habilitar. Cada informe respondía cinco cosas: qué estaba ocurriendo, por qué era relevante,…»

**✅ ¿Cuál fue su primer empleo al salir de la universidad?**

- top-4: a-fondo-inglopres-la-operacion~1, a-fondo-inglopres-la-operacion~2, a-fondo-origenes-lo-que-ya-contenia~2, a-fondo-origenes-la-leccion-de-arquitectura~2
- primer fragmento: «Ingresé a Inglopres en agosto de 2016, recién egresado de Ingeniería Industrial de la Pontificia Universidad Javeriana, para asumir mi primer empleo como Ingeniero de Procesos. Permanecí en la organización hasta junio de…»

**☑️ ¿Ha liderado la implementación de un ERP?**

- top-4: a-fondo-cafam-el-equipo-de-veinte~2, a-fondo-como-trabajo-equipos-que-he-liderado~1, a-fondo-inglopres-el-erp~1, a-fondo-las-investigaciones-reemplazo-del-erp~1
- primer fragmento: «La duración de esta fase permitió superar la validación de escenarios ideales y observar también excepciones, reincidencias y comportamientos que solo se hacen visibles cuando el sistema se somete de manera sostenida a l…»

**✅ ¿Tiene experiencia en cadena de suministro y logística?**

- top-4: a-fondo-inglopres-cadena-de-suministro~1, a-fondo-inglopres-cadena-de-suministro~2, a-fondo-procesos-y-simulacion-iso-9001~1, a-fondo-origenes-el-primer-trabajo~3
- primer fragmento: «También lideré iniciativas de optimización de la cadena de suministro orientadas a reducir costos operativos, fortalecer la coordinación de recursos y asegurar el cumplimiento de los requisitos asociados con la norma ISO…»

**✅ ¿En qué industrias o sectores ha trabajado?**

- top-4: a-fondo-origenes-del-proceso-a-la-ia, a-fondo-origenes-indicadores-como-sensores~2, a-fondo-origenes-cuantos-anos~2, a-fondo-origenes-medir-el-tiempo~2
- primer fragmento: «**Del proceso al indicador** (Ceinfes y C&M Consorcio 2018). Dejé de mejorar una actividad y pasé a dirigir y supervisar operaciones enteras a través de sus datos: KPIs por área, tableros de desempeño, un histórico para…»

**✅ ¿Cuántos años de experiencia profesional tiene?**

- top-4: a-fondo-origenes-cuantos-anos~1, a-fondo-origenes-cuantos-anos~3, a-fondo-origenes-cuantos-anos~2, a-fondo-gobierno-de-datos-y-de-ia-experiencia-en-lo-que-gobierno~2
- primer fragmento: «Mi formación formal es el pregrado en Ingeniería Industrial de la Javeriana, con énfasis en Inteligencia Analítica de Datos, y el programa de Diseño Industrial; no tengo maestría, especialización ni otro posgrado: la pro…»

**☑️ ¿Ha trabajado en una startup?**

- top-4: trayectoria-1, a-fondo-como-trabajo-equipos-que-he-liderado~3, a-fondo-vesting-el-contexto~1, a-fondo-vesting-el-contexto~2
- primer fragmento: «2024: Líder de Estrategia de Datos, Vesting — startup de agentes de automatización. Ecosistema de datos para agentes de IA en Microsoft Fabric, desde cero: arquitectura, gobernanza, monitoreo de agentes en tiempo real y…»

**✅ ¿Ha trabajado para entidades públicas o con operación de ciudad?**

- top-4: a-fondo-transmilenio-cm-el-problema~1, a-fondo-cm-operaciones-la-operacion-de-una-ciudad~2, a-fondo-cm-operaciones-la-operacion-de-una-ciudad~1, a-fondo-los-tableros-banca-colombiana~1
- primer fragmento: «Regresé al entorno de TransMilenio en julio de 2021, esta vez como Profesional de Análisis Post-Operacional en C&M Consultores, dentro de la Fuerza Operativa de TransMilenio S.A., y permanecí en el cargo hasta mayo de 20…»

**✅ ¿Qué pasó entre mayo de 2022 y marzo de 2023?**

- top-4: a-fondo-origenes-los-tres-saltos~2, a-fondo-como-aprendo-ibm-y-las-rutas-en-curso~2, a-fondo-como-aprendo-ibm-y-las-rutas-en-curso~1, a-fondo-bi-que-se-adopta-adopcion-medida~2
- primer fragmento: «| Periodo | Rol y organización | Qué cambió de escala | | --- | --- | --- | | agosto 2016 – junio 2017 | Ingeniero de Procesos, Inglopres | un proceso: el ERP (Odoo), las bases de datos que faltaban, un equipo de 12 | |…»

### forma-de-trabajar

**✅ ¿Cómo trabaja Henry cuando llega a un problema nuevo?**

- top-4: a-fondo-como-trabajo-primero-el-proceso~1, a-fondo-como-trabajo-primero-el-proceso~2, a-fondo-bi-que-se-adopta-el-problema-dificil~1, a-fondo-como-trabajo-primero-el-proceso~3
- primer fragmento: «Soy ingeniero industrial de la Javeriana antes que ingeniero de datos, y esa forma de entender el mundo sigue siendo una de mis mayores ventajas competitivas. A lo largo de diez años de carrera —desde agosto de 2016, en…»

**☑️ ¿Cómo lidera un equipo?**

- top-4: a-fondo-cafam-el-equipo-de-veinte~1, a-fondo-como-trabajo-como-lidero~1, a-fondo-como-trabajo-como-lidero~3, a-fondo-como-trabajo-como-lidero~2
- primer fragmento: «Lideré un equipo mixto de veinte personas durante la fase de pruebas: catorce integrantes de Cafam y seis profesionales de Oracle, organización que acababa de comprar el producto y lo estaba implantando con sus propios e…»

**✅ ¿Cómo se comunica con las áreas de negocio?**

- top-4: a-fondo-como-trabajo-como-hablo-con-el-negocio~1, a-fondo-como-trabajo-como-hablo-con-el-negocio~3, a-fondo-como-trabajo-como-hablo-con-el-negocio~2, a-fondo-como-trabajo-junta-directiva-y-mesas-sitp~1
- primer fragmento: «A lo largo de mi trayectoria he trabajado de manera cercana con la alta dirección, líderes de negocio y responsables de áreas estratégicas: la junta directiva de Ceinfes, la dirección de los concesionarios del SITP, los…»

**✅ ¿Qué valora en un proyecto?**

- top-4: a-fondo-como-trabajo-que-valoro~1, a-fondo-como-trabajo-que-valoro~3, a-fondo-como-trabajo-que-valoro~2, a-fondo-como-trabajo-proyecto-que-aprende~1
- primer fragmento: «Valoro los proyectos que convierten problemas relevantes en capacidades empresariales duraderas. Para mí, una iniciativa de alto valor no comienza con una herramienta, una tecnología o una solución previamente definida.…»

**✅ ¿Es un perfil más de procesos o más de tecnología?**

- top-4: a-fondo-procesos-y-simulacion-lo-que-representan~3, a-fondo-procesos-y-simulacion-lo-que-representan~1, a-fondo-procesos-y-simulacion-lo-que-representan~2, perfil
- primer fragmento: «Mi diferencial no consiste únicamente en conocer herramientas de procesos, datos o inteligencia artificial. Consiste en poder conectarlas dentro de un método único: comprender, representar, medir, experimentar, decidir y…»

**✅ ¿Por qué estudió ingeniería industrial?**

- top-4: a-fondo-origenes-por-que-industrial~1, a-fondo-origenes-por-que-industrial~2, a-fondo-como-aprendo-aprender-como-un-proceso, a-fondo-origenes-la-convergencia~2
- primer fragmento: «Elegí estudiar Ingeniería Industrial porque quería comprender cómo funcionan las organizaciones como sistemas completos y, sobre todo, cómo podían funcionar mejor. Me interesaba una disciplina que no se limitara a observ…»

**✅ ¿Qué estudió y en qué universidad?**

- top-4: a-fondo-origenes-por-que-industrial~2, a-fondo-origenes-por-que-industrial~1, a-fondo-inglopres-la-operacion~1, a-fondo-inglopres-la-operacion~2
- primer fragmento: «La estudié en la Pontificia Universidad Javeriana, en Bogotá, entre 2009 y 2016. Diez años después de graduarme sigo empezando igual que entonces: antes de proponer un modelo, dibujo el proceso y ubico dónde se pierde el…»

**✅ ¿Tiene formación en diseño?**

- top-4: a-fondo-origenes-la-formacion-en-diseno~1, a-fondo-origenes-la-formacion-en-diseno~2, a-fondo-bi-que-se-adopta-formacion-y-adopcion~2, a-fondo-banco-pichincha-programa-de-formacion~1
- primer fragmento: «En paralelo, cursé estudios de pregrado en Diseño Industrial en la misma universidad, entre 2011 y 2016, con un enfoque en sostenibilidad y en el impacto cultural del diseño. Esta formación complementó mi pensamiento de…»

**✅ ¿Cómo pasó de la ingeniería de procesos a los datos?**

- top-4: a-fondo-origenes-la-convergencia~1, a-fondo-origenes-del-proceso-a-la-ia, a-fondo-origenes-el-primer-trabajo~1, a-fondo-origenes-el-enfasis-en-analitica~2
- primer fragmento: «La convergencia entre Ingeniería Industrial, analítica de datos y Diseño Industrial terminó construyendo una perspectiva profesional que hoy considero esencial. La ingeniería me permite comprender y estructurar la comple…»

**✅ ¿Qué lo diferencia de otros candidatos de datos?**

- top-4: a-fondo-lo-que-busco-que-ofrezco~1, a-fondo-lo-que-busco-que-ofrezco~2, a-fondo-lo-que-busco-que-ofrezco~3, a-fondo-los-tableros-otras-herramientas~1
- primer fragmento: «Si la pregunta es por qué contratarme a mí y no a otro perfil de datos, la respuesta es la combinación. Mi principal diferencial es la capacidad de conectar dimensiones que con frecuencia se encuentran separadas: proceso…»

**☑️ ¿Cómo documenta lo que hace?**

- top-4: a-fondo-analitica-predictiva-probeta-por-dentro~1, a-fondo-gobierno-de-datos-y-de-ia-iso-42001-limites~1, a-fondo-gobierno-de-datos-y-de-ia-iso-42001~2, a-fondo-procesos-y-simulacion-verificacion-y-validacion~1
- primer fragmento: «Lo que Probeta DS hace por dentro es la misma disciplina de este documento convertida en producto. Dos modelos compiten con el mismo preprocesamiento —Random Forest y HistGradientBoosting de scikit-learn— y el resultado…»

**✅ ¿Cómo maneja el trabajo con personas que no le reportan?**

- top-4: a-fondo-como-trabajo-personas-que-no-me-reportan~2, a-fondo-como-trabajo-personas-que-no-me-reportan~1, a-fondo-fabric-en-la-practica-datos-listos-para-ia~1, a-fondo-transmilenio-cm-automatizacion-con-controles
- primer fragmento: «Tres veces he trabajado en iniciativas donde la colaboración no podía ordenarse. En Cafam, el equipo era mixto: 14 personas de la caja y 6 del proveedor del WMS, con intereses contractuales distintos, y la única manera d…»

### certificaciones

**✅ ¿Qué certificaciones tiene?**

- top-4: a-fondo-certificaciones-la-tabla~2, a-fondo-certificaciones-el-estado-de-cada-credencial, a-fondo-certificaciones-criterio-de-certificacion~1, a-fondo-certificaciones-el-ai-103~1
- primer fragmento: «Cinco credenciales obtenidas —el DP-600 y cuatro de IBM— y dos rutas en curso: en este momento me estoy certificando en el AI-103 y en el AI-300. Es el mismo conteo que publica el sitio: el logro «5 certificaciones profe…»

**✅ ¿Tiene la certificación DP-600 de Microsoft Fabric?**

- top-4: a-fondo-certificaciones-criterio-de-certificacion~1, a-fondo-certificaciones-dp-600-en-vesting-y-ctic~1, a-fondo-fabric-en-la-practica-que-significa-el-dp-600~2, a-fondo-certificaciones-dp-600-en-vesting-y-ctic~2
- primer fragmento: «No selecciono una certificación únicamente porque una tecnología sea reciente o tenga visibilidad en el mercado. Me interesa cuando formaliza una capacidad que ya estoy aplicando, fortalece un tramo necesario de mi arqui…»

**✅ ¿Está certificado en inteligencia artificial de Azure?**

- top-4: a-fondo-certificaciones-el-ai-103~1, a-fondo-apps-pipeline-codigo-primero~3, a-fondo-gobierno-de-datos-y-de-ia-estrategia-iso-42001~2, a-fondo-apps-pipeline-codigo-primero~1
- primer fragmento: «Desde julio de 2026 desarrollo la ruta correspondiente al examen AI-103, orientado al desarrollo de aplicaciones y agentes de inteligencia artificial en Azure; a la fecha llevo 21 módulos. No presento esta credencial com…»

**✅ ¿Tiene certificaciones de ciencia de datos de IBM?**

- top-4: a-fondo-certificaciones-las-de-ibm~1, a-fondo-certificaciones-las-de-ibm~2, a-fondo-certificaciones-ibm-y-mis-dos-formaciones~1, a-fondo-certificaciones-ibm-y-mis-dos-formaciones~2
- primer fragmento: «Mi formación en ciencia de datos se construyó mediante cuatro credenciales de IBM, desarrolladas en dos etapas y alrededor de los principales lenguajes utilizados para el análisis: Python, SQL y R. Durante 2022 completé…»

**✅ ¿Cuánto tardó en obtener la certificación de Fabric?**

- top-4: a-fondo-como-aprendo-los-plazos~1, a-fondo-como-aprendo-los-plazos~2, a-fondo-certificaciones-criterio-de-certificacion~1, a-fondo-como-aprendo-evidencia-certificaciones~1
- primer fragmento: «Las últimas veces que aprendí algo desde cero, y cuánto tardé: | Qué | Desde | Plazo | Resultado | | ------------------------------------- | -------------- | --------------------------------- | --------------------------…»

**☑️ ¿Cómo aprende una tecnología que no conoce?**

- top-4: a-fondo-como-trabajo-proyecto-que-aprende~3, a-fondo-como-aprendo-criterios-de-aprendizaje~2, a-fondo-como-aprendo-por-que-existe~1, a-fondo-como-trabajo-como-aprendo-y-evoluciono
- primer fragmento: «En síntesis, valoro tres condiciones fundamentales: que el problema sea real y su impacto pueda medirse, que exista un responsable del negocio comprometido con convertir la solución en una capacidad adoptada, y que el re…»

**✅ ¿Qué hace cuando el puesto pide algo que no ha usado nunca?**

- top-4: a-fondo-como-aprendo-incorporar-una-plataforma~3, a-fondo-como-aprendo-incorporar-una-plataforma~1, a-fondo-como-aprendo-incorporar-una-plataforma~2, pieza-apps-nutri-kids-limites~1
- primer fragmento: «Mi criterio para declarar incorporada una nueva capacidad es claro. No basta con completar un curso ni con ejecutar una demostración. Debo poder explicar la arquitectura, desplegar la solución, reproducirla, observar su…»

**✅ ¿Tiene posgrado, maestría o especialización?**

- top-4: a-fondo-origenes-cuantos-anos~1, a-fondo-gobierno-de-datos-y-de-ia-experiencia-y-formacion~1, a-fondo-agentes-en-produccion-escala-frente-a-profundidad~2, a-fondo-los-tableros-verificar-el-universo~1
- primer fragmento: «Mi formación formal es el pregrado en Ingeniería Industrial de la Javeriana, con énfasis en Inteligencia Analítica de Datos, y el programa de Diseño Industrial; no tengo maestría, especialización ni otro posgrado: la pro…»
- nota: La respuesta honesta son los dos pregrados de la Javeriana. Antes de la corrección de la fase 4 esta pregunta traía un párrafo que decía «esa posición exige posgrado», que era el texto de la oferta y no el suyo.

**✅ ¿Se está certificando en algo en este momento?**

- top-4: a-fondo-certificaciones-la-tabla~2, a-fondo-apps-pipeline-estados-honestos~2, a-fondo-como-aprendo-incorporar-una-plataforma~2, a-fondo-rag-y-el-chat-umbral-medido~2
- primer fragmento: «Cinco credenciales obtenidas —el DP-600 y cuatro de IBM— y dos rutas en curso: en este momento me estoy certificando en el AI-103 y en el AI-300. Es el mismo conteo que publica el sitio: el logro «5 certificaciones profe…»

**✅ ¿Qué certificación piensa sacar después?**

- top-4: a-fondo-certificaciones-criterio-de-certificacion~1, a-fondo-gobierno-de-datos-y-de-ia-iso-42001~2, a-fondo-certificaciones-criterio-de-certificacion~2, a-fondo-procesos-y-simulacion-verificacion-y-validacion~3
- primer fragmento: «No selecciono una certificación únicamente porque una tecnología sea reciente o tenga visibilidad en el mercado. Me interesa cuando formaliza una capacidad que ya estoy aplicando, fortalece un tramo necesario de mi arqui…»

### ia-y-agentes

**✅ ¿Tiene experiencia con inteligencia artificial generativa?**

- top-4: a-fondo-rag-y-el-chat-que-demuestra~1, a-fondo-rag-y-el-chat-que-demuestra~2, a-fondo-rag-y-el-chat-que-demuestra~3, a-fondo-agentes-en-produccion-dos-experiencias~1
- primer fragmento: «El chat demuestra que puedo diseñar una solución de inteligencia artificial generativa como un sistema completo y no únicamente como una llamada a un modelo. La arquitectura comienza en el contenido versionado, continúa…»

**✅ ¿Ha construido agentes de inteligencia artificial?**

- top-4: a-fondo-agentes-en-produccion-la-segunda-trayectoria~1, a-fondo-agentes-en-produccion-la-segunda-trayectoria~2, a-fondo-origenes-la-ingenieria-y-la-ia~2, a-fondo-origenes-de-la-plataforma-a-la-ia~1
- primer fragmento: «La segunda trayectoria corresponde a ARKHÉ, mi propio ecosistema agéntico, y a los agentes publicados en CV Viva. Este trabajo no es una extensión de la arquitectura de Vesting ni una reproducción de sus componentes. Es…»

**☑️ ¿Qué es el proceso core replicable de agentes?**

- top-4: a-fondo-origenes-el-marco-replicable~1, a-fondo-agentes-en-produccion-el-proceso-core~1, a-fondo-vesting-el-proceso-core~1, a-fondo-agentes-en-produccion-el-proceso-core~2
- primer fragmento: «En Vesting, sin embargo, el principal activo no era un agente individual. Era el proceso que permitía diseñar, construir, evaluar y desplegar los siguientes de forma consistente. Por ello estructuré, documenté y validé u…»

**✅ ¿Cómo monitorea un agente de IA en producción?**

- top-4: a-fondo-vesting-monitoreo-de-agentes~1, a-fondo-agentes-en-produccion-monitorear-no-es-mirar-si-esta-arriba~1, a-fondo-vesting-tableros-operativos~2, a-fondo-vesting-monitoreo-de-agentes~2
- primer fragmento: «Uno de los principales objetivos del ecosistema de datos fue establecer la capacidad de monitorear agentes en producción, y llegó a vigilar 23 agentes a la vez, en tiempo real. La observabilidad debía responder una pregu…»

**✅ ¿Qué frameworks de agentes ha usado?**

- top-4: a-fondo-agentes-en-produccion-n8n-como-base~3, a-fondo-agentes-en-produccion-n8n-como-base~1, a-fondo-agentes-en-produccion-n8n-como-base~2, a-fondo-como-aprendo-incorporar-una-plataforma~1
- primer fragmento: «También aprendí que una herramienta de automatización puede acelerar considerablemente la construcción, pero no elimina la necesidad de arquitectura. A medida que aumentan los agentes, las integraciones y las excepciones…»
- nota: Pasa, pero floja: el documento llega al top-4 sin nombrar un solo framework, porque el corpus no dice con qué están construidos los trece agentes. Es uno de los cinco huecos que la simulación M2 puso en primer lugar, y la respuesta solo la tiene el dueño.

**☑️ ¿Ha trabajado con modelos de lenguaje grandes?**

- top-4: a-fondo-analitica-predictiva-nivel-por-herramienta~1, a-fondo-agentes-en-produccion-ecosistema-agentico-propio~1, a-fondo-analitica-predictiva-las-herramientas~1, a-fondo-lo-que-busco-arquitectura-agentica~1
- primer fragmento: «No presento las herramientas como equivalentes ni como una competencia definida únicamente por su nombre. Esta es la lista honesta, herramienta por herramienta: | Herramienta | Nivel | Dónde | | --- | --- | --- | | Pytho…»

**✅ ¿Qué arquitecturas RAG ha implementado?**

- top-4: a-fondo-rag-y-el-chat-embeddings-condicionados~2, a-fondo-rag-y-el-chat-ninguna-capa-basta~2, a-fondo-rag-y-el-chat-que-demuestra~1, a-fondo-rag-y-el-chat-evaluacion-del-rag~1
- primer fragmento: «La opción está declarada en público: «retrieval con embeddings» es una de las dos funcionalidades votables del roadmap de CV Viva, junto con la memoria de la conversación. Quien visita el sitio puede votar por ella, y el…»

**✅ ¿Cómo funciona el chat de esta página?**

- top-4: a-fondo-rag-y-el-chat-lo-que-estas-usando~1, a-fondo-rag-y-el-chat-el-indice~1, a-fondo-rag-y-el-chat-citas-navegables~1, a-fondo-apps-pipeline-esta-misma-pagina~2
- primer fragmento: «Si esta respuesta fue generada por el chat de esta página, estás utilizando una implementación real de la arquitectura que describo. Es un sistema de generación aumentada por recuperación —RAG— construido por mí para res…»

**✅ ¿Usa embeddings o búsqueda vectorial?**

- top-4: a-fondo-rag-y-el-chat-embeddings-condicionados~1, a-fondo-rag-y-el-chat-recuperacion-lexica~1, a-fondo-rag-y-el-chat-recuperacion-lexica~3, a-fondo-rag-y-el-chat-embeddings-condicionados~2
- primer fragmento: «La regla aplicada es la misma que utilizo en mi pipeline de aplicaciones —la regla 13, código primero—: no incorporar inteligencia artificial por defecto. Antes de aumentar la complejidad, debo demostrar qué característi…»

**✅ ¿Con qué proveedor de modelos trabaja?**

- top-4: a-fondo-rag-y-el-chat-proveedor-intercambiable~2, a-fondo-cafam-coordinar-equipo-mixto~2, a-fondo-origenes-banco-pichincha-la-capa-analitica~1, a-fondo-fabric-en-la-practica-dax-studio-y-tabular-editor~1
- primer fragmento: «El beneficio principal es reducir el acoplamiento. La aplicación no debería dejar de existir porque cambie un proveedor, se modifique una cuota o desaparezca un modelo específico. La arquitectura necesita preservar la ca…»

**✅ ¿Cómo evita que el modelo invente respuestas?**

- top-4: a-fondo-agentes-en-produccion-fuentes-o-vacio~1, a-fondo-rag-y-el-chat-los-guardrails~2, a-fondo-agentes-en-produccion-fuentes-o-vacio~2, a-fondo-rag-y-el-chat-los-guardrails~3
- primer fragmento: «Los agentes de ARKHÉ comparten una regla que resume mi postura sobre inteligencia artificial generativa: ninguna afirmación verificable debe depender únicamente de la memoria del modelo. Cuando una respuesta requiere evi…»

**☑️ ¿Ha llevado un modelo de machine learning a producción?**

- top-4: a-fondo-transmilenio-cm-lo-que-enseno-el-modelo~2, a-fondo-analitica-predictiva-dos-modelos~1, a-fondo-banco-pichincha-modelos-predictivos~1, a-fondo-transmilenio-cm-lo-que-enseno-el-modelo~1
- primer fragmento: «Con el tiempo, esta comprensión se ampliaría hacia aplicaciones y agentes de inteligencia artificial. Un modelo genera una predicción; una aplicación puede integrarla con reglas y flujos de trabajo; un agente puede consu…»

**✅ ¿Qué postura tiene sobre el uso responsable de la inteligencia artificial?**

- top-4: a-fondo-gobierno-de-datos-y-de-ia-estrategia-iso-42001~1, a-fondo-gobierno-de-datos-y-de-ia-estrategia-iso-42001~2, a-fondo-gobierno-de-datos-y-de-ia-la-continuacion~2, a-fondo-fundacion-ctic-gobernar-datos-y-gobernar-ia
- primer fragmento: «Actualmente lidero la estrategia institucional de inteligencia artificial de la Fundación CTIC siguiendo los principios y requisitos de **UNE-ISO/IEC 42001:2025**, la adopción española de la norma internacional ISO/IEC 4…»

**✅ ¿Ha trabajado con procesamiento de lenguaje natural?**

- top-4: a-fondo-analitica-predictiva-nivel-por-herramienta~1, a-fondo-certificaciones-el-ai-103~1, a-fondo-fabric-en-la-practica-lago-y-almacen~1, a-fondo-como-trabajo-el-instrumento-para-cada-decision~1
- primer fragmento: «No presento las herramientas como equivalentes ni como una competencia definida únicamente por su nombre. Esta es la lista honesta, herramienta por herramienta: | Herramienta | Nivel | Dónde | | --- | --- | --- | | Pytho…»

**✅ ¿Qué tan grande es su experiencia con IA comparada con la de datos?**

- top-4: a-fondo-origenes-cuantos-anos~3, a-fondo-vesting-trazabilidad-y-naturaleza-de-la-informacion~2, a-fondo-gobierno-de-datos-y-de-ia-experiencia-y-formacion~1, a-fondo-vesting-por-que-sali-y-el-puente~1
- primer fragmento: «Si la pregunta es qué tan grande es mi experiencia con IA comparada con la de datos: los datos ocupan ocho de esos años; la IA aplicada, con agentes en producción, empieza en agosto de 2023 en Vesting y sigue hoy en la F…»

**✅ ¿Ha construido prompts o sistemas con instrucciones para un modelo?**

- top-4: a-fondo-rag-y-el-chat-los-guardrails~3, a-fondo-rag-y-el-chat-los-guardrails~1, a-fondo-rag-y-el-chat-los-guardrails~2, a-fondo-analitica-predictiva-de-modelos-a-sistemas~1
- primer fragmento: «La primera capa de fondo controla el ingreso al flujo generativo: las preguntas sin recuperación suficiente se resuelven sin modelo, lo que reduce costo y limita la posibilidad de que el conocimiento general del proveedo…»

### plataforma-y-datos

**✅ ¿Qué experiencia tiene con Microsoft Fabric?**

- top-4: a-fondo-fabric-en-la-practica-power-bi~2, a-fondo-fabric-en-la-practica-fabric-en-mi-perfil~1, a-fondo-fabric-en-la-practica-power-bi~1, a-fondo-vesting-la-arquitectura~3
- primer fragmento: «Por eso, el desarrollo comienza antes de abrir la interfaz. Primero identifico el proceso, la audiencia, la pregunta y la decisión. Después defino las entidades, relaciones, eventos y medidas necesarias para representar…»

**✅ ¿Ha diseñado una arquitectura de datos desde cero?**

- top-4: a-fondo-vesting-la-arquitectura~1, a-fondo-vesting-la-arquitectura~3, a-fondo-vesting-la-arquitectura~2, a-fondo-lo-que-busco-que-ofrezco~3
- primer fragmento: «Diseñé e implementé en Microsoft Fabric un ecosistema de datos orientado a integrar, transformar y analizar la información generada por los agentes: Big Data, Data Warehouse y procesamiento distribuido sobre un lakehouse…»

**✅ ¿Qué es un lakehouse y lo ha usado?**

- top-4: a-fondo-fabric-en-la-practica-lago-y-almacen~2, a-fondo-como-aprendo-incorporar-una-plataforma~1, a-fondo-fabric-en-la-practica-lago-y-almacen~1, a-fondo-como-aprendo-incorporar-una-plataforma~3
- primer fragmento: «El warehouse cumplía una función complementaria. Permitía organizar información estructurada mediante un enfoque relacional, desarrollar transformaciones y vistas en T-SQL orientadas al análisis y responder con claridad…»

**☑️ ¿Sabe modelado semántico?**

- top-4: a-fondo-banco-pichincha-contenidos-de-la-formacion~1, a-fondo-fabric-en-la-practica-modelado-semantico~1, a-fondo-fabric-en-la-practica-modelado-semantico~2, a-fondo-banco-pichincha-contenidos-de-la-formacion~2
- primer fragmento: «Uno de los componentes principales fue Power Query, utilizado para estructurar transformaciones más claras, reducir actividades manuales y establecer una preparación reproducible de la información. El propósito no era ún…»

**✅ ¿Qué nivel tiene con Power BI?**

- top-4: a-fondo-bi-que-se-adopta-cuando-power-bi-no-es-el-instrumento~2, a-fondo-bi-que-se-adopta-cuando-power-bi-no-es-el-instrumento~1, a-fondo-plataforma-y-despliegue-siguiente-nivel-plataforma~1, a-fondo-los-tableros-otras-herramientas~1
- primer fragmento: «Seleccionar el instrumento adecuado exige comprender cuánto tiempo conserva valor la información, qué nivel de interpretación requiere, qué consecuencias tiene la decisión y qué responsabilidad debe permanecer en la pers…»

**☑️ ¿Sabe DAX?**

- top-4: a-fondo-los-tableros-medidas-dax~3, a-fondo-rag-y-el-chat-umbral-medido~1, a-fondo-fabric-en-la-practica-modelado-semantico~1, a-fondo-fabric-en-la-practica-modelado-semantico~2
- primer fragmento: «Las 43 medidas de energía se validaron una por una contra el modelo y se contrastaron con valores publicados, no solo consigo mismas. Y cada campo que un visual cita se contrasta contra el modelo real, porque el validado…»

**✅ ¿Ha construido procesos ETL?**

- top-4: a-fondo-banco-pichincha-el-etl-y-la-preparacion~1, a-fondo-transmilenio-cm-unificar-las-fuentes~2, a-fondo-transmilenio-cm-unificar-las-fuentes~1, a-fondo-banco-pichincha-el-etl-y-la-preparacion~2
- primer fragmento: «Trabajé en la optimización de los procesos ETL de preparación de información utilizados por las soluciones de Power BI, construidos con Power Query. Las mejoras aplicadas contribuyeron a reducir aproximadamente un 35 % l…»

**✅ ¿Qué tan fuerte es en SQL?**

- top-4: a-fondo-inglopres-las-bases-de-datos~1, a-fondo-origenes-el-punto-de-inflexion~2, a-fondo-analitica-predictiva-las-herramientas~2, a-fondo-cm-operaciones-la-automatizacion~1
- primer fragmento: «Para evaluar los procesos necesitaba indicadores confiables, pero una parte importante de la información requerida no existía, no se capturaba de forma consistente o permanecía distribuida entre diferentes registros que…»

**☑️ ¿Tiene experiencia con Azure?**

- top-4: a-fondo-certificaciones-el-ai-103~1, a-fondo-plataforma-y-despliegue-el-mundo-microsoft~1, a-fondo-apps-pipeline-exploracion-gemini-vertex~1, a-fondo-fabric-en-la-practica-power-bi~2
- primer fragmento: «Desde julio de 2026 desarrollo la ruta correspondiente al examen AI-103, orientado al desarrollo de aplicaciones y agentes de inteligencia artificial en Azure; a la fecha llevo 21 módulos. No presento esta credencial com…»

**✅ ¿Conoce Google Cloud, Vertex AI o BigQuery?**

- top-4: a-fondo-plataforma-y-despliegue-expansion-google-cloud~1, a-fondo-como-aprendo-incorporar-una-plataforma~2, a-fondo-apps-pipeline-exploracion-gemini-vertex~1, a-fondo-plataforma-y-despliegue-lo-que-no-he-hecho~1
- primer fragmento: «He convertido Google Cloud en una prioridad concreta dentro de mi pipeline de construcción, con una salvedad que mantengo escrita: es una exploración sin fecha comprometida. Mi propósito es ampliar una profundidad arquit…»

**✅ ¿Tiene experiencia con Docker y Kubernetes?**

- top-4: a-fondo-plataforma-y-despliegue-lo-que-no-he-hecho~1, a-fondo-lo-que-busco-lo-que-no-he-hecho-y-el-portafolio~1, a-fondo-fabric-en-la-practica-power-bi~2, a-fondo-gobierno-de-datos-y-de-ia-experiencia-y-formacion~1
- primer fragmento: «Google Cloud —Vertex AI, BigQuery, despliegue productivo en ese ecosistema— y contenedores en producción con Docker y Kubernetes no están en mi experiencia profesional. Mi mundo es Microsoft y en Microsoft es donde tengo…»

**☑️ ¿Sabe de MLOps?**

- top-4: a-fondo-certificaciones-el-ai-300~1, a-fondo-analitica-predictiva-la-deriva~2, a-fondo-certificaciones-el-ai-300~2, a-fondo-lo-que-busco-contexto-controles-y-abstencion~2
- primer fragmento: «Desde julio de 2026 curso también la ruta correspondiente al examen AI-300, que completa el tercer componente de mi especialización; llevo 10 módulos. Mientras no haya aprobado el examen, debe presentarse como una certif…»

**☑️ ¿Ha trabajado con big data o procesamiento distribuido?**

- top-4: trayectoria-1, proyecto-vesting, a-fondo-vesting-la-arquitectura~1, casestudy-vesting
- primer fragmento: «2024: Líder de Estrategia de Datos, Vesting — startup de agentes de automatización. Ecosistema de datos para agentes de IA en Microsoft Fabric, desde cero: arquitectura, gobernanza, monitoreo de agentes en tiempo real y…»

**✅ ¿Ha construido pipelines de datos que corran solos?**

- top-4: a-fondo-transmilenio-cm-validaciones-en-el-pipeline~1, a-fondo-transmilenio-cm-validaciones-en-el-pipeline~2, a-fondo-agentes-en-produccion-la-segunda-trayectoria~1, a-fondo-vesting-la-arquitectura~2
- primer fragmento: «Incorporé validaciones en el ETL para identificar datos incompletos, duplicados, inconsistencias y relaciones que no cumplían las reglas esperadas: un servicio ejecutado sin programación que lo respaldara, una transacció…»

**☑️ ¿Qué hace para asegurar la calidad de los datos?**

- top-4: casestudy-cafam, a-fondo-origenes-iso-9001-la-primera-escuela~1, a-fondo-gobierno-de-datos-y-de-ia-gobernar-para-hacer-mas~2, a-fondo-procesos-y-simulacion-verificacion-y-validacion~1
- primer fragmento: «Cafam implementaba un WMS en su operación logística: un cambio de sistema crítico donde cada error de datos se paga en la bodega. Asegurar la calidad de la implementación coordinando al equipo de pruebas más grande que h…»

**✅ ¿Sabe de integración continua y despliegue automático?**

- top-4: a-fondo-plataforma-y-despliegue-ci-como-calidad~1, a-fondo-plataforma-y-despliegue-lo-que-despliego~2, a-fondo-plataforma-y-despliegue-lo-que-no-he-hecho~1, a-fondo-plataforma-y-despliegue-ci-como-calidad~3
- primer fragmento: «La integración continua funciona como un mecanismo de calidad y no únicamente como una automatización de despliegue. Antes de publicar, la solución debe superar los controles definidos para su código, comportamiento y ar…»

**✅ ¿Qué diferencia hay entre un data lake y un data warehouse para él?**

- top-4: a-fondo-fabric-en-la-practica-lago-y-almacen~2, a-fondo-vesting-la-arquitectura~1, a-fondo-fabric-en-la-practica-lago-y-almacen~1, a-fondo-fabric-en-la-practica-direct-lake-y-rls~1
- primer fragmento: «El warehouse cumplía una función complementaria. Permitía organizar información estructurada mediante un enfoque relacional, desarrollar transformaciones y vistas en T-SQL orientadas al análisis y responder con claridad…»

### bi-y-analitica

**✅ ¿Cómo logra que la gente use los tableros que construye?**

- top-4: a-fondo-bi-que-se-adopta-portafolio-de-tableros~1, a-fondo-apps-pipeline-procedencia-y-responsabilidad~1, a-fondo-apps-pipeline-agentes-investigaciones-tableros~1, a-fondo-banco-pichincha-programa-de-formacion~2
- primer fragmento: «La gestión de la adopción también exige observar el portafolio completo. Una organización puede tener productos individualmente correctos y, al mismo tiempo, ofrecer una experiencia fragmentada porque diferentes tableros…»

**✅ ¿Tiene experiencia en inteligencia de negocios?**

- top-4: a-fondo-bi-que-se-adopta-lo-que-demuestra~1, a-fondo-bi-que-se-adopta-lo-que-demuestra~2, a-fondo-vesting-por-que-sali-y-el-puente~1, a-fondo-banco-pichincha-elegir-el-instrumento~3
- primer fragmento: «Mi experiencia demuestra que la adopción no es una consecuencia accidental de construir un buen tablero. Es una condición que debe diseñarse desde la identificación del problema, sostenerse mediante datos y definiciones…»

**✅ ¿Cuántos usuarios han adoptado los tableros que ha hecho?**

- top-4: a-fondo-bi-que-se-adopta-ciclo-de-adopcion~2, a-fondo-plataforma-y-despliegue-lo-que-no-he-hecho~1, a-fondo-bi-que-se-adopta-pichincha-y-cm-consultores, a-fondo-bi-que-se-adopta-portafolio-de-tableros~2
- primer fragmento: «También debe existir una forma de retirar aquello que ya no aporta valor. Los tableros, páginas e indicadores que han perdido su propósito no deberían permanecer indefinidamente como opciones aparentemente vigentes. El e…»

**✅ ¿Ha desarrollado modelos predictivos?**

- top-4: a-fondo-analitica-predictiva-de-modelos-a-sistemas~1, a-fondo-banco-pichincha-modelos-predictivos~2, a-fondo-analitica-predictiva-de-modelos-a-sistemas~3, a-fondo-analitica-predictiva-de-modelos-a-sistemas~2
- primer fragmento: «La analítica predictiva constituye uno de los fundamentos de la inteligencia artificial empresarial, pero no agota su alcance. Un modelo produce una estimación, clasificación o prioridad. Una aplicación puede integrar es…»

**✅ ¿Qué herramientas usa para machine learning?**

- top-4: a-fondo-analitica-predictiva-las-herramientas~2, a-fondo-analitica-predictiva-las-herramientas~1, a-fondo-transmilenio-cm-lo-que-enseno-el-modelo~2, a-fondo-transmilenio-cm-lo-que-enseno-el-modelo~1
- primer fragmento: «Jupyter facilita la experimentación y la documentación del recorrido analítico. Sin embargo, no considero el notebook como el destino final de una solución. Es un espacio para explorar, comparar y aprender. Cuando el tra…»

**✅ ¿Qué tan avanzado es en Python?**

- top-4: a-fondo-analitica-predictiva-las-herramientas~1, a-fondo-certificaciones-las-de-ibm~2, a-fondo-analitica-predictiva-las-herramientas~2, a-fondo-certificaciones-las-de-ibm~1
- primer fragmento: «Los lenguajes de programación con los que trabajo son Python, R, SQL y DAX; el nivel más avanzado es Python. Python con scikit-learn constituye una de mis bases principales para desarrollar modelos predictivos. Es el ent…»

**✅ ¿En qué lenguajes de programación trabaja?**

- top-4: a-fondo-analitica-predictiva-las-herramientas~1, a-fondo-analitica-predictiva-las-herramientas~2, a-fondo-certificaciones-las-de-ibm~1, a-fondo-ceinfes-la-programacion-de-recursos~1
- primer fragmento: «Los lenguajes de programación con los que trabajo son Python, R, SQL y DAX; el nivel más avanzado es Python. Python con scikit-learn constituye una de mis bases principales para desarrollar modelos predictivos. Es el ent…»

**✅ ¿Tiene experiencia con R además de Python?**

- top-4: a-fondo-analitica-predictiva-las-herramientas~2, a-fondo-gobierno-de-datos-y-de-ia-experiencia-y-formacion~1, a-fondo-certificaciones-las-de-ibm~2, a-fondo-gobierno-de-datos-y-de-ia-experiencia-y-formacion~2
- primer fragmento: «Jupyter facilita la experimentación y la documentación del recorrido analítico. Sin embargo, no considero el notebook como el destino final de una solución. Es un espacio para explorar, comparar y aprender. Cuando el tra…»
- nota: Medido: «¿Programa en R?» NO funciona, y no es un hueco de contenido. La recuperación es léxica y descarta los términos de menos de tres letras para no llenar de ruido cada consulta; con «R» indexada, la expansión por prefijo trae «reglas», «resultado», «recuperación»… y el fragmento que sí habla de R pierde. Se probó y se revirtió. Una pregunta cuya única palabra con contenido es una letra suelta es invisible para este chat, y está declarado como límite conocido de ADR-010.

**☑️ ¿Qué base estadística tiene?**

- top-4: a-fondo-certificaciones-las-de-ibm~2, a-fondo-cm-operaciones-la-memoria-estadistica~1, a-fondo-analitica-predictiva-la-estadistica~3, a-fondo-analitica-predictiva-la-estadistica~1
- primer fragmento: «Python aportó la capacidad para convertir un problema analítico en un flujo reproducible. Me permitió avanzar desde la exploración y preparación de los datos hasta el entrenamiento y la evaluación de modelos. SQL proporc…»

**✅ ¿Ha hecho predicción de demanda?**

- top-4: a-fondo-transmilenio-cm-prediccion-de-demanda~2, a-fondo-transmilenio-cm-prediccion-de-demanda~1, a-fondo-analitica-predictiva-de-la-prediccion-a-la-decision~1, a-fondo-analitica-predictiva-demanda-transmilenio~1
- primer fragmento: «El horizonte mensual respondía a una necesidad concreta de planificación. El propósito no era anticipar únicamente el siguiente movimiento de la operación, sino proporcionar una perspectiva suficientemente amplia para aj…»

**✅ ¿Usa scikit-learn, pandas y numpy?**

- top-4: a-fondo-analitica-predictiva-nivel-por-herramienta~2, a-fondo-analitica-predictiva-nivel-por-herramienta~1, a-fondo-como-aprendo-ibm-y-las-rutas-en-curso~1, a-fondo-analitica-predictiva-lo-que-demuestra~2
- primer fragmento: «Estas herramientas no representan el mismo nivel de especialización ni cumplen la misma función. Python, scikit-learn, Pandas, NumPy y SQL ocupan un lugar central en mi práctica de modelado y preparación. R fortalece el…»

**☑️ ¿Qué precisión alcanzaron los modelos que puso en producción?**

- top-4: a-fondo-certificaciones-ibm-y-mis-dos-formaciones~2, a-fondo-banco-pichincha-modelos-predictivos~1, a-fondo-banco-pichincha-modelos-predictivos~2, a-fondo-analitica-predictiva-en-produccion~3
- primer fragmento: «El Diseño Industrial añadió una responsabilidad complementaria: los resultados debían hacerse comprensibles. La visualización no era un paso decorativo al final del análisis, sino una forma de estructurar la información…»

**✅ ¿Ha automatizado reportes o tareas repetitivas?**

- top-4: a-fondo-cm-operaciones-la-automatizacion~1, a-fondo-cm-operaciones-la-automatizacion~2, a-fondo-fabric-en-la-practica-automatizar-power-bi~1, casestudy-transmilenio-cm
- primer fragmento: «Implementé soluciones para automatizar actividades recurrentes de preparación, validación y consolidación de información, reduciendo la intervención manual y mejorando la consistencia del procesamiento. Las herramientas…»

### gobierno

**✅ ¿Tiene experiencia en gobierno de datos?**

- top-4: a-fondo-gobierno-de-datos-y-de-ia-experiencia-y-formacion~1, a-fondo-gobierno-de-datos-y-de-ia-experiencia-y-formacion~2, a-fondo-gobierno-de-datos-y-de-ia-tres-veces~1, a-fondo-gobierno-de-datos-y-de-ia-tres-veces~2
- primer fragmento: «Algunas posiciones de estrategia, arquitectura y gobierno de inteligencia artificial establecen una especialización o una maestría como requisito preferente. Mi formación académica está compuesta por Ingeniería Industria…»

**✅ ¿Conoce la norma ISO 42001?**

- top-4: a-fondo-gobierno-de-datos-y-de-ia-estrategia-iso-42001~1, a-fondo-gobierno-de-datos-y-de-ia-iso-42001~1, a-fondo-gobierno-de-datos-y-de-ia-iso-42001~2, a-fondo-procesos-y-simulacion-de-iso-9001-a-iso-42001
- primer fragmento: «Actualmente lidero la estrategia institucional de inteligencia artificial de la Fundación CTIC siguiendo los principios y requisitos de **UNE-ISO/IEC 42001:2025**, la adopción española de la norma internacional ISO/IEC 4…»

**✅ ¿Qué entiende por gobierno de inteligencia artificial?**

- top-4: a-fondo-gobierno-de-datos-y-de-ia-la-continuacion~1, a-fondo-gobierno-de-datos-y-de-ia-la-continuacion~2, a-fondo-gobierno-de-datos-y-de-ia-controles-en-ia~1, a-fondo-gobierno-de-datos-y-de-ia-estrategia-iso-42001~1
- primer fragmento: «El gobierno de la inteligencia artificial no reemplaza el gobierno de datos ni constituye un tema completamente separado. Lo amplía. Una solución de IA depende de información, conocimiento, modelos, herramientas, proveed…»

**✅ ¿Ha definido políticas, estándares o lineamientos de datos?**

- top-4: a-fondo-gobierno-de-datos-y-de-ia-gobierno-tecnico-e-institucional~1, a-fondo-gobierno-de-datos-y-de-ia-acceso-y-cambio~1, a-fondo-gobierno-de-datos-y-de-ia-acceso-y-cambio~2, a-fondo-gobierno-de-datos-y-de-ia-acceso-y-cambio~3
- primer fragmento: «El gobierno de inteligencia artificial fracasa cuando las políticas y la arquitectura se desarrollan por separado. Una política puede establecer transparencia, supervisión o trazabilidad, pero esos principios necesitan m…»

**✅ ¿Cómo maneja datos personales o sensibles?**

- top-4: a-fondo-gobierno-de-datos-y-de-ia-datos-personales~1, a-fondo-gobierno-de-datos-y-de-ia-datos-personales~3, a-fondo-gobierno-de-datos-y-de-ia-datos-personales~2, a-fondo-gobierno-de-datos-y-de-ia-gobierno-en-salud~1
- primer fragmento: «Con datos personales, las cinco preguntas tienen ley detrás. En Colombia, el derecho de **habeas data** y la **Ley 1581** de protección de datos personales fijan qué puede tratarse, con qué finalidad, con qué autorizació…»

**☑️ ¿Ha liderado iniciativas transversales en organizaciones grandes?**

- top-4: a-fondo-cafam-el-equipo-de-veinte~1, a-fondo-como-trabajo-adopcion-desafio-humano~2, a-fondo-gobierno-de-datos-y-de-ia-lo-transversal~1, a-fondo-como-trabajo-equipos-que-he-liderado~1
- primer fragmento: «Lideré un equipo mixto de veinte personas durante la fase de pruebas: catorce integrantes de Cafam y seis profesionales de Oracle, organización que acababa de comprar el producto y lo estaba implantando con sus propios e…»

**✅ ¿Conoce normas ISO y trabajo bajo estándares?**

- top-4: a-fondo-inglopres-cadena-e-iso~2, a-fondo-lo-que-busco-estrategia-y-gobierno-de-ia, a-fondo-gobierno-de-datos-y-de-ia-iso-42001~2, a-fondo-las-investigaciones-fatiga-y-balanceo
- primer fragmento: «Esta experiencia también consolidó mi afinidad por los estándares como instrumentos para convertir principios en sistemas de gestión verificables y sostenibles. Haber desarrollado desde temprano una forma de trabajo basa…»

**☑️ ¿Cómo asegura la trazabilidad de la información?**

- top-4: a-fondo-origenes-riesgos-y-datos-de-salud~2, a-fondo-vesting-trazabilidad-y-naturaleza-de-la-informacion~1, a-fondo-gobierno-de-datos-y-de-ia-que-es-gobernar~2, a-fondo-vesting-trazabilidad-y-naturaleza-de-la-informacion~2
- primer fragmento: «Un componente central de la estrategia consiste en asegurar la trazabilidad del ciclo de vida de las soluciones. Es necesario conocer qué necesidad originó cada iniciativa, qué fuentes utiliza, cómo transforma la informa…»

**✅ ¿Quién decide quién puede ver qué datos en sus plataformas?**

- top-4: a-fondo-gobierno-de-datos-y-de-ia-acceso-y-cambio~1, a-fondo-gobierno-de-datos-y-de-ia-acceso-y-cambio~3, a-fondo-gobierno-de-datos-y-de-ia-acceso-y-cambio~2, a-fondo-como-aprendo-como-decido-que-aprender
- primer fragmento: «La cuarta pregunta corresponde al acceso y al propósito: las **políticas**. No basta con establecer quién puede consultar un dato. También es necesario comprender para qué puede utilizarlo, qué nivel de detalle necesita…»

### procesos

**✅ ¿Sabe modelar procesos en BPMN?**

- top-4: a-fondo-procesos-y-simulacion-bizagi-en-la-practica~1, a-fondo-procesos-y-simulacion-bizagi-en-la-practica~3, a-fondo-procesos-y-simulacion-bizagi-en-la-practica~2, a-fondo-como-trabajo-modelar-el-proceso-en-bpmn~1
- primer fragmento: «He utilizado Bizagi y FlexSim en distintos momentos de mi trayectoria, y no siempre juntas: **Bizagi** en Inglopres, Ceinfes, Cafam y Banco Pichincha; **FlexSim** en Inglopres y Cafam. Las dos herramientas responden a ne…»

**✅ ¿Ha hecho simulación de procesos o de operaciones?**

- top-4: a-fondo-procesos-y-simulacion-flexsim-en-la-practica~3, a-fondo-procesos-y-simulacion-la-simulacion~1, a-fondo-procesos-y-simulacion-bizagi-en-la-practica~2, a-fondo-procesos-y-simulacion-construir-procesos~3
- primer fragmento: «En logística y gestión de almacenes, la simulación permitía razonar sobre movimientos, disponibilidad de recursos, secuencias, tiempos de atención y restricciones de capacidad. Una modificación podía reducir el tiempo de…»

**☑️ ¿Ha usado Bizagi o FlexSim?**

- top-4: a-fondo-cafam-proceso-bpmn-y-simulacion~2, a-fondo-cafam-proceso-bpmn-y-simulacion~1, a-fondo-procesos-y-simulacion-bizagi-en-la-practica~1, a-fondo-procesos-y-simulacion-verificacion-y-validacion~3
- primer fragmento: «Aquí se nota el ingeniero industrial que llegó a Cafam en octubre de 2020: primero el proceso, después el sistema. Esta misma combinación —BPMN con Bizagi para el proceso y simulación cuando el flujo lo amerita— la había…»

**✅ ¿Tiene experiencia en mejora continua y optimización de procesos?**

- top-4: a-fondo-inglopres-cadena-e-iso~2, a-fondo-ceinfes-gestion-por-procesos~2, a-fondo-procesos-y-simulacion-de-iso-9001-a-iso-42001, a-fondo-fabric-en-la-practica-ciclo-de-vida-analitico~2
- primer fragmento: «Esta experiencia también consolidó mi afinidad por los estándares como instrumentos para convertir principios en sistemas de gestión verificables y sostenibles. Haber desarrollado desde temprano una forma de trabajo basa…»

**☑️ ¿Ha trabajado con metodologías ágiles?**

- top-4: trayectoria-6, a-fondo-ceinfes-gestion-por-procesos~1, a-fondo-procesos-y-simulacion-lean-kanban-y-scrum~1, a-fondo-como-trabajo-personas-que-no-me-reportan~2
- primer fragmento: «2017 — 2018: Coordinador de Operaciones, Ceinfes. KPIs e informes a junta directiva; transición a gestión por procesos con métodos ágiles. KPIs de logística, RRHH y digitalización; informes a junta directiva. Transición…»

**✅ ¿Para qué le sirve la ingeniería industrial en un puesto de datos?**

- top-4: a-fondo-origenes-arquitectura-de-medicion~2, a-fondo-origenes-la-convergencia~1, a-fondo-origenes-por-que-industrial~1, a-fondo-origenes-la-ingenieria-y-la-ia~2
- primer fragmento: «Esta comprensión representa una de las bases de mi trabajo actual con ingeniería de datos, modelos semánticos y Power BI. Una solución analítica empresarial no comienza en la selección de visualizaciones. Comienza en la…»

### vitrina

**✅ ¿Qué ha construido por su cuenta, fuera del trabajo?**

- top-4: a-fondo-apps-pipeline-por-que-en-publico~1, a-fondo-apps-pipeline-por-que-en-publico~2, a-fondo-agentes-en-produccion-la-segunda-trayectoria~1, a-fondo-agentes-en-produccion-sistemas-de-trabajo~2
- primer fragmento: «Un currículum afirma; una pieza publicada demuestra. Esa es la razón principal por la que construyo en público: seis aplicaciones hermanas, más este sitio, y 32 piezas en total, todas fuera de mi trabajo y todas con su r…»

**☑️ ¿Cuántas aplicaciones ha publicado?**

- top-4: a-fondo-como-aprendo-evidencia-construido~1, a-fondo-apps-pipeline-las-seis-apps-en-cifras~1, a-fondo-ceinfes-la-programacion-de-recursos~2, a-fondo-agentes-en-produccion-la-segunda-trayectoria~1
- primer fragmento: «La evidencia más contundente de mi capacidad de aprendizaje se encuentra en lo que he construido, porque cada pieza puede examinarse y relacionarse con decisiones, pruebas y resultados concretos. Mi portafolio reúne seis…»

**✅ ¿Tiene código público o repositorios que se puedan revisar?**

- top-4: a-fondo-apps-pipeline-publicar-con-responsabilidad~2, a-fondo-apps-pipeline-como-se-construyen~2, a-fondo-apps-pipeline-publicar-con-responsabilidad~1, a-fondo-apps-pipeline-por-que-en-publico~1
- primer fragmento: «También procuro que los repositorios públicos no conviertan la transparencia en una vulnerabilidad. Las configuraciones sensibles se separan del código —los secretos viven solo en el archivo de entorno local, ignorado po…»

**✅ ¿Qué tableros ha publicado con datos abiertos?**

- top-4: a-fondo-los-tableros-datos-abiertos-reproducibles~2, a-fondo-los-tableros-datos-abiertos-reproducibles~3, a-fondo-los-tableros-fabric-y-los-tableros~1, a-fondo-los-tableros-energia-y-clima~1
- primer fragmento: «Las fuentes tienen nombre y dueño en cada ficha. El plan de cuentas completo de cada entidad vigilada que publica la Superintendencia Financiera, mes a mes. Los estados financieros que las sociedades reportan a la Superi…»

**✅ ¿Ha trabajado con datos abiertos o fuentes públicas?**

- top-4: a-fondo-los-tableros-datos-abiertos-reproducibles~3, a-fondo-los-tableros-datos-abiertos-reproducibles~2, a-fondo-los-tableros-energia-y-clima~1, a-fondo-los-tableros-que-demuestran~2
- primer fragmento: «Ninguna de esas fuentes está pensada para análisis integrado, y esa es la parte del trabajo que un tablero bonito esconde: el origen de banca trae dieciséis trampas medidas antes del modelo; el de empresas, nueve; el del…»

**✅ ¿Sabe leer estados financieros o datos contables?**

- top-4: a-fondo-los-tableros-banca-colombiana~1, a-fondo-los-tableros-los-seis~1, a-fondo-los-tableros-empresas-de-colombia~1, a-fondo-gobierno-de-datos-y-de-ia-estados-y-procedencia~1
- primer fragmento: «El primer tablero, Banca colombiana bajo la lupa, integra once años de estados financieros correspondientes a las 81 entidades de crédito vigiladas. La pieza permite analizar la evolución del sector, comparar institucion…»

**☑️ ¿Qué investigaciones ha hecho?**

- top-4: a-fondo-lo-que-busco-lo-que-no-he-hecho-y-el-portafolio~2, a-fondo-las-investigaciones-limites-del-vacio~1, a-fondo-las-investigaciones-congelar-el-criterio~1, a-fondo-plataforma-y-despliegue-lo-que-no-he-hecho~1
- primer fragmento: «También invito a examinar mi portafolio durante el proceso. Las 32 piezas —aplicaciones, agentes, investigaciones, tableros— y la propia plataforma de presentación, este sitio, permiten evaluar capacidades que un currícu…»

**✅ ¿Ha escrito artículos o papers?**

- top-4: a-fondo-las-investigaciones-lo-que-demuestran~2, a-fondo-las-investigaciones-que-son~1, a-fondo-las-investigaciones-harness-paper-computacional~1, a-fondo-las-investigaciones-tuberia-declarativa~2
- primer fragmento: «Demuestran capacidad para construir sistemas reutilizables. La tubería no depende de un artículo específico —tres papers de clases distintas y un diff vacío lo prueban— y los agentes no dependen de una única tarea. El ob…»

**✅ ¿Qué agentes tiene publicados en su portafolio?**

- top-4: a-fondo-agentes-en-produccion-la-segunda-trayectoria~1, a-fondo-agentes-en-produccion-la-segunda-trayectoria~2, a-fondo-apps-pipeline-agentes-investigaciones-tableros~1, a-fondo-como-aprendo-las-cuatro-familias
- primer fragmento: «La segunda trayectoria corresponde a ARKHÉ, mi propio ecosistema agéntico, y a los agentes publicados en CV Viva. Este trabajo no es una extensión de la arquitectura de Vesting ni una reproducción de sus componentes. Es…»

**✅ ¿Para qué sirven los trece agentes de la vitrina?**

- top-4: a-fondo-los-agentes-de-la-vitrina-conocimiento-uno-por-uno~2, a-fondo-los-agentes-de-la-vitrina-como-nace-un-agente~1, a-fondo-los-agentes-de-la-vitrina-que-son, a-fondo-los-agentes-de-la-vitrina-sellado-e-inicial~2
- primer fragmento: «**Experto Fiscal** (inicial, v1.0.0). Mantiene un gemelo de las finanzas del usuario en archivos suyos, calcula el impuesto estimado a la fecha, recorre las palancas legales que aplican a su caso y prepara lo que el cont…»

**✅ ¿Qué es un harness y cómo lo usa en sus agentes?**

- top-4: a-fondo-agentes-en-produccion-ecosistema-agentico-propio~1, a-fondo-los-agentes-de-la-vitrina-que-son, a-fondo-los-agentes-de-la-vitrina-como-nace-un-agente~2, a-fondo-lo-que-busco-arquitectura-agentica~2
- primer fragmento: «Mi trabajo propio evolucionó hacia ARKHÉ, un ecosistema agéntico avanzado que no reproduce la arquitectura utilizada en Vesting ni se limita a los agentes publicados individualmente en la vitrina. Es una estructura de ni…»

**✅ ¿Cómo controla la calidad de lo que producen sus agentes con Claude Code?**

- top-4: a-fondo-los-agentes-de-la-vitrina-lo-que-comparten, a-fondo-los-agentes-de-la-vitrina-como-nace-un-agente~1, a-fondo-agentes-en-produccion-controles-en-rojo~2, a-fondo-los-agentes-de-la-vitrina-que-son
- primer fragmento: «- **Gates humanos con token exacto.** Ningún agente cruza una puerta —encender una GPU, cerrar un sprint, integrar una ficha— sin la palabra literal de la persona. Entre 5 y 8 gates por agente. - **Carnadas.** Un control…»

**✅ ¿Cómo verifica las cifras que publica?**

- top-4: a-fondo-los-tableros-verificar-el-universo~1, a-fondo-los-tableros-verificar-el-universo~2, a-fondo-los-tableros-verificar-el-universo~3, a-fondo-los-tableros-formula-1~1
- primer fragmento: «Cuando la escala lo permite, ejecuto las validaciones sobre el universo completo incorporado al modelo y no únicamente sobre una muestra seleccionada. En los seis tableros lo permitió: las 7.779 combinaciones de la banca…»

**✅ ¿Con qué está hecha esta página web?**

- top-4: a-fondo-apps-pipeline-esta-misma-pagina~2, a-fondo-apps-pipeline-esta-misma-pagina~3, a-fondo-apps-pipeline-estados-honestos~1, a-fondo-apps-pipeline-estados-honestos~2
- primer fragmento: «El contenido se mantiene separado de la presentación y se administra mediante archivos estructurados y control de versiones: la trayectoria, los estudios, los logros, los proyectos, las certificaciones y las skills viven…»

**✅ ¿Sus aplicaciones tienen pruebas automatizadas?**

- top-4: a-fondo-como-aprendo-evidencia-construido~2, a-fondo-cafam-lo-que-ensenan-las-pruebas~2, a-fondo-como-aprendo-evidencia-construido~1, a-fondo-como-aprendo-evidencia-construido~3
- primer fragmento: «| Aplicación | Pruebas automatizadas | Cobertura | Decisiones (ADR) | Lo que exigió aprender | | ------------- | ---------------------- | --------: | ---------------: | ---------------------------------------------------…»

### encaje

**✅ ¿Qué tipo de rol está buscando?**

- top-4: a-fondo-lo-que-busco-plataformas-y-bi~2, a-fondo-plataforma-y-despliegue-el-mundo-microsoft~2, a-fondo-bi-que-se-adopta-el-rol-en-bi-y-analitica~2, a-fondo-lo-que-busco-los-roles-que-me-encajan~1
- primer fragmento: «El cuarto rol es el más cercano a ese oficio: liderazgo en BI y analítica, Power BI de extremo a extremo y equipos que lo adoptan. Es el rol que el DP-600 certifica y el que más veces he ejercido: en Banco Pichincha, con…»

**✅ ¿Está dispuesto a reubicarse a otro país?**

- top-4: a-fondo-lo-que-busco-condiciones~1, a-fondo-lo-que-busco-condiciones~2, a-fondo-rag-y-el-chat-umbral-medido~1, a-fondo-como-trabajo-responsable-del-negocio~2
- primer fragmento: «- Ubicación: resido en Bogotá, Colombia. Puedo trabajar de manera presencial, híbrida o remota según la naturaleza de la responsabilidad. - Reubicación: tengo disponibilidad para una reubicación nacional o internacional,…»

**✅ ¿Trabaja en remoto?**

- top-4: a-fondo-lo-que-busco-condiciones~1, a-fondo-lo-que-busco-trabajo-remoto-y-equipos-distribuidos, a-fondo-lo-que-busco-condiciones~2, contacto
- primer fragmento: «- Ubicación: resido en Bogotá, Colombia. Puedo trabajar de manera presencial, híbrida o remota según la naturaleza de la responsabilidad. - Reubicación: tengo disponibilidad para una reubicación nacional o internacional,…»

**✅ ¿Qué nivel de inglés tiene?**

- top-4: a-fondo-lo-que-busco-condiciones~1, a-fondo-analitica-predictiva-nivel-por-herramienta~2, a-fondo-plataforma-y-despliegue-siguiente-nivel-plataforma~2, a-fondo-analitica-predictiva-nivel-por-herramienta~1
- primer fragmento: «- Ubicación: resido en Bogotá, Colombia. Puedo trabajar de manera presencial, híbrida o remota según la naturaleza de la responsabilidad. - Reubicación: tengo disponibilidad para una reubicación nacional o internacional,…»

**✅ ¿En qué ciudad vive?**

- top-4: a-fondo-lo-que-busco-condiciones~1, casestudy-transmilenio-cm, a-fondo-origenes-los-tres-saltos~2, proyecto-transmilenio-cm
- primer fragmento: «- Ubicación: resido en Bogotá, Colombia. Puedo trabajar de manera presencial, híbrida o remota según la naturaleza de la responsabilidad. - Reubicación: tengo disponibilidad para una reubicación nacional o internacional,…»

**✅ ¿Ha vivido o estudiado fuera del país?**

- top-4: a-fondo-lo-que-busco-condiciones~1, a-fondo-los-tableros-ciclo-monetario~4, a-fondo-los-tableros-medidas-dax~2, a-fondo-rag-y-el-chat-fuera-de-alcance~1
- primer fragmento: «- Ubicación: resido en Bogotá, Colombia. Puedo trabajar de manera presencial, híbrida o remota según la naturaleza de la responsabilidad. - Reubicación: tengo disponibilidad para una reubicación nacional o internacional,…»

**✅ ¿Cómo lo contacto?**

- top-4: contacto, a-fondo-las-investigaciones-limites-del-vacio~1, a-fondo-los-agentes-de-la-vitrina-produccion-de-piezas~1, a-fondo-apps-pipeline-el-contrato-de-las-fichas~2
- primer fragmento: «Bogotá, Colombia · Abierto a reubicación internacional y trabajo remoto. Email: mauricio.hmrc@gmail.com. LinkedIn: https://www.linkedin.com/in/henry-mauricio-rincon · GitHub: https://github.com/mauriciorincon-ai»

**☑️ ¿Por qué debería contratarlo a él y no a otro?**

- top-4: a-fondo-rag-y-el-chat-umbral-medido~1, a-fondo-lo-que-busco-que-ofrezco~1, a-fondo-lo-que-busco-condiciones~1, a-fondo-lo-que-busco-que-ofrezco~3
- primer fragmento: «El umbral debe ser evaluado cuidadosamente. Si es demasiado bajo, preguntas irrelevantes pueden llegar al modelo. Si es demasiado alto, consultas válidas pueden rechazarse. Por eso su configuración se contrastó con pregu…»

**✅ ¿Qué lo motiva profesionalmente?**

- top-4: a-fondo-lo-que-busco-el-problema-que-quiero~2, a-fondo-lo-que-busco-el-problema-que-quiero~1, a-fondo-rag-y-el-chat-umbral-medido~1, a-fondo-como-aprendo-evidencia-certificaciones~1
- primer fragmento: «Mi interés no está limitado a demostrar que una tecnología funciona. Quiero construir sistemas capaces de producir valor de manera sostenida. Eso implica comprender el problema antes de seleccionar la herramienta, diseña…»

**☑️ ¿Cómo es trabajar con él en el día a día?**

- top-4: a-fondo-como-aprendo-como-aprendo-en-concreto~2, a-fondo-lo-que-busco-como-trabajo-con-quien-contrata~1, a-fondo-como-trabajo-capacidad-que-sobrevive~2, a-fondo-como-aprendo-como-aprendo-en-concreto~1
- primer fragmento: «No descarto tutoriales, artículos o comunidades, pero los utilizo como apoyo y no como autoridad final. Cuando dos explicaciones producen interpretaciones distintas, regreso a la fuente oficial, reproduzco el comportamie…»

**✅ ¿Cómo prefiere que sea el proceso de selección?**

- top-4: a-fondo-lo-que-busco-como-trabajo-con-quien-contrata~1, a-fondo-como-trabajo-process-mining-y-diagramas-vivos~1, a-fondo-origenes-la-leccion-de-arquitectura~2, a-fondo-lo-que-busco-como-trabajo-con-quien-contrata~2
- primer fragmento: «Prefiero una conversación sobre un problema real a una conversación limitada al recorrido de mi currículum. Mi trayectoria proporciona contexto, pero la mejor forma de evaluar mi capacidad es observar cómo comprendo una…»

**✅ ¿Qué haría en sus primeros noventa días en el puesto?**

- top-4: a-fondo-lo-que-busco-como-trabajo-con-quien-contrata~1, a-fondo-lo-que-busco-como-trabajo-con-quien-contrata~2, a-fondo-como-aprendo-incorporar-una-plataforma~1, a-fondo-como-aprendo-incorporar-una-plataforma~2
- primer fragmento: «Prefiero una conversación sobre un problema real a una conversación limitada al recorrido de mi currículum. Mi trayectoria proporciona contexto, pero la mejor forma de evaluar mi capacidad es observar cómo comprendo una…»

**✅ ¿Qué no ha hecho nunca y tendría que aprender?**

- top-4: a-fondo-plataforma-y-despliegue-lo-que-no-he-hecho~1, a-fondo-lo-que-busco-lo-que-no-he-hecho-y-el-portafolio~1, a-fondo-los-agentes-de-la-vitrina-aprendizaje~2, a-fondo-como-aprendo-incorporar-una-plataforma~1
- primer fragmento: «Google Cloud —Vertex AI, BigQuery, despliegue productivo en ese ecosistema— y contenedores en producción con Docker y Kubernetes no están en mi experiencia profesional. Mi mundo es Microsoft y en Microsoft es donde tengo…»

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
