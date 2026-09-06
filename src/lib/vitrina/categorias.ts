import "server-only";
import { cache } from "react";
import { getVitrina } from "@/lib/content";
import type { CategoriaVitrina } from "@/lib/schemas";
import { frentes } from "./ficha-tecnica/schema";
import { getManifestVitrina } from "./loader";
import { getPiezas, type Frente as FrentePieza } from "./piezas";

/**
 * Los frentes de la vitrina (ADR-015), derivados de `data/vitrina.yaml` más la
 * cuenta de piezas que cada uno tiene publicadas. **La cuenta no se escribe a
 * mano** — un número declarado a mano sería la primera cifra sin procedencia de
 * toda la vitrina.
 *
 * De dónde sale, por frente: «apps» de los exports en `content/vitrina/`; los
 * demás de sus fichas técnicas en `content/<frente>/` (S7). Un frente del YAML
 * que no exista en el contrato (`pieza.frente`) cuenta cero, y no por descuido:
 * ninguna ficha podría declararlo, así que no puede tener piezas.
 */

export type Frente = CategoriaVitrina & {
  /** Piezas publicadas. 0 en un frente en preparación. */
  piezas: number;
};

/** Los frentes en el orden del YAML: es el orden del portal. */
export const getFrentes = cache((): Frente[] =>
  getVitrina().categorias.map((c) => ({
    ...c,
    piezas:
      c.id === "apps"
        ? getManifestVitrina().length
        : (frentes as readonly string[]).includes(c.id)
          ? getPiezas(c.id as FrentePieza).length
          : 0,
  })),
);

export function getFrente(id: string): Frente | undefined {
  return getFrentes().find((f) => f.id === id);
}

/** Los que tienen página genérica «este frente empieza» (`/vitrina/[categoria]`). */
export function frentesEnPreparacion(): Frente[] {
  return getFrentes().filter((f) => f.estado === "en-preparacion");
}
