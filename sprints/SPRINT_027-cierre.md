---
sprint: 027
app: hoja-de-vida
hito: H-2
opened: 2026-10-29
closed: 2026-10-29
branch: sprint-027/lo-que-dejo-el-026
pr: PENDIENTE
---

# Sprint 027 — Cierre ejecutivo · CV Viva · Sentada 4b: lo que dejó el 026, cerrado

- **Resultado:** las diez fichas quedan en la última entrega de la planeadora, «¿Por qué salió de Vesting?» (y su gemela en inglés) ya no pasa por el modelo —texto fijo con su cita a la Trayectoria, en el servidor, en el modo local y en la pasada en vivo—, ninguna ficha pinta funcionalidades descartadas (OM-24) y las siete profesionales van en el orden pedido (OM-27). e2e completo (chromium, móvil y `@webkit`): 1014 pasan, 35 omitidas, 0 fallan · 2628 unit e integración (96 archivos) verdes · typecheck, lint, `pnpm audit` y dependencias (838) limpios. **La pasada en vivo NO se corrió** (G-Plan 1a): la fila de Vesting pasó a ruta «fija» y la cortesía exenta del marcador se miden contra el modelo real cuando el dueño dé el «sí». **Para el merge: la CI en verde.**
- **Tiempo:** estimado 2,5 h (planeadora: F1 1,25 · F2 0,75 · F3 0,5) · real **1,6 h, piso del script** (abajo; no cuenta lectura, planeación, la revisión de 71 imágenes por subagentes ni la espera de los e2e) · diferencia −0,9 h.
- **Entregables:** F1 seis copias byte a byte (`cmp` igual en las diez; 71 imágenes revisadas una por una, tabla en el PR). Origen en la planeadora: Dash Agent `7c915ad` · HackGuard `8ea2024` · AngelGhost `6f33182` · Nutrikids `4595aa5` + `f0ec4e0` · Probeta DS `304973b` + `8c3dfdc` · Innmobiliaria `080ed3a` + `f0ec4e0`. Las dos filas de Probeta DS e Innmobiliaria en las tres tablas de apps (14 líneas, sustitución exacta con script), `ESPERAN_SU_ENTREGA` vacía, OM-27 y OM-24 · F2 `salida-de-vesting.ts` con su lista cerrada, su fuente y su prueba contra el banco entero; el marcador de voz del dueño exime la cortesía del asistente; la pasada en vivo mide la ruta «fija» · F3 guía v27 (cuatro filas «Mejorado · S27»), manual, `design-system.md` y la auditoría pagada.
- **Desviaciones:** (1) **el router BPMN, no planeado:** la ficha nueva de Innmobiliaria encimaba sus círculos de enlace y se apilan uno bajo otro. Medido contra el router de `main` con las 6 columnas del renderizador, **cambian cinco diagramas ya publicados** (Big-D, AngelGhost, Dash Agent, HackGuard, Innmobiliaria) y quedan idénticos cinco (Anonimizador Velo, Probeta DS, Habla San, Nutrikids, planlang); el trazo de Habla está fijado carácter por carácter. Capturas escritorio y móvil en `muestras/2026-10-29-s27/` · (2) el «otro lector» del «Abre cuando» lo cumple el «vamos» del dueño más la revisión una por una y `f0ec4e0` de la planeadora · (3) el plan se hizo con Opus 5.5 (corrección del dueño: Fable solo en emergencia declarada) · (4) la firma de Innmobiliaria se queda en el grupo 4 (su C1 es el sello) y solo cambia el comentario · (5) una carrera de la prueba de axe del S26 (1 de ~1000 corridas): arreglada en `5c44db5`.
- **Deuda (al lote del H-3):** B1 falsos negativos de la lista de Vesting, `src/lib/ia/salida-de-vesting.ts:115` («¿Lo despidieron?», «What motivated him to leave Vesting?»): es un piso, no un techo · B3 `tests/e2e/vitrina.spec.ts:431` la e2e de OM-24 falla por el atributo, no por el texto de la descartada · B6 `src/components/chat/chat-panel.tsx:174` la respuesta fija por servidor cuenta como `modo ia` en la analítica, igual que las otras fijas · del 026 siguen M2, B4 y B6.
- **Aprendizajes:** «cuando / como / when / how» son también conjunciones: una lista cerrada se mide contra frases AJENAS, no solo contra el banco (pasaba 187 de 187 y el auditor halló cinco falsos positivos; yo, un sexto: «después de su salida de Vesting») · una prueba que pasa 50 de 50 en aislado puede caer 1 de 1000 en el completo: se reproduce con un espejo sobre los seis grupos a carga alta y se mide antes y después (22 de 180 → 0 de 960) · para decir «este cambio de motor no mueve lo que no debe», el literal exacto del router anterior, no solo propiedades. **Esfuerzo-beneficio:** alto; deja el 026 cerrado y quita del chat un motivo inventado.
- **Auditoría (4 casillas):** independiente (Sonnet 5.5 · alto, solo lectura, con el diff): **C 0 · A 0 · M 1 · B 8** (calidad M1 y B1–B6, seguridad S1, frases F1). Seguridad: `pnpm audit` limpio, cero enlaces, secretos y rutas de máquina. Pagados: M1 y B5 `d6cb3ed` · B2 `222f65e` · F1 `6139523` · B4 `572abb3`. Al lote: B1 B3 B6 · S1 va a la planeadora (abajo).
- **Modelo por fase · relevos:** el plan con Opus 5.5; F1, F2 y F3 con Sonnet 5.5 (auditor Sonnet 5.5): sin desvío; Haiku no se usó · **relevos: ninguno** · **Para mergear:** con la CI verde: squash y borrar la rama; después `/cierre-sprint hoja-de-vida`.

