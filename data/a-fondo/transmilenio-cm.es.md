---
slug: transmilenio-cm
titulo: "C&M Consultores / TransMilenio — análisis post-operacional (2021–2022)"
resumen: "El análisis post-operacional del SITP: fuentes heterogéneas, mesas de dirección y predicción de demanda."
estado: borrador
ancla: "/proyectos/transmilenio-cm"
actualizado: 2026-09-12
preguntas_de_prueba:
  - "¿Cómo unificó Henry las fuentes de datos heterogéneas del SITP?"
  - "¿Cómo fue el modelo de predicción de demanda del SITP?"
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
El detalle milimétrico: cómo unificaste las fuentes heterogéneas,
cómo eran las mesas con la dirección del SITP, cómo entrenaste la predicción
de demanda con scikit-learn. -->

## El problema: una ciudad que genera datos más rápido de lo que se analizan

<!-- seccion: el-problema -->

Regresé al entorno de TransMilenio en julio de 2021, esta vez como Profesional de Análisis Postoperacional en C&M Consultores, y permanecí en el cargo hasta mayo de 2022. Volví al mismo dominio, pero con una responsabilidad distinta y con una comprensión más madura de la relación entre operación, datos y decisiones.

El análisis postoperacional consiste en reconstruir lo ocurrido para comprender sus causas y decidir cómo debe ajustarse la operación futura. No se limita a describir el día anterior. Debe explicar las diferencias entre lo programado y lo ejecutado, identificar patrones, hacer visibles las restricciones y transformar los resultados observados en decisiones sobre programación, capacidad y servicio.

El principal obstáculo era que la operación generaba información más rápido de lo que podía prepararse y analizarse manualmente. Los datos se encontraban distribuidos entre fuentes heterogéneas, con estructuras, niveles de detalle y reglas diferentes. Una parte considerable del esfuerzo se consumía reuniendo archivos, validando correspondencias y conciliando resultados antes de que pudiera comenzar el análisis realmente valioso.

Esta experiencia me permitió reconocer una diferencia fundamental entre disponer de datos y contar con una capacidad analítica. Los datos podían existir y, aun así, no estar preparados para responder las preguntas de la operación. El verdadero desafío consistía en construir un recorrido confiable desde el evento operacional hasta el indicador, el análisis y la decisión.

## Unificar las fuentes

<!-- seccion: unificar-las-fuentes -->

Diseñé e implementé procesos de extracción, transformación y carga de datos para integrar fuentes heterogéneas y convertirlas en una base analítica común. Esta intervención mejoró en un setenta por ciento la precisión y la velocidad del análisis, al reducir la conciliación manual y aplicar reglas consistentes durante la preparación de la información.

La integración no consistía únicamente en trasladar datos desde diferentes orígenes hacia un repositorio común. Era necesario comprender qué representaba cada registro, armonizar estructuras, resolver diferencias entre identificadores, alinear dimensiones temporales y establecer reglas para relacionar programación, ejecución y resultados. Unificar las fuentes significaba reconstruir una versión coherente de la operación.

La mejora simultánea en velocidad y precisión no fue accidental. Ambas dependían de resolver el mismo problema: sustituir procedimientos manuales y variables por un pipeline reproducible. Cuando las transformaciones se convierten en un proceso definido, las mismas reglas pueden aplicarse en cada ciclo, los errores pueden detectarse con mayor facilidad y el equipo deja de invertir tiempo en reconstruir repetidamente la información.

También incorporé validaciones para identificar datos incompletos, duplicados, inconsistencias y relaciones que no cumplían las reglas esperadas. El objetivo no era corregir silenciosamente las diferencias al final del recorrido, sino hacerlas visibles, rastrear su origen y evitar que avanzaran hasta indicadores o decisiones sin una explicación adecuada.

Aquí profundicé en uno de los fundamentos de mi trabajo actual con plataformas de datos: un pipeline no es una tubería invisible que solamente transporta información. Es una parte de la lógica empresarial. Contiene decisiones sobre calidad, correspondencia, temporalidad, granularidad y significado que deben poder documentarse, evaluarse y reproducirse.

Esta experiencia preparó mi evolución posterior hacia arquitecturas analíticas más avanzadas. Lo que entonces resolvía mediante procesos ETL se convertiría después en pipelines gobernados, modelos semánticos reutilizables y soluciones empresariales en Power BI. La tecnología evolucionó, pero el principio permaneció intacto: una decisión confiable requiere un recorrido de datos igualmente confiable.

