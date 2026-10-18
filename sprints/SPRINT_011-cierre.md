---
sprint: 011
app: hoja-de-vida
hito: H-2
opened: 2026-10-18
closed: 2026-10-18
branch: sprint-011/mi-metodo-rag-sin-inventar
pr: https://github.com/mauriciorincon-ai/app-hoja-de-vida/pull/85
---

# Sprint 011 — Cierre ejecutivo · CV Viva · «Mi método», T3 (`rag-sin-inventar`)

| Campo | Valor |
|---|---|
| Nombre · objetivo | «Cómo hago que un LLM responda con los datos de la empresa y no invente» (T3) · que `/metodo/rag-sin-inventar` muestre T3 completa en ES y EN y que el mecanismo del S10 quede blindado antes de sumar piezas |
| Resultado · estado | Logrado, **listo para merge**: 10 bloques, mapa de 12 nodos con texto real, 14 fuentes fechadas (2024-09-19 … 2026-09-16), revisión 2026-10-18 y tres voces separadas; el chat la cita al bloque exacto (banco 324/324). Los 6 medios del S10 que tocaban el mecanismo, pagados con su demo en rojo. 1664 unit (cobertura 88,96 %) · 615 e2e + 1 webkit · typecheck, lint, build y `pnpm audit` limpios; Lighthouse local de T3 0,94/1/0,96/1 |
| Tiempo estimado · real · diferencia | 4 h · ≥ 1,5 h (**piso** del script, abajo: no ve la lectura ni la investigación) · ≤ −2,5 h · F1 1,25/0,5 · F2 1,75/0,7 · F3 1/≈0,3: ninguna pasó el 50 %. **Investigación de F2, aparte:** 08:53 → 08:57 de reloj (14 fuentes oficiales; la redacción siguió hasta las 09:10) |
| Fases | F1 mecanismo (índice por Zod, evidencia → catálogo, corpus aprobado, cifras citadas, CTIC, coherencia, totales medidos) · F2 investigación (solo contenido público; un resultado de LangSmith traía texto dirigido a agentes: ignorado y anotado) y T3 · F3 banco, e2e, contadores, Lighthouse, capturas, manual, guía v11: las tres completas |
| Entregables | `data/metodo/rag-sin-inventar.yaml` · `src/lib/metodo/corpus.ts` · `scripts/metodo-cifras.mjs` · `problemasDeEvidencia` · `sin_contexto_desde` y `piezas-metodo` en el motor de cifras · banco +3/+3 · e2e del chat para cada pieza · `lighthouse-urls.json` · manual y guía v11 (q7 ⭐, q8) · 12 capturas en `sprints/SPRINT_011-capturas/` |
| No completado | Nada de lo planeado. 12 demos en rojo (11 de F1, nombradas en los commits, y la de las tarjetas de la lista) y 6 filas del banco rojas sin la pieza |
| Desviaciones · causas | El test de enlaces de evidencia vive en `metodo-al-indice.test.ts` · el 1.467 de historia se salva con una salvedad por frase, no con un `hito` (eximía también el «hoy») · las 3 frases de conteo del manual y la guía pasaron de F3 a F2: su gate las exige con la pieza · **arreglo de una línea en `metodo/page.tsx:89`** (tarjetas desiguales, 214 frente a 243 px) con guardia e2e · M1 y M4 de la auditoría pagados aquí: son de mi pieza · `data/a-fondo/**` (vetado) solo en cifras: 151→154 preguntas, 1.633/1.626→1.677/1.670 fragmentos y diez→once sprints, 4 docs · fuentes OWASP con la fecha de la edición 2025 (17-nov-2024): la página no trae fecha |
| Decisiones · aprendizajes | La fila del banco espera **solo la pieza**: AF-16 ya contesta las tres, y una fila que lo aceptara no podría fallar; se mide dónde cae antes de escribirla (la de embeddings llega 4.ª) · un copy fijo (`metodo.metricas.nota`) puede contradecir una pieza: no poner cifras propias en el bloque 7 · una cifra en la voz «hice» se ata a su documento, y un nivel no se hereda del conjunto (los 4 proveedores «adaptados» no son «uso real») |
| Deuda (lote del hito) | **Medios:** `rag-y-el-chat.es.md:67` y `.en.md:102` no listan las infografías entre lo que arma el índice (prosa del dueño) · `scripts/metodo-al-indice.mjs:31` primer `.mjs` que importa `.ts`: pide Node ≥ 22.18 sin `engines` (la CI en Node 22 y la vista previa de Vercel lo prueban en este PR). **Bajos:** `rag-sin-inventar.yaml:486` («etiquetas humanas» es solo de Document Retrieval) · `:630` («juez automático» parafrasea) · `:589` el enlace va al brochure, no al índice · `metodo-cifras.mjs` ve la cifra en cualquier parte del documento, no números en letras, solo en tests · fila de embeddings del banco (`banco-de-preguntas.es.yaml`) frágil cuando entren T4+ · «no existe todavía un validador» (`yaml:388,625`) envejece sin gate · `rag-y-el-chat` «32 fichas» frente a «38 piezas». Los del S10 que este sprint no tocó siguen en su cierre |
| Recomendación · esfuerzo-beneficio | S12 = T4 (orden T2→T3→T4): medir la fila del banco antes de escribirla, sin cifras propias en el bloque 7 y con la evidencia separada del nivel · alto: el mecanismo ya valida lo que se publica |
| Auditoría (4 casillas) | Un auditor independiente (Sonnet 5.5 · alto, solo lectura): **C 0 · A 0 · M 4 · B 7**; contrastó las 14 afirmaciones «campo» con sus fuentes y las 12 fechas (todas ciertas). M1 (copy fijo frente a un umbral de 60 %) y M4 (nivel de 5 proveedores): pagados · `8e6da58`. M2, M3 y los Bajos, a la deuda de arriba |
| Modelo por fase · relevos | F1 Sonnet 5.5 · F2 Opus 5.5 · F3 Sonnet 5.5 (auditor Sonnet 5.5; Haiku 5.5 no se usó): sin desvío · relevos: ninguno |
| `[CONFIRMAR]` para el dueño | (1) ¿Ajustaste o reentrenaste algún modelo (fine-tuning)? T3 solo dice que el chat no lo hace. (2) Azure AI Search está en tus skills y ningún documento cuenta un uso: T3 lo nombra solo en la voz «campo». (3) Hugging Face y Ollama: uso real sin historia; T3 no los nombra. (4) ¿Comparaste alguna vez búsqueda vectorial y léxica sobre este corpus, aunque fuera fuera del repo? Hoy es «un argumento, no una experiencia» |
| Para mergear | Squash y borrar la rama (`un-pr-vivo` ya es check requerido). Después `/cierre-sprint hoja-de-vida` |

### Horas del sprint (`scripts/horas-sprint.mjs`, rango `origin/main..HEAD`, heurística git-hours: huecos ≤ 2 h + 0,5 h por sesión)

| Commits | Sesiones | Horas activas | Span (primer → último commit) |
|---:|---:|---:|---|
| 13 | 1 | 1,5 h | 2026-10-18 08:29 → 2026-10-18 09:30 (1,0 h) |

| Fase | Commits | Horas activas |
|---|---:|---:|
| F1 | 3 | 0,5 h |
| F2 | 2 | 0,7 h |
| F3 | 8 | 0,3 h |
