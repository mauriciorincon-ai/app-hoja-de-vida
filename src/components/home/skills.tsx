import { getLocale, getTranslations } from "next-intl/server";
import { Reveal } from "@/components/motion/reveal";
import type { Cv } from "@/lib/schemas";
import { partirItem } from "@/lib/skills/explorador";
import { DibujoSkill } from "./skills-iconos";
import { SkillsExplorador, type TextosExplorador } from "./skills-explorador";
import "./skills.css";

/**
 * Skills (S29, OM-02): el explorador por área de la maqueta aprobada (`referencias-ui/home/maqueta/`,
 * pieza 1), montado sobre la lista de siempre.
 *
 * Lo que pinta el servidor es la LISTA: las nueve tarjetas numeradas en el orden del CV, con la baldosa
 * de su icono, sus herramientas y el estado como etiqueta con texto («prototipo», «en estudio»…). Es lo
 * que ve un ATS, un buscador, quien navega sin JavaScript y quien imprime. La isla
 * (`skills-explorador.tsx`) pone encima el rectángulo oscuro con las áreas flotando, y «Ver todo en
 * lista» vuelve a esta lista (y oculta el movimiento: WCAG 2.2.2).
 *
 * La lista es estática desde el S29, como en la maqueta: la entrada escalonada de las tarjetas (`liftIn`
 * y el trazo de los iconos) se fue con ella; el movimiento vive en el escenario.
 *
 * Lo que NO hay, a propósito: barras de porcentaje ni «nivel de dominio». Un 80 % de Python no significa
 * nada y nadie lo puede medir; lo que aparece es lo que se sabe hacer, y la trayectoria es la prueba.
 */
export async function Skills({ skills }: { skills: Cv["skills"] }) {
  const tNav = await getTranslations("nav");
  const t = await getTranslations("skills");
  const locale = await getLocale();
  if (skills.length === 0) return null;

  const areas = skills.map((g) => ({
    id: g.id,
    nombre: g.grupo,
    items: g.items.map(partirItem),
  }));

  return (
    <section
      id="skills"
      aria-labelledby="skills-titulo"
      className="scroll-mt-16"
    >
      <div className="mx-auto max-w-5xl px-4 py-20 md:px-6 md:py-28">
        <SkillsExplorador
          areas={areas}
          textos={t.raw("explorador") as TextosExplorador}
          locale={locale}
          cabeza={
            <Reveal variant="fadeInUp">
              <h2
                id="skills-titulo"
                className="font-display text-[clamp(1.75rem,3.5vw,2.5rem)] font-medium tracking-[-0.015em] text-ink-0"
              >
                {tNav("skills")}
              </h2>
              <p className="mt-4 max-w-[60ch] text-[16px] leading-[1.75] text-ink-1">
                {t("linea")}
              </p>
            </Reveal>
          }
        >
          <div className="lista">
            {areas.map((grupo, i) => (
              // El id es el destino de una cita del chat: los documentos «a fondo» de una capacidad
              // llevan a SU tarjeta (scripts/destinos.mjs lo lee de aquí). Con el explorador puesto, la
              // isla reconoce el ancla y abre esa área.
              <article
                key={grupo.id}
                id={`skills-${grupo.id}`}
                data-skill-grupo={i}
                className="grupo scroll-mt-16"
              >
                <h3>
                  <span className="n">{i + 1}</span>
                  <span className="baldosa" aria-hidden="true">
                    <DibujoSkill id={grupo.id} />
                  </span>
                  {grupo.nombre}
                </h3>
                <ul>
                  {grupo.items.map((it) => (
                    <li key={`${it.nombre}${it.nota ?? ""}`}>
                      {it.nombre}
                      {it.nota ? ` — ${it.nota}` : ""}
                      {it.estado && (
                        <>
                          {" "}
                          <span className="estado">{it.estado}</span>
                        </>
                      )}
                    </li>
                  ))}
                </ul>
              </article>
            ))}
          </div>
        </SkillsExplorador>
      </div>
    </section>
  );
}
