---
slug: como-trabajo
titulo: "Mi forma de trabajar"
resumen: "Cómo trabajo, con la evidencia de cada rasgo: primero el proceso (BPMN), la adopción como indicador (50+ usuarios), liderazgo de equipos de hasta 20 personas, la junta directiva y las mesas del SITP, y qué instrumento va con cada decisión."
cuando_usar: "Úsalo cuando pregunten cómo trabaja, cómo lidera un equipo, cómo se comunica con las áreas de negocio y la alta dirección, qué valora en un proyecto, cómo maneja personas que no le reportan, o si es un perfil de procesos o de tecnología."
estado: aprobado
ancla: "#perfil"
actualizado: 2026-09-20
preguntas_de_prueba:
  - "¿Cómo trabaja Henry?"
  - "¿Cómo lidera Henry un equipo y cómo se comunica con las áreas de negocio?"
  - "¿Cuál es el equipo más grande que ha liderado?"
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
Cómo piensas y trabajas: tu enfoque para resolver problemas, cómo
lideras equipos, qué valoras en un proyecto, cómo comunicas con stakeholders.
Lo que un hiring manager preguntaría en la primera entrevista. -->

## Ante un problema nuevo: primero el proceso, después la herramienta

<!-- seccion: primero-el-proceso -->

Soy ingeniero industrial de la Javeriana antes que ingeniero de datos, y esa forma de entender el mundo sigue siendo una de mis mayores ventajas competitivas. A lo largo de diez años de carrera —desde agosto de 2016, en Inglopres— he comprobado que los problemas más complejos de una organización rara vez son problemas tecnológicos; son problemas de entendimiento. Por eso, cuando enfrento un desafío nuevo, no comienzo preguntándome qué herramienta utilizar o qué modelo construir. Comienzo entendiendo cómo funciona el sistema que genera el resultado: cuáles son sus actores, qué decisiones se toman, qué información circula, qué restricciones existen y dónde se originan las ineficiencias que terminan impactando el negocio.

Mi forma de trabajar parte de una convicción sencilla: la tecnología amplifica lo que ya existe, pero no corrige procesos deficientes. Un dashboard no resuelve la falta de claridad operativa. Un modelo predictivo no corrige una definición inconsistente. Una plataforma moderna no transforma por sí sola una organización. Antes de diseñar soluciones, necesito comprender la lógica del proceso que las hará sostenibles. Entender quién hace qué, con qué información, bajo qué reglas y con qué impacto es mucho más valioso que implementar rápidamente una herramienta cuya utilidad se desvanezca en pocas semanas.

He visto organizaciones invertir cantidades significativas de tiempo y recursos en iniciativas de analítica que terminan subutilizadas porque nadie dedicó suficiente atención a comprender el proceso que alimentaba los datos. Cuando eso ocurre, el resultado suele ser el mismo: indicadores que generan debate en lugar de confianza, reportes que responden preguntas irrelevantes y soluciones técnicamente sofisticadas que nunca logran integrarse a la operación. Mi prioridad siempre ha sido evitar ese escenario conectando desde el inicio la comprensión operativa con la arquitectura analítica. La primera vez que lo viví fue en Inglopres, en 2016: no podía mejorar procesos porque nadie generaba el dato, y la solución empezó por diseñar cómo capturarlo, no por elegir la herramienta.

## Modelar el proceso en BPMN antes de decidir qué medir

<!-- seccion: modelar-el-proceso-en-bpmn -->

Por esa razón considero que el modelamiento de procesos es una disciplina fundamental dentro de cualquier estrategia seria de datos. Un proceso correctamente representado permite entender dependencias, identificar cuellos de botella, descubrir desperdicios de información, evidenciar reprocesos ocultos y encontrar oportunidades de automatización que normalmente pasan desapercibidas cuando se observa únicamente la capa tecnológica. La calidad de una solución analítica depende directamente de la calidad del entendimiento que se tenga del sistema que la origina.

Esa filosofía explica una práctica que aplico de forma consistente: cuando un proceso merece ser documentado, lo represento con estándares formales —mi estándar preferido es **BPMN**— y la herramienta con la que lo he hecho es **Bizagi**. Lo hice cuatro veces en empleos distintos, siempre antes de tocar la tecnología:

| Dónde               | Cuándo                          | Qué se modeló                                                                                                  |
| ------------------- | ------------------------------- | -------------------------------------------------------------------------------------------------------------- |
| **Inglopres**       | agosto 2016 – junio 2017        | la operación de alquiler de maquinaria antes de implantar el ERP; allí usé también FlexSim                     |
| **Ceinfes**         | noviembre 2017 – noviembre 2018 | la cadena programación → material → aplicación → digitalización, cada frente con su ventana                    |
| **Cafam**           | octubre 2020 – junio 2021       | recepción, almacenamiento, alistamiento y despacho, contrastados con el WMS antes de probarlo; también FlexSim |
| **Banco Pichincha** | marzo – julio 2023              | los productos analíticos situados en las actividades y decisiones que debían respaldar                         |

Modelar primero también decide **qué medir**: cada actividad genera o consume información y produce eventos, y si esos eventos no se capturan, el análisis posterior dependerá de reconstrucciones manuales. Por eso el proceso y el modelo de datos no se diseñan por separado. El método completo —Bizagi, FlexSim, la simulación de eventos discretos y el estudio del trabajo— está en el documento de procesos y simulación; aquí importa el principio: el diagrama va antes que el dato, y el dato antes que la herramienta.

## Process mining y diagramas vivos: un BPMN que no envejece

<!-- seccion: process-mining-y-diagramas-vivos -->

Siempre que sea posible, prefiero que el diagrama se genere automáticamente a partir de los datos que describen la ejecución real del proceso: es lo que se conoce como _process mining_ o minería de procesos. No me interesa construir diagramas estáticos que se conviertan en fotografías obsoletas de una realidad que cambia constantemente. Me interesa construir representaciones vivas del negocio, capaces de evolucionar junto con la operación y reflejar sus transformaciones de manera objetiva.

Un diagrama elaborado manualmente comienza a perder vigencia desde el momento en que el proceso cambia. En contraste, un modelo generado desde los eventos, reglas y registros que produce la propia operación se convierte en una fuente permanente de conocimiento. La diferencia parece sutil, pero es enorme: ya no se depende de percepciones o interpretaciones aisladas; se trabaja sobre evidencia observable y verificable. Esta aproximación permite que el conocimiento organizacional evolucione al mismo ritmo que el negocio.

Soy preciso sobre lo que esto es en mi trayectoria: la minería de procesos sobre un registro de eventos real es el **método que aplicaría**, no un caso que haya corrido en una empresa. Lo que sí está construido y en operación es la versión de ese principio en mi propia vitrina: el diagrama BPMN de cada una de las 32 piezas —6 aplicaciones, 13 agentes, 7 investigaciones y 6 tableros— se genera desde la definición del proceso de la pieza, con un motor propio, y se valida en el build. Nadie dibuja esos diagramas a mano: si la definición cambia, el diagrama cambia con ella, y si la definición está malformada, la publicación falla antes de salir.

## Entender el sistema, no producir más reportes

<!-- seccion: entender-el-sistema -->

