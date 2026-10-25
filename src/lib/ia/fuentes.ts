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

/**
 * Las marcas `[1]`, `[1, 3]`, `[2][4]` que el texto de una respuesta trae.
 * Devuelve los números citados, sin repetir.
 */
export function numerosCitados(texto: string): Set<number> {
  const citados = new Set<number>();
  for (const m of texto.matchAll(/\[(\d+(?:\s*[,;]\s*\d+)*)\]/g)) {
    for (const n of m[1].split(/[,;]/)) citados.add(Number(n.trim()));
  }
  return citados;
}

/**
 * Solo las fuentes que la respuesta CITA (S24, OM-16). El servidor manda las
 * RECUPERADAS antes de que el modelo hable, y hasta el S23 el panel pintaba
 * un chip por cada una: «¿cómo está el clima?» salía con el tablero de
 * energía y clima como cita, aunque la respuesta no lo usara. Ahora el chip
 * existe porque el texto dice `[n]`; una respuesta que no cita nada (la
 * estática, la ajena que el modelo declinó) no trae chips.
 */
export function fuentesCitadas(
  texto: string,
  fuentes: readonly Fuente[],
): Fuente[] {
  const citados = numerosCitados(texto);
  return fuentes.filter((f) => citados.has(f.n));
}
