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

---

## AUDITORÍA RETROACTIVA S5 + S6 — FASE 2 (pagos)

**Fase 1 APROBADA por el usuario** (2026-09-06). **A4 decidido: opción 1** — darle lector al
campo. Se pagan C1 · A1 · A2 · A3 · A4; M1–M4 y B1–B2 quedan como deuda con pago asignado
DENTRO de este mismo sprint; M5 y B3 se resuelven declarándolos.

### C1 · El sprint 006 queda cerrado

`sprints/SPRINT_006-summary.md` escrito con la plantilla del CLAUDE.md (12 secciones), armado
**solo** desde los bloques «Trabajo POSTERIOR AL CIERRE» y «Post-cierre I–VI» del log del S5
(l. 627–1190), los PR #11–#19 y esta auditoría. Declara en su primer párrafo que es retroactivo
y por qué. Registra la auditoría con sus ocho hallazgos y sus pagos, las siete sugerencias al
método y la deuda aceptada con su sprint de pago.

> **Verificación:** `status: closed` en el frontmatter · 12 secciones `##` · ningún dato sin su
> PR, ADR o línea de bitácora de respaldo.

### A1 · El mapa del CLAUDE.md vuelve a describir este repo

Añadidos al árbol de § Estructura: `src/app/[locale]/vitrina/` con sus cuatro rutas,
`src/lib/vitrina/` con sus siete piezas, `data/vitrina.yaml`, `data/fichas/`, `content/<frente>/`,
`design-sync/` y `docs/contrato-ficha-tecnica/`. Las dos entradas que aún no existen
(`content/<frente>/` y `lib/vitrina/piezas.ts`) van marcadas «S7» — nacen en este sprint.

> **Verificación:** todo path nombrado que ya debía existir existe (comprobado uno a uno, sin
> salida); `git grep -c "vitrina" CLAUDE.md` = 9.

### A2 · Los dos deltas que faltaban

- **Regla 14 · kit v1.25.0:** párrafo nuevo — _el rojo VIAJA EN EL MISMO COMMIT que introduce el
  gate_. Un gate agregado hoy y demostrado mañana pasa una revisión entera, a veces un merge, sin
  que nadie haya visto que sabe fallar; y si la demo se aplaza, se olvida.
- **§ Patrones de dominio:** dos bullets nuevos — **canal de contenido de la vitrina** (quién
  produce qué ficha, cómo llega, y la regla dura «las fichas de otras casas NO se editan aquí, ni
  para que quepan») y **un solo contrato, un solo renderizador**.

> **Verificación:** `grep -c "MISMO COMMIT" CLAUDE.md` = 1 · `grep -c "CANAL DE CONTENIDO"` = 1.

### A3 · El README deja de hablar de otro proyecto

`README.md` reescrito entero (66 líneas, español): qué es CV Viva, cómo está hecha, cómo correrla
en local, dónde está cada cosa y cómo alimentarla. **Regla 16 aplicada:** ni una URL de
producción o preview; el único `http://` es `localhost:3000`, que no es un destino publicable.

> **Verificación:** `grep -c "create-next-app" README.md` = 0 · `grep -c "app/page.tsx"` = 0 ·
> barrido de dominios de despliegue sobre el archivo, vacío.

### A4 · `pieza.sellado_en` gana su lector (opción 1, decidida por el usuario)

**El dato que lo decidió** — medido sobre las 20 fichas que entran en este sprint: **5 declaran
fecha de sello y las 5 repiten esa misma fecha en un hito de texto libre**; **15 declaran `null`**
obligatoriamente; **0 contradicciones hoy**, pero nada las impedía: si el campo y el hito
discreparan, la vitrina enseñaría el hito y el desacuerdo no lo vería nadie.

**Qué se hizo:** un chip nuevo en la cabecera de la ficha —`data-sellado-en`, texto
«Sellada el {fecha}»— que se pinta **solo** si la pieza está sellada y trae fecha. Claves i18n
`fichaTecnica.selladaEl` en ES y EN. Con esto la fecha de sello deja de depender de que la casa
productora se acuerde de escribir un hito con la etiqueta correcta: pasa a ser un dato **del
contrato**, con su sitio fijo.

