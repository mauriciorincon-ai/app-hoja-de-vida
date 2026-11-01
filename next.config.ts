import type { NextConfig } from "next";
import createNextIntlPlugin from "next-intl/plugin";
import { entradasBrochure } from "./scripts/entradas-brochure.mjs";

const withNextIntl = createNextIntlPlugin("./src/i18n/request.ts");

const nextConfig: NextConfig = {
  // Las apps que abren en su brochure (S30), medidas del disco en build: el proxy redirige su
  // `/brochure` a la entrada y no puede leer el disco, así que la lista viaja inlinada en su bundle.
  env: {
    CV_ENTRADAS_BROCHURE: entradasBrochure().join(","),
  },
  // `next dev` (16.3) reescribe CLAUDE.md con un bloque propio en cada
  // arranque. CLAUDE.md es la constitución de esta app y la escribe su dueño:
  // apagado (hallazgo post-S8, 2026-09-12).
  agentRules: false,
  // El endpoint del chat lee los índices generados en build desde disco
  // (scripts/build-chat-index.mjs → public/) — hay que trazarlos a la función.
  outputFileTracingIncludes: {
    "/api/chat": ["./public/chat-index.*.json"],
  },
  // Safari y otros clientes piden el ícono de iOS en su ruta clásica sin leer
  // el <link> de la página. Se les sirve el mismo archivo de la convención de
  // Next (src/app/apple-icon.png), sin copiarlo (2026-09-26).
  async rewrites() {
    return [
      { source: "/apple-touch-icon.png", destination: "/apple-icon.png" },
      {
        source: "/apple-touch-icon-precomposed.png",
        destination: "/apple-icon.png",
      },
    ];
  },
};

export default withNextIntl(nextConfig);
