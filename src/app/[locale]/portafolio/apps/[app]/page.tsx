import type { Metadata } from "next";
import { hasLocale } from "next-intl";
import { setRequestLocale } from "next-intl/server";
import { notFound } from "next/navigation";
import { PaginaBrochure } from "@/components/brochure/pagina-brochure";
import { routing, type Locale } from "@/i18n/routing";
import { SLUGS_CASA } from "@/lib/brochure/config";
import { metadataDeBrochure } from "@/lib/brochure/entrada";
import { getFichasVitrina } from "@/lib/vitrina/loader";

/**
 * LA ENTRADA DE UNA APP — `/portafolio/apps/<slug>`: su BROCHURE.
 *
 * Desde el S31 las diez apps del Portafolio y la casa (CV Viva y su chat) abren aquí su brochure
 * completo, sin interruptor y tengan o no su contenido v2 (desde el S30 «1b» lo hacían las que lo tenían:
 * «Definitivamente los brochure van a remplazar las fichas»). La ficha técnica (ADR-016) ya no es la
 * puerta de ninguna app: sigue solo en los agentes, las investigaciones y los tableros
 * (`[categoria]/[pieza]/page.tsx`). El `/brochure` y el `/detalle` de una app son un 301 a esta ruta
 * (`src/lib/redireccion.ts`).
 *
 * 100% SSG: `generateStaticParams` cruza idiomas con los slugs de los exports y los de la casa. Una app
 * que no existe es un 404 (`PaginaBrochure`).
 *
 * Cero enlaces (regla 17): los únicos destinos son rutas de este repo.
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
  return metadataDeBrochure(app, locale);
}

export default async function EntradaDeAppPage({ params }: Params) {
  const { locale, app } = await params;
  if (!hasLocale(routing.locales, locale)) notFound();
  setRequestLocale(locale);
  return <PaginaBrochure app={app} locale={locale as Locale} />;
}
