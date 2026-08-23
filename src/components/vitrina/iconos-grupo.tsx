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

/* ── anonimizador · «Velo» ─────────────────────────────────────────────────
 * Los 5, idénticos a app-anonimizador/docs/BROCHURE.html.
 */
const LUPA: Dibujo = () => (
  <svg viewBox="0 0 24 24" focusable="false">
    <circle pathLength={1} cx="11" cy="11" r="6" />
    <path pathLength={1} d="m20 20-4.3-4.3" />
  </svg>
);
const DOCUMENTO: Dibujo = () => (
  <svg viewBox="0 0 24 24" focusable="false">
    <path
      pathLength={1}
      d="M14 3H7a1 1 0 0 0-1 1v16a1 1 0 0 0 1 1h10a1 1 0 0 0 1-1V7l-4-4Z"
    />
    <path pathLength={1} d="M14 3v4h4M9 13h6M9 17h4" />
  </svg>
);
const TRUEQUE: Dibujo = () => (
  <svg viewBox="0 0 24 24" focusable="false">
    <path pathLength={1} d="M4 8h13l-3-3M20 16H7l3 3" />
  </svg>
);
const BARRAS: Dibujo = () => (
  <svg viewBox="0 0 24 24" focusable="false">
    <path pathLength={1} d="M4 20V10M10 20V4M16 20v-7M22 20H2" />
  </svg>
);
const REGRESO: Dibujo = () => (
  <svg viewBox="0 0 24 24" focusable="false">
    <path pathLength={1} d="M9 5 4 10l5 5" />
    <path pathLength={1} d="M4 10h10a6 6 0 0 1 0 12h-3" />
  </svg>
);

/* ── dash-agent-ai ─────────────────────────────────────────────────────────
 * Los 5, idénticos a app-dash-agent-ai/docs/BROCHURE.html (viewBox 16).
 */
const CEREBRO: Dibujo = () => (
  <svg viewBox="0 0 16 16" focusable="false">
    <path
      pathLength={1}
      d="M8 1.75 A4.25 4.25 0 0 1 10.5 9.4 V11 H5.5 V9.4 A4.25 4.25 0 0 1 8 1.75 Z"
    />
    <path pathLength={1} d="M6 13 H10" />
    <path pathLength={1} d="M6.75 14.75 H9.25" />
  </svg>
);
const BALANZA: Dibujo = () => (
  <svg viewBox="0 0 16 16" focusable="false">
    <path pathLength={1} d="M8 2.5 V13.5" />
    <path pathLength={1} d="M5 13.5 H11" />
    <path pathLength={1} d="M2.5 5 H13.5" />
    <path pathLength={1} d="M2.5 5 L1 9 H4 Z" />
    <path pathLength={1} d="M13.5 5 L12 9 H15 Z" />
  </svg>
);
const RELOJ: Dibujo = () => (
  <svg viewBox="0 0 16 16" focusable="false">
    <path
      pathLength={1}
      d="M14.25 8 A6.25 6.25 0 1 1 1.75 8 A6.25 6.25 0 1 1 14.25 8 Z"
    />
    <path pathLength={1} d="M8 4.25 V8 L10.75 9.75" />
  </svg>
);
const ARCHIVO: Dibujo = () => (
  <svg viewBox="0 0 16 16" focusable="false">
    <path pathLength={1} d="M3.75 1.75 H9.5 L12.25 4.5 V14.25 H3.75 Z" />
    <path pathLength={1} d="M9.25 1.75 V4.75 H12.25" />
  </svg>
);
const CANDADO: Dibujo = () => (
  <svg viewBox="0 0 16 16" focusable="false">
    <path pathLength={1} d="M3.25 7.25 H12.75 V14.25 H3.25 Z" />
    <path pathLength={1} d="M5.5 7.25 V4.75 A2.5 2.5 0 0 1 10.5 4.75 V7.25" />
  </svg>
);

/* ── ds · «Probeta DS» ─────────────────────────────────────────────────────
 * 1–4 idénticos a app-ds/docs/BROCHURE.html. El 5 («Transversales») no tiene
 * tarjeta allá: dibujado aquí en la misma familia.
 */
const VISTO: Dibujo = () => (
  <svg viewBox="0 0 24 24" focusable="false">
    <path pathLength={1} d="m4 12.5 5.5 5.5L20 7" />
  </svg>
);
const TABLA: Dibujo = () => (
  <svg viewBox="0 0 24 24" focusable="false">
    <rect pathLength={1} x="3" y="4" width="18" height="16" rx="2" />
    <path pathLength={1} d="M3 10h18" />
    <path pathLength={1} d="M9 10v10" />
  </svg>
);
const DESTELLO: Dibujo = () => (
  <svg viewBox="0 0 24 24" focusable="false">
    <path pathLength={1} d="M12 3v6" />
    <path pathLength={1} d="M12 15v6" />
    <path pathLength={1} d="M3 12h6" />
    <path pathLength={1} d="M15 12h6" />
    <path pathLength={1} d="m6.3 6.3 3 3" />
    <path pathLength={1} d="m14.7 14.7 3 3" />
    <path pathLength={1} d="m17.7 6.3-3 3" />
    <path pathLength={1} d="m9.3 14.7-3 3" />
  </svg>
);
const DESCARGA: Dibujo = () => (
  <svg viewBox="0 0 24 24" focusable="false">
    <path pathLength={1} d="M4 17v2a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-2" />
    <path pathLength={1} d="M12 4v11" />
    <path pathLength={1} d="m7 10 5 5 5-5" />
  </svg>
);
/** Las capas que atraviesan todo (grupo 5 de ds, sin tarjeta en su brochure). */
const CAPAS: Dibujo = () => (
  <svg viewBox="0 0 24 24" focusable="false">
    <path pathLength={1} d="m12 3 9 5-9 5-9-5 9-5Z" />
    <path pathLength={1} d="m3 13 9 5 9-5" />
  </svg>
);

