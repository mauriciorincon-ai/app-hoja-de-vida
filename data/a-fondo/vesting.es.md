---
slug: vesting
titulo: "Vesting — la plataforma de datos para agentes de IA (2023–2025)"
resumen: "Microsoft Fabric desde cero, el monitoreo de agentes en producción y el proceso core replicable."
estado: borrador
ancla: "/proyectos/vesting"
actualizado: 2026-09-12
preguntas_de_prueba:
  - "¿Cómo diseñó Henry el ecosistema de datos de Vesting?"
  - "¿Qué es el proceso core replicable de agentes?"
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
Tu historia estrella: cómo se diseña un ecosistema de datos desde
cero en Microsoft Fabric, decisiones de arquitectura y por qué, cómo se
monitorea un agente de IA en producción, qué es el proceso core replicable. -->

## Una startup de agentes sin una plataforma común para sus datos

<!-- seccion: el-contexto -->

Ingresé a Vesting en agosto de 2023 como Líder de Estrategia de Datos y permanecí en la organización hasta enero de 2025. La empresa desarrollaba agentes de automatización y necesitaba fortalecer la infraestructura necesaria para comprender su comportamiento, integrar la información producida por sus soluciones y convertir esa información en una capacidad útil para producto, operaciones y toma de decisiones.

El desafío tenía una naturaleza diferente a los que había enfrentado anteriormente. Ya no se trataba únicamente de analizar un proceso ejecutado por personas o registrado por una aplicación empresarial. Los agentes generaban eventos mientras interactuaban con usuarios, consultaban información, utilizaban servicios y producían resultados. Para comprender su funcionamiento era necesario capturar esa actividad, estructurarla y conservar el contexto suficiente para reconstruir lo ocurrido.

La información se encontraba distribuida entre diferentes integraciones y no existía una plataforma común que permitiera analizarla de manera consistente. Cada nueva solución podía introducir estructuras, eventos y necesidades particulares. Sin una base compartida, el crecimiento aumentaba la dependencia de desarrollos individuales, dificultaba la comparación entre agentes y reducía la capacidad para observar su comportamiento en producción.

Mi responsabilidad consistió en diseñar desde cero una estrategia de datos que permitiera integrar esa información, establecer estructuras comunes y construir las bases analíticas necesarias para monitorear los agentes. El objetivo no era solamente almacenar eventos, sino convertirlos en evidencia sobre disponibilidad, utilización, tiempos de respuesta, excepciones, costos y comportamiento operativo.

La principal tensión estaba entre velocidad y sostenibilidad. Una startup necesita experimentar, incorporar clientes y ajustar sus soluciones con rapidez, pero cada integración aislada aumenta la deuda técnica y hace más difícil mantener una visión común. Mi enfoque fue construir el nivel mínimo de estandarización necesario para conservar la agilidad sin renunciar a la trazabilidad, la calidad y la posibilidad de reutilizar lo ya aprendido.

Esto exigía distinguir entre aquello que debía ser común y aquello que debía permanecer configurable. Los eventos fundamentales, los identificadores, los estados y las métricas necesitaban definiciones compartidas. Las particularidades de cada cliente o agente debían incorporarse sin obligar a rediseñar toda la plataforma. Esa separación fue esencial para pasar de una colección de integraciones a una capacidad de datos que pudiera evolucionar.

## La arquitectura de datos en Microsoft Fabric

<!-- seccion: la-arquitectura -->

Diseñé e implementé en Microsoft Fabric un ecosistema de datos orientado a integrar, transformar y analizar la información generada por los agentes. La plataforma debía conectar capacidades de almacenamiento, procesamiento, modelado y consumo analítico, reduciendo la fragmentación entre componentes y facilitando la construcción de una visión completa de la operación.

