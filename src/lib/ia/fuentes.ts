import type { Fuente } from "./schemas";

/**
 * Un chip de cita: uno o más fragmentos que salen del MISMO documento y llevan
 * al MISMO lugar. `ns` son los números con los que la respuesta los cita.
 */
export type ChipDeFuente = Omit<Fuente, "n"> & { ns: number[] };

/**
 * Agrupa las fuentes de una respuesta en chips (2026-09-26). El buscador
 * devuelve fragmentos, y dos fragmentos del mismo documento pintaban dos chips
 * idénticos: `[3] AF-17 · Skills` `[4] AF-17 · Skills`. Ahora son uno solo,
 * `[3, 4] AF-17 · …`: se conserva cada número, porque la respuesta cita por
 * número, y desaparece la repetición.
 *
 * La clave es código + ancla: mismo documento y mismo destino. Dos fragmentos
 * del CV que llevan a secciones distintas siguen siendo dos chips. El orden es
 * el de la primera aparición, y el tooltip junta los títulos distintos.
 */
export function agruparFuentes(fuentes: readonly Fuente[]): ChipDeFuente[] {
  const chips = new Map<string, ChipDeFuente>();
  for (const f of fuentes) {
    const clave = `${f.codigo}\u0000${f.ancla}`;
    const previo = chips.get(clave);
    if (!previo) {
      chips.set(clave, {
        ns: [f.n],
        codigo: f.codigo,
        titulo: f.titulo,
        ancla: f.ancla,
        destino: f.destino,
      });
      continue;
    }
    previo.ns.push(f.n);
    if (!previo.titulo.split("\n").includes(f.titulo)) {
      previo.titulo = `${previo.titulo}\n${f.titulo}`;
    }
  }
  return [...chips.values()];
}
