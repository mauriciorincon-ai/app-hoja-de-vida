---
slug: bi-que-se-adopta
titulo: "BI que se adopta"
resumen: "La adopción como indicador y no el tablero: 50+ usuarios en banca, 25+ usuarios clave en transporte, 15+ en logística y 42 productos para 20 líderes en salud; la formación como parte del producto, la procedencia de cada cifra y el agente que construye reportes de Power BI completos."
estado: aprobado
ancla: "#skills"
actualizado: 2026-09-20
preguntas_de_prueba:
  - "¿Cómo logra Henry que el negocio adopte los tableros?"
  - "¿Por qué dice Henry que la adopción es el indicador y no el tablero?"
  - "¿Cuántos usuarios han adoptado los tableros que ha hecho?"
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

Construir un tablero en **Power BI** rara vez es la parte difícil. Lo difícil es que se use para
decidir. Una organización puede tener herramientas, profesionales y volúmenes de información y
seguir sin convertirlos en decisiones, porque el tablero no responde a una pregunta concreta, o
porque dos áreas interpretan distinto la misma métrica.

Por eso trato la **adopción** como el indicador del producto y no como una métrica que se revisa
al final: es una hipótesis de diseño que se formula desde el comienzo y se valida en la
operación. Diseño desde la decisión —quién usa la información, qué pregunta responde, con qué
detalle y frecuencia— y no desde los datos disponibles. En Banco Pichincha, en 2023, fue el
problema entero del rol: tableros técnicamente correctos que el negocio no terminaba de adoptar.

## La adopción demostrada en contextos diferentes

<!-- seccion: adopcion-medida -->

He medido la adopción en cuatro contextos, con usuarios y decisiones distintos:

| Dónde                    | Producto                                   | Adopción                                    | Efecto                                   |
| ------------------------ | ------------------------------------------ | ------------------------------------------- | ---------------------------------------- |
| **Banco Pichincha**      | dashboards orientados a decisión, con un equipo de 5 | **más de 50 usuarios** del negocio      | +25 % en la toma de decisiones           |
| **TransMilenio / C&M**   | Power BI en la operación                   | **más de 25 usuarios clave**                | +35 % en eficiencia de los procesos analíticos |
| **Cafam**                | el BI de control de la implementación del WMS | **más de 15** directores y jefes         | +50 % en precisión del seguimiento       |
| **Fundación CTIC**       | 42 productos analíticos por procesos       | **20 líderes** de 15 procesos, unos 75 usuarios | cerca de 60 % menos esfuerzo de preparación |

En C&M Consorcio 2018 desarrollé tableros e informes de desempeño para la supervisión de
TransMilenio y no cuento con una cifra confirmada de usuarios, así que no lo presento como un
caso de adopción cuantificada.

«Usuarios clave» importa: en transporte no eran personas con acceso sino los responsables de
programación, seguimiento y decisiones de servicio. Y distingo cuatro cosas que suelen
confundirse: dar **acceso** demuestra disponibilidad; abrir un tablero demuestra **uso**;
incorporarlo a una rutina demuestra **adopción**; cambiar una decisión demuestra **impacto**.
Quince personas con responsabilidad directa sobre un proceso crítico valen más que cientos que
consultan de vez en cuando.

## Diseño alrededor de una decisión, con una definición por indicador

<!-- seccion: diseno-para-la-decision -->

Antes de una visualización hay una decisión: qué situación observar, qué se puede hacer, qué
detalle se necesita y cada cuánto. Cada tablero ofrece una ruta desde la visión general hasta la
evidencia, para que el responsable reconozca la condición y pueda profundizar cuando una cifra
lo exige.

La consistencia es parte de la adopción: si un tablero y otro calculan distinto el mismo
concepto, el usuario compara herramientas en vez de analizar la realidad. Por eso cada indicador
tiene **una definición**, un responsable y una regla de cálculo, centralizadas en el **modelo
semántico** y expresadas como medidas **DAX** que todos los productos reutilizan. Cómo se
optimiza ese modelo está en el documento de Fabric.

## La formación forma parte del producto

<!-- seccion: formacion-y-adopcion -->

Una solución no se adopta solo por intuitiva: las personas necesitan entender qué representa la
información, cómo interpretarla y qué límites tiene. En Banco Pichincha diseñé y dicté un
programa de **formación a 12 profesionales** —Power Query, modelado semántico, DAX,
visualización y comunicación ejecutiva, sobre sus propios productos— que contribuyó a un aumento
del 20 % en la productividad en la preparación y uso de la información.

La formación reduce la dependencia del equipo de BI: un usuario con más criterio hace mejores
preguntas, detecta inconsistencias y usa el producto con autonomía, y el equipo técnico se
concentra en lo complejo. Autonomía no es ausencia de gobierno: los **usuarios** exploran sin
redefinir las métricas críticas. Y se adapta a la responsabilidad: quien decide no necesita la
profundidad de quien construye el modelo.

## La procedencia de cada cifra

<!-- seccion: procedencia -->

Regla que viene del gobierno de datos: cada cifra relevante conserva su procedencia. Si no puedo
explicar de dónde sale, cómo se transformó y qué definición representa, no está lista para una
decisión importante. La pantalla la presenta con claridad; el mecanismo para recorrerla hasta la
fuente existe cuando hace falta.

Y distingo la naturaleza del valor: **medida** por un contador o una ejecución, **calculada** por
una regla explícita, **declarada** por una fuente responsable o **estimada** bajo supuestos. No
tienen la misma certeza y no se presentan como equivalentes. Llevé la regla a mi vitrina: las
fichas técnicas de las 32 piezas etiquetan cada cifra con su procedencia.

En una conversación directiva, cuando alguien cuestiona un número, la respuesta no depende de
quién tiene más autoridad: hay una ruta verificable desde la cifra hasta el dato. Cuando el
desacuerdo persiste, la procedencia muestra que no está en la aritmética sino en el concepto que
cada uno quiere medir.

## Cuando la construcción del tablero es el cuello de botella

<!-- seccion: cuando-la-herramienta-estorba -->

Cuando construir a mano limita la velocidad y la consistencia, la producción de los artefactos
se vuelve objeto de automatización. Construí el **Constructor de Tableros Power BI**, uno de los
13 agentes de mi vitrina: a partir de una especificación produce el proyecto completo en formato
.pbip —el modelo semántico, las transformaciones en Power Query M, las medidas DAX y las
visuales—, puede extraer los datos, y está probado de extremo a extremo.

El agente no decide la estrategia analítica: la selección de indicadores, las definiciones y la
experiencia de decisión siguen bajo criterio explícito, y ninguna ejecución se da por terminada
hasta superar validaciones estructurales y funcionales. Es mi regla general para la IA: no
sustituye el criterio ni simula tareas deterministas; interviene donde interpreta una
especificación y acelera una actividad delimitada, con salidas mantenibles.

El criterio viene de Cafam: allí usé VBA porque era lo disponible, útil y mantenible en esa
organización. La herramienta cambia; el principio permanece. Y cuando Power BI no es el
instrumento —una alerta, una aplicación, un modelo o un agente lo son—, la escalera que ordena
esas opciones está en el documento sobre cómo trabajo.
