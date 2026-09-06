import { G, trazar, type Proceso } from "@/lib/vitrina/bpmn";

/**
 * EL PROCESO, EN BPMN (ADR-016). Server component: pinta en SVG lo que el
 * motor (`lib/vitrina/bpmn.ts`) ya calculó — aquí no hay geometría, solo
 * trazos y tokens del design system.
 *
 * Responsive sin encoger: el diagrama se parte en filas (eventos de enlace)
 * cuando no cabe, y por debajo de su ancho mínimo el contenedor desplaza en
 * horizontal en vez de reducir el texto hasta lo ilegible. Todo el texto está
 * en el SVG como <text>: entra al HTML estático (gate ATS) y lo lee un lector
 * de pantalla a través del `aria-label` + las notas al pie, que son HTML.
 */

const FUENTE =
  "Inter, -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif";
const MONO = "'JetBrains Mono', ui-monospace, SFMono-Regular, Menlo, monospace";

export function ProcesoBpmn({
  proceso,
  columnasPorFila = 6,
  id,
}: {
  proceso: Proceso;
  columnasPorFila?: number;
  id: string;
}) {
  const t = trazar(proceso, { columnasPorFila });
  const marcador = `flecha-${id}`;

  return (
    <figure className="m-0" data-proceso={id}>
      {/* Región con scroll horizontal (móvil): debe poder recibir foco por
          teclado — axe la cazó en las 12 rutas móviles (scrollable-region-focusable). */}
      <div
        className="overflow-x-auto focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-sage-ink"
        data-desliza
        tabIndex={0}
        role="region"
        aria-label={proceso.titulo}
      >
        <svg
          viewBox={`0 0 ${t.ancho} ${t.alto}`}
          className="block h-auto w-full"
          style={{ minWidth: Math.min(t.ancho, 720) }}
          role="img"
          aria-label={`Proceso: ${proceso.titulo}`}
          fontFamily={FUENTE}
        >
          <defs>
            <marker
              id={marcador}
              viewBox="0 0 10 10"
              refX="9"
              refY="5"
              markerWidth="8"
              markerHeight="8"
              orient="auto-start-reverse"
            >
              <path d="M0,0 L10,5 L0,10 z" fill="var(--color-ink-1)" />
            </marker>
          </defs>

          {/* Pool y carriles */}
          <text
            x={8}
            y={G.MARGEN_SUP - 12}
            fontFamily={MONO}
            fontSize={10.5}
            fontWeight={500}
            letterSpacing={1.4}
            fill="var(--color-sage-ink)"
          >
            {proceso.titulo.toUpperCase()}
          </text>
          {t.filas.map((fila, fi) => (
            <g key={fi}>
              <rect
                x={4}
                y={fila.y}
                width={t.ancho - 8}
                height={fila.alto}
                rx={10}
                fill="var(--color-paper-0)"
                stroke="var(--color-paper-3)"
              />
              {fila.carriles.map((c, ci) => (
                <g key={c.id}>
                  {ci % 2 === 1 && (
                    <rect
                      x={4}
                      y={c.y}
                      width={t.ancho - 8}
                      height={c.alto}
                      fill="var(--color-paper-1)"
                    />
                  )}
                  {ci > 0 && (
                    <line
                      x1={4}
                      y1={c.y}
                      x2={t.ancho - 4}
                      y2={c.y}
                      stroke="var(--color-paper-3)"
                    />
                  )}
                  {c.lineas.map((linea, li) => (
                    <text
                      key={li}
                      x={16}
                      y={
                        c.y +
                        c.alto / 2 +
                        4 -
                        (c.lineas.length - 1) * 6.5 +
                        li * 13
                      }
                      fontFamily={MONO}
                      fontSize={10}
                      fontWeight={500}
                      letterSpacing={1.2}
                      fill="var(--color-ink-2)"
                    >
                      {linea.toUpperCase()}
                    </text>
                  ))}
                </g>
              ))}
              <line
                x1={G.ROTULO_CARRIL - 8}
                y1={fila.y}
                x2={G.ROTULO_CARRIL - 8}
                y2={fila.y + fila.alto}
                stroke="var(--color-paper-3)"
              />
            </g>
          ))}

          {/* Flujos (debajo de los nodos, que los tapan al llegar) */}
          {t.flujos.map((f, i) => (
            <g key={i}>
              <path
                d={f.d}
                fill="none"
                stroke="var(--color-ink-1)"
                strokeWidth={1.4}
                markerEnd={`url(#${marcador})`}
              />
              {f.etiqueta && (
                <text
                  x={f.lx}
                  y={f.ly}
                  fontSize={10.5}
                  fontWeight={600}
                  textAnchor={f.anclaTexto ?? "start"}
                  fill="var(--color-sage-ink)"
                >
                  {f.etiqueta}
                </text>
              )}
            </g>
          ))}

          {/* Eventos de enlace (cuando el proceso se parte en filas) */}
          {t.enlaces.map((e) => (
            <g key={e.letra} fontFamily={MONO} fontSize={10} fontWeight={600}>
              {[e.salida, e.entrada].map((p, k) => (
                <g key={k}>
                  <circle
                    cx={p.x}
                    cy={p.y}
                    r={G.RADIO_ENLACE}
                    fill="var(--color-paper-0)"
                    stroke="var(--color-ink-1)"
                    strokeWidth={1.4}
                  />
                  <text
                    x={p.x}
                    y={p.y + 3.5}
                    textAnchor="middle"
                    fill="var(--color-ink-0)"
                  >
                    {e.letra}
                  </text>
                </g>
              ))}
            </g>
          ))}

          {/* Nodos */}
          {t.nodos.map((n) => (
            <g key={n.id} data-paso={n.id}>
              {n.tipo === "inicio" && (
                <>
                  <circle
                    cx={n.x}
                    cy={n.y}
                    r={G.RADIO_EVENTO}
                    fill="var(--color-sage)"
                    stroke="var(--color-sage-ink)"
                    strokeWidth={1.5}
                  />
                  {n.lineas.map((linea, li) => (
                    <text
                      key={li}
                      x={n.x}
                      y={n.b + 13 + li * 11}
                      fontSize={9.5}
                      textAnchor="middle"
                      fill="var(--color-ink-2)"
                    >
                      {linea}
                    </text>
                  ))}
                </>
              )}
              {n.tipo === "fin" && (
                <circle
                  cx={n.x}
                  cy={n.y}
                  r={G.RADIO_EVENTO}
                  fill="var(--color-paper-0)"
                  stroke="var(--color-ink-0)"
                  strokeWidth={3}
                />
              )}
              {n.tipo === "decision" && (
                <>
                  <rect
                    x={n.x - G.LADO_DECISION / 2}
                    y={n.y - G.LADO_DECISION / 2}
                    width={G.LADO_DECISION}
                    height={G.LADO_DECISION}
                    rx={4}
                    transform={`rotate(45 ${n.x} ${n.y})`}
                    fill="var(--color-citron)"
                    stroke="var(--color-citron-ink)"
                    strokeWidth={1.5}
                  />
                  <text
                    x={n.x}
                    y={n.y + 4}
                    fontSize={10.5}
                    fontWeight={600}
                    textAnchor="middle"
                    fill="var(--color-ink-0)"
                  >
                    {n.texto}
                  </text>
                </>
              )}
              {n.tipo === "tarea" && (
                <>
                  <rect
                    x={n.l}
                    y={n.t}
                    width={n.r - n.l}
                    height={n.b - n.t}
                    rx={8}
                    fill="var(--color-paper-0)"
                    stroke="var(--color-ink-0)"
                    strokeWidth={1.3}
                  />
                  {n.lineas.map((linea, li) => (
                    <text
                      key={li}
                      x={n.x}
                      y={n.y + 4 - (n.lineas.length - 1) * 6.5 + li * 13}
                      fontSize={11}
                      fontWeight={500}
                      textAnchor="middle"
                      fill="var(--color-ink-0)"
                    >
                      {linea}
                    </text>
                  ))}
                </>
              )}
              {n.nota && (
                <g>
                  <circle
                    cx={n.r - 2}
                    cy={n.t + 2}
                    r={8}
                    fill="var(--color-lilac)"
                    stroke="var(--color-lilac-ink)"
                    strokeWidth={1}
                  />
                  <text
                    x={n.r - 2}
                    y={n.t + 5.5}
                    fontFamily={MONO}
                    fontSize={9}
                    fontWeight={600}
                    textAnchor="middle"
                    fill="var(--color-lilac-ink)"
                  >
                    {n.nota}
                  </text>
                </g>
              )}
            </g>
          ))}
        </svg>
      </div>

      {t.notas.length > 0 && (
        <figcaption className="mt-3">
          <ol className="m-0 flex list-none flex-col gap-1.5 p-0">
            {t.notas.map((nota) => (
              <li
                key={nota.n}
                data-nota={nota.n}
                className="flex items-start gap-2 text-[13px] leading-snug text-ink-2"
              >
                <span
                  aria-hidden="true"
                  className="mt-0.5 flex size-4 shrink-0 items-center justify-center rounded-full bg-lilac font-mono text-[9px] font-semibold text-lilac-ink"
                >
                  {nota.n}
                </span>
                <span>{nota.texto}</span>
              </li>
            ))}
          </ol>
        </figcaption>
      )}
    </figure>
  );
}
