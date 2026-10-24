---
sprint: 020
app: hoja-de-vida
hito: H-2
opened: 2026-10-23
closed: 2026-10-23
branch: sprint-020/cierre-h2
pr: https://github.com/mauriciorincon-ai/app-hoja-de-vida/pull/98
---

# Sprint 020 — Cierre ejecutivo · CV Viva · El cierre del H-2: lote en cero, arquitectura al día y la guía del ensayo

- **Nombre · objetivo · resultado:** cerrar el H-2 para que el dueño corra UN ensayo general sobre producción. **Logrado, listo para merge.** 1872 unit (líneas 90,78 %) · typecheck, lint, build, `pnpm audit` y dependencias sin bajar limpios · e2e completo (1015): 979 pasan, 36 omitidas de siempre, 0 fallan · Lighthouse local (mediana de 3, presupuesto y categorías en verde): HOME ES y EN 0,95/1/0,96/1, un tablero con galería 0,95/1/0,96/1, T8 0,94/1/0,96/1.
- **Tiempo:** estimado 6 h (F1 2,5 · F2 1,75 · F3 1,75) · real **2,0 h, piso del script** (abajo; los commits llegan en ráfagas tras la lectura y la medición) · −4,0 h; ninguna fase pasó del 50 %. **Fases:** F1 el lote en cero (1,2 h) · F2 arquitectura y segundo idioma (0,2 h) · F3 guía del ensayo, auditoría y cierre (0,6 h).
- **Entregables:** `sprints/SPRINT_020-lote.md` (cada medio y bajo de los cierres S9–S19 con estado `pagado` / `ya no aplica` / `imposible` y su prueba; su gate imprime las cuentas y comprueba sitios, citas e ids de la guía) · pagos: las dos intermitentes, la redirección exacta, el tope de cita del motor de voz, el ancho de etiquetas del mapa, el sitemap con su revisión, 9 filas frágiles del banco, la galería sin controles inertes sin JS y con nombre propio, axe 4.14, 4 PDF versionados fuera, frases y cifras del corpus que el lote señalaba · BLUEPRINT as-built, `design-system.md` con «Métodos» y sus dos contradicciones corregidas, 3 tarjetas en `design-sync/` (sin publicar) · `CLAUDE.md` con los hechos de producto · la puerta de la HOME probada en `/en` · 33 capturas EN leídas como imagen · guía v20 con el filtro «Ensayo general H-2» y su gate · manual.
- **Demos en rojo (archivo · mutación · a quién nombró):** `cero-enlaces.test.ts` · un PDF preparado en `sprints/` · «ningún PDF versionado» y el archivo · `decidir-con-modelos.yaml` · el nodo 1 alargado · «etiquetas que no caben en su nodo» · `redireccion.ts` · el patrón viejo · «//metodo no es la ruta vieja» · `voz-impersonal.ts` · `TOPE_DE_CITA` sin tope · el caso de la cita larga · `idioma.spec.ts` · `TOLERANCIA` 24 → -1 · «no volvió a su sitio» · `galeria-carrusel.tsx` · `if (false && e.isIntersecting)` y el selector del `<noscript>` · «deslizar la pista a mano…» y «el HTML del servidor trae un <noscript>…» · `SPRINT_020-lote.md` · una fila en «abierto», una cita y un id de guía cambiados · `S14-B6`, `S13-B3` y `S09-D2` · `GUIA-DE-PRUEBA.html` · 20 min en un flujo, el manejador del sí/no quitado y una ⭐ sin razón · «la sentada 1 suma 49 min…», «marcar uno lo guarda y cuenta» y `g5`. Cada una: rojo nombrando y verde al restaurar (`demo-rojo.sh` no se editó).
- **Desviaciones:** (1) el archivo no traía las decisiones del G-Plan: rigen los defaults 1a y 2a · (2) «curar» el ensayo = un flujo por fila: 12 de sus flujos absorben 41 de las 49 ⭐ (siguen en el Gate mínimo) y 8 salen con razón (CI, aprobada, lectura del repo); tras la auditoría son **tres sentadas** (no dos), la 3.ª con los Criterios, ninguna de más de 45 min · (3) 8 filas del S10 son `imposible`: su informe no se conservó · (4) las derivas del kit se declaran, no se editan: `docs/diseno/`, `docs/BROCHURE.html`, `PLANTILLA-ADR-codigo-primero.md`, `controladores-maqueta` y `tauri-a-la-par` no existen aquí, y `cero-enlaces.mjs:58` (homepage vacío) · (5) `design-sync/` no se publicó · (6) la intermitente de idioma **no tiene efecto demostrado**: el test viejo y el nuevo pasan 120 de 120 aun con 12 procesos saturando 10 núcleos; se vigila en la CI · (7) en la intermitente de la vitrina probé tres valores de la misma perilla antes de hallar la causa (línea de apertura a 2/3): debí pedir relevo al segundo.
- **Deuda (al lote del H-3, con nombre):** `src/lib/ia/guardrails.ts:115` (S10-B20, contrato del chat) · `scripts/metodo-cifras.mjs` (S11-B4, ata la cifra al documento y no a la frase) · enlace de T3 a la ficha y no al índice (S11-B3) · reportes a otras casas: fichas de Innmobiliaria, exports con nombre viejo y `cero-enlaces.mjs:58` (tabla del lote) · los `[CONFIRMAR]` del S17, aplazados al gate por el dueño.
- **Aprendizajes:** un lote vale lo que valen sus pruebas: la auditoría halló una prueba atribuida a la fila equivocada y una cita a una ⭐ que ya no existía, y ahora el gate cruza las citas con los archivos y los ids con la guía · una cuenta de tiempo escrita («~4 h 59 min») estaba mal por 50 min: la suma la hace la página · tras escribir una prueba que importa un paquete sin tipos se corre `pnpm typecheck`, no solo vitest · medir bajo carga tampoco reproduce todo: sin cambiar la causa no se cierra una fila. **Esfuerzo-beneficio:** alto: el ensayo queda en una sola sentada guiada, sin una fila abierta sin nombre.
- **Auditoría (4 casillas):** independiente (Sonnet 5.5 · alto, solo lectura, con el diff): **C 0 · A 1 · M 8 · B 11**; seguridad limpia (cero enlaces, sin secretos, ningún paquete baja); alcance completo salvo el cierre; leyó los 8 `imposible` del S10 y ningún hallazgo de los cierres quedó fuera del lote. A1 (typecheck rojo por `jsdom` sin tipos) y M1–M7 (una prueba falsa, una cita rota, los Criterios sin flujo, el nombre de la pista, la intermitente, el gate débil, los flujos de lista de espera y propuesta): `pagado · 0f9a0ba, 5351a5c, a559c8f, 0731b1b`; M8 (los contadores de sprints 19 → 20) y los 11 bajos: pagados o reclasificados con su razón en el sprint (`0f906dd, c0b67e0`, el lote y este cierre).
- **Modelo por fase · relevos:** F1, F2 y F3 con Sonnet 5.5 (auditor Sonnet 5.5, alto): sin desvío de modelo; Haiku no se usó · **relevos: ninguno pedido** (ver la desviación 7).
- **Siguiente:** el ensayo general del dueño sobre producción; después `/cierre-sprint hoja-de-vida` y, si todo es «sí», el cierre del H-2. **Para mergear:** squash y borrar la rama; después `/cierre-sprint hoja-de-vida`.

