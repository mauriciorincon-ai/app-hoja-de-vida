import Image from "next/image";
import { getTranslations } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import type { Locale } from "@/i18n/routing";
import type { FichaTecnica as Datos } from "@/lib/vitrina/ficha-tecnica/schema";
import { numerarSecciones } from "@/lib/vitrina/ficha-tecnica/secciones";
import type { FuenteMetrica } from "@/lib/vitrina/schemas";
import { IconoGrupo } from "./iconos-grupo";
import { ProcesoBpmn } from "./proceso-bpmn";

/**
 * LA FICHA TÉCNICA — la capa infografía de una pieza de la vitrina (ADR-016).
 *
 * Es la capa de arriba: lo que se lee en dos minutos y decide si se baja al
 * detalle. Hasta siete bloques, siempre en el mismo orden, para cualquier
 * frente (apps hoy; agentes, investigaciones y tableros cuando lleguen), porque
 * renderiza UN contrato (`fichaTecnicaSchema`) y no un tipo de pieza:
 *
 *   0 cabecera (estado —con su fecha de sello si la trae— · nombre · tagline
 *     · stack · TITULAR de valor)
 *   — la tira de cifras (3–5, cada una con su procedencia)
 *   1 para quién, y qué resuelve
 *   2 cómo funciona — el proceso en BPMN, generado desde datos (OPCIONAL
 *     desde v1.1.0: si la pieza no trae proceso, la sección no existe y las
 *     siguientes se renumeran — `numerarSecciones`)
 *   · lo que dicen los datos — conclusiones con su cifra y su fuente
 *     (OPCIONAL, v1.3.0: lo trae una pieza que produce datos, no una app)
 *   3 qué tiene — una tarjeta por bloque, sin listar el detalle
 *   · cómo se ve — la galería de pantallas reales (OPCIONAL, v1.3.0)
 *   4 límites, y lo que nunca hace
 *   5 dónde está — la versión anclada
 *   — cierre: al detalle + lista de espera
 *
 * Anatomía tomada de las plantillas de la planeadora (cabecera con titular de
 * valor · facts · secciones numeradas con subtítulo · flujo con carriles ·
 * límites + nunca); piel de CV Viva. Server component, cero JS. Cero enlaces.
 */

const colorFuente: Record<FuenteMetrica, string> = {
  medido: "bg-sage text-sage-ink",
  calculada: "bg-sky text-sky-ink",
  declarado: "bg-lilac text-lilac-ink",
  estimacion: "bg-peach text-peach-ink",
};
const colorEstado = {
  sellado: "bg-sage text-sage-ink",
  inicial: "bg-citron text-citron-ink",
} as const;

const CHIP =
  "rounded-full border border-paper-3 px-2.5 py-1 font-mono text-[11px] tracking-[0.02em] text-ink-2 uppercase";
const PANEL = "rounded-[14px] border border-paper-2 bg-paper-0 p-6 shadow-sh-1";
const ROTULO = "font-mono text-[11px] tracking-[0.08em] text-ink-2 uppercase";

function Seccion({
  n,
  titulo,
  sub,
  id,
  children,
}: {
  n: string;
  titulo: string;
  sub: string;
  id: string;
  children: React.ReactNode;
}) {
  return (
    <section aria-labelledby={id} className="mt-12">
      <div className="mb-4 flex flex-wrap items-baseline gap-x-4 gap-y-1">
        <span className="font-mono text-[11px] tracking-[0.08em] text-ink-2">
          {n}
        </span>
        <h2
          id={id}
          className="font-display text-[1.6rem] font-medium tracking-[-0.015em] text-ink-0"
        >
          {titulo}
        </h2>
        <p className="max-w-[46ch] text-[13px] leading-snug text-ink-2 sm:ml-auto sm:text-right">
          {sub}
        </p>
      </div>
      {children}
    </section>
  );
}

