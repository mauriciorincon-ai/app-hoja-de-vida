---
slug: agentes-en-produccion
titulo: "Agentes de IA en producción"
resumen: "El proceso core replicable de Vesting y los trece agentes que construí y publiqué."
estado: borrador
ancla: "/vitrina/agentes"
actualizado: 2026-09-12
preguntas_de_prueba:
  - "¿Qué experiencia tiene Henry construyendo agentes de IA?"
  - "¿Cómo se monitorea un agente de IA en producción?"
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

Cuando digo que trabajo con agentes de IA me refiero a dos cosas que conviene separar.

La primera es **profesional**: en Vesting, una startup de agentes de automatización, fui Líder de
Estrategia de Datos entre agosto de 2023 y enero de 2025. Ahí construí la plataforma que sostenía la
analítica de los agentes y el sistema que los monitoreaba en producción, y definí el proceso central
para diseñarlos e implementarlos.

La segunda es **mi propio pipeline**: trece agentes construidos y publicados, cada uno con su ficha
técnica en la vitrina de este sitio.

## El proceso core replicable

<!-- seccion: el-proceso-core -->

En Vesting definí, documenté y validé el proceso central para diseñar e implementar agentes de IA,
creando un marco replicable para la entrega de los servicios.

La idea de fondo es la misma que hace funcionar una planta: si cada agente se construye distinto, el
equipo no acumula aprendizaje y cada entrega arranca de cero. Un proceso core define las etapas, los
entregables de cada una y el criterio para decir «terminado» — y con eso el segundo agente cuesta
menos que el primero, y el décimo mucho menos.

[CONFIRMAR: ¿cuántas etapas tenía el proceso y cuántos agentes llegaron a construirse con él? Es la
cifra que convierte esta subsección en evidencia.]

## Monitorear un agente no es mirar si está arriba

<!-- seccion: monitorear-no-es-mirar-si-esta-arriba -->

En Vesting implementé sistemas de captura, almacenamiento y análisis para el monitoreo en tiempo real
de los agentes en producción.

Un agente no falla como falla un servicio. No se cae: responde distinto. Puede seguir contestando con
fluidez mientras la respuesta ya no se sostiene en nada. Por eso la observabilidad de un agente es
otra cosa: hay que poder reconstruir qué entró, qué contexto se usó, qué salió y cuánto costó — y
poder hacerlo días después.

Este problema me interesó tanto que construí una aplicación dedicada, **Dash Agent AI**, publicada
en mi vitrina: un panel local que muestra qué saben los agentes de IA sobre su usuario. Sin llamadas
de red salientes en tiempo de ejecución, con índice en SQLite y casi setecientas pruebas.

## Cómo construyo un agente: fuentes o vacío declarado

<!-- seccion: fuentes-o-vacio -->

Los trece agentes de mi vitrina comparten una regla que es mi postura completa sobre IA generativa:
**ninguna afirmación sale de la memoria del modelo.**

El experto en la norma ISO 42001 cita el apartado y la página de su corpus, o declara el vacío — y
estampa la fecha en que verificó que la norma sigue vigente. El experto fiscal responde desde un
corpus de ciento cincuenta reglas con artículo, fuente, vigencia y confianza declarada; una
sugerencia sin su regla citada no se emite. El asistente de posgrado cita curso, sesión y marca de
tiempo, y genera toda cita desde su formato bibliográfico con un procesador de estilo, no a mano.

No es prudencia excesiva. Es la misma regla que traigo del gobierno de datos: un número sin
procedencia no es un número.

## Agentes que son sistemas de trabajo, no conversaciones

<!-- seccion: sistemas-de-trabajo -->

La otra cosa que comparten es que ninguno es un chat. Son sistemas con controles que se pueden poner
en rojo.

El constructor de tableros de Power BI escribe el reporte en el formato nativo de la herramienta con
una habilidad propia, sin interfaz de línea de comandos, y nunca toca el modelo a mano; ninguna
corrida cierra sin verificación. El taller de animación tiene una prueba que exige que dar de alta
la técnica número quince cueste lo mismo que la número cuatro: si el archivo de tubería cambia al
añadirla, el diseño estaba mal. El harness de papers computacionales no deja llegar un número al
documento si antes no existe como fila de su registro.

Y la fábrica que opera todo el pipeline no deja avanzar una aplicación sin dos aprobaciones escritas
ni cerrar un sprint sin su resumen.

## Qué me llevo de las dos experiencias

<!-- seccion: que-me-llevo -->

Que la parte difícil de un agente en producción no es el modelo. Es el contexto que se le da, la
evidencia con la que responde, la forma de comprobar que no se salió del carril y el proceso que
permite construir el siguiente igual que el anterior.

Eso lo aprendí montando una plataforma para agentes ajenos y lo confirmé construyendo trece propios.

[CONFIRMAR: ¿qué frameworks usaste en Vesting para los agentes, o eran desarrollo propio? Es de las
primeras preguntas de cualquier entrevista de ingeniería de IA y hoy este documento no la responde.]
