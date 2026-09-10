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
/**
 * Desde la revisión post-S7 el roadmap NO vive en la HOME: es una pregunta
 * sobre las apps («qué viene») y se contesta donde están las apps — al pie
 * del escaparate de la vitrina. `embebido` lo pinta como un bloque más de esa
 * página (sin su propio contenedor a todo el ancho). Los ids, los
 * `data-testid` y la isla de votación son los mismos: solo cambió de casa.
 */
export async function Roadmap({
  apps,
  embebido = false,
}: {
  apps: AppConRoadmap[];
  embebido?: boolean;
}) {
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

  const cuerpo = (
    <>
      <Reveal variant="fadeInUp">
        <p className="mb-3 font-mono text-[11px] tracking-[0.08em] text-ink-2 uppercase">
          {t("eyebrow")}
        </p>
        <h2
          id="roadmap-titulo"
          className={`mb-4 font-display font-medium tracking-[-0.015em] text-ink-0 ${
            embebido ? "text-2xl" : "text-[clamp(1.75rem,3.5vw,2.5rem)]"
          }`}
        >
          {t("titulo")}
        </h2>
        <p
          className={`max-w-[56ch] text-[15px] leading-relaxed text-ink-2 ${embebido ? "mb-8" : "mb-14"}`}
        >
          {t("subtitulo")}
        </p>
      </Reveal>
      <RoadmapVoting grupos={grupos} />
    </>
  );

  if (embebido) {
    return (
      <section
        id="roadmap"
        aria-labelledby="roadmap-titulo"
        className="mt-14 scroll-mt-16 border-t border-paper-2 pt-10"
      >
        {cuerpo}
      </section>
    );
  }

  return (
    <section
      id="roadmap"
      aria-labelledby="roadmap-titulo"
      className="scroll-mt-16 bg-paper-0"
    >
      <div className="mx-auto max-w-5xl px-4 py-20 md:px-6 md:py-28">
        {cuerpo}
      </div>
    </section>
  );
}
