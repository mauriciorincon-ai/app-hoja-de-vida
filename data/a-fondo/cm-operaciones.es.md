---
slug: cm-operaciones
titulo: "C&M Consorcio / TransMilenio — Analista de Operaciones (2018–2020)"
resumen: "Mi entrada al transporte masivo: los datos de la operación de Bogotá y los primeros tableros."
estado: borrador
ancla: "#trayectoria"
actualizado: 2026-09-12
preguntas_de_prueba:
  - "¿Qué hizo Henry en C&M Consorcio?"
  - "¿Qué experiencia tiene con datos de transporte masivo?"
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

## La operación de una ciudad

<!-- seccion: la-operacion-de-una-ciudad -->

Ingresé a C&M Consorcio 2018 en noviembre de 2018 como Analista de Operaciones Junior, dentro de la supervisión de TransMilenio, y permanecí allí hasta mayo de 2020. Esta experiencia representó mi entrada al transporte masivo y el primer escenario de mi trayectoria en el que debí analizar una operación de escala urbana, compuesta por múltiples actores, servicios, vehículos, recorridos, obligaciones contractuales y eventos producidos de manera continua.

Hasta ese momento había utilizado los datos para comprender y dirigir procesos organizacionales delimitados. En el sistema de transporte, el reto era diferente: necesitaba reconstruir el comportamiento de una operación extensa a partir de registros generados por fuentes diversas, con distintos niveles de detalle, oportunidad y calidad. Ninguna fuente contenía por sí sola una representación completa de lo que sucedía. La realidad debía construirse relacionando programación, ejecución, recorridos, tiempos, novedades y condiciones operativas.

La palabra que mejor define esta experiencia es supervisión. Nuestro papel no consistía en operar directamente el sistema, sino en evaluar con evidencia si la operación ejecutada correspondía con las condiciones definidas. Esto modificaba profundamente la naturaleza del dato. La información no se utilizaba únicamente para mejorar un proceso interno, sino para sustentar conversaciones entre diferentes actores, verificar el cumplimiento de compromisos y establecer una interpretación defendible de los resultados.

En ese contexto comprendí que la trazabilidad no es solamente una característica técnica. Es una condición de legitimidad. Cuando un indicador puede tener efectos operativos, contractuales o económicos, debe ser posible explicar qué representa, de qué fuentes proviene, qué reglas fueron aplicadas y qué eventos concretos sustentan su resultado. La confianza no podía depender de quién presentaba la cifra, sino de la capacidad de reconstruirla.

## Los tableros y los informes de desempeño

<!-- seccion: tableros-e-informes -->

Desarrollé tableros e informes de desempeño orientados a fortalecer el control y la transparencia de la operación. Para hacerlo, debía transformar grandes volúmenes de registros en indicadores comprensibles, identificar desviaciones relevantes y presentar una visión que permitiera pasar del dato individual al comportamiento general del sistema.

Esta experiencia me enseñó que un tablero de supervisión no puede limitarse a mostrar resultados agregados. Debe permitir recorrer cada indicador desde la visión ejecutiva hasta el evento operacional que lo sustenta. La síntesis facilita la decisión, pero el detalle preserva la posibilidad de validar, explicar y controvertir una conclusión con base en evidencia.

La transparencia adquirió entonces un significado concreto: que los diferentes actores pudieran observar el mismo resultado, comprender su definición y reconocer cómo había sido calculado. Cuando dos partes discuten permanentemente sobre el origen de una cifra, el problema no se encuentra únicamente en la visualización. Puede estar en las fuentes, las reglas, las transformaciones o la ausencia de una definición compartida.

En una operación supervisada, el indicador no era solamente una herramienta de gestión. También podía convertirse en evidencia para evaluar el cumplimiento de compromisos y sustentar consecuencias contractuales. Esto exigía un nivel adicional de rigor: no bastaba con obtener un resultado razonable; era necesario conservar la relación entre la programación, la ejecución observada, las reglas aplicadas y la conclusión presentada. Allí aprendí que, cuando una cifra puede afectar responsabilidades o pagos, su linaje debe ser tan sólido como su cálculo.

