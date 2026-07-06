# Sprint 003 — Bitácora de implementación (El chat que responde por ti)

- **Branch:** `sprint-003/chat-hv`
- **Orden:** `portafolio/hoja-de-vida/ordenes/SPRINT_003-orden.md` (planeadora, RO)
- **Plan aprobado:** 2026-07-06 (plan mode; ajuste del usuario: entregar al cierre una
  **guía de cómo alimentar la historia** — estructura, marcas de ancla, mecánica de citas)

## Desviación del plan

1. **ADR del índice/retrieval → ADR-010** (003 reservado al proveedor LLM; 004–009 consumidos).
2. **`lib/ia/` sin `persist.ts`:** el skill `ia-embebida` contempla persistencia a BD; esta
   feature NO persiste salidas del LLM (orden explícita, sin DB). Se omite el módulo — el
   checklist del estándar 7 lo cubre como "cero persistencia ✓".
3. **Citas a la historia:** la historia no se renderiza como página; cada sección del esqueleto
   declara su ancla de destino (`<!-- ancla: ... -->` → sección de HOME o `/proyectos/<slug>`)
   para que toda cita navegue a algo visible (detalle en ADR-010).

## Fase 0 — Setup (2026-07-06)

- Branch `sprint-003/chat-hv` creada desde main (95b760e).
- **Groq ya aprovisionado por el usuario** (adelantado): `GROQ_API_KEY` en `.env.local` y en
  Vercel env vars — nombre estándar, el adapter lo usa tal cual.
- Deps: `@ai-sdk/{groq,google,azure,anthropic,openai-compatible,react}` + `minisearch`
  (`ai@7` ya estaba desde el estampado — no se reinstala) + `@ai-sdk/provider` (dev, tipos).
- `.env.example`: bloque del chat (`CHAT_ENABLED`, `CHAT_PROVIDER`, `CHAT_MODEL`, keys por
  proveedor, `CHAT_BASE_URL` self-host).
- **Deuda LCP S2 pagada:** las palancas reales ya estaban todas aplicadas (Fraunces en un
  peso estático + subset + preload de next/font; LCP estático) y la única restante —
  `display: optional` en Fraunces — fue rechazada con razones en ADR-006 que siguen vigentes.
  Se aplicó el corolario del patrón wiki: **budget LCP 3500 → 3850ms (~10% de margen de
  ingeniería)**, documentado como Amendment en ADR-006. La línea nueva sigue cazando la
  regresión real del S2 (3.6–4.1s).

## Fase 1 — Motor (2026-07-06)

- **ADR-003 (proveedor LLM):** verificados con fuentes oficiales los límites vigentes de
  Groq free tier (30 RPM · 1K req/día · 100K tokens/día en llama-3.3-70b-versatile — US$0)
  y el estado del free tier de Gemini (recortado durante 2026; re-verificar al conmutar).
  Adapter por env con 6 proveedores (`mock` incluido para tests/e2e — la CI jamás llama a
  un proveedor real); config incompleta ⇒ `null` ⇒ el endpoint degrada a fallback.
- **ADR-010 (índice/retrieval):** chunks curados build-time por locale → MiniSearch
  isomórfico. Un solo asset (`public/chat-index.{es,en}.json`, gitignored) que sirve doble:
  RAG server-side + búsqueda local del fallback client-side (fetch lazy).
- **Esqueleto guiado de la historia:** `data/historia/historia.{es,en}.md` — 12 secciones
  espejo (una por etapa/tema), advertencia de privacidad, comentarios `guía:` y las únicas
  2 marcas del dueño (`## título` + `<!-- seccion: id | ancla: destino -->`). Como la
  historia no se renderiza como página, cada sección declara su ancla de cita (desviación 3).
- `scripts/build-chat-index.mjs` encadenado en `build`; **paridad ES/EN exigida** con
  diagnóstico por sección; secciones vacías no bloquean (el chat arranca con los YAML).
