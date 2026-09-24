---
slug: transmilenio-cm
codigo: AF-07
titulo: "C&M Consultores / TransMilenio — análisis post-operacional (2021–2022)"
resumen: "El análisis post-operacional del SITP: el ETL que unificó recaudo, flota, programación, novedades y PQR (+70 %), BI adoptado por 25+ usuarios clave (+35 %), las mesas con la dirección del SITP (+25 %) y un modelo de demanda en scikit-learn que corrió diez meses."
cuando_usar: "Úsalo cuando pregunten por TransMilenio y C&M Consultores (2021–2022): análisis post-operacional, fuentes de datos heterogéneas (recaudo, flota, programación, novedades, PQR), pipelines ETL, predicción de demanda por ruta y franja, mesas con la dirección del SITP y adopción de tableros."
estado: aprobado
ancla: "/proyectos/transmilenio-cm"
actualizado: 2026-09-20
preguntas_de_prueba:
  - "¿Cómo unificó Henry las fuentes de datos heterogéneas del SITP?"
  - "¿Cómo fue el modelo de predicción de demanda del SITP?"
  - "¿Qué es el análisis post-operacional que menciona?"
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

Regresé al entorno de TransMilenio en julio de 2021, esta vez como Profesional de Análisis Post-Operacional en C&M Consultores, dentro de la Fuerza Operativa de TransMilenio S.A., y permanecí en el cargo hasta mayo de 2022. Volví al mismo dominio en el que había trabajado como analista de operaciones de la supervisión del sistema, pero con una responsabilidad distinta y con una comprensión más madura de la relación entre operación, datos y decisiones: ya no se trataba de supervisar el cumplimiento, sino de explicar la operación del Sistema Integrado de Transporte Público (SITP) y ayudar a decidir cómo ajustarla.

El principal obstáculo era que la operación generaba información más rápido de lo que podía prepararse y analizarse manualmente. Los datos se encontraban distribuidos entre fuentes heterogéneas, con estructuras, niveles de detalle y reglas diferentes. Una parte considerable del esfuerzo se consumía reuniendo archivos, validando correspondencias y conciliando resultados antes de que pudiera comenzar el análisis realmente valioso.

Esta experiencia me permitió reconocer una diferencia fundamental entre disponer de datos y contar con una capacidad analítica. Los datos podían existir y, aun así, no estar preparados para responder las preguntas de la operación. El verdadero desafío consistía en construir un recorrido confiable desde el evento operacional —un bus que sale tarde, una validación de tarjeta, una queja— hasta el indicador, el análisis y la decisión.

## Qué es el análisis post-operacional

<!-- seccion: que-es-el-analisis-post-operacional -->

El análisis post-operacional consiste en reconstruir lo ocurrido en el sistema de transporte para comprender sus causas y decidir cómo debe ajustarse la operación futura. No se limita a describir el día anterior. Debe explicar las diferencias entre lo programado y lo ejecutado, identificar patrones, hacer visibles las restricciones y transformar los resultados observados en decisiones sobre programación, capacidad y servicio.

En TransMilenio esa diferencia entre lo programado y lo ejecutado tiene muchas formas: un servicio que salió con menos buses de los previstos, una franja horaria en la que la demanda superó la oferta programada, una ruta cuyo tiempo de ciclo creció por obras en la vía, un concesionario cuyas novedades se concentraron en un tipo de vehículo. El análisis post-operacional toma la evidencia de la operación cerrada y responde tres preguntas en orden: qué pasó, por qué pasó y qué se ajusta para la siguiente programación.

Lo distingue del análisis de supervisión —mi etapa anterior en el mismo sistema, entre 2018 y 2020— el horizonte y el destinatario. La supervisión mira el cumplimiento de cada servicio y sustenta consecuencias; el análisis post-operacional mira el sistema completo y sustenta decisiones de programación y de servicio. Las dos etapas comparten las fuentes y se diferencian en la pregunta.

