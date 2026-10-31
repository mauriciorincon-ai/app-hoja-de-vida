import type { Acento } from "./contenido";

/**
 * LA PIEL DEL BROCHURE COMO DATOS (S28): la paleta y el contraste WCAG, puros.
 *
 * La hoja (`brochure.css`) escribe estos mismos colores; `tests/unit/brochure-contraste.test.ts`
 * calcula, con estas funciones, el contraste de CADA par que la hoja usa y exige AA (4,5:1 para
 * texto), y comprueba que la hoja y esta tabla digan lo mismo. Así un acento nuevo, o un color
 * movido en un solo lado, falla en una prueba y no en axe al final.
 */

/** Papel y tinta de CV Viva (los mismos de `globals.css`). */
export const PAPEL = {
  0: "#fbfaf7",
  1: "#f5f3ed",
  2: "#ece9e0",
  3: "#ddd8cb",
} as const;
export const TINTA = { 0: "#121110", 1: "#2a2927", 2: "#5e5c55" } as const;

/**
 * El texto TENUE sobre fondo oscuro (la portada, la cinta, los servicios). `ink-3` está vetado
 * como texto por nombre y por hex (da 2,7:1 sobre papel); sobre la tinta oscura el mismo gris
 * cumpliría, pero el veto es del token y no del fondo. Este es otro token, con otro valor, y
 * vive solo en las secciones oscuras (lo vigila el test): ≥ 7:1 sobre la tinta 0.
 */
export const TENUE_SOBRE_OSCURO = "#aaa89d";

/** Cada acento: el pastel de relleno y su tinta (texto sobre el pastel, o sobre papel). */
export const PALETA: Record<Acento, { pastel: string; tinta: string }> = {
  sage: { pastel: "#cfe3cf", tinta: "#3c5a3c" },
  sky: { pastel: "#cedde9", tinta: "#2e4e6b" },
  lilac: { pastel: "#ddd3e8", tinta: "#4e3e6b" },
  peach: { pastel: "#f2dec4", tinta: "#6b4820" },
  rose: { pastel: "#f2d6d6", tinta: "#7a3f3f" },
  citron: { pastel: "#e6e3b8", tinta: "#5e5a1e" },
};

const canales = (hex: string): [number, number, number] => {
  if (!/^#[0-9a-f]{6}$/i.test(hex))
    throw new Error(`color inválido: «${hex}» (se espera #rrggbb)`);
  return [1, 3, 5].map((i) => parseInt(hex.slice(i, i + 2), 16)) as [
    number,
    number,
    number,
  ];
};

/** Luminancia relativa WCAG 2.x. */
export function luminancia(hex: string): number {
  const [r, g, b] = canales(hex).map((v) => {
    const c = v / 255;
    return c <= 0.03928 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4;
  }) as [number, number, number];
  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
}

/** Razón de contraste WCAG entre dos colores (1 a 21). */
export function contraste(a: string, b: string): number {
  const [claro, oscuro] = [luminancia(a), luminancia(b)].sort(
    (x, y) => y - x,
  ) as [number, number];
  return (claro + 0.05) / (oscuro + 0.05);
}

/** `color-mix(in srgb, a p%, b)`: la mezcla que usa la hoja para el fondo de «con la app». */
export function mezcla(a: string, b: string, porcentajeDeA: number): string {
  const p = porcentajeDeA / 100;
  const [ca, cb] = [canales(a), canales(b)];
  return `#${ca
    .map((v, i) =>
      Math.round(v * p + cb[i]! * (1 - p))
        .toString(16)
        .padStart(2, "0"),
    )
    .join("")}`;
}