La arquitectura debía responder a dos necesidades simultáneas. La primera era histórica: conservar los eventos necesarios para analizar tendencias, reconstruir sesiones y comparar el comportamiento de los agentes a lo largo del tiempo. La segunda era operacional: ofrecer información suficientemente oportuna para identificar fallas, variaciones o condiciones que requirieran atención mientras todavía existía la posibilidad de intervenir.

Diseñé pipelines para recibir y preparar información procedente de diferentes integraciones. Cada flujo debía validar su estructura, organizar los eventos, conservar los identificadores necesarios para mantener el contexto y transformar los datos en entidades que pudieran ser comprendidas por los equipos de negocio y producto. El propósito era evitar que la lógica de cada integración quedara aislada o dependiera exclusivamente de quien la había construido.

La normalización temprana fue una decisión relevante. Aunque los agentes podían tener propósitos y comportamientos distintos, compartían elementos observables como interacciones, sesiones, tiempos, estados, respuestas, errores y utilización de recursos. Construir una representación común de esos eventos permitió desarrollar métricas comparables y reducir la necesidad de reconstruir la lógica analítica para cada solución.

También fue necesario conservar el detalle sin deteriorar la experiencia de consulta. Los eventos ofrecían la mayor capacidad de explicación, pero los equipos necesitaban métricas agregadas para observar tendencias y condiciones generales. La arquitectura debía permitir avanzar desde una visión ejecutiva hacia el evento que sustentaba el resultado, manteniendo un equilibrio entre rendimiento, granularidad y trazabilidad.

Power BI se convirtió en la capa mediante la cual producto y operaciones podían utilizar esa información. Los modelos semánticos organizaban los eventos técnicos en conceptos comprensibles y permitían analizar agentes, clientes, sesiones, periodos y resultados desde una base común. La visualización no era el fin de la arquitectura, sino el punto en el que la complejidad técnica se convertía en una capacidad de observación y decisión.

Esta experiencia amplió mi comprensión de Microsoft Fabric como plataforma empresarial. Su valor no estaba únicamente en reunir tecnologías, sino en permitir que ingestión, transformación, almacenamiento, modelado y análisis se diseñaran como partes de un mismo recorrido. Mi trabajo consistió en dar coherencia a ese recorrido y asegurar que los datos conservaran su significado desde el evento generado por el agente hasta el indicador utilizado para evaluarlo.

## Gobernanza desde el diseño

<!-- seccion: la-gobernanza -->

La gobernanza debía incorporarse desde el comienzo porque la plataforma integraba información producida por soluciones asociadas con diferentes clientes y contextos. Esperar hasta el final para resolver la propiedad, los permisos o la trazabilidad habría convertido cada integración en una excepción difícil de mantener.

Mi enfoque fue pragmático. La gobernanza no debía transformarse en una capa burocrática que impidiera experimentar, pero tampoco podía dejarse para una etapa futura. Era necesario establecer un conjunto mínimo de reglas que permitiera reconocer qué información ingresaba, a quién pertenecía, qué significado tenía, cómo se transformaba y quién estaba autorizado para utilizarla.

La estandarización de los eventos cumplía una función de gobierno además de una función técnica. Definir estructuras comunes permitía validar la información desde su ingreso, identificar campos obligatorios y hacer visibles las excepciones. Cuando una integración no cumplía las condiciones esperadas, la desviación podía ser identificada y tratada en lugar de avanzar silenciosamente hacia los productos analíticos.

También procuré que las transformaciones fueran comprensibles y reproducibles. Una métrica sobre el desempeño de un agente debía conservar una relación clara con los eventos utilizados para calcularla. Esta trazabilidad era indispensable para investigar comportamientos, explicar resultados y distinguir si una desviación se originaba en el agente, en la integración, en los datos o en la lógica analítica.

La separación de la información por cliente y contexto debía formar parte del diseño de los flujos y modelos. No bastaba con almacenar todo en un mismo ecosistema y resolver posteriormente quién podía consultarlo. La arquitectura necesitaba preservar los identificadores y las relaciones requeridas para controlar el consumo, evitar interpretaciones equivocadas y mantener la responsabilidad sobre cada conjunto de información.

