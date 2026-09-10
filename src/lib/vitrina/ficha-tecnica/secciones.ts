/**
 * La numeración de las secciones de la ficha técnica — pura, sin React.
 *
 * Tres secciones son OPCIONALES y las decide la pieza, no el frente: el
 * proceso (v1.1.0), y las conclusiones y la galería (v1.3.0, lo que una pieza
 * con datos trae de más). Cuando una falta, no se pinta y las demás **se
 * renumeran** seguidas en vez de dejar un hueco que haría pensar al lector que
 * algo se perdió. Las claves son semánticas (`s02` = el proceso siempre) para
 * que los textos de `messages/*.json` no dependan de la posición.
 */
export const SECCIONES = [
  "s01", // para quién, y qué resuelve
  "s02", // cómo funciona (proceso) — opcional
  "conclusiones", // lo que los datos dicen — opcional
  "s03", // qué tiene
  "galeria", // cómo se ve — opcional
  "s04", // límites, y lo que nunca hace
  "s05", // dónde está
] as const;
export type Seccion = (typeof SECCIONES)[number];

export type Opcionales = {
  proceso: boolean;
  conclusiones: boolean;
  galeria: boolean;
};

const OPCIONAL: Partial<Record<Seccion, keyof Opcionales>> = {
  s02: "proceso",
  conclusiones: "conclusiones",
  galeria: "galeria",
};

export function numerarSecciones(
  presentes: Opcionales,
): Record<Seccion, string | undefined> {
  const visibles = SECCIONES.filter((s) => {
    const clave = OPCIONAL[s];
    return clave === undefined || presentes[clave];
  });
  const numeros = {} as Record<Seccion, string | undefined>;
  for (const s of SECCIONES) {
    const i = visibles.indexOf(s);
    numeros[s] = i === -1 ? undefined : String(i + 1).padStart(2, "0");
  }
  return numeros;
}
