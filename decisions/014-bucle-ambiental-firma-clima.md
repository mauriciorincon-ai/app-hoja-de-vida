# ADR-014 — El bucle ambiental de la firma clímax

- **Status:** accepted (2026-08-23)
- **Context:** Sprint 005 (branch `sprint-005/la-vitrina-de-los-seis`), gate de mirada M1 → M2.

## Context

`design-system.md` § Motion cierra con una regla dura: **«vetado: animaciones infinitas
(sweep/glitch/marquee)»**. Nació en el Sprint 001 contra un anti-patrón muy concreto — el adorno
que se mueve para siempre sin decir nada, roba atención, castiga la batería y envejece la página
en un mes.

En la vitrina cada ficha lleva una **firma**: la escena clímax del brochure de esa app,
re-dibujada con los tokens de CV Viva (decisión del usuario en el gate M1 — ni fotografiar los
brochures ni recolorearlos). Cinco de las seis firmas son estáticas. La de **Hablemos San** no
puede serlo sin dejar de decir lo que dice: su clímax es _la voz del niño moviendo algo_, y una
barra de voz quieta es exactamente la ausencia de la idea. El banco de técnicas §2 ya tiene
nombre para esto — **el bucle ambiental es privilegio del clímax**, «toda escena clímax = ninguna
lo es».

Hay entonces una contradicción real con el design system, y la regla del propio documento es
clara: _se extiende por ADR, nunca se contradice en silencio._

## Decision

**Se admite UN bucle ambiental por página, y solo en la firma del clímax.** Condiciones, todas
obligatorias:

1. **Una sola por ficha.** Cada app tiene como máximo una firma animada; hoy solo la de
   Hablemos San lo está. Si mañana dos apps la piden, se elige una — el privilegio deja de serlo
   en cuanto se reparte.
2. **Solo con la tarjeta abierta.** La animación cuelga de
   `.tarjeta-vitrina[data-abierta] .firma-clima`: una tarjeta cerrada no anima nada, así que la
   página en reposo no tiene ni un pixel en movimiento.
3. **Solo `transform`/`opacity`**, como toda animación de scroll de esta app.
4. **Se apaga entera con `prefers-reduced-motion`**, sin excepción y sin sustituto parpadeante:
   queda el dibujo quieto, que sigue siendo legible por sí solo.
5. **Ritmo ambiental, no llamada de atención:** ciclo largo (4,6 s), `--ease-in-out-cubic`, sin
   destellos ni cambios de color. Si compite con el texto que tiene al lado, sobra.

Lo que **sigue vetado** no se toca: sweep, glitch, marquee, y cualquier bucle fuera de una firma
de clímax.

## Consequences

- `design-system.md` § Motion apunta a este ADR desde su regla dura: quien lea el veto encuentra
  la excepción y sus condiciones, en vez de encontrar código que lo desmiente.
- El gate de revisión de diseño gana un punto verificable: _contar_ los bucles de la página. Más
  de uno, o uno fuera de una firma, es un hallazgo.
- Coste asumido: un elemento animado indefinidamente mientras una tarjeta esté abierta. Es
  `transform` sobre cuatro barras, compuesto por el compositor; los presupuestos de Lighthouse de
  las rutas de la vitrina se miden con las tarjetas cerradas, que es como carga la página.
- Si el banco de técnicas §2 cambia de criterio, este ADR se revisa con él: aquí la fuente es el
  patrón del pipeline, no una preferencia local.
