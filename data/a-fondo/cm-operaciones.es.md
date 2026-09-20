---
slug: cm-operaciones
titulo: "C&M Consorcio / TransMilenio — Analista de Operaciones (2018–2020)"
resumen: "Mi entrada al transporte masivo: 18 meses supervisando con datos la operación de Bogotá, tableros e informes de desempeño, automatización del procesamiento y las dos preguntas que hoy son investigaciones."
cuando_usar: "Úsalo cuando pregunten por la operación de transporte de una ciudad en C&M Consorcio (2018–2019): supervisión de rutas y concesionarias de TransMilenio, automatización de reportes con Excel, VBA y SQL, indicadores de cumplimiento y el histórico operacional."
estado: aprobado
ancla: "#trayectoria"
actualizado: 2026-09-20
preguntas_de_prueba:
  - "¿Qué hizo Henry en C&M Consorcio?"
  - "¿Qué experiencia tiene con datos de transporte masivo?"
  - "¿Ha supervisado el cumplimiento de una operación con datos?"
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
Tu entrada al mundo del transporte masivo: qué dashboards
construiste, cómo era trabajar con los datos de la operación de Bogotá, qué
automatizaste. -->

## La operación de una ciudad: la supervisión de TransMilenio

<!-- seccion: la-operacion-de-una-ciudad -->

Ingresé a C&M Consorcio 2018 en noviembre de 2018 como Analista de Operaciones Junior, dentro de la supervisión de TransMilenio, y permanecí allí hasta mayo de 2020: 18 meses. Esta experiencia representó mi entrada al transporte masivo y el primer escenario de mi trayectoria en el que debí analizar una operación de escala urbana, compuesta por múltiples actores, servicios, vehículos, recorridos, obligaciones contractuales y eventos producidos de manera continua. En cifras, la supervisión cubría unas 150 rutas agrupadas en 10 empresas concesionarias.

Hasta ese momento había utilizado los datos para comprender y dirigir procesos organizacionales delimitados: un proceso en Inglopres, una operación en Ceinfes. En el sistema de transporte, el reto era diferente: necesitaba reconstruir el comportamiento de una operación extensa a partir de registros generados por fuentes diversas, con distintos niveles de detalle, oportunidad y calidad. Ninguna fuente contenía por sí sola una representación completa de lo que sucedía. La realidad debía construirse relacionando programación, ejecución, recorridos, tiempos, novedades y condiciones operativas. Las fuentes, nombradas, eran cinco:

- el recaudo;
- la flota y el GPS de los buses;
- la programación de servicios;
- las novedades de la operación;
- las PQR de los usuarios.

Cada una registraba una parte de la operación con su propia estructura, su propia frecuencia y su propia calidad, y cada una llegaba por separado. Cruzarlas era el trabajo.

## Supervisar con datos: la trazabilidad como condición de legitimidad

<!-- seccion: supervisar-con-datos -->

La palabra que mejor define esta experiencia es supervisión. Nuestro papel no consistía en operar directamente el sistema, sino en evaluar con evidencia si la operación ejecutada correspondía con las condiciones definidas: verificábamos con datos que TransMilenio se operara como estaba pactado. Esto modificaba profundamente la naturaleza del dato. La información no se utilizaba únicamente para mejorar un proceso interno, sino para sustentar conversaciones entre diferentes actores, verificar el cumplimiento de compromisos y establecer una interpretación defendible de los resultados. El dato dejaba de servir para mejorar tu propio proceso y pasaba a sostener una conversación entre la autoridad y el concesionario, donde ninguna de las dos partes podía discutir de dónde había salido el número.

En ese contexto comprendí que la trazabilidad no es solamente una característica técnica. Es una condición de legitimidad. Cuando un indicador puede tener efectos operativos, contractuales o económicos, debe ser posible explicar qué representa, de qué fuentes proviene, qué reglas fueron aplicadas y qué eventos concretos sustentan su resultado. La confianza no podía depender de quién presentaba la cifra, sino de la capacidad de reconstruirla.

Con 10 empresas concesionarias del otro lado de la mesa, esa regla no era una preferencia metodológica: cada informe podía ser discutido por diez actores con intereses distintos, y el único argumento que resistía era el linaje completo del dato, desde el registro de GPS o de recaudo hasta la cifra del informe.

## Los tableros y los informes de desempeño

<!-- seccion: tableros-e-informes -->

