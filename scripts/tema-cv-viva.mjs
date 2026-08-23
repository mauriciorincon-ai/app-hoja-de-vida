/**
 * TEMA CV VIVA PARA LAS CAPTURAS — la app hermana, repintada con TUS tokens.
 *
 * Por qué existe: seis apps con seis marcas propias, puestas juntas en la
 * hoja de vida, dan un collage. La decisión del gate M2 fue clara — «toma su
 * diseño y ponle el diseño que tiene la hoja de vida». Aquí no se re-dibuja
 * nada: se fotografía **la app real corriendo**, pero con sus variables de
 * color redefinidas a la paleta de CV Viva antes de disparar. La pantalla, el
 * texto y el comportamiento son los de verdad; solo cambia el pigmento.
 *
 * Las seis declaran su paleta en custom properties (Tailwind v4 `@theme` o un
 * `:root` a mano), así que basta un `<style>` inyectado al final para ganarles
 * por orden de documento. Va con `!important` porque un `@theme` de Tailwind
 * también aterriza en `:root` y no quiero depender de quién se declaró último.
 *
 * REGLA DE MAPEO (la que evita capturas rotas): un token no se traduce por
 * parecido de color sino por **papel**. El acento SÓLIDO de una app lleva
 * texto claro encima, así que va al verde OSCURO (`sage-ink`), jamás al pastel
 * `sage` — pintar el botón de pastel y dejarle el texto blanco mata el
 * contraste y la captura sale enseñando un defecto que la app no tiene. Los
 * tintes (fondos suaves) sí van a los pasteles.
 *
 * Lo que NO toca: la tipografía. Cada app carga sus fuentes con `next/font` y
 * cambiarlas desde fuera cambia métricas de texto — desbordes, botones
 * recortados — es decir, capturas que mienten. Se decide aparte si hace falta.
 */

/** Los tokens de CV Viva (design-system.md · `@theme` de globals.css). */
export const CV = {
  paper0: "#fbfaf7",
  paper1: "#f5f3ed",
  paper2: "#ece9e0",
  paper3: "#ddd8cb",
  ink0: "#121110",
  ink1: "#2a2927",
  ink2: "#5e5c55",
  ink3: "#9c9a90",
  sage: "#cfe3cf",
  sageInk: "#3c5a3c",
  rose: "#f2d6d6",
  roseInk: "#7a3f3f",
  sky: "#cedde9",
  skyInk: "#2e4e6b",
  citron: "#e6e3b8",
  citronInk: "#5e5a1e",
  lilac: "#ddd3e8",
  lilacInk: "#4e3e6b",
  peach: "#f2dec4",
  peachInk: "#6b4820",
  danger: "#c97a7a",
};

/** Intermedios que la paleta no nombra pero los mapeos necesitan. */
const SAGE_TENUE = "#e7efe7"; // fondo de un aviso en verde
const SAGE_MEDIO = "#4a6b4a"; // hover del acento sólido
const ROSE_TENUE = "#f7ecec";
const PEACH_TENUE = "#f7efe4";
const LILAC_TENUE = "#efeaf4";
const SKY_TENUE = "#eaeef2";

/** `{ "--token": "valor" }` → un bloque `:root` con todo en `!important`. */
function bloque(mapa) {
  const cuerpo = Object.entries(mapa)
    .map(([k, v]) => `  ${k}: ${v} !important;`)
    .join("\n");
  return `:root {\n${cuerpo}\n}\n`;
}

/**
 * Cada app con su mapa. La clave es el token TAL COMO lo declara esa app —
 * por eso los nombres van en el idioma de cada repo.
 */
