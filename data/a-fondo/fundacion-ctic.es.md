---
slug: fundacion-ctic
titulo: "Fundación CTIC — analítica en salud (2025–hoy)"
resumen: "Mi rol actual: 42 productos analíticos en Power BI para 20 líderes de 15 procesos, gobierno y calidad de datos en salud, y la estrategia institucional de IA bajo UNE-ISO/IEC 42001:2025 con 23 instrumentos, 12 oportunidades y 7 casos evaluados."
estado: borrador
ancla: "/proyectos/fundacion-ctic"
actualizado: 2026-09-20
preguntas_de_prueba:
  - "¿Qué hace Henry en la Fundación CTIC?"
  - "¿Qué experiencia tiene con datos en salud?"
  - "¿Cómo lidera Henry la estrategia de inteligencia artificial en la Fundación CTIC?"
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
Qué tiene de distinto el dato en salud, cómo estás montando el
gobierno de datos institucional, qué tableros usan los líderes asistenciales.
Recuerda: NADA de datos de pacientes ni información interna sensible. -->

## El rol actual: dónde trabajo hoy

<!-- seccion: el-rol-actual -->

Desde **marzo de 2025** trabajo como Profesional de Analítica en la **Fundación CTIC**, una
institución del sector **salud**. Es el contexto más exigente en el que he trabajado en calidad,
seguridad, privacidad, trazabilidad y gobierno de la información: detrás de cada dato hay una
persona y un proceso asistencial.

Tengo dos responsabilidades complementarias. La primera: construir la capacidad analítica en
**Power BI** que integra información, modela procesos administrativos y asistenciales y pone
indicadores confiables en manos de quien decide. La segunda: **liderar la estrategia
institucional de inteligencia artificial**, con la implementación del sistema de gestión de IA.
Trabajo en línea directa con la Dirección de Planeación y con las subdirecciones de tecnología,
gestión de la información y calidad.

Todo lo que cuento de esta experiencia conserva un límite innegociable: no expongo datos de
pacientes, información clínica ni conocimiento interno cuya divulgación afecte a las personas o a
la institución. Las cifras van agregadas. Eso no debilita la narrativa: explica el método y
respeta lo que protege.

## Analítica por procesos, para dos audiencias

<!-- seccion: analitica-por-procesos -->

He construido **42 productos analíticos** en Power BI —entre ellos **23 tableros de control**— que hoy usan
**20 líderes** de **15 procesos** administrativos y asistenciales y unos **75 usuarios**. Las dos
audiencias trabajan sobre la misma organización pero no hacen las mismas preguntas: la gestión
administrativa mira recursos, capacidad y oportunidad; la asistencial mira el proceso de
atención y sus **indicadores de calidad**, los que una **IPS** reporta y los que la
**habilitación** exige.

La decisión de diseño viene de la ingeniería industrial: organizar los tableros **por procesos y
no por áreas**. Un área puede mostrar indicadores favorables mientras el proceso que la atraviesa
acumula esperas. Por eso los modelos semánticos representan entidades, relaciones y eventos del
proceso, y los indicadores van a lo largo del flujo: los de resultado dicen qué pasó; los
intermedios explican cómo y dónde intervenir.

Un indicador conserva **una única definición institucional**, aunque se presente con distinto
detalle según la responsabilidad de quien lo mira. El modelo semántico separa la definición de
la métrica de su presentación, y cada producto distingue hecho, estimación y recomendación.

He **diseñado planes de mejora** a partir de esos análisis para los responsables de proceso, que
son quienes los ejecutan: la analítica no sustituye la responsabilidad del proceso. Lo que sí
implementé, y mucho, fueron mejoras en mi propio proceso: la preparación de la información que
antes se hacía a mano se redujo **cerca de un 60 %** en esfuerzo, y los **10 planes** de análisis
que hoy siguen los procesos salen de una misma base gobernada.

## Gobierno y calidad de datos en salud

<!-- seccion: gobierno-y-calidad -->

Gestiono el **gobierno de datos** institucional —limpieza, integración y estandarización—, alineada con
las políticas de la Fundación y con la protección de datos personales: **habeas data**, la **Ley
1581** y la **anonimización** cuando un análisis no necesita identificar a nadie.

Las reglas de calidad se diseñaron entendiendo el proceso que produce cada dato y la consecuencia
de una interpretación equivocada:

- **completitud** de los campos que una decisión necesita;
- **duplicados** entre registros que representan a la misma persona o el mismo evento;
- **conciliación** entre las fuentes que deberían decir lo mismo;
- **umbrales** que disparan revisión antes de que un valor llegue a un indicador.

La calidad se evalúa en relación con el uso: un valor puede cumplir su formato y no ser lo
bastante completo, oportuno o consistente para una decisión. Y cada producto conserva
trazabilidad desde el indicador hasta las fuentes y reglas, para que la confianza no dependa de
quien construyó el tablero.

