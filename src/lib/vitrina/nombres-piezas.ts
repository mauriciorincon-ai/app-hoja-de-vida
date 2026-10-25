import { z } from "zod";
import { frentes } from "./ficha-tecnica/schema";

/**
 * EL NOMBRE QUE EL SITIO DA A UNA PIEZA (2026-10-24) — MOTOR PURO.
 *
 * Extiende el ADR-028 (el nombre oficial de las apps) a las piezas de agentes,
 * investigaciones y tableros. Sus fichas las produce otra casa y no se editan aquí
 * (regla dura 2); cuando el dueño decide llamarlas de otro modo, el nombre va en
 * `data/nombres-piezas.yaml` y se aplica UNA vez, al leer la ficha: de ahí lo heredan
 * el escaparate, la página de la pieza, el índice del chat y las citas.
 *
 * Este módulo valida ese YAML; no lee archivos (lo lee `piezas.ts`, y los scripts de
 * build, `scripts/nombres-oficiales.mjs`). Un frente que no existe o un nombre vacío
 * rompen el build con el archivo y el campo. Que el slug tenga ficha lo vigila
 * `tests/unit/nombres-piezas.test.ts`.
 */

const nombreSchema = z.string().trim().min(1, "el nombre no puede estar vacío");

const nombresPiezasSchema = z
  .record(z.string(), z.record(z.string().min(1), nombreSchema))
  .superRefine((data, ctx) => {
    for (const frente of Object.keys(data)) {
      if (!(frentes as readonly string[]).includes(frente)) {
        ctx.addIssue({
          code: "custom",
          path: [frente],
          message: `«${frente}» no es un frente de la vitrina (${frentes.join(", ")})`,
        });
      }
    }
  });

/** `frente → slug → nombre`. */
export type NombresPiezas = z.infer<typeof nombresPiezasSchema>;

export function parseNombresPiezas(data: unknown, source: string): NombresPiezas {
  const r = nombresPiezasSchema.safeParse(data ?? {});
  if (!r.success) {
    const lineas = r.error.issues
      .map((i) => `  - ${i.path.join(".") || "(raíz)"}: ${i.message}`)
      .join("\n");
    throw new Error(`Contenido inválido en ${source}:\n${lineas}`);
  }
  return r.data;
}

/** El nombre dado a una pieza, o `undefined` si la ficha se queda con el suyo. */
export function nombreDePieza(
  nombres: NombresPiezas,
  frente: string,
  slug: string,
): string | undefined {
  return nombres[frente]?.[slug];
}
