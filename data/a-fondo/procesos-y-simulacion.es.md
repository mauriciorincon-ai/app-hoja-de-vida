---
slug: procesos-y-simulacion
titulo: "Procesos y simulación"
resumen: "La raíz industrial con sus métodos: BPMN con Bizagi en cuatro empresas, simulación de eventos discretos con FlexSim en Inglopres y el despacho de medicamentos de Cafam, capacidad nominal frente a efectiva, estudio de tiempos con suplementos OIT, Kanban y Scrum, ISO 9001, y el proceso replicable de Vesting."
estado: borrador
ancla: "#skills"
actualizado: 2026-09-20
preguntas_de_prueba:
  - "¿Qué sabe Henry de modelado de procesos y simulación?"
  - "¿Ha usado Bizagi o FlexSim?"
  - "¿Sabe modelar procesos en BPMN?"
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

## La raíz que no se ve en una lista de tecnologías

<!-- seccion: la-raiz -->

Soy Ingeniero Industrial de la Pontificia Universidad Javeriana, con énfasis en Inteligencia
Analítica de Datos, y cursé también Diseño Industrial. Antes de las plataformas de datos, Power
BI y los agentes, aprendí a comprender procesos, modelar sistemas, analizar restricciones y
distribuir recursos alrededor de las personas que ejecutan el trabajo.

Esa raíz explica cómo empiezo cualquier problema de datos: no por la tabla ni por el modelo, sino
por el sistema que produce la información —quién interviene, qué entradas necesita, qué genera,
dónde aparecen esperas, errores o pérdidas—. El resultado de una organización depende menos del
desempeño de cada parte que de las relaciones entre ellas: un área puede cumplir su meta y
perjudicar el flujo; una actividad eficiente aislada puede ser la restricción del sistema. Y
decido **qué medir antes de mirar el catálogo de campos**: en Inglopres descubrí que no podía
mejorar los procesos porque nadie generaba el dato, y la solución empezó por diseñar cómo
capturarlo.

## Bizagi en la práctica: modelar el proceso en BPMN

<!-- seccion: bizagi-en-la-practica -->

Con **Bizagi** modelo procesos en **BPMN**: actividades, decisiones, responsables, eventos, entradas,
resultados y transferencias entre áreas. Su valor no es el diagrama: es un lenguaje común para
contrastar cómo debería funcionar una operación con cómo se ejecuta, y convertir conocimiento
repartido entre personas, sistemas y procedimientos en algo que se puede discutir y mejorar. Lo
he usado en cuatro empresas:

- **Inglopres** (2016): la operación de alquiler de maquinaria —comercial, disponibilidad,
  mantenimiento, logística— traducida a actividades, estados y reglas que el ERP pudiera
  representar.
- **Ceinfes** (2017): las dependencias entre programación de aplicadores, preparación y
  distribución de material, aplicación, recepción y digitalización, cada frente con su ventana de
  tiempo.
- **Cafam** (2020): recepción, almacenamiento, alistamiento y despacho, contrastados con el
  comportamiento esperado del WMS antes de las pruebas y la parametrización.
- **Banco Pichincha** (2023): los productos analíticos situados en las actividades y decisiones
  que debían respaldar.

En este sitio el principio está automatizado: el BPMN de cada pieza de la vitrina se genera desde
su definición, para que el diagrama no envejezca cuando el proceso cambia.

## FlexSim en la práctica: simular antes de intervenir

<!-- seccion: flexsim-en-la-practica -->

Un diagrama muestra la secuencia; no dice qué pasa cuando la demanda varía, los tiempos tienen
dispersión, los recursos compiten o una etapa produce más rápido de lo que absorbe la siguiente.
Para eso uso **simulación de eventos discretos** con **FlexSim**: entidades que recorren el
proceso, recursos con capacidad limitada, tiempos variables, colas, prioridades y reglas de
asignación.

Lo usé en **Inglopres**, para comparar alternativas de la operación de alquiler antes de
cambiarla, y en **Cafam**, donde el modelo más grande que he construido representó el **despacho
de medicamentos** del centro de distribución: cómo interactuaban recepción, ubicación, alistamiento
y despacho bajo la lógica del nuevo WMS, y dónde una regla razonable en una actividad producía
esperas o congestión en otra.

La simulación no predice sola: sus resultados valen lo que valen los datos, las distribuciones y
la fidelidad del modelo. Por eso separo **verificación** —el modelo ejecuta la lógica con la que se
construyó— de **validación** —esa lógica representa el sistema real para el propósito del
análisis—, y comparo escenarios en vez de producir una respuesta única: cambio demanda,
capacidad, asignación o prioridades y observo utilización, tiempo de ciclo, inventario en
proceso, longitud de colas, *throughput* y nivel de servicio.

## Capacidad nominal, capacidad efectiva y la variabilidad

<!-- seccion: capacidad-y-variabilidad -->

Lo que más me enseñó la simulación es la diferencia entre **capacidad nominal** —lo que se
procesa en condiciones ideales— y **capacidad efectiva**, que incorpora variabilidad, pausas,
disponibilidad, errores, reprocesos y desplazamientos. Diseñar con promedios produce una capacidad que cuadra en el cálculo y falla contra la
distribución real de la demanda: en el despacho de Cafam, la cola no estaba donde el promedio
decía.