## Las cinco fuentes del SITP: recaudo, flota y GPS, programación, novedades y PQR

<!-- seccion: las-cinco-fuentes -->

Los datos del SITP vivían en cinco fuentes heterogéneas, cada una con su estructura, su nivel de detalle y sus reglas:

| Fuente                    | Qué registra                                                    | Su grano natural                  |
| ------------------------- | --------------------------------------------------------------- | --------------------------------- |
| Recaudo                   | las validaciones de tarjeta al abordar: la demanda real          | una transacción                   |
| Flota y GPS               | la posición y el recorrido de cada bus                           | un punto de posición cada pocos segundos |
| Programación              | los servicios, rutas y despachos previstos para el día           | un servicio programado            |
| Novedades de la operación | lo que se salió del plan: fallas, desvíos, retrasos, incidentes  | una novedad                       |
| PQR de los usuarios       | peticiones, quejas y reclamos de quienes usan el sistema         | una petición                      |

Ninguna de las cinco describía la operación por sí sola. El recaudo decía cuánta gente subió, pero no si el bus salió a tiempo; el GPS decía dónde estuvo el bus, pero no cuánta gente llevaba; la programación decía qué debía pasar; las novedades decían qué se rompió; y las PQR decían cómo lo vivió el usuario. Explicar la diferencia entre lo programado y lo ejecutado exigía cruzarlas todas sobre las mismas claves: la ruta, el servicio, el vehículo, la franja horaria y el día.

Las bases semanales que llegaban de los concesionarios se organizaban en SQLite para construir el acumulado histórico sobre el que corrían los análisis, un hábito que traía de la etapa de supervisión y que permitía que cada semana nueva se sumara a la anterior en vez de analizarse aislada.

## Unificar las fuentes: el ETL

<!-- seccion: unificar-las-fuentes -->

Diseñé e implementé procesos de ETL —extracción, transformación y carga de datos— para integrar las cinco fuentes heterogéneas y convertirlas en una base analítica común. Esta intervención mejoró en un 70 % la precisión y la velocidad del análisis, al reducir la conciliación manual y aplicar reglas consistentes durante la preparación de la información.

La integración no consistía únicamente en trasladar datos desde diferentes orígenes hacia un repositorio común. Era necesario comprender qué representaba cada registro, armonizar estructuras, resolver diferencias entre identificadores —la misma ruta podía llamarse distinto en la programación y en el recaudo—, alinear dimensiones temporales —el recaudo por transacción, el GPS por segundo, la programación por servicio— y establecer reglas para relacionar programación, ejecución y resultados. Unificar las fuentes significaba reconstruir una versión coherente de la operación.

La mejora simultánea en velocidad y precisión no fue accidental. Ambas dependían de resolver el mismo problema: sustituir procedimientos manuales y variables por un pipeline reproducible. Cuando las transformaciones se convierten en un proceso definido, las mismas reglas pueden aplicarse en cada ciclo, los errores pueden detectarse con mayor facilidad y el equipo deja de invertir tiempo en reconstruir repetidamente la información.

Esta experiencia preparó mi evolución posterior hacia arquitecturas analíticas más avanzadas. Lo que entonces resolvía mediante procesos ETL se convertiría después en pipelines gobernados, modelos semánticos reutilizables y soluciones empresariales en Power BI, y más tarde en un lakehouse en Microsoft Fabric. La tecnología evolucionó, pero el principio permaneció intacto: una decisión confiable requiere un recorrido de datos igualmente confiable.

## Pipelines de datos que corren solos: las validaciones dentro del pipeline

<!-- seccion: validaciones-en-el-pipeline -->

Incorporé validaciones en el ETL para identificar datos incompletos, duplicados, inconsistencias y relaciones que no cumplían las reglas esperadas: un servicio ejecutado sin programación que lo respaldara, una transacción de recaudo en una ruta que ese día no operó, un vehículo con GPS y sin despacho. El objetivo no era corregir silenciosamente las diferencias al final del recorrido, sino hacerlas visibles, rastrear su origen y evitar que avanzaran hasta indicadores o decisiones sin una explicación adecuada.

