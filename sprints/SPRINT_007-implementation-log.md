# Sprint 007 — LAS ESTANTERÍAS · bitácora de implementación

> Branch `sprint-007/las-estanterias` · ciclo H2, sprint 3 de ≥4 · gate ⭐ DIFERIDO con
> contrapesos · orden: `portafolio/hoja-de-vida/ordenes/SPRINT_007-orden.md` (planeadora, RO).
> **Contrato de fases:** al terminar cada fase me detengo con su resumen y espero «continúa».

---

## Fase 0 — deudas y deltas (antes de una línea de producto)

### 0.1 · Humo de credenciales — NINGUNA

El sprint no usa credenciales: SSG puro, cero servicios nuevos, US$0 de aprovisionamiento
(orden § Aprovisionamiento externo). Las credenciales heredadas (Resend, Supabase, el proveedor
del chat) **no se tocan y no se construye contra ellas**, así que no hay humo que correr.
Se declara para que la ausencia sea explícita y no un olvido (kit v1.7.4).

### 0.2 · `/audita-sprint` copiada a este repo

No existía aquí. Copiada del kit sin editar:
`kit-app/.claude/commands/audita-sprint.md` → `.claude/commands/audita-sprint.md` (5 988 B).
Es la que corre al cierre de este sprint y la que se usó para la auditoría retroactiva de abajo.

---

## AUDITORÍA RETROACTIVA S5 + S6 — FASE 1 (SOLO LECTURA)

**Alcance:** sprints 005 (cerrado 2026-08-23) y 006 (retroactivo, construido fuera de sprint
2026-09-05/06). **Corrida sobre:** `main` en `755f98d`, antes de tocar un solo archivo de
producto. **Por qué se corre ahora:** ninguno de los dos la corrió — la orden del S5 omitió la
cláusula obligatoria (causa declarada en la planeadora) y el S6 se construyó sin orden.

### Evidencia base (medida, no afirmada)

| Comprobación                                                                              | Resultado                                                                                                                                                                                                                                         |
| ----------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `pnpm vitest run`                                                                         | **246 pasan / 246** · 20 archivos                                                                                                                                                                                                                 |
| Cobertura global                                                                          | **93,24 %** stmts · 85,28 % branches · 95,04 % funcs                                                                                                                                                                                              |
| `lib/vitrina` (motor del S5/S6)                                                           | 96,19 % stmts · `bpmn.ts` 97,6 %                                                                                                                                                                                                                  |
| `pnpm typecheck`                                                                          | limpio                                                                                                                                                                                                                                            |
| `pnpm lint`                                                                               | limpio                                                                                                                                                                                                                                            |
| Barrido cero enlaces (regla 16, árbol completo menos lockfile)                            | **vacío ✅**                                                                                                                                                                                                                                      |
| Campo `homepage` del repo                                                                 | **vacío ✅**                                                                                                                                                                                                                                      |
| Enlaces/DOI en `content/`                                                                 | **ninguno ✅**                                                                                                                                                                                                                                    |
| Artefactos versionados (`.lighthouseci`, `coverage`, `test-results`, `playwright-report`) | **ninguno ✅** (todos en `.gitignore`)                                                                                                                                                                                                            |
| `design-system.md` + `design-sync/`                                                       | **al día** con los componentes del S5 y post-S5 (caja de frente, ficha técnica y BPMN, chip de procedencia) — regla 15 del CLAUDE.md cumplida                                                                                                     |
| Regla 14 (gate demostrado FALLANDO)                                                       | **cumplida en los seis bloques** del log: contrato del export (l. 138), deriva cero (l. 584), los dos gates de frentes (l. 791), los del contrato de ficha (l. 922), dependabot (l. 1015), invariantes BPMN (l. 1094), proceso opcional (l. 1158) |

### 1 · Cobertura de alcance

**Sprint 005 — 3/3 outcomes COMPLETOS.**

