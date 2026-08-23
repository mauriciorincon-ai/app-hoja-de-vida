import type { Metadata } from "next";
import { hasLocale } from "next-intl";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { notFound } from "next/navigation";
import { Footer } from "@/components/footer";
import { Header } from "@/components/header";
import { Reveal } from "@/components/motion/reveal";
import { AperturaPorLectura } from "@/components/vitrina/apertura-por-lectura";
import { FichaApp } from "@/components/vitrina/ficha";
import { Link } from "@/i18n/navigation";
import { routing, type Locale } from "@/i18n/routing";
import { getCv } from "@/lib/content";
import { SITE_URL } from "@/lib/site";
import { getFicha, getFichasVitrina } from "@/lib/vitrina/loader";

/**
 * LA FICHA DE UNA APP — su espacio propio (S5, ADR-013).
 *
 * Cada app hermana tiene aquí una ruta entera para ella: `/vitrina/<slug>`.
 * Es lo que la convierte en algo que se puede abrir, marcar y recorrer sin
 * arrastrar a las otras cinco. El índice (`/vitrina`) es solo el escaparate.
 *
 * 100% SSG: `generateStaticParams` cruza los dos idiomas con los slugs que
 * traen los `brochure-export.json` — agregar una app hermana es dejar caer su
 * export en `content/vitrina/` y su página existe sola, sin tocar código.
 *
 * **Cero enlaces** (regla dura 16): ni un `href` a la app ni a su repositorio.
 * Los únicos destinos son rutas de este repo.
 */

export function generateStaticParams() {
  return routing.locales.flatMap((locale) =>
    getFichasVitrina().map((f) => ({ locale, app: f.ancla.slug })),
  );
}

type Params = { params: Promise<{ locale: string; app: string }> };

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const { locale, app } = await params;
  if (!hasLocale(routing.locales, locale)) return {};
  const ficha = getFicha(app);
  if (!ficha) return {};
  const t = await getTranslations({ locale, namespace: "vitrina" });

  return {
    metadataBase: new URL(SITE_URL),
    title: `${ficha.export.app.nombre} — ${t("eyebrow")} — Henry Rincón`,
    description: ficha.export.promesa.tagline,
    alternates: {
      languages: {
        es: `/es/vitrina/${app}`,
        en: `/en/vitrina/${app}`,
        "x-default": `/es/vitrina/${app}`,
      },
    },
  };
}

export default async function FichaVitrinaPage({ params }: Params) {
  const { locale, app } = await params;
  if (!hasLocale(routing.locales, locale)) notFound();
  setRequestLocale(locale);

  const ficha = getFicha(app);
  if (!ficha) notFound();

  const l = locale as Locale;
  const cv = getCv(l);
  const t = await getTranslations("vitrina");

  // Vecinas en el MISMO orden del índice, para que «siguiente» signifique lo
  // que el visitante acaba de ver arriba.
  const todas = getFichasVitrina();
  const i = todas.findIndex((f) => f.ancla.slug === app);
  const anterior = todas[i - 1];
  const siguiente = todas[i + 1];

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

          {/* La ficha nace visible: es el contenido de esta ruta, no un premio
              al scroll. Sin `Reveal` alrededor, su portada es el LCP y arranca
              pintada (patrón `lcp-nace-estatico`). */}
          <FichaApp ficha={ficha} />
          {/* Una isla gobierna la apertura por lectura de las tarjetas. */}
          <AperturaPorLectura selector=".tarjeta-vitrina" />

          {/* Vecinas: se sale de una ficha hacia otra, no hacia el vacío. */}
          {(anterior || siguiente) && (
            <Reveal variant="fadeInUp">
              <nav
                aria-label={t("vecinasEtiqueta")}
                className="mt-12 grid gap-3 border-t border-paper-2 pt-8 sm:grid-cols-2"
              >
                {anterior ? (
                  <Link
                    href={`/vitrina/${anterior.ancla.slug}`}
                    className="flex min-h-11 flex-col justify-center rounded-[10px] border border-paper-2 bg-paper-0 px-5 py-4 transition-[box-shadow] duration-[180ms] hover:shadow-sh-1"
                  >
                    <span className="font-mono text-[11px] tracking-[0.08em] text-ink-2 uppercase">
                      ← {t("appAnterior")}
                    </span>
                    <span className="mt-1 font-display text-[1.05rem] font-medium text-ink-0">
                      {anterior.export.app.nombre}
                    </span>
                  </Link>
                ) : (
                  <span />
                )}
                {siguiente && (
                  <Link
                    href={`/vitrina/${siguiente.ancla.slug}`}
                    className="flex min-h-11 flex-col justify-center rounded-[10px] border border-paper-2 bg-paper-0 px-5 py-4 transition-[box-shadow] duration-[180ms] hover:shadow-sh-1 sm:items-end sm:text-right"
                  >
                    <span className="font-mono text-[11px] tracking-[0.08em] text-ink-2 uppercase">
                      {t("appSiguiente")} →
                    </span>
                    <span className="mt-1 font-display text-[1.05rem] font-medium text-ink-0">
                      {siguiente.export.app.nombre}
                    </span>
                  </Link>
                )}
              </nav>
            </Reveal>
          )}

          {/* El anclaje del CTA de la ficha vive en ESTA página: el botón
              «avísame» de la ficha apunta a `#contacto-vitrina`, y si la
              sección no estuviera aquí el enlace no llevaría a ninguna parte. */}
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
