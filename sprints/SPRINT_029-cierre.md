---
sprint: 029
app: hoja-de-vida
hito: H-2
opened: 2026-10-31
closed: 2026-11-01
branch: sprint-029/skills-y-logros
pr: PENDIENTE
---

# Sprint 029 — Cierre ejecutivo · CV Viva · Sentada 4d: Skills como explorador, los doce logros y el portafolio en su orden

- **Resultado:** Skills es el explorador de la maqueta aprobada (nueve áreas que flotan, se agarran, se lanzan y se eligen) sobre la lista de siempre, que sigue en el HTML; los logros son los doce aprobados, textuales, y el de agentes propios se cuenta (11) en la HOME, el chat y el PDF; la trayectoria suma cuatro bullets; Investigaciones va al final del portafolio. **Estado: construido y verificado; espera la mirada de FIDELIDAD del dueño.** Verificado: lint · tsc · 3486 unitarias (109 archivos) · build · e2e completo 1140 pasaron, 0 fallaron, 55 omitidas por proyecto (chromium, móvil, @webkit) · Skills con axe en chromium y móvil · Lighthouse local, mediana de 3: `/es` y `/en` 0,95, TBT 2 ms, CLS 0, accesibilidad 1,0, los dos `assert` de la CI pasan · PDF de 3 páginas en ES y EN · cero enlaces limpio.
- **Tiempo:** estimado 4,5 h (planeadora 4: F1 2 · F2 1 · F3 1; +0,5 por lo que destapó el contraste) · real **1,2 h, piso del script** (abajo): los 12 commits se hicieron al cerrar cada fase (00:16, 00:28, 00:36, 00:58), así que no cuenta el trabajo previo a cada uno, la lectura, la planeación ni la espera de los e2e; no tengo otra medida · ninguna fase pasó el 50 % de su estimado.
- **Entregables:** F1 motor puro `src/lib/skills/explorador.ts` (prueba contra la salida dorada de la maqueta, semilla fija), isla `skills-explorador.tsx`, escenario en su propio chunk (16,6 KB, no se pide al cargar), hoja y paleta (contraste AA vigilado); la cita del chat abre el área sin tocar el chat. F2 `contar` en sus tres lectores (`scripts/contar-piezas.mjs`: esquema, chat y PDF), los doce logros y cuatro bullets por script con la igualdad analizada contra `aprobado.md`, el orden de los frentes. F3 guía v29, manual, `design-system.md`, auditoría y sus pagos. **Copias: ninguna** (bitácora del SPRINT: «ninguna todavía», releída al abrir la F2 y al cerrar); la planeadora subió después `486577f` y `76f97fb` (contenido v2 del brochure de CV Viva y del chat) y no están marcados como listos, así que no se copian. Texto aprobado leído de la planeadora (solo lectura): `aprobado.md` `f851fbb` · maqueta de Skills `441c93b` · `logros-home.html` `c7d426a`.
- **No completado:** nada del alcance. Fuera de plan, como estaba: la pasada en vivo, el v2 de las once, «Métodos» (OM-36), el modo oscuro.
- **Desviaciones y causas:** (1) la cita del chat abre el área en el explorador en vez de caer en la tarjeta (el chat no se toca) · (2) las flechas ← → caen en la fuente de respaldo del sitio (la Inter no las trae; la maqueta caía en system-ui) · (3) «← N · … · M →» sin `aria-label` y con su prefijo en `sr-only` (WCAG 2.5.3; lo cazó axe); en celular el nombre del área queda oculto a la vista pero no al lector; volver y los pasos con `visibility:hidden` sin área abierta · (4) `liftIn` y `trazo` quedan en el vocabulario de motion sin uso en la HOME · (5) sin ADR-031: la regla de bucles vive en `design-system.md` (una ADR nueva obligaría a tocar `data/a-fondo/**`) · (6) `ancla-de-scroll.ts`: un elemento sin caja ya no es ancla (la lista oculta de Skills robaba el ancla del cambio de idioma, 3 rojos en `idioma.spec`) · (7) **pagué también los medios M1–M4 y B1, B2, B5 de la auditoría**: son código nuevo de este sprint y costaban poco; el plan los mandaba al lote.
- **Decisiones:** las del dueño (doce logros, su orden, Investigaciones al final) no se volvieron a preguntar. WCAG 2.2.2 se cumple con «Ver todo en lista» y con «reducir movimiento».
- **Deuda al lote del H-3:** M5 (**del dueño**) `data/a-fondo/certificaciones.{es,en}.md:53` dice que el sitio publica el logro «3 certificaciones», que salió; es prosa suya y de `data/a-fondo/**`, pide su visto bueno en los dos idiomas · M6 (**a la planeadora**: el export se corrige en origen) `content/vitrina/casa/hoja-de-vida.brochure-export.json:56-57,69` y `hoja-de-vida.capturas.yaml:11,13` (más las imágenes CV-03 y CV-05) describen ocho logros y la HOME anterior · resto de M1: la elección «lista» se pierde al cambiar de idioma (`skills-memoria.ts`) · B3 sin lector: `skills.tsx:70` `data-skill-grupo`, `stagger.tsx:72-79` `hijos`, `retrasos.ts:8,60`, `globals.css:362-425` `liftIn`/`trazo`, `contar` acepta frentes que ningún dato usa · B4 `skills.css:176-179` frente a `explorador.ts:62-67` (salto de 20 px entre 641 y 671 px) · B6 el foco: «← Todas las áreas» y los pasos van antes que las burbujas (`skills-escenario.tsx`, e2e `skills.spec.ts:~187`) · B7 exports sin lector en `explorador.ts` y `paleta.ts`, y `paleta.ts` depende de `brochure/contraste` · B8 la máquina de arrastre (`skills-escenario.tsx:536-635`) solo tiene e2e · `pnpm audit`: 2 moderados transitivos de `@sentry/nextjs`, sin tocar dependencias.
- **Aprendizajes:** `next/dynamic` no atrapa el rechazo de su `import()`: un chunk que no llega tumba la página, hace falta su límite · una prueba de posición medida en la última sección no ve nada (la página se clava abajo): medir en una intermedia · correr la e2e nueva contra el servidor viejo antes de reconstruir da el rojo gratis · `opacity:0` sola deja un control invisible y enfocable (2.4.7) · un elemento `display:none` «está» en el scroll actual y roba el ancla · el lint de React Compiler marca `performance.now()` en el cuerpo. **Recomendación:** FIDELIDAD, luego M5 y M6 por sus dueños y el v2 de las once por copia. **Esfuerzo-beneficio:** alto, la sección que más se mira de la HOME pasó a ser la aprobada, con un total que se mide.
- **Auditoría (4 casillas):** independiente (Sonnet 5.5 · alto, solo lectura, con el diff): **C 0 · A 0 · M 6 · B 8** (alcance completo salvo la fidelidad visual, que es el STOP; calidad M1–M4 B3–B8; seguridad sin hallazgos: `innerHTML` solo recibe números del motor; frases caducadas M5, M6, B1, B2). Pagados: M1–M3 `b66abe3` (cada uno con una e2e que cayó contra el build anterior) · M4 `7bb2851` (rojo visto: «expected 6 to be 5») · B1, B2, B5 `6141afa`. Al lote: arriba.
- **Modelo por fase · relevos · Para mergear:** F1 Opus 5.5, F2 y F3 Sonnet 5.5 tras el gate de modelo, auditor Sonnet 5.5 (alto): sin desvío, Haiku no se usó · **relevos: ninguno** · con la CI verde: squash y borrar la rama; después `/cierre-sprint hoja-de-vida`.

