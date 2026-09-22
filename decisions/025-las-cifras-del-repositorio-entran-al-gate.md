# ADR-025 — Las cifras que el corpus dice del propio repositorio entran al gate de coherencia, con historia declarada y banda de tolerancia

- **Status:** accepted
- **Date:** 2026-09-21
- **Sprint:** fuera de sprint (alineación del corpus tras los PR #34 y #36; bitácora
  `sprints/CONTENIDO-a-fondo-alineacion-bitacora.md`)

## Contexto

El corpus «a fondo» usa este sitio como evidencia: «este sitio lleva ocho sprints cerrados y N
decisiones de arquitectura registradas», «el índice de N fragmentos», «cuatro jobs de integración
continua». Son afirmaciones verificables y son buenas: sostienen el argumento de que el dueño
construye con método.

Y envejecen solas. Nadie toca el corpus y dejan de ser ciertas el día que se mergea un PR. El
21 de septiembre de 2026, con los seis gates de coherencia en verde, el corpus afirmaba **21
decisiones de arquitectura** cuando `decisions/` tenía **24**, y describía **un índice de 494
fragmentos** cuando el build emitía más de mil cuatrocientos. Ningún gate lo vio, y la razón no
era un descuido del fixture: los seis derivan su verdad de `content/` y de `cv.*.yaml`, es decir,
vigilan lo que el corpus dice del **contenido** del sitio. Lo que el corpus dice **del sitio como
obra** no tenía sujeto en ninguna parte.

## Decisión

No se escribe un séptimo gate: se le da sujeto al primero. `verdadesDelSitio()` deriva cuatro
cifras más —decisiones de arquitectura de `decisions/`, sprints cerrados de los resúmenes, jobs
de `ci.yml` y tamaño del índice del propio builder— y el fixture gana sus cuatro conceptos. Aquí
tampoco se escribe ningún número a mano.

La tercera pregunta de la regla 14 —¿puede fallar?— es la que descartó el gate nuevo: lo que
faltaba no era una aserción más, era el sujeto que a la que ya existe le faltaba. Un gate nuevo
que comparase lo mismo habría sido decorado.

El motor gana tres mecanismos, cada uno porque un caso real lo exigió:

| Mecanismo | Por qué |
| --- | --- |
| `contexto_previo` (+ `ventana_previa`) | El motor solo sabía exigir contexto POR DETRÁS del número. El tamaño del índice se nombra por delante —«el índice de 1.437 fragmentos»—, y mirar solo hacia atrás lo confundía con «la recuperación de los cuatro fragmentos», que es el top-k: el mismo sustantivo con tres órdenes de magnitud de diferencia |
| `hitos` | La serie histórica del índice (28 → 226 → 494 → hoy) es parte del argumento y es verdad. Se declara con su razón en vez de borrarse, y así sigue siendo válida el día que hoy cambie |
| `tolerancia` | El tamaño del índice se mueve con cada párrafo que se escriba. Exigirlo exacto vuelve el gate **circular**: corriges la cifra y corregirla la mueve. Con una banda del 5 %, «del orden de 1.400» pasa y «494» no |

Y `conPortada()`: el `resumen` y el `cuando_usar` de cada documento son el **primer fragmento**
que `chunksDeAFondo` emite y que el chat cita, así que sus cifras se juzgan igual que las de la
prosa. Hasta hoy ningún gate los miraba, porque todos recorrían `subsecciones`; el resumen del
documento del chat anunciaba «48 preguntas propias y 131 de afuera» cuando eran 75 y 136.

## El rojo (regla 14)

El gate nació rojo contra el corpus tal y como estaba, sin romper nada a propósito:

```
data/a-fondo/apps-pipeline.es.md · «la-fabrica-en-numeros»: dice «21 decisiones» y las
decisiones de arquitectura registradas en este repositorio son 24 (decisions/NNN-*.md).
```

Cazó el defecto real que se había encontrado leyendo. Al nacer nombró además dos falsos
positivos —«24 sprints» del pipeline entero y «cuatro fragmentos» del top-k— que son los que
motivaron `contexto_previo` y las salvedades; quedaron declarados con su razón en el fixture, no
silenciados. Y este mismo ADR es su segunda demostración: al entrar eleva el conteo de 24 a 25 y
el gate vuelve a nombrar, uno a uno, los documentos que se quedaron atrás.

Un defecto propio, encontrado al estrenarlo: la expresión capturaba tres dígitos, así que leía
«1.437 fragmentos» como «437» y la desmentía. El gate era **ciego por encima de 999 y, peor, veía
mal**. Corregido con su prueba de regresión.

## Consecuencias

- Una cifra del repositorio en el corpus deja de poder envejecer en silencio: cuando cambie, el
  gate nombra el archivo y la subsección.
- **Añadir una decisión de arquitectura pasa a tener coste de contenido.** Es deliberado: si el
  corpus presume de llevar la cuenta, la cuenta se mantiene.
- El corpus queda empujado a decir el tamaño del índice como orden de magnitud donde no es el
  punto de la frase, y con precisión donde sí lo es.
- Lo que este gate NO vigila, y por qué: los «24 sprints» del pipeline entero. Es un conteo de
  las siete casas y su fuente vive en la planeadora, que es privada. No hay verdad que derivar
  aquí, y vigilarlo sería congelar un número a mano, que es justo lo que este gate existe para
  evitar.

## Alternativas descartadas

- **Un séptimo gate propio.** Habría comparado lo mismo con más código. Descartado por la tercera
  pregunta de la regla 14.
- **Exigir el tamaño del índice exacto, sin banda.** Circular, y por eso inservible: cada
  corrección mueve el número que se está corrigiendo.
- **Prohibir que el corpus cite cifras del repositorio.** Resolvía el mantenimiento y mataba el
  argumento. La promesa del sitio es «verifícalo tú mismo»; quitarle las cifras verificables es
  quitarle lo que lo hace comprobable.
