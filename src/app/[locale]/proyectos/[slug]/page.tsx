import type { Metadata } from "next";
import { hasLocale } from "next-intl";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { notFound } from "next/navigation";
import { DetalleVisitTracker } from "@/components/detalle-visit-tracker";
import { Footer } from "@/components/footer";
import { Header } from "@/components/header";
import { Reveal } from "@/components/motion/reveal";
import { Stagger, StaggerItem } from "@/components/motion/stagger";
import { Link } from "@/i18n/navigation";
import { routing, type Locale } from "@/i18n/routing";
import { getCv } from "@/lib/content";
import { SITE_URL } from "@/lib/site";

/**
 * Template ÚNICO de case study (regla del sprint: sin efectos por página).
 * Data-driven: un proyecto con `casestudy` en data/cv.*.yaml gana esta
 * página automáticamente — cero código para agregar el sexto.
 */

export function generateStaticParams() {
  return routing.locales.flatMap((locale) =>
    getCv(locale)
      .proyectos.filter((p) => p.casestudy)
      .map((p) => ({ locale, slug: p.slug })),
  );
}

type Params = { params: Promise<{ locale: string; slug: string }> };

function getProyecto(locale: string, slug: string) {
  if (!hasLocale(routing.locales, locale)) return undefined;
  return getCv(locale as Locale).proyectos.find(
    (p) => p.slug === slug && p.casestudy,
  );
}

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const { locale, slug } = await params;
  const proyecto = getProyecto(locale, slug);
  if (!proyecto) return {};

  return {
    metadataBase: new URL(SITE_URL),
    title: `${proyecto.nombre} — Henry Rincón`,
    description: proyecto.casestudy?.contexto,
    alternates: {
      languages: {
        es: `/es/proyectos/${slug}`,
        en: `/en/proyectos/${slug}`,
        "x-default": `/es/proyectos/${slug}`,
      },
    },
  };
}

