---
sprint: 021
app: hoja-de-vida
hito: H-2
opened: 2026-10-23
closed: 2026-10-24
branch: sprint-021/revision-completa
pr: https://github.com/mauriciorincon-ai/app-hoja-de-vida/pull/99
---

# Sprint 021 — Cierre ejecutivo · CV Viva · La revisión completa: todo lo pendiente, en una sola guía

- **Resultado:** el agente de estudio del AI-103 sale del sitio y la guía v21 junta lo pendiente en una revisión sobre producción. **Logrado, listo para merge.** 1889 unit (líneas 90,78 %) · typecheck, lint, build, `pnpm audit` y dependencias sin bajar limpios · e2e completo (1011): 975 pasan, 36 omitidas de siempre, 0 fallan · Lighthouse local no corrido: el sprint no toca componentes y lo mide la CI.
- **Tiempo:** estimado 3 h (F1 1,25 · F2 1,25 · F3 0,5) · real **1,2 h, piso del script** (abajo; no cuenta la lectura ni la planeación) · fases: F1 el retiro · F2 la guía · F3 auditoría, manual y cierre.
- **Entregables:** la orden de la Fábrica entera (§1–§4): ficha borrada; `certificaciones`, `como-aprendo` y `los-agentes-de-la-vitrina` (ES y EN) sin el agente; cuentas con números y con letras en 15 documentos del corpus (ES y EN), 4 piezas de «Métodos», la guía y el manual; las dos filas «trece» del banco; índice del chat regenerado; gate `retiro-super-guia` · guía v21 con el filtro «Revisión completa» (sentadas ≤ 45 min por lugar y aparato, cada prueba una vez, sí/no + nota, «Copiar mis respuestas», «Quitar respuesta»), 6 pruebas nuevas, 16 caducadas corregidas y 5 fuera con su razón · manual · gate `guia-revision`.
- **Demos en rojo (archivo · mutación · a quién nombró):** `certificaciones.es.md` · una frase del agente plantada · `certificaciones.es.md:195` · `GUIA-DE-PRUEBA.html` · a1 sin sentada / a1 con 12 min / el botón de copiar renombrado / «~3 min» devuelto a un bloque / el botón «Quitar» siempre oculto · «a1: no está en ningún sitio», «la sentada 1 suma 52 min y el tope es 45», «guía v21», «~3 min», «sin respuesta no se ofrece quitarla». Cada una: rojo nombrando y verde al restaurar.
- **Desviaciones:** (1) la regla 4 prohíbe `[CONFIRMAR]` en un documento aprobado: la sección de la guía de estudio de `certificaciones` salió **entera** (la orden lo permite) y lo que depende del dueño va como pregunta en la guía (o15, o16), no en el texto · (2) **Supabase no se tocó**: `chat_registro` y `chat_codigos` guardan conversaciones y códigos; el índice del chat se arma en el build (`package.json:10`, `public/chat-index.*` fuera de git) y ningún script ni ruta lo escribe allí: no había nada que volver a ingerir · (3) una línea de `sprints/SPRINT_020-lote.md` (la prueba de S16-B7 citaba «38 piezas», que ahora son otras): `lote-h2.test.ts` la habría roto · (4) cifras que la orden no listaba y la lectura halló: «cinco sellados y diez en estado inicial» (ahora nueve), «quince/catorce» y «trece/doce» con palabra, y el conteo de sprints (21) en 3 documentos, incluido el resumen de `como-aprendo` que decía «diecinueve» (la cifra que un gate mide en otras frases) · (5) **11 sentadas, no 9–10**: la revisión suma 5 h 22 min y las preguntas abiertas de los cierres S10–S13 pidieron la suya (o16) · (6) `pnpm corpus:informe` reescribe `sprints/SPRINT_008-banco-de-preguntas.md` (el versionado dice 148 preguntas; hoy son 175): no se versionó el cambio.
- **Deuda (al lote del H-3, con nombre):** el informe del banco versionado está desfasado (`sprints/SPRINT_008-banco-de-preguntas.md`: regenerarlo cambia unas 330 líneas) · los `[CONFIRMAR]` de los cierres S10–S13 siguen sin respuesta escrita (o16) · «planeador en preparación» en `cv.es.yaml:885` (vigente, a revisar al llegar el planeador) · la ficha de la otra casa que dice «21 módulos» (S12): se reporta, no se edita.
- **Aprendizajes:** un gate de cuentas lee cifras con número, y la lectura halló lo que no: palabras («quince»), particiones («cinco y diez») y estimaciones de minutos escritas a mano en cada bloque de la guía (las halló el auditor) · un verificador de solo lectura contra el código halló 14 pruebas caducadas que ningún test veía · una guía que se reordena por JS debe devolver cada fila a su sitio y probarlo. **Esfuerzo-beneficio:** alto: una sola revisión, sin una prueba pendiente sin sitio.
- **Auditoría (4 casillas):** independiente (Sonnet 5.5 · alto, solo lectura, con el diff): **C 0 · A 0 · M 2 · B 6**; seguridad limpia; frases caducadas: sin hallazgos nuevos; orden aplicada entera. Todos pagados en el sprint: M1 (los «~N min» de cada bloque, `13`) y M2 (este cierre); B1 «Quitar respuesta» · B2 los pendientes cuentan igual arriba y abajo · B3 «tandas» y «sentadas» · B4 radios sin restauración · B5 tope propio de 60 s · B6 el conteo de sprints (con este cierre).
- **Modelo por fase · relevos:** F1, F2 y F3 con Sonnet 5.5 (planeación con Opus 5.5; auditor y un verificador de lectura con Sonnet 5.5): sin desvío; Haiku no se usó · **relevos: ninguno pedido.**
- **Siguiente:** la revisión del dueño sobre producción; después `/cierre-sprint hoja-de-vida` y, si todo es «sí», el cierre del H-2. **Para mergear:** squash y borrar la rama; después `/cierre-sprint hoja-de-vida`.

