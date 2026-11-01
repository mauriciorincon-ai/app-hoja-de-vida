// @vitest-environment node
/* eslint-disable @next/next/no-img-element -- el mock de next/image pinta una <img> plana a propósito */
import { NextIntlClientProvider } from "next-intl";
import { renderToString } from "react-dom/server";
import { describe, expect, it, vi } from "vitest";
import { Brochure } from "@/components/brochure/brochure";
import { BrochureInteractivo } from "@/components/brochure/brochure-interactivo";
import { Buscador } from "@/components/brochure/buscador";
import { FlujoDibujo } from "@/components/brochure/flujo-dibujo";
import { PuertaMetodos } from "@/components/home/metodos";
import { PuertaPortafolio } from "@/components/home/vitrina";
import { SkillsEscenario } from "@/components/home/skills-escenario";
import { SkillsExplorador } from "@/components/home/skills-explorador";
import { DibujoSkill } from "@/components/home/skills-iconos";
import { Reveal } from "@/components/motion/reveal";
import { Stagger, StaggerItem } from "@/components/motion/stagger";
import { TimelineTrack } from "@/components/motion/timeline-track";
import { CarruselDeMuestras } from "@/components/vitrina/carrusel-de-muestras";
import { InfografiaVista } from "@/components/metodo/infografia";
import { RielDeFases } from "@/components/metodo/riel-de-fases";
import { GaleriaCarrusel } from "@/components/vitrina/galeria-carrusel";
import type { EtiquetasCarrusel } from "@/components/vitrina/galeria-carrusel";
import { leerPiezasDeDisco } from "@/lib/metodo/loader";
import { getFrentes } from "@/lib/vitrina/categorias";
import { partirItem } from "@/lib/skills/explorador";
import es from "../../messages/es.json";
import { mensajes, textosDe, vistaDe } from "../fixtures/brochure/vista";
import { ejemploSintetico, traductorDe } from "../fixtures/metodo/ayudas";

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
// Desde el 2026-09-27 (ADR-027) el hook es propio (`usePrefiereQuieto`) y las
// primitivas de entrada son componentes de servidor que ni lo leen; el test
// sigue exigiéndoles el mismo HTML con los tres valores, para que nadie vuelva
// a ramificar el árbol con él.
const hook = vi.hoisted(() => ({ reduced: null as boolean | null }));
vi.mock("@/components/motion/use-prefiere-quieto", () => ({
  usePrefiereQuieto: () => hook.reduced,
}));
// El enlace al case study y la analítica no son el sujeto: un <a> plano y un
// no-op bastan (next-intl arrastra `next/navigation`, que no vive en node).
vi.mock("@/i18n/navigation", () => ({
  Link: (props: React.ComponentProps<"a">) => <a {...props} />,
}));
vi.mock("@/lib/analytics", () => ({ trackEvent: () => {} }));
// El carrusel pinta `next/image`; en node basta una <img> plana.
vi.mock("next/image", () => ({
  default: ({ src, alt }: { src: string; alt: string }) => (
    <img src={src} alt={alt} />
  ),
}));

const sinEstilos = (html: string) => html.replace(/ style="[^"]*"/g, "");

function html(nodo: React.ReactNode, reduced: boolean | null) {
  hook.reduced = reduced;
  return sinEstilos(renderToString(<>{nodo}</>));
}

const ETIQUETAS_CARRUSEL: EtiquetasCarrusel = {
  etiqueta: "Pantallas",
  pista: "Recorrido",
  anterior: "Anterior",
  siguiente: "Siguiente",
  indicadores: ["1 de 2", "2 de 2"],
  pies: ["Pantalla 1 de 2", "Pantalla 2 de 2"],
};

// S28: el brochure de la piloto, con sus flujos y su buscador (la isla lee «reducir movimiento» con
// `matchMedia` dentro de sus efectos, nunca al pintar).
const BROCHURE = vistaDe("inmobiliaria", "es");
const T_BROCHURE = textosDe("es");
const BUSCADOR = (
  <NextIntlClientProvider
    locale="es"
    messages={{ brochure: mensajes("es").brochure }}
  >
    <Buscador ph={BROCHURE.buscarPh} etiqueta={T_BROCHURE("buscar")} />
  </NextIntlClientProvider>
);

