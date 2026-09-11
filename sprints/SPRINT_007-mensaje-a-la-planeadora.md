# Mensaje a la planeadora — cierre del Sprint 007 y qué viene

> Redactado el 2026-09-09 desde el repo de la app (`app-hoja-de-vida`). Para pegar en la sesión
> de la planeadora (`hr01-develop-ai-apps`). La app no escribe allá: este archivo es la copia
> versionada de lo que se le dijo. El summary formal del sprint queda, como siempre, en
> `sprints/SPRINT_007-summary.md` y dentro del PR.

---

Hola. Te informo del Sprint 007 «Las estanterías» de CV Viva, te comunico una decisión mía como
dueño del producto y te pido que planees el siguiente sprint con un alcance distinto al que
tenías previsto para el S8.

## 1. Lo que se hizo en el S7

**Outcome logrado, y más de lo pedido.** La vitrina tiene hoy **los cuatro frentes abiertos** con
piezas reales, todo en la rama `sprint-007/las-estanterias` del repo de la app:

| Frente          | Piezas | Origen de las fichas                                             |
| --------------- | ------ | ---------------------------------------------------------------- |
| apps            | 6      | export de cada app + complemento curado (`data/fichas/`, del S6) |
| agentes         | 13     | `content/agentes/` — llegaron TAL CUAL, sin editar una coma      |
| investigaciones | 7      | `content/investigaciones/` — ídem                                |
| tableros        | 6      | `content/tableros/` — ídem, con 36 capturas                      |

- **Un solo renderizador de piezas por frente**, genérico: loader fail-safe que rompe el build
  nombrando archivo y campo, escaparate `/vitrina/<frente>`, ficha `/vitrina/<frente>/<slug>`
  con el mismo `FichaTecnica` de las apps, frente «abierta» solo si tiene piezas válidas en disco
  (la regla del S6 se levantó por frente, como pedía la orden), cuenta medida desde `content/`.
- **Contrato de la ficha técnica: v1.1.0 → v1.3.0, siempre aditivo.** v1.2.0 agregó la
  procedencia `planeadora` y la plantilla generada del Zod. v1.3.0 agregó dos claves opcionales
  que un tablero necesita y una app no: `conclusiones` (lo que dicen los datos) y `galeria` (las
  páginas del tablero como capturas). Lo obligatorio no cambió; toda ficha anterior sigue válida.
  Ninguna ficha de otra casa se editó para que cupiera: cuando no cabían, cambió el contrato.
  El contrato publicado (`docs/contrato-ficha-tecnica/`) ya está en v1.3.0 — **cualquier casa
  productora debe leer esa versión**.
- **Cada gate nuevo nació en rojo en su mismo commit** (kit v1.25.0): gate de contenido,
  motor, renumeración de secciones, axe sobre las rutas nuevas, galería sin hueco.
- **Verificación al cierre de la construcción:** typecheck y lint limpios · 370 pruebas unitarias
  · e2e completo en chromium y móvil, incluida accesibilidad en todas las rutas nuevas en los
  dos idiomas · build SSG de 108 páginas (el sprint empezó con 62) · barrido cero enlaces vacío
  · cero datos de personas.

**Lo que además pagó el S7 (fase 0):** la auditoría retroactiva de S5+S6 con sus pagos, el
`SPRINT_006-summary.md` que faltaba del lado de la app, y los deltas del kit v1.25.0 al CLAUDE.md.

## 2. Desviaciones respecto de tu orden (todas registradas en la bitácora)

1. **Tableros entró en el S7.** Tu corte lo dejaba para el S8 «porque no había fichas». Las
   fichas aparecieron durante el sprint (las produjo el constructor de tableros) y yo decidí
   integrarlas ya. Es la razón del contrato v1.3.0.
2. **Las miradas M1 y M2 se fundieron en una sola.** Pedí que se publicaran las 20 fichas de una
   vez y revisar todo junto en el servidor local; la revisión pieza por pieza no aportaba.
3. **La revisión ⭐ del ciclo se aplaza por decisión mía** (ver § 3). El S7 deja sus ⭐ nuevas
   declaradas en la guía acumulativa con los contrapesos que exigiste (pasada de capturas del
   builder + e2e de reduced-motion), pero yo no voy a ejecutar el gate todavía.

**Lo que sigue fuera, tal como estaba:** el frente apps consumiendo la ficha completa desde
`content/apps/`, la publicación del `design-sync`, los iconos propios de las piezas nuevas
(usan el genérico) y el cierre formal del ciclo H2 (BLUEPRINT, design system publicado, ⭐
acumulado).

## 3. Mi decisión: la revisión va DESPUÉS del detalle, no ahora

No voy a revisar la hoja de vida por partes. **La revisión de todo — vitrina incluida — se
hace una sola vez, cuando el contenido esté completo.** Y el contenido no está completo: el
chat con la hoja de vida se apoya hoy en un corpus muy delgado.

Hecho medido en el repo: el chat (ADR-010) se indexa desde `data/cv.{es,en}.yaml`,
`data/apps.yaml` y `data/historia/historia.{es,en}.md`. La historia tiene **12 secciones de
unas 40 palabras cada una** (≈ 840 palabras por idioma). Eso no alcanza para que el chat
responda con detalle sobre mi experiencia.

## 4. Lo que te pido: el siguiente sprint es EL DETALLE

Planea el **Sprint 008 como el sprint del detalle de la hoja de vida**: los documentos que
cuentan en profundidad cómo fue mi experiencia — qué hice exactamente en cada etapa, con qué
decisiones, con qué resultados, con los detalles precisos que hoy no aparecen en ninguna parte
de la app. Ese contenido es **el sustento del chat**: lo que el visitante podrá preguntar y
el chat podrá contestar con fuente.

Lo que sé del terreno, para que lo tengas al planear:

- El canal ya existe: la historia por secciones con marcador y ancla (`<!-- seccion: id |
  ancla: ... -->`), paridad ES/EN exigida en build, índice regenerado en cada build. Falta
  decidir si el detalle cabe en ese archivo o si hace falta un canal por documento
  (`data/historia/<etapa>.md` o similar), con su ancla navegable para que la cita del chat
  siga llevando a algo visible.
- El contenido lo produzco yo; el builder pone el canal, la validación, el índice y las
  pruebas del chat contra el corpus nuevo (lo que no se puede probar sin el contenido real se
  declara y se espera).
- Regla que no se negocia: cero datos de terceros identificables en esos documentos. El
  detalle es sobre mi trabajo, no sobre las personas con las que trabajé.

**Después del S8 hago la revisión completa** (la ⭐ acumulada del ciclo más la mirada de
contenido), **y con ese resultado tú recalculas el trabajo que falta**: lo que quedó de H2
(`content/apps/`, design-sync, cierre de ciclo), lo que la revisión saque, y lo que sea
necesario si algo nos falta. Hasta entonces no fijes el cierre del ciclo.

## 5. Estado de este cierre

El S7 cierra con su rutina completa: `/audita-sprint`, `/deploy-check`, ADR-017, guía v6
acumulativa, manual, bundle del design system en el repo, summary dentro del PR con las
desviaciones de arriba, CI verde check por check, y limpieza del campo homepage tras el
deploy. Cuando el PR esté en `main`, el summary queda en `sprints/SPRINT_007-summary.md` para
tu retrospectiva.
