---
slug: vesting
titulo: "Vesting — la plataforma de datos para agentes de IA (2023–2025)"
resumen: "Microsoft Fabric desde cero para una startup de agentes: 12 clientes, 27 agentes en inventario y 23 vigilados a la vez en tiempo real, 1.000 eventos por día, 20 GB y 120 tablas, gobernanza por cliente y un proceso core de 11 etapas para diseñar e implementar agentes."
estado: aprobado
ancla: "/proyectos/vesting"
actualizado: 2026-09-20
preguntas_de_prueba:
  - "¿Cómo diseñó Henry el ecosistema de datos de Vesting?"
  - "¿Qué es el proceso core replicable de agentes?"
  - "¿Cómo monitorea un agente de IA en producción?"
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

Ingresé a Vesting en agosto de 2023 como Líder de Estrategia de Datos y permanecí en la organización hasta enero de 2025: dieciocho meses. Vesting es una startup que desarrolla agentes de automatización para sus clientes, y necesitaba fortalecer la infraestructura necesaria para comprender su comportamiento, integrar la información producida por sus soluciones y convertir esa información en una capacidad útil para producto, operaciones y toma de decisiones. Trabajé en línea directa con los fundadores: en una startup de ese tamaño la estrategia de datos se decide con quien decide la empresa.

El desafío tenía una naturaleza diferente a los que había enfrentado anteriormente. Ya no se trataba únicamente de analizar un proceso ejecutado por personas o registrado por una aplicación empresarial. Los agentes generaban eventos mientras interactuaban con usuarios, consultaban información, utilizaban servicios y producían resultados. Para comprender su funcionamiento era necesario capturar esa actividad, estructurarla y conservar el contexto suficiente para reconstruir lo ocurrido.

La información se encontraba distribuida entre diferentes integraciones y no existía una plataforma común que permitiera analizarla de manera consistente. Cada nueva solución podía introducir estructuras, eventos y necesidades particulares, y cada integración de datos de un cliente era artesanal. Sin una base compartida, el crecimiento aumentaba la dependencia de desarrollos individuales, dificultaba la comparación entre agentes y reducía la capacidad para observar su comportamiento en producción.

Mi responsabilidad consistió en diseñar desde cero el ecosistema de datos de Vesting —la estrategia y la plataforma— para integrar esa información, establecer estructuras comunes y construir las bases analíticas necesarias para monitorear los agentes, con gobernanza desde el día uno y sin frenar a la startup. El objetivo no era solamente almacenar eventos, sino convertirlos en evidencia sobre disponibilidad, utilización, tiempos de respuesta, excepciones, costos y comportamiento operativo.

## Velocidad contra sostenibilidad: qué debía ser común y qué configurable

<!-- seccion: velocidad-y-sostenibilidad -->

La principal tensión en Vesting estaba entre velocidad y sostenibilidad. Una startup necesita experimentar, incorporar clientes y ajustar sus soluciones con rapidez, pero cada integración aislada aumenta la deuda técnica y hace más difícil mantener una visión común. Mi enfoque fue construir el nivel mínimo de estandarización necesario para conservar la agilidad sin renunciar a la trazabilidad, la calidad y la posibilidad de reutilizar lo ya aprendido.

Esto exigía distinguir entre aquello que debía ser común y aquello que debía permanecer configurable. Los eventos fundamentales, los identificadores, los estados y las métricas necesitaban definiciones compartidas. Las particularidades de cada cliente o agente debían incorporarse sin obligar a rediseñar toda la plataforma. Esa separación fue esencial para pasar de una colección de integraciones a una capacidad de datos que pudiera evolucionar con los 12 clientes que llegaron a integrarse.

En la práctica la regla era simple de enunciar y exigente de sostener: un agente nuevo o un cliente nuevo no podía requerir una tabla nueva para lo que ya tenía nombre en la plataforma —una sesión, una solicitud, una respuesta, un estado— y sí podía traer atributos propios, siempre dentro de una estructura que ya sabía recibirlos. Lo común era la condición de comparar; lo configurable, la condición de no frenar.

## Qué hice en Vesting: el tamaño de lo construido

<!-- seccion: el-tamano-de-lo-construido -->

Las cifras del ecosistema de datos al cierre de la etapa, en enero de 2025:

