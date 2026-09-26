# Revisión 2026-09-26 — Las cifras en su letra y las citas del chat

> Rama `mejora/fuente-cifras-y-citas-del-chat`, un PR. Es el «PR pequeño» de la lista de pendientes
> del 2026-09-24: precargar JetBrains Mono (cifras en la primera visita), los chips repetidos del
> chat y los seis documentos que llevan a «Skills». En el camino salió un error real del cambio de
> idioma en móvil, que la precarga destapó.

## 1. Las cifras, en su letra desde la primera visita

**Qué se medía mal.** JetBrains Mono iba con `display: optional` y `preload: false` desde el
Sprint 001, con la idea de que pintaba «métricas y fechas, casi todo abajo del pliegue». Pero sin
precarga el navegador pide la fuente recién cuando el CSS la necesita, y eso siempre llega tarde a
la ventana de `optional`. Medido con el protocolo de DevTools (`CSS.getPlatformFontsForNode`, qué
fuente pintó DE VERDAD el nodo), con la caché vacía:

| Perfil                             | Antes (sin precarga) | Después (con precarga)  |
| ---------------------------------- | -------------------- | ----------------------- |
| Sin límite                         | Arial en 15 de 15    | JetBrains Mono 15 de 15 |
| Solo CPU 4× y 6×                   | —                    | JetBrains Mono 30 de 30 |
| 4G buena (40 ms, 9 Mb/s)           | Arial en 15 de 15    | JetBrains Mono 15 de 15 |
| 4G regular (80 ms, 4 Mb/s, CPU 2×) | Arial 15 de 15       | Arial 15 de 15          |
| 4G lenta de Lighthouse (CPU 4×)    | Arial 15 de 15       | Arial 15 de 15          |

Cada fila son tres páginas × cinco cargas: las cifras de Logros en la HOME, la banda de cifras del
caso de Vesting y `/cv`. Arial es el fallback que `next/font` calcula para JetBrains Mono. En redes
lentas sigue ganando el fallback; eso es lo que `optional` promete (la página no se mueve por
esperar la fuente, CLS 0). Capturas de antes y después en `muestras/2026-09-26-cifras-y-citas/`
(ignorada).

**El costo**, con Lighthouse 12 en local (mediana de 3, móvil):

| URL                     | perf        | LCP            | TBT        | CLS |
| ----------------------- | ----------- | -------------- | ---------- | --- |
| `/es`                   | 91 → **90** | 3409 → 3585 ms | 59 → 64 ms | 0   |
| `/es/proyectos/vesting` | 94 → 94     | 3115 → 3128 ms | 50 → 30 ms | 0   |
| `/es/cv`                | 94 → 93     | 3123 → 3124 ms | 56 → 68 ms | 0   |

La HOME paga unos 176 ms de LCP simulado por un archivo más precargado (la variable latina de
40 KB; una estática 400 + 500 pesaría lo mismo). El TBT no se mueve de verdad: una fuente no es
JavaScript. Los presupuestos no cambian. El juez es el job de Lighthouse de la CI (15 URLs,
mediana de 3). Enmienda en el ADR-006.

## 2. Un chip por documento y destino

Dos fragmentos del mismo documento pintaban dos chips idénticos. Ahora `agruparFuentes`
(`src/lib/ia/fuentes.ts`) los junta por código + ancla en un solo chip que conserva todos los
números, `[3, 4] AF-17 · BI & decisión`, porque la respuesta cita por número. El tooltip junta los
títulos distintos. El contrato del stream y el registro de conversaciones no cambian: agrupar es
solo presentación.

## 3. Cada capacidad cita hacia su tarjeta de Skills

Seis documentos citaban `#skills` y sus seis chips decían «Skills». Cada grupo de Skills lleva
ahora un `id` estable en `cv.{es,en}.yaml`, cada tarjeta pinta `id="skills-<id>"`, y el catálogo
de destinos deriva esas anclas de los datos **solo si el componente montado declara ese id**. El
nombre del destino es el del grupo. El reparto, que el dueño puede cambiar:

| Documento                           | Tarjeta                                                            |
| ----------------------------------- | ------------------------------------------------------------------ |
| `fabric-en-la-practica` (AF-14)     | `#skills-plataforma-de-datos`                                      |
| `gobierno-de-datos-y-de-ia` (AF-17) | `#skills-bi-y-decision` («Gobernanza y calidad de datos» vive ahí) |
| `plataforma-y-despliegue` (AF-18)   | `#skills-ingenieria` (Git, CI/CD)                                  |
| `bi-que-se-adopta` (AF-20)          | `#skills-bi-y-decision`                                            |
| `analitica-predictiva` (AF-21)      | `#skills-ia-y-ml`                                                  |
| `procesos-y-simulacion` (AF-22)     | `#skills-procesos-y-simulacion`                                    |

**Lo que cazó la captura, no un test.** Al llegar a `/es#skills-bi-y-decision`, el título de la
tarjeta quedaba bajo el encabezado. La tarjeta entra con `liftIn` (70 px abajo, encogida y girada):
si el salto llega antes que la animación, apunta a la posición de arranque, y al subir la tarjeta
queda tapada. `scroll-mt-40` (160 px = encabezado + ese recorrido) lo arregla: el título aterriza a
65 px bajo el encabezado en escritorio y en móvil, llegue antes o después de la animación. Queda una
e2e.