const MAPAS = {
  /* ── habla ── ya nace en crema/salvia: el ajuste es de afinación, para que
     sus neutros sean EXACTAMENTE los de esta página y no unos parecidos. */
  habla: {
    "--color-cream-50": CV.paper0,
    "--color-cream-100": CV.paper1,
    "--color-cream-200": CV.paper2,
    "--color-cream-300": CV.paper3,
    "--color-ink-900": CV.ink0,
    "--color-ink-700": CV.ink1,
    "--color-ink-500": CV.ink2,
    "--color-ink-400": CV.ink3,
    "--color-ink-300": CV.ink3,
    "--color-sage-50": "#f1f5f0",
    "--color-sage-100": SAGE_TENUE,
    "--color-sage-200": CV.sage,
    "--color-sage-400": "#7d9a7d",
    "--color-sage-500": SAGE_MEDIO,
    "--color-sage-600": SAGE_MEDIO,
    "--color-sage-700": CV.sageInk,
    // El área de juego del niño: los pasteles de esta página, no los suyos.
    "--color-coral-100": CV.rose,
    "--color-coral-300": "#e3b3b3",
    "--color-coral-500": CV.roseInk,
    "--color-coral-700": CV.roseInk,
    "--color-ambar-100": CV.peach,
    "--color-ambar-300": "#dcc39a",
    "--color-ambar-500": CV.peachInk,
    "--color-ambar-700": CV.peachInk,
    "--color-kid-bg": CV.paper0,
    "--color-kid-sage": CV.sage,
    "--color-kid-peach": CV.peach,
    "--color-kid-sky": CV.sky,
    "--color-kid-yellow": CV.citron,
    "--color-kid-ink": CV.ink0,
    "--color-fiesta-coral": CV.roseInk,
    "--color-fiesta-verde": CV.sageInk,
    "--color-fiesta-cielo": CV.skyInk,
    "--color-fiesta-sol": CV.citronInk,
    "--color-fiesta-uva": CV.lilacInk,
  },

  /* ── anonimizador ── verde oscuro sobre papel: ya cerca, se alinea. */
  anonimizador: {
    "--papel": CV.paper0,
    "--papel-hundido": CV.paper1,
    "--superficie": "#ffffff",
    "--borde": CV.paper2,
    "--borde-control": CV.ink3,
    "--tinta": CV.ink0,
    "--tinta-suave": CV.ink1,
    "--tinta-tenue": CV.ink2,
    "--acento": CV.sageInk,
    "--acento-tenue": SAGE_TENUE,
    "--alerta": CV.roseInk,
    "--alerta-tenue": ROSE_TENUE,
    "--aviso": CV.peachInk,
    "--aviso-tenue": PEACH_TENUE,
    "--sensible": CV.lilacInk,
    "--sensible-tenue": LILAC_TENUE,
  },

  /* ── dash-agent-ai ── el único OSCURO. Se vuelca a papel entero: si se
     quedara en negro sería la pieza disonante de la vitrina. Ojo con sus
     tintes: están escritos como rgba de BLANCO (legibles sobre negro), y
     sobre papel desaparecen — por eso aquí se reescriben en rgba de TINTA. */
  "dash-agent-ai": {
    "--color-bg": CV.paper0,
    "--color-surface": "#ffffff",
    "--color-surface-2": CV.paper1,
    "--color-rule": CV.paper2,
    "--color-rule-strong": CV.paper3,
    "--color-ink": CV.ink0,
    "--color-ink-2": CV.ink2,
    "--color-accent": CV.sageInk,
    "--color-accent-ink": "#ffffff",
    "--color-measured": CV.ink1,
    "--color-measured-tint": "rgba(18, 17, 16, 0.06)",
    "--color-measured-bd": "rgba(18, 17, 16, 0.32)",
    "--color-chip-bd": CV.paper3,
    "--color-hatch": "rgba(94, 92, 85, 0.5)",
    "--color-warn": CV.peachInk,
    "--color-warn-tint": "rgba(107, 72, 32, 0.10)",
    "--color-warn-bd": "rgba(107, 72, 32, 0.45)",
    "--color-danger": CV.roseInk,
    "--color-danger-tint": "rgba(122, 63, 63, 0.10)",
    "--color-danger-bd": "rgba(122, 63, 63, 0.5)",
    "--color-focus": CV.sageInk,
  },

  /* ── ds ── teal analítico → verde salvia. */
  ds: {
    "--bg": CV.paper0,
    "--surface": "#ffffff",
    "--sunken": CV.paper1,
    "--ink": CV.ink0,
    "--ink-muted": CV.ink2,
    "--hairline": CV.paper2,
    "--accent": CV.sageInk,
    "--accent-ink": "#ffffff",
    "--positive": CV.sageInk,
    "--caution": CV.peachInk,
    "--negative": CV.roseInk,
  },

  /* ── nutri-kids ── shadcn en oklch: se reemplaza por hex sin problema (el
     token es opaco al formato). El semáforo conserva su semántica, pintado
     con los pasteles de esta página. */
  "nutri-kids": {
    "--background": CV.paper0,
    "--foreground": CV.ink0,
    "--card": "#ffffff",
    "--card-foreground": CV.ink0,
    "--popover": "#ffffff",
    "--popover-foreground": CV.ink0,
    "--primary": CV.sageInk,
    "--primary-foreground": CV.paper0,
    "--secondary": CV.paper2,
    "--secondary-foreground": CV.ink1,
    "--muted": CV.paper1,
    "--muted-foreground": CV.ink2,
    "--accent": CV.sage,
    "--accent-foreground": CV.sageInk,
    "--destructive": CV.roseInk,
    "--border": CV.paper2,
    "--input": CV.paper2,
    "--ring": CV.sageInk,
    "--tl-green": CV.sageInk,
    "--tl-green-surface": SAGE_TENUE,
    "--tl-yellow": CV.peachInk,
    "--tl-yellow-surface": PEACH_TENUE,
    "--tl-red": CV.roseInk,
    "--tl-red-surface": ROSE_TENUE,
  },

  /* ── inmobiliaria ── la que disparó la corrección: morado #7b5dd6 por todas
     partes. Sus tokens conservan el NOMBRE «purple» (no se edita el repo
     hermano) pero el valor pasa a la familia salvia. */
  inmobiliaria: {
    "--color-ink": CV.ink0,
    "--color-gray": CV.ink1,
    "--color-mute": CV.ink2,
    "--color-purple": CV.sageInk,
    "--color-purple-600": "#2f4830",
    "--color-purple-soft": "#9dbc9d",
    "--color-purple-200": CV.sage,
    "--color-purple-tint": SAGE_TENUE,
    "--color-lilac": CV.sage,
    "--color-cream": CV.paper0,
    "--color-mint": SAGE_TENUE,
    "--color-sky": SKY_TENUE,
    "--background": CV.paper0,
    "--foreground": CV.ink0,
  },
};