**Por qué NO se borró el campo** (sería lo más limpio): `fichaTecnicaSchema` es `.strict()`, así
que quitarlo dejaría inválidas las 20 fichas —las 5 con fecha y las 15 con `null`— y arreglarlas
exigiría editarlas. No se editan, ni para que quepan.

#### Regla 14 + regla 15 (kit v1.25.0) — el gate nuevo, demostrado en ROJO en este mismo commit

El gate es la aserción nueva de `tests/e2e/vitrina.spec.ts` («cada app tiene su ficha técnica…»):
si la pieza está sellada, el chip existe con la fecha del export; si no lo está, el chip **no**
existe. **Cambio deliberado:** retirar el bloque del chip de `ficha-tecnica.tsx`. Rojo a la
primera, nombrando a la app y a la fecha esperada:

```
✘ [chromium] › vitrina.spec.ts:262 › cada app tiene su ficha técnica…
  Error: expect(locator).toHaveAttribute(expected) failed
  Locator: locator('[data-ficha-tecnica="habla"]').locator('[data-sellado-en]')
  Expected: "2026-08-08"
  Error: element(s) not found
```

Restaurado el bloque, la prueba vuelve a verde. El rojo y el arreglo viajan en el mismo commit,
que es exactamente lo que el delta v1.25.0 vino a exigir.

### Lo que NO se pagó aquí, y por qué

| Hallazgo                                                                                      | Por qué se aplaza                                                                                                                                                                                                 | Pago                            |
| --------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------- |
| M1 · slugs duplicados no vigilados · M2 · archivo ≠ slug                                      | Tocar `lib/vitrina/loader.ts` en una fase sin un solo test de producto es el cambio que se cuela sin red; además el test de contenido de la fase 1 ya exige slugs únicos globales y la invariante se extiende ahí | **Fase 1**                      |
| M3 · `schema_version` de la ficha sin puerta de mayor · M4 · ENOENT crudo sin carpeta         | Su sitio natural es el loader de piezas, que nace en la fase 2                                                                                                                                                    | **Fase 2**                      |
| B1 · clave i18n `detalleEyebrow` huérfana · B2 · `/deploy-check` local atrasado frente al kit | Limpieza de cierre; B2 debe estar al día **antes** de correr el check                                                                                                                                             | **Fase 5**                      |
| M5 · la bitácora del S6 vive dentro del log del S5                                            | Partir el archivo rompería la traza histórica, que vale más que la anomalía                                                                                                                                       | Declarado en el summary del S6  |
| B3 · el NS de la guía sigue en `s005d`                                                        | Renumerar retroactivamente borraría casillas ya marcadas por el usuario a cambio de nada                                                                                                                          | Declarado; el S7 salta a `s007` |

### Estado tras los pagos

`pnpm typecheck` limpio · `pnpm lint` limpio · **246/246 unitarias** · e2e de la ficha técnica en
verde con la aserción nueva · barrido de cero enlaces vacío.

### Regla 15 (bundle del design system) — verificada, sin delta

`design-system.md` sí describe la cabecera de la ficha, así que se actualizó: el chip de sello
queda documentado al lado del de estado. El bundle `design-sync/…/ficha-tecnica-y-bpmn.html`
documenta **tres piezas** de la ficha —titular de valor, cifra con procedencia y el proceso
BPMN— y **no** la tira de chips de cabecera; como espejo 1:1 de lo que documenta, no le
corresponde delta por este cambio. Se declara para que la ausencia sea una decisión y no un
olvido.

---

## Fase 1 — reparto, escritura y validación de las 20 fichas

### El reparto, leído de `pieza.frente` (no de mi criterio)

**13 agentes · 7 investigaciones.** Coincide con el reparto declarado en el plan aprobado.
Destino: `content/<pieza.frente>/<pieza.slug>.ficha-tecnica.json`.

