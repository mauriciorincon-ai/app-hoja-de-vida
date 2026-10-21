---
sprint: 017
app: hoja-de-vida
hito: H-2
opened: 2026-10-20
closed: 2026-10-20
branch: sprint-017/metodos-gobierno
pr: https://github.com/mauriciorincon-ai/app-hoja-de-vida/pull/94
---

# Sprint 017 — Cierre ejecutivo · CV Viva · «Métodos», T5: «Cómo se deben gobernar la IA y los datos»

- **Nombre · objetivo:** «Métodos», T5 · la séptima publicación, la tercera que nace impersonal desde su primer commit; además un quinto nivel de evidencia («En construcción») y el aviso de `vite` que tenía roja la CI de `main`.
- **Resultado · estado:** logrado, **listo para merge**. 1794 unit (líneas 90,8 %) · typecheck, lint, build, `pnpm audit` (limpio: era lo que fallaba en `main`) y dependencias sin bajar limpios · e2e completo (909): 874 pasan, 35 omitidas de siempre, 0 fallan; tras el pago de la auditoría, Métodos + axe + chat + movimiento reducido: 667 pasan, 0 fallan · Lighthouse local de T5: ES 0,94/1/0,96/1, EN 0,94/1/0,96/1 (presupuesto y categorías en verde) · índice 1903 ES / 1895 EN (T5 = 44 fragmentos).
- **Tiempo:** estimado 2,5 h · real 1,5 h (**piso** del script, abajo) · −1,0 h (−40 %); ninguna fase pasó del 50 %. **Investigación de F2, aparte: ≈ 0,1 h** (19:48:54→19:53:36): 13 fuentes (Comisión Europea, NIST, IEC, OWASP, DNP, SIC y cinco de Microsoft Learn con su `ms.date`), solo contenido público, ningún texto dirigido a agentes; hallazgos: iso.org no se leyó (desafío anti-bot en el S16, no se forzó: las normas 42005 y 23894 salen de la ficha de la IEC) y la circular de la SIC es un PDF escaneado (solo título y fecha).
- **Fases:** F1 Sonnet, `vite`, roadmap, nivel nuevo con su gate y T1 (0,75 h est. · 0,6 h) · F2 Opus, T5 investigada y escrita (1,0 h · 0,6 h) · F3 Sonnet, banco, e2e, contadores, docs, capturas, auditoría y cierre (0,75 h · 0,4 h).
- **Entregables:** `data/metodo/gobierno-de-ia-y-datos.yaml` (diez bloques, mapa de 13 nodos, 13 fuentes, 7 evidencias, 7 límites) · nivel `en-construccion` (esquema, chip `peach` 6,23:1, ES/EN) con el gate `metodo-nivel-en-construccion` · `vite` directa `^8.3.4` (c3bb0e6) · T1: `:614` al nivel nuevo, `:524` «suele costar menos», `:630` «38 piezas, sin contar este sitio» · `avaluo-instantaneo` fuera del roadmap de Innmobiliaria (su S10 es #35) · banco +4/+4 · T5 en el chat e2e y en `lighthouse-urls.json` · manual y guía v17 (q18, q19; sin ⭐; prefijo `s17`) · corpus: 17 sprints, 169 preguntas, 1.903/1.895 fragmentos · 10 capturas ES en `sprints/SPRINT_017-capturas/`.
- **Banco (medida):** antes (índice 1859/1851, 165 filas) la pregunta del sistema de gestión pedía > 318 ES / > 292 EN contra un 4.º de 159/146; tras tres ajustes de título quedó 5.ª y el dueño decidió exigir T5 en la de **impacto**. Después (1903/1895, 169 filas): impacto ES 1.ª (135 contra 79 del 4.º), EN 3.ª (167 contra 154); ISO, sistema de gestión y Ley 1581 pasan por su casa; **0 de 169 fuera del top-4**; las vigiladas no se movieron («¿Ha trabajado en un banco?» margen 0; certificaciones 4).
- **Demos en rojo (archivo · mutación · a quién nombró):** `data/metodo/ia-en-la-organizacion.yaml` · `nivel: en-construccion`→`uso-real` · «ia-en-la-organizacion.yaml: bloque 8, evidencia 2», 14 verdes al restaurar (0d5afc7) · `scripts/metodo-al-indice.mjs` · `PESO_METODO` 0,5→0,05 · 34 rojas, entre ellas la fila de impacto ES y su gemela EN, 354 verdes al restaurar (9c75844).
- **No completado · desviaciones:** nada del alcance. (1) La fila que exige T5 es la de impacto, no la del sistema de gestión: el banco suma +4/+4 (no +3/+3) y los contadores van a 169 (no 168) · (2) el gate de nivel vive en archivo propio (test + motor), no dentro de `ctic-aproximadas` · (3) `vite` se declaró directa en vez de override · (4) se pagaron en el sprint M y B del texto nuevo (la regla manda M/B al lote; como en el S16).
- **Deuda (al lote del hito):** `gobierno-de-ia-y-datos.yaml:507` el bloque 5 no menciona la prohibición 9 que la Comisión pone en diciembre de 2026 · `:616` el Experto ISO 42001 va «Uso real» y su ficha dice «inicial v1.0.0» (igual que T2) · `:503` «ayuda a identificar los riesgos propios» no lo confirma la página del NIST 600-1 · `idioma.spec.ts:89` intermitente y preexistente (0 de 874 esta vez) · aviso `configLoader` de vitest con vite 8.3 (`vitest.config.ts:1`) · siguen abiertos B7–B10 del S16.
- **Aprendizajes:** un par autoinstalado (`(vite@x)` en el lockfile) no se mueve con `pnpm update` ni con override: se declara directo · la forma exacta de la palabra manda en la búsqueda léxica y una fila que su casa natural contesta en primera persona no se gana con peso 0,5: se mide antes y se decide qué fila exige la pieza · leer la fuente viva halló lo que el borrador omitía (el AI Act aplicable en general desde el 2 de agosto de 2026).
- **Auditoría (4 casillas):** independiente (Sonnet 5.5 · alto, solo lectura): **C 0 · A 0 · M 3 · B 8**; alcance completo con las desviaciones de arriba; cero enlaces limpio; una frase caducada (rango de fechas del manual); contrastó 23 de 23 frases de Evidencia, 14 de 14 de «campo», 7 de 7 niveles y 6 Criterios sin opinión disfrazada (no verificó el contenido de la circular de la SIC). M1–M3 y 3 B: `pagado · efb5253`; 2 B resueltos (el cierre; un comentario del banco, medido) y 3 B a la deuda.
- **Modelo por fase · relevos:** F1 Sonnet 5.5 (el arreglo de `vite`, en Opus 5.5) · F2 Opus 5.5 · F3 Sonnet 5.5 (auditor Sonnet 5.5, alto): sin desvío; Haiku no se usó · **relevos: 2** — `vite` Sonnet→Opus (cuatro intentos por el mismo camino; era un par autoinstalado) y la fila del sistema de gestión en Opus (tres ajustes sin entrar): decidió el dueño.
- **`[CONFIRMAR]` para el dueño:** (1) los seis Criterios (▲) de T5 son posiciones del autor: q18 de la guía · (2) el Experto ISO 42001 va «Uso real» en la tarjeta y su ficha dice «inicial v1.0.0»: ¿se deja o se rotula versión inicial? · (3) siguen abiertos los Criterios de T7 (q14) y de T1 (q16) y si Vercel construyó con Node 22.
- **Para mergear:** squash y borrar la rama; después `/cierre-sprint hoja-de-vida`.

### Horas del sprint (`scripts/horas-sprint.mjs`, rango `origin/main..HEAD`, heurística git-hours: huecos ≤ 2 h + 0,5 h por sesión; sin el commit del cierre)

| Commits | Sesiones | Horas activas | Span (primer → último commit)               |
| ------: | -------: | ------------: | ------------------------------------------- |
|       9 |        1 |         1,5 h | 2026-10-20 19:41 → 2026-10-20 20:42 (1,0 h) |

| Fase | Commits | Horas activas |
| ---- | ------: | ------------: |
| F1   |       3 |         0,6 h |
| F2   |       1 |         0,6 h |
| F3   |       5 |         0,4 h |
