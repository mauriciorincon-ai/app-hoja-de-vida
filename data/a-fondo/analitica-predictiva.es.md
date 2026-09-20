---
slug: analitica-predictiva
titulo: "Analítica predictiva y modelos en producción"
resumen: "Los modelos que he llevado a producción, con qué herramientas y qué los sostiene."
estado: borrador
ancla: "#skills"
actualizado: 2026-09-12
preguntas_de_prueba:
  - "¿Qué modelos predictivos ha construido Henry?"
  - "¿Qué herramientas de machine learning usa?"
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

## Dos familias de modelos en dos sectores diferentes

<!-- seccion: dos-modelos -->

He desarrollado soluciones predictivas aplicadas en dos contextos especialmente diferentes: la planeación de la demanda en transporte masivo y la anticipación de comportamientos de clientes en el sector financiero. En ambos casos utilicé aprendizaje automático para ampliar la capacidad de decisión de la organización, pero el fenómeno, el horizonte, las consecuencias del error y la forma de incorporar el resultado eran completamente distintos.

En C&M Consultores desarrollé con scikit-learn un modelo para predecir la demanda del sistema de transporte dentro de un horizonte mensual de planeación. El modelo consideraba variables como el tipo de día de la semana, la ruta establecida, la hora del día, la presencia de obras civiles, la realización de eventos y las condiciones de tráfico.

El horizonte mensual no significaba reducir la demanda a una única cifra agregada. La predicción debía conservar suficiente detalle por ruta, tipo de día y hora para representar cómo podía distribuirse la demanda dentro del periodo. Esta combinación entre horizonte de planeación y granularidad operacional permitía convertir una expectativa mensual en información útil para preparar la programación y orientar la asignación de capacidad.

Las variables incorporaban diferentes dimensiones del sistema. El tipo de día y la hora permitían representar patrones temporales recurrentes. La ruta capturaba diferencias estructurales entre servicios y zonas. Las obras, los eventos y el tráfico permitían introducir condiciones externas capaces de modificar el comportamiento habitual.

Este modelo contribuyó a una mejora reportada del veinte por ciento en el rendimiento del sistema. El aprendizaje más importante, sin embargo, fue comprender que una predicción solo produce valor cuando coincide con el momento en el que la organización todavía puede cambiar una decisión. Una estimación exacta que llega después de cerrar la programación puede tener interés analítico, pero pierde una parte importante de su utilidad operacional.

En Banco Pichincha desarrollé modelos predictivos orientados a dos familias de comportamiento: fuga de clientes y riesgo de mora. Los modelos buscaban anticipar eventos que podían requerir una intervención diferenciada, permitiendo que la organización priorizara análisis y acciones sobre grupos con señales relevantes.

Los resultados reportados alcanzaron niveles de precisión superiores al noventa por ciento y mejoras de hasta el treinta y cinco por ciento en las predicciones abordadas. Estas cifras deben interpretarse dentro de los conjuntos de datos, poblaciones, horizontes y métricas utilizados en cada caso. No presento una medida general como si describiera por sí sola todo el comportamiento de los modelos.

En fuga de clientes, la predicción debía contribuir a identificar señales asociadas con una posible desvinculación y facilitar la priorización de acciones de retención. En riesgo de mora, el propósito era reconocer anticipadamente comportamientos que ameritaban mayor atención y aportar una señal adicional dentro del análisis correspondiente. En ambos casos, el modelo generaba evidencia para apoyar una decisión, no una decisión automática que sustituyera el criterio de los responsables.

Estos dos sectores demostraron que el método predictivo puede trasladarse, pero el significado del problema no. El pipeline de preparación, entrenamiento, validación y evaluación conserva principios comunes. Sin embargo, las variables, los errores, los umbrales, el horizonte y las consecuencias deben diseñarse nuevamente para cada dominio.

El método viaja; el fenómeno, sus restricciones y la decisión permanecen profundamente vinculados con el contexto.

## El problema predictivo comienza antes del algoritmo

<!-- seccion: antes-del-algoritmo -->

