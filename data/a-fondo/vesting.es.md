---
slug: vesting
titulo: "Vesting — la plataforma de datos para agentes de IA (2023–2025)"
resumen: "Microsoft Fabric desde cero para una startup de agentes: 12 clientes, 27 agentes en inventario y 23 vigilados a la vez en tiempo real, 1.000 eventos por día, 20 GB y 120 tablas, gobernanza por cliente y un proceso core de 11 etapas para diseñar e implementar agentes."
estado: borrador
ancla: "/proyectos/vesting"
actualizado: 2026-09-20
preguntas_de_prueba:
  - "¿Cómo diseñó Henry el ecosistema de datos de Vesting?"
  - "¿Qué es el proceso core replicable de agentes?"
  - "¿Cómo monitorea un agente de IA en producción?"
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

## Una startup de agentes sin una plataforma común para sus datos

<!-- seccion: una-startup-sin-plataforma -->

Entré a **Vesting en agosto de 2023** como Líder de Estrategia de Datos y estuve hasta enero de
2025: **dieciocho meses**. Vesting es una **startup** que desarrolla agentes de automatización para
sus clientes, y crecía sin infraestructura de datos: la analítica de sus agentes no tenía dónde
vivir y cada integración de datos de un cliente era artesanal.

El reto tenía una naturaleza distinta a todo lo anterior. Ya no se analizaba un proceso ejecutado
por personas o registrado por una aplicación empresarial: los agentes generaban eventos mientras
interactuaban con personas, sistemas y herramientas, y cada uno traía sus propias estructuras. Sin
una base compartida, cada nueva solución era una excepción.

Mi responsabilidad fue el diseño, **desde cero**, del **ecosistema de datos** de Vesting, la
estrategia y la plataforma: integrar esa
información, fijar estructuras comunes y construir la base analítica para monitorear los agentes,
con gobernanza desde el día uno y sin frenar a la startup. La tensión de fondo era velocidad
contra sostenibilidad: distinguir qué debía ser común —eventos fundamentales, identificadores,
estados, métricas— y qué podía quedar configurable por cliente o por agente.

## Qué hice en Vesting: el tamaño de lo construido

<!-- seccion: el-tamano-de-lo-construido -->

Las cifras del ecosistema al cierre de la etapa:

| Qué                                   | Cuánto                                          |
| ------------------------------------- | ----------------------------------------------- |
| Clientes integrados a la plataforma   | **12**                                          |
| Agentes en el inventario              | **27**, construidos con el proceso core         |
| Agentes bajo vigilancia a la vez      | **23**                                          |
| Eventos                               | **1.000 por día**                               |
| Volumen                               | **20 GB**                                       |
| Tablas del modelo                     | **120**                                         |
| Monitoreo                             | **en tiempo real**                              |

De cada agente se capturaba lo mismo, con la misma estructura: **sesiones, solicitudes,
respuestas, tiempos, estados y costo en tokens**. La sesión era la unidad de análisis: un evento
aislado señala una falla; la secuencia completa explica cómo evolucionó una interacción, dónde se
desvió y qué costó.

## La arquitectura de datos en Microsoft Fabric

<!-- seccion: la-arquitectura -->

Diseñé e implementé en **Microsoft Fabric** el ecosistema de datos completo: **Big Data**, **Data
Warehouse** y **procesamiento distribuido** sobre un **lakehouse**, con pipelines que recibían la
información de las integraciones de los agentes —n8n entre ellas—, validaban su estructura,
conservaban los identificadores de contexto y la transformaban en entidades analíticas.

La arquitectura respondía a dos necesidades a la vez. La histórica: conservar los eventos para
analizar tendencias, reconstruir sesiones y comparar agentes en el tiempo. La operacional:
información lo bastante oportuna para intervenir mientras todavía se podía.

La **normalización temprana** fue la decisión clave. Aunque los agentes tenían propósitos
distintos, compartían lo observable —interacciones, sesiones, tiempos, estados, respuestas,
errores, recursos—, y una estructura común desde el ingreso permitía comparar, validar y agregar
sin reescribir cada análisis. El detalle se conservaba sin deteriorar la consulta: eventos para
explicar, agregados para observar.

**Power BI** era la capa de consumo: modelos semánticos que convertían eventos técnicos en
conceptos —agentes, clientes, sesiones, periodos, resultados— con una **combinación de modos de almacenamiento** —Direct Lake, importación y DirectQuery—
elegida por el uso de cada modelo. Cómo se decide eso está en el documento de Fabric.

## Gobernanza desde el diseño

<!-- seccion: la-gobernanza -->

La plataforma integraba información de **12 clientes** distintos. Esperar al final para resolver
propiedad, permisos y trazabilidad habría convertido la plataforma en un riesgo. La gobernanza
fue una propiedad de la arquitectura, no una revisión posterior.