## Para la revisión (lo que hace el dueño después del merge)

- **Qué abrir:** `docs/GUIA-DE-PRUEBA.html` → pega tu dominio en «URL de prueba» → el filtro «Revisión completa» ya está activo → sentada tras sentada, en tu computador personal y, el teléfono, con datos móviles. **Cuánto:** lo suma la página: 115 pruebas en 11 sentadas, 322 min (5 h 22 min); por sentada, 42 · 30 · 38 · 31 · 23 · 37 · 11 · 15 · 43 · 13 · 39 min (ninguna pasa de 45). Parte la revisión en los días que quieras: las respuestas y las notas quedan en ese navegador (prefijo `s21`).
- **Cómo traerlo:** al parar o al terminar, «Copiar mis respuestas» (fecha, versión, totales, cada «no» con su nota, los pendientes) y lo pegas en la sesión de la planeadora; un «no» se corrige en el sprint siguiente.
- **Tuyo (el sí/no no basta):** los Criterios ▲ de T1, T5, T7, T8 y T9 (R14–R18) y de T4 y T6 (q9, q11) · el nivel del Experto ISO 42001 (q25) · la puerta de la HOME (R10) · las preguntas abiertas de S10–S13 y lo que quieras decir del AI-103 tras el retiro (o15, o16) · el Node del build (q26, opcional).

### Horas del sprint (`scripts/horas-sprint.mjs`, rango `origin/main..HEAD`, sin el commit del cierre)

| Commits | Sesiones | Horas activas | Span (primer → último commit) |
|---:|---:|---:|---|
| 16 | 1 | 1,2 h | 2026-10-23 23:27 → 2026-10-24 00:12 (0,7 h) |

| Fase | Commits | Horas activas |
|---|---:|---:|
| F1 | 9 | 0,5 h |
| F2 | 2 | 0,4 h |
| F3 | 5 | 0,4 h |