Antes de seleccionar un algoritmo necesito definir con precisión qué fenómeno se intenta anticipar, qué unidad será observada, con cuánto tiempo de anticipación debe producirse la respuesta y qué decisión puede modificarse a partir del resultado.

Esta definición establece la relación entre el horizonte de predicción y el horizonte de decisión. No siempre resulta útil predecir lo más lejos posible. Una proyección demasiado distante puede acumular incertidumbre, mientras una predicción demasiado cercana puede llegar cuando la organización ya no tiene capacidad para actuar.

También necesito determinar qué información estará realmente disponible en el momento de producir la predicción. Una variable puede explicar muy bien el resultado histórico y ser completamente inútil si solo aparece después de que ocurre el evento que se intenta anticipar. Incorporarla produciría un modelo aparentemente sobresaliente, pero imposible de utilizar correctamente en condiciones reales.

La unidad de análisis también debe permanecer estable. Un registro puede representar una persona, una ruta, una franja horaria, una transacción, una interacción o un periodo. Mezclar unidades de manera inconsistente puede generar relaciones artificiales y evaluaciones engañosas.

La variable objetivo necesita una definición igualmente rigurosa. Un modelo puede alcanzar una métrica alta y, aun así, estar prediciendo una etiqueta ambigua, construida con reglas que no representan adecuadamente el fenómeno. La calidad del algoritmo nunca compensa una definición incorrecta del problema.

Esta disciplina proviene directamente de mi formación en Ingeniería Industrial. Antes de optimizar o predecir un sistema necesito comprender sus entidades, relaciones, restricciones, ciclos y mecanismos de variación. La predicción comienza con el conocimiento del proceso, no con la ejecución de una biblioteca.

La selección del algoritmo aparece después. Primero se construye una representación defendible del problema. Solo entonces tiene sentido comparar modelos y evaluar cuál ofrece el equilibrio adecuado entre desempeño, interpretabilidad, costo y posibilidad de integración.

## Qué significa llevar un modelo a producción

<!-- seccion: en-produccion -->

Utilizo con cuidado la expresión modelo en producción. No considero que un modelo alcance ese estado porque haya obtenido una métrica elevada en un notebook, porque pueda ejecutar inferencias o porque sus resultados aparezcan dentro de una presentación.

Un modelo comienza a funcionar como capacidad operativa cuando sus predicciones se integran en un proceso real, llegan dentro del ciclo de decisión, utilizan información disponible y cuentan con responsables capaces de interpretar sus resultados y actuar sobre ellos.

Esto exige un pipeline reproducible. Los datos deben localizarse, validarse y transformarse mediante reglas consistentes. Las variables utilizadas durante la inferencia deben corresponder con aquellas empleadas durante el desarrollo. Las predicciones necesitan conservar la fecha, la versión, el contexto y la población sobre la que fueron producidas.

También exige definir qué ocurre cuando los datos no cumplen las condiciones esperadas. Una fuente puede llegar incompleta, cambiar de estructura, perder oportunidad o alterar la distribución de una variable. La solución necesita controles que hagan visibles esas condiciones antes de que el modelo produzca resultados aparentemente válidos sobre entradas defectuosas.

La predicción debe llegar a un consumidor y a una decisión identificables. En transporte, debía aportar información para la planeación de la demanda y la asignación de capacidad. En banca, debía contribuir a priorizar análisis e intervenciones relacionadas con fuga o riesgo de mora. Sin esa conexión, la salida permanece como un resultado técnico.

También debe existir una forma de reconstruir lo ocurrido. Si una predicción fue utilizada semanas atrás, necesito poder identificar qué versión del modelo intervino, qué datos recibió y bajo qué reglas fue generado el resultado. Esta trazabilidad es indispensable para investigar errores, comparar comportamientos y sostener la confianza.

Finalmente, producción implica responsabilidad durante el tiempo. Los datos cambian, los segmentos evolucionan, las variables pueden perder capacidad explicativa y la relación entre la predicción y la decisión puede modificarse. El modelo necesita seguimiento, revisión y criterios para actualizarse, restringirse o retirarse.

