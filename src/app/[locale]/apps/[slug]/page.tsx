import type { Metadata } from "next";
import { hasLocale } from "next-intl";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { notFound } from "next/navigation";
import { BrochureVisitTracker } from "@/components/brochure-visit-tracker";
import { Footer } from "@/components/footer";
import { Header } from "@/components/header";
import { Counter } from "@/components/motion/counter";
import { Reveal } from "@/components/motion/reveal";
import { Stagger, StaggerItem } from "@/components/motion/stagger";
import { Link } from "@/i18n/navigation";
import { appsConBrochure, getBrochureApp } from "@/lib/brochure";
import { getCv } from "@/lib/content";
import { routing, type Locale } from "@/i18n/routing";
import { SITE_URL } from "@/lib/site";

/**
 * Brochure animada por app (S4, ADR-012). Template ÚNICO data-driven: una app
 * con `brochure` en data/apps.yaml gana esta página automáticamente. 100% SSG;
 * el hero + intro (candidato LCP) nacen ESTÁTICOS (patrón lcp-nace-estatico),
 * el motion vive bajo el fold con reduced-motion a doble cinturón.
 */

export function generateStaticParams() {
  return routing.locales.flatMap((locale) =>
    appsConBrochure().map((app) => ({ locale, slug: app.id })),
  );
}

type Params = { params: Promise<{ locale: string; slug: string }> };

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const { locale, slug } = await params;
  if (!hasLocale(routing.locales, locale)) return {};
  const app = getBrochureApp(slug);
  if (!app) return {};
  const l = locale as Locale;

  return {
    metadataBase: new URL(SITE_URL),
    title: `${app.nombre[l]} — Henry Rincón`,
    description: app.brochure.tagline[l],
    alternates: {
      languages: {
        es: `/es/apps/${slug}`,
        en: `/en/apps/${slug}`,
        "x-default": `/es/apps/${slug}`,
      },
    },
  };
}

