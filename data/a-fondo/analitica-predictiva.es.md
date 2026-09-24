---
slug: analitica-predictiva
codigo: AF-21
titulo: "Analítica predictiva"
resumen: "Dos familias de modelos en producción con scikit-learn —demanda del SITP por ruta y franja, y fuga, mora y riesgo en banca con más del 90 % de precisión—, las herramientas de machine learning que uso y con qué nivel, la estadística y la ingeniería de variables que sostienen el modelo, y Probeta DS."
cuando_usar: "Úsalo cuando pregunten por modelos predictivos y machine learning: predicción de demanda, modelos de fuga, mora y riesgo, precisión alcanzada, herramientas (Python, scikit-learn, pandas, numpy, R, SQL), su base estadística, lenguajes de programación, procesamiento de lenguaje natural y Probeta DS."
estado: aprobado
ancla: "#skills"
actualizado: 2026-09-20
preguntas_de_prueba:
  - "¿Qué modelos predictivos ha construido Henry?"
  - "¿Qué herramientas de machine learning usa?"
  - "¿Ha llevado un modelo de machine learning a producción?"
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

He desarrollado y llevado a producción soluciones de machine learning en dos contextos especialmente diferentes: la planeación de la demanda en transporte masivo, con C&M Consultores para TransMilenio, y la anticipación de comportamientos de clientes en el sector financiero, en Banco Pichincha. En ambos casos utilicé aprendizaje automático con scikit-learn para ampliar la capacidad de decisión de la organización, pero el fenómeno, el horizonte, las consecuencias del error y la forma de incorporar el resultado eran completamente distintos.

En transporte, el fenómeno era cuánta gente iba a subirse a cada ruta en cada franja horaria del mes siguiente; el error costaba buses de más en una ruta y usuarios sin cupo en otra; y el resultado entraba en un informe mensual de demanda. En banca, el fenómeno era qué cliente podía irse, qué obligación podía dejar de pagarse y qué operación concentraba riesgo; el error costaba una intervención innecesaria o una oportunidad de retención perdida; y el resultado entraba en la priorización de acciones de retención y cobro.

Estos dos sectores demostraron que el método predictivo puede trasladarse, pero el significado del problema no. El pipeline de preparación, entrenamiento, validación y evaluación conserva principios comunes. Sin embargo, las variables, los errores, los umbrales, el horizonte y las consecuencias deben diseñarse nuevamente para cada dominio.

El método viaja; el fenómeno, sus restricciones y la decisión permanecen profundamente vinculados con el contexto. Las dos experiencias, contadas dentro de su empleo, están en los documentos de TransMilenio y de Banco Pichincha; aquí las miro desde el oficio de modelar.

## La demanda de TransMilenio por ruta y franja: horizonte, granularidad y uso

<!-- seccion: demanda-transmilenio -->

En C&M Consultores, entre julio de 2021 y mayo de 2022, desarrollé con scikit-learn un modelo para predecir la demanda del sistema de transporte dentro de un horizonte mensual de planeación, con actualización mensual. Las variables recogían tres dimensiones del sistema: la temporal, con el tipo de día de la semana y la hora del día, que representan los patrones recurrentes; la estructural, con la ruta, que captura las diferencias entre servicios y zonas; y la externa, con las obras civiles, los eventos y las condiciones de tráfico, capaces de modificar el comportamiento habitual.

El horizonte mensual no significaba reducir la demanda a una única cifra agregada. La predicción debía conservar suficiente detalle por ruta, tipo de día y franja horaria para representar cómo podía distribuirse la demanda dentro del periodo. Esta combinación entre horizonte de planeación y granularidad operacional permitía convertir una expectativa mensual en información útil para preparar la programación y orientar la asignación de capacidad.

La validación se hizo con RMSE y respetando el orden temporal: el modelo se evaluaba sobre periodos posteriores a los que había visto, nunca con datos futuros explicando el pasado, porque así lo iba a enfrentar la operación. El modelo corrió diez meses. Lo usaban los profesionales que presentaban el informe de demanda de referencia con el que las unidades programaban, y contribuyó a una mejora reportada del 20 % en el rendimiento del sistema.

El aprendizaje más importante, sin embargo, fue comprender que una predicción solo produce valor cuando coincide con el momento en el que la organización todavía puede cambiar una decisión. Una estimación exacta que llega después de cerrar la programación puede tener interés analítico, pero pierde una parte importante de su utilidad operacional.

## Fuga, mora y riesgo en Banco Pichincha

<!-- seccion: fuga-mora-y-riesgo -->

En Banco Pichincha, en 2023, entrené y llevé a producción modelos predictivos orientados a tres familias de comportamiento: fuga de clientes, mora y riesgo. Los modelos buscaban anticipar eventos que podían requerir una intervención diferenciada, permitiendo que la organización priorizara análisis y acciones sobre grupos con señales relevantes.

Los resultados reportados superaron el 90 % de precisión y mejoraron hasta un 35 % las predicciones existentes. Estas cifras deben interpretarse dentro de los conjuntos de datos, poblaciones, horizontes y métricas utilizados en cada caso. No presento una medida general como si describiera por sí sola todo el comportamiento de los modelos, y una precisión alta sobre una clase desbalanceada dice menos de lo que parece: por eso el análisis miraba dónde se concentraban los errores y no solo cuántos había.

En fuga de clientes, la predicción debía contribuir a identificar señales asociadas con una posible desvinculación y facilitar la priorización de acciones de retención. En mora, el propósito era reconocer anticipadamente obligaciones que podían dejar de pagarse, para que el cobro actuara antes y no después. En riesgo, la señal ayudaba a reconocer qué operaciones ameritaban mayor atención y aportaba una entrada adicional dentro del análisis correspondiente. En los tres casos, el modelo generaba evidencia para apoyar una decisión, no una decisión automática que sustituyera el criterio de los responsables.

Las predicciones llegaban a quienes las usaban a través de Power BI, junto con la información histórica y contextual del cliente, en los mismos tableros que habían adoptado más de 50 usuarios del negocio. Un modelo de fuga cuyo resultado nadie abre no retiene a nadie; el canal de entrega era parte del diseño del modelo.

## El problema predictivo comienza antes del algoritmo

<!-- seccion: antes-del-algoritmo -->

Antes de seleccionar un algoritmo necesito definir con precisión qué fenómeno se intenta anticipar, qué unidad será observada, con cuánto tiempo de anticipación debe producirse la respuesta y qué decisión puede modificarse a partir del resultado. En TransMilenio la unidad era la ruta en una franja horaria de un tipo de día; en Banco Pichincha, el cliente o la obligación en un horizonte de decisión definido por el negocio.

Esta definición establece la relación entre el horizonte de predicción y el horizonte de decisión. No siempre resulta útil predecir lo más lejos posible. Una proyección demasiado distante puede acumular incertidumbre, mientras una predicción demasiado cercana puede llegar cuando la organización ya no tiene capacidad para actuar.

También necesito determinar qué información estará realmente disponible en el momento de producir la predicción. Una variable puede explicar muy bien el resultado histórico y ser completamente inútil si solo aparece después de que ocurre el evento que se intenta anticipar. Incorporarla produciría un modelo aparentemente sobresaliente, pero imposible de utilizar correctamente en condiciones reales. En Probeta DS convertí esa regla en una advertencia automática: la app nombra la columna que parece un proxy del objetivo antes de dejar entrenar.

La unidad de análisis también debe permanecer estable. Un registro puede representar una persona, una ruta, una franja horaria, una transacción, una interacción o un periodo. Mezclar unidades de manera inconsistente puede generar relaciones artificiales y evaluaciones engañosas.

La variable objetivo necesita una definición igualmente rigurosa. Un modelo puede alcanzar una métrica alta y, aun así, estar prediciendo una etiqueta ambigua, construida con reglas que no representan adecuadamente el fenómeno. La calidad del algoritmo nunca compensa una definición incorrecta del problema.

Esta disciplina proviene directamente de mi formación en Ingeniería Industrial. Antes de optimizar o predecir un sistema necesito comprender sus entidades, relaciones, restricciones, ciclos y mecanismos de variación. La predicción comienza con el conocimiento del proceso, no con la ejecución de una biblioteca. La selección del algoritmo aparece después: primero se construye una representación defendible del problema, y solo entonces tiene sentido comparar modelos y evaluar cuál ofrece el equilibrio adecuado entre desempeño, interpretabilidad, costo y posibilidad de integración.

## Qué significa llevar un modelo a producción

<!-- seccion: en-produccion -->

Utilizo con cuidado la expresión modelo en producción. No considero que un modelo alcance ese estado porque haya obtenido una métrica elevada en un notebook, porque pueda ejecutar inferencias o porque sus resultados aparezcan dentro de una presentación.

Un modelo comienza a funcionar como capacidad operativa cuando sus predicciones se integran en un proceso real, llegan dentro del ciclo de decisión, utilizan información disponible y cuentan con responsables capaces de interpretar sus resultados y actuar sobre ellos. En TransMilenio la predicción entraba al informe mensual de demanda durante diez meses; en Banco Pichincha, a la priorización de acciones de retención y cobro.

Esto exige un pipeline reproducible. Los datos deben localizarse, validarse y transformarse mediante reglas consistentes. Las variables utilizadas durante la inferencia deben corresponder con aquellas empleadas durante el desarrollo. Las predicciones necesitan conservar la fecha, la versión, el contexto y la población sobre la que fueron producidas.

También exige definir qué ocurre cuando los datos no cumplen las condiciones esperadas. Una fuente puede llegar incompleta, cambiar de estructura, perder oportunidad o alterar la distribución de una variable. La solución necesita controles que hagan visibles esas condiciones antes de que el modelo produzca resultados aparentemente válidos sobre entradas defectuosas. En transporte, una base semanal que llegaba con una ruta renombrada era exactamente ese caso, y el control era una validación previa y no la buena memoria de quien cargaba.

La predicción debe llegar a un consumidor y a una decisión identificables. Sin esa conexión, la salida permanece como un resultado técnico. También debe existir una forma de reconstruir lo ocurrido: si una predicción fue utilizada semanas atrás, necesito poder identificar qué versión del modelo intervino, qué datos recibió y bajo qué reglas fue generado el resultado. Esta trazabilidad es indispensable para investigar errores, comparar comportamientos y sostener la confianza.

Finalmente, producción implica responsabilidad durante el tiempo. Los datos cambian, los segmentos evolucionan, las variables pueden perder capacidad explicativa y la relación entre la predicción y la decisión puede modificarse. El modelo necesita seguimiento, revisión y criterios para actualizarse, restringirse o retirarse. Un modelo en producción no es un archivo desplegado. Es un sistema de datos, decisiones, controles, usuarios y responsabilidades que debe continuar funcionando después de la primera predicción.

## Evaluar un modelo es evaluar sus errores

<!-- seccion: evaluar-los-errores -->

No evalúo un modelo únicamente por su precisión general. Una métrica agregada puede ocultar comportamientos deficientes en segmentos importantes, periodos específicos o clases que aparecen con menor frecuencia, pero tienen mayores consecuencias para el negocio.

Una precisión superior al 90 % puede resultar poco informativa cuando la distribución del fenómeno está fuertemente desbalanceada. Un modelo podría acertar con frecuencia porque predice correctamente la condición mayoritaria y, aun así, fallar precisamente en los casos que justificaron su construcción. En fuga de clientes, la clase que importa es la minoritaria: los que se van.

Por eso, la evaluación necesita considerar el tipo de problema y el costo relativo de los errores. Un falso positivo y un falso negativo no siempre tienen la misma consecuencia. Identificar como riesgoso un caso que finalmente no lo era puede producir una intervención innecesaria. No detectar un caso realmente relevante puede impedir una actuación oportuna. La selección del umbral debe reflejar esa diferencia, y por eso miro la matriz de confusión antes que la exactitud: en qué se equivoca el modelo, no solo cuánto.

También observo el comportamiento entre segmentos. Un resultado general favorable puede coexistir con un desempeño inestable en determinadas rutas, franjas, grupos o condiciones externas. En TransMilenio, un RMSE aceptable en el agregado podía esconder rutas concretas donde el error era sistemático, y esas eran justamente las que la programación necesitaba acertar. La calidad debe evaluarse allí donde la organización utilizará realmente la predicción.

## Orden temporal, calibración y línea base

<!-- seccion: orden-temporal-calibracion-linea-base -->

En problemas con dimensión temporal, la evaluación debe respetar el orden de los datos. Utilizar información futura para explicar el pasado puede producir resultados artificialmente altos. Por eso, la validación debe aproximarse a la forma en que el modelo enfrentará periodos posteriores dentro de la operación: así validé la demanda de TransMilenio, con RMSE sobre periodos que el modelo no había visto.

La calibración también es relevante cuando la salida se interpreta como probabilidad. No basta con ordenar correctamente los casos. La magnitud de la estimación debe corresponder razonablemente con la frecuencia observada si será utilizada para definir umbrales, capacidad de intervención o niveles de prioridad. Un modelo de fuga que dice «80 %» a un grupo del que se va el 30 % ordena bien y calibra mal, y quien reparte la capacidad de retención con esa cifra reparte mal.

El modelo debe compararse además con una línea base defendible. La sofisticación algorítmica no tiene valor por sí sola. Necesito saber si la solución mejora realmente una regla simple, una media histórica, un enfoque existente o la forma actual de decisión. En Banco Pichincha la línea base era la predicción que ya existía, y el modelo la mejoró hasta un 35 %; en Probeta DS la línea base está a la vista por diseño —clase mayoritaria y regresión logística— y el veredicto dice «no supera» cuando no supera.

La pregunta correcta no es únicamente cuántas predicciones fueron acertadas. Es dónde se equivoca el modelo, qué consecuencias tienen esos errores, si la organización puede administrarlos y si el beneficio supera la complejidad que la solución introduce.

## De la predicción a la decisión

<!-- seccion: de-la-prediccion-a-la-decision -->

Una predicción no es una decisión. Es una señal construida a partir de evidencia histórica y supuestos que debe interpretarse dentro de un proceso determinado.

El modelo puede estimar demanda, probabilidad de fuga o riesgo de mora, pero no conoce por sí solo todas las restricciones que la organización enfrenta. No necesariamente comprende la capacidad disponible para intervenir, las prioridades del momento, las reglas institucionales ni la información cualitativa que todavía no se encuentra representada en los datos.

Por eso, el resultado necesita una capa de decisión. Esta puede consistir en reglas, umbrales, priorización, capacidad de atención, revisión humana o una combinación de estos elementos. La salida analítica adquiere valor cuando se relaciona con una actuación posible y con un responsable capaz de evaluarla.

En transporte, la predicción debía traducirse en una perspectiva útil para la planeación y la programación: el informe de demanda de referencia que las unidades tomaban para decidir. En banca, las probabilidades podían contribuir a priorizar casos, pero la intervención dependía de criterios adicionales y de las responsabilidades correspondientes.

Power BI desempeña una función importante en esta integración. La predicción puede presentarse junto con información histórica, variables contextuales, segmentos y tendencias que ayuden al usuario a comprender por qué el caso merece atención. El modelo aporta una señal; el producto analítico proporciona el contexto para interpretarla. Así se entregaban los resultados en Banco Pichincha en 2023.

Sin embargo, tampoco toda predicción necesita terminar en un tablero. Algunas pueden alimentar una alerta, una aplicación o un flujo de trabajo. Otras pueden ser utilizadas por un agente que recupere información y prepare una recomendación. El instrumento adecuado depende de la frecuencia, el riesgo, el tiempo y el nivel de interpretación requerido.

La responsabilidad debe permanecer explícita. Un sistema puede priorizar, ordenar o recomendar. La persona o el proceso autorizado determina la acción cuando la consecuencia exige conocimiento adicional, juicio o rendición de cuentas. El valor de la analítica predictiva no está en anticipar el futuro como una certeza. Está en reducir la incertidumbre lo suficiente para que una decisión pueda tomarse antes, con mayor contexto y con una mejor comprensión de sus riesgos.

## Las herramientas de machine learning y los lenguajes de programación: Python, R, SQL, y con qué nivel

<!-- seccion: las-herramientas -->

Los lenguajes de programación con los que trabajo son Python, R, SQL y DAX; el nivel más avanzado es Python. Python con scikit-learn constituye una de mis bases principales para desarrollar modelos predictivos. Es el entorno que utilicé en transporte, en banca y en Vesting para estructurar variables, entrenar modelos, comparar resultados y producir predicciones aplicables al problema correspondiente.

Pandas y NumPy forman parte habitual de mi trabajo de preparación y exploración. Los utilizo para organizar datos, transformar variables, construir conjuntos de análisis, evaluar distribuciones y preparar la información necesaria para los modelos.

Matplotlib y Seaborn me permiten examinar patrones, relaciones, diferencias entre segmentos y comportamientos que deben comprenderse antes de entrenar. La visualización exploratoria no reemplaza las pruebas estadísticas, pero ayuda a formular preguntas y detectar condiciones que podrían permanecer ocultas dentro de una tabla.

Jupyter facilita la experimentación y la documentación del recorrido analítico. Sin embargo, no considero el notebook como el destino final de una solución. Es un espacio para explorar, comparar y aprender. Cuando el trabajo necesita convertirse en capacidad operativa, la lógica debe estructurarse de forma reproducible y separarse de las decisiones manuales difíciles de rastrear.

R, RStudio, ggplot2 y Shiny complementan mi experiencia en análisis estadístico, modelado predictivo y comunicación de resultados. Incorporé R deliberadamente después de Python para profundizar en pruebas de hipótesis, razonamiento estadístico y evaluación de evidencia; la certificación de IBM en ciencia de datos aplicada con R, obtenida en 2024, cerró con un proyecto sobre datos reales con pruebas de hipótesis y un panel en Shiny.

SQL está desde Inglopres hasta hoy: es el lenguaje con el que localizo y preparo los datos antes de que lleguen a Python, y el que usé en SQLite para organizar las bases semanales de TransMilenio en análisis acumulativos.

## Cada herramienta, con qué nivel: la tabla honesta

<!-- seccion: nivel-por-herramienta -->

No presento las herramientas como equivalentes ni como una competencia definida únicamente por su nombre. Esta es la lista honesta, herramienta por herramienta:

| Herramienta | Nivel | Dónde |
| --- | --- | --- |
| Python con scikit-learn, Pandas, NumPy | trabajo real en producción | Banco Pichincha, TransMilenio y Vesting |
| Matplotlib, Seaborn, Jupyter | trabajo real, exploración y documentación | todos los proyectos de modelado |
| R, RStudio, ggplot2, Shiny | trabajo real, análisis estadístico | certificación de IBM de 2024 y análisis propios |
| SQL | trabajo real | desde Inglopres hasta hoy |
| PyTorch, TensorFlow | exploración | redes neuronales y aprendizaje profundo, sin caso en producción |
| Watson Studio | exploración | flujos analíticos |
| Orange Data Mining, SPSS | formación | universidad |
| SAS | trabajo complementario y formación | Cafam, como herramienta de análisis complementaria |
| Procesamiento de lenguaje natural (NLP) sobre modelos de lenguaje grandes (LLM) | trabajo real | algunos de mis agentes lo usan de forma permanente |

Estas herramientas no representan el mismo nivel de especialización ni cumplen la misma función. Python, scikit-learn, Pandas, NumPy y SQL ocupan un lugar central en mi práctica de modelado y preparación. R fortalece el análisis estadístico. PyTorch y TensorFlow amplían el alcance hacia redes neuronales, y los he usado para explorar, no para entregar. SPSS, SAS, Watson Studio y Orange me dieron otras formas de explorar, validar y operacionalizar análisis según el contexto, y las declaro con el nivel que tuvieron. El NLP es distinto: no viene de un curso sino de algo construido, porque varios de mis agentes lo usan de forma permanente sobre modelos de lenguaje.

Mi criterio se concentra en seleccionar la herramienta según el fenómeno, el volumen, la necesidad de interpretación, el entorno disponible y la forma en que el resultado deberá integrarse. El algoritmo y la plataforma importan, pero el valor predictivo surge de la calidad con la que se formula el problema, se construyen las variables, se evalúan los errores y se conecta la salida con una decisión.

## La estadística que sostiene el modelo

<!-- seccion: la-estadistica -->

Mi relación con la analítica predictiva comenzó en el énfasis en Inteligencia Analítica de Datos de Ingeniería Industrial, entre 2009 y 2016 en la Universidad Javeriana, donde el modelado y la predicción de fenómenos formaban parte de la manera de comprender sistemas, no de un curso aislado de programación. Ahí aparecieron SPSS y Orange, como herramientas de formación, antes que Python.

Esta formación estableció una disciplina que mantengo: antes de entrenar un modelo, necesito comprender si el fenómeno tiene suficiente historia, si las variables representan adecuadamente aquello que dicen medir, si la población observada es comparable y si existen cambios que puedan alterar la relación aprendida.

La estadística permite distinguir entre una asociación observada y una conclusión que puede sostenerse. También obliga a examinar variabilidad, incertidumbre, tamaño de muestra, sesgos, valores atípicos y condiciones bajo las cuales un resultado puede generalizarse.

Una variable técnicamente disponible no es necesariamente una variable válida. Puede representar un efecto posterior, contener información del futuro, duplicar indirectamente el objetivo, concentrar sesgos del proceso o funcionar únicamente en una parte de la población.

La estabilidad temporal es otro principio fundamental. Una relación identificada en un periodo puede debilitarse cuando cambian las condiciones del entorno, las reglas del negocio o el comportamiento de las personas. El modelo aprende del pasado; la organización necesita determinar si ese pasado continúa siendo una referencia adecuada.

También distingo entre predicción y causalidad. Que una variable ayude a anticipar un resultado no demuestra necesariamente que intervenir sobre ella produzca el cambio esperado. Esta diferencia protege a la organización de convertir una asociación predictiva en una recomendación causal sin evidencia suficiente. Que las obras civiles anticipen una caída de demanda en una ruta no significa que suspenderlas la recupere: la obra también señala otras cosas que cambiaron en la zona.

Un modelo con una métrica elevada sobre una variable mal definida sigue siendo una solución débil. La precisión no corrige una construcción conceptual incorrecta. Por eso, una parte importante de mi trabajo ocurre antes de seleccionar el algoritmo: comprender el proceso, establecer la unidad de análisis y construir una representación defendible del fenómeno. La Ingeniería Industrial aporta el entendimiento del sistema. La ciencia de datos aporta los métodos para aprender de su evidencia. La estadística establece cuánto puede afirmarse y bajo qué condiciones.

## La ingeniería de variables conecta el proceso con el modelo

<!-- seccion: ingenieria-de-variables -->

Las variables no aparecen terminadas dentro de las fuentes. Deben construirse a partir de eventos, estados, relaciones y ventanas temporales que representen adecuadamente el comportamiento del sistema.

La Ingeniería Industrial cumple una función central en esta etapa. Comprender el proceso me permite identificar qué eventos pueden anticipar un resultado, qué acumulaciones reflejan una restricción, qué secuencias revelan un cambio y qué condiciones externas modifican el comportamiento esperado.

En transporte, el tipo de día, la ruta, la hora, las obras, los eventos y el tráfico convertían condiciones temporales, territoriales y urbanas en señales utilizables por el modelo. No eran campos seleccionados únicamente porque estuvieran disponibles. Representaban mecanismos capaces de modificar la demanda, y venían de fuentes distintas —recaudo, flota y GPS, programación, novedades— que el ETL de C&M Consultores unificó antes de que existiera el modelo.

En banca, las variables relacionadas con comportamiento debían organizarse respetando el momento en el que la predicción sería producida. Una característica solo resultaba válida si podía calcularse con la información disponible antes del evento objetivo: nada del futuro filtrado al entrenamiento.

También debe evitarse la fragmentación entre desarrollo y operación. La transformación que construye una variable durante el entrenamiento debe corresponder con la utilizada posteriormente para producir predicciones. Una diferencia aparentemente pequeña puede modificar la distribución de entrada y degradar el resultado. Por eso, la ingeniería de variables necesita reglas, versionamiento y pruebas. Cada característica debe tener un significado, una fuente, una ventana temporal y una relación clara con la unidad de análisis. En Probeta DS esa regla es estructural: el preprocesamiento se ajusta solo con la mitad de entrenamiento y la interfaz no ofrece otro camino.

El DP-600 aporta una perspectiva relevante en esta integración. Los pipelines, almacenes y modelos analíticos de Microsoft Fabric pueden organizar datos reutilizables para personas, productos de Power BI y soluciones predictivas. La variable no necesita construirse de manera diferente en cada producto si existe una base gobernada capaz de sostenerla.

La ingeniería de variables es el punto donde el conocimiento del dominio se convierte en representación matemática. Su calidad determina en gran medida qué puede aprender el modelo y qué tan defendible será el resultado.

## Observar el modelo después de desplegarlo: los cinco niveles

<!-- seccion: monitoreo-del-modelo -->

El comportamiento de un modelo no queda garantizado por haber obtenido buenos resultados durante el desarrollo. Después de desplegarse, necesita ser observado frente a datos nuevos, condiciones cambiantes y decisiones reales. Distingo cinco niveles.

El primer nivel corresponde a la calidad de las entradas. Debo conocer si las fuentes llegaron, si las variables conservan los tipos y rangos esperados, si aumentaron los valores faltantes y si la población continúa siendo comparable con aquella utilizada durante el desarrollo.

El segundo nivel corresponde a la distribución. Una variable puede seguir existiendo y cambiar significativamente su comportamiento. Esa modificación no demuestra automáticamente que el modelo haya dejado de funcionar, pero constituye una señal que necesita análisis.

El tercer nivel corresponde al desempeño observado. Cuando el resultado real se encuentra disponible, las predicciones deben compararse con lo ocurrido. Esto permite conocer si las métricas permanecen dentro de rangos aceptables y si determinados segmentos presentan una degradación mayor. En TransMilenio el resultado real llegaba con el recaudo del mes: la predicción por ruta y franja se contrastaba con lo que de verdad ocurrió.

El cuarto nivel corresponde al uso. Un modelo puede mantener buen desempeño técnico y perder valor porque la organización cambió el proceso, dejó de utilizar el resultado o ya no cuenta con capacidad para actuar sobre las predicciones.

El quinto nivel corresponde al impacto. Debe evaluarse si las decisiones respaldadas por el modelo contribuyeron al resultado esperado y si sus beneficios continúan justificando el costo, la complejidad y los riesgos introducidos.

El monitoreo debe conducir a decisiones. Una desviación puede requerir investigar la fuente, ajustar una transformación, recalibrar un umbral, reentrenar el modelo, limitar su utilización o regresar temporalmente a una versión anterior.

## La deriva: el riesgo que la validación inicial no cubre

<!-- seccion: la-deriva -->

Un modelo se degrada sin avisar. La deriva —de los datos de entrada, de la relación que el modelo aprendió, de la población sobre la que predice— es el riesgo que la validación inicial no cubre, y por eso los cinco niveles anteriores se vigilan en producción y no solo antes de publicar: distribución de las entradas frente a la del entrenamiento, calidad de las fuentes, desempeño por segmento con el resultado real cuando llega, y el uso que los responsables hacen de la predicción.

