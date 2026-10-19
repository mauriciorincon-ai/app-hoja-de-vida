import type { Afirmacion, Voz } from "@/lib/metodo/schema";
import type { IdiomaMetodo, Traductor } from "./traductor";

/**
 * LAS TRES VOCES de «Métodos»: evidencia · estado del campo · criterio (la
 * posición del autor). Las claves del dato siguen siendo `hice`, `campo` y
 * `posicion`. Se distinguen por TRES señales a la vez — nunca solo por color (el
 * dueño es daltónico leve y es accesibilidad básica): el símbolo, la PALABRA y
 * el trazo del filete lateral (continuo, rayado, punteado). Un hecho nunca se
 * disfraza de posición ni al revés: el esquema ya lo impide en el dato, y aquí
 * se ve.
 */

const ESTILO: Record<Voz, { simbolo: string; chip: string; filete: string }> = {
  hice: {
    simbolo: "●",
    chip: "bg-sage text-sage-ink",
    filete: "border-sage-ink border-solid",
  },
  campo: {
    simbolo: "◆",
    chip: "bg-sky text-sky-ink",
    filete: "border-sky-ink border-dashed",
  },
  posicion: {
    simbolo: "▲",
    chip: "bg-peach text-peach-ink",
    filete: "border-peach-ink border-dotted",
  },
};

/** El rótulo de una voz: símbolo + palabra. */
export function RotuloDeVoz({ voz, t }: { voz: Voz; t: Traductor }) {
  const e = ESTILO[voz];
  return (
    <span
      data-voz-rotulo={voz}
      title={t(`voces.${voz}.ayuda`)}
      className={`inline-flex items-center gap-1.5 self-start rounded-full px-2.5 py-1 font-mono text-[11px] tracking-[0.02em] uppercase ${e.chip}`}
    >
      <span aria-hidden="true">{e.simbolo}</span>
      {t(`voces.${voz}.nombre`)}
    </span>
  );
}

/** Las citas numeradas `[n]` que llevan a la fuente en el bloque 10. */
export function Citas({ ids, t }: { ids: number[]; t: Traductor }) {
  if (ids.length === 0) return null;
  return (
    <>
      {ids.map((n) => (
        <sup key={n} className="ml-0.5">
          <a
            href={`#fuente-${n}`}
            aria-label={t("fuentes.cita", { n })}
            className="font-mono text-[11px] text-sky-ink underline underline-offset-2 hover:text-ink-0"
          >
            [{n}]
          </a>
        </sup>
      ))}
    </>
  );
}

/** Una afirmación con su voz, su evidencia y su filete. */
export function AfirmacionConVoz({
  a,
  idioma,
  t,
}: {
  a: Afirmacion;
  idioma: IdiomaMetodo;
  t: Traductor;
}) {
  return (
    <div
      data-voz={a.voz}
      data-corpus={a.corpus.length > 0 ? a.corpus.join(" ") : undefined}
      className={`flex flex-col gap-1.5 border-l-2 pl-3 ${ESTILO[a.voz].filete}`}
    >
      <RotuloDeVoz voz={a.voz} t={t} />
      <p className="text-[15px] leading-relaxed text-ink-1">
        {a.texto[idioma]}
        <Citas ids={a.fuentes} t={t} />
      </p>
    </div>
  );
}

/** La leyenda de las tres voces, al abrir la pieza: qué significa cada rótulo. */
export function LeyendaDeVoces({ t }: { t: Traductor }) {
  return (
    <aside
      aria-labelledby="leyenda-voces"
      data-leyenda-voces=""
      className="rounded-[14px] border border-paper-2 bg-paper-1 p-5 print:break-inside-avoid"
    >
      <h2
        id="leyenda-voces"
        className="font-mono text-[11px] tracking-[0.08em] text-ink-2 uppercase"
      >
        {t("voces.titulo")}
      </h2>
      <ul className="mt-3 grid gap-3 md:grid-cols-3">
        {(["hice", "campo", "posicion"] as const).map((v) => (
          <li key={v} className="flex flex-col gap-1.5">
            <RotuloDeVoz voz={v} t={t} />
            <span className="text-[13px] leading-snug text-ink-2">
              {t(`voces.${v}.ayuda`)}
            </span>
          </li>
        ))}
      </ul>
      <p className="mt-3 text-[13px] leading-snug text-ink-2">
        {t("voces.sinRotulo")}
      </p>
    </aside>
  );
}
