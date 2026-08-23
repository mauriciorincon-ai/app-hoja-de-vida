# ADR-013 — La vitrina de los exports frente al showcase propio del S4

- **Status:** accepted (2026-08-22)
- **Context:** Sprint 005 (branch `sprint-005/la-vitrina-de-los-seis`), primer sprint del ciclo H2.
  Resuelve el **O3** de la orden: la relación entre las páginas `/apps/[slug]` nacidas del YAML
  propio (S4) y la vitrina de los 6 `brochure-export.json` del portafolio.

## Context

El ciclo H2 declara que hoja-de-vida es **el DESTINO del portafolio a nivel de brochure
re-expresado** (F0 #8). Llegan 6 exports bajo el contrato v1.0.0 (dash-agent-ai, ds, habla,
anonimizador, nutri-kids, inmobiliaria) que hay que renderizar **en el design system de esta app**.

Ya existe una superficie parecida: el showcase de la HOME y las brochures `/apps/[slug]` del S4,
nacidas de `data/apps.yaml`. El riesgo declarado en el plan del sprint es la **doble fuente que
deriva**: dos sitios describiendo lo mismo que se desincronizan.

**Hallazgo que decide el ADR:** los dos conjuntos **no se solapan**. `apps.yaml` describe _la casa_
— CV Viva y su chat, cuyas features viven **en esta misma página** (por eso tienen roadmap votable
y brochure propia), más dos exploraciones sin producto. Los exports describen **seis apps
hermanas** cuyo código vive en otros repos. Cero slugs en común. No hay duplicación de datos que
sincronizar: hay dos _modelos_ distintos de brochure con dos orígenes distintos.

## Decision

**Conviven, separados por naturaleza y sin puente de datos.**

1. **`data/apps.yaml` (S4) se queda como está**, gobernando el showcase de la HOME, el roadmap
   votable y las brochures `/[locale]/apps/[slug]`. Es contenido que el dueño edita a mano sobre
   _sus_ apps.
2. **`content/vitrina/*.brochure-export.json` gobierna la vitrina**, en **ruta dedicada
   `/[locale]/vitrina`**. Es contenido que **producen otras apps** y que aquí **no se edita jamás**
   (regla dura 4): actualizar una ficha = PR de datos que reemplaza su export.
3. **Ruta dedicada, no sección de la HOME:** las 6 fichas suman 115 funcionalidades, 32 grupos y 65
   métricas. En la HOME inflarían el LCP y competirían con el CV — que es el trabajo principal de
   esta página. Como ruta propia es SSG limpia y Lighthouse la audita por separado.
4. **Cero enlaces, mecánico:** en el schema, `enlaces.produccion` y `enlaces.repositorio` son
   `z.null()` — un enlace colado no es "una clave rara" que un `.strict()` tolere, es un **error de
   tipo** que rompe el build. Lo que la vitrina muestra en su lugar es la `razon` (es contenido, no
   vacío) y un **CTA único de «lista de espera»**, sin gestión de acceso (diferida a propósito).
5. **Los enlaces del showcase propio (S4) NO se retiran.** El barrido obligatorio de cero-enlaces
   caza URLs de **deploy** (`vercel[.]app|workers[.]dev|pages[.]dev`); un enlace al repositorio
   público propio no lo dispara, y la regla de cero enlaces de la orden gobierna _esta entrega_ —
   la vitrina, cuyos exports ya llegan con `produccion: null` y `repositorio: null`. Retirarlos
   habría sido cambiar contenido publicado fuera del alcance del sprint. _(Decisión del usuario,
   consultada explícitamente.)_
6. **Idioma:** los exports son monolingües en español y no se editan. Las fichas se muestran **en su
   idioma original**; el _chrome_ de la vitrina (rótulos, secciones, badges de `fuente`, CTA, chips)
   sí es ES/EN, y en `/en` una nota declara que las fichas conservan la voz de cada app. Traducirlas
   sería inventar contenido que ninguna app aprobó, y habría que re-sincronizarlo a cada sello.

## Consequences

- **Una sola dirección de dependencia:** las apps hermanas producen exports; la vitrina los consume.
  Esta app nunca escribe hacia ellas y nunca corrige sus datos — si un export está mal, **el build
  falla nombrando archivo y campo**, y eso es el aviso para reportarlo a la planeadora.
- **La vitrina muestra la versión ANCLADA, no tiempo real.** El manifest registra de qué fecha es
  cada export (`actualizado`), su `schema_version`, su estado y su sello. Una app puede haber
  avanzado en su repo sin que su export se haya regenerado: la ficha declara su anclaje en vez de
  prometer frescura.
- **El sello se muestra, no se congela:** `estado: sellado` + `sellado_en` significan que el gate de
  pruebas de esa app terminó (hoy: solo habla, 2026-08-08). Todo sprint que cambie features de una
  app ajusta su brochure y su export en el mismo PR — la vitrina refleja lo que le llegue.
- **Superficie nueva y su costo:** una ruta pública más (×2 locales) que entra a `sitemap.ts`, a las
  URLs de Lighthouse y al scan de axe **en la misma fase que la construye** (regla 9, kit v1.24.1).
- **Si el contrato evoluciona a un mayor 2.x**, `versionCompatible()` rechaza el export en vez de
  adivinar el significado de campos cambiados: la vitrina se actualiza deliberadamente, no por
  accidente.
