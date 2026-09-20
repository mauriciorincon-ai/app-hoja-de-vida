---
slug: agentes-en-produccion
titulo: "Agentes de IA: la plataforma de Vesting y ARKHÉ, mi ecosistema propio"
resumen: "Dos experiencias con agentes: 27 construidos con el proceso core de Vesting sobre n8n y monitoreados en tiempo real, y ARKHÉ, mi ecosistema agéntico de harnesses especializados, medido en 120 escenarios: −52 % de tokens y cumplimiento del 71 % al 93 %."
estado: borrador
ancla: "/vitrina/agentes"
actualizado: 2026-09-20
preguntas_de_prueba:
  - "¿Qué experiencia tiene Henry construyendo agentes de IA?"
  - "¿Cómo se monitorea un agente de IA en producción?"
  - "¿Qué es ARKHÉ?"
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

## Dos experiencias distintas, no una

<!-- seccion: dos-experiencias -->

Cuando hablo de **agentes** de IA me refiero a dos trayectorias que se complementan y que separo
con precisión. La primera es profesional: en **Vesting**, entre agosto de 2023 y enero de 2025,
diseñé la plataforma de datos y el **proceso core** con el que se construyeron **27 agentes** para
**12 clientes**, y el **monitoreo** en tiempo real de hasta 23 a la vez. Eso es producción: agentes
con usuarios, contratos y costo.

La segunda es propia: **ARKHÉ**, el ecosistema agéntico que construí después, con otra arquitectura
y sin reproducir la de Vesting, y del que los **13 agentes publicados** en la vitrina son la parte
visible. Son sistemas de trabajo de uso personal, con entregables y evidencia, y no los llamo
«producción»: esa palabra la reservo para Vesting. Los trece, uno a uno, están en su documento.

## El proceso core de Vesting

<!-- seccion: el-proceso-core -->

En Vesting definí, documenté y validé el proceso central para diseñar e implementar agentes: once
etapas, del caso de uso a la operación observable, que están numeradas en el documento de Vesting.
Sirvió como marco para 27 agentes, y eso es lo que demuestra: no una propuesta conceptual sino una
capacidad usada de forma repetida.

Estandarizar no significaba que todos fueran iguales. El proceso fijaba una forma común de
trabajo —problema y propósito identificables, comportamiento traducido a criterios verificables,
autonomía delimitada, definición de terminado acordada antes— y dejaba libres fuentes,
herramientas y reglas. El activo no era ningún agente: era construir el siguiente sobre
conocimiento acumulado. Es la lógica de ingeniería industrial de un proceso central: si cada
unidad se hace distinta, la organización no aprende y la siguiente cuesta lo mismo que la
primera.

## n8n como base de automatización, no como arquitectura completa

<!-- seccion: n8n -->

Los flujos de los agentes de Vesting corrían sobre **n8n**: conectar servicios, organizar
secuencias, ejecutar reglas e integrar componentes. Pero la arquitectura no era una colección de
flujos visuales: el valor estaba en definir qué información entraba, qué transformación ocurría,
qué evidencia se conservaba y qué pasaba ante una excepción.

Mi trabajo fue conectar esa capa de ejecución con la plataforma de datos en Microsoft Fabric que
conservaba los eventos —sesiones, solicitudes, respuestas, tiempos, estados, costo en tokens— y
los volvía analizables. La separación importa: el componente que hace el trabajo no debería ser el
único que afirma que lo hizo bien. n8n coordinaba parte de la ejecución; Fabric y Power BI daban
la mirada independiente. Los detalles internos pertenecen a Vesting y siguen protegidos.

## Monitorear un agente no es comprobar que está disponible

<!-- seccion: monitorear-un-agente -->

Un agente puede estar disponible y responder con fluidez mientras la calidad de sus resultados se
deteriora; o responder bien con una latencia, un costo o unos reintentos que lo vuelven inviable.
Por eso el monitoreo de Vesting reconstruía la **sesión** completa —qué solicitud recibió cada
agente, con qué contexto, qué respondió, cuánto tardó, qué costó, en qué estado terminó— y no solo
el resultado final; la tabla de dimensiones y decisiones está en el documento de Vesting.

