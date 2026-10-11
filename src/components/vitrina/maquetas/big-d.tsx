/**
 * Tira visual de «Big-D» — 2026-10-11. Esquemática a propósito (banco §7):
 * las ideas de la app, no su interfaz.
 */
export function MaquetaBigD() {
  return (
    <svg
      viewBox="0 0 320 92"
      className="maqueta"
      role="img"
      aria-label="Esquema de Big-D: las plataformas de datos dibujadas con el mismo mapa, la evidencia con fecha y firma, quién gana para tu caso, y con qué peso cambiaría la respuesta."
    >
      {/* ── 1 · El mismo mapa para todas las plataformas ────────────────── */}
      {[14, 36, 58].map((x) => (
        <g key={x}>
          <rect
            className="mq-caja"
            x={x}
            y="14"
            width="16"
            height="32"
            rx="2"
          />
          <circle className="mq-punto" cx={x + 8} cy="21" r="2" />
          <path
            className="mq-trazo trazable"
            pathLength={1}
            d={`M${x + 4} 29h8M${x + 4} 36h8`}
          />
        </g>
      ))}
      <text className="mq-rotulo" x="40" y="72" textAnchor="middle">
        MISMO MAPA
      </text>

      {/* ── 2 · Evidencia fechada, con cita y con firma ─────────────────── */}
      <rect className="mq-caja" x="100" y="14" width="40" height="34" rx="3" />
      <path
        className="mq-trazo trazable"
        pathLength={1}
        d="M108 23h24M108 30h24"
      />
      <rect
        className="mq-dia-lleno"
        x="108"
        y="37"
        width="16"
        height="6"
        rx="1"
      />
      <circle className="mq-punto" cx="132" cy="40" r="2.5" />
      <text className="mq-rotulo" x="120" y="72" textAnchor="middle">
        CON FECHA
      </text>

      {/* ── 3 · Quién gana para tu caso, y por cuánto ───────────────────── */}
      <rect
        className="mq-dia-vacio"
        x="182"
        y="28"
        width="10"
        height="20"
        rx="2"
      />
      <rect
        className="mq-dia-lleno"
        x="196"
        y="16"
        width="10"
        height="32"
        rx="2"
      />
      <rect
        className="mq-dia-vacio"
        x="210"
        y="24"
        width="10"
        height="24"
        rx="2"
      />
      <path className="mq-trazo trazable" pathLength={1} d="M178 48h44" />
      <text className="mq-rotulo" x="200" y="72" textAnchor="middle">
        QUIÉN GANA
      </text>

      {/* ── 4 · Mueve un peso y mira cuánto cambia ──────────────────────── */}
      <rect
        className="mq-dia-vacio"
        x="268"
        y="16"
        width="8"
        height="12"
        rx="1.5"
      />
      <rect
        className="mq-dia-lleno"
        x="284"
        y="18"
        width="8"
        height="10"
        rx="1.5"
      />
      <path className="mq-trazo trazable" pathLength={1} d="M262 40h36" />
      <circle className="mq-punto" cx="274" cy="40" r="4" />
      <path className="mq-trayectoria trazable" pathLength={1} d="M280 40h14" />
      <text className="mq-rotulo" x="280" y="72" textAnchor="middle">
        CON QUÉ PESO
      </text>
    </svg>
  );
}
