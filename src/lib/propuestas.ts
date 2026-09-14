import { z } from "zod";

/**
 * Propuesta de funcionalidad (2026-09-13, decisión del dueño): una caja de
 * texto debajo del roadmap de cada app hermana, «muy simple». Solo el texto es
 * obligatorio; el correo es opcional (reply-to, por si quiere enterarse). Nada
 * se publica ni se guarda en BD: llega por correo al dueño, que decide qué
 * pasa al plan de la app en la revisión de features con la planeadora. Cuando
 * haya volumen, el dueño evaluará propuestas públicas y votables, con control
 * de spam — no antes.
 */
import { PROPUESTA_MAX, PROPUESTA_MIN } from "./contacto-constantes";

export { PROPUESTA_MAX, PROPUESTA_MIN };

export const propuestaSchema = z.object({
  app: z
    .string()
    .min(1)
    .max(60)
    .regex(/^[a-z0-9-]+$/, "must be a kebab-case slug"),
  propuesta: z.string().trim().min(PROPUESTA_MIN).max(PROPUESTA_MAX),
  email: z.string().trim().email().max(254).or(z.literal("")).default(""),
  website: z.literal("").default(""),
});

export type Propuesta = z.infer<typeof propuestaSchema>;
