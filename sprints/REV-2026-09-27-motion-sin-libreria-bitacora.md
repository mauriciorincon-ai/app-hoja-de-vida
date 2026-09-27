# Revisión 2026-09-27 — Las entradas sin librería

> Rama `perf/tbt-de-la-home`, un PR. Tras el #54, `/es` quedó en 0,91–0,92 con un punto de
> margen y el TBT más alto de las quince URLs. El dueño: _«Sí, reduce en un PR»_ y, con los
> números delante, _«Adelante, necesitamos ajustar esto definitivamente»_.

## 1. Dónde estaba el tiempo

Con los reportes de la CI (`lighthouse-reports-<intento>`, desde el #54) y cinco corridas locales
con la CPU ×12 que reproduce al runner:

- **El LCP simulado (3,2–3,4 s)** es el costo de lo que la página pide antes de pintar: ~270 KB
  gzip de JavaScript en 17 chunks. React DOM (71 KB) y el runtime de Next (~107 KB) no se
  tocan; la librería de animación pesaba **~45 KB** en tres chunks y viajaba en todas las
  páginas; next-intl y los componentes propios, otros ~46 KB.
- **El TBT (90–225 ms en el runner)** es casi todo «Script Evaluation» atribuido al chunk de
  React DOM: la hidratación. En la HOME hidrataban ~180 elementos animados (12 `Reveal`, 5
  `Stagger` con sus ítems, 9 iconos con sus trazos, 8 contadores, la línea de tiempo).

## 2. Dos experimentos antes de tocar nada (`/es`, CPU ×12, 5 corridas)

| Build                                              | Rendimiento | TBT       |
| -------------------------------------------------- | ----------- | --------- |
| `main` tras el #54                                 | 0,88–0,92   | 90–225 ms |
| E1: `Reveal`/`Stagger` como `<div>` planos         | 0,91–0,92   | 70–129 ms |
| E2: sin `motion/react` en ningún archivo (un shim) | **0,94 ×5** | 57–77 ms  |

E1 dijo que quitar solo la animación de las secciones no era la palanca (el LCP no se movía).
E2 dijo que la librería sí: 222 KB antes de pintar, LCP 3,02–3,07 s, y 0,94 estable. Los dos se
midieron con archivos temporales y `git checkout` al terminar; las carpetas
`muestras/2026-09-27-tbt/{base,e1-sin-reveal,e2-sin-motion}` guardan los reportes.

## 3. Medir la coreografía ANTES de rehacerla

No se rehízo de memoria: `muestras/2026-09-27-tbt/arranques-antes.txt` es una medición con
Playwright de cuándo arranca y cuándo queda quieta cada pieza de la HOME (a 60 fps, tras llevar
cada sección a pantalla). Lo que enseñó, y que las reglas de la librería no dejaban ver:

- los ítems directos de un `Stagger` arrancan a `stagger × i` (80/140/200 ms exactos);
- en Skills, la tarjeta i **suma su propio retraso** a su cabecera (`0,2·i + 0,8 s`) y a sus
  chips (0,1 s cada uno, **en la misma cuenta que la cabecera**);
- el trazo de los iconos arranca a 1,0 s y cada figura 0,2 s después, **igual en todas las
  tarjetas** (retraso absoluto desde el disparo, no relativo a su tarjeta);
- el pulso de las cifras de la vitrina corre con su `retraso` propio, también absoluto;
- **el título de Contacto («¿Hablamos?») no se movía nunca** — ver §5.

## 4. Lo que se construyó (ADR-027)

`Reveal`, `Stagger`, `StaggerItem`, `CifraQueLlama` e `IconoSkill` son componentes de servidor
que escriben atributos; `globals.css` tiene el estado oculto, la duración y la curva de cada
variante (los números del design system, sin cambios); `Revelador` (un solo componente de
cliente, en el layout) observa con un IntersectionObserver por umbral y marca `data-visto`;
`retrasos.ts` reparte los retrasos de cada grupo con el modelo del §3. `Counter` y
`TimelineTrack` siguen en el cliente con observadores propios; el relleno de la línea se escribe
en el `transform` desde el evento de scroll, sin re-render. `usePrefiereQuieto` reemplaza al hook
de la librería. Sin JavaScript, un `<noscript>` muestra todo (antes, 134 elementos nacían con
`opacity: 0` inline y quedaban invisibles bajo el hero). La dependencia `motion` sale de
`package.json`.

**Después**, la misma medición (`arranques-despues.txt`) calca la de antes con 15–30 ms de
desfase constante (la llamada del observador) y las mismas duraciones: Logros 40/105/189/355
(antes 34/100/183/333); Skills 65/248/448, cabecera 865, chips 965/1065/1165, trazos 1065/1265
(antes 48/231/431, 831, 931/1030/1131, 1047/1247).

## 5. Un bug de siempre: el título de Contacto

`maskReveal` desplaza el texto un 110 % hacia abajo dentro de un contenedor con
`overflow-hidden`. Observando **el texto**, el IntersectionObserver lo ve fuera del recorte —0 %
visible— y nunca lo revela: medido con la librería (`arranques-antes`: «no se movió») y sin ella,
y comprobado con un observador directo (`ratioIO: 0`). Nadie lo cazó porque el contenido sí está
en el HTML y con reducción de movimiento el cinturón lo muestra. Ahora se observa **el
contenedor** y el texto lleva `data-mask`.

## Regla 14 — rojos en este commit

Tres gates nuevos de unidad y uno de e2e; cada uno se vio fallar por su propia razón, con los
archivos restaurados desde respaldo al terminar.

**X. El modelo de retrasos** (`tests/unit/motion-retrasos.test.ts`): los ítems con retraso propio
ocupan turno (comentada la línea `if (item.hasAttribute("data-retraso")) continue;`):

```
× Skills: la tarjeta orquesta a su cabecera y sus chips en una sola cuenta …
  expected [ '0.8s', '1.1s', '1.2s', '1.3s' ] to deeply equal [ '0.8s', '0.9s', '1s', '1.1s' ]
× un ítem con data-retraso conserva su retraso absoluto y no ocupa turno
× la vitrina asomada: … Expected: "0.14s"  Received: "0.28s"
Tests  3 failed | 1 passed (4)
```

**Y. Una variante sin CSS** (`tests/unit/motion-variantes-css.test.ts`): `pulso` renombrado en
`globals.css`:

```
× «pulso» tiene estado oculto y duración en globals.css
AssertionError: «pulso» no tiene estado oculto (regla :not([data-visto])) en globals.css
```

**Z. Un componente reimporta la librería** (`import { m } from "motion/react"` en `reveal.tsx`):

```
× ningún archivo de src importa motion/react, y package.json no lo trae
AssertionError: vuelven a traer la librería de motion: expected [ 'src/components/motion/reveal.tsx' ] to deeply equal []
```

**W2. El título de Contacto** (`tests/e2e/home.spec.ts`, «el título de Contacto emerge de su
máscara»): con la estructura vieja (el texto observándose a sí mismo), el título nunca llega a
`quieto`. Registrado en la sección de verificación de abajo con su salida.

Las pruebas que ya existían y siguen vigilando esto: `motion-estructura-reducida.test.tsx` (mismo
HTML con los tres valores del hook, ahora `usePrefiereQuieto`), `reduced-motion.spec.ts`
(cinturón), `axe.spec.ts` (reduced motion + cero errores de consola), y en `home.spec.ts` la
tarjeta de Skills que aterriza y las tres de la letra de las cifras.

**W2, la salida** (`reveal.tsx` y `globals.css` con la estructura vieja, build aparte):

```
✘ el título de Contacto emerge de su máscara › /es: al llegar a Contacto, «¿Hablamos?» termina visible y en su sitio
  Expected: "quieto"
  Received: "matrix(1, 0, 0, 1, 0, 60.0531)"
```

Restaurados los dos archivos desde su respaldo, build de nuevo y la prueba en verde.

## Verificación

- `pnpm test` **1353 de 1353** (51 archivos; entran `motion-retrasos` y `motion-variantes-css`) ·
  `typecheck` y `lint` limpios.
- e2e completo en el puerto 3100 (configuración temporal fuera del repo, el 3000 lo ocupaba otro
  proyecto del dueño): **421 pasan, 17 saltadas** (las de siempre). Tras el arreglo de Contacto,
  `home` + `reduced-motion` + `axe` otra vez: 262 pasan, 6 saltadas.
- `/es`, CPU ×12, 5 corridas: **0,94 · 0,94 · 0,94 · 0,94 · 0,94**, LCP 3,02–3,05 s, TBT 57–70
  ms, CLS 0 (`muestras/2026-09-27-tbt/port-es`). Antes: 0,88–0,92, TBT 90–225.
- Las 15 URLs de la CI con la CPU por defecto, 3 corridas, **las dos aserciones de la CI en
  verde** (presupuesto y categorías, 45 corridas): ninguna baja de **0,95**; `/es` 0,95 ×3
  (`muestras/2026-09-27-tbt/port-15`). Antes: `/es` 0,92 y la peor 0,91.
- JavaScript gzip antes de pintar en `/es`: **220 KB** (antes ~270); el HTML ya no lleva ningún
  `opacity: 0` inline (antes 134).
- El gate de cifras del ADR-025 pidió que el corpus dijera **27** decisiones: `apps-pipeline`
  ES/EN actualizados.

Gate ⭐ del dueño: la a4 de la guía (v9.16) pide recorrer la HOME entera, bajando y subiendo, y
decir si alguna sección entra distinto. Es el único juez de lo visual.

## Revisión del dueño, el mismo día

**a4 ⭐ APROBADA por el dueño en la preview del PR** (_«Está perfecta, la vi en preview y todo
fluye bien»_). Las casillas de la guía viven en su navegador; la aprobación queda aquí. La CI del
primer commit (678d7cd) salió 6/6 en verde: en GitHub, `/es` 0,93 · 0,95 y las otras catorce
0,94–0,99.

Dos pedidos suyos, en la misma rama:

**1. Certificaciones sin texto.** Solo las tres de Microsoft tenían `nota` (el fondo más oscuro
marca «tiene nota»); pidió que todas lo tuvieran y que quedaran «bien descritas e impactantes».
Las cuatro de IBM llevan ahora una nota en los dos idiomas, sacada de su documento
`certificaciones` del corpus, y la del AI-103 se afinó con lo que ese documento ya dice (la ruta
que practica en la Fundación CTIC). Aprobadas por el dueño sobre la propuesta; las de DP-600 y
AI-300 no cambian. El PDF no imprime la nota: sigue en dos páginas.

**2. «Skills se demora en entrar».** No lo causó este PR: los tiempos medidos eran idénticos. La
partitura se aprobó con cinco tarjetas y desde el #50 son nueve, así que la novena arrancaba a
los 1,6 s y sus chips terminaban pasados los 3,5 s. El dueño eligió la **opción A**: tarjetas
cada 0,12 s (lo que ya decía la tabla del design system), cabecera a los 0,5 s, chips cada
0,06 s; la tarjeta sigue aterrizando en 1,4 s. Y una corrección que la medición dejó ver: con la
librería el trazo del icono corría con retraso absoluto (1,0 s desde el disparo), así que en las
tarjetas de atrás se dibujaba **antes de que su cabecera apareciera**, escondido tras la opacidad
0 de la cabecera. Ahora lo orquesta su cabecera (`hijos` en el `StaggerItem` de la cabecera:
0,2 s después de ella y 0,2 s entre figuras) y sigue a su tarjeta. `motion-retrasos.test.ts` lo
exige.

Medido (`arranques-opcion-A.txt`): tarjetas 58 / 174 / 291 ms; cabecera de la tarjeta 0 a 557 y
de la 1 a 674; trazo de la 0 a 757 y 957, de la 1 a 874 (sigue a su tarjeta); chips de la 0 a
606 / 674 / 723. La partitura de nueve tarjetas termina hacia los 2,5 s.

Verificación de la vuelta: `pnpm test` 1353 · `typecheck` y `lint` limpios · e2e `home` +
`reduced-motion` + `axe`: 262 pasan, 6 saltadas · `/es` CPU ×12: 0,94 · 0,94 · 0,94, TBT 57–73
ms, CLS 0.