## La adopción del BI en la operación

<!-- seccion: la-adopcion -->

Lideré la implementación de herramientas especializadas de inteligencia de negocios, logrando un aumento del treinta y cinco por ciento en la eficiencia de los procesos analíticos y la adopción de los tableros por más de veinticinco usuarios clave.

El término usuarios clave es importante. En una operación de esta naturaleza, el valor no dependía de maximizar el número de personas que abrían un tablero, sino de conseguir que lo utilizaran quienes tenían responsabilidad sobre la programación, el seguimiento y las decisiones de servicio. La adopción debía observarse en la incorporación del producto analítico a las rutinas de trabajo, no solamente en sus estadísticas de acceso.

Para lograrlo, los tableros se diseñaron alrededor de preguntas operacionales concretas. Cada indicador debía permitir reconocer una condición relevante, comprender sus posibles causas y orientar una acción. La solución no debía obligar a los usuarios a interpretar una acumulación de visualizaciones, sino ofrecerles una estructura clara para pasar del resultado general al detalle que requería intervención.

Esta etapa consolidó mi comprensión de que Power BI debe diseñarse como una experiencia de decisión y no como una capa decorativa sobre los datos. Detrás de cada visualización debe existir un modelo coherente, dimensiones compartidas, medidas verificables y rutas de análisis que permitan profundizar sin perder consistencia. La simplicidad que percibe el usuario depende de la rigurosidad de la arquitectura que la sostiene.

También aprendí que una solución analítica adoptada necesita equilibrar estabilidad y evolución. Sus definiciones deben permanecer suficientemente consistentes para generar confianza, pero el producto también debe incorporar nuevas preguntas y aprendizajes a medida que cambia la operación. La adopción no concluye con la publicación. Se sostiene mediante acompañamiento, retroalimentación y mejora continua.

El resultado más importante no fue la cantidad de tableros desarrollados, sino la creación de una visión compartida de la operación. Cuando los responsables utilizan las mismas definiciones y pueden recorrer los resultados hasta su evidencia, la conversación deja de concentrarse en cuál cifra es correcta y puede orientarse hacia qué decisión conviene tomar.

## Las mesas con la dirección del SITP

<!-- seccion: las-mesas-del-sitp -->

Coordiné mesas de trabajo con la dirección de concesionarios del Sistema Integrado de Transporte Público para analizar resultados, definir estrategias de mejora y articular decisiones sobre los procesos. Este trabajo contribuyó a alcanzar una mejora del veinticinco por ciento en los indicadores asociados con las intervenciones realizadas.

Estas mesas me enseñaron que la analítica alcanza su mayor valor cuando consigue alinear actores que observan la operación desde perspectivas diferentes. La autoridad, los concesionarios y los equipos técnicos podían tener responsabilidades, restricciones e interpretaciones distintas. Mi función consistía en proporcionar una base de evidencia común que permitiera comprender el problema antes de discutir la solución.

Para llegar a esa conversación, el dato debía estar preparado para ser examinado. Cada resultado requería una definición clara, una procedencia identificable y una relación verificable con los eventos de la operación. La credibilidad no podía construirse dentro de la reunión. Tenía que estar incorporada previamente en las fuentes, los pipelines, los modelos y las reglas utilizadas para producir el análisis.

También aprendí que una recomendación ejecutiva debe conectar evidencia, mecanismo y consecuencia. No era suficiente señalar que un indicador había empeorado. Era necesario explicar qué condiciones producían el resultado, qué actores podían intervenir, qué alternativas estaban disponibles y cómo se evaluaría posteriormente su efecto.

Esta experiencia fortaleció mi capacidad para comunicar entre niveles operativos, analíticos y directivos. Podía recorrer el problema desde los registros y las reglas de transformación hasta la síntesis ejecutiva, y regresar al detalle cuando una conclusión necesitaba ser explicada o defendida. Esa capacidad continúa siendo esencial en mi trabajo con plataformas analíticas, aplicaciones inteligentes y estrategias empresariales de inteligencia artificial.

