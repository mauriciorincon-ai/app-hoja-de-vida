import type { MetadataRoute } from "next";
import { routing } from "@/i18n/routing";
import { appsConBrochure } from "@/lib/brochure";
import { getCv } from "@/lib/content";
import { SITE_URL } from "@/lib/site";
import { getFrentes } from "@/lib/vitrina/categorias";
import { getManifestVitrina } from "@/lib/vitrina/loader";
import { getPiezas, type Frente } from "@/lib/vitrina/piezas";

/** HOME + /cv + case studies + brochures + vitrina por frentes (data-driven: una ruta nueva entra sola). */
export default function sitemap(): MetadataRoute.Sitemap {
  const alternatesFor = (path: string) => ({
    languages: Object.fromEntries(
      routing.locales.map((l) => [l, `${SITE_URL}/${l}${path}`]),
    ),
  });

  const rutas: MetadataRoute.Sitemap = routing.locales.flatMap((locale) => [
    {
      url: `${SITE_URL}/${locale}`,
      lastModified: new Date(),
      alternates: alternatesFor(""),
    },
    {
      url: `${SITE_URL}/${locale}/cv`,
      lastModified: new Date(),
      alternates: alternatesFor("/cv"),
    },
    ...getCv(locale)
      .proyectos.filter((p) => p.casestudy)
      .map((p) => ({
        url: `${SITE_URL}/${locale}/proyectos/${p.slug}`,
        lastModified: new Date(),
        alternates: alternatesFor(`/proyectos/${p.slug}`),
      })),
    ...appsConBrochure().map((app) => ({
      url: `${SITE_URL}/${locale}/apps/${app.id}`,
      lastModified: new Date(),
      alternates: alternatesFor(`/apps/${app.id}`),
    })),
    // La vitrina (ADR-015): el portal, el escaparate de apps, cada app con su
    // ruta propia y los frentes en preparación — todo entra solo desde los
    // exports y de data/vitrina.yaml.
    {
      url: `${SITE_URL}/${locale}/vitrina`,
      lastModified: new Date(),
      alternates: alternatesFor("/vitrina"),
    },
    {
      url: `${SITE_URL}/${locale}/vitrina/apps`,
      lastModified: new Date(),
      alternates: alternatesFor("/vitrina/apps"),
    },
    // Por app: la ficha técnica (ADR-016) y su detalle.
    ...getManifestVitrina().flatMap((a) =>
      ["", "/detalle"].map((sub) => ({
        url: `${SITE_URL}/${locale}/vitrina/apps/${a.slug}${sub}`,
        lastModified: new Date(),
        alternates: alternatesFor(`/vitrina/apps/${a.slug}${sub}`),
      })),
    ),
    // Cada frente que no es «apps» (que tiene su propia ruta arriba), esté
    // abierto o en preparación — y, si está abierto, TODAS sus piezas. Se lee
    // de `content/<frente>/`: una ficha nueva entra al sitemap sola.
    ...getFrentes()
      .filter((f) => f.id !== "apps")
      .flatMap((f) => [
        {
          url: `${SITE_URL}/${locale}/vitrina/${f.id}`,
          lastModified: new Date(),
          alternates: alternatesFor(`/vitrina/${f.id}`),
        },
        ...(f.estado === "abierta"
          ? getPiezas(f.id as Frente).map((p) => ({
              url: `${SITE_URL}/${locale}/vitrina/${f.id}/${p.pieza.slug}`,
              lastModified: new Date(),
              alternates: alternatesFor(`/vitrina/${f.id}/${p.pieza.slug}`),
            }))
          : []),
      ]),
  ]);

  return rutas;
}
