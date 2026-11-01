import { getTranslations } from "next-intl/server";
import { ListaDeEsperaForm } from "@/components/forms/lista-de-espera-form";
import { Reveal } from "@/components/motion/reveal";
import { getCategoriasApps } from "@/lib/content";
import { ordenDeEscaparate } from "@/lib/vitrina/categorias-apps";
import { getManifestVitrina } from "@/lib/vitrina/loader";

/**
 * El cierre del escaparate de APPS (`/portafolio/apps`): la sección `#contacto-portafolio` a la que apunta
 * «Lista de espera» del portal, con el formulario de lista de espera adentro. Solo las apps la tienen: es lo que
 * `listaDeEspera` declara por frente en `data/vitrina.yaml`. Desde el S31 la página de cada app no la monta: su
 * brochure cierra con «Úsala», que trae el mismo formulario con la app ya elegida.
 */
export async function ListaDeEspera() {
  const t = await getTranslations("vitrina");
  const categorias = getCategoriasApps();
  // El selector sigue el orden del escaparate; el nombre ya es el oficial.
  const apps = ordenDeEscaparate(
    getManifestVitrina(),
    (a) => a.slug,
    categorias,
  ).map((a) => ({ slug: a.slug, nombre: a.nombre }));

  return (
    <Reveal variant="fadeInUp">
      <section
        id="contacto-portafolio"
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
          <ListaDeEsperaForm apps={apps} />
        </div>
      </section>
    </Reveal>
  );
}
