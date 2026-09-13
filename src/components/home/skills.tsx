import { getTranslations } from "next-intl/server";
import { Reveal } from "@/components/motion/reveal";
import { Stagger, StaggerItem } from "@/components/motion/stagger";
import type { Cv } from "@/lib/schemas";
import {
  ESCALON_CHIP_S,
  ESCALON_SKILLS_S,
  IconoSkill,
  RETRASO_CABECERA_S,
} from "./skills-iconos";

/**
 * Skills (revisión post-S7): una tarjeta por grupo, con su icono dibujado en
 * casa —el trazo se termina de dibujar al llegar la tarjeta— y los ítems como
 * chips que entran escalonados. Cuatro grupos, cuatro tarjetas, una rejilla.
 *
 * Lo que NO hay, a propósito: barras de porcentaje ni «nivel de dominio». Un
 * 80 % de Python no significa nada y nadie lo puede medir; lo que aparece es
 * lo que se sabe hacer, y la trayectoria es la prueba.
 *
 * Revisión post-S8 — «más impactante, pero elegante», segunda vuelta («no lo
 * veo»): tres momentos que se DISTINGUEN, no tres capas que se pisan. La
 * tarjeta ATERRIZA VACÍA (`liftIn`: 70 px, 14° de perspectiva, 1,4 s
 * ease-in-out, 200 ms de escalón) → a los 0,8 s, cuando ya se ve, aparece la
 * cabecera (icono y título) y el trazo del icono se dibuja → los chips caen
 * uno a uno detrás, con 100 ms entre ellos, que es un escalón que el ojo
 * separa. La partitura interna la orquesta LA TARJETA (`hijos` en su
 * `StaggerItem`: `delayChildren` + `staggerChildren`), y así cada tarjeta
 * arrastra a los suyos con su propio escalón — la cuarta no recibe sus chips
 * antes de aterrizar. No es un `Stagger` anidado ni un `delay` por ítem: las
 * dos cosas congelan al nieto (ver `StaggerItem`). Todo transform/opacity/
 * filter; con reducción de movimiento, quieto.
 */
export async function Skills({ skills }: { skills: Cv["skills"] }) {
  const tNav = await getTranslations("nav");
  const t = await getTranslations("skills");
  if (skills.length === 0) return null;

  return (
    <section
      id="skills"
      aria-labelledby="skills-titulo"
      className="scroll-mt-16"
    >
      <div className="mx-auto max-w-5xl px-4 py-20 md:px-6 md:py-28">
        <Reveal variant="fadeInUp">
          <h2
            id="skills-titulo"
            className="font-display text-[clamp(1.75rem,3.5vw,2.5rem)] font-medium tracking-[-0.015em] text-ink-0"
          >
            {tNav("skills")}
          </h2>
          <p className="mt-4 mb-12 max-w-[60ch] text-[16px] leading-[1.75] text-ink-1">
            {t("linea")}
          </p>
        </Reveal>
        <Stagger
          className="grid gap-5 md:grid-cols-2"
          stagger={ESCALON_SKILLS_S}
        >
          {skills.map((grupo, i) => (
            <StaggerItem
              key={grupo.grupo}
              variant="liftIn"
              className="h-full"
              hijos={{ delay: RETRASO_CABECERA_S, escalon: ESCALON_CHIP_S }}
            >
              <article
                data-skill-grupo={i}
                className="skill-tarjeta flex h-full flex-col gap-5 rounded-[14px] border border-paper-2 bg-paper-0 p-6 shadow-sh-1 transition-[box-shadow,transform] duration-[180ms] ease-[var(--ease-out-cubic)] hover:-translate-y-0.5 hover:shadow-sh-2"
              >
                <StaggerItem
                  variant="fadeInUp"
                  className="flex items-center gap-4"
                >
                  <IconoSkill indice={i} />
                  <h3 className="font-display text-[1.35rem] leading-tight font-medium tracking-[-0.015em] text-ink-0">
                    {grupo.grupo}
                  </h3>
                </StaggerItem>
                <div className="flex flex-wrap gap-2">
                  {grupo.items.map((item) => (
                    <StaggerItem key={item} variant="scaleInBlur">
                      <span className="inline-flex min-h-8 items-center rounded-full border border-paper-3 bg-paper-1 px-3 py-1 text-[14px] text-ink-1">
                        {item}
                      </span>
                    </StaggerItem>
                  ))}
                </div>
              </article>
            </StaggerItem>
          ))}
        </Stagger>
      </div>
    </section>
  );
}
