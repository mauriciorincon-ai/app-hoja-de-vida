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

| Token     | Hex       | Rol                                                    |
| --------- | --------- | ------------------------------------------------------ |
| `paper-0` | `#FBFAF7` | Fondo de página (off-white cálido)                     |
| `paper-1` | `#F5F3ED` | Superficie elevada                                     |
| `paper-2` | `#ECE9E0` | Inset / borde de card suave                            |
| `paper-3` | `#DDD8CB` | Divisor fuerte, bordes default                         |
| `ink-0`   | `#121110` | Display / headings                                     |
| `ink-1`   | `#2A2927` | Texto primario                                         |
| `ink-2`   | `#5E5C55` | Texto secundario                                       |
| `ink-3`   | `#9C9A90` | **Decorativo: bordes, rellenos, trazos — JAMÁS texto** |

#### Tokens de tinta VETADOS como color de TEXTO

Un token de tinta que no alcanza AA sobre superficie **no se vigila con prosa ni con axe al
final**: se declara aquí, en forma legible por máquina, y lo hace fallar un barrido sobre `src/`
(`tests/unit/design-tokens-vetados.test.ts`, kit v1.26.0 → regla 5). Editar esta lista **cambia el
gate**: es su única fuente. Vetado como texto no es vetado a secas — `border-`, `bg-`, `fill`,
`stroke` y `decoration-` siguen siendo usos legítimos del mismo token.

<!-- tokens-vetados-como-texto:inicio -->

```yaml
vetados_como_texto:
  - token: ink-3
    hex: "#9C9A90"
    contraste: "2.7:1 sobre paper-0"
    minimo: ink-2
    porque: "axe lo cazó dos veces en la misma app (S6 y post-S7); la tercera la caza el test"
```

<!-- tokens-vetados-como-texto:fin -->

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

| Primitiva       | Spec exacta                                                                                                                                                      |
| --------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `fadeInUp`      | 0.7s, ease-out-cubic, translateY(40px)→0, stagger 80ms                                                                                                           |
| `blurIn`        | 0.9s, ease-out-expo, blur(20px)+scale(1.05)→0                                                                                                                    |
| `maskReveal`    | 0.8s, ease-in-out-cubic, translateY(100%)→0 dentro de overflow-hidden                                                                                            |
| `scaleInBlur`   | scale(0.85)+blur(15px)→1 (cards)                                                                                                                                 |
| `Counter`       | ease-out-cubic manual, ~1800ms, tabular-nums                                                                                                                     |
| `TimelineTrack` | rail SVG stroke-dashoffset 1.4s ease-out-expo; nodos scale(0)→1 ease-out-back sincronizados `800ms + x% × 1400ms`; cards ±32px                                   |
| `fadeInSlow`    | post-S8 — «leve, más marcada y lenta»: 1.2s, ease-out-expo, translateY(28px)+blur(8px)→0; escalón 140ms (Estudios, Certificaciones, cajas de la vitrina asomada) |
| `liftIn`        | post-S8 — la tarjeta aterriza: 1.0s, ease-out-expo, translateY(48px)+rotateX(8°, perspectiva 900)+scale(.96)+blur(12px)→0; escalón 120ms (Skills)                |
| `CifraQueLlama` | post-S8 — una cifra crece a 1.14× y vuelve, 0.9s ease-out-back con 0.55s de retraso, al asomar (`amount: all`); solo transform (cuenta de productos)             |

`Stagger` acepta `stagger` (segundos entre hermanos; default 80ms) y `as` (`div` · `ul` · `li`) desde post-S8:
las cajas de la vitrina se escalonan dentro de un `<ul>` real, y un `div` entre `ul` y `li` es HTML inválido.

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

### Componentes de la HOME · revisión post-S7

