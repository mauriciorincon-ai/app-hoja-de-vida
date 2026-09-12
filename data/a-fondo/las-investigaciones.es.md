---
slug: las-investigaciones
titulo: "Las investigaciones: método antes que resultado"
resumen: "Las siete investigaciones que publico, su método y por qué empiezan midiendo el vacío."
estado: borrador
ancla: "/vitrina/investigaciones"
actualizado: 2026-09-12
preguntas_de_prueba:
  - "¿Qué investigaciones ha hecho Henry?"
  - "¿Cómo investiga Henry un problema nuevo?"
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

## Qué son

<!-- seccion: que-son -->

Siete investigaciones publicadas en la vitrina de este sitio, cada una con su ficha técnica. No son
ensayos de opinión: cada una parte de una revisión de literatura medida y declara con números qué
es lo que nadie ha hecho todavía.

Investigo por dos razones. La primera es que varias de estas preguntas me las hice trabajando y no
supe responderlas entonces. La segunda es que el método de investigación —medir el vacío antes de
proponer, congelar el criterio antes de evaluar— es el mismo que hace fiable un proyecto de datos.

## El método: primero se mide el vacío

<!-- seccion: se-mide-el-vacio -->

Todas empiezan igual y esa es su firma. No dicen «poco se ha estudiado»: dicen cuántas obras se
revisaron y cuántas cumplían cada condición.

De mil cuatrocientas catorce obras revisadas, ninguna modela la falla del servicio como propiedad de
la pareja conductor–vehículo. De novecientas, ninguna reporta adopción sostenida de un control de
convoyes en operación real. De ciento diecinueve marcos de niveles de automatización examinados uno a
uno, ninguno ordena los instrumentos de decisión por agencia con evaluación y costo contra el óptimo.
De setecientas ochenta, ninguna sintetiza los métodos de suplementos por fatiga. De doscientas setenta
y nueve, ninguna exige declarar por actividad entradas, función y salidas.

Un vacío afirmado es una opinión. Un vacío contado contra un corpus revisado es un dato.

## Las siete

<!-- seccion: las-siete -->

Tres vienen directamente de mis años en transporte masivo: **la asignación de conductor y bus con
fallas**, sobre optimizar el cumplimiento de kilómetros cuando el vehículo puede averiarse; **los
convoyes de buses**, sobre el control del apelotonamiento traducido a instrucciones por posición en
el convoy; y, de la raíz industrial, **los suplementos por fatiga y el balanceo de línea**, sobre una
tabla que gobierna la práctica y no tiene revisión citable.

Dos son sobre cómo se construye conocimiento de proceso: **ARKHÉ**, un ecosistema declarativo de
conocimiento de proceso, y **FORJA**, sobre ir del proceso dibujado al sistema que lo ejecuta.

Dos son sobre inteligencia artificial en la organización: **el espectro de agencia de los
instrumentos de decisión**, que ordena las herramientas según cuánta decisión delegan; y **el
reemplazo de un ERP con inteligencia artificial**, donde de novecientas obras ninguna presenta una
estrategia validada y replicable, y solo quince de quinientas estudian la productividad de la IA en
sistemas integrados.

Esa última es, en el fondo, mi primer trabajo —la implementación del ERP de Inglopres en 2016— hecho
la pregunta diez años después.

## Congelar el criterio antes de medir

<!-- seccion: congelar-el-criterio -->

La regla que más me importa de todo esto: el harness con el que corro estas investigaciones **congela
los umbrales antes de medir y publica lo que salga**.

En el artículo piloto, **dos de los tres principios del artefacto quedaron refutados por sus propias
métricas** — y así se publicó. Ese es el punto entero. Un criterio que se ajusta después de ver el
resultado no es un criterio: es una justificación.

La misma disciplina vale en analítica corporativa, donde la tentación de mover el umbral cuando el
indicador no da es diaria.

## Trazabilidad: ningún número sin su fila

<!-- seccion: trazabilidad -->

El otro harness, el de papers computacionales, tiene una regla igual de dura: **ningún número llega
al documento sin existir antes como fila de su registro**. Nada de cifras escritas a mano en el
texto; todas se leen de donde se midieron.

Y la prueba de que el andamiaje es declarativo y no un montón de casos especiales es un comando:
tras tres artículos de clases distintas, el diff sobre la tubería tiene que quedar vacío. Si sale con
cambios, el diseño estaba mal.

Es la misma idea que aplico a un tablero corporativo: cada cifra con su procedencia, y el proceso que
la produce reproducible.

## Qué tiene que ver esto con un puesto de IA

<!-- seccion: que-tiene-que-ver -->

Más de lo que parece. Un rol de inteligencia artificial es, buena parte del tiempo, evaluar
afirmaciones: si un enfoque funciona, si una métrica significa algo, si un resultado se sostiene
fuera del conjunto donde se midió.

Eso es método de investigación, y es lo que estas siete piezas demuestran que sé hacer. También es lo
que hay detrás de mis dos reglas de construcción: código primero, y ningún control vale su verde sin
haberse visto fallar.
