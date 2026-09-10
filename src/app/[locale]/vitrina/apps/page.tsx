import type { Metadata } from "next";
import { hasLocale } from "next-intl";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { notFound } from "next/navigation";
import { Footer } from "@/components/footer";
import { Header } from "@/components/header";
import { Reveal } from "@/components/motion/reveal";
import { Roadmap } from "@/components/home/roadmap";
import { MuestraApp } from "@/components/vitrina/muestra";
import { appsConBrochure } from "@/lib/brochure";
import { Link } from "@/i18n/navigation";
import { routing, type Locale } from "@/i18n/routing";
import { getCv } from "@/lib/content";
import { SITE_URL } from "@/lib/site";
import { getFrente } from "@/lib/vitrina/categorias";
import { getFichasVitrina } from "@/lib/vitrina/loader";
import { appsConRoadmap } from "@/lib/votes/roadmap";

/**
 * EL FRENTE «APPS» — el escaparate (S5, ADR-013 · reubicado en ADR-015): las
 * apps hermanas del portafolio, re-expresadas desde su `brochure-export.json`
 * en el design system de CV Viva.
 *
 * Vivía en `/vitrina`; desde que la vitrina se reparte en cuatro frentes
 * (apps · agentes · investigaciones · tableros) esa ruta es el PORTAL y las
 * apps tienen aquí su propio segmento. Todo lo demás sigue igual.
 *
 * **Esta ruta es la MUESTRA CORTA.** Cada app tiene su propio espacio en
 * `/vitrina/apps/<slug>`; aquí solo se asoma. La primera versión apilaba las seis
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
  const frente = getFrente("apps");
  const n = getFichasVitrina().length;

  return {
    metadataBase: new URL(SITE_URL),
    title: `${t("appsTitulo", { n })} — Henry Rincón`,
    description: frente?.detalle[locale as Locale],
    alternates: {
      languages: {
        es: "/es/vitrina/apps",
        en: "/en/vitrina/apps",
        "x-default": "/es/vitrina/apps",
      },
    },
  };
}

export default async function VitrinaAppsPage({ params }: Params) {
  const { locale } = await params;
  if (!hasLocale(routing.locales, locale)) notFound();
  setRequestLocale(locale);

  const l = locale as Locale;
  const cv = getCv(l);
  const t = await getTranslations("vitrina");
  const fichas = getFichasVitrina();
  // El párrafo del hero sale del YAML del frente, como el de los otros tres.
  const frente = getFrente("apps");
  if (!frente) notFound();
  // «De esta casa»: las apps del pipeline que viven en ESTA página y tienen
  // brochure propia. No son fichas de la vitrina —su contenido nace de
  // `apps.yaml`, no de un `brochure-export.json`, y el ADR-013 mantiene esas
  // dos fuentes separadas— pero sí pertenecen a «lo construido», que desde
  // ahora tiene UNA sola puerta. Antes su acceso era la sección «Apps» de la
  // HOME, retirada por prometer lo mismo que la vitrina.
  const propias = appsConBrochure();
  // «Qué viene — y tú decides el orden» es una pregunta sobre las apps, así
  // que se contesta aquí, con las apps (revisión post-S7): antes vivía en la
  // HOME, donde nadie le pregunta a una hoja de vida qué viene.
  const conRoadmap = appsConRoadmap();

  return (
    <>
      <Header nombre={cv.identidad.nombre} enHome={false} />
      <main id="contenido" className="flex-1">
        <div className="mx-auto max-w-5xl px-4 py-10 md:px-6 md:py-14">
          <nav aria-label={t("migaEtiqueta")} className="mb-8">
            <Link
              href="/vitrina"
              className="inline-flex min-h-11 items-center gap-2 font-mono text-[11px] tracking-[0.08em] text-ink-2 uppercase hover:text-ink-0"
            >
              <span aria-hidden="true">←</span>
              {t("volverIndice")}
            </Link>
          </nav>

          {/* Hero estático (candidato LCP): sin motion JS. */}
          <header className="mb-12">
            <p className="anim-fade-in-up mb-5 flex items-center gap-2 text-xs font-medium tracking-[0.18em] text-sage-ink uppercase">
              <span
                aria-hidden="true"
                className="size-1.5 rounded-full bg-sage-ink"
              />
              {t("eyebrow")} · {frente.nombre[l]}
            </p>
            <h1 className="max-w-[20ch] font-display text-[clamp(2rem,5.5vw,3.25rem)] leading-[1.05] font-medium tracking-[-0.02em] text-ink-0">
              {t("appsTitulo", { n: fichas.length })}
            </h1>
            <p className="mt-5 max-w-[60ch] text-[16px] leading-[1.75] text-ink-1">
              {frente.detalle[l]}
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

          {/* ── Qué viene: el roadmap votable, con las apps ── */}
          {conRoadmap.length > 0 && <Roadmap apps={conRoadmap} embebido />}

          {/* ── De esta casa: lo construido que sostiene esta misma página ── */}
          {propias.length > 0 && (
            <Reveal variant="fadeInUp">
              <section
                aria-labelledby="de-esta-casa"
                className="mt-14 border-t border-paper-2 pt-10"
              >
                <h2
                  id="de-esta-casa"
                  className="font-display text-2xl font-medium tracking-[-0.015em] text-ink-0"
                >
                  {t("deEstaCasa")}
                </h2>
                <p className="mt-3 max-w-[60ch] text-[15px] leading-relaxed text-ink-1">
                  {t("deEstaCasaLinea")}
                </p>
                <ul className="mt-5 grid gap-3 sm:grid-cols-2">
                  {propias.map((app) => (
                    <li key={app.id} className="list-none">
                      <Link
                        href={`/apps/${app.id}`}
                        data-app-propia={app.id}
                        className="flex h-full flex-col gap-1.5 rounded-[10px] border border-paper-2 bg-paper-0 p-5 transition-[box-shadow] duration-[180ms] hover:shadow-sh-1"
                      >
                        <span className="font-display text-[1.05rem] font-medium text-ink-0">
                          {app.nombre[l]}
                        </span>
                        <span className="text-sm leading-relaxed text-ink-2">
                          {app.brochure.tagline[l]}
                        </span>
                        <span className="mt-1 flex items-center gap-1.5 text-[14px] font-medium text-sage-ink">
                          {t("verLaApp")}
                          <span aria-hidden="true">→</span>
                        </span>
                      </Link>
                    </li>
                  ))}
                </ul>
              </section>
            </Reveal>
          )}

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