En el fondo, mi interés nunca ha sido producir más reportes ni implementar más herramientas. Mi objetivo es entender cómo funcionan realmente las organizaciones para ayudarles a tomar mejores decisiones, diseñar operaciones más eficientes y construir capacidades analíticas que generen valor de manera sostenida. Las herramientas cambian constantemente. Los procesos evolucionan. Pero la capacidad de comprender un sistema en profundidad, modelarlo correctamente y transformarlo con base en evidencia sigue siendo una ventaja diferencial que trasciende cualquier tecnología.

Lo he aplicado en cuatro sectores con lógicas distintas: la logística de alquiler de maquinaria en Inglopres, con un parque de unas 120 entre máquinas y vehículos; la evaluación educativa en Ceinfes, con más de 100 colegios atendidos por año; el transporte masivo de Bogotá en dos etapas con C&M, primero la supervisión de unas 150 rutas de 10 empresas concesionarias y después el análisis post-operacional de TransMilenio; la logística de un centro de distribución de medicamentos en Cafam; la banca en Banco Pichincha; una startup de agentes de IA en Vesting; y hoy la salud en la Fundación CTIC. En todos, la pregunta de entrada fue la misma: ¿cómo funciona este sistema y qué decisión necesita cambiar? La herramienta llegó después, y fue distinta cada vez —Odoo, VBA, SQLite, Power BI, Microsoft Fabric, agentes—, porque la herramienta se elige para el sistema y no al revés.

## La adopción es el indicador, no el entregable

<!-- seccion: la-adopcion-es-el-indicador -->

Una de las lecciones más importantes que he aprendido en el mundo de la inteligencia de negocios y la inteligencia artificial es que construir una solución rara vez es la parte más difícil. Lo verdaderamente complejo es lograr que las personas la incorporen en su forma de trabajar, la conviertan en parte de sus rutinas de decisión y confíen en ella cuando enfrentan preguntas críticas para el negocio. La distancia entre una solución técnicamente correcta y una solución realmente valiosa suele estar determinada por la adopción.

Con frecuencia, las organizaciones concentran sus esfuerzos en la construcción de reportes, dashboards, aplicaciones, modelos, plataformas o soluciones, asumiendo que el simple hecho de poner la información a disposición de los usuarios generará automáticamente valor. Mi experiencia me ha demostrado lo contrario. El valor aparece cuando una solución logra modificar comportamientos, acelerar decisiones, reducir incertidumbre y convertirse en un elemento cotidiano dentro de los procesos de trabajo. Si eso no ocurre, incluso la implementación más sofisticada termina siendo poco más que un ejercicio técnico.

Por esa razón siempre diseño las soluciones comenzando por la decisión que deberán habilitar. Antes de pensar en visualizaciones, indicadores o funcionalidades, procuro comprender quién utilizará la información, qué preguntas necesita responder, qué acciones deberá ejecutar a partir de ella y qué consecuencias tendrá una mejor decisión sobre los resultados del negocio. Cuando una solución nace desde el contexto de uso y no únicamente desde la disponibilidad de datos, las probabilidades de adopción aumentan de manera significativa. En Banco Pichincha, en 2023, ese fue el problema entero del rol: el área producía tableros técnicamente correctos que el negocio no terminaba de adoptar, y la respuesta no fue una visualización nueva sino empezar por las preguntas de quien decidía.

## La adopción medida: 50+ usuarios en banca, 25+ en transporte, 15+ en logística

<!-- seccion: la-adopcion-medida-en-cifras -->

No lo afirmo como doctrina: lo he medido cuatro veces, con usuarios y decisiones distintas en cada contexto.

| Dónde                                         | Producto                                                              | Adopción                                         | Efecto                                          |
| --------------------------------------------- | --------------------------------------------------------------------- | ------------------------------------------------ | ----------------------------------------------- |
| **Banco Pichincha**, 2023 | dashboards para decidir, construidos por el equipo de 5 que lideré | **más de 50 usuarios** del negocio | +25 % en la toma de decisiones |
| **TransMilenio / C&M Consultores**, 2021–2022 | Power BI en el análisis post-operacional                              | **más de 25 usuarios clave** de la operación     | +35 % de eficiencia de los procesos analíticos  |
| **Cafam**, 2020–2021                          | el BI de control de la implementación del WMS                         | **más de 15** directores, coordinadores y jefes  | +50 % de precisión en el seguimiento de pruebas |
| **Fundación CTIC**, desde 2025                | 42 productos analíticos por procesos, 23 de ellos tableros de control | **20 líderes** de 15 procesos y unos 75 usuarios | cerca de 60 % menos esfuerzo de preparación     |

«Usuarios clave» importa: en transporte no eran personas con acceso sino los responsables de programación, seguimiento y decisiones de servicio. En Cafam, los quince eran los roles que respondían por el proyecto —la dirección de medicamentos, la de TI, la del proyecto, la del centro de distribución y sus coordinadores y jefes—, y quince personas con responsabilidad directa sobre un proceso crítico valen más que cientos que consultan de vez en cuando. Cómo distingo acceso, uso, adopción e impacto, y cómo mido la adopción sin confundirla con visitas, está en el documento de BI.

## La adopción es un desafío humano y una capacidad organizacional

<!-- seccion: adopcion-desafio-humano -->

También considero que la adopción es un desafío tanto humano como tecnológico. Las organizaciones no cambian únicamente porque exista una nueva herramienta; cambian cuando las personas entienden su utilidad, desarrollan confianza en la información y perciben claramente cómo la solución facilita su trabajo. Por ello, la gestión del cambio, la comunicación, la formación y el acompañamiento a los usuarios son componentes tan importantes como la arquitectura de datos o el diseño visual de un dashboard. En Banco Pichincha, el programa de formación a 12 profesionales —Power Query, modelado semántico, DAX y comunicación ejecutiva sobre sus propios productos— fue parte del producto y no un anexo, y contribuyó a un aumento del 20 % en la productividad de la preparación y uso de la información.

Las iniciativas de analítica e inteligencia artificial más exitosas que he liderado comparten un patrón común: no fueron concebidas únicamente como proyectos tecnológicos ni como entregas aisladas de reportes, aplicaciones, automatizaciones, soluciones o agentes de IA. Fueron diseñadas como capacidades organizacionales destinadas a integrarse en los procesos, ampliar las capacidades de las personas y transformar de manera sostenible la forma en que se analiza la información, se ejecuta el trabajo y se toman decisiones.

Mi objetivo nunca ha sido entregar información sin un propósito claro, automatizar actividades sin comprender su impacto o incorporar inteligencia artificial simplemente porque la tecnología lo permite. Busco diseñar soluciones confiables, gobernadas y alineadas con las necesidades reales del negocio, capaces de convertir los datos en conocimiento, el conocimiento en decisiones y las decisiones en acciones verificables. Esto puede materializarse en una plataforma analítica, una aplicación inteligente, una solución de automatización o un agente de IA, pero el criterio de éxito es el mismo: que la capacidad creada sea adoptada, genere confianza y produzca un impacto tangible.

En ese sentido, entiendo cada solución como parte de un sistema más amplio de habilitación organizacional. La verdadera transformación ocurre cuando las personas pueden operar con mayor claridad, acceder oportunamente al conocimiento que necesitan, reducir la carga de tareas repetitivas, tomar decisiones con mayor velocidad y actuar con confianza sobre una visión consistente de la realidad. La tecnología es el habilitador, pero el resultado esperado es una organización más inteligente, autónoma, eficiente y preparada para evolucionar.

