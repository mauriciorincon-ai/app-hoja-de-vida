# Revisión 2026-09-27 — residuos de CTIC tras el PR #57

Rama `revision/residuos-ctic` · PR aparte, sin sprint. Responde al barrido del harness de hiring sobre
`main` a69f274, que encontró cifras internas de la Fundación CTIC todavía exactas después de que el PR #57
las pasara a aproximadas, y dos menores.

## Resumen

| #   | Hallazgo del harness                                                    | Veredicto | Qué se hizo                                                                  |
| --- | ----------------------------------------------------------------------- | --------- | ---------------------------------------------------------------------------- |
| 1   | Logro «42 productos analíticos en uso en salud», ES y EN                | Real      | Valor 40 con sufijo «+»: la HOME muestra «40+», como el «50+» de Pichincha   |
| 2   | La tabla de cifras de `fundacion-ctic`, entera, ES y EN                 | Real      | Las diez celdas en forma aproximada, las dos tablas realineadas              |
| 3   | `fundacion-ctic.en.md`: 12 opportunities, 42 products, 15 processes, 23 | Real      | Corregidas, y el gate encontró seis más en ese mismo archivo                 |
| 4   | `gobierno-de-datos-y-de-ia.es.md`: «y 15 en construcción»               | Real      | «y el resto en construcción»                                                 |
| 5   | `gobierno-de-datos-y-de-ia.en.md`: «one of the 42»                      | Real      | Corregida, y el gate encontró «With 23 instruments» en el mismo archivo      |
| 6   | `origenes.en.md`: «8 are finished and 15 are under construction»        | Real      | «a third are finished and the rest are under construction»                   |
| 7   | `rag-y-el-chat`: «Con 25 documentos son 75 preguntas»                   | Real      | 77, en ES y EN, y la frase ya no dice «las tres preguntas» de cada documento |
| 8   | `como-trabajo`: el ejemplo de Cafam aún enumera los cargos              | Real      | «más de 15 decisores directivos», en ES y EN                                 |

El harness pidió barrer la clase por patrón y no por su lista. El barrido encontró **47 residuos** en
español e inglés, no once. La lista completa está en «Frases tocadas».

## Por qué el barrido del PR #57 los dejó

1. **Leía línea a línea.** El inglés del corpus está partido a unas cien columnas. «identify 12» y
   «artificial intelligence opportunities» quedan en líneas distintas, y el patrón no los unía.
2. **Las tablas no tenían sustantivo.** La celda dice «42» y el sustantivo está dos celdas a la
   izquierda. Un patrón «número + sustantivo» no puede verlas.
3. **El logro no era prosa.** `valor: 42` y su etiqueta viven en dos líneas de YAML.
4. **Faltaba un gate.** La regla nueva del dueño quedó escrita en el manual, pero nada fallaba si se
   rompía. Este PR la vuelve un test.

## Los dos gates (regla 14)

### Gate nuevo: `tests/unit/ctic-aproximadas.test.ts`

Motor puro en `scripts/ctic-aproximadas.mjs`. Barre lo que el visitante o el chat pueden leer: el
corpus `data/a-fondo/*.md` en los dos idiomas y los YAML de `data/` y `data/fichas/`. Las bitácoras y el
manual no se barren, porque cuentan la conversión «42 → más de 40» y esa historia tiene que quedar.

Lee el texto con los saltos de línea como espacios, así que caza la cifra partida en dos líneas y aun
así nombra la línea. Juzga las filas de tabla aparte, solo en archivos que nombran a CTIC. No juzga los
números de otras experiencias que comparten sustantivo: «hasta 23 agentes» de Vesting, «12
profesionales» de Pichincha, «un equipo de 20» de Cafam.

- **¿Lo viste fallar?** Sí, de forma natural, antes de corregir nada: **47 ofensores**, todos reales.
  Nombró archivo y línea de cada uno. El primer intento dejó escapar la fila «dashboards» del inglés,
  porque el patrón consumía la barra de la celda siguiente; se corrigió con una anticipación y el
  conteo subió de 46 a 47.
- **Mutación sobre el árbol corregido:** en `origenes.en.md` se volvió a escribir «8 are finished», en
  una línea partida. Salió rojo con un solo ofensor, por la aserción del gate:

  ```
  · data/a-fondo/origenes.en.md:875: «8 are finished» — 8 instrumentos terminados → «un tercio». Toda cifra de la Fundación CTIC se escribe aproximada: CTIC no autorizó las exactas.
  ```

  Restaurado el archivo, volvió a verde.

