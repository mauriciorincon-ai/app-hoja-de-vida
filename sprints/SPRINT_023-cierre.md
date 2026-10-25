---
sprint: 023
app: hoja-de-vida
hito: H-2
opened: 2026-10-25
closed: 2026-10-25
branch: sprint-023/portafolio
pr: https://github.com/mauriciorincon-ai/app-hoja-de-vida/pull/101
---

# Sprint 023 — Cierre ejecutivo · CV Viva · Sentada 1 de la revisión: «Portafolio», la casa y el inglés

- **Resultado:** OM-01, 04, 05, 06, 33, 34 y 35 y la orden de ds, enteros; **OM-07 espera la elección del dueño** (dos capturas; sin respuesta se queda Fraunces). **Logrado, listo para merge.** 2025 unit (84 archivos, líneas 90,96 %) · typecheck, lint, build (con el índice del chat), `pnpm audit`, dependencias (838) y cero enlaces limpios · e2e completo (chromium, móvil y @webkit): 969 pasan, 34 omitidas de siempre, 0 fallan · Lighthouse local no corrido: lo mide la CI.
- **Tiempo:** estimado 3 h (F1 1,5 · F2 0,75 · F3 0,75) · real **1,7 h, piso del script** (abajo; no cuenta lectura ni planeación) · fases: F1 «Portafolio» + ds · F2 la casa (orden, idioma, 404, Tab) · F3 guía, manual, auditoría y cierre.
- **Entregables:** «vitrina» → «Portafolio» en texto, menú (cinco secciones), botones y rutas, con 301 en los dos idiomas y sin idioma (`src/lib/redireccion.ts`) · alias al leer los exports de otras casas, con concordancia, que **lanza** si queda una frase rota (`scripts/sin-vitrina.mjs`) · corpus con la palabra y su artículo · «Métodos» tras Skills · el cambio de idioma no deriva en Safari · el 404 con ES/EN · gate del orden de foco · export y roadmap de ds · guía v23 (avisa si no guarda, «Restaurar desde texto», `SÍ SIN NOTA`, filas reescritas con «Antes del S23») · manual.
- **Demos en rojo (gate · mutación · a quién nombró):** `sin-vitrina` · ruta vieja y «de la portafolio» plantadas, lector sin alias, fila del 301 quitada · el archivo y la línea · orden de secciones · dos secciones cambiadas · la sección · 404 sin Header · el conmutador ausente · OM-05 · WebKit sin el entero: 5,0 px tras diez cambios · el e2e · Tab · `autoFocus` plantado · quién roba el foco · guía · guardado mudo, copia sin «sin nota», sin migración · la prueba · alias (M2) · versión anterior: 29 fallos · la frase · A1/A2/M3 · guía de antes: 4 fallos · cada una · B1 y B7 · sin redondeo / sin metas: rojo · el caso. Todas: rojo nombrando y verde al restaurar.
- **Desviaciones:** (1) planeado por la planeadora primero; el cómo, aquí con Opus 5.5 (no Fable) · (2) **OM-33 no era del sitio:** en WebKit de macOS el primer Tab cae en «Tu nombre» (Safari tabula solo campos; Opción+Tab recorre todo); el sitio no cambió, la guía lo explica (a6) y un e2e fija el orden · (3) OM-05 solo se reproducía en WebKit (trunca un `scrollTo` fraccionario) · (4) «Copiar» no listaba los «sí» sin nota: sección aditiva · (5) lista de frases del corpus con adjetivo: **vacía**, sin pregunta al dueño · (6) siguen con «vitrina» a propósito los identificadores (`src/lib/vitrina`, `content/vitrina`, `data/vitrina.yaml`, `public/vitrina`, espacios de mensajes) · (7) sin tocar, nombran la palabra: `CLAUDE.md` (regla 17 y «Qué es»), `docs/contrato-ficha-tecnica/` y `design-sync/` (cierre del hito).
- **Deuda (al lote del H-3):** B2 `scripts/sin-vitrina.mjs:112` (`showcase` verbo) · B3 `:115` («A LA VITRINA» → «Al PORTAFOLIO») · B4 `docs/GUIA-DE-PRUEBA.html:5743,5813` (nota en fila sin responder, `⏎` literal, chip de minutos en el título) · B8 `tests/unit/sin-vitrina.test.ts:239` (ventana heurística) · B11 `content/vitrina/planlang.brochure-export.json:180,194,200` (`seccion_manual: "Abrir la vitrina"` se lee «Abrir el portafolio»; la planeadora) · B12 `src/lib/redireccion.ts:21` (`#vitrina` sin alias; `/es/vitrina/` da dos saltos) · B13 `docs/GUIA-DE-PRUEBA.html:3528,3541,3562` (o3–o5 piden `pnpm`).
- **Aprendizajes:** un alias de palabra necesita su concordancia y una salida ruidosa: mejor un build rojo que «la nueva portafolio» publicado · medir la deriva del scroll con rueda real en WebKit, no en Chromium · un barrido de ruta vieja se atrapa a sí mismo (un literal `/vitrina/g` en un test) · no pasar el alias por texto recién escrito (rompe identificadores) · leer el `status:` de la planeadora antes de listar un pendiente suyo. **Esfuerzo-beneficio:** alto: ocho órdenes de la revisión en un PR sin editar fichas de otras casas.
- **Auditoría (4 casillas):** independiente (Sonnet 5.5 · alto, solo lectura, con el diff): **C 0 · A 2 · M 4 · B 13**; seguridad: sin secretos ni enlaces nuevos. Pagados: A1 filas R10/q24 y 3 documentos con la posición vieja · `35a2b73`+`07578fc` · A2 restaurar con título cambiado · `35a2b73`+`07578fc` · M1 documentos · `35a2b73` · M2 concordancia · `076f467` · M3 aviso bajo todo filtro · `35a2b73`+`07578fc` · M4 manual · `35a2b73` · bajos B1 `8be81a0`, B5 B6 B9 B10 `35a2b73`, B7 `49783a1`+`f6736a2`. Al lote: B2 B3 B4 B8 B11 B12 B13.
- **Modelo por fase · relevos:** F1, F2 y F3 con Sonnet 5.5 (plan con Opus 5.5; auditor Sonnet 5.5): sin desvío; Haiku no se usó · **relevos: ninguno pedido.**
- **Siguiente:** Sprint 024, que planea primero la planeadora. **Para mergear:** squash y borrar la rama; después `/cierre-sprint hoja-de-vida`.

## Para la revisión (lo que hace el dueño después del merge)

- **Elegir:** la letra del año de la Trayectoria (dos capturas, Fraunces actual o la mono de las fechas; una línea; sin respuesta, Fraunces) · **abrir** `docs/GUIA-DE-PRUEBA.html` v23 → las filas «Mejorado · S23»: R1, a2, a3b, a5, a6, b1, R13, o1, h3, a8, R8, R10 y q24 (vuelven a pendiente y muestran tu respuesta anterior) y la o18 nueva; tus demás respuestas s21 se conservan.

### Horas del sprint (`scripts/horas-sprint.mjs`, rango `origin/main..HEAD`, sin el commit del cierre)

| Commits | Sesiones | Horas activas | Span (primer → último commit)               |
| ------: | -------: | ------------: | ------------------------------------------- |
|      15 |        1 |         1,7 h | 2026-10-25 10:42 → 2026-10-25 11:53 (1,2 h) |

| Fase | Commits | Horas activas |
| ---- | ------: | ------------: |
| F1   |       4 |         0,7 h |
| F2   |       3 |         0,2 h |
| F3   |       8 |         0,7 h |
