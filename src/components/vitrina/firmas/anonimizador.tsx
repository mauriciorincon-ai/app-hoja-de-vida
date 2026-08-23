/**
 * FIRMA de «Velo» — su clímax re-dibujado en los tokens de CV Viva.
 *
 * La escena original (app-anonimizador/docs/BROCHURE.html, «El viaje completo,
 * de ida y de vuelta»): las demás herramientas hacen media travesía —
 * anonimizan y se despiden. Velo cubre el viaje entero: tu mesa vela el
 * archivo, lo velado es lo ÚNICO que cruza la frontera, el tercero trabaja
 * encima, y con tu bóveda —que nunca cruzó— lo recuperas.
 *
 * Estática: el trazo se dibuja al entrar (una vez). El loop ambiental está
 * reservado al clímax de habla, la única promesa que nunca descansa.
 */
export function FirmaAnonimizador() {
  return (
    <svg
      viewBox="0 0 320 132"
      className="maqueta firma-clima"
      role="img"
      aria-label="El viaje completo: tu mesa vela el archivo, solo lo velado cruza la frontera, el tercero trabaja encima y con tu bóveda —que nunca cruzó— recuperas los originales."
    >
      {/* La frontera: la línea que solo cruza lo velado. */}
      <path className="fc-fuga fc-quieta" d="M160 10v112" />
      <text className="mq-rotulo" x="160" y="8" textAnchor="middle">
        LA FRONTERA
      </text>

      {/* ── Tu mesa (izquierda) ─────────────────────────────────────────── */}
      <rect className="fc-marco" x="16" y="24" width="104" height="46" rx="8" />
      <path
        className="mq-trazo trazable"
        pathLength={1}
        d="M16 38h104M50 38v32M84 38v32"
      />
      <circle className="mq-punto" cx="33" cy="48" r="3" />
      <circle className="mq-punto" cx="33" cy="60" r="3" />
      <text className="mq-rotulo" x="68" y="82" textAnchor="middle">
        TU MESA
      </text>

      {/* La bóveda: se queda de este lado. SIEMPRE. */}
      <rect className="fc-boveda" x="40" y="94" width="56" height="26" rx="6" />
      <path
        className="mq-trazo trazable"
        pathLength={1}
        d="M62 104v-4a6 6 0 0 1 12 0v4"
      />
      <text className="mq-rotulo" x="68" y="130" textAnchor="middle">
        TU BÓVEDA · NO CRUZA
      </text>

      {/* ── Ida: lo velado cruza ────────────────────────────────────────── */}
      <path
        className="mq-trazo trazable"
        pathLength={1}
        d="M124 40h72M188 34l8 6-8 6"
      />
      <text className="mq-rotulo" x="160" y="30" textAnchor="middle">
        VELADO
      </text>

      {/* ── El tercero (derecha) ────────────────────────────────────────── */}
      <rect
        className="fc-marco"
        x="200"
        y="24"
        width="104"
        height="46"
        rx="8"
      />
      <path
        className="mq-trazo trazable"
        pathLength={1}
        d="M200 38h104M234 38v32M268 38v32"
      />
      <rect
        className="mq-dia-lleno"
        x="272"
        y="42"
        width="26"
        height="24"
        rx="3"
      />
      <text className="mq-rotulo" x="252" y="82" textAnchor="middle">
        EL TERCERO TRABAJA
      </text>

      {/* ── Vuelta: regresa y se desvela con la bóveda ──────────────────── */}
      <path
        className="mq-trazo trazable"
        pathLength={1}
        d="M252 88v14h-96M164 96l-8 6 8 6"
      />
      <text className="mq-rotulo" x="212" y="120" textAnchor="middle">
        Y VUELVE — SE DESVELA
      </text>
    </svg>
  );
}
