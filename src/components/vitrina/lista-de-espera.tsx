import { getLocale, getTranslations } from "next-intl/server";
import { ListaDeEsperaForm } from "@/components/forms/lista-de-espera-form";
import { Reveal } from "@/components/motion/reveal";
import type { Locale } from "@/i18n/routing";
import { getCategoriasApps } from "@/lib/content";
import {
  nombreVisible,
  ordenDeEscaparate,
} from "@/lib/vitrina/categorias-apps";
import { getManifestVitrina } from "@/lib/vitrina/loader";

/**
 * El cierre de las páginas de APPS de la vitrina: la sección `#contacto-vitrina`
 * a la que apuntan los botones «Avísame cuando abra» de las fichas, con el
 * formulario de lista de espera adentro (antes mandaba al formulario general
 * de la HOME, que ya no lista apps). Solo las apps la tienen: es lo que
 * `listaDeEspera` declara por frente en `data/vitrina.yaml`.
 */
export async function ListaDeEspera({ appInicial }: { appInicial?: string }) {
  const t = await getTranslations("vitrina");
  const l = (await getLocale()) as Locale;
  const categorias = getCategoriasApps();
  // El rótulo del selector es el nombre oficial (alias, ADR-028); el valor que
  // viaja es el slug, y el correo sigue nombrando la app por su export.
  const apps = ordenDeEscaparate(
    getManifestVitrina(),
    (a) => a.slug,
    categorias,
  ).map((a) => ({
    slug: a.slug,
    nombre: nombreVisible(categorias, a.slug, a.nombre, l),
  }));

  return (
    <Reveal variant="fadeInUp">
      <section
        id="contacto-vitrina"
        aria-labelledby="vitrina-cierre"
        className="mt-14 scroll-mt-16 border-t border-paper-2 pt-10"
      >
        <div className="grid gap-8 md:grid-cols-[5fr_7fr] md:gap-12">
          <div>
            <h2
              id="vitrina-cierre"
              className="font-display text-2xl font-medium tracking-[-0.015em] text-ink-0"
            >
              {t("acceso")}
            </h2>
            <p className="mt-3 max-w-[46ch] text-[15px] leading-relaxed text-ink-1">
              {t("listaDeEsperaLinea")}
            </p>
            <p className="mt-2 max-w-[46ch] text-sm leading-relaxed text-ink-2">
              {t("anclajeNota")}
            </p>
          </div>
          <ListaDeEsperaForm apps={apps} appInicial={appInicial} />
        </div>
      </section>
    </Reveal>
  );
}
