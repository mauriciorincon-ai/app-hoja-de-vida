---
slug: vesting
titulo: "Vesting — la plataforma de datos para agentes de IA (2023–2025)"
resumen: "Microsoft Fabric desde cero, el monitoreo de agentes en producción y el proceso core replicable."
estado: borrador
ancla: "/proyectos/vesting"
actualizado: 2026-09-12
preguntas_de_prueba:
  - "¿Cómo diseñó Henry el ecosistema de datos de Vesting?"
  - "¿Qué es el proceso core replicable de agentes?"
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
Tu historia estrella: cómo se diseña un ecosistema de datos desde
cero en Microsoft Fabric, decisiones de arquitectura y por qué, cómo se
monitorea un agente de IA en producción, qué es el proceso core replicable. -->

## Una startup de agentes sin dónde vivir sus datos

<!-- seccion: el-contexto -->

Entré a Vesting en agosto de 2023 como Líder de Estrategia de Datos y estuve hasta enero de 2025.
Vesting es una startup de agentes de automatización, y crecía sin infraestructura de datos: la
analítica de sus agentes de IA no tenía dónde vivir y cada integración de datos de clientes era
artesanal.

El encargo era el más abierto que he recibido: construir el ecosistema entero desde cero, capaz de
sostener la analítica y el monitoreo de agentes en producción, con gobernanza desde el día uno y
sin frenar a una startup. Las dos últimas condiciones son las que hacen difícil el problema: sin
gobernanza se paga después, y con demasiado proceso la startup se detiene.

## La arquitectura en Microsoft Fabric

<!-- seccion: la-arquitectura -->

Diseñé e implementé desde cero el ecosistema de datos en Microsoft Fabric, integrando Big Data,
Data Warehouse y procesamiento distribuido, con las **tuberías de datos** —los *pipelines* de
ingesta y transformación que llevan la información de cada cliente al lago— corriendo solas en
lugar de una integración artesanal por cliente.

Elegir Fabric fue una decisión de plataforma, no de moda: reúne el lago, el almacén, el modelado
semántico y la capa de visualización bajo un mismo gobierno y una misma identidad. Para un equipo
pequeño, eso importa más que la elegancia de cada pieza por separado — cada frontera entre
herramientas distintas es una frontera que alguien tiene que mantener, y en una startup no hay ese
alguien.

[CONFIRMAR: ¿qué volumen manejaba el ecosistema y cuántos clientes integraba? Es la pregunta que
un entrevistador técnico hace de inmediato, y hoy no hay un solo número de tamaño en este documento.]

## La gobernanza desde el día uno

<!-- seccion: la-gobernanza -->

Implementé un modelo de gobernanza y estandarización de datos para garantizar integridad y
confiabilidad en la integración de información de clientes y sistemas.

Con datos de varios clientes en la misma plataforma, la estandarización no es limpieza: es
aislamiento y trazabilidad. Cada dato tiene que saber de quién es y quién puede verlo, y eso se
decide en el diseño o no se decide nunca. Es la segunda de las tres veces que he montado gobierno
de datos, y la primera en que lo hice desde cero en lugar de sobre algo existente.

## Monitorear agentes de IA en producción

<!-- seccion: monitoreo-de-agentes -->

Implementé sistemas de captura, almacenamiento y análisis para el monitoreo en tiempo real de
agentes de inteligencia artificial, optimizando su control.

Esta es la parte del trabajo que menos gente ha hecho y la que más se parece a lo que hoy pide el
mercado. Un agente en producción no falla como falla un proceso de extracción: no se cae, responde
distinto. Vigilarlo no es mirar si está arriba, es mirar qué está haciendo y con qué insumo, y
poder reconstruirlo después.

Ese problema —cómo se observa un agente de IA— es el mismo que me llevó a construir después, en mi
propio pipeline, una aplicación dedicada a eso: un panel que muestra qué saben los agentes sobre su
usuario. La frase con la que se presenta resume por qué me importa: tus agentes de IA lo saben todo
de ti, es hora de que tú sepas todo de ellos.

[CONFIRMAR: ¿qué se capturaba de cada agente (llamadas, latencia, costo, entradas y salidas) y en
qué se veía el monitoreo? Y ¿cuántos agentes llegaron a estar bajo vigilancia a la vez?]

## El proceso core replicable

<!-- seccion: el-proceso-core -->

Definí, documenté y validé el proceso central para diseñar e implementar agentes de IA, creando un
marco replicable para la entrega de los servicios.

Si tengo que quedarme con una sola cosa de Vesting, es esta. El valor no estaba en cada agente:
estaba en que el siguiente agente se construyera igual que el anterior, con las mismas etapas, los
mismos entregables y los mismos criterios para decir que está terminado. Eso es lo que convierte un
servicio en un producto.

Aquí se nota el ingeniero industrial: definir, documentar y validar un proceso central es
exactamente lo que hacía en una planta, solo que el proceso ahora produce agentes.

## El puente que este rol construyó

<!-- seccion: el-puente -->

Vesting es el punto donde mis dos mitades se juntan. La ingeniería de analítica —lo que certifica
el DP-600, que obtuve en noviembre de 2024, mientras estaba en este rol— y la ingeniería de IA. Un
ecosistema de datos que existe para que unos agentes funcionen y se puedan vigilar es, literalmente,
las dos cosas a la vez.

[CONFIRMAR: el rol terminó en enero de 2025. ¿Fue cierre de contrato, cambio de proyecto, o la
startup cambió de rumbo? No hace falta el detalle, pero una línea evita que la pregunta quede
abierta.]