Allí consolidé una forma de trabajo que posteriormente trasladé a modelos semánticos y soluciones empresariales en Power BI. Una métrica debe tener un significado estable, conservar su trazabilidad y responder a una pregunta relevante. El tablero es la capa de interacción, pero su confiabilidad depende de la arquitectura de información que conecta los eventos operativos con el modelo analítico y la decisión.
También aprendí a diferenciar entre indicadores de resultado e indicadores de comportamiento. Los primeros permitían evaluar lo ocurrido durante un periodo. Los segundos ayudaban a comprender cómo se estaba formando ese resultado, dónde aparecían irregularidades y qué condiciones podían afectar el desempeño futuro. Esta distinción fue fundamental para evolucionar posteriormente desde la descripción hacia la predicción, la recomendación y la intervención.

## La automatización y la memoria estadística

<!-- seccion: la-automatizacion -->

Implementé soluciones para automatizar actividades recurrentes de preparación, validación y consolidación de información, reduciendo la intervención manual y mejorando la consistencia del procesamiento. Además de liberar tiempo analítico, la automatización permitió aplicar las mismas reglas de manera repetible y disminuir la dependencia de procedimientos individuales difíciles de auditar.

Sin embargo, automatizar no consistía únicamente en ejecutar más rápido una secuencia existente. Antes era necesario identificar qué entradas recibía el proceso, qué validaciones debían realizarse, qué reglas transformaban los datos, qué excepciones podían presentarse y qué resultado debía producirse. Una automatización construida sobre definiciones ambiguas procesa las inconsistencias con mayor velocidad, pero no las corrige.

Las bases estadísticas se convirtieron en la memoria analítica de la operación. Permitían comparar periodos, identificar patrones, observar recurrencias y distinguir entre un evento aislado y un comportamiento persistente. Conservar esa historia resultaba indispensable para comprender la evolución del sistema y evitar que cada análisis comenzara nuevamente desde cero.

Esta etapa fortaleció mi comprensión del pipeline de datos como una capacidad completa. La información debía ser extraída, validada, transformada, relacionada, almacenada y puesta a disposición bajo reglas consistentes. Años después profundizaría esta práctica mediante plataformas modernas de datos, modelos semánticos y arquitecturas analíticas, pero aquí aprendí su principio fundamental: el resultado solo es confiable cuando también lo es el recorrido que lo produce.

## Supervisar el cumplimiento y comprender el sistema

<!-- seccion: adherencia-a-protocolos -->

Parte de mi responsabilidad consistía en verificar la adherencia a los protocolos y condiciones operativas. Esto implicaba contrastar la ejecución con aquello que había sido programado o definido, utilizando datos para evaluar aspectos como los servicios realizados, los recorridos, los tiempos y el cumplimiento de la operación.

Esta función me enseñó a distinguir entre cumplimiento formal y desempeño sistémico. Una operación puede satisfacer individualmente varios criterios y, aun así, producir un resultado deficiente por la interacción entre sus componentes. Por eso, además de verificar si una condición se había cumplido, necesitaba comprender cómo las decisiones sobre vehículos, conductores, rutas y demanda se combinaban para producir el resultado final.

La asignación de recursos hizo especialmente visible esta complejidad. Un conductor disponible, un vehículo operativo y una ruta programada no constituyen tres decisiones independientes. Forman una unidad operacional cuyo desempeño depende de la compatibilidad entre sus características, de las condiciones de la ruta, de la demanda y de las restricciones presentes durante el servicio. Analizar cada elemento mediante listas separadas podía ocultar relaciones determinantes para el cumplimiento.

Esta comprensión abrió mi interés hacia una analítica de naturaleza prescriptiva. La información histórica permitía saber qué combinación había sido utilizada y qué resultado había producido. Sin embargo, una decisión operacional necesita también evaluar qué combinación debería utilizarse para maximizar el cumplimiento, la capacidad movilizada o el aprovechamiento de los recursos bajo restricciones reales.

