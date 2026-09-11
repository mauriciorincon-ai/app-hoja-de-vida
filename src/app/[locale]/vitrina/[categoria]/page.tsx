import type { Metadata } from "next";
import { hasLocale } from "next-intl";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { notFound } from "next/navigation";
import { Footer } from "@/components/footer";
import { Header } from "@/components/header";
import { Reveal } from "@/components/motion/reveal";
import { FrenteEnPreparacion } from "@/components/vitrina/frente-en-preparacion";
import { MuestraPieza } from "@/components/vitrina/muestra-pieza";
import { Link } from "@/i18n/navigation";
import { routing, type Locale } from "@/i18n/routing";
import { getCv } from "@/lib/content";
import { SITE_URL } from "@/lib/site";
import {
  FRENTE_PROPIO,
  getFrenteDinamico,
  getFrentes,
} from "@/lib/vitrina/categorias";
import { getPiezas, type Frente as FrentePieza } from "@/lib/vitrina/piezas";

/**
 * UN FRENTE DE LA VITRINA — su espacio propio desde el día cero (ADR-015),
 * en sus DOS estados (S7).
 *
 * Esta ruta atiende a cualquier frente que no sea `apps` (que tiene segmento
 * estático propio y gana al dinámico), y se bifurca por el estado que declara
 * `data/vitrina.yaml`:
 *
 *  - **`en-preparacion`** — el frente existe y aún no tiene piezas. La página
 *    **marca ese inicio sin disfrazarlo**: dice qué es, en qué punto está y
 *    ofrece la lista de espera, sin fecha prometida (regla 16).
 *  - **`abierta`** (S7) — el frente tiene piezas reales: es el ESCAPARATE, una
 *    muestra corta por pieza, y cada una con su ruta propia en
 *    `/vitrina/<frente>/<slug>`.
 *
 * Un frente no puede declararse `abierta` sin piezas: `parseVitrina` rompe el
 * build nombrándolo. Así que aquí no hay que defenderse de un escaparate vacío
 * — el gate está aguas arriba, donde se puede arreglar.
 *
 * 100% SSG. El hero (candidato LCP) nace ESTÁTICO, sin wrapper de motion que
 * arranque en opacity 0 (patrón `lcp-nace-estatico`).
 */

/** Todos los frentes menos `apps`: esa ruta es estática y gana a este segmento. */
export function generateStaticParams() {
  return routing.locales.flatMap((locale) =>
    getFrentes()
      .filter((f) => f.id !== FRENTE_PROPIO)
      .map((f) => ({ locale, categoria: f.id })),
  );
}

type Params = { params: Promise<{ locale: string; categoria: string }> };

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const { locale, categoria } = await params;
  if (!hasLocale(routing.locales, locale)) return {};
  const frente = getFrenteDinamico(categoria);
  if (!frente) return {};
  const t = await getTranslations({ locale, namespace: "vitrina" });
  const l = locale as Locale;

  return {
    metadataBase: new URL(SITE_URL),
    title: `${frente.nombre[l]} — ${t("eyebrow")} — Henry Rincón`,
    description: frente.intro[l],
    alternates: {
      languages: {
        es: `/es/vitrina/${categoria}`,
        en: `/en/vitrina/${categoria}`,
        "x-default": `/es/vitrina/${categoria}`,
      },
    },
  };
}

