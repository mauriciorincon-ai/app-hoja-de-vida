import { Fraunces, Inter, JetBrains_Mono } from "next/font/google";

/**
 * Las tres familias del sitio, en un solo lugar (2026-09-26). Las usan el
 * layout de cada idioma y el 404 de la raíz (`app/not-found.tsx`), que no
 * pasa por ese layout. Definirlas dos veces duplicaría las @font-face.
 */

// Presupuesto LCP: la webfont del titular compite con el primer paint.
// Fraunces va en UN peso estático (todo el display usa 500).
export const fraunces = Fraunces({
  variable: "--font-fraunces",
  subsets: ["latin"],
  weight: "500",
  display: "swap",
});

// display optional: si Inter no llega en el primer instante, la visita usa el
// fallback métrico-ajustado (sin swap tardío — el repaint del swap re-registra
// el LCP). Visitas con caché ven Inter siempre. Ver ADR-006.
export const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "optional",
});

// display optional (patrón ADR-006, como Inter): /cv usa la mono de forma
// estructural (headings, contacto, periodos) y su swap tardío reacomodaba la
// página entera (CLS 0.125 en CI). Con optional el fallback métrico-ajustado
// no desplaza nada.
// CON preload (2026-09-26): sin él, la fuente se pedía recién cuando el CSS la
// necesitaba, llegaba tarde a la ventana de optional, y la PRIMERA visita
// pintaba las cifras de la HOME, de los casos y de /cv en Arial (el fallback
// de next/font): medido 30 de 30 cargas en frío, con y sin red limitada.
export const jetbrains = JetBrains_Mono({
  variable: "--font-jetbrains",
  subsets: ["latin"],
  display: "optional",
});
