# Revisión 2026-09-26 — El rótulo del dominio, los idiomas del mantenimiento y el ícono

> Rama `revision/pdf-mantenimiento-icono`, un PR. El dueño probó el modo mantenimiento en su
> dominio real (merge del #45 con `MANTENIMIENTO=on`), descargó el PDF sin problema y pidió tres
> cosas.

## Lo que pidió, textual

1. _«En el PDF, mira cómo aparece mi página de internet en la esquina superior derecha y un texto
   debajo con CV interactivo · casos · chat. Quiero que este texto de abajo diga algo de que allí
   encontrarás, y ahí sí CV interactivo · casos · chat, pero también quiero que este texto lo
   centres respecto al recuadro azul.»_
2. _«En esta página de mantenimiento, que se pueda poner algo de cambiar a inglés […] o mínimo que
   puedan descargar mi hoja de vida en inglés.»_
3. _«En el logo miniatura que aparece en mi dominio oficial aparece el logo de Vercel.»_

## 1. El rótulo bajo el dominio

Dos líneas, en gris, **centradas respecto al recuadro azul**: «En mi sitio encontrarás» / «CV
interactivo · casos · chat» (EN: «On my site you'll find» / «Interactive CV · cases · chat»).
El centrado es una función pura, `inicioCentrado`. Si una línea es más ancha que el recuadro, se
centra igual y se corre lo justo para no pasar el margen derecho. El PDF sigue en dos páginas,
con y sin dominio.

## 2. Los dos idiomas en mantenimiento

- **ES / EN** arriba a la derecha, la misma píldora del encabezado del sitio, como enlace a `/en`
  o `/es`. El proxy sirve la página de mantenimiento de ese idioma.
- Bajo el botón principal, **el CV en el otro idioma**: «CV in English (PDF)» en la página en
  español y «CV en español (PDF)» en la de inglés, con `lang` y `hrefLang`.
- La ruta del PDF la armaban dos componentes a mano y ahora la arman tres. Pasa a una sola función
  (`src/lib/cv-pdf.ts`, `rutaDelPdf`), y un test exige que coincida con el archivo que genera el
  build.

Verificado en una build de producción con `MANTENIMIENTO=on`: 503 en ES, EN y móvil; axe sin
violaciones; los enlaces apuntan a donde deben (`ES/EN → /en`, `CV in English (PDF) →
/cv/Henry-Rincon-CV-EN.pdf`) y los dos PDF responden 200. Capturas en
`muestras/2026-09-26-mantenimiento/` (ignorada).

## Regla 14 — rojos en este commit

**A. El rótulo centrado** (vuelve la alineación a la derecha):

```
× una línea más angosta que el bloque queda con el mismo aire a cada lado
AssertionError: expected 450 to be 425
```

**B. El rótulo dice qué se encuentra** (el PDF sin la primera línea):

```
× el dominio encabeza, cierra el perfil, firma cada página y lleva al sitio en su idioma
AssertionError: expected 'Henry Mauricio Rincón Caro …' to contain 'En mi sitio encontrarás CV interactiv…'
```

**C. El enlace y el archivo no se separan** (el build renombra el PDF en inglés):

```
× es la del archivo que genera el build, en los dos idiomas
AssertionError: expected '/cv/Henry-Rincon-CV-EN.pdf' to be '/cv/Henry-Rincon-CV-EN-v2.pdf'
```

Si esto pasa en producción, el botón «Descargar mi CV», que es el único salvavidas en
mantenimiento, da 404.

## 3. El ícono

Pendiente de la elección del dueño entre tres opciones (`muestras/2026-09-26-icono/opciones.png`).
El que hay hoy, `src/app/favicon.ico`, es el de la plantilla de `create-next-app`, el triángulo de
Vercel, y está ahí desde el Sprint 001.