## Cómo lidero un equipo

<!-- seccion: como-lidero -->

Entiendo el liderazgo como la capacidad de crear las condiciones para que un equipo pueda producir resultados extraordinarios sin depender de una supervisión permanente. Mi responsabilidad como líder no consiste en concentrar todas las decisiones ni en revisar cada movimiento, sino en establecer una dirección clara, traducir los objetivos estratégicos en prioridades comprensibles y proporcionar a las personas el contexto, los recursos y la autonomía necesarios para ejecutar con criterio.

He aprendido que los equipos de alto desempeño no se construyen aumentando el control, sino eliminando la ambigüedad. Cuando cada persona comprende qué problema estamos resolviendo, por qué es importante, cuál es su contribución, qué dependencias debe gestionar y cómo reconoceremos un resultado exitoso, el seguimiento deja de ser un mecanismo de vigilancia y se transforma en una herramienta de coordinación, aprendizaje y mejora continua.

Por eso, antes de iniciar una iniciativa, procuro que exista una comprensión compartida de lo que significa avanzar y, especialmente, de lo que significa terminar. Definir criterios claros de aceptación, estándares de calidad, responsabilidades, riesgos, restricciones y resultados esperados evita interpretaciones contradictorias y reduce una parte importante del reproceso. Para mí, una definición rigurosa de terminado no es un formalismo metodológico; es un acuerdo de confianza que protege la calidad, alinea expectativas y permite que el equipo actúe con mayor autonomía. En Cafam, con 20 personas probando un WMS, no bajamos los errores un 25 % con más supervisión, sino escribiendo antes de empezar qué contaba como caso probado y quién lo firmaba.

Mi estilo de liderazgo combina claridad en el propósito con flexibilidad en la ejecución. Establezco el resultado que necesitamos alcanzar y los principios que deben orientar el trabajo, pero no pretendo imponer una única manera de llegar a él. Confío en el conocimiento especializado de las personas, promuevo la discusión fundamentada y procuro que las mejores decisiones surjan de la evidencia, el análisis colectivo y la experiencia del equipo, no de la jerarquía de quien expresa una opinión.

## Los equipos que he liderado: 20 personas en Cafam, 12 en Inglopres, 5 en Banco Pichincha

<!-- seccion: equipos-que-he-liderado -->

El equipo más grande que he liderado fue el de **Cafam**: 20 personas, 14 de Cafam y 6 del proveedor del WMS, en las pruebas de implementación de Oracle WMS Cloud para un centro de distribución de medicamentos, entre octubre de 2020 y junio de 2021. Antes y después hubo equipos de otro tamaño y otra naturaleza:

| Dónde               | Cuándo                          | Equipo                                                                                                                                      | Resultado                                                           |
| ------------------- | ------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------- |
| **Inglopres**       | agosto 2016 – junio 2017        | 12 personas, operarios y técnicos                                                                                                           | 95 % de satisfacción del cliente, medida en encuesta                |
| **Ceinfes**         | noviembre 2017 – noviembre 2018 | tres frentes: unas 7 personas en programación (más unos 50 profesores de forma indirecta), unas 12 en digitalización y unas 20 en logística | más de 100 colegios por año atendidos a tiempo                      |
| **Cafam**           | octubre 2020 – junio 2021       | 20 personas, 14 propias y 6 del proveedor                                                                                                   | −25 % de errores y +15 % de eficiencia operativa                    |
| **Banco Pichincha** | marzo – julio 2023              | 5 personas a cargo en el equipo de BI                                                                                                       | 50+ usuarios adoptaron los dashboards; −35 % en tiempos de análisis |

Después de Cafam mi liderazgo cambió de forma: pasé a liderar **procesos completos que integran una gran cantidad de personas que no me reportan**. En Vesting, entre agosto de 2023 y enero de 2025, lideré la estrategia de datos de la startup: la plataforma en Microsoft Fabric y el proceso core de once etapas con el que se diseñaron e implementaron 27 agentes, trabajando directamente con los fundadores. En la Fundación CTIC, desde marzo de 2025, lidero la estrategia institucional de inteligencia artificial y la analítica que usan 20 líderes de 15 procesos. Ninguno de esos dos encargos tiene un organigrama debajo de mí; los dos exigen más liderazgo que cualquiera de los anteriores, porque el resultado depende de personas sobre las que no tengo autoridad jerárquica.

## Cómo trabajo con personas que no me reportan

<!-- seccion: personas-que-no-me-reportan -->

Esta forma de liderar resulta especialmente importante en iniciativas de datos e inteligencia artificial, donde la calidad de una solución depende de la colaboración entre perspectivas muy diferentes. Especialistas en datos, analítica, desarrollo, arquitectura, experiencia de usuario, procesos, seguridad, gobierno y conocimiento del negocio deben trabajar alrededor de una visión común. Mi función es conectar esas capacidades, facilitar un lenguaje compartido y asegurar que la sofisticación técnica permanezca subordinada al propósito, la confiabilidad, la adopción y el valor de la solución.

También diferencio entre delegar tareas y distribuir verdaderamente la capacidad de decidir. La autonomía no consiste en dejar a las personas solas frente a un objetivo; consiste en proporcionarles contexto suficiente, límites explícitos, acceso oportuno a la información y espacios seguros para plantear riesgos, cuestionar supuestos y proponer alternativas. Cuando estos elementos existen, las personas no solo ejecutan mejor, sino que desarrollan criterio, asumen responsabilidad sobre el resultado y fortalecen progresivamente su capacidad para resolver problemas de mayor complejidad.

Tres veces he trabajado en iniciativas donde la colaboración no podía ordenarse. En Cafam, el equipo era mixto: 14 personas de la caja y 6 del proveedor del WMS, con intereses contractuales distintos, y la única manera de que un caso de prueba se cerrara era que las dos partes hubieran acordado antes qué significaba «probado». En C&M Consultores, entre julio de 2021 y mayo de 2022, coordiné mesas de trabajo con la dirección de los concesionarios del SITP —empresas que no dependían de nosotros ni entre sí— para definir estrategias de mejora, y los indicadores del sistema subieron un 25 %. En la Fundación CTIC la estrategia de IA solo avanza si los líderes de proceso la adoptan: mi línea directa es con la Dirección de Planeación y con las subdirecciones de tecnología, gestión de la información y calidad, y de ahí baja a cada proceso con su responsable. En los tres casos la herramienta fue la misma: un problema de cada actor claramente entendido, una definición de terminado acordada antes de empezar y evidencia visible para todos.

## Seguimiento visible, no vigilancia: Kanban, Scrum y una junta cada viernes

<!-- seccion: seguimiento-visible -->

No creo en una cultura de seguimiento basada en reuniones constantes, reportes excesivos o supervisión de la actividad individual. Prefiero construir mecanismos de trabajo en los que el avance, los bloqueos, las decisiones y las dependencias sean visibles para todos. Esta transparencia permite intervenir donde realmente se necesita, anticipar dificultades, coordinar esfuerzos y mantener conversaciones basadas en hechos. El seguimiento deja entonces de responder a la pregunta de quién está trabajando y se concentra en comprender si estamos generando el resultado correcto, con la calidad esperada y al ritmo que requiere la organización.