Las mesas también hicieron visible que una decisión no genera valor por quedar registrada en un acta. Necesita responsables, acciones, plazos e indicadores que permitan cerrar el ciclo y determinar si la intervención produjo el resultado esperado. La analítica con consecuencia no termina en la recomendación. Incluye la capacidad de observar lo que ocurrió después de actuar.

## La predicción de demanda

<!-- seccion: prediccion-de-demanda -->

Desarrollé con scikit-learn un modelo de aprendizaje automático para predecir mensualmente la demanda del sistema y fortalecer las decisiones de planeación. El modelo incorporaba variables relacionadas con el tipo de día de la semana, la ruta establecida, la hora del día, la presencia de obras civiles, la realización de eventos y las condiciones de tráfico.

La evaluación no debía limitarse a una única medida de desempeño global. También era necesario observar cómo se comportaba el modelo entre rutas, franjas horarias, tipos de día y condiciones excepcionales, porque un buen resultado promedio podía ocultar errores importantes en segmentos críticos de la operación. Esta experiencia fortaleció mi criterio para evaluar modelos no solo por su precisión estadística, sino por la estabilidad, utilidad y confiabilidad de sus resultados dentro del contexto en el que serían utilizados.

El horizonte mensual respondía a una necesidad concreta de planificación. El propósito no era anticipar únicamente el siguiente movimiento de la operación, sino proporcionar una perspectiva suficientemente amplia para ajustar la programación y preparar los recursos con anticipación. La utilidad del modelo dependía de que sus resultados llegaran dentro del ciclo real en el que podían modificarse las decisiones.

Las variables representaban diferentes dimensiones del comportamiento de la demanda. El tipo de día y la hora permitían modelar patrones temporales recurrentes. La ruta incorporaba las diferencias estructurales entre servicios y zonas. Las obras civiles, los eventos y el tráfico introducían condiciones externas capaces de modificar los patrones habituales. El comportamiento del sistema no podía explicarse exclusivamente por su historia; también debía interpretarse dentro del contexto urbano en el que operaba.

El desarrollo del modelo exigió transformar variables operativas y contextuales en características consistentes, organizar datos históricos, controlar su calidad y evaluar si la predicción tenía suficiente utilidad para respaldar decisiones. Esta experiencia me enseñó que el aprendizaje automático no comienza con la selección de un algoritmo. Comienza con la representación correcta del problema, la definición del horizonte y la correspondencia entre la salida del modelo y la decisión que debe habilitar.

El modelo contribuyó a una mejora del veinte por ciento en el rendimiento reportado del sistema. Más allá de la cifra, el aprendizaje fundamental fue que una predicción solo genera valor cuando puede incorporarse en un proceso de decisión. Un modelo puede alcanzar un buen desempeño técnico y seguir siendo irrelevante si entrega la respuesta demasiado tarde, utiliza variables que no estarán disponibles al momento de inferir o produce una salida que la organización no puede convertir en una acción.

Esta fue una de mis primeras experiencias conectando aprendizaje automático con una consecuencia operacional real. También estableció una disciplina que mantengo en el diseño de soluciones inteligentes: definir primero qué decisión se quiere mejorar, determinar con cuánto tiempo de anticipación debe producirse la respuesta y evaluar el modelo tanto por su desempeño técnico como por su impacto dentro del proceso.

Con el tiempo, esta comprensión se ampliaría hacia aplicaciones y agentes de inteligencia artificial. Un modelo genera una predicción; una aplicación puede integrarla con reglas y flujos de trabajo; un agente puede consultar datos, interpretar contexto, proponer acciones y utilizar herramientas dentro de límites definidos. Sin embargo, toda esa capacidad depende del mismo fundamento que aprendí aquí: datos confiables, propósito explícito, evaluación rigurosa y una relación clara entre el resultado y la decisión.

## La automatización

<!-- seccion: la-automatizacion -->

Implementé scripts que redujeron en un cuarenta por ciento el tiempo dedicado a tareas repetitivas de preparación y procesamiento de información. Aunque este logro puede parecer menos sofisticado que un modelo predictivo, fue una condición necesaria para liberar capacidad analítica y concentrar el esfuerzo del equipo en problemas de mayor valor.

La automatización permitió aplicar reglas de forma consistente, reducir la intervención manual y hacer que los ciclos de análisis fueran más rápidos y reproducibles. Actividades que antes debían ejecutarse paso a paso podían incorporarse a un flujo estructurado, con entradas conocidas, transformaciones definidas y resultados verificables.

