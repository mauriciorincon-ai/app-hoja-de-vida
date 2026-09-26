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

## Verificación

`pnpm test` completo · `lint` limpio · los dos PDF en 2 páginas con dominio y sin él.
