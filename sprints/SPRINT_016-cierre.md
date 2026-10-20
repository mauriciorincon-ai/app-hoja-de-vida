---
sprint: 016
app: hoja-de-vida
hito: H-2
opened: 2026-10-19
closed: 2026-10-19
branch: sprint-016/metodos-ia-en-la-organizacion
pr: https://github.com/mauriciorincon-ai/app-hoja-de-vida/pull/93
---

# Sprint 016 — Cierre ejecutivo · CV Viva · «Métodos», T1: «Cómo se debe llevar la IA a una organización»

- **Nombre · objetivo:** «Métodos», T1 · la sexta publicación, la segunda que nace impersonal desde su primer commit; además paga los tres bajos del S15.
- **Resultado · estado:** logrado, **listo para merge**. 1770 unit (líneas 90,7 %) · typecheck, lint, build, `pnpm audit` y dependencias sin bajar limpios · e2e completo (861): 825 pasan, 35 omitidas de siempre y **1 falla preexistente** (ver Deuda); tras el pago de la auditoría, chat + Métodos + axe en los tres proyectos: 613 pasan, 0 fallan · Lighthouse local de T1: ES 0,94/1/0,96/1, EN 0,94/1/0,96/1 · índice 1859 ES / 1851 EN. Esfuerzo-beneficio alto: la pieza que abre la serie, citada por el chat en los dos idiomas con el primer texto.
- **Tiempo:** estimado 2,0 h · real 1,9 h (**piso** del script, abajo) · −0,1 h (−5 %); F3 pasó 47 % por arriba (0,75 → 1,1 h: la auditoría y su pago, medir la línea base de una falla ajena y recapturar), sin llegar al 50 %. **Investigación de F2, aparte: ≈ 0,1 h** (20:48→20:55): 12 fuentes de Microsoft Learn con la fecha que cada página publica, ningún texto dirigido a agentes, sin credenciales ni endpoints ajenos; iso.org respondió con un desafío anti-bot y **no se forzó** (la norma se describe desde la página de cumplimiento de Microsoft Learn).
- **Fases:** F1 Sonnet, los tres bajos del S15 y la medida previa (0,5 h est. · 0,5 h) · F2 Opus, T1 investigada y escrita (0,75 h · 0,3 h) · F3 Sonnet, banco, e2e, contadores, docs, capturas, auditoría y cierre (0,75 h · 1,1 h).
- **Entregables:** `data/metodo/ia-en-la-organizacion.yaml` (diez bloques, mapa de 13 nodos, 12 fuentes, 8 evidencias, 7 límites) · banco +3/+3 con demo en rojo (`PESO_METODO` 0,05: 32 rojas, 346 verdes al restaurar) · T1 en el chat e2e y en `lighthouse-urls.json` · manual y guía v16 (q16, q17; sin ⭐; prefijo `s16`) · corpus: 16 sprints y 165 preguntas · 10 capturas ES en `sprints/SPRINT_016-capturas/`.
- **Bajos del S15 pagados:** el `[n]` de las fuentes con su ancho y un e2e que lo vigila (demo en rojo: 10 de 10 piezas fallan sin la clase) · comentario del bloque 9 en las cuatro piezas (objetos parseados idénticos a `main`) · `casa()` empareja `<id>~N` con prueba propia (rojo: nombra «bajo del S15»).
- **Banco (medida previa):** antes de escribir se midieron las tres preguntas y las 162 filas; las tres entraron al top-4 en los dos idiomas **con el primer texto, sin ajustar un título**: ES Q1 1.ª, Q2 2.ª (384 contra 387 de `lo-que-busco`, la más ajustada), Q3 1.ª; EN las tres 1.ª. Ninguna de las 162 salió del top-4, ni tras el pago de la auditoría; la fila vigilada EN «adoption of a dashboard» pasó del 3.º al 4.º puesto con margen 5 (antes 4); el ERP (ES, margen 5) no cambió.
- **No completado · desviaciones · decisiones:** nada del alcance; ninguna desviación. Roadmap de Innmobiliaria: su S10 aún no está en `main` (hoy solo el S9, #33), así que `avaluo-instantaneo` se queda en `data/fichas/inmobiliaria.yaml:63`. Excepciones declaradas del renombre: ninguna nueva (el gate de voz barre las seis piezas sin entradas).
- **Deuda (al lote del hito):** `idioma.spec.ts:89` «a media Perfil» es intermitente y **preexistente** (3 de 10 en el build de `origin/main`, 2 de 10 en la rama, 1 de 861 en la corrida completa; la CI reintenta 2 veces; la HOME no está en el diff) · `ia-en-la-organizacion.yaml:630` «Diez aplicaciones hermanas más CV Viva… 38 piezas» no suma (10+15+7+6 = 38 sin CV Viva; `apps-pipeline` arrastra lo mismo y no se edita aquí) · `:524` «cuesta menos» → «suele costar menos» · `:614` la evidencia del sistema de gestión lleva `nivel: uso-real` y el corpus dice «en estructuración» (taxonomía; el límite 1 ya lo declara) · las demos en rojo viven en cuerpos de commit (e41d758, 4e74c47, 7a28b7c), no en `scripts/demo-rojo.sh`.
- **Aprendizajes:** medir las preguntas antes de escribir dejó los títulos en su primer borrador; los gates miden cifras, no cuantificadores ni modalidad (5 estiradas en la primera redacción de Evidencia: «busca establecer» pasó a «reparte»), y solo la lectura afirmación por afirmación contra el corpus lo vio; lo que NO está en el corpus (construir·comprar·componer, centro de excelencia) se decide antes de redactar y entra como campo o criterio.
- **Auditoría (4 casillas):** independiente (Sonnet 5.5 · alto, solo lectura): **C 0 · A 3 · M 2 · B 5**; alcance completo, cero enlaces limpio, una frase caducada (manual); contrastó 23 afirmaciones de Evidencia (15 sostenidas, 8 estiradas), 14 de «campo» contra sus fuentes (14 sostenidas; 12 fechas y títulos releídos del HTML público) y 229 pares ES/EN. A1 (CTIC: el marco de gobierno y el inventario son lo que la estrategia «busca establecer»), A2 («las primeras», no todas las priorizadas), A3 (la evaluación de impacto la pide la norma), M4 (modalidad puede/debe/procura), M5 (2015–2017 es el empleo, no el ERP) y B6 (manual): `pagado · d1c026d`; B7–B10 al lote.
- **Modelo por fase · relevos:** F1 Sonnet 5.5 · F2 Opus 5.5 · F3 Sonnet 5.5 (auditor Sonnet 5.5, alto): sin desvío; Haiku no se usó · relevos: ninguno.
- **`[CONFIRMAR]` para el dueño:** (1) «construir, comprar o componer» y el centro de excelencia no están en el corpus: entran como estado del campo y criterio; si el dueño los hizo, lo dice y pasan a Evidencia · (2) los cinco Criterios (▲) de T1 son posiciones del autor: q16 de la guía · (3) siguen abiertos los del S15: los cinco Criterios de T7 (q14) y si Vercel construyó con Node 22 (Deployments → el del PR → Build Logs).
- **Para mergear:** squash y borrar la rama; después `/cierre-sprint hoja-de-vida`.

### Horas del sprint (`scripts/horas-sprint.mjs`, rango `origin/main..HEAD`, heurística git-hours: huecos ≤ 2 h + 0,5 h por sesión; sin el commit del cierre)

| Commits | Sesiones | Horas activas | Span (primer → último commit)               |
| ------: | -------: | ------------: | ------------------------------------------- |
|      13 |        1 |         1,9 h | 2026-10-19 20:44 → 2026-10-19 22:07 (1,4 h) |

| Fase | Commits | Horas activas |
| ---- | ------: | ------------: |
| F1   |       3 |         0,5 h |
| F2   |       1 |         0,3 h |
| F3   |       9 |         1,1 h |