La primera vez que monté ese mecanismo fue en Ceinfes, en 2018: con el área de tecnología llevé la operación a **Kanban** —un tablero de tirón con límite al trabajo en curso para el flujo de solicitudes— y a **Scrum con sprints** para los proyectos, y presenté a la junta directiva un informe **cada viernes** durante un año. La junta no recibía una lista de actividades: recibía indicadores de logística, digitalización y programación de recursos humanos, y de esos viernes salieron decisiones concretas —programas de incentivos, mejoras de condiciones laborales, rediseño de puestos de trabajo, rediseño de procesos y rediseño del software—. Ese es el seguimiento que me interesa: el que produce una decisión, no el que produce un reporte.

Tampoco concibo el error como una razón automática para intensificar el control. En entornos de innovación, analítica e inteligencia artificial, cierta experimentación es indispensable para descubrir mejores soluciones. Mi enfoque consiste en diferenciar los errores que producen aprendizaje de aquellos que provienen de riesgos ignorados, controles insuficientes o falta de disciplina. Promuevo una cultura en la que sea posible experimentar de manera responsable, validar hipótesis tempranamente, documentar aprendizajes y corregir el rumbo antes de que una incertidumbre se convierta en un problema de gran escala. En Cafam, por ejemplo, la validación de inventario entre el WMS y el sistema de origen se hizo sobre los medicamentos del 80-20: al inicio ninguno coincidía, y en vez de buscar culpables se convirtió en una revisión permanente que fue cerrando las diferencias medicamento por medicamento.

## Elevar al equipo: retroalimentación, autonomía y madurez

<!-- seccion: elevar-al-equipo -->

Para mí, liderar también implica elevar las capacidades del equipo. Procuro identificar las fortalezas de cada persona, crear oportunidades para que asuma desafíos progresivamente más complejos y fomentar la transferencia de conocimiento como una práctica habitual. Un equipo no debería volverse más dependiente de su líder con el tiempo; debería desarrollar mayor autonomía, mejores criterios de decisión y una capacidad creciente para sostener y ampliar los resultados alcanzados. En Banco Pichincha eso tomó la forma de un programa de formación para 12 profesionales; en Inglopres, la de un equipo de 12 operarios y técnicos que alcanzó un 95 % de satisfacción del cliente asignando y monitoreando tareas, no supervisando personas.

La retroalimentación ocupa un lugar central en este proceso. Busco que sea oportuna, específica y orientada al crecimiento, no una evaluación tardía limitada a señalar desviaciones. Del mismo modo, espero que el equipo pueda cuestionar mis decisiones y ofrecerme retroalimentación con la misma apertura. Considero que la autoridad no reduce la necesidad de escuchar; la incrementa. Cuanto mayor es la responsabilidad de una persona, más importante resulta proteger la diversidad de perspectivas y evitar que la jerarquía silencie información relevante.

Mi liderazgo se adapta a la naturaleza del desafío y al grado de madurez del equipo. Hay momentos que requieren mayor dirección, especialmente cuando existe incertidumbre, presión crítica o una capacidad que todavía está en formación. En otros contextos, mi principal contribución consiste en remover obstáculos, facilitar decisiones y permitir que las personas avancen. No aplico la autonomía como una fórmula uniforme; la desarrollo de manera consciente, acompañando a cada persona hasta que pueda ejercerla con responsabilidad y confianza.

En última instancia, no evalúo mi liderazgo por la cantidad de decisiones que pasan por mí, sino por la claridad con la que el equipo puede avanzar cuando no estoy presente. Un liderazgo efectivo se refleja en personas que comprenden el propósito, colaboran con transparencia, resuelven problemas con criterio, mantienen estándares elevados y asumen responsabilidad sobre el impacto de su trabajo. Mi objetivo no es ser el centro de la operación, sino contribuir a construir equipos capaces de aprender, adaptarse y generar resultados sostenibles en escenarios complejos.

## Cómo me comunico con las áreas de negocio y la alta dirección

<!-- seccion: como-hablo-con-el-negocio -->

A lo largo de mi trayectoria he trabajado de manera cercana con la alta dirección, líderes de negocio y responsables de áreas estratégicas: la junta directiva de Ceinfes, la dirección de los concesionarios del SITP, los directores de Cafam, los fundadores de Vesting y hoy la Dirección de Planeación y las subdirecciones de la Fundación CTIC. Esta experiencia me ha enseñado que comunicar analítica e inteligencia artificial en escenarios ejecutivos no consiste en simplificar excesivamente la complejidad ni en exhibir profundidad técnica. Consiste en convertir esa complejidad en una comprensión clara de la realidad, de sus implicaciones y de las decisiones que deben tomarse.

Cuando converso con la alta dirección, no comienzo por la herramienta, el modelo o la arquitectura. Comienzo por el propósito empresarial, la decisión que necesita ser tomada y el impacto que puede generar. Mi responsabilidad es conectar los datos con las preguntas de la organización, presentar los hallazgos en un lenguaje comprensible y hacer explícitas las consecuencias de actuar, esperar o mantener el curso actual. La tecnología pertenece al diseño de la solución; la conversación ejecutiva debe concentrarse en el valor, el riesgo, la oportunidad y la capacidad de ejecución.

He aprendido que una persona no decide sobre una tabla, un dashboard o una colección de indicadores. Decide cuando puede comprender una situación, reconocer sus causas, comparar alternativas y explicar con confianza por qué una acción resulta conveniente. Por eso, detrás de cada análisis procuro construir una narrativa ejecutiva que responda con claridad qué está ocurriendo, por qué importa, qué evidencia lo demuestra, qué puede suceder y qué decisión conviene considerar. Llego con dos niveles: una lámina con la consecuencia y un número, y detrás la base trazable por si la piden. Trabajo en inglés profesional (B2) cuando el equipo o la dirección lo exigen.

## La junta directiva de Ceinfes y las mesas del SITP: dos escuelas de comunicación ejecutiva

<!-- seccion: junta-directiva-y-mesas-sitp -->

Aprendí a hablar con el negocio en dos escenarios muy distintos, y en los dos la conversación se movió por la misma razón: una frase defendible con su procedencia detrás.

La primera escuela fue la **junta directiva de Ceinfes**, a la que presenté informes **cada viernes** entre noviembre de 2017 y noviembre de 2018. Llegaba con los KPI de tres áreas —logística, digitalización de datos y programación de recursos humanos— sobre una operación que atendía más de 100 colegios por año, con unas 250 hojas digitalizadas por jornada y un 10 % de captura manual. La junta no discutía la aritmética: discutía qué hacer. De esos viernes salieron programas de incentivos, mejoras de condiciones laborales, el rediseño de puestos de trabajo y de procesos y el rediseño del software de la operación; incluso la programación de recursos humanos, que al inicio se hacía a mano con Google Calendar, terminó en una macro VBA que yo diseñé para optimizarla, porque el dato del viernes mostró dónde se perdía el tiempo.

La segunda escuela fueron las **mesas de trabajo con la dirección de los concesionarios del SITP**, en C&M Consultores, para la Fuerza Operativa de TransMilenio. Allí la audiencia no me reportaba ni tenía por qué creerme: eran empresas con contratos e intereses propios, y mis informes sustentaban consecuencias contractuales y económicas. Lo que hizo posible acordar estrategias de mejora fue que cada cifra llegaba con su fuente —recaudo, flota y GPS, programación, novedades y PQR, unificadas en un ETL que subió un 70 % la precisión y la velocidad del análisis— y con su definición explícita. Los indicadores del sistema mejoraron un 25 % después de esas mesas.

