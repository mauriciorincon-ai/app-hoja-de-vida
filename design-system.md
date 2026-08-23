# CV Viva — Design System

> Fuente de verdad visual de esta app (skill `diseno-ui`). Creado en el Sprint 001 a partir de los
> tokens del prototipo `referencias-ui/hoja-de-vida/HV Web/design-system.md` (planeadora,
> READ-ONLY), **re-aplicados a un layout scroll editorial mobile-first** — el shell dashboard de
> 3 columnas del prototipo NO existe aquí. Toda pantalla posterior obedece este documento; se
> extiende por ADR, nunca se contradice en silencio.

## Personalidad

**Es:** editorial · sobria · analíticamente cálida.
**Jamás será:** promocional · juguetona · densa-de-dashboard.

Registro emocional: la confianza silenciosa de una pieza bien impresa. El visitante (recruiter,
líder técnico) debe sentir que lee un instrumento técnico con oficio tipográfico, no una landing
de marketing. Microcopy en primera persona, español llano ("Recibí tu solicitud, te respondo en
1–3 días hábiles"), sin adjetivos infladas.

## Modo

**Claro único en Sprint 1** (decisión heredada del prototipo: light editorial de alto contraste).
Dark mode = deuda de diseño explícita, registrada en el summary del sprint.

## Tokens

Implementados en `src/app/globals.css` (`@theme` de Tailwind v4). **Nunca valores mágicos sueltos
en componentes** — si un valor no está aquí, primero se agrega aquí (vía ADR si contradice algo).

### Paleta — paper & ink + pasteles desaturados

| Token     | Hex       | Rol                                |
| --------- | --------- | ---------------------------------- |
| `paper-0` | `#FBFAF7` | Fondo de página (off-white cálido) |
| `paper-1` | `#F5F3ED` | Superficie elevada                 |
| `paper-2` | `#ECE9E0` | Inset / borde de card suave        |
| `paper-3` | `#DDD8CB` | Divisor fuerte, bordes default     |
| `ink-0`   | `#121110` | Display / headings                 |
| `ink-1`   | `#2A2927` | Texto primario                     |
| `ink-2`   | `#5E5C55` | Texto secundario                   |
| `ink-3`   | `#9C9A90` | Texto terciario, labels de eje     |

**Acentos pastel** (cada uno con su ink par, contraste ≥7:1 AAA — usar SIEMPRE en pareja):

| Pastel   | Hex       | Ink par   | Rol semántico en CV Viva                |
| -------- | --------- | --------- | --------------------------------------- |
| `sage`   | `#CFE3CF` | `#3C5A3C` | primario / éxito / CTA principal        |
| `rose`   | `#F2D6D6` | `#7A3F3F` | acento humano / error suave             |
| `sky`    | `#CEDDE9` | `#2E4E6B` | info / links / focus ring (`sky-ink`)   |
| `citron` | `#E6E3B8` | `#5E5A1E` | app "en construcción" (telemetría viva) |
| `lilac`  | `#DDD3E8` | `#4E3E6B` | decisiones / timeline de trayectoria    |
| `peach`  | `#F2DEC4` | `#6B4820` | app "en exploración" / warning          |
| `danger` | `#C97A7A` | —         | errores duros (rose profundizado)       |

Regla de avaricia: el acento se gasta en CTAs, estados y datos clave. Fondos de sección = papers.

### Tipografía — dos voces + evidencia

| Voz               | Familia (`next/font`)                                 | Uso                                   | Pesos       |
| ----------------- | ----------------------------------------------------- | ------------------------------------- | ----------- |
| Display editorial | **Fraunces** (`--font-display`, clase `font-display`) | Hero, títulos de sección, pull quotes | 400/500/600 |
| UI / cuerpo       | **Inter** (`--font-sans`, default del `body`)         | Todo el texto de interfaz y lectura   | 400/500/600 |
| Mono / evidencia  | **JetBrains Mono** (`--font-mono`)                    | Métricas, fechas, badges, IDs         | 400/500     |

Escala (desktop / móvil ~0.88×, cuerpo ≥15px en móvil):

- `display-xl` 56/60 −0.025em (hero) · `display-lg` 40/44 −0.02em · `display-md` 32/38 −0.015em
- `h1` 24/30 · `h2` 20/26 · `h3` 16/22
- `body-lg` 17/28 (lectura narrativa) · `body` 14/22 · `caption` 12/16 +0.01em
- `mono` 13/20 · `mono-sm` 11/16 +0.02em uppercase (badges, fechas)

Cifras SIEMPRE con `tabular-nums` (counters, métricas, fechas).

### Spacing, radios, sombras

- **Spacing:** múltiplos de 4/8 (escala Tailwind). Lectura larga manda: secciones con respiro
  generoso (`py-24`+ desktop, `py-16` móvil).
- **Radios:** `xs 4px · sm 6px · md 10px (cards default) · lg 14px · xl 20px · full` (chips).
- **Sombras:** `sh-1` (cards) · `sh-2` (popovers) · `sh-3` (modales) — suaves, tinte ink.
  Nunca sombras pesadas genéricas.
- **Bordes:** 1px `paper-3` default; 1px `paper-2` sutil.

### Motion (spec numérica — referencia destilada de la planeadora)

Durations UI: `fast 120ms · base 200ms · slow 320ms · page 480ms`.
Easings (variables CSS): `--ease-out-expo (.16,1,.3,1)` · `--ease-out-cubic (.21,.61,.35,1)` ·
`--ease-out-back (.34,1.56,.64,1)` · `--ease-out-quart (.25,1,.5,1)` ·
`--ease-in-out-cubic (.65,0,.35,1)`. **Prohibido `ease`/`ease-in-out` default.**

Primitivas del motion system (`src/components/motion/`):

| Primitiva       | Spec exacta                                                                                                                    |
| --------------- | ------------------------------------------------------------------------------------------------------------------------------ |
| `fadeInUp`      | 0.7s, ease-out-cubic, translateY(40px)→0, stagger 80ms                                                                         |
| `blurIn`        | 0.9s, ease-out-expo, blur(20px)+scale(1.05)→0                                                                                  |
| `maskReveal`    | 0.8s, ease-in-out-cubic, translateY(100%)→0 dentro de overflow-hidden                                                          |
| `scaleInBlur`   | scale(0.85)+blur(15px)→1 (cards)                                                                                               |
| `Counter`       | ease-out-cubic manual, ~1800ms, tabular-nums                                                                                   |
| `TimelineTrack` | rail SVG stroke-dashoffset 1.4s ease-out-expo; nodos scale(0)→1 ease-out-back sincronizados `800ms + x% × 1400ms`; cards ±32px |

**Reglas duras:** solo `transform`/`opacity` en animaciones de scroll · `prefers-reduced-motion`
salta al estado final sin movimiento, sin excepciones (hook global) · **vetado:** three.js/WebGL,
animaciones infinitas (sweep/glitch/marquee), scroll-snap de deck, CDNs en `<head>`.

> **Única excepción al veto de bucles — ADR-014 (S5):** se admite **un** bucle ambiental por
> página y solo en la **firma del clímax** de una ficha de la vitrina, con la tarjeta abierta,
> apagado entero bajo `prefers-reduced-motion`. Es el privilegio del clímax del banco §2, no una
> licencia general.

## Componentes canon

- **Button** (shadcn personalizado): primary = sage fill + sage-ink label; secondary = paper-1 +
  borde paper-3; ghost = transparente con hover paper-1. Táctil ≥44px.
- **Card**: paper-0, borde paper-3 1px, `r-md`, `sh-1`. Variante editorial: paper-1 + título Fraunces.
- **Chip de estado de app**: `r-full`, label mono uppercase 11px. `citron` + citron-ink = "en
  construcción"; `peach` + peach-ink = "en exploración". Sin fechas prometidas.
- **Input/Textarea**: paper-0, borde paper-3, focus ring 2px `sky-ink` offset 2px.
- **Metric tile (logros)**: número mono grande con Counter, caption label, sin sparklines en S1.
- **Glifo ◆**: marca de evidencia/lista editorial (heredado del prototipo).
- **Iconografía**: Lucide, stroke 1.5px, 16/20px, siempre con `aria-label` si es interactivo.

### Componentes de la vitrina · S5

- **Muestra de app** (escaparate `/vitrina`): card paper-0, borde paper-2, `r-lg`, `sh-1`. Lleva
  chip de estado + chip de ciclo, nombre en Fraunces, promesa en Fraunces menor, **tira**
  esquemática enmarcada en paper-1, para-quién en `ink-2`, conteos en mono y cierre «ver la ficha».
  El enlace estira su área de clic a toda la card (`after:absolute inset-0`) **conservando el
  nombre de la app como nombre accesible** — una sola parada de tabulador, y nunca «leer más».
- **Tarjeta de grupo** (dentro de una ficha): `r-md`, borde paper-3. Cabecera `<h4><button>` —
  jamás `<button><h4>` — con índice mono, icono del DS de la app de origen, nombre, línea y
  chevron. Cerrada, el interior va con `visibility: hidden` (fuera del árbol de accesibilidad);
  abierta, sus features **escalonan** a ~60 ms. Gobernada por la isla de **apertura por lectura**
  (banco §7): abierta exactamente mientras está a la vista, y el toque manda para siempre.
- **Chip de procedencia**: `r-full`, mono 10px uppercase, un pastel por origen —
  `sage`=medido · `sky`=calculada · `lilac`=declarado · `peach`=estimación. **Ninguna cifra se
  pinta sin él.**
- **Tira y firma** (dibujo, no captura): SVG con los tokens de esta página. La **tira** resume las
  ideas de la app en cuatro columnas (viewBox 320×92, rótulos mono 6px); la **firma** re-dibuja la
  escena clímax de su brochure. Se declaran como dibujo en su pie: jamás fingen ser una captura.
- **Captura repintada**: pantalla real de la app hermana corriendo, fotografiada con los tokens de
  CV Viva inyectados (`scripts/tema-cv-viva.mjs`) para que las seis se vean de la misma casa.
  Banner apaisado enmarcado en paper-1, `alt=""` con pie visible que **declara el repintado** —
  una imagen retocada que se presenta como cruda miente igual que una maqueta que finge ser foto.

## Layout

Scroll editorial de una columna, mobile-first (360–420px prioridad, desktop ≥1024px).
Ancho de lectura narrativa ≤ `760px`; secciones full-bleed solo para timeline y showcase.
Header slim sticky con anchors + toggle ES/EN. Footer = contacto. Nada de sidebars ni rails.

## Accesibilidad (AA como piso)

Contraste AA (pasteles siempre con su ink par) · focus visible en todo interactivo · skip-link
primer tab stop · landmarks semánticos (`header/nav/main/footer`) · h1–h3 en orden estricto ·
táctiles ≥44×44 · `prefers-reduced-motion` global · timeline legible por lector de pantalla
(lista ordenada semántica debajo del SVG decorativo `aria-hidden`).

## Anti-patrones prohibidos (gate de revisión)

shadcn sin personalizar · gradiente violeta/azul · emojis como iconografía · hero centrado
genérico con dos botones · sombras pesadas uniformes · radios XL en todo · texto default de
librería o inglés residual en la UI ES · placeholder "Lorem".