| Qué                                   | Cuánto                                          |
| ------------------------------------- | ----------------------------------------------- |
| Clientes integrados a la plataforma   | 12                                              |
| Agentes en el inventario              | 27, diseñados e implementados con el proceso core |
| Agentes bajo vigilancia a la vez      | 23, en el punto más alto                        |
| Eventos                               | 1.000 por día                                   |
| Volumen                               | 20 GB                                           |
| Tablas del modelo                     | 120                                             |
| Monitoreo                             | en tiempo real                                  |
| Etapas del proceso core               | 11                                              |

De cada agente se capturaba lo mismo, con la misma estructura: sesiones, solicitudes, respuestas, tiempos, estados y costo en tokens. La sesión era la unidad de análisis: un evento aislado señala una falla; la secuencia completa explica cómo evolucionó una interacción, dónde se desvió y qué costó.

Los 27 agentes del inventario de Vesting son un conjunto distinto de los agentes propios que hoy publico en mi portafolio: aquellos se construyeron para los clientes de la startup con su proceso core; estos, después, con mi propio ecosistema. Las dos experiencias, comparadas, están en el documento de agentes en producción.

## Cómo diseñé la arquitectura de datos desde cero en Microsoft Fabric: el ecosistema de datos de Vesting

<!-- seccion: la-arquitectura -->

Diseñé e implementé en Microsoft Fabric un ecosistema de datos orientado a integrar, transformar y analizar la información generada por los agentes: Big Data, Data Warehouse y procesamiento distribuido sobre un lakehouse. La plataforma debía conectar capacidades de almacenamiento, procesamiento, modelado y consumo analítico, reduciendo la fragmentación entre componentes y facilitando la construcción de una visión completa de la operación.

La arquitectura debía responder a dos necesidades simultáneas. La primera era histórica: conservar los eventos necesarios para analizar tendencias, reconstruir sesiones y comparar el comportamiento de los agentes a lo largo del tiempo. La segunda era operacional: ofrecer información suficientemente oportuna para identificar fallas, variaciones o condiciones que requirieran atención mientras todavía existía la posibilidad de intervenir.

Diseñé pipelines para recibir y preparar información procedente de diferentes integraciones, entre ellas los flujos de n8n con los que se orquestaban los agentes. Cada flujo debía validar su estructura, organizar los eventos, conservar los identificadores necesarios para mantener el contexto y transformar los datos en entidades que pudieran ser comprendidas por los equipos de negocio y producto. El propósito era evitar que la lógica de cada integración quedara aislada o dependiera exclusivamente de quien la había construido.

Esta experiencia amplió mi comprensión de Microsoft Fabric como plataforma empresarial. Su valor no estaba únicamente en reunir tecnologías, sino en permitir que ingestión, transformación, almacenamiento, modelado y análisis se diseñaran como partes de un mismo recorrido sobre OneLake. Mi trabajo consistió en dar coherencia a ese recorrido y asegurar que los datos conservaran su significado desde el evento generado por el agente hasta el indicador utilizado para evaluarlo. Fue Fabric de extremo a extremo, y sigue siendo la experiencia más completa que tengo con la plataforma; el detalle de cómo la trabajo por dentro está en el documento de Fabric en la práctica.

## La normalización temprana de los eventos

<!-- seccion: normalizacion-temprana -->

La normalización temprana fue la decisión clave de la arquitectura. Aunque los agentes podían tener propósitos y comportamientos distintos, compartían elementos observables como interacciones, sesiones, tiempos, estados, respuestas, errores y utilización de recursos. Construir una representación común de esos eventos desde el ingreso permitió desarrollar métricas comparables entre los 27 agentes y reducir la necesidad de reconstruir la lógica analítica para cada solución.

También fue necesario conservar el detalle sin deteriorar la experiencia de consulta. Los eventos ofrecían la mayor capacidad de explicación, pero los equipos necesitaban métricas agregadas para observar tendencias y condiciones generales. La arquitectura debía permitir avanzar desde una visión ejecutiva hacia el evento que sustentaba el resultado, manteniendo un equilibrio entre rendimiento, granularidad y trazabilidad: eventos para explicar, agregados para observar.

