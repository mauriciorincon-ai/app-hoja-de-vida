---
sprint: 007
app: hoja-de-vida
status: closed
opened: 2026-09-06
closed: 2026-09-09
branch: sprint-007/las-estanterias
pr: https://github.com/mauriciorincon-ai/app-hoja-de-vida/pull/21
---

# Sprint 007 Summary — CV Viva

## Outcome

**Sí, y más de lo pedido.** Los tres outcomes se cumplen (O1 investigaciones abierta · O2 agentes
abierta · O3 contrato al día) y además entra **tableros**, que la orden dejaba para el S8: sus
fichas aparecieron durante el sprint y el usuario pidió integrarlas. **Los cuatro frentes de la
vitrina están abiertos con piezas reales.**

## Qué se construyó

| Frente | Piezas | Fuente |
| ------ | ------ | ------ |
| apps | 6 | export de cada app + complemento curado (S6, sin cambios) |
| agentes | 13 | `content/agentes/` — llegaron tal cual, sin editar un campo |
| investigaciones | 7 | `content/investigaciones/` — ídem |
| tableros | 6 | `content/tableros/` — ídem, con 36 capturas |

- **Un renderizador genérico de piezas por frente.** Loader fail-safe (`src/lib/vitrina/piezas.ts`)
  que rompe el build nombrando archivo y campo; escaparate `/vitrina/<frente>`; ficha
  `/vitrina/<frente>/<slug>` con el **mismo** `FichaTecnica` que una app; frente `abierta` solo si
  tiene piezas en disco; cuenta **medida**, nunca escrita. Abrir un frente nuevo con piezas es
  crear una carpeta y tocar el YAML: **cero código**.
- **`MuestraPieza`**, la tarjeta de una pieza sin pantalla: en el sitio donde una app enseña su
  maqueta van **el titular de valor y tres cifras con su procedencia** — lo único que una pieza sin
  interfaz tiene y no se puede fingir. Si la ficha trae galería, su primera captura hace de portada.
- **Contrato v1.1.0 → v1.3.1**, siempre por adición salvo un parche de endurecimiento:
  v1.2.0 (`"planeadora"` + plantilla generada del Zod) · v1.3.0 (`conclusiones` 3–6 y `galeria`
  1–12, opcionales) · v1.3.1 (la ruta de una captura no puede escaparse con `..` ni empezar en `/`).
  **Ninguna ficha ajena se editó para que cupiera.**
- **Tres secciones opcionales y renumeración sin huecos:** una app va 01–05, una investigación
  01–04, un tablero 01–06.
- Sitemap, `alternates`, axe sobre todas las rutas nuevas × 2 idiomas × 2 viewports, Lighthouse
  con 6 URLs nuevas, guía v6, manual, ADR-017 y bundle del design system.
- **De 62 a 111 páginas estáticas.**

## DoD — los 6+1 estándares

| Estándar | Evidencia |
| -------- | --------- |
| **Testing** | 370 unitarias · e2e 319 pasadas / 11 saltadas / **cero flaky** · cobertura `src/lib/**` 93.6 % statements, 84.6 % branches (umbral 70) |
| **CI/CD** | `typecheck` · `lint` · `test` · `build` · `audit` · `peers check` · `test:e2e` · Lighthouse con las 6 URLs nuevas. Cada check debe cerrar con `success` propio |
| **Observabilidad** | Sin endpoints nuevos (SSG puro). El fail-safe del contenido escribe diagnóstico con archivo y campo |
| **Seguridad** | `pnpm audit --audit-level high` limpio (tapado un aviso Alto de calendario) · cero secretos · **cero enlaces** · cero datos de personas · la galería ya no puede salirse de su carpeta |
| **Performance** | Presupuesto medido en local sobre las rutas con imágenes: LCP 3359 ms y 482 KiB en el escaparate de tableros, contra 3850 ms y 1000 KiB |
| **UX + A11y** | axe 0 violaciones en las 12+ rutas nuevas × 2 idiomas × 2 viewports · reduced-motion en las rutas nuevas · foco visible · la tarjeta conserva el nombre de la pieza como nombre accesible |
| **IA responsable** | No aplica: el sprint no tocó `lib/ia/` |

## Métricas técnicas

| Métrica | Objetivo | Resultado |
| ------- | -------- | --------- |
| Frentes abiertos | 2 (investigaciones, agentes) | **4** |
| Piezas publicadas | 20 | **26** |
| Páginas SSG | ~104 | **111** |
| Fichas editadas en esta casa | 0 | **0** |
| Gates nuevos demostrados en rojo | todos | **11** (6 del contenido y la plantilla, A–G del motor y la UI, H–L de la auditoría) |