### La codificación: restaurar no es editar — y mi primer intento estuvo mal

Las 20 llegaron con el texto **mal decodificado**: UTF-8 leído como latin-1 (`evaluación` →
`evaluaciÃ³n`). Los **bytes estaban intactos**, así que la vuelta
`.encode("latin-1").decode("utf-8")` los restaura **exactamente**: no es interpretar, es deshacer.

**Mi primer intento se equivocó y vale registrarlo.** Detecté el mojibake buscando caracteres
sospechosos (`Ã`, `Â`, `â€`) y reparé solo las cadenas que los tuvieran: 908 campos. Al medir los
campos al borde del límite apareció `«La tripleta conductorâbusâruta»` — una raya larga (`–`,
`E2 80 93`) cuyo mojibake en latin-1 es `â` + dos caracteres de control invisibles, que **ninguno
de mis patrones contenía**. La heurística de caracteres era el error: el documento entero viene
mal decodificado, así que la regla correcta es **intentar la reparación en toda cadena** y
quedarse con ella solo si tiene éxito (una cadena ya correcta falla al codificar a latin-1 y se
deja intacta). Rehecho así: **915 campos** restaurados, 7 más que con la heurística.

> **Verificación dura:** cero caracteres de control C1 (`0x80`–`0x9F`) en los 20 archivos. Si
> quedara uno, la reparación estaría incompleta. `«La tripleta conductor–bus–ruta»` ✅

### Las 20, validadas ANTES de escribirlas

Validadas contra `fichaTecnicaSchema` en un directorio de trabajo, fuera del repo: **las 20 pasan
el contrato v1.1.0 sin tocar un solo campo.** Ninguna hubo que reportar, ninguna hubo que esperar.
**Cero enlaces, cero DOI, cero correos, cero nombres de personas.** Solo entonces se escribieron
en `content/`.

**193 campos quedan a 10 caracteres o menos de su límite** — ninguno lo excede. Los más apretados,
al carácter: `promesa.intro` de `atraccion-en-frio` **400/400**, `stack[].papel` de
`estudio-cine` y de `taller-de-animacion` **160/160**, `titular` de `constructor-tableros-powerbi`
**240/240**, `cifras[].etiqueta` de `espectro-agencia` y `fatiga-laboral` **60/60**,
`promesa.tagline` de `reemplazo-erp` **80/80**. Se anota porque una casa productora que reescriba
uno de esos textos «un poquito» rompe la publicación: el margen es cero.

| frente          | pieza                          | estado  | proceso | sha256 del archivo | huella de contenido |
| --------------- | ------------------------------ | ------- | ------- | ------------------ | ------------------- |
| agentes         | `ai103-foundry`                | inicial | sí      | `32369e99f186015f` | `82fa4dc39fd59d13`  |
| agentes         | `asistente-posgrado`           | inicial | sí      | `8ed8193f73fcdc2f` | `48a22055ad839fd8`  |
| agentes         | `atraccion-en-frio`            | inicial | sí      | `8caa5617419d9617` | `03eb23baffd5ad38`  |
| agentes         | `biblioteca-tendencias-genai`  | inicial | sí      | `dc6cb22bd38238b1` | `7f66fa9803e971b7`  |
| agentes         | `constructor-tableros-powerbi` | sellado | sí      | `7e2548b009ad4649` | `743952f212bdd5b5`  |
| agentes         | `estudio-cine`                 | sellado | sí      | `3b0d098f0259ce2a` | `ab3f5689359449d0`  |
| agentes         | `experto-fiscal`               | inicial | sí      | `805b751016dbdaff` | `07044b787d6d8e59`  |
| agentes         | `experto-iso42001`             | inicial | sí      | `70e3e003373a45a7` | `57146874da354408`  |
| agentes         | `harness-design-science`       | inicial | sí      | `ac700523c086ec7b` | `42f5f7f191e6514b`  |
| agentes         | `harness-paper-computacional`  | sellado | sí      | `8e4ba906eaea609b` | `02265d97c1008ce0`  |
| agentes         | `hiring-copilot`               | inicial | sí      | `23afec9ffbabaff1` | `2e4b47020aba0149`  |
| agentes         | `hr-develop-ai-apps`           | sellado | sí      | `a2274ffedd09239b` | `a0bb4cc706438876`  |
| agentes         | `taller-de-animacion`          | sellado | sí      | `e25880f45eada4f6` | `778924fce50b66d4`  |
| investigaciones | `arkhe`                        | inicial | —       | `1cbac2bc40e04431` | `153070ca9b3c1af1`  |
| investigaciones | `asignacion-con-fallas`        | inicial | —       | `8bd68b8570ecedd3` | `d074fb8d1256e73a`  |
| investigaciones | `convoyes-de-buses`            | inicial | —       | `4f0a7a4ba79bbc4a` | `4f1b4d4c460247af`  |
| investigaciones | `espectro-agencia`             | inicial | —       | `f238fa48d849aa1d` | `450c2a470e6ca9d0`  |
| investigaciones | `fatiga-laboral`               | inicial | —       | `ee59ebffd46df828` | `4819d701908d9a5d`  |
| investigaciones | `forja`                        | inicial | —       | `a9f39e98a25a241b` | `ad5b245b0998231c`  |
| investigaciones | `reemplazo-erp`                | inicial | —       | `574f4d32e0f03323` | `92ddc54702749cf9`  |

