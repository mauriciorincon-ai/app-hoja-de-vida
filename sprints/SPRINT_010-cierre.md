---
sprint: 010
app: hoja-de-vida
hito: H-2
opened: 2026-10-17
closed: 2026-10-17
branch: sprint-010/mi-metodo-sistema-de-agentes
pr: https://github.com/mauriciorincon-ai/app-hoja-de-vida/pull/84
---
# Sprint 010 — Cierre ejecutivo · CV Viva · «Mi método», la primera pieza (T2)

| Campo | Valor |
|---|---|
| Nombre · objetivo | «Cómo estructuro un sistema de agentes» (T2) · que `/metodo` exista con su mecanismo (dato Zod de diez bloques, un renderizador, anclas, SVG, impresión, chat) y enseñe T2 completa en ES y EN |
| Resultado · estado | Logrado, **listo para merge**: `/es\|en/metodo` y `/metodo/sistema-de-agentes` con 10 bloques, mapa SVG de 11 nodos con texto real, 16 fuentes fechadas (2024-11-17 … 2026-09-30), revisión 2026-10-17 y tres voces separadas; el chat cita cada bloque (banco 318/318). 1635 unit · 567 e2e + 1 webkit · typecheck, lint, build y `pnpm audit` limpios |
| Tiempo estimado · real · diferencia | 10 h · ≥ 2,1 h (**piso** del script, abajo: no ve la lectura, la investigación ni las esperas) · ≤ −7,9 h · por fase 3,5/0,8 · 4/0,4 · 2,5/0,9: ninguna pasó el 50 % |
| Fases | F1 núcleo v2.3.0 + mecanismo · F2 investigación (solo contenido público; las docs de LangGraph y MCP traían texto dirigido a agentes: ignorado y anotado) y T2 · F3 chat por bloque, gates, manual, guía v10, capturas: las tres completas |
| Entregables | `CLAUDE.md` núcleo + kit (cero-enlaces, un-pr-vivo, verificar-dependencias, demo-rojo) · `src/lib/metodo` + `src/components/metodo` + rutas SSG · `data/metodo/sistema-de-agentes.yaml` · `scripts/metodo-al-indice.mjs` y `capturas-metodo.mjs` · destinos `#bloque-1…10` · banco +3/+3 · guía v10 (bloque Q) · manual · 10 capturas en `sprints/SPRINT_010-capturas/` |
| No completado | Nada de lo planeado. Rojos de F1/F3 (esquema, fuente sin fecha, credenciales, destinos, voz, Foundry, cifras gemelas, banco, impresión) y la investigación, registrados en los commits y el PR |
| Desviaciones · causas | Riel propio, no `TimelineTrack` (va atado a trayectoria) · «Mi método» es ruta del menú, nav 3→4 · constitución adoptada antes del «construye» y `gplan: pendiente` avanzado, por orden del dueño · comandos del kit reemplazan los v1.x · dominio propio fuera de `cero-enlaces.json` (barrido manual) · mapa: etiquetas horizontales y 5 columnas · chunks por elemento, peso 0,5 (medido) · **`data/a-fondo/**` (vetado) solo en cifras: 148→151 preguntas y nueve→diez sprints, 8 docs** · gates extra (cifras gemelas, Foundry) · `@media print` global, arregla también `/cv` · fuente [4] (OWASP LLM06:2025) lleva la fecha de la edición (17-nov-2024): la página no trae fecha · frase de OWASP del bloque 5 reescrita tras la auditoría (la fuente solo dice «ahora número tres») |
| Decisiones · aprendizajes | Peso 0,5 y chunk por elemento (rojo del banco medido) · una captura o e2e de impresión con «reducir movimiento» esconde lo que ese cinturón CSS arregla: pedir el medio sin ayudas · el gate de sprints cerrados era ciego a una frase (salvedad «fabrica») |
| Deuda (lote del hito) | **Medios:** `src/lib/metodo/schema.ts:90,296` href de evidencia sin validar contra el catálogo · `tests/unit/ctic-aproximadas.test.ts:30` no barre `data/metodo` · `mapa-svg.tsx:36` 2.ª línea sin tope · `.claude/commands/deploy-check.md:99,131` es el v1 · `rag-y-el-chat.{es,en}.md` 1.467→1.633 fragmentos (es:71,105,131,267,395) + `a-fondo-coherencia.test.ts:57` sin `metodo` + `MANUAL-DE-USO.md:1053,1059` · `cifras-a-fondo.yaml:~145` + `a-fondo-coherencia.mjs:~203` · `metodo-al-indice.mjs:103,175,266` (el índice se arma antes que Zod: TypeError opaco o «undefined») · `loader.ts:27` (cifras y «aprobado» de lo que cita del corpus, sin gate) · `MANUAL:592,618` y `GUIA:2220` totales a mano (caducan en el S11). **Bajos:** `riel-de-fases.tsx:83` · `metodo-al-indice.mjs:147` · `messages/es.json:453,477` · `destinos.mjs:21` · `mapa-svg.tsx:169,182` · `metodo/page.tsx:89` · `[slug]/page.tsx:85` · `metodo-infografia.test.tsx:137` · `design-system.md:332` + `menu-desplegable.html:176` · `BLUEPRINT.html:107,139` · `GUIA:1260` · `MANUAL:39,808` · `retrieval.ts:185` · `a-fondo/README.md:81` · `README.md:52` · `.claude/skills/*` · `infografia.tsx:75,395` (título huérfano al imprimir; ancho del [n]) · `sitemap.ts:63` (lastmod = revisión) · `como-aprendo.{es:165,191;en:283,340}` (prosa del dueño: «bitácora y resumen») · `guardrails.ts:115` (atribución de voz: contrato aditivo en plan mode) · **kit, avisar a la planeadora:** `cero-enlaces.mjs:58` (un homepage vacío pasa y el mensaje del rojo manda vaciarlo) y `:26` (`-I` ignora el PDF) |
| Recomendación · esfuerzo-beneficio | S11: pagar los Medios de `schema.ts` y del índice antes de sumar piezas, y reusar `capturas-metodo.mjs` · alta: el mecanismo ya sirve a las nueve piezas |
| Auditoría (4 casillas) | Cuatro auditores independientes en solo lectura (alcance · calidad · seguridad · frases caducadas), cada hallazgo contrastado por escépticos y un crítico de completitud: **C 0 · A 2 · M 8 · B 25** (4 descartados). A1 impresión sin títulos de bloque (la hallaron alcance y calidad; la reproduje: 8 de 10 títulos faltaban en el PDF): pagado · `e3b055f`. A2 «nueve sprints» en el corpus al entrar este cierre: pagado · el commit que crea este archivo. Además, un Medio del crítico pagado por la regla 5 (nada se inventa): «OWASP subió del sexto al tercero» no está en la fuente citada, mismo commit. Los demás M/B, a la deuda de arriba |
| Modelo por fase · relevos | F1 Sonnet 5.5 · F2 Opus 5.5 · F3 Sonnet 5.5 (auditoría y cierre incluidos; Haiku 5.5 no se usó): sin desvío · relevos: ninguno |
| `[CONFIRMAR]` para el dueño | (1) ARKHÉ aparece en la evidencia con nivel «Uso real» (uso personal): ¿o «Prototipo»? (2) ¿Hay un entregable nombrable de LangChain/LangGraph/LangSmith en la Fundación CTIC? Hoy dice «sin entregable publicado». (3) ¿Usaste evaluación de LangSmith (conjuntos, evaluadores en línea) en CTIC? Si sí, entra como «lo que hice» |
| Para mergear | Squash y borrar la rama; antes, sumar `un-pr-vivo` a los checks de `main-protegida`: `gh api repos/mauriciorincon-ai/app-hoja-de-vida/rulesets/18521842 \| jq '{name,target,enforcement,conditions,bypass_actors,rules:(.rules\|map(if .type=="required_status_checks" then .parameters.required_status_checks += [{"context":"un-pr-vivo"}] else . end))}' \| gh api -X PUT repos/mauriciorincon-ai/app-hoja-de-vida/rulesets/18521842 --input -`. Después `/cierre-sprint hoja-de-vida` |

### Horas del sprint (`scripts/horas-sprint.mjs`, rango `origin/main..HEAD`, heurística git-hours: huecos ≤ 2 h + 0,5 h por sesión)

| Commits | Sesiones | Horas activas | Span (primer → último commit) |
|---:|---:|---:|---|
| 7 | 1 | 2,1 h | 2026-10-17 20:52 → 2026-10-17 22:30 (1,6 h) |

| Fase | Commits | Horas activas |
|---|---:|---:|
| F1 | 3 | 0,8 h |
| F2 | 1 | 0,4 h |
| F3 | 3 | 0,9 h |
