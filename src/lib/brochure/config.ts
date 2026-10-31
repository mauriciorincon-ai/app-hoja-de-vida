import { z } from "zod";
import { ACENTOS } from "./contenido";

/**
 * LO QUE CAMBIA POR APP en el brochure y no viaja en su export ni en su contenido v2
 * (`data/brochure.yaml`, S28): el acento de su piel y si lleva «datos sintéticos».
 *
 * Fail-safe como el resto del contenido (regla 1): un archivo malformado rompe el build
 * con el archivo y el campo. Que estén exactamente las doce apps (las diez del Portafolio
 * y las dos de la casa) lo vigila `tests/unit/brochure-config.test.ts`.
 */

/** Las dos de la casa: CV Viva y su chat. No son apps del Portafolio y no entran a su loader. */
export const SLUGS_CASA = ["hoja-de-vida", "chat-hoja-de-vida"] as const;

const slug = z
  .string()
  .min(1)
  .max(60)
  .regex(/^[a-z0-9-]+$/, "debe ser un slug kebab-case");

export const configBrochureSchema = z
  .object({
    apps: z.record(
      slug,
      z
        .object({
          acento: z.enum(ACENTOS),
          datos_sinteticos: z.boolean(),
        })
        .strict(),
    ),
  })
  .strict();

export type ConfigBrochure = z.infer<typeof configBrochureSchema>;
export type ConfigDeApp = ConfigBrochure["apps"][string];

export function parseConfigBrochure(
  raw: unknown,
  archivo: string,
): ConfigBrochure {
  const r = configBrochureSchema.safeParse(raw);
  if (r.success) return r.data;
  const issues = r.error.issues
    .map((i) => `  - ${i.path.join(".") || "(raíz)"}: ${i.message}`)
    .join("\n");
  throw new Error(`Configuración inválida en ${archivo}:\n${issues}`);
}
