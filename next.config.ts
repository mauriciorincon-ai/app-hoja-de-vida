import type { NextConfig } from "next";
import createNextIntlPlugin from "next-intl/plugin";

const withNextIntl = createNextIntlPlugin("./src/i18n/request.ts");

const nextConfig: NextConfig = {
  // `next dev` (16.3) reescribe CLAUDE.md con un bloque propio en cada
  // arranque. CLAUDE.md es la constitución de esta app y la escribe su dueño:
  // apagado (hallazgo post-S8, 2026-09-12).
  agentRules: false,
  // El endpoint del chat lee los índices generados en build desde disco
  // (scripts/build-chat-index.mjs → public/) — hay que trazarlos a la función.
  outputFileTracingIncludes: {
    "/api/chat": ["./public/chat-index.*.json"],
  },
};

export default withNextIntl(nextConfig);
