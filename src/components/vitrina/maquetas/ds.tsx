/**
 * Tira visual de «Probeta DS» — S5. Esquemática a propósito (banco §7).
 */
export function MaquetaDs() {
  return (
    <svg
      viewBox="0 0 320 92"
      className="maqueta"
      role="img"
      aria-label="Esquema de Probeta DS: el CSV que entra, los datos sucios que se sanean, el modelo contra el baseline, y el veredicto que también dice que no sirve."
    >
      {/* ── 1 · Entra un CSV ────────────────────────────────────────────── */}
      <rect className="mq-caja" x="24" y="14" width="32" height="34" rx="3" />
      <path
        className="mq-trazo trazable"
        pathLength={1}
        d="M30 24h20M30 31h20M30 38h12"
      />
      <text className="mq-rotulo" x="40" y="72" textAnchor="middle">
        TU CSV
      </text>

      {/* ── 2 · Se sanea: lo sucio se aparta ────────────────────────────── */}
      <circle className="mq-veto-fondo" cx="112" cy="26" r="7" />
      <circle className="mq-punto-suave" cx="112" cy="26" r="2.5" />
      <path
        className="mq-trayectoria trazable"
        pathLength={1}
        d="M120 30 C 128 34, 126 40, 132 43"
      />
      <rect
        className="mq-dia-lleno"
        x="126"
        y="16"
        width="14"
        height="10"
        rx="2"
      />
      <path className="mq-trazo trazable" pathLength={1} d="M100 46h40" />
      <text className="mq-rotulo" x="120" y="72" textAnchor="middle">
        SE SANEA
      </text>

      {/* ── 3 · Compite contra el baseline ──────────────────────────────── */}
      <rect
        className="mq-dia-vacio"
        x="184"
        y="26"
        width="12"
        height="22"
        rx="2"
      />
      <rect
        className="mq-dia-lleno"
        x="204"
        y="16"
        width="12"
        height="32"
        rx="2"
      />
      <path className="mq-trazo trazable" pathLength={1} d="M180 26h40" />
      <text className="mq-rotulo" x="200" y="72" textAnchor="middle">
        VS. BASELINE
      </text>

      {/* ── 4 · El veredicto: puede decir que NO sirve ──────────────────── */}
      <circle className="mq-veto-fondo" cx="280" cy="31" r="15" />
      <path
        className="mq-trazo trazable"
        pathLength={1}
        d="M272 31l6 6 11-12"
      />
      <text className="mq-rotulo" x="280" y="72" textAnchor="middle">
        EL VEREDICTO
      </text>
    </svg>
  );
}
