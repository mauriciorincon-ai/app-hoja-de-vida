---
slug: fabric-en-la-practica
titulo: "Microsoft Fabric en la práctica"
resumen: "Lakehouse, modelado semántico, DAX y gobierno técnico: qué hago de verdad con la plataforma."
estado: borrador
ancla: "#skills"
actualizado: 2026-09-12
preguntas_de_prueba:
  - "¿Qué experiencia tiene Henry con Microsoft Fabric?"
  - "¿Qué sabe hacer con modelado semántico y DAX?"
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

## Qué significa el DP-600, en trabajo concreto

<!-- seccion: que-significa-el-dp-600 -->

La certificación **Fabric Analytics Engineer Associate** cubre preparación, transformación y
optimización de datos con Power BI, Synapse, Data Factory y Lakehouse, más seguridad, gobernanza y
soluciones escalables con aprendizaje automático.

La obtuve en noviembre de 2024, mientras construía el ecosistema de Vesting. Esa coincidencia
importa: no estudié para un examen, certifiqué lo que estaba haciendo con las manos.

## El lago y el almacén, y por qué los dos

<!-- seccion: lago-y-almacen -->

En Vesting diseñé el ecosistema integrando Big Data, Data Warehouse y procesamiento distribuido. No
es redundancia: son dos contratos distintos con el dato.

El lago recibe lo que llega como llega, y su virtud es no perder nada ni obligar a decidir el
esquema antes de tiempo. El almacén sirve lo que ya está modelado, y su virtud es que la consulta es
rápida y la definición es única. Una plataforma que solo tiene lago obliga a cada analista a
reinventar el modelo; una que solo tiene almacén pierde todo lo que no cupo en él el día que se
diseñó.

## El modelado semántico es donde se gana o se pierde

<!-- seccion: modelado-semantico -->

Es la capa que menos se ve y la que más decide. Un modelo semántico bien hecho es el que permite que
«ingreso» signifique lo mismo en los siete tableros del área; uno mal hecho es la razón por la que
dos personas llegan a una reunión con dos cifras distintas del mismo indicador.

En Banco Pichincha trabajé la optimización con **DAX Studio y Tabular Editor**, que son las dos
herramientas con las que se mira un modelo por dentro: qué consultas son lentas, qué relaciones
están de más, qué medidas se recalculan sin necesidad.

[CONFIRMAR: el sitio publica que optimizabas «modelos semánticos» y tu hoja de vida dice «el análisis
de datos». Confírmame cuál es la formulación correcta — está detallado en el informe de
discrepancias de este sprint.]

## Power BI: la herramienta, no el objetivo

<!-- seccion: power-bi -->

Power BI aparece en toda mi trayectoria desde el énfasis de la carrera: los tableros de la operación
de Bogotá, el control de la implementación en Cafam, la adopción por más de cincuenta usuarios en
Pichincha, los tableros por proceso de la Fundación CTIC.

Con los años dejé de tratarlo como el entregable. El entregable es la decisión; Power BI es donde se
ve. Por eso el indicador que persigo es la adopción, y por eso construí un agente que escribe
reportes de Power BI directamente en su formato nativo, sin pasar por la interfaz: cuando la
herramienta es el cuello de botella, se automatiza la herramienta.

## El gobierno técnico de la plataforma

<!-- seccion: gobierno-tecnico -->

Gobernar una plataforma de datos es decidir quién ve qué, cómo se sabe de dónde vino cada dato y qué
pasa cuando algo cambia. En Vesting lo monté desde cero con datos de varios clientes conviviendo en
la misma plataforma, que es el caso donde el aislamiento no puede ser una capa posterior.

Fabric ayuda en esto más de lo que se reconoce: tener el lago, el almacén, el modelo semántico y la
visualización bajo una misma identidad y un mismo control de acceso elimina las fronteras donde
normalmente se pierde la trazabilidad.

## Lo que estoy construyendo para demostrarlo en público

<!-- seccion: lo-publico -->

Tengo declarada en exploración una pieza llamada **Analítica end-to-end en Fabric**: un pipeline
público con datos abiertos de Colombia, de la ingesta al lago, al modelo semántico y al Power BI
embebido.

Está como exploración y no como construida a propósito. Cuando exista, será la prueba verificable de
todo lo que este documento afirma; mientras tanto, la prueba es el DP-600 y lo que construí en
Vesting.
