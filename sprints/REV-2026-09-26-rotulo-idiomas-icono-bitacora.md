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

El que había, `src/app/favicon.ico`, era el de la plantilla de `create-next-app`: el triángulo de
Vercel, ahí desde el Sprint 001. Presenté tres opciones y el dueño eligió ninguna: _«la verdad no
tengo un logo, así que pon solo las letras HR en el estilo de letra que tenemos en la página»_.

**Qué quedó.** «HR» en Fraunces Medium, la letra de los títulos, en tres archivos que Next enlaza
solo, sin tocar el layout:

| Archivo                  | Qué es                                                             | Quién lo ve                              |
| ------------------------ | ------------------------------------------------------------------ | ---------------------------------------- |
| `src/app/icon.svg`       | las letras solas; tinta con tema claro, papel con el oscuro        | Chrome, Firefox, Edge, Safari            |
| `src/app/favicon.ico`    | 16 · 32 · 48 px sobre una loseta de papel redondeada               | navegadores viejos, Google, `/favicon.ico` |
| `src/app/apple-icon.png` | 180 px a sangre, papel con letras de tinta (iOS redondea)          | la pantalla de inicio del iPhone         |

El .ico y el .png llevan loseta porque no saben de qué color es la pestaña: unas letras de tinta
sobre una pestaña oscura desaparecen. El SVG sí lo sabe (`prefers-color-scheme`).

**Por qué trazos y no texto.** Un favicon se pinta aislado de la página y no puede cargar una fuente
web. Un `<text font-family="Fraunces">` caería en silencio a Times, que es justo lo que no pidió.

**De dónde salió el trazo** (para cambiar las letras algún día): el `.woff2` que next/font sirve
para Fraunces 500 (el de precarga, `.next/static/media/*-s.p.*.woff2` tras un build), abierto con
`fontkit` —dependencia de pdfkit, en el store de pnpm—: `font.layout("HR")`, cada glifo corrido
por su avance, volteado en Y (la fuente mide hacia arriba) y pasado a `toSVG()`. Caja: 3029 × 1400
unidades de 2000 por em. Ese trazo es el `d` de `icon.svg`.

**Cómo se regenera:** `pnpm iconos` (`scripts/generate-icons.mjs`). Lee el trazo de `icon.svg` y los
colores de `globals.css` (`--color-ink-0`, `--color-paper-0`), mide la caja de las letras en
Chromium (Playwright, que ya es dependencia de los e2e) y escribe los tres archivos. Es
determinista: dos corridas seguidas dan los mismos bytes.

**Verificado en producción local con `MANTENIMIENTO=on`** (build y arranque con la variable, como
un Redeploy): `/es`, `/en` y `/es/vitrina` responden 503 con los tres enlaces del ícono en la
cabecera; `/favicon.ico`, `/icon.svg` y `/apple-icon.png` responden 200 (el matcher del proxy deja
pasar lo que tiene punto). Muestra en `muestras/2026-09-26-icono/hr-final.png` (ignorada).

### Regla 14 — rojos del ícono, en este commit

Cinco aserciones nuevas en `tests/unit/iconos.test.ts` y una en `tests/e2e/home.spec.ts`.

**D. Vuelve el favicon de la plantilla** (se restaura el `.ico` del Sprint 001):

```
× el favicon ya no es el de la plantilla (el triángulo de Vercel)
AssertionError: src/app/favicon.ico volvió a ser el de create-next-app: corre `pnpm iconos`: expected '2b8ad2d33455a8f736fc3a8ebf8f0bdea8848…' not to be '2b8ad2d33455a8f736fc3a8ebf8f0bdea8848…'
× el .ico trae 16, 32 y 48 px, cada uno del tamaño que declara
AssertionError: no es un PNG: expected false to be true
```

**E. Un `<text>` en el SVG:**

```
× el SVG son trazos, no texto: un favicon no carga la fuente de la página
AssertionError: icon.svg usa <text>: el navegador lo pintaría en Times: expected '<svg xmlns=…' not to match /<text\b/
```

**F. Cambia la paleta y nadie regenera** (`--color-ink-0` a `#111111` en `globals.css`):

```
× el SVG pinta con los tokens vigentes: tinta en tema claro, papel en el oscuro
AssertionError: la tinta de icon.svg no es --color-ink-0: corre `pnpm iconos`: expected '<svg xmlns=…' to contain 'fill:#111111'
```

**G. El de iOS con otra medida** (el PNG de 48 px del `.ico` como `apple-icon.png`):

```
× el ícono de iOS mide 180 × 180
AssertionError: expected { ancho: 48, alto: 48 } to deeply equal { ancho: 180, alto: 180 }
```

**H. Una metadata tapa los íconos** (`icons: { icon: "/otro.png" }` en `generateMetadata` del layout;
build y e2e):

```
✘ /es enlaza las iniciales en SVG, el .ico y el de iOS, y los tres responden
✘ /en enlaza las iniciales en SVG, el .ico y el de iOS, y los tres responden
Error: expect(locator).toHaveCount(expected) failed — Expected: 1 · Received: 0
```

Este es el que el unit no puede ver: los archivos siguen ahí, correctos, y Next deja de enlazarlos.
**¿Puede fallar?** Sí, las cinco y la del e2e: cada una salió roja con su mutación y volvió a verde
al restaurar desde respaldo.

## 4. Las carpetas fuera del repo

Pedido del dueño, el mismo día: _«es terrible empezar a dejar carpetas por todo lado»_. En
`~/Documents/` quedaba la carpeta de trabajo del corpus «a fondo» (septiembre), que ya cumplió su
función. Se revisó archivo por archivo antes de tocarla:

- **Los 25 borradores de `a-fondo/`**: 20 son idénticos a un blob de la historia de git; los otros
  cinco difieren del commit `d52e914` solo en la limpieza mecánica de F0 (un encabezado repetido,
  una llave y una comilla sueltas), y los dos párrafos que parecían faltar están en el repo actual.
  **Borrados.**
- **Los tres cuerpos de PR**: publicados en GitHub en su versión final (#34, #35 y su gemelo #36, #38). **Borrados.**
- **Lo que no existe en otro lado**: la hoja de vida fusionada (con teléfonos), las sugerencias de
  complementos y la auditoría (plan, respuestas del dueño, libro de hechos, preguntas y los cuatro
  informes). **Destino: `privado/`, dentro del repo.**

`privado/` está en `.gitignore`, y el hook `pre-commit` frena además un `git add -f` sobre ella: el
ignore no ve un `-f`, y el repo es público.

**I. El rojo del hook** (un archivo inocuo en `privado/`, `git add -f` y commit):

```
privado/ NO se versiona (repo publico): commit bloqueado.
privado/demo-hook.md
Sacalo del commit con: git reset -- privado/
```

El commit no ocurrió (HEAD siguió en `69873d0`). Se deshizo con `git reset` y se borró el archivo.

**Lo que quedó en manos del dueño:** el control de permisos del agente no dejó copiar su hoja de
vida al directorio de un repo público, y está bien que no lo deje. Mover esos archivos a `privado/`
y borrar la carpeta vacía es un paso suyo.