- **¿Lo viste correr?** Corre en la suite unitaria de la CI, en el job `quality`. Este PR es su
  primera corrida en GitHub, así que no hay histórico para afirmar regresión ni no-regresión.
- **¿Puede fallar?** Sí: ningún otro gate mira cifras de CTIC. El gate de cifras del corpus no tiene
  un concepto de CTIC, porque no hay verdad que derivar del repositorio.
- **Sabe aprobar:** cinco tests de juguete. Aprueba las formas aproximadas en los dos idiomas, calla
  los números de otras empresas, caza la cifra partida con su línea, caza la fila de tabla y deja
  pasar la misma tabla aproximada, y caza el logro escrito exacto.

### Concepto nuevo en el gate de cifras: `preguntas-del-golden-set`

El PR #56 creó el concepto `preguntas-propias` para que el corpus no volviera a decir un tamaño viejo
del golden set. Su sustantivo era «preguntas propias», y la frase «Con 25 documentos son 75 preguntas»
no lo lleva. Por eso el 75 sobrevivió.

El concepto nuevo usa el sustantivo «preguntas» y exige delante, en los 40 caracteres previos, la
cuenta de documentos o el nombre del golden set. El sustantivo solo sería demasiado ancho: el corpus
tiene «las cinco preguntas» del gobierno de datos y «tres preguntas» de un análisis. La verdad es la
misma de `preguntas-propias`, derivada de las `preguntas_de_prueba` de los documentos.

- **¿Lo viste fallar?** Sí, de forma natural, antes de corregir: un solo ofensor, el del hallazgo 7.

  ```
  · data/a-fondo/rag-y-el-chat.es.md · «evaluacion-del-rag»: dice «75 preguntas» y las preguntas del golden set (las `preguntas_de_prueba` de los documentos) son 77 (data/a-fondo/*.es.md · `preguntas_de_prueba`). Se admite: hoy son 77.
  ```

- **¿Lo viste correr?** Corre dentro de `a-fondo-coherencia.test.ts`, que ya corría en la CI.
- **¿Puede fallar?** Sí, lo demuestra el rojo natural: `preguntas-propias` no casaba esa frase.
- Como todo el gate de cifras, lee solo el español. El inglés se corrigió a mano y se revisó con el
  mismo barrido.

## Frases tocadas

Solo cambia la cifra o la palabra que la acompaña. Ninguna frase se reescribió entera salvo la del
hallazgo 8, que el dueño ya había fijado con otras palabras.

### Sitio

| Archivo                    | Antes                                  | Después                                  |
| -------------------------- | -------------------------------------- | ---------------------------------------- |
| `data/cv.es.yaml`          | logro `valor: 42` productos analíticos | `valor: 40`, `sufijo: "+"` (se ve «40+») |
| `data/cv.en.yaml`          | logro `valor: 42` analytics products   | `valor: 40`, `sufijo: "+"` (se ve «40+») |
| `docs/GUIA-DE-PRUEBA.html` | «las cifras grandes (10, 27, 42…)»     | «(10, 27, 40+…)»                         |

### `fundacion-ctic.es.md`

| Antes                                                           | Después                                                                                                                          |
| --------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------- |
| «Hoy 2 de las 3 iniciativas priorizadas tienen ese expediente…» | «Hoy las primeras de las iniciativas priorizadas tienen ese expediente…»                                                         |
| «los instrumentos institucionales —23 a la fecha—»              | «—más de 20 a la fecha—»                                                                                                         |
| «que hoy tienen completo 2 de las 3 iniciativas priorizadas»    | «que hoy tienen completo las primeras de las iniciativas priorizadas»                                                            |
| Tabla: 42 · 23 · 20 · 15 · 10 · 12 · 7 · 3 · 2 · 8 · 15         | más de 40 · más de 20 · unos 20 · unos 15 · una decena · más de 10 · la mitad · unas pocas · las primeras · un tercio · el resto |

### `fundacion-ctic.en.md`