Desarrollé tableros e informes de desempeño orientados a fortalecer el control y la transparencia de la operación: dos informes semanales, un consolidado mensual y los que se pedían a demanda. Para hacerlo, debía transformar grandes volúmenes de registros en indicadores comprensibles, identificar desviaciones relevantes y presentar una visión que permitiera pasar del dato individual al comportamiento general del sistema. Lo que se verificaba en ellos:

- servicios programados frente a realizados;
- recorridos y cobertura;
- frecuencias e intervalos entre buses;
- tiempos de ejecución y cumplimiento de la operación.

Esta experiencia me enseñó que un tablero de supervisión no puede limitarse a mostrar resultados agregados. Debe permitir recorrer cada indicador desde la visión ejecutiva hasta el evento operacional que lo sustenta. La síntesis facilita la decisión, pero el detalle preserva la posibilidad de validar, explicar y controvertir una conclusión con base en evidencia.

La transparencia adquirió entonces un significado concreto: que los diferentes actores pudieran observar el mismo resultado, comprender su definición y reconocer cómo había sido calculado. Cuando dos partes discuten permanentemente sobre el origen de una cifra, el problema no se encuentra únicamente en la visualización. Puede estar en las fuentes, las reglas, las transformaciones o la ausencia de una definición compartida. Con 150 rutas en el informe semanal, una definición ambigua de «servicio realizado» se convertía en 150 discusiones.

## El indicador como evidencia contractual; resultado frente a comportamiento

<!-- seccion: indicador-como-evidencia -->

En una operación supervisada, el indicador no era solamente una herramienta de gestión. También podía convertirse en evidencia para evaluar el cumplimiento de compromisos y sustentar consecuencias contractuales: de una cifra podían colgar un descuento o una sanción. Esto exigía un nivel adicional de rigor: no bastaba con obtener un resultado razonable; era necesario conservar la relación entre la programación, la ejecución observada, las reglas aplicadas y la conclusión presentada. Allí aprendí que, cuando una cifra puede afectar responsabilidades o pagos, su linaje —el data lineage— debe ser tan sólido como su cálculo.

Allí consolidé una forma de trabajo que posteriormente trasladé a modelos semánticos y soluciones empresariales en Power BI. Una métrica debe tener un significado estable, conservar su trazabilidad y responder a una pregunta relevante. El tablero es la capa de interacción, pero su confiabilidad depende de la arquitectura de información que conecta los eventos operativos con el modelo analítico y la decisión.

También aprendí a diferenciar entre indicadores de resultado e indicadores de comportamiento. Los primeros —los lagging— permitían evaluar lo ocurrido durante un periodo. Los segundos —los leading— ayudaban a comprender cómo se estaba formando ese resultado, dónde aparecían irregularidades y qué condiciones podían afectar el desempeño futuro. En TransMilenio, el cumplimiento del consolidado mensual era un indicador de resultado; el intervalo entre buses de una ruta, semana a semana, era uno de comportamiento, y era el que avisaba antes. Esta distinción fue fundamental para evolucionar posteriormente desde la descripción hacia la predicción, la recomendación y la intervención.

## La automatización de reportes y tareas repetitivas: Excel, VBA y SQL

<!-- seccion: la-automatizacion -->

Implementé soluciones para automatizar actividades recurrentes de preparación, validación y consolidación de información, reduciendo la intervención manual y mejorando la consistencia del procesamiento. Las herramientas fueron Excel y VBA para los scripts, y SQL sobre bases en SQLite para los análisis: cada semana los concesionarios nos pasaban sus bases, y había que extraer los registros, validarlos, transformarlos con las mismas reglas y consolidarlos en el acumulado. Esa automatización redujo al menos un 40 % el tiempo de procesamiento. Además de liberar tiempo analítico, permitió aplicar las mismas reglas de manera repetible y disminuir la dependencia de procedimientos individuales difíciles de auditar.

Sin embargo, automatizar no consistía únicamente en ejecutar más rápido una secuencia existente. Antes era necesario identificar qué entradas recibía el proceso, qué validaciones debían realizarse, qué reglas transformaban los datos, qué excepciones podían presentarse y qué resultado debía producirse. Una automatización construida sobre definiciones ambiguas procesa las inconsistencias con mayor velocidad, pero no las corrige.

El orden importaba: primero la regla escrita, después la macro. Con 10 concesionarios entregando bases con estructuras distintas, la validación de entrada —campos obligatorios, rangos posibles, duplicados— era la parte del script que más veces cambió y la que más errores evitó. Un informe que sale rápido pero con una base mal cargada es peor que uno tardío, porque la cifra equivocada ya está en la mesa cuando se descubre.

## La memoria estadística: el histórico de la operación