Aquí profundicé en uno de los fundamentos de mi trabajo actual con plataformas de datos: un pipeline no es una tubería invisible que solamente transporta información. Es una parte de la lógica empresarial. Contiene decisiones sobre calidad, correspondencia, temporalidad, granularidad y significado que deben poder documentarse, evaluarse y reproducirse. La regla que decide cómo se asigna una transacción de recaudo a un servicio es tan parte del negocio como el indicador que después se presenta a la dirección del SITP.

Por eso las reglas del ETL se escribieron como reglas y no como pasos de una rutina: cada una con la fuente que tocaba, la condición que evaluaba y qué hacía con el registro que no la cumplía. Así, cuando un indicador cambiaba, se podía saber si había cambiado la operación o había cambiado la forma de calcularlo.

## La adopción del BI en la operación

<!-- seccion: la-adopcion -->

Lideré la implementación de Power BI como herramienta especializada de inteligencia de negocios en la operación, logrando un aumento del 35 % en la eficiencia de los procesos analíticos y la adopción de los tableros por más de 25 usuarios clave.

El término usuarios clave es importante. En una operación de esta naturaleza, el valor no dependía de maximizar el número de personas que abrían un tablero, sino de conseguir que lo utilizaran quienes tenían responsabilidad sobre la programación, el seguimiento y las decisiones de servicio. La adopción debía observarse en la incorporación del producto analítico a las rutinas de trabajo, no solamente en sus estadísticas de acceso.

Esta etapa consolidó mi comprensión de que Power BI debe diseñarse como una experiencia de decisión y no como una capa decorativa sobre los datos. Detrás de cada visualización debe existir un modelo coherente, dimensiones compartidas —la ruta, el servicio, la franja horaria, el concesionario, el día—, medidas verificables y rutas de análisis que permitan profundizar sin perder consistencia. La simplicidad que percibe el usuario depende de la rigurosidad de la arquitectura que la sostiene.

El resultado más importante no fue la cantidad de tableros desarrollados, sino la creación de una visión compartida de la operación. Cuando los responsables utilizan las mismas definiciones y pueden recorrer los resultados hasta su evidencia, la conversación deja de concentrarse en cuál cifra es correcta y puede orientarse hacia qué decisión conviene tomar.

## Diseñar cada tablero alrededor de una pregunta operacional

<!-- seccion: tableros-por-pregunta -->

Para lograr la adopción en TransMilenio, los tableros se diseñaron alrededor de preguntas operacionales concretas: en qué rutas y franjas la demanda supera la oferta programada, qué concesionarios concentran las novedades, dónde se está perdiendo el cumplimiento y por qué. Cada indicador debía permitir reconocer una condición relevante, comprender sus posibles causas y orientar una acción. La solución no debía obligar a los usuarios a interpretar una acumulación de visualizaciones, sino ofrecerles una estructura clara para pasar del resultado general al detalle que requería intervención.

También aprendí que una solución analítica adoptada necesita equilibrar estabilidad y evolución. Sus definiciones deben permanecer suficientemente consistentes para generar confianza, pero el producto también debe incorporar nuevas preguntas y aprendizajes a medida que cambia la operación. La adopción no concluye con la publicación. Se sostiene mediante acompañamiento, retroalimentación y mejora continua: cada mesa con la dirección devolvía preguntas nuevas, y esas preguntas volvían al tablero.

Fue la adopción de Power BI que fijó el criterio que después apliqué en Banco Pichincha con más de 50 usuarios: el tablero se diseña desde la decisión, no desde el dato disponible. Cómo se mide esa adopción, y por qué no son visitas, está en el documento de BI que se adopta.

## Las mesas con la dirección del SITP

<!-- seccion: las-mesas-del-sitp -->

