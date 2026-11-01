import type { Metadata } from "next";
import { hasLocale } from "next-intl";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { notFound } from "next/navigation";
import { PaginaBrochure } from "@/components/brochure/pagina-brochure";
import { Footer } from "@/components/footer";
import { Header } from "@/components/header";
import { Roadmap } from "@/components/home/roadmap";
import { Reveal } from "@/components/motion/reveal";
import { PropuestaForm } from "@/components/forms/propuesta-form";
import { FichaTecnica } from "@/components/vitrina/ficha-tecnica";
import { ListaDeEspera } from "@/components/vitrina/lista-de-espera";
import { Link } from "@/i18n/navigation";
import { routing, type Locale } from "@/i18n/routing";
import { SLUGS_CASA } from "@/lib/brochure/config";
import { entradaEsBrochure, metadataDeBrochure } from "@/lib/brochure/entrada";
import { getCategoriasApps, getCv } from "@/lib/content";
import { SITE_URL } from "@/lib/site";
import { ordenDeEscaparate } from "@/lib/vitrina/categorias-apps";
import {
  getFichaTecnica,
  getFichasTecnicas,
} from "@/lib/vitrina/ficha-tecnica/loader";
import { getFichasVitrina } from "@/lib/vitrina/loader";
import { getSimulacion } from "@/lib/vitrina/simulaciones-loader";
import { roadmapDe } from "@/lib/votes/roadmap";

/**
 * LA ENTRADA DE UNA APP — `/portafolio/apps/<slug>`.
 *
 * Desde el S30 («1b»: «Definitivamente los brochure van a remplazar las fichas»), app por app: la que
 * tiene su contenido v2 abre aquí su brochure completo, y la casa (CV Viva y su chat) también, siempre
 * (`src/lib/brochure/entrada.ts`). Las demás siguen con su FICHA TÉCNICA, la capa infografía (ADR-016):
 * titular · cifras · para quién · el proceso en BPMN · qué aporta · límites · dónde está, con su
 * brochure en `/portafolio/apps/<slug>/brochure` («Ver brochure»).
 *
 * 100% SSG: `generateStaticParams` cruza idiomas con los slugs de los exports y los de la casa.
 * La ficha se arma de export + complemento (`data/fichas/<slug>.yaml`) y si a
 * una app le falta el complemento, el build FALLA nombrándola.
 *
 * Cero enlaces (regla 16): los únicos destinos son rutas de este repo.
 */

export function generateStaticParams() {
  return routing.locales.flatMap((locale) =>
    [...getFichasVitrina().map((f) => f.ancla.slug), ...SLUGS_CASA].map(
      (app) => ({ locale, app }),
    ),
  );
}

type Params = { params: Promise<{ locale: string; app: string }> };

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const { locale, app } = await params;
  if (!hasLocale(routing.locales, locale)) return {};
  if (entradaEsBrochure(app)) return metadataDeBrochure(app, locale);
  const ft = getFichaTecnica(app);
  if (!ft) return {};
  const t = await getTranslations({ locale, namespace: "fichaTecnica" });

  return {
    metadataBase: new URL(SITE_URL),
    title: `${ft.pieza.nombre} — ${t("eyebrow")} — Henry Rincón`,
    description: ft.promesa.tagline,
    alternates: {
      languages: {
        es: `/es/portafolio/apps/${app}`,
        en: `/en/portafolio/apps/${app}`,
        "x-default": `/es/portafolio/apps/${app}`,
      },
    },
  };
}

export default async function FichaTecnicaAppPage({ params }: Params) {
  const { locale, app } = await params;
  if (!hasLocale(routing.locales, locale)) notFound();
  setRequestLocale(locale);
  const l = locale as Locale;
  if (entradaEsBrochure(app)) return <PaginaBrochure app={app} locale={l} />;

  const ft = getFichaTecnica(app);
  if (!ft) notFound();

  const cv = getCv(l);
  const categorias = getCategoriasApps();
  const t = await getTranslations("vitrina");
  // El roadmap votable de ESTA app (2026-09-13): cierre de plan que entrega la
  // planeadora en su complemento. Sin features, la sección no se monta.
  const roadmap = roadmapDe(app);

  // Vecinas en el orden del escaparate (profesionales, personales): el mismo
  // que el visitante acaba de ver en /portafolio/apps, no el del loader.
  const todas = ordenDeEscaparate(
    getFichasTecnicas(),
    (f) => f.pieza.slug,
    categorias,
  );
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
              href="/portafolio/apps"
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
            hrefBrochure={`/portafolio/apps/${app}/brochure`}
            hrefSimulacion={
              getSimulacion(app)
                ? `/portafolio/apps/${app}/simulacion`
                : undefined
            }
            listaDeEspera
          />

          {roadmap && <Roadmap apps={[roadmap]} embebido />}

          {/* Debajo del roadmap: «un espacio muy simple para proponer nuevas
              funcionalidades» (dueño, 2026-09-13). Llega por correo; nada se
              publica. Con volumen, el dueño evaluará hacerlas públicas y
              votables, con control de spam. */}
          <Reveal variant="fadeInUp">
            <div className="mt-8">
              <PropuestaForm app={app} nombreApp={ft.pieza.nombre} />
            </div>
          </Reveal>

          {/* El anclaje del botón «Avísame cuando abra» de la ficha vive en
              ESTA página, con la app ya elegida en el formulario. */}
          <ListaDeEspera appInicial={app} />

          {(anterior || siguiente) && (
            <Reveal variant="fadeInUp">
              <nav
                aria-label={t("vecinasEtiqueta")}
                className="mt-12 grid gap-3 border-t border-paper-2 pt-8 sm:grid-cols-2"
              >
                {anterior ? (
                  <Link
                    href={`/portafolio/apps/${anterior.pieza.slug}`}
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
                    href={`/portafolio/apps/${siguiente.pieza.slug}`}
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
