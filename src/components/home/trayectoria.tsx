import { getTranslations } from "next-intl/server";
import { Reveal } from "@/components/motion/reveal";
import { TimelineTrack } from "@/components/motion/timeline-track";
import type { Cv } from "@/lib/schemas";

/**
 * La trayectoria: el índice que baja contigo (ver `TimelineTrack`). Desde la
 * revisión post-S7 cada hito con case study lo enlaza aquí — la sección
 * «Proyectos» dejó la HOME y esta es la puerta a cada historia completa.
 */
export async function Trayectoria({
  trayectoria,
  proyectos,
}: {
  trayectoria: Cv["trayectoria"];
  proyectos: Cv["proyectos"];
}) {
  const t = await getTranslations("nav");
  // Labels del disclosure por props: el namespace no viaja al bundle cliente
  const tTimeline = await getTranslations("timeline");
  const conDetalle = new Set(
    proyectos.filter((p) => p.casestudy).map((p) => p.slug),
  );
  const items = trayectoria.map((h) => ({
    ...h,
    hrefCaseStudy:
      h.proyecto && conDetalle.has(h.proyecto)
        ? `/proyectos/${h.proyecto}`
        : undefined,
  }));

  return (
    <section
      id="trayectoria"
      aria-labelledby="trayectoria-titulo"
      className="scroll-mt-16"
    >
      <div className="mx-auto max-w-5xl px-4 py-20 md:px-6 md:py-28">
        <Reveal variant="fadeInUp">
          <h2
            id="trayectoria-titulo"
            className="mb-14 font-display text-[clamp(1.75rem,3.5vw,2.5rem)] font-medium tracking-[-0.015em] text-ink-0"
          >
            {t("trayectoria")}
          </h2>
        </Reveal>
        <TimelineTrack
          items={items}
          labels={{
            verMas: tTimeline("verMas"),
            verMenos: tTimeline("verMenos"),
            verCaseStudy: tTimeline("verCaseStudy"),
            indiceAria: tTimeline("indiceAria"),
          }}
        />
      </div>
    </section>
  );
}
