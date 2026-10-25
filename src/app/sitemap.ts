import type { MetadataRoute } from "next";
import { routing } from "@/i18n/routing";
import { appsConBrochure } from "@/lib/brochure";
import { getCv } from "@/lib/content";
import { SITE_URL } from "@/lib/site";
import { FRENTE_PROPIO, getFrentes } from "@/lib/vitrina/categorias";
import { getManifestVitrina } from "@/lib/vitrina/loader";
import { getPiezasMetodo } from "@/lib/metodo/loader";
import { bloqueDe } from "@/lib/metodo/schema";
import { getSimulaciones } from "@/lib/vitrina/simulaciones-loader";
import { esFrente, getPiezas } from "@/lib/vitrina/piezas";

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
      url: `${SITE_URL}/${locale}/portafolio`,
      lastModified: new Date(),
      alternates: alternatesFor("/portafolio"),
    },
    {
      url: `${SITE_URL}/${locale}/portafolio/apps`,
      lastModified: new Date(),
      alternates: alternatesFor("/portafolio/apps"),
    },
    // «Métodos» (S10): la lista y cada publicación, desde data/metodo/ — una
    // pieza nueva entra al sitemap sola.
    // `lastmod` = la fecha de revisión de la pieza (bloque 10), no la del build: decir que
    // nueve publicaciones cambiaron en cada despliegue es ruido (S10-B18). La lista toma la
    // más reciente de sus piezas.
    {
      url: `${SITE_URL}/${locale}/metodos`,
      lastModified: new Date(
        getPiezasMetodo()
          .map((p) => bloqueDe(p, 10).revisado)
          .sort()
          .at(-1) ?? new Date(),
      ),
      alternates: alternatesFor("/metodos"),
    },
    ...getPiezasMetodo().map((p) => ({
      url: `${SITE_URL}/${locale}/metodos/${p.slug}`,
      lastModified: new Date(bloqueDe(p, 10).revisado),
      alternates: alternatesFor(`/metodos/${p.slug}`),
    })),
    // Por app: la ficha técnica (ADR-016) y su detalle.
    ...getManifestVitrina().flatMap((a) =>
      ["", "/detalle"].map((sub) => ({
        url: `${SITE_URL}/${locale}/portafolio/apps/${a.slug}${sub}`,
        lastModified: new Date(),
        alternates: alternatesFor(`/portafolio/apps/${a.slug}${sub}`),
      })),
    ),
    // Y su simulación, si la tiene (data/simulaciones.yaml, 2026-10-12).
    ...getSimulaciones().map((s) => ({
      url: `${SITE_URL}/${locale}/portafolio/apps/${s.slug}/simulacion`,
      lastModified: new Date(),
      alternates: alternatesFor(`/portafolio/apps/${s.slug}/simulacion`),
    })),
    // Cada frente que no es «apps» (que tiene su propia ruta arriba), esté
    // abierto o en preparación — y, si está abierto, TODAS sus piezas. Se lee
    // de `content/<frente>/`: una ficha nueva entra al sitemap sola.
    ...getFrentes()
      .filter((f) => f.id !== FRENTE_PROPIO)
      .flatMap((f) => [
        {
          url: `${SITE_URL}/${locale}/portafolio/${f.id}`,
          lastModified: new Date(),
          alternates: alternatesFor(`/portafolio/${f.id}`),
        },
        ...(f.estado === "abierta" && esFrente(f.id)
          ? getPiezas(f.id).map((p) => ({
              url: `${SITE_URL}/${locale}/portafolio/${f.id}/${p.pieza.slug}`,
              // La fecha que la ficha declara, no «ahora»: el contrato obliga a
              // `actualizado` y decir que 108 páginas cambiaron en cada build es
              // ruido en un repo cuya regla madre es que nada se afirma sin fuente.
              lastModified: new Date(p.actualizado),
              alternates: alternatesFor(`/portafolio/${f.id}/${p.pieza.slug}`),
            }))
          : []),
      ]),
  ]);

  return rutas;
}
