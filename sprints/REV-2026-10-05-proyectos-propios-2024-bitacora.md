# Revisión 2026-10-05: el puesto de proyectos propios desde 2024, y Vesting cerrado en la HOME

Rama `revision/proyectos-propios-2024` · PR de contenido sin sprint. Esta bitácora es también la
**respuesta al agente de hiring**, que leyó `main` en `d9e4dbe` y entregó un hallazgo con dos decisiones
del dueño:

1. el puesto «Ingeniero de IA Generativa · Proyectos propios» empieza en abril de 2024;
2. su texto de LinkedIn ya es definitivo, con cuatro preguntas (Q1–Q4) sobre cuánto de eso llega al sitio.

El dueño agregó una orden propia sobre Vesting en la HOME. Primero vino el plan; la construcción empezó
con su «construye». Todo va en español y en inglés.

## Las respuestas del dueño (2026-10-05), con sus palabras

| #                         | Respuesta                                                                                                                                                                    | Qué cambió                                                                                                                                                                                                                                  |
| ------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Fecha** (vía el agente) | «no dejemos esa posición desde el 2023 sino 2024, mismo mes pero del 2024»                                                                                                   | El periodo dice **«abril 2024 — hoy» / «April 2024 — today»**, y todo lo que fechaba el inicio en 2023 pasa a 2024.                                                                                                                         |
| **Vesting**               | «en la página principal en la sección trayectoria, en la posición Líder de Estrategia de Datos, pon 2024-2025 que indique cuándo terminé ese trabajo, si no aparece abierto» | `periodoEnLaHome: "2024 — 2025"` en ES y EN. El periodo real sigue en «2023 — 2025» para el PDF, /cv, el chat y el caso. El año grande de la línea sigue diciendo 2024.                                                                     |
| **Q1**                    | «Sale»                                                                                                                                                                       | Sale de la trayectoria la viñeta «Dos etapas». El hecho declarado de P9 se queda en `apps-pipeline`, que es donde el chat lo busca.                                                                                                         |
| **Q2**                    | «Sí, tu línea»                                                                                                                                                               | La descripción es su primera línea de LinkedIn: «Desarrollo proyectos propios de ingeniería e inteligencia artificial para explorar arquitecturas, agentes, sistemas RAG y mecanismos de evaluación.» En EN va la de su LinkedIn en inglés. |
| **Q3**                    | «Sí, sin totales»                                                                                                                                                            | Entran **Probeta DS** y el **pipeline de investigación** como viñetas, sin contar piezas.                                                                                                                                                   |
| **Q4**                    | «El sitio se queda»                                                                                                                                                          | Dash Agent AI conserva sus 693 pruebas y su 97,5 % de cobertura de líneas (agosto de 2026).                                                                                                                                                 |

## Lo que se hizo

### El puesto propio (`data/cv.es.yaml`, `data/cv.en.yaml`)

- **Periodo:** abril de 2024. El comentario del bloque registra el cambio y la regla nueva.
- **Descripción:** la línea del dueño (Q2). Es lo que imprime el PDF.
- **Viñetas:** son seis. Siguen nombrando las piezas sin contarlas:
  1. la hoja de vida interactiva y su chat, sin cambios;
  2. **Probeta DS** (nueva): «una aplicación del pipeline que ejecuta Python, pandas y scikit-learn en el navegador, sin enviar los datos a ningún servidor: compara algoritmos contra líneas base explícitas, evalúa sobre el conjunto de prueba sin fuga de datos y entrega una model card con sus límites». Cada hecho está en `analitica-predictiva#probeta-por-dentro`;
  3. «Otras aplicaciones del pipeline»: Dash Agent AI, con sus cifras (Q4), y Hablemos San. Solo cambió el arranque, porque ahora la precede Probeta DS;
  4. los agentes con criterios de aceptación. Salen de esta viñeta «los harnesses de investigación», que pasan a la siguiente;
  5. **el pipeline de investigación** (nuevo): «con los harnesses Design Science y Paper Computacional, que fija los criterios antes de medir, mide el vacío de la literatura y lleva cada estudio hasta un manuscrito listo para enviar». Lo respalda `las-investigaciones`: umbrales congelados antes de medir, vacío medido y manuscrito listo para enviar;
  6. la investigación propia (ARKHÉ, FORJA, las investigaciones y los tableros), sin cambios.
- **Lo que no entró:** la viñeta «Dos etapas» (Q1). Tampoco se copió el texto de LinkedIn: el sitio conserva su voz y su nivel de detalle.

**Sobre «cinco papers en siete líneas».** El brief lo señalaba. El corpus sí lo respalda: `las-investigaciones`
dice que de las siete líneas, «cinco de ellas tienen ya un paper con producción cerrada y listo para enviar».
En el plan escribí que el corpus solo respaldaba tres papers; eso estaba mal, porque tres son solo los del
harness computacional. La viñeta igual va sin la cifra por dos razones:

