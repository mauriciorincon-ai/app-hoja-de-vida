import type { MetadataRoute } from "next";
import { routing } from "@/i18n/routing";
import { getCv } from "@/lib/content";
import { SITE_URL } from "@/lib/site";

/** HOME + /cv + case studies (data-driven: un slug nuevo entra solo). */
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
  ]);

  return rutas;
}
