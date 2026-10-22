---
sprint: 018
app: hoja-de-vida
hito: H-2
opened: 2026-10-21
closed: 2026-10-21
branch: sprint-018/metodos-procesos
pr: https://github.com/mauriciorincon-ai/app-hoja-de-vida/pull/95
---

# Sprint 018 — Cierre ejecutivo · CV Viva · «Métodos», T9: «Cómo se debe convertir un proceso en una operación inteligente»

- **Nombre · objetivo:** «Métodos», T9 · la octava publicación, la cuarta que nace impersonal desde su primer commit; además la deuda corta del S17 (Experto ISO 42001, dos frases de T5, el aviso de `vitest`).
- **Resultado · estado:** logrado, **listo para merge**. 1802 unit (líneas 90,76 %) · typecheck, lint, build, `pnpm audit` (limpio) y dependencias sin bajar limpios · e2e completo (957): 921 pasan, 35 omitidas de siempre, 1 intermitente ajena de la vitrina; tras pagar la auditoría, Métodos + axe + chat + movimiento reducido: 715 pasan, 0 fallan · Lighthouse local de T9: ES 0,94/1/0,96/1, EN 0,94/1/0,96/1 · índice 1945 ES / 1936 EN (T9 = 42 / 41 fragmentos).
- **Tiempo:** estimado 2,25 h · real 1,6 h (**piso** del script, abajo) · −0,65 h (−29 %); ninguna fase pasó del 50 %. **Investigación de F2, aparte: ≈ 0,1 h** (19:36:57→19:40:56): 11 fuentes (IEC, arXiv y nueve de Microsoft Learn con su `ms.date`), solo contenido público, ningún texto dirigido a agentes; hallazgos: OCEL no publica fecha (se cita su especificación en arXiv), la OMG solo dice «enero de 2014» (se cita ISO/IEC 19510 en la IEC, 2013-07-15) e iso.org no se leyó (anti-bot del S16, no se forzó).
- **Fases:** F1 Sonnet, deuda del S17 (0,5 h est. · 0,5 h) · F2 Opus, T9 investigada y escrita (1,0 h · 0,4 h) · F3 Sonnet, banco, e2e, contadores, docs, capturas, auditoría y cierre (0,75 h · 0,6 h).
- **Entregables:** `data/metodo/de-proceso-a-operacion.yaml` (diez bloques, mapa de 14 nodos con la escalera de automatización, 11 fuentes, 8 evidencias —FORJA `prototipo`, enlazada a T2—, 7 límites, 7 Criterios) · decisión 1b: «versión inicial (v1.0.0)» en `sistema-de-agentes.yaml:557` y `gobierno-de-ia-y-datos.yaml:616`, sin subir el nivel · T5: NIST 600-1 y prohibición 9 · `vitest.config.mts` · `vitest` 4.1.12 (dos avisos moderados de `@vitest/mocker`) · banco +3/+3 · T9 en el chat e2e y en `lighthouse-urls.json` · manual y guía v18 (q20, q21; sin ⭐; prefijo `s18`) · corpus: 18 sprints, 172 preguntas, 1.945/1.936 fragmentos, «ocho» piezas · 10 capturas ES en `sprints/SPRINT_018-capturas/`.
- **Banco (medida):** antes (índice 1903/1895, 169 filas) la fila exigida («qué automatizar») pedía raw > 52 ES / > 82 EN contra un 4.º de 26 / 41. Después (1945/1936, 172 filas): T9 1.ª en ES (96 contra 38) y EN (97 contra 44), sin ajustar un título tras medir el borrador; BPMN→orquestación 1.ª ES / 3.ª EN (acepta T2 o T9) y empresas 2.ª ES / 4.ª EN (acepta T9 o su casa); **0 de 172 fuera del top-4**, T9 en el top-4 de ninguna otra fila; las vigiladas dentro de su margen («¿Ha trabajado en un banco?» 0, certificaciones 4).
- **Demo en rojo (archivo · mutación · a quién nombró):** `scripts/metodo-al-indice.mjs` · `PESO_METODO` 0,5→0,05 · 37 rojas en los dos bancos, nombrando la fila exigida en ES y su gemela EN, 360 verdes al restaurar (c133447); F1 no trajo gate nuevo.
- **No completado · desviaciones:** nada del alcance. (1) El G-Plan lo decidió el dueño en el chat (el archivo del sprint solo traía la 1b): solo «qué automatizar» exige T9; la salida «cae a T9 o su casa» no hizo falta · (2) `vitest.config.mts` usa `import.meta.url`, no `import.meta.dirname` (Vite empaqueta el archivo) · (3) `vitest` 4.1.12 no estaba planeado: dos avisos moderados nuevos, la CI exige `high` y estaba verde, pero no se dejan avisos abiertos · (4) se pagaron en el sprint el Alto y M/B del texto nuevo (como en el S16/S17) · (5) el archivo del sprint dice que el proceso core de once etapas vive solo en `agentes-en-produccion`: `vesting` también lo trae.
- **Deuda (al lote del hito):** `vitrina.spec.ts:1271` intermitente y ajena (1 de 921 en la corrida completa, 1 de 10 aislada; el sprint no toca `src/`) · `idioma.spec.ts:89` intermitente (esta vez 0) · `.claude/skills/testing-patterns.md:203` aún dice `vitest.config.ts` · `de-proceso-a-operacion.yaml:511` el título «se diseña para fallar bien» es un giro del autor sobre una lista que HEAT declara no exhaustiva · `banco-de-preguntas.en.yaml:571` la fila de empresas deja a T9 4.ª: vigilarla cuando crezca el índice · siguen abiertos B7–B10 del S16.
- **Aprendizajes:** en una nota de «campo» se contrasta el sujeto y el verbo, no solo el hecho («Power Automate construye» el registro cuando la página dice que lo ingiere) · una evidencia exacta puede no sostener la decisión que respalda (la de Ceinfes y «línea base»): ningún gate lo ve · medir un borrador antes de fijar los títulos hizo entrar la fila exigida sin ajustes (S17: tres ajustes y un relevo).
- **Auditoría (4 casillas):** independiente (Sonnet 5.5 · alto, solo lectura; verificación estática: no pudo correr pruebas): **C 0 · A 1 · M 3 · B 7**; alcance completo; calidad y seguridad conformes (14 de 14 nodos en aristas, 216 pares ES/EN, cero enlaces limpio); frases caducadas: 0 por el sprint; contrastó 22 de 22 frases de Evidencia, 11 de 11 notas de campo contra su página (el editor de la fuente 2 no se pudo confirmar), 8 de 8 niveles y 7 de 7 Criterios. A1 (el sujeto de una frase de «campo») y M1–M3, B1–B3, B6: `pagado · ee9e716`; B4 y B5 a la deuda; B7 es la desviación 2.
- **Modelo por fase · relevos:** F1 Sonnet 5.5 · F2 Opus 5.5 · F3 Sonnet 5.5 (auditor Sonnet 5.5, alto): sin desvío; Haiku no se usó · **relevos: ninguno**.
- **`[CONFIRMAR]` para el dueño:** (1) RPA, Power Automate, Power Apps y Copilot Studio no tienen caso en ningún documento a fondo (solo figuran como habilidades en `cv.es.yaml`): la pieza los trata como estado del campo y límite · (2) la minería de procesos queda como un método que se aplicaría, no un caso corrido (lo más cercano, Vesting) · (3) los siete Criterios (▲) de T9 son posiciones del autor: q20 de la guía · (4) los del S17 siguen aplazados al gate del hito, por decisión del dueño.
- **Siguiente:** T8 (S19), el teaser en la HOME y el cierre del hito. **Esfuerzo-beneficio:** alto, la pieza responde la fila que ningún documento contestaba y la deuda del S17 quedó pagada.
- **Para mergear:** squash y borrar la rama; después `/cierre-sprint hoja-de-vida`.

### Horas del sprint (`scripts/horas-sprint.mjs`, rango `origin/main..HEAD`, heurística git-hours: huecos ≤ 2 h + 0,5 h por sesión; sin el commit del cierre)

| Commits | Sesiones | Horas activas | Span (primer → último commit)               |
| ------: | -------: | ------------: | ------------------------------------------- |
|      12 |        1 |         1,6 h | 2026-10-21 19:28 → 2026-10-21 20:32 (1,1 h) |

| Fase | Commits | Horas activas |
| ---- | ------: | ------------: |
| F1   |       3 |         0,5 h |
| F2   |       1 |         0,4 h |
| F3   |       8 |         0,6 h |