La **huella de contenido** es `sha256` del JSON canónico (claves ordenadas, sin espacios): no
depende del formato, así que puedes reproducirla desde tu archivo de origen aunque tenga otra
indentación —

```
python3 -c "import json,hashlib,sys;print(hashlib.sha256(json.dumps(json.load(open(sys.argv[1],encoding='utf-8')),ensure_ascii=False,sort_keys=True,separators=(',',':')).encode()).hexdigest()[:16])" <tu-archivo>.json
```

Si tu origen trae el mojibake, la huella **no** coincidirá — es la prueba de que lo único que
cambió aquí fue la codificación.

### El gate del canal de contenido — `tests/unit/content-fichas.test.ts` (62 casos)

Cuatro invariantes que ninguna revisión a ojo sostiene con 20 archivos, y menos con 200:
el **contrato**; **archivo = slug y carpeta = frente** (la ruta pública sale del contenido, no del
nombre); **slugs únicos GLOBALES**, incluidos los exports de `content/vitrina/` — que es el pago
de los hallazgos **M1 y M2** de la auditoría; y **cero enlaces y cero DOI**, que es donde se cuela
una referencia bibliográfica.

#### Regla 14 + regla 15 — cinco mutaciones, cinco rojos, en este mismo commit

| #   | Mutación deliberada                                        | Lo que dijo el rojo                                                                                                       |
| --- | ---------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------- |
| 1   | `forja.ficha-tecnica.json` → `la-forja.ficha-tecnica.json` | `el archivo debería llamarse «forja.ficha-tecnica.json» — la ruta pública sale del contenido, no del nombre`              |
| 2   | `arkhe` movida a `content/agentes/`                        | `la ficha declara «pieza.frente: investigaciones» pero está en content/agentes/`                                          |
| 3   | Fixture con `slug: "habla"`, el de una app                 | `slug repetido «habla»: … y content/vitrina/habla.brochure-export.json (una app). Chocarían en la vitrina.`               |
| 4   | Un DOI en una cifra de `convoyes-de-buses`                 | `trae «10.1016/»: la producción se MUESTRA, jamás se entrega (regla 16)`                                                  |
| 5   | `promesa.para_quien` de `hiring-copilot` pasado de 400     | `promesa.para_quien: Too big: expected string to have <=400 characters` + `⚠ Las fichas de otras casas NO se editan aquí` |

Todo restaurado y **verificado byte a byte** contra un respaldo previo (`diff -r`, idéntico).

### Contrato v1.2.0 — ADITIVO