Después vinieron audiencias distintas con la misma regla: en Cafam, los directores de medicamentos, TI, proyecto y centro de distribución leían el BI de control; en Vesting trabajé directamente con los fundadores de la startup; en la Fundación CTIC tengo comunicación permanente con la Directora de Planeación y los subdirectores de tecnología, gestión de la información y calidad. Cambian el sector y la jerarquía; no cambia que una decisión necesita una frase clara y una cifra que se pueda defender.

## Hechos, hipótesis y recomendaciones: organizar la complejidad, no ocultarla

<!-- seccion: organizar-la-complejidad -->

Para mí, una comunicación ejecutiva efectiva no oculta la complejidad, sino que la organiza. Distingo cuidadosamente entre hechos, interpretaciones, hipótesis y recomendaciones, porque cada uno requiere un nivel diferente de confianza. También hago visibles los supuestos, las restricciones y los márgenes de incertidumbre. No presento una estimación como si fuera una medición ni una correlación como si demostrara causalidad. Explicar los límites de un análisis no debilita una recomendación; fortalece la calidad de la decisión y la confianza de quienes deben respaldarla.

Mantengo una regla fundamental: toda cifra debe tener identidad y procedencia. Si no puedo explicar de dónde proviene un dato, cómo fue transformado, qué definición representa, cuándo fue actualizado y bajo qué condiciones puede utilizarse, considero que todavía no está listo para respaldar una decisión importante. La trazabilidad no es para mí un detalle técnico ni documental. Es una condición esencial para construir confianza, facilitar la validación y proteger a la organización frente a interpretaciones equivocadas. La regla la aplico también sobre mí mismo: las cifras de esta hoja de vida distinguen si fueron medidas, calculadas, declaradas o estimadas —el «cerca de 60 %» de menor esfuerzo en la Fundación CTIC va con «cerca de» porque es una estimación, y así se dice—.

Este principio se extiende a las plataformas analíticas, las aplicaciones inteligentes y los agentes de inteligencia artificial que diseño. Cada resultado relevante debe conservar el contexto necesario para comprender si procede de una observación directa, un cálculo, una declaración, una regla de negocio, una estimación o una inferencia generada mediante inteligencia artificial. Cuando una solución puede mostrar no solo una respuesta, sino también su origen, nivel de confianza y condiciones de uso, deja de funcionar como una caja negra y comienza a convertirse en una capacidad empresarial confiable. Las fichas técnicas de las 32 piezas de mi vitrina etiquetan cada cifra con su procedencia por esa razón.

## Comunicar qué puede y qué no puede hacer la inteligencia artificial

<!-- seccion: comunicar-los-limites-de-la-ia -->

En el caso de la inteligencia artificial, considero especialmente importante comunicar con precisión qué puede hacer una solución, qué no puede garantizar y en qué decisiones debe mantenerse la intervención humana. Un agente de IA puede consultar información, sintetizar conocimiento, recomendar acciones o ejecutar determinadas tareas, pero su utilidad empresarial depende de que opere dentro de límites claros, utilice fuentes autorizadas y permita verificar los elementos que fundamentan sus resultados. La confianza no debe basarse en la apariencia de seguridad de una respuesta, sino en la solidez de la arquitectura, la calidad de los datos y la posibilidad de supervisar su comportamiento.

Lo practico en cada agente que construyo, y con la alta dirección lo digo antes de que lo pregunten. El Experto ISO 42001 de mi vitrina no dictamina conformidad ni sustituye una auditoría: localiza requisitos y cita el apartado y la página del corpus, o declara el vacío. El chat de esta misma hoja de vida responde solo con lo que este corpus dice y muestra las fuentes que usó; cuando no encuentra respaldo, lo dice en vez de inventar. En Vesting, entre agosto de 2023 y enero de 2025, el monitoreo en tiempo real de hasta 23 agentes a la vez existía justamente para que los fundadores y los clientes supieran qué había hecho cada agente, con qué costo y en qué estado, y no tuvieran que confiar en la apariencia de una respuesta. Y en la Fundación CTIC, la estrategia de IA fija qué casos de uso avanzan y con qué controles: de 12 oportunidades identificadas, 7 casos evaluados, 3 priorizados y 2 documentados, y ninguno se presenta a la dirección como si ya estuviera resuelto.

## Involucrar a la dirección desde la definición del problema

<!-- seccion: direccion-desde-la-definicion -->

Mi relación con la alta dirección no se limita a presentar resultados cuando una iniciativa ha terminado. Procuro involucrarla desde la definición del problema, porque es allí donde se determinan las preguntas correctas, los resultados esperados, los riesgos aceptables y los criterios con los que se evaluará el éxito. Este trabajo conjunto permite que las soluciones nazcan alineadas con la estrategia, evita inversiones desconectadas de las prioridades reales y facilita que las decisiones de arquitectura, gobierno y adopción respondan a una visión empresarial compartida. En la Fundación CTIC, las 12 oportunidades de IA identificadas se evaluaron con los líderes de proceso y las subdirecciones antes de que ninguna tuviera arquitectura: 7 casos evaluados, 3 priorizados y 2 documentados, cada uno con su responsable en el negocio.

También entiendo que trabajar con la dirección requiere adaptar la conversación sin perder rigor. Una junta directiva, un comité ejecutivo, una dirección funcional y un equipo operativo necesitan niveles diferentes de detalle, pero todos deben recibir una versión coherente de la realidad. Mi función es conservar la misma verdad analítica mientras ajusto la profundidad, el lenguaje y el foco a la responsabilidad de cada audiencia. No comunico menos información; comunico la información necesaria para que cada persona pueda actuar desde su ámbito de decisión. Es lo que permite un modelo semántico compartido, como el que dejé en Banco Pichincha en 2023: cambia la profundidad de cada vista, no la cifra.

No concibo una presentación ejecutiva como una transmisión unidireccional de conclusiones. La utilizo como un espacio para contrastar perspectivas, descubrir información que aún no está representada en los datos, cuestionar supuestos y construir acuerdos sobre el camino a seguir. La dirección aporta contexto estratégico, conocimiento institucional y comprensión del entorno. Mi contribución consiste en estructurar ese conocimiento, conectarlo con evidencia verificable y convertirlo en decisiones que puedan traducirse en acciones, responsables y mecanismos de seguimiento.

## Alternativas explícitas y una decisión con responsable, plazo e indicador

<!-- seccion: decision-con-responsable -->

Cuando presento varias alternativas, procuro hacer explícitos sus beneficios, costos, dependencias, riesgos y efectos sobre la organización. Mi objetivo no es llevar una solución aparentemente terminada para obtener aprobación, sino proporcionar los elementos necesarios para que la dirección pueda ejercer su criterio. Una recomendación sólida debe ser clara en su orientación, transparente en sus supuestos y suficientemente trazable para ser defendida ante otras instancias de gobierno. En Cafam, por ejemplo, las integraciones VBA que siguieron corriendo tras la salida a producción se defendieron con sus cifras —+15 % de automatización y −50 % de errores de datos— y no con la novedad de la herramienta.

