---
slug: transmilenio-cm
titulo: "C&M Consultores / TransMilenio — análisis post-operacional (2021–2022)"
resumen: "El análisis post-operacional del SITP: el ETL que unificó recaudo, flota, programación, novedades y PQR (+70 %), BI adoptado por 25+ usuarios clave (+35 %), las mesas con la dirección del SITP (+25 %) y un modelo de demanda en scikit-learn que corrió diez meses."
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

Regresé al entorno de **TransMilenio en julio de 2021**, esta vez como Profesional de Análisis
Post-Operacional en **C&M Consultores**, en la Fuerza Operativa de TransMilenio S.A., y estuve
hasta mayo de 2022. Volví al mismo dominio con una responsabilidad distinta: ya no supervisar el
cumplimiento, sino explicar la operación y ayudar a decidir cómo ajustarla.

El **análisis post-operacional** reconstruye lo ocurrido para entender sus causas y decidir la
operación futura. No describe el día anterior: explica las diferencias entre lo programado y lo
ejecutado, encuentra patrones, hace visibles las restricciones y convierte eso en una
recomendación con consecuencia.

El obstáculo era que la operación del **SITP** generaba información más rápido de lo que podía
prepararse y analizarse a mano. Los datos vivían en cinco fuentes heterogéneas, cada una con su
estructura, su detalle y sus reglas:

- el **recaudo**;
- la **flota y el GPS** de los buses;
- la **programación** de servicios;
- las **novedades** de la operación;
- las **PQR** de los usuarios.

Buena parte del esfuerzo se iba en localizar archivos, conciliar formatos y corregir estructuras
antes de analizar nada. Ahí se ve la diferencia entre tener datos y tener capacidad analítica.

## Unificar las fuentes

<!-- seccion: unificar-las-fuentes -->

Diseñé e implementé los procesos de **ETL** —extracción, transformación y carga— que integraron
las cinco fuentes en una base analítica común. La intervención mejoró un **70 % la precisión y la
velocidad del análisis**, porque sustituyó la conciliación manual por reglas consistentes que se
aplican igual en cada ciclo.

Integrar no era mover datos a un repositorio. Había que entender qué representaba cada
registro, armonizar estructuras, resolver diferencias entre identificadores, alinear las
dimensiones temporales —el recaudo por transacción, el GPS por segundo, la programación por
servicio— y fijar las reglas para relacionarlos. Las bases semanales de los concesionarios se
organizaban en SQLite para el acumulado histórico.

Incorporé validaciones para detectar datos incompletos, duplicados y relaciones que no cumplían
las reglas esperadas: no para corregir en silencio al final del recorrido, sino para hacerlas
visibles, rastrear su origen y evitar que avanzaran hasta un indicador.

Un pipeline no es una tubería invisible. Contiene decisiones sobre calidad, correspondencia,
temporalidad y granularidad que forman parte de la lógica del negocio, y por eso se documentan
como tal.

## La adopción del BI en la operación

<!-- seccion: la-adopcion -->

Lideré la implementación de **Power BI** en la operación, con un aumento del **35 % en la
eficiencia de los procesos analíticos** y la adopción de los tableros por **más de 25 usuarios
clave**: los responsables de programación, seguimiento y decisiones de servicio.

«Usuarios clave» es la palabra importante. El valor no estaba en cuántas personas abrían un
tablero sino en que lo usaran quienes tenían responsabilidad sobre la operación. Por eso cada
tablero se diseñó alrededor de una pregunta operacional concreta: reconocer una condición,
entender sus causas y orientar una acción, sin obligar al usuario a interpretar una acumulación de
gráficas.

El resultado más importante no fue el número de tableros sino una visión compartida de la
operación: cuando los responsables usan las mismas definiciones y pueden recorrer un resultado
hasta su evidencia, la conversación deja de ser sobre cuál cifra es correcta y pasa a ser sobre
qué hacer.

## Las mesas con la dirección del SITP

<!-- seccion: las-mesas-del-sitp -->

