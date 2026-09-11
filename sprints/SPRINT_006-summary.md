---
sprint: 006
app: hoja-de-vida
status: closed
opened: 2026-09-05
closed: 2026-09-06
branch: "mejora/menu-y-vitrina · mejora/vitrina-por-categorias · mejora/ficha-tecnica · mejora/bpmn-rotulos · mejora/proceso-opcional · chore/dependabot-ignora-mayores-rotos · chore/dependabot-menores-y-parches"
pr: "#11 · #12 · #13 · #15 · #16 · #18 · #19 (+ dependabot #8 y #17)"
retroactivo: true
---

# Sprint 006 Summary — CV Viva

> **Este summary es RETROACTIVO y hay que decirlo primero.** El sprint 006 se construyó
> **fuera de sprint**, dirigido directamente por el usuario en la sesión de la app los días
> 2026-09-05 y 06, sin orden de construcción de la planeadora. El trabajo se hizo con la traza
> completa —rama propia por cambio, PR con CI verde, dos ADR, bitácora y gates demostrados en
> rojo— pero **su bitácora vive dentro del log del S5** (bloques «Trabajo POSTERIOR AL CIERRE» y
> «Post-cierre I–VI», `sprints/SPRINT_005-implementation-log.md` l. 627–1190) y **su summary
> faltaba**: sin él, el sprint no estaba cerrado. Se escribe ahora, en la fase 0 del S7, con la
> auditoría retroactiva de `/audita-sprint` en la mano. Nada de lo que sigue se inventó: cada
> línea tiene su PR, su ADR o su bloque de bitácora.

## Outcome

**3/3 + higiene — SÍ.** La vitrina dejó de ser una lista de seis apps y pasó a ser un **portal
por frentes** con una **capa infografía** propia: cada pieza tiene su ficha técnica, con un
contrato publicado que otras casas ya pueden consumir. El menú dejó de prometer dos veces lo
mismo, y dependabot dejó de arrastrar semana a semana un mayor sin soporte.

## Qué se construyó

