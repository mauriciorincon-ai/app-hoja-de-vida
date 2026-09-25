# `data/a-fondo/` — el corpus profundo del chat

Un documento por tema. **No se publican**: no hay página, ni índice, ni enlace. Son el
combustible que hace concretas las respuestas del chat, y la cita `[n]` navega al `ancla` del
documento — que es siempre algo **visible** del sitio.

Cómo se escribe, campo por campo: `docs/MANUAL-DE-USO.md` → «Cómo alimentar el a fondo».

**El `codigo` (`AF-NN`) es lo que el chip de la cita enseña** junto al destino: `[1] AF-09 ·
Vesting`. Es para el dueño —dice qué archivo corregir cuando una respuesta suena rara— y es fijo:
un documento nuevo toma el siguiente número libre; un código retirado no se reutiliza.

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

| #  | Código | Documento | Estado | Subsec. | `[CONFIRMAR]` | Cita hacia |
| -- | ------ | --------- | ------ | ------: | ------------: | ---------- |
| 1 | AF-15 | `agentes-en-produccion` | aprobado | 23 | 0 | `/vitrina/agentes` |
| 2 | AF-21 | `analitica-predictiva` | aprobado | 18 | 0 | `#skills` |
| 3 | AF-12 | `apps-pipeline` | aprobado | 28 | 0 | `#vitrina` |
| 4 | AF-08 | `banco-pichincha` | aprobado | 25 | 0 | `/proyectos/banco-pichincha` |
| 5 | AF-20 | `bi-que-se-adopta` | aprobado | 23 | 0 | `#skills` |
| 6 | AF-06 | `cafam` | aprobado | 15 | 0 | `/proyectos/cafam` |
| 7 | AF-04 | `ceinfes` | aprobado | 12 | 0 | `/proyectos/ceinfes` |
| 8 | AF-11 | `certificaciones` | aprobado | 15 | 0 | `#certificaciones` |
| 9 | AF-05 | `cm-operaciones` | aprobado | 13 | 0 | `/proyectos/cm-operaciones` |
| 10 | AF-19 | `como-aprendo` | aprobado | 18 | 0 | `#certificaciones` |
| 11 | AF-01 | `como-trabajo` | aprobado | 29 | 0 | `#perfil` |
| 12 | AF-14 | `fabric-en-la-practica` | aprobado | 22 | 0 | `#skills` |
| 13 | AF-10 | `fundacion-ctic` | aprobado | 25 | 0 | `/proyectos/fundacion-ctic` |
| 14 | AF-17 | `gobierno-de-datos-y-de-ia` | aprobado | 27 | 0 | `#skills` |
| 15 | AF-03 | `inglopres` | aprobado | 9 | 0 | `/proyectos/inglopres` |
| 16 | AF-24 | `las-investigaciones` | aprobado | 32 | 0 | `/vitrina/investigaciones` |
| 17 | AF-13 | `lo-que-busco` | aprobado | 19 | 0 | `#contacto` |
| 18 | AF-25 | `los-agentes-de-la-vitrina` | aprobado | 12 | 0 | `/vitrina/agentes` |
| 19 | AF-23 | `los-tableros` | aprobado | 28 | 0 | `/vitrina/tableros` |
| 20 | AF-02 | `origenes` | aprobado | 35 | 0 | `#trayectoria` |
| 21 | AF-18 | `plataforma-y-despliegue` | aprobado | 18 | 0 | `#skills` |
| 22 | AF-22 | `procesos-y-simulacion` | aprobado | 25 | 0 | `#skills` |
| 23 | AF-16 | `rag-y-el-chat` | aprobado | 28 | 0 | `#vitrina` |
| 24 | AF-07 | `transmilenio-cm` | aprobado | 18 | 0 | `/proyectos/transmilenio-cm` |
| 25 | AF-09 | `vesting` | aprobado | 24 | 0 | `/proyectos/vesting` |

**25 documentos · 541 subsecciones · 148.112 palabras · 0 `[CONFIRMAR]` por resolver · 25 aprobados.**

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