Con 1.000 eventos por día y 120 tablas, esa decisión era la diferencia entre una plataforma que crece de forma ordenada y una colección de integraciones que hay que reescribir con cada cliente nuevo. El lakehouse conservaba el evento crudo; las capas siguientes lo convertían en las entidades —sesión, solicitud, respuesta, agente, cliente— sobre las que se calculaba todo lo demás.

## Power BI como capa de consumo: modos de almacenamiento combinados

<!-- seccion: power-bi-capa-de-consumo -->

Power BI se convirtió en la capa mediante la cual producto y operaciones podían utilizar esa información. Los modelos semánticos organizaban los eventos técnicos en conceptos comprensibles y permitían analizar agentes, clientes, sesiones, periodos y resultados desde una base común. La visualización no era el fin de la arquitectura, sino el punto en el que la complejidad técnica se convertía en una capacidad de observación y decisión.

Los modelos usaban una combinación de modos de almacenamiento —Direct Lake sobre el lakehouse, importación y DirectQuery— elegida según el uso de cada modelo: la frescura que necesitaba el monitoreo operativo, el volumen histórico que exigía el análisis de tendencias y el costo de mantener cada uno. No hubo un modo único porque no había un solo tipo de pregunta. Cómo se decide entre los tres, con criterio, está en el documento de Fabric en la práctica.

Un modelo semántico sobre eventos de agentes tiene una particularidad frente a uno sobre ventas o cartera: la entidad central no es una transacción cerrada sino una sesión que evoluciona, y las medidas —tiempo de respuesta, costo en tokens, tasa de intervención— se calculan sobre secuencias. Esa fue la parte del modelado que más aprendí en Vesting y que no había necesitado en Banco Pichincha ni en TransMilenio.

## Gobernanza desde el diseño

<!-- seccion: la-gobernanza -->

La gobernanza debía incorporarse desde el comienzo porque la plataforma de Vesting integraba información producida por soluciones asociadas con 12 clientes y contextos distintos. Esperar hasta el final para resolver la propiedad, los permisos o la trazabilidad habría convertido cada integración en una excepción difícil de mantener y la plataforma entera en un riesgo.

Mi enfoque fue pragmático. La gobernanza no debía transformarse en una capa burocrática que impidiera experimentar, pero tampoco podía dejarse para una etapa futura. Era necesario establecer un conjunto mínimo de reglas que permitiera reconocer qué información ingresaba, a quién pertenecía, qué significado tenía, cómo se transformaba y quién estaba autorizado para utilizarla.

La estandarización de los eventos cumplía una función de gobierno además de una función técnica. Definir estructuras comunes permitía validar la información desde su ingreso, identificar campos obligatorios y hacer visibles las excepciones. Cuando una integración no cumplía las condiciones esperadas —el contrato de eventos—, la desviación podía ser identificada y tratada en lugar de avanzar silenciosamente hacia los productos analíticos.

La gobernanza se convirtió así en una propiedad de la arquitectura y no en una revisión posterior. Cada integración debía conservar identidad, procedencia, contexto y responsabilidad desde el ingreso de la información. Este principio permitiría posteriormente ampliar el alcance del gobierno desde los datos utilizados por los agentes hacia las decisiones, recomendaciones y acciones producidas por ellos.

## Aislamiento por cliente: workspaces separados

<!-- seccion: workspaces-separados -->

La separación de la información por cliente y contexto debía formar parte del diseño de los flujos y modelos. No bastaba con almacenar todo en un mismo ecosistema y resolver posteriormente quién podía consultarlo. La arquitectura necesitaba preservar los identificadores y las relaciones requeridas para controlar el consumo, evitar interpretaciones equivocadas y mantener la responsabilidad sobre cada conjunto de información.

El aislamiento entre los 12 clientes se resolvió con workspaces separados en Microsoft Fabric: cada cliente con su espacio, sus permisos y sus modelos, sobre las estructuras de eventos comunes. La elección tenía una razón de gobierno y otra de operación. De gobierno, porque el límite de acceso coincidía con el límite del cliente y no dependía de un filtro bien escrito; de operación, porque un cambio en el modelo de un cliente no podía afectar a otro.

Sobre esa base, las estructuras comunes seguían permitiendo la comparación que la startup necesitaba para su propio producto: los mismos eventos y las mismas métricas en cada workspace, de modo que Vesting pudiera observar su portafolio de agentes completo sin que un cliente viera nada de otro.

