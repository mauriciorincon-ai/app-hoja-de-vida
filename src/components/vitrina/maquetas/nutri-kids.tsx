/**
 * Tira visual de «Nutri-Kids» — S5. Esquemática a propósito (banco §7).
 */
export function MaquetaNutriKids() {
  return (
    <svg
      viewBox="0 0 320 92"
      className="maqueta"
      role="img"
      aria-label="Esquema de Nutri-Kids: la pregunta de si esto se puede, el día en comidas que se van marcando, las preguntas con tus palabras, y que nunca hay nota ni porcentaje."
    >
      {/* ── 1 · ¿Esto se puede? El semáforo del alimento ────────────────── */}
      <circle className="mq-veto-fondo" cx="40" cy="30" r="15" />
      <path className="mq-trazo trazable" pathLength={1} d="M33 30l5 5 9-10" />
      <text className="mq-rotulo" x="40" y="72" textAnchor="middle">
        ¿SE PUEDE?
      </text>

      {/* ── 2 · El día de hoy: comidas que se marcan ────────────────────── */}
      {[0, 1, 2].map((i) => (
        <g key={i}>
          <rect
            className="mq-caja"
            x="98"
            y={14 + i * 12}
            width="44"
            height="9"
            rx="2.5"
          />
          <circle
            className={i < 2 ? "mq-punto" : "mq-punto-suave"}
            cx="104"
            cy={18.5 + i * 12}
            r="2.2"
          />
        </g>
      ))}
      <text className="mq-rotulo" x="120" y="72" textAnchor="middle">
        EL DÍA DE HOY
      </text>

      {/* ── 3 · Pregúntale con tus palabras ─────────────────────────────── */}
      <path
        className="mq-trazo trazable"
        pathLength={1}
        d="M178 40V22a4 4 0 0 1 4-4h32a4 4 0 0 1 4 4v12a4 4 0 0 1-4 4h-24l-12 8Z"
      />
      <path
        className="mq-trazo trazable"
        pathLength={1}
        d="M186 25h20M186 31h12"
      />
      <text className="mq-rotulo" x="200" y="72" textAnchor="middle">
        PREGÚNTALE
      </text>

      {/* ── 4 · Nunca una nota: el porcentaje, vetado ───────────────────── */}
      <circle className="mq-veto-fondo" cx="280" cy="31" r="15" />
      <path
        className="mq-trazo trazable"
        pathLength={1}
        d="M274 25h12M274 37h12"
      />
      <path
        className="mq-veto-barra trazable"
        pathLength={1}
        d="M270 41l20-20"
      />
      <text className="mq-rotulo" x="280" y="72" textAnchor="middle">
        SIN NOTAS
      </text>
    </svg>
  );
}
