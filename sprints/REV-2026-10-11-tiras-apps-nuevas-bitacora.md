# Revisión 2026-10-11 — Las tiras de las cuatro apps nuevas

> Rama `mejora/tiras-apps-nuevas`, un PR, fuera de sprint. Tras el merge del PR de contenido #73
> (AngelGhost, planlang, Big-D y HackGuard entran al escaparate) el dueño vio en producción que sus
> tarjetas mostraban «un recuadro sin nada» donde las otras seis llevan una imagen. Aprobó la
> recomendación: arreglar el marco y dibujar las cuatro tiras en el mismo PR.

## 1. Qué era el recuadro

La muestra de cada app (`src/components/vitrina/muestra.tsx`) enmarca la **tira**: un SVG
esquemático de esta casa (`src/components/vitrina/maquetas/<slug>.tsx`), no una captura. El
registro devolvía `null` para un slug sin dibujo —como su comentario prometía, «jamás un
placeholder»— pero el `div` que enmarca la tira se pintaba igual: borde, fondo y relleno vacíos.
Existía `tieneMaqueta(slug)` y nadie la usaba. Ningún test cubría la presencia de la tira ni el
marco, por eso el #73 pasó la CI con las cuatro cajas vacías.

## 2. Qué cambia

- **Cuatro tiras nuevas** con la gramática común (viewBox 320×92, cuatro columnas en 40 · 120 ·
  200 · 280, rótulos mono ≤ 13 caracteres, trazos 1.5, clases `mq-*`):
  - **AngelGhost** (`copiloto-consultor`): LA PREGUNTA · SOLO TÚ · TU EVIDENCIA · NADA QUEDA.
  - **planlang**: EL CONTRATO · EL AGENTE · LOS CASOS · LA BRECHA.
  - **Big-D**: MISMO MAPA · CON FECHA · QUIÉN GANA · CON QUÉ PESO.
  - **HackGuard**: EL CATÁLOGO · 4 PREGUNTAS · CONTROL FALLA · CON SU MARCO.
- **Sin tira no hay marco:** la muestra pregunta `tieneMaqueta` antes de pintar la caja.
- **Gate nuevo** `tests/unit/maquetas.test.tsx`: toda app con export tiene tira (nombra las que
  faltan), cada tira sigue la gramática (viewBox, `role="img"` con descripción, cuatro rótulos en
  su columna y ≤ 13 caracteres), la muestra de una app sin tira no pinta el marco y la de una con
  tira sí.
- **e2e** (`tests/e2e/vitrina.spec.ts`): el escaparate cuenta tantas `svg.maqueta` como exports.
- Documentos: `design-system.md` (regla y tope de rótulo), bundle `design-sync/` (nota de la
  muestra), `docs/MANUAL-DE-USO.md` (viñeta «Su tira» + historial), `docs/GUIA-DE-PRUEBA.html`
  v9.24 (k15 reescrita con las listas de hoy y la tira de cada tarjeta → `k15f`; ⭐ no suma).

## 3. Los rojos (regla 14, en el mismo commit)

| Gate                                                           | Cómo se puso en rojo                                                 | Qué dijo                                                                                                    |
| -------------------------------------------------------------- | -------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------- |
| `maquetas.test.tsx` «toda app con export tiene su tira»        | correrlo antes de dibujar las tiras                                  | `apps sin tira: big-d, copiloto-consultor, hackguard, planlang`                                             |
| `maquetas.test.tsx` «la tira de «%s» sigue la gramática común» | ídem (las cuatro sin tira)                                           | `expected '' to contain 'viewBox="0 0 320 92"'` en las cuatro                                               |
| `maquetas.test.tsx` «una app sin tira no pinta el marco vacío» | correrlo antes de tocar `muestra.tsx`                                | `expected '<article data-muestra-slug="sin-tira"…' not to contain 'aria-hidden="true" class="overflow-hi…'` |
| `vitrina.spec.ts` «cada una con su tira dibujada»              | correrlo contra el build anterior a las tiras (`next start -p 3100`) | `locator('[data-muestra-slug] svg.maqueta') Expected: 10 Received: 6`                                       |