También comprendí que gobernar una plataforma de agentes exige reconocer que no toda la información tiene la misma naturaleza. Un evento técnico, un dato suministrado por un usuario, una respuesta generada y una acción ejecutada requieren tratamientos distintos. Conservar esa distinción permite interpretar mejor lo ocurrido y evita presentar como hecho verificable aquello que fue producido mediante generación o inferencia.

La gobernanza se convirtió así en una propiedad de la arquitectura y no en una revisión posterior. Cada integración debía conservar identidad, procedencia, contexto y responsabilidad desde el ingreso de la información. Este principio permitiría posteriormente ampliar el alcance del gobierno desde los datos utilizados por los agentes hacia las decisiones, recomendaciones y acciones producidas por ellos.

## Monitorear agentes de inteligencia artificial en producción

<!-- seccion: monitoreo-de-agentes -->

Uno de los principales objetivos del ecosistema de datos fue establecer la capacidad de monitorear agentes en producción. La observabilidad debía responder una pregunta más profunda que verificar si una aplicación estaba disponible. Necesitábamos comprender qué estaba ocurriendo durante las interacciones, cómo se comportaban los agentes y en qué condiciones aparecían errores, demoras o resultados inesperados.

Para hacerlo, estructuré la captura de eventos asociados con sesiones, solicitudes, respuestas, tiempos de procesamiento, estados y excepciones. Cuando el contexto lo permitía, esta información podía complementarse con la versión de la solución, la integración utilizada y otros elementos necesarios para analizar diferencias de comportamiento.

La sesión se convirtió en una unidad de análisis especialmente importante. Observar eventos aislados permitía identificar fallas puntuales, pero reconstruir una secuencia completa facilitaba comprender cómo una interacción había evolucionado, en qué momento se había desviado y qué componentes habían participado. Esta capacidad resultaba esencial para depurar problemas y explicar comportamientos que no podían interpretarse mediante un único registro.

El monitoreo debía integrar varias dimensiones. La primera era operativa e incluía disponibilidad, volumen, errores y tiempos de respuesta. La segunda se relacionaba con el uso y permitía conocer cómo se distribuían las interacciones entre agentes, clientes y periodos. La tercera correspondía a los recursos consumidos y ayudaba a comprender el costo relacionado con la operación de las soluciones.

También era necesario acercarse a la calidad funcional. Las métricas técnicas podían demostrar que el agente había respondido, pero no necesariamente que la respuesta había sido útil o que la acción correspondía con el propósito esperado. Este reto me permitió comprender que la evaluación de un agente necesita conectar telemetría, contexto, resultados y retroalimentación humana.

La adopción debía formar parte de esa validación. Un agente podía responder correctamente en un entorno de prueba y, aun así, no integrarse en la operación si las personas no comprendían su propósito, desconfiaban de sus resultados o no sabían cuándo utilizarlo. Por eso, la implementación tamnbién requería definir cómo se introduciría la solución en el trabajo cotidiano, qué responsabilidades conservarían los usuarios y cómo se recogería la retroalimentación necesaria para mejorarla.

Un agente disponible puede responder de forma incorrecta. Un agente preciso puede resultar demasiado lento para el proceso. Una respuesta útil puede tener un costo desproporcionado. Una automatización eficiente puede producir riesgos si actúa fuera de sus límites. La observabilidad debía permitir analizar estas dimensiones conjuntamente y evitar que una única métrica se convirtiera en una representación incompleta de la solución.

Los tableros operativos hicieron visible esta información para los responsables de producto y operación. Su propósito era facilitar la identificación de condiciones relevantes y permitir que una anomalía pudiera recorrerse hasta los eventos asociados. La plataforma no eliminaba la necesidad de investigación, pero reducía la distancia entre detectar un problema y disponer de evidencia para comprenderlo.

