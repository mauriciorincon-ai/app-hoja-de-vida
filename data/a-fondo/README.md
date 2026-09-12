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

> Se actualiza al aprobar cada documento. La cuenta de verdad la imprime `pnpm build`.

| #  | Documento | Estado | Subsec. | `[CONFIRMAR]` | Cita hacia |
| -- | --------- | ------ | ------: | ------------: | ---------- |
| 1 | `como-trabajo` | borrador | 5 | 1 | `#perfil` |
| 2 | `origenes` | borrador | 5 | 2 | `#trayectoria` |
| 3 | `inglopres` | borrador | 5 | 4 | `#trayectoria` |
| 4 | `ceinfes` | borrador | 5 | 3 | `#trayectoria` |
| 5 | `cm-operaciones` | borrador | 5 | 2 | `#trayectoria` |
| 6 | `cafam` | borrador | 5 | 2 | `/proyectos/cafam` |
| 7 | `transmilenio-cm` | borrador | 6 | 3 | `/proyectos/transmilenio-cm` |
| 8 | `banco-pichincha` | borrador | 6 | 4 | `/proyectos/banco-pichincha` |
| 9 | `vesting` | borrador | 6 | 4 | `/proyectos/vesting` |
| 10 | `fundacion-ctic` | borrador | 5 | 2 | `/proyectos/fundacion-ctic` |
| 11 | `certificaciones` | borrador | 5 | 2 | `#certificaciones` |
| 12 | `apps-pipeline` | borrador | 6 | 1 | `#vitrina` |
| 13 | `lo-que-busco` | borrador | 5 | 2 | `#contacto` |
| 14 | `fabric-en-la-practica` | borrador | 6 | 2 | `#skills` |
| 15 | `agentes-en-produccion` | borrador | 6 | 3 | `/vitrina/agentes` |
| 16 | `rag-y-el-chat` | borrador | 6 | 1 | `/vitrina/apps` |
| 17 | `gobierno-de-datos-y-de-ia` | borrador | 6 | 2 | `#skills` |
| 18 | `plataforma-y-despliegue` | borrador | 6 | 2 | `#skills` |
| 19 | `como-aprendo` | borrador | 6 | 1 | `#certificaciones` |
| 20 | `bi-que-se-adopta` | borrador | 5 | 1 | `#skills` |
| 21 | `analitica-predictiva` | borrador | 5 | 3 | `#skills` |
| 22 | `procesos-y-simulacion` | borrador | 6 | 2 | `#skills` |
| 23 | `los-tableros` | borrador | 5 | 2 | `/vitrina/tableros` |
| 24 | `las-investigaciones` | borrador | 6 | 1 | `/vitrina/investigaciones` |

**24 documentos · 132 subsecciones · 52 `[CONFIRMAR]` · 0 aprobados.**

## Cómo corregirlos

Uno por uno, en el orden de la tabla: es el orden en que se pensaron, de la trayectoria a las
capacidades. Por cada documento:

1. **Resuelve sus `[CONFIRMAR]`**: cada uno dice exactamente qué falta y por qué importa. Si la
   respuesta es «no aplica» o «no quiero decirlo», se borra la marca y listo — un hueco cerrado
   por decisión también es un hueco cerrado.
2. **Corrige la prosa.** Está escrita en tu voz pero no es tuya. Cámbiala sin miramientos.
3. Cuando quede bien, `estado: aprobado`. Yo traduzco el gemelo `.en.md` y el chat empieza a
   citarlo en el siguiente despliegue.

Las respuestas de los `[CONFIRMAR]` de `fundacion-ctic`, `banco-pichincha`, `vesting` y
`certificaciones` son las que más cambian el resultado: son cifras y afirmaciones, no redacción.
El informe `sprints/SPRINT_008-informe-discrepancias.md` las recoge todas con su contexto.
