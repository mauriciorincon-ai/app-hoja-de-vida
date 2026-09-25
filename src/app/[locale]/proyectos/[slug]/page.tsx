import type { Metadata } from "next";
import { hasLocale } from "next-intl";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { notFound } from "next/navigation";
import { DetalleVisitTracker } from "@/components/detalle-visit-tracker";
import { Footer } from "@/components/footer";
import { Header } from "@/components/header";
import { Counter } from "@/components/motion/counter";
import { Reveal } from "@/components/motion/reveal";
import { Stagger, StaggerItem } from "@/components/motion/stagger";
import { Link } from "@/i18n/navigation";
import { routing, type Locale } from "@/i18n/routing";
import { hitoDeCaso, vecinosDeCaso } from "@/lib/casos";
import { getCv } from "@/lib/content";
import { SITE_URL } from "@/lib/site";

/**
 * Template ÚNICO de case study (regla del sprint: sin efectos por página).
 * Data-driven: un proyecto con `casestudy` en data/cv.*.yaml gana esta
 * página automáticamente — cero código para agregar el noveno.
 *
 * Revisión 2026-09-24 (ADR-009 enmendado): la página pasó de cuatro listas a
 * una pieza editorial en siete tiempos — tesis, cifras, contexto y reto lado a
 * lado, capítulos numerados, impacto, lección y los casos vecinos—. El dueño
 * lo pidió «minimalista y elegante, profesional pero impactante a la vista»,
 * después de encontrar el caso de Vesting igual de simple que antes del
 * corpus a fondo. La profundidad existe en ese corpus; esta página la condensa.
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
    description: proyecto.casestudy?.titular,
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
  const hito = hitoDeCaso(cv, slug);
  const { anterior, siguiente } = vecinosDeCaso(cv, slug);

  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Article",
        headline: proyecto.nombre,
        description: casestudy.titular,
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
            name: tNav("trayectoria"),
            item: `${SITE_URL}/${locale}#trayectoria`,
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
              href="/#trayectoria"
              className="flex min-h-11 items-center gap-1.5 self-start font-mono text-[13px] text-ink-2 transition-colors duration-[120ms] hover:text-ink-0"
            >
              <span aria-hidden="true">←</span>
              {t("volver")}
            </Link>
          </nav>

          <header className="mt-6 mb-12 md:mb-14">
            <p className="anim-fade-in-up mb-5 flex flex-wrap items-center gap-x-2 gap-y-1 text-xs font-medium tracking-[0.18em] text-sage-ink uppercase">
              <span
                aria-hidden="true"
                className="size-1.5 rounded-full bg-sage-ink"
              />
              {t("eyebrow")}
              {hito && (
                <>
                  <span aria-hidden="true" className="text-ink-2">
                    ·
                  </span>
                  <span data-testid="cs-rol" className="text-ink-2">
                    {hito.rol}
                  </span>
                </>
              )}
            </p>
            {/* El h1 es el candidato LCP de la página: se pinta ESTÁTICO —
                un elemento enmascarado no registra paint hasta revelarse
                (lección S1/ADR-006). La coreografía vive en eyebrow y chips. */}
            <h1 className="max-w-[24ch] font-display text-[clamp(2rem,5.5vw,3.25rem)] leading-[1.05] font-medium tracking-[-0.02em] text-ink-0">
              {proyecto.nombre}
            </h1>
            {/* La tesis del caso, estática como el h1: es lo segundo que se lee
                y en móvil puede ser el elemento más grande del primer pliegue. */}
            <p
              data-testid="cs-titular"
              className="mt-6 max-w-[58ch] text-[17px] leading-[1.65] text-ink-1 md:text-[19px]"
            >
              {casestudy.titular}
            </p>
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

          <div className="flex flex-col gap-14 md:gap-16">
            {/* LA BANDA DE CIFRAS: la receta de los logros de la HOME (cifra
                mono con Counter + etiqueta), en una franja entre dos filetes.
                El HTML estático lleva el valor final — el conteo es solo del
                cliente, y con reduced-motion no hay conteo. */}
            <section
              aria-labelledby="cs-cifras"
              data-testid="cs-cifras"
              className="border-y border-paper-3 py-8 md:py-10"
            >
              <h2 id="cs-cifras" className="sr-only">
                {t("cifras")}
              </h2>
              <Stagger
                as="ul"
                className={`grid grid-cols-2 gap-x-6 gap-y-8 md:gap-x-8 ${
                  casestudy.cifras.length === 4
                    ? "md:grid-cols-4"
                    : "md:grid-cols-3"
                }`}
              >
                {casestudy.cifras.map((cifra) => (
                  <StaggerItem
                    key={cifra.etiqueta}
                    as="li"
                    variant="fadeInUp"
                    className="flex flex-col gap-2.5"
                  >
                    <p className="font-mono text-[clamp(2.25rem,6vw,3rem)] leading-none font-medium tracking-[-0.03em] text-ink-0 tabular-nums">
                      {cifra.prefijo && (
                        <span className="align-top text-[0.45em] text-sage-ink">
                          {cifra.prefijo}
                        </span>
                      )}
                      <Counter
                        value={cifra.valor}
                        decimals={cifra.decimales}
                        locale={locale}
                      />
                      {cifra.sufijo && (
                        <span className="text-[0.45em] text-sage-ink">
                          {cifra.sufijo}
                        </span>
                      )}
                    </p>
                    <p className="text-[11px] leading-snug font-medium tracking-[0.08em] text-ink-2 uppercase">
                      {cifra.etiqueta}
                    </p>
                  </StaggerItem>
                ))}
              </Stagger>
            </section>

            {/* Contexto y Reto se pintan ESTÁTICOS: el párrafo de Contexto fue
                el elemento LCP en móvil (un Reveal lo dejaba en opacity 0 hasta
                la hidratación — elementRenderDelay ~8s). Lado a lado desde md:
                son las dos mitades del planteamiento. */}
            <div className="grid gap-10 md:grid-cols-2 md:gap-12">
              {secciones.map((seccion) => (
                <section key={seccion.id} aria-labelledby={`cs-${seccion.id}`}>
                  <h2
                    id={`cs-${seccion.id}`}
                    className="mb-4 font-display text-2xl font-medium tracking-[-0.015em] text-ink-0"
                  >
                    {seccion.titulo}
                  </h2>
                  <p className="text-[16px] leading-[1.75] text-ink-1">
                    {seccion.texto}
                  </p>
                </section>
              ))}
            </div>

            <Reveal variant="fadeInUp">
              <section aria-labelledby="cs-capitulos">
                <h2
                  id="cs-capitulos"
                  className="mb-2 font-display text-2xl font-medium tracking-[-0.015em] text-ink-0"
                >
                  {t("capitulos")}
                </h2>
                <Stagger as="ol" className="flex flex-col">
                  {casestudy.capitulos.map((capitulo, i) => (
                    <StaggerItem
                      key={capitulo.titulo}
                      as="li"
                      variant="fadeInUp"
                      className="grid grid-cols-[2.5rem_1fr] gap-x-3 border-b border-paper-2 py-6 last:border-b-0 md:grid-cols-[3.25rem_1fr] md:py-7"
                    >
                      <span
                        aria-hidden="true"
                        className="pt-[3px] font-mono text-[13px] tracking-[0.04em] text-sage-ink tabular-nums"
                      >
                        {String(i + 1).padStart(2, "0")}
                      </span>
                      <div data-testid="cs-capitulo">
                        <h3 className="font-display text-[1.25rem] leading-snug font-medium tracking-[-0.01em] text-ink-0">
                          {capitulo.titulo}
                        </h3>
                        <p className="mt-2 text-[15px] leading-[1.75] text-ink-1">
                          {capitulo.texto}
                        </p>
                      </div>
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

            {/* LA LECCIÓN: una frase del propio corpus a fondo, en la voz
                display. Es la única cita editorial de la página. */}
            <Reveal variant="fadeInUp">
              <figure
                data-testid="cs-leccion"
                className="border-l-2 border-sage-ink pl-6 md:pl-8"
              >
                <figcaption className="mb-3 font-mono text-[11px] tracking-[0.12em] text-ink-2 uppercase">
                  {t("leccion")}
                </figcaption>
                <blockquote className="font-display text-[clamp(1.35rem,3vw,1.75rem)] leading-[1.35] tracking-[-0.01em] text-ink-0">
                  <p>{casestudy.leccion}</p>
                </blockquote>
              </figure>
            </Reveal>

            {/* LOS CASOS VECINOS, en el orden de la trayectoria: leer los
                casos seguidos es leer la carrera. El periodo dice hacia dónde
                va el tiempo sin que la etiqueta tenga que explicarlo. */}
            <div className="flex flex-col gap-6 border-t border-paper-2 pt-10">
              {(anterior || siguiente) && (
                <nav
                  aria-label={t("otrosCasos")}
                  className="grid gap-3 sm:grid-cols-2"
                >
                  {anterior ? (
                    <Link
                      href={`/proyectos/${anterior.slug}`}
                      data-testid="cs-vecino-anterior"
                      className="flex min-h-11 flex-col gap-1 rounded-[10px] border border-paper-3 p-4 transition-colors duration-[120ms] hover:bg-paper-1 motion-reduce:transition-none"
                    >
                      <span className="font-mono text-[11px] tracking-[0.08em] text-ink-2 uppercase">
                        <span aria-hidden="true">← </span>
                        {t("anterior")}
                      </span>
                      <span className="font-display text-lg leading-snug text-ink-0">
                        {anterior.nombreCorto}
                      </span>
                      <span className="font-mono text-[12px] text-ink-2 tabular-nums">
                        {anterior.periodo}
                      </span>
                    </Link>
                  ) : (
                    <span aria-hidden="true" className="hidden sm:block" />
                  )}
                  {siguiente && (
                    <Link
                      href={`/proyectos/${siguiente.slug}`}
                      data-testid="cs-vecino-siguiente"
                      className="flex min-h-11 flex-col gap-1 rounded-[10px] border border-paper-3 p-4 transition-colors duration-[120ms] hover:bg-paper-1 motion-reduce:transition-none sm:items-end sm:text-right"
                    >
                      <span className="font-mono text-[11px] tracking-[0.08em] text-ink-2 uppercase">
                        {t("siguiente")}
                        <span aria-hidden="true"> →</span>
                      </span>
                      <span className="font-display text-lg leading-snug text-ink-0">
                        {siguiente.nombreCorto}
                      </span>
                      <span className="font-mono text-[12px] text-ink-2 tabular-nums">
                        {siguiente.periodo}
                      </span>
                    </Link>
                  )}
                </nav>
              )}

              {/* Revisión post-S8, bloque C: sin «¿Te suena a tu equipo? Hablemos»
                al pie del case study — el dueño lo sintió invasivo aquí. Queda el
                PDF; el contacto tiene su sección y el hero su botón. */}
              <div className="flex flex-wrap items-center gap-5">
                <Link
                  href="/cv"
                  className="flex min-h-11 items-center text-sm text-ink-2 underline decoration-paper-3 underline-offset-4 transition-colors duration-[120ms] hover:text-ink-0 hover:decoration-ink-3"
                >
                  {t("descargarCv")}
                </Link>
              </div>
            </div>
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
