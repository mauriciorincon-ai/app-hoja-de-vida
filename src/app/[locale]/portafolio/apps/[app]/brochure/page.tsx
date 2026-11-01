import type { Metadata } from "next";
import { hasLocale } from "next-intl";
import { setRequestLocale } from "next-intl/server";
import { notFound } from "next/navigation";
import { PaginaBrochure } from "@/components/brochure/pagina-brochure";
import { routing, type Locale } from "@/i18n/routing";
import { entradaEsBrochure, metadataDeBrochure } from "@/lib/brochure/entrada";
import { getFichasVitrina } from "@/lib/vitrina/loader";

/**
 * EL BROCHURE DE UNA APP QUE SIGUE CON SU FICHA — `/portafolio/apps/<slug>/brochure` (S28, ADR-030).
 *
 * Una sola plantilla para las doce (las diez apps del Portafolio y las dos de la casa). Desde el S30 el
 * brochure es la ENTRADA de una app con su contenido v2 y de la casa (`/portafolio/apps/<slug>`), y su
 * `/brochure` responde un 301 a ella desde el proxy (`src/lib/redireccion.ts`): aquí solo quedan las que
 * siguen con su ficha. 100 % SSG; ninguna otra ruta existe (`dynamicParams = false`).
 *
 * **Cero enlaces** (regla 17): ni la app ni su repositorio.
 */

export const dynamicParams = false;

const slugs = () =>
  getFichasVitrina()
    .map((f) => f.ancla.slug)
    .filter((s) => !entradaEsBrochure(s));

export function generateStaticParams() {
  return routing.locales.flatMap((locale) =>
    slugs().map((app) => ({ locale, app })),
  );
}

type Params = { params: Promise<{ locale: string; app: string }> };

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const { locale, app } = await params;
  if (!hasLocale(routing.locales, locale)) return {};
  return metadataDeBrochure(app, locale);
}

export default async function BrochurePage({ params }: Params) {
  const { locale, app } = await params;
  if (!hasLocale(routing.locales, locale)) notFound();
  setRequestLocale(locale);
  return <PaginaBrochure app={app} locale={locale as Locale} />;
}
