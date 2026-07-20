# ADR-003: LLM provider — Groq initial, env-switchable adapter (AI SDK)

- **Status:** accepted
- **Date:** 2026-07-06
- **Sprint:** 003 (number reserved since S1 for this decision)

## Context

The chat (S3 star feature) must answer grounded questions over the site's own content with
streaming, citations, an off-topic static guardrail and a local-search fallback. The VISION
promises the provider is **switchable via environment variables** — no code changes. The
user chose **Groq** as the initial provider (G-Plan 2026-07-05: fastest/simplest, free tier);
Gemini, Azure AI Foundry (AI-102 demo), Claude and self-host OpenAI-compatible stay
ready-for-env. Budget ceiling: ≤US$20/month; expected runtime cost ~US$0 (free tier +
rate limit + max tokens + kill-switch + circuit breaker to local fallback).

## Decision

**Adapter over the Vercel AI SDK (`ai@7`, already installed)** in `src/lib/ia/provider.ts`,
selected by env — the only place that knows about concrete providers:

| `CHAT_PROVIDER`      | Package                     | Key env vars                            | Default `CHAT_MODEL`        |
| -------------------- | --------------------------- | --------------------------------------- | --------------------------- |
| `groq` (**initial**) | `@ai-sdk/groq`              | `GROQ_API_KEY`                          | `llama-3.3-70b-versatile`   |
| `gemini`             | `@ai-sdk/google`            | `GOOGLE_GENERATIVE_AI_API_KEY`          | `gemini-2.5-flash`          |
| `azure`              | `@ai-sdk/azure`             | `AZURE_RESOURCE_NAME` + `AZURE_API_KEY` | (deployment name, required) |
| `anthropic`          | `@ai-sdk/anthropic`         | `ANTHROPIC_API_KEY`                     | `claude-haiku-4-5`          |
| `openai-compatible`  | `@ai-sdk/openai-compatible` | `CHAT_BASE_URL` (+ `CHAT_API_KEY`)      | (required)                  |
| `mock`               | — (fixture, in-repo)        | —                                       | —                           |

`CHAT_MODEL` overrides the default without code. The **`mock` provider** is deterministic
(fixture responses with citations) and is what unit/integration/e2e tests use — the CI never
calls a real provider.

## Verified prices/limits (official sources, checked 2026-07-06)

- **Groq free tier** ([console.groq.com/docs/rate-limits](https://console.groq.com/docs/rate-limits),
  [groq.com/pricing](https://groq.com/pricing)): no credit card, no per-token charge on the
  Free Plan — only rate limits. For `llama-3.3-70b-versatile`: **30 RPM · 1K requests/day ·
  12K tokens/min · 100K tokens/day**. The binding constraint is requests/day; our own IP
  rate limit + max-tokens keeps a single visitor from draining it. Worst case: quota
  exhausted → provider returns 429 → circuit breaker → local search fallback. **Cost: US$0.**
- **Gemini free tier** ([ai.google.dev/gemini-api/docs/rate-limits](https://ai.google.dev/gemini-api/docs/rate-limits)):
  free tier exists but Google cut it sharply during 2026 (reports range 20–250 requests/day
  for 2.5 Flash depending on period; AI Studio shows the live per-project limit). Documented
  ready-for-env; **re-verify the live limit at switch time**.
- **Claude API** (Anthropic docs, cached 2026-06): `claude-haiku-4-5` **US$1 input /
  US$5 output per MTok** — pay-per-use, no free tier. At our max-tokens (~600 output) and
  rate limits, even 1,000 chats/month ≈ US$4 — inside the US$20 ceiling.
- **Azure AI Foundry**: pay-per-use, price depends on the deployed model; serves as the
  AI-102 demo, not as a cost decision. Configure deployment + verify its meter at switch time.

## Rationale

- AI SDK gives one `LanguageModel` interface for all five providers + streaming + usage
  accounting — the adapter is ~40 lines, and "switch provider = change env vars" is literal.
- Groq free tier costs $0 and its failure mode (429 on quota) is exactly what the circuit
  breaker + fallback is designed for — the chat never dies.
- A `mock` provider inside the adapter (instead of HTTP interception) keeps tests fast,
  deterministic and proves the switching mechanism itself (tests run with ≥2 providers).

## Consequences

- Provider packages for all five options ship in `dependencies` (each is small; only the
  selected one is imported at runtime via the adapter's lazy import).
- The manual documents the exact env-var recipe per provider (`docs/MANUAL-DE-USO.md`).
- Groq quota telemetry = Pino logs (`tokens_in/out`, provider, latency) — if the free tier
  tightens like Gemini's did, switching is an env change, and the fallback covers the gap.