## Trazabilidad y naturaleza de la información

<!-- seccion: trazabilidad-y-naturaleza-de-la-informacion -->

También procuré que las transformaciones fueran comprensibles y reproducibles. Una métrica sobre el desempeño de un agente debía conservar una relación clara con los eventos utilizados para calcularla. Esta trazabilidad era indispensable para investigar comportamientos, explicar resultados a un cliente y distinguir si una desviación se originaba en el agente, en la integración, en los datos o en la lógica analítica.

También comprendí que gobernar una plataforma de agentes exige reconocer que no toda la información tiene la misma naturaleza. Un evento técnico, un dato suministrado por un usuario, una respuesta generada y una acción ejecutada requieren tratamientos distintos. Conservar esa distinción permite interpretar mejor lo ocurrido y evita presentar como hecho verificable aquello que fue producido mediante generación o inferencia.

Esa distinción, que en Vesting nació como una regla de modelado, es hoy una de las bases de cómo entiendo el gobierno de la inteligencia artificial: la respuesta de un modelo se registra, se evalúa y se cita como lo que es, una salida generada, nunca como un dato de la operación. Las tres experiencias de gobierno de mi trayectoria —banca, esta startup y el sector salud— están comparadas en el documento de gobierno de datos y de IA.

## Monitorear agentes de inteligencia artificial en producción

<!-- seccion: monitoreo-de-agentes -->

Uno de los principales objetivos del ecosistema de datos fue establecer la capacidad de monitorear agentes en producción, y llegó a vigilar 23 agentes a la vez, en tiempo real. La observabilidad debía responder una pregunta más profunda que verificar si una aplicación estaba disponible. Necesitábamos comprender qué estaba ocurriendo durante las interacciones, cómo se comportaban los agentes y en qué condiciones aparecían errores, demoras o resultados inesperados.

Para hacerlo, estructuré la captura de eventos asociados con sesiones, solicitudes, respuestas, tiempos de procesamiento, estados y excepciones. Cuando el contexto lo permitía, esta información podía complementarse con la versión de la solución, la integración utilizada y otros elementos necesarios para analizar diferencias de comportamiento: la misma pregunta respondida distinto por dos versiones del mismo agente es un hallazgo, no un ruido.

La sesión se convirtió en una unidad de análisis especialmente importante. Observar eventos aislados permitía identificar fallas puntuales, pero reconstruir una secuencia completa facilitaba comprender cómo una interacción había evolucionado, en qué momento se había desviado y qué componentes habían participado. Esta capacidad resultaba esencial para depurar problemas y explicar comportamientos que no podían interpretarse mediante un único registro.

## Las cuatro dimensiones del monitoreo

<!-- seccion: dimensiones-del-monitoreo -->

El monitoreo de Vesting debía integrar varias dimensiones, cada una al servicio de una decisión distinta:

| Dimensión   | Qué se medía                                              | Para qué decisión                                  |
| ----------- | --------------------------------------------------------- | -------------------------------------------------- |
| Operativa   | disponibilidad, volumen, errores, tiempos de respuesta    | intervenir antes de que el cliente lo note         |
| Uso         | distribución por agente, cliente, periodo y tipo de tarea | dónde crece la demanda y dónde no                  |
| Económica   | costo en tokens por sesión y por agente                   | qué agente cuesta más de lo que resuelve           |
| Funcional   | estados finales y sesiones que necesitaron intervención   | dónde el agente responde pero no resuelve          |

La dimensión funcional era la más difícil. Las métricas técnicas podían demostrar que el agente había respondido, pero no necesariamente que la respuesta había sido útil o que la acción correspondía con el propósito esperado. Este reto me permitió comprender que la evaluación de un agente necesita conectar telemetría, contexto, resultados y retroalimentación humana.

Un agente disponible puede responder de forma incorrecta. Un agente preciso puede resultar demasiado lento para el proceso. Una respuesta útil puede tener un costo desproporcionado en tokens. Una automatización eficiente puede producir riesgos si actúa fuera de sus límites. La observabilidad debía permitir analizar estas cuatro dimensiones conjuntamente y evitar que una única métrica se convirtiera en una representación incompleta de la solución.

## Los tableros operativos y lo que cambió en mi idea del BI

<!-- seccion: tableros-operativos -->