/* ── nutri-kids ────────────────────────────────────────────────────────────
 * Los 5, idénticos a app-nutri-kids/docs/BROCHURE.html.
 */
const LUPA_NK: Dibujo = () => (
  <svg viewBox="0 0 24 24" focusable="false">
    <circle pathLength={1} cx="11" cy="11" r="8" />
    <path pathLength={1} d="m21 21-4.34-4.34" />
  </svg>
);
const RELOJ_NK: Dibujo = () => (
  <svg viewBox="0 0 24 24" focusable="false">
    <circle pathLength={1} cx="12" cy="12" r="10" />
    <path pathLength={1} d="M12 6v6l4 2" />
  </svg>
);
const CHISPA: Dibujo = () => (
  <svg viewBox="0 0 24 24" focusable="false">
    <path
      pathLength={1}
      d="M11.017 2.814a1 1 0 0 1 1.966 0l1.051 5.558a2 2 0 0 0 1.594 1.594l5.558 1.051a1 1 0 0 1 0 1.966l-5.558 1.051a2 2 0 0 0-1.594 1.594l-1.051 5.558a1 1 0 0 1-1.966 0l-1.051-5.558a2 2 0 0 0-1.594-1.594l-5.558-1.051a1 1 0 0 1 0-1.966l5.558-1.051a2 2 0 0 0 1.594-1.594z"
    />
    <path pathLength={1} d="M20 2v4" />
    <path pathLength={1} d="M22 4h-4" />
  </svg>
);
const SUBIR_ARCHIVO: Dibujo = () => (
  <svg viewBox="0 0 24 24" focusable="false">
    <path
      pathLength={1}
      d="M6 22a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h8a2.4 2.4 0 0 1 1.704.706l3.588 3.588A2.4 2.4 0 0 1 20 8v12a2 2 0 0 1-2 2z"
    />
    <path pathLength={1} d="M14 2v5a1 1 0 0 0 1 1h5" />
    <path pathLength={1} d="M12 12v6" />
    <path pathLength={1} d="m15 15-3-3-3 3" />
  </svg>
);
const AJUSTE_NK: Dibujo = () => (
  <svg viewBox="0 0 24 24" focusable="false">
    <path
      pathLength={1}
      d="M9.671 4.136a2.34 2.34 0 0 1 4.659 0 2.34 2.34 0 0 0 3.319 1.915 2.34 2.34 0 0 1 2.33 4.033 2.34 2.34 0 0 0 0 3.831 2.34 2.34 0 0 1-2.33 4.033 2.34 2.34 0 0 0-3.319 1.915 2.34 2.34 0 0 1-4.659 0 2.34 2.34 0 0 0-3.32-1.915 2.34 2.34 0 0 1-2.33-4.033 2.34 2.34 0 0 0 0-3.831A2.34 2.34 0 0 1 6.35 6.051a2.34 2.34 0 0 0 3.319-1.915"
    />
    <circle pathLength={1} cx="12" cy="12" r="3" />
  </svg>
);

/* ── inmobiliaria · «Innmobiliaria» ────────────────────────────────────────
 * Los 4, idénticos a app-inmobiliaria/docs/BROCHURE.html.
 */
const MEGAFONO: Dibujo = () => (
  <svg viewBox="0 0 24 24" focusable="false">
    <path
      pathLength={1}
      d="M3 11v2a1 1 0 0 0 1 1h2l4 4V6L6 10H4a1 1 0 0 0-1 1Z"
    />
    <path pathLength={1} d="M15 9a4 4 0 0 1 0 6M18 6a8 8 0 0 1 0 12" />
  </svg>
);
const LISTA_CHEQUEO: Dibujo = () => (
  <svg viewBox="0 0 24 24" focusable="false">
    <path pathLength={1} d="M4 7h16M4 12h10M4 17h7" />
    <path pathLength={1} d="m17 15 2 2 4-4" />
  </svg>
);
const FOTO: Dibujo = () => (
  <svg viewBox="0 0 24 24" focusable="false">
    <rect pathLength={1} x="3" y="5" width="18" height="14" rx="2.5" />
    <circle pathLength={1} cx="8.5" cy="10" r="1.6" />
    <path pathLength={1} d="m4 17 5-4 4 3 3-2 4 3" />
  </svg>
);
const ESCUDO: Dibujo = () => (
  <svg viewBox="0 0 24 24" focusable="false">
    <path
      pathLength={1}
      d="M12 3 5 6v6c0 4.2 2.9 7.6 7 9 4.1-1.4 7-4.8 7-9V6l-7-3Z"
    />
    <path pathLength={1} d="m9 12 2 2 4-4" />
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
  anonimizador: { 1: LUPA, 2: DOCUMENTO, 3: TRUEQUE, 4: BARRAS, 5: REGRESO },
  "dash-agent-ai": { 1: CEREBRO, 2: BALANZA, 3: RELOJ, 4: ARCHIVO, 5: CANDADO },
  ds: { 1: VISTO, 2: TABLA, 3: DESTELLO, 4: DESCARGA, 5: CAPAS },
  "nutri-kids": {
    1: LUPA_NK,
    2: RELOJ_NK,
    3: CHISPA,
    4: SUBIR_ARCHIVO,
    5: AJUSTE_NK,
  },
  inmobiliaria: { 1: MEGAFONO, 2: LISTA_CHEQUEO, 3: FOTO, 4: ESCUDO },
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