- el gate de totales del PR #61 caza «siete líneas»;
- los papers crecen, y una cifra escrita en el YAML caducaría.

Quien pregunte por la cifra la encuentra en el chat, que la contesta desde el corpus.

### Vesting en la HOME

- **El cambio:** `periodoEnLaHome` pasó de «2024» a «2024 — 2025» en ES y EN.
- **El año grande:** sale del primer año (`anioDe`), así que sigue diciendo 2024. Por eso el test «la línea de la HOME no repite año» no cambia.
- **El año grande repetido:** con las dos órdenes, el puesto propio («abril 2024 — hoy») y Vesting («2024 — 2025») quedan seguidos y los dos tienen 2024 como año grande. Es consecuencia de las órdenes: lo propio corre en paralelo a los empleos, y el test solo mira los empleos. La prueba ⭐ a10 lo describe para cuando el dueño decida mirarla.

### El corpus

- **`apps-pipeline` (ES y EN):** «Desde abril de 2024, en paralelo a mis empleos, planeo y diseño…» y «sin un artefacto de 2024 que lo pruebe». «Durante años los intenté en distintas plataformas» sigue siendo cierto.
- **`origenes` (ES y EN):**
  - Sale «en una empresa». Lo había agregado yo en el PR #61 para reconciliar el 2023 de lo propio con el agosto de 2023 de Vesting, y con 2024 sobra. La frase vuelve a decir lo que el dueño escribió antes de esa revisión: «la IA aplicada empieza en agosto de 2023 en Vesting».
  - La cláusula queda «por mi cuenta, desde abril de 2024 planeo y diseño las apps y los agentes que hoy publico».
  - «Tres años de los más de diez» no cambia, porque cuenta desde Vesting.
- **Barrido:** se barrieron con los párrafos unidos todas las frases del corpus, de los YAML y de `messages/` que tuvieran «2023» junto a palabras de lo propio. Solo quedan filas de tabla de Pichincha, Vesting y Fabric, que no son este puesto.
- **Lo que no se tocó:** Pichincha, Vesting, «ISO/IEC 42001:2023», la pregunta de mayo de 2022 a marzo de 2023, las bitácoras pasadas, la fila de historial del manual del 2026-10-04 y la entrada v9.17 de la guía. Esas dos últimas cuentan lo que pasó entonces.

## El gate nuevo (regla 14)

**«El puesto propio y el corpus dicen el mismo año de inicio»**, en `tests/unit/content.test.ts`, junto al de
totales. El año de inicio es el primero del `periodo` del hito `proyectos-propios`, en cada idioma.

- **(a) Sobre el hito:** ningún año de la descripción ni de las viñetas puede ser anterior a su inicio. Las ediciones de una norma («42001:2023») no cuentan.
- **(b) Sobre el corpus:** en `data/a-fondo/*.{es,en}.md`, con las líneas unidas, toda frase que fecha el inicio dice ese año. El gate reconoce dos formas: «desde (abril de)? AAAA … planeo y diseño», o «since … (have) planned and designed», y «proyectos propios / independent projects / own AI projects … desde/since AAAA».
- **Tests de juguete:** prueban tres cosas:
  - reconoce las formas en los dos idiomas y la línea donde empieza la frase;
  - no confunde «agosto de 2023 en Vesting» ni «Dash Agent AI en 2026»;
  - deja pasar la edición de una norma.

| Pregunta              | Respuesta                                                                                                                                                                                   |
| --------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **¿Lo viste fallar?** | Sí. Primero corrió sobre el árbol sin tocar, todo en 2023, y salió **verde**. Luego se cambió **solo** el `periodo` a 2024 en ES y EN, y salió el rojo natural de abajo.                    |
| **¿Lo viste correr?** | En `quality`, dentro de `content.test.ts`. En GitHub corre por primera vez con este PR.                                                                                                     |
| **¿Puede fallar?**    | Sí. Ningún gate leía las fechas del puesto ni las comparaba con el corpus: el de totales mira números de piezas, el de cifras mira el corpus en español, y el de casos excluye a este hito. |

**Rojo natural**, con solo el `periodo` cambiado:

```
(a) es: el puesto empieza en abril 2024 — hoy y su texto dice 2023 · 2023
    (la descripción «Desde 2023…» y la viñeta «Dos etapas: desde 2023…»)
(b) data/a-fondo/apps-pipeline.en.md:56: «Since April 2023, in parallel to my jobs, I have planned and designed» — el puesto empieza en 2024
    data/a-fondo/apps-pipeline.es.md:56: «Desde abril de 2023, en paralelo a mis empleos, planeo y diseño» — el puesto empieza en 2024
    data/a-fondo/origenes.en.md:1028: «since April 2023 I have planned and designed» — el puesto empieza en 2024
    data/a-fondo/origenes.es.md:443: «desde abril de 2023 planeo y diseño» — el puesto empieza en 2024
```

