/**
 * Maqueta de «Hablemos San» — S5.
 *
 * NO es una captura: es un DIBUJO que representa la visual de la app, hecho con
 * los tokens de CV Viva (misma regla que el texto: re-expresar, no calcar). El
 * visitante debe reconocer la app de un vistazo sin que la ficha se salga del
 * design system de esta casa.
 *
 * Qué representa: la cápsula del día del adulto + el globo que sube con la voz
 * del niño y el micrófono con su barra de nivel — los tres elementos que hacen
 * a habla reconocible.
 *
 * Las líneas con `trazable` se dibujan solas al entrar en pantalla
 * (stroke-dashoffset); con `prefers-reduced-motion` nacen dibujadas.
 */
export function MaquetaHabla() {
  return (
    <svg
      viewBox="0 0 320 200"
      className="maqueta"
      role="img"
      aria-label="Representación de Hablemos San: la cápsula del día, un globo que sube con la voz y el micrófono con su barra de nivel."
    >
      {/* Pantalla */}
      <rect
        className="mq-lienzo"
        x="8"
        y="8"
        width="304"
        height="184"
        rx="14"
      />

      {/* Cabecera: saludo + contador de días que nunca baja */}
      <text className="mq-h" x="24" y="34">
        Hoy
      </text>
      <rect
        className="mq-acento-suave"
        x="212"
        y="19"
        width="86"
        height="20"
        rx="10"
      />
      <text className="mq-acento-texto" x="255" y="33" textAnchor="middle">
        12 días juntos
      </text>

      {/* Cápsula del día */}
      <rect className="mq-caja" x="20" y="50" width="164" height="76" rx="10" />
      <text className="mq-etiqueta" x="32" y="68">
        LA CÁPSULA DE HOY
      </text>
      <rect
        className="mq-linea-texto"
        x="32"
        y="78"
        width="126"
        height="6"
        rx="3"
      />
      <rect
        className="mq-linea-texto"
        x="32"
        y="90"
        width="104"
        height="6"
        rx="3"
      />
      {/* «Sí, ya lo hicimos» — el botón que sella el día */}
      <rect
        className="mq-solido"
        x="32"
        y="104"
        width="92"
        height="16"
        rx="8"
      />
      <path className="mq-tick trazable" d="M42 112l4 4 7-8" />
      <text className="mq-solido-texto" x="60" y="115">
        Ya lo hicimos
      </text>

      {/* El globo que sube con la voz — trayectoria punteada */}
      <path
        className="mq-trayectoria trazable"
        d="M248 118 C 236 96, 262 78, 250 56"
      />
      <circle className="mq-globo" cx="250" cy="48" r="15" />
      <path className="mq-globo-cuerda trazable" d="M250 63v9" />
      <rect
        className="mq-globo-cesta"
        x="245"
        y="72"
        width="10"
        height="7"
        rx="2"
      />
      {/* Nubes que pasan hacia abajo */}
      <ellipse className="mq-nube" cx="212" cy="60" rx="11" ry="5" />
      <ellipse className="mq-nube" cx="292" cy="92" rx="9" ry="4" />

      {/* Micrófono + barra de nivel de voz */}
      <rect
        className="mq-caja"
        x="20"
        y="136"
        width="278"
        height="44"
        rx="10"
      />
      <rect className="mq-mic" x="36" y="147" width="12" height="18" rx="6" />
      <path
        className="mq-mic-base trazable"
        d="M32 160a10 10 0 0 0 20 0M42 170v5"
      />
      {/* El nivel que baila: alturas distintas = voz real, no adorno */}
      {[
        [66, 8],
        [76, 15],
        [86, 22],
        [96, 13],
        [106, 26],
        [116, 17],
        [126, 10],
        [136, 20],
        [146, 14],
        [156, 7],
      ].map(([x, alto]) => (
        <rect
          key={x}
          className="mq-nivel"
          x={x}
          y={165 - alto}
          width="5"
          height={alto}
          rx="2.5"
        />
      ))}
      {/* Anclada al borde derecho: creciendo desde x fijo se salía del lienzo. */}
      <text className="mq-etiqueta" x="286" y="163" textAnchor="end">
        LA VOZ NO SE GUARDA
      </text>
    </svg>
  );
}
