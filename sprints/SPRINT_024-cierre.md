---
sprint: 024
app: hoja-de-vida
hito: H-2
opened: 2026-10-25
closed: 2026-10-25
branch: sprint-024/el-chat
pr: pendiente
---

# Sprint 024 — Cierre ejecutivo · CV Viva · Sentada 3 de la revisión: el chat, en tercera persona y sin perder la conversación

- **Resultado:** OM-12 a OM-17, la constitución regenerada, la orden de ds (`3010a31`) y la pasada en vivo, enteros. **Logrado, listo para merge.** 2292 unit (91 archivos, líneas 90,36 %) · typecheck, lint, `pnpm audit` y dependencias (838) limpios · e2e completo (chromium, móvil y @webkit): 994 pasan, 35 omitidas, 0 fallan · Lighthouse local no corrido: lo mide la CI (el lanzador del layout no trae Zod, lo vigila un test).
- **Tiempo:** estimado 5,5 h (planeadora: F1 2,5 · F2 2,0 · F3 1,0) · real **2,2 h, piso del script** (abajo; no cuenta lectura, planeación ni la espera de la pasada en vivo) · F1 rehúso, tercera persona y fuentes citadas · F2 conversación en el navegador, «Avisa a Henry», OM-17 · F3 guía, manual, pasada en vivo, auditoría y su pago (1,2 h).
- **Entregables:** rehúso fijo y respuesta ajena ANTES del proveedor (cero tokens, cero fuentes; también en búsqueda local) · prompt y panel en tercera persona · el panel pinta solo las fuentes que el texto cita · conversación en `localStorage` (8 h, «Borrar», el panel reabre sin tomar el foco, sobrevive al cambio de idioma) · «Avisa a Henry» dentro del chat (cookie firmada, sin pedir el correo) · «¿Qué estudió Henry?» cita Estudios (`alias` ×8) · guía v24 · manual · adenda del ADR-024 · arnés `pnpm test:en-vivo` (fuera de toda suite y de la CI, con modo en seco). Capturas escritorio y móvil: `muestras/2026-10-25-chat-s24/` (local).
- **Demos en rojo:** F1 5 (frontera quitada · «dilo honestamente» devuelto · `fuentesCitadas` = identidad · «escríbeme» plantado en `messages` · chequeo fuera de la ruta) · F2 5 (sin Zod al leer · 9 h · paso `chat` pidiendo correo · alias ×1 · panel reabierto con foco) · F3 1 (migración fija al 23) · auditoría: 21 casos de las listas, e2e del modo local (fragmentos en primera persona), `stop()` quitado, lanzador con Zod, foco de la puerta, 17 frases de voz, o9/o10 con la frase vieja y el marcador con «can't». Todas: rojo nombrando y verde al restaurar.
- **Pasada en vivo** (Groq Free · `openai/gpt-oss-120b`, con tu «sí»): 22 preguntas ES+EN, 16 al modelo y 6 sin él (rehúso 4, ajena 2); 22 619 tokens de entrada y 7 787 de salida. **Voz del dueño: 0 · ausencia afirmada: 0 reales · AI-102 y DP-100 no narrados al preguntar por certificaciones · «¿qué estudió?» cita Estudios.** 1 «defecto» del arnés era un falso positivo (el rehúso fijo, «can't»), corregido con su rojo (`ee064f0`). **Observación que el arnés no mide:** «¿Por qué salió de Vesting?» (ES y EN) añade un motivo que el corpus no da (solo dice que la etapa terminó en enero de 2025 dejando el ecosistema documentado); y «What data do you keep about me?» rehúsa en inglés mientras el español contesta. Informe: `privado/pasada-en-vivo-s24.md`.
- **Desviaciones:** (1) el plan se hizo con Sonnet 5.5, no con el Fable/Opus declarado · (2) R6 = 13 min, no 15 (el ensayo llegó a 47 min) · (3) sin filas nuevas en el banco: las «nunca» pasan a una sección `rehuso:` y OM-17 estrecha una fila existente · (4) «debilidades» también se rehúsa · (5) rehúso y ajena se registran como `offtopic` (default a, sin migración; Analytics los junta) · (6) la pasada se detuvo la primera vez en la guarda (clave local vacía, 0 llamadas) y corrió después con una clave local nueva.
- **Deuda (al lote del H-3):** M5 `src/components/chat/chat-panel.tsx:121-124` (restaurar no refresca las 8 h, sin prueba) · M7 `src/lib/ia/rehuso.ts:74-84` (formas que se escapan: «Hola, ¿qué no ha hecho nunca?», «Could you tell me what he has never done?») · B2 `src/lib/chat-conversacion.ts:121` (`leer` sin consumidor; `chat_borrado` sin lector) · B3 `src/app/api/chat/route.ts:74-86` · B4 19 archivos sin `prettier --check` · B5 `src/components/chat/chat-problema.tsx:62-70` (401 → error genérico) · B6 `scripts/build-chat-index.mjs:93-99` · B7 `route.ts:318-322` (el registro guarda las recuperadas, no las citadas) · B8 `src/lib/ia/schemas.ts:80` (ancla de `localStorage` sin regex) · B9 `chat-conversacion.ts:64-70` (`ultimo` sin tope superior).
- **Aprendizajes:** una lista cerrada se mide con el banco Y con el universo (el banco no vio «¿escribe código con Claude Code?») · el modo degradado es una puerta trasera de cada regla nueva · un marcador de la pasada se prueba con su propio rojo antes de creerle · la tercera persona no garantiza la fidelidad: el modelo infiere motivos. **Esfuerzo-beneficio:** alto: seis órdenes de la revisión (OM-12 a OM-17) en un solo PR, a 2,2 h.
- **Auditoría (4 casillas):** independiente (Sonnet 5.5 · alto, solo lectura, con el diff): **C 0 · A 4 · M 7 · B 9**; seguridad: sin secretos ni enlaces nuevos. Pagados: A1 A2 M6 `e620cd5` · A3 M2 M3 `e0f4d5b` · A4 `658de8c` · M1 `92f150c` · M4 B1 y el comentario de `schemas.ts` `3eff6f8`. Al lote: M5 M7 B2 a B9.
- **Modelo por fase · relevos:** F1, F2 y F3 con Sonnet 5.5 (auditor Sonnet 5.5): sin desvío; Haiku no se usó · **relevos: ninguno pedido.**
- **Siguiente:** lo planea primero la planeadora. **Para mergear:** squash y borrar la rama; después `/cierre-sprint hoja-de-vida`.

## Para la revisión (lo que hace el dueño después del merge)

- **Decidir:** si el chat debe dejar de inventar el motivo de la salida de Vesting (una regla de prompt y una segunda pasada, ≈ 6 min y US$0) o se queda para el lote · **abrir** `docs/GUIA-DE-PRUEBA.html` v24 → «Mejorado · S24»: R6, f2, f9, f12, o1, o9, o10 y n8 (vuelven a pendiente y muestran tu respuesta anterior).

### Horas del sprint (`scripts/horas-sprint.mjs`, rango `origin/main..HEAD`, sin el commit del cierre)

| Commits | Sesiones | Horas activas | Span (primer → último commit)               |
| ------: | -------: | ------------: | ------------------------------------------- |
|      18 |        1 |         2,2 h | 2026-10-25 14:39 → 2026-10-25 16:21 (1,7 h) |

| Fase | Commits | Horas activas |
| ---- | ------: | ------------: |
| F1   |       5 |         0,7 h |
| F2   |       3 |         0,3 h |
| F3   |      10 |         1,2 h |