Un modelo en producción no es un archivo desplegado. Es un sistema de datos, decisiones, controles, usuarios y responsabilidades que debe continuar funcionando después de la primera predicción.

## Evaluar un modelo es evaluar sus errores

<!-- seccion: evaluar-los-errores -->

No evalúo un modelo únicamente por su precisión general. Una métrica agregada puede ocultar comportamientos deficientes en segmentos importantes, periodos específicos o clases que aparecen con menor frecuencia, pero tienen mayores consecuencias para el negocio.

Una precisión superior al noventa por ciento puede resultar poco informativa cuando la distribución del fenómeno está fuertemente desbalanceada. Un modelo podría acertar con frecuencia porque predice correctamente la condición mayoritaria y, aun así, fallar precisamente en los casos que justificaron su construcción.

Por eso, la evaluación necesita considerar el tipo de problema y el costo relativo de los errores. Un falso positivo y un falso negativo no siempre tienen la misma consecuencia. Identificar como riesgoso un caso que finalmente no lo era puede producir una intervención innecesaria. No detectar un caso realmente relevante puede impedir una actuación oportuna. La selección del umbral debe reflejar esa diferencia.

También observo el comportamiento entre segmentos. Un resultado general favorable puede coexistir con un desempeño inestable en determinadas rutas, franjas, grupos o condiciones externas. La calidad debe evaluarse allí donde la organización utilizará realmente la predicción.

En problemas con dimensión temporal, la evaluación debe respetar el orden de los datos. Utilizar información futura para explicar el pasado puede producir resultados artificialmente altos. Por eso, la validación debe aproximarse a la forma en que el modelo enfrentará periodos posteriores dentro de la operación.

La calibración también es relevante cuando la salida se interpreta como probabilidad. No basta con ordenar correctamente los casos. La magnitud de la estimación debe corresponder razonablemente con la frecuencia observada si será utilizada para definir umbrales, capacidad de intervención o niveles de prioridad.

El modelo debe compararse además con una línea base defendible. La sofisticación algorítmica no tiene valor por sí sola. Necesito saber si la solución mejora realmente una regla simple, una media histórica, un enfoque existente o la forma actual de decisión.

La pregunta correcta no es únicamente cuántas predicciones fueron acertadas. Es dónde se equivoca el modelo, qué consecuencias tienen esos errores, si la organización puede administrarlos y si el beneficio supera la complejidad que la solución introduce.

## De la predicción a la decisión

<!-- seccion: de-la-prediccion-a-la-decision -->

Una predicción no es una decisión. Es una señal construida a partir de evidencia histórica y supuestos que debe interpretarse dentro de un proceso determinado.

El modelo puede estimar demanda, probabilidad de fuga o riesgo de mora, pero no conoce por sí solo todas las restricciones que la organización enfrenta. No necesariamente comprende la capacidad disponible para intervenir, las prioridades del momento, las reglas institucionales ni la información cualitativa que todavía no se encuentra representada en los datos.

Por eso, el resultado necesita una capa de decisión. Esta puede consistir en reglas, umbrales, priorización, capacidad de atención, revisión humana o una combinación de estos elementos. La salida analítica adquiere valor cuando se relaciona con una actuación posible y con un responsable capaz de evaluarla.

En transporte, la predicción debía traducirse en una perspectiva útil para la planeación y la programación. En banca, las probabilidades podían contribuir a priorizar casos, pero la intervención dependía de criterios adicionales y de las responsabilidades correspondientes.

Power BI desempeña una función importante en esta integración. La predicción puede presentarse junto con información histórica, variables contextuales, segmentos y tendencias que ayuden al usuario a comprender por qué el caso merece atención. El modelo aporta una señal; el producto analítico proporciona el contexto para interpretarla.

