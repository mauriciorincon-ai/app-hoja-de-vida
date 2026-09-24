---
slug: inglopres
codigo: AF-03
titulo: "Inglopres — Ingeniero de Procesos (2016–2017)"
resumen: "Mi primer empleo: un ERP (Odoo), las bases de datos que no existían, el estudio del trabajo y un equipo de doce personas con 95 % de satisfacción."
cuando_usar: "Úsalo cuando pregunten por su primer empleo al salir de la universidad, la implementación de un ERP (Odoo), la cadena de suministro y logística de maquinaria, el estudio de tiempos y el equipo de doce personas en Inglopres (2016–2017)."
estado: aprobado
ancla: "#trayectoria"
actualizado: 2026-09-20
preguntas_de_prueba:
  - "¿Qué hizo Henry en Inglopres?"
  - "¿Ha liderado la implementación de un ERP?"
  - "¿Cuál fue su primer empleo al salir de la universidad?"
---

<!--
⚠ PRIVACIDAD — LEE ESTO ANTES DE ESCRIBIR ⚠
Este repositorio es público y el chat cita este contenido a cualquier visitante.
NO escribas: datos confidenciales de empleadores o clientes, salarios, nombres
de terceros que no hayan aceptado aparecer, direcciones, teléfonos, correos ni
información personal sensible. La aduana del build caza lo mecánico (correos,
teléfonos, documentos, direcciones web); los NOMBRES PROPIOS no los caza un
regex — esos los decides tú.

CÓMO SE ESCRIBE ESTE ARCHIVO
- Prosa normal, en primera persona, en párrafos.
- Cada subsección empieza con un título `##` seguido de un comentario
  `<!-- seccion: id -->`. Esas son las ÚNICAS 2 marcas.
- `estado: borrador` → el chat NO lo indexa y no se le exige gemelo en inglés.
  `estado: aprobado` → el chat lo indexa y exige el gemelo `.en.md` completo,
  subsección por subsección.
- Ninguna cifra, fecha ni logro sin fuente. Lo que falte va como
  `[CONFIRMAR: qué falta]`, jamás relleno plausible.
- Guía completa: docs/MANUAL-DE-USO.md → «Cómo alimentar el a fondo».
-->

<!-- guía (viene del esqueleto de la historia, S3 — la escribió el dueño):
El detalle que no cabe en el timeline: cómo era la operación, qué
hacías día a día con el ERP y la cadena de suministro, anécdotas del equipo
de 12 personas, qué aprendiste. -->

## Mi primer empleo al salir de la universidad: la operación y el encargo

<!-- seccion: la-operacion -->

Ingresé a Inglopres en agosto de 2016, recién egresado de Ingeniería Industrial de la Pontificia Universidad Javeriana, para asumir mi primer empleo como Ingeniero de Procesos. Permanecí en la organización hasta junio de 2017: once meses que, vistos desde hoy, contienen el planteamiento de casi todo lo que he hecho después.

Inglopres se dedicaba al alquiler, la compra y la venta de maquinaria pesada para empresas y clientes individuales, con un parque de unas 120 unidades entre máquinas y vehículos. Era una operación intensiva en activos, en la que las decisiones comerciales dependían de la disponibilidad de los equipos, su estado, mantenimiento, ubicación, programación y capacidad para responder oportunamente a las necesidades de cada cliente. Cada venta o alquiler dependía de qué máquina estaba disponible, en qué estado, en qué obra y con qué mantenimiento pendiente. La pregunta del negocio no era comercial antes que operativa: era la misma pregunta.

Mi encargo consistía en comprender esa operación de extremo a extremo y contribuir a integrarla. Debía identificar cómo se conectaban las áreas, cómo circulaba la información, dónde aparecían esperas o reprocesos y qué controles necesitaba la organización para operar con mayor eficiencia y ofrecer un servicio más consistente. En la práctica eso significó cuatro cosas: mapear cómo se conectaban las áreas, seguir por dónde circulaba la información, ubicar dónde aparecían esperas y reprocesos, y proponer los controles que faltaban.

## El ERP: integrar lo que estaba suelto

<!-- seccion: el-erp -->

