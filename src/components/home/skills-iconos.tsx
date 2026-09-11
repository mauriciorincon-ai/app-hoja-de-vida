"use client";

import { m, useReducedMotion, type Variants } from "motion/react";
import { EASE_OUT_CUBIC } from "@/components/motion/easings";

/**
 * Los iconos de los grupos de skills — dibujados aquí, en la familia del
 * design system (24×24, trazo 1.7, sin relleno). Nunca un emoji.
 *
 * Van POR POSICIÓN del grupo, no por su nombre: el nombre es contenido y
 * puede cambiar en el YAML sin que el icono deje de salir. Cuatro dibujos
 * para los cuatro grupos del content pack; un quinto grupo recibe el rombo.
 *
 * El trazo se DIBUJA al llegar la tarjeta: cada figura lleva `pathLength=1` y
 * anima 0→1 dentro de la orquestación del `Stagger` padre (hereda las
 * variantes hidden/visible). El estado por defecto es el icono dibujado —
 * si el disparo no llegara, se ve igual (lección del S5, globals.css).
 */
const DIBUJOS: React.ReactElement[][] = [
  // 0 · IA & ML — una chispa que aprende: el nodo y sus rayos.
  [
    <circle key="a" cx="12" cy="12" r="3" />,
    <path key="b" d="M12 3v3M12 18v3M3 12h3M18 12h3" />,
    <path key="c" d="M5.6 5.6l2.2 2.2M16.2 16.2l2.2 2.2M5.6 18.4l2.2-2.2M16.2 7.8l2.2-2.2" />,
  ],
  // 1 · Plataforma de datos — las capas de un almacén.
  [
    <ellipse key="a" cx="12" cy="6" rx="8" ry="3" />,
    <path key="b" d="M4 6v6c0 1.7 3.6 3 8 3s8-1.3 8-3V6" />,
    <path key="c" d="M4 12v6c0 1.7 3.6 3 8 3s8-1.3 8-3v-6" />,
  ],
  // 2 · BI & decisión — la curva que sube y la decisión al final.
  [
    <path key="a" d="M4 20h16" />,
    <path key="b" d="M5 16l4-5 4 3 6-8" />,
    <circle key="c" cx="19" cy="6" r="1.8" />,
  ],
  // 3 · Ingeniería & liderazgo — la rama que se bifurca y vuelve.
  [
    <circle key="a" cx="6" cy="5" r="2" />,
    <circle key="b" cx="18" cy="9" r="2" />,
    <circle key="c" cx="6" cy="19" r="2" />,
    <path key="d" d="M6 7v10M16 9.5c-4 0-8 1.5-8 6" />,
  ],
];
const ROMBO = [<path key="a" d="M12 3l9 9-9 9-9-9z" />];

const trazo: Variants = {
  hidden: { pathLength: 0, opacity: 0.4 },
  visible: (i: number) => ({
    pathLength: 1,
    opacity: 1,
    transition: { duration: 0.75, delay: 0.1 + i * 0.13, ease: EASE_OUT_CUBIC },
  }),
};

export function IconoSkill({ indice }: { indice: number }) {
  const reduced = useReducedMotion();
  const figuras = DIBUJOS[indice] ?? ROMBO;
  return (
    <span
      aria-hidden="true"
      className="flex size-12 shrink-0 items-center justify-center rounded-[10px] border border-paper-2 bg-paper-1 text-sage-ink"
    >
      <svg
        viewBox="0 0 24 24"
        width="24"
        height="24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.7"
        strokeLinecap="round"
        strokeLinejoin="round"
        focusable="false"
      >
        {figuras.map((f, i) => {
          // Cada figura se vuelve `m.<tag>` con pathLength normalizada, y
          // hereda hidden/visible del Stagger que envuelve la tarjeta.
          const Tag = m[f.type as "path" | "circle" | "ellipse"];
          return (
            <Tag
              key={f.key}
              {...(f.props as object)}
              data-motion=""
              data-motion-svg=""
              pathLength={1}
              custom={i}
              variants={reduced ? undefined : trazo}
            />
          );
        })}
      </svg>
    </span>
  );
}