- **`procedencias` gana `"planeadora"`** — la casa que administra y cura las fichas de las apps
  puede firmar el proceso que declara (pedido explícito de `vitrina/README.md` de la planeadora).
  El mensaje de error del esquema ya no lleva la lista a mano: la deriva del propio enum.
- **`docs/contrato-ficha-tecnica/plantilla.ficha-tecnica.json`** (O3): el esqueleto que rellena
  cualquier casa productora, con cada campo y su límite dentro del marcador
  (`"<texto · 1–240 caracteres>"`, `"<uno de: inicial | sellado>"`). **Se DERIVA del JSON Schema,
  que se deriva del Zod** — escrita a mano se habría desviado en el primer cambio, y una plantilla
  desviada enseña a producir fichas inválidas. Los arreglos emiten tantos elementos como exige el
  mínimo (3 cifras, 3 hitos, 2 límites), así que se rellena directo.
- `armar.ts` pasa a escribir `schema_version: "1.2.0"`: esta casa produce contra la versión
  vigente. **Las 20 fichas entregadas se quedan en `1.1.0` y siguen siendo válidas** — v1.2.0 es
  aditivo y no se toca una ficha ajena por una etiqueta de versión.
- `CLAVE-VISUAL.md` y el `README` del contrato a v1.2.0; schema y ejemplo regenerados con
  `pnpm contrato:ficha`.

**Demo 6 en rojo (mismo commit):** quitada la clave `proceso` de la plantilla publicada, el test
`plantilla.ficha-tecnica.json coincide con el Zod de la app` falló con el diff exacto — y de paso
enseñó que el enum nuevo ya viajó: `"procedencia_proceso": "<uno de: app | cv-viva | planeadora>"`.

### Estado al cerrar la fase

`pnpm typecheck` limpio · `pnpm lint` limpio · **309/309 unitarias** (21 archivos; eran 246 en 20)
· barrido de cero enlaces vacío sobre el árbol staged · `content/` sin una URL ni un DOI.

### Deuda de la auditoría pagada aquí

**M1** (slugs duplicados sin vigilar) y **M2** (nombre de archivo ≠ slug): pagados por el test de
contenido, que además extiende la invariante a `content/vitrina/` — donde nació el hallazgo.

---

## Fase 2 — el motor: loader genérico, frente abierto por piezas, cuenta medida

### `src/lib/vitrina/piezas.ts` — el hermano del loader de exports

Es el gemelo de `loader.ts`, y su diferencia resume el sprint: aquél ingiere los
`brochure-export.json` de las apps y **esta casa arma** la ficha con su curación; éste recibe la
ficha **ya completa**, producida por quien construyó la pieza. Un solo contrato, un solo
renderizador; nada específico por frente vive en el código.

- `getPiezas(frente)` · `getPieza(frente, slug)` · `frentesConPiezas()`.
- **El núcleo va separado de la IO** (regla 3): `parseFicha(raw, ruta)` es puro y no toca disco;
  `leerFicha` solo lee el archivo y lo llama. Por eso el fail-safe se puede probar de verdad, sin
  ensuciar `content/` durante los tests.
- **Orden explícito:** selladas primero, luego alfabético por nombre en `es-CO`. Nunca el orden
  del sistema de archivos, que cambia entre máquinas sin que nadie toque una línea.

### La regla del S6 se levanta POR FRENTE, y sale del esquema

Hasta ayer, «abierta» estaba reservada a `apps` con la condición escrita a mano en el
`superRefine` de `vitrinaSchema`. Ahora el criterio es **medido**: abre el frente que TIENE
piezas. Y por eso la regla **salió del esquema**: un esquema valida FORMA, y la forma no sabe qué
hay en disco. Vive en `parseVitrina(data, source, frentesConPiezas)`, con la lista como
**parámetro obligatorio y sin valor por defecto** — un default silencioso sería justo la puerta
que esta regla vino a cerrar. `getVitrina()` la calcula: `apps` por sus exports, los demás por sus
fichas. La lista se mide, nunca se escribe.

### La cuenta del portal, medida por frente

