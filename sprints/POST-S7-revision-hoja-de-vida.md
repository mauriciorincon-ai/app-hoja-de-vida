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

---

## Revisión 2 — 2026-09-10 (rama `ajustes/hv-revision-2`, un PR)

Pedida por el dueño tras mergear #21 y #22, con su PDF «Hoja de vida 2024-I» adjunto como fuente
provisional hasta la revisión fina del contenido (S8). Antes de tocar nada: `homepage` del repo
limpio tras el deploy de #22 (Vercel lo había reescrito), y el install del PR de dependencias #20
leído línea a línea — seis subidas más `@types/react-dom`, ninguna degradación.

### Lo pedido → lo hecho

| # | Observación del dueño | Qué se hizo |
| - | --------------------- | ----------- |
| 1 | «En el menú superior de Hoja de vida debería estar la vitrina, que al final se llama Lo que construyo» | Entra al desplegable **con el nombre de la sección** («Lo que construyo» → `#vitrina`), en el orden de la página: Trayectoria · Logros · Lo que construyo · Estudios · Certificaciones · Skills. «Vitrina» sigue en el primer nivel como ruta del portal. El header rotula con el MISMO string que la sección (`vitrinaHome.titulo`), así que ese namespace viaja ahora al cliente |
| 2 | «Toma los datos de estudios del PDF» | Tres entradas con años: Ingeniería Industrial, énfasis en Inteligencia Analítica de Datos (2009 — 2016); estudios de pregrado en Diseño Industrial (2011 — 2016 — el PDF no dice título, y así se deja); curso intensivo de inglés + IELTS en Melbourne (2013 — 2014, antes una frase suelta en la nota). `periodo` deja de estar vacío y **un estudio sin año pone rojo el test** |
| 3 | «Omite la certificación AI-102, la descontinuaron» | Sale de `certificaciones`. Y de los **diez sitios** donde seguía viva como credencial: titular y perfil (ES/EN), el logro «6 certificaciones» (ahora **5**), el resumen y el impacto del case study de Vesting, la historia del chat y dos textos de `apps.yaml`. Nace el gate: **una credencial nombrada por código tiene que estar en la lista** |

### Regla 14 — el rojo, en el mismo commit

| Demo | Mutación | Rojo |
| ---- | -------- | ---- |
| **N** | Test nuevo corrido contra los datos de ese momento (`periodo: ""`) | `content.test.ts`: *«es: Ingeniería Industrial: expected '' to match /\d{4}/»* |
| **O** | AI-102 fuera de `certificaciones`, aún nombrada en el resto del contenido | `content.test.ts`: *«AI-102 en cv.es.identidad.resumen · cv.es.identidad.perfil · cv.es.logros[5].descripcion · cv.es.proyectos[0].resumen · cv.es.proyectos[0].casestudy.impacto[3] · historia.es · apps.apps[1].descripcion.es/en · apps.apps[1].brochure.funcionalidades[1].descripcion.es/en»* — diez rutas, cada una con su camino |
| — | El gate del PDF (`cv-pdf.test.ts`) se puso rojo solo: exigía la cadena «AI-102» | Expectativa vieja reemplazada: DP-600 + Formación con años (`2009 — 2016`) en ES y EN |

### Lo que cazó la verificación

- **La clave cruda en el menú.** El primer build pintó `vitrinaHome.titulo` en el desplegable: el
  header es componente cliente y el layout solo le pasa algunos namespaces. Un namespace que falta
  no rompe el build, pinta la clave. Lo vio la captura antes que el e2e — y el e2e, que ya corría
  contra ese build, lo paró también: **4 fallos**, todos en `nav-header.spec.ts` (`toHaveText` con
  los seis rótulos exactos, escritorio y móvil). Corregido en el layout, con el porqué escrito al
  lado de la lista.

### Lo que cazó la CI — y no la máquina local