## Para la revisión (lo que hace el dueño)

- **FORMA al gate humano:** las diez portadas del escaparate, el orden de las profesionales (Probeta DS · planlang · HackGuard · Anonimizador Velo · Big-D · Dash Agent · AngelGhost) y los cinco diagramas «Cómo funciona» que cambian · **abrir** `docs/GUIA-DE-PRUEBA.html` v27 → «Mejorado · S27»: k6, k15f, k17, o1.
- **A la planeadora (aquí no se edita):** pies que dicen más que la imagen: Innmobiliaria H2-07 («el número no se guarda»), H2-15 («aún apagado») y C8a («embudo real»), HackGuard F17 («ISO/IEC 42001»), Nutrikids F4 y F7 · C7a «29 cupos» frente a C8b «27» · **S1:** Innmobiliaria C1 muestra tres celulares `+57 300 555 xxxx` de origen sintético que no puedo comprobar; el dueño decide si pide retomarla · rutas de la toma en AngelGhost M3 (`/Users/consultor/…`) y Dash B1 y C7 (`/Users/Shared/demo/…`) · la línea 88 de `RESPUESTA-026.md` de Innmobiliaria aún dice «Sigue esperando el merge de #42» · D12 «ojo · ojo», U1 «clase positiva: 0», H2-23 con doble punto y «Nutri-Kids» en la interfaz de Nutrikids. OM-28 llegó resuelto en origen.
- **Pasada en vivo, opcional (solo con tu «sí»):** `pnpm test:en-vivo` mide la ruta «fija» y que ninguna respuesta marque la cortesía como tu voz; sin ella ambas están probadas por unidad, integración y e2e con el proveedor simulado, no contra el modelo real.

### Horas del sprint (`scripts/horas-sprint.mjs`, rango `origin/main..HEAD`, sin los commits del cierre y del enlace al PR)

| Commits | Sesiones | Horas activas | Span (primer → último commit)               |
| ------: | -------: | ------------: | ------------------------------------------- |
|      20 |        1 |         1,6 h | 2026-10-29 18:30 → 2026-10-29 19:39 (1,1 h) |

| Fase | Commits | Horas activas |
| ---- | ------: | ------------: |
| F1   |       9 |         0,8 h |
| F2   |       3 |         0,0 h |
| F3   |       8 |         0,8 h |