Otro fenómeno relevante era la formación de agrupamientos o convoyes de vehículos. Al analizar la proximidad temporal entre pasos, era posible reconocer situaciones en las que varios buses comenzaban a circular con intervalos demasiado reducidos. Aunque cada vehículo continuara prestando el servicio, el sistema perdía regularidad: algunos usuarios encontraban varios vehículos juntos y otros enfrentaban tiempos de espera mayores.

Detectar el fenómeno era solamente el primer nivel del problema. El desafío más importante consistía en convertir la detección en una política de actuación. Si la organización puede observar una anomalía, pero no dispone de una instrucción aplicable para responder mientras sucede, el análisis permanece separado de la operación. Esta experiencia me llevó a comprender que la secuencia completa debe conectar detección, explicación, recomendación, decisión e intervención.

También identifiqué que algunas reglas concebidas para proteger la operación podían limitar la capacidad de corregirla. Una instrucción uniforme puede ser apropiada en condiciones normales, pero insuficiente cuando los vehículos ya se encuentran agrupados y requieren acciones diferenciadas según su posición dentro del convoy. Esto reforzó mi interés por políticas condicionadas al contexto, capaces de responder al estado real del sistema en lugar de aplicar siempre la misma instrucción.

Estos aprendizajes anticiparon una pregunta que hoy es central en mi trabajo con aplicaciones y agentes de inteligencia artificial: cuánto debe limitarse una solución a informar y cuándo puede recomendar o ejecutar una acción. Un indicador hace visible una desviación. Una alerta dirige la atención. Un modelo propone una respuesta. Una aplicación organiza la ejecución. Un agente puede coordinar herramientas y actuar dentro de límites definidos. El nivel adecuado depende del riesgo, la oportunidad, la verificabilidad y la supervisión necesaria.

## Lo que este rol preparó

<!-- seccion: lo-que-preparo -->

Vista en retrospectiva, esta experiencia fue mi primera inmersión en datos operacionales de escala urbana. Aprendí a integrar fuentes heterogéneas, construir indicadores trazables, automatizar procesos de información, mantener memoria estadística y traducir eventos individuales en una representación coherente del comportamiento de un sistema.

También comprendí que la supervisión requiere una disciplina analítica diferente. El dato debe ser suficientemente sólido para sostener conversaciones entre actores con intereses y responsabilidades distintas. Cada conclusión necesita evidencia, cada transformación debe ser explicable y cada indicador debe conservar el vínculo con las condiciones operativas que representa.

Esta etapa amplió progresivamente el tipo de preguntas que podía formular. Primero necesitaba determinar qué había ocurrido. Después, comprender por qué había ocurrido. Finalmente, comencé a preguntarme qué combinación de recursos podía producir un mejor resultado y qué política permitiría responder de forma efectiva ante una condición anómala. Allí aparece la transición desde la analítica descriptiva hacia capacidades predictivas y prescriptivas.
 
Vista en retrospectiva, C&M Consorcio 2018 fue mi primera inmersión en datos operacionales de escala urbana. Allí aprendí a integrar fuentes heterogéneas, construir indicadores trazables, automatizar procesos de información, conservar memoria estadística y traducir eventos individuales en una representación coherente del comportamiento de un sistema. La escala dejó de depender únicamente del volumen de registros y comenzó a expresarse en la cantidad de relaciones, actores, reglas y consecuencias que debían representarse correctamente para comprender la operación.

También comprendí que la supervisión exige una disciplina analítica distinta. El dato debe ser suficientemente sólido para sostener conversaciones entre actores con responsabilidades, intereses y obligaciones diferentes. Cada conclusión necesita evidencia, cada transformación debe poder explicarse y cada indicador debe conservar el vínculo con las condiciones operativas que representa. Cuando una cifra puede sustentar la evaluación de compromisos o generar consecuencias contractuales y económicas, su linaje debe ser tan riguroso como su cálculo.

Esta experiencia me enseñó que la transparencia no consiste únicamente en permitir que varias partes consulten el mismo resultado. Exige que puedan comprender su definición, reconstruir su procedencia y reconocer las reglas mediante las cuales los registros operacionales se convirtieron en una conclusión. Esa disciplina anticipó varios de los principios que posteriormente aplicaría en gobierno de datos, modelos semánticos y plataformas analíticas: definiciones compartidas, transformaciones controladas, evidencia verificable y una única interpretación defendible del resultado.

