---
sprint: 005
app: hoja-de-vida
status: closed
opened: 2026-08-22
closed: 2026-08-23
branch: sprint-005/la-vitrina-de-los-seis
pr: <pendiente — se completa al abrirlo>
---

# Sprint 005 Summary — CV Viva

## Outcome

**Sí.** Las seis apps hermanas del portafolio están re-expresadas en el design system de CV Viva:
un escaparate en `/vitrina` y **una página propia por app**, alimentadas por sus
`brochure-export.json` sin una línea de contenido escrita a mano aquí.

## Qué se construyó

- **Ingesta de los 6 exports** (`content/vitrina/`, contrato v1.0.0) con validación Zod en build:
  un export malformado **rompe la publicación** nombrando archivo y campo. Los exports **no se
  editan aquí** — si uno miente, se corrige en su app de origen.
- **`/vitrina` — el escaparate:** seis muestras cortas (estado · ciclo · nombre · promesa · tira ·
  para quién · cuánto tiene construido). 2 421 px de página.
- **`/vitrina/<slug>` — la ficha completa, 12 páginas SSG** (6 apps × 2 idiomas) generadas desde
  los exports, con navegación entre vecinas y vuelta al índice.
- **Las cuatro capas del brochure** dentro de cada ficha: portada → «qué hace» en **tarjetas** →
  el detalle dentro → «lo fino» en acordeones.
- **Apertura por lectura** (banco §7, adoptada entera): una tarjeta está abierta exactamente
  mientras está a la vista; el toque la saca del automático para el resto de la visita.
- **27 capturas de las apps hermanas corriendo**, guiadas por un script re-ejecutable
  (`pnpm capturas:vitrina`) con datos sintéticos y **repintadas con los tokens de CV Viva**.
- **Tiras y firmas:** una tira esquemática por app y la **escena clímax de su brochure
  re-dibujada** con los tokens de esta página.
- **Reglas duras hechas visibles:** cero enlaces (se muestra la RAZÓN + CTA de lista de espera) ·
  toda cifra con su procedencia · las descartadas se muestran · el anclaje se declara.

## DoD — checklist

| Estándar           | Estado | Evidencia                                                                                                                                                                                                          |
| ------------------ | ------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| **Testing**        | ✅     | 174 unitarias (15 archivos) · **132 e2e** (`--grep-invert votación`), de las cuales **26 nuevas** de la vitrina · `lib/vitrina` 92,3 % de líneas · cobertura global 93,04 %                                        |
| **CI/CD**          | ✅     | `quality`, `e2e`, `integration` y `lighthouse` con las rutas nuevas añadidas al job                                                                                                                                |
| **Observabilidad** | ✅     | Sin endpoints nuevos: la vitrina es 100 % SSG y no toca red en runtime                                                                                                                                             |
| **Seguridad**      | ✅     | `pnpm audit --audit-level high` **limpio** (0 altas / 0 críticas) tras cerrar 19 · cero PII en las capturas (candado que aborta antes de escribir bytes) · barrido cero-enlaces limpio sobre todos los versionados |
| **Performance**    | ✅     | Lighthouse contra `perf-budget.json`: `/es/vitrina` 440 KB · `habla` 485 KB · `dash-agent-ai` 514 KB, contra un techo de 1 000 KB/ruta. LCP 3 356–3 437 ms bajo el tope de 3 850                                   |
| **UX + A11y**      | ✅     | **axe 44/44** (era 20): índice + las seis fichas × 2 idiomas × 2 viewports · tarjeta cerrada fuera del árbol de accesibilidad · teclado y `prefers-reduced-motion` con e2e propio                                  |
| **IA embebida**    | n/a    | El sprint no toca LLM. Regla 13 cumplida por construcción: la vitrina es código y datos, cero generativo                                                                                                           |

**Gate ⭐ del usuario:** pendiente sobre `docs/GUIA-DE-PRUEBA.html` v2 (14 pruebas · ~45 min).

## Métricas técnicas

| Métrica                                | Objetivo      | Resultado                        |
| -------------------------------------- | ------------- | -------------------------------- |
| Apps re-expresadas                     | 6             | **6**                            |
| Contenido escrito a mano en la vitrina | 0             | **0** — todo sale de los exports |
| Rutas nuevas SSG                       | —             | **14** (2 índices + 12 fichas)   |
| Peso por ruta                          | ≤ 1 000 KB    | **440–514 KB**                   |
| axe                                    | 0 violaciones | **0**, en 44 escaneos            |
| Enlaces a producción en el repo        | 0             | **0**                            |

## Decisiones no anticipadas