| Outcome                                                             | Veredicto    | Evidencia                                                                                                                                                                                  |
| ------------------------------------------------------------------- | ------------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| O1 · exports anclados y validados                                   | **Completo** | 6 `*.brochure-export.json` en `content/vitrina/`; `src/lib/vitrina/loader.ts:46-67` fail-safe que nombra archivo y campo; `versionCompatible` en `schemas.ts:182`; demo en rojo registrada |
| O2 · vitrina en SU design system, cero enlaces, CTA lista de espera | **Completo** | `/vitrina`, `/vitrina/apps`, ruta por app; barrido vacío; `data-cta="lista-de-espera"` en las cuatro superficies                                                                           |
| O3 · ADR de arquitectura                                            | **Completo** | `decisions/013-vitrina-exports-vs-yaml.md`                                                                                                                                                 |

**Sprint 006 — 3/3 outcomes COMPLETOS + higiene; el CIERRE es lo que falta.**

| Outcome                                              | Veredicto           | Evidencia                                                                                                                                               |
| ---------------------------------------------------- | ------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------- |
| O1 · menú 9→4, «Apps» absorbida, fuga de artefactos  | **Completo**        | `tests/e2e/nav-header.spec.ts` (5 pruebas); `.gitignore:32` `.lighthouseci/`; índice limpio                                                             |
| O2 · cuatro frentes                                  | **Completo**        | ADR-015; `data/vitrina.yaml`; `src/lib/schemas.ts:230-260`; `src/lib/vitrina/categorias.ts`                                                             |
| O3 · ficha técnica + motor BPMN + contrato publicado | **Completo**        | ADR-016; `ficha-tecnica/{schema,armar,secciones,loader}.ts`; `bpmn.ts` (97,6 % cobertura, 40 pruebas); `docs/contrato-ficha-tecnica/` generado por test |
| Higiene dependabot                                   | **Completo**        | `tests/unit/dependabot-config.test.ts` (4 invariantes)                                                                                                  |
| **Cierre del sprint**                                | **NO IMPLEMENTADO** | no hay `SPRINT_006-summary.md` ni `SPRINT_006-implementation-log.md` → **C1 · M5**                                                                      |

### 2–3 · Calidad de código y dependencias

Sin hallazgos de seguridad ni de dependencias. El código del S5/S6 es consistente con las
convenciones del repo (motor puro separado de UI, fail-safe con diagnóstico, server components
sin JS). Los defectos encontrados son de **contrato y de borde**, no de lógica: M1–M4.

### 4 · ¿Qué frases caducaron? (barrido por PROMESA APLAZADA)

Barrido de `todavía no · aún no · por ahora · de momento · mientras tanto · próximamente ·
llega después · en esta versión · más adelante · no (se) puede · sin embargo · podrás ·
permitirá` sobre `docs/`, `messages/`, `data/`, `README.md`, `src/`. **19 coincidencias, 18
siguen siendo verdad hoy** (los tres frentes en preparación, el proceso declarado por CV Viva,
el modo oscuro inexistente —verificado: no hay `prefers-color-scheme` ni toggle—, las notas de
la guía sobre el gate ⭐ no corrido). **La que caducó no salió del barrido de promesa, sino de
leer la portada del repo: el `README.md` → A3.**

Nota de método: el barrido por vocabulario de promesa **no habría cazado A3**, porque el README
no aplaza nada — miente en presente. Se registra como aprendizaje para el summary.

### 5 · Campos del contrato sin consumidor (comprobación mecánica)

Contrato auditado: `fichaTecnicaSchema` (22 campos raíz + anidados), creado por el S6.
Método: `grep` de cada campo fuera de `schema.ts`, `armar.ts` y los tests.

- **21 campos con lector real.** ✅
- **1 huérfano: `pieza.sellado_en`** → **A4**.
- Claves i18n de los namespaces `vitrina` y `fichaTecnica`: 96 revisadas, **1 huérfana** →
  **B1**.

---

## Hallazgos (por severidad)

### 🔴 CRÍTICO

#### C1 · El sprint 006 no está cerrado: no existe su summary

**Qué:** `sprints/SPRINT_006-summary.md` no existe. La regla del método es dura — _sin summary
el sprint NO está cerrado_ — y es el archivo que la planeadora lee de `origin/main` para su
retrospectiva y su batch G-Metodo. `SPRINT_006.md` de la planeadora lo lista explícitamente
como pendiente **del lado de la app**.

**Ajuste ejecutable**