Los tableros operativos en Power BI hicieron visible esta información para los responsables de producto y operación de Vesting. Su propósito era facilitar la identificación de condiciones relevantes y permitir que una anomalía pudiera recorrerse hasta los eventos asociados de la sesión. La plataforma no eliminaba la necesidad de investigación, pero reducía la distancia entre detectar un problema y disponer de evidencia para comprenderlo.

El monitoreo también alimentaba la adopción: saber si las personas usaban un agente, confiaban en él y sabían cuándo recurrir a él era parte de la validación de cada solución, y por eso la adopción es una etapa del proceso core que describo más adelante y no un indicador suelto.

Esta experiencia transformó mi concepto de inteligencia de negocios. El tablero ya no describía únicamente procesos empresariales ejecutados por personas. También permitía observar sistemas inteligentes que participaban activamente en esos procesos. Power BI y Microsoft Fabric se convirtieron en componentes de una arquitectura de confianza para la inteligencia artificial, al proporcionar trazabilidad, seguimiento y evidencia sobre su comportamiento. Cómo se monitorea un agente, generalizado más allá de esta plataforma, está en el documento de agentes en producción.

## De los procesos a la especificación del agente

<!-- seccion: especificacion-del-agente -->

El desarrollo de agentes en Vesting hizo visible una dificultad que no siempre aparece en las primeras conversaciones con el negocio: comprender un proceso no equivale todavía a contar con una especificación suficiente para implementarlo. Un diagrama puede mostrar la secuencia general de actividades, pero normalmente no contiene todo lo que una solución necesita para comportarse de manera consistente frente a diferentes entradas, condiciones y excepciones.

Para reducir esa distancia, comencé a analizar cada actividad como una unidad funcional. Era necesario establecer qué información recibía, qué propósito cumplía, qué reglas debía aplicar, qué fuentes podía consultar, qué herramientas podía utilizar, qué resultado debía producir y bajo qué condiciones debía detenerse o solicitar intervención humana. Esta descomposición permitía transformar una expectativa general en un comportamiento implementable y posteriormente evaluable.

La especificación también debía diferenciar entre conocimiento, decisión y acción. Algunas actividades requerían recuperar o sintetizar información. Otras implicaban interpretar una situación y formular una recomendación. Determinadas tareas podían ejecutarse mediante una herramienta, mientras que otras debían permanecer bajo responsabilidad humana. Esta distinción permitía asignar el nivel de autonomía de acuerdo con el propósito, el riesgo y la posibilidad de verificar el resultado.

## Las excepciones también se especifican

<!-- seccion: las-excepciones-se-especifican -->

También era necesario describir las excepciones. Una solución no está completamente especificada si solo se define su comportamiento en condiciones ideales. El agente debía reconocer cuándo faltaba información, cuándo existían resultados contradictorios, cuándo una herramienta no estaba disponible y cuándo la consecuencia de una acción exigía validación adicional. Saber abstenerse o transferir el control era tan importante como completar correctamente una tarea.

Este enfoque fortaleció la trazabilidad entre el proceso, los datos y la solución tecnológica. Cada comportamiento esperado podía relacionarse con una necesidad del negocio, una fuente de información, una regla, una herramienta y un criterio de aceptación. Así, la evaluación dejaba de depender únicamente de si la respuesta parecía adecuada y comenzaba a contrastarse con una especificación previamente acordada.

Esta disciplina se convirtió en la antesala del proceso central replicable de Vesting. Antes de estandarizar cómo construir agentes, era necesario establecer una forma consistente de expresar qué debía hacer cada uno, qué límites debía respetar y qué evidencia permitiría determinar si estaba cumpliendo su propósito. Es la misma lógica con la que años antes convertía una queja de inventario en un escenario de prueba reproducible: entradas, reglas, salida esperada, excepciones.

## El proceso core replicable de agentes: once etapas para diseñar e implementar

<!-- seccion: el-proceso-core -->

Además de construir el ecosistema de datos, estructuré, documenté y validé el proceso central —el proceso core— utilizado para diseñar e implementar agentes de inteligencia artificial en Vesting, con el que se construyeron los 27 agentes del inventario. El objetivo era evitar que cada iniciativa comenzara desde cero y dependiera exclusivamente del conocimiento informal de las personas que habían participado en implementaciones anteriores.