Coordiné mesas de trabajo con la dirección de concesionarios del **Sistema Integrado de
Transporte Público (SITP)** para analizar resultados, definir estrategias de mejora y articular
decisiones sobre los procesos. Ese trabajo contribuyó a una **mejora del 25 % en los indicadores**
de la operación.

Es negociación basada en evidencia entre la autoridad, los concesionarios y los equipos
técnicos, cada uno con responsabilidades, restricciones e interpretaciones distintas. La
credibilidad no se construye dentro de la reunión: el dato llega con una definición clara, una
procedencia identificable y una relación verificable con los eventos de la operación, o no sirve
para decidir.

Una recomendación ejecutiva conecta evidencia, mecanismo y consecuencia. No basta señalar que un
indicador empeoró: hay que explicar qué condiciones lo producen, qué actor puede intervenir, qué
alternativas hay y cómo se sabrá si funcionó. Y una decisión no genera valor por quedar en un
acta: necesita responsable, acción, plazo e indicador para cerrar el ciclo.

## La predicción de demanda

<!-- seccion: prediccion-de-demanda -->

Desarrollé con **scikit-learn** un modelo de aprendizaje automático para predecir la **demanda del
sistema por ruta y franja horaria**, con actualización mensual, para fortalecer la planeación y
la programación de flota. El problema, en lenguaje de ingeniería industrial, es pronóstico de
demanda para planeación de capacidad.

Las variables representaban las dimensiones del comportamiento de la demanda:

- el tipo de día y la hora del día, para los patrones recurrentes;
- la ruta, para las diferencias estructurales entre servicios y zonas;
- las obras civiles, los eventos y las condiciones de tráfico, para las excepciones.

Es un problema de series de tiempo, y la validación tenía que respetarlo: se evaluó con **RMSE**
respetando el orden temporal, nunca con una partición aleatoria que dejara ver el futuro. Y no
bastaba una medida global: había que mirar cómo se comportaba el modelo por ruta, por franja y
por tipo de día, porque un buen promedio esconde errores en los segmentos críticos.

El modelo corrió **diez meses**. Lo usaban los profesionales que presentaban el informe mensual de
demanda que las unidades tomaban como referencia para programar, y contribuyó a una **mejora del
20 % en el rendimiento reportado del sistema**.

De ahí salió una disciplina que mantengo para toda solución inteligente: primero qué decisión se
quiere mejorar, con cuánta anticipación necesita la respuesta y quién la va a usar; después el
algoritmo.

## La automatización

<!-- seccion: la-automatizacion -->

Implementé scripts que redujeron un **40 % el tiempo de las tareas repetitivas** de preparación y
procesamiento de información. Fue la condición para liberar capacidad analítica: si el tiempo se
va en localizar archivos, consolidar estructuras y corregir formatos, la organización tiene
analistas pero no capacidad analítica.

La automatización aplicaba las mismas reglas cada vez, redujo la intervención manual y volvió los
ciclos de análisis reproducibles: entradas conocidas, transformaciones definidas, salidas
verificables. Y con controles: un script que solo funciona en condiciones ideales traslada el
esfuerzo manual a resolver fallas. Validar las entradas, registrar las desviaciones y hacer
visibles las excepciones era parte del diseño.

## Lo que C&M Consultores consolidó

<!-- seccion: lo-que-cm-consultores-consolido -->

En C&M Consultores convertí mi conocimiento de la operación de transporte en una capacidad
analítica integrada: la etapa anterior me había enseñado a reconstruir y supervisar el sistema
con datos; en esta lo unifiqué, lo automaticé, lo llevé a Power BI, lo puse en una mesa con la
dirección del SITP y lo usé para predecir.

ETL, modelado, visualización, predicción y comunicación ejecutiva no son productos
independientes. Son una misma arquitectura de decisión: los datos se integran bajo reglas
consistentes, el modelo conserva su significado, el producto responde a una pregunta, la
predicción llega a tiempo y la conversación termina en una decisión con responsable.
