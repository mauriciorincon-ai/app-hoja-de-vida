import { NextIntlClientProvider } from "next-intl";
import { getMessages } from "next-intl/server";
import { notFound } from "next/navigation";
import { BrochureInteractivo } from "@/components/brochure/brochure-interactivo";
import { Brochure } from "@/components/brochure/brochure";
import { Buscador } from "@/components/brochure/buscador";
import { BrochureVisitTracker } from "@/components/brochure-visit-tracker";
import { Footer } from "@/components/footer";
import { Header } from "@/components/header";
import type { Locale } from "@/i18n/routing";
import {
  entradaDe,
  textosBrochure,
  textosDeUsala,
} from "@/lib/brochure/entrada";
import { armarBrochure } from "@/lib/brochure/modelo";
import { rutaEnIdioma } from "@/lib/brochure/ruta";
import { getCv } from "@/lib/content";

/**
 * La página del brochure de una app, la misma en sus dos rutas (S30): la entrada
 * (`/portafolio/apps/<app>`) de las que abren en él, y `/brochure` de las que siguen con ficha.
 * Todo el texto está en el HTML; las islas solo le dan comportamiento.
 */
export async function PaginaBrochure({
  app,
  locale,
}: {
  app: string;
  locale: Locale;
}) {
  const t = await textosBrochure(locale);
  const e = await entradaDe(app, locale, t);
  if (!e) notFound();
  const v = armarBrochure(e);
  const usala = await textosDeUsala(locale);
  const cv = getCv(locale);

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
          href={(destino) => rutaEnIdioma(locale, destino)}
          usala={usala}
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