- `src/lib/ia/`: schemas (Zod) · retrieval (topK fuzzy para contexto + **topKStrict para el
  guardrail** — sin fuzzy, "gatos" no coincide con "datos") · guardrails (off-topic estático
  bilingüe + system prompt endurecido grounding-only con citas [n] obligatorias) · provider ·
  client (único punto de llamada, máx 600 tokens out, timeout 30s) · breaker (3 fallas → 60s
  abierto) · cost (log Pino de tokens/latencia) · mock-model (determinista, modo `error`).
- 45 tests unit verdes (builder+paridad, retrieval calibrado contra el contenido REAL,
  guardrails on/off-topic, adapter por env con ≥2 proveedores, breaker, schemas).

## Fase 2 — Endpoint /api/chat (2026-07-06)

- Cadena de defensas: kill-switch (503) → rate limit IP 10/min (429) → Zod (400) →
  guardrail off-topic (respuesta estática como stream UIMessage, CERO llamadas al proveedor)
  → breaker/proveedor-sin-config (503 `fallback`) → RAG top-4 + streaming con
  `data-fuentes` (citas estructuradas n→ancla) + log de tokens.
- **Gotcha AI SDK:** los errores del proveedor viajan DENTRO del stream mergeado — el
  `onError` que los ve es el de `toUIMessageStream`, no el de `createUIMessageStream`;
  el breaker se registra ahí. Otro: `finishReason` de `LanguageModelV3` es un objeto
  `{unified, raw}`, no un string.
- `outputFileTracingIncludes` en next.config para que los índices viajen con la función.
- 10 tests integration verdes (proveedor SIEMPRE mockeado; spy verifica el criterio
  "off-topic = cero invocaciones"; breaker abre tras 3 fallas y responde fallback inmediato).

## Fase 3 — UI + contenido (2026-07-06)

- `ChatLauncher` (todas las páginas vía layout, `CHAT_ENABLED=false` ⇒ ni se monta):
  botón fijo que NO compite por LCP; el panel entero (useChat + MiniSearch) entra por
  dynamic import al abrir — bundle inicial casi intacto.
- `ChatPanel`: streaming con `useChat`, citas como chips navegables (`/{locale}{ancla}`),
  3 preguntas sugeridas, disclaimer de transparencia, estados completos (sugerencias /
  escribiendo / streaming / off-topic / rate-limited / **fallback local** con badge y aviso
  honesto — en fallback las preguntas siguientes se responden 100% en el cliente), teclado
  (Enter/Esc, foco al abrir y de regreso al lanzador), reduced-motion.
- i18n del chat ES y EN en el mismo paso; eventos `chat_abierto/pregunta/respuesta/
offtopic/fallback`.
- Restituida la frase del chat en `identidad.perfil` (ES+EN) y la card `chat-hoja-de-vida`
  pasó a `en-produccion` con enlace de evidencia.
- Verificación manual con server real: HTML estático con lanzador y frase de perfil ✓,
  índices servidos ✓, API happy path + off-topic por curl ✓.
- ⚠ **Prueba con Groq real: 401 Invalid API Key** — la key de `.env.local`/Vercel no es
  válida (el flujo degradó a fallback exactamente como se diseñó). Pendiente del usuario:
  regenerar la key en console.groq.com y actualizar ambos lados. NO bloquea el sprint.

## Fase 4 — e2e + calidad (2026-07-06)

- `chat.spec.ts` (16 casos ×2 proyectos): flujo estrella ES (pregunta → streaming → cita
  navegable al case study), EN, off-topic, teclado end-to-end, **fallback forzado**
  (interceptando `/api/chat` con el MISMO 503 del server real → búsqueda local con aviso +
  segunda pregunta respondida sin red), rate limit 429, axe AA con el panel abierto,
  reduced-motion. El server e2e corre con `CHAT_PROVIDER=mock` (env en playwright.config).
- Fix de axe: el label "Fuentes" usaba `text-ink-3` (2.7:1) → `text-ink-2`.
- Fix data-driven: `home.spec.ts` asumía que siempre existe una app "En construcción" —
  ahora lee el estado del YAML y su etiqueta de messages (el chat pasó a producción).
- Suite completa: 97 unit/integration + 62 e2e verdes.
