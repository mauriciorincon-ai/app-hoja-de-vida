/**
 * Tira visual de «Hablemos San» — S5.
 *
 * **Es esquemática A PROPÓSITO: no finge ser una captura.** El banco de
 * técnicas §7 (enmienda kit v1.23.0, veredicto del usuario en el gate de
 * Innmobiliaria) es de dos caras: si una pieza ENSEÑA LA APP van capturas de la
 * app corriendo; el SVG con tokens queda para **ilustraciones ABSTRACTAS que no
 * pretenden ser la app**. Por eso aquí no hay marco de teléfono, ni cabecera, ni
 * cromo de interfaz: son las IDEAS de la app dibujadas en el lenguaje de CV
 * Viva — «una maqueta impecable puede MENTIR».
 *
 * Gramática compartida por las seis tiras: cuatro columnas iguales de 80, el
 * dibujo arriba y su rótulo mono debajo, centrados en 40 · 120 · 200 · 280.
 */
export function MaquetaHabla() {
  return (
    <svg
      viewBox="0 0 320 92"
      className="maqueta"
      role="img"
      aria-label="Esquema de Hablemos San: una idea al día, la voz que hace subir el juego, la voz que no se guarda y los días que se suman."
    >
      {/* ── 1 · Una idea al día ─────────────────────────────────────────── */}
      <rect className="mq-caja" x="20" y="14" width="40" height="34" rx="6" />
      <circle className="mq-punto" cx="29" cy="24" r="2.5" />
      {/* `pathLength={1}` normaliza el trazo para que el dibujado del CSS mida
          en fracciones y no en píxeles (ver `.maqueta .trazable`). */}
      <path
        className="mq-trazo trazable"
        pathLength={1}
        d="M36 24h16M28 34h24M28 41h16"
      />
      <text className="mq-rotulo" x="40" y="72" textAnchor="middle">
        IDEA DEL DÍA
      </text>

      {/* ── 2 · La voz hace subir el juego ──────────────────────────────── */}
      {[
        [100, 7],
        [105, 13],
        [110, 19],
        [115, 11],
      ].map(([x, alto]) => (
        <rect
          key={x}
          className="mq-onda"
          x={x}
          y={48 - alto}
          width="3"
          height={alto}
          rx="1.5"
        />
      ))}
      <path
        className="mq-trayectoria trazable"
        pathLength={1}
        d="M122 46 C 130 38, 128 26, 134 20"
      />
      <circle className="mq-globo" cx="136" cy="16" r="8" />
      <text className="mq-rotulo" x="120" y="72" textAnchor="middle">
        LA VOZ SUBE
      </text>

      {/* ── 3 · La voz no se guarda ─────────────────────────────────────── */}
      <circle className="mq-veto-fondo" cx="200" cy="31" r="15" />
      <circle className="mq-veto-punto" cx="200" cy="31" r="5" />
      <path
        className="mq-veto-barra trazable"
        pathLength={1}
        d="M190 41l20-20"
      />
      <text className="mq-rotulo" x="200" y="72" textAnchor="middle">
        NO SE GUARDA
      </text>

      {/* ── 4 · Los días se suman ───────────────────────────────────────── */}
      {[0, 1, 2, 3, 4, 5].map((i) => (
        <rect
          key={i}
          className={i < 4 ? "mq-dia-lleno" : "mq-dia-vacio"}
          x={258 + (i % 3) * 16}
          y={18 + Math.floor(i / 3) * 16}
          width="11"
          height="11"
          rx="3"
        />
      ))}
      <text className="mq-rotulo" x="280" y="72" textAnchor="middle">
        RACHA DE DÍAS
      </text>
    </svg>
  );
}
