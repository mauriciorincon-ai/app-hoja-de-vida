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
  CarruselDeMuestras,
  type EtiquetasCarruselMuestras,
} from "@/components/vitrina/carrusel-de-muestras";

/**
 * EL CARRUSEL DE MUESTRAS DE APP (ajuste post-S9, 2026-10-07) — patrón APG,
 * sin librería, la misma mecánica que la galería de tableros.
 *
 * jsdom no tiene `IntersectionObserver` ni `Element.scrollTo`: se simulan, y el
 * test dirige al observador a mano para decir «estas tarjetas están a la vista».
 * Aquí las tarjetas son `<article>` de mentira: lo que se prueba es la pista.
 */
const hook = vi.hoisted(() => ({ quieto: false as boolean | null }));
vi.mock("@/components/motion/use-prefiere-quieto", () => ({
  usePrefiereQuieto: () => hook.quieto,
}));

type Entrada = { target: Element; intersectionRatio: number };
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

const N = 3;
const etiquetas = (n: number): EtiquetasCarruselMuestras => ({
  etiqueta: "Apps profesionales",
  anterior: "Tarjeta anterior",
  siguiente: "Tarjeta siguiente",
  indicadores: Array.from({ length: n }, (_, i) => `${i + 1} de ${n}`),
});
const montar = (n = N) =>
  render(
    <CarruselDeMuestras etiquetas={etiquetas(n)}>
      {Array.from({ length: n }, (_, i) => (
        <article key={i} data-muestra-slug={`app-${i + 1}`}>
          <h3>App {i + 1}</h3>
        </article>
      ))}
    </CarruselDeMuestras>,
  );

/** El observador dice qué tarjetas ocupan la pista (el resto, no). */
function aLaVista(...visibles: number[]) {
  act(() => {
    observador!.callback(
      observador!.vistos.map((target, i) => ({
        target,
        intersectionRatio: visibles.includes(i) ? 1 : 0,
      })),
    );
  });
}

describe("CarruselDeMuestras — con varias tarjetas", () => {
  it("es un grupo «carousel» con nombre, y cada tarjeta es un «slide» con su «n de N»", () => {
    const { container } = montar();
    const carrusel = container.querySelector(
      '[aria-roledescription="carousel"]',
    )!;
    expect(carrusel).toHaveAttribute("aria-label", "Apps profesionales");
    const slides = carrusel.querySelectorAll('[aria-roledescription="slide"]');
    expect(slides).toHaveLength(N);
    slides.forEach((s, i) =>
      expect(s).toHaveAttribute("aria-label", `${i + 1} de ${N}`),
    );
    // Las N tarjetas siguen siendo las de la lista, cada una dentro de su slide.
    expect(carrusel.querySelectorAll("[data-muestra-slug]")).toHaveLength(N);
    expect(carrusel.querySelectorAll("[data-tarjeta]")).toHaveLength(N);
  });

  it("los dos botones tienen nombre accesible; el anterior arranca deshabilitado", () => {
    montar();
    expect(
      screen.getByRole("button", { name: "Tarjeta anterior" }),
    ).toBeDisabled();
    expect(
      screen.getByRole("button", { name: "Tarjeta siguiente" }),
    ).toBeEnabled();
  });

  it("el indicador es un «status» educado y arranca en «1 de N»", () => {
    montar();
    const estado = screen.getByRole("status");
    expect(estado).toHaveAttribute("aria-live", "polite");
    expect(estado).toHaveTextContent("1 de 3");
  });

  it("«siguiente» desliza (suave) a la tarjeta que sigue y mueve el indicador", () => {
    montar();
    fireEvent.click(screen.getByRole("button", { name: "Tarjeta siguiente" }));
    expect(scrollTo).toHaveBeenCalledTimes(1);
    expect(scrollTo.mock.calls[0][0]).toMatchObject({ behavior: "smooth" });
    expect(screen.getByRole("status")).toHaveTextContent("2 de 3");
    expect(
      screen.getByRole("button", { name: "Tarjeta anterior" }),
    ).toBeEnabled();
  });

  it("con «reducir movimiento» el desplazamiento no se anima, pero ocurre", () => {
    hook.quieto = true;
    montar();
    fireEvent.click(screen.getByRole("button", { name: "Tarjeta siguiente" }));
    expect(scrollTo.mock.calls[0][0]).toMatchObject({ behavior: "auto" });
    expect(screen.getByRole("status")).toHaveTextContent("2 de 3");
  });

  it("lo que el visitante desliza a mano mueve el indicador; con la última a la vista, «siguiente» se apaga", () => {
    montar();
    aLaVista(0, 1);
    expect(screen.getByRole("status")).toHaveTextContent("1 de 3");
    expect(
      screen.getByRole("button", { name: "Tarjeta siguiente" }),
    ).toBeEnabled();
    // Dos por vista: al llegar al final se ven la 2.ª y la 3.ª.
    aLaVista(1, 2);
    expect(screen.getByRole("status")).toHaveTextContent("2 de 3");
    expect(
      screen.getByRole("button", { name: "Tarjeta siguiente" }),
    ).toBeDisabled();
    expect(
      screen.getByRole("button", { name: "Tarjeta anterior" }),
    ).toBeEnabled();
    // Y de vuelta al principio, «siguiente» se reactiva.
    aLaVista(0, 1);
    expect(
      screen.getByRole("button", { name: "Tarjeta siguiente" }),
    ).toBeEnabled();
    expect(
      screen.getByRole("button", { name: "Tarjeta anterior" }),
    ).toBeDisabled();
  });

  it("la pista con scroll se alcanza con el teclado (foco) y tiene nombre", () => {
    const { container } = montar();
    const carrusel = container.querySelector(
      '[aria-roledescription="carousel"]',
    ) as HTMLElement;
    const pista = within(carrusel).getAllByRole("group")[0];
    expect(pista).toHaveAttribute("tabindex", "0");
    expect(pista).toHaveAttribute("aria-label", "Apps profesionales");
  });

  it("nada se mueve solo: ningún temporizador ni rotación automática", () => {
    vi.useFakeTimers();
    montar();
    act(() => void vi.advanceTimersByTime(60_000));
    expect(scrollTo).not.toHaveBeenCalled();
    expect(screen.getByRole("status")).toHaveTextContent("1 de 3");
    vi.useRealTimers();
  });
});

describe("CarruselDeMuestras — con una sola tarjeta", () => {
  it("sin botones, sin indicador, sin foco y sin roles de carrusel", () => {
    const { container } = montar(1);
    expect(screen.queryByRole("button")).toBeNull();
    expect(screen.queryByRole("status")).toBeNull();
    expect(
      container.querySelector('[aria-roledescription="carousel"]'),
    ).toBeNull();
    expect(
      container.querySelector('[aria-roledescription="slide"]'),
    ).toBeNull();
    expect(container.querySelector("[tabindex]")).toBeNull();
    expect(container.querySelector("[role]")).toBeNull();
    // La tarjeta sigue ahí.
    expect(container.querySelectorAll("[data-muestra-slug]")).toHaveLength(1);
  });
});