| Antes                                                                       | Después                                                                                                                        |
| --------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------ |
| «some 20 leaders of 15 administrative and clinical processes» (l. 64)       | «some 20 leaders of some 15 administrative…»                                                                                   |
| «identify 12 artificial intelligence opportunities and formally…»           | «identify more than 10 artificial intelligence opportunities…»                                                                 |
| «Today 2 of the 3 prioritized initiatives have that file…»                  | «Today the first ones among the prioritized initiatives have that file…»                                                       |
| «the institutional instruments —23 to date—»                                | «—more than 20 to date—»                                                                                                       |
| «the work today comprises 23 institutional instruments»                     | «comprises more than 20 institutional instruments»                                                                             |
| «identify 12 artificial intelligence opportunities, formally evaluate half» | «identify more than 10 artificial intelligence opportunities…»                                                                 |
| «They are 42 analytical products —half of them dashboards—»                 | «They are more than 40 analytical products…»                                                                                   |
| «within the institution: 42 products, of which half are dashboards»         | «within the institution: more than 40 products…»                                                                               |
| «and the 10 analysis plans the processes follow today»                      | «and the ten or so analysis plans…»                                                                                            |
| «supporting some 20 leaders of 15 administrative and clinical»              | «supporting some 20 leaders of some 15…»                                                                                       |
| «and support 20 leaders or owners of 15 administrative»                     | «and support some 20 leaders or owners of some 15 administrative»                                                              |
| «currently comprises 23 institutional instruments among…»                   | «currently comprises more than 20 institutional instruments…»                                                                  |
| Tabla: 42 · 23 · 20 · 15 · 10 · 12 · 7 · 3 · 2 · 8 · 15                     | more than 40 · more than 20 · some 20 · some 15 · some ten · more than 10 · half · a few · the first ones · a third · the rest |

### Otros documentos

| Archivo                           | Antes                                                                                                                                                                  | Después                                                                                                        |
| --------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------- |
| `gobierno-de-datos-y-de-ia.es.md` | «un tercio de los instrumentos terminados y 15 en construcción»                                                                                                        | «… y el resto en construcción»                                                                                 |
| `gobierno-de-datos-y-de-ia.en.md` | «enters one of the 42 analytics products»                                                                                                                              | «enters one of the more than 40 analytics products»                                                            |
| `gobierno-de-datos-y-de-ia.en.md` | «With 23 instruments in the Fundación CTIC management system»                                                                                                          | «With more than 20 instruments…»                                                                               |
| `origenes.en.md`                  | «8 are finished and 15 are under construction»                                                                                                                         | «a third are finished and the rest are under construction»                                                     |
| `fabric-en-la-practica.es.md`     | «sin que 75 usuarios vean una cifra a medias»                                                                                                                          | «sin que unos 75 usuarios vean…»                                                                               |
| `fabric-en-la-practica.en.md`     | «some 20 leaders of 15 processes»                                                                                                                                      | «some 20 leaders of some 15 processes»                                                                         |
| `fabric-en-la-practica.en.md`     | «without 75 users seeing a half-baked figure»                                                                                                                          | «without some 75 users seeing…»                                                                                |
| `rag-y-el-chat.es.md`             | «declara en su cabecera las tres preguntas que debe contestar»                                                                                                         | «las preguntas que debe contestar —tres en cada uno y cinco en este—»                                          |
| `rag-y-el-chat.es.md`             | «Con 25 documentos son 75 preguntas.»                                                                                                                                  | «Con 25 documentos son 77 preguntas.»                                                                          |
| `rag-y-el-chat.en.md`             | «declares in its header the three questions it must answer»                                                                                                            | «the questions it must answer —three in each one and five in this one—»                                        |
| `rag-y-el-chat.en.md`             | «With 25 documents that is 75 questions.»                                                                                                                              | «With 25 documents that is 77 questions.»                                                                      |
| `como-trabajo.es.md`              | «tuvo quince usuarios con nombre de cargo —las direcciones de medicamentos, de TI, del proyecto y del centro de distribución, y los coordinadores y jefes del centro—» | «tuvo más de 15 decisores directivos entre sus usuarios, de la dirección a las coordinaciones y jefaturas»     |
| `como-trabajo.en.md`              | «had fifteen users with job titles —the directorates of medicines, IT, the project and the distribution center, and the center's coordinators and heads—»              | «had more than 15 senior decision-makers among its users, from the directorates to the coordinators and heads» |

## Verificación

| Qué                                 | Resultado                                                   |
| ----------------------------------- | ----------------------------------------------------------- |
| `pnpm test`                         | 52 archivos, 1359 tests en verde (seis nuevos)              |
| `pnpm corpus:informe`               | 158 en verde; el banco no se movió con los cambios de prosa |
| `pnpm build`                        | 25 de 25 documentos indexados; 1523 fragmentos ES y 1515 EN |
| e2e home, chat, cv y reduced-motion | 80 en verde, 6 saltados que ya lo estaban                   |
| El logro en el HTML construido      | «40+ productos analíticos en uso en salud»                  |
| Barrido de cero enlaces             | limpio, corrido después del último `git add`                |