- **ADR-013 — La vitrina frente al showcase del S4.** Conviven separadas por naturaleza y sin
  puente de datos: `apps.yaml` describe _la casa_ (features que viven en esta misma página, con
  roadmap votable); los exports describen **seis apps hermanas** de otros repos. Cero slugs en
  común, así que no hay duplicación que sincronizar.
- **ADR-014 — El bucle ambiental de la firma clímax.** El design system veta las animaciones
  infinitas y la firma de Hablemos San late en bucle (su clímax _es_ la voz moviendo algo). Se
  declara la excepción con condiciones verificables —una por página, solo en la firma del clímax,
  solo con la tarjeta abierta, apagada entera bajo `prefers-reduced-motion`— en vez de dejar
  código que contradice al documento en silencio.

## Bugs + resoluciones

- **Ocho iconos invisibles con la CI en verde.** Cadena de dos causas: faltaba el `data-traza` que
  dispara el trazado, y el estado de reposo era `stroke-dashoffset: 1`. Arreglo: **el estado por
  defecto es el icono DIBUJADO**; el efecto vive entero dentro del `@keyframes`. Lección general
  del sprint: _lo que dependa de un disparo que puede no ocurrir acaba invisible, y verde_.
- **`pathLength` declarado como propiedad CSS.** Se ignora en silencio y los trazos salían como
  guiones de 1px. Es un **atributo SVG**.
- **Contraste 2,7:1 por `ink-3`** — tercera reincidencia. Corregido a `ink-2` y **comentado junto
  al token**, que es donde se mira antes de repetirlo.
- **`<details>` ocultaba contenido al scan de axe:** hueco de cobertura, no un falso negativo.
  Arreglado en el spec de forma genérica (se expande todo antes de analizar).
- **Bucle de scroll entre las tarjetas 06 y 07** (cazado por el usuario): la compensación del
  cierre por arriba restaba el alto perdido **a ciegas**, encima del ajuste que el navegador ya
  había hecho. Doble compensación → brinco arriba → reapertura → 260 pasos de rueda sin alcanzar
  el fondo. Arreglo **T7**: medir la deriva real de un ancla visible.
- **El badge de desarrollo de Next colado en las capturas** — sobrevivió dos intentos; se barre por
  lo único estable: es un _custom element_.
- **Capturas cortadas, y luego ilegibles.** Primero por no encuadrar el bloque entero; después,
  en nutri-kids, porque el `foco` casaba con el contenedor de toda la columna (1 472 px) y el
  ajuste anti-recorte encogía la app al 40 %.
- **Capturas rancias en el navegador durante ~1 hora.** La caché de imágenes de Next en dev
  (`.next/dev/cache/images`) cachea **por variante de `Accept`**: `curl` recibía la nueva (jpeg) y
  el navegador la vieja (webp). Diagnosticado interceptando los bytes reales.
- **El repintado no entraba, y dos morados sobrevivían.** El `<style>` de `addInitScript` no
  sobrevive a la hidratación de Next (medido: tras `networkidle` el token seguía siendo el suyo).
  Y los dos únicos elementos que resistían eran **exactamente** los dos con `transition-colors`:
  la foto los pillaba a media zancada del cambio de color.

## Qué salió bien / qué generó fricción

**Bien.** El contrato del export cumplió su promesa: **cero contenido escrito a mano** y una app
nueva entra dejando caer un archivo — página, sitemap, escaparate y scan de axe la recogen solos.
El script de capturas convirtió «unas imágenes» en un artefacto reproducible con candado de
privacidad. Y el patrón de apertura por lectura se adoptó entero, sin re-derivarlo por rondas.

**Fricción — la mía, y es la lección del sprint.** Dos objeciones estructurales del usuario en el
gate M2 nacieron del mismo error: **decidir en silencio**. Apilar seis fichas en una sola ruta
(22 784 px de documento) y aceptar seis marcas ajenas dentro del design system fueron decisiones
de diseño que ni la orden pedía ni yo puse sobre la mesa. Ninguna era un descuido de
implementación: eran decisiones, tomadas sin declararlas. Antes de eso, cuatro rondas del gate M1
se fueron en lo mismo a menor escala (quitar las tarjetas, confundir iconos con imágenes, poner
las capturas en la portada).

**El gate que pasó en verde con el bug puesto.** La primera versión del test de deriva cero medía
«¿se llega al fondo?» — y con la compensación a ciegas restaurada esta página llega igual. Si no
llego a exigir la demostración en rojo, el sprint cierra con una prueba decorativa que además
tranquiliza. Es el precedente de la carnada floja de gitleaks, en otra feature.