La automatización y la construcción de bases estadísticas permitieron, además, que la operación desarrollara una memoria analítica. Los datos dejaron de utilizarse únicamente para responder a una necesidad inmediata y comenzaron a conservarse de manera estructurada para comparar periodos, reconocer recurrencias, identificar patrones y distinguir entre eventos aislados y comportamientos persistentes. Aprendí que una organización no puede mejorar de forma acumulativa si cada análisis comienza desde cero o si el conocimiento desaparece cuando cambia la persona que lo produce.

También aprendí a desconfiar de las optimizaciones locales. Una decisión podía parecer eficiente para un vehículo, una ruta, un servicio o una franja horaria y, al mismo tiempo, deteriorar la regularidad, la cobertura o el cumplimiento del sistema completo. Comprendí que analizar una operación urbana exige observar las interacciones y los efectos acumulados, no solamente el desempeño aislado de sus componentes. La eficiencia de una parte no garantiza el desempeño del conjunto.

Esta comprensión amplió progresivamente el tipo de preguntas que podía formular. Primero necesitaba determinar qué había ocurrido. Después, comprender por qué había ocurrido. Finalmente, comencé a preguntarme qué asignaciones de recursos podían producir mejores resultados y qué políticas permitirían responder oportunamente ante condiciones anómalas. Allí surgió mi interés por avanzar desde la analítica descriptiva hacia capacidades predictivas y prescriptivas.

La relación entre conductor, vehículo, ruta, demanda y condiciones operativas me mostró que muchas decisiones no pueden abordarse mediante listas o indicadores independientes. Su resultado depende de la compatibilidad y las restricciones que existen entre todos los elementos del sistema. De la misma manera, el análisis de fenómenos como la formación de agrupamientos de buses me permitió comprender que detectar una anomalía es apenas el comienzo. El verdadero valor aparece cuando la información permite explicar el fenómeno, evaluar alternativas y orientar una intervención aplicable mientras todavía existe la posibilidad de modificar el resultado.

En este punto comencé a reconocer distintos niveles de capacidad analítica. Un indicador permite observar. Una alerta dirige la atención hacia una condición relevante. Un modelo predictivo anticipa un comportamiento probable. Un modelo prescriptivo compara alternativas y recomienda una respuesta. Una aplicación puede organizar la ejecución y una solución inteligente puede actuar dentro de límites definidos. Aunque esas capacidades se desarrollarían con mayor profundidad en etapas posteriores de mi trayectoria, las preguntas que las hicieron necesarias comenzaron a surgir en esta experiencia.

C&M Consorcio 2018 me enseñó a leer una operación urbana a través de sus datos. Aprendí que observar un sistema es mucho más que producir indicadores: exige reconstruir sus relaciones, identificar los mecanismos que explican su comportamiento, conservar evidencia sobre las transformaciones y reconocer qué información hace falta para intervenirlo con mayor precisión.

Esta experiencia estableció varios fundamentos de mi trabajo actual. La integración de fuentes evolucionaría hacia pipelines y plataformas de datos. La necesidad de definiciones consistentes se convertiría en modelado semántico y gobierno de la información. La automatización del procesamiento abriría el camino hacia aplicaciones más inteligentes. Las preguntas sobre asignación e intervención se transformarían en problemas predictivos y prescriptivos. La exigencia de trazabilidad terminaría extendiéndose hasta la evaluación y observabilidad de soluciones y agentes de inteligencia artificial.

Esta base preparó mi evolución posterior hacia soluciones analíticas más integradas, gobernadas y cercanas a la acción, sin atribuir a esta etapa capacidades que desarrollaría más adelante. En C&M Consorcio 2018 aprendí a reconstruir el sistema para hacerlo observable. Las experiencias siguientes me permitirían convertir esa observación en una arquitectura de datos, decisiones y soluciones progresivamente más avanzadas.