Esta experiencia transformó mi concepto de inteligencia de negocios. El tablero ya no describía únicamente procesos empresariales ejecutados por personas. También permitía observar sistemas inteligentes que participaban activamente en esos procesos. Power BI y Microsoft Fabric se convirtieron en componentes de una arquitectura de confianza para la inteligencia artificial, al proporcionar trazabilidad, seguimiento y evidencia sobre su comportamiento.

## De los procesos a la especificación del agente

<!-- seccion: especificacion-del-agente -->

El desarrollo de agentes hizo visible una dificultad que no siempre aparece en las primeras conversaciones con el negocio: comprender un proceso no equivale todavía a contar con una especificación suficiente para implementarlo. Un diagrama puede mostrar la secuencia general de actividades, pero normalmente no contiene todo lo que una solución necesita para comportarse de manera consistente frente a diferentes entradas, condiciones y excepciones.

Para reducir esa distancia, comencé a analizar cada actividad como una unidad funcional. Era necesario establecer qué información recibía, qué propósito cumplía, qué reglas debía aplicar, qué fuentes podía consultar, qué herramientas podía utilizar, qué resultado debía producir y bajo qué condiciones debía detenerse o solicitar intervención humana. Esta descomposición permitía transformar una expectativa general en un comportamiento implementable y posteriormente evaluable.

La especificación también debía diferenciar entre conocimiento, decisión y acción. Algunas actividades requerían recuperar o sintetizar información. Otras implicaban interpretar una situación y formular una recomendación. Determinadas tareas podían ejecutarse mediante una herramienta, mientras que otras debían permanecer bajo responsabilidad humana. Esta distinción permitía asignar el nivel de autonomía de acuerdo con el propósito, el riesgo y la posibilidad de verificar el resultado.

También era necesario describir las excepciones. Una solución no está completamente especificada si solo se define su comportamiento en condiciones ideales. El agente debía reconocer cuándo faltaba información, cuándo existían resultados contradictorios, cuándo una herramienta no estaba disponible y cuándo la consecuencia de una acción exigía validación adicional. Saber abstenerse o transferir el control era tan importante como completar correctamente una tarea.

Este enfoque fortaleció la trazabilidad entre el proceso, los datos y la solución tecnológica. Cada comportamiento esperado podía relacionarse con una necesidad del negocio, una fuente de información, una regla, una herramienta y un criterio de aceptación. Así, la evaluación dejaba de depender únicamente de si la respuesta parecía adecuada y comenzaba a contrastarse con una especificación previamente acordada.

Esta disciplina se convirtió en la antesala del proceso central replicable. Antes de estandarizar cómo construir agentes, era necesario establecer una forma consistente de expresar qué debía hacer cada uno, qué límites debía respetar y qué evidencia permitiría determinar si estaba cumpliendo su propósito.

## El proceso central para diseñar e implementar agentes

<!-- seccion: el-proceso-core -->

Además de construir el ecosistema de datos, estructuré y validé el proceso central utilizado para diseñar e implementar agentes de inteligencia artificial. El objetivo era evitar que cada iniciativa comenzara desde cero y dependiera exclusivamente del conocimiento informal de las personas que habían participado en implementaciones anteriores.

Comprendí que el verdadero activo no era un agente particular, sino la capacidad de construir el siguiente con mayor claridad, consistencia y control. Para conseguirlo, era necesario definir un recorrido común desde la comprensión del problema hasta la operación de la solución, incluyendo criterios de aceptación y responsabilidades en cada etapa.

El proceso comenzaba con la definición del caso de uso. Antes de seleccionar modelos o diseñar interacciones, era necesario comprender qué problema debía resolverse, quién utilizaría la solución, qué información requería, qué acción esperaba habilitar y cómo se determinaría si el resultado era útil. Esta etapa evitaba iniciar el desarrollo desde la tecnología y obligaba a establecer primero el propósito empresarial.