Lideré la implementación de un sistema de planificación de recursos empresariales, un ERP —Odoo, en una implementación nueva—, para integrar los procesos de la organización y fortalecer la coordinación entre sus áreas. Con él, Inglopres pasó de registros dispersos a un solo lugar. El propósito no era únicamente reemplazar registros dispersos por una plataforma, sino construir una visión compartida de la operación y mejorar la calidad de la información utilizada para gestionarla. El objetivo declarado era aumentar la eficiencia operativa y la consistencia del servicio; el objetivo real, más difícil, era que las áreas compartieran una misma versión de la operación. Con el ERP en marcha, la operación mejoró del orden de un 20 % en eficiencia —una estimación hecha hoy, porque la medición de entonces no la conservo—: menos reprocesos entre áreas y menos tiempo entre el pedido del cliente y la máquina en obra.

Esta experiencia me enseñó tempranamente que el software no integra una organización por sí solo. La verdadera integración ocurre cuando las áreas acuerdan qué significa cada dato, quién es responsable de producirlo, qué reglas determinan su transformación y cómo debe utilizarse a lo largo del proceso. Gran parte del trabajo más importante tuvo lugar antes de la primera pantalla, al convertir actividades, decisiones y excepciones en definiciones que el sistema pudiera representar. Un ERP no integra una organización: integra lo que la organización ya acordó, y expone lo que no.

Implementar el ERP también me permitió comprender que digitalizar un proceso sin revisarlo puede trasladar sus inconsistencias a la tecnología. Por eso, antes de configurar la solución, fue necesario hacer visible cómo funcionaba realmente la organización, diferenciar el proceso definido del proceso ejecutado y establecer una base común para integrar personas, activos, información y responsabilidades. El proceso ejecutado lo levanté preguntando y observando, no leyendo manuales, y lo modelé en BPMN con Bizagi, con sus actividades, sus decisiones y sus excepciones; con FlexSim simulé la operación para comparar alternativas antes de cambiarla. Ese dibujo fue lo que el ERP pudo representar; sin él, la herramienta habría copiado el desorden con otra interfaz.

## Las bases de datos que no existían: SQLite y SQL

<!-- seccion: las-bases-de-datos -->

Para evaluar los procesos necesitaba indicadores confiables, pero una parte importante de la información requerida no existía, no se capturaba de forma consistente o permanecía distribuida entre diferentes registros que nadie cruzaba. Me habían encargado mejorar la operación y descubrí que no podía hacerlo rigurosamente sin construir primero la información necesaria para medirla.

El ERP tenía su propia base de datos; la que faltaba era la del análisis. Diseñé e implementé en SQLite las estructuras de bases de datos para organizar los eventos operativos, cruzarlos, mejorar la precisión de los análisis y hacer posible el seguimiento de las métricas relevantes: definí las entidades, sus relaciones y las reglas que preservaban el significado de cada campo, y las consulté en SQL para producir los análisis. Este fue el punto en el que mi trayectoria comenzó a orientarse hacia los datos, no como un cambio deliberado de profesión, sino como una consecuencia natural del problema que necesitaba resolver.

Allí comprendí que un indicador confiable no comienza en un reporte. Comienza en la definición del proceso, en la captura correcta de sus eventos, en las relaciones entre sus entidades y en las reglas que preservan el significado de la información. Este aprendizaje se convirtió posteriormente en la base de mi trabajo con pipelines de datos, modelos semánticos, Power BI y plataformas analíticas empresariales.

También aprendí que la arquitectura de datos debe comenzar en la decisión que se quiere habilitar. El caso que mejor lo explica es la disponibilidad de una máquina. Para conocerla de verdad no bastaba con incluirla en un inventario: era necesario representar su estado operativo, su ubicación, su programación, su utilización y su condición de mantenimiento, y si falta una de las cinco, el indicador miente justo cuando el comercial lo necesita. La calidad del análisis dependía directamente de la fidelidad con la que los datos describieran la operación, no de la herramienta que los mostrara.

## El estudio del trabajo: tiempos y suplementos por fatiga

<!-- seccion: el-estudio-del-trabajo -->

El análisis de la operación me llevó a considerar las condiciones humanas bajo las cuales se ejecutaba el trabajo. Medir la operación me obligó a medir también el trabajo humano que la ejecutaba: hice estudio de tiempos formal sobre las actividades repetitivas de Inglopres —cronometraje, valoración del ritmo y cálculo del tiempo estándar—. Al estudiar tiempos, cargas y distribución de actividades, incorporé la consideración de holguras asociadas a la fatiga para evitar que un tiempo observado se convirtiera automáticamente en un estándar difícil de sostener.

