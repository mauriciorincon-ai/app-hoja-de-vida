---
sprint: 031
app: hoja-de-vida
hito: H-2
opened: 2026-11-01
closed: 2026-11-01
branch: sprint-031/brochure-entrada-de-todas
pr: https://github.com/mauriciorincon-ai/app-hoja-de-vida/pull/111
---

# Sprint 031 — Cierre ejecutivo · CV Viva · Sentada 4f: el brochure, la entrada de todas las apps

- **Resultado:** `/portafolio/apps/<app>` abre el brochure de **las diez apps y de la casa**, tengan o no su v2: el interruptor del 030 se fue entero (`scripts/entradas-brochure.mjs`, `CV_ENTRADAS_BROCHURE`, `entradaEsBrochure`, `rutaDelBrochure`) y ninguna app lleva ya `data-ficha-tecnica=`. El `/brochure` y el `/detalle` de cualquier app, y la página vieja de la casa, llegan a la entrada con **un solo 301**; el mapa del sitio ya listaba una URL por app, así que **B4 deja de existir** y B3 (BLUEPRINT) está pagado. La tarjeta dice «Ver brochure» en todas; la simulación de planlang regresa «al brochure». La ficha técnica sigue solo en agentes, investigaciones y tableros. **Estado: construido y verificado; espera la CI.** Verificado: lint · tsc · 3618 unitarias (114 archivos) · build · e2e completo 1257 pasaron, 0 fallaron, 59 omitidas por proyecto (chromium, móvil, @webkit; incluye axe en los dos proyectos) · cero enlaces limpio · homepage intacta (perfil del dueño).
- **Tiempo:** estimado 2,5 h del builder (la planeadora, 2: F1 1,25 · F2 0,75; la media hora de más salió de las e2e que daban por hecha la ficha) · real **1,1 h, piso del script** (abajo): lo hice en pocos commits grandes al final de cada tramo, así que no ve la lectura ni la espera de los e2e; la pared es ≈ 1,5 h (≈ 11:50 → 12:55, a ojo). Ninguna fase pasó el 50 % de su estimado que yo sepa.
- **Entregables:** F1 la entrada sin lista (`redireccion.ts`: `/brochure`, `/detalle` y `/apps/<casa>` directo a la entrada; `[app]/page.tsx` pinta `PaginaBrochure` siempre y con `dynamicParams = false`; fuera `[app]/brochure/page.tsx`), tarjeta, catálogo del chat (`destinos.mjs`), `lighthouse-urls.json` y `perf-budget.json` (el presupuesto del brochure pasa a `/*/portafolio/apps/habla$`), clave nueva `vitrina.volverBrochure` {es, en}, `entrada.spec.ts` reescrita. F2 lo muerto fuera (`roadmap.tsx`, las props de app de `FichaTecnica`, `appInicial`, dos claves sin lector), BLUEPRINT, adenda a la ADR-030, manual, `design-system.md` y guía v31. **Copias: ninguna** (el sprint no toca entregas).
- **No completado:** nada del alcance. Fuera de plan: el v2 de las nueve (por tandas, por copia), «Métodos» (032), las sentadas 6 a 11.
- **Desviaciones y causas:** (1) **antes de arrancar, un ajuste fuera de sprint: el PR #110** (Skills trabado en el celular y la cinta del brochure grande y quieta tras cerrar el Recorrido), mergeado el 2026-11-01 (`e0e5b68`), **0,8 h** de `horas-sprint.mjs` · (2) `getFichaTecnica(s)` y `armar.ts` **se quedan**, no se borran: las pruebas del contrato arman la ficha de cada app con ellas (el plan sí las borraba) · (3) la guía reescribe **17 filas y 2 flujos**, no las 4 previstas: la auditoría encontró seis más que mandaban a una ficha que ya no existe · (4) el describe «ficha técnica (ADR-016)» de `vitrina.spec.ts` se **porta a los agentes** (proceso BPMN, ATS, deslizamiento en móvil, Stack: +9 pruebas) en vez de borrarse · (5) `dynamicParams = false` en la entrada: sin él, un slug inexistente daba 500 (lo cazó la e2e de la app inventada).
- **Decisiones:** las del dueño («reemplazar las fichas por el brochure, punto») no se volvieron a preguntar. El 301 sigue siendo del proxy; sin la lista, el `/brochure` de un slug inexistente da 301 y luego 404 (un salto extra, aceptado).
- **Deuda al lote del H-3:** `rutas-retiradas.test.ts` no caza una ruta armada por concatenación (limitación del barrido) · el cuerpo de la ADR-030 conserva `/brochure` y `/*/brochure$` (convención de ADR; la adenda lo corrige, sin anotar el presupuesto de `habla`) · q22 de la guía dice «a la ficha del portafolio» (no la reescribí para no reabrir una fila larga) · Lighthouse solo mide 3 de las 12 entradas · **para la planeadora:** los campos `cifras_destacadas`, `proceso` y `procedencia` del complemento ya no los pinta ninguna app (los leen `armar.ts` y sus pruebas; `titular`, `limites` y `nunca` siguen en el chat): ¿se simplifica el contrato? · `skills.spec.ts:227` arrastre intermitente (del 029, no lo toqué) · `pnpm audit`: 2 moderados transitivos de `@sentry/nextjs`.
- **Aprendizajes:** quitar un interruptor deja caer los gates de «rutas retiradas» sobre sus 10 sitios (rojo visto, pagado) · el grep de `ENTRADAS` no encontró las e2e que daban por hecha la ficha sin importarla (`form`, `home`, `votacion`): buscar por la URL `/portafolio/apps/` · una página dinámica sin `dynamicParams = false` responde 500 si el loader lanza · las pruebas de la guía fijan el estado de cada sprint: las filas reescritas salen de las listas anteriores. **Recomendación:** el 032, «Métodos». **Esfuerzo-beneficio:** alto, es la puerta de cada app y quitó más código del que puso (870 + / 1425 −).
- **Auditoría (4 casillas):** independiente (Sonnet 5.5 · alto, solo lectura, con el diff): **C 0 · A 1 · M 5 · B 6** (alcance completo salvo la guía; calidad M1 M2 M3 M5, B1–B6; seguridad sin hallazgos; frases caducadas A1 M4). Pagados: A1 (6 filas y 2 flujos de la guía) `3875690` · M1 (e2e del proceso y el Stack, ahora sobre los agentes) `a88b86b` · M2 M3 (comentarios) `1a28d90` · M4 y las notas de la guía `3875690` · M5 B1 B2 `a88b86b` · B6 `1a28d90`. Al lote: arriba (B3 es ruido de prettier).
- **Modelo por fase · relevos · Para mergear:** plan Opus 5.5; F1 y F2 Sonnet 5.5 tras el gate de modelo (el dueño cambió con `/model sonnet`); auditor Sonnet 5.5 (alto): sin desvío, Haiku no se usó · **relevos: ninguno** · con la CI verde: squash y borrar la rama; después `/cierre-sprint hoja-de-vida`.

## Para la revisión (lo que hace el dueño)

- **Ninguna mirada** (sin FIDELIDAD: el brochure es el que ya está en producción; sin DECISIÓN). Si quiere ver el cambio con sus ojos, dos minutos: `/es/portafolio/apps/ds` (y cualquier app) abre su brochure, y `…/ds/brochure` llega a él de un salto. La guía v31 trae 17 filas y 2 flujos reescritos que vuelven a pendiente mostrando lo que había respondido. **Del dueño:** nada pendiente; su `/cierre-sprint` del 031.

### Horas del sprint (`scripts/horas-sprint.mjs`, rango `origin/main..HEAD`, sin el commit del cierre)

| Commits | Sesiones | Horas activas | Span (primer → último commit)               |
| ------: | -------: | ------------: | ------------------------------------------- |
|      10 |        1 |         1,1 h | 2026-11-01 12:17 → 2026-11-01 12:52 (0,6 h) |

| Fase | Commits | Horas activas |
| ---- | ------: | ------------: |
| F1   |       5 |         0,6 h |
| F2   |       5 |         0,4 h |
