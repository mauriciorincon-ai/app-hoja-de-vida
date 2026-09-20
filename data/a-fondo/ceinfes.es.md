---
slug: ceinfes
titulo: "Ceinfes — Coordinador de Operaciones (2017–2018)"
resumen: "Coordinar tres frentes para más de 100 colegios: KPIs por área, el balanceo de la digitalización, informes a la junta directiva y la transición a gestión por procesos con Kanban."
estado: aprobado
ancla: "#trayectoria"
actualizado: 2026-09-20
preguntas_de_prueba:
  - "¿Qué hizo Henry en Ceinfes?"
  - "¿Ha presentado informes a una junta directiva?"
  - "¿Ha trabajado con Kanban y metodologías ágiles?"
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
La transición a gestión por procesos, cómo montaste los KPIs, cómo
era reportar a junta directiva, qué te dejó coordinar equipos
multidisciplinarios. -->

## El encargo

<!-- seccion: el-encargo -->

Entré a **Ceinfes en noviembre de 2017** como Coordinador de Operaciones y estuve hasta
noviembre de 2018. Fue el paso de mejorar un proceso a dirigir una operación entera, con equipos,
recursos, dependencias y puntos de control que no dependían de mí uno a uno.

Ceinfes prestaba servicios de evaluación educativa: simulacros de pruebas para **más de 100
colegios al año**. La operación tenía que poner profesores, consultores, materiales, instrumentos de
evaluación y transporte en cada institución en la fecha exacta. Llegar antes estorbaba; llegar
después dejaba la prueba sin aplicar.

Bajo mi coordinación convergían tres frentes que solo funcionaban juntos, unas 40 personas
directas —7 en programación, 12 en digitalización y 20 en logística— y, a través de la
programación, unos 50 profesores aplicadores:

| Frente         | Qué hacía                                                        | Qué pasaba si fallaba                                  |
| -------------- | ---------------------------------------------------------------- | ------------------------------------------------------ |
| Programación   | asignaba profesores y consultores a colegios y fechas            | una prueba sin aplicador, o un aplicador en dos sitios |
| Digitalización | convertía las hojas de respuesta físicas en datos, con escáneres | un estudiante sin resultado, o con el de otro          |
| Logística      | preparaba y movía el material a cada institución                 | un cronograma corrido para todo el ciclo               |

Mi responsabilidad era que dejaran de operar como tres áreas y empezaran a operar como un solo
flujo. De ahí salió la forma de pensar que todavía guía mi trabajo: el desempeño de un sistema no
se explica por la eficiencia aislada de sus partes, sino por la calidad de las relaciones entre
ellas.

## Los indicadores, por área

<!-- seccion: los-indicadores -->

Coordinar tres frentes con más de 100 colegios de por medio exigía ver el estado de la operación
sin preguntar. Definí y gestioné **KPIs** para los tres procesos —programación, logística y
digitalización— como medidores instalados a lo largo del flujo operativo, cada uno con su número
del día:

- demanda por atender: colegios y estudiantes programados por fecha;
- recursos confirmados: aplicadores asignados frente a los requeridos;
- material preparado y entregado, por institución;
- pruebas recibidas de vuelta;
- pendiente de digitalización y registros validados.

Los dos que más pesaban eran el **cumplimiento de la programación** —cuántas aplicaciones
ocurrieron donde y cuando estaban previstas— y el **avance de digitalización**, porque de él
dependía la fecha de entrega de resultados al colegio. Detrás iban las entregas a tiempo por
institución, el porcentaje de captura manual y los reprocesos por lote.

Aprendí que medir solo el resultado final llega tarde: cuando un indicador dice que una entrega
incumplió, el valor de saberlo ya se perdió en buena parte. Por eso los indicadores intermedios
—acumulaciones, retrasos, diferencias de capacidad— eran los que servían para intervenir.

Y aprendí a construir definiciones compartidas. «Material preparado», «entrega completa»,
«recurso confirmado» y «registro procesado» tenían que significar lo mismo para las tres áreas;
si no, la reunión se gastaba discutiendo la cifra y no el problema. Cada KPI conservaba además
trazabilidad hasta el evento: la institución, el lote, la asignación que explicaba el número.

## El balanceo del proceso de digitalización

<!-- seccion: balanceo-de-digitalizacion -->

La **digitalización de las hojas de respuesta** merecía atención aparte, porque se comportaba
como una línea de producción: recibir, organizar, identificar, escanear con equipos
especializados, revisar, corregir las lecturas dudosas y completar a mano lo que la captura
automática no resolvía.

Lo traté como lo que era, un problema de **balanceo de líneas**: unas **250 hojas por jornada**,
dos estaciones de escaneo y, alrededor, las de alistamiento, organización, validación y
reordenamiento; cerca de un 10 % de las hojas necesitaba captura manual. Cada estación tenía
una capacidad, un tiempo de ciclo y una incidencia sobre la calidad final. Si una avanzaba más rápido
de lo que la siguiente absorbía, el trabajo en proceso se acumulaba; si la captura se aceleraba a
costa de la revisión, los errores reaparecían más adelante, más caros. La estación que
restringía el flujo —el **cuello de botella**, en el vocabulario de la teoría de restricciones—
era la que fijaba el ritmo real del proceso, y era la que había que proteger y alimentar.

De ahí salió una distinción que sigo usando: **capacidad teórica frente a capacidad efectiva**.
La primera es lo que una estación procesa en condiciones ideales. La segunda incorpora
excepciones, errores de lectura, validaciones, captura manual, pausas y reprocesos. Balancear
con promedios producía una foto falsa y trasladaba la restricción de un sitio a otro.