**Una frase del corpus alineada** (regla del ADR-025, el corpus dice la verdad del sitio):
`rag-y-el-chat` decía que «los chips son las cuatro fuentes». Ahora dice que las **llevan**, y que
dos fragmentos del mismo documento comparten chip. Se agregó, no se recortó nada, en los dos
idiomas.

## 4. El cambio de idioma en móvil corría el hito que se lee

**Cómo apareció.** Con la precarga, la e2e de idioma cayó en móvil, 4 de 4: «hito a 180 px antes,
a 138 px después». Sin la precarga, pasaba. La causa no era la fuente.

**La causa.** El ancla de contenido (`medirAncla`) recorre los candidatos en orden de documento y
**se cortaba en el primero que estaba por debajo del borde**. El año grande del índice de la
Trayectoria es `sticky` y se queda a media pantalla, así que su posición va por delante del
scroll: el corte ocurría ahí, siempre, y el ancla caía en el título «Trayectoria». Medido en móvil,
leyendo dentro de cada hito y pasando a inglés:

| Hito               | 1   | 2   | 3   | 4   | 5   | 6   | 7   |
| ------------------ | --- | --- | --- | --- | --- | --- | --- |
| Antes (px movidos) | +1  | −42 | −65 | −65 | −87 | −87 | −86 |
| Después            | +1  | 0   | 0   | 0   | 0   | 0   | +1  |

En escritorio, 0 antes y después. El arreglo: de los candidatos que ya pasaron el borde, el más
cercano a él, sin cortar el recorrido.

**Por qué la e2e vieja pasaba.** Medía un hito 180 px **por debajo** del borde. Entre el ancla y
ese hito hay texto, que en inglés es más corto, así que podía moverse con todo derecho. Pasaba
porque en la primera visita la fuente mono era Arial y las alturas coincidían por casualidad. La
e2e ahora mide lo que el ancla promete, el hito que se está leyendo (su borde 100 px por encima de
la ventana). Esa versión sí caza el error.

## Regla 14 — rojos en este commit

**A. Sin agrupar** (`agruparFuentes` con una clave por número). Unit:

```
× dos fragmentos del mismo documento y destino son UN chip con sus dos números
× no se pierde ningún número, y el orden es el de la primera aparición
× el tooltip junta los títulos distintos, sin repetir
```

Y la e2e del chat, con el caso exacto del dueño:

```
Error: chips repetidos: AF-15 · Agentes especializados | AF-09 · Vesting | AF-17 · BI & decisión | AF-17 · BI & decisión
```

**B. Sin precarga** (`preload: false` de vuelta), las tres e2e de la fuente:

```
Error: /es pintó #logros p.font-mono con otra fuente
Error: /es/proyectos/vesting pintó p.font-mono.tabular-nums con otra fuente
Error: /es/cv pintó main .font-mono con otra fuente
```

**C. La tarjeta pierde su id** (se quita `id={`skills-${grupo.id}`}` del componente). Unit
`falta #skills-ia-y-ml`, y la aduana del índice nombra los 12 archivos:

```
✖ Aduana del canal «a fondo» — el build se detiene:
  - data/a-fondo/analitica-predictiva.es.md: «ancla: #skills-ia-y-ml» no existe en el sitio. …
  (… los seis documentos, en los dos idiomas)
```

**D. El id en inglés difiere** (`bi-and-decision`):

```
× las tarjetas de Skills tienen el mismo id en ES y EN (2026-09-26)
+   "bi-and-decision",
```

**E. El margen de antes** (`scroll-mt-20`), e2e en escritorio y móvil:

```
Error: el título de la tarjeta quedó bajo el encabezado
Expected: >= 49 · Received: 33.96875
```

**Un rojo falso, antes de este.** La primera versión de la prueba E esperaba que ningún ancestro
de la tarjeta tuviera `transform`. El contenedor lleva una perspectiva fija que nunca vuelve a
`none`: la prueba fallaba con y sin el arreglo, así que su «rojo» no demostraba nada. Se vio porque
tardó 9,3 s (se agotó la espera, no la aserción) y el verde falló igual. Ahora espera a que la
tarjeta sea del todo visible y su título deje de moverse, y el rojo sale por la razón correcta.
**¿Lo viste fallar por lo que dice que vigila?** Es la pregunta que faltaba en «¿lo viste fallar?».

**F. El corte de antes en `medirAncla`.** Unit:

```
× un candidato fijo (sticky) fuera de orden no corta la búsqueda (2026-09-26)
AssertionError: expected { indice: 1, desfase: 1250, … } to deeply equal { indice: 4, desfase: 50, … }
```

Y la e2e de idioma en móvil (en escritorio pasa: allá el año no rompe el orden):

```
Error: hito a -100px antes, a -165px después
```

Todo se restauró desde respaldo y volvió a verde.

## Verificación

`pnpm test` **47 archivos, 1297 tests** · `typecheck` y `lint` limpios · e2e completo **398
pasan**, 14 saltadas (las de siempre más las tres de fuente en el perfil móvil, a propósito: basta
Chromium de escritorio para preguntarle al motor) · `pnpm corpus:informe` regenerado (la tabla de
`data/a-fondo/README.md` enseña los destinos nuevos).
