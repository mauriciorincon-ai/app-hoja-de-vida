---
slug: las-investigaciones
titulo: "Las investigaciones: método antes que resultado"
resumen: "Siete líneas de investigación publicadas con su vacío medido —1.414, 900, 780, 279, 1.405, 119 y 900 obras revisadas— y sus hallazgos, producidas con dos harnesses: Design Science (52 criterios, umbrales congelados antes de medir) y Paper Computacional (44 criterios, ledger: si no está en el ledger no está en el paper)."
estado: borrador
ancla: "/vitrina/investigaciones"
actualizado: 2026-09-20
preguntas_de_prueba:
  - "¿Qué investigaciones ha hecho Henry?"
  - "¿Cómo mide Henry el vacío de la literatura antes de investigar?"
  - "¿Ha escrito artículos o papers?"
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

Mi portafolio reúne **siete líneas de investigación** publicadas en la vitrina, cada una con una
ficha que presenta su origen, su pregunta, el vacío medido, el **método**, el estado y sus
límites. Ninguna está sellada ni presentada como evaluada por pares: son piezas con
manuscritos listos para enviar, y así se declaran.

Investigo por dos razones. Varias preguntas nacieron en mis empleos —transporte, digitalización,
un ERP en 2016— cuando podía ver el problema pero no tenía los datos ni las herramientas para
resolverlo. Y porque el método de investigación fortalece el trabajo con datos e IA: definir la
pregunta, congelar criterios antes de mirar el resultado, construir una línea base y declarar los
límites es lo mismo que evaluar un modelo o un agente. Una hipótesis no es un **hallazgo**; un
resultado sintético no es validación operacional.

## El método: primero se mide el vacío

<!-- seccion: se-mide-el-vacio -->

Todas empiezan con la misma regla: el vacío se mide antes de proponer la contribución. No basta
decir que un tema ha recibido poca atención: se hace una **revisión sistemática con protocolo**,
con criterios de inclusión y exclusión fijados antes, y cada obra se clasifica por fenómeno,
intervención, unidad de análisis y evidencia. El vacío deja de ser una impresión y se expresa en
conteos:

| Línea                                          | Corpus revisado | Vacío medido                                                                                   |
| ---------------------------------------------- | --------------: | ---------------------------------------------------------------------------------------------- |
| Asignación conductor–bus con fallas            |   1.414 obras   | ninguna modela la falla como propiedad de la pareja conductor–vehículo; de 600, ninguna optimiza kilómetros con la avería como consecuencia de la asignación |
| Convoyes de buses (*bunching*)                 |     900 obras   | ninguna reporta adopción sostenida de un control en operación; de 873, ninguna traduce el control a instrucciones por posición en el convoy |
| Suplementos por fatiga y balanceo              |     780 obras   | ninguna sintetiza los métodos de suplementos; de 378, ninguna mide cómo la fatiga cambia el balanceo óptimo; 3.057 registros tamizados |
| FORJA: del proceso dibujado al sistema         |     279 obras   | 53 van a no programadores y 40 producen un ejecutable, pero ninguna exige declarar entradas, función y salidas por actividad |
| ARKHÉ: ecosistema declarativo de conocimiento  |   1.405 obras   | ningún ecosistema reúne las tres condiciones en lectura estricta; individuos fabricando sistemas completos con IA: 8 de 400 |
| El espectro de agencia de los instrumentos     |    119 marcos   | ninguno ordena los instrumentos de decisión por agencia con evaluación y costo contra óptimo; de 800 obras, ninguna prescribe la elección entre clases |
| Reemplazo de un ERP con IA                     |     900 obras   | una sola con estrategia de reemplazo asistido; 15 de 500 estudian la productividad de la IA en sistemas integrados, frente a 138 en tareas pequeñas |

Un vacío contado sigue teniendo límites: demuestra que la condición no se encontró en el corpus
revisado bajo ese método, no que sea imposible que exista fuera de la búsqueda. La formulación
correcta no es «nadie lo ha hecho» sino «no fue identificado dentro del corpus revisado bajo estos
criterios». Es menos espectacular y mucho más defendible.

## Tres líneas sobre operaciones bajo variabilidad

<!-- seccion: operaciones-bajo-variabilidad -->

Las siete se agrupan en tres preguntas: cómo optimizar operaciones bajo variabilidad, cómo
convertir procesos en sistemas, y cómo distribuir la capacidad de decidir. Las tres primeras
vienen del transporte y de la línea de producción.

**Asignación conductor–bus con fallas.** La falla es del par: asignar como pareja cumple más
kilómetros. Con programación entera y por restricciones sobre datos abiertos del transporte y
un generador sintético declarado, las dos formulaciones dan **14.251 óptimos idénticos**, y el
**90 % de las parejas cambia** al modelar el par. Las magnitudes son de instancias sintéticas: el
mecanismo se demuestra; las cifras reales no se afirman.

**Convoyes de buses.** El *bunching* no roba capacidad: roba tiempo y expulsa usuarios. Una
**simulación de eventos discretos** con **pre-registro factorial** y control clásico como línea
base, sobre **197.046 experiencias** individuales simuladas: la espera media sube de **2,33 a 4,43
minutos** bajo convoy pleno. Propone la política y mide su efecto; cambiar la regla es decisión
institucional.