En salud, gobernar los datos y gobernar la inteligencia artificial son la misma responsabilidad:
una aplicación o un agente no debería usar información solo porque puede acceder a ella. Debe
existir un propósito autorizado, una necesidad clara y una responsabilidad identificable. Cómo
se compara este gobierno con el de banca y el de la startup está en el documento de gobierno.

## Liderar la estrategia institucional de inteligencia artificial

<!-- seccion: estrategia-institucional-de-ia -->

Lidero la estrategia institucional de IA con un propósito: convertir iniciativas potencialmente
aisladas en una capacidad organizacional coherente, gobernable y sostenible. No parto de la
tecnología disponible sino de los problemas, las decisiones y las capacidades que la institución
necesita fortalecer.

No todo problema necesita IA y no toda iniciativa de IA necesita un agente. Muchas necesidades se
resuelven mejor con una mejora del proceso, un producto analítico o una automatización
convencional. Por eso la estrategia funciona como un **portafolio gobernado**: cada propuesta
declara el problema, los usuarios, la información requerida, el beneficio esperado y cómo se
reconocerá un resultado satisfactorio; y se prioriza por valor, viabilidad, riesgo y dependencia
de terceros.

A la fecha, la estrategia ha permitido identificar **12 oportunidades** de IA, evaluar
formalmente **7 casos de uso** y priorizar **3 iniciativas** para validación o desarrollo
progresivo; **2** de ellas cuentan ya con propósito, responsable, resultados esperados y criterios
de evaluación documentados. Detener un caso tras invalidar su hipótesis no es un fracaso: evitar
una inversión sin fundamento también es valor.

## El sistema de gestión de IA que estamos construyendo

<!-- seccion: sistema-de-gestion-de-ia -->

La estrategia se estructura sobre **UNE-ISO/IEC 42001:2025**, la adopción española de ISO/IEC
42001: la IA no como un conjunto de proyectos sino como una capacidad que necesita políticas,
roles, evaluación de riesgos, evaluación de impacto de los sistemas —la **AIIA**—, un
**inventario de sistemas de IA** y gestión del ciclo de vida. Las obligaciones jurídicas vienen
del ordenamiento colombiano; la norma aporta el marco de gestión. Las dos se complementan y no
se confunden.

Mi experiencia con sistemas de gestión de calidad fue la base: ISO 9001, en 2016, me enseñó que
no basta hacer bien una actividad; hay que poder demostrarlo. ISO/IEC 42001 comparte la misma
estructura de alto nivel, y la implementación empieza igual: por el contexto, las partes
interesadas, los roles y las responsabilidades. No todas las decisiones de IA son del equipo
técnico: el negocio responde por el propósito, y la gestión de riesgos entra desde el diseño.

El sistema de gestión comprende hoy **23 instrumentos institucionales** —políticas,
procedimientos, matrices de evaluación, criterios para casos de uso y mecanismos de seguimiento—:
**8 terminados y 15 en construcción**. Para sostener ese trabajo construí el **agente experto en
ISO 42001** que publico en la vitrina: responde con la norma en la mano y sirve para revisar cada
instrumento contra sus requisitos.

No afirmo que la institución esté certificada ni que el sistema esté completo: mi responsabilidad
es construirlo con rigor y poder demostrar cada avance.

## Alcance y avance de la capacidad institucional

<!-- seccion: alcance-y-avance -->

| Dimensión                       | Métrica                                    |            Valor |
| ------------------------------- | ------------------------------------------ | ---------------: |
| Analítica                       | productos analíticos en uso o seguimiento  |           **42** |
| Analítica                       | tableros                                   |           **23** |
| Analítica                       | líderes respaldados · procesos             | **20** · **15**  |
| Analítica                       | usuarios                                   |          **~75** |
| Analítica                       | reducción de esfuerzo en preparación       | **cerca del 60 %** |
| Analítica                       | planes de análisis en seguimiento          |           **10** |
| IA                              | oportunidades identificadas                |           **12** |
| IA                              | casos de uso evaluados formalmente         |            **7** |
| IA                              | iniciativas priorizadas · documentadas     |    **3** · **2** |
| Sistema de gestión              | instrumentos: terminados · en construcción |   **8** · **15** |

Las cifras son agregadas y respetan la confidencialidad de la institución. Se miden para
demostrar la evolución de la capacidad, no para divulgar información sensible.

## Lo que este rol reúne

<!-- seccion: lo-que-reune -->

En la Fundación CTIC convergen las capacidades de toda la trayectoria en una responsabilidad más
amplia: ya no es construir un producto analítico o un agente, sino liderar la forma en que una
institución de salud incorpora la inteligencia artificial de manera responsable. Mi propósito no
es que la organización use más IA: es que use la IA adecuada, para problemas relevantes, sobre
información autorizada y confiable, dentro de límites explícitos.