// S29: el explorador de Skills. La isla y el escenario leen «reducir movimiento» con `matchMedia` en sus
// efectos y manejadores, nunca al pintar; aquí se exige el mismo HTML con los tres valores del hook.
const AREAS = [
  { id: "ia-y-ml", nombre: "ML", items: ["scikit-learn", "PyTorch — en exploración"].map(partirItem) },
  { id: "ingenieria", nombre: "Ingeniería", items: ["Python", "CI/CD — este sitio corre con ello"].map(partirItem) },
];
const TEXTOS_SKILLS = es.skills.explorador;

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
        {
          periodo: "2021 — 2022",
          rol: "Rol B",
          organizacion: "Org B",
          descripcion: "Dos.",
        },
      ]}
      labels={{
        verMas: "Más",
        verMenos: "Menos",
        verCaseStudy: "Ver",
        indiceAria: "Año",
      }}
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
  DibujoSkill: <DibujoSkill id="ia-y-ml" />,
  SkillsExplorador: (
    <SkillsExplorador
      areas={AREAS}
      textos={TEXTOS_SKILLS}
      locale="es"
      cabeza={<h2>Skills</h2>}
    >
      <div className="lista">
        <article id="skills-ia-y-ml">ML</article>
      </div>
    </SkillsExplorador>
  ),
  SkillsEscenario: (
    <SkillsEscenario
      areas={AREAS}
      textos={TEXTOS_SKILLS}
      activo
      pedido={null}
      onVerLista={() => {}}
    />
  ),
  // Sprint 009: el carrusel de la galería usa el hook SOLO para el `behavior`
  // del desplazamiento; la forma del árbol no puede depender de él.
  GaleriaCarrusel: (
    <GaleriaCarrusel
      capturas={[
        { archivo: "a.png", pie: "Uno" },
        { archivo: "b.png", pie: "Dos" },
      ]}
      frente="tableros"
      etiquetas={ETIQUETAS_CARRUSEL}
    />
  ),
  // Ajuste post-S9: el carrusel de tarjetas de apps, misma regla (5a).
  CarruselDeMuestras: (
    <CarruselDeMuestras
      etiquetas={{
        etiqueta: "Apps profesionales",
        anterior: "Tarjeta anterior",
        siguiente: "Tarjeta siguiente",
        indicadores: ["1 de 3", "2 de 3", "3 de 3"],
      }}
    >
      <article>Uno</article>
      <article>Dos</article>
      <article>Tres</article>
    </CarruselDeMuestras>
  ),
  // S10 («Métodos»): el riel de fases escribe su relleno directo en el scroll
  // y la publicación entera lleva `Reveal` por bloque; ninguna de las dos puede
  // ramificar el árbol con el hook (regla 5a).
  RielDeFases: (
    <RielDeFases
      fases={[
        {
          nombre: "Uno",
          entradas: ["a"],
          actividades: ["b"],
          artefactos: ["c"],
          decide: "X",
          control: "Y",
        },
        {
          nombre: "Dos",
          entradas: ["a"],
          actividades: ["b"],
          artefactos: ["c"],
          decide: "X",
          control: "Y",
        },
      ]}
      etiquetas={{
        fase: "Fase {n}",
        avance: "Avance",
        entradas: "Entradas",
        actividades: "Actividades",
        artefactos: "Artefactos",
        decide: "Decide",
        control: "Control",
      }}
    />
  ),
  InfografiaVista: (
    <InfografiaVista
      pieza={ejemploSintetico()}
      idioma="es"
      t={traductorDe("es")}
    />
  ),
  // S19: la puerta a «Métodos» en la HOME (Reveal + Stagger sobre la lista de
  // `data/metodo/`): misma regla, el árbol no depende del hook.
  PuertaMetodos: (
    <PuertaMetodos
      piezas={leerPiezasDeDisco()}
      locale="es"
      t={traductorDe("es")}
    />
  ),
  // S28: la puerta al Portafolio en la HOME (Reveal + Stagger sobre sus cuatro filas): misma regla.
  PuertaPortafolio: (
    <PuertaPortafolio
      frentes={getFrentes()}
      locale="es"
      t={(clave, valores) =>
        (es.vitrinaHome as Record<string, string>)[clave].replace(
          /\{(\w+)\}/g,
          (_, k) => String(valores?.[k] ?? ""),
        )
      }
    />
  ),
  // S28: el brochure entero (portada, cinta y bucles, capítulos, flujos, Recorrido) con su isla, y
  // sus dos piezas de cliente sueltas: el dibujo del flujo y el buscador.
  Brochure: (
    <>
      <Brochure
        v={BROCHURE}
        t={T_BROCHURE}
        href={(d) => `/es${d}`}
        buscador={BUSCADOR}
      />
      <BrochureInteractivo slug="inmobiliaria" />
    </>
  ),
  FlujoDibujo: (
    <FlujoDibujo
      vista={BROCHURE.proceso!.flujo}
      ancho={1382}
      verEnRecorrido={T_BROCHURE("verEnRecorrido")}
    />
  ),
  Buscador: BUSCADOR,
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