Distingo dos cosas que suelen confundirse: la **telemetría**, que le sirve al equipo para entender
el comportamiento técnico, y la **transparencia**, que le sirve a la persona afectada para saber
qué información se conserva y usa sobre ella. De la segunda salió, ya en CTIC, **Dash Agent AI**:
una aplicación que muestra qué contexto conserva un agente sobre la persona, que opera localmente
sin una sola llamada de red, con 693 pruebas y 97,5 % de cobertura. La lección de Vesting es que
no se gobierna una solución inteligente cuya operación es invisible.

## ARKHÉ: mi ecosistema agéntico

<!-- seccion: arkhe -->

**ARKHÉ** es una arquitectura de nivel superior que coordina agentes, conocimiento, herramientas,
controles y memoria para convertir modelos generativos (**LLM**) en capacidad de trabajo. Un
**harness** es el envoltorio de ejecución que le fija a un agente su función, sus instrucciones,
sus fuentes autorizadas, sus herramientas, su contrato de entrada y salida, sus validaciones y sus
condiciones de excepción. Separo el agente —la capacidad de interpretar, razonar o generar— del
harness que controla bajo qué condiciones opera: así mejora el modelo sin reconstruir el control,
y mejoran las reglas sin confundirlas con el modelo.

Cuatro decisiones de diseño: **especialización** en vez de un agente generalista que recibe todo el
conocimiento y todas las herramientas en cada llamada; **recuperación selectiva** para que cada
componente reciba solo el contexto que necesita; **contratos** en cada transición, con resultado
estructurado, estado y evidencia; y **código primero**: lo que exige exactitud lo resuelve un
validador, no un **prompt**. La memoria se diseña por función y la autonomía por riesgo.

La medí. En **120 escenarios** representativos, comparada con un agente generalista que recibía en
cada ejecución la totalidad de instrucciones, contexto y herramientas, ARKHÉ redujo un **52 %** el
consumo de tokens y subió el cumplimiento de instrucciones del **71 % al 93 %**. Son mis propios
cálculos, con línea base, muestra y métrica declaradas. Como investigación, ARKHÉ está en la
vitrina: 1.405 obras verificadas una a una sin encontrar un ecosistema equivalente, y 6 de sus 9
conceptos ya citables con literatura revisada.

## Fuentes o vacío declarado

<!-- seccion: fuentes-o-vacio -->

Los agentes de ARKHÉ comparten una regla que resume mi postura sobre IA generativa: **ninguna
afirmación verificable depende solo de la memoria del modelo**. Cuando la respuesta exige
evidencia, el agente usa una fuente autorizada, identifica el fragmento que la sustenta y conserva
lo necesario para que otro lo verifique; si la evidencia no alcanza, **declara el vacío**.

Tres ejemplos publicados: el **Experto ISO 42001** cita apartado y página o declara el vacío; el
**Experto Fiscal** trabaja sobre 150 reglas con artículo, fuente, vigencia y confianza, y una
sugerencia sin su regla citada no se emite; el **Asistente de posgrado** genera toda cita desde
CSL-JSON con un procesador de estilos, jamás la redacta. La recuperación no es garantía automática:
el sistema verifica que el fragmento sea pertinente y sostenga la afirmación; una cita decorativa
no convierte una respuesta en verificable. Es la misma regla del gobierno de datos: un indicador
sin procedencia no respalda una decisión.

## Qué me llevo de las dos experiencias

<!-- seccion: que-me-llevo -->

Vesting demostró escala profesional y repetibilidad: una plataforma y un proceso con los que una
startup construyó 27 agentes. ARKHÉ demostró arquitectura y medición: cómo se administra
contexto, evidencia, consumo y responsabilidad, con números. Las dos confirmaron lo mismo: la
parte difícil de un agente no es conectarlo con un modelo; es especificar su función, darle el
conocimiento justo, limitar su espacio de actuación, evaluarlo y observarlo. Un agente no se
evalúa por lo bien que conversa sino por el trabajo verificable que completa.
