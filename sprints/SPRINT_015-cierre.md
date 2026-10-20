---
sprint: 015
app: hoja-de-vida
hito: H-2
opened: 2026-10-18
closed: 2026-10-18
branch: sprint-015/metodos-bi
pr: https://github.com/mauriciorincon-ai/app-hoja-de-vida/pull/92
---

# Sprint 015 — Cierre ejecutivo · CV Viva · «Métodos», T7: «Cómo se debe diseñar una solución de BI que la gente sí use»

- **Nombre · objetivo:** «Métodos», T7 · la quinta publicación, la primera que nace impersonal; además paga B1/B2 del S14 y saca `abrir-a-compradores` del roadmap de Innmobiliaria (su S9 ya está en `main`).
- **Resultado · estado:** logrado, **listo para merge**. 1758 unit (líneas 90,7 %) · e2e 758 chromium/móvil/webkit + 35 omitidas de siempre (545/545 de chat, Métodos y axe tras la auditoría) · typecheck, lint, build, `pnpm audit` y dependencias sin bajar limpios · Lighthouse local de T7: ES 0,95/1/0,96/1, EN 0,94/1/0,96/1 · índice 1815 ES / 1807 EN. Esfuerzo-beneficio alto: la especialidad con más evidencia del corpus, citada por el chat en los dos idiomas.
- **Tiempo:** estimado 2,5 h · real 1,5 h (**piso** del script, abajo) · −1,0 h (−40 %; el mecanismo ya existía); ninguna fase pasa el 50 % por arriba. **Investigación de F2, aparte: ≈ 0,2 h** (21:50→22:03): 20 fuentes de Microsoft Learn con su `ms.date` (20 de 20 releídas del HTML público), ningún texto dirigido a agentes, sin credenciales ni endpoints ajenos.
- **Fases:** F1 Sonnet, B1/B2 y roadmap (0,5 h est. · 0,5 h) · F2 Opus, T7 investigada y escrita (1 h · 0,4 h) · F3 Sonnet, banco, e2e, docs, capturas, auditoría y cierre (1 h · 0,6 h).
- **Entregables:** `data/metodo/bi-que-se-usa.yaml` (10 bloques, mapa de 13 nodos, 20 fuentes, 9 evidencias, 7 límites) · banco +3/+3 con demo en rojo (`PESO_METODO` 0,05: 26 rojas, 340 verdes al restaurar) · T7 en el chat e2e y en `lighthouse-urls.json` · manual y guía v15 (q14, q15; sin ⭐; prefijo `s15`) · corpus: 15 sprints y 162 preguntas · 9 capturas ES en `sprints/SPRINT_015-capturas/`.
- **No completado · desviaciones · decisiones:** nada del alcance; ninguna desviación del plan. La fila 3 del banco (Constructor) acepta la ficha, `los-tableros` o T7 (decisión del plan): en ES pasa por `los-tableros`. Los M/B de la auditoría se pagaron en el sprint porque M1 rompía «nada se inventa» y el resto era texto de la misma pieza.
- **Banco (medida previa):** antes de escribir se midieron las tres preguntas y las 159 filas; en EN las dos primeras no entraban con el primer borrador y entraron con **dos ajustes** (formas exactas «design»/«measure» en títulos; las palabras de la pregunta en el texto de las decisiones), sin relevo. Hoy ES Q1 3.º (margen 53), Q2 4.º (21); EN Q1 4.º (**11**), Q2 3.º (**4**, la fila más justa: primera a mirar cuando crezca el índice). Ninguna de las 162 salió del top-4.
- **Excepciones declaradas del renombre:** notas del 301 en `proxy.ts:33`, `redireccion.ts:4`, `header.tsx:56`, las dos `page.tsx` de `/metodos`, `metodo.spec.ts:330`, `nav-header.spec.ts:49,87` · `metodo-voz.test.ts:23` (entrada del gate de voz) · CLAUDE.md, historial del manual y la guía, `sprints/` · «infografía» sigue en la capa de la ficha de apps (ADR-016).
- **Deuda (al lote del hito):** `infografia.tsx:397` el `[n]` de las fuentes sin ancho fijo (con ≥ 10 fuentes los títulos de [1]–[9] arrancan antes que los de [10]+) · comentario «9 · Lo que haría distinto…» en `sistema-de-agentes.yaml:584`, `rag-sin-inventar.yaml:618`, `de-prototipo-a-produccion.yaml:603`, `ciclo-de-vida-de-datos.yaml:597` · `evaluar-corpus.mjs:138` `casa()` no empareja `<id>~N` con `<id>` (el primer fragmento de una ficha larga no cuenta como la ficha).
- **Aprendizajes:** medir la pregunta contra el índice antes de escribir fija los títulos; los gates miden cifras, no cuantificadores («un mismo modelo» pasó todos) y solo la lectura afirmación por afirmación lo vio; el MCP de Microsoft Learn no devuelve `ms.date`, la fecha sale del HTML público. **Siguiente:** T1 (orden T1 → T5 → T9 → T8), midiendo sus tres preguntas antes de escribirla.
- **Auditoría (4 casillas):** independiente (Sonnet 5.5 · alto, solo lectura): **C 0 · A 0 · M 2 · B 3**; alcance completo, cero enlaces limpio, frases caducadas limpias; contrastó 36 afirmaciones de Evidencia (35 correctas), 17 de «campo» contra sus fuentes y 234 pares ES/EN sin desajuste. M1 (Vesting «un mismo modelo»), M2 (q14 con 3 de 5 Criterios), B1 («preview»), B2 («sin avisar»), B3 (dos comentarios rancios): `pagado · 0fd96e3, 685548d`.
- **Modelo por fase · relevos:** F1 Sonnet 5.5 · F2 Opus 5.5 · F3 Sonnet 5.5 (auditor Sonnet 5.5, alto): sin desvío; Haiku no se usó · relevos: ninguno.
- **`[CONFIRMAR]` para el dueño:** (1) los cinco Criterios (▲) de T7 son posiciones del autor: q14 de la guía; si alguno no es suyo, se corrige · (2) ¿Vercel construyó con Node 22? (Deployments → el del PR → Build Logs; esperado 22.x; pendiente del S14).
- **Para mergear:** squash y borrar la rama; después `/cierre-sprint hoja-de-vida`.

### Horas del sprint (`scripts/horas-sprint.mjs`, rango `origin/main..HEAD`, heurística git-hours: huecos ≤ 2 h + 0,5 h por sesión; sin el commit del cierre)

| Commits | Sesiones | Horas activas | Span (primer → último commit)               |
| ------: | -------: | ------------: | ------------------------------------------- |
|      13 |        1 |         1,5 h | 2026-10-18 21:49 → 2026-10-18 22:47 (1,0 h) |

| Fase | Commits | Horas activas |
| ---- | ------: | ------------: |
| F1   |       5 |         0,5 h |
| F2   |       2 |         0,4 h |
| F3   |       6 |         0,6 h |
