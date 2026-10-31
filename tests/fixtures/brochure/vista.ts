import { readFileSync } from "node:fs";
import { createTranslator } from "next-intl";
import { parse } from "yaml";
import { getCasa } from "@/lib/brochure/casa";
import { parseConfigBrochure } from "@/lib/brochure/config";
import { leerContenido } from "@/lib/brochure/contenido";
import {
  armarBrochure,
  type Locale,
  type Textos,
  type VistaBrochure,
} from "@/lib/brochure/modelo";
import { getCapturas, urlDeCapturas } from "@/lib/vitrina/capturas";
import { getComplemento } from "@/lib/vitrina/ficha-tecnica/loader";
import { getFichasVitrina } from "@/lib/vitrina/loader";

/**
 * LA VISTA DEL BROCHURE DE UNA APP REAL, como la arma la página (S28), para las pruebas que la
 * necesitan sin el servidor de Next: el modelo (`brochure-modelo`) y la forma del árbol con
 * movimiento reducido (`motion-estructura-reducida`).
 */

export const config = parseConfigBrochure(
  parse(readFileSync("data/brochure.yaml", "utf8")),
  "data/brochure.yaml",
);

export const mensajes = (l: Locale) =>
  JSON.parse(readFileSync(`messages/${l}.json`, "utf8"));

const contenidoDe = (slug: string) => {
  try {
    const r = leerContenido(
      JSON.parse(
        readFileSync(`content/vitrina/${slug}.contenido.json`, "utf8"),
      ),
    );
    return r.ok ? r.contenido : undefined;
  } catch {
    return undefined;
  }
};

/** Los textos del namespace `brochure` en un idioma. */
export function textosDe(locale: Locale): Textos {
  const t = createTranslator({
    locale,
    messages: mensajes(locale),
    namespace: "brochure",
  });
  return (k, v) => t(k as never, v as never);
}

export function vistaDe(slug: string, locale: Locale): VistaBrochure {
  const t = textosDe(locale);
  const pieza = getCasa().find((p) => p.slug === slug);
  if (pieza)
    return armarBrochure({
      slug,
      casa: true,
      locale,
      export: pieza.export,
      capturas: pieza.capturas,
      complemento: pieza.complemento,
      config: config.apps[slug]!,
      nombre: pieza.nombre[locale],
      urlCapturas: urlDeCapturas(slug),
      t,
    });
  const ficha = getFichasVitrina().find((f) => f.ancla.slug === slug)!;
  return armarBrochure({
    slug,
    casa: false,
    locale,
    export: ficha.export,
    capturas: getCapturas(slug)!,
    complemento: getComplemento(slug),
    contenido: contenidoDe(slug),
    config: config.apps[slug]!,
    urlCapturas: urlDeCapturas(slug),
    t,
  });
}
