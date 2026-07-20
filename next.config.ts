import type { NextConfig } from "next";
import createNextIntlPlugin from "next-intl/plugin";

const withNextIntl = createNextIntlPlugin("./src/i18n/request.ts");

const nextConfig: NextConfig = {
  // El endpoint del chat lee los índices generados en build desde disco
  // (scripts/build-chat-index.mjs → public/) — hay que trazarlos a la función.
  outputFileTracingIncludes: {
    "/api/chat": ["./public/chat-index.*.json"],
  },
};

export default withNextIntl(nextConfig);