Coordiné mesas de trabajo con la dirección de concesionarios del Sistema Integrado de Transporte Público para analizar resultados, definir estrategias de mejora y articular decisiones sobre los procesos. Este trabajo contribuyó a alcanzar una mejora del 25 % en los indicadores asociados con las intervenciones realizadas. Eran los mismos concesionarios —del orden de diez empresas para unas 150 rutas— cuya operación había supervisado en mi etapa anterior en el sistema; ahora la conversación no era sobre el cumplimiento de cada servicio, sino sobre cómo mejorar la operación.

Estas mesas me enseñaron que la analítica alcanza su mayor valor cuando consigue alinear actores que observan la operación desde perspectivas diferentes. La autoridad, los concesionarios y los equipos técnicos podían tener responsabilidades, restricciones e interpretaciones distintas. Mi función consistía en proporcionar una base de evidencia común que permitiera comprender el problema antes de discutir la solución.

Para llegar a esa conversación, el dato debía estar preparado para ser examinado. Cada resultado requería una definición clara, una procedencia identificable y una relación verificable con los eventos de la operación. La credibilidad no podía construirse dentro de la reunión. Tenía que estar incorporada previamente en las fuentes, los pipelines, los modelos y las reglas utilizadas para producir el análisis: el ETL y el modelo de Power BI eran lo que hacía posible que una cifra discutida en la mesa se pudiera recorrer hasta el servicio y el día que la producían.

## Evidencia, mecanismo y consecuencia: cómo se recomienda a una dirección

<!-- seccion: recomendacion-ejecutiva -->

En las mesas del SITP aprendí que una recomendación ejecutiva debe conectar evidencia, mecanismo y consecuencia. No era suficiente señalar que un indicador había empeorado. Era necesario explicar qué condiciones producían el resultado, qué actores podían intervenir, qué alternativas estaban disponibles y cómo se evaluaría posteriormente su efecto.

Esta experiencia fortaleció mi capacidad para comunicar entre niveles operativos, analíticos y directivos. Podía recorrer el problema desde los registros y las reglas de transformación hasta la síntesis ejecutiva, y regresar al detalle cuando una conclusión necesitaba ser explicada o defendida. Esa capacidad continúa siendo esencial en mi trabajo con plataformas analíticas, aplicaciones inteligentes y estrategias empresariales de inteligencia artificial.

Las mesas también hicieron visible que una decisión no genera valor por quedar registrada en un acta. Necesita responsables, acciones, plazos e indicadores que permitan cerrar el ciclo y determinar si la intervención produjo el resultado esperado. La analítica con consecuencia no termina en la recomendación. Incluye la capacidad de observar lo que ocurrió después de actuar; el 25 % de mejora en los indicadores intervenidos se pudo afirmar precisamente porque el mismo pipeline que sustentaba la recomendación seguía midiendo después de ella.

## La predicción de demanda con scikit-learn

<!-- seccion: prediccion-de-demanda -->

Desarrollé en Python con scikit-learn un modelo de aprendizaje automático para predecir la demanda del sistema por ruta y franja horaria, con actualización mensual, y fortalecer así las decisiones de planeación y de programación de flota. En lenguaje de ingeniería industrial, el problema es un pronóstico de demanda para planeación de capacidad.

El modelo incorporaba variables que representaban distintas dimensiones del comportamiento de la demanda: el tipo de día de la semana y la hora del día, la ruta, la presencia de obras civiles, la realización de eventos y las condiciones de tráfico. Cada grupo cumplía una función. El tipo de día y la hora permitían modelar patrones temporales recurrentes; la ruta incorporaba las diferencias estructurales entre servicios y zonas; las obras civiles, los eventos y el tráfico introducían condiciones externas capaces de modificar los patrones habituales. El comportamiento del sistema no podía explicarse exclusivamente por su historia; también debía interpretarse dentro del contexto urbano en el que operaba.

