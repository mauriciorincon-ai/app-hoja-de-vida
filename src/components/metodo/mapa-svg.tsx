import type { BloqueDe, TipoNodo } from "@/lib/metodo/schema";
import { TIPOS_NODO } from "@/lib/metodo/schema";
import type { IdiomaMetodo, Traductor } from "./traductor";

/**
 * EL MAPA (bloque 2): un solo diagrama SVG de la arquitectura o el método de
 * un vistazo, dibujado DESDE EL DATO — nodos numerados en una rejilla
 * (`col`, `fila`) y aristas entre ellos. Nada decorativo: cada forma, cada
 * color y cada línea dicen algo que el texto de abajo también dice.
 *
 *  · **Texto real**, seleccionable y traducible: `<text>`, jamás una imagen de
 *    un texto.
 *  · **Todo color con una palabra**: el tipo de nodo se distingue por FORMA +
 *    PALABRA (la leyenda) + color. Un daltónico lee el mapa sin el color.
 *  · **Alternativa textual completa**: `<title>` y `<desc>` en el SVG y, debajo,
 *    «Lectura del mapa, nodo por nodo» — una lista visible que también sale
 *    impresa. El SVG es `role="img"`: su texto interior no se lee suelto, por
 *    eso la lectura es la alternativa, no un adorno.
 *  · En el teléfono el mapa conserva su tamaño legible y se desliza de lado
 *    (región con foco, para que el teclado también pueda); no se encoge hasta
 *    volver el texto ilegible.
 *
 * Es un componente síncrono sin estado: la forma sale del dato, jamás de
 * `useReducedMotion()` (regla 5a).
 */

const CW = 176; // ancho de una celda
const CH = 104; // alto de una celda
const NW = 140; // ancho de un nodo
const NH = 60; // alto de un nodo
const M = 16; // margen del lienzo

type Nodo = BloqueDe<2>["nodos"][number];

/** Parte una etiqueta en a lo sumo dos líneas, por palabras. */
export function partirEtiqueta(texto: string, max = 17): string[] {
  const palabras = texto.split(/\s+/).filter(Boolean);
  const lineas: string[] = [];
  let actual = "";
  for (const p of palabras) {
    const prueba = actual ? `${actual} ${p}` : p;
    if (prueba.length > max && actual && lineas.length < 1) {
      lineas.push(actual);
      actual = p;
    } else actual = prueba;
  }
  if (actual) lineas.push(actual);
  return lineas;
}

/** La forma de un tipo de nodo dentro de una caja (x, y, ancho, alto). */
function Forma({
  tipo,
  x,
  y,
  w,
  h,
}: {
  tipo: TipoNodo;
  x: number;
  y: number;
  w: number;
  h: number;
}) {
  const trazo = 1.5;
  switch (tipo) {
    case "actor":
      return (
        <rect
          x={x}
          y={y}
          width={w}
          height={h}
          rx={Math.min(12, h / 3)}
          strokeWidth={trazo}
          className="fill-sage stroke-sage-ink"
        />
      );
    case "dato":
      return (
        <g strokeWidth={trazo} className="stroke-sky-ink">
          <rect x={x} y={y} width={w} height={h} rx={3} className="fill-sky" />
          <line
            x1={x + Math.min(14, w / 5)}
            y1={y}
            x2={x + Math.min(14, w / 5)}
            y2={y + h}
          />
        </g>
      );
    case "control": {
      const c = Math.min(14, w / 5);
      const puntos = `${x + c},${y} ${x + w - c},${y} ${x + w},${y + h / 2} ${x + w - c},${y + h} ${x + c},${y + h} ${x},${y + h / 2}`;
      return (
        <polygon
          points={puntos}
          strokeWidth={trazo}
          className="fill-citron stroke-citron-ink"
        />
      );
    }
    case "humano":
      return (
        <ellipse
          cx={x + w / 2}
          cy={y + h / 2}
          rx={w / 2}
          ry={h / 2}
          strokeWidth={trazo}
          className="fill-lilac stroke-lilac-ink"
        />
      );
    case "externo":
      return (
        <rect
          x={x}
          y={y}
          width={w}
          height={h}
          rx={6}
          strokeWidth={trazo}
          strokeDasharray="6 4"
          className="fill-paper-1 stroke-ink-2"
        />
      );
  }
}