## Decisiones no anticipadas

- **ADR-017 — Las estanterías:** loader genérico por frente, «abierta» como medición y el contrato
  v1.3.x. Incluye las cuatro alternativas descartadas y, tras la auditoría, **lo que el ADR no
  logró**: `apps` sigue siendo un caso especial en varios sitios porque su fuente de datos difiere
  de verdad; unificarlo pide `content/apps/`, que es del sprint siguiente.

## Bugs + resoluciones

| Bug | Resolución |
| --- | ---------- |
| **«0 FUNCIONALIDADES»** en las 7 investigaciones (visto por el usuario): sus bloques declaran `cuenta: 0` porque tienen aportes, no funciones, y la app imprimía el número igual | Invariante, no síntoma: *la app nunca escribe un número que la ficha no declaró.* Rojo demostrado citando la ficha y el texto |
| **Las fichas en inglés decían «decisiones registradas» en español** en las seis apps: la clave del hito era el texto, así que nunca coincidía con el diccionario | `etiqueta: "decisiones"`. Verificado en `/en/vitrina/apps/habla` |
| **El gate de cero enlaces no cazaba un host de despliegue sin esquema** (`mi-tablero.vercel[.]app`), y el e2e nuevo revisaba 1 de 26 piezas | Patrón ampliado a los tres hosts; el e2e barre las 26 piezas y los 4 escaparates, sobre el HTML entero |
| **Una ficha copiada al frente equivocado pasaba el build** y enlazaba a un 404 | El loader valida frente y nombre de archivo: rompe el build |
| **`galeria[].archivo` aceptaba `..` y raíz** | Contrato v1.3.1 |
| `pnpm audit` en rojo por `js-yaml` (aviso de calendario, transitivo de eslint) | Override a `^4.3.2`; comprobado paquete por paquete que nada se degradó |
| Una ficha sin `hitos` traducibles y con estados nuevos rompía pruebas que asumían frentes en preparación | Las pruebas se generalizaron: se saltan **declarando la razón** o afirman `>0` |

## Qué salió bien / qué generó fricción

**Bien.** El contrato aditivo funcionó exactamente como la orden lo previó: cuando 6 fichas no
cupieron, creció el contrato y no se tocó una coma de ellas. El renderizador único demostró su
valor el día que entró un tipo de pieza que nadie había planeado: **tableros no costó una línea
de componente**, solo dos secciones opcionales. Y la regla del rojo en el mismo commit atrapó
cosas de verdad, incluida una que nadie buscaba: al intentar demostrar un gate nuevo descubrí que
era **inalcanzable** y lo retiré en vez de dejar decorado.

**Fricción.** Abrir los cuatro frentes dejó **sin sujeto** a la página de «en preparación» y a las
pruebas que la vigilaban: hubo que decidir entre borrarlas (perder la regresión) o dejarlas
mintiendo. Se optó por saltarlas **declarando la razón**, y queda como deuda que esa rama no la
vigila nada. La otra fricción fue de medición: **una sola corrida de Lighthouse dio un falso rojo**
y por poco se paga con una optimización a ciegas.

## Sugerencias de mejora al método

1. **Una sola corrida de Lighthouse no es una medición.** El `/deploy-check` debería decir
   explícitamente que la casilla de performance se corre con ≥3 corridas y se lee la mediana:
   la primera contra un servidor recién levantado da un falso rojo reproducible.
2. **La regla 14 necesita su tercera pregunta: *¿puede este gate fallar siquiera?*** Ya pregunta
   «¿lo has visto fallar?» y «¿lo has visto correr?». Aquí apareció un gate cuya condición era
   **imposible** por una regla anterior. Solo se descubrió al intentar el rojo — y ese es
   justamente el argumento para exigirlo.
3. **El barrido de la regla 16 debería correrse también sobre lo que se escribe para explicarlo.**
   Un comentario mío en un test citó el host literal y **rompió el gate** que ese mismo test
   defiende. La regla ya prevé el caso para los documentos; conviene decir «y para el código».
4. **Al abrir el último frente de un eje, la orden debería pedir el inventario de lo que se queda
   sin sujeto.** Aquí fueron una página, tres pruebas e2e y dos afirmaciones del manual.
5. **`/audita-sprint` gana valor si su Fase 1 la corre un auditor independiente** con el diff
   delante: los dos hallazgos más caros (el agujero del gate de enlaces y la ficha fuera de sitio)
   los encontró revisando lo que el constructor daba por bueno.

## Deuda técnica aceptada

