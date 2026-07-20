import { getLocale, getTranslations } from "next-intl/server";
import { Reveal } from "@/components/motion/reveal";
import type { AppConRoadmap } from "@/lib/votes/roadmap";
import { RoadmapVoting, type GrupoRoadmap } from "./roadmap-voting";

/**
 * Sección "Roadmap con votación" (S4). Server component: el encabezado y los
 * títulos/descripciones de cada feature nacen en el HTML estático (ATS/SEO); la
 * interacción (conteos reales + botones) vive en la isla client `RoadmapVoting`.
 * Los textos se resuelven al locale aquí y viajan como props serializables.
 */
export async function Roadmap({ apps }: { apps: AppConRoadmap[] }) {
  const t = await getTranslations("roadmap");
  const locale = (await getLocale()) as "es" | "en";

  const grupos: GrupoRoadmap[] = apps.map((app) => ({
    appId: app.id,
    appNombre: app.nombre[locale],
    features: app.roadmap.map((f) => ({
      app: app.id,
      feature: f.id,
      titulo: f.titulo[locale],
      descripcion: f.descripcion[locale],
    })),
  }));

  return (
    <section
      id="roadmap"
      aria-labelledby="roadmap-titulo"
      className="scroll-mt-16 bg-paper-0"
    >
      <div className="mx-auto max-w-5xl px-4 py-20 md:px-6 md:py-28">
        <Reveal variant="fadeInUp">
          <p className="mb-3 font-mono text-[11px] tracking-[0.08em] text-ink-3 uppercase">
            {t("eyebrow")}
          </p>
          <h2
            id="roadmap-titulo"
            className="mb-4 font-display text-[clamp(1.75rem,3.5vw,2.5rem)] font-medium tracking-[-0.015em] text-ink-0"
          >
            {t("titulo")}
          </h2>
          <p className="mb-14 max-w-[56ch] text-[15px] leading-relaxed text-ink-2">
            {t("subtitulo")}
          </p>
        </Reveal>
        <RoadmapVoting grupos={grupos} />
      </div>
    </section>
  );
}
