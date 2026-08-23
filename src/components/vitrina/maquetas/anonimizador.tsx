/**
 * Tira visual de «Velo» — S5. **Esquemática A PROPÓSITO: no finge ser una
 * captura** (banco §7). Las pantallas reales de la app viven dentro de las
 * tarjetas; esto son sus IDEAS en el lenguaje de CV Viva.
 *
 * Gramática compartida por las seis tiras: cuatro columnas iguales de 80, el
 * dibujo arriba y su rótulo mono debajo, centrados en 40 · 120 · 200 · 280.
 */
export function MaquetaAnonimizador() {
  return (
    <svg
      viewBox="0 0 320 92"
      className="maqueta"
      role="img"
      aria-label="Esquema de Velo: la tabla que delata, los datos que se velan, la frontera que solo cruza el archivo velado, y el regreso que devuelve los originales."
    >
      {/* ── 1 · Mira lo que te delata ───────────────────────────────────── */}
      <rect className="mq-caja" x="18" y="14" width="44" height="34" rx="4" />
      <path
        className="mq-trazo trazable"
        pathLength={1}
        d="M18 24h44M32 24v24M46 24v24"
      />
      <circle className="mq-punto" cx="25" cy="33" r="2" />
      <circle className="mq-punto" cx="25" cy="42" r="2" />
      <text className="mq-rotulo" x="40" y="72" textAnchor="middle">
        QUÉ TE DELATA
      </text>

      {/* ── 2 · Decide qué se le hace: el valor se vuelve seudónimo ─────── */}
      <rect className="mq-caja" x="98" y="18" width="20" height="12" rx="3" />
      <rect
        className="mq-dia-lleno"
        x="122"
        y="32"
        width="20"
        height="12"
        rx="3"
      />
      <path
        className="mq-trayectoria trazable"
        pathLength={1}
        d="M108 32 C 108 40, 118 36, 122 38"
      />
      <text className="mq-rotulo" x="120" y="72" textAnchor="middle">
        SE VELA
      </text>

      {/* ── 3 · La frontera: solo cruza lo velado ───────────────────────── */}
      <path className="mq-veto-barra trazable" pathLength={1} d="M200 12v38" />
      <rect
        className="mq-dia-lleno"
        x="176"
        y="25"
        width="16"
        height="11"
        rx="3"
      />
      <path
        className="mq-trazo trazable"
        pathLength={1}
        d="M194 30h18M206 26l6 4-6 4"
      />
      <text className="mq-rotulo" x="200" y="72" textAnchor="middle">
        LA FRONTERA
      </text>

      {/* ── 4 · El regreso: vuelve y se desvela ─────────────────────────── */}
      <path
        className="mq-trazo trazable"
        pathLength={1}
        d="M296 22h-24a8 8 0 0 0 0 16h24"
      />
      <path className="mq-trazo trazable" pathLength={1} d="M290 16l6 6-6 6" />
      <circle className="mq-punto" cx="272" cy="46" r="2.5" />
      <text className="mq-rotulo" x="280" y="72" textAnchor="middle">
        Y VUELVE
      </text>
    </svg>
  );
}