<!-- seccion: la-memoria-estadistica -->

Las bases estadísticas se convirtieron en la memoria analítica de la operación. Permitían comparar periodos, identificar patrones, observar recurrencias y distinguir entre un evento aislado y un comportamiento persistente. Conservar esa historia resultaba indispensable para comprender la evolución del sistema y evitar que cada análisis comenzara nuevamente desde cero. Las bases semanales de los concesionarios, organizadas en SQLite, se convirtieron en un acumulado sobre el que se podían hacer análisis acumulativos: la misma ruta, el mismo intervalo, mes tras mes.

Los datos dejaron de utilizarse únicamente para responder a una necesidad inmediata y comenzaron a conservarse de manera estructurada para comparar periodos, reconocer recurrencias, identificar patrones y distinguir entre eventos aislados y comportamientos persistentes. Aprendí que una organización no puede mejorar de forma acumulativa si cada análisis comienza desde cero o si el conocimiento desaparece cuando cambia la persona que lo produce.

Esta etapa fortaleció mi comprensión del pipeline de datos como una capacidad completa. La información debía ser extraída, validada, transformada, relacionada, almacenada y puesta a disposición bajo reglas consistentes. Fue mi primer pipeline de datos completo, años antes de hacerlo sobre una plataforma: después profundizaría esta práctica mediante plataformas modernas de datos, modelos semánticos y arquitecturas analíticas, pero aquí, entre 2018 y 2020, aprendí su principio fundamental: el resultado solo es confiable cuando también lo es el recorrido que lo produce.

## Auditar el cumplimiento de los protocolos operativos

<!-- seccion: adherencia-a-protocolos -->

Parte de mi responsabilidad consistía en verificar la adherencia a los protocolos y condiciones operativas de TransMilenio. Esto implicaba contrastar la ejecución con aquello que había sido programado o definido, utilizando datos para evaluar aspectos como los servicios realizados, los recorridos, los tiempos y el cumplimiento de la operación. Es, en la práctica, una auditoría de cumplimiento contractual, y los indicadores tenían consecuencia económica.

Esta función me enseñó a distinguir entre cumplimiento formal y desempeño sistémico. Una operación puede satisfacer individualmente varios criterios y, aun así, producir un resultado deficiente por la interacción entre sus componentes. Por eso, además de verificar si una condición se había cumplido, necesitaba comprender cómo las decisiones sobre vehículos, conductores, rutas y demanda se combinaban para producir el resultado final.

También aprendí a desconfiar de las optimizaciones locales. Una decisión podía parecer eficiente para un vehículo, una ruta, un servicio o una franja horaria y, al mismo tiempo, deteriorar la regularidad, la cobertura o el cumplimiento del sistema completo. Comprendí que analizar una operación urbana exige observar las interacciones y los efectos acumulados, no solamente el desempeño aislado de sus componentes. La eficiencia de una parte no garantiza el desempeño del conjunto, y con 150 rutas la suma de eficiencias locales rara vez coincidía con el cumplimiento del sistema.

## La asignación conductor–vehículo–ruta: una pregunta prescriptiva

<!-- seccion: asignacion-conductor-vehiculo-ruta -->

La asignación de recursos hizo especialmente visible esta complejidad. Un conductor disponible, un vehículo operativo y una ruta programada no constituyen tres decisiones independientes. Forman una unidad operacional cuyo desempeño depende de la compatibilidad entre sus características, de las condiciones de la ruta, de la demanda y de las restricciones —y las fallas— presentes durante el servicio. Analizar cada elemento mediante listas separadas podía ocultar relaciones determinantes para el cumplimiento.

Esta comprensión abrió mi interés hacia una analítica de naturaleza prescriptiva. La información histórica permitía saber qué combinación había sido utilizada y qué resultado había producido. Sin embargo, una decisión operacional necesita también evaluar qué combinación debería utilizarse para maximizar el cumplimiento, la capacidad movilizada o el aprovechamiento de los recursos bajo restricciones reales. El histórico decía qué combinación se había usado y qué había producido; decidir cuál usar era otra pregunta, prescriptiva, que los indicadores no contestaban.

La relación entre conductor, vehículo, ruta, demanda y condiciones operativas me mostró que muchas decisiones no pueden abordarse mediante listas o indicadores independientes. Su resultado depende de la compatibilidad y las restricciones que existen entre todos los elementos del sistema. Lo detecté en los datos de TransMilenio entre 2018 y 2020; la formulación como problema de asignación con restricciones, y su respuesta, llegaron después.

## Los convoyes de buses (bus bunching) y la política de actuación

