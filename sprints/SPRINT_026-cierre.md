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

- **Resultado:** entran 9 de las 10 fichas y la orden de correcciones; **Innmobiliaria queda fuera y el criterio de Vesting del chat no se cumple con el modelo real** (decidido por el dueño, abajo). 2466 unit (95 archivos) verdes tras la reentrega de la planeadora (`31b3a49`, `91fa150`), recopiada en `e635dbf`: el «Velo» a secas del complemento de `anonimizador` ya es «Anonimizador Velo» y los pies de Anonimizador, Habla y planlang quedan corregidos · typecheck, lint, `pnpm audit` y dependencias (838) limpios · e2e completo antes de la reentrega: 1008 pasan, 35 omitidas, 2 fallaban (el barrido de «vitrina» no conocía a planlang; corregido); vitrina+portafolio tras ella: 130/130. **Para el merge: la CI en verde.**
- **Tiempo:** estimado 3,0 h (planeadora: F1 1,0 · F2 1,25 · F3 0,75) · real **3,1 h, piso del script** (abajo; incluye ≈ 0,7 h de espera de la reentrega de la planeadora; no cuenta lectura, planeación, la revisión de 220 imágenes por subagentes ni la espera de la pasada) · diferencia +0,1 h.
- **Entregables:** F1 nueve apps copiadas byte a byte (export, complemento, tabla de capturas y 220 imágenes, `cmp` iguales; planeadora `cdc6130` ocho y `8759cae` Probeta DS; la reentrega `31b3a49`/`91fa150` de anonimizador, Habla y planlang entró en `e635dbf`; bases: ds d302949 · Velo 5bac57b · Big-D 84aa911 · AngelGhost 67052a9 · Dash f80375f · Habla 6c4d113 · HackGuard b5acd4b · Nutrikids 69538dc · planlang 269a68e), 16 líneas de la orden (barrido en 0 con las excepciones declaradas), cifras de Probeta DS y el mes en cada fila de dos de las tres tablas · F2 carrusel por grupo, portada en el escaparate, Stack con «Para qué sirve cada uno», proceso de la planeadora, planlang conserva «vitrina», tres gates (capturas · ceros · «Cómo funciona») cada uno visto en rojo · F3 regla positiva de Vesting con su marcador, guía v26 (8 filas «Mejorado · S26»), manual y design-system.
- **Pasada en vivo** (Groq Free · `openai/gpt-oss-120b`, con el «sí» del dueño; `.env.local` pasó a 600): 22 preguntas ES+EN, 16 al modelo; 24 742 tokens de entrada y 8 117 de salida (≈ US$0); 325 s. Motivos 0 en todas; 19 de 22 sin defecto. **Falla el criterio de Vesting:** «¿Por qué salió de Vesting?» y «Why did he leave Vesting?» devuelven el rehúso fijo aunque el modelo recibió el trozo que trae «enero de 2025». Y «What data do you keep about me?» cerró con «Let me know if you'd like…» y el marcador de voz del dueño lo marcó (cortesía del asistente, ambigua). No toqué el marcador ni la fila: la prueba en vivo queda roja hasta el 027. **Decidido por el dueño:** Vesting con respuesta fija y su cita, sin llamar al modelo (no se reabre), y «Let me know…» no es su voz.
- **Desviaciones:** (1) el plan se hizo con Opus, no con Fable · (2) no planeados: el arreglo del router BPMN (un flujo de Nutrikids cruzaba una caja) y el `diferir` del carrusel (Chromium pedía 24 imágenes con las tarjetas cerradas) · (3) «Cómo aprendo» cambia solo la fila de Probeta DS y sin meses: su subsección está en el tope de 400 palabras del gate · (4) Innmobiliaria queda fuera (su PR #42 sigue abierto): su fila (172/76/98,31/6), sus dos frases y su portada esperan; `ESPERAN_SU_ENTREGA` exime sus gates · (5) `tema-cv-viva.mjs` se conserva: la planeadora lo lee · (6) las filas de Dash y Habla quedan «(ago. 2026)» (default de la pregunta 2) · (7) el auditor creó y borró un archivo temporal de pruebas (árbol limpio) · (8) la planeadora reentregó a mitad del cierre y, por decisión del dueño, AngelGhost (M3 V1 L4), Nutrikids (F3 F16 y el tema de la app) y el delta de Probeta DS S21 NO se recopian aquí: entran por recopia en el 027.
- **Deuda (al lote del H-3):** M2 cifras viejas en `apps-pipeline.{es,en}.md:116,145` y `agentes-en-produccion.es.md:159` (+ `.en.md:323`) · M4 resuelto en origen (la planeadora retomó Nutrikids con el tema de la app: entra en el 027; hasta entonces `nutri-kids.capturas.yaml:2` sigue con el de CV Viva) · B4 `design-sync/components/componentes-s5/captura-repintada.html:82` aún cita `pnpm capturas:vitrina` · B6 la razón del commit `5d08519` para Anonimizador.
- **Aprendizajes:** `git rm` deja las bajas en el índice y el siguiente commit las arrastra: revisar `git diff --cached --stat` · `loading="lazy"` en una pista horizontal pide imágenes aunque la tarjeta esté cerrada · escribir la prueba del caso borde (sin `IntersectionObserver`) encontró un defecto que la lectura no vio · una regla de prompt no se da por buena hasta la pasada en vivo: dos seguidas (025 negativa, 026 positiva) dejaron a Vesting en el rehúso. **Esfuerzo-beneficio:** alto en contenido y fichas; el chat se resuelve en el 027.
- **Auditoría (4 casillas + contrato):** independiente (Sonnet 5.5 · alto, solo lectura, con el diff): **C 0 · A 1 · M 5 · B 7**; seguridad: `pnpm audit` y gitleaks limpios. Pagados: A1 `e778a2a` · M1 M3 B7 `e778a2a` · M5 B1 `c0772c0` · B2 `66379ee` · B5 `6136b27`. Al lote: M2 B4 B6 (M4 y B3 los resolvió la planeadora en origen).
- **Modelo por fase · relevos:** F1, F2 y F3 con Sonnet 5.5 (auditor Sonnet 5.5): sin desvío; Haiku no se usó · **relevos: uno pedido** (la regla de Vesting) y resuelto por el dueño: respuesta fija, sin modelo · **Para mergear:** con la CI verde: squash y borrar la rama; después `/cierre-sprint hoja-de-vida`.

## Para la revisión (lo que hace el dueño)

- **Decidido por el dueño (2026-10-28), fuera de este PR:** Vesting con respuesta fija y su cita, sin llamar al modelo (no se reabre) · «Let me know…» no es su voz · Nutrikids con el tema de la app · las retomas (AngelGhost, Nutrikids) y el delta de Probeta DS (S21) entran por recopia en el 027.
- **De esta casa, al entrar Innmobiliaria:** su **firma** (el dibujo del clímax de su tarjeta de grupo, anclado al grupo 4 «Confianza y quién opera») caería sobre «Privacidad y el panel del equipo» en su export nuevo: se reancla o se retira en su recopia; no es un defecto de la planeadora. **FORMA al gate humano:** el carrusel, el Stack y las portadas · **abrir** `docs/GUIA-DE-PRUEBA.html` v26 → «Mejorado · S26»: k1b, k10, k11, k13, k15f, k17, l6, m6.

### Horas del sprint (`scripts/horas-sprint.mjs`, rango `origin/main..HEAD`, sin el commit que enlaza este PR)

| Commits | Sesiones | Horas activas | Span (primer → último commit)               |
| ------: | -------: | ------------: | ------------------------------------------- |
|      32 |        1 |         3,1 h | 2026-10-28 18:49 → 2026-10-28 21:22 (2,6 h) |

| Fase | Commits | Horas activas |
| ---- | ------: | ------------: |
| F1   |      14 |         1,4 h |
| F2   |      12 |         0,3 h |
| F3   |       6 |         1,3 h |
