---
sprint: 019
app: hoja-de-vida
hito: H-2
opened: 2026-10-21
closed: 2026-10-22
branch: sprint-019/metodos-modelos
pr: https://github.com/mauriciorincon-ai/app-hoja-de-vida/pull/96
---

# Sprint 019 — Cierre ejecutivo · CV Viva · «Métodos», T8: «Cómo se debe decidir con modelos», y la puerta en la HOME

- **Nombre · objetivo:** «Métodos», T8 · la novena y última publicación (la serie queda completa), la quinta que nace impersonal desde su primer commit; la puerta a «Métodos» en la HOME; y la deuda corta del S18.
- **Resultado · estado:** logrado, **listo para merge**. 1821 unit (líneas 90,76 %) · typecheck, lint, build, `pnpm audit` (limpio) y dependencias sin bajar limpios · e2e completo (1007): 972 pasan, 35 omitidas de siempre, 0 fallan · Lighthouse local: T8 ES y EN 0,94/1/0,96/1, HOME ES y EN 0,95/1/0,96/1 (igual que antes de la puerta) · índice 1988 ES / 1978 EN (T8 = 43 / 42 fragmentos).
- **Tiempo:** estimado 2,5 h · real 1,9 h (**piso** del script, abajo) · −0,6 h (−24 %); ninguna fase pasó del 50 %. **Investigación de F2, aparte: ≈ 0,03 h** (21:59:47→22:01:17): 10 fuentes (6 de Microsoft Learn con su `ms.date` y 4 de arXiv), solo contenido público, ningún texto dirigido a agentes; el glosario de Gartner respondió 403 y no se forzó (la inteligencia de decisiones quedó fuera).
- **Fases:** F1 Sonnet, deuda del S18 y puerta de la HOME (0,75 h est. · 0,6 h) · F2 Opus, T8 investigada y escrita (1,0 h · 0,5 h) · F3 Sonnet, banco, e2e, contadores, docs, capturas, auditoría y cierre (0,75 h · 0,8 h).
- **Entregables:** `data/metodo/decidir-con-modelos.yaml` (diez bloques, mapa de 14 nodos, 5 fases, 7 decisiones, 7 evidencias —Probeta DS `prototipo`, enlazada a `/vitrina/apps/ds`—, 7 límites, 10 fuentes) · `src/components/home/metodos.tsx` (la puerta entre la Vitrina y los Estudios, medida de `data/metodo/`, sin total escrito) · `destinos.mjs` nombra `#metodos` · deuda del S18: título del bloque 5 de T9 y `vitest.config.mts` en el skill · banco +3/+3 · T8 en el chat e2e y en `lighthouse-urls.json` · manual y guía v19 (q22, q23, q24 ⭐; Gate mínimo ⭐ 49; prefijo `s19`) · corpus: 19 sprints, 175 preguntas, «nueve» piezas · 14 capturas ES en `sprints/SPRINT_019-capturas/`.
- **Banco (medida):** antes (índice 1945/1936, 172 filas) optimización pedía raw > 80 ES / > 86 EN y Probeta DS > 34 / > 38 (modelos a producción > 266 / > 246: imposible, acepta casa). Después (1988/1978, 175 filas): optimización 1.ª en ES (110 contra 48 del 4.º) y EN (77 contra 53); Probeta DS 1.ª en ES (52 contra 19) y EN (33 contra 19), sin ajustar un título (los dos ajustes no se gastaron); modelos a producción: las casas 1.ª y 2.ª, T8 en el puesto 59 ES / 32 EN (no exigida); **0 de 172 fuera del top-4**; T8 solo entra al top-4 de «¿Sabe de MLOps?» (margen 10→9); márgenes ≤ 5: ES 12→11, EN 12.
- **Demos en rojo (archivo · mutación · a quién nombró):** puerta: `metodos.tsx` · `piezas.map`→`piezas.slice(1).map` · «la puerta no nombra: ia-en-la-organizacion», 4 rojas, 9 verdes (e6dc4dd) · banco: `scripts/metodo-al-indice.mjs` · `PESO_METODO` 0,5→0,05 · 41 rojas de 366 nombrando las dos filas exigidas en ES y sus gemelas EN, 366 verdes (2abe3f2) · «ningún total»: `messages/es.json` · `puertaIr`→«Ver las nueve publicaciones» · 2 rojas de 9 nombrando `metodo.puertaIr (es)`, 9 verdes (d9761e7).
- **No completado · desviaciones:** nada del alcance. (1) El G-Plan lo decidió el dueño en el chat: el archivo dice `gplan: pendiente` y su bitácora no trae las decisiones; la salida «cae a T8 o su casa» no hizo falta · (2) `scripts/destinos.mjs` nombra `#metodos` (sin nombre el catálogo fallaba) · (3) `documentos-cuentas`: el patrón de «Limitaciones» pasó a `las (\S+) piezas de la serie están publicadas` porque «hasta ahora» salió del manual · (4) `chat-index-builder.test.ts` tiene un tope propio de 30 s (pasaba de 5 s con la suite en paralelo) · (5) `cm-operaciones` entró al corpus de T8 y no está en las dependencias del archivo · (6) el nivel de los convoyes bajó a «Prototipo» tras la auditoría · (7) se pagaron en el sprint M1 y B1–B3.
- **Deuda (al lote del hito):** `idioma.spec.ts:89` y `vitrina.spec.ts:1271` intermitentes de siempre (esta vez 0) · márgenes ≤ 5 del banco («¿Ha trabajado en un banco?» 0, certificaciones 4) · `analitica-predictiva.es.md:261` dice 33 funcionalidades de Probeta DS y su ficha hoy 41 (la pieza no cita ninguna) · siguen abiertos B7–B10 del S16.
- **Aprendizajes:** medir un borrador antes de fijar los títulos hizo entrar las dos filas exigidas sin ajustes (S18 igual; S17: tres ajustes y un relevo) · una frase de la guía que enumera las secciones de la HOME (a2) caducó con la puerta: se busca también por enumeraciones, no solo por promesa aplazada · un gate «ningún total» que solo corre en verde no es un gate: se le puso su rojo (B3).
- **Auditoría (4 casillas):** independiente (Sonnet 5.5 · alto, solo lectura, sin correr pruebas): **C 0 · A 0 · M 2 · B 3**; alcance completo; calidad y seguridad conformes (cero enlaces y secretos limpios); contrastó cada nota de Evidencia con su documento, las 6 notas de campo con su página de Learn y los niveles; no pudo releer los 4 trabajos de arXiv (leídos en F2). M1 (guía a2) y B1–B3: `pagado · d9761e7`; M2 era este cierre.
- **Modelo por fase · relevos:** F1 Sonnet 5.5 · F2 Opus 5.5 · F3 Sonnet 5.5 (auditor Sonnet 5.5, alto): sin desvío; Haiku no se usó · **relevos: ninguno**.
- **`[CONFIRMAR]` para el dueño:** (1) Probeta DS va «Prototipo» (su ficha está en estado inicial y la vitrina la ofrece con lista de espera) y 33 contra 41 funcionalidades · (2) MLflow, los modelos fundacionales de series de tiempo y los asistentes de formulación con LLM no tienen caso en ningún documento a fondo: solo estado del campo · (3) el nivel de los convoyes («Prototipo» tras la auditoría; antes «Uso real») · (4) los Criterios (▲) de T8 son posiciones del autor: q22 de la guía · (5) la mirada del dueño sobre la puerta de la HOME: q24 ⭐ · (6) los del S17 siguen aplazados al gate del hito, por decisión del dueño.
- **Siguiente:** S20, cierre del H-2 (lote de medios y bajos, BLUEPRINT, `design-sync`). **Esfuerzo-beneficio:** alto: la serie queda completa y la HOME la muestra sin un total escrito.
- **Para mergear:** squash y borrar la rama; después `/cierre-sprint hoja-de-vida`.

### Horas del sprint (`scripts/horas-sprint.mjs`, rango `origin/main..HEAD`, heurística git-hours: huecos ≤ 2 h + 0,5 h por sesión; sin el commit del cierre)

| Commits | Sesiones | Horas activas | Span (primer → último commit)               |
| ------: | -------: | ------------: | ------------------------------------------- |
|      13 |        2 |         1,9 h | 2026-10-21 21:46 → 2026-10-22 05:59 (8,2 h) |

| Fase | Commits | Horas activas |
| ---- | ------: | ------------: |
| F1   |       4 |         0,6 h |
| F2   |       2 |         0,5 h |
| F3   |       7 |         0,8 h |
