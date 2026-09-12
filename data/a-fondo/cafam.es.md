---
slug: cafam
titulo: "Cafam — el WMS y el equipo de 20 (2020–2021)"
resumen: "El WMS de Cafam y el equipo más grande que he liderado: veinte personas y las integraciones."
estado: borrador
ancla: "/proyectos/cafam"
actualizado: 2026-09-12
preguntas_de_prueba:
  - "¿Qué hizo Henry en Cafam?"
  - "¿Cuál es el equipo más grande que ha liderado?"
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
La historia detrás del case study: cómo fue liderar el equipo más
grande de tu carrera, qué salió mal y cómo lo resolviste, detalles de las
integraciones VBA y el BI de control que no caben en la página. -->

## El contexto: cambiar el sistema que mueve la bodega

<!-- seccion: el-contexto -->

Entré a Cafam en octubre de 2020 como Analista de Sistemas de Información y de Proyectos, y estuve
hasta junio de 2021. El encargo era la implementación de un sistema de gestión de almacenes en su
operación logística.

Cambiar el sistema que gobierna un centro de distribución es de las cosas más delicadas que se
pueden hacer en logística: cada error de datos se paga en la bodega, en unidades que no aparecen o
que aparecen donde no van. Y se paga el mismo día.

## El equipo de veinte

<!-- seccion: el-equipo-de-veinte -->

Lideré un equipo de veinte personas en las pruebas de implementación del sistema. Es el equipo más
grande que he coordinado y el resultado quedó medido: los errores bajaron un veinticinco por ciento
y la eficiencia operativa subió un quince.

Lo que hace difícil un equipo de pruebas de veinte personas no es el tamaño, es que el trabajo es
repetitivo y el resultado es invisible cuando sale bien. Lo que funcionó fue hacer visible el
avance: que cada persona viera qué parte del sistema estaba ya cubierta y cuál faltaba.

[CONFIRMAR: ¿el equipo de veinte era de Cafam, del proveedor del sistema, o mixto? Y ¿cuánto duró
la fase de pruebas? Son dos datos que cambian bastante cómo se lee este logro.]

## El BI de control de la implementación

<!-- seccion: el-bi-de-control -->

Diseñé informes de inteligencia de negocios y tableros interactivos para controlar la propia
implementación, con dos resultados declarados: un cincuenta por ciento de mejora en la precisión
del control de pruebas y adopción por más de quince usuarios.

Es un detalle que me gusta contar porque va en contra de lo intuitivo: el tablero más útil del
proyecto no fue sobre la operación, fue **sobre el proyecto**. Medir la implementación mientras
ocurre es lo que permite llegar a la fecha sabiendo si vas bien, en vez de descubrirlo al final.

## Las integraciones en VBA

<!-- seccion: integraciones-vba -->

Desarrollé aplicaciones en Visual Basic para Aplicaciones para integrar procesos del Centro de
Distribución con el sistema de gestión de almacenes, con un quince por ciento más de automatización
y un cincuenta por ciento menos de errores de datos.

Cuento esto sin ninguna vergüenza técnica. La herramienta correcta es la que resuelve el problema
con lo que la organización ya tiene y puede mantener. En 2020, en esa operación, era VBA — y bajar
los errores de datos a la mitad es un resultado que no mejora por haberse conseguido con una
tecnología más moderna.

## La calidad del dato, en SQL

<!-- seccion: calidad-en-sql -->

Supervisé la calidad de los datos con SQL en múltiples sistemas, con un aumento del veinte por
ciento en precisión y fiabilidad del sistema de gestión de almacenes.

«Múltiples sistemas» es la parte importante: el problema nunca fue un sistema, fue la frontera
entre ellos. Ahí es donde aparecen los datos que no cuadran, y donde vive la mayor parte del trabajo
real de un analista de sistemas de información.
