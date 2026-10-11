/**
 * Tira visual de «HackGuard» — 2026-10-11. Esquemática a propósito (banco §7):
 * las ideas de la app, no su interfaz.
 */
export function MaquetaHackguard() {
  return (
    <svg
      viewBox="0 0 320 92"
      className="maqueta"
      role="img"
      aria-label="Esquema de HackGuard: el catálogo vivo de pruebas de seguridad, las cuatro preguntas por app, el hallazgo que es un control fallando, y cada prueba atada a su marco con versión."
    >
      {/* ── 1 · El catálogo vivo: fichas de prueba ──────────────────────── */}
      {[0, 1, 2, 3, 4, 5].map((i) => (
        <rect
          key={i}
          className={i === 5 ? "mq-caja" : "mq-dia-lleno"}
          x={18 + (i % 3) * 16}
          y={16 + Math.floor(i / 3) * 17}
          width="12"
          height="13"
          rx="2"
        />
      ))}
      <text className="mq-rotulo" x="40" y="72" textAnchor="middle">
        EL CATÁLOGO
      </text>

      {/* ── 2 · Qué probé, qué esperaba, qué obtuve, qué me falta ───────── */}
      {[18, 26, 34, 42].map((y, i) => (
        <g key={y}>
          <rect
            className={i === 3 ? "mq-dia-vacio" : "mq-dia-lleno"}
            x="98"
            y={y - 3}
            width="7"
            height="6"
            rx="1"
          />
          <path
            className="mq-trazo trazable"
            pathLength={1}
            d={`M110 ${y}h${i === 3 ? 14 : 24}`}
          />
        </g>
      ))}
      <text className="mq-rotulo" x="120" y="72" textAnchor="middle">
        4 PREGUNTAS
      </text>

      {/* ── 3 · Un hallazgo es un control que falla ─────────────────────── */}
      <path
        className="mq-veto-fondo"
        d="M200 13l15 5v10c0 9-6 15-15 20-9-5-15-11-15-20V18z"
      />
      <path
        className="mq-veto-barra trazable"
        pathLength={1}
        d="M194 24l12 12M206 24l-12 12"
      />
      <text className="mq-rotulo" x="200" y="72" textAnchor="middle">
        CONTROL FALLA
      </text>

      {/* ── 4 · Cada prueba, atada a su marco con versión ───────────────── */}
      <rect className="mq-caja" x="262" y="17" width="36" height="14" rx="3" />
      <circle className="mq-punto" cx="268" cy="24" r="2" />
      <path className="mq-trazo trazable" pathLength={1} d="M274 24h18" />
      <rect
        className="mq-dia-lleno"
        x="272"
        y="37"
        width="16"
        height="6"
        rx="1"
      />
      <path className="mq-trazo trazable" pathLength={1} d="M280 31v6" />
      <text className="mq-rotulo" x="280" y="72" textAnchor="middle">
        CON SU MARCO
      </text>
    </svg>
  );
}