El horizonte mensual respondía a una necesidad concreta de planificación. El propósito no era anticipar únicamente el siguiente movimiento de la operación, sino proporcionar una perspectiva suficientemente amplia para ajustar la programación y preparar los recursos con anticipación. La utilidad del modelo dependía de que sus resultados llegaran dentro del ciclo real en el que podían modificarse las decisiones: la programación del mes siguiente se decide antes de que ese mes empiece, y una predicción que llegara después no servía.

El desarrollo del modelo exigió transformar variables operativas y contextuales en características consistentes, organizar datos históricos —los del recaudo, que son la demanda real, cruzados con programación y novedades—, controlar su calidad y evaluar si la predicción tenía suficiente utilidad para respaldar decisiones. El ETL de las cinco fuentes fue la condición previa: sin una base unificada no había con qué entrenar.

## Cómo se validó el modelo: RMSE y orden temporal

<!-- seccion: validacion-del-modelo -->

La demanda de un sistema de transporte es un problema de series de tiempo, y la validación tenía que respetarlo. El modelo se evaluó con RMSE —la raíz del error cuadrático medio— respetando el orden temporal: se entrenaba con los meses anteriores y se medía sobre los siguientes, nunca con una partición aleatoria que dejara ver el futuro dentro del entrenamiento y produjera una precisión que no iba a repetirse en operación.

La evaluación no debía limitarse a una única medida de desempeño global. También era necesario observar cómo se comportaba el modelo entre rutas, franjas horarias, tipos de día y condiciones excepcionales, porque un buen resultado promedio podía ocultar errores importantes en segmentos críticos de la operación: acertar en la mayoría de las rutas de baja demanda y fallar en las troncales de hora pico es un buen promedio y una mala predicción.

Esta experiencia fortaleció mi criterio para evaluar modelos no solo por su precisión estadística, sino por la estabilidad, utilidad y confiabilidad de sus resultados dentro del contexto en el que serían utilizados. Cómo se evalúan los errores de un modelo y qué significa sostenerlo en producción, con este caso y el de Banco Pichincha comparados, está en el documento de analítica predictiva.

## Diez meses en uso: quién usaba el modelo y para qué

<!-- seccion: el-modelo-en-uso -->

El modelo corrió diez meses. Lo usaban los profesionales que presentaban el informe de demanda que las unidades de TransMilenio tomaban como referencia para programar: la predicción por ruta y franja entraba en ese informe mensual y desde ahí llegaba a la decisión de cuántos buses asignar y en qué horarios.

El modelo contribuyó a una mejora del 20 % en el rendimiento reportado del sistema. Más allá de la cifra, el aprendizaje fundamental fue que una predicción solo genera valor cuando puede incorporarse en un proceso de decisión. Un modelo puede alcanzar un buen desempeño técnico y seguir siendo irrelevante si entrega la respuesta demasiado tarde, utiliza variables que no estarán disponibles al momento de inferir o produce una salida que la organización no puede convertir en una acción. Aquí las tres condiciones se cumplían: llegaba antes de programar, usaba variables disponibles en el momento de programar y salía en la unidad en que se programa, la ruta y la franja.

Esta fue una de mis primeras experiencias conectando aprendizaje automático con una consecuencia operacional real, y un modelo que se sostuvo en uso durante diez meses.

## Lo que el modelo de demanda me enseñó sobre machine learning

<!-- seccion: lo-que-enseno-el-modelo -->

El modelo de demanda del SITP me enseñó que el aprendizaje automático no comienza con la selección de un algoritmo. Comienza con la representación correcta del problema, la definición del horizonte y la correspondencia entre la salida del modelo y la decisión que debe habilitar. De scikit-learn usé lo que el problema pedía; el trabajo estaba antes, en las variables y en el ETL, y después, en el informe que lo llevaba a la programación.

También estableció una disciplina que mantengo en el diseño de soluciones inteligentes: definir primero qué decisión se quiere mejorar, determinar con cuánto tiempo de anticipación debe producirse la respuesta, saber quién la va a usar y evaluar el modelo tanto por su desempeño técnico como por su impacto dentro del proceso. Después, el algoritmo.