`categorias.ts` deja de responder «apps o cero»: cada frente cuenta lo que hay en `content/`.
Un frente del YAML que no exista en el contrato (`pieza.frente`) cuenta cero, y no por descuido —
ninguna ficha podría declararlo, así que no puede tener piezas. **La cuenta no depende del estado
del YAML:** hoy `agentes` está en preparación y ya tiene 13 piezas medidas; el portal las enseña
el día que el frente abra, no antes.

### Regla 14 + regla 15 — los cuatro gates, en rojo, en este mismo commit

| Gate                             | Mutación deliberada                           | Lo que dijo el rojo                                                                                                           |
| -------------------------------- | --------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------- |
| **Frente abierto exige piezas**  | `tableros: abierta` en `data/vitrina.yaml`    | `tableros: está marcada «abierta» y no tiene ni una pieza publicada… Frentes con piezas hoy: apps, agentes, investigaciones.` |
| **Cuenta medida**                | Sacar `experto-fiscal` de `content/agentes/`  | `expected 12 to be 13` en las dos pruebas que la miden                                                                        |
| **Orden determinista**           | Quitar del `sort` la regla «selladas primero» | `× el orden es explícito: selladas primero, luego alfabético es-CO`                                                           |
| **Loader fail-safe EN EL BUILD** | `cifras[1].fuente: "intuicion"` en `forja`    | ver abajo                                                                                                                     |

El cuarto es el criterio de aceptación nº 2 de la orden, así que se demostró contra el **build de
producción**, no contra un test:

```
✓ Compiled successfully in 1381ms
Error: Ficha inválida en content/investigaciones/forja.ficha-tecnica.json (contrato de la ficha técnica):
  - cifras.1.fuente: Invalid option: expected one of "medido"|"calculada"|"declarado"|"estimacion"
  ⚠ Las fichas de otras casas NO se editan aquí: se corrige en origen y se vuelve a entregar.
> Build error occurred
Error: Failed to collect page data for /[locale]/vitrina/[categoria]
```

El diagnóstico nombra **archivo, campo y vocabulario admitido**, y termina diciendo qué hacer: no
se arregla aquí. Todo restaurado y verificado con `git diff` vacío.

### Deuda de la auditoría pagada aquí

- **M3 · `schema_version` sin puerta de mayor.** `parseFicha` la revisa **antes** del esquema: una
  ficha `2.0.0` se rechaza con _«esta vitrina renderiza el mayor 1.x.x — un mayor distinto trae
  campos con otro significado»_, en vez del `no coincide con el patrón` del regex, que no le dice
  nada a nadie. Reutiliza `versionCompatible` del loader de exports: una sola regla de mayor para
  las dos ingestas.
- **M4 · ENOENT crudo.** Un frente sin carpeta devuelve `[]`. No es un repo roto: es un frente que
  empieza. Lo que sí rompe es declararlo abierto, y eso lo vigila `parseVitrina`.

### Estado al cerrar la fase

Las **20 piezas cargan** y el motor las ordena. `data/vitrina.yaml` sigue **sin abrir ningún
frente nuevo**: eso es decisión de las fases 3 y 4, después de que tú mires. `pnpm typecheck` y
`pnpm lint` limpios · **324/324 unitarias** en 22 archivos (eran 309 en 21) · `pnpm build` verde.

---

## Fase 3 — la UI de investigaciones (y la mirada M1)

### `MuestraPieza`: la tarjeta de algo que no tiene pantalla

Es la hermana de `MuestraApp` y se parece a ella en todo menos en una cosa: **una app se reconoce
por su pantalla, y aquí no hay pantalla**. Un agente vive en una terminal, una investigación es un
documento. Una maqueta inventada sería decorado — y decorado que insinúa un producto que no
existe. Lo que ocupa ese sitio es lo único que una pieza sin interfaz sí tiene y no se puede
fingir: **su titular de valor y sus tres primeras cifras con su procedencia**.

### Las rutas

