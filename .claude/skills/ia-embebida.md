---
name: ia-embebida
description: Patrón obligatorio para features con IA generativa embebida - salidas estructuradas con Zod que se descomponen y persisten en la BD, guardrails de entrada/salida, tracking de costo y gancho HITL. Invocar al construir cualquier feature que llame a un LLM.
---

# IA embebida — el patrón de sinergia app↔LLM

Objetivo del pipeline: apps donde la IA generativa **interactúa nativamente** y sus resultados se
**descomponen y almacenan** como datos de primera clase de la aplicación — no chatbots pegados a un
lado. Este skill define el patrón único que toda feature LLM sigue.

## Arquitectura (vive en `src/lib/ia/`)

```
lib/ia/
├─ schemas.ts     # esquemas Zod de cada salida estructurada (el contrato app↔LLM)
├─ client.ts      # único punto de llamada al LLM (modelo, retry, timeout, streaming)
├─ guardrails.ts  # filtros de input/output + política del dominio
├─ persist.ts     # descomposición de la salida validada → filas/entidades en Supabase
└─ cost.ts        # medición tokens/costo por request → logger estructurado
```

**Regla de oro:** la UI nunca llama al LLM directo; llama a un route handler que usa `client.ts`,
valida contra `schemas.ts`, filtra con `guardrails.ts` y persiste con `persist.ts`.

## 1. Salida estructurada (Zod + Vercel AI SDK)

```ts
// schemas.ts — el contrato: lo que la app entiende y almacena
export const AnalisisSchema = z.object({
  resumen: z.string().max(500),
  entidades: z.array(
    z.object({
      tipo: z.enum(["persona", "monto", "fecha"]),
      valor: z.string(),
    }),
  ),
  confianza: z.number().min(0).max(1),
});

// client.ts — generateObject valida contra el schema; si no cumple, reintenta/falla explícito
import { generateObject } from "ai";
import { anthropic } from "@ai-sdk/anthropic";
const { object, usage } = await generateObject({
  model: anthropic("claude-sonnet-5"), // Haiku para tareas simples; Sonnet para razonamiento
  schema: AnalisisSchema,
  prompt,
  abortSignal: AbortSignal.timeout(30_000),
});
```

- Elección de modelo por tarea: clasificación/extracción simple → Haiku; razonamiento/generación
  rica → Sonnet. Documentar la elección en el ADR si difiere del default.
- Streaming (`streamText`/`streamObject`) solo para UX de lectura; lo persistido siempre es el
  objeto validado final.

## 2. Descomposición y persistencia

`persist.ts` mapea el objeto validado a entidades de la BD (nunca guardar el blob crudo como única
forma): p. ej. `AnalisisSchema` → fila en `analisis` + N filas en `entidades` con FK. Guardar
además: `modelo`, `version_prompt`, `costo_usd`, `created_by` — trazabilidad de qué IA produjo qué
dato. RLS aplica a estas tablas como a cualquier otra.

## 3. Guardrails (capa base, por sprint)

- **Input:** longitud máxima, tipo de contenido esperado, strip de instrucciones inyectadas
  (patrón anti prompt-injection del skill `security-owasp`), rate limiting por usuario.
- **Output:** validación Zod (ya bloquea la mayoría del formato malicioso) + lista de negación del
  dominio (ej. en `habla`: nunca diagnóstico clínico; en `financiera`: nunca recomendación de
  inversión — el brief define la política).
- **System prompt** siempre del lado servidor; el cliente jamás lo compone.

## 4. Costo

`cost.ts`: por request loggear `{ requestId, modelo, tokens_in, tokens_out, costo_usd, feature }`
con Pino. Presupuesto mensual por app definido en el brief; alerta si el run-rate lo excede (F6).

## 5. HITL (por release, dominios sensibles)

Si el brief marca el dominio como sensible (habla, financiera, inmobiliaria): las respuestas
high-stakes o de baja `confianza` se marcan `estado: pending_review`, la UI muestra "en revisión",
y un dashboard mínimo de operador permite aprobar/rechazar antes de exponer.

## 6. Proveedor conmutable por env

El adapter elige proveedor por variable de entorno (`CHAT_PROVIDER` o equivalente): cambiar de
Groq a Gemini/Azure/Claude/self-host OpenAI-compatible es cambiar env vars, jamás código.

## 7. Humo del proveedor real — día 0 (kit v1.7.4)

**Toda credencial de proveedor se valida el día 0 del sprint, en la fase 0 — antes de construir
contra ella.** Un 401 descubierto en la integración es un fallo de proceso, no un imprevisto
(hoja-de-vida S3: la GROQ_API_KEY aprovisionada era inválida y se supo recién al integrar;
producción quedó en modo fallback hasta regenerarla).

```bash
# Groq
curl -s -o /dev/null -w '%{http_code}' https://api.groq.com/openai/v1/models \
  -H "Authorization: Bearer $GROQ_API_KEY"     # → 200
```

Cada proveedor viaja con su comando de humo (≤1 min) en la orden de construcción; el checklist
re-emitido al abrir el PR lo repite si la credencial cambió. La validación contra el proveedor
REAL es además un paso manual pre-merge del estándar 7 — la CI nunca llama proveedores reales.

## 8. El mock es un proveedor de primera clase (kit v1.7.4)

El mock se implementa **dentro del adapter** (`CHAT_PROVIDER=mock`), como un miembro más que
emite por la misma interfaz de streaming — **jamás como intercept de red** (msw, `page.route`,
nock) del proveedor real.

- **Probar la conmutación es probar el mecanismo:** elegir `mock` por env recorre el mismo código
  que elegir Groq; el intercept de red se salta exactamente la pieza que la feature promete.
- **CI determinista y sin red:** cero cuota, cero flakes de latencia (`CHAT_PROVIDER=mock` en el
  `env` del webServer de Playwright).
- **Streaming de punta a punta:** la UI se prueba con el flujo real, no con un JSON estático.
- _Excepción legítima del intercept:_ forzar el **camino de error** — interceptar la ruta propia
  (`/api/chat`) con el mismo 503 que emite el server para probar el fallback.

Patrón wiki: `mock-como-proveedor-de-primera-clase.md` (planeadora, RO).

## Checklist del sprint (lo verifica /deploy-check)

- [ ] Toda llamada LLM pasa por `lib/ia/client.ts` y valida contra un schema de `schemas.ts`.
- [ ] Lo persistido está descompuesto en entidades (no solo blob) con metadatos de trazabilidad.
- [ ] Guardrails de input/output activos; system prompt server-side.
- [ ] Costo por request loggeado.
- [ ] Tests: unit del schema (casos válidos/inválidos) + mock del LLM en integración (nunca llamar
      al API real en CI) + 1 e2e con respuesta fixture.
- [ ] **Humo del proveedor real ejecutado en la fase 0** (§7) — y repetido en el checklist del PR
      si la credencial cambió.
- [ ] **El mock vive dentro del adapter** (§8), no como intercept de red.