De ahí una forma de pensar que aplico fuera de las plantas: no pregunto cuánto tarda un proceso
en promedio sino cómo se distribuyen sus tiempos, qué pasa en los picos, qué recurso limita, cómo
se propaga una demora y qué tan sensible es el resultado a sus supuestos. Y distingo una mejora
local de una sistémica: acelerar una actividad puede acumular inventario en la siguiente; subir
la utilización de un recurso puede quitar capacidad de respuesta; eliminar una espera puede
mover la congestión sin bajar el tiempo total.

Hoy lo aplico a un indicador —su distribución, no su promedio—, a un modelo predictivo —dónde se
concentra el error— y a un agente de IA —qué entradas ambiguas producen resultados difíciles de
detectar—. Los sistemas se diseñan para la realidad que varía, no para un promedio que rara vez
ocurre.

## El estudio del trabajo, el balanceo y lo ágil

<!-- seccion: estudio-del-trabajo -->

Tres métodos más de la disciplina que he aplicado con nombre y apellido. El **estudio de
tiempos** en Inglopres: cronometraje, valoración del ritmo, tiempo estándar y **suplementos por
fatiga** tomados de la tabla de la OIT, porque un tiempo observado no es un estándar hasta que
reconoce el esfuerzo de quien lo ejecuta. El **balanceo de líneas** en Ceinfes: la digitalización
de 250 hojas por jornada tratada como una línea con estaciones, un cuello de botella y capacidad
efectiva, en el vocabulario de la teoría de restricciones. Y los métodos **lean** y ágiles con el
área de tecnología de Ceinfes: **Kanban** —un sistema de tirón con límite al trabajo en curso— para
el flujo de solicitudes y **Scrum** por sprints para los proyectos.

Los tres resuelven lo mismo con distinta escala: que el ritmo lo fije la capacidad real del
sistema y no la aspiración del cronograma.

## ISO 9001 y la documentación: la disciplina del rastro escrito

<!-- seccion: iso-9001 -->

En Inglopres trabajé el aseguramiento de calidad bajo **ISO 9001:2015** en la cadena de
suministro, mi primera escuela formal de trazabilidad: no basta afirmar que el proceso funciona;
hay que establecer qué resultado se espera, cómo se controla, quién responde, qué evidencia se
conserva y qué pasa ante una desviación.

Esa disciplina cambió cómo documento, y hoy la aplico a la arquitectura de datos —una
transformación conserva su propósito, una medida tiene definición, un cambio tiene razón—, a mis
aplicaciones y agentes —decisiones en ADR, controles que se demuestran fallando, salidas
validadas—, y a la IA: una afirmación se relaciona con su evidencia o el sistema declara el vacío.

ISO 9001 e ISO/IEC 42001 no son la misma norma ni una evolución de numeración: gobiernan objetos
distintos. Comparten la estructura de los sistemas de gestión —contexto, responsabilidades,
riesgos, información documentada, evaluación, mejora—, y esa estructura, aprendida en 2016, es la
que reconocí al asumir el gobierno de la IA en 2025.

## Construir procesos, no solamente entregables

<!-- seccion: construir-procesos -->

Una solución individual genera valor; un proceso replicable construye capacidad. En Vesting no me
limité a participar en la creación de agentes: definí, documenté y validé el proceso core de once
etapas con el que se construyeron 27, para que cada implementación aprovechara lo aprendido en
las anteriores. Estandarizar no era hacer agentes iguales: era compartir cómo entender el
problema, especificar, construir, validar, desplegar y observar, dejando libres fuentes,
herramientas y reglas.

El mismo enfoque gobierna mi pipeline: prioridad y visión antes de avanzar, un resumen por
ciclo, salidas validadas, controles que fallan antes de confiarse, IA solo con justificación. Es
ingeniería industrial: el valor no está en producir la siguiente unidad sino en mejorar el
sistema que producirá todas las siguientes. No busco que una organización dependa de mí: busco
dejar estándares, memoria, componentes y criterios sobre los que otros sigan construyendo.

## Las preguntas que permanecieron abiertas

<!-- seccion: preguntas-pendientes -->

Algunas de las preguntas que hoy trabajo con más rigor nacieron en los primeros empleos, cuando
podía reconocer el problema pero no tenía los datos, el tiempo o las herramientas para
resolverlo. En TransMilenio: cómo asignar conductores, vehículos y rutas bajo disponibilidad,
demanda, tipología y fallas, cuando tratarlos como listas separadas produce combinaciones válidas
una a una y deficientes en conjunto; y qué política de control de intervalo corrige el
apelotonamiento de buses sin mover el problema a otra parte. En digitalización y procesos
productivos: qué suplemento por fatiga corresponde a cada esfuerzo, repetitividad, ambiente y
altitud, en vez de un porcentaje general.

Hoy las abordo con revisión sistemática, modelado, optimización, simulación y escenarios
sintéticos en las investigaciones de mi vitrina, y distingo al comunicarlas entre una línea de
investigación, un modelo validado con datos sintéticos, una conclusión sostenida en literatura y
una intervención demostrada en operación. Son problemas industriales de siempre —asignar,
balancear, controlar— con herramientas que la trayectoria me permitió construir después.
