/**
 * Tira visual de «Innmobiliaria» — S5. Esquemática a propósito (banco §7).
 */
export function MaquetaInmobiliaria() {
  return (
    <svg
      viewBox="0 0 320 92"
      className="maqueta"
      role="img"
      aria-label="Esquema de Innmobiliaria: publicar en tres pasos, el sello que se gana mostrando el certificado, los anuncios que caducan a los 60 días, y el trato directo por WhatsApp."
    >
      {/* ── 1 · Tres pasos y publicado ──────────────────────────────────── */}
      {[0, 1, 2].map((i) => (
        <circle
          key={i}
          className={i < 2 ? "mq-punto" : "mq-punto-suave"}
          cx={24 + i * 16}
          cy="30"
          r="4"
        />
      ))}
      <path
        className="mq-trazo trazable"
        pathLength={1}
        d="M28 30h12M44 30h12"
      />
      <text className="mq-rotulo" x="40" y="72" textAnchor="middle">
        TRES PASOS
      </text>

      {/* ── 2 · El sello se gana: escudo con visto ──────────────────────── */}
      <path
        className="mq-trazo trazable"
        pathLength={1}
        d="M120 14l-14 6v12c0 8.4 5.8 15.2 14 18 8.2-2.8 14-9.6 14-18V20l-14-6Z"
      />
      <path className="mq-trazo trazable" pathLength={1} d="M114 31l4 4 8-8" />
      <text className="mq-rotulo" x="120" y="72" textAnchor="middle">
        SELLO GANADO
      </text>

      {/* ── 3 · Sin anuncios zombi: caduca a los 60 días ────────────────── */}
      <circle className="mq-veto-fondo" cx="200" cy="30" r="15" />
      <path className="mq-trazo trazable" pathLength={1} d="M200 21v9l6 4" />
      <path
        className="mq-trayectoria trazable"
        pathLength={1}
        d="M215 30a15 15 0 0 1-8 13"
      />
      <text className="mq-rotulo" x="200" y="72" textAnchor="middle">
        CADUCA SOLO
      </text>

      {/* ── 4 · Trato directo: el bocadillo, sin intermediario ──────────── */}
      <path
        className="mq-trazo trazable"
        pathLength={1}
        d="M258 40V20a4 4 0 0 1 4-4h32a4 4 0 0 1 4 4v12a4 4 0 0 1-4 4h-24l-12 8Z"
      />
      <circle className="mq-punto" cx="270" cy="26" r="2.2" />
      <circle className="mq-punto" cx="278" cy="26" r="2.2" />
      <circle className="mq-punto" cx="286" cy="26" r="2.2" />
      <text className="mq-rotulo" x="280" y="72" textAnchor="middle">
        TRATO DIRECTO
      </text>
    </svg>
  );
}
