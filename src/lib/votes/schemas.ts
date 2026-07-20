import { z } from "zod";

/**
 * Contratos de la votación del roadmap (S4, ADR-011). El input del route se
 * valida en el borde con `.strict()` — una clave de más es un 400, no un
 * strip silencioso. `app`/`feature` son slugs kebab-case; el route además
 * verifica que existan en data/apps.yaml antes de tocar la BD.
 */

const slug = z
  .string()
  .min(1)
  .max(60)
  .regex(/^[a-z0-9-]+$/, "debe ser un slug kebab-case");

/** Body de POST /api/roadmap/votar. */
export const votarInputSchema = z
  .object({
    app: slug,
    feature: slug,
  })
  .strict();

export type VotarInput = z.infer<typeof votarInputSchema>;

/** Una fila del conteo agregado que devuelve la RPC conteo_votos(). */
export const conteoRowSchema = z
  .object({
    app: slug,
    feature: slug,
    total: z.number().int().nonnegative(),
  })
  .strict();

export const conteoSchema = z.array(conteoRowSchema);

export type ConteoRow = z.infer<typeof conteoRowSchema>;
export type Conteo = z.infer<typeof conteoSchema>;
