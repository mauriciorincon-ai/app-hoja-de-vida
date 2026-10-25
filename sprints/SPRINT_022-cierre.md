---
sprint: 022
app: hoja-de-vida
hito: H-2
opened: 2026-10-24
closed: 2026-10-24
branch: sprint-022/sentada-5-agentes
pr: https://github.com/mauriciorincon-ai/app-hoja-de-vida/pull/100
---

# Sprint 022 — Cierre ejecutivo · CV Viva · Sentada 5 de la revisión: tres agentes fuera, nombres sin «Harness», investigaciones en pausa

- **Resultado:** OM-30, OM-31 y OM-32 de la revisión del dueño, enteros. **Logrado, listo para merge.** 1902 unit (82 archivos, líneas 90,93 %) · typecheck, lint, build (con el índice del chat), `pnpm audit` y dependencias sin bajar limpios · e2e completo (chromium, móvil y @webkit): 941 pasan, 32 omitidas de siempre, 0 fallan · Lighthouse local no corrido: lo mide la CI.
- **Tiempo:** estimado 5 h (F1 2 · F2 1,5 · F3 1,5) · real **1,6 h, piso del script** (abajo; no cuenta lectura ni planeación) · fases: F1 el retiro · F2 el alias de nombre y la pausa · F3 guía, manual, auditoría y cierre.
- **Entregables:** 3 fichas retiradas (agentes 14 → 11, piezas en disco 37 → 34) y sus cuentas movidas en el corpus ES/EN (con número y con letras), 4 piezas de «Métodos», banco, guía y manual · gate `retiro-piezas` (generaliza el del S21) · alias de nombre de pieza `data/nombres-piezas.yaml` (ADR-028, adenda): «Paper Computacional» en escaparate, página, chat y citas, sin editar la ficha · Investigaciones `en-preparacion` con aviso propio (`enPreparacion`): sin tarjetas, fuera del sitemap y del chat, fichas en 404 · guía v22 (prefijo `s21` intacto) · manual · gate `lighthouse-urls`.
- **Demos en rojo (archivo · mutación · a quién nombró):** `retiro-piezas` · «Agente B» partido en dos líneas plantado en `docs/` · el archivo y la línea · `nombres-piezas` · el nombre viejo plantado · su archivo · índice del chat · una cita a una pieza en pausa · `destinoExiste` · e2e · una pieza en pausa dejada en el sitemap · la prueba de la pausa · `lighthouse-urls.json` · `forja` devuelta · la URL. Cada una: rojo nombrando y verde al restaurar.
- **Desviaciones:** (1) la orden vive en `privado/revision-s21/oportunidades.md` (fuera de git), no en un archivo del sprint de la planeadora · (2) **«Qué tiene» no pasó a «Qué aporta»**: la clave es compartida con agentes y tableros y es vocabulario del contrato de la ficha; con la pausa no se ve → rediseño (027) · (3) **las cuentas del corpus miden el disco** (7 investigaciones, 34 piezas), no lo publicado: reescribir esas líneas es prosa del dueño; la guía y el manual sí cuentan lo publicado (27) → pregunta o17(1) · (4) el método de Design Science se conserva en `las-investigaciones` y el CV; en `apps-pipeline` salió el ejemplo de sus «52 criterios» → o17(2) y (4) · (5) la simulación de planlang (`public/piezas/planlang`) y la ficha de planlang siguen con «Demo A / Demo B» y «Agente A / Agente B»: son de otra casa (regla 2), fuera del barrido, reportado → o17(3) · (6) el alias vale para cualquier frente, no solo agentes · (7) cuatro enlaces de evidencia de «Métodos» apuntan al frente mientras dure la pausa (el YAML guarda el slug) · (8) OM-35 (aviso de guardado fallido y «Restaurar desde texto») aplazado a la 023.
- **Deuda (al lote del H-3, con nombre):** `src/lib/vitrina/nombres-piezas.ts:21-34` acepta la clave `apps`, que nadie lee · `scripts/nombres-oficiales.mjs:28-38` no valida el YAML · `src/lib/schemas.ts:403-409` acepta `enPreparacion` en un frente abierto sin `refine` · el filtro «frente abierto» está repetido en 5 sitios · `messages/es.json:268` cierra la página en pausa con «se muestra para enseñar capacidades» · `data/a-fondo/los-agentes-de-la-vitrina.es.md:193,214` titulan «investigación» en plural · el skip de «0 funcionalidades» de `tests/e2e/vitrina.spec.ts` contradice su comentario · reabrir Investigaciones: checklist en el manual.
- **Aprendizajes:** un barrido línea por línea no ve un nombre partido a ~100 columnas: el gate barre el archivo entero y se prueba con la prosa real · una pausa deja páginas de la CI en 404 (`lighthouse-urls.json`) que ningún test miraba · un test que fija «hoy X está en pausa» se rompe al reabrir: debe leer el YAML. **Esfuerzo-beneficio:** alto: tres órdenes de la revisión en un PR sin tocar fichas de otras casas.
- **Auditoría (4 casillas):** independiente (Sonnet 5.5 · alto, solo lectura, con el diff): **C 0 · A 4 · M 5 · B ~10**; seguridad: sin secretos ni enlaces nuevos. Pagados en el sprint: A1 lighthouse · `dcc6972` · A2 fila k8 · `13e2c4e` · A3 `apps-pipeline` · `98d8b53` · M1 gate ciego a B · `d10b628` · M2 reapertura · `d10b628`+`13e2c4e` · M4 copia de la HOME y del frente · `246f1a1` · M-priv (redacción) · pagado · bajos: adenda ADR-028, alias leído una vez, tabla del manual. **A4** (Demo A/B en el export y la simulación de planlang) y **M3** (dos cifras a la vez) no se pagan aquí: son de otra casa y prosa del dueño → o17.
- **Modelo por fase · relevos:** F1, F2 y F3 con Sonnet 5.5 (planeación con Fable 5.1, declarada por el dueño para esta revisión; auditor con Sonnet 5.5): sin desvío; Haiku no se usó · **relevos: ninguno pedido.**
- **Decisiones del dueño en la planeación (para la planeadora):** resolver la revisión por sentada, planeada con Fable y ejecutada con los otros modelos · «vitrina» → «Portafolio» en textos y rutas con 301 (023) · ficha técnica = resumen estándar y brochure = página completa rediseñada con su muestra (027) · el chat vence a las 8 h del último mensaje (024) · Métodos con índice flotante y «anterior · siguiente» (028).
- **Siguiente:** Sprint 023 (sentada 1: la casa y el inglés, con OM-35). **Para mergear:** squash y borrar la rama; después `/cierre-sprint hoja-de-vida`.

## Para la revisión (lo que hace el dueño después del merge)

- **Qué abrir:** `docs/GUIA-DE-PRUEBA.html` v22 → las filas «Mejorado · S22»: k1b, n4b, m1b, m4, m6, k8, k9, m10, m11 y R9 · **tuyo:** la o17 (cuatro preguntas que dejó el retiro). Tus respuestas s21 se conservan.

### Horas del sprint (`scripts/horas-sprint.mjs`, rango `origin/main..HEAD`, sin el commit del cierre)

| Commits | Sesiones | Horas activas | Span (primer → último commit)                |
| ------: | -------: | ------------: | -------------------------------------------- |
|      16 |        2 |         1,6 h | 2026-10-24 08:34 → 2026-10-24 22:25 (13,8 h) |

| Fase     | Commits | Horas activas |
| -------- | ------: | ------------: |
| F1       |       4 |         0,5 h |
| F2       |       3 |         0,2 h |
| F3       |       8 |         0,4 h |
| sin fase |       1 |         0,5 h |