## Para la revisión (lo que hace el dueño)

- **FIDELIDAD (el único STOP):** en el preview, `/es#skills` junto a `referencias-ui/home/maqueta/home.html`: reposo → cursor sobre una → agarrar y lanzar → elegir la 6 → «← 5 · 7 →» y ← → → Escape → abrir las nueve → «Ver todo en lista»; en el celular, mantener el dedo; también EN. Y `/es#logros` junto a `referencias-ui/home/logros/maqueta/logros-home.html`: computador y celular, ES y EN, los doce en su orden, tres filas de cuatro, el de agentes dice 11. Respuesta esperada: «fiel» o la lista de lo que no lo es. Diferencias declaradas: la sección usa las medidas y el título del sitio; la cita del chat abre el área. Cero miradas de DECISIÓN.
- **Del dueño:** M5 (arriba). **A la planeadora:** M6 (arriba).

### Horas del sprint (`scripts/horas-sprint.mjs`, rango `origin/main..HEAD`, sin los commits del cierre y del enlace al PR)

| Commits | Sesiones | Horas activas | Span (primer → último commit)               |
| ------: | -------: | ------------: | ------------------------------------------- |
|      12 |        1 |         1,2 h | 2026-11-01 00:16 → 2026-11-01 00:58 (0,7 h) |

| Fase | Commits | Horas activas |
| ---- | ------: | ------------: |
| F1   |       4 |         0,5 h |
| F2   |       3 |         0,2 h |
| F3   |       5 |         0,5 h |