La siguiente responsabilidad consistía en especificar cómo debía funcionar la solución. Un diagrama general del proceso no siempre contenía suficiente información para construir un agente. Cada actividad debía analizarse en términos de sus entradas, propósito, reglas, fuentes, herramientas, salidas y excepciones. Esta descomposición reducía la distancia entre la expectativa del negocio y el comportamiento finalmente implementado.

También era necesario delimitar la autonomía. No todas las actividades debían ser ejecutadas directamente por el agente. Algunas podían limitarse a recuperar y sintetizar información. Otras podían generar recomendaciones para validación humana. Solo determinadas tareas debían permitir una ejecución más autónoma, siempre dentro de límites conocidos y con evidencia suficiente sobre las acciones realizadas.

La validación debía abarcar tanto el funcionamiento técnico como el resultado empresarial. Era necesario comprobar que las integraciones respondieran correctamente, que las fuentes fueran accesibles, que las salidas conservaran la estructura esperada y que las excepciones pudieran ser identificadas. También debía evaluarse si la solución cumplía el propósito para el cual había sido diseñada.

Para cada iniciativa era necesario acordar desde el comienzo qué significaba que el agente estuviera terminado. No bastaba con demostrar una conversación correcta o una integración funcional. La solución debía cumplir sus criterios de comportamiento, utilizar las fuentes y herramientas autorizadas, gestionar adecuadamente las excepciones, conservar evidencia suficiente para su seguimiento y contar con responsables para su operación. La definición de terminado convertía expectativas generales en condiciones verificables y evitaba confundir una demostración convincente con una capacidad preparada para utilizarse.

La adopción debía formar parte de esa validación. Un agente podía responder correctamente en un entorno de prueba y, aun así, no integrarse en la operación si las personas no comprendían su propósito, desconfiaban de sus resultados o no sabían cuándo utilizarlo. Por eso, la implementación también requería definir cómo se introduciría la solución en el trabajo cotidiano, qué responsabilidades conservarían los usuarios y cómo se recogería la retroalimentación necesaria para mejorarla.

La interacción entre las personas y el agente debía diseñarse con la misma atención que la arquitectura técnica. Era necesario evitar tanto la confianza automática como el rechazo preventivo. La solución debía comunicar con claridad qué podía hacer, qué información utilizaba, cuáles eran sus límites y en qué situaciones necesitaba apoyo o validación humana. La adopción responsable no consiste en conseguir que las personas acepten todas las respuestas, sino en que aprendan a utilizar la capacidad con el nivel apropiado de criterio y supervisión.

La puesta en producción no representaba el final del proceso. Un agente debía permanecer observable y contar con mecanismos para incorporar aprendizajes derivados de su utilización. Los datos capturados durante la operación permitían reconocer errores recurrentes, diferencias entre contextos y oportunidades para mejorar instrucciones, integraciones o reglas.

Para hacer este proceso replicable, trabajé en su documentación y en la creación de una estructura que pudiera ser utilizada en futuras implementaciones. La finalidad no era establecer una receta rígida, sino preservar los aprendizajes comunes y reducir la dependencia de decisiones improvisadas.

Esta experiencia me enseñó una diferencia esencial entre desarrollar una solución y construir una capacidad. Una solución resuelve un caso. Una capacidad permite resolver nuevos casos utilizando procesos, criterios y componentes que la organización ya comprende y puede mejorar.

## Del agente individual a la arquitectura empresarial de IA

<!-- seccion: del-agente-a-la-arquitectura -->

A medida que avanzaba el trabajo, comprendí que los agentes no debían analizarse como aplicaciones aisladas. Cada uno dependía de datos, fuentes de conocimiento, servicios, herramientas, identidades, reglas, mecanismos de evaluación y personas responsables de supervisar determinados resultados. La calidad del agente dependía de la arquitectura completa en la que estaba integrado.

