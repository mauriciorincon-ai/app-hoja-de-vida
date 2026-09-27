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

// La mono, cuarta vuelta (2026-09-26, ADR-006 enmendado tres veces ese día).
// 1) `optional` sin precarga: la PRIMERA visita pintaba las cifras en Arial
//    (30 de 30 cargas en frío). No se usó `swap` porque el fallback de
//    next/font es Arial, proporcional, y el cambio reacomodaba /cv (CLS 0.125).
// 2) Con precarga: cifras en su letra, pero ~170 ms más de LCP en la HOME, que
//    quedó en el borde del 0,90 de Lighthouse y la CI caía una vez de cada dos.
// 3) `swap` SIN precarga y con fallback PROPIO, monoespaciado y calibrado
//    con las métricas de la fuente (los @font-face «JBM Fallback» de
//    globals.css). Las cifras llegan a su letra también en la primera visita,
//    el cambio no mueve nada (CLS 0,000 en las 15 URLs de la CI).
//    `adjustFontFallback: false` apaga el de Arial.
// 4) La misma noche: la 3) no alcanzó en la CI (`/es` en 0,89 dos veces de
//    cuatro). Sin precarga, el navegador la pedía igual al armar la página, y
//    en el runner eso cae antes del LCP observado: el simulador la seguía
//    cobrando. Ahora ningún texto la usa hasta que `carga-la-mono.tsx` marca
//    `mono-lista` tras el evento `load` (`--fuente-mono` en globals.css).
export const jetbrains = JetBrains_Mono({
  variable: "--font-jetbrains",
  subsets: ["latin"],
  display: "swap",
  preload: false,
  adjustFontFallback: false,
  fallback: ["JBM Fallback Menlo", "JBM Fallback Courier", "monospace"],
});
