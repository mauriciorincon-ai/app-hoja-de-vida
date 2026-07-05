# ADR-004: Hosting — Vercel Hobby (non-commercial clause verified)

- **Status:** accepted
- **Date:** 2026-07-05
- **Sprint:** 001

## Context

The order flags a risk: Vercel Hobby's fair-use policy restricts sites to **non-commercial,
personal use**. Alternative on the table: Cloudflare Pages. (ADR numbering: 003 is reserved
for the S2 LLM provider decision per CLAUDE.md.)

## Decision

Deploy on **Vercel Hobby** (preview per PR, production from `main`).

## Rationale

- CV Viva is a personal résumé/portfolio with no monetization, ads, or commercial offering —
  squarely within Vercel's "personal, non-commercial" Hobby usage. The "solicitar acceso" form
  requests access to free personal apps, not a sale.
- Expected traffic (tens of visits/month per the brief) is far below Hobby limits (100 GB-h).
- Preview-per-PR is a hard CI/CD gate of the 6+1 standards; Vercel gives it zero-config for
  Next.js. Cloudflare Pages remains the documented fallback if usage terms or limits change.
- In-memory rate limiting (sliding window per IP) is per-serverless-instance; acceptable at
  this scale — documented limitation, revisit if the form ever sees real abuse.

## Consequences

- `RESEND_API_KEY` (and later Sentry DSN) live only in Vercel env vars + `.env.local`.
- If the pipeline ever commercializes an app showcased here, re-evaluate hosting in a new ADR
  before that launch.
