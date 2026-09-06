import "server-only";
import { cache } from "react";
import { getVitrina } from "@/lib/content";
import type { CategoriaVitrina } from "@/lib/schemas";
import { getManifestVitrina } from "./loader";

/**
 * Los frentes de la vitrina (post-S5, ADR-015), derivados de `data/vitrina.yaml`
 * más la cuenta de piezas que cada uno tiene publicadas. La cuenta no se
 * escribe a mano: «apps» la toma de los exports en `content/vitrina/`, y los
 * frentes en preparación tienen cero por definición — un número declarado a
 * mano sería la primera cifra sin procedencia de toda la vitrina.
 */

export type Frente = CategoriaVitrina & {
  /** Piezas publicadas. 0 en un frente en preparación. */
  piezas: number;
};

/** Los frentes en el orden del YAML: es el orden del portal. */
export const getFrentes = cache((): Frente[] =>
  getVitrina().categorias.map((c) => ({
    ...c,
    piezas: c.id === "apps" ? getManifestVitrina().length : 0,
  })),
);

export function getFrente(id: string): Frente | undefined {
  return getFrentes().find((f) => f.id === id);
}

/** Los que tienen página genérica «este frente empieza» (`/vitrina/[categoria]`). */
export function frentesEnPreparacion(): Frente[] {
  return getFrentes().filter((f) => f.estado === "en-preparacion");
}
