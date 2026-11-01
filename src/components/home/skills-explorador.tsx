"use client";

import dynamic from "next/dynamic";
import {
  useEffect,
  useRef,
  useState,
  useSyncExternalStore,
  type ReactNode,
} from "react";
import type { AreaExplorador, TextosEscenario } from "./skills-escenario";
import { LimiteDelEscenario } from "./skills-limite";
import { entrarAHome, salirDeHome } from "./skills-memoria";

/**
 * LA ISLA DE SKILLS (S29): la lista de siempre, y sobre ella el explorador.
 *
 * El servidor pinta la lista entera (las nueve tarjetas: ATS, SEO, sin JavaScript e impresión). Esta isla
 * es ligera: en el servidor y en la primera pintura del cliente deja todo igual, y al montar pone
 * `data-vivo`, que muestra el conmutador «Áreas | Ver todo en lista» y el rectángulo y oculta la lista
 * (la hoja). Solo cambia atributos: la forma del árbol es la misma con y sin JavaScript, y nunca depende
 * de «reducir movimiento» (regla 7).
 *
 * El escenario va en su propio chunk y se pide cuando la sección se acerca a la vista (1000 px antes), o
 * enseguida si la URL trae una cita del chat (`#skills-<id>`).
 *
 * Las citas del chat (`scripts/destinos.mjs` las cuenta con el id de cada tarjeta) siguen llegando a
 * `/#skills-<id>`, y el chat no se toca: la isla reconoce el ancla al montar, en `hashchange` y en el
 * clic de cualquier enlace a una tarjeta, abre esa área y lleva el rectángulo a la vista bajo el header.
 * Con la lista puesta, el salto llega a la tarjeta como siempre.
 */

const SkillsEscenario = dynamic(
  () => import("./skills-escenario").then((m) => m.SkillsEscenario),
  { ssr: false },
);

export type TextosExplorador = TextosEscenario & {
  areas: string;
  conmutador: string;
};

/** El valor no cambia durante la vida de la página: no hay a qué suscribirse. */
const sinSuscripcion = () => () => undefined;

export function SkillsExplorador({
  areas,
  textos,
  locale,
  cabeza,
  children,
}: {
  areas: AreaExplorador[];
  textos: TextosExplorador;
  locale: string;
  cabeza: ReactNode;
  children: ReactNode;
}) {
  // En el servidor y al hidratar, `false`: el primer pintado coincide con el HTML y solo después cambia.
  const vivo = useSyncExternalStore(
    sinSuscripcion,
    () => true,
    () => false,
  );
  const [vista, setVista] = useState<"areas" | "lista">("areas");
  const [cargar, setCargar] = useState(false);
  // El escenario no llegó: se queda la lista, sin conmutador (un reintento exigiría recargar la página).
  const [fallo, setFallo] = useState(false);
  const [pedido, setPedido] = useState<{ id: string; n: number } | null>(null);
  const huecoRef = useRef<HTMLDivElement>(null);
  const vistaRef = useRef(vista);

  useEffect(() => {
    vistaRef.current = vista;
  }, [vista]);

  // Las áreas vistas: se reinician al volver a entrar a la home y sobreviven al cambio de idioma.
  useEffect(() => {
    entrarAHome(locale);
    return () => salirDeHome(locale);
  }, [locale]);

  // El escenario se pide al acercarse a la vista.
  useEffect(() => {
    const hueco = huecoRef.current;
    if (!hueco) return;
    const io = new IntersectionObserver(
      ([e]) => {
        if (e?.isIntersecting) {
          setCargar(true);
          io.disconnect();
        }
      },
      { rootMargin: "1000px 0px" },
    );
    io.observe(hueco);
    return () => io.disconnect();
  }, []);

  // La cita del chat: `#skills-<id>` abre su área en el explorador.
  useEffect(() => {
    const ids = new Set(areas.map((a) => a.id));
    const deAncla = (hash: string) => {
      const m = /^#skills-(.+)$/.exec(hash);
      return m && ids.has(m[1]!) ? m[1]! : null;
    };
    const abrir = (id: string) => {
      if (vistaRef.current === "lista") return;
      setCargar(true);
      setPedido((p) => ({ id, n: (p?.n ?? 0) + 1 }));
      requestAnimationFrame(() =>
        huecoRef.current?.scrollIntoView({ block: "start" }),
      );
    };
    const alCambiarAncla = () => {
      const id = deAncla(window.location.hash);
      if (id) abrir(id);
    };
    // El enlace del chat navega con el router (pushState): no hay `hashchange` en la misma página.
    const alClic = (e: MouseEvent) => {
      const a = (e.target as Element | null)?.closest?.<HTMLAnchorElement>(
        'a[href*="#skills-"]',
      );
      if (!a) return;
      const url = new URL(a.href, window.location.href);
      if (url.pathname !== window.location.pathname) return; // otra página: lo atiende su montaje
      const id = deAncla(url.hash);
      if (id) abrir(id);
    };
    const inicial = deAncla(window.location.hash);
    const cuadro = inicial ? requestAnimationFrame(() => abrir(inicial)) : 0;
    window.addEventListener("hashchange", alCambiarAncla);
    document.addEventListener("click", alClic, true);
    return () => {
      cancelAnimationFrame(cuadro);
      window.removeEventListener("hashchange", alCambiarAncla);
      document.removeEventListener("click", alClic, true);
    };
  }, [areas]);

  const verLista = () => setVista("lista");
  const alFallar = () => {
    setFallo(true);
    setVista("lista");
  };

  return (
    <div
      data-skills=""
      data-vivo={vivo ? "" : undefined}
      data-vista={vista}
      data-sin-escenario={fallo ? "" : undefined}
    >
      <div className="skills-cabeza">
        <div>{cabeza}</div>
        <div className="vista" role="group" aria-label={textos.conmutador}>
          <button
            type="button"
            aria-pressed={vista === "areas"}
            onClick={() => {
              setVista("areas");
              setCargar(true);
            }}
          >
            {textos.areas}
          </button>
          <button
            type="button"
            aria-pressed={vista === "lista"}
            onClick={verLista}
          >
            {textos.lista}
          </button>
        </div>
      </div>
      <div ref={huecoRef} className="escenario-hueco">
        {cargar && (
          <LimiteDelEscenario onFallo={alFallar}>
            <SkillsEscenario
              areas={areas}
              textos={textos}
              activo={vista === "areas"}
              pedido={pedido}
              onVerLista={verLista}
            />
          </LimiteDelEscenario>
        )}
      </div>
      {children}
    </div>
  );
}
