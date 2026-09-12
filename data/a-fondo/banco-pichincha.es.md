---
slug: banco-pichincha
titulo: "Banco Pichincha — BI que el negocio sí usa (2023)"
resumen: "La adopción como el problema difícil del BI, y el gobierno de datos del banco."
estado: borrador
ancla: "/proyectos/banco-pichincha"
actualizado: 2026-09-12
preguntas_de_prueba:
  - "¿Qué hizo Henry en Banco Pichincha?"
  - "¿Cómo logra que el negocio use los tableros?"
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
Cómo lograste la adopción (el problema difícil de BI), qué hiciste
distinto con los dashboards, el programa de formación, los modelos
predictivos en producción. -->

## El problema real no era técnico

<!-- seccion: el-problema-real -->

Entré a Banco Pichincha en marzo de 2023 como Analista Senior de Analítica y Reportes, y estuve
hasta julio de 2023. El área producía tableros que el negocio no terminaba de adoptar, con procesos
de extracción lentos y modelos predictivos que no llegaban a producción.

Es el patrón clásico de la inteligencia de negocios: el problema no es construir, es que se use. Un
tablero que nadie abre cuesta lo mismo que uno que todos abren.

## La adopción, medida

<!-- seccion: la-adopcion-medida -->

Lideré un equipo de inteligencia de negocios en el desarrollo de dashboards adoptados por más de
cincuenta usuarios, con una mejora del veinticinco por ciento en la toma de decisiones.

Lo que cambió no fue la herramienta: fue diseñar cada tablero contra la decisión concreta que
alguien tenía que tomar. Cuando el tablero responde una pregunta que la persona ya se estaba
haciendo, la adopción deja de ser un problema de convencimiento.

## El programa de formación

<!-- seccion: programa-de-formacion -->

Diseñé un programa de formación en analítica que mejoró la productividad operativa en un veinte por
ciento. Va de la mano con lo anterior: la adopción tiene dos mitades, y la segunda es que la gente
sepa leer lo que está mirando.

Es también lo que más se olvida al presupuestar un proyecto de datos. La formación no es un extra
al final; es parte del entregable.

[CONFIRMAR: ¿a cuántas personas formaste y en qué (lectura de tableros, DAX, modelado)? Con eso,
esta subsección pasa de «diseñé un programa» a algo que se puede dimensionar.]

## El ETL y los modelos semánticos

<!-- seccion: etl-y-modelos-semanticos -->

Implementé soluciones avanzadas de extracción, transformación y carga que redujeron los tiempos en
un treinta y cinco por ciento, y centralicé y optimicé el análisis de datos con DAX Studio y
Tabular Editor.

[CONFIRMAR — hay dos cosas que solo tú puedes resolver, y el informe de discrepancias del sprint las
detalla. Primera: tu hoja de vida dice que el treinta y cinco por ciento es de tiempos de
**procesamiento**, y el sitio publica «tiempos de **análisis**». No es lo mismo. Segunda: el sitio
dice que optimizabas «modelos semánticos» y tu hoja de vida dice «el análisis de datos». Es muy
probablemente cierto —para eso sirven DAX Studio y Tabular Editor— pero lo afirma el sitio, no tú.]

## Los modelos predictivos en producción

<!-- seccion: modelos-en-produccion -->

Desarrollé modelos de aprendizaje automático con scikit-learn, con una precisión superior al noventa
por ciento y una mejora del treinta y cinco por ciento en las predicciones.

«En producción» es la parte que importa. La diferencia entre un modelo de cuaderno y un modelo en
producción es todo lo que hay alrededor: de dónde salen los datos cada día, qué pasa cuando faltan,
quién mira el resultado y qué decide con él.

[CONFIRMAR: ¿qué predecían esos modelos? En banca puede ser riesgo, fuga de clientes, propensión,
mora… No lo voy a suponer. Si hay un límite de confidencialidad, se puede decir la familia del
problema sin el detalle.]

## El gobierno de datos

<!-- seccion: gobierno-de-datos -->

Co-lideré el desarrollo de un sistema de gobernanza que mejoró la seguridad, la calidad y la
confiabilidad en la gestión de información crítica.

En un banco, el gobierno de datos no es una buena práctica: es una condición de operación. Esta es
la primera de las tres veces que he hecho gobierno de datos —las otras dos son Vesting y la
Fundación CTIC— y es la que más me enseñó sobre el lado de seguridad y control de acceso.

La palabra «co-lideré» es literal y la mantengo: el sistema fue de un equipo, no mío.
