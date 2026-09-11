// @vitest-environment node
import { renderToString } from "react-dom/server";
import { describe, expect, it, vi } from "vitest";
import { IconoSkill } from "@/components/home/skills-iconos";
import { MotionProvider } from "@/components/motion/motion-provider";
import { Reveal } from "@/components/motion/reveal";
import { Stagger, StaggerItem } from "@/components/motion/stagger";
import { TimelineTrack } from "@/components/motion/timeline-track";

/**
 * LA ESTRUCTURA DEL DOM NO DEPENDE DE `useReducedMotion()` (2026-09-10).
 *
 * En el servidor el hook devuelve `null`; en un navegador con «reducir
 * movimiento», `true`. Si un componente ramifica QUÉ ELEMENTOS pinta según ese
 * valor, el HTML del servidor y el primer render del cliente no coinciden:
 * React #418, y el árbol entero se regenera en el cliente — para exactamente
 * los usuarios a los que el cinturón de reduced-motion quiere cuidar. Así se
 * cayó la HOME (el relleno de la trayectoria vivía en `{!reduced && …}`): la CI
 * lo mostró como un «footer not attached» intermitente en axe.spec, que corre
 * con reducción de movimiento en todas las rutas.
 *
 * Reduced motion cambia PROPS (initial, variants, transition) o lo hace el
 * cinturón CSS; jamás la forma del árbol. Este test renderiza cada componente
 * como lo hace el servidor con los tres valores del hook y exige el mismo
 * HTML, ignorando `style` (motion escribe ahí los valores iniciales).
 */
const hook = vi.hoisted(() => ({ reduced: null as boolean | null }));
vi.mock("motion/react", async (importOriginal) => ({
  ...(await importOriginal<typeof import("motion/react")>()),
  useReducedMotion: () => hook.reduced,
}));
// El enlace al case study y la analítica no son el sujeto: un <a> plano y un
// no-op bastan (next-intl arrastra `next/navigation`, que no vive en node).
vi.mock("@/i18n/navigation", () => ({
  Link: (props: React.ComponentProps<"a">) => <a {...props} />,
}));
vi.mock("@/lib/analytics", () => ({ trackEvent: () => {} }));

const sinEstilos = (html: string) => html.replace(/ style="[^"]*"/g, "");

function html(nodo: React.ReactNode, reduced: boolean | null) {
  hook.reduced = reduced;
  return sinEstilos(renderToString(<MotionProvider>{nodo}</MotionProvider>));
}

const CASOS: Record<string, React.ReactNode> = {
  TimelineTrack: (
    <TimelineTrack
      items={[
        {
          periodo: "2025 — hoy",
          rol: "Rol A",
          organizacion: "Org A",
          descripcion: "Uno.",
          bullets: ["b1", "b2"],
          actual: true,
          hrefCaseStudy: "/proyectos/uno",
        },
        { periodo: "2021 — 2022", rol: "Rol B", organizacion: "Org B", descripcion: "Dos." },
      ]}
      labels={{ verMas: "Más", verMenos: "Menos", verCaseStudy: "Ver", indiceAria: "Año" }}
    />
  ),
  Reveal: (
    <Reveal variant="fadeInUp">
      <p>Texto</p>
    </Reveal>
  ),
  Stagger: (
    <Stagger className="grid">
      <StaggerItem variant="fadeInUp">
        <p>Uno</p>
      </StaggerItem>
      <StaggerItem variant="fadeInUp">
        <p>Dos</p>
      </StaggerItem>
    </Stagger>
  ),
  IconoSkill: <IconoSkill indice={0} />,
};

describe("motion: la estructura del DOM no depende de useReducedMotion()", () => {
  for (const [nombre, nodo] of Object.entries(CASOS)) {
    it(`${nombre}: servidor (null) ≡ cliente con reducción (true) ≡ sin reducción (false)`, () => {
      const servidor = html(nodo, null);
      expect(servidor.length).toBeGreaterThan(0);
      expect(html(nodo, true), `${nombre} con reducción`).toBe(servidor);
      expect(html(nodo, false), `${nombre} sin reducción`).toBe(servidor);
    });
  }
});