Esta comprensión amplió mi trabajo desde la estrategia de datos hacia una visión de arquitectura empresarial de inteligencia artificial. La plataforma de datos proporcionaba evidencia y observabilidad. Los modelos aportaban capacidades de interpretación o generación. Las integraciones permitían interactuar con otros sistemas. Las reglas delimitaban la actuación. La intervención humana protegía las decisiones que no debían delegarse completamente.

También identifiqué un problema recurrente: cada nueva iniciativa podía comenzar sin memoria de las anteriores. Cuando los aprendizajes sobre integración, monitoreo, evaluación o manejo de excepciones permanecían únicamente en las personas, la organización repetía errores y aumentaba el costo de cada implementación. Construir arquitectura significaba convertir esos aprendizajes en elementos reutilizables.

La reutilización no debía limitarse al código. También podía expresarse en definiciones de eventos, patrones de integración, criterios de evaluación, estructuras de monitoreo, formas de especificar procesos y principios para determinar el nivel adecuado de autonomía. Estos activos reducían la incertidumbre y permitían que las siguientes soluciones comenzaran desde una base más madura.

Así comenzó a consolidarse una visión que posteriormente profundizaría: la arquitectura de IA no es una selección de tecnologías ni una colección de agentes. Es un sistema de capacidades que conecta propósito, procesos, datos, conocimiento, modelos, herramientas, evaluación, observabilidad, gobierno y responsabilidad humana.

## El puente que esta experiencia construyó

<!-- seccion: el-puente -->

Vesting fue la experiencia en la que convergieron de manera más clara mis conocimientos en ingeniería de procesos, datos, inteligencia de negocios e inteligencia artificial. Por primera vez diseñaba un ecosistema de datos cuyo objeto de observación no era únicamente la operación de una organización, sino el comportamiento de agentes capaces de utilizar información y participar activamente en sus procesos.

La ingeniería de datos proporcionó los pipelines, la estructura y la trazabilidad necesarias para conservar los eventos. El modelado analítico permitió convertir esos eventos en conceptos y métricas comprensibles. Power BI acercó esa información a producto y operaciones. La observabilidad permitió examinar el comportamiento de las soluciones en producción. El proceso central convirtió los aprendizajes de cada implementación en una base para desarrollar las siguientes.

Esta experiencia también modificó mi comprensión de la calidad. En un producto analítico, la calidad se relacionaba principalmente con la confiabilidad de los datos, las métricas y la interpretación. En un agente, debía incluir además el comportamiento, las acciones, los límites, las excepciones y la capacidad para reconocer cuándo era necesaria la intervención humana.

La evolución no consistió en abandonar la analítica para dedicarme a la inteligencia artificial. Consistió en ampliar el alcance de la analítica hasta convertirla en una capacidad para observar, evaluar y gobernar sistemas inteligentes. Los agentes necesitaban datos para operar, pero la organización también necesitaba datos sobre los agentes para poder confiar en ellos.

Mi etapa en Vesting concluyó en enero de 2025. Para entonces había establecido una plataforma de datos operativa, una base analítica para el monitoreo de agentes y un proceso estructurado para desarrollar nuevas soluciones con mayor consistencia.

Vista en retrospectiva, el principal resultado no fue exclusivamente la plataforma ni un agente particular. Fue la articulación entre datos, analítica, observabilidad y proceso de desarrollo. Vesting me permitió pasar de construir soluciones que respaldaban decisiones humanas a diseñar la plataforma, los procesos y los mecanismos de observación necesarios para operar soluciones que también podían recomendar o ejecutar acciones. Allí comprendí que, cuanto mayor es la capacidad de actuación de un sistema, mayor debe ser la trazabilidad de sus datos, su comportamiento y sus límites.

Vesting me permitió pasar de construir soluciones que respaldaban decisiones humanas a diseñar la plataforma, los procesos y los mecanismos de observación necesarios para operar soluciones que también podían recomendar o ejecutar acciones. Allí comprendí que, cuanto mayor es la capacidad de actuación de un sistema, mayor debe ser la trazabilidad de sus datos, su comportamiento y sus límites.