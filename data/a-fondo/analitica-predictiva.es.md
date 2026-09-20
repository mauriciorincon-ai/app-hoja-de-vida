---
slug: analitica-predictiva
titulo: "Analítica predictiva"
resumen: "Dos familias de modelos en producción con scikit-learn —demanda del SITP por ruta y franja, y fuga, mora y riesgo en banca con más del 90 % de precisión—, las herramientas de machine learning que uso y con qué nivel, la estadística y la ingeniería de variables que sostienen el modelo, y Probeta DS."
estado: borrador
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

He llevado modelos de **machine learning** a producción en dos contextos que no se parecen: la
planeación de la demanda en transporte masivo y la anticipación del comportamiento de clientes
en banca. El método viaja; el fenómeno, el horizonte, el costo del error y la forma de usar el
resultado se diseñan de nuevo en cada uno.

En **TransMilenio**, con C&M Consultores, desarrollé con **scikit-learn** un modelo de **demanda por
ruta y franja horaria** con actualización mensual: tipo de día y hora para los patrones
recurrentes, ruta para las diferencias entre servicios y zonas, obras civiles, eventos y tráfico
para las excepciones. Se validó con RMSE respetando el orden temporal, corrió diez meses y
alimentaba el informe de demanda con el que las unidades programaban; contribuyó a una mejora
reportada del 20 % en el rendimiento del sistema.

En **Banco Pichincha** entrené y llevé a producción modelos de **fuga de clientes, mora y riesgo**:
qué cliente puede irse, qué obligación puede dejar de pagarse, qué operación concentra riesgo.
Los resultados reportados superaron el **90 % de precisión** y mejoraron hasta un 35 % las
predicciones existentes, cifras que se interpretan dentro de sus poblaciones, horizontes y
métricas. En los dos casos el modelo generaba evidencia para una decisión; nunca la decisión.

## Qué significa llevar un modelo a producción

<!-- seccion: en-produccion -->

Uso con cuidado la expresión «modelo en producción». Un modelo no está en producción por tener
una métrica alta en un notebook: lo está cuando sus predicciones entran en un proceso real,
llegan dentro del ciclo de decisión, usan solo información disponible en ese momento y tienen un
responsable que las interpreta y actúa.

En TransMilenio la predicción entraba al informe mensual de demanda; en Banco Pichincha, a la
priorización de acciones de retención y cobro. Eso exige un pipeline reproducible —datos
localizados, validados y transformados con las mismas reglas—, las mismas variables en entrenamiento y en inferencia, y cada predicción con su fecha,
su versión y su población, para poder reconstruir semanas después qué modelo intervino y con qué
datos. Exige controles para cuando una fuente llega incompleta o cambia de distribución, antes
de que el modelo produzca resultados válidos sobre entradas defectuosas. Y exige responsabilidad
en el tiempo: los datos cambian, las variables pierden capacidad explicativa y el modelo
necesita seguimiento, revisión y criterios para actualizarse o retirarse.

## Los lenguajes de programación y las herramientas: Python, R, SQL, y con qué nivel

<!-- seccion: las-herramientas -->

Los lenguajes de programación con los que trabajo son Python, R, SQL y DAX; el nivel más avanzado es Python. No presento las herramientas como equivalentes. Esta es la lista honesta:

| Herramienta                      | Nivel                                   | Dónde                                       |
| -------------------------------- | --------------------------------------- | ------------------------------------------- |
| **Python** con **scikit-learn**, Pandas, NumPy | trabajo real en producción     | Banco Pichincha, TransMilenio, Vesting      |
| Matplotlib, Seaborn, Jupyter     | trabajo real, exploración y documentación | todos los proyectos de modelado            |
| **R**, RStudio, ggplot2, Shiny   | trabajo real, análisis estadístico       | certificación IBM de 2024 y análisis propios |
| SQL                              | trabajo real                             | desde Inglopres hasta hoy                   |
| **PyTorch**, **TensorFlow**      | exploración                              | redes neuronales, sin caso en producción    |
| Watson Studio                    | exploración                              | flujos analíticos                           |
| Orange, SPSS                     | formación                                | universidad                                 |
| SAS                              | trabajo complementario y formación       | Cafam, como herramienta de análisis         |
| Procesamiento de lenguaje natural (NLP), sobre modelos de lenguaje grandes (LLM) | trabajo real | varios de mis agentes lo usan de forma permanente |

El algoritmo importa menos que la calidad con la que se formula el problema, se construyen las
variables, se evalúan los errores y se conecta la salida con una decisión. Elijo por el
fenómeno, el volumen, la necesidad de interpretación y el entorno donde el resultado se integra.

## La estadística que sostiene el modelo

<!-- seccion: la-estadistica -->

Mi relación con la predicción empezó en el énfasis en Inteligencia Analítica de Datos de
Ingeniería Industrial, entre 2009 y 2016, como forma de entender sistemas y no como un curso de programación. De
ahí una disciplina: antes de entrenar, saber si el fenómeno tiene suficiente historia, si las
variables miden lo que dicen medir, si la población es comparable y si algo cambió la relación.

La estadística distingue una asociación observada de una conclusión sostenible: variabilidad,
incertidumbre, tamaño de muestra, sesgos, valores atípicos. Distingo predicción de causalidad
—que una variable anticipe un resultado no prueba que intervenirla lo cambie— y vigilo la
estabilidad temporal: el modelo aprende del pasado y la organización decide si ese pasado sigue
siendo referencia. Un modelo con métrica alta sobre una variable mal definida es una solución
débil. La **precisión** no corrige un concepto incorrecto.

## La ingeniería de variables conecta el proceso con el modelo

<!-- seccion: ingenieria-de-variables -->

Las variables no vienen terminadas en las fuentes: se construyen desde eventos, estados,
relaciones y ventanas temporales. Entender el proceso —la parte de ingeniería industrial— dice
qué eventos anticipan un resultado, qué acumulación refleja una restricción y qué condición
externa cambia el comportamiento.

En transporte, tipo de día, ruta, hora, obras, eventos y tráfico eran mecanismos que mueven la
demanda, no campos disponibles. En banca, cada variable de comportamiento debía calcularse solo
con información anterior al evento objetivo: nada del futuro filtrado al entrenamiento. Y la
transformación que construye una variable en entrenamiento tiene que ser la misma en inferencia:
una diferencia pequeña cambia la distribución de entrada y degrada el resultado. Por eso las
variables llevan reglas, versión y pruebas, y una base gobernada —como la que el DP-600 describe—
evita construirlas distinto en cada producto.

## Observar el modelo después de desplegarlo

<!-- seccion: monitoreo-del-modelo -->

Un modelo se degrada sin avisar. La **deriva** —de los datos de entrada, de la relación que el
modelo aprendió, de la población— es el riesgo que la **validación** inicial no cubre, y se vigila
en producción: distribución de las entradas frente a la del entrenamiento, calidad de las
fuentes, desempeño por segmento con el resultado real cuando llega, y el uso que los responsables
hacen de la predicción.

No tengo un caso propio de deriva observada que pueda contar; lo que sí construí es la
infraestructura para verla: en Vesting, el monitoreo en tiempo real de 23 agentes recogía por
sesión lo que un modelo necesita para ser vigilado —entradas, salidas, tiempos, estados, costo—.
La ruta AI-300 formaliza esta mitad de MLOps.

## Probeta DS: construir un modelo que pueda defenderse

<!-- seccion: donde-lo-aplico-hoy -->

En mi propio pipeline construí **Probeta DS**, una aplicación publicada cuya promesa es construir
un modelo que pueda defenderse. Ejecuta **Python**, Pandas y scikit-learn dentro del navegador
mediante WebAssembly: el archivo del usuario no viaja a un servidor y el procesamiento queda
cerca de la persona.

No entrena y muestra una métrica: organiza el recorrido —examinar los datos, entender las
variables, preparar, entrenar alternativas, evaluar— y conserva evidencia para explicar la
selección. Defender un modelo es responder qué fenómeno anticipa, con qué datos, cómo se
construyeron las variables, qué línea base superó, qué errores produce y en qué segmentos
funciona peor. La pieza tiene **33 funcionalidades, 267 pruebas unitarias y 90,69 % de
cobertura**, según su ficha; esas cifras describen la pieza, no la calidad metodológica de los
modelos que alguien construya con ella.
