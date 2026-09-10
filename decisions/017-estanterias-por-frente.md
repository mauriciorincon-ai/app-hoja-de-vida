# ADR-017 — Las estanterías: un loader genérico por frente, «abierta» medida por piezas y el contrato v1.3.x

- **Status:** accepted
- **Date:** 2026-09-09
- **Sprint:** 007

## Contexto

Hasta el S6 la vitrina sabía renderizar **una sola clase de pieza**: las apps. Su ficha técnica se
arma en build desde dos fuentes que solo existen para apps (el `brochure-export.json` del repo
hermano en `content/vitrina/` + el complemento curado de `data/fichas/`), y el estado `abierta`
de un frente estaba codificado dos veces contra el literal `"apps"` — en el `superRefine` de
`src/lib/schemas.ts` y en el conteo de `src/lib/vitrina/categorias.ts`. Los otros tres frentes
(agentes, investigaciones, tableros) solo tenían página de «en preparación».

El S7 trajo **26 fichas técnicas completas producidas por otras casas** (13 agentes, 7
investigaciones, 6 tableros): ya no son un export crudo que esta app cura, sino el contrato
`fichaTecnicaSchema` entero, escrito en origen. Y llegaron con una regla dura encima: **no se
editan aquí, ni para que quepan**.

Tres preguntas había que responder de una vez, no tres veces:

1. ¿Cómo se cargan piezas de un frente cualquiera sin duplicar código por frente?
2. ¿Qué significa que un frente esté «abierto», ahora que puede estarlo o no según lo que haya en
   disco?
3. ¿Qué se hace cuando una ficha real no cabe en el contrato?

## Decisión

### 1. Un loader genérico, no uno por frente

`src/lib/vitrina/piezas.ts` es el único punto de entrada: `getPiezas(frente)` lee
`content/<frente>/*.ficha-tecnica.json`, valida cada archivo contra `fichaTecnicaSchema` y
devuelve las piezas ordenadas. `getPieza(frente, slug)` y `frentesConPiezas()` se apoyan en él.
Agregar un frente nuevo con piezas es **crear una carpeta y declararlo `abierta` en el YAML**:
cero código.

**Fail-safe, como todo el contenido de esta app:** un JSON inválido **rompe el build** nombrando
archivo y campo, y el mensaje incluye el aviso de que la corrección va **en origen**, no aquí.
Pero un frente **sin carpeta** devuelve `[]` en vez de lanzar — un frente que aún no nace no es
un error, y esa asimetría es deliberada (contraste con `getFichasVitrina()`, que sí lanza si
`content/vitrina/` está vacío, porque las apps sí tienen que estar).

**Orden determinista:** selladas primero, después alfabético por nombre con `localeCompare`
es-CO. Sin fecha de por medio: una pieza no sube ni baja del escaparate porque alguien tocó un
archivo.

### 2. «Abierta» es una medición, no una declaración

`parseVitrina(data, source, frentesConPiezas)` exige que **un frente marcado `abierta` tenga al
menos una pieza publicada**, y el error nombra al frente culpable y lista los frentes que sí
tienen piezas hoy. La cuenta que el portal enseña (**«13 piezas»**) se mide igual: archivos en
disco, no un número escrito a mano que se queda viejo.

Esto **levanta la regla del S6 por frente, no en general**: `apps` conserva su fuente propia (el
manifiesto de exports); los demás frentes miden `content/<frente>/`, y `"apps"` deja de ser
sinónimo de «el único frente que puede estar abierto».

**Lo que este ADR NO logró, y conviene no fingir:** `apps` sigue siendo un caso especial escrito
en varios sitios —la cuenta, la validación del YAML, las dos páginas dinámicas y el sitemap—
porque los cuatro tienen que saber que ese frente **no se sirve por la ruta genérica**. La regla
está centralizada en `getFrenteDinamico()`, pero el literal sobrevive donde la fuente de datos
difiere de verdad. Unificarlo del todo pide que `apps` también publique fichas completas en
`content/apps/`, que es trabajo del sprint siguiente.

