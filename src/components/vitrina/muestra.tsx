import { getTranslations } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import type { FichaVitrina } from "@/lib/vitrina/loader";
import { Maqueta } from "./maquetas";

/**
 * MUESTRA CORTA de una app en el índice de la vitrina (S5).
 *
 * La vitrina es el escaparate, no el catálogo: aquí cada app enseña lo justo
 * para decidir si entras —su estado, su nombre, su promesa, su tira y el
 * tamaño de lo construido— y **su ficha completa vive en su propia página**
 * (`/vitrina/<slug>`). Antes las seis fichas se apilaban en una sola ruta: un
 * documento de más de 22 000 px donde ninguna app tenía sitio propio, ninguna
 * podía enlazarse ni compartirse por separado, y el visitante pagaba de una
 * vez el peso de las seis.
 *
 * La tira va aquí porque es lo que hace reconocible a la app de un vistazo, y
 * es dibujo de esta casa: seis muestras que se ven de la misma familia.
 *
 * Cero enlaces (regla dura 16): el único destino es una ruta de este repo.
 */
export async function MuestraApp({ ficha }: { ficha: FichaVitrina }) {
  const t = await getTranslations("vitrina");
  const { ancla, export: exp } = ficha;

  const colorEstado =
    ancla.estado === "sellado"
      ? "bg-sage text-sage-ink"
      : "bg-citron text-citron-ink";

  return (
    <li className="list-none">
      <article
        data-muestra-slug={ancla.slug}
        data-estado={ancla.estado}
        className="muestra-vitrina relative flex h-full flex-col gap-4 rounded-[14px] border border-paper-2 bg-paper-0 p-6 shadow-sh-1 transition-[box-shadow,transform] duration-[180ms] ease-[var(--ease-out-cubic)] hover:-translate-y-0.5 hover:shadow-sh-2"
      >
        <div className="flex flex-wrap items-center gap-2">
          <span
            title={t(`estadoAyuda.${ancla.estado}`)}
            className={`rounded-full px-2.5 py-1 font-mono text-[11px] tracking-[0.02em] uppercase ${colorEstado}`}
          >
            {t(`estados.${ancla.estado}`)}
          </span>
          <span className="rounded-full border border-paper-3 px-2.5 py-1 font-mono text-[11px] tracking-[0.02em] text-ink-2 uppercase">
            {ancla.ciclo}
          </span>
        </div>

        <div>
          <h2 className="font-display text-[1.45rem] leading-tight font-medium tracking-[-0.02em] text-ink-0">
            {/* El enlace estira su área de clic a toda la tarjeta, pero su
                nombre accesible sigue siendo el de la app — una sola parada de
                tabulador por muestra, y se lee «Habla», no «leer más». */}
            <Link
              href={`/vitrina/${ancla.slug}`}
              className="after:absolute after:inset-0 after:rounded-[14px] after:content-['']"
            >
              {exp.app.nombre}
            </Link>
          </h2>
          <p className="mt-1.5 font-display text-[1.02rem] leading-snug text-ink-1">
            {exp.promesa.tagline}
          </p>
        </div>

        <div
          aria-hidden="true"
          className="overflow-hidden rounded-[10px] border border-paper-2 bg-paper-1 p-3"
        >
          <Maqueta slug={ancla.slug} />
        </div>

        <p className="text-[14px] leading-relaxed text-ink-2">
          {exp.promesa.para_quien}
        </p>

        <p className="mt-auto flex flex-wrap items-center gap-x-3 gap-y-1 font-mono text-[11px] tracking-[0.04em] text-ink-2 uppercase">
          <span>
            {t("cuentaFuncionalidades", { n: exp.funcionalidades.total })}
          </span>
          <span aria-hidden="true">·</span>
          <span>{t("cuentaCifras", { n: exp.metricas.length })}</span>
        </p>

        <p className="flex items-center gap-1.5 text-[14px] font-medium text-sage-ink">
          {t("verFicha")}
          <span aria-hidden="true">→</span>
        </p>
      </article>
    </li>
  );
}