La parte que un cronómetro no resuelve son precisamente esos suplementos por fatiga, las allowances del estudio del trabajo. Un tiempo observado no es un estándar: hay que añadirle el suplemento —tomado de la tabla de la OIT— que reconoce el esfuerzo, la repetitividad, las condiciones de ejecución y la variabilidad propia de una persona. Sin ese suplemento, el estándar se cumple una semana y se incumple el resto del año, y la culpa recae sobre quien ejecuta en vez de sobre quien midió. Comprendí que medir productividad exige considerar el esfuerzo, la repetitividad, las condiciones de ejecución y la variabilidad propia del trabajo humano.

Este aprendizaje fue importante porque me enseñó a no interpretar los indicadores fuera de su contexto. Una mejora aparente en velocidad puede producir más errores, aumentar el reproceso o trasladar una carga excesiva hacia otra parte del sistema. De ahí salió un criterio que sigo usando: una mejora en velocidad no es, por sí sola, una mejora. Optimizar no consiste en maximizar aisladamente una métrica, sino en encontrar un equilibrio sostenible entre capacidad, calidad, costo, servicio y condiciones de trabajo, y eso exige mirar los cinco a la vez.

Es el mismo problema que años después convertí en una de las siete investigaciones que publico: la de suplementos por fatiga y balanceo de línea, que revisa los métodos con los que se derivan esos suplementos y prueba, sobre un modelo de balanceo, que calibrarlos cambia el resultado.

## Cadena de suministro: costos, tiempo de respuesta y disponibilidad

<!-- seccion: cadena-de-suministro -->

También lideré iniciativas de optimización de la cadena de suministro orientadas a reducir costos operativos, fortalecer la coordinación de recursos y asegurar el cumplimiento de los requisitos asociados con la norma ISO 9001:2015. Esta responsabilidad amplió mi visión desde el desempeño de actividades individuales hacia la forma en que proveedores, recursos, información y controles determinaban conjuntamente la calidad del servicio.

En una operación de maquinaria pesada como la de Inglopres, la cadena de suministro se juega en tres variables. El tiempo de respuesta, desde que un cliente pide hasta que el equipo está en obra. El nivel de servicio que la empresa logra sostener frente a sus compromisos. Y la disponibilidad del parque, que depende del mantenimiento tanto como de la programación: una máquina en taller y una máquina mal programada producen el mismo incumplimiento, aunque tengan causas distintas y responsables distintos.

Mejorar cualquiera de las tres exigía la misma información que había tenido que construir para los indicadores: el estado real de cada unidad, su ubicación y su programación. Fue la primera vez que vi la cadena completa —proveedores, mantenimiento, programación, entrega— como un solo sistema medido con los mismos datos, y esa mirada es la que años después apliqué a un centro de distribución de medicamentos en Cafam.

## ISO 9001:2015, la primera escuela de trazabilidad y rigor documental

<!-- seccion: cadena-e-iso -->

La norma ISO 9001:2015 fue mi primera escuela formal de trazabilidad y rigor documental. No bastaba con que un proceso funcionara. Era necesario definir cómo debía funcionar, quién respondía por cada actividad, qué controles se aplicaban y qué evidencia permitía demostrar el cumplimiento. Aprendí que la calidad no debe depender de la memoria de las personas, sino de una forma de trabajo que pueda ser comprendida, verificada y repetida. De ahí salió el hábito que no he soltado: lo hecho deja rastro escrito.

Esta experiencia también consolidó mi afinidad por los estándares como instrumentos para convertir principios en sistemas de gestión verificables y sostenibles. Haber desarrollado desde temprano una forma de trabajo basada en procesos, responsabilidades, controles, evidencia y mejora continua me ha facilitado incorporar actualmente los principios y requisitos de ISO/IEC 42001 en el liderazgo de la estrategia de inteligencia artificial, trasladando ese mismo rigor al gobierno, la evaluación de riesgos y la gestión responsable de las soluciones de IA. Las dos normas comparten la estructura de alto nivel de los sistemas de gestión ISO, así que lo aprendido en 2016 con una sirvió en 2025 para la otra.

