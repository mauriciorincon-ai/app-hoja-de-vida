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

| # | Documento | Estado | Cita hacia |
| - | --------- | ------ | ---------- |
| 1 | `apps-pipeline` | borrador | `#vitrina` |
| 2 | `banco-pichincha` | borrador | `/proyectos/banco-pichincha` |
| 3 | `cafam` | borrador | `/proyectos/cafam` |
| 4 | `ceinfes` | borrador | `#trayectoria` |
| 5 | `certificaciones` | borrador | `#certificaciones` |
| 6 | `cm-operaciones` | borrador | `#trayectoria` |
| 7 | `como-trabajo` | borrador | `#perfil` |
| 8 | `fundacion-ctic` | borrador | `/proyectos/fundacion-ctic` |
| 9 | `inglopres` | borrador | `#trayectoria` |
| 10 | `origenes` | borrador | `#trayectoria` |
| 11 | `transmilenio-cm` | borrador | `/proyectos/transmilenio-cm` |
| 12 | `vesting` | borrador | `/proyectos/vesting` |

**12 documentos** · 0 aprobados.
