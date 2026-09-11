import Image from "next/image";
import { getTranslations } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import type { Locale } from "@/i18n/routing";
import { COLOR_ESTADO, intlLocale } from "@/lib/vitrina/estilos";
import type { FichaTecnica } from "@/lib/vitrina/ficha-tecnica/schema";

/**
 * MUESTRA CORTA de una PIEZA no-app en el escaparate de su frente (S7).
 *
 * La hermana de `MuestraApp`, y se parece a ella en todo menos en una cosa: una
 * app se reconoce por su pantalla, y aquí no hay pantalla que enseñar. Un
 * agente vive en una terminal y una investigación es un documento; una maqueta
 * inventada sería decorado — y decorado que insinúa un producto que no existe.
 *
 * Lo que ocupa ese sitio es lo único que una pieza sin interfaz sí tiene y no
 * se puede fingir: **su titular de valor y sus tres primeras cifras con su
 * procedencia**. Quien pasa por el escaparate decide con eso, no con un dibujo.
 *
 * Y si la pieza SÍ tiene pantalla —una ficha con `galeria` (v1.3.0), como un
 * tablero—, la tarjeta enseña la primera, real y sin retocar, en el mismo sitio
 * donde una app enseña su maqueta. Lo decide la ficha, no el frente.
 *
 * Cero enlaces (regla 16): el único destino es una ruta de este repo.
 */
export async function MuestraPieza({
  pieza: datos,
  locale,
}: {
  pieza: FichaTecnica;
  locale: Locale;
}) {
  const t = await getTranslations("vitrina");
  const { pieza, promesa } = datos;

  const colorEstado = COLOR_ESTADO[pieza.estado];

  return (
    <li className="list-none">
      <article
        data-muestra-slug={pieza.slug}
        data-estado={pieza.estado}
        data-frente={pieza.frente}
        className="muestra-vitrina relative flex h-full flex-col gap-4 rounded-[14px] border border-paper-2 bg-paper-0 p-6 shadow-sh-1 transition-[box-shadow,transform] duration-[180ms] ease-[var(--ease-out-cubic)] hover:-translate-y-0.5 hover:shadow-sh-2"
      >
        <div className="flex flex-wrap items-center gap-2">
          <span
            title={t(`estadoAyuda.${pieza.estado}`)}
            className={`rounded-full px-2.5 py-1 font-mono text-[11px] tracking-[0.02em] uppercase ${colorEstado}`}
          >
            {t(`estados.${pieza.estado}`)}
          </span>
          <span className="rounded-full border border-paper-3 px-2.5 py-1 font-mono text-[11px] tracking-[0.02em] text-ink-2 uppercase">
            {pieza.ciclo}
          </span>
        </div>

        <div>
          <h2 className="font-display text-[1.45rem] leading-tight font-medium tracking-[-0.02em] text-ink-0">
            {/* El enlace estira su área de clic a toda la tarjeta, pero su
                nombre accesible sigue siendo el de la pieza — una sola parada
                de tabulador, y se lee «FORJA», no «leer más». */}
            <Link
              href={`/vitrina/${pieza.frente}/${pieza.slug}`}
              className="after:absolute after:inset-0 after:rounded-[14px] after:content-['']"
            >
              {pieza.nombre}
            </Link>
          </h2>
          <p className="mt-1.5 font-display text-[1.02rem] leading-snug text-ink-1">
            {promesa.tagline}
          </p>
        </div>

        {datos.galeria?.[0] && (
          <div
            data-portada
            className="overflow-hidden rounded-[10px] border border-paper-2 bg-paper-1"
          >
            <Image
              src={`/piezas/${pieza.frente}/${datos.galeria[0].archivo}`}
              alt=""
              width={2560}
              height={1440}
              sizes="(min-width: 1024px) 480px, (min-width: 640px) 50vw, 100vw"
              loading="lazy"
              // La portada es contexto, no el contenido principal: cede ancho de
              // banda a la fuente que el texto del escaparate necesita para
              // pintar. Seis portadas compitiendo con ella le costaban ~150 ms
              // de LCP al frente de tableros, el único con capturas.
              fetchPriority="low"
              className="block h-auto w-full"
            />
          </div>
        )}

        {/* El titular ocupa el lugar que en una app tiene la maqueta: es lo que
            hace reconocible a la pieza de un vistazo. */}
        <div
          data-titular
          className="rounded-[10px] border-l-[3px] border-sage-ink bg-paper-1 px-4 py-3"
        >
          <p className="mb-1 font-mono text-[10.5px] tracking-[0.08em] text-sage-ink uppercase">
            {t("diferencial")}
          </p>
          <p className="text-[14px] leading-relaxed text-ink-1">
            {datos.titular}
          </p>
        </div>

        {/* Tres cifras, no las cinco: el escaparate asoma, la ficha desarrolla. */}
        <ul aria-label={t("metricas")} className="grid grid-cols-3 gap-2">
          {datos.cifras.slice(0, 3).map((c) => (
            <li
              key={c.clave}
              data-cifra={c.clave}
              className="flex flex-col rounded-[10px] border border-paper-2 bg-paper-1 p-3"
            >
              <span className="font-display text-[1.35rem] leading-none tracking-[-0.02em] text-ink-0 tabular-nums">
                {c.valor.toLocaleString(intlLocale(locale))}
              </span>
              <span className="mt-1.5 text-[11.5px] leading-snug text-ink-2">
                {c.etiqueta}
              </span>
              <span
                data-fuente={c.fuente}
                title={`${t(`fuenteAyuda.${c.fuente}`)} — ${c.detalle}`}
                className="mt-1.5 self-start font-mono text-[9.5px] tracking-[0.04em] text-ink-2 uppercase"
              >
                {t(`fuentes.${c.fuente}`)}
              </span>
            </li>
          ))}
        </ul>

        <p className="mt-auto flex items-center gap-1.5 text-[14px] font-medium text-sage-ink">
          {t("verFicha")}
          <span aria-hidden="true">→</span>
        </p>
      </article>
    </li>
  );
}
