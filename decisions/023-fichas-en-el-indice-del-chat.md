# ADR-023 — Las 32 fichas de la vitrina entran al índice del chat con peso 0,5; el top-k y el umbral se quedan donde estaban, medidos otra vez

- **Status:** accepted
- **Date:** 2026-09-20
- **Sprint:** fuera de sprint (rewrite del corpus a fondo v2, fase F4; bitácora
  `sprints/CONTENIDO-a-fondo-v2-bitacora.md`)

## Contexto

Hasta hoy el índice del chat se armaba con los YAML de la HOME y los documentos a fondo. Las
32 piezas de la vitrina —6 apps con brochure y complemento, 13 agentes, 7 investigaciones y 6
tableros— tienen fichas con promesa, cifras con procedencia, límites, «nunca» y bloques, y el
chat no las veía: cuando alguien preguntaba por una pieza concreta, la respuesta salía de la
prosa que el dueño escribió **sobre** la vitrina, no de la ficha. El plan de la auditoría (F4)
pedía indexarlas y recalibrar `TOP_K_CONTEXTO` y `UMBRAL_ON_TOPIC` midiendo.

Al indexarlas tal cual pasó lo previsible: 226 fragmentos nuevos, todos ricos en vocabulario, y
el banco de 131 preguntas de afuera bajó de 102/131 a 94/131 en el top-4. Las fichas le ganaban
el contexto a los documentos a fondo en preguntas que no eran sobre una pieza («¿Tiene posgrado?»
traía el _Asistente de Posgrado_; «¿Qué nivel tiene con Power BI?» traía el _Constructor de
tableros_).

## Decisiones

1. **Las fichas entran al índice, enteras.** `scripts/fichas-al-indice.mjs` produce, por pieza,
   un fragmento de presentación (`<frente>-<slug>`), uno de cifras, uno de límites y «nunca», y
   uno de bloques; por app, presentación, funcionalidades, cifras y límites
   (`pieza-apps-<slug>-…`). Todos citan hacia la ruta de la ficha (`/vitrina/<frente>/<slug>` o
   `/vitrina/apps/<slug>`), que existe en el catálogo de destinos. Se trocean con la misma
   `ventanasPorParrafo` del corpus a fondo (tope 180 palabras). Las fichas **no se editan** para
   que indexen mejor: son de otras casas.

2. **Un fragmento puede llevar `peso`, y las fichas llevan 0,5.** `chatChunkSchema` gana un campo
   opcional `peso` (0 < peso ≤ 1, ausente = 1) que el retriever aplica como `boostDocument` en
   los dos modos de búsqueda. La voz del dueño son los documentos a fondo; una ficha es evidencia
   de una pieza concreta, y debe ganar solo cuando la pregunta es sobre esa pieza. El número sale
   de medir el banco sobre el índice completo (494 fragmentos, k = 4):

   | Variante                          | Fuente en top-4 | De primeras | Preguntas con una ficha en el contexto |
   | --------------------------------- | --------------: | ----------: | -------------------------------------: |
   | sin fichas (268 fragmentos)       |         102/131 |          66 |                                      0 |
   | fichas a peso 1                   |          94/131 |          63 |                                     49 |
   | fichas a peso 0,7                 |         100/131 |          66 |                                     26 |
   | **fichas a peso 0,5**             |     **102/131** |      **67** |                                 **11** |
   | fichas a peso 0,35                |         103/131 |          67 |                                      8 |
   | solo el fragmento de presentación |         102/131 |          64 |                                     25 |

   A 0,5 el banco recupera exactamente el número que tenía sin fichas y once preguntas —las de la
   vitrina— siguen recibiendo una ficha. Bajar más ya no compra nada y las vuelve invisibles.

3. **`TOP_K_CONTEXTO` sigue en 4 y `UMBRAL_ON_TOPIC` en 1.** Medidos después de cerrar el
   vocabulario del corpus (fase F4 de la bitácora), sobre el índice completo:

   | k   | golden (75 preguntas propias) | banco (136 de afuera) | contexto medio |
   | --- | ----------------------------: | --------------------: | -------------: |
   | 1   |                         44/75 |                98/136 |   136 palabras |
   | 2   |                         59/75 |               120/136 |   267 palabras |
   | 3   |                         67/75 |               130/136 |   402 palabras |
   | 4   |                     **75/75** |           **136/136** |   537 palabras |
   | 5   |                         75/75 |               136/136 |   670 palabras |
   | 6   |                         75/75 |               136/136 |   809 palabras |

   Con 4, ninguna pregunta de los dos conjuntos se queda sin su fuente, y subir a 5 solo agranda
   el contexto un 25 %. Unas 540 palabras de contexto son del orden de 800 tokens por respuesta:
   con el modelo de Groq de hoy, muy por debajo del techo de US$20/mes a la tasa de uso de la
   vitrina. El umbral: la pregunta legítima que peor puntúa en modo estricto da 6,65, y ninguna de
   las 136 queda debajo de 1; las ajenas que el guardrail bloquea dan 0. No hay margen que ganar
   moviéndolo: subirlo no bloquea ninguna ajena más sin acercarse a las legítimas.

4. **El guardrail queda más permeable, y se declara.** Con las fichas, tres ajenas que antes se
   bloqueaban pasan al modelo: «mañana» (Hablemos San: «cada mañana»), «receta» (límites de
   ARKHÉ) y «mundial» (tablero de energía y clima). El banco las declara `pasa` con su `porque`;
   la garantía de corrección para ellas sigue siendo el prompt grounding-only, como ya decía
   ADR-010. Del corpus a fondo sí se retiraron «ganó», «receta» y «total mundial», que son prosa
   del dueño.

## Consecuencias

- El índice publicado crece de 28 a 254 fragmentos hoy (fichas más YAML; los documentos a fondo
  siguen en borrador hasta F5) y a 494 cuando se aprueben. `chat-index.es.json` pasa de ~30 KB a
  ~250 KB; el cliente solo lo descarga en modo de búsqueda local, cuando el proveedor falla.
- El golden set y el banco miden ahora contra el índice **con** fichas; un golden sin ellas medía
  contra un índice que no existe.
- Añadir una ficha a `content/<frente>/` la mete al chat en el siguiente build, sin prosa nueva.
  `tests/unit/fichas-al-indice.test.ts` vigila que cada pieza produzca fragmentos, que cada
  ancla exista y que ningún fragmento pase el tope.
- La comparación HOY/M2 del banco ya no puede exigir que el corpus grande bloquee **menos** ajenas
  que el chico: las que pasan lo hacen por fichas que viven en los dos índices. El test exige
  ahora «no más» y la cuenta declarada.