**Mutaciones sobre el árbol ya corregido.** Cada una salió roja por la aserción de su gate, con un solo
ofensor, y volvió a verde al restaurarla:

```
(b) apps-pipeline.es.md: «Desde abril de 2024» → «Desde abril de 2023»
    data/a-fondo/apps-pipeline.es.md:56: «Desde abril de 2023, en paralelo a mis empleos, planeo y diseño» — el puesto empieza en 2024
(a) cv.en.yaml, descripción: «Since 2023, I develop my own…»
    en: el puesto empieza en April 2024 — today y su texto dice 2023
```

El formateador del repo reacomodó de paso los saltos de línea de código del gate de totales (PR #61). Solo
cambió la presentación, no la lógica.

## El PDF en dos páginas

El puesto propio imprime solo su descripción, y la nueva ocupa dos renglones en vez de uno. Para medir se
rehízo `medir-pdf.sh`. Mide el fondo del texto con `pdftotext -bbox`, así que da unos 10 pt más que la
medición del PR #61, que miraba la posición del cursor. Sirve para comparar antes y después.

| Variante                         | Aire izquierdo antes | Después |
| -------------------------------- | -------------------- | ------- |
| ES sin dominio                   | 62,8 pt              | 51,6 pt |
| ES con el dominio largo del test | 33,4 pt              | 22,3 pt |
| EN sin dominio                   | 85,1 pt              | 74,0 pt |
| EN con el dominio largo del test | 55,8 pt              | 44,6 pt |

En las cuatro variantes sigue en dos páginas, y la descripción sale entera bajo «PROYECTOS PROPIOS». La
columna derecha no cambió. No hizo falta recortar nada.

## El banco de preguntas

`pnpm corpus:informe`: las **160** en verde. La sonda de recuperación (top-4) sobre el corpus:

| Pregunta                                                                                     | Top-4                                                                                                               |
| -------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------- |
| «¿Desde cuándo trabaja en proyectos propios de IA generativa?»                               | `trayectoria-1` («abril 2024 — hoy») primero, y `apps-pipeline-por-que-en-publico` («Desde abril de 2024…») segundo |
| «Since when has he worked on his own generative AI projects?»                                | `trayectoria-1` («April 2024 — today») primero, y `apps-pipeline-por-que-en-publico` («Since April 2024…») tercero  |
| «¿Qué proyectos propios de IA ha construido?» / «What independent AI projects has he built?» | `trayectoria-1` primero en los dos idiomas                                                                          |

Los únicos «2023» que aparecen en esos fragmentos son la edición de la norma ISO y el periodo de Vesting.

## Lo que quedó fuera, y por qué

- **Copiar el texto de LinkedIn:** se alinearon los hechos (la fecha, la descripción dictada por el dueño y las piezas nombradas). El sitio conserva su voz y su detalle.
- **«Cinco papers en siete líneas» y «seis tableros»:** los papers crecen, el gate de totales caza las líneas, y el chat contesta las cifras desde el corpus.
- **Hablemos San:** se queda en el sitio, con su decisión ya tomada. Salió solo de LinkedIn, porque su usuario es menor de edad.
- **«Sin que ningún dato salga del equipo» en Dash Agent AI:** fuera, por Q4. El sitio conserva la cifra medida.
- **Las filas de historial** del manual y de la guía que dicen «abril de 2023»: cuentan lo que pasó entonces.

## Verificación

| Qué                            | Resultado                                                                                                                                                                                                                                                                   |
| ------------------------------ | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `pnpm test`                    | 52 archivos y **1381** tests en verde, con cobertura (1378 de antes más los 3 del gate nuevo). Corrido con 4 procesos: con todos en paralelo, la carga de la máquina pasó de 35 y tres tests pesados ajenos al cambio vencieron sus 5 s. Solos tardan menos de 1 s y pasan. |
| `pnpm typecheck` · `pnpm lint` | limpios                                                                                                                                                                                                                                                                     |
| `pnpm corpus:informe`          | **160** en verde                                                                                                                                                                                                                                                            |
| `pnpm build`                   | 25 de 25 documentos indexados; 1526 fragmentos ES y 1519 EN; PDF ES y EN en 2 páginas                                                                                                                                                                                       |
| e2e en :3100                   | home, cv, chat, idioma, reduced-motion y axe: **310** en verde y 6 saltados, los que ya se saltaban                                                                                                                                                                         |
| HTML construido                | En `/es` y `/en`: «abril 2024 — hoy», Vesting «2024 — 2025», la descripción nueva, Probeta DS y el pipeline de investigación. Ningún «Dos etapas» ni «Desde 2023»                                                                                                           |
| Barrido de cero enlaces        | después del último `git add`                                                                                                                                                                                                                                                |