- **Archivo:** crear `sprints/SPRINT_006-summary.md`.
- **Cambio exacto:** plantilla del CLAUDE.md § «Plantilla del summary», con
  `sprint: 006 · status: closed · opened: 2026-09-05 · closed: 2026-09-06 · branch:` (varias
  ramas `mejora/…`, se declara) · `pr:` lista de #11 #12 #13 #15 #16 #18 #19. Contenido tomado
  **solo** de los bloques «Trabajo POSTERIOR AL CIERRE» y «Post-cierre I–VI» de
  `sprints/SPRINT_005-implementation-log.md` (l. 627–1190) y de esta auditoría; nada inventado.
  Debe registrar: los 4 outcomes, los gates en rojo con su línea, la auditoría de arriba con sus
  hallazgos y pagos, la deuda aceptada, y las ⭐ (17, diferidas).
- **Verificación:** el archivo existe en la rama, `git grep -c "^## " sprints/SPRINT_006-summary.md`
  devuelve las 10 secciones de la plantilla, y el frontmatter tiene `status: closed`.

### 🟠 ALTO

#### A1 · El CLAUDE.md describe un repo que ya no existe (deriva del mapa)

**Qué:** el bloque § Estructura (l. 44–60) nombra `content/vitrina/` y nada más de la vitrina.
No existen en el mapa: `data/vitrina.yaml`, `data/fichas/`, `src/lib/vitrina/`,
`docs/contrato-ficha-tecnica/`, `design-sync/`, `content/<frente>/`, ni las rutas
`/vitrina`, `/vitrina/<categoria>`, `/vitrina/apps/<slug>` y `/vitrina/apps/<slug>/detalle`.
**Este archivo se auto-carga en cada sesión:** un mapa falso desorienta cada build futuro, y es
la deuda que el S5 declaró y el S6 no pagó.

**Ajuste ejecutable**

- **Archivo:** `CLAUDE.md`, bloque de código de § Estructura (l. 44–60).
- **Cambio exacto:** añadir dentro del árbol, respetando el estilo de una línea por entrada con
  comentario corto:
  - bajo `src/lib/`: `└─ vitrina/       (S5–S6 — loader de exports · frentes · ficha-tecnica/ · motor bpmn)`
  - tras `data/`: `data/vitrina.yaml` (los 4 frentes) y `data/fichas/` (complementos de curación
    de CV Viva, `procedencia: cv-viva`)
  - tras `content/vitrina/`: `content/<frente>/  (S7 — fichas técnicas completas de otras casas)`
  - `docs/contrato-ficha-tecnica/  (el contrato publicado desde el Zod — schema · ejemplo · clave visual)`
  - `design-sync/  (bundle publicable del design system — espejo 1:1, regla 15)`
  - y una línea de rutas públicas de la vitrina bajo `src/app/[locale]/`.
- **Verificación:** `git grep -c "vitrina" CLAUDE.md` ≥ 6 y cada path nombrado existe
  (`for p in ...; do test -e "$p" || echo "FALTA $p"; done` sin salida).

#### A2 · Faltan dos deltas obligatorios en el CLAUDE.md

**Qué:** (a) el delta del **kit v1.25.0** — regla 15 del pipeline: _el rojo nace en el MISMO
commit que introduce el gate_ (hoy la regla 14 del CLAUDE.md exige el rojo, pero no exige que
viaje en el mismo commit, y ese es justo el agujero que v1.25.0 cierra); (b) la **regla del
canal de contenido** decidida el 2026-09-06: quién administra qué ficha (apps → planeadora,
`vitrina/apps/`; agentes · investigaciones · tableros → quien construye la pieza) y cómo llega
(copia a `content/<frente>/` + PR de contenido sin sprint). Sin (b), la próxima sesión puede
editar una ficha ajena «para que quepa».

**Ajuste ejecutable**

- **Archivo:** `CLAUDE.md`.
- **Cambio exacto:** (a) añadir al final de la **regla 14** un párrafo: «**Y el rojo viaja en el
  MISMO commit que introduce el gate (kit v1.25.0):** un gate que se agrega hoy y se demuestra
  mañana es un gate sin demostración durante una revisión entera…». (b) añadir un bullet nuevo
  en § Patrones de dominio: «**Canal de contenido de la vitrina**: las fichas de otras casas NO
  se editan aquí, ni para que quepan…».