Sin embargo, tampoco toda predicción necesita terminar en un tablero. Algunas pueden alimentar una alerta, una aplicación o un flujo de trabajo. Otras pueden ser utilizadas por un agente que recupere información y prepare una recomendación. El instrumento adecuado depende de la frecuencia, el riesgo, el tiempo y el nivel de interpretación requerido.

La responsabilidad debe permanecer explícita. Un sistema puede priorizar, ordenar o recomendar. La persona o el proceso autorizado determina la acción cuando la consecuencia exige conocimiento adicional, juicio o rendición de cuentas.

El valor de la analítica predictiva no está en anticipar el futuro como una certeza. Está en reducir la incertidumbre lo suficiente para que una decisión pueda tomarse antes, con mayor contexto y con una mejor comprensión de sus riesgos.

## Las herramientas que utilizo en modelado y análisis

<!-- seccion: las-herramientas -->

Python con scikit-learn constituye una de mis bases principales para desarrollar modelos predictivos. Es el entorno que utilicé tanto en transporte como en banca para estructurar variables, entrenar modelos, comparar resultados y producir predicciones aplicables al problema correspondiente.

Pandas y NumPy forman parte habitual de mi trabajo de preparación y exploración. Los utilizo para organizar datos, transformar variables, construir conjuntos de análisis, evaluar distribuciones y preparar la información necesaria para los modelos.

Matplotlib y Seaborn me permiten examinar patrones, relaciones, diferencias entre segmentos y comportamientos que deben comprenderse antes de entrenar. La visualización exploratoria no reemplaza las pruebas estadísticas, pero ayuda a formular preguntas y detectar condiciones que podrían permanecer ocultas dentro de una tabla.

Jupyter facilita la experimentación y la documentación del recorrido analítico. Sin embargo, no considero el notebook como el destino final de una solución. Es un espacio para explorar, comparar y aprender. Cuando el trabajo necesita convertirse en capacidad operativa, la lógica debe estructurarse de forma reproducible y separarse de las decisiones manuales difíciles de rastrear.

R, RStudio, ggplot2 y Shiny complementan mi experiencia en análisis estadístico, modelado predictivo y comunicación de resultados. Incorporé R deliberadamente después de Python para profundizar en pruebas de hipótesis, razonamiento estadístico y evaluación de evidencia.

También he utilizado PyTorch y TensorFlow para trabajar con redes neuronales y modelos de aprendizaje profundo; Watson Studio y Orange Data Mining para experimentación y construcción de flujos analíticos; y SPSS y SAS para análisis estadístico y modelado dentro de sus respectivos entornos.

Estas herramientas no representan el mismo nivel de especialización ni cumplen la misma función. Python, scikit-learn, Pandas, NumPy y SQL ocupan un lugar central en mi práctica de modelado y preparación. R fortalece el análisis estadístico. PyTorch y TensorFlow amplían el alcance hacia redes neuronales. SPSS, SAS, Watson Studio y Orange proporcionan otras formas de explorar, validar y operacionalizar análisis según el contexto.

Aunque he utilizado todas estas tecnologías, no las presento como equivalentes ni como una competencia definida únicamente por su nombre. Mi criterio se concentra en seleccionar la herramienta según el fenómeno, el volumen, la necesidad de interpretación, el entorno disponible y la forma en que el resultado deberá integrarse.

El algoritmo y la plataforma importan, pero el valor predictivo surge de la calidad con la que se formula el problema, se construyen las variables, se evalúan los errores y se conecta la salida con una decisión.

## La estadística que sostiene el modelo

<!-- seccion: la-estadistica -->

Mi relación con la analítica predictiva comenzó en el énfasis en Inteligencia Analítica de Datos de Ingeniería Industrial, donde el modelado y la predicción de fenómenos formaban parte de la manera de comprender sistemas, no de un curso aislado de programación.

Esta formación estableció una disciplina que mantengo: antes de entrenar un modelo, necesito comprender si el fenómeno tiene suficiente historia, si las variables representan adecuadamente aquello que dicen medir, si la población observada es comparable y si existen cambios que puedan alterar la relación aprendida.

