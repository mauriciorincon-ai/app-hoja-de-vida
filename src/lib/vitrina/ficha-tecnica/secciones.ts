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

const OPCIONAL = {
  s02: "proceso",
  conclusiones: "conclusiones",
  galeria: "galeria",
} as const satisfies Partial<Record<Seccion, keyof Opcionales>>;

export type SeccionOpcional = keyof typeof OPCIONAL;
export type SeccionFija = Exclude<Seccion, SeccionOpcional>;

/**
 * Las fijas SIEMPRE tienen número; las opcionales solo si la pieza las trae.
 * El tipo lo dice para que el renderizador no necesite un `!` apoyado en un
 * mapa de runtime: si mañana una fija pasa a opcional, el compilador avisa en
 * cada sitio donde se usaba como segura, en vez de pintar «ft-undefined-…».
 */
export type Numeracion = Record<SeccionFija, string> &
  Partial<Record<SeccionOpcional, string>>;

function esOpcional(s: Seccion): s is SeccionOpcional {
  return s in OPCIONAL;
}

export function numerarSecciones(presentes: Opcionales): Numeracion {
  const visibles = SECCIONES.filter(
    (s) => !esOpcional(s) || presentes[OPCIONAL[s]],
  );
  const numeros: Partial<Record<Seccion, string>> = {};
  visibles.forEach((s, i) => {
    numeros[s] = String(i + 1).padStart(2, "0");
  });
  // Las fijas están todas en `visibles` por construcción (el filtro solo quita
  // opcionales), así que el cast es una afirmación verdadera, no un deseo.
  return numeros as Numeracion;
}