Tras el cambio: 6 fallos → 0 en el unitario y 1 → 0 en el e2e, sin tocar los tests.

## 4. Verificación

`pnpm vitest run` 1480/1480 · `pnpm typecheck` · `pnpm lint` · `pnpm build` (los dos avisos de CSS
ya estaban en `main`) · e2e completo en :3100 contra el build nuevo: 489 pasadas, 33 saltadas (las
mismas de siempre) · `pnpm audit --audit-level high` limpio · barrido de cero enlaces tras el
último `git add`.

Capturas del bloque Profesionales a 1280 (posiciones 4 de 7 y 6 de 7, donde viven las cuatro):
`sprints/REV-2026-10-11-tiras-capturas/`.

## 5. Segunda parte: las cuentas de la guía y del manual

Después del merge del #75, el dueño preguntó si los documentos de referencia estaban al día «con
tantos cambios últimos». Esta parte va en un PR propio: el primer intento la empujó a la rama del #75
ya mergeado y reescribió su descripción para anunciarla; la descripción se restauró a lo que de
verdad entró. No lo estaban: el #73 llevó la vitrina a 10 apps, 15 agentes y 38 fichas, y solo
el corpus del chat se alineó, porque solo él tenía gate de cifras (ADR-025). La guía de prueba y el
manual seguían con «Apps 6 · Agentes 13», «las 32 fichas», «recorre las seis».

- **Guía v9.25:** k1 y n4 (cuentas del portal y de la HOME), m1 y el pie del bloque M, g1 (siete
  apps con roadmap; AngelGhost, Big-D y HackGuard aún sin él), l5 ⭐ y o12 al día; sus casillas pasan
  a k1b, n4b, m1b, g1b, l5b y o12b. **Nueva k17** (sin ⭐): la ficha sin proceso no tiene «Cómo
  funciona» ni deja hueco. La introducción deja de nombrar el Sprint 008 y sale su aviso, que ya no
  aplicaba. Las ⭐ siguen en 43.
- **Manual:** cuentas del portal y del chat, y una viñeta que explica el gate nuevo.
- **CLAUDE.md:** `data/fichas/` ya no dice que todo complemento es de CV Viva.
- **BLUEPRINT:** sin cambios de infraestructura; su encabezado decía «Última actualización:
  2026-07-20» con historial hasta el 2026-09-26, y ahora dice esa fecha.
- **Gate nuevo** `tests/unit/documentos-cuentas.test.ts`: doce anclas, cada una una frase con una
  cuenta; exige que la frase exista y que cada número sea el del disco (`verdadesDelSitio()` del
  gate del corpus, más las apps con roadmap). No mira los historiales.

| Gate                                           | Cómo se puso en rojo                                     | Qué dijo                                                                                                                                                                                                                                                                                                                                                                               |
| ---------------------------------------------- | -------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `documentos-cuentas.test.ts` (10 de 12 anclas) | correrlo contra la guía y el manual de antes del arreglo | `guía dice «Apps 6 · Agentes 13 · Investigaciones 7 · Tableros 6»: expected [ 6, 13, 7, 6 ] to deeply equal [ 10, 15, 7, 6 ]`, y así las otras nueve, cada una con su frase: «seis tarjetas», «las seis fichas seguidas», «Recorre las seis» (7), «Las 26 fichas» (28), «13 productos publicadas» (15), «Son las 32 fichas» (38), y en el manual «6 piezas», «13 piezas» y «32 fichas» |

Las dos anclas que pasaron (investigaciones y tableros del manual) eran ciertas. Tras el arreglo: 12
de 12, sin tocar el test. Suite completa: 1492 pasadas.

## 6. Lo que queda fuera

Las **capturas reales** de las fichas (`public/vitrina/*.webp`, dentro de la ficha técnica) siguen
sin existir para las cuatro apps nuevas; ahí el componente se oculta limpio y no hay hueco. Son
trabajo aparte: exigen correr cada app en local y AngelGhost es de escritorio.