| Qué | Por qué | Pago |
| --- | ------- | ---- |
| La rama «en preparación» sin cobertura en ninguna capa | Con los cuatro frentes abiertos no tiene sujeto; recuperarla pide un YAML de fixture | Vuelve sola con el quinto frente, o S8 si se decide el fixture |
| La suite de axe crece 4 escaneos por ficha entregada (~188 hoy) | El renderizador es uno, pero el contenido no; axe sobre contenido real ya cazó un contraste en el S6 | Se vigila el tiempo (56 s hoy) antes de recortar |
| `colorEstado` en tres formas y el locale BCP-47 en dos | Cosmético | Cuando se toque la paleta |
| El fail-safe «Ficha ilegible» sin cubrir; `n.s01!` apoyado en runtime; keys de React sobre texto libre | Sin efecto observable | S8 |
| `cache()` no memoiza entre páginas: las 111 revalidan las 26 fichas | Coste de build, resultado idéntico | Si el build molesta, y en `piezas.ts` **y** `loader.ts` a la vez |
| Los `hitos[].etiqueta` que las fichas ajenas escriben en español salen así en `/en` | El contrato los define como texto libre y aquí no se editan | Se reporta a las casas productoras |
| `"planeadora"` en `procedencias` sigue sin consumidor | Se añadió a petición del README de la vitrina | Cuando la planeadora produzca su primera ficha |
| `eslint@9.39.4` avisa de deprecación | Es un mayor: llega suelto, no en el lote (regla 17) | S8 |
| Iconos propios de las piezas nuevas (usan el rombo genérico) | Declarado en el plan | S8 |

## Gate ⭐ — diferido, con sus contrapesos

La orden lo autoriza (sprint intermedio del ciclo H2) y **el usuario decidió además aplazar toda
la revisión** hasta que el contenido de la hoja de vida esté completo. Condiciones cumplidas:

- **(a)** Diferimiento registrado aquí y en la bitácora.
- **(b)** Guía **v6 acumulativa** con filtro ⭐ del acumulado: 72 pruebas, **22 ⭐** (17 heredadas +
  **5 nuevas**: m10 juicio de contenido de las piezas ajenas · m11 aprobación visual de los
  escaparates · m12 juicio de las 36 capturas · m13 y m14 teléfono real).
- **(c)** Contrapesos: pasada de capturas del constructor sobre escaparates y fichas en dos
  viewports, más e2e de reduced-motion sobre las rutas nuevas (`j5` en la guía).

## Corte declarado (lo que NO entra)

`content/apps/` (el frente apps consumiendo la ficha completa) · la **publicación** del
`design-sync` (el bundle sí se actualizó en este PR, como manda la regla 15) · iconos propios de
las piezas nuevas · el cierre del ciclo H2 (BLUEPRINT, ⭐ acumulado). **Tableros ya no está en el
corte: entró aquí.**

## Nota para la planeadora

El usuario decidió que **el siguiente sprint sea el del detalle de la hoja de vida** —los
documentos que sustentan el chat— y que **la revisión completa vaya después**, con recálculo del
trabajo restante. El mensaje está en `sprints/SPRINT_007-mensaje-a-la-planeadora.md`. Dato que lo
motiva: el chat se indexa hoy desde una historia de **12 secciones de ~40 palabras**.

## Archivos clave

1. `src/lib/vitrina/piezas.ts` — el loader genérico y sus tres fail-safes
2. `src/components/vitrina/muestra-pieza.tsx` — la tarjeta de una pieza sin pantalla
3. `src/lib/vitrina/ficha-tecnica/schema.ts` — el contrato v1.3.1
4. `src/lib/vitrina/ficha-tecnica/secciones.ts` — la renumeración con tres opcionales
5. `src/app/[locale]/vitrina/[categoria]/[pieza]/page.tsx` — la ficha de una pieza
6. `src/lib/vitrina/categorias.ts` — `FRENTE_PROPIO` y los helpers del frente dinámico
7. `tests/unit/content-fichas.test.ts` — la aduana de las 26 fichas
8. `decisions/017-estanterias-por-frente.md`
9. `docs/GUIA-DE-PRUEBA.html` — v6, 72 pruebas
10. `sprints/SPRINT_007-implementation-log.md` — la bitácora con los 11 rojos

## Cómo probar

1. `pnpm install && pnpm build && pnpm start`.
2. Abrir `/es/vitrina`: cuatro cajas, cuatro cuentas medidas.
3. Entrar a cada frente, abrir una ficha de cada uno y comparar la numeración: app 01–05,
   investigación 01–04, tablero 01–06.
4. `pnpm test` · `pnpm test:e2e`.
5. El recorrido guiado completo está en `docs/GUIA-DE-PRUEBA.html`, bloque **M**.