La estadística permite distinguir entre una asociación observada y una conclusión que puede sostenerse. También obliga a examinar variabilidad, incertidumbre, tamaño de muestra, sesgos, valores atípicos y condiciones bajo las cuales un resultado puede generalizarse.

Una variable técnicamente disponible no es necesariamente una variable válida. Puede representar un efecto posterior, contener información del futuro, duplicar indirectamente el objetivo, concentrar sesgos del proceso o funcionar únicamente en una parte de la población.

La estabilidad temporal es otro principio fundamental. Una relación identificada en un periodo puede debilitarse cuando cambian las condiciones del entorno, las reglas del negocio o el comportamiento de las personas. El modelo aprende del pasado; la organización necesita determinar si ese pasado continúa siendo una referencia adecuada.

También distingo entre predicción y causalidad. Que una variable ayude a anticipar un resultado no demuestra necesariamente que intervenir sobre ella produzca el cambio esperado. Esta diferencia protege a la organización de convertir una asociación predictiva en una recomendación causal sin evidencia suficiente.

Un modelo con una métrica elevada sobre una variable mal definida sigue siendo una solución débil. La precisión no corrige una construcción conceptual incorrecta. Por eso, una parte importante de mi trabajo ocurre antes de seleccionar el algoritmo: comprender el proceso, establecer la unidad de análisis y construir una representación defendible del fenómeno.

La Ingeniería Industrial aporta el entendimiento del sistema. La ciencia de datos aporta los métodos para aprender de su evidencia. La estadística establece cuánto puede afirmarse y bajo qué condiciones.

## La ingeniería de variables conecta el proceso con el modelo

<!-- seccion: ingenieria-de-variables -->

Las variables no aparecen terminadas dentro de las fuentes. Deben construirse a partir de eventos, estados, relaciones y ventanas temporales que representen adecuadamente el comportamiento del sistema.

La Ingeniería Industrial cumple una función central en esta etapa. Comprender el proceso me permite identificar qué eventos pueden anticipar un resultado, qué acumulaciones reflejan una restricción, qué secuencias revelan un cambio y qué condiciones externas modifican el comportamiento esperado.

En transporte, variables como el tipo de día, la ruta, la hora, las obras, los eventos y el tráfico convertían condiciones temporales, territoriales y urbanas en señales utilizables por el modelo. No eran campos seleccionados únicamente porque estuvieran disponibles. Representaban mecanismos capaces de modificar la demanda.

En banca, las variables relacionadas con comportamiento debían organizarse respetando el momento en el que la predicción sería producida. Una característica solo resultaba válida si podía calcularse con la información disponible antes del evento objetivo.

También debe evitarse la fragmentación entre desarrollo y operación. La transformación que construye una variable durante el entrenamiento debe corresponder con la utilizada posteriormente para producir predicciones. Una diferencia aparentemente pequeña puede modificar la distribución de entrada y degradar el resultado.

Por eso, la ingeniería de variables necesita reglas, versionamiento y pruebas. Cada característica debe tener un significado, una fuente, una ventana temporal y una relación clara con la unidad de análisis.

DP-600 aporta una perspectiva relevante en esta integración. Los pipelines, almacenes y modelos analíticos pueden organizar datos reutilizables para personas, productos de Power BI y soluciones predictivas. La variable no necesita construirse de manera diferente en cada producto si existe una base gobernada capaz de sostenerla.

La ingeniería de variables es el punto donde el conocimiento del dominio se convierte en representación matemática. Su calidad determina en gran medida qué puede aprender el modelo y qué tan defendible será el resultado.

## Observar el modelo después de desplegarlo

<!-- seccion: monitoreo-del-modelo -->

El comportamiento de un modelo no queda garantizado por haber obtenido buenos resultados durante el desarrollo. Después de desplegarse, necesita ser observado frente a datos nuevos, condiciones cambiantes y decisiones reales.

El primer nivel corresponde a la calidad de las entradas. Debo conocer si las fuentes llegaron, si las variables conservan los tipos y rangos esperados, si aumentaron los valores faltantes y si la población continúa siendo comparable con aquella utilizada durante el desarrollo.

