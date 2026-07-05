/**
 * Sentry en el cliente, cargado PEREZOSAMENTE y solo si hay DSN público:
 * sin DSN el chunk ni se descarga (protege el budget de scripts ≤300KB).
 */
const dsn = process.env.NEXT_PUBLIC_SENTRY_DSN;

if (dsn) {
  import("@sentry/nextjs").then((Sentry) => {
    Sentry.init({ dsn, tracesSampleRate: 0 });
  });
}