Comprendí que el verdadero activo no era un agente particular, sino la capacidad de construir el siguiente con mayor claridad, consistencia y control. Para conseguirlo, era necesario definir un recorrido común desde la comprensión del problema hasta la operación de la solución, incluyendo criterios de aceptación y responsabilidades en cada etapa. Son once:

1. Caso de uso: qué problema se resuelve y qué acción habilita.
2. Usuarios y decisión: quién lo usa y qué decide con él.
3. Especificación funcional: cada actividad con entradas, reglas, salidas y criterios verificables.
4. Fuentes autorizadas y herramientas: qué puede consultar y qué puede usar.
5. Nivel de autonomía: consultar, recomendar o ejecutar, y bajo qué condiciones.
6. Excepciones: qué hace cuando falta información, hay contradicción o el caso es ambiguo.
7. Validación técnica: integraciones, fuentes, estructura de las salidas.
8. Validación de negocio: el resultado corresponde a lo que la operación necesita.
9. Definición de terminado: acordada antes, no demostrada después.
10. Adopción e interacción: qué puede hacer, qué información usa, cuándo pide validación humana.
11. Operación observable: el agente sigue medido y el uso alimenta la siguiente versión.

Aquí se nota el ingeniero industrial: definir, documentar y validar un proceso central es exactamente lo que hacía en una planta, solo que el proceso ahora produce agentes. Las etapas que siguen desarrollan lo que cada una exigía.

## Del caso de uso al nivel de autonomía

<!-- seccion: del-caso-de-uso-a-la-autonomia -->

El proceso core de Vesting comenzaba con la definición del caso de uso. Antes de seleccionar modelos o diseñar interacciones, era necesario comprender qué problema debía resolverse, quién utilizaría la solución, qué información requería, qué acción esperaba habilitar y cómo se determinaría si el resultado era útil. Esta etapa evitaba iniciar el desarrollo desde la tecnología y obligaba a establecer primero el propósito empresarial.

La siguiente responsabilidad consistía en especificar cómo debía funcionar la solución. Un diagrama general del proceso no siempre contenía suficiente información para construir un agente. Cada actividad debía analizarse en términos de sus entradas, propósito, reglas, fuentes, herramientas, salidas y excepciones. Esta descomposición reducía la distancia entre la expectativa del negocio y el comportamiento finalmente implementado.

También era necesario delimitar la autonomía. No todas las actividades debían ser ejecutadas directamente por el agente. Algunas podían limitarse a recuperar y sintetizar información. Otras podían generar recomendaciones para validación humana. Solo determinadas tareas debían permitir una ejecución más autónoma, siempre dentro de límites conocidos y con evidencia suficiente sobre las acciones realizadas. Los tres niveles —consultar, recomendar, ejecutar— se decidían por caso y quedaban escritos antes de construir.

## Validación técnica, validación de negocio y definición de terminado

<!-- seccion: validacion-y-definicion-de-terminado -->

La validación en Vesting debía abarcar tanto el funcionamiento técnico como el resultado empresarial. Era necesario comprobar que las integraciones —los flujos de n8n, las fuentes, las herramientas— respondieran correctamente, que las fuentes fueran accesibles, que las salidas conservaran la estructura esperada y que las excepciones pudieran ser identificadas. También debía evaluarse si la solución cumplía el propósito para el cual había sido diseñada.

Para cada iniciativa era necesario acordar desde el comienzo qué significaba que el agente estuviera terminado. No bastaba con demostrar una conversación correcta o una integración funcional. La solución debía cumplir sus criterios de comportamiento, utilizar las fuentes y herramientas autorizadas, gestionar adecuadamente las excepciones, conservar evidencia suficiente para su seguimiento y contar con responsables para su operación.

La definición de terminado convertía expectativas generales en condiciones verificables y evitaba confundir una demostración convincente con una capacidad preparada para utilizarse. Es la etapa que más discusiones ahorró: cuando el criterio está acordado antes, la pregunta al final no es si el agente «se ve bien», sino si cumple lo que se escribió.

## Adopción e interacción con las personas

<!-- seccion: adopcion-e-interaccion -->