El job e2e falló dos veces en CI con un `footer … is not attached to the DOM` en `axe.spec.ts`,
siempre en la HOME, nunca reproducible en local (cinco cosas probadas: repetición ×6, dos
workers, CPU 8× más lenta, arranque en frío, consola limpia). Mirando atrás: los runs del S7
pasaban limpios; el flaky nació con la revisión 1 de la HOME y aquí se volvió rojo firme.

1. **Primero, ojos en la CI.** El job no subía nada al fallar. Se agregó `upload-artifact` de
   `test-results/` solo en fallo (Playwright ya grababa trace en el primer reintento).
2. **La traza lo dijo:** `pageerror: Minified React error #418` — **fallo de hidratación**. React
   regenera el árbol en el cliente, el footer viejo se desconecta y el locator queda huérfano. El
   snapshot del DOM en la traza, comparado con el de después del `goto`, mostró la diferencia
   exacta: en el servidor existe `[data-timeline-relleno]`; en el cliente, no.
3. **La causa:** `TimelineTrack` pintaba el relleno con `{!reduced && <m.div/>}`.
   `useReducedMotion()` vale `null` en el servidor y `true` en un navegador con «reducir
   movimiento» — y `axe.spec.ts` corre con esa preferencia en todas las rutas. Estructura distinta
   ⇒ #418 en cada carga; el «not attached» era solo la parte visible, según la hidratación
   terminara antes o después del `load`. En local termina antes; en CI, después.
4. **A quién le pasaba de verdad:** a toda persona con reducción de movimiento que abriera la
   HOME — justo a quienes el cinturón de reduced-motion quiere cuidar.
5. **La corrección (la regla, no el síntoma):** el relleno existe siempre; con reducción lo deja
   completo y quieto el cinturón CSS (`[data-motion]` → `transform: none`). **La forma del árbol
   nunca depende de `useReducedMotion()`**: el hook solo toca props.

| Demo | Mutación / estado | Rojo |
| ---- | ----------------- | ---- |
| **P** | `motion-estructura-reducida.test.tsx` nuevo, contra el `TimelineTrack` de ese momento | *«TimelineTrack con reducción: expected '<div data-timeline…' to be …»* (el `m.div` del relleno falta con `reduced = true`); Reveal, Stagger e IconoSkill en verde |
| **Q** | `axe.spec.ts` exige cero `pageerror` (hidratación incluida), contra el build sin corregir | *«errores de página (hidratación incluida): + "Minified React error #418…"»* en `/es` |

El gate **Q** habría puesto rojo firme la CI del PR #22 en vez de un flaky con reintento verde.
`reduced-motion.spec.ts` exige además que `[data-timeline-relleno]` quede sin transform bajo
reducción.

### Desviaciones y deuda

- Retirar AI-102 tocó **más que la lista**: titular, perfil, logro, case study, historia del chat y
  `apps.yaml`. No era el pedido literal, pero dejar «(DP-600 · AI-102)» en el hero con una lista
  sin AI-102 era una contradicción pública. Queda en el ⭐ n11 para que el dueño lo confirme.
- El logro «certificaciones profesionales» baja de 6 a 5. El IELTS no cuenta como profesional (el
  PDF lo lista aparte, como certificado de idioma) y por eso vive en Estudios, no en Certificaciones.
- La revisión fina del contenido sigue siendo del S8; el PDF 2024-I es fuente provisional.

### Verificación

typecheck · lint · **388 unitarias + integración** (el gate del PDF y el de estructura reducida
entre ellas) · e2e **321 pasadas, 11 saltadas, cero fallos** sobre el build corregido, dos veces
(antes y después del arreglo de hidratación) · `/es` con «reducir movimiento»: **cero errores de
página** (antes: React #418 en cada carga) · build **108 páginas HTML** · barrido cero enlaces
vacío · capturas del menú (escritorio y móvil), Estudios y Certificaciones enviadas al dueño. El espejo `design-sync/…/menu-desplegable.html` se puso al día en este mismo PR (regla 15):
seguía con «Roadmap» en el primer nivel y «Proyectos» en el panel desde la revisión anterior.
