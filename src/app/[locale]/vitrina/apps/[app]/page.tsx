import type { Metadata } from "next";
import { hasLocale } from "next-intl";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { notFound } from "next/navigation";
import { Footer } from "@/components/footer";
import { Header } from "@/components/header";
import { Reveal } from "@/components/motion/reveal";
import { FichaTecnica } from "@/components/vitrina/ficha-tecnica";
import { Link } from "@/i18n/navigation";
import { routing, type Locale } from "@/i18n/routing";
import { getCv } from "@/lib/content";
import { SITE_URL } from "@/lib/site";
import {
  getFichaTecnica,
  getFichasTecnicas,
} from "@/lib/vitrina/ficha-tecnica/loader";
import { getFichasVitrina } from "@/lib/vitrina/loader";

/**
 * LA FICHA TÉCNICA DE UNA APP — la capa infografía (ADR-016).
 *
 * `/vitrina/apps/<slug>` es ahora lo primero que se ve de una app: la
 * infografía de dos minutos (titular · cifras · para quién · el proceso en
 * BPMN · qué tiene · límites · dónde está). El detalle que construyó el S5
 * bajó un nivel, a `/vitrina/apps/<slug>/detalle`, y se llega con el botón
 * «Ver la ficha completa».
 *
 * 100% SSG: `generateStaticParams` cruza idiomas con los slugs de los exports.
 * La ficha se arma de export + complemento (`data/fichas/<slug>.yaml`) y si a
 * una app le falta el complemento, el build FALLA nombrándola.
 *
 * Cero enlaces (regla 16): los únicos destinos son rutas de este repo.
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
  const ft = getFichaTecnica(app);
  if (!ft) return {};
  const t = await getTranslations({ locale, namespace: "fichaTecnica" });

  return {
    metadataBase: new URL(SITE_URL),
    title: `${ft.pieza.nombre} — ${t("eyebrow")} — Henry Rincón`,
    description: ft.promesa.tagline,
    alternates: {
      languages: {
        es: `/es/vitrina/apps/${app}`,
        en: `/en/vitrina/apps/${app}`,
        "x-default": `/es/vitrina/apps/${app}`,
      },
    },
  };
}

export default async function FichaTecnicaAppPage({ params }: Params) {
  const { locale, app } = await params;
  if (!hasLocale(routing.locales, locale)) notFound();
  setRequestLocale(locale);

  const ft = getFichaTecnica(app);
  if (!ft) notFound();

  const l = locale as Locale;
  const cv = getCv(l);
  const t = await getTranslations("vitrina");

  // Vecinas en el orden del escaparate.
  const todas = getFichasTecnicas();
  const i = todas.findIndex((f) => f.pieza.slug === app);
  const anterior = todas[i - 1];
  const siguiente = todas[i + 1];

  return (
    <>
      <Header nombre={cv.identidad.nombre} enHome={false} />
      <main id="contenido" className="flex-1">
        <div className="mx-auto max-w-5xl px-4 py-10 md:px-6 md:py-14">
          <nav aria-label={t("migaEtiqueta")} className="mb-8">
            <Link
              href="/vitrina/apps"
              className="inline-flex min-h-11 items-center gap-2 font-mono text-[11px] tracking-[0.08em] text-ink-2 uppercase hover:text-ink-0"
            >
              <span aria-hidden="true">←</span>
              {t("volverApps")}
            </Link>
          </nav>

          {/* Nace visible: es el contenido de la ruta (patrón lcp-nace-estatico). */}
          <FichaTecnica
            datos={ft}
            locale={l}
            hrefDetalle={`/vitrina/apps/${app}/detalle`}
          />

          {(anterior || siguiente) && (
            <Reveal variant="fadeInUp">
              <nav
                aria-label={t("vecinasEtiqueta")}
                className="mt-12 grid gap-3 border-t border-paper-2 pt-8 sm:grid-cols-2"
              >
                {anterior ? (
                  <Link
                    href={`/vitrina/apps/${anterior.pieza.slug}`}
                    className="flex min-h-11 flex-col justify-center rounded-[10px] border border-paper-2 bg-paper-0 px-5 py-4 transition-[box-shadow] duration-[180ms] hover:shadow-sh-1"
                  >
                    <span className="font-mono text-[11px] tracking-[0.08em] text-ink-2 uppercase">
                      ← {t("appAnterior")}
                    </span>
                    <span className="mt-1 font-display text-[1.05rem] font-medium text-ink-0">
                      {anterior.pieza.nombre}
                    </span>
                  </Link>
                ) : (
                  <span />
                )}
                {siguiente && (
                  <Link
                    href={`/vitrina/apps/${siguiente.pieza.slug}`}
                    className="flex min-h-11 flex-col justify-center rounded-[10px] border border-paper-2 bg-paper-0 px-5 py-4 transition-[box-shadow] duration-[180ms] hover:shadow-sh-1 sm:items-end sm:text-right"
                  >
                    <span className="font-mono text-[11px] tracking-[0.08em] text-ink-2 uppercase">
                      {t("appSiguiente")} →
                    </span>
                    <span className="mt-1 font-display text-[1.05rem] font-medium text-ink-0">
                      {siguiente.pieza.nombre}
                    </span>
                  </Link>
                )}
              </nav>
            </Reveal>
          )}
        </div>
      </main>
      <Footer identidad={cv.identidad} />
    </>
  );
}
