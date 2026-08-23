/**
 * Iconos de las tarjetas de la vitrina (S5).
 *
 * Regla 8 del molde del brochure: **el icono de cada tarjeta sale del design
 * system de la app de origen** y sus señas visuales se llevan como los MISMOS
 * SVG, «idénticos y sin desincronizarse». Por eso estos trazos están copiados
 * VERBATIM del `docs/BROCHURE.html` de cada app, no re-dibujados.
 *
 * ⚠ El `brochure-export.json` v1.0.0 **no transporta el icono**: por eso el
 * único vínculo con el origen es esta copia fechada. Queda anotado en la
 * bitácora como sugerencia a la planeadora (campo `grupos[].icono` en un
 * v1.1.0 del contrato) — mientras no exista, un cambio de icono allá NO llega
 * aquí solo, y la ficha se re-sincroniza a mano.
 *
 * Cuando el brochure de origen no le da tarjeta a un grupo del export, el
 * icono se dibuja AQUÍ en la misma familia (24×24, trazo, `pathLength="1"`) y
 * se declara en la tabla de abajo. Nunca un emoji: el DS de CV Viva no los usa.
 */

type Dibujo = () => React.ReactElement;

/* ── habla · «Hablemos San» ────────────────────────────────────────────────
 * 1–6: idénticos a app-habla/docs/BROCHURE.html (export sellado 2026-08-08).
 * 7–8: dibujados aquí — el brochure resuelve esos dos mensajes con escenas a
 *      página completa, no con tarjeta, así que no había icono que copiar.
 */

/** Un brote: la idea que nace cada mañana. */
const BROTE: Dibujo = () => (
  <svg viewBox="0 0 24 24" focusable="false">
    <path pathLength={1} d="M12 21v-8" />
    <path pathLength={1} d="M12 14c0-3 2-5 5-5 0 3-2 5-5 5Z" />
    <path pathLength={1} d="M12 16c0-3-2-5-5-5 0 3 2 5 5 5Z" />
  </svg>
);

/** El bocadillo: la voz como control del juego. */
const BOCADILLO: Dibujo = () => (
  <svg viewBox="0 0 24 24" focusable="false">
    <path
      pathLength={1}
      d="M20 15a2 2 0 0 1-2 2H8l-4 3.5V6a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2Z"
    />
  </svg>
);

/** El micrófono: la voz de la familia grabada en el aparato. */
const MICROFONO: Dibujo = () => (
  <svg viewBox="0 0 24 24" focusable="false">
    <rect pathLength={1} x="9" y="2" width="6" height="11" rx="3" />
    <path pathLength={1} d="M5 10a7 7 0 0 0 14 0" />
    <path pathLength={1} d="M12 17v4M9 21h6" />
  </svg>
);

/** La diana: el objetivo que la terapeuta pidió. */
const DIANA: Dibujo = () => (
  <svg viewBox="0 0 24 24" focusable="false">
    <circle pathLength={1} cx="12" cy="12" r="9" />
    <circle pathLength={1} cx="12" cy="12" r="5" />
    <circle pathLength={1} cx="12" cy="12" r="1.5" />
  </svg>
);

/** La brújula: el rumbo, semana a semana. */
const BRUJULA: Dibujo = () => (
  <svg viewBox="0 0 24 24" focusable="false">
    <circle pathLength={1} cx="12" cy="12" r="9" />
    <path pathLength={1} d="M15.5 8.5l-2 5-5 2 2-5 5-2Z" />
  </svg>
);

/** El engranaje: la app se ajusta a él. */
const ENGRANAJE: Dibujo = () => (
  <svg viewBox="0 0 24 24" focusable="false">
    <circle pathLength={1} cx="12" cy="12" r="3" />
    <path
      pathLength={1}
      d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 1 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 1 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.6 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 1 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.6a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 1 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9v.09a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1Z"
    />
  </svg>
);

/**
 * El aparato con la voz adentro (grupo 7 — «la promesa mayor»). Dibujado aquí
 * desde la escena del clímax del brochure de habla, que usa el mismo lenguaje:
 * el marco es la frontera y las barras del medidor mueren dentro de él.
 */
const APARATO_CERRADO: Dibujo = () => (
  <svg viewBox="0 0 24 24" focusable="false">
    <rect pathLength={1} x="3" y="3" width="18" height="18" rx="4" />
    <path pathLength={1} d="M9 10v4M12 8v8M15 11v2" />
  </svg>
);

/** La regla (grupo 8 — «lo fino»): lo que mide, y hasta dónde. */
const REGLA: Dibujo = () => (
  <svg viewBox="0 0 24 24" focusable="false">
    <path pathLength={1} d="M3 15h18" />
    <path pathLength={1} d="M7 15v-4M12 15V7M17 15v-4" />
  </svg>
);

/** Por defecto: un rombo — la seña de sección del propio CV Viva. */
const ROMBO: Dibujo = () => (
  <svg viewBox="0 0 24 24" focusable="false">
    <path pathLength={1} d="M12 3.5 20.5 12 12 20.5 3.5 12Z" />
  </svg>
);

const ICONOS: Record<string, Record<number, Dibujo>> = {
  habla: {
    1: BROTE,
    2: BOCADILLO,
    3: MICROFONO,
    4: DIANA,
    5: BRUJULA,
    6: ENGRANAJE,
    7: APARATO_CERRADO,
    8: REGLA,
  },
};

/**
 * Decorativo por definición (`aria-hidden`): el sentido lo carga el nombre del
 * grupo, que va al lado en texto real.
 */
export function IconoGrupo({ slug, orden }: { slug: string; orden: number }) {
  const Dibujo = ICONOS[slug]?.[orden] ?? ROMBO;
  return (
    <span className="icono-grupo" aria-hidden="true">
      <Dibujo />
    </span>
  );
}