- `[categoria]/page.tsx` **se bifurca por estado**: `abierta` ⇒ escaparate (hero + rejilla +
  cierre); `en-preparacion` ⇒ lo de siempre. `generateStaticParams` cubre todos los frentes menos
  `apps`, que gana por segmento estático. No hay que defenderse de un escaparate vacío: ese gate
  está aguas arriba, en `parseVitrina`, donde se puede arreglar.
- `[categoria]/[pieza]/page.tsx` rinde el **MISMO** `FichaTecnica`, **sin `hrefDetalle`**, con
  vecinas del mismo frente y miga al escaparate. Solo publica piezas de frentes ABIERTOS: las 13
  fichas de agentes ya están en `content/` y sus rutas **no existen** hasta que el frente abra.
- Claves i18n **neutras** (`escaparateCuenta`, `escaparateNota`, `volverAlFrente`,
  `vecinasDelFrente`, `piezaAnterior`, `piezaSiguiente`): la jerga de apps no viaja a otros frentes.
- `data/vitrina.yaml`: **investigaciones → `abierta`** (7 piezas). Sitemap y axe pasan a leer
  `content/<frente>/`, así que una ficha nueva entra sola a los dos. Lighthouse gana 2 URLs
  (el escaparate y una ficha): son plantillas, basta una de cada.

### Una función que se quedó sin llamador, borrada

Al bifurcar la ruta y cambiar el sitemap, `frentesEnPreparacion()` quedó **sin un solo consumidor
fuera de su propio test** — el mismo patrón que la auditoría cazó en el contrato con
`pieza.sellado_en`. Se borra. Su test se reemplaza por uno que comprueba el estado de los cuatro
frentes contra el YAML real y que ninguno abierto tiene cero piezas.

### Regla 14 + regla 15 — los gates nuevos, en rojo, en este mismo commit

| Gate                                            | Mutación deliberada                                            | Lo que dijo el rojo                                                                                                                                                 |
| ----------------------------------------------- | -------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **La renumeración sin proceso** (criterio nº 6) | `numerarSecciones` vuelve a numerar por posición fija          | `- "ft-02-arkhe"` / `+ "ft-05-arkhe"`: el hueco reaparece y la prueba lo ve                                                                                         |
| **axe en TODAS las rutas nuevas** (regla 9)     | La etiqueta de cifra de `MuestraPieza` en `text-ink-3` (2.7:1) | `✘ axe limpio en /es/vitrina/investigaciones` y `/en/…` — y **las fichas siguieron verdes**, porque no usan ese componente: el scan señaló exactamente dónde estaba |

### Un fallo mío en la prueba de cero enlaces

Mi primera versión de «CERO ENLACES en las rutas nuevas» miró `a[href]` de **toda la página** y
salió roja: el **pie** lleva a propósito los perfiles públicos de la persona, que no son producción
que se entregue. La prueba del S5 ya tenía resuelto el alcance correcto (`main a[href^='http']`) y
lo decía en su comentario. Ajustada a ese mismo alcance, más la comprobación de DOI sobre el texto
de `main` — que es lo que esta fase sí añade, porque una investigación es justo donde se cuela una
referencia bibliográfica.

### La pasada de capturas encontró una promesa falsa (y se arregló)

El contrapeso del gate diferido no es decorativo: mirando las capturas apareció que el subtítulo de
«Qué tiene» decía **«El detalle de cada una vive en la ficha completa»** también en una pieza
**sin** ficha completa. Una página no puede mandar al lector a un sitio que no existe. Clave nueva
`s03subSinDetalle`, que dice la cuenta y calla, elegida por `hrefDetalle`; y su aserción en el e2e
(`main` no contiene «vive en la ficha completa»).

### Estado al cerrar la fase

`pnpm typecheck` y `pnpm lint` limpios · **324/324 unitarias** · **e2e 169 pasan** en
`vitrina.spec` + `axe.spec` (chromium + móvil), con **14 rutas de pieza nuevas** en axe ×2 idiomas
· `pnpm build` verde: **76 páginas SSG** (eran 62).