La adopción debía formar parte de la validación de cada agente en Vesting. Un agente podía responder correctamente en un entorno de prueba y, aun así, no integrarse en la operación si las personas no comprendían su propósito, desconfiaban de sus resultados o no sabían cuándo utilizarlo. Por eso, la implementación también requería definir cómo se introduciría la solución en el trabajo cotidiano, qué responsabilidades conservarían los usuarios y cómo se recogería la retroalimentación necesaria para mejorarla.

La interacción entre las personas y el agente debía diseñarse con la misma atención que la arquitectura técnica. Era necesario evitar tanto la confianza automática como el rechazo preventivo. La solución debía comunicar con claridad qué podía hacer, qué información utilizaba, cuáles eran sus límites y en qué situaciones necesitaba apoyo o validación humana. La adopción responsable no consiste en conseguir que las personas acepten todas las respuestas, sino en que aprendan a utilizar la capacidad con el nivel apropiado de criterio y supervisión.

Es la misma lección de adopción de Banco Pichincha y de TransMilenio, trasladada a un producto que además responde: allí el tablero necesitaba una decisión al otro lado; aquí el agente necesita, además, una persona que sepa cuándo confiar y cuándo revisar.

## Operación observable y proceso replicable

<!-- seccion: operacion-observable-y-replicable -->

La puesta en producción no representaba el final del proceso. Un agente debía permanecer observable y contar con mecanismos para incorporar aprendizajes derivados de su utilización. Los datos capturados durante la operación —los mismos 1.000 eventos diarios de la plataforma— permitían reconocer errores recurrentes, diferencias entre contextos y oportunidades para mejorar instrucciones, integraciones o reglas. La etapa once cerraba el ciclo con la plataforma de datos: el monitoreo no era un proyecto aparte, era la última etapa del proceso.

Para hacer este proceso replicable, trabajé en su documentación y en la creación de una estructura que pudiera ser utilizada en futuras implementaciones. La finalidad no era establecer una fórmula rígida, sino preservar los aprendizajes comunes y reducir la dependencia de decisiones improvisadas. Los 27 agentes del inventario salieron de ese recorrido, y el proceso quedó documentado para que la startup pudiera construir el siguiente sin mí.

Esta experiencia me enseñó una diferencia esencial entre desarrollar una solución y construir una capacidad. Una solución resuelve un caso. Una capacidad permite resolver nuevos casos utilizando procesos, criterios y componentes que la organización ya comprende y puede mejorar. El método, generalizado más allá de Vesting, está en el documento de agentes en producción.

## Del agente individual a la arquitectura empresarial de IA

<!-- seccion: del-agente-a-la-arquitectura -->

A medida que avanzaba el trabajo en Vesting, comprendí que los agentes no debían analizarse como aplicaciones aisladas. Cada uno dependía de datos, fuentes de conocimiento, servicios, herramientas, identidades, reglas, mecanismos de evaluación y personas responsables de supervisar determinados resultados. La calidad del agente dependía de la arquitectura completa en la que estaba integrado.

Esta comprensión amplió mi trabajo desde la estrategia de datos hacia una visión de arquitectura empresarial de inteligencia artificial. La plataforma de datos en Microsoft Fabric proporcionaba evidencia y observabilidad. Los modelos aportaban capacidades de interpretación o generación. Las integraciones permitían interactuar con otros sistemas. Las reglas delimitaban la actuación. La intervención humana protegía las decisiones que no debían delegarse completamente.

Así comenzó a consolidarse una visión que posteriormente profundizaría: la arquitectura de IA no es una selección de tecnologías ni una colección de agentes. Es un sistema de capacidades que conecta propósito, procesos, datos, conocimiento, modelos, herramientas, evaluación, observabilidad, gobierno y responsabilidad humana.

## La reutilización más allá del código

<!-- seccion: reutilizacion-mas-alla-del-codigo -->

También identifiqué en Vesting un problema recurrente: cada nueva iniciativa podía comenzar sin memoria de las anteriores. Cuando los aprendizajes sobre integración, monitoreo, evaluación o manejo de excepciones permanecían únicamente en las personas, la organización repetía errores y aumentaba el costo de cada implementación. Construir arquitectura significaba convertir esos aprendizajes en elementos reutilizables.

