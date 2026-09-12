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

Volví al mundo TransMilenio en julio de 2021, esta vez con C&M Consultores y en la Fuerza Operativa,
como Profesional de Análisis Post-Operacional, hasta mayo de 2022.

El análisis post-operacional es mirar hacia atrás para decidir hacia adelante: qué pasó ayer en la
operación, por qué, y qué hay que cambiar. El obstáculo era que los datos vivían en fuentes
heterogéneas y buena parte del reporte era manual. La operación producía información más rápido de
lo que podíamos convertirla en algo utilizable.

## Unificar las fuentes

<!-- seccion: unificar-las-fuentes -->

Diseñé e implementé sistemas de extracción, transformación y carga que unificaron fuentes de datos
heterogéneas, con una mejora del setenta por ciento en la precisión y la velocidad del análisis.

Ese setenta por ciento es la cifra de la que más orgulloso estoy de esa época, y conviene entender
de dónde sale: no es que los datos fueran mejores, es que dejaron de reconciliarse a mano. Cuando
la unificación es un proceso y no una tarde de trabajo, la precisión y la velocidad mejoran juntas,
porque son el mismo problema.

[CONFIRMAR: ¿cuántas fuentes eran y de qué tipo (sistemas de recaudo, de flota, de programación)?
Sin eso, «heterogéneas» es una palabra; con eso, es un logro de arquitectura.]

## La adopción del BI en la operación

<!-- seccion: la-adopcion -->

Lideré la implementación de herramientas especializadas de inteligencia de negocios, con un aumento
del treinta y cinco por ciento en la eficiencia operativa y tableros adoptados por más de
veinticinco usuarios clave.

«Usuarios clave» es deliberado: en una operación así no se trata de que mucha gente abra un tablero,
sino de que lo abran las personas que toman las decisiones de programación y de servicio.

## Las mesas con la dirección del SITP

<!-- seccion: las-mesas-del-sitp -->

Coordiné mesas de trabajo con la dirección de concesionarios del Sistema Integrado de Transporte
Público para definir estrategias de mejora en los procesos, alcanzando un veinticinco por ciento de
mejora en los indicadores.

Esta es la experiencia que más me sirve hoy y la que menos se ve en un currículum. Sentar en una
mesa a una autoridad y a los operadores, con datos que ninguno puede impugnar, y salir con
decisiones: eso es análisis con consecuencia. La parte técnica era la mitad del trabajo; la otra
mitad era que el número fuera indiscutible antes de entrar a la sala.

## La predicción de demanda

<!-- seccion: prediccion-de-demanda -->

Desarrollé un modelo de predicción de la demanda con scikit-learn para optimizar decisiones
estratégicas, con un aumento del veinte por ciento en el rendimiento del sistema.

Es mi primer modelo de aprendizaje automático con consecuencia operativa real: predecir cuánta
gente va a moverse permite programar mejor la flota. Y me enseñó la lección que repito desde
entonces: un modelo que nadie usa para decidir nada es un ejercicio, no un modelo en producción.

[CONFIRMAR: ¿qué variables usaba y a qué horizonte predecía (siguiente hora, día, semana)? Y
¿cuánto tiempo estuvo corriendo? Esos tres datos son lo que un ingeniero de IA preguntaría en una
entrevista técnica.]

## La automatización

<!-- seccion: la-automatizacion -->

Implementé scripts que redujeron en un cuarenta por ciento el tiempo de las tareas repetitivas.
Suena menor al lado de un modelo predictivo, pero es lo que liberó el tiempo para construirlo. Casi
siempre el trabajo de más valor de un analista está bloqueado por el trabajo de menos valor.
