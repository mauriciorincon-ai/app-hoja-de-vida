import type { Metadata } from "next";
import { hasLocale } from "next-intl";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { notFound } from "next/navigation";
import { Footer } from "@/components/footer";
import { Header } from "@/components/header";
import { Reveal } from "@/components/motion/reveal";
import { MuestraApp } from "@/components/vitrina/muestra";
import { Link } from "@/i18n/navigation";
import { routing, type Locale } from "@/i18n/routing";
import { getCv } from "@/lib/content";
import { SITE_URL } from "@/lib/site";
import { getFichasVitrina } from "@/lib/vitrina/loader";

/**
 * LA VITRINA — ÍNDICE (S5, ADR-013): el escaparate de las apps hermanas del
 * portafolio, re-expresadas desde su `brochure-export.json` en el design
 * system de CV Viva.
 *
 * **Esta ruta es la MUESTRA CORTA.** Cada app tiene su propio espacio en
 * `/vitrina/<slug>`; aquí solo se asoma. La primera versión apilaba las seis
 * fichas enteras en esta página —más de 22 000 px de documento— y eso rompía
 * tres cosas de golpe: ninguna app era direccionable por sí sola, el visitante
 * cargaba las seis para leer una, y el escaparate dejaba de ser escaparate.
 * Una vitrina se recorre de un vistazo; el detalle está adentro.
 *
 * 100% SSG. El hero (candidato LCP) nace ESTÁTICO — sin wrapper de motion que
 * arranque en opacity 0 (patrón `lcp-nace-estatico`). **Cero enlaces**: los
 * únicos destinos son rutas de este repo.
 */

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

type Params = { params: Promise<{ locale: string }> };

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const { locale } = await params;
  if (!hasLocale(routing.locales, locale)) return {};
  const t = await getTranslations({ locale, namespace: "vitrina" });

  return {
    metadataBase: new URL(SITE_URL),
    title: `${t("titulo")} — Henry Rincón`,
    description: t("subtitulo"),
    alternates: {
      languages: {
        es: "/es/vitrina",
        en: "/en/vitrina",
        "x-default": "/es/vitrina",
      },
    },
  };
}

export default async function VitrinaPage({ params }: Params) {
  const { locale } = await params;
  if (!hasLocale(routing.locales, locale)) notFound();
  setRequestLocale(locale);

  const l = locale as Locale;
  const cv = getCv(l);
  const t = await getTranslations("vitrina");
  const fichas = getFichasVitrina();

  return (
    <>
      <Header nombre={cv.identidad.nombre} enHome={false} />
      <main id="contenido" className="flex-1">
        <div className="mx-auto max-w-5xl px-4 py-16 md:px-6 md:py-20">
          {/* Hero estático (candidato LCP): sin motion JS. */}
          <header className="mb-12">
            <p className="anim-fade-in-up mb-5 flex items-center gap-2 text-xs font-medium tracking-[0.18em] text-sage-ink uppercase">
              <span
                aria-hidden="true"
                className="size-1.5 rounded-full bg-sage-ink"
              />
              {t("eyebrow")}
            </p>
            <h1 className="max-w-[20ch] font-display text-[clamp(2rem,5.5vw,3.25rem)] leading-[1.05] font-medium tracking-[-0.02em] text-ink-0">
              {t("titulo")}
            </h1>
            <p className="mt-5 max-w-[60ch] text-[16px] leading-[1.75] text-ink-1">
              {t("subtitulo")}
            </p>
            <p className="mt-3 max-w-[60ch] text-[15px] leading-relaxed text-ink-2">
              {t("indiceNota")}
            </p>
            {/* En /en: las fichas conservan la voz de cada app (ADR-013 §6). */}
            {t("notaIdioma") !== "" && (
              <p className="mt-3 max-w-[60ch] text-sm leading-relaxed text-ink-2 italic">
                {t("notaIdioma")}
              </p>
            )}
          </header>

          <Reveal variant="fadeInUp" amount="some">
            <ul className="grid gap-5 sm:grid-cols-2">
              {fichas.map((ficha) => (
                <MuestraApp key={ficha.ancla.slug} ficha={ficha} />
              ))}
            </ul>
          </Reveal>

          {/* Cierre: el anclaje de toda la vitrina + la lista de espera. */}
          <Reveal variant="fadeInUp">
            <section
              id="contacto-vitrina"
              aria-labelledby="vitrina-cierre"
              className="mt-14 scroll-mt-16 border-t border-paper-2 pt-10"
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
              <p className="mt-2 max-w-[60ch] text-sm leading-relaxed text-ink-2">
                {t("anclajeNota")}
              </p>
              <Link
                href="/#contacto"
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
