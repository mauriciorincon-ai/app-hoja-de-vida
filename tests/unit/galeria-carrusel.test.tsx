/* eslint-disable @next/next/no-img-element -- el mock de next/image pinta una <img> plana a propósito */
import {
  act,
  cleanup,
  fireEvent,
  render,
  screen,
  within,
} from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import {
  GaleriaCarrusel,
  type EtiquetasCarrusel,
} from "@/components/vitrina/galeria-carrusel";

/**
 * EL CARRUSEL DE LA GALERÍA (Sprint 009) — patrón APG, sin librería.
 *
 * jsdom no tiene `IntersectionObserver` ni `Element.scrollTo`: se simulan, y
 * el test dirige al observador a mano para decir «esta captura está a la vista».
 */
const hook = vi.hoisted(() => ({ quieto: false as boolean | null }));
vi.mock("@/components/motion/use-prefiere-quieto", () => ({
  usePrefiereQuieto: () => hook.quieto,
}));
vi.mock("next/image", () => ({
  default: ({ src, alt }: { src: string; alt: string }) => (
    <img src={src} alt={alt} />
  ),
}));

type Entrada = { isIntersecting: boolean; target: Element };
let observador: { callback: (e: Entrada[]) => void; vistos: Element[] } | null =
  null;
const scrollTo = vi.fn();

beforeEach(() => {
  hook.quieto = false;
  scrollTo.mockClear();
  observador = null;
  Element.prototype.scrollTo =
    scrollTo as unknown as typeof Element.prototype.scrollTo;
  vi.stubGlobal(
    "IntersectionObserver",
    class {
      constructor(callback: (e: Entrada[]) => void) {
        observador = { callback, vistos: [] };
      }
      observe(el: Element) {
        observador?.vistos.push(el);
      }
      disconnect() {}
    },
  );
});
afterEach(() => {
  cleanup();
  vi.unstubAllGlobals();
});

const N = 6;
const capturas = Array.from({ length: N }, (_, i) => ({
  archivo: `capturas/demo/0${i + 1}-pantalla.png`,
  pie: `Pie de la pantalla ${i + 1}`,
}));
const etiquetas = (n: number): EtiquetasCarrusel => ({
  etiqueta: "Pantallas del producto",
  anterior: "Pantalla anterior",
  siguiente: "Pantalla siguiente",
  indicadores: Array.from({ length: n }, (_, i) => `${i + 1} de ${n}`),
  pies: Array.from({ length: n }, (_, i) => `Pantalla ${i + 1} de ${n}`),
});
const montar = (n = N) =>
  render(
    <GaleriaCarrusel
      capturas={capturas.slice(0, n)}
      frente="tableros"
      etiquetas={etiquetas(n)}
    />,
  );

/** El observador dice que la captura `i` ocupa la pista. */
function aLaVista(i: number) {
  act(() => {
    observador!.callback([
      { isIntersecting: true, target: observador!.vistos[i] },
    ]);
  });
}

describe("GaleriaCarrusel — con varias capturas", () => {
  it("es una región «carousel» con nombre, y cada captura es un «slide» con su «n de N»", () => {
    montar();
    const region = screen.getByRole("region", {
      name: "Pantallas del producto",
    });
    expect(region).toHaveAttribute("aria-roledescription", "carousel");
    const slides = region.querySelectorAll('[aria-roledescription="slide"]');
    expect(slides).toHaveLength(N);
    slides.forEach((s, i) =>
      expect(s).toHaveAttribute("aria-label", `${i + 1} de ${N}`),
    );
    // Y siguen siendo las N capturas de la ficha, con su pie.
    expect(region.querySelectorAll("[data-captura]")).toHaveLength(N);
    expect(screen.getByAltText("Pie de la pantalla 3")).toHaveAttribute(
      "src",
      "/piezas/tableros/capturas/demo/03-pantalla.png",
    );
  });

  it("los dos botones tienen nombre accesible; el anterior arranca deshabilitado", () => {
    montar();
    expect(
      screen.getByRole("button", { name: "Pantalla anterior" }),
    ).toBeDisabled();
    expect(
      screen.getByRole("button", { name: "Pantalla siguiente" }),
    ).toBeEnabled();
  });

  it("el indicador es un «status» educado y arranca en «1 de N»", () => {
    montar();
    const estado = screen.getByRole("status");
    expect(estado).toHaveAttribute("aria-live", "polite");
    expect(estado).toHaveTextContent("1 de 6");
  });

  it("«siguiente» desliza una pantalla (suave) y mueve el indicador", () => {
    montar();
    fireEvent.click(screen.getByRole("button", { name: "Pantalla siguiente" }));
    expect(scrollTo).toHaveBeenCalledTimes(1);
    expect(scrollTo.mock.calls[0][0]).toMatchObject({ behavior: "smooth" });
    expect(screen.getByRole("status")).toHaveTextContent("2 de 6");
    expect(
      screen.getByRole("button", { name: "Pantalla anterior" }),
    ).toBeEnabled();
  });

  it("con «reducir movimiento» el desplazamiento no se anima, pero ocurre", () => {
    hook.quieto = true;
    montar();
    fireEvent.click(screen.getByRole("button", { name: "Pantalla siguiente" }));
    expect(scrollTo.mock.calls[0][0]).toMatchObject({ behavior: "auto" });
    expect(screen.getByRole("status")).toHaveTextContent("2 de 6");
  });

  it("lo que el visitante desliza a mano también mueve el indicador y los extremos", () => {
    montar();
    aLaVista(2);
    expect(screen.getByRole("status")).toHaveTextContent("3 de 6");
    aLaVista(N - 1);
    expect(screen.getByRole("status")).toHaveTextContent("6 de 6");
    expect(
      screen.getByRole("button", { name: "Pantalla siguiente" }),
    ).toBeDisabled();
    expect(
      screen.getByRole("button", { name: "Pantalla anterior" }),
    ).toBeEnabled();
  });

  it("la pista con scroll se alcanza con el teclado (foco) y tiene nombre", () => {
    montar();
    const pista = within(screen.getByRole("region")).getAllByRole("group")[0];
    expect(pista).toHaveAttribute("tabindex", "0");
    expect(pista).toHaveAttribute("aria-label", "Pantallas del producto");
  });

  it("nada se mueve solo: ningún temporizador ni rotación automática", () => {
    vi.useFakeTimers();
    montar();
    act(() => void vi.advanceTimersByTime(60_000));
    expect(scrollTo).not.toHaveBeenCalled();
    expect(screen.getByRole("status")).toHaveTextContent("1 de 6");
    vi.useRealTimers();
  });
});

describe("GaleriaCarrusel — con una sola captura", () => {
  it("sin botones, sin indicador, sin foco y sin roles de carrusel en las capturas", () => {
    const { container } = montar(1);
    expect(screen.queryByRole("button")).toBeNull();
    expect(screen.queryByRole("status")).toBeNull();
    expect(
      container.querySelector('[aria-roledescription="slide"]'),
    ).toBeNull();
    expect(container.querySelector("[tabindex]")).toBeNull();
    // La imagen y su pie siguen ahí.
    expect(container.querySelectorAll("[data-captura]")).toHaveLength(1);
    expect(screen.getByAltText("Pie de la pantalla 1")).toBeInTheDocument();
    expect(container).toHaveTextContent("Pantalla 1 de 1");
  });
});
