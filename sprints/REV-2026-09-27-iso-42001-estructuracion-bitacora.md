# Revisión 2026-09-27 — ISO/IEC 42001: estructuración, no implementación

Rama `revision/iso-42001-estructuracion` · PR aparte, sin sprint. Responde al hallazgo del harness de hiring
sobre `main` 1237bfe.

## El hallazgo

El perfil del CV decía «la estrategia y la implementación de ISO/IEC 42001» en español y «the ISO/IEC 42001
implementation» en inglés. El corpus dice otra cosa: el sistema de gestión de IA de la Fundación CTIC está en
estructuración, y el dueño no lo declara «completamente implementado» hasta que pueda demostrarse
formalmente (`fundacion-ctic.es.md`, líneas 96, 128 y 130). **Veredicto: real.**

El harness propuso la redacción, y se aplicó tal cual en los dos idiomas.

## El barrido de la clase

Se buscó «implement…» a menos de cien caracteres de «42001» en `data/`, `src/`, `content/vitrina/`, la guía y
el BLUEPRINT, con los párrafos unidos para no perder frases partidas en líneas.

| Dónde                                        | Qué dice                                               | Veredicto                                   |
| -------------------------------------------- | ------------------------------------------------------ | ------------------------------------------- |
| `data/cv.es.yaml`, perfil                    | «la implementación de ISO/IEC 42001»                   | Corregida (el hallazgo)                     |
| `data/cv.en.yaml`, perfil                    | «the ISO/IEC 42001 implementation»                     | Corregida (el hallazgo)                     |
| `rag-y-el-chat.es.md`, línea 219             | «y que formalicé implementando ISO/IEC 42001»          | Corregida: la misma afirmación, en el chat  |
| `rag-y-el-chat.en.md`, línea 439             | «which I formalized by implementing ISO/IEC 42001»     | Corregida: la misma afirmación, en el chat  |
| `fundacion-ctic.{es,en}.md`, líneas 106/205  | «la implementación empieza igual: por el contexto»     | Se queda: describe cómo arranca una norma   |

## Frases tocadas

| Archivo                | Antes                                                  | Después                                                                          |
| ---------------------- | ------------------------------------------------------ | -------------------------------------------------------------------------------- |
| `data/cv.es.yaml`      | «la estrategia y la implementación de ISO/IEC 42001»   | «la estrategia y la estructuración del sistema de gestión bajo ISO/IEC 42001»    |
| `data/cv.en.yaml`      | «the strategy and the ISO/IEC 42001 implementation»    | «the strategy and the structuring of the ISO/IEC 42001 management system»        |
| `rag-y-el-chat.es.md`  | «y que formalicé implementando ISO/IEC 42001»          | «y que hoy formalizo al estructurar el sistema de gestión bajo ISO/IEC 42001»    |
| `rag-y-el-chat.en.md`  | «which I formalized by implementing ISO/IEC 42001»     | «which I am formalizing today by structuring the ISO/IEC 42001 management system» |

El perfil es la primera frase del PDF, así que el PDF cambia con él.

## El gate (regla 14)

`scripts/ctic-aproximadas.mjs` gana una segunda lista, `AFIRMACIONES_VETADAS_DE_CTIC`, con su motor
`problemasDeAfirmacionesDeCtic`, y `tests/unit/ctic-aproximadas.test.ts` la aplica sobre los mismos archivos que
el gate de cifras: el corpus en los dos idiomas y los YAML del sitio. Veta la implementación DE la norma como
hecho, en cuatro formas: «implementación de ISO/IEC 42001», «implementé/implementando ISO/IEC 42001»,
«ISO/IEC 42001 implementation» e «implemented/implementing ISO/IEC 42001». No veta la palabra: «la
implementación empieza igual» sigue en pie. Si el día llega y puede demostrarse, la lista se vacía con la
misma decisión del dueño que lo declare.

- **¿Lo viste fallar?** Sí, dos veces.
  - Contra los cuatro archivos tal como están en `main`: **4 ofensores**, exactamente los de la tabla, y
    ninguno en el documento de CTIC.
  - Mutación sobre el árbol corregido: se volvió a escribir «the ISO/IEC 42001 implementation» en
    `cv.en.yaml`. El test salió rojo por su aserción, con un solo ofensor:

    ```
    · data/cv.en.yaml:23: «the ISO/IEC 42001 implementation» — «the ISO/IEC 42001 implementation» → «the structuring of the ISO/IEC 42001 management system».
    ```

    Restaurado el archivo, volvió a verde.
- **¿Lo viste correr?** Corre en la suite unitaria del job `quality`. La aserción corre por primera vez en
  GitHub con este PR.
- **¿Puede fallar?** Sí: el gate de normas solo mira el año de la edición y el de cifras solo mira números.
  Ninguno leía el verbo.
- **Sabe aprobar:** un test de juguete con la redacción nueva y la frase de cómo arranca una norma da cero.

## Un test que dependía del salto de línea

`tests/integration/cv-pdf.test.ts` buscaba «Más en mi sitio» con espacios literales. El perfil nuevo es más
largo y el PDF parte la línea justo entre «Más» y «en», así que el test cayó sin que el contenido estuviera
mal. Las tres aserciones de ese anuncio aceptan ahora cualquier espacio entre palabras, como ya hacía la del
chat. Siguen exigiendo las mismas palabras en el mismo orden.

## Verificación

| Qué                                   | Resultado                                           |
| ------------------------------------- | --------------------------------------------------- |
| `pnpm test`                           | 52 archivos, 1359 tests en verde                    |
| Gate de CTIC                          | 9 tests en verde, tres nuevos                       |
| `pnpm corpus:informe`                 | 158 en verde                                        |
| `pnpm build`                          | 25 de 25 documentos indexados                       |
| e2e home, cv y chat                   | 74 en verde, 6 saltados que ya lo estaban           |
| El perfil en el HTML construido       | la redacción nueva en `/es` y en `/en`              |
| Barrido de cero enlaces               | limpio, corrido después del último `git add`         |