const HITOS_CONOCIDOS = new Set([
  "ciclo",
  "sprints",
  "sellada",
  "construccion",
  "version",
  "decisiones",
]);

export async function FichaTecnica({
  datos,
  locale,
  hrefDetalle,
}: {
  datos: Datos;
  locale: Locale;
  /** Ruta del detalle, si la pieza lo tiene. */
  hrefDetalle?: string;
}) {
  const t = await getTranslations("fichaTecnica");
  const tv = await getTranslations("vitrina");
  const {
    pieza,
    promesa,
    cifras,
    bloques,
    proceso,
    hitos,
    conclusiones,
    galeria,
  } = datos;
  const totalFuncionalidades = bloques.reduce((s, b) => s + b.cuenta, 0);
  const n = numerarSecciones({
    proceso: Boolean(proceso),
    conclusiones: Boolean(conclusiones),
    galeria: Boolean(galeria),
  });

  return (
    <article data-ficha-tecnica={pieza.slug} data-frente={pieza.frente}>
      {/* ── 0 · Cabecera ─────────────────────────────────────────────────── */}
      <header>
        <p className="mb-4 flex items-center gap-2 text-xs font-medium tracking-[0.18em] text-sage-ink uppercase">
          <span
            aria-hidden="true"
            className="size-1.5 rounded-full bg-sage-ink"
          />
          {tv("eyebrow")} · {t("eyebrow")}
        </p>
        <ul className="flex flex-wrap gap-2">
          <li>
            <span
              data-estado={pieza.estado}
              title={tv(`estadoAyuda.${pieza.estado}`)}
              className={`rounded-full px-2.5 py-1 font-mono text-[11px] tracking-[0.02em] uppercase ${colorEstado[pieza.estado]}`}
            >
              {tv(`estados.${pieza.estado}`)}
            </span>
          </li>
          {/* La FECHA del sello sale del contrato (`pieza.sellado_en`), no de un
              hito de texto libre: un dato que la casa productora declara y esta
              ficha enseña — si no lo enseñara, nadie corregiría el día que
              mintiera. Solo tiene sentido en una pieza sellada. */}
          {pieza.estado === "sellado" && pieza.sellado_en && (
            <li>
              <span data-sellado-en={pieza.sellado_en} className={CHIP}>
                {t("selladaEl", { fecha: pieza.sellado_en })}
              </span>
            </li>
          )}
          <li>
            <span className={CHIP}>{pieza.ciclo}</span>
          </li>
          <li>
            <span className={CHIP}>
              {t("sprints", { n: pieza.sprints_cerrados })}
            </span>
          </li>
          <li>
            <span className={CHIP}>v{pieza.version}</span>
          </li>
          <li>
            <span className={CHIP}>
              {t("ancladaEl", { fecha: datos.actualizado })}
            </span>
          </li>
        </ul>
        <h1 className="mt-5 max-w-[16ch] font-display text-[clamp(2.2rem,6vw,3.5rem)] leading-[1.02] font-medium tracking-[-0.02em] text-ink-0">
          {pieza.nombre}
        </h1>
        <p className="mt-3 max-w-[40ch] font-display text-[1.35rem] leading-snug text-ink-1">
          {promesa.tagline}
        </p>
        <ul aria-label="Stack" className="mt-4 flex flex-wrap gap-2">
          {datos.stack.map((s) => (
            <li key={s.nombre}>
              <span className={CHIP} title={s.papel}>
                {s.nombre}
              </span>
            </li>
          ))}
        </ul>
        <div
          data-titular
          className="mt-6 max-w-[74ch] rounded-[10px] border-l-[3px] border-sage-ink bg-paper-1 px-5 py-4"
        >
          <p className="mb-1 font-mono text-[10.5px] tracking-[0.08em] text-sage-ink uppercase">
            {t("titularRotulo")}
          </p>
          <p className="text-[16px] leading-relaxed font-medium text-ink-0">
            {datos.titular}
          </p>
        </div>
      </header>

      {/* ── La tira de cifras ────────────────────────────────────────────── */}
      <ul
        aria-label={t("cifras")}
        className="mt-7 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5"
      >
        {cifras.map((c) => (
          <li
            key={c.clave}
            data-cifra={c.clave}
            className="flex flex-col rounded-[12px] border border-paper-2 bg-paper-0 p-4 shadow-sh-1"
          >
            <p className="font-display text-[2rem] leading-none tracking-[-0.02em] text-ink-0 tabular-nums">
              {c.valor.toLocaleString(locale === "es" ? "es-CO" : "en-US")}
              {/* La unidad solo si la etiqueta no la dice ya: «24 funcionalidades ·
                  Funcionalidades del MVP» es decir lo mismo dos veces. */}
              {c.unidad &&
                !c.etiqueta.toLowerCase().includes(c.unidad.toLowerCase()) && (
                  <span className="ml-1 font-sans text-sm font-normal text-ink-2">
                    {c.unidad}
                  </span>
                )}
            </p>
            <p className="mt-2 text-[12.5px] leading-snug text-ink-2">
              {c.etiqueta}
            </p>
            <span
              data-fuente={c.fuente}
              title={`${tv(`fuenteAyuda.${c.fuente}`)} — ${c.detalle}`}
              className={`mt-2 self-start rounded-full px-2 py-0.5 font-mono text-[10px] tracking-[0.04em] uppercase ${colorFuente[c.fuente]}`}
            >
              {tv(`fuentes.${c.fuente}`)}
            </span>
          </li>
        ))}
      </ul>

      {/* ── 01 ───────────────────────────────────────────────────────────── */}
      <Seccion
        n={n.s01!}
        id={`ft-${n.s01}-${pieza.slug}`}
        titulo={t("s01")}
        sub={t("s01sub")}
      >
        <div className="grid gap-4 sm:grid-cols-2">
          <div className={PANEL}>
            <h3 className={ROTULO}>{t("paraQuien")}</h3>
            <p className="mt-2.5 text-[15px] leading-relaxed text-ink-1">
              {promesa.para_quien}
            </p>
          </div>
          <div className={PANEL}>
            <h3 className={ROTULO}>{t("promesa")}</h3>
            <p className="mt-2.5 text-[15px] leading-relaxed text-ink-1">
              {promesa.intro}
            </p>
          </div>
        </div>
      </Seccion>

      {/* ── 02 · el proceso (solo si la pieza lo trae) ───────────────────── */}
      {proceso && (
        <Seccion
          n={n.s02!}
          id={`ft-${n.s02}-${pieza.slug}`}
          titulo={t("s02")}
          sub={t("s02sub")}
        >
          <div className={`${PANEL} p-4 sm:p-5`}>
            <ProcesoBpmn proceso={proceso} id={pieza.slug} />
            <p className="mt-3 text-[12px] leading-snug text-ink-2 md:hidden">
              {t("desliza")}
            </p>
            <p
              data-procedencia-proceso={datos.procedencia_proceso}
              className="mt-3 border-t border-paper-2 pt-3 font-mono text-[10.5px] tracking-[0.04em] text-ink-2 uppercase"
            >
              {datos.procedencia_proceso === "app"
                ? t("procesoApp")
                : t("procesoCvViva")}
            </p>
          </div>
        </Seccion>
      )}

      {/* ── Lo que dicen los datos (solo si la pieza trae conclusiones) ──── */}
      {conclusiones && (
        <Seccion
          n={n.conclusiones!}
          id={`ft-${n.conclusiones}-${pieza.slug}`}
          titulo={t("conclusiones")}
          sub={t("conclusionesSub")}
        >
          <ul className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {conclusiones.map((c, i) => (
              <li
                key={i}
                data-conclusion={i + 1}
                className="flex flex-col rounded-[12px] border border-paper-2 bg-paper-0 p-5 shadow-sh-1"
              >
                <p className="font-display text-[1.9rem] leading-none tracking-[-0.02em] text-ink-0 tabular-nums">
                  {c.cifra}
                  {c.unidad && (
                    <span className="ml-1.5 font-sans text-[13px] font-normal text-ink-2">
                      {c.unidad}
                    </span>
                  )}
                </p>
                <h3 className="mt-3 font-display text-[1.05rem] leading-tight font-medium text-ink-0">
                  {c.titulo}
                </h3>
                <p className="mt-2 text-[13.5px] leading-snug text-ink-1">
                  {c.texto}
                </p>
                <span
                  data-fuente={c.fuente}
                  title={tv(`fuenteAyuda.${c.fuente}`)}
                  className={`mt-3 self-start rounded-full px-2 py-0.5 font-mono text-[10px] tracking-[0.04em] uppercase ${colorFuente[c.fuente]}`}
                >
                  {tv(`fuentes.${c.fuente}`)}
                </span>
              </li>
            ))}
          </ul>
        </Seccion>
      )}

      {/* ── 03 ───────────────────────────────────────────────────────────── */}
      <Seccion
        n={n.s03!}
        id={`ft-${n.s03}-${pieza.slug}`}
        titulo={t("s03")}
        // «El detalle de cada una vive en la ficha completa» solo es verdad si
        // esa ficha completa existe. Una pieza sin detalle no puede mandar al
        // lector a un sitio que no hay — el subtítulo dice la cuenta y calla.
        // Y si la ficha NO cuenta funcionalidades (`cuenta: 0` en todos sus
        // bloques — una investigación tiene aportes, no funciones), el subtítulo
        // no inventa un «0 funcionalidades» que la pieza jamás declaró.
        sub={
          totalFuncionalidades === 0
            ? t("s03subSoloGrupos", { grupos: bloques.length })
            : t(hrefDetalle ? "s03sub" : "s03subSinDetalle", {
                grupos: bloques.length,
                n: totalFuncionalidades,
              })
        }
      >
        <ul className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {bloques.map((b) => (
            <li
              key={b.orden}
              data-bloque={b.orden}
              className="flex flex-col rounded-[12px] border border-paper-2 bg-paper-0 p-4 shadow-sh-1"
            >
              <div className="mb-3">
                <IconoGrupo slug={pieza.slug} orden={b.orden} />
              </div>
              <h3 className="font-display text-[1.05rem] leading-tight font-medium text-ink-0">
                {b.nombre}
              </h3>
              {b.cuenta > 0 && (
                <p className="mt-1 font-mono text-[10.5px] tracking-[0.04em] text-ink-2 uppercase">
                  {tv("cuentaFuncionalidades", { n: b.cuenta })}
                </p>
              )}
              <p className="mt-1.5 text-[13px] leading-snug text-ink-2">
                {b.linea}
              </p>
            </li>
          ))}
        </ul>
      </Seccion>

      {/* ── Cómo se ve (solo si la pieza trae galería) ───────────────────── */}
      {galeria && (
        <Seccion
          n={n.galeria!}
          id={`ft-${n.galeria}-${pieza.slug}`}
          titulo={t("galeria")}
          sub={t("galeriaSub")}
        >
          <ul className="grid gap-4 sm:grid-cols-2">
            {galeria.map((g, i) => (
              <li key={g.archivo} data-captura={i + 1}>
                <figure className="m-0">
                  <div className="overflow-hidden rounded-[12px] border border-paper-2 bg-paper-1 shadow-sh-1">
                    {/* La ruta de la ficha es relativa; CV Viva la sirve desde
                        public/piezas/<frente>/. Perezosa: vive bajo el pliegue. */}
                    <Image
                      src={`/piezas/${pieza.frente}/${g.archivo}`}
                      alt={g.pie}
                      width={2560}
                      height={1440}
                      sizes="(min-width: 1024px) 480px, (min-width: 640px) 50vw, 100vw"
                      loading="lazy"
                      className="block h-auto w-full"
                    />
                  </div>
                  <figcaption className="mt-2 flex flex-wrap items-baseline gap-x-2 text-[12.5px] leading-snug text-ink-2">
                    <span className="font-mono text-[10px] tracking-[0.06em] uppercase">
                      {t("galeriaPie", { n: i + 1, total: galeria.length })}
                    </span>
                    <span>· {g.pie}</span>
                  </figcaption>
                </figure>
              </li>
            ))}
          </ul>
        </Seccion>
      )}

      {/* ── 04 ───────────────────────────────────────────────────────────── */}
      <Seccion
        n={n.s04!}
        id={`ft-${n.s04}-${pieza.slug}`}
        titulo={t("s04")}
        sub={t("s04sub")}
      >
        <div className="grid gap-4 sm:grid-cols-2">
          <div className={PANEL}>
            <h3 className={ROTULO}>{t("limites")}</h3>
            <ul className="mt-2 divide-y divide-paper-2">
              {datos.limites.map((l) => (
                <li
                  key={l}
                  className="flex gap-3 py-2.5 text-[14px] leading-snug text-ink-1"
                >
                  <span aria-hidden="true" className="text-ink-2">
                    —
                  </span>
                  {l}
                </li>
              ))}
            </ul>
          </div>
          <div className={PANEL}>
            <h3 className={ROTULO}>{t("nunca")}</h3>
            <ul data-nunca className="mt-2 divide-y divide-paper-2">
              {datos.nunca.map((l) => (
                <li
                  key={l}
                  className="flex gap-3 py-2.5 text-[14px] leading-snug text-ink-1"
                >
                  <span
                    aria-hidden="true"
                    className="font-semibold text-rose-ink"
                  >
                    ×
                  </span>
                  {l}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </Seccion>

      {/* ── 05 ───────────────────────────────────────────────────────────── */}
      <Seccion
        n={n.s05!}
        id={`ft-${n.s05}-${pieza.slug}`}
        titulo={t("s05")}
        sub={t("s05sub")}
      >
        <ol
          className={`${PANEL} grid grid-cols-2 gap-y-5 sm:grid-cols-3 lg:grid-cols-5`}
        >
          {hitos.map((h, i) => (
            <li
              key={i}
              className="relative pt-4 text-center before:absolute before:top-0 before:left-1/2 before:size-2 before:-translate-x-1/2 before:rounded-full before:bg-sage-ink"
            >
              <span className="block font-display text-[1.15rem] font-medium text-ink-0">
                {h.valor}
              </span>
              <span className="block text-[12px] text-ink-2">
                {HITOS_CONOCIDOS.has(h.etiqueta)
                  ? t(`hitos.${h.etiqueta}`)
                  : h.etiqueta}
              </span>
            </li>
          ))}
        </ol>
      </Seccion>

      {/* ── Cierre ───────────────────────────────────────────────────────── */}
      <div
        id="contacto-vitrina"
        className="mt-12 flex scroll-mt-16 flex-wrap items-center gap-3 border-t border-paper-2 pt-8"
      >
        {hrefDetalle && (
          <Link
            href={hrefDetalle}
            data-cta="detalle"
            className="flex min-h-11 items-center gap-2 rounded-md bg-sage px-6 text-[15px] font-medium text-sage-ink shadow-sh-1 transition-[filter] duration-[120ms] hover:brightness-[0.97]"
          >
            {t("verDetalle")}
            <span aria-hidden="true">→</span>
          </Link>
        )}
        <Link
          href="/#contacto"
          data-cta="lista-de-espera"
          className="flex min-h-11 items-center gap-2 rounded-md border border-paper-3 px-6 text-[15px] font-medium text-ink-1 transition-colors duration-[120ms] hover:bg-paper-1"
        >
          {tv("cta")}
        </Link>
        <p className="max-w-[40ch] text-[13px] leading-snug text-ink-2 sm:ml-auto">
          {t("cierreNota")}
        </p>
      </div>
    </article>
  );
}
