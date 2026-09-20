---
slug: inglopres
titulo: "Inglopres — Ingeniero de Procesos (2016–2017)"
resumen: "Mi primer empleo: un ERP (Odoo), las bases de datos que no existían, el estudio del trabajo y un equipo de doce personas con 95 % de satisfacción."
estado: borrador
ancla: "#trayectoria"
actualizado: 2026-09-19
preguntas_de_prueba:
  - "¿Qué hizo Henry en Inglopres?"
  - "¿Ha liderado la implementación de un ERP?"
  - "¿Cuál fue su primer empleo al salir de la universidad?"
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
El detalle que no cabe en el timeline: cómo era la operación, qué
hacías día a día con el ERP y la cadena de suministro, anécdotas del equipo
de 12 personas, qué aprendiste. -->

## La operación y el encargo

<!-- seccion: la-operacion -->

Entré a **Inglopres en agosto de 2016**, recién egresado de Ingeniería Industrial de la
Pontificia Universidad Javeriana. Fue mi primer empleo, como Ingeniero de Procesos, y estuve
hasta junio de 2017.

Inglopres alquilaba, compraba y vendía maquinaria pesada para empresas y clientes individuales,
con un parque de unas **120 unidades entre máquinas y vehículos**. Era una operación intensiva
en activos: cada venta o alquiler dependía de qué máquina estaba
disponible, en qué estado, en qué obra y con qué mantenimiento pendiente. La pregunta del
negocio no era comercial antes que operativa. Era la misma pregunta.

Mi encargo fue entender esa operación de extremo a extremo e integrarla. En la práctica eso
significó cuatro cosas: mapear cómo se conectaban las áreas, seguir por dónde circulaba la
información, ubicar dónde aparecían esperas y reprocesos, y proponer los controles que faltaban.

## El ERP: integrar lo que estaba suelto

<!-- seccion: el-erp -->

Lideré la implementación de un **ERP —Odoo—**, el sistema de planificación de recursos
empresariales con el que Inglopres pasó de registros dispersos a un solo lugar. El
objetivo declarado era aumentar la eficiencia operativa y la consistencia del servicio; el
objetivo real, más difícil, era que las áreas compartieran una misma versión de la operación.
Con el ERP en marcha, la operación ganó del orden de un 20 % en eficiencia: menos reprocesos
entre áreas y menos tiempo entre el pedido del cliente y la máquina en obra.

Antes de configurar un solo módulo hubo que separar dos cosas que la organización daba por
iguales: **el proceso definido y el proceso ejecutado**. Levanté el segundo preguntando y
observando, no leyendo manuales, y lo modelé en **BPMN con Bizagi**, con sus actividades, sus
decisiones y sus excepciones; con **FlexSim** simulé la operación para comparar alternativas
antes de cambiarla. Ese dibujo fue lo que el ERP pudo representar; sin él, la herramienta habría
copiado el desorden con otra interfaz.

El trabajo que más pesó ocurrió antes de la primera pantalla: acordar qué significaba cada dato,
quién respondía por producirlo, qué reglas lo transformaban y en qué momento del proceso podía
usarse. Aprendí ahí que un ERP no integra una organización. Integra lo que la organización ya
acordó, y expone lo que no.

## Las bases de datos que no existían

<!-- seccion: las-bases-de-datos -->

Para evaluar los procesos necesitaba indicadores, y descubrí que la mitad de la información no
existía: no se capturaba, o vivía repartida en registros que nadie cruzaba. Me habían pedido
mejorar la operación y no podía medirla.

El ERP tenía su propia base de datos; lo que faltaba era la del análisis. Diseñé e implementé
en **SQLite** las estructuras para organizar los eventos operativos, cruzarlos y hacer
seguimiento a las métricas del negocio. Definí las
entidades, sus relaciones y las reglas que preservaban el significado de cada campo, y las
consulté en **SQL** para producir los análisis. Ese fue el punto donde mi trayectoria giró hacia
los datos, y no fue una decisión de carrera: fue lo que el problema exigía.

El caso que mejor lo explica es la **disponibilidad de una máquina**. No basta con que esté en
el inventario. Hay que representar su estado operativo, su ubicación, su programación, su
utilización y su condición de mantenimiento; si falta una de las cinco, el indicador miente
justo cuando el comercial lo necesita. La calidad del análisis dependía de la fidelidad con que
los datos describieran la operación, no de la herramienta que los mostrara.