/**
 * COLOR ESCRITO A MANO. Un token repintado no alcanza cuando el color viaja
 * como literal dentro del JSX — típicamente en las ilustraciones SVG, que
 * llevan su `fill="#..."` en el atributo. Se rescatan por selector de atributo,
 * que compara el valor tal cual está escrito (por eso el hex va con la MISMA
 * caja que en el archivo de origen).
 */
const LITERALES = {
  inmobiliaria: [
    // La casa del hero (components/landing/Hero.tsx): tejado, puerta, ventanas.
    `[fill="#7b5dd6"] { fill: ${CV.sageInk} !important; }`,
    `[fill="#ebe9fc"] { fill: ${SAGE_TENUE} !important; }`,
    `[fill="#cdbaf2"] { fill: ${CV.sage} !important; }`,
    `[fill="#e7eefb"] { fill: ${SKY_TENUE} !important; }`,
  ],
};

/**
 * CSS listo para inyectar en la app `slug`. Además del mapa, los remates que
 * valen para todas:
 *
 *  - **Fondo de papel garantizado** — varias pintan `#fff` a mano en el `body`.
 *  - **Esquema claro forzado** — tres de las seis traen bloque
 *    `prefers-color-scheme: dark`, y el modo del equipo que captura no puede
 *    decidir cómo se ve la vitrina.
 *  - **Transiciones a cero.** Este fue el que costó caro: al repintar, todo
 *    elemento con `transition-colors` arranca un viaje del color viejo al
 *    nuevo, y el disparo lo pilla a media zancada. Las dos únicas manchas
 *    moradas que sobrevivieron a la primera pasada de inmobiliaria eran
 *    justamente las dos con transición (la barra de progreso, `duration-500`,
 *    y el botón de la banda de cupos). Se fotografía el estado ASENTADO.
 *  - Fuera el overlay de desarrollo.
 */
export function temaPara(slug) {
  const mapa = MAPAS[slug];
  if (!mapa) return null;
  return [
    ":root { color-scheme: light !important; }",
    bloque(mapa),
    ...(LITERALES[slug] ?? []),
    `html, body { background: ${CV.paper0} !important; color: ${CV.ink0} !important; }`,
    "*, *::before, *::after { transition-duration: 0s !important; }",
    "nextjs-portal { display: none !important; }",
  ].join("\n");
}