<!-- seccion: convoyes-de-buses -->

Otro fenómeno relevante era la formación de agrupamientos o convoyes de vehículos: el apelotonamiento de buses, el bus bunching. Al analizar la proximidad temporal entre pasos, era posible reconocer situaciones en las que varios buses de una misma ruta comenzaban a circular con intervalos demasiado reducidos. Aunque cada vehículo continuara prestando el servicio, el sistema perdía regularidad de intervalos —el headway—: algunos usuarios encontraban varios vehículos juntos y otros enfrentaban tiempos de espera mayores.

Detectar el fenómeno era solamente el primer nivel del problema. El desafío más importante consistía en convertir la detección en una política de actuación. Si la organización puede observar una anomalía, pero no dispone de una instrucción aplicable para responder mientras sucede, el análisis permanece separado de la operación. Esta experiencia me llevó a comprender que la secuencia completa debe conectar detección, explicación, recomendación, decisión e intervención.

También identifiqué que algunas reglas concebidas para proteger la operación podían limitar la capacidad de corregirla. Una instrucción uniforme puede ser apropiada en condiciones normales, pero insuficiente cuando los vehículos ya se encuentran agrupados y requieren acciones diferenciadas según su posición dentro del convoy: retener, adelantar o saltar paradas según el lugar que ocupa cada bus en el grupo. Esto reforzó mi interés por políticas condicionadas al contexto, capaces de responder al estado real del sistema en lugar de aplicar siempre la misma instrucción. En 2019 esto era una anomalía visible en un tablero de intervalos; no tenía, desde la supervisión, cómo convertirla en una regla de control.

## Del indicador a la acción: informar, recomendar o ejecutar

<!-- seccion: del-indicador-a-la-accion -->

Estos aprendizajes anticiparon una pregunta que hoy es central en mi trabajo con aplicaciones y agentes de inteligencia artificial: cuánto debe limitarse una solución a informar y cuándo puede recomendar o ejecutar una acción. Un indicador hace visible una desviación. Una alerta dirige la atención. Un modelo propone una respuesta. Una aplicación organiza la ejecución. Un agente puede coordinar herramientas y actuar dentro de límites definidos. El nivel adecuado depende del riesgo, la oportunidad, la verificabilidad y la supervisión necesaria.

En este punto comencé a reconocer distintos niveles de capacidad analítica. Un indicador permite observar. Una alerta dirige la atención hacia una condición relevante. Un modelo predictivo anticipa un comportamiento probable. Un modelo prescriptivo compara alternativas y recomienda una respuesta. Una aplicación puede organizar la ejecución y una solución inteligente puede actuar dentro de límites definidos. Aunque esas capacidades se desarrollarían con mayor profundidad en etapas posteriores de mi trayectoria, las preguntas que las hicieron necesarias comenzaron a surgir en esta experiencia, en la supervisión de TransMilenio.

El análisis de fenómenos como la formación de agrupamientos de buses me permitió comprender que detectar una anomalía es apenas el comienzo. El verdadero valor aparece cuando la información permite explicar el fenómeno, evaluar alternativas y orientar una intervención aplicable mientras todavía existe la posibilidad de modificar el resultado. Un convoy que aparece en el informe de la semana siguiente ya no se puede disolver; el mismo convoy detectado mientras se forma, con una regla de intervalo aplicable, sí.

## Las dos preguntas que no supe responder entonces, y que hoy son investigaciones

<!-- seccion: las-dos-preguntas -->

De los datos de esos 18 meses salieron dos preguntas que detecté en la operación y no tenía cómo resolver desde la supervisión.

La asignación conductor–vehículo–ruta. Un conductor disponible, un bus operativo y una ruta programada no son tres decisiones independientes: forman una unidad cuyo desempeño depende de la compatibilidad entre sus características, de la ruta, de la demanda y de las fallas que aparecen durante el servicio. Modelar la falla como una propiedad del par conductor–bus, y no de cada uno por separado, es lo que cambia la asignación.

El apelotonamiento de buses, el bus bunching. Al mirar la proximidad temporal entre pasos, se veía cuándo varios buses de una misma ruta empezaban a circular con intervalos demasiado cortos. Cada bus seguía prestando servicio, pero el sistema perdía regularidad de intervalos: unos usuarios encontraban varios buses juntos y otros esperaban el doble. Detectarlo era el primer nivel; el difícil era convertir la detección en una política de control de intervalo, porque una instrucción uniforme no sirve cuando los buses ya van juntos.