**1 · El menú de 9 destinos a 4, y «Apps» absorbida por la Vitrina** (PR #11).
Las cinco secciones del CV se agrupan en un desplegable «Hoja de vida»; quedan
`Hoja de vida ▾ · Vitrina · Roadmap · Contacto`. Ningún acceso perdido: las dos brochures
propias se alcanzan desde el bloque «De esta casa» al cierre de `/vitrina`. El hallazgo real no
fue el apiñamiento sino que **dos etiquetas prometían lo mismo**: «Apps» llevaba a esta misma
página y a dos exploraciones sin producto; «Vitrina», a seis apps construidas. _Un ADR puede
tener razón sobre los datos —ADR-013 la tenía— y seguir dejando la interfaz mintiendo._
Guardas nuevas + `tests/e2e/nav-header.spec.ts`.

**2 · La vitrina se reparte en CUATRO FRENTES** (PR #12, **ADR-015**).
`/vitrina` es el portal con una caja por frente (Apps · Agentes especializados · Investigaciones
· Tableros de datos — sin marca de herramienta, decisión del usuario); `/vitrina/apps` es el
escaparate y cada app vive en `/vitrina/apps/<slug>`. Los tres frentes nuevos tienen página
genérica «en preparación» con lista de espera **sin fecha**. Contenido en `data/vitrina.yaml`
(Zod, bilingüe): agregar o editar un frente es editar el YAML. **La cuenta de piezas no se
escribe a mano** — apps la toma de los exports, los frentes en preparación tienen cero por
definición: «ninguna cifra sin procedencia» se extendió de las métricas a la cuenta de piezas.

**3 · La FICHA TÉCNICA: la capa infografía, con contrato y motor BPMN** (PR #15 + #18 + #19,
**ADR-016**). `/vitrina/apps/<slug>` es ahora la ficha técnica —siete bloques en orden fijo:
titular de valor · 3–5 cifras con procedencia · para quién · cómo funciona en BPMN · qué tiene ·
límites y nunca · dónde está · cierre— y el detalle del S5 baja a `/vitrina/apps/<slug>/detalle`.
**Un solo contrato Zod y un solo renderizador**: el componente pinta `fichaTecnicaSchema`, no un
tipo de pieza. Las apps se ARMAN de export + complemento (`data/fichas/<slug>.yaml`,
`procedencia: cv-viva`, declarada en pantalla); los otros frentes llegarán como JSON completo.
**Contrato publicado DESDE el Zod** en `docs/contrato-ficha-tecnica/` (schema + ejemplo real
generados por el mismo test que exige que coincidan · `CLAVE-VISUAL.md` · referencia).
**Motor BPMN propio, puro y probado** (`src/lib/vitrina/bpmn.ts`): pool, carriles,
inicio/tarea/decisión/fin, retornos por abajo, anotaciones numeradas, eventos de enlace por
filas. El PR #18 le enseñó a no pisarse los rótulos con cinco invariantes geométricas probadas
sobre los seis procesos reales. **v1.1.0 (PR #19, orden directa del usuario): el proceso BPMN es
OPCIONAL** — si la pieza no lo trae, la sección no existe y las demás se renumeran.

**4 · Higiene de dependencias, de raíz** (PR #13 + #16). El lote semanal solo lleva **minor y
patch** (`update-types` en el grupo); los mayores llegan sueltos, uno por dependencia, cuando el
cupo está libre. Se demostró que **el `ignore` del archivo NO es barrera**
(`@dependabot show <dep> ignore conditions` devolvió `[]`): se conserva, pero no se confía en él.
Invariantes vigiladas por `tests/unit/dependabot-config.test.ts`. Seis vulnerabilidades altas
cerradas (`fast-uri`, `browserslist`); lote de 33 bumps (#17) y 4 de actions (#8) mergeados.

## DoD — checklist (los 6+1 estándares)

| Estándar           | Estado | Evidencia                                                                                                                                                                                                                |
| ------------------ | ------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| **Testing**        | ✅     | 246 unitarias / 246 · cobertura 93,24 % stmts (`lib/vitrina` 96,19 %; `bpmn.ts` 97,6 % con 40 pruebas) · e2e de vitrina, nav-header, axe · **regla 14 cumplida en los cuatro bloques**, cada gate con su rojo registrado |
| **CI/CD**          | ✅     | Todo por PR; el PR #11 abrió con `quality: fail` y tres jobs `skipping` — el modo de falla que la regla 14 nombra — y se cerró con conclusión propia en cada check                                                       |
| **Observabilidad** | ✅     | Sin endpoints nuevos: la vitrina es SSG puro. Sin cambios                                                                                                                                                                |
| **Seguridad**      | ✅     | `pnpm audit` con 0 altas y 0 críticas tras cerrar las seis · sin secretos en el diff · cero PII                                                                                                                          |
| **Performance**    | ✅     | Lighthouse con portal, escaparate, ficha y detalle dentro del presupuesto (`perf-budget.json`)                                                                                                                           |
| **UX + A11y**      | ✅     | axe 0 violaciones sobre las 20 rutas de la vitrina (×2 idiomas) · dos hallazgos reales corregidos: `ink-3` no alcanza contraste de texto y una región con scroll necesita foco                                           |
| **IA embebida**    | n/a    | El sprint no toca `lib/ia/`                                                                                                                                                                                              |

**Gates ⭐ del usuario:** DIFERIDOS (sprint intermedio del ciclo H2). Guía **v5** acumulativa,
58 pruebas, gate mínimo ⭐ de 14 → **17** (3 nuevas: el juicio sobre el contenido de los tres
frentes, el juicio del proceso BPMN y la aprobación visual de la infografía). Contrapesos
cumplidos: e2e de `reduced-motion` y pasada de capturas del builder.

## Métricas técnicas

| Métrica                | Valor                                                                               |
| ---------------------- | ----------------------------------------------------------------------------------- |
| Rutas SSG nuevas       | portal + escaparate + 6 fichas técnicas + 6 detalles + 3 frentes, ×2 idiomas        |
| Unitarias              | 246 (20 archivos)                                                                   |
| Cobertura global       | 93,24 % stmts · 85,28 % branches · 95,04 % funcs                                    |
| Contrato ficha técnica | v1.0.0 → **v1.1.0** (proceso opcional), publicado como JSON Schema generado del Zod |
| Motor BPMN             | 40 pruebas, 5 invariantes geométricas sobre los 6 procesos reales                   |
| Barrido cero enlaces   | vacío · `homepage` del repo vacío                                                   |

## Decisiones no anticipadas

- **ADR-015 — La vitrina por frentes.** Portal + espacio propio por frente (elegida con el
  usuario entre dos opciones) en vez de una sola página con cuatro bloques. Incluye la regla
  dura: **un frente no puede declararse `abierta` sin una fuente de piezas que lo renderice** —
  el build rompe nombrando al culpable.
- **ADR-016 — La ficha técnica y el motor BPMN.** Un contrato, un renderizador, para cualquier
  frente; el proceso se genera desde datos y nunca se dibuja a mano. El detalle del S5 no se
  pierde: baja un nivel.

## Bugs + resoluciones

| Qué                                                                                                                   | Cómo se resolvió                                                                                                                                                                                                                                                           |
| --------------------------------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Fuga de artefactos:** 9,2 MB de `.lighthouseci/` entraron a `main` en el PR del S5                                  | Fuera del índice y al `.gitignore`. Ninguna URL propia se filtró, pero el gate de cero enlaces **gritaba en falso en cada corrida** — y un gate que grita en falso deja de leerse. Causa: el barrido corrió ANTES del último `git add`, y `git grep` solo ve lo versionado |
| El comentario que documentaba ese arreglo citaba el dominio **literal** y volvía a disparar el barrido sobre sí mismo | Reescrito con el patrón sin el literal (clase de carácter)                                                                                                                                                                                                                 |
| Seis vulnerabilidades altas nuevas, publicadas después del cierre del S5                                              | `fast-uri` a `^3.1.6` y `browserslist` a `^4.28.7`. La trampa: un rango abierto no protege si el lockfile no se vuelve a resolver, y la CI instala con `--frozen-lockfile`                                                                                                 |
| `ink-3` usado como color de texto: 2.7:1 sobre `paper-0`                                                              | Regla nueva en `design-system.md`: el mínimo para texto es `ink-2`                                                                                                                                                                                                         |
| El contenedor del diagrama BPMN en móvil desplaza en horizontal sin poder recibir foco                                | `tabIndex=0` + `role="region"`. Solo falla en el proyecto móvil — la razón de tener dos                                                                                                                                                                                    |
| Rótulos del BPMN pisándose en DS y Nutri-Kids (reportado por el usuario con capturas)                                 | Se corrigió **la regla del motor, no el síntoma**: cinco invariantes geométricas nuevas probadas sobre los seis procesos reales. La primera versión de la corrección dejó 4 pruebas en rojo — decidió la invariante, no el ojo                                             |

## Qué salió bien / qué generó fricción

**Bien**

- **La regla 14 se respetó sin orden que la exigiera.** Cuatro bloques, cuatro demos en rojo, cada
  una nombrando su archivo y su campo. Es lo que permite auditar este sprint hoy.
- **Corregir la regla, no el síntoma.** El bug de los rótulos BPMN se cerró con invariantes
  geométricas que ahora vigilan los seis procesos; el arreglo cosmético habría durado un sprint.
- **El contrato cumplió su promesa antes de tener consumidor:** publicado desde el Zod, con el
  test que rompe si el JSON Schema se desvía. El S7 lo estrena con 20 fichas de otras casas.

**Fricción**

- **Cuatro trabajos seguidos sin orden de construcción.** Se hizo bien, pero la traza dependió de
  que la bitácora del sprint anterior siguiera abierta, y el cierre —orden, sprint, summary,
  retro— quedó sin hacer del lado de la planeadora hasta que alguien lo notó.
- **El summary faltó durante todo el intervalo**, y con él la retro. Este archivo lo paga tarde.
- **`/audita-sprint` no corrió** (tampoco en el S5). Se pagó retroactivamente en la fase 0 del S7.

## Auditoría retroactiva (`/audita-sprint`, fase 0 del S7)

Corrida sobre `main` en `755f98d`. Veredicto: **requiere ajustes**. Cobertura de alcance
**3/3 outcomes completos**; el código está sano; **lo que fallaba era el cierre y el mapa**.

| Sev.     | Hallazgo                                                                                                                                                      | Pago                                                                 |
| -------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------- | -------------------------------------------------------------------- |
| 🔴 C1    | El S6 no tenía summary ⇒ no estaba cerrado                                                                                                                    | **Este archivo**                                                     |
| 🟠 A1    | El `CLAUDE.md` no nombraba `data/vitrina.yaml`, `data/fichas/`, `src/lib/vitrina/`, `docs/contrato-ficha-tecnica/`, `design-sync/` ni las rutas de la vitrina | Mapa reescrito                                                       |
| 🟠 A2    | Faltaban el delta kit v1.25.0 (el rojo en el MISMO commit) y la regla del canal de contenido                                                                  | Ambas añadidas                                                       |
| 🟠 A3    | El `README.md` seguía siendo el boilerplate de `create-next-app`                                                                                              | Reescrito                                                            |
| 🟠 A4    | `pieza.sellado_en` era campo REQUERIDO del contrato **sin un solo lector**                                                                                    | Se le dio lector (chip de sello en la cabecera, con su e2e)          |
| 🟡 M1–M4 | Slugs duplicados y archivo≠slug no vigilados · `schema_version` de la ficha sin puerta de mayor · ENOENT crudo sin carpeta                                    | Deuda con pago asignado en las fases 1 y 2 del S7                    |
| 🟡 M5    | La bitácora del S6 vive dentro del log del S5                                                                                                                 | **No se parte** (romper la traza histórica es peor); se declara aquí |
| 🟢 B1–B3 | Clave i18n huérfana · `/deploy-check` local atrasado frente al kit · el NS de la guía sigue en `s005d`                                                        | B1–B2 en la fase 5 del S7; B3 se declara, no se renumera             |

## Sugerencias de mejora al método

1. **Figura de «mejora fuera de sprint»** con traza mínima propia (rama `mejora/…`, ADR si
   decide, bloque de bitácora, PR) y registro retroactivo en la planeadora. Pedida tres veces
   desde este sprint: ya no es una sugerencia, es una necesidad.
2. **`/deploy-check`:** el barrido de cero enlaces debe correr **sobre el árbol que se va a
   subir, después del último `git add`** — tal como está redactado, un artefacto generado durante
   el propio check entra sin que nadie lo vea.
3. **Kit — `gitignore.plantilla`:** le falta `.lighthouseci/`.
4. **Kit — `dependabot.yml`:** grupo con `update-types: [minor, patch]`, mayores sueltos y test de
   invariantes como pieza del kit.
5. **Kit — molde «capa infografía»:** el contrato `ficha-tecnica` v1.1.0 al lado del molde del
   brochure, para cualquier casa productora.
6. **Contrato `brochure-export` v1.1.0:** que cada app declare su propio `proceso`, `titular`,
   `limites` y `nunca` (hoy los declara CV Viva y lo dice en pantalla).
7. **Regla general de la vitrina:** «ninguna cifra sin procedencia» se extiende a la **cuenta de
   piezas** de un frente.

## Deuda técnica aceptada

| Qué                                                                                                   | Por qué                                                                         | Pago                    |
| ----------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------- | ----------------------- |
| Los tres frentes nuevos sin renderizador de piezas                                                    | ADR-015 no lo anticipa a propósito: cada frente necesitaba su contrato de datos | **S7** (en curso)       |
| El frente apps sigue armando la ficha de export + complemento en vez de consumirla de `content/apps/` | La planeadora empezó a administrarlas el 2026-09-06                             | **S8**                  |
| `design-sync/` sin publicar (`lastPublished: null`)                                                   | La publicación es obligatoria al **cierre de ciclo**, no en cada sprint         | Cierre de H2            |
| Hallazgos M1–M4 y B1–B2 de la auditoría                                                               | No son de producto y su sitio natural son las fases del S7                      | **S7**, fases 1 · 2 · 5 |
| 4 vulnerabilidades moderadas transitivas de herramienta                                               | Sin parche aguas arriba                                                         | Se revisan cada lote    |
| Iconos de grupo genéricos para piezas no-app                                                          | El icono está clavado por slug de app; el fallback ROMBO ya existe              | **S8**                  |

## Archivos clave

1. `decisions/015-vitrina-por-frentes.md` · 2. `decisions/016-ficha-tecnica-y-motor-bpmn.md`
2. `data/vitrina.yaml` · 4. `src/lib/vitrina/ficha-tecnica/schema.ts` (el contrato)
3. `src/lib/vitrina/bpmn.ts` (el motor) · 6. `src/components/vitrina/ficha-tecnica.tsx`
4. `src/lib/vitrina/categorias.ts` · 8. `docs/contrato-ficha-tecnica/CLAVE-VISUAL.md`
5. `tests/unit/bpmn.test.ts` · 10. `tests/unit/dependabot-config.test.ts`

## Cómo probar

```bash
pnpm install
pnpm test                 # 246 unitarias con cobertura
pnpm build && pnpm start  # y abrir /es/vitrina
pnpm test:e2e             # vitrina · nav-header · axe (chromium + móvil)
```

En el navegador: `/es/vitrina` (el portal, cuatro cajas) → `Apps` (el escaparate) → cualquier app
(su **ficha técnica**, con el proceso en BPMN) → «Ver la ficha completa» (el detalle del S5) ·
`/es/vitrina/investigaciones` (un frente en preparación, sin fecha prometida). La guía de prueba
paso a paso, con su gate ⭐, está en `docs/GUIA-DE-PRUEBA.html` (v5).
