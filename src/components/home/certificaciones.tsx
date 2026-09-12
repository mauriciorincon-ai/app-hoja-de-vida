import { getTranslations } from "next-intl/server";
import { Reveal } from "@/components/motion/reveal";
import { Stagger, StaggerItem } from "@/components/motion/stagger";
import type { Cv } from "@/lib/schemas";
import { IconoDeFormacion } from "./icono-formacion";

/**
 * Certificaciones (content pack §6): la de Microsoft (DP-600) lleva nota
 * editorial. AI-102 salió el 2026-09-10: Microsoft la descontinuó.
 * El enlace "Verificar" aparece solo cuando `verificacion:` tiene URL
 * ([AJUSTAR-LUEGO]: links Credly/Learn pendientes del dueño).
 *
 * Revisión post-S8: misma entrada lenta que Estudios, un icono monolínea por
 * dato, y el TERCER estado — `en curso` — con chip citron en el sitio de la
 * fecha (AI-103, decisión del dueño: «me gusta la sinceridad»).
 */
export async function Certificaciones({
  certificaciones,
}: {
  certificaciones: Cv["certificaciones"];
}) {
  const tNav = await getTranslations("nav");
  const t = await getTranslations("certificaciones");
  if (certificaciones.length === 0) return null;

  return (
    <section
      id="certificaciones"
      aria-labelledby="certificaciones-titulo"
      className="scroll-mt-16"
    >
      <div className="mx-auto max-w-5xl px-4 py-20 md:px-6 md:py-28">
        <Reveal variant="fadeInUp">
          <h2
            id="certificaciones-titulo"
            className="mb-14 font-display text-[clamp(1.75rem,3.5vw,2.5rem)] font-medium tracking-[-0.015em] text-ink-0"
          >
            {tNav("certificaciones")}
          </h2>
        </Reveal>
        <Stagger className="grid gap-6 md:grid-cols-2" stagger={0.14}>
          {certificaciones.map((cert) => (
            <StaggerItem key={cert.nombre} variant="fadeInSlow">
              <article
                data-certificacion-estado={cert.estado}
                className={`flex h-full flex-col gap-2 rounded-[10px] border border-paper-3 p-6 shadow-sh-1 ${
                  cert.nota ? "bg-paper-1" : "bg-paper-0"
                }`}
              >
                <div className="flex items-start justify-between gap-4">
                  <h3 className="flex items-start gap-2 text-base leading-snug font-semibold text-ink-0">
                    <IconoDeFormacion
                      nombre={cert.icono}
                      className="mt-[3px] shrink-0 text-ink-2"
                    />
                    {cert.nombre}
                  </h3>
                  {cert.estado === "en curso" ? (
                    <span className="shrink-0 rounded-full bg-citron px-2.5 py-1 font-mono text-[11px] tracking-[0.02em] text-citron-ink uppercase">
                      {t("enCurso")}
                    </span>
                  ) : (
                    <span className="shrink-0 font-mono text-[11px] tracking-[0.02em] text-ink-2 uppercase tabular-nums">
                      {cert.fecha}
                    </span>
                  )}
                </div>
                {cert.nota && (
                  <p className="text-sm leading-relaxed text-ink-2">
                    {cert.nota}
                  </p>
                )}
                {cert.verificacion && (
                  <a
                    href={cert.verificacion}
                    rel="noopener noreferrer"
                    target="_blank"
                    aria-label={`${t("verificar")} — ${cert.nombre}`}
                    className="mt-auto flex min-h-11 items-center gap-1 self-start font-mono text-[13px] text-ink-2 transition-colors duration-[120ms] hover:text-ink-0"
                  >
                    <span className="border-b border-dashed border-ink-3">
                      {t("verificar")}
                    </span>
                    <span aria-hidden="true">↗</span>
                  </a>
                )}
              </article>
            </StaggerItem>
          ))}
        </Stagger>
      </div>
    </section>
  );
}
