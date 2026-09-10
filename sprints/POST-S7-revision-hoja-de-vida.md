# Bitácora — revisión de la hoja de vida tras el S7 (fuera de sprint)

> Pedida por el dueño el 2026-09-09 con cinco observaciones sobre la HOME. Rama
> `ajustes/hv-revision-1`, un PR. Decisiones en `decisions/018-…`. Esta bitácora existe para que
> la planeadora vea el trabajo, como en las reorganizaciones «post-S5».

## Lo pedido → lo hecho

| # | Observación del dueño | Qué se hizo |
| - | --------------------- | ----------- |
| 1 | Barra y círculo «sin orden» en cada experiencia; quiere una línea que mida todas, un círculo que baje con el scroll y el año grande como índice | `TimelineTrack` reescrito: línea continua, relleno que crece con el scroll, círculo `sticky` a media pantalla, año grande al lado, marcas por hito. Reduced motion: quieto |
| 2 | «Proyectos ya no es proyectos, ahí debe ir la vitrina» | `VitrinaHome` con las cuatro cajas del portal en ese sitio; los case studies se abren desde su hito (`proyecto:` validado en build) |
| 3 | Skills «más atractivo, elegante, iconos, animación» | Tarjeta por grupo, icono dibujado en casa con trazo animado, chips escalonados, sin porcentajes |
| 4 | Certificaciones debajo de Estudios y encima de Skills; no hay sección de estudios | `cv.estudios` nace como dato; sección propia en HOME, `/cv`, PDF y chat. Orden: Estudios → Certificaciones → Skills |
| 5 | «Qué viene» no va en la hoja de vida; va con las apps | `Roadmap` embebido al pie de `/vitrina/apps`; fuera de la HOME y del menú (primer nivel: 3 destinos) |

## Regla 14 — el rojo, en el mismo commit

| Demo | Mutación | Rojo |
| ---- | -------- | ---- |
| **M** | `proyecto: "cafam"` → `"no-existe"` en un hito | `pnpm build`: *«Contenido inválido en data/cv.es.yaml: cada «proyecto:» de la trayectoria debe ser el slug de un proyecto CON casestudy. Rotos: Cafam → proyecto «no-existe»»* |

Unitarias del mismo gate en `schemas.test.ts` (rompe nombrando el hito; con casestudy pasa), y
la paridad ES/EN de `estudios` y de los vínculos en `content.test.ts`.

## Lo que cazó la CI local antes del PR

- **axe, contraste 2.7:1** en «Sin fecha declarada» (`ink-3` sobre `paper-0`, 11 px). Es la regla
  que el S6 dejó escrita en el design system: `ink-3` NUNCA es color de texto. Corregido a
  `ink-2` en cursiva. *Se cayó en la misma trampa por segunda vez: la regla existe, pero nada la
  hace cumplir antes de axe.* → sugerencia al método, abajo.
- `#vitrina h2` resolvía a 5 elementos (el título + 4 cajas): selector por id del título.
- `detalle.spec` asumía que el primer «Ver case study» era Vesting: ahora entra por el enlace del
  proyecto esperado.

## Desviaciones y deuda

- **Los años de los estudios** no existían en ningún dato: `periodo` va vacío y la tarjeta lo
  dice. Los pone el dueño en `data/cv.es.yaml` y `cv.en.yaml`.
- Los hitos sin case study (C&M Consorcio, Ceinfes, Inglopres) no enseñan enlace: correcto, no
  tienen historia larga todavía.
- El kit de prueba de la votación y el comentario del job de Lighthouse apuntan ya a
  `/es/vitrina/apps`.

## Sugerencia al método

**`ink-3` como color de texto debería fallar en lint, no en axe.** Dos veces (S6 y hoy) la regla
escrita en `design-system.md` se rompió y la cazó el scan de accesibilidad al final. Una regla de
ESLint sobre `text-ink-3` en `className` la pararía al escribir.

## Verificación

typecheck · lint · **382 unitarias** · e2e **321 pasadas, 11 saltadas, cero flaky** · build
**108 páginas** · barrido cero enlaces vacío · capturas en escritorio y móvil revisadas por el
constructor antes de pedir la mirada del dueño.