El segundo nivel corresponde a la distribución. Una variable puede seguir existiendo y cambiar significativamente su comportamiento. Esa modificación no demuestra automáticamente que el modelo haya dejado de funcionar, pero constituye una señal que necesita análisis.

El tercer nivel corresponde al desempeño observado. Cuando el resultado real se encuentra disponible, las predicciones deben compararse con lo ocurrido. Esto permite conocer si las métricas permanecen dentro de rangos aceptables y si determinados segmentos presentan una degradación mayor.

El cuarto nivel corresponde al uso. Un modelo puede mantener buen desempeño técnico y perder valor porque la organización cambió el proceso, dejó de utilizar el resultado o ya no cuenta con capacidad para actuar sobre las predicciones.

El quinto nivel corresponde al impacto. Debe evaluarse si las decisiones respaldadas por el modelo contribuyeron al resultado esperado y si sus beneficios continúan justificando el costo, la complejidad y los riesgos introducidos.

El monitoreo debe conducir a decisiones. Una desviación puede requerir investigar la fuente, ajustar una transformación, recalibrar un umbral, reentrenar el modelo, limitar su utilización o regresar temporalmente a una versión anterior.

AI-300 profundiza formalmente en estas prácticas de MLOps y GenAIOps. Su valor en mi trayectoria es ampliar mediante una estructura reconocida principios que ya considero indispensables: versionamiento, evaluación, observabilidad, respuesta ante degradaciones y gestión del ciclo de vida.

Un modelo operativo necesita saber no solamente cómo producir una predicción, sino también cómo demostrar que todavía merece ser utilizada.

## Probeta DS: construir un modelo que pueda defenderse

<!-- seccion: donde-lo-aplico-hoy -->

Dentro de mi propio pipeline desarrollé Probeta DS, una aplicación publicada cuya promesa es construir un modelo que pueda defenderse. Ejecuta Python, Pandas y scikit-learn dentro del navegador mediante WebAssembly, separando el procesamiento de la interfaz para conservar una experiencia utilizable.

La ejecución local permite trabajar sin enviar necesariamente el archivo del usuario a un servidor externo. Esta decisión combina arquitectura, privacidad y experiencia: la aplicación aprovecha capacidades analíticas avanzadas mientras mantiene el procesamiento cerca de la persona que utiliza la solución.

Probeta DS no se concentra únicamente en entrenar un algoritmo y mostrar una métrica. Su propósito es estructurar un recorrido en el que puedan examinarse los datos, comprender las variables, preparar la información, entrenar alternativas, evaluar resultados y conservar evidencia suficiente para explicar la selección realizada.

La palabra defender es deliberada. Un modelo defendible necesita responder qué fenómeno intenta anticipar, qué datos utilizó, cómo se construyeron las variables, qué línea base debía superar, qué errores produce, en qué segmentos funciona mejor o peor y bajo qué condiciones su resultado puede utilizarse.

La aplicación cuenta con treinta y tres funcionalidades y aproximadamente un noventa por ciento de cobertura de líneas, de acuerdo con las mediciones publicadas en su ficha técnica. Estas cifras describen el estado de la pieza, pero no sustituyen la evaluación de la calidad metodológica de los modelos construidos con ella.

Probeta DS también demuestra mi capacidad para trasladar bibliotecas de ciencia de datos hacia una experiencia accesible. El usuario no necesita comenzar configurando un entorno local completo para recorrer el proceso analítico, pero la simplificación de la experiencia no debe ocultar las decisiones ni presentar el entrenamiento como un procedimiento automático libre de supuestos.

El Diseño Industrial influye especialmente en esta pieza. El reto no era únicamente ejecutar scikit-learn dentro del navegador, sino organizar el proceso para que una persona pudiera comprender qué etapa estaba realizando, qué decisiones debía tomar y qué evidencia necesitaba conservar.

