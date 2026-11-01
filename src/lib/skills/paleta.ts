import { mezcla, PALETA } from "@/lib/brochure/contraste";
import type { Acento } from "@/lib/brochure/contenido";

/**
 * LA PIEL DEL EXPLORADOR DE SKILLS COMO DATOS (S29). El sitio es de un solo tema, el claro; solo el
 * rectángulo de Skills es oscuro, con una luz tenue en el centro (la quinta vuelta de la maqueta).
 *
 * La hoja (`src/components/home/skills.css`) escribe estos mismos colores como variables al tope de
 * `[data-skills]`; `tests/unit/skills-contraste.test.ts` comprueba que digan lo mismo y calcula el
 * contraste de cada texto del escenario contra su fondo MÁS CLARO, el punto donde la luz es máxima.
 */

/** El color de cada área, en el orden del CV (la maqueta, `COLORES`). */
export const COLORES_AREAS = [
  "sage",
  "sky",
  "lilac",
  "peach",
  "citron",
  "rose",
  "sky",
  "peach",
  "sage",
] as const satisfies readonly Acento[];

export const colorDeArea = (i: number): Acento =>
  COLORES_AREAS[i % COLORES_AREAS.length]!;

/** El fondo: tres paradas de un degradado radial, y la luz cálida del centro con su opacidad máxima. */
export const ESCENARIO = {
  centro: "#23211e",
  medio: "#151412",
  borde: "#0e0d0c",
  luz: "#ece7da",
  luzAlfa: 0.09,
  /** El texto claro (la invitación, «← Todas las áreas», los nombres de los pasos). */
  texto: "#d9d5ca",
  /** El texto tenue («3 de 9»). */
  tenue: "#bdb8ab",
  /** La ficha del número de cada área: tinta 0 al 82 %. */
  ficha: "#121110",
  fichaAlfa: 0.82,
} as const;

/** La red del fondo (canvas): el color de las líneas, con su opacidad por distancia, y el de los puntos. */
export const RED = {
  linea: "200,218,204",
  punto: "rgba(214,228,216,.34)",
} as const;

/** El punto más claro del fondo: el centro del degradado con la luz encima. */
export const FONDO_MAS_CLARO = mezcla(
  ESCENARIO.luz,
  ESCENARIO.centro,
  ESCENARIO.luzAlfa * 100,
);

/** El fondo de un aro ya abierto: el 14 % de su color sobre el punto más claro (`.disco::after`). */
export const fondoDeAro = (a: Acento) =>
  mezcla(PALETA[a].pastel, FONDO_MAS_CLARO, 14);

/** La ficha del número sobre el pastel más claro de las áreas. */
export const fondoDeFicha = (a: Acento) =>
  mezcla(ESCENARIO.ficha, PALETA[a].pastel, ESCENARIO.fichaAlfa * 100);