export default async function BrochurePage({ params }: Params) {
  const { locale, slug } = await params;
  if (!hasLocale(routing.locales, locale)) notFound();
  const app = getBrochureApp(slug);
  if (!app) notFound();
  setRequestLocale(locale);

  const l = locale as Locale;
  const cv = getCv(l);
  const t = await getTranslations("brochure");
  const tApps = await getTranslations("apps");
  const { brochure } = app;

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    name: app.nombre[l],
    description: brochure.tagline[l],
    applicationCategory: "DeveloperApplication",
    inLanguage: locale,
    url: `${SITE_URL}/${locale}/apps/${slug}`,
    author: {
      "@type": "Person",
      name: cv.identidad.nombreCompleto ?? cv.identidad.nombre,
      alternateName: cv.identidad.nombre,
    },
  };

  return (
    <>
      <Header nombre={cv.identidad.nombre} enHome={false} />
      <main id="contenido" className="flex-1">
        <article className="mx-auto max-w-3xl px-4 py-16 md:px-6 md:py-20">
          <nav aria-label="Breadcrumb">
            <Link
              href="/#apps"
              className="flex min-h-11 items-center gap-1.5 self-start font-mono text-[13px] text-ink-2 transition-colors duration-[120ms] hover:text-ink-0"
            >
              <span aria-hidden="true">←</span>
              {t("volver")}
            </Link>
          </nav>

          {/* Hero: el h1 y el párrafo intro son el candidato LCP en móvil — se
              pintan ESTÁTICOS (sin wrapper de motion que arranque en opacity 0).
              La coreografía above-the-fold vive en el eyebrow y el chip de
              estado con CSS (anim-fade-in-up), no en JS. */}
          <header className="mt-6 mb-14">
            <p className="anim-fade-in-up mb-5 flex items-center gap-2 text-xs font-medium tracking-[0.18em] text-sage-ink uppercase">
              <span
                aria-hidden="true"
                className="size-1.5 rounded-full bg-sage-ink"
              />
              {t("eyebrow")}
            </p>
            <h1 className="max-w-[20ch] font-display text-[clamp(2rem,5.5vw,3.25rem)] leading-[1.05] font-medium tracking-[-0.02em] text-ink-0">
              {app.nombre[l]}
            </h1>
            <p className="mt-4 max-w-[42ch] font-display text-[clamp(1.1rem,2.5vw,1.4rem)] leading-snug text-ink-1">
              {brochure.tagline[l]}
            </p>
            <p className="mt-6 max-w-[60ch] text-[16px] leading-[1.75] text-ink-1">
              {brochure.intro[l]}
            </p>
            <span
              className="anim-fade-in-up mt-6 inline-block self-start rounded-full bg-sage px-2.5 py-1 font-mono text-[11px] tracking-[0.02em] text-sage-ink uppercase"
              style={{ "--anim-delay": "0.4s" } as React.CSSProperties}
            >
              {tApps(`estados.${app.estado}`)}
            </span>
          </header>

          <div className="flex flex-col gap-14">
            {/* Métricas: cifras reales, el HTML estático lleva el valor final;
                el Counter re-arranca desde 0 solo en viewport (bajo el fold). */}
            {brochure.metricas.length > 0 && (
              <Reveal variant="fadeInUp">
                <ul className="grid grid-cols-1 gap-4 sm:grid-cols-3">
                  {brochure.metricas.map((m) => (
                    <li
                      key={m.etiqueta[l]}
                      className="rounded-[10px] border border-paper-3 bg-paper-1 p-5 shadow-sh-1"
                    >
                      <p className="font-display text-3xl font-medium text-ink-0">
                        <Counter
                          value={m.valor}
                          suffix={m.sufijo}
                          locale={locale}
                        />
                      </p>
                      <p className="mt-1 text-sm leading-snug text-ink-2">
                        {m.etiqueta[l]}
                      </p>
                    </li>
                  ))}
                </ul>
              </Reveal>
            )}

            {/* Funcionalidades "en movimiento" */}
            <Reveal variant="fadeInUp">
              <section aria-labelledby="b-funcionalidades">
                <h2
                  id="b-funcionalidades"
                  className="mb-6 font-display text-2xl font-medium tracking-[-0.015em] text-ink-0"
                >
                  {t("funcionalidades")}
                </h2>
                <Stagger className="grid gap-4 sm:grid-cols-2">
                  {brochure.funcionalidades.map((f) => (
                    <StaggerItem key={f.titulo[l]} variant="scaleInBlur">
                      <div className="flex h-full flex-col gap-2 rounded-[10px] border border-paper-3 bg-paper-0 p-6 shadow-sh-1">
                        <h3 className="flex items-start gap-2 font-medium text-ink-0">
                          <span
                            aria-hidden="true"
                            className="mt-1 text-sage-ink"
                          >
                            ◆
                          </span>
                          {f.titulo[l]}
                        </h3>
                        <p className="text-sm leading-relaxed text-ink-2">
                          {f.descripcion[l]}
                        </p>
                      </div>
                    </StaggerItem>
                  ))}
                </Stagger>
              </section>
            </Reveal>

            {/* Stack */}
            {brochure.stack.length > 0 && (
              <Reveal variant="fadeInUp">
                <section aria-labelledby="b-stack">
                  <h2
                    id="b-stack"
                    className="mb-4 font-display text-2xl font-medium tracking-[-0.015em] text-ink-0"
                  >
                    {t("stack")}
                  </h2>
                  <ul className="flex flex-wrap gap-2">
                    {brochure.stack.map((tech) => (
                      <li
                        key={tech}
                        className="rounded-full bg-paper-2 px-2.5 py-1 font-mono text-[11px] tracking-[0.02em] text-ink-2 uppercase"
                      >
                        {tech}
                      </li>
                    ))}
                  </ul>
                </section>
              </Reveal>
            )}

            {/* CTA: reutiliza el formulario de contacto + enlaces reales */}
            <Reveal variant="fadeInUp">
              <div className="flex flex-wrap items-center gap-5 border-t border-paper-2 pt-10">
                <Link
                  href="/#contacto"
                  className="flex min-h-11 items-center gap-2 rounded-md bg-sage px-6 text-[15px] font-medium text-sage-ink shadow-sh-1 transition-[filter] duration-[120ms] hover:brightness-[0.97]"
                >
                  {t("cta")}
                  <span aria-hidden="true">→</span>
                </Link>
                {app.enlaces.map((enlace) => (
                  <a
                    key={enlace.url}
                    href={enlace.url}
                    rel="noopener noreferrer"
                    target="_blank"
                    className="flex min-h-11 items-center gap-1 text-sm text-ink-2 underline decoration-paper-3 underline-offset-4 transition-colors duration-[120ms] hover:text-ink-0 hover:decoration-ink-3"
                  >
                    {enlace.etiqueta}
                    <span aria-hidden="true">↗</span>
                  </a>
                ))}
              </div>
            </Reveal>
          </div>
        </article>
      </main>
      <Footer identidad={cv.identidad} />
      <BrochureVisitTracker app={slug} />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(jsonLd).replace(/</g, "\\u003c"),
        }}
      />
    </>
  );
}