Esas dos preguntas son hoy dos de las siete investigaciones que publico en la vitrina: la asignación de conductor y bus con fallas, formulada con programación entera y por restricciones sobre datos abiertos del sistema de transporte, y el control del apelotonamiento de buses, estudiado con simulación de eventos discretos y un detector de convoyes validado. Lo que en 2019 era una anomalía en un tablero es ahora un modelo con su método y su resultado. Y hay una tercera línea que nació de la misma trayectoria pero de otro empleo: la del orden de reemplazo de un ERP, que viene de Cafam, no de aquí.

## Lo que este rol preparó: supervisión, transparencia y memoria analítica

<!-- seccion: lo-que-preparo -->

Vista en retrospectiva, C&M Consorcio 2018 fue mi primera inmersión en datos operacionales de escala urbana. Allí aprendí a integrar fuentes heterogéneas, construir indicadores trazables, automatizar procesos de información, conservar memoria estadística y traducir eventos individuales en una representación coherente del comportamiento de un sistema. La escala dejó de depender únicamente del volumen de registros y comenzó a expresarse en la cantidad de relaciones, actores, reglas y consecuencias que debían representarse correctamente para comprender la operación: 150 rutas, 10 concesionarios, cinco fuentes.

También comprendí que la supervisión exige una disciplina analítica distinta. El dato debe ser suficientemente sólido para sostener conversaciones entre actores con responsabilidades, intereses y obligaciones diferentes. Cada conclusión necesita evidencia, cada transformación debe poder explicarse y cada indicador debe conservar el vínculo con las condiciones operativas que representa. Cuando una cifra puede sustentar la evaluación de compromisos o generar consecuencias contractuales y económicas, su linaje debe ser tan riguroso como su cálculo.

Esta experiencia me enseñó que la transparencia no consiste únicamente en permitir que varias partes consulten el mismo resultado. Exige que puedan comprender su definición, reconstruir su procedencia y reconocer las reglas mediante las cuales los registros operacionales se convirtieron en una conclusión. Esa disciplina anticipó varios de los principios que posteriormente aplicaría en gobierno de datos, modelos semánticos y plataformas analíticas: definiciones compartidas, transformaciones controladas, evidencia verificable y una única interpretación defendible del resultado.

La automatización y la construcción de bases estadísticas permitieron, además, que la operación desarrollara una memoria analítica, y que cada análisis dejara de empezar desde cero. Ese histórico, guardado en SQLite y alimentado cada semana, fue el activo que quedó cuando yo salí en mayo de 2020.

## Lo que este rol preparó: de la descripción a la prescripción

<!-- seccion: de-la-descripcion-a-la-prescripcion -->

Esta etapa amplió progresivamente el tipo de preguntas que podía formular. Primero necesitaba determinar qué había ocurrido. Después, comprender por qué había ocurrido. Finalmente, comencé a preguntarme qué asignaciones de recursos podían producir mejores resultados y qué políticas permitirían responder oportunamente ante condiciones anómalas. Allí surgió mi interés por avanzar desde la analítica descriptiva hacia capacidades predictivas y prescriptivas, y allí aparece la transición que después recorrí en C&M Consultores, con un modelo de predicción de demanda, y en Banco Pichincha, con modelos predictivos en producción.

C&M Consorcio 2018 me enseñó a leer una operación urbana a través de sus datos. Aprendí que observar un sistema es mucho más que producir indicadores: exige reconstruir sus relaciones, identificar los mecanismos que explican su comportamiento, conservar evidencia sobre las transformaciones y reconocer qué información hace falta para intervenirlo con mayor precisión.

Esta experiencia estableció varios fundamentos de mi trabajo actual. La integración de fuentes evolucionaría hacia pipelines y plataformas de datos. La necesidad de definiciones consistentes se convertiría en modelado semántico y gobierno de la información. La automatización del procesamiento abriría el camino hacia aplicaciones más inteligentes. Las preguntas sobre asignación e intervención se transformarían en problemas predictivos y prescriptivos, y en dos de las siete investigaciones que publico. La exigencia de trazabilidad terminaría extendiéndose hasta la evaluación y observabilidad de soluciones y agentes de inteligencia artificial.

Esta base preparó mi evolución posterior hacia soluciones analíticas más integradas, gobernadas y cercanas a la acción, sin atribuir a esta etapa capacidades que desarrollaría más adelante. En C&M Consorcio 2018 aprendí a reconstruir el sistema para hacerlo observable. Las experiencias siguientes me permitirían convertir esa observación en una arquitectura de datos, decisiones y soluciones progresivamente más avanzadas.