## Para el ensayo (lo que hace el dueño después del merge)

- **Qué abrir y en qué orden:** `docs/GUIA-DE-PRUEBA.html` → pega tu dominio en «URL de prueba» → filtro «Ensayo general H-2» → sentada 1 (escritorio: HOME, inglés, casos, PDF, contacto, chat, voto y propuesta) → sentada 2 (vitrina, «Métodos» y el teléfono real) → sentada 3 (los Criterios). **Cuánto:** lo suma la página y avisa en rojo si una sentada pasa de 45 min. **Dónde se anota:** cada flujo lleva su sí o no en la misma guía (se guarda en ese navegador); un «no» se lo cuentas a Claude en el sprint siguiente.
- **`[CONFIRMAR]` tuyos** (tabla «Decisiones del dueño…» del lote): los Criterios ▲ de T1, T5, T7, T8 y T9 (R14–R18) · Probeta DS y los convoyes «Prototipo» (R17) · RPA y minería de procesos sin caso (R18) · MLflow, modelos fundacionales y asistentes sin caso (R17) · la puerta de la HOME (R10) · «construir, comprar o componer» y el centro de excelencia (R14) · los del S17, aplazados · el Node del build de Vercel: la documentación dice que `22.x` despliega la última 22.x; confirmarlo con `node -v` en el Build Command es opcional.

### Horas del sprint (`scripts/horas-sprint.mjs`, rango `origin/main..HEAD`, heurística git-hours: huecos ≤ 2 h + 0,5 h por sesión; sin el commit del cierre)

| Commits | Sesiones | Horas activas | Span (primer → último commit)    |
| ------: | -------: | ------------: | -------------------------------- |
|      28 |        1 |         2,0 h | 2026-10-23 20:31 → 22:00 (1,5 h) |

| Fase | Commits | Horas activas |
| ---- | ------: | ------------: |
| F1   |      13 |         1,2 h |
| F2   |       5 |         0,2 h |
| F3   |      10 |         0,6 h |
