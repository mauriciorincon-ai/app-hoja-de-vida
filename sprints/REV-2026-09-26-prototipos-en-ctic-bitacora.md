# Revisión 2026-09-26 — Prototipos en CTIC y el cupo de hola@

> Rama `mejora/prototipos-en-ctic`, un PR. Dos compromisos del PR #50 y del Email Routing, que el
> dueño cerró el mismo día tras el merge del #52:
>
> - Microsoft Agent Framework y Claude Agent SDK, que entraron a Skills sin «dónde»: _«CTIC como
>   experimentación y creación de prototipos»_.
> - «Enviar como» `hola@` desde Gmail: _«eso ya fue configurado»_.

## 1. Dónde usó Microsoft Agent Framework y Claude Agent SDK

Una frase en cada documento del chat que ya nombraba sus frameworks de agentes, en los dos idiomas:

- **`fundacion-ctic`**, subsección `los-tres-campos-que-reune-el-rol`, tras el ecosistema de
  LangChain: _«Con Microsoft Agent Framework y Claude Agent SDK, mi trabajo aquí ha sido de
  experimentación y creación de prototipos.»_
- **`agentes-en-produccion`**, subsección `n8n-como-base`: la misma idea con _«en cambio»_. Ese
  documento habla de agentes en producción, y el chat no debe leer ahí que estos dos lo estuvieron.
  En español la frase nueva dejó la subsección en **405 palabras contra un tope de 400**, y
  `a-fondo-coherencia.test.ts` la paró. Se fundió con la frase de LangChain, que escribí yo en el
  PR #50: _«En la Fundación CTIC sigo trabajando con n8n y con los frameworks del ecosistema de
  LangChain (LangChain, LangGraph, LangSmith y Langflow); con Microsoft Agent Framework y Claude
  Agent SDK, en cambio, experimento y construyo prototipos.»_ El texto del dueño no se tocó.

La tarjeta de Skills no cambia: el dueño eligió las dos herramientas en el barrido del PR #50, y el
«dónde» vive en el corpus, como el de LangChain. El comentario de `data/cv.es.yaml` lo anota.

## Regla 14 — la pregunta nueva del banco

Una fila nueva en `tests/fixtures/banco-de-preguntas.{es,en}.yaml`: _«¿Dónde ha usado Microsoft
Agent Framework o Claude Agent SDK?»_ (y su gemela en inglés).

**¿Puede fallar? El primer intento no podía.** Con `espera: [fundacion-ctic,
agentes-en-produccion]`, la pregunta pasó **en verde antes de tocar el corpus**, 308 de 308. El
banco pide que llegue al top-4 cualquiera de las fuentes esperadas, y `agentes-en-produccion`
llegaba por la palabra «frameworks» (su subsección `n8n-como-base` y su `cuando_usar`) sin nombrar
ninguna de las dos herramientas. Con `skills` habría pasado igual: la tarjeta las nombra sin decir
dónde. Así la fila no medía si el corpus contesta el dónde.

**La fila que quedó** espera solo `fundacion-ctic`: el documento cuya cita, `/proyectos/fundacion-ctic`,
contesta el dónde. La nota de la fila lo explica.

**U. Sin la frase en el corpus** (el banco nuevo contra los documentos de `main`):

```
FAIL  tests/unit/banco-de-preguntas.test.ts > cada pregunta trae su fuente en el top-4 > ¿Dónde ha usado Microsoft Agent Framework o Claude Agent SDK?
AssertionError: «¿Dónde ha usado Microsoft Agent Framework o Claude Agent SDK?» no trajo ninguna de sus fuentes esperadas.
  esperaba: fundacion-ctic
  trajo:    skills-agentes-e-ia-generativa, a-fondo-agentes-en-produccion-n8n-como-base~2, a-fondo-agentes-en-produccion-cuando-usar, a-fondo-agentes-en-produccion-n8n-como-base~1
FAIL  tests/unit/banco-de-preguntas-en.test.ts > … > Where has he used Microsoft Agent Framework or Claude Agent SDK?
  esperaba: fundacion-ctic
  trajo:    skills-agentes-e-ia-generativa, a-fondo-agentes-en-produccion-n8n-como-base~2, a-fondo-gobierno-de-datos-y-de-ia-iso-42001~1, a-fondo-los-agentes-de-la-vitrina-como-nace-un-agente~1
Tests  2 failed | 306 passed (308)
```

Falla por la razón del gate: el corpus no dice dónde. **Con la frase**, 308 de 308. El top-4 en
español: `agentes-en-produccion-n8n-como-base~1` (407), la tarjeta de skills (280),
`fundacion-ctic-los-tres-campos-que-reune-el-rol~1` (237) y `n8n-como-base~2`. En inglés, CTIC
entra segundo (242). El fragmento que queda primero es el que ahora también dice dónde.

## 2. El BLUEPRINT: `hola@` también responde

El BLUEPRINT decía de `hola@` _«Solo recibe: responder como `hola@` exigiría un servidor de salida,
que no hay»_, y desde hoy es falso. El dueño configuró en su Gmail «Enviar como» `hola@`, con salida
por el SMTP de Resend (los pasos del 2026-09-26: clave propia, solo de envío).

- **Diagrama:** la caja «Correo entrante» pasa a «Correo de hola@», con dos líneas, «entra:
  Cloudflare → Gmail» y «sale: Gmail → SMTP de Resend». Resend, en «Servicios externos», dice
  «formulario · chat · hola@» (decía «email del formulario»: el código del chat ya iba por ahí desde
  el 2026-09-21). El texto cabe en sus cajas, medido con `getBBox`. Captura en
  `muestras/2026-09-26-prototipos-en-ctic/blueprint-diagrama.png`.
- **Tabla:** la fila de Resend suma el tercer uso y lo que el compromiso pedía anotar: **los tres
  comparten el cupo gratis, 100 correos/día y 3.000/mes**, y qué deja de llegar si se agota. La fila
  de `hola@` cuenta la salida y el DMARC en `p=none`, verificado con `dig`. La de costo nombra el
  cupo compartido.
- **Historial:** una fila nueva. Sin servicio nuevo ni costo, y el punto único de falla no cambia.

El manual lo dice para el dueño en la sección del formulario: tus respuestas como `hola@` gastan del
mismo cupo.

## Verificación

`pnpm test` 1339 de 1339 (la fila nueva, en los dos idiomas) · `typecheck` y `lint` limpios ·
`pnpm build` con 25 de 25 documentos aprobados e indexados en los dos índices.

**El informe del banco** (`sprints/SPRINT_008-banco-de-preguntas.md`, lo genera
`pnpm corpus:informe`) no se regeneraba desde antes del PR #50: ahora cuenta 146 preguntas, las 20
de las herramientas y esta, **146 de 146 con su fuente en el top-4, 114 de primeras (78 %)**. Dos
defectos del generador, anteriores a este PR y sin pagar aquí: su encabezado sigue diciendo que
«los 24 documentos siguen en `borrador`» cuando hay 25 aprobados, y fecha en UTC (dice 2026-09-27
a las 21:30 del 26 en Bogotá).

**Los e2e no corrieron en local:** el puerto 3000 lo ocupaba un servidor de otro proyecto del
dueño, y la configuración de Playwright reutiliza lo que encuentre ahí. Se habrían probado contra
otra app. Los corre la CI.