- **Verificación:** `git grep -n "MISMO commit" CLAUDE.md` y `git grep -n "canal de contenido" CLAUDE.md`
  devuelven una línea cada uno.

#### A3 · El `README.md` sigue siendo el boilerplate de `create-next-app`

**Qué:** 36 líneas intactas desde el día 0. Es la **portada del repo público** y hoy afirma cosas
falsas: «You can start editing the page by modifying `app/page.tsx`» (la app vive en
`src/app/[locale]/`), «bootstrapped with create-next-app», y no dice en ninguna parte qué es
CV Viva. Seis sprints de vitrina construida y la puerta de entrada del repo habla de otra cosa.
Cae de lleno en la casilla «¿qué frases caducaron?» — y es la que el barrido por promesa aplazada
**no** podía cazar.

**Ajuste ejecutable**

- **Archivo:** `README.md` (reescritura completa, ~40–60 líneas, español).
- **Cambio exacto:** qué es CV Viva en dos frases · stack real (Next.js 16 · TS strict ·
  Tailwind v4 · next-intl · Vitest + Playwright + axe · Vercel) · cómo se alimenta el contenido
  (`data/*.yaml`, `content/`) · cómo se corre en local (`pnpm i`, `pnpm dev`, `pnpm test`) ·
  puntero a `docs/MANUAL-DE-USO.md`, `design-system.md`, `decisions/`.
- **Regla dura que aplica:** **CERO ENLACES (regla 16)** — ni la URL de producción ni la de
  preview, ningún dominio de despliegue (el patrón se escribe con clase de carácter, p. ej.
  `vercel[.]app`, si hay que nombrarlo). El CTA público sigue siendo la lista de espera.
- **Verificación:** `git grep -nE "vercel[.]app|workers[.]dev|pages[.]dev" README.md` vacío;
  `grep -c "create-next-app" README.md` = 0; el README no menciona `app/page.tsx`.

#### A4 · `pieza.sellado_en` es un campo requerido del contrato SIN UN SOLO LECTOR

**Qué:** `fichaTecnicaSchema` (`src/lib/vitrina/ficha-tecnica/schema.ts:263`) exige
`sellado_en: fecha.nullable()` a **toda** casa productora. `FichaTecnica`
(`src/components/vitrina/ficha-tecnica.tsx`) **nunca lo lee**: la fecha de sello llega por otro
camino, dentro de `hitos` (`armar.ts:47-49` la mete como `{valor, etiqueta:"sellada"}`). El
único otro `sellado_en` del repo es el del **export** (`vitrina/schemas.ts:51`), que es otro
contrato. _Un motor probado no es un producto probado: el defecto vive en el cable._
**Por qué importa ahora:** el S7 mete 20 fichas de otras casas; cada una paga el impuesto de
declarar un dato que la vitrina no enseña, y una fecha sin lector es una fecha que nadie corrige
cuando miente.

**Ajuste ejecutable — se decide entre dos, no se implementan los dos**

- **Opción 1 (recomendada, cero riesgo sobre las 20 fichas ya escritas por sus casas):** darle
  lector. En `src/components/vitrina/ficha-tecnica.tsx`, en la cabecera (l. 120–146), añadir un
  `<li>` con el chip de sello cuando `pieza.estado === "sellado" && pieza.sellado_en`, con clave
  i18n nueva `fichaTecnica.selladaEl` (ES «Sellada el {fecha}» / EN «Sealed on {fecha}»).
- **Opción 2:** volverlo opcional en el contrato → obliga a **v1.2.0** y a regenerar el schema
  publicado; las fichas ya escritas siguen validando (aditivo por relajación).
- **Verificación (opción 1):** `git grep -n "sellado_en" src/components/` devuelve ≥1;
  la ficha de `habla` (sellada) muestra el chip y la de una app inicial no lo muestra;
  `pnpm test` verde y axe sin violaciones nuevas.

### 🟡 MEDIO (deuda con pago asignado si no se aprueban ahora)