- **Índice que baja contigo** (`TimelineTrack`): dos columnas — índice (88 px móvil · 176 px
  escritorio) y tarjetas. En el índice, **una línea** `paper-3` de 2 px de arriba abajo, un
  **relleno** `lilac-ink` que crece con el scroll (`scaleY` desde `scrollYProgress`, origen
  arriba), una **marca** de 8 px por hito (rellena al pasar, hueca antes) y **el círculo**: 14 px
  `lilac-ink` con anillo `paper-0`, `position: sticky; top: 45vh`. A su lado **el año** en
  Fraunces `lilac-ink` (1.5rem móvil · 2.75rem escritorio, `tabular-nums`), que cambia con un
  fundido de 350 ms (opacity + 10 px). El hito activo es el último cuyo borde superior está por
  encima de la línea del círculo. Reduced motion: el relleno **completo y quieto** (lo fija el
  cinturón CSS `[data-motion]`), sin fundido, el círculo sigue `sticky`. **La forma del árbol es la
  misma con y sin reducción:** `useReducedMotion()` solo cambia props, nunca qué elementos se
  pintan — en el servidor vale `null` y ramificar la estructura con él desajusta la hidratación
  (React #418, cazado el 2026-09-10 en este mismo relleno). En la tarjeta, las **dos acciones en
  una fila** («Ver logros completos» · «Ver case
  study →») y el panel de bullets abre debajo de la fila.
- **Tarjeta de skills**: card `paper-0`, borde `paper-2`, `r-[14px]`, `sh-1`, hover
  `-translate-y-0.5` + `sh-2`. Cabecera con el **icono** en cuadro `paper-1` de 48 px (24×24,
  trazo 1.7, `sage-ink`, dibujado en casa, **por posición del grupo**) y el nombre en Fraunces
  1.35rem. Los ítems son chips `paper-1` con borde `paper-3` que entran con `scaleInBlur`
  escalonado. El trazo del icono se dibuja al llegar la tarjeta (`pathLength` 0→1, en cascada de
  130 ms por figura) heredando las variantes del `Stagger`; el estado por defecto es el icono
  dibujado. **Prohibido:** barras o porcentajes de dominio. **Coreografía post-S8, tres capas:**
  la tarjeta **aterriza** (`liftIn`, escalón 120 ms) → el trazo empieza cuando ya aterrizó (0,35 s)
  → los chips caen en cascada rápida (`scaleInBlur`, 45 ms, tras 0,4 s). Solo
  transform/opacity/filter; con reducción de movimiento, todo quieto.
- **Tarjeta de estudio**: como la de certificación (`r-md`, borde `paper-3`, `sh-1`), título en
  Fraunces `xl`, institución en mono, periodo en mono `ink-2` — y **sin fecha, «Sin fecha
  declarada» en cursiva `ink-2`**, nunca `ink-3` (2.7:1; axe lo cazó otra vez). **Post-S8:** entra
  con `fadeInSlow` (escalón 140 ms) y lleva el **icono de la institución** delante de su nombre —
  Lucide 16 px, trazo 1.5, `ink-2`, sin color, **por dato** (`icono:` en el YAML, enum
  `universidad · idiomas · curso · insignia · datos · codigo`). Nunca un logo de marca ajena.
- **Tarjeta de certificación**: mismo `fadeInSlow`, mismo icono por dato delante del nombre. Y el
  **tercer estado**: una credencial `en curso` lleva un chip `citron`/`citron-ink` mono 11 px
  «En curso» **en el sitio de la fecha** — el mismo chip de «en preparación» de la vitrina — y no
  puede nombrarse en ningún titular sin esas palabras al lado (gate de contenido).
- **Vitrina asomada**: las mismas cajas de frente del portal, sin variante, con un botón sage
  «Explora el portafolio» (post-S8; antes «Entrar a la vitrina»). La HOME enseña la vitrina, no la
  copia. **Post-S8:** la sección se titula «Vitrina», las cuatro cajas aparecen levemente una a
  una (`fadeInSlow` dentro de un `<ul>` escalonado, 140 ms), la cifra de **productos** —ya no
  «piezas», en todo el copy visible— crece y vuelve al asomar (`CifraQueLlama`), y el cierre de
  cada caja dice «Explora».
- **Roadmap embebido**: dentro de `/vitrina/apps` va como bloque con `border-t paper-2` y título
  `2xl` (no el `clamp` de sección de HOME). Misma isla de votación.

### Menú desplegable del encabezado · post-S5

- **Cuándo se usa:** cuando varias secciones del nav **son la misma cosa**. Hoy, una sola vez: las
  seis secciones del CV bajo «Hoja de vida» (Trayectoria · Logros · Vitrina · Estudios ·
  Certificaciones · Skills — el orden de la página; la vitrina asomada entra con su nombre de
  sección). El primer nivel queda en tres: Hoja de vida · **Portafolio** · Contacto. **Post-S8:**
  la sección recuperó el nombre «Vitrina» y por eso el portal pasó a «Portafolio» — dos enlaces
  con el mismo nombre a destinos distintos en un mismo menú son una trampa para el lector de
  pantalla y para cualquiera. No es un patrón para repartir: un header con dos
  desplegables ya es un menú de aplicación, y esto es una pieza editorial.
- **Forma:** panel `paper-0`, borde `paper-2`, `r-md`, `sh-2`, anclado bajo su botón. Cada opción
  con área táctil ≥44px y `hover` en `paper-1`.
- **Movimiento propio y corto** (`.menu-desplegable`, 120 ms — el «fast» del sistema). **No** se
  reutiliza `anim-fade-in-up`: dura 0,7 s porque está pensada para bloques de lectura que entran
  al hacer scroll, y en un menú deja el panel medio traslúcido durante media pantalla. Un menú se
  siente instantáneo o parece roto.
- **Contrato de accesibilidad, el mismo del disclosure móvil:** `aria-expanded` + `aria-controls`
  en el botón · Escape cierra **y devuelve el foco al botón** · pulsar fuera cierra · elegir una
  opción cierra. Los tres cierres son obligatorios: un panel flotante que solo cierra con Escape
  deja una capa encima de lo que el visitante quiso mirar.
- **Y entra a los scans:** lo que nace cerrado es invisible para axe, así que el scan lo abre
  antes de analizar. Sin eso el gate pasa en verde sin haber mirado nada.

### Componentes de la vitrina · S5 → S7

- **Ficha técnica** (`/vitrina/apps/<slug>` y `/vitrina/<frente>/<slug>`, ADR-016 · ADR-017): la capa infografía de una pieza,
  en orden fijo para cualquier frente y con **tres secciones opcionales que decide la pieza, no el
  frente**: el proceso BPMN (contrato v1.1.0), los hallazgos y la galería (v1.3.0). La que falta
  no se pinta y **las demás se renumeran seguidas, nunca un hueco** — una app va 01–05, una
  investigación 01–04, un tablero 01–06. Y la app **no inventa lo que la ficha no declara**: si
  los bloques vienen con la cuenta en cero (una investigación tiene aportes, no funciones), el
  subtítulo cuenta grupos y **calla el número**. Cabecera: eyebrow + chips de estado —con **«Sellada el {fecha}»** a su lado cuando
  la pieza viene sellada y el contrato trae `pieza.sellado_en`— ciclo, sprints, versión y
  anclaje, nombre en Fraunces `clamp(2.2rem,6vw,3.5rem)`, tagline Fraunces 1.35rem, stack en chips
  y el **titular de valor**: caja paper-1 con borde izquierdo `sage-ink` 3px, rótulo mono
  «qué no hace nadie más», texto 16px medium `ink-0`. **Tira de cifras**: 3–5 cards paper-0,
  valor Fraunces 2rem `tabular-nums`, etiqueta 12.5px `ink-2`, chip de procedencia obligatorio.
  Secciones numeradas: número mono `ink-2`, título Fraunces 1.6rem, subtítulo 13px `ink-2`
  alineado a la derecha. Paneles `r-lg` paper-0 borde paper-2 `sh-1`. «Límites» con guion `ink-2`;
  «Nunca» con × `rose-ink`. Hitos: pista de puntos `sage-ink`. Cierre: botón sage al detalle + botón
  de borde a la lista de espera. **Contraste:** `ink-3` NUNCA es color de texto (2.7:1 sobre
  paper-0; axe lo cazó en las 12 rutas) — el mínimo para texto es `ink-2`.
- **Proceso BPMN** (`ProcesoBpmn`, motor `lib/vitrina/bpmn.ts`): SVG generado desde datos, jamás
  dibujado. Pool paper-0 borde paper-3 r=10, carriles alternos paper-0/paper-1, rótulos mono 10px
  `ink-2` en banda de 104 unidades. Inicio ○ `sage`/`sage-ink`; tarea ▭ paper-0 borde `ink-0` 1.3
  r=8, texto 11px medium (≤ 3 líneas de ~17 caracteres); decisión ◇ `citron`/`citron-ink` con
  el texto **dentro si cabe (≤ 9 caracteres) y encima, en líneas de ≤ 16, si no** — largo y
  dentro, la flecha de entrada lo atravesaba; fin ◉ borde `ink-0` 3px; flujos `ink-1` 1.4 con
  flecha, etiquetas 10.5px semibold `sage-ink`. **Dónde va cada etiqueta (2026-09-06):** camino
  recto, sobre el tramo, a mitad; cambio de carril, sobre el tramo vertical a la altura del
  primer borde de carril (franja sin cajas ni horizontales); bucle, junto a la bajada; salida a
  un evento de enlace por canal, al arranque del canal inferior. Nunca dos junto al mismo
  origen: se pisaban («no supera» + «sí»). Llamadas de anotación ①② `lilac`/`lilac-ink` en la
  esquina de su tarea con las notas al pie en HTML; eventos de enlace Ⓐ mono 10px cuando el
  proceso se parte en filas (6 columnas por fila). Por debajo de 720 px el contenedor desplaza en
  horizontal: **nunca se encoge el texto**. Las invariantes de legibilidad (rótulos que no se
  pisan ni quedan tachados) se prueban sobre los seis procesos reales.
- **Caja de frente** (portal `/vitrina`, ADR-015 · post-S5): la unidad del portal, una por frente
  (apps · agentes · investigaciones · tableros). Card paper-0, borde paper-2, `r-lg`, `sh-1`,
  hover `-translate-y-0.5` + `sh-2`. Arriba, a la izquierda el **icono del frente** en un cuadro
  paper-1 de 44 px (24×24, trazo 1.5, sin relleno, dibujado en esta casa — nunca un emoji); a la
  derecha su **chip de estado**: `sage` con la cuenta de piezas si está abierto, `citron` «En
  preparación» si no. Nombre en Fraunces, intro en `ink-1` de 15 px, y cierre «Entrar →» / «Ver
  qué viene →». Mismo contrato que la muestra de app: el enlace estira su área de clic a toda la
  caja **conservando el nombre del frente como nombre accesible**. **Marca un inicio, no lo
  disfraza:** un frente en preparación no enseña una cuenta inventada, y la cuenta de uno abierto
  **se mide en disco**, no se escribe.
- **Muestra de app** (escaparate `/vitrina`): card paper-0, borde paper-2, `r-lg`, `sh-1`. Lleva
  chip de estado + chip de ciclo, nombre en Fraunces, promesa en Fraunces menor, **tira**
  esquemática enmarcada en paper-1, para-quién en `ink-2`, conteos en mono y cierre «ver la ficha».
  El enlace estira su área de clic a toda la card (`after:absolute inset-0`) **conservando el
  nombre de la app como nombre accesible** — una sola parada de tabulador, y nunca «leer más».
- **Muestra de pieza** (escaparate de un frente que no es apps, `/vitrina/<frente>` · S7): la
  hermana de la muestra de app, y se parece en todo menos en una cosa — **una app se reconoce por
  su pantalla y una pieza sin interfaz no tiene ninguna**. Un agente vive en una terminal, una
  investigación es un documento: una maqueta inventada sería decorado que insinúa un producto
  inexistente. Card paper-0, borde paper-2, `r-[14px]`, `sh-1`, hover `-translate-y-0.5` + `sh-2`.
  Lleva chip de estado (`sage`=sellada · `citron`=sin sellar) + chip de ciclo, nombre en Fraunces
  1.45rem, tagline en Fraunces 1.02rem, y en el sitio de la maqueta **el titular de valor** —caja
  paper-1 con borde izquierdo `sage-ink` de 3px y antetítulo mono en `sage-ink`— seguido de
  **tres cifras** (nunca las cinco: el escaparate asoma, la ficha desarrolla) en rejilla de 3
  columnas, cada una con su chip de procedencia. Mismo contrato de enlace que la muestra de app:
  `after:absolute inset-0` **conservando el nombre de la pieza como nombre accesible**.
  **Portada condicional:** si la ficha trae `galeria`, la **primera captura** ocupa el lugar de la
  maqueta —real, sin retocar, `alt=""` porque el pie lo da el nombre— y lo decide **la ficha, no
  el frente**.
- **Hallazgos** («Lo que dicen los datos», solo si la ficha trae `conclusiones` · S7): de 3 a 6
  tarjetas paper-1 en rejilla; cada una abre con **la cifra en Fraunces** y su unidad en mono
  `ink-2`, luego el título y el texto, y cierra con **su chip de procedencia**. La regla del chip
  no se relaja aquí: _un hallazgo con número y sin procedencia es una opinión disfrazada._
- **Galería** («Cómo se ve», solo si la ficha trae `galeria` · S7): de 1 a 12 capturas de la pieza
  corriendo, cada una en `<figure>` con marco paper-1 y `figcaption` mono «Pantalla N de T».
  `loading="lazy"`, `sizes` responsivo, y se sirven de `/piezas/<frente>/…` —espacio propio, que
  no colisiona con la ruta de la ficha—. **Se guardan tal como llegaron**: convertirlas obligaría
  a editar la ficha de otra casa.
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