## Sugerencias de mejora al método

1. **El patrón `apertura-por-lectura.md` necesita la trampa T7** en su catálogo: la compensación
   del cierre por arriba se calcula midiendo la deriva de un ancla visible, jamás restando el alto
   perdido — el anclaje de scroll del navegador y el recorte del fondo del documento la duplican en
   silencio.
2. **Y el patrón exige el test de deriva cero sin decir cómo elegir el ancla ni cuándo medir.** Los
   dos descuidos producen **rojos falsos sobre código correcto**, que es la forma más cara de
   fallo: manda a arreglar lo que no está roto. Faltan dos condiciones: el ancla con `top >= 0`
   (nunca un contenedor, cuyo techo está por encima de lo que se recoge) y la medición con las
   transiciones asentadas.
3. **Contrato del `brochure-export`, v1.1.0: un campo `grupos[].icono`.** Hoy los iconos de las
   tarjetas se copian a mano del brochure de cada app hermana; si allá cambian, aquí quedan viejos
   y nadie se entera. El export transporta datos pero no la identidad visual que los acompaña.
4. **El plan de miradas debería obligar a declarar las decisiones de DISEÑO, no solo las
   técnicas.** «Una ficha aprobada antes que las seis» validó la ficha, pero no preguntó _cuántas
   páginas_ ni _de quién es el color_. Ambas se decidieron por omisión y costaron dos rondas
   completas de reconstrucción.
5. **Un gate nuevo debería nacer con su rojo en el MISMO commit**, no al final de la fase. Aquí la
   demostración llegó después de que la prueba ya estuviera escrita y «verde» — y por eso se
   descubrió que no medía nada.

## Deuda técnica aceptada

- **`design-sync/` publicado:** el bundle **nace en este PR** (10 tarjetas verificadas), pero
  **`projectId` está en `null`: nunca se ha publicado en Claude Design.** El disparador es del
  usuario (`/design-sync`) y la publicación es obligatoria al **cierre del ciclo H2**. Se paga ahí.
- **Cobertura del bundle:** cubre fundamentos completos, los componentes canon transversales y
  **todo lo nuevo del S5**. Quedan sin tarjeta los componentes de S1–S4 que el design system
  describe en prosa (input/textarea, metric tile, glifo ◆, las primitivas de motion, y los bloques
  de chat y votación). Declarado en `design-sync/README.md`. Pago: cierre del ciclo H2.
- **Gate ⭐ del usuario:** pendiente sobre la guía v2. No se difiere a otro sprint — lo pausable es
  el momento de correrlo, no el gate.
- **4 vulnerabilidades moderadas** (bajo el umbral del gate), todas transitivas de herramienta.
- **No tocadas (declaradas a su momento):** dark mode · embeddings del retrieval · rate limit
  global · `verificacion:` de certs · chunks de brochure al índice del chat.

## Archivos clave (máx. 10)

1. `src/lib/vitrina/loader.ts` — ingesta con validación fail-safe; el build falla nombrando campo.
2. `src/app/[locale]/vitrina/page.tsx` — el escaparate.
3. `src/app/[locale]/vitrina/[app]/page.tsx` — la ruta propia de cada app (12 páginas SSG).
4. `src/components/vitrina/ficha.tsx` — las cuatro capas del brochure re-expresadas.
5. `src/components/vitrina/apertura-por-lectura.tsx` — el patrón entero, con T7 documentada.
6. `scripts/capturas-vitrina.mjs` — el motor de capturas, con el candado de privacidad.
7. `scripts/tema-cv-viva.mjs` — el repintado: mapa de tokens por app, **por papel, no por parecido**.
8. `tests/e2e/vitrina.spec.ts` — 26 pruebas, con el gate de deriva cero demostrado en rojo.
9. `decisions/014-bucle-ambiental-firma-clima.md` — la excepción al veto de bucles.
10. `docs/GUIA-DE-PRUEBA.html` — v2 acumulativa: 48 pruebas, 14 ⭐.

## Cómo probar

```bash
pnpm install
pnpm test                 # 174 unitarias
pnpm exec playwright test --grep-invert "votación"   # 132 e2e
pnpm build && pnpm start  # /es/vitrina y /es/vitrina/<app>
```

Las capturas se rehacen con `pnpm capturas:vitrina` (requiere las apps hermanas clonadas al lado,
con dependencias instaladas, y `cwebp` en el PATH). El recorrido manual va en
`docs/GUIA-DE-PRUEBA.html` — bloques **K** y **L** para lo nuevo, filtro «Gate mínimo ⭐» para lo
que solo puede juzgar una persona.
