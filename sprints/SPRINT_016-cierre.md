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
- **Resultado · estado:** (pendiente de las comprobaciones finales)
- **Tiempo:** (pendiente) **Investigación de F2, aparte: ≈ 0,1 h** (20:48→20:55): 12 fuentes de Microsoft Learn con la fecha que cada página publica, ningún texto dirigido a agentes, sin credenciales ni endpoints ajenos; iso.org respondió con un desafío anti-bot y **no se forzó** (la norma se describe desde la página de cumplimiento de Microsoft Learn).
- **Fases:** F1 Sonnet, los tres bajos del S15 y la medida previa · F2 Opus, T1 investigada y escrita · F3 Sonnet, banco, e2e, contadores, docs, capturas, auditoría y cierre.
- **Entregables:** `data/metodo/ia-en-la-organizacion.yaml` (diez bloques, mapa de 13 nodos, 12 fuentes, 8 evidencias, 7 límites) · banco +3/+3 con demo en rojo (`PESO_METODO` 0,05: 32 rojas, 346 verdes al restaurar) · T1 en el chat e2e y en `lighthouse-urls.json` · manual y guía v16 (q16, q17; sin ⭐; prefijo `s16`) · corpus: 16 sprints y 165 preguntas · capturas ES en `sprints/SPRINT_016-capturas/`.
- **Bajos del S15 pagados:** el `[n]` de las fuentes con su ancho y un e2e que lo vigila (demo en rojo: 10 de 10 piezas fallan sin la clase) · comentario del bloque 9 en las cuatro piezas (objetos parseados idénticos a `main`) · `casa()` empareja `<id>~N` con prueba propia (rojo: nombra «bajo del S15»).
- **Banco (medida previa):** antes de escribir se midieron las tres preguntas y las 162 filas; las tres entraron al top-4 en los dos idiomas **con el primer texto, sin ajustar un título**: ES Q1 1.ª, Q2 2.ª (385 contra 387 de `lo-que-busco`, la más ajustada), Q3 1.ª; EN las tres 1.ª. Ninguna de las 162 salió del top-4; la fila vigilada EN «adoption of a dashboard» pasó del 3.º al 4.º puesto con margen 5 (antes 4); el ERP (ES, margen 5) no cambió.
- **No completado · desviaciones · decisiones:** nada del alcance; ninguna desviación. Roadmap de Innmobiliaria: su S10 aún no está en `main` (hoy solo el S9, #33), así que `avaluo-instantaneo` se queda en `data/fichas/inmobiliaria.yaml:63`.
- **Excepciones declaradas:** ninguna nueva (el gate de voz barre las seis piezas sin entradas).
- **Deuda (al lote del hito):** (pendiente de la auditoría)
- **Aprendizajes:** medir las preguntas antes de escribir dejó los títulos en su primer borrador; la lista de lo que NO está en el corpus (construir·comprar·componer, centro de excelencia) se decide antes de redactar y entra como campo o criterio, nunca como evidencia.
- **Auditoría (4 casillas):** (pendiente)
- **Modelo por fase · relevos:** F1 Sonnet 5.5 · F2 Opus 5.5 · F3 Sonnet 5.5 (auditor Sonnet 5.5, alto): sin desvío; Haiku no se usó · relevos: ninguno.
- **`[CONFIRMAR]` para el dueño:** (1) «construir, comprar o componer» y el centro de excelencia no están en el corpus: entran como estado del campo y criterio; si el dueño los hizo, lo dice y pasan a Evidencia · (2) los cinco Criterios (▲) de T1 son posiciones del autor: q16 de la guía · (3) siguen abiertos los del S15: los cinco Criterios de T7 (q14) y si Vercel construyó con Node 22 (Deployments → el del PR → Build Logs).
- **Para mergear:** squash y borrar la rama; después `/cierre-sprint hoja-de-vida`.