La reutilización no debía limitarse al código. También podía expresarse en definiciones de eventos, patrones de integración, criterios de evaluación, estructuras de monitoreo, formas de especificar procesos y principios para determinar el nivel adecuado de autonomía. Estos activos reducían la incertidumbre y permitían que las siguientes soluciones comenzaran desde una base más madura: la meta era que el agente número 27 costara menos improvisación que el primero, y no porque el equipo fuera otro, sino porque el proceso, el contrato de eventos y los criterios ya existían.

Esa es, para mí, la prueba de que una capacidad existe: que el siguiente caso cuesta menos que el anterior sin bajar el criterio.

## El DP-600 dentro del rol

<!-- seccion: dp-600-dentro-del-rol -->

Obtuve la certificación Microsoft Fabric Analytics Engineer Associate (DP-600) en diciembre de 2024, mientras estaba en Vesting y construía sobre Fabric exactamente lo que la certificación describe: lakehouse, pipelines, modelos semánticos, modos de almacenamiento, gobierno técnico de la plataforma. No fue un conocimiento separado de la experiencia; la preparé mientras diseñaba e implementaba el ecosistema, y los temas del examen tenían casos reales en la plataforma.

Por eso el DP-600 es, en mi perfil, la credencial de esta etapa: certifica la ingeniería de analítica con la que se construyó la plataforma de datos de una startup de agentes. Lo que significa en trabajo concreto, tema por tema, está en el documento de Fabric en la práctica; cómo la preparé, en el de cómo aprendo.

## Por qué salí de Vesting, y el puente que esta experiencia construyó

<!-- seccion: por-que-sali-y-el-puente -->

Mi etapa en Vesting concluyó en enero de 2025. Cerré la etapa al dejar el ecosistema y el proceso documentados: para entonces había establecido una plataforma de datos operativa en Microsoft Fabric, una base analítica para el monitoreo de agentes y un proceso estructurado, de once etapas, con el que la startup podía desarrollar nuevas soluciones con mayor consistencia y sin depender de mí.

Vesting fue la experiencia en la que convergieron de manera más clara mis conocimientos en ingeniería de procesos, datos, inteligencia de negocios e inteligencia artificial. Por primera vez diseñaba un ecosistema de datos cuyo objeto de observación no era únicamente la operación de una organización, sino el comportamiento de agentes capaces de utilizar información y participar activamente en sus procesos. Es el punto donde mis dos mitades se juntan: la ingeniería de analítica —lo que certifica el DP-600— y la ingeniería de IA.

La ingeniería de datos proporcionó los pipelines, la estructura y la trazabilidad necesarias para conservar los eventos. El modelado analítico permitió convertir esos eventos en conceptos y métricas comprensibles. Power BI acercó esa información a producto y operaciones. La observabilidad permitió examinar el comportamiento de las soluciones en producción. El proceso central convirtió los aprendizajes de cada implementación en una base para desarrollar las siguientes.

## Lo que Vesting consolidó: analítica que observa sistemas inteligentes

<!-- seccion: lo-que-vesting-consolido -->

Esta experiencia también modificó mi comprensión de la calidad. En un producto analítico, la calidad se relacionaba principalmente con la confiabilidad de los datos, las métricas y la interpretación. En un agente, debía incluir además el comportamiento, las acciones, los límites, las excepciones y la capacidad para reconocer cuándo era necesaria la intervención humana.

La evolución no consistió en abandonar la analítica para dedicarme a la inteligencia artificial. Consistió en ampliar el alcance de la analítica hasta convertirla en una capacidad para observar, evaluar y gobernar sistemas inteligentes. Los agentes necesitaban datos para operar, pero la organización también necesitaba datos sobre los agentes para poder confiar en ellos: 1.000 eventos por día, 23 agentes vigilados a la vez y una sesión reconstruible de punta a punta eran esa confianza en forma de plataforma.

Vista en retrospectiva, el principal resultado no fue exclusivamente la plataforma ni un agente particular. Fue la articulación entre datos, analítica, observabilidad y proceso de desarrollo. Vesting me permitió pasar de construir soluciones que respaldaban decisiones humanas a diseñar la plataforma, los procesos y los mecanismos de observación necesarios para operar soluciones que también podían recomendar o ejecutar acciones. Allí comprendí que, cuanto mayor es la capacidad de actuación de un sistema, mayor debe ser la trazabilidad de sus datos, su comportamiento y sus límites.
