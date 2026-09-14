# ADR-022 — El roadmap votable vive en la página de cada app hermana, y lo alimenta la planeadora

- **Estado:** aceptada · 2026-09-13 · revisión post-S8, bloque G del gate ⭐
- **Reemplaza en parte a:** ADR-011 (la votación anónima sigue tal cual; cambia DE DÓNDE salen las
  features y DÓNDE se votan) y la reubicación del roadmap a `/vitrina/apps` de la revisión post-S7.

## Contexto

Desde el S4 se votaban siete features escritas por la app para CV Viva y su chat, primero en la
HOME y desde la revisión post-S7 al pie del escaparate `/vitrina/apps`. Antes de correr el bloque
G el dueño decidió tres cosas: **ninguna feature de CV Viva se muestra en ningún lado**; **cada
grupo de features vive en la página inicial de cada app**; y las features reales **las controla la
planeadora**, que lleva el plan de cada app hermana — se le piden las más disruptivas e
innovadoras y las de cierre de plan, no las que ya van a implementarse.

## Decisión

1. **La fuente es el complemento curado de cada app,** `data/fichas/<slug>.yaml`, que gana el
   campo opcional `roadmap:` (complemento v1.2.0; `roadmapFeatureSchema` compartido, ids únicos por
   app). Procedencia `cv-viva`: la planeadora lo administra y **llega por copia, sin editarse
   aquí** — la misma regla del resto del complemento. La planeadora lo re-arma en cada cierre de
   sprint de la app: una feature construida sale del roadmap.
2. **`apps.yaml` ya no admite `roadmap:`** (objeto strict): un YAML viejo rompe el build
   nombrándolo. Las siete features de CV Viva se retiraron; ninguna se muestra.
3. **Se vota en `/vitrina/apps/<slug>`,** entre la ficha técnica y la lista de espera, con el
   MISMO componente y la misma isla de votación del S4 (`Roadmap` en modo `embebido`, sin el
   rótulo del grupo porque la página ya es la de esa app). El escaparate solo asoma: no monta
   ningún roadmap. Sin features, la sección no existe.
4. **El motor de votos deriva del manifiesto de la vitrina + los complementos**
   (`src/lib/votes/roadmap.ts`): `appsConRoadmap`, `roadmapDe`, `esFeatureValida`,
   `paresVotables`. El route handler valida el par (app, feature) contra eso antes de tocar la
   BD, como siempre. Clave del voto: (slug del export, id de la feature).
5. **Los votos viejos** (siete features de CV Viva) quedan huérfanos en Supabase: cero PII, no se
   muestran, y el GET los devuelve sin que la UI los pinte. Limpiar la tabla es decisión del dueño;
   no bloquea nada.
6. **El prefijo de dedup en localStorage no cambia** (`cvviva:voto:s004:`): las claves son por
   (app, feature) y los pares nuevos no chocan con los viejos.

## Consecuencias

- 28 features votables hoy: 5 por app y 3 en `dash-agent-ai` (su plan es cerrado y la planeadora
  lo dijo tal cual; la tercera es la más condicionada y puede quitarse si el dueño prefiere dos).
- El bloque G de la guía vuelve a correr: g1 en la página de cada app; g2–g4 solo en producción
  (en local no hay Supabase, la votación se declara «no disponible» por diseño); g5 ⭐ sin cambio.
- `docs/kit-de-prueba/flujo-votacion.md` cambia la ruta del paso 1.
- Gates nuevos, todos vistos en rojo (bitácora post-S8, regla 14): el complemento acepta y valida
  el roadmap (ids únicos, dos idiomas, kebab-case); `apps.yaml` rechaza `roadmap:`; el motor
  deriva de los complementos; el e2e exige una fila por feature en la página de cada app y ninguna
  en el escaparate ni en la HOME; la votación e2e navega a la página de la app.
- Si la planeadora publica la réplica en `vitrina/apps/<slug>.complemento.json` (su casa), esta
  app sigue leyendo solo `data/fichas/`: una sola fuente por lado.
