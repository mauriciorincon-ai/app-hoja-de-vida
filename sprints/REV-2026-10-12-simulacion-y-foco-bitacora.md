# Revisión 2026-10-12 — El foco al final de la galería (M1) y la página de simulación

> Rama `mejora/simulacion-y-foco-de-galeria`, un PR, fuera de sprint. El dueño, al cerrar el
> 2026-10-11: «1. constrúyela ahora [la página de simulación] 2. solventa la deuda [M1]».

## 1. M1 — el foco al final de la galería «Cómo se ve»

**La deuda** (cierre del S9, «Medios»): «foco se pierde al deshabilitar el botón del extremo».

**Lo que se encontró al exigirle el rojo.** La primera demo en Chromium **pasó**: ahí el botón
deshabilitado conserva el foco. Corrida la misma demo en los tres motores:

| Motor           | Tras el último Enter, el foco está en | El siguiente Tab va a         |
| --------------- | ------------------------------------- | ----------------------------- |
| Chromium        | el botón «siguiente»                  | el enlace «Producto anterior» |
| Firefox         | el botón «siguiente»                  | el enlace «Producto anterior» |
| WebKit (Safari) | **`<body>`**                          | **`<body>`**                  |

M1 es real solo en WebKit, el motor de Safari en el Mac y el iPhone. La CI corría solo Chromium
y por eso nunca lo vio.

**El arreglo.** `src/components/vitrina/galeria-carrusel.tsx`: los botones del extremo pasan de
`disabled` a `aria-disabled` (patrón APG): siguen enfocables, se anuncian como no disponibles, se
ven igual (40 % de opacidad, sin hover) y el clic no hace nada.

**El gate.** Un proyecto nuevo en `playwright.config.ts`, `webkit` (Desktop Safari), que corre
**solo** las pruebas marcadas `@webkit`; la CI instala `chromium webkit`. La prueba nueva
(`tests/e2e/vitrina.spec.ts`, «al llegar al final con el teclado, el foco se queda en «siguiente»
@webkit») recorre la galería con Enter hasta el final y exige que «siguiente» siga con el foco,
que un Enter más no mueva nada y que Shift+Tab se quede dentro del carrusel. Los unitarios
(`tests/unit/galeria-carrusel.test.tsx`) exigen `aria-disabled` y no `disabled`, el foco
conservado y el clic inerte.

| Gate                                                                              | Cómo se puso en rojo                                            | Qué dijo                                                                                                          |
| --------------------------------------------------------------------------------- | --------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------- |
| e2e `@webkit` (proyecto webkit)                                                   | correrlo con el componente de antes (`git show HEAD:…` + build) | `toBeFocused() failed · Pantalla siguiente · Expected: focused · Received: inactive` (línea de la aserción de M1) |
| unit «el anterior arranca apagado»                                                | componente de antes                                             | `Expected the element to have attribute: aria-disabled="true"`                                                    |
| unit «lo que el visitante desliza… y los extremos»                                | ídem                                                            | ídem                                                                                                              |
| unit «al llegar al final… conserva el foco y pulsarlo otra vez no hace nada (M1)» | ídem                                                            | ídem                                                                                                              |

El caso unitario «“anterior” apagado en el inicio tampoco hace nada» pasa también con el
componente de antes (un `disabled` no dispara su clic): queda como guarda, no como demo.

**Dos ajustes de pruebas que salieron al correr todo:**

- La prueba de teclado de la galería: «anterior» apagado ahora está en el orden del Tab, así que
  desde la pista el primer Tab llega a él y el segundo a «siguiente».
- En la prueba de M1, cada Enter espera a que su captura llegue a la vista: a mitad del
  desplazamiento suave el indicador pasa por las intermedias (Chromium marcó «3 de 6» a los
  300 ms) y un Enter en ese instante arrancaba desde una de ellas. Eso ya pasaba antes: es el
  ritmo de la prueba, no M1.
- En WebKit, Shift+Tab desde «siguiente» va a la pista y no a «anterior» (Safari no pone botones
  en el recorrido del Tab por defecto): la prueba exige que el foco siga **dentro** del carrusel.

**Una carrera vieja encontrada de paso.** `tests/e2e/axe.spec.ts`, «axe limpio en
/es/vitrina/apps con los carruseles en el final», leía `data-max` al cargar la página y pulsaba
esa cantidad de veces. Pero `data-max` se mide en el cliente: vale N − 1 hasta la primera medida
y N − 2 a dos por vista. Con 7 apps profesionales la lectura temprana daba 6, el sexto clic
pasaba del final y el barrido volvía al inicio (`Expected: "6" · Received: "0"`). Ahora avanza de
a un paso hasta que el carrusel marca `data-final` y compara con el `data-max` ya medido: 3 de 3
en `--repeat-each`.

**Documentos:** `design-system.md` (apagados con `aria-disabled`, nunca `disabled`), bundle
`design-sync/` (hallazgos y galería), manual (el carrusel de «Cómo se ve»), guía v9.26 (k16 →
`k16b`).