No tengo un caso propio de deriva observada que pueda contar con sus cifras; lo que sí construí es la infraestructura para verla. En Vesting, entre agosto de 2023 y enero de 2025, el monitoreo en tiempo real de hasta 23 agentes recogía por sesión lo que un modelo necesita para ser vigilado —entradas, salidas, tiempos, estados, costo— y lo llevaba a Microsoft Fabric y a Power BI, donde una degradación se veía como una tendencia y no como una queja.

La ruta AI-300 profundiza formalmente en estas prácticas de MLOps y GenAIOps. Su valor en mi trayectoria es ampliar mediante una estructura reconocida principios que ya considero indispensables: versionamiento, evaluación, observabilidad, respuesta ante degradaciones y gestión del ciclo de vida. Un modelo operativo necesita saber no solamente cómo producir una predicción, sino también cómo demostrar que todavía merece ser utilizada.

## Probeta DS: construir un modelo que pueda defenderse

<!-- seccion: donde-lo-aplico-hoy -->

Dentro de mi propio pipeline desarrollé Probeta DS, una aplicación publicada cuya promesa es construir un modelo que pueda defenderse. Ejecuta Python, Pandas y scikit-learn dentro del navegador mediante WebAssembly, con Pyodide en un Web Worker, separando el procesamiento de la interfaz para conservar una experiencia utilizable.

La ejecución local permite trabajar sin enviar el archivo del usuario a un servidor externo. Esta decisión combina arquitectura, privacidad y experiencia: la aplicación aprovecha capacidades analíticas avanzadas mientras mantiene el procesamiento cerca de la persona que utiliza la solución. Cuatro pruebas de extremo a extremo inspeccionan cada petición de red durante el recorrido completo y fallan si alguna contiene valores del dataset: cero filas del usuario salen del navegador.

Probeta DS no se concentra únicamente en entrenar un algoritmo y mostrar una métrica. Su propósito es estructurar un recorrido en el que puedan examinarse los datos, comprender las variables, preparar la información, entrenar alternativas, evaluar resultados y conservar evidencia suficiente para explicar la selección realizada.

La palabra defender es deliberada. Un modelo defendible necesita responder qué fenómeno intenta anticipar, qué datos utilizó, cómo se construyeron las variables, qué línea base debía superar, qué errores produce, en qué segmentos funciona mejor o peor y bajo qué condiciones su resultado puede utilizarse. Está pensada para el profesional que no es científico de datos y tiene que defender un modelo ante su jefe o su comité, no ganar una tabla de clasificación.

La aplicación cuenta con 33 funcionalidades, 267 pruebas unitarias y de integración, 24 pruebas de extremo a extremo y un 90,69 % de cobertura de líneas, de acuerdo con las mediciones publicadas en su ficha técnica de agosto de 2026. Estas cifras describen el estado de la pieza, pero no sustituyen la evaluación de la calidad metodológica de los modelos construidos con ella.

## Qué hace Probeta DS por dentro: baselines, fuga imposible y cifras de prueba

<!-- seccion: probeta-por-dentro -->

Lo que Probeta DS hace por dentro es la misma disciplina de este documento convertida en producto. Dos modelos compiten con el mismo preprocesamiento —Random Forest y HistGradientBoosting de scikit-learn— y el resultado dice cuál ganó; no elige el usuario. Los dos se juzgan contra dos líneas base a la vista, la clase mayoritaria y una regresión logística, y el veredicto marca «supera», «empata» o «no supera» con el número exacto de la diferencia.

Las cinco métricas —exactitud, precisión, sensibilidad, F1 y AUC— se calculan siempre sobre el conjunto de prueba, con la matriz de confusión al lado para ver en qué se equivoca y no solo cuánto. La fuga de datos es imposible por construcción: el preprocesamiento se ajusta solo con la mitad de entrenamiento. Y una métrica casi perfecta no se celebra: se marca como sospechosa, porque un resultado redondo casi siempre esconde una fuga.

La importancia de variables se calcula por permutación sobre el conjunto de prueba, con dirección; si el modelo no se apoya en una variable, se dice así. Todo queda en una model card descargable con datos, partición, método, métricas, veredicto y límites. Los límites van dichos de frente: 5 MB o 50.000 filas, todo en CPU y sin GPU, y una narración con IA solo a petición, verificada contra los números antes de mostrarse y descartada si cita una cifra que no existe.

Probeta DS también demuestra mi capacidad para trasladar bibliotecas de ciencia de datos hacia una experiencia accesible. El usuario no necesita comenzar configurando un entorno local completo para recorrer el proceso analítico, pero la simplificación de la experiencia no debe ocultar las decisiones ni presentar el entrenamiento como un procedimiento automático libre de supuestos.