El aislamiento entre clientes se resolvió con **workspaces separados**: cada cliente con su
espacio, sus permisos y sus modelos, sobre estructuras de eventos comunes. La estandarización de
los eventos cumplía además una función de gobierno: validar la información desde el ingreso,
identificar campos obligatorios y hacer visibles las excepciones cuando una integración no
cumplía el contrato.

Las transformaciones eran comprensibles y reproducibles: una métrica sobre el desempeño de un
agente conservaba una relación clara con los eventos que la calculaban, indispensable para
investigar un comportamiento o explicar un resultado a un cliente. Y no toda la información tenía
la misma naturaleza: un evento técnico, un dato de un usuario, una respuesta generada y una
acción ejecutada requerían tratamientos distintos. Las tres experiencias de gobierno, comparadas,
están en el documento de gobierno de datos y de IA.

## Monitorear agentes de inteligencia artificial en producción

<!-- seccion: monitoreo-de-agentes -->

Construí el **monitoreo en tiempo real** de los agentes en producción: **23 a la vez** en el punto
más alto. La observabilidad tenía que responder algo más profundo que «¿está disponible?»:
qué solicitud recibió cada agente, con qué contexto, qué respondió, cuánto tardó, qué costó y en
qué estado terminó.

| Dimensión   | Qué se medía                                             | Para qué decisión                                  |
| ----------- | -------------------------------------------------------- | -------------------------------------------------- |
| Operativa   | disponibilidad, volumen, errores, tiempos de respuesta   | intervenir antes de que el cliente lo note         |
| Uso         | distribución por agente, cliente, periodo y tipo de tarea | dónde crece la demanda y dónde no                  |
| Económica   | costo en tokens por sesión y por agente                  | qué agente cuesta más de lo que resuelve           |
| Funcional   | estados finales y sesiones que necesitaron intervención  | dónde el agente responde pero no resuelve          |

Las métricas técnicas prueban que el agente respondió; no que la respuesta sirvió. Por eso los
tableros operativos, para producto y operaciones, permitían recorrer una anomalía hasta los
eventos de la sesión. Un agente disponible puede responder mal; uno preciso puede ser demasiado
lento; una respuesta útil puede costar demasiado. El monitoreo tenía que ver las cuatro cosas.

Esta experiencia cambió mi idea de la inteligencia de negocios: el tablero ya no describía solo
procesos ejecutados por personas; observaba sistemas inteligentes que participaban en ellos.

## El proceso core para diseñar e implementar agentes

<!-- seccion: el-proceso-core -->

Además del ecosistema, estructuré, documenté y validé el **proceso core** con el que se
diseñaron e implementaron los **27 agentes** del inventario. El activo no era un agente: era la
capacidad de construir el siguiente con más claridad, consistencia y control. Once etapas:

1. **Caso de uso**: qué problema se resuelve y qué acción habilita.
2. **Usuarios y decisión**: quién lo usa y qué decide con él.
3. **Especificación funcional**: cada actividad con entradas, reglas, salidas y criterios verificables.
4. **Fuentes autorizadas y herramientas**: qué puede consultar y qué puede usar.
5. **Nivel de autonomía**: consultar, recomendar o ejecutar, y bajo qué condiciones.
6. **Excepciones**: qué hace cuando falta información, hay contradicción o el caso es ambiguo.
7. **Validación técnica**: integraciones, fuentes, estructura de las salidas.
8. **Validación de negocio**: el resultado corresponde a lo que la operación necesita.
9. **Definición de terminado**: acordada antes, no demostrada después.
10. **Adopción e interacción**: qué puede hacer, qué información usa, cuándo pide validación humana; ni confianza automática ni rechazo preventivo.
11. **Operación observable**: el agente sigue medido y el uso alimenta la siguiente versión.

Aquí se nota el ingeniero industrial: definir, documentar y validar un proceso central es
exactamente lo que hacía en una planta, solo que el proceso ahora produce agentes. Una solución
resuelve un caso; una capacidad permite resolver los siguientes con procesos, criterios y
componentes que la organización ya entiende. El método, generalizado, está en el documento de
agentes en producción.

## Por qué salí de Vesting, y el puente que esta experiencia construyó

<!-- seccion: el-puente -->

Vesting es el punto donde mis dos mitades se juntan: la ingeniería de analítica —lo que certifica
el **DP-600**, que obtuve en diciembre de 2024, mientras estaba en este rol y construía sobre
Fabric lo que la certificación describe— y la ingeniería de IA. Por primera vez el objeto de
observación de una plataforma de datos no eran personas ni procesos sino sistemas que también
recomiendan y ejecutan.

Salí de Vesting en enero de 2025 y cerré la etapa al dejar el ecosistema y el proceso documentados: una plataforma
de datos operativa, la base analítica para el monitoreo y un proceso con el que la startup podía
construir el siguiente agente sin mí. Cuanto más cerca está una solución de actuar, más
trazabilidad exigen sus datos, su comportamiento y sus límites.
