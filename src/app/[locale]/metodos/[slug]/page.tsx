import type { Metadata } from "next";
import { hasLocale } from "next-intl";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { notFound } from "next/navigation";
import { Footer } from "@/components/footer";
import { Header } from "@/components/header";
import { Infografia } from "@/components/metodo/infografia";
import { Link } from "@/i18n/navigation";
import { routing, type Locale } from "@/i18n/routing";
import { getCv } from "@/lib/content";
import { getPiezaMetodo, getPiezasMetodo } from "@/lib/metodo/loader";
import { bloqueDe } from "@/lib/metodo/schema";
import { SITE_URL } from "@/lib/site";

/**
 * UNA PUBLICACIÓN DE «MÉTODOS» — `/metodos/<slug>` (S10; S14: antes «Mi método»).
 *
 * 100% SSG: `generateStaticParams` cruza idiomas con las piezas de
 * `data/metodo/`, y `dynamicParams = false` manda a 404 cualquier otro slug.
 * Un solo renderizador (`Infografia`) para las nueve piezas: lo específico de
 * un tema es su dato, no esta ruta.
 *
 * Impresión: la cabecera y el pie se ocultan (`print:hidden`, como `/cv`) y la
 * hoja de estilo mantiene cada tarjeta entera; la pieza cabe en PDF desde el
 * navegador, en A4 y en carta. JSON-LD `Article` con la fecha de la última
 * revisión como `dateModified`.
 */

export const dynamicParams = false;

export function generateStaticParams() {
  return routing.locales.flatMap((locale) =>
    getPiezasMetodo().map((p) => ({ locale, slug: p.slug })),
  );
}

type Params = { params: Promise<{ locale: string; slug: string }> };

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const { locale, slug } = await params;
  if (!hasLocale(routing.locales, locale)) return {};
  const pieza = getPiezaMetodo(slug);
  if (!pieza) return {};
  const l = locale as Locale;
  const ruta = `/metodos/${slug}`;

  return {
    metadataBase: new URL(SITE_URL),
    title: `${pieza.nombre[l]} — Henry Rincón`,
    description: bloqueDe(pieza, 1).pregunta[l],
    alternates: {
      languages: {
        es: `/es${ruta}`,
        en: `/en${ruta}`,
        "x-default": `/es${ruta}`,
      },
    },
  };
}

export default async function InfografiaPage({ params }: Params) {
  const { locale, slug } = await params;
  if (!hasLocale(routing.locales, locale)) notFound();
  setRequestLocale(locale);

  const pieza = getPiezaMetodo(slug);
  if (!pieza) notFound();

  const l = locale as Locale;
  const cv = getCv(l);
  const t = await getTranslations("metodo");

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: pieza.nombre[l],
    inLanguage: l,
    dateModified: bloqueDe(pieza, 10).revisado,
    author: { "@type": "Person", name: cv.identidad.nombre },
    mainEntityOfPage: `${SITE_URL}/${l}/metodos/${slug}`,
  };

  return (
    <>
      <div className="print:hidden">
        <Header nombre={cv.identidad.nombre} enHome={false} />
      </div>
      <main id="contenido" className="flex-1">
        <div className="mx-auto max-w-5xl px-4 py-10 md:px-6 md:py-14 print:py-0">
          <nav aria-label={t("migaEtiqueta")} className="mb-8 print:hidden">
            <Link
              href="/metodos"
              className="inline-flex min-h-11 items-center gap-2 font-mono text-[11px] tracking-[0.08em] text-ink-2 uppercase hover:text-ink-0"
            >
              <span aria-hidden="true">←</span>
              {t("volver")}
            </Link>
          </nav>

          <Infografia pieza={pieza} locale={l} />
        </div>
      </main>
      <div className="print:hidden">
        <Footer identidad={cv.identidad} />
      </div>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(jsonLd).replace(/</g, "\\u003c"),
        }}
      />
    </>
  );
}