- **M1 · Slugs duplicados no vigilados.** `getFichasVitrina()` (`loader.ts:90-112`) deriva el
  slug del **contenido**, no del nombre del archivo, y no comprueba unicidad. Dos exports con el
  mismo `app.slug` ⇒ `generateStaticParams` con params repetidos y `getFicha()` devolviendo el
  primero **en silencio**. _Ajuste:_ aserción en `getFichasVitrina()` que lance nombrando los dos
  archivos. **Pago propuesto: fase 1 del S7**, donde el test de contenido ya exige slugs únicos
  globales — se extiende la misma invariante a `content/vitrina/`.
- **M2 · Nombre de archivo ≠ slug declarado no vigilado** (mismo sitio). _Pago: fase 1 del S7,
  mismo test._
- **M3 · `fichaTecnicaSchema.schema_version` sin puerta de mayor.** El export tiene
  `versionCompatible()` (`vitrina/schemas.ts:182`) con diagnóstico propio; la ficha solo tiene el
  regex `^1\.\d+\.\d+$`, así que una ficha 2.0.0 falla con «Invalid string: must match pattern»
  en vez de decir que el mayor no es compatible. _Pago: fase 2 del S7_, donde nace el loader de
  piezas y es su sitio natural.
- **M4 · ENOENT crudo si falta la carpeta.** `readdirSync(VITRINA_DIR)` sin `try` rompe con el
  error de Node, no con el diagnóstico fail-safe del resto del loader. _Pago: fase 2 del S7_
  (el loader nuevo ya nace devolviendo `[]` sin carpeta; se homogeneiza el de exports).
- **M5 · La bitácora del S6 vive dentro del log del S5** (bloques «Post-cierre I–VI»,
  l. 627–1190 de `SPRINT_005-implementation-log.md`); no existe
  `SPRINT_006-implementation-log.md`. _Decisión propuesta: NO se parte el archivo_ (romper la
  traza histórica es peor que la anomalía); el summary del S6 declara dónde está su bitácora y
  el hecho queda como sugerencia al método —figura «mejora fuera de sprint»—, que la planeadora
  ya tiene en su batch G-Metodo.

### 🟢 BAJO

- **B1 · `fichaTecnica.detalleEyebrow`** («Ficha completa» / «Full card»,
  `messages/es.json:253` y `messages/en.json:253`) sin un solo lector. _Ajuste:_ borrar las dos
  líneas. _Pago: fase 5 del S7._
- **B2 · `.claude/commands/deploy-check.md` local desactualizado** (2 691 B, 2026-07-11) frente
  al del kit (10 542 B, v1.24.0): le falta, entre otras cosas, la cláusula de que el barrido de
  cero enlaces corre **después del último `git add`** — precisamente la lección que el S6 aprendió
  con la fuga de `.lighthouseci/`. _Ajuste:_ copiar el del kit. _Pago: fase 5 del S7, antes de
  correr `/deploy-check`._
- **B3 · El NS de la guía sigue en `s005d`** aunque el S6 existe como sprint. _No se renumera
  retroactivamente_ (borraría las casillas ya marcadas por el usuario sin ganar nada); el S7 salta
  a `s007` y el historial del pie lo declara.

---

## Veredicto de la Fase 1

**REQUIERE AJUSTES** — 1 Crítico · 4 Altos · 5 Medios · 3 Bajos.

Nada de lo encontrado pone en duda lo construido: el código del S5/S6 está sano, probado y con
sus gates demostrados en rojo. **Lo que falla es el cierre y el mapa:** un sprint sin summary,
una constitución que describe otro repo, una portada pública que habla de `create-next-app` y un
campo de contrato que 20 casas van a pagar sin recibir nada a cambio.

**Pagos propuestos en esta fase 0:** C1 · A1 · A2 · A3 · A4.
**Deuda con pago asignado dentro de este mismo sprint:** M1–M2 (fase 1) · M3–M4 (fase 2) ·
B1–B2 (fase 5). **M5 y B3 se resuelven declarándolos**, no cambiando archivos.

> **Aprueba la Fase 1 y fija el modelo de la Fase 2 con `/model`** — un modelo menor basta si
> sigue estos ajustes al pie. A4 necesita además tu decisión entre la opción 1 y la 2.
