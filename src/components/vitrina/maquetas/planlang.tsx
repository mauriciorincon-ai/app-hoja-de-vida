/**
 * Tira visual de «planlang» — 2026-10-11. Esquemática a propósito (banco §7):
 * las ideas de la app, no su interfaz.
 */
export function MaquetaPlanlang() {
  return (
    <svg
      viewBox="0 0 320 92"
      className="maqueta"
      role="img"
      aria-label="Esquema de planlang: el plan escrito como contrato con criterios medibles, el agente que se construye desde él, los casos con respuesta conocida, y la brecha entre lo planeado y lo hecho."
    >
      {/* ── 1 · El plan como contrato: criterios con casilla ────────────── */}
      <rect className="mq-caja" x="20" y="14" width="40" height="34" rx="3" />
      {[0, 1, 2].map((i) => (
        <rect
          key={i}
          className="mq-dia-lleno"
          x="26"
          y={20 + i * 9}
          width="6"
          height="6"
          rx="1"
        />
      ))}
      <path
        className="mq-trazo trazable"
        pathLength={1}
        d="M36 23h18M36 32h18M36 41h12"
      />
      <text className="mq-rotulo" x="40" y="72" textAnchor="middle">
        EL CONTRATO
      </text>

      {/* ── 2 · El agente: un grafo de pasos ────────────────────────────── */}
      <path
        className="mq-trazo trazable"
        pathLength={1}
        d="M104 22h32M104 22l16 18 16-18"
      />
      <circle className="mq-punto" cx="104" cy="22" r="4" />
      <circle className="mq-punto-suave" cx="120" cy="22" r="4" />
      <circle className="mq-punto" cx="136" cy="22" r="4" />
      <circle className="mq-punto" cx="120" cy="40" r="4" />
      <text className="mq-rotulo" x="120" y="72" textAnchor="middle">
        EL AGENTE
      </text>

      {/* ── 3 · Casos con respuesta conocida: cada uno se compara ───────── */}
      {[18, 26, 34, 42].map((y, i) => (
        <g key={y}>
          <path
            className="mq-trazo trazable"
            pathLength={1}
            d={`M184 ${y}h18`}
          />
          <rect
            className={i === 2 ? "mq-dia-vacio" : "mq-dia-lleno"}
            x="208"
            y={y - 3}
            width="8"
            height="6"
            rx="1"
          />
        </g>
      ))}
      <text className="mq-rotulo" x="200" y="72" textAnchor="middle">
        LOS CASOS
      </text>

      {/* ── 4 · La brecha: lo planeado contra lo que el agente hizo ─────── */}
      <rect
        className="mq-dia-vacio"
        x="266"
        y="16"
        width="12"
        height="32"
        rx="2"
      />
      <rect
        className="mq-dia-lleno"
        x="282"
        y="26"
        width="12"
        height="22"
        rx="2"
      />
      <path className="mq-trayectoria trazable" pathLength={1} d="M262 16h36" />
      <path className="mq-veto-barra trazable" pathLength={1} d="M288 16v10" />
      <text className="mq-rotulo" x="280" y="72" textAnchor="middle">
        LA BRECHA
      </text>
    </svg>
  );
}