/** El punto donde una línea del centro `de` al centro `a` sale del borde de la caja de `de`. */
function salida(
  de: { x: number; y: number },
  a: { x: number; y: number },
  holgura = 0,
) {
  const dx = a.x - de.x;
  const dy = a.y - de.y;
  const escala = Math.min(
    (NW / 2 + holgura) / (Math.abs(dx) || 1e-9),
    (NH / 2 + holgura) / (Math.abs(dy) || 1e-9),
  );
  return { x: de.x + dx * escala, y: de.y + dy * escala };
}

export function MapaSvg({
  bloque,
  idioma,
  t,
}: {
  bloque: BloqueDe<2>;
  idioma: IdiomaMetodo;
  t: Traductor;
}) {
  const { nodos, aristas } = bloque;
  const maxCol = Math.max(...nodos.map((n) => n.col));
  const maxFila = Math.max(...nodos.map((n) => n.fila));
  const ancho = M * 2 + (maxCol + 1) * CW;
  const alto = M * 2 + (maxFila + 1) * CH;
  const centro = (n: Nodo) => ({
    x: M + n.col * CW + CW / 2,
    y: M + n.fila * CH + CH / 2,
  });
  const porId = new Map(nodos.map((n) => [n.n, n]));

  return (
    <div className="flex flex-col gap-6" data-mapa="">
      <p className="text-[13px] text-ink-2 md:hidden print:hidden">
        {t("mapa.desliza")}
      </p>
      <div
        role="region"
        tabIndex={0}
        aria-label={bloque.titulo[idioma]}
        className="overflow-x-auto rounded-[14px] border border-paper-2 bg-paper-0 p-2 print:overflow-visible print:border-0 print:p-0"
      >
        <svg
          role="img"
          aria-labelledby="mapa-titulo mapa-desc"
          viewBox={`0 0 ${ancho} ${alto}`}
          width={ancho}
          height={alto}
          className="mx-auto block h-auto max-w-none print:max-w-full"
          style={{ minWidth: Math.min(ancho, 720) }}
        >
          <title id="mapa-titulo">{bloque.titulo[idioma]}</title>
          <desc id="mapa-desc">{bloque.resumen[idioma]}</desc>
          <defs>
            <marker
              id="mapa-flecha"
              viewBox="0 0 10 10"
              refX="9"
              refY="5"
              markerWidth="7"
              markerHeight="7"
              orient="auto-start-reverse"
            >
              <path d="M 0 0 L 10 5 L 0 10 z" className="fill-ink-1" />
            </marker>
          </defs>

          {/* Las aristas van debajo de los nodos. */}
          <g aria-hidden="true">
            {aristas.map((a, i) => {
              const de = porId.get(a.de);
              const hasta = porId.get(a.a);
              if (!de || !hasta) return null;
              const cd = centro(de);
              const ch = centro(hasta);
              const p1 = salida(cd, ch);
              const p2 = salida(ch, cd, 3);
              return (
                <g key={i} data-arista={`${a.de}-${a.a}`}>
                  <line
                    x1={p1.x}
                    y1={p1.y}
                    x2={p2.x}
                    y2={p2.y}
                    strokeWidth={1.5}
                    markerEnd="url(#mapa-flecha)"
                    className="stroke-ink-1"
                  />
                  {a.etiqueta && (
                    <text
                      x={(p1.x + p2.x) / 2}
                      y={(p1.y + p2.y) / 2 - 6}
                      textAnchor="middle"
                      fontSize={11}
                      strokeWidth={4}
                      paintOrder="stroke"
                      className="fill-ink-2 stroke-paper-0"
                    >
                      {a.etiqueta[idioma]}
                    </text>
                  )}
                </g>
              );
            })}
          </g>

          {nodos.map((n) => {
            const c = centro(n);
            const x = c.x - NW / 2;
            const y = c.y - NH / 2;
            const lineas = partirEtiqueta(n.etiqueta[idioma]);
            const y0 = c.y - ((lineas.length - 1) * 16) / 2 + 5;
            return (
              <g key={n.n} data-nodo={n.n} data-tipo={n.tipo}>
                <Forma tipo={n.tipo} x={x} y={y} w={NW} h={NH} />
                <text textAnchor="middle" fontSize={13} className="fill-ink-0">
                  {lineas.map((l, i) => (
                    <tspan key={i} x={c.x} y={y0 + i * 16}>
                      {l}
                    </tspan>
                  ))}
                </text>
                <circle cx={x + 6} cy={y + 6} r={11} className="fill-ink-0" />
                <text
                  x={x + 6}
                  y={y + 10}
                  textAnchor="middle"
                  fontSize={11}
                  fontWeight={600}
                  className="fill-paper-0 font-mono"
                >
                  {n.n}
                </text>
              </g>
            );
          })}
        </svg>
      </div>

      {/* La leyenda: cada forma con su palabra. */}
      <section aria-label={t("mapa.leyenda")} data-mapa-leyenda="">
        <h3 className="font-mono text-[11px] tracking-[0.08em] text-ink-2 uppercase">
          {t("mapa.leyenda")}
        </h3>
        <ul className="mt-3 flex flex-wrap gap-x-6 gap-y-3">
          {TIPOS_NODO.map((tipo) => (
            <li key={tipo} className="flex items-center gap-2.5">
              <svg
                width={40}
                height={24}
                viewBox="0 0 40 24"
                aria-hidden="true"
              >
                <Forma tipo={tipo} x={2} y={2} w={36} h={20} />
              </svg>
              <span className="text-[13px] text-ink-1">
                <strong className="font-semibold">
                  {t(`tipos.${tipo}.nombre`)}
                </strong>
                {" — "}
                {t(`tipos.${tipo}.ayuda`)}
              </span>
            </li>
          ))}
        </ul>
      </section>

      {/* La alternativa textual completa: nodo por nodo y conexión por conexión. */}
      <section aria-labelledby="mapa-lectura" data-mapa-lectura="">
        <h3
          id="mapa-lectura"
          className="font-mono text-[11px] tracking-[0.08em] text-ink-2 uppercase"
        >
          {t("mapa.lectura")}
        </h3>
        <p className="mt-2 text-[15px] leading-relaxed text-ink-1">
          {bloque.resumen[idioma]}
        </p>
        <ol className="mt-3 grid gap-2 md:grid-cols-2">
          {nodos.map((n) => (
            <li key={n.n} className="text-[14px] leading-snug text-ink-1">
              <span className="font-mono text-[12px] text-ink-2 tabular-nums">
                {t("mapa.nodo", { n: n.n })}
              </span>{" "}
              <strong className="font-semibold">{n.etiqueta[idioma]}</strong>{" "}
              <span className="text-ink-2">
                ({t(`tipos.${n.tipo}.nombre`)})
              </span>
              {" — "}
              {n.detalle[idioma]}
            </li>
          ))}
        </ol>
        <h4 className="mt-4 font-mono text-[11px] tracking-[0.08em] text-ink-2 uppercase">
          {t("mapa.conexiones")}
        </h4>
        <ul className="mt-2 grid gap-1.5 md:grid-cols-2">
          {aristas.map((a, i) => (
            <li key={i} className="text-[14px] leading-snug text-ink-1">
              {t("mapa.flecha", {
                de: porId.get(a.de)?.etiqueta[idioma] ?? a.de,
                a: porId.get(a.a)?.etiqueta[idioma] ?? a.a,
              })}
              {a.etiqueta ? ` (${a.etiqueta[idioma]})` : ""}
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
}
