---
slug: plataforma-y-despliegue
titulo: "Plataforma, nube y despliegue"
resumen: "Qué domino de verdad en nube y despliegue, y cómo cubro lo que no."
estado: borrador
ancla: "#skills"
actualizado: 2026-09-12
preguntas_de_prueba:
  - "¿Qué experiencia tiene Henry con la nube?"
  - "¿Sabe Henry de contenedores, Kubernetes o Google Cloud?"
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

## Lo que domino: el mundo Microsoft

<!-- seccion: el-mundo-microsoft -->

Mi experiencia profunda de plataforma es Microsoft, y es profunda de verdad: Microsoft Fabric,
Azure Synapse, Data Factory, Lakehouse, Power BI y el modelado semántico, certificados por el DP-600
y aplicados durante año y medio construyendo el ecosistema de Vesting desde cero.

No es «he usado». Es haber diseñado la arquitectura, el gobierno y el monitoreo de una plataforma
completa que sostenía agentes de IA en producción.

## Lo que despliego con mis manos, cada semana

<!-- seccion: lo-que-despliego -->

Aparte de la plataforma de datos, mantengo seis aplicaciones publicadas y en funcionamiento. Eso
significa integración continua con controles de calidad que bloquean la publicación, pruebas
unitarias, de integración y de extremo a extremo, presupuestos de rendimiento, revisión de
accesibilidad y despliegue automático desde la rama principal.

Las cifras de esas aplicaciones son públicas y medidas: setecientas cuarenta pruebas en Velo con un
noventa y seis por ciento de cobertura, seiscientas noventa y tres en Dash Agent AI, ciento sesenta y
nueve pruebas de extremo a extremo en Hablemos San. Este mismo sitio se publica así.

Es despliegue real, con consecuencias reales, hecho por mí y no por un equipo de infraestructura al
que le paso un ticket.

## Lo que no he hecho, dicho sin rodeos

<!-- seccion: lo-que-no-he-hecho -->

**Google Cloud** —Vertex AI, BigQuery, despliegue productivo en ese ecosistema— y **contenedores en
producción** con Docker y Kubernetes no están en mi experiencia profesional. Mi mundo es Microsoft
y en Microsoft es donde tengo la profundidad.

Prefiero decirlo así, de frente, que esconderlo en una lista de herramientas. Un currículum que
nombra treinta tecnologías no distingue las cinco que domina de las veinticinco que ha visto, y
quien entrevista lo descubre en diez minutos.

## Por qué esa brecha es más chica de lo que parece

<!-- seccion: por-que-es-mas-chica -->

Por dos razones concretas.

La primera es de equivalencia. Un lago sobre almacenamiento distribuido, un almacén analítico
columnar, un orquestador de tuberías y una capa semántica existen en las tres nubes con nombres
distintos. Lo que hice con Lakehouse, Synapse y Data Factory se llama BigQuery y Vertex AI del otro
lado. Lo que no se traduce solo son las particularidades de identidad, costos y operación — y eso se
aprende operando, no leyendo.

La segunda es de método. Cuando digo que aprendo rápido tengo números: el DP-600 en cinco meses
mientras trabajaba a tiempo completo, cuatro certificaciones en dos años, y seis aplicaciones con
tecnologías que no había usado antes —WebAssembly, trabajadores web, bases embebidas, despliegue en
el borde— construidas y publicadas. El documento «Cómo aprendo» de esta base lo detalla.

## Cómo estoy cubriendo la brecha

<!-- seccion: como-la-cubro -->

Tengo declarada en mi pipeline, como exploración y no como construida, una pieza llamada **Agente
autónomo con Gemini y Vertex AI**: un agente con herramientas sobre el stack de Google Cloud,
pensado explícitamente como el complemento multi-nube de mi certificación en Azure.

Está en exploración con esa palabra a propósito. Cuando esté construida, será evidencia; mientras
tanto, es una declaración de hacia dónde voy, no un logro que me atribuyo.

[CONFIRMAR: ¿quieres que esa exploración pase a prioridad? Si una de las dos posiciones objetivo
avanza, una pieza pequeña pero terminada sobre Vertex AI y BigQuery convierte la brecha en
evidencia. Según mi estimación es cuestión de semanas, no de meses, pero la decisión de dónde poner
tu tiempo es tuya.]

## Lo que sí traigo a un equipo de plataforma

<!-- seccion: lo-que-traigo -->

Arquitectura de datos de extremo a extremo diseñada desde cero. Gobierno montado tres veces.
Monitoreo de agentes en producción. Modelado semántico y optimización de consultas. Y la costumbre,
que viene de la norma ISO 9001 y se quedó, de que lo hecho tenga su rastro escrito: decisiones de
arquitectura registradas, controles que se demuestran fallando, y cada cifra con su procedencia.