Con el tiempo, esta comprensión se ampliaría hacia aplicaciones y agentes de inteligencia artificial. Un modelo genera una predicción; una aplicación puede integrarla con reglas y flujos de trabajo; un agente puede consultar datos, interpretar contexto, proponer acciones y utilizar herramientas dentro de límites definidos. Sin embargo, toda esa capacidad depende del mismo fundamento que aprendí en 2021 con la demanda de TransMilenio: datos confiables, propósito explícito, evaluación rigurosa y una relación clara entre el resultado y la decisión.

## La automatización

<!-- seccion: la-automatizacion -->

Implementé scripts que redujeron en un 40 % el tiempo dedicado a tareas repetitivas de preparación y procesamiento de información en C&M Consultores. Aunque este logro puede parecer menos sofisticado que un modelo predictivo, fue una condición necesaria para liberar capacidad analítica y concentrar el esfuerzo del equipo en problemas de mayor valor.

La automatización permitió aplicar reglas de forma consistente, reducir la intervención manual y hacer que los ciclos de análisis fueran más rápidos y reproducibles. Actividades que antes debían ejecutarse paso a paso —recibir las bases semanales, validar su estructura, cargarlas al acumulado en SQLite, recalcular los indicadores— podían incorporarse a un flujo estructurado, con entradas conocidas, transformaciones definidas y resultados verificables.

Esta experiencia me enseñó a observar el trabajo analítico como un pipeline completo. Si la mayor parte del tiempo se consume localizando archivos, consolidando estructuras y corrigiendo formatos, la organización cuenta con analistas, pero no necesariamente con una capacidad analítica escalable. Automatizar esas actividades no elimina el criterio profesional. Lo desplaza hacia tareas en las que puede producir más valor: el 40 % de tiempo recuperado fue el tiempo que se dedicó al modelo de demanda y a las mesas.

## Automatizar con controles y manejo de excepciones

<!-- seccion: automatizacion-con-controles -->

También comprendí en C&M Consultores que la automatización debe incluir controles y manejo de excepciones. Un script que funciona únicamente bajo condiciones ideales traslada el esfuerzo manual hacia la resolución constante de fallas. Una solución sostenible necesita validar sus entradas, registrar desviaciones y hacer visible cuándo una situación requiere revisión humana: una base semanal que llega con una columna menos no debe cargarse en silencio ni tumbar el proceso; debe quedar señalada, con el motivo, para que alguien decida.

Ese principio continúa vigente en mi trabajo con agentes de IA. La automatización inteligente no consiste en retirar indiscriminadamente a las personas del proceso. Consiste en asignar a la tecnología las actividades que puede ejecutar de forma confiable, conservar trazabilidad sobre sus acciones y transferir a una persona aquellas situaciones que requieren interpretación, juicio o responsabilidad adicional.

La diferencia entre un script de 2021 y un agente de hoy está en la capacidad de interpretar; la regla de diseño es la misma: entradas validadas, desviaciones registradas y una excepción que se ve, no que se esconde.

## Los resultados de C&M Consultores en cifras

<!-- seccion: resultados-en-cifras -->

Las cinco cifras del rol, tal como las publica mi hoja de vida y el case study, y qué hay detrás de cada una:

| Frente                                       | Resultado                                              | Qué hay detrás                                                        |
| -------------------------------------------- | ------------------------------------------------------ | --------------------------------------------------------------------- |
| Adopción de Power BI en la operación         | +35 % de eficiencia de los procesos analíticos · 25+ usuarios clave | tableros diseñados por pregunta operacional, con definiciones compartidas |
| ETL que unificó las fuentes heterogéneas     | +70 % en precisión y velocidad de análisis             | cinco fuentes —recaudo, flota/GPS, programación, novedades, PQR— sobre claves comunes |
| Scripts de automatización                    | −40 % en tareas repetitivas                            | preparación y procesamiento reproducibles, con controles y excepciones |
| Mesas de estrategia con la dirección del SITP | +25 % en los indicadores intervenidos                  | evidencia común, recomendaciones con mecanismo y seguimiento posterior |
| Predicción de demanda con scikit-learn       | +20 % de rendimiento reportado del sistema             | demanda por ruta y franja, actualización mensual, RMSE con orden temporal, diez meses en uso |

