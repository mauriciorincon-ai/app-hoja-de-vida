---
sprint: 025
app: hoja-de-vida
hito: H-2
opened: 2026-10-25
closed: 2026-10-25
branch: sprint-025/sentada-2
pr: https://github.com/mauriciorincon-ai/app-hoja-de-vida/pull/104
---

# Sprint 025 — Cierre ejecutivo · CV Viva · Sentada 2: el CV dice lo que pasó, y Proyectos propios con su caso

- **Resultado:** OM-08 a OM-11, las dos órdenes de contenido (ds S19 e Innmobiliaria S14, ambas ampliadas a media construcción), la fila B de la pasada del 024 y la segunda pasada en vivo, enteros. **Logrado, listo para merge.** 2355 unit (93 archivos, líneas 91,83 %; una primera corrida tras mezclar el #103 falló 7 y no se repitió: dos completas después dieron 2355 de 2355, causa sin confirmar) · typecheck, lint, `pnpm audit` y dependencias (838) limpios · e2e completo tras la mezcla (chromium, móvil y @webkit): 1000 pasan, 35 omitidas, 0 fallan · barrido de frases caducas en 0 con excepciones declaradas · Lighthouse lo mide la CI.
- **Tiempo:** estimado 2,5 h (planeadora: F1 1,0 · F2 0,75 · F3 0,75) · real **2,3 h, piso del script** (abajo; incluye 0,4 h de la mezcla con `main` y su verificación; no cuenta lectura, planeación ni la espera de la pasada en vivo) · diferencia −0,2 h.
- **Entregables:** F1 exports de ds e Innmobiliaria copiados con `cmp` (ambos roadmaps quedan `[]`) · OM-08 (CTIC «unas ya priorizadas», planes de mejora, Ceinfes, Vesting) · OM-09 (Pichincha «fuga y mora», prosa del riesgo fuera) · OM-10 (Cafam «herramientas VBA que complementaban el WMS»), todo por sustitución exacta con la cuenta asertada · F2 caso `apps-pipeline` con la excepción del gate «cifras en los logros» solo para `tipo: proyectos-propios` · PDF de tres hojas (la tercera abre con Proyectos propios entero) · F3 regla 5 del prompt contra motivos atribuidos y su marcador · alias de privacidad en inglés y de la salida de Vesting · banco en 176 · título de Vesting y frases del propio chat · guía v25 (doce filas «Mejorado · S25») y manual. Capturas: `muestras/2026-10-25-sentada-2-s25/` (local). **Demos en rojo:** excepción del gate ensanchada y quitada · generador del PDF devuelto a «solo descripción» · prompt sin la regla 5 · alias de privacidad y de Vesting quitados y el negativo scikit-learn · fila de privacidad sin su declaración (`cce8681`) · guía v25. Todas: rojo nombrando y verde al restaurar.
- **Pasada en vivo** (Groq Free · `openai/gpt-oss-120b`, con el «sí» del dueño): 22 preguntas ES+EN, 16 al modelo y 6 sin él; 23 654 tokens de entrada y 8 010 de salida (≈ US$0); 345 s. **Voz del dueño 0 · motivos 0 (salida de Vesting en ES y EN) · AI-102 y DP-100 sin narrar · «¿qué estudió?» cita Estudios.** 22 de 23 en verde: el único «defecto» era un falso positivo del marcador de ausencia en «What data do you keep about me?» (marcó «does not | cannot», frases que la fuente escribe: «What is not stored: no IP address…»); esa pregunta, que en el 024 se rehusaba, ahora contesta con la sección correcta; la fila ya no lo cuenta (`cce8681`, con su prueba). **Para leer:** «¿Por qué salió de Vesting?» (ES y EN) devolvió el rehúso fijo y no la narración de cómo cerró la etapa, aunque la sección llegó de primera (sonda local): el motivo inventado desapareció, la respuesta útil no apareció. Informe: `privado/pasada-en-vivo-s25.md`.
- **Desviaciones:** (1) el plan se hizo con Sonnet 5.5, no con Fable · (2) la auditoría corrió antes del STOP, para que la pasada midiera el código final · (3) las dos órdenes se ampliaron durante la construcción (Innmobiliaria 18:50, ds 18:56): se aplicaron en `b923a17` y la guía cuenta siete apps con roadmap, no nueve · (4) el alias de la salida de Vesting no estaba en la orden: lo exigió el título nuevo (sin él, «Why did he leave Vesting?» caía al puesto 9) · (5) «175 de afuera» también estaba en `apps-pipeline.*:323` · (6) el título de «Métodos» de Cafam cambió (decía «integraciones en VBA»), igual que `de-proceso-a-operacion.yaml:597-598` y el corte de `analitica-predictiva.*:43/:51` (auditoría M3) · (7) los minutos de R3, R4 y R6 no suben: la sentada 1 está en su techo de 45 min · (8) el `chmod 600 .env.local` no se corrió: el «sí» fue solo a la pasada · (9) el #103 de dependabot se mergeó antes de abrir el PR (regla 18) y `main` se trajo a la rama.
- **Deuda (al lote del H-3):** B5 `tests/unit/guia-revision.test.ts` y `scripts/generate-cv-pdf.mjs` no pasan `prettier --check` desde antes del sprint (sus diffs se mantuvieron mínimos) · B6 `.env.local` en modo 644 con la clave de Groq (proponer `chmod 600`).
- **Aprendizajes:** releer las órdenes (fecha de modificación) antes de cada commit y antes del cierre: dos se ampliaron mientras construía · un marcador de lectura es un piso y debe probarse con frases reales Y con la fuente: el de ausencia marcó lo que la fuente misma escribe · una regla negativa («no atribuyas motivos») empuja al modelo al rehúso, no a la narración. **Esfuerzo-beneficio:** alto: cuatro órdenes de la revisión y dos de contenido en un PR, a 2,3 h.
- **Auditoría (4 casillas):** independiente (Sonnet 5.5 · alto, solo lectura, con el diff): **C 0 · A 1 · M 4 · B 7**; seguridad: `pnpm audit` y gitleaks limpios (B6 anotado). Pagados: A1 `b923a17` y `915c12c` · M1 M2 B3 B4 `bb49dd5` · M3 B1 B7 `967626b` · M4 B2 `915c12c`. Al lote: B5 B6.
- **Modelo por fase · relevos:** F1, F2 y F3 con Sonnet 5.5 (auditor Sonnet 5.5): sin desvío; Haiku no se usó · **relevos: ninguno pedido** · **Siguiente:** lo planea primero la planeadora · **Para mergear:** squash y borrar la rama; después `/cierre-sprint hoja-de-vida`.

## Para la revisión (lo que hace el dueño)

- **Decidir:** si «¿Por qué salió de Vesting?» debe contar cómo cerró la etapa en vez del rehúso (una regla de prompt más y otra pasada, ≈ 6 min y US$0) o se queda así.
- **Líneas del dueño que no toqué** (la regla no cabe sin redactar o el sujeto es otro): `origenes.es.md:370` y `origenes.en.md:849` («planes de mejora que diseñé») · el verbo «integrar» sobre el WMS en `cafam.*:136`, `bi-que-se-adopta.es.md:254` / `.en.md:521`, `como-trabajo.*:299`, `origenes.es.md:296` / `.en.md:664` (el chat seguirá diciendo que el VBA «integró» el WMS) · `fundacion-ctic.es.md:160, 290, 293` y `.en.md:329, 602` («unas pocas») · la tabla de las seis apps de `apps-pipeline.*:134`, `como-aprendo` y `plataforma-y-despliegue` (foto con fecha ya atrasada).
- **FORMA al gate humano:** la tercera hoja del PDF, el enlace «caso» nuevo en la HOME y la página `/proyectos/apps-pipeline` · **abrir** `docs/GUIA-DE-PRUEBA.html` v25 → «Mejorado · S25»: R3, R4, R6, c2, c3, a10, d1, d3, g1d, o1, q20, q22.

### Horas del sprint (`scripts/horas-sprint.mjs`, rango `origin/main..HEAD`, sin el commit que enlaza este PR)

| Commits | Sesiones | Horas activas | Span (primer → último commit)               |
| ------: | -------: | ------------: | ------------------------------------------- |
|      22 |        1 |         2,3 h | 2026-10-25 18:41 → 2026-10-25 20:29 (1,8 h) |

| Fase     | Commits | Horas activas |
| -------- | ------: | ------------: |
| F1       |       6 |         0,6 h |
| F2       |       4 |         0,1 h |
| F3       |      11 |         1,2 h |
| sin fase |       1 |         0,4 h |
