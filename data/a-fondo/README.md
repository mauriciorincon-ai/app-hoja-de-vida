# `data/a-fondo/` — el corpus profundo del chat

Un documento por tema. **No se publican**: no hay página, ni índice, ni enlace. Son el
combustible que hace concretas las respuestas del chat, y la cita `[n]` navega al `ancla` del
documento — que es siempre algo **visible** del sitio.

Cómo se escribe, campo por campo: `docs/MANUAL-DE-USO.md` → «Cómo alimentar el a fondo».

## Lo único que hay que recordar

| `estado`   | Qué pasa                                                                                  |
| ---------- | ------------------------------------------------------------------------------------------- |
| `borrador` | El chat **no lo indexa** y **no se exige** el gemelo en inglés. Para escribir con calma.  |
| `aprobado` | El chat **lo indexa y lo cita**; el build **exige** el gemelo `.en.md`, subsección a subsección. |

## Estado de los documentos

> **Esta tabla se genera con `pnpm corpus:informe`** — no se edita a mano. La escribía yo y
> mentía: contaba como pregunta abierta la línea de la plantilla que llevan los 24 archivos, así
> que declaraba 53 donde hay 30, y le ponía una a seis documentos que no tienen ninguna.

<!-- tabla-de-documentos:inicio -->

| #  | Documento | Estado | Subsec. | `[CONFIRMAR]` | Cita hacia |
| -- | --------- | ------ | ------: | ------------: | ---------- |
| 1 | `como-trabajo` | borrador | 5 | 0 | `#perfil` |
| 2 | `origenes` | borrador | 5 | 2 | `#trayectoria` |
| 3 | `inglopres` | borrador | 5 | 3 | `#trayectoria` |
| 4 | `ceinfes` | borrador | 5 | 3 | `#trayectoria` |
| 5 | `cm-operaciones` | borrador | 5 | 1 | `#trayectoria` |
| 6 | `cafam` | borrador | 5 | 1 | `/proyectos/cafam` |
| 7 | `transmilenio-cm` | borrador | 6 | 2 | `/proyectos/transmilenio-cm` |
| 8 | `banco-pichincha` | borrador | 6 | 3 | `/proyectos/banco-pichincha` |
| 9 | `vesting` | borrador | 6 | 3 | `/proyectos/vesting` |
| 10 | `fundacion-ctic` | borrador | 5 | 1 | `/proyectos/fundacion-ctic` |
| 11 | `certificaciones` | borrador | 5 | 1 | `#certificaciones` |
| 12 | `apps-pipeline` | borrador | 6 | 0 | `#vitrina` |
| 13 | `lo-que-busco` | borrador | 5 | 1 | `#contacto` |
| 14 | `fabric-en-la-practica` | borrador | 6 | 1 | `#skills` |
| 15 | `agentes-en-produccion` | borrador | 6 | 2 | `/vitrina/agentes` |
| 16 | `rag-y-el-chat` | borrador | 6 | 0 | `/vitrina/apps` |
| 17 | `gobierno-de-datos-y-de-ia` | borrador | 6 | 1 | `#skills` |
| 18 | `plataforma-y-despliegue` | borrador | 6 | 1 | `#skills` |
| 19 | `como-aprendo` | borrador | 6 | 0 | `#certificaciones` |
| 20 | `bi-que-se-adopta` | borrador | 5 | 0 | `#skills` |
| 21 | `analitica-predictiva` | borrador | 5 | 2 | `#skills` |
| 22 | `procesos-y-simulacion` | borrador | 6 | 1 | `#skills` |
| 23 | `los-tableros` | borrador | 5 | 1 | `/vitrina/tableros` |
| 24 | `las-investigaciones` | borrador | 6 | 0 | `/vitrina/investigaciones` |

**24 documentos · 132 subsecciones · 14.268 palabras · 30 `[CONFIRMAR]` por resolver · 0 aprobados.**

**Sin ninguna pregunta abierta, listos para que los leas y decidas:** `como-trabajo` · `apps-pipeline` · `rag-y-el-chat` · `como-aprendo` · `bi-que-se-adopta` · `las-investigaciones`.

<!-- tabla-de-documentos:fin -->

## Cómo corregirlos

Uno por uno, en el orden de la tabla: es el orden en que se pensaron, de la trayectoria a las
capacidades. Por cada documento:

1. **Resuelve sus `[CONFIRMAR]`**: cada uno dice exactamente qué falta y por qué importa. Si la
   respuesta es «no aplica» o «no quiero decirlo», se borra la marca y listo — un hueco cerrado
   por decisión también es un hueco cerrado. **Un documento `aprobado` no puede llevar ninguna**:
   el build lo para, porque si quedara, el chat te citaría esa pregunta tal cual a un visitante.
2. **Corrige la prosa.** Está escrita en tu voz pero no es tuya. Cámbiala sin miramientos.
3. Cuando quede bien, `estado: aprobado`. Yo traduzco el gemelo `.en.md` y el chat empieza a
   citarlo en el siguiente despliegue.

**Comprueba lo que vas escribiendo** con `pnpm test`. Tres cosas te vigilan, y cada una mira algo
distinto:

- **La aduana** te dice si algo no cumple el formato, la privacidad o el destino de la cita.
- **El golden set** (`tests/unit/a-fondo-golden.test.ts`) te dice si las `preguntas_de_prueba` de
  un documento traen ese documento y no otro. Si una pregunta trae un documento distinto pero
  correcto, la mal escrita suele ser la pregunta.
- **El banco de preguntas** (`tests/fixtures/banco-de-preguntas.es.yaml`) te dice si el corpus
  contesta las **131 preguntas que hace alguien de afuera**. Es el que encuentra lo que los otros
  dos no pueden: como la búsqueda del chat es léxica, una palabra que tú no escribes no existe
  para quien pregunta. Así se descubrió que el corpus decía «extracción, transformación y carga»
  y nunca «ETL», «el lago y el almacén» y nunca «lakehouse», y que no decía «MLOps» ni
  «actualmente» en ninguna parte.

## Por dónde empezar

Dos informes dicen dónde rinde más el esfuerzo:

- `sprints/SPRINT_008-informe-discrepancias.md` — las 12 diferencias entre el sitio y tu hoja de
  vida. Las de peso: el AI-103 ausente, las cifras de Fundación CTIC, el −35% de Pichincha y los
  «modelos semánticos».
- `sprints/SPRINT_008-simulacion-m2.md` — qué preguntas de una entrevista contesta bien este corpus
  y cuáles no. Trae los cinco huecos que más rinde cerrar, en orden.
- `sprints/SPRINT_008-banco-de-preguntas.md` — las **131 preguntas** medidas una por una: qué trae
  el chat hoy y qué traería con la base aprobada. Se regenera con `pnpm corpus:informe`.