### 3. Un solo renderizador, y el contrato crece por adición

`FichaTecnica` renderiza `fichaTecnicaSchema`, no un tipo de pieza. La ficha de un agente, la de
una investigación y la de un tablero pasan por el **mismo componente** que la de una app; lo
específico del frente vive en datos (`data/vitrina.yaml`) o en el escaparate. La ruta
`/vitrina/<frente>/<slug>` no pasa `hrefDetalle` — las piezas de otras casas no tienen página de
detalle aquí — y el cierre de la ficha se adapta solo.

Cuando las fichas reales no cupieron, **cambió el contrato, nunca la ficha**:

| Versión | Qué añade | Por qué |
| ------- | --------- | -------- |
| v1.2.0 | `"planeadora"` en `procedencias` · plantilla generada del Zod | lo pedía el README de la vitrina; la plantilla la necesita cualquier casa productora |
| v1.3.0 | `conclusiones` (3–6) · `galeria` (1–12) | un tablero **es** hallazgos y pantallas; una app no |
| v1.3.1 | `galeria[].archivo` rechaza `..` y la raíz | «relativa» tiene que serlo de verdad (auditoría del sprint) |

Ambas **aditivas**: `required` no cambia, toda ficha v1.1.0 sigue válida, y el gate de versión
solo rechaza un salto de **mayor**. La numeración de secciones se generalizó a **tres
opcionales** (proceso · conclusiones · galería) que se renumeran seguidas: una app va 01–05, una
investigación 01–04, un tablero 01–06. Nada de huecos que hagan pensar al lector que se perdió
algo.

**Decisión propia dentro de la propuesta recibida:** en `conclusiones`, el campo `fuente` es
**obligatorio**. Toda cifra de esta vitrina declara de dónde salió; un hallazgo con número y sin
procedencia es una opinión disfrazada.

## Alternativas descartadas

- **Un loader y un renderizador por frente.** Habría permitido que cada frente se viera distinto,
  al precio de que cada frente nuevo costara un sprint. Lo específico por frente cabe en datos.
- **Adaptar las fichas recibidas al contrato v1.1.0** (recortar textos, tirar la galería). Es
  exactamente lo que la regla del canal de contenido prohíbe: la ficha se corrige en origen, y si
  no cabe por una razón legítima del frente, **crece el contrato**.
- **Servir las capturas desde la misma ruta que las maquetas de apps** (`/vitrina/<frente>/…`).
  Colisiona con la ruta de la ficha de una pieza. Las imágenes viven en un espacio propio,
  `/piezas/<frente>/…`.
- **Convertir las capturas a WebP al integrarlas.** Habría obligado a editar el campo `archivo`
  de fichas ajenas. Se guardan tal como llegaron y el optimizador de imágenes hace el resto en
  servicio.

## Consecuencias

- **Los cuatro frentes están abiertos** (apps 6 · agentes 13 · investigaciones 7 · tableros 6) y
  el sitio pasó de 62 a **108 páginas estáticas**. Publicar una pieza nueva es un PR de contenido
  sin sprint: un JSON, sus capturas si las tiene, y la CI valida.
- **Ningún frente está «en preparación» hoy.** La página existe y espera al próximo frente; las
  tres pruebas e2e que la vigilaban **se saltan declarando la razón** en vez de reventar o de
  fingir que verifican algo. El día que nazca un quinto frente, vuelven solas.
- El gate de contenido (`tests/unit/content-fichas.test.ts`) hace de aduana: contrato, nombre de
  archivo = slug, carpeta = frente, slugs únicos **globales**, cero enlaces ni DOI, y cada archivo
  de galería existe en disco.
- Los iconos de bloque de las piezas nuevas usan el genérico (rombo). Iconos propios: sprint
  siguiente.
- El contrato publicado en `docs/contrato-ficha-tecnica/` es **v1.3.1**: es la versión que debe
  leer cualquier casa que produzca una ficha desde hoy.