Después de una conversación ejecutiva, busco que no quede únicamente una presentación convincente. Debe quedar una comprensión compartida del problema, una decisión explícita, un responsable, un horizonte de ejecución y una forma concreta de medir el resultado. Para mí, comunicar bien no significa conseguir asentimiento durante una reunión. Significa lograr que la evidencia se convierta en una decisión y que la decisión pueda avanzar hacia una acción verificable. Los viernes de Ceinfes terminaban así: no con «gracias por el informe», sino con un programa de incentivos aprobado, un puesto de trabajo rediseñado o un cambio de software con fecha.

En última instancia, mi propósito al hablar con el negocio es construir un puente confiable entre la complejidad tecnológica y la responsabilidad ejecutiva. Traduzco datos, modelos analíticos, aplicaciones y arquitecturas de inteligencia artificial en conversaciones sobre crecimiento, eficiencia, riesgo, sostenibilidad y transformación. La calidad de mi comunicación no se mide por la cantidad de información que presento, sino por la claridad que genero, la confianza que construyo y la capacidad de decisión que dejo instalada en la organización.

## Qué valoro en un proyecto: un problema real con impacto medible

<!-- seccion: que-valoro -->

Valoro los proyectos que convierten problemas relevantes en capacidades empresariales duraderas. Para mí, una iniciativa de alto valor no comienza con una herramienta, una tecnología o una solución previamente definida. Comienza con un problema real, suficientemente importante para justificar la inversión y lo bastante claro como para establecer una línea base, formular resultados esperados y medir de manera objetiva si la intervención produjo una mejora.

El primer criterio que evalúo es la relevancia del problema. Necesito comprender qué situación debe cambiar, quién experimenta sus consecuencias, qué procesos o decisiones afecta, cuánto valor se está perdiendo y qué ocurriría si la organización decidiera no intervenir. Esta comprensión evita que la innovación se convierta en una búsqueda de casos de uso para una tecnología y permite concentrar el esfuerzo en desafíos que realmente importan. No considero valioso un proyecto por la novedad de sus componentes, sino por la magnitud y sostenibilidad del resultado que puede generar. En TransMilenio el problema era nítido: la operación generaba datos más rápido de lo que podían analizarse, con cinco fuentes que no se hablaban; el ETL que las unificó subió un 70 % la precisión y la velocidad del análisis, y esa cifra existe porque el problema tenía línea base.

También procuro que cada proyecto tenga una relación explícita entre inversión, adopción e impacto. Los indicadores técnicos pueden demostrar que una solución funciona, pero no necesariamente que está generando valor. Por eso, además de evaluar calidad, precisión, disponibilidad o desempeño, considero necesario medir su incorporación en los procesos, la frecuencia y profundidad de uso, las decisiones que habilita, el tiempo que libera, los riesgos que reduce y los resultados que contribuye a mejorar. El valor debe poder observarse más allá de la implementación: en Banco Pichincha los modelos predictivos de fuga, mora y riesgo tenían más de 90 % de precisión, pero lo que valió fue que llegaron a producción y mejoraron un 35 % las predicciones que el negocio ya usaba.

## Un responsable del negocio dispuesto a adoptar la solución

<!-- seccion: responsable-del-negocio -->

El segundo criterio es la existencia de un responsable del negocio dispuesto a convertir la solución en parte de la operación. No basta con contar con patrocinio ejecutivo o aprobación presupuestal. Un proyecto necesita personas que conozcan el contexto, participen en la definición del problema, validen los resultados, lideren la adopción y asuman responsabilidad sobre el valor esperado. Cuando la tecnología carece de un propietario en el negocio, puede alcanzar una gran calidad técnica y aun así permanecer desconectada de las decisiones y los procesos que debía transformar.

Tengo un caso para cada lado de esa afirmación. En Banco Pichincha, los más de 50 usuarios que adoptaron los dashboards existieron porque el negocio definió las preguntas antes de que el equipo de 5 personas construyera una sola visualización, y el aumento del 25 % en la toma de decisiones fue de ellos, no del tablero. En Cafam, el BI de control de la implementación del WMS tuvo quince usuarios con nombre de cargo —las direcciones de medicamentos, de TI, del proyecto y del centro de distribución, y los coordinadores y jefes del centro— y por eso mejoró un 50 % la precisión del seguimiento de las pruebas: cada hallazgo tenía a alguien que respondía por cerrarlo. En la Fundación CTIC, los 42 productos analíticos están asignados a 20 líderes de 15 procesos, y hay 10 planes de análisis en seguimiento con esos mismos líderes.

Y el caso contrario también lo he visto, sin nombrarlo: un producto correcto, publicado, sin nadie del negocio que lo necesitara para decidir, que perdió relevancia en poco tiempo. Es la razón por la que la primera pregunta de cualquier proyecto no es «qué datos hay» sino «quién va a decidir con esto».

## Una capacidad que sobreviva a quien la construyó

<!-- seccion: capacidad-que-sobrevive -->

El tercer criterio es que la capacidad creada pueda funcionar, mantenerse y evolucionar sin depender permanentemente de quienes la construyeron. Para mí, una solución no está realmente terminada cuando supera una demostración o entra en producción. Está terminada cuando cuenta con una arquitectura comprensible, fuentes y transformaciones trazables, componentes reutilizables, controles definidos, documentación útil, mecanismos de observabilidad y un modelo operativo que permita a otras personas administrarla, reproducirla y mejorarla de manera segura.

Esta condición es especialmente importante en iniciativas de datos e inteligencia artificial. Una plataforma analítica, una aplicación inteligente o un agente de IA no debería concebirse como una pieza aislada. Debe integrarse a una arquitectura más amplia, operar sobre información confiable, respetar límites explícitos, gestionar adecuadamente identidades y permisos, conservar evidencia de sus resultados y permitir la intervención humana cuando el nivel de riesgo lo requiera. El verdadero valor no reside únicamente en que la solución funcione hoy, sino en que la organización pueda confiar en ella, gobernarla y adaptarla a medida que cambian sus necesidades.

Vesting es mi prueba de este criterio. Entre agosto de 2023 y enero de 2025 diseñé desde cero el ecosistema de datos de la startup en Microsoft Fabric —120 tablas, 20 GB, 1.000 eventos por día, 12 clientes integrados en workspaces separados— y el monitoreo en tiempo real de sus agentes; pero lo que dejé no fue una plataforma que solo yo entendía: fue el proceso core de once etapas, documentado y validado, con el que se diseñaron e implementaron los 27 agentes del inventario, para que cada agente nuevo aprovechara lo aprendido en los anteriores. Cerré esa etapa al dejar el ecosistema y el proceso documentados; la startup siguió construyendo sobre ellos sin mí. Ese es el resultado que persigo: no que me necesiten, sino que no me necesiten.

## Activos reutilizables y transferencia de conocimiento

<!-- seccion: activos-reutilizables -->

También valoro que cada proyecto produzca activos reutilizables. Si una iniciativa resuelve un único caso, genera un beneficio puntual. Si además deja patrones de arquitectura, componentes, conectores, evaluaciones, criterios de seguridad, prácticas de gobierno y aprendizajes reproducibles, crea una base que reduce el costo y el riesgo de las siguientes iniciativas. En ese punto, el proyecto deja de ser una implementación aislada y se convierte en una plataforma para acelerar nuevas capacidades.

