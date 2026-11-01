import type { Metadata } from "next";
import { hasLocale, NextIntlClientProvider } from "next-intl";
import {
  getMessages,
  getTranslations,
  setRequestLocale,
} from "next-intl/server";
import { notFound } from "next/navigation";
import { BrochureInteractivo } from "@/components/brochure/brochure-interactivo";
import { Brochure } from "@/components/brochure/brochure";
import { Buscador } from "@/components/brochure/buscador";
import { BrochureVisitTracker } from "@/components/brochure-visit-tracker";
import { Footer } from "@/components/footer";
import { Header } from "@/components/header";
import { routing, type Locale } from "@/i18n/routing";
import { getPiezaDeCasa } from "@/lib/brochure/casa";
import { SLUGS_CASA } from "@/lib/brochure/config";
import { getConfigDeApp } from "@/lib/brochure/config-loader";
import { getContenido } from "@/lib/brochure/contenido-loader";
import {
  armarBrochure,
  textoEnEspanol,
  type EntradaBrochure,
  type Textos,
} from "@/lib/brochure/modelo";
import { getCv } from "@/lib/content";
import { SITE_URL } from "@/lib/site";
import { getCapturas, urlDeCapturas } from "@/lib/vitrina/capturas";
import { getComplemento } from "@/lib/vitrina/ficha-tecnica/loader";
import { getFicha, getFichasVitrina } from "@/lib/vitrina/loader";

/**
 * EL BROCHURE DE UNA APP — `/portafolio/apps/<slug>/brochure` (S28, ADR-030).
 *
 * Una sola plantilla para las doce: las diez apps del Portafolio y las dos de la casa (CV Viva y su
 * chat). 100 % SSG: `generateStaticParams` cruza los dos idiomas con los slugs del loader y los de la
 * casa, y ninguna otra ruta existe (`dynamicParams = false`). Todo el texto está en el HTML; la isla
 * solo le da comportamiento.
 *
 * **Cero enlaces** (regla 17): ni la app ni su repositorio. El cierre lleva a la lista de espera de la
 * ficha técnica (las diez) o al contacto de este sitio (la casa).
 */

export const dynamicParams = false;

const slugs = () => [
  ...getFichasVitrina().map((f) => f.ancla.slug),
  ...SLUGS_CASA,
];

export function generateStaticParams() {
  return routing.locales.flatMap((locale) =>
    slugs().map((app) => ({ locale, app })),
  );
}

type Params = { params: Promise<{ locale: string; app: string }> };

async function entradaDe(
  app: string,
  locale: Locale,
  t: Textos,
): Promise<EntradaBrochure | undefined> {
  const comun = {
    slug: app,
    locale,
    config: getConfigDeApp(app),
    urlCapturas: urlDeCapturas(app),
    t,
  };
  const casa = getPiezaDeCasa(app);
  if (casa)
    return {
      ...comun,
      casa: true,
      export: casa.export,
      capturas: casa.capturas,
      complemento: casa.complemento,
      nombre: casa.nombre[locale],
    };
  const ficha = getFicha(app);
  const capturas = getCapturas(app);
  if (!ficha || !capturas) return undefined;
  return {
    ...comun,
    casa: false,
    export: ficha.export,
    capturas,
    complemento: getComplemento(app),
    contenido: getContenido(app),
  };
}

const textosDe = async (locale: Locale): Promise<Textos> => {
  const t = await getTranslations({ locale, namespace: "brochure" });
  return (clave, valores) => t(clave as never, valores as never);
};

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const { locale, app } = await params;
  if (!hasLocale(routing.locales, locale)) return {};
  const t = await textosDe(locale);
  const e = await entradaDe(app, locale, t);
  if (!e) return {};
  const nombre = e.nombre ?? e.export.app.nombre;
  return {
    metadataBase: new URL(SITE_URL),
    title: t("titulo", { nombre }),
    // El tagline del export es español: en una página inglesa sin su bloque `en` no es su descripción.
    description: textoEnEspanol(locale, e.contenido)
      ? t("descripcion", { nombre })
      : e.export.promesa.tagline,
    alternates: {
      languages: {
        es: `/es/portafolio/apps/${app}/brochure`,
        en: `/en/portafolio/apps/${app}/brochure`,
        "x-default": `/es/portafolio/apps/${app}/brochure`,
      },
    },
  };
}

export default async function BrochurePage({ params }: Params) {
  const { locale, app } = await params;
  if (!hasLocale(routing.locales, locale)) notFound();
  setRequestLocale(locale);
  const l = locale as Locale;
  const t = await textosDe(l);
  const e = await entradaDe(app, l, t);
  if (!e) notFound();
  const v = armarBrochure(e);
  const cv = getCv(l);

  // El buscador es la única isla con textos propios: solo los suyos viajan al cliente.
  const todos = (await getMessages({ locale })) as {
    brochure: Record<string, string>;
  };
  const delBuscador = Object.fromEntries(
    [
      "resN",
      "res0",
      "tipoResF",
      "tipoResFi",
      "tipoResN",
      "tipoResS",
      "tipoResX",
    ].map((k) => [k, todos.brochure[k]]),
  );

  return (
    <>
      <Header nombre={cv.identidad.nombre} enHome={false} sinImprimir />
      <main id="contenido" className="flex-1">
        <Brochure
          v={v}
          t={t}
          href={(destino) => `/${l}${destino}`}
          buscador={
            <NextIntlClientProvider messages={{ brochure: delBuscador }}>
              <Buscador ph={v.buscarPh} etiqueta={t("buscar")} />
            </NextIntlClientProvider>
          }
        />
        <BrochureInteractivo slug={app} />
        <BrochureVisitTracker app={app} />
      </main>
      <div data-b-no-imprimir="">
        <Footer identidad={cv.identidad} />
      </div>
    </>
  );
}
