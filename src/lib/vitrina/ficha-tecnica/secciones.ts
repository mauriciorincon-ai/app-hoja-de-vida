/**
 * La numeración de las secciones de la ficha técnica — pura, sin React.
 *
 * Desde v1.1.0 el proceso BPMN es opcional. Cuando falta, «Cómo funciona» no
 * se pinta y las demás **se renumeran** (01 · 02 · 03 · 04) en vez de dejar un
 * hueco (01 · 03 · 04 · 05) que haría pensar al lector que algo se perdió.
 * Las claves son semánticas (`s02` = el proceso siempre) para que los textos
 * de `messages/*.json` no dependan de la posición.
 */
export const SECCIONES = ["s01", "s02", "s03", "s04", "s05"] as const;
export type Seccion = (typeof SECCIONES)[number];

export function numerarSecciones(
  conProceso: boolean,
): Record<Seccion, string | undefined> {
  const visibles = SECCIONES.filter((s) => conProceso || s !== "s02");
  const numeros = {} as Record<Seccion, string | undefined>;
  for (const s of SECCIONES) {
    const i = visibles.indexOf(s);
    numeros[s] = i === -1 ? undefined : String(i + 1).padStart(2, "0");
  }
  return numeros;
}