La aplicación representa la convergencia entre ciencia de datos, ingeniería de software y diseño. No demuestra únicamente que puedo entrenar modelos. Demuestra que puedo convertir el modelado predictivo en un producto utilizable, verificable y orientado a criterios.

## De modelos predictivos a sistemas inteligentes

<!-- seccion: de-modelos-a-sistemas -->

La analítica predictiva constituye uno de los fundamentos de la inteligencia artificial empresarial, pero no agota su alcance. Un modelo produce una estimación, clasificación o prioridad. Una aplicación puede integrar esa salida con reglas, contexto y una experiencia de usuario. Un agente puede además recuperar conocimiento, utilizar herramientas y coordinar acciones dentro de límites definidos.

Esta progresión no convierte automáticamente al agente en una solución superior. Cada nivel introduce capacidades y responsabilidades adicionales. Cuando una predicción es suficiente, agregar una arquitectura generativa puede aumentar costo, variabilidad y dificultad de evaluación sin producir valor proporcional.

Mi experiencia predictiva aporta una disciplina importante al desarrollo de agentes: definir el objetivo, construir una línea base, separar entrenamiento y evaluación, analizar errores, observar segmentos y comparar el resultado con un criterio explícito.

Los agentes generativos necesitan esa misma cultura de evaluación, aunque sus resultados no siempre puedan medirse mediante las métricas tradicionales de clasificación o regresión. Deben evaluarse por cumplimiento, fundamentación, selección de herramientas, calidad de las salidas, costo, latencia y comportamiento frente a excepciones.

DP-600 proporciona la base de datos y modelos semánticos que puede alimentar tanto análisis humano como soluciones inteligentes. AI-103 amplía esa base hacia aplicaciones y agentes. AI-300 fortalece la capacidad para operar, evaluar y observar modelos tradicionales y sistemas generativos durante su ciclo de vida.

La evolución de mi perfil no ha consistido en abandonar la analítica predictiva para dedicarme a agentes. Consiste en incorporar la predicción dentro de arquitecturas más amplias, donde los modelos, los datos, las reglas, las interfaces y las personas participan de manera coordinada.

La predicción aporta una señal. La arquitectura determina cómo se interpreta, quién puede utilizarla, qué acción puede producir y qué evidencia debe conservarse.

## Lo que demuestra mi enfoque predictivo

<!-- seccion: lo-que-demuestra -->

Mi trabajo en analítica predictiva demuestra que no separo el modelo del proceso que le da propósito ni de la arquitectura que permite utilizarlo.

Comienzo por definir el fenómeno, la unidad de análisis, el horizonte y la decisión. Después construyo variables que representen condiciones disponibles en el momento correcto, establezco una línea base y selecciono las métricas según el costo de los errores.

La evaluación no termina en un promedio. Examino segmentos, estabilidad, temporalidad, calibración y condiciones bajo las cuales el resultado puede dejar de ser confiable. También distingo predicción de causalidad y evito convertir una asociación en una recomendación sin evidencia suficiente.

El despliegue tampoco termina en una inferencia disponible. El modelo necesita pipelines reproducibles, entradas controladas, responsables, contexto para la interpretación y mecanismos para observar si continúa cumpliendo su propósito.

Mi profundidad técnica abarca Python, scikit-learn, Pandas, NumPy, R y diferentes entornos de análisis y aprendizaje automático. Sin embargo, mi principal diferencial no se encuentra en la cantidad de bibliotecas utilizadas. Se encuentra en la capacidad para conectar conocimiento del proceso, estadística, modelado, ingeniería de datos, producto analítico y decisión.

Probeta DS convierte esta postura en una aplicación pública. Los modelos desarrollados en transporte y banca demuestran su utilización profesional. Mi trabajo con Fabric, Power BI y agentes amplía esa experiencia hacia arquitecturas en las que las predicciones pueden integrarse con nuevas formas de interacción y actuación.

No busco construir el modelo con la métrica más llamativa. Busco construir una capacidad predictiva que pueda explicarse, utilizarse, observarse y defenderse cuando una persona pregunte qué significa el resultado y por qué merece influir sobre una decisión.