export default async function ProyectoDetallePage({ params }: Params) {
  const { locale, slug } = await params;
  const proyecto = getProyecto(locale, slug);
  if (!proyecto?.casestudy) {
    notFound();
  }
  setRequestLocale(locale);

  const cv = getCv(locale as Locale);
  const t = await getTranslations("detalle");
  const tNav = await getTranslations("nav");
  const casestudy = proyecto.casestudy;

  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Article",
        headline: proyecto.nombre,
        description: casestudy.contexto,
        inLanguage: locale,
        url: `${SITE_URL}/${locale}/proyectos/${slug}`,
        author: {
          "@type": "Person",
          name: cv.identidad.nombreCompleto ?? cv.identidad.nombre,
          alternateName: cv.identidad.nombre,
        },
      },
      {
        "@type": "BreadcrumbList",
        itemListElement: [
          {
            "@type": "ListItem",
            position: 1,
            name: tNav("proyectos"),
            item: `${SITE_URL}/${locale}#proyectos`,
          },
          {
            "@type": "ListItem",
            position: 2,
            name: proyecto.nombre,
            item: `${SITE_URL}/${locale}/proyectos/${slug}`,
          },
        ],
      },
    ],
  };

  const secciones = [
    { id: "contexto", titulo: t("contexto"), texto: casestudy.contexto },
    { id: "reto", titulo: t("reto"), texto: casestudy.reto },
  ];

  return (
    <>
      <Header nombre={cv.identidad.nombre} enHome={false} />
      <main id="contenido" className="flex-1">
        <article className="mx-auto max-w-3xl px-4 py-16 md:px-6 md:py-20">
          <nav aria-label="Breadcrumb">
            <Link
              href="/#proyectos"
              className="flex min-h-11 items-center gap-1.5 self-start font-mono text-[13px] text-ink-2 transition-colors duration-[120ms] hover:text-ink-0"
            >
              <span aria-hidden="true">←</span>
              {t("volver")}
            </Link>
          </nav>

          <header className="mt-6 mb-14">
            <p className="anim-fade-in-up mb-5 flex items-center gap-2 text-xs font-medium tracking-[0.18em] text-sage-ink uppercase">
              <span
                aria-hidden="true"
                className="size-1.5 rounded-full bg-sage-ink"
              />
              {t("eyebrow")}
            </p>
            <h1 className="max-w-[24ch] font-display text-[clamp(2rem,5.5vw,3.25rem)] leading-[1.05] font-medium tracking-[-0.02em] text-ink-0">
              <span className="block overflow-hidden">
                <span
                  className="anim-mask-up block"
                  style={{ "--anim-delay": "0.15s" } as React.CSSProperties}
                >
                  {proyecto.nombre}
                </span>
              </span>
            </h1>
            {proyecto.stack.length > 0 && (
              <ul
                aria-label={t("stack")}
                className="anim-fade-in-up mt-6 flex flex-wrap gap-2"
                style={{ "--anim-delay": "0.5s" } as React.CSSProperties}
              >
                {proyecto.stack.map((tech) => (
                  <li
                    key={tech}
                    className="rounded-full bg-paper-2 px-2.5 py-1 font-mono text-[11px] tracking-[0.02em] text-ink-2 uppercase"
                  >
                    {tech}
                  </li>
                ))}
              </ul>
            )}
          </header>

          <div className="flex flex-col gap-12">
            {secciones.map((seccion) => (
              <Reveal key={seccion.id} variant="fadeInUp">
                <section aria-labelledby={`cs-${seccion.id}`}>
                  <h2
                    id={`cs-${seccion.id}`}
                    className="mb-4 font-display text-2xl font-medium tracking-[-0.015em] text-ink-0"
                  >
                    {seccion.titulo}
                  </h2>
                  <p className="max-w-[68ch] text-[16px] leading-[1.75] text-ink-1">
                    {seccion.texto}
                  </p>
                </section>
              </Reveal>
            ))}

            <Reveal variant="fadeInUp">
              <section aria-labelledby="cs-acciones">
                <h2
                  id="cs-acciones"
                  className="mb-5 font-display text-2xl font-medium tracking-[-0.015em] text-ink-0"
                >
                  {t("acciones")}
                </h2>
                <Stagger className="flex flex-col gap-3">
                  {casestudy.acciones.map((accion) => (
                    <StaggerItem key={accion} variant="fadeInUp">
                      <p className="flex max-w-[68ch] gap-3 text-[15px] leading-relaxed text-ink-1">
                        <span
                          aria-hidden="true"
                          className="mt-[9px] size-1.5 shrink-0 rounded-full bg-sage-ink"
                        />
                        {accion}
                      </p>
                    </StaggerItem>
                  ))}
                </Stagger>
              </section>
            </Reveal>

            <Reveal variant="fadeInUp">
              <section
                aria-labelledby="cs-impacto"
                className="rounded-[10px] border border-paper-3 bg-paper-1 p-6 shadow-sh-1 md:p-8"
              >
                <h2
                  id="cs-impacto"
                  className="mb-5 font-display text-2xl font-medium tracking-[-0.015em] text-ink-0"
                >
                  {t("impacto")}
                </h2>
                <ul className="flex flex-col gap-3">
                  {casestudy.impacto.map((logro) => (
                    <li
                      key={logro}
                      className="flex gap-3 text-[15px] leading-relaxed text-ink-1"
                    >
                      <span aria-hidden="true" className="text-sage-ink">
                        ◆
                      </span>
                      {logro}
                    </li>
                  ))}
                </ul>
              </section>
            </Reveal>

            <Reveal variant="fadeInUp">
              <div className="flex flex-wrap items-center gap-5 border-t border-paper-2 pt-10">
                <Link
                  href="/#contacto"
                  className="flex min-h-11 items-center gap-2 rounded-md bg-sage px-6 text-[15px] font-medium text-sage-ink shadow-sh-1 transition-[filter] duration-[120ms] hover:brightness-[0.97]"
                >
                  {t("cta")}
                  <span aria-hidden="true">→</span>
                </Link>
                <Link
                  href="/cv"
                  className="flex min-h-11 items-center text-sm text-ink-2 underline decoration-paper-3 underline-offset-4 transition-colors duration-[120ms] hover:text-ink-0 hover:decoration-ink-3"
                >
                  {t("descargarCv")}
                </Link>
              </div>
            </Reveal>
          </div>
        </article>
      </main>
      <Footer identidad={cv.identidad} />
      <DetalleVisitTracker slug={slug} />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          // Escape de "<": impide cerrar el tag desde el contenido del YAML
          __html: JSON.stringify(jsonLd).replace(/</g, "\\u003c"),
        }}
      />
    </>
  );
}