Esta experiencia me enseñó a observar el trabajo analítico como un pipeline completo. Si la mayor parte del tiempo se consume localizando archivos, consolidando estructuras y corrigiendo formatos, la organización cuenta con analistas, pero no necesariamente con una capacidad analítica escalable. Automatizar esas actividades no elimina el criterio profesional. Lo desplaza hacia tareas en las que puede producir más valor.

También comprendí que la automatización debe incluir controles y manejo de excepciones. Un script que funciona únicamente bajo condiciones ideales traslada el esfuerzo manual hacia la resolución constante de fallas. Una solución sostenible necesita validar sus entradas, registrar desviaciones y hacer visible cuándo una situación requiere revisión humana.

Ese principio continúa vigente en mi trabajo con agentes de IA. La automatización inteligente no consiste en retirar indiscriminadamente a las personas del proceso. Consiste en asignar a la tecnología las actividades que puede ejecutar de forma confiable, conservar trazabilidad sobre sus acciones y transferir a una persona aquellas situaciones que requieren interpretación, juicio o responsabilidad adicional.

## Lo que C&M Consultores consolidó

<!-- seccion: lo-que-cm-consultores-consolido -->

Vista en retrospectiva, C&M Consultores fue la experiencia en la que convertí mi conocimiento de la operación de transporte en una capacidad analítica más integrada. La etapa anterior me había enseñado a reconstruir y supervisar el sistema mediante datos. En esta nueva responsabilidad avancé hacia la automatización de su preparación, la unificación de fuentes, la adopción de herramientas de inteligencia de negocios y la incorporación de modelos capaces de anticipar comportamientos relevantes.

Allí comprendí que ETL, modelado, visualización, predicción y comunicación ejecutiva no son productos independientes. Forman parte de una misma arquitectura de decisión. Los datos deben integrarse bajo reglas consistentes, el modelo debe conservar su significado, el producto analítico debe responder a una necesidad real y la organización debe contar con mecanismos para convertir el resultado en una acción.

La unificación de fuentes me enseñó a construir una representación común de la operación. La automatización liberó capacidad para el análisis. Los tableros trasladaron esa capacidad a más de veinticinco usuarios clave. Las mesas con la dirección convirtieron la evidencia en acuerdos. El modelo de demanda amplió la conversación desde lo ocurrido hacia lo que podía suceder y lo que debía prepararse con anticipación.

Esta experiencia también consolidó mi interés por los diferentes niveles de capacidad que puede ofrecer una solución. Un reporte documenta. Un tablero permite explorar. Una alerta dirige la atención. Un modelo anticipa. Una recomendación orienta. Una aplicación estructura la ejecución. Un agente puede coordinar conocimiento y herramientas para actuar dentro de límites definidos. El instrumento adecuado depende de la decisión, la oportunidad, el riesgo y el grado de autonomía que la organización puede administrar.

C&M Consultores marcó, por tanto, mi transición desde el análisis de una operación hacia el diseño de sistemas analíticos para dirigirla. Allí se fortalecieron varios fundamentos de mi trabajo actual con Power BI y plataformas de datos: pipelines reproducibles, modelos consistentes, productos adoptados, indicadores trazables y experiencias analíticas conectadas con decisiones reales.

También se formó una parte esencial de mi visión sobre inteligencia artificial. Comprendí que un modelo no es valioso por su complejidad ni por su precisión aislada, sino por su capacidad de integrarse en un proceso, llegar en el momento adecuado y mejorar una decisión. Esa misma exigencia guía hoy la forma en que diseño aplicaciones inteligentes, agentes de IA y arquitecturas empresariales orientadas a producir capacidades confiables, observables y sostenibles.

C&M Consultores también consolidó mi convicción de que una capacidad analítica debe aprender de su propia operación. Los datos históricos no solo servían para construir indicadores y entrenar modelos; también debían permitir comparar las predicciones con los resultados observados, revisar los supuestos y ajustar progresivamente las decisiones. Esta lógica de evaluación continua se convertiría después en un fundamento de mi trabajo con plataformas analíticas, aplicaciones inteligentes y agentes de IA: ninguna solución está realmente terminada si la organización no puede observar su comportamiento, medir su impacto y mejorarla a partir de nueva evidencia.