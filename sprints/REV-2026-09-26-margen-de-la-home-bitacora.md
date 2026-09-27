# Revisión 2026-09-26 — El margen de la home

> Rama `perf/margen-de-la-home`, un PR. En el PR #51 la CI cayó dos veces seguidas en Lighthouse:
> `/es` con 0,89 de rendimiento contra un mínimo de 0,90, sin que el PR tocara la página (la
> investigación está en `REV-2026-09-26-aire-del-dominio-bitacora.md`). El dueño: _«sí, arranca
> con el margen»_.

## 1. Por qué `/es` estaba en el borde

**Cómo calcula Lighthouse el LCP simulado.** Se leyó el código del simulador (lantern,
`LargestContentfulPaint.js`): cuenta como parte del LCP **todo lo que se pidió antes del momento en
que el LCP se pintó de verdad**, salvo las imágenes de baja prioridad. No importa que el elemento
sea texto que no espera nada.

**Qué se pedía antes del LCP observado** (62 ms en la corrida sin simulación): 21 de 24 peticiones,
383 KB. JavaScript 234 KB (React, el runtime de Next, la animación —ya diferida con `LazyMotion`—
y los componentes: nada sobrante), tres fuentes precargadas 105 KB (Inter 48, **JetBrains Mono
40**, Fraunces 18), el HTML 30 KB y el CSS 14 KB. Los textos traducidos ya viajan recortados.

**La palanca.** La precarga de JetBrains Mono se agregó esa misma mañana para que la primera
visita no pintara las cifras en Arial, y el ADR-006 ya había medido su costo: ~176 ms de LCP en la
HOME, de 91 a 90. Ese fue el margen que se perdió.

**Cómo medir cerca de la CI.** El runner es más lento que la máquina local: con
`cpuSlowdownMultiplier=12` se reproduce el 0,89 de la CI en `/es`.

## 2. Las opciones, medidas (15 URLs de la CI, CPU ×12, mediana de 3)

| Opción                                                | `/es` | peor URL | CLS máx.  |
| ----------------------------------------------------- | ----- | -------- | --------- |
| main: precarga + `optional`                           | 0,89  | 0,89     | 0,000     |
| B: `swap` sin precarga, fallback de next/font (Arial) | 0,91  | **0,78** | **0,257** |
| D: `swap` sin precarga, **fallback mono calibrado**   | 0,91  | 0,91     | 0,000     |

**B se descartó**: Arial es proporcional, y al cambiar de letra una ficha de la vitrina
(`/es/vitrina/agentes/hr-develop-ai-apps`) se movió CLS 0,257; tres páginas más, entre 0,04 y 0,05.
Es el mismo modo de falla que en el S2 mandó a `/cv` a `optional`.

**D es lo que se construyó.** El fallback es propio: dos `@font-face` locales en `globals.css`,
monoespaciados como JetBrains Mono y calibrados con sus métricas, leídas del woff2 con fontkit
(avance 0,6 em, ascenso 1,02, descenso 0,30, sin interlineado):

| Fallback               | Fuentes locales                         | Avance      | size-adjust | ascent / descent  |
| ---------------------- | --------------------------------------- | ----------- | ----------- | ----------------- |
| «JBM Fallback Menlo»   | Menlo, DejaVu Sans Mono, Bitstream Vera | 1233 / 2048 | 99,66 %     | 102,35 % / 30,1 % |
| «JBM Fallback Courier» | Courier New, Liberation Mono, Cousine   | 1229 / 2048 | 99,98 %     | 102,02 % / 30 %   |

En `fuentes.ts`: `display: "swap"`, `preload: false`, `adjustFontFallback: false` y
`fallback` con las dos. Con la CPU por defecto de Lighthouse, las 15 URLs pasan las dos aserciones
de la CI (presupuesto y categorías); la peor mediana es 0,91 y `/es` da **0,92 · 0,92 · 0,92**
(antes 0,90 · 0,91 · 0,91).

**Lo que ve un visitante.** Las cifras llegan a JetBrains Mono también en la primera visita, ahora
por cambio y no por precarga. En una conexión lenta puede verse un instante una mono parecida, y
nada se mueve. Antes, en la 4G lenta ganaba el fallback y se quedaba.

## Regla 14 — rojos en este commit

El gate nuevo es un e2e en `tests/e2e/home.spec.ts`: las cifras de la página llevan la cadena del
fallback calibrado; el fallback se resuelve a una de las fuentes locales calibradas (y dice cuál);
y ocupa la misma caja que JetBrains Mono (ancho con 0,5 % de tolerancia, alto de línea con 0,5 px).

**S. El fallback descalibrado** (`size-adjust` de los dos a 90 %):

```
✘ el fallback de las cifras ocupa la misma caja que JetBrains Mono
Error: ancho: fallback 302.45 px, JetBrains 336.00 px
Expected: < 0.005
Received:   0.09984188988095238
```

**T. El fallback desconectado** (sin `adjustFontFallback: false` ni `fallback`, es decir, el de
next/font):

```
✘ el fallback de las cifras ocupa la misma caja que JetBrains Mono
Error: las cifras no llevan el fallback calibrado
Received string:  "\"JetBrains Mono\", \"JetBrains Mono Fallback\""
```

Restaurados los dos archivos desde su respaldo, 4 de 4 en verde (el gate y las tres pruebas de
«qué fuente pintó las cifras», que ahora esperan a `document.fonts.ready`). **¿Puede fallar?** Sí:
la T muestra además por qué el ancho solo no bastaba, porque medía las familias por nombre y
habría seguido en verde con la página usando el fallback de Arial.

**En la CI corre por primera vez en este PR**, en Linux: ahí el fallback debería resolverse a
DejaVu Sans Mono o a Liberation Mono. Si el runner no tiene ninguna, el test lo dice por nombre.

## Verificación

`pnpm test` 1337 · `typecheck` y `lint` limpios · e2e completo **419** (15 saltadas: las 14 de
siempre y el gate nuevo en el perfil móvil, que es solo de Chromium de escritorio) · Lighthouse
local con las dos aserciones de la CI sobre las 15 URLs, en verde.

La deuda que declaró el #51 («darle margen a `/es`») queda pagada con este PR. La hipótesis que
anotó (el script previo a la pintura) resultó ser, más exactamente, **todos los bytes pedidos
antes de la pintura**, y la parte que se podía mover era la fuente precargada.