export default async function FrentePage({ params }: Params) {
  const { locale, categoria } = await params;
  if (!hasLocale(routing.locales, locale)) notFound();
  setRequestLocale(locale);

  const frente = getFrenteDinamico(categoria);
  if (!frente) notFound();

  const l = locale as Locale;
  const cv = getCv(l);
  const t = await getTranslations("vitrina");
  const abierta = frente.estado === "abierta";
  const piezas = abierta ? getPiezas(frente.id as FrentePieza) : [];
  const otros = getFrentes().filter((f) => f.id !== frente.id);

  return (
    <>
      <Header nombre={cv.identidad.nombre} enHome={false} />
      <main id="contenido" className="flex-1">
        <div
          className={`mx-auto px-4 py-10 md:px-6 md:py-14 ${abierta ? "max-w-5xl" : "max-w-4xl"}`}
        >
          <nav aria-label={t("migaEtiqueta")} className="mb-8">
            <Link
              href="/vitrina"
              className="inline-flex min-h-11 items-center gap-2 font-mono text-[11px] tracking-[0.08em] text-ink-2 uppercase hover:text-ink-0"
            >
              <span aria-hidden="true">←</span>
              {t("volverIndice")}
            </Link>
          </nav>

          {/* Nace estático: es el contenido de la ruta. */}
          <header data-frente={frente.id} data-estado={frente.estado}>
            <p className="mb-5 flex flex-wrap items-center gap-3">
              <span className="flex items-center gap-2 text-xs font-medium tracking-[0.18em] text-sage-ink uppercase">
                <span
                  aria-hidden="true"
                  className="size-1.5 rounded-full bg-sage-ink"
                />
                {t("eyebrow")}
              </span>
              {abierta ? (
                <span
                  data-cuenta-piezas={piezas.length}
                  title={t("frenteEstadoAyuda.abierta")}
                  className="rounded-full bg-sage px-2.5 py-1 font-mono text-[11px] tracking-[0.02em] text-sage-ink uppercase"
                >
                  {t("escaparateCuenta", { n: piezas.length })}
                </span>
              ) : (
                <span
                  title={t("frenteEstadoAyuda.enPreparacion")}
                  className="rounded-full bg-citron px-2.5 py-1 font-mono text-[11px] tracking-[0.02em] text-citron-ink uppercase"
                >
                  {t("frenteEstados.enPreparacion")}
                </span>
              )}
            </p>
            <h1 className="max-w-[20ch] font-display text-[clamp(2rem,5.5vw,3.25rem)] leading-[1.05] font-medium tracking-[-0.02em] text-ink-0">
              {frente.nombre[l]}
            </h1>
            <p className="mt-5 max-w-[60ch] font-display text-[1.15rem] leading-snug text-ink-1">
              {frente.intro[l]}
            </p>
            <p className="mt-4 max-w-[60ch] text-[16px] leading-[1.75] text-ink-1">
              {frente.detalle[l]}
            </p>
            {abierta && (
              <p className="mt-3 max-w-[60ch] text-[15px] leading-relaxed text-ink-2">
                {t("escaparateNota")}
              </p>
            )}
          </header>

          {abierta ? (
            /* ── El escaparate: una muestra corta por pieza ── */
            <Reveal variant="fadeInUp" amount="some">
              <ul className="mt-12 grid gap-5 sm:grid-cols-2">
                {piezas.map((p) => (
                  <MuestraPieza key={p.pieza.slug} pieza={p} locale={l} />
                ))}
              </ul>
            </Reveal>
          ) : (
            /* ── El inicio, dicho con todas sus letras ── */
            <Reveal variant="fadeInUp">
              <FrenteEnPreparacion
                titulo={t("enPreparacionTitulo")}
                linea={t("enPreparacionLinea")}
              />
            </Reveal>
          )}

          {/* Se sale de un frente hacia otro, no hacia el vacío. */}
          <Reveal variant="fadeInUp">
            <nav
              aria-label={t("otrosFrentes")}
              className="mt-12 border-t border-paper-2 pt-8"
            >
              <p className="font-mono text-[11px] tracking-[0.08em] text-ink-2 uppercase">
                {t("otrosFrentes")}
              </p>
              <ul className="mt-4 grid gap-3 sm:grid-cols-3">
                {otros.map((f) => (
                  <li key={f.id} className="list-none">
                    <Link
                      href={`/vitrina/${f.id}`}
                      data-frente-vecino={f.id}
                      className="flex h-full min-h-11 flex-col justify-center rounded-[10px] border border-paper-2 bg-paper-0 px-5 py-4 transition-[box-shadow] duration-[180ms] hover:shadow-sh-1"
                    >
                      <span className="font-display text-[1.05rem] font-medium text-ink-0">
                        {f.nombre[l]}
                      </span>
                      <span className="mt-1 font-mono text-[11px] tracking-[0.02em] text-ink-2 uppercase">
                        {f.estado === "abierta"
                          ? t("cuentaPiezas", { n: f.piezas })
                          : t("frenteEstados.enPreparacion")}
                      </span>
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>
          </Reveal>

          {/* El anclaje del CTA vive en ESTA página. */}
          <Reveal variant="fadeInUp">
            <section
              id="contacto-vitrina"
              aria-labelledby="vitrina-cierre"
              className="mt-12 scroll-mt-16 border-t border-paper-2 pt-10"
            >
              <h2
                id="vitrina-cierre"
                className="font-display text-2xl font-medium tracking-[-0.015em] text-ink-0"
              >
                {t("acceso")}
              </h2>
              <p className="mt-3 max-w-[60ch] text-[15px] leading-relaxed text-ink-1">
                {t("ctaNota")}
              </p>
              <Link
                href="/#contacto"
                data-cta="lista-de-espera"
                className="mt-5 flex min-h-11 w-fit items-center gap-2 rounded-md bg-sage px-6 text-[15px] font-medium text-sage-ink shadow-sh-1 transition-[filter] duration-[120ms] hover:brightness-[0.97]"
              >
                {t("cta")}
                <span aria-hidden="true">→</span>
              </Link>
            </section>
          </Reveal>
        </div>
      </main>
      <Footer identidad={cv.identidad} />
    </>
  );
}