**Suplementos por fatiga y balanceo.** Las tablas de fatiga no conocen tu puesto ni tu altitud.
Un modelo de balanceo con fatiga endógena y curvas sintéticas desde la literatura muestra que
calibrar el suplemento cambia la configuración óptima de la línea; no mide fatiga en personas
reales y no sirve para presionar a nadie a rendir más: el suplemento protege, no exprime.

## Cuatro líneas sobre procesos, sistemas y decisión

<!-- seccion: procesos-y-decision -->

**FORJA.** El profesional dibuja su proceso —en BPMN— y FORJA lo compila, sin intermediarios: cada
actividad como caja negra abierta con entradas, función y salidas, y un compilador que conservó
el **99,5 % de la estructura** en el demostrador. Que los profesionales lo usen se demuestra con
profesionales, no con el prototipo.

**ARKHÉ.** Una persona con criterio fabrica sistemas que antes exigían un equipo. Es la
arquitectura que produce las otras seis: contratos declarativos indexados, moldes reutilizables,
registros inspeccionables, gobernanza verificable; **6 de sus 9 conceptos** ya son citables con
literatura revisada. Publica ingredientes, no receta: la frontera es también comercial.

**El espectro de agencia.** Tablero, alerta, asistente, recomendador o agente: cuál para cada
decisión. Un espectro ordinal por construcción, decisores sintéticos y un escenario con óptimo
conocido para medir el *regret*; el techo de horas se congeló antes de arrancar. Nunca afirma que
los decisores sintéticos predicen comportamiento humano.

**Reemplazo de un ERP con IA.** Su origen es mi primera implementación de un ERP, en Inglopres en
2016. Un ERP de código abierto como demostrador, el **patrón estrangulador** y el análisis de
acoplamiento entre módulos para decidir qué reemplazar primero; la productividad de la IA se cita
con su alcance: lo probado en tareas pequeñas no se extrapola a sistemas integrados.

## Dos harnesses: criterio congelado y ledger

<!-- seccion: los-harnesses -->

Las investigaciones se producen con dos harnesses, publicados entre los 13 agentes de la vitrina. El **Harness Design Science** —10
fases D0 a D9, **52 criterios binarios**, 7 controles endurecidos— congela los umbrales antes de
medir y publica lo que salga: en su paper piloto, **dos de los tres principios** del artefacto
quedaron refutados por sus propias métricas, y así se escribieron. Un resultado nulo jamás se
arregla redefiniendo; y un nulo no es una refutación: los dos se reportan como informativos.

El **Harness Paper Computacional** —**44 criterios**, tres papers de investigación de operaciones
listos para publicar— aplica la segunda regla: **si no está en el ledger, no está en el paper**.
Ningún número llega al manuscrito sin existir antes como fila de un registro *append-only*; tablas
y figuras se generan desde los datos y nunca se editan a mano. Y la prueba de que el pipeline es
declarativo es un comando: tras tres papers de clases distintas, el `git diff` de las fases y del
contrato sigue vacío, con **0 campos nuevos** en el contrato.

Los dos comparten un límite y un «nunca»: no publican —el envío a revista lo ejecuta el autor
con su token— y nunca mencionan el ecosistema del autor ni su maquinaria en un manuscrito, cosa
que un lint verifica dos veces. Es el linaje de una plataforma analítica aplicado a un paper.

## Datos sintéticos, simulación y límites

<!-- seccion: datos-sinteticos-y-limites -->

Varias de las 7 líneas —las 197.046 experiencias de los convoyes, las curvas de fatiga— se evalúan
con datos sintéticos o simulación porque no hay datos públicos suficientes o no se puede usar información operacional. Los sintéticos permiten escenarios con
propiedades conocidas y experimentos **reproducibles**; la simulación permite comparar políticas
sin intervenir la operación. Ninguno de los dos es validación operacional, y cada ficha lo dice.

Y hay un «nunca» ético común a todas: **nunca usan datos de empleos anteriores** del autor —solo
fuentes públicas y sintéticos declarados—, nunca nombran conductores ni empresas de donde salgan
datos, nunca clasifican ni culpan a una persona: el modelo empareja, no rankea. Un resultado
negativo no se esconde: delimita qué mecanismo no funciona y bajo qué condiciones, y evita que
otros repitan la misma ruta. El rigor no consiste en tener razón desde la primera formulación;
consiste en diseñar un proceso capaz de mostrar cuándo no la tengo.

## Qué tiene que ver esto con un rol de inteligencia artificial

<!-- seccion: que-tiene-que-ver -->

Una parte del trabajo en IA es evaluar afirmaciones: si una solución funciona, si una métrica mide
lo que dice, si un resultado se generaliza. Revisar la literatura evita presentar como innovación
lo ya resuelto; congelar criterios protege la evaluación de ajustes retrospectivos; la
trazabilidad de los números permite reconstruir; los sintéticos y la simulación estudian
mecanismos bajo control. Estas 7 investigaciones —5.400 obras revisadas entre todas, y 119 marcos— demuestran que no uso la
IA solo para construir más rápido: la uso dentro de un sistema diseñado para producir conocimiento trazable,
refutable y reproducible.
