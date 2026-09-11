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

/**
 * El nombre del frente que NO se sirve por la ruta genérica: `apps` tiene su
 * propio segmento estático (`/vitrina/apps/...`), con export + curación en vez
 * de una ficha completa en `content/`. Estaba escrito a mano en cuatro sitios y
 * la regla se re-derivaba en cada uno; ahora se pregunta, no se recuerda.
 */
export const FRENTE_PROPIO = "apps";

/** Los frentes en el orden del YAML: es el orden del portal. */
export const getFrentes = cache((): Frente[] =>
  getVitrina().categorias.map((c) => ({
    ...c,
    piezas:
      c.id === FRENTE_PROPIO
        ? getManifestVitrina().length
        : (frentes as readonly string[]).includes(c.id)
          ? getPiezas(c.id as FrentePieza).length
          : 0,
  })),
);

/**
 * El frente de un segmento de URL dinámico — `undefined` si ese id no existe o
 * si es el que tiene ruta propia. Lo usan las dos páginas de `[categoria]` y el
 * sitemap: los tres tienen que coincidir o la vitrina enlaza a un 404.
 */
export function getFrenteDinamico(id: string): Frente | undefined {
  const f = getFrente(id);
  return f && f.id !== FRENTE_PROPIO ? f : undefined;
}

/** Los frentes dinámicos ABIERTOS: los únicos que publican piezas. */
export function frentesDinamicosAbiertos(): Frente[] {
  return getFrentes().filter(
    (f) => f.id !== FRENTE_PROPIO && f.estado === "abierta",
  );
}

export function getFrente(id: string): Frente | undefined {
  return getFrentes().find((f) => f.id === id);
}
