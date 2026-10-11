/**
 * Tira visual de «AngelGhost» (`copiloto-consultor`) — 2026-10-11. Esquemática
 * a propósito (banco §7): las ideas de la app, no su interfaz.
 */
export function MaquetaCopilotoConsultor() {
  return (
    <svg
      viewBox="0 0 320 92"
      className="maqueta"
      role="img"
      aria-label="Esquema de AngelGhost: la pregunta que cae en la reunión con la pantalla compartida, la ventana que solo tú ves, tu evidencia exacta en el momento justo, y nada que quede en el equipo."
    >
      {/* ── 1 · La pantalla compartida y la pregunta en el aire ─────────── */}
      <rect className="mq-caja" x="16" y="16" width="46" height="30" rx="3" />
      <path
        className="mq-trazo trazable"
        pathLength={1}
        d="M24 26h18M24 33h26M24 40h14"
      />
      <circle className="mq-globo" cx="60" cy="16" r="7" />
      <text className="mq-rotulo" x="40" y="72" textAnchor="middle">
        LA PREGUNTA
      </text>

      {/* ── 2 · La ventana que solo tú ves, sobre la pantalla ───────────── */}
      <rect className="mq-caja" x="96" y="16" width="46" height="30" rx="3" />
      <path
        className="mq-trazo trazable"
        pathLength={1}
        d="M104 26h18M104 33h12"
      />
      <rect
        className="mq-dia-lleno"
        x="120"
        y="28"
        width="24"
        height="18"
        rx="2"
      />
      <circle className="mq-punto" cx="132" cy="37" r="2.5" />
      <text className="mq-rotulo" x="120" y="72" textAnchor="middle">
        SOLO TÚ
      </text>

      {/* ── 3 · Tu ficha exacta, en el momento justo ────────────────────── */}
      <path
        className="mq-trayectoria trazable"
        pathLength={1}
        d="M166 31 C 172 31, 174 31, 180 31"
      />
      <rect className="mq-caja" x="180" y="14" width="40" height="34" rx="3" />
      <path
        className="mq-trazo trazable"
        pathLength={1}
        d="M188 24h18M188 31h24M188 38h14"
      />
      <circle className="mq-punto" cx="212" cy="24" r="2.5" />
      <text className="mq-rotulo" x="200" y="72" textAnchor="middle">
        TU EVIDENCIA
      </text>

      {/* ── 4 · Nada queda: lo visto se borra y se comprueba ────────────── */}
      <rect className="mq-caja" x="262" y="16" width="22" height="16" rx="2" />
      <rect className="mq-caja" x="272" y="26" width="22" height="16" rx="2" />
      <path
        className="mq-veto-barra trazable"
        pathLength={1}
        d="M262 46l36-32"
      />
      <text className="mq-rotulo" x="280" y="72" textAnchor="middle">
        NADA QUEDA
      </text>
    </svg>
  );
}
