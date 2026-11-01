import "server-only";
import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import { cache } from "react";
import { entradasBrochure } from "../../../scripts/entradas-brochure.mjs";
import type { Locale } from "@/i18n/routing";
import { getCategoriasApps } from "@/lib/content";
import { SITE_URL } from "@/lib/site";
import { getCapturas, urlDeCapturas } from "@/lib/vitrina/capturas";
import { ordenDeEscaparate } from "@/lib/vitrina/categorias-apps";
import { getComplemento } from "@/lib/vitrina/ficha-tecnica/loader";
import { getFicha, getManifestVitrina } from "@/lib/vitrina/loader";
import { getSimulacion } from "@/lib/vitrina/simulaciones-loader";
import { getPiezaDeCasa } from "./casa";
import { getConfigDeApp } from "./config-loader";
import { getContenido } from "./contenido-loader";
import { armarTextosDeUsala, type TextosDeUsala } from "./usala-textos";
import {
  textoEnEspanol,
  type DatosDeUsala,
  type EntradaBrochure,
  type Textos,
} from "./modelo";

/**
 * EL BROCHURE COMO ENTRADA DE LA APP (S30, «1b»).
 *
 * Una app abre `/portafolio/apps/<app>` en su brochure cuando su contenido v2 llegó por copia, y la casa
 * siempre (`scripts/entradas-brochure.mjs`, medido del disco). Las demás siguen con su ficha y su brochure
 * en `/brochure`. Las dos rutas pintan el mismo brochure (`PaginaBrochure`) con lo que arma este módulo.
 */

export const getEntradasBrochure = cache(
  (): ReadonlySet<string> => new Set(entradasBrochure()),
);

export function entradaEsBrochure(slug: string): boolean {
  return getEntradasBrochure().has(slug);
}

/** Dónde vive el brochure de una app: su entrada, o su `/brochure` si sigue con ficha. */
export function rutaDelBrochure(slug: string): string {
  return entradaEsBrochure(slug)
    ? `/portafolio/apps/${slug}`
    : `/portafolio/apps/${slug}/brochure`;
}

export async function textosBrochure(locale: Locale): Promise<Textos> {
  const t = await getTranslations({ locale, namespace: "brochure" });
  return (clave, valores) => t(clave as never, valores as never);
}

/** Los textos de «Úsala» en el idioma de la página: los de la ficha, la lista de espera, el roadmap y la propuesta. */
export async function textosDeUsala(locale: Locale): Promise<TextosDeUsala> {
  const [vitrina, fichaTecnica, listaDeEspera, roadmap, propuesta] =
    await Promise.all(
      (
        ["vitrina", "fichaTecnica", "listaDeEspera", "roadmap", "propuesta"] as const
      ).map((namespace) => getTranslations({ locale, namespace })),
    );
  const por = { vitrina, fichaTecnica, listaDeEspera, roadmap, propuesta };
  return armarTextosDeUsala((ns) => (clave) => por[ns](clave as never));
}

/**
 * Lo que «Úsala» toma del Portafolio (S30): las apps del selector de la lista de espera y las vecinas, en
 * el orden del escaparate que el visitante acaba de ver (profesionales y después personales), y si la app
 * tiene su simulación. El nombre de cada una ya es el oficial (el alias se aplica al leer el export).
 */
export function datosDeUsala(app: string): DatosDeUsala {
  const orden = ordenDeEscaparate(
    getManifestVitrina(),
    (a) => a.slug,
    getCategoriasApps(),
  ).map((a) => ({ slug: a.slug, nombre: a.nombre }));
  const i = orden.findIndex((a) => a.slug === app);
  return {
    apps: orden,
    ...(i > 0 ? { anterior: orden[i - 1] } : {}),
    ...(i >= 0 && i < orden.length - 1 ? { siguiente: orden[i + 1] } : {}),
    simulacion: getSimulacion(app) !== undefined,
  };
}

/** Lo que el modelo necesita para armar el brochure de una app, o `undefined` si la app no existe. */
export async function entradaDe(
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
      // La casa también lee su v2 (S30): sin esto su contenido no podía copiarse.
      contenido: getContenido(app),
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
    usala: datosDeUsala(app),
  };
}

/** Título, descripción y hreflang del brochure, en la ruta donde vive. */
export async function metadataDeBrochure(
  app: string,
  locale: Locale,
): Promise<Metadata> {
  const t = await textosBrochure(locale);
  const e = await entradaDe(app, locale, t);
  if (!e) return {};
  const nombre = e.nombre ?? e.export.app.nombre;
  const ruta = rutaDelBrochure(app);
  return {
    metadataBase: new URL(SITE_URL),
    title: t("titulo", { nombre }),
    // El tagline del export es español: en una página inglesa sin su bloque `en` no es su descripción.
    description: textoEnEspanol(locale, e.contenido)
      ? t("descripcion", { nombre })
      : e.export.promesa.tagline,
    alternates: {
      languages: {
        es: `/es${ruta}`,
        en: `/en${ruta}`,
        "x-default": `/es${ruta}`,
      },
    },
  };
}
