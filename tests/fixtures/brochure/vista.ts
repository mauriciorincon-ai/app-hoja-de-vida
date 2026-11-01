import { readFileSync } from "node:fs";
import { createTranslator } from "next-intl";
import { parse } from "yaml";
import { getCasa } from "@/lib/brochure/casa";
import { datosDeUsala } from "@/lib/brochure/entrada";
import { armarTextosDeUsala } from "@/lib/brochure/usala-textos";
import { parseConfigBrochure } from "@/lib/brochure/config";
import { leerContenido, type Contenido } from "@/lib/brochure/contenido";
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

const contenidoDe = (slug: string, casa = false) => {
  try {
    const r = leerContenido(
      JSON.parse(
        readFileSync(
          `content/vitrina/${casa ? "casa/" : ""}${slug}.contenido.json`,
          "utf8",
        ),
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

/** Los textos de «Úsala» (los de la ficha, la lista de espera, el roadmap y la propuesta) en un idioma. */
export const textosDeUsalaDe = (locale: Locale) => {
  const m = mensajes(locale);
  return armarTextosDeUsala((namespace) => {
    const t = createTranslator({ locale, messages: m, namespace });
    return (clave) => t(clave as never);
  });
};

/**
 * `cambia` recibe el contenido v2 que la app tenga (o `undefined`) y devuelve el que se usa: así una
 * prueba del modelo varía un campo sin escribir un archivo.
 */
export function vistaDe(
  slug: string,
  locale: Locale,
  cambia: (c?: Contenido) => Contenido | undefined = (c) => c,
): VistaBrochure {
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
      contenido: cambia(contenidoDe(slug, true)),
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
    contenido: cambia(contenidoDe(slug)),
    config: config.apps[slug]!,
    urlCapturas: urlDeCapturas(slug),
    usala: datosDeUsala(slug),
    t,
  });
}
