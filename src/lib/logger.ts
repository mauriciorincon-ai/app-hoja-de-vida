import pino from "pino";

/** Logger estructurado del estándar de observabilidad (#3). */
export const logger = pino({
  level: process.env.LOG_LEVEL ?? "info",
  base: { app: "hoja-de-vida" },
});