Esta lógica resulta particularmente relevante en el diseño de soluciones y agentes de inteligencia artificial. El objetivo no debería ser construir un agente como una demostración independiente, sino establecer un marco confiable para identificar casos de uso, seleccionar patrones de solución, conectar fuentes autorizadas, evaluar la calidad de las respuestas, administrar riesgos, supervisar comportamientos y llevar nuevas capacidades a producción de manera consistente. El primer agente puede demostrar la viabilidad, pero el activo estratégico es el sistema que permite construir, gobernar y escalar los siguientes. Así nació en Vesting el proceso core, y así funciona mi propio pipeline: las 6 aplicaciones de mi vitrina nacen del mismo método —la misma forma de planear por sprints, las mismas pruebas automatizadas y los mismos controles—, de modo que cada una aprovecha lo aprendido en la anterior.

La transferencia de conocimiento forma parte del resultado esperado. No considero suficiente entregar documentación extensa si nadie puede utilizarla. Procuro que el conocimiento quede incorporado en estándares, repositorios, decisiones de arquitectura, procedimientos operativos, mecanismos automatizados y prácticas que otros equipos puedan aplicar. Documentar no consiste en registrar retrospectivamente lo que se hizo. Consiste en diseñar desde el comienzo una solución comprensible, observable y transferible. Las 32 piezas de la vitrina llevan cada una su ficha técnica con el mismo contrato —promesa, cifras con procedencia, límites, lo que nunca hace, proceso en BPMN—, y ese contrato es el mismo que las otras casas usan para entregar las suyas.

## Un proyecto que aprende después de implementarse

<!-- seccion: proyecto-que-aprende -->

Un proyecto de alto valor también debe aprender después de su implementación. Las necesidades cambian, los datos evolucionan, los modelos pueden degradarse, los usuarios descubren nuevas formas de utilizar las soluciones y aparecen riesgos que no siempre eran visibles en el diseño inicial. Por eso, valoro las iniciativas que incluyen mecanismos para observar su comportamiento, recibir retroalimentación, medir resultados, detectar desviaciones y evolucionar de forma controlada. La puesta en producción no representa el final del proyecto, sino el comienzo de su validación en la realidad.

Tres ejemplos con fecha. El modelo de demanda por franja horaria que construí para TransMilenio en C&M Consultores corrió 10 meses con actualización mensual, validado con RMSE respetando el orden temporal, y lo usaban los profesionales que presentaban el informe de demanda de referencia a las unidades: un modelo que no se reentrena y no se observa deja de valer sin avisar. En Vesting, el monitoreo en tiempo real de hasta 23 agentes a la vez era la forma de que un agente en producción siguiera aprendiendo del uso real y no solo del diseño. Y en la Fundación CTIC, los 42 productos analíticos no se entregaron y ya: hay 10 planes de análisis en seguimiento, que son la manera de saber si el tablero cambió una decisión o solo se publicó.

En síntesis, valoro tres condiciones fundamentales: que el problema sea real y su impacto pueda medirse, que exista un responsable del negocio comprometido con convertir la solución en una capacidad adoptada, y que el resultado pueda operar y evolucionar sin generar dependencia de sus creadores. Cuando además el proyecto deja una arquitectura, unos componentes y una forma de trabajo que pueden reutilizarse, su valor trasciende el caso inicial. No busco construir soluciones que demuestren únicamente lo que la tecnología puede hacer. Busco construir capacidades que la organización pueda adoptar, gobernar, escalar y mejorar. El entregable resuelve una necesidad; la capacidad transforma la manera de responder a las siguientes.

## Cómo decido qué construir: la intervención más sencilla que produce el resultado

<!-- seccion: como-decido-que-construir -->

No parto de la premisa de que todos los problemas necesitan una solución tecnológica ni de que la alternativa más avanzada sea necesariamente la más adecuada. Antes de construir, procuro determinar cuál es la intervención más sencilla, segura y sostenible capaz de producir el resultado esperado. En algunos casos será suficiente mejorar un proceso, aclarar una definición o fortalecer la calidad de los datos. En otros, tendrá sentido desarrollar una solución analítica, una aplicación inteligente, una automatización o un agente de inteligencia artificial.

Mi criterio parte del valor y no de la novedad. Evalúo la importancia del problema, la frecuencia con la que ocurre, el impacto potencial de resolverlo, la disponibilidad y confiabilidad de la información, el nivel de incertidumbre, los riesgos involucrados y la capacidad de la organización para adoptar y operar la solución. Esta evaluación permite diferenciar entre una idea técnicamente interesante y una oportunidad empresarial que realmente merece inversión. En Cafam, en 2020, la intervención correcta para integrar el centro de distribución con el WMS fueron aplicaciones en VBA —disponibles, útiles y mantenibles en esa organización— y no una plataforma nueva; subieron un 15 % la automatización, bajaron un 50 % los errores de datos y siguieron corriendo después de la salida a producción. En Ceinfes, la programación de recursos humanos que se hacía a mano con Google Calendar no necesitó un sistema: necesitó una macro VBA que la optimizara.

Cuando existe incertidumbre significativa, prefiero aprender antes de escalar. Diseño validaciones progresivas que permitan comprobar las hipótesis más importantes con el menor costo y riesgo razonables. Una exploración de datos, un prototipo funcional, una prueba controlada o una implementación limitada pueden generar la evidencia necesaria para decidir si conviene avanzar, modificar el enfoque o detener la iniciativa. No considero que detener un proyecto después de invalidar correctamente una hipótesis sea un fracaso. Evitar una inversión sin fundamento también es una forma de generar valor. En mi pipeline la regla está escrita: ninguna aplicación avanza sin su prioridad y su visión documentadas, y la exploración de Google Cloud sigue siendo exploración —sin horizonte y sin uso real declarado— porque la evidencia todavía no justifica más.

## Un instrumento para cada decisión: del reporte al agente

<!-- seccion: el-instrumento-para-cada-decision -->

No todo problema necesita un tablero, ni un modelo, ni un agente. Ordeno los instrumentos por el nivel de agencia que la organización les cede: **un reporte documenta; un tablero permite explorar; una alerta dirige la atención; un modelo predictivo anticipa; una recomendación propone; una aplicación organiza la ejecución; un agente actúa dentro de límites.** Cuanto más cerca está el instrumento de intervenir la operación, más exige: calidad de datos, claridad de reglas, trazabilidad, controles y supervisión.

En soluciones de inteligencia artificial, esta disciplina resulta especialmente importante. No todo problema requiere un modelo generativo ni toda interacción necesita convertirse en un agente. Antes de elegir un patrón de solución, analizo si la necesidad exige interpretar lenguaje, recuperar conocimiento, generar contenido, recomendar acciones, coordinar herramientas o ejecutar tareas con determinado nivel de autonomía. La arquitectura debe responder a la naturaleza del problema, no a la tendencia tecnológica del momento. En mi pipeline la regla se llama «código primero»: activar una función con IA generativa exige una decisión escrita que justifique por qué el código determinista no alcanza.