El balanceo tenía además una dimensión humana. Revisar y capturar son tareas repetitivas, y un
estándar que supone ritmo constante e indefinido se incumple desde la segunda semana. Los
estándares realistas —los mismos suplementos por fatiga que había aplicado en Inglopres— eran
parte del balanceo, no un ajuste posterior.

Años después apliqué la misma lógica a pipelines de datos y a agentes de IA: cada componente
tiene una función, una capacidad, entradas, salidas y excepciones, y mejorar el sistema exige
mirar el flujo completo y no la pieza más lenta.

## La programación de recursos

<!-- seccion: la-programacion-de-recursos -->

Asignar profesores y consultores a más de 100 colegios, cada uno con su fecha y su franja, es un
**problema de asignación con ventanas de tiempo**: cada aplicador tiene disponibilidad,
competencias y una ubicación de partida, y cada colegio una ventana exacta en la que la prueba
debe ocurrir. Al principio se hacía a mano, sobre Google Calendar. Diseñé una **macro en VBA** que
optimizaba la asignación con esas restricciones explícitas, en vez de con una lista de nombres.

La asignación no podía limitarse a decir quién iba a dónde. Tenía que considerar la demanda del
día, la capacidad disponible, la prioridad de cada institución, las competencias requeridas, las
dependencias con el material y el momento exacto en que el resultado se necesitaba. Coordinar
significaba proteger el flujo completo, no mantener ocupadas a todas las personas.

## La conversación con la junta directiva

<!-- seccion: la-junta-directiva -->

En Ceinfes presenté **informes estratégicos a la junta directiva** por primera vez en mi
trayectoria. Los informes eran **semanales, cada viernes**, y salían de los mismos KPIs de la operación. De
ellos salieron decisiones concretas: programas de incentivos, mejoras de condiciones laborales,
rediseño de puestos de trabajo, rediseño de procesos y rediseño del software.

Aprendí a llegar con dos niveles: una lámina con la consecuencia y un número, y detrás la base
trazable por si la pedían. La junta no quiere el detalle; quiere saber que el detalle existe y
que puede consultarse. Cada informe respondía cinco cosas: qué está pasando, por qué importa, qué
lo explica, qué riesgo tiene dejarlo así y qué alternativas hay.

Esa fue la base de mi relación posterior con la alta dirección: rigor técnico sin trasladar su
complejidad, hechos separados de interpretaciones, y recomendaciones con sus supuestos y
consecuencias a la vista.

## La transición a gestión por procesos

<!-- seccion: gestion-por-procesos -->

Lideré la transición de Ceinfes hacia un modelo de **gestión por procesos** sustentado en
sistemas de información, y dirigí los proyectos tecnológicos que lo soportaban con
**metodologías ágiles**. Con el área de tecnología trabajamos con
**Scrum**, por sprints, para los proyectos, y con **Kanban** para el flujo de solicitudes: un
tablero con prioridades, responsables, dependencias y estado de avance, y un límite al trabajo
en curso para que lo empezado se terminara antes de abrir lo siguiente. Los procesos los modelé
en BPMN con Bizagi.

El cambio más difícil no fue técnico. La operación dependía del conocimiento repartido en cada
área; había que convertirlo en procesos explícitos, información compartida y sistemas capaces de
sostenerlos. Eso exigía documentar decisiones que llevaban años implícitas, acordar
responsabilidades y convertir excepciones habituales en reglas.

Ahí aprendí de dónde sale la resistencia: no de la tecnología, sino de que hacer visible el
proceso obliga a resolver ambigüedades que durante años se compensaron con experiencia,
comunicación informal y decisiones individuales. La transformación tiene que reconocer ese
conocimiento y estructurarlo, sin eliminar el criterio profesional de quien lo tenía.

También aprendí a especificar con más precisión que un diagrama general: qué recibe cada
actividad, qué regla aplica, qué produce y cómo trata sus excepciones. Esa especificación era la
base de la **mejora continua**: sin un proceso explícito no hay contra qué medir la mejora. Es
la misma exigencia que hoy le hago a una aplicación o a un agente de IA antes de construirlo.

## Los equipos multidisciplinarios

<!-- seccion: equipos-multidisciplinarios -->

Coordiné equipos con funciones distintas y estrechamente dependientes: programación de
aplicadores, digitalización de respuestas y logística de materiales para más de 100
instituciones. Mi función era conectar sus capacidades, distribuir el trabajo, anticipar
restricciones y conseguir que cada equipo entendiera cómo su resultado afectaba a los demás.

Lideré con claridad y visibilidad. El seguimiento funcionaba mejor cuando hacía visible el
sistema y no cuando servía para vigilar a las personas: al compartir prioridades, cargas, avances
y bloqueos, los equipos se coordinaban solos y reconocían cómo una dificultad local afectaba el
resultado global. Mi trabajo era dar contexto, eliminar ambigüedades e intervenir a tiempo.

Trabajar con resultados de evaluación me obligó además a definir quién consultaba qué y para qué
antes de construir el reporte. El permiso no era un trámite posterior; era parte del diseño del
proceso. Fue mi primer contacto con lo que después llamaría gobierno de datos.

## Lo que dejó Ceinfes

<!-- seccion: lo-que-dejo -->

En Ceinfes aprendí a dirigir una operación como un sistema de flujos interdependientes: coordiné
personas, recursos, materiales e información; construí KPIs para observar el flujo; balanceé la
línea de digitalización; convertí resultados operativos en conversaciones con la junta
directiva; y llevé la gestión a procesos explícitos con Scrum y Kanban.

Inglopres me enseñó a estructurar una operación. Ceinfes me enseñó a dirigirla con información.
