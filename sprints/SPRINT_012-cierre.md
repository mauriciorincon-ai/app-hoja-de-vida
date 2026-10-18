---
sprint: 012
app: hoja-de-vida
hito: H-2
opened: 2026-10-18
closed: 2026-10-18
branch: sprint-012/mi-metodo-de-prototipo-a-produccion
pr: https://github.com/mauriciorincon-ai/app-hoja-de-vida/pull/87
---

# Sprint 012 — Cierre ejecutivo · CV Viva · «Mi método», T4 (`de-prototipo-a-produccion`)

| Campo | Valor |
|---|---|
| Nombre · objetivo | «Cómo llevo un prototipo de IA a producción y lo mantengo» (T4) · que `/metodo/de-prototipo-a-produccion` muestre T4 en ES y EN y que el índice del chat deje de depender de una versión de Node que nadie declaraba |
| Resultado · estado | Logrado, **listo para merge**: 10 bloques, mapa de 13 nodos con texto real, 12 fuentes fechadas (2024-02-29 … 2026-10-15), revisión 2026-10-18 y tres voces separadas; el chat la cita al bloque exacto (banco +3/+3, 9/9 de T2–T4 por idioma). Node declarado (`engines`, `.nvmrc`, CI). 1678 unit · 659 e2e chromium/móvil + 1 webkit · typecheck, lint, build y `pnpm audit` limpios · Lighthouse local de T4 0,94/1/0,96/1 |
| Tiempo estimado · real · diferencia | 2 h · 2,2 h (**piso** del script, abajo) · +0,2 h (+10 %). **F1 0,5 frente a 0,25 y F3 1,5 frente a 0,75 pasan el 50 %:** F1 es un solo commit y el script le da 0,5 h de sesión; F3 se fue en medir el banco (2 de 3 filas no entraban al top-4: se ajustó la pieza), un defecto visto en la captura y los pagos de la auditoría. Medida: escribir los títulos de los elementos con las palabras de la pregunta ya en F2. **Investigación de F2, aparte:** 11:51:04 → 11:53:02 en el reloj del sistema (12 fuentes oficiales; la redacción siguió hasta las 12:02) |
| Fases | F1 Node declarado · F2 investigación (solo contenido público; ninguna página traía texto dirigido a agentes) y T4 · F3 banco, e2e, contadores, Lighthouse, capturas, manual, guía v12, auditoría: las tres completas |
| Entregables | `data/metodo/de-prototipo-a-produccion.yaml` · `engines` + `.nvmrc` + `ci.yml` + `tests/unit/node-declarado.test.ts` · banco +3/+3 · e2e del chat y `lighthouse-urls.json` · README, manual (ejemplo de T4, paso de Node, historial) y guía v12 (q9, q10, sin ⭐) · 12 capturas en `sprints/SPRINT_012-capturas/` |
| No completado | Nada de lo planeado. Demos en rojo: 3 del gate de Node (F1), el gate «en curso» acotado (F2: una frase mía sin la marca falla nombrando el campo) y 2 filas del banco sin sus títulos (F3) |
| Desviaciones · causas | El gate «en curso» (`content.test.ts:200-212`) ya no lee el título de una **fuente citada** (`«Study guide for Exam AI-300…»` es de un tercero y no se edita); la frase que la cita sí se lee · **la CI en Node 22.18.0 solo se prueba al abrir el PR** (corre en `pull_request`), y Vercel, con `>=22.18.0`, corre la última mayor (24.x): producción no usa `.nvmrc` · títulos de la fase 4 y del primer elemento de «Lo innovador», y la etiqueta del nodo 12, ajustados para el banco y la captura · `data/a-fondo/**` solo en cifras: 154→157 preguntas, 1.679/1.672→1.724/1.717 fragmentos y once→doce sprints · README tocado (cambió el setup) |
| Decisiones · aprendizajes | La palabra de quien pregunta va en el título de la fase o del elemento que la contesta, no en la fila · el ajuste en Foundry (#86) entra solo como límite del bloque 9, sin nivel; la nota de Foundry apunta a ese bloque, no dice «completa» · una cita de otro (título de una fuente) no es una afirmación del dueño: el gate lo distingue |
| Deuda (lote del hito) | **Medio:** M1 producción en Node 24.x y CI en 22.18.0 (`package.json:6`; opción: `engines` en `22.x`, pide cambiar el gate). **Bajos:** `@types/node ^20` (`package.json:60`) · fila de embeddings del banco 4.ª en ES (`banco-de-preguntas.es.yaml:573`) y la de T4 «¿Cómo lleva…?» 3.ª (`:588`): frágiles al crecer el índice · «por origen» parafrasea la fuente 10 (`de-prototipo-a-produccion.yaml:456`) · `node-declarado` solo lee `ci.yml` y no ordena `checkout` antes de `setup-node` · las fechas de las fuentes 1–8 y 12 no se pudieron releer con el MCP de Learn. Los del S10 y S11 que no se tocaron siguen en sus cierres |
| Recomendación · esfuerzo-beneficio | S13 = T6 (orden T2→T3→T4→T6): títulos con las palabras de la pregunta desde la redacción, y medir las tres filas antes de escribirlas · alto: el mecanismo ya valida lo que se publica |
| Auditoría (4 casillas) | Un auditor independiente (Sonnet 5.5 · alto, solo lectura): **C 0 · A 0 · M 4 · B 5**; contrastó 12 afirmaciones «campo» con sus fuentes y 11 «hice» con el corpus. M2 (la cadena «comparte» más de lo que el corpus dice) y M3 (fuente 8 estirada) pagados · `91f18f2`, junto con M1 (comentario), B1 y B3; M4 (fila de embeddings): remedida, sigue 4.ª en ES y 2.ª en EN. Frases caducadas: ninguna viva; «once sprints» se pagó aquí |
| Modelo por fase · relevos | F1 Sonnet 5.5 · F2 Opus 5.5 · F3 Sonnet 5.5 (auditor Sonnet 5.5): sin desvío (Haiku 5.5 no se usó) · relevos: ninguno |
| `[CONFIRMAR]` para el dueño | (1) AI-103: dices que tienes el curso completo y la ficha dice «llevo 21 módulos»; AI-103 sigue «en curso». ¿Cambio la cifra de módulos o el estado? (2) El ajuste de un modelo en Foundry (#86): ¿fue proyecto real, prototipo o laboratorio del curso? T4 lo dice solo como límite, sin nivel |
| Para mergear | Squash y borrar la rama (y la remota del #85, `sprint-011/mi-metodo-rag-sin-inventar`, que sigue). Después `/cierre-sprint hoja-de-vida` |

### Horas del sprint (`scripts/horas-sprint.mjs`, rango `origin/main..HEAD`, heurística git-hours: huecos ≤ 2 h + 0,5 h por sesión)

| Commits | Sesiones | Horas activas | Span (primer → último commit) |
|---:|---:|---:|---|
| 9 | 1 | 2,2 h | 2026-10-18 11:49 → 2026-10-18 13:34 (1,7 h) |

| Fase | Commits | Horas activas |
|---|---:|---:|
| F1 | 1 | 0,5 h |
| F2 | 2 | 0,2 h |
| F3 | 6 | 1,5 h |