Todo ocurrió entre julio de 2021 y mayo de 2022, en C&M Consultores, dentro de la Fuerza Operativa de TransMilenio S.A.

## Lo que C&M Consultores consolidó

<!-- seccion: lo-que-cm-consultores-consolido -->

Vista en retrospectiva, C&M Consultores fue la experiencia en la que convertí mi conocimiento de la operación de transporte en una capacidad analítica más integrada. La etapa anterior me había enseñado a reconstruir y supervisar el sistema mediante datos. En esta nueva responsabilidad avancé hacia la automatización de su preparación, la unificación de fuentes, la adopción de herramientas de inteligencia de negocios y la incorporación de modelos capaces de anticipar comportamientos relevantes.

Allí comprendí que ETL, modelado, visualización, predicción y comunicación ejecutiva no son productos independientes. Forman parte de una misma arquitectura de decisión. Los datos deben integrarse bajo reglas consistentes, el modelo debe conservar su significado, el producto analítico debe responder a una necesidad real y la organización debe contar con mecanismos para convertir el resultado en una acción.

La unificación de fuentes me enseñó a construir una representación común de la operación. La automatización liberó capacidad para el análisis. Los tableros trasladaron esa capacidad a más de 25 usuarios clave. Las mesas con la dirección convirtieron la evidencia en acuerdos. El modelo de demanda amplió la conversación desde lo ocurrido hacia lo que podía suceder y lo que debía prepararse con anticipación.

Esta experiencia también consolidó mi interés por los diferentes niveles de capacidad que puede ofrecer una solución. Un reporte documenta. Un tablero permite explorar. Una alerta dirige la atención. Un modelo anticipa. Una recomendación orienta. Una aplicación estructura la ejecución. Un agente puede coordinar conocimiento y herramientas para actuar dentro de límites definidos. El instrumento adecuado depende de la decisión, la oportunidad, el riesgo y el grado de autonomía que la organización puede administrar.

## Del análisis de una operación al diseño de sistemas para dirigirla

<!-- seccion: de-analizar-a-dirigir -->

C&M Consultores marcó, por tanto, mi transición desde el análisis de una operación hacia el diseño de sistemas analíticos para dirigirla. Allí se fortalecieron varios fundamentos de mi trabajo actual con Power BI y plataformas de datos: pipelines reproducibles, modelos consistentes, productos adoptados, indicadores trazables y experiencias analíticas conectadas con decisiones reales.

También se formó una parte esencial de mi visión sobre inteligencia artificial. Comprendí que un modelo no es valioso por su complejidad ni por su precisión aislada, sino por su capacidad de integrarse en un proceso, llegar en el momento adecuado y mejorar una decisión. Esa misma exigencia guía hoy la forma en que diseño aplicaciones inteligentes, agentes de IA y arquitecturas empresariales orientadas a producir capacidades confiables, observables y sostenibles.

C&M Consultores también consolidó mi convicción de que una capacidad analítica debe aprender de su propia operación. Los datos históricos no solo servían para construir indicadores y entrenar modelos; también debían permitir comparar las predicciones con los resultados observados, revisar los supuestos y ajustar progresivamente las decisiones. Los diez meses del modelo de demanda funcionaron con esa lógica: la actualización mensual permitía contrastar la predicción anterior con la demanda observada en el recaudo antes de producir la siguiente. Esta lógica de evaluación continua se convertiría después en un fundamento de mi trabajo con plataformas analíticas, aplicaciones inteligentes y agentes de IA: ninguna solución está realmente terminada si la organización no puede observar su comportamiento, medir su impacto y mejorarla a partir de nueva evidencia.
