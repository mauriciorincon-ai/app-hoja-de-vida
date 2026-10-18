---
sprint: 013
app: hoja-de-vida
hito: H-2
opened: 2026-10-18
closed: 2026-10-18
branch: sprint-013/mi-metodo-ciclo-de-vida-de-datos
pr: https://github.com/mauriciorincon-ai/app-hoja-de-vida/pull/88
---

# Sprint 013 — Cierre ejecutivo · CV Viva · «Mi método», T6 (`ciclo-de-vida-de-datos`)

| Campo | Valor |
|---|---|
| Nombre · objetivo | «Cómo estructuro el ciclo de vida de un proyecto de datos a escala» (T6) · que `/metodo/ciclo-de-vida-de-datos` muestre T6 en ES y EN, que producción y la CI corran la misma mayor de Node y que tus dos respuestas del S12 entren al corpus |
| Resultado · estado | Logrado, **listo para merge**: 10 bloques, mapa de 13 nodos con texto real, 13 fuentes fechadas de Microsoft Learn (2025-06-10 … 2026-09-30), revisión 2026-10-18; el chat la cita al bloque exacto (banco +2/+2); Node `22.x` declarado y vigilado. 1683 unit (líneas 90,4 %) · 704 e2e chromium/móvil/webkit + 35 omitidas por diseño · typecheck, lint, build y `pnpm audit` limpios · Lighthouse local de T6 0,94/1/0,96/1 |
| Tiempo estimado · real · diferencia | 2,5 h · 1,5 h (**piso** del script, abajo) · −1,0 h (−40 %); ninguna fase pasa el 50 % por arriba: medí las tres preguntas antes de escribir los títulos. **Investigación de F2, aparte:** 15:23:58 → 15:25:29 en el reloj del sistema (13 fuentes oficiales; la redacción siguió hasta las 15:31) |
| Fases | F1 Node `22.x` y tus dos respuestas · F2 investigación (solo contenido público; ninguna página traía texto dirigido a agentes) y T6 · F3 banco, e2e, contadores, roadmap de Innmobiliaria, capturas, manual, guía v13, auditoría: las tres completas |
| Entregables | `data/metodo/ciclo-de-vida-de-datos.yaml` · `engines` `22.x`, `@types/node` ^22 y `node-declarado` (4 chequeos nuevos, 4 demos en rojo) · banco +2/+2 (demo en rojo con `PESO_METODO` 0,05) · e2e del chat y `lighthouse-urls.json` · manual (ejemplo de T6, nota del banco, historial) y guía v13 (q11, q12, sin ⭐) · 12 capturas en `sprints/SPRINT_013-capturas/` |
| No completado · desviaciones | **La 3.ª fila del banco no entró** («¿Cómo diseñó Henry la plataforma de datos de Vesting?»): ES 4.ª por poco y EN 30.ª; tras dos ajustes de títulos paré (regla 29): la pieza pesa la mitad y el documento de Vesting es su fuente natural · dos filas existentes cambiaron de puesto por IDF, no por T6 (lakehouse 1.ª→2.ª, multiagente de T2 2.ª→3.ª), dentro del top-4 · el lockfile sube `@types/node` a 22.20.5 y re-resuelve peers (ruido; ningún paquete baja) · pnpm local avisa «Unsupported engine» (tu Node es la 24.18; solo avisa) · `data/a-fondo/**` solo números (157→159, índice 1.767/1.759, doce→trece sprints en diez sitios) y tus respuestas (AI-103 también en `como-aprendo`) · el rótulo del nodo 6 se acortó al verlo en la captura · de Innmobiliaria sale `compradores-verificados` (su S8 está mergeado) |
| Decisiones · aprendizajes | Un documento de fondo que pesa el doble no se supera con títulos: se declara · una fila con varias vías hacia la pieza se demuestra fallando bajando el peso de la pieza (T2–T6 caen en ES y EN), no mutando un título · el conteo de sprints en letras, y en dígitos sin «cerrados», no lo vigila ningún gate: lo halló el auditor (A1) |
| Deuda (lote del hito) | **Medios:** M1 el título «Fabric frente a Databricks: diferencias y un puente» (`ciclo-de-vida-de-datos.yaml:471`) promete más de lo que el texto cuenta, y la fila del banco depende de él · M2 `cv.es.yaml:862` lista Eventhouse y KQL sin nivel y T6 los dice «solo temario». **Bajos:** `cv.es.yaml:803` «la ruta que hoy curso» (AI-103 ya completo) · en T6 `:441` vistas materializadas con PySpark en Preview, `:566` «transformaba con Spark» (el corpus dice «permitía»), `:482` el temario del DP-600 rige desde el 19 · ficha de Innmobiliaria: su BPMN no muestra el flujo de la visita y `abrir-a-compradores` pudo adelantarse (otra casa: se reporta) · su adaptador real de identidad no se ejerce hasta su ensayo general |
| Recomendación · esfuerzo-beneficio | Siguiente pieza (quedan cinco): títulos con las palabras de la pregunta desde la redacción, las tres filas medidas antes y declarar la que su documento de fondo gane · alto: el mecanismo ya valida lo que se publica |
| Auditoría (4 casillas) | Auditor independiente (Sonnet 5.5 · alto, solo lectura): **C 0 · A 2 · M 2 · B 7** (descarté su B5: `documentos-cuentas.test.ts:150-162` sí vigila el conteo de piezas); contrastó 17 afirmaciones «campo» con las 13 fuentes, todas leídas, y 14 «hice» con el corpus: todas se sostienen; 223 pares ES/EN con las mismas cifras. A1 (conteo de sprints) y A2 («21 y 10 módulos» en `como-aprendo`) · `pagado · c165730`. Cero enlaces limpio y ningún paquete baja |
| Modelo por fase · relevos | F1 Sonnet 5.5 · F2 Opus 5.5 · F3 Sonnet 5.5 (auditor Sonnet 5.5): sin desvío (Haiku 5.5 no se usó) · relevos: ninguno (la fila de Vesting se detuvo al segundo intento, regla 29, y se declara arriba) |
| `[CONFIRMAR]` para el dueño | (1) ¿Vercel construyó el preview con Node 22? No puedo leer su log desde aquí: Deployments → el del PR → Build Logs (esperado 22.x, porque lee `engines`) · (2) ¿Aceptas que la pregunta de Vesting quede fuera del banco? · (3) ¿Qué nivel van Eventhouse y KQL en tu CV hoy (M2)? |
| Para mergear | Squash y borrar la rama (y la remota del #85, `sprint-011/mi-metodo-rag-sin-inventar`, que sigue). Después `/cierre-sprint hoja-de-vida` |

### Horas del sprint (`scripts/horas-sprint.mjs`, rango `origin/main..HEAD`, heurística git-hours: huecos ≤ 2 h + 0,5 h por sesión)

| Commits | Sesiones | Horas activas | Span (primer → último commit) |
|---:|---:|---:|---|
| 10 | 1 | 1,5 h | 2026-10-18 15:19 → 2026-10-18 16:17 (1,0 h) |

| Fase | Commits | Horas activas |
|---|---:|---:|
| F1 | 3 | 0,5 h |
| F2 | 1 | 0,3 h |
| F3 | 6 | 0,7 h |