Esa disciplina continúa presente en todo lo que construyo. Hoy la aplico en la trazabilidad de pipelines y modelos semánticos, en la documentación de aplicaciones y en la evaluación de soluciones y agentes de inteligencia artificial. Un dato debe conservar su procedencia, una transformación debe poder reproducirse y una respuesta generada mediante IA debe distinguir claramente entre aquello que proviene de una fuente, lo que fue calculado, lo que fue inferido y aquello que no se puede sostener con evidencia.

## El equipo de doce y el 95 % de satisfacción del cliente

<!-- seccion: el-equipo-de-doce -->

En esta primera experiencia también lideré un equipo de doce personas, operarios y técnicos. La gestión del trabajo, la asignación clara de responsabilidades y el seguimiento de los compromisos contribuyeron a alcanzar una tasa de satisfacción del cliente del 95 %, medida en encuesta a los clientes de Inglopres.

El resultado no provino de incrementar el control, sino de definir mejor el trabajo, hacer visibles las prioridades y convertir el seguimiento en un mecanismo de coordinación. Cuatro cosas tenían que estar claras para cada persona: qué resultado se esperaba, quién respondía por él, con qué información contaba y qué significaba que algo estuviera terminado. Cuando esas cuatro están claras, la supervisión deja de ser el mecanismo y pasa a serlo la coordinación.

Con operarios y técnicos, además, la claridad tenía una forma concreta: el estándar de tiempo que habíamos construido con el estudio del trabajo era el mismo con el que se asignaba y se seguía la tarea. Un estándar que reconocía la fatiga era un estándar que el equipo podía cumplir y defender, y eso hizo más por la coordinación que cualquier reunión de seguimiento.

## Cómo aprendí a liderar: reducir la ambigüedad, no vigilar la actividad

<!-- seccion: como-aprendi-a-liderar -->

Fue mi primera oportunidad para comprender que liderar no consiste en supervisar constantemente la actividad, sino en reducir la ambigüedad que impide ejecutar bien. Cuando las personas entienden qué resultado se espera, cuál es su responsabilidad, de qué información disponen y qué significa que una tarea esté realmente terminada, pueden trabajar con mayor autonomía y responder con más consistencia.

Esta experiencia estableció la base de mi estilo de liderazgo actual: claridad en el propósito, responsabilidades explícitas, avance observable, autonomía proporcional a la capacidad y responsabilidad compartida sobre el resultado. Es el mismo estilo con el que después dirigí el equipo de pruebas de 20 personas en Cafam y el equipo de cinco en Banco Pichincha; cambió el tamaño y el oficio, no el principio.

También comprendí que una operación no mejora de manera sostenible cuando el conocimiento permanece concentrado en una sola persona. Los procesos, criterios y controles deben quedar suficientemente claros para que el equipo pueda ejecutarlos, cuestionarlos y mejorarlos. Este principio continúa guiando la forma en que hoy lidero iniciativas de datos e inteligencia artificial: mi objetivo no es convertirme en el punto obligatorio de todas las decisiones, sino construir equipos y capacidades que puedan avanzar con criterio incluso cuando no estoy presente. En Inglopres eso se probaba con doce personas; hoy se prueba con un proceso documentado que otro puede ejecutar sin mí.

## Lo que dejó este primer trabajo

<!-- seccion: lo-que-dejo -->

Vista en retrospectiva, Inglopres reunió, en once meses, los fundamentos de todo lo que construiría después. Allí aprendí a comprender una operación como sistema, traducir procesos en estructuras de información, integrar áreas mediante tecnología, medir con atención al contexto, gestionar con evidencia y liderar desde la claridad. Todavía no hablaba de modelos semánticos, plataformas analíticas o arquitecturas de inteligencia artificial, pero ya trabajaba sobre los problemas que esas capacidades me permitirían abordar posteriormente con mayor profundidad y escala.

El inventario de ese año es concreto: un ERP implementado desde cero, una base de datos de análisis en SQLite que no existía, el proceso modelado en BPMN y simulado antes de cambiarlo, un estudio de tiempos con suplementos por fatiga, una cadena de suministro medida con sus tres variables, la calidad bajo ISO 9001:2015 y un equipo de doce con un 95 % de satisfacción del cliente.

El problema que resolvía en 2016 —que la decisión necesitaba un dato que nadie había construido— es exactamente el mismo que resuelvo hoy, con otras herramientas y otra escala.
