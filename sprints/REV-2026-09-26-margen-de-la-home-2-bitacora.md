# Revisión 2026-09-26 (noche) — El margen de la home, segunda vuelta

> Rama `perf/margen-de-la-home-2`. El PR #52 debía darle margen a `/es` en Lighthouse, y su
> bitácora lo dio por pagado. No lo está.

## Lo que pasó en la CI

| Corrida                                            | Código de `/es`             | Rendimiento de `/es` |
| -------------------------------------------------- | --------------------------- | -------------------- |
| PR #52, 078be0d                                    | con el fallback calibrado   | ≥ 0,90 (pasó)        |
| `main` tras el merge del #52, 1414006              | el mismo árbol que 078be0d  | **0,89**             |
| PR #53, 0d80972 (corpus y documentos, no toca `/es`) | el mismo                  | **0,89**             |

Una de tres. En local, con la CPU ×12 que antes reproducía la CI, el #52 daba 0,91 en las tres
corridas: **ese método ya no predice la CI**, y la primera medición que dio verde se tomó por
margen. La aserción no se afloja y no se relanza a ciegas.

El PR #53 no puede moverlo. Sus archivos son:

- documentos del chat, que no se publican;
- un comentario de YAML;
- documentos del repo y el banco de preguntas.

El índice del chat solo se descarga cuando el chat cae al respaldo local (`cargarRetriever` en
`chat-panel.tsx`), nunca al abrir la página.

## Primer paso: que la CI hable

`lhci assert` solo imprime lo que falla, y la cifra que falla sin más (0,89) no dice por qué.
El job de Lighthouse sube ahora sus `lhr-*.json` como artefacto, siempre, siete días. Con ellos se
ve, por URL y por corrida, el LCP, el TBT y las peticiones que el simulador cobró **en el runner**.

**Sin regla 14:** subir reportes no es un gate, no puede ponerse rojo ni verde.

**La primera corrida no subió nada** (run 36289599077): `No files were found with the provided
path: .lighthouseci/lhr-*.json`. La carpeta empieza con punto, y `upload-artifact` ignora lo oculto
salvo con `include-hidden-files: true`. El `if-no-files-found: ignore` lo callaba. Ahora lleva
las dos cosas: sube lo oculto y avisa (`warn`) si no encuentra nada.

El nombre del artefacto lleva el intento (`lighthouse-reports-<n>`): para medir el margen se
relanza el job varias veces, y cada intento guarda sus propios reportes.

**Esa misma corrida pasó Lighthouse.** Con el mismo `/es`, la cuenta va en **dos de cuatro**: el
#52 y la primera del #54 pasaron, y `main` y el #53 cayeron. Es un borde, no una regresión.

## Lo que dicen los reportes de la CI

Segunda corrida del PR #54 (run 36290387433, 8f2bc9a), 45 reportes (15 URLs × 3):

- **`/es`:** 0,64 · 0,91 · 0,95, mediana 0,91 (pasó). La de 0,64 es el arranque en frío de la
  primera URL (TBT 1.064 ms), y la mediana la descarta.
- **El LCP de todas las páginas salta entre dos niveles,** ~2,7 s o ~3,4 s, sin que cambie la
  página. `/es` es la que menos lo aguanta porque además tiene el TBT más alto (~99 ms, contra
  30–70 en las demás).
- **En el nivel malo, `/es` da 0,91; en la CI que falló, 0,89.** Vive en el borde.

**Qué pide la página antes del LCP observado**, en la corrida rápida y en la lenta de `/es`: las
mismas 21 peticiones y 385 KB. La última es siempre `70bc3e…woff2`, 40 KB: **JetBrains Mono**. Se
pide a los ~100 ms, al armar la página, y el LCP se registra a los ~130 ms.

**En las 15 URLs pasa lo mismo:** JetBrains se pide antes del LCP observado en **45 de 45**
corridas, y es la última petición en 43. El #52 le quitó la precarga, pero el navegador la pide
igual al armar la página, porque todas tienen texto mono. En la Mac la pintura llegaba antes que
esa petición, y por eso allá mejoraba y en la CI no.

## El arreglo: la mono se enciende después de la carga

Una fuente solo se descarga si algún texto la usa. Por eso:

- **`globals.css`:** `font-mono` apunta a `--fuente-mono`, que es el fallback calibrado. Pasa a
  `var(--font-jetbrains)` solo cuando `<html>` lleva `mono-lista`.
- **`src/components/carga-la-mono.tsx`** marca `mono-lista` tras el evento `load`. Vive en el
  layout de cada idioma y en el 404 de la raíz.
- **El diagrama BPMN** (`proceso-bpmn.tsx`) nombraba `'JetBrains Mono'` a mano y la pedía por su
  cuenta. Ahora usa la variable, en `style`, porque un atributo de presentación de SVG no resuelve
  `var()`.

Sin JavaScript, las cifras se quedan en el fallback, que ocupa la misma caja.

**En local** (CPU ×12, 3 corridas por URL):

- JetBrains se pide a los 91–155 ms, **después** del LCP observado (52–111 ms).
- Antes de la pintura van 345 KB en vez de 385.
- `/es` da 0,91 · 0,92 · 0,92 y `habla` 0,92 · 0,92 · 0,92, con CLS 0.

El LCP simulado queda en ~3,3 s: lo que falta antes de la pintura es sobre todo JavaScript (~234 KB).
Así que esto da **uno o dos puntos de margen, no un salto**, y lo que vale son los reportes de la
CI, en varias corridas.

## Regla 14 — rojos en este commit

El gate nuevo es un e2e de `tests/e2e/home.spec.ts`, «JetBrains Mono se pide DESPUÉS de la
carga». Lee de las `@font-face` de la página las URLs de JetBrains y exige que cada petición suya
empiece después de `loadEventStart`. Corre en `/es` y en `/es/vitrina/apps/habla`, la ficha con
proceso BPMN.

Las e2e se corrieron en el puerto 3100 con una configuración temporal fuera del repo, porque el
3000 lo ocupaba otro proyecto del dueño.

**V. La mono sin compuerta** (`--font-mono: var(--font-jetbrains)` en `@theme`, como en `main`).
Las dos páginas en rojo:

```
✘ /es: la petición de la mono empieza tras el evento load
  Error: /es: 70bc3e132a0a741e.3t6q91iet4nsy.woff2 se pidió a los 43 ms y la página terminó de cargar a los 96 ms
✘ /es/vitrina/apps/habla: la petición de la mono empieza tras el evento load
  Error: /es/vitrina/apps/habla: 70bc3e132a0a741e.3t6q91iet4nsy.woff2 se pidió a los 43 ms y la página terminó de cargar a los 95 ms
```

**W. El BPMN de `main`**, que nombra la familia a mano, con la compuerta puesta. Solo cae la ficha
con proceso, y `/es` sigue en verde:

```
✘ /es/vitrina/apps/habla: la petición de la mono empieza tras el evento load
  Error: /es/vitrina/apps/habla: 70bc3e132a0a741e.3t6q91iet4nsy.woff2 se pidió a los 42 ms y la página terminó de cargar a los 94 ms
✓ /es: la petición de la mono empieza tras el evento load
```

Los dos archivos se restauraron desde su respaldo. **¿Puede fallar?** Sí, y por dos caminos
distintos: la W muestra que un componente que nombre la fuente a mano la delata en su página.

Las dos pruebas que ya existían esperan ahora a que **la página** cargue JetBrains, sin cargarla
el test. Son «qué fuente pintó las cifras» y «el fallback ocupa la misma caja», que además espera
a `mono-lista` antes de leer la cadena de familias.

## Verificación

- `pnpm test` 1337 de 1337.
- `typecheck` y `lint` limpios.
- e2e completo en el puerto 3100: **421 pasan y 17 se saltan**. Son las 14 de siempre, y las
  mismas pruebas de fuentes en el perfil móvil, que son solo de Chromium de escritorio.
