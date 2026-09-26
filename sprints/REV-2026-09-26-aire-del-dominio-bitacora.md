# Revisión 2026-09-26 — El aire bajo el dominio

> Rama `fix/aire-bajo-el-dominio`, un PR. Tras el merge del #50 (las herramientas en Skills), el
> dueño revisó el PDF con su dominio: _«se ve como te muestro en la imagen y está bien, solo que
> parece que el link de GitHub está muy pegado a la letra que acompaña la página de internet;
> sepáralo para que no se vea apretado»_.

## Gate ⭐ del dueño

**n10 (Skills: contenido y forma, y la columna de Skills del PDF) aprobada por el dueño el
2026-09-26**, con la captura del PDF con dominio delante. Las casillas de la guía viven en su
navegador, así que la aprobación queda registrada aquí.

## Lo que se cambió

En la cabecera del PDF, la línea de contacto empezaba **4 pt** debajo del rótulo gris del
dominio («En mi sitio encontrarás / CV interactivo · casos · chat»). Desde que la línea lleva los
dos correos (PR #47), llega a lo ancho hasta debajo del rótulo, y GitHub quedaba casi pegado a
«casos · chat». Ahora son **10 pt** (`DOMINIO.aireDebajo` en `scripts/generate-cv-pdf.mjs`).

Sin dominio (en local o en una preview sin `NEXT_PUBLIC_SITE_URL`) la cabecera no tiene bloque
y nada cambia. Los dos PDF siguen en dos páginas, con dominio y sin él (`cv-pdf.test.ts`).

Muestra antes/después, en los dos idiomas: `muestras/2026-09-26-aire-del-dominio/`.

**Sin gate nuevo:** es una medida visual que juzga el ojo del dueño (la d3 ⭐ de la guía, mejorada
en la v9.13), no una regla que un test pueda afirmar sin volverse circular. La regla 14 no aplica.

## Lighthouse en rojo en la primera corrida, y por qué no lo causó este PR

La primera corrida de la CI (8630009) cayó en `lighthouse`: `/es`, categoría rendimiento, **0,89**
de mediana contra un mínimo de 0,90. El rojo es del gate y por su propia aserción, así que no se
relanzó a ciegas: se midió.

Este PR solo toca el generador del PDF y documentos; `/es` no cambia. La sospecha razonable era el
#50, que sumó unas 45 herramientas a Skills, cada una un chip animado. Se midió `/es` en local con
`lhci collect`, 3 corridas, con el Skills de antes y de después del #50 (los mismos archivos,
restaurados al terminar):

| Skills          | Rendimiento        | LCP     | Nodos del DOM |
| --------------- | ------------------ | ------- | ------------- |
| antes del #50   | 0,91 · 0,91 · 0,91 | ~3,5 s  | 666           |
| después del #50 | 0,90 · 0,91 · 0,91 | ~3,5 s  | 789           |

Mediana igual: el #50 sumó 123 nodos sin mover la puntuación. Lo que deja a `/es` **sin margen**
es el LCP, que ya estaba: el elemento es el párrafo del hero (el resumen) y su tiempo es casi todo
**retraso de render (~3,1 s)**. `/es` vive entre 0,90 y 0,91, y una corrida de la CI puede caer en
0,89.

**Una suposición mía, corregida antes del commit:** el primer borrador de esta nota atribuía ese
retraso a la animación de entrada. Es falso: el resumen se pinta **estático, a propósito**
(`src/components/home/hero.tsx` lo dice: «cualquier animación retrasa su registro en el simulador
móvil»). La causa del retraso no se investigó en este PR.

**Deuda declarada, sin pago en este PR:** el retraso de render del resumen del hero, con su causa
por encontrar. El umbral no se afloja.

## Verificación

`pnpm test` completo · `lint` limpio · los dos PDF en 2 páginas con dominio y sin él.