El Diseño Industrial influye especialmente en esta pieza. El reto no era únicamente ejecutar scikit-learn dentro del navegador, sino organizar el proceso en cinco pantallas para que una persona pudiera comprender qué etapa estaba realizando, qué decisiones debía tomar y qué evidencia necesitaba conservar. La aplicación representa la convergencia entre ciencia de datos, ingeniería de software y diseño. No demuestra únicamente que puedo entrenar modelos. Demuestra que puedo convertir el modelado predictivo en un producto utilizable, verificable y orientado a criterios.

## De modelos predictivos a sistemas inteligentes

<!-- seccion: de-modelos-a-sistemas -->

La analítica predictiva constituye uno de los fundamentos de la inteligencia artificial empresarial, pero no agota su alcance. Un modelo produce una estimación, clasificación o prioridad. Una aplicación puede integrar esa salida con reglas, contexto y una experiencia de usuario. Un agente puede además recuperar conocimiento, utilizar herramientas y coordinar acciones dentro de límites definidos.

Esta progresión no convierte automáticamente al agente en una solución superior. Cada nivel introduce capacidades y responsabilidades adicionales. Cuando una predicción es suficiente, agregar una arquitectura generativa puede aumentar costo, variabilidad y dificultad de evaluación sin producir valor proporcional. Es la regla de código primero con la que construyo mis aplicaciones: Velo e Innmobiliaria no tienen un solo modelo de IA porque no lo necesitan.

Mi experiencia predictiva aporta una disciplina importante al desarrollo de agentes: definir el objetivo, construir una línea base, separar entrenamiento y evaluación, analizar errores, observar segmentos y comparar el resultado con un criterio explícito.

Los agentes generativos necesitan esa misma cultura de evaluación, aunque sus resultados no siempre puedan medirse mediante las métricas tradicionales de clasificación o regresión. Deben evaluarse por cumplimiento, fundamentación, selección de herramientas, calidad de las salidas, costo, latencia y comportamiento frente a excepciones. Cuando medí mi ecosistema agéntico lo hice con esa lógica: 120 escenarios, una línea base, una métrica de cumplimiento y una de consumo.

El DP-600 proporciona la base de datos y modelos semánticos que puede alimentar tanto análisis humano como soluciones inteligentes. La ruta AI-103 amplía esa base hacia aplicaciones y agentes. La ruta AI-300 fortalece la capacidad para operar, evaluar y observar modelos tradicionales y sistemas generativos durante su ciclo de vida.

La evolución de mi perfil no ha consistido en abandonar la analítica predictiva para dedicarme a agentes. Consiste en incorporar la predicción dentro de arquitecturas más amplias, donde los modelos, los datos, las reglas, las interfaces y las personas participan de manera coordinada. La predicción aporta una señal. La arquitectura determina cómo se interpreta, quién puede utilizarla, qué acción puede producir y qué evidencia debe conservarse.

## Lo que demuestra mi enfoque predictivo

<!-- seccion: lo-que-demuestra -->

Mi trabajo en analítica predictiva demuestra que no separo el modelo del proceso que le da propósito ni de la arquitectura que permite utilizarlo.

Comienzo por definir el fenómeno, la unidad de análisis, el horizonte y la decisión. Después construyo variables que representen condiciones disponibles en el momento correcto, establezco una línea base y selecciono las métricas según el costo de los errores.

La evaluación no termina en un promedio. Examino segmentos, estabilidad, temporalidad, calibración y condiciones bajo las cuales el resultado puede dejar de ser confiable. También distingo predicción de causalidad y evito convertir una asociación en una recomendación sin evidencia suficiente.

El despliegue tampoco termina en una inferencia disponible. El modelo necesita pipelines reproducibles, entradas controladas, responsables, contexto para la interpretación y mecanismos para observar si continúa cumpliendo su propósito.

Mi profundidad técnica abarca Python, scikit-learn, Pandas, NumPy, R y diferentes entornos de análisis y aprendizaje automático. Sin embargo, mi principal diferencial no se encuentra en la cantidad de bibliotecas utilizadas. Se encuentra en la capacidad para conectar conocimiento del proceso, estadística, modelado, ingeniería de datos, producto analítico y decisión.

Probeta DS convierte esta postura en una aplicación pública. Los modelos desarrollados en transporte con C&M Consultores y en banca con Banco Pichincha demuestran su utilización profesional: uno corrió diez meses dentro de un informe mensual; los otros llegaron a producción con más del 90 % de precisión. Mi trabajo con Fabric, Power BI y agentes amplía esa experiencia hacia arquitecturas en las que las predicciones pueden integrarse con nuevas formas de interacción y actuación.

No busco construir el modelo con la métrica más llamativa. Busco construir una capacidad predictiva que pueda explicarse, utilizarse, observarse y defenderse cuando una persona pregunte qué significa el resultado y por qué merece influir sobre una decisión.
