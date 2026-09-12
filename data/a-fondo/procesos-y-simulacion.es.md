---
slug: procesos-y-simulacion
titulo: "Procesos, modelado y simulación: la raíz industrial"
resumen: "De dónde vengo técnicamente: BPMN, simulación, ISO 9001 y por qué eso me hace mejor con datos."
estado: borrador
ancla: "#skills"
actualizado: 2026-09-12
preguntas_de_prueba:
  - "¿Qué sabe Henry de modelado de procesos y simulación?"
  - "¿Cómo le sirve la ingeniería industrial en un rol de datos?"
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

Soy ingeniero industrial de la Javeriana con énfasis en Inteligencia Analítica de Datos, y estudié
también Diseño Industrial. Mi formación es de procesos, optimización y soporte a la decisión antes
que de software.

Esa raíz es la que más me diferencia en una sala llena de perfiles de datos, y es la que menos se ve
en una lista de herramientas. Casi todo lo que hago bien viene de ahí.

## Modelar un proceso antes de tocar el dato

<!-- seccion: modelar-antes -->

Mi hoja de vida declara **Bizagi** para modelado de procesos y **FlexSim** para simulación. Son
herramientas de ingeniería industrial y explican de dónde salen dos costumbres mías.

La primera: antes de construir nada, dibujo el proceso. Quién hace qué, con qué entra y con qué sale
cada actividad, dónde espera y dónde se pierde información. Un tablero sobre un proceso que nadie
entendió es un tablero que nadie usa.

La segunda: el diagrama se **genera desde los datos**, no se dibuja a mano. Uno dibujado a mano
envejece el día que el proceso cambia; uno generado desde su definición cambia con él. En este mismo
sitio, los diagramas de proceso de las fichas de la vitrina se generan en notación estándar desde un
motor que lee la definición — no hay una sola figura dibujada a mano.

[CONFIRMAR: ¿dónde usaste Bizagi y FlexSim, y para qué? ¿En la carrera, en Inglopres, en Cafam? Hoy
están en tu lista de competencias sin un solo uso asociado — y además **no aparecen en las skills
que publica el sitio**, así que un visitante no sabe que las conoces. Está en el informe de
discrepancias.]

## La simulación como forma de pensar

<!-- seccion: la-simulacion -->

Simular es aceptar que un sistema con variabilidad no se entiende con un promedio. Una operación
logística, una línea de producción o una flota de buses no se comportan como su caso medio: se
comportan como su distribución, y los problemas viven en las colas.

Esa forma de pensar la uso todavía, aunque hace años que no abro un simulador. Es la que hace que
desconfíe de un indicador promedio sin su dispersión, y la que me hace preguntar por el caso peor
antes que por el típico.

## ISO 9001 y la costumbre del rastro escrito

<!-- seccion: iso-9001 -->

En Inglopres aseguré el cumplimiento de la norma ISO 9001:2015 en la cadena de suministro. Bajo esa
norma no basta con que el proceso funcione: hay que poder demostrar cómo se controla, quién responde
y con qué evidencia.

Fue mi primera escuela de rigor documental y se quedó conmigo. Es la misma idea que hoy me hace
registrar las decisiones de arquitectura de cada aplicación, exigir que cada control se haya visto
fallar al menos una vez, y pedirle a cada agente que cite su fuente o declare el vacío. La norma
cambió de número —de la 9001 a la 42001— pero la exigencia es idéntica: demuéstralo.

## Por qué esto me hace mejor con datos

<!-- seccion: por-que-me-hace-mejor -->

Tres razones concretas.

**Sé qué medir.** Un indicador sale de entender el proceso, no del catálogo de campos disponibles. La
diferencia entre medir lo que importa y medir lo que está a mano se decide antes de abrir la
herramienta.

**Sé por qué falla la adopción.** Casi siempre porque el tablero no encaja en el proceso de trabajo
de quien debería usarlo.

**Sé construir procesos, no solo entregables.** El proceso core replicable de agentes que definí en
Vesting es un entregable de ingeniero industrial, no de ingeniero de datos: el valor no era cada
agente, era que el siguiente se construyera igual.

## Las preguntas que me quedaron pendientes

<!-- seccion: preguntas-pendientes -->

De aquellos años me quedaron preguntas que no supe responder entonces y que hoy investigo en serio.
Tres de las siete investigaciones que publico salen directamente de ahí: la asignación de conductor
y bus cuando el vehículo puede fallar, el control de los convoyes de buses, y los suplementos por
fatiga en el balanceo de línea — esta última sobre una tabla que gobierna la práctica de la
ingeniería industrial y que, según mi revisión, no tiene una síntesis citable.

Es la misma raíz, quince años después, con mejores herramientas.
