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

## 2. La página de simulación de planlang (ADR-029)

**El hallazgo de partida** (2026-10-11): el paquete de planlang estaba publicado en
`/piezas/planlang/` desde el PR #73, pero ninguna página lo enlazaba. La planeadora lo esperaba
como «página SSG en iframe del mismo sitio» (planlang SPRINT_002, Big-D C21).

**Lo construido:**

- `data/simulaciones.yaml` + `src/lib/vitrina/simulaciones.ts` (motor puro) +
  `simulaciones-loader.ts`: el build falla si el slug no es una app con export, si el `.html` de
  entrada no existe en el paquete, si la entrada no es un `.html` relativo o si una app aparece dos
  veces.
- Ruta `/vitrina/apps/<slug>/simulacion` (`dynamicParams = false`), con rótulo «Simulación · no
  operativo», nota, regreso a la ficha y `MarcoDeSimulacion`. En el sitemap.
- La ficha técnica gana `hrefSimulacion`: «Ver la simulación» en su cierre, solo si la app tiene
  simulación.
- Textos ES/EN en `messages/`.

**La decisión que salió de medir.** Con el marco cargado de entrada, Lighthouse local (3 corridas,
mediana) dio `resource-summary.script.size` **342 KB > 300 KB**: 197 KB de CV Viva (lo de
cualquier ficha) + 136 KB del paquete, que además corre en el mismo hilo (TBT 142–286 ms contra un
tope de 200; una ficha da ~30). En vez de subir el presupuesto de esta ruta, el marco pasó a
**fachada**: un panel con «Abrir la simulación aquí» (monta el `<iframe>` y le da el foco) y
«pantalla completa» (un enlace al `.html`, que funciona sin JavaScript). Medido otra vez: **198 KB
de scripts, 0 peticiones al paquete, TBT 12–56 ms, performance 0,95–0,96, accesibilidad 1**, en
`/es` y `/en`. La ruta entra a `lighthouse-urls.json`.

_Una medición falsa en el camino:_ la segunda corrida volvió a dar 342 KB porque un servidor viejo
seguía vivo en el puerto 3102 y el nuevo no pudo arrancar. El HTML del build nuevo traía el panel
y ningún `iframe`; matado el servidor, la medida fue la de arriba.

**Gates y sus rojos:**

| Gate                                                         | Cómo se puso en rojo                                        | Qué dijo                                                                                                                                                                          |
| ------------------------------------------------------------ | ----------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| unit «el YAML real valida contra los exports y los archivos» | `entrada.en: en-no-existe.html` en `data/simulaciones.yaml` | `Simulaciones inválidas en data/simulaciones.yaml: planlang.entrada.en: public/piezas/planlang/en-no-existe.html no existe`                                                       |
| unit «un archivo de entrada que no existe rompe la carga»    | comprobación de existencia apagada en el motor              | `expected [Function] to throw an error`                                                                                                                                           |
| e2e «la simulación de una app» (5 pruebas)                   | contra el build sin la página                               | 4 de 5 rojas: `Expected: 200 · Received: 404` y la ficha sin `data-cta="simulacion"`; «una app sin simulación no tiene esa ruta» pasa también antes (es cierto en los dos mundos) |

Unit del componente (`tests/unit/marco-de-simulacion.test.tsx`): de entrada no hay `iframe`; al
pulsar nace con su `src` y su `title`, recibe el foco y el botón desaparece.

**Accesibilidad:** axe en las dos rutas y con la simulación abierta, **excluyendo el interior del
marco** (es de otra casa). Un scan único de siete páginas del paquete (`es.html`, `en.html`,
`plan`, `agente`, `brecha`, `playground`, `comparar`) dio **0 violaciones**: nada que reportar a
planlang.

## 3. El corpus del chat: tres cosas que el ADR nuevo destapó

1. **29 decisiones.** El ADR-029 movió la cuenta; el gate de cifras del corpus lo nombró
   (`dice «28 decisiones» y … son 29`) en `apps-pipeline` (dos secciones). Corregido en ES y EN.
2. **Nueve sprints, no ocho.** El gate cuenta los sprints cerrados por `-summary.md`, y el S9
   cerró con `SPRINT_009-cierre.md`: contaba 8 con nueve cerrados (la planeadora lo da por cerrado
   desde el 2026-10-10). El conteo acepta ahora `-summary` y `-cierre`. La frase de
   `apps-pipeline` no la juzga el gate (su sección habla de «la fábrica» y el patrón la salta a
   propósito, para no confundirla con los sprints del pipeline entero), así que se corrigió a mano,
   junto con las de `como-aprendo` (ES y EN).
3. **El inglés se había quedado atrás.** El PR #73 alineó el corpus en español a 10 apps, 15
   agentes y 38 piezas, y diez secciones en inglés siguieron con 6, 13 y 32: el gate de cifras lee
   solo el español y la paridad ES/EN solo exige que existan las mismas secciones. Además, el
   título español de `como-aprendo` quedó en «Las 35 piezas» por un error del propio #73 (el total
   es 38, como ya decía el inglés). **Gate nuevo** `tests/unit/a-fondo-cifras-gemelas.test.ts`:
   cada sección dice los mismos números en los dos idiomas, con dos excepciones escritas y su
   razón («más de diez» con letras; «desde el 21», una fecha) que el test pide retirar si dejan de
   hacer falta.

| Gate                             | Cómo se puso en rojo             | Qué dijo                                                                                                                                                                                                                   |
| -------------------------------- | -------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `a-fondo-cifras-gemelas.test.ts` | correrlo con el corpus de `main` | 10 secciones, p. ej. `agentes-en-produccion · escala-frente-a-profundidad: solo en español {"15":1} · solo en inglés {"13":1}` y `como-aprendo · evidencia-construido: solo en español {"35":1} · solo en inglés {"38":1}` |

## 4. Verificación

`pnpm vitest run` 1504/1504 · typecheck · lint · build · e2e completo en :3100 en los tres
proyectos (Chromium, teléfono, WebKit `@webkit`): 507 pasadas, 34 saltadas · axe (rutas nuevas y
simulación abierta) · Lighthouse local de la ruta nueva (presupuesto y categorías) ·
`pnpm audit --audit-level high` limpio · barrido de cero enlaces tras el último `git add`.

Capturas: `sprints/REV-2026-10-12-capturas/` (panel y simulación abierta a 1280 y 390, y el cierre
de la ficha con «Ver la simulación»).
