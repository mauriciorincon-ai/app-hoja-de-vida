import type { Metadata } from "next";
import { hasLocale } from "next-intl";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { notFound } from "next/navigation";
import { Footer } from "@/components/footer";
import { Header } from "@/components/header";
import { Reveal } from "@/components/motion/reveal";
import { Link } from "@/i18n/navigation";
import { routing, type Locale } from "@/i18n/routing";
import { getCv } from "@/lib/content";
import { SITE_URL } from "@/lib/site";
import {
  frentesEnPreparacion,
  getFrente,
  getFrentes,
} from "@/lib/vitrina/categorias";

/**
 * UN FRENTE EN PREPARACIÓN — su espacio propio desde el día cero (ADR-015).
 *
 * Agentes, investigaciones y tableros existen ya como frentes del taller,
 * pero aún no tienen piezas publicadas. Esta página es la que **marca ese
 * inicio sin disfrazarlo**: dice qué es el frente, en qué punto está, y
 * ofrece la lista de espera — sin fecha prometida (regla dura 16: el CTA
 * público es la lista de espera, nunca una promesa).
 *
 * Es GENÉRICA a propósito: solo renderiza frentes `en-preparacion`. El día que
 * uno de ellos tenga piezas, se le construye su escaparate propio (como
 * `/vitrina/apps`, que es una ruta estática y por eso gana a este segmento
 * dinámico) y su renderizador declara de dónde salen esas piezas — el esquema
 * impide marcarlo «abierta» antes de eso.
 */

export function generateStaticParams() {
  return routing.locales.flatMap((locale) =>
    frentesEnPreparacion().map((f) => ({ locale, categoria: f.id })),
  );
}

type Params = { params: Promise<{ locale: string; categoria: string }> };

function frenteEnPreparacion(id: string) {
  const f = getFrente(id);
  return f && f.estado === "en-preparacion" ? f : undefined;
}

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const { locale, categoria } = await params;
  if (!hasLocale(routing.locales, locale)) return {};
  const frente = frenteEnPreparacion(categoria);
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

  const frente = frenteEnPreparacion(categoria);
  if (!frente) notFound();

  const l = locale as Locale;
  const cv = getCv(l);
  const t = await getTranslations("vitrina");
  const otros = getFrentes().filter((f) => f.id !== frente.id);

  return (
    <>
      <Header nombre={cv.identidad.nombre} enHome={false} />
      <main id="contenido" className="flex-1">
        <div className="mx-auto max-w-4xl px-4 py-10 md:px-6 md:py-14">
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
              <span
                title={t("frenteEstadoAyuda.enPreparacion")}
                className="rounded-full bg-citron px-2.5 py-1 font-mono text-[11px] tracking-[0.02em] text-citron-ink uppercase"
              >
                {t("frenteEstados.enPreparacion")}
              </span>
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
          </header>

          {/* El inicio, dicho con todas sus letras. */}
          <Reveal variant="fadeInUp">
            <section
              aria-labelledby="frente-empieza"
              className="mt-12 rounded-[14px] border border-paper-2 bg-paper-1 p-6"
            >
              <h2
                id="frente-empieza"
                className="font-display text-xl font-medium tracking-[-0.015em] text-ink-0"
              >
                {t("enPreparacionTitulo")}
              </h2>
              <p className="mt-3 max-w-[60ch] text-[15px] leading-relaxed text-ink-1">
                {t("enPreparacionLinea")}
              </p>
            </section>
          </Reveal>

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
