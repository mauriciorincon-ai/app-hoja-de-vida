import type { Metadata } from "next";
import { hasLocale } from "next-intl";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { notFound } from "next/navigation";
import { CvDownloadButton } from "@/components/cv-download-button";
import { Footer } from "@/components/footer";
import { Header } from "@/components/header";
import { Link } from "@/i18n/navigation";
import { routing, type Locale } from "@/i18n/routing";
import { getCv } from "@/lib/content";
import { SITE_URL } from "@/lib/site";

/**
 * /cv — la hoja de vida completa en una sola página imprimible (print CSS en
 * globals) + descarga del PDF ATS. Misma fuente que la HOME y el PDF: los
 * YAML. Sin animaciones: esta ruta es utilitaria (screeners e impresión).
 */

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

type Params = { params: Promise<{ locale: string }> };

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "cv" });

  return {
    metadataBase: new URL(SITE_URL),
    title: `${t("titulo")} — Henry Rincón`,
    description: t("subtitulo"),
    alternates: {
      languages: { es: "/es/cv", en: "/en/cv", "x-default": "/es/cv" },
    },
  };
}

export default async function CvPage({ params }: Params) {
  const { locale } = await params;
  if (!hasLocale(routing.locales, locale)) {
    notFound();
  }
  setRequestLocale(locale);

  const cv = getCv(locale as Locale);
  const t = await getTranslations("cv");
  const tNav = await getTranslations("nav");
  const tDetalle = await getTranslations("detalle");
  const tPerfil = await getTranslations("perfil");

  return (
    <>
      <div className="print:hidden">
        <Header nombre={cv.identidad.nombre} enHome={false} />
      </div>
      <main id="contenido" className="flex-1">
        <article className="mx-auto max-w-3xl px-4 py-16 md:px-6 md:py-20 print:py-0">
          <div className="mb-12 flex flex-wrap items-center justify-between gap-5 print:hidden">
            <div>
              <h1 className="font-display text-[clamp(2rem,5vw,3rem)] leading-[1.05] font-medium tracking-[-0.02em] text-ink-0">
                {t("titulo")}
              </h1>
              <p className="mt-3 max-w-[52ch] text-[15px] leading-relaxed text-ink-2">
                {t("subtitulo")}
              </p>
            </div>
            <CvDownloadButton label={t("descargar")} />
          </div>

          {/* Documento imprimible: semántico, sin motion */}
          <div className="flex flex-col gap-10 border-t border-paper-2 pt-10 print:border-0 print:pt-0">
            <header>
              <h2 className="font-display text-2xl font-medium text-ink-0">
                {cv.identidad.nombreCompleto ?? cv.identidad.nombre}
              </h2>
              <p className="mt-1 text-[15px] text-ink-1">
                {cv.identidad.eyebrow}
              </p>
              <p className="mt-2 font-mono text-[13px] text-ink-2">
                {cv.identidad.ubicacion} · {cv.identidad.email}
                {cv.identidad.enlaces.map((e) => (
                  <span key={e.url}> · {e.url}</span>
                ))}
              </p>
            </header>

            <section aria-labelledby="cv-perfil">
              <h3
                id="cv-perfil"
                className="mb-3 font-mono text-[13px] tracking-[0.12em] text-ink-2 uppercase"
              >
                {tPerfil("titulo")}
              </h3>
              <p className="text-[15px] leading-[1.7] text-ink-1">
                {cv.identidad.perfil || cv.identidad.resumen}
              </p>
            </section>

            <section aria-labelledby="cv-experiencia">
              <h3
                id="cv-experiencia"
                className="mb-5 font-mono text-[13px] tracking-[0.12em] text-ink-2 uppercase"
              >
                {tNav("trayectoria")}
              </h3>
              <ol className="flex flex-col gap-7">
                {cv.trayectoria.map((rol) => (
                  <li key={`${rol.periodo}-${rol.rol}`}>
                    <div className="flex flex-wrap items-baseline justify-between gap-x-4">
                      <h4 className="text-base font-semibold text-ink-0">
                        {rol.rol} — {rol.organizacion}
                      </h4>
                      <span className="font-mono text-[12px] text-ink-2 uppercase tabular-nums">
                        {rol.periodo}
                      </span>
                    </div>
                    {rol.bullets.length > 0 ? (
                      <ul className="mt-2 flex flex-col gap-1.5">
                        {rol.bullets.map((bullet) => (
                          <li
                            key={bullet}
                            className="flex gap-2.5 text-sm leading-relaxed text-ink-1"
                          >
                            <span
                              aria-hidden="true"
                              className="mt-[9px] size-1 shrink-0 rounded-full bg-ink-3"
                            />
                            {bullet}
                          </li>
                        ))}
                      </ul>
                    ) : (
                      <p className="mt-2 text-sm leading-relaxed text-ink-1">
                        {rol.descripcion}
                      </p>
                    )}
                  </li>
                ))}
              </ol>
            </section>

            <section aria-labelledby="cv-proyectos">
              <h3
                id="cv-proyectos"
                className="mb-5 font-mono text-[13px] tracking-[0.12em] text-ink-2 uppercase"
              >
                {tNav("proyectos")}
              </h3>
              <ul className="flex flex-col gap-5">
                {cv.proyectos.map((proyecto) => (
                  <li key={proyecto.slug}>
                    <h4 className="text-base font-semibold text-ink-0">
                      {proyecto.nombre}
                    </h4>
                    <p className="mt-1 text-sm leading-relaxed text-ink-1">
                      {proyecto.resumen}
                    </p>
                    {proyecto.casestudy && (
                      <Link
                        href={`/proyectos/${proyecto.slug}`}
                        className="mt-1 inline-flex min-h-11 items-center gap-1 text-sm font-medium text-sage-ink transition-colors duration-[120ms] hover:text-ink-0 print:hidden"
                      >
                        {tDetalle("verCaseStudy")}
                        <span aria-hidden="true">→</span>
                      </Link>
                    )}
                  </li>
                ))}
              </ul>
            </section>

            <section aria-labelledby="cv-skills">
              <h3
                id="cv-skills"
                className="mb-4 font-mono text-[13px] tracking-[0.12em] text-ink-2 uppercase"
              >
                {tNav("skills")}
              </h3>
              <ul className="flex flex-col gap-2">
                {cv.skills.map((grupo) => (
                  <li key={grupo.grupo} className="text-sm text-ink-1">
                    <span className="font-semibold text-ink-0">
                      {grupo.grupo}:
                    </span>{" "}
                    {grupo.items.join(" · ")}
                  </li>
                ))}
              </ul>
            </section>

            <section aria-labelledby="cv-certificaciones">
              <h3
                id="cv-certificaciones"
                className="mb-4 font-mono text-[13px] tracking-[0.12em] text-ink-2 uppercase"
              >
                {tNav("certificaciones")}
              </h3>
              <ul className="flex flex-col gap-1.5">
                {cv.certificaciones.map((cert) => (
                  <li
                    key={cert.nombre}
                    className="text-sm leading-relaxed text-ink-1"
                  >
                    {cert.nombre}{" "}
                    <span className="font-mono text-[12px] text-ink-2">
                      ({cert.fecha})
                    </span>
                  </li>
                ))}
              </ul>
            </section>
          </div>

          <p className="mt-14 print:hidden">
            <Link
              href="/"
              className="flex min-h-11 items-center gap-1.5 self-start font-mono text-[13px] text-ink-2 transition-colors duration-[120ms] hover:text-ink-0"
            >
              <span aria-hidden="true">←</span>
              {t("volver")}
            </Link>
          </p>
        </article>
      </main>
      <div className="print:hidden">
        <Footer identidad={cv.identidad} />
      </div>
    </>
  );
}
