---
sprint: 026
app: hoja-de-vida
hito: H-2
opened: 2026-10-28
closed: 2026-10-28
branch: sprint-026/fichas-de-apps
pr: https://github.com/mauriciorincon-ai/app-hoja-de-vida/pull/105
---

# Sprint 026 — Cierre ejecutivo · CV Viva · Sentada 4a: las fichas de las apps, a la altura

- **Resultado: PARCIAL, no listo para merge.** Entran 9 de las 10 fichas y la orden de correcciones; **falta una entrega de la planeadora y un criterio del chat no se cumple** (abajo). 2464 unit (95 archivos) verdes y **2 rojas** (ADR-028: el complemento de `anonimizador` dice «Velo» a secas en las líneas 12 y 18; la CI no pasa hasta que la planeadora lo reemita y se recopie) · typecheck, lint, `pnpm audit` y dependencias (838) limpios · e2e completo: 1008 pasan, 35 omitidas, 2 fallaban (el barrido de «vitrina» no conocía a planlang; corregido) y tras la auditoría vitrina+portafolio dan 130/130.
- **Tiempo:** estimado 3,0 h (planeadora: F1 1,0 · F2 1,25 · F3 0,75) · real **1,9 h, piso del script** (abajo; no cuenta lectura, planeación, la revisión de 220 imágenes por subagentes ni la espera de la pasada) · diferencia −1,1 h.
- **Entregables:** F1 nueve apps copiadas byte a byte (export, complemento, tabla de capturas y 220 imágenes, `cmp` iguales; planeadora `cdc6130` ocho y `8759cae` Probeta DS; bases: ds d302949 · Velo 5bac57b · Big-D 84aa911 · AngelGhost 67052a9 · Dash f80375f · Habla 6c4d113 · HackGuard b5acd4b · Nutrikids 69538dc · planlang 269a68e), 16 líneas de la orden (barrido en 0 con las excepciones declaradas), cifras de Probeta DS y el mes en cada fila de dos de las tres tablas · F2 carrusel por grupo, portada en el escaparate, Stack con «Para qué sirve cada uno», proceso de la planeadora, planlang conserva «vitrina», tres gates (capturas · ceros · «Cómo funciona») cada uno visto en rojo · F3 regla positiva de Vesting con su marcador, guía v26 (8 filas «Mejorado · S26»), manual y design-system.
- **Pasada en vivo** (Groq Free · `openai/gpt-oss-120b`, con el «sí» del dueño; `.env.local` pasó a 600): 22 preguntas ES+EN, 16 al modelo; 24 742 tokens de entrada y 8 117 de salida (≈ US$0); 325 s. Motivos 0 en todas; 19 de 22 sin defecto. **Falla el criterio de Vesting:** «¿Por qué salió de Vesting?» y «Why did he leave Vesting?» devuelven el rehúso fijo aunque el modelo recibió el trozo que trae «enero de 2025». Y «What data do you keep about me?» cerró con «Let me know if you'd like…» y el marcador de voz del dueño lo marcó (cortesía del asistente, ambigua). No toqué el marcador ni la fila: la prueba en vivo queda roja en la máquina del dueño.
- **Desviaciones:** (1) el plan se hizo con Opus, no con Fable · (2) no planeados: el arreglo del router BPMN (un flujo de Nutrikids cruzaba una caja) y el `diferir` del carrusel (Chromium pedía 24 imágenes con las tarjetas cerradas) · (3) «Cómo aprendo» cambia solo la fila de Probeta DS y sin meses: su subsección está en el tope de 400 palabras del gate · (4) Innmobiliaria queda fuera (su PR #42 sigue abierto): su fila (172/76/98,31/6), sus dos frases y su portada esperan; `ESPERAN_SU_ENTREGA` exime sus gates · (5) `tema-cv-viva.mjs` se conserva: la planeadora lo lee · (6) las filas de Dash y Habla quedan «(ago. 2026)» (default de la pregunta 2) · (7) el auditor creó y borró un archivo temporal de pruebas (árbol limpio).
- **Deuda (al lote del H-3):** M2 cifras viejas en `apps-pipeline.{es,en}.md:116,145` y `agentes-en-produccion.es.md:159` (+ `.en.md:323`) · M4 `nutri-kids.capturas.yaml:2` (sus 19 pantallas vienen con el tema de CV Viva y la nota del sitio dice «reales») · B3 crédito de ARASAAC corto en los pies de Habla · B4 `design-sync/components/componentes-s5/captura-repintada.html:82` aún cita `pnpm capturas:vitrina` · B6 la razón del commit `5d08519` para Anonimizador.
- **Aprendizajes:** `git rm` deja las bajas en el índice y el siguiente commit las arrastra: revisar `git diff --cached --stat` · `loading="lazy"` en una pista horizontal pide imágenes aunque la tarjeta esté cerrada · escribir la prueba del caso borde (sin `IntersectionObserver`) encontró un defecto que la lectura no vio · una regla de prompt no se da por buena hasta la pasada en vivo: dos seguidas (025 negativa, 026 positiva) dejaron a Vesting en el rehúso. **Esfuerzo-beneficio:** alto en contenido y fichas; nulo en el chat.
- **Auditoría (4 casillas + contrato):** independiente (Sonnet 5.5 · alto, solo lectura, con el diff): **C 0 · A 1 · M 5 · B 7**; seguridad: `pnpm audit` y gitleaks limpios. Pagados: A1 `e778a2a` · M1 M3 B7 `e778a2a` · M5 B1 `c0772c0` · B2 `66379ee` · B5 `6136b27`. Al lote: M2 M4 B3 B4 B6.
- **Modelo por fase · relevos:** F1, F2 y F3 con Sonnet 5.5 (auditor Sonnet 5.5): sin desvío; Haiku no se usó · **relevos: uno por pedir** (la regla de Vesting) · **Para mergear:** cuando la CI esté verde: squash y borrar la rama; después `/cierre-sprint hoja-de-vida`.

## Para la revisión (lo que hace el dueño)

- **Decidir:** (a) cómo se cierra Vesting: una respuesta fija que narre el cierre con su cita, sin llamar al modelo (código primero, regla 14; recomendada), u otro modelo; una tercera regla de prompt con el mismo modelo no se intenta (regla 29) · (b) si «Let me know…» cuenta como voz del dueño · (c) la nota «pantallas reales» frente a las de Nutrikids con el tema de CV Viva.
- **Para la planeadora** (`privado/revision-s21/entrega-026-defectos.md`): reemitir `anonimizador` («Anonimizador Velo»), pies y encuadres de las entregas, la firma y el export de Innmobiliaria. **FORMA al gate humano:** el carrusel, el Stack y las portadas · **abrir** `docs/GUIA-DE-PRUEBA.html` v26 → «Mejorado · S26»: k1b, k10, k11, k13, k15f, k17, l6, m6.

### Horas del sprint (`scripts/horas-sprint.mjs`, rango `origin/main..HEAD`, sin el commit que enlaza este PR)

| Commits | Sesiones | Horas activas | Span (primer → último commit)               |
| ------: | -------: | ------------: | ------------------------------------------- |
|      30 |        1 |         1,9 h | 2026-10-28 18:49 → 2026-10-28 20:15 (1,4 h) |

| Fase | Commits | Horas activas |
| ---- | ------: | ------------: |
| F1   |      13 |         0,7 h |
| F2   |      12 |         0,3 h |
| F3   |       5 |         0,9 h |
