---
slug: bi-que-se-adopta
titulo: "Inteligencia de negocios que sí se adopta"
resumen: "La adopción como indicador, no los tableros: cómo consigo que el negocio use lo que construyo."
estado: borrador
ancla: "#skills"
actualizado: 2026-09-12
preguntas_de_prueba:
  - "¿Cómo logra Henry que el negocio adopte los tableros?"
  - "¿Por qué dice Henry que la adopción es el indicador y no el tablero?"
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

## El problema difícil del BI no es técnico

<!-- seccion: el-problema-dificil -->

Construir un tablero es la parte fácil. La difícil es que alguien lo abra el martes siguiente, y el
otro martes también, y que decida algo con él.

He visto el patrón en todas partes: áreas de analítica que producen reportes que nadie usa, y la
conclusión siempre es que hace falta una herramienta mejor. Casi nunca es la herramienta. Es que el
tablero contesta una pregunta que nadie se estaba haciendo.

## La adopción, medida cuatro veces

<!-- seccion: adopcion-medida -->

Por eso el número que persigo es cuánta gente lo usa, y lo tengo medido en cuatro sitios distintos:

- **Banco Pichincha (2023):** dashboards adoptados por más de cincuenta usuarios, con un veinticinco
  por ciento de mejora en la toma de decisiones.
- **C&M Consultores / TransMilenio (2021–2022):** adopción de herramientas de inteligencia de
  negocios con más de veinticinco usuarios clave y un treinta y cinco por ciento de eficiencia.
- **Cafam (2020–2021):** el tablero de control de la implementación, con un cincuenta por ciento más
  de precisión y más de quince usuarios.
- **C&M Consorcio / TransMilenio (2018–2020):** tableros e informes de desempeño que aumentaron el
  control operativo del sistema.

Cuatro contextos —banca, transporte masivo, logística y supervisión— y la misma métrica.

## Qué hago distinto

<!-- seccion: que-hago-distinto -->

Tres cosas, y ninguna es sobre la herramienta.

**Diseño contra una decisión, no contra un conjunto de datos.** Antes de la primera pantalla
pregunto qué decisión toma esta persona, cada cuánto y con qué información hoy. Si no hay decisión,
no hay tablero: hay un reporte, que es otra cosa y se entrega de otra forma.

**Una sola definición por indicador.** Es trabajo de modelo semántico y es invisible, pero es la
diferencia entre una reunión sobre el problema y una reunión sobre por qué dos personas traen dos
cifras del mismo nombre.

**La formación va dentro del entregable.** En Pichincha diseñé un programa de formación en analítica
con un veinte por ciento de mejora en productividad. La adopción tiene dos mitades y la segunda es
que la gente sepa leer lo que mira.

## La procedencia de cada cifra

<!-- seccion: procedencia -->

Una regla que traigo del gobierno de datos y que aplico a toda pantalla: **cada cifra dice de dónde
viene.**

La llevé hasta mi propio portafolio. En las fichas técnicas de la vitrina, toda cifra lleva su
etiqueta de procedencia: medida —salió de un contador o un comando—, calculada —medida operada con
una regla que se declara—, declarada —la fijó una persona— o estimación. Una cifra sin procedencia
no se publica.

Suena excesivo hasta la primera vez que alguien impugna un número en una mesa directiva y puedes
abrir el origen en diez segundos. Después de eso, nadie vuelve a discutir el número: se discute la
decisión, que es de lo que había que hablar.

## Cuando la herramienta es el cuello de botella

<!-- seccion: cuando-la-herramienta-estorba -->

Si construir el tablero es lo que frena, se automatiza el tablero.

Construí un agente, publicado en mi vitrina, que escribe reportes de Power BI directamente en su
formato nativo con una habilidad propia, sin interfaz de línea de comandos, y que nunca toca el
modelo semántico a mano: eso es de otra pieza. Ninguna corrida cierra sin verificación.

Es la misma idea de siempre. En Cafam fueron integraciones en Visual Basic porque era lo que la
organización podía mantener; hoy es un agente que escribe el archivo del reporte. La herramienta
correcta es la que resuelve el problema con lo que hay.