He subido y bajado esa escalera según el caso. En C&M Consorcio 2018 el instrumento correcto fueron informes —2 semanales, 1 consolidado mensual y los que se pidieran a demanda— porque la supervisión de unas 150 rutas necesitaba evidencia documentada, no exploración. En Banco Pichincha, el escalón correcto para fuga y mora fue el modelo predictivo con la persona decidiendo, no un agente. En Vesting, agentes que actuaban con límites explícitos y monitoreo en tiempo real. En la Fundación CTIC, primero la analítica —42 productos por procesos— y solo después la IA que la evidencia justifique: 12 oportunidades, 7 evaluadas, 3 priorizadas. Elijo el escalón por el valor y el riesgo de equivocarse, no por la novedad.

## Autonomía proporcional al riesgo

<!-- seccion: autonomia-proporcional-al-riesgo -->

También evalúo el riesgo de equivocación. Cuanto mayor sea el impacto potencial de una respuesta incorrecta o de una acción no deseada, mayores deben ser la trazabilidad, los controles, la supervisión humana y las restricciones operativas. La autonomía de una solución no es una característica que deba maximizarse indiscriminadamente; debe diseñarse en proporción al nivel de confianza, verificabilidad y riesgo que la organización está preparada para administrar.

Diseño la autonomía de manera gradual. Una solución puede comenzar proporcionando información, avanzar hacia la recomendación de acciones y, cuando exista suficiente evidencia y control, ejecutar determinadas tareas dentro de límites explícitos. Este enfoque permite que la capacidad tecnológica evolucione al mismo ritmo que la confianza organizacional y evita delegar decisiones antes de comprender adecuadamente sus riesgos. Es la escalera que aplico en la Fundación CTIC: la evaluación de impacto de cada sistema de IA decide cuánto puede hacer solo, y un caso de uso avanza con controles proporcionales a su riesgo, no con los que la herramienta trae por defecto.

Mi objetivo es encontrar el equilibrio correcto entre ambición y viabilidad. Busco soluciones suficientemente innovadoras para transformar la forma de trabajar, pero también suficientemente comprensibles, gobernables y sostenibles para funcionar en la realidad. Construir bien es importante. Elegir correctamente qué construir, por qué hacerlo y hasta dónde permitirle actuar es una responsabilidad aún mayor. En los 13 agentes de mi vitrina esa decisión está escrita en cada ficha técnica como límites y como lo que el agente «nunca» hace; el Constructor de Tableros Power BI, por ejemplo, tiene 5 gates de aprobación humana y ninguna corrida cierra sin que una persona apruebe el resultado.

## La confianza se diseña desde el comienzo

<!-- seccion: la-confianza-se-disena -->

No considero la confianza como una reacción que aparece después de implementar una solución. La entiendo como una propiedad que debe diseñarse desde el comienzo. Las personas confían en una capacidad analítica o de inteligencia artificial cuando pueden comprender qué hace, reconocer de dónde proviene la información, verificar los elementos que respaldan sus resultados y saber qué ocurrirá cuando la solución encuentre una situación para la que no fue preparada.

Por eso, incorporo la calidad, la seguridad, la privacidad, la trazabilidad y el gobierno como condiciones de diseño, no como revisiones posteriores. Una solución puede ser funcional y, aun así, no estar preparada para operar dentro de una organización. Para alcanzar ese nivel necesita utilizar fuentes autorizadas, aplicar controles de acceso, proteger la información sensible, conservar evidencia de sus transformaciones y ofrecer mecanismos para detectar errores, comportamientos inesperados o degradaciones en el desempeño. En Vesting esa fue la decisión de arquitectura de partida: identidad, propiedad y aislamiento de cada cliente en workspaces separados desde el primer evento, porque no se podían añadir después.

En las soluciones analíticas, la confianza exige que las métricas tengan definiciones consistentes, responsables identificados y reglas de cálculo verificables. No es suficiente presentar una cifra; es necesario asegurar que diferentes áreas comprendan lo mismo cuando la utilizan. Una plataforma analítica adquiere valor empresarial cuando reduce la discusión sobre cuál dato es correcto y permite concentrar la conversación en las decisiones que deben tomarse. En Banco Pichincha, cada indicador quedó con una definición y una medida DAX en el modelo semántico que todos los productos reutilizaban; la discusión pasó de «cuál número es el bueno» a «qué hacemos con este».

## Confianza en agentes de IA: controles, evaluación y diseño para la excepción

<!-- seccion: confianza-en-agentes-de-ia -->

En las aplicaciones y agentes de inteligencia artificial, la confianza requiere controles adicionales. Es necesario establecer qué información pueden consultar, qué herramientas tienen permitido utilizar, qué acciones pueden ejecutar, cuáles requieren aprobación humana y cómo se registrará su comportamiento. También es necesario evaluar la calidad de sus resultados de manera sistemática, porque una demostración convincente no garantiza un desempeño confiable frente a la diversidad de situaciones que encontrará en producción. En Vesting, cada uno de los 27 agentes del inventario dejaba su rastro —solicitud, respuesta, estado, costo— en la plataforma, y hasta 23 se vigilaban a la vez en tiempo real; sin ese registro no había forma de saber si un agente se había equivocado.

También considero indispensable diseñar para la excepción. Una solución madura no es la que aparenta tener una respuesta para todo, sino la que reconoce sus límites, comunica la incertidumbre y sabe cuándo debe detenerse, solicitar información adicional o transferir la decisión a una persona. En sistemas inteligentes, abstenerse de actuar puede ser una capacidad tan valiosa como actuar correctamente. El chat de esta hoja de vida está construido así: si el proveedor de modelos falla, cae a una búsqueda local sobre el mismo corpus en vez de quedarse mudo; y si el corpus no respalda la pregunta, lo declara.

Mi objetivo no es construir soluciones que parezcan infalibles. Busco desarrollar capacidades transparentes, evaluables y gobernables, en las que la organización pueda confiar precisamente porque conoce sus fortalezas, sus límites y los mecanismos disponibles para supervisarlas. La innovación sostenible no surge de reducir los controles, sino de diseñarlos de manera que permitan avanzar con seguridad. Cómo se gobierna eso a escala institucional —inventario, evaluación de impacto, 23 instrumentos bajo UNE-ISO/IEC 42001:2025— está en el documento de gobierno de datos y de IA.

## Cómo aprendo y evoluciono

<!-- seccion: como-aprendo-y-evoluciono -->

Trabajo en campos que evolucionan con una velocidad extraordinaria, pero no confundo actualización con acumulación de herramientas. Mi forma de aprender consiste en comprender los principios que permanecen, experimentar con las capacidades que emergen y evaluar con criterio cuáles pueden convertirse en soluciones confiables para problemas reales. No adopto una tecnología únicamente porque sea nueva: la estudio, la pruebo, identifico sus límites y procuro comprender cómo modifica las posibilidades de diseño, los riesgos y las responsabilidades de una organización. El aprendizaje adquiere valor cuando puede traducirse en mejores decisiones de arquitectura, prácticas más sólidas y capacidades que otras personas también pueden utilizar.

La medida de esa forma de aprender está en otro documento, con fechas: Microsoft Fabric desde agosto de 2023, con menos de un año en el mercado, hasta el DP-600 en diciembre de 2024; Codex, Antigravity y Claude Code en cerca de un mes desde su salida; las rutas AI-103 y AI-300 en curso desde julio de 2026. Cómo aprendo, con cada plazo y cada prueba, está en el documento «cómo aprendo».
