import type { MetadataRoute } from "next";
import { routing } from "@/i18n/routing";
import { appsConBrochure } from "@/lib/brochure";
import { getCv } from "@/lib/content";
import { SITE_URL } from "@/lib/site";
import { getManifestVitrina } from "@/lib/vitrina/loader";

/** HOME + /cv + case studies + brochures + vitrina (data-driven: una ruta nueva entra sola). */
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
    {
      url: `${SITE_URL}/${locale}/vitrina`,
      lastModified: new Date(),
      alternates: alternatesFor("/vitrina"),
    },
    // Cada app hermana con su ruta propia: entran solas desde los exports.
    ...getManifestVitrina().map((a) => ({
      url: `${SITE_URL}/${locale}/vitrina/${a.slug}`,
      lastModified: new Date(),
      alternates: alternatesFor(`/vitrina/${a.slug}`),
    })),
  ]);

  return rutas;
}