Aprendí que un indicador confiable no empieza en el reporte. Empieza en la definición del
proceso y en la captura de sus eventos.

## El estudio del trabajo: tiempos y suplementos por fatiga

<!-- seccion: el-estudio-del-trabajo -->

Medir la operación me obligó a medir también el trabajo humano que la ejecutaba. Hice **estudio
de tiempos** sobre las actividades repetitivas de Inglopres: cronometraje, valoración del ritmo
y cálculo del tiempo estándar.

La parte que un cronómetro no resuelve son los **suplementos por fatiga** —las *allowances* del
estudio del trabajo—. Un tiempo observado no es un estándar: hay que añadirle el suplemento —tomado de la tabla de
la **OIT**— que reconoce el esfuerzo, la repetitividad, las condiciones de ejecución y la variabilidad propia de
una persona. Sin ese suplemento, el estándar se cumple una semana y se incumple el resto del
año, y la culpa recae sobre quien ejecuta en vez de sobre quien midió.

De ahí salió un criterio que sigo usando: **una mejora en velocidad no es una mejora**. Puede
producir más errores, aumentar el reproceso o trasladar la carga a otra parte del sistema.
Optimizar es encontrar el equilibrio sostenible entre capacidad, calidad, costo, servicio y
condiciones de trabajo, y eso exige mirar los cinco a la vez.

Es el mismo problema que años después convertí en una línea de investigación propia sobre
suplementos por fatiga y balanceo de líneas.

## Cadena de suministro e ISO 9001

<!-- seccion: cadena-e-iso -->

Lideré iniciativas de optimización de la **cadena de suministro** para reducir costos operativos
y coordinar mejor los recursos. En una operación de maquinaria pesada eso se juega en tres
variables: el **tiempo de respuesta** desde que un cliente pide hasta que el equipo está en
obra, el **nivel de servicio** que la empresa logra sostener, y la **disponibilidad** del parque,
que depende del mantenimiento tanto como de la programación.

Ese trabajo tenía que cumplir además los requisitos de **ISO 9001:2015**, y fue mi primera
escuela formal de rigor documental. No bastaba con que un proceso funcionara: había que definir
cómo debía funcionar, quién respondía por cada actividad, qué controles se aplicaban y qué
evidencia demostraba el cumplimiento.

De ahí salió el hábito que no he soltado: **lo hecho deja rastro escrito**. La calidad no puede
depender de que alguien recuerde cómo se hacía. Tiene que poder comprenderse, verificarse y
repetirse sin esa persona delante.

## El equipo de doce y el 95 %

<!-- seccion: el-equipo-de-doce -->

Lideré un equipo de **doce personas**, operarios y técnicos. Con asignación explícita de
responsabilidades y seguimiento de los compromisos, la operación alcanzó una **tasa de
satisfacción del cliente del 95 %**, medida en encuesta a los clientes.

El resultado no vino de más control. Vino de definir mejor el trabajo: qué resultado se espera,
quién responde, con qué información se cuenta y qué significa que algo esté terminado. Cuando
esas cuatro están claras, la supervisión deja de ser el mecanismo y pasa a serlo la coordinación.

Fue mi primera lección de que liderar es **reducir ambigüedad**, no vigilar actividad. Y la
segunda, que una operación no mejora de forma sostenible si el conocimiento vive en una sola
cabeza: los procesos, los criterios y los controles tienen que quedar lo bastante claros para
que el equipo los ejecute, los discuta y los mejore.

## Lo que dejó este primer trabajo

<!-- seccion: lo-que-dejo -->

Inglopres reunió, en once meses, los fundamentos de todo lo que construí después: entender una
operación como sistema, traducir procesos en estructuras de información, integrar áreas con
tecnología, medir sin descontextualizar y liderar desde la claridad.

Todavía no hablaba de modelos semánticos ni de plataformas analíticas. Pero el problema que
resolvía en 2016 —que la decisión necesitaba un dato que nadie había construido— es exactamente
el mismo que resuelvo hoy, con otras herramientas y otra escala.
