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
 * EL CARRUSEL DE MUESTRAS DE APP (post-S9) — gira SIN FIN, en los dos sentidos.
 *
 * El DOM conserva las N tarjetas en su orden; el orden visual lo da `order`
 * (CSS) a partir de `inicio`. jsdom no anima: el test dispara `transitionEnd`
 * sobre la pista cuando el giro «termina», y mira el `order` de cada tarjeta
 * para saber quién va primera.
 */
const hook = vi.hoisted(() => ({ quieto: false as boolean | null }));
vi.mock("@/components/motion/use-prefiere-quieto", () => ({
  usePrefiereQuieto: () => hook.quieto,
}));

beforeEach(() => {
  hook.quieto = false;
});
afterEach(() => {
  cleanup();
  vi.useRealTimers();
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

const pista = (c: HTMLElement) =>
  c.querySelector("[data-pista]") as HTMLElement;
const siguiente = () =>
  screen.getByRole("button", { name: "Tarjeta siguiente" });
const anterior = () => screen.getByRole("button", { name: "Tarjeta anterior" });
/** El `order` visual de cada tarjeta, en el orden del DOM. */
const ordenes = (c: HTMLElement) =>
  [...c.querySelectorAll<HTMLElement>("[data-tarjeta]")].map((t) =>
    Number(t.style.order),
  );
/** El giro animado «termina»: lo que en un navegador dispara `transitionend`. */
const terminar = (c: HTMLElement) => fireEvent.transitionEnd(pista(c));
const indicador = () => screen.getByRole("status");

describe("CarruselDeMuestras — con varias tarjetas", () => {
  it("es un grupo «carousel» con nombre y cada tarjeta es un «slide» con su «n de N» por su índice real", () => {
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
    // El DOM tiene EXACTAMENTE las N tarjetas, sin clones, en su orden.
    expect(
      [...carrusel.querySelectorAll("[data-muestra-slug]")].map((a) =>
        a.getAttribute("data-muestra-slug"),
      ),
    ).toEqual(["app-1", "app-2", "app-3"]);
  });

  it("los dos botones tienen nombre accesible y NINGUNO se deshabilita nunca", () => {
    const { container } = montar();
    expect(anterior()).toBeEnabled();
    expect(siguiente()).toBeEnabled();
    // Ni en el «primer» ni en el «último» punto del giro.
    for (let k = 0; k < N + 1; k++) {
      fireEvent.click(siguiente());
      terminar(container);
      expect(anterior()).toBeEnabled();
      expect(siguiente()).toBeEnabled();
    }
  });

  it("el indicador es un «status» educado y arranca en «1 de N» con la primera tarjeta primera", () => {
    const { container } = montar();
    expect(indicador()).toHaveAttribute("aria-live", "polite");
    expect(indicador()).toHaveTextContent("1 de 3");
    expect(ordenes(container)).toEqual([0, 1, 2]);
  });

  it("«siguiente» anima la pista un paso y, al terminar, rota: la 2.ª va primera", () => {
    const { container } = montar();
    fireEvent.click(siguiente());
    // Mientras anima: la pista se desplaza y la rotación aún no ocurrió.
    expect(pista(container).style.transform).toMatch(/translateX\(-\d+px\)/);
    expect(pista(container).style.transition).toContain("320ms");
    expect(indicador()).toHaveTextContent("1 de 3");
    terminar(container);
    expect(indicador()).toHaveTextContent("2 de 3");
    expect(ordenes(container)).toEqual([2, 0, 1]);
    expect(pista(container).style.transform).toBe("translateX(0px)");
    expect(pista(container).style.transition).toBe("none");
  });

  it("GIRA SIN FIN: de la última se pasa a la primera, y de la primera a la última", () => {
    const { container } = montar();
    for (const esperado of ["2 de 3", "3 de 3", "1 de 3"]) {
      fireEvent.click(siguiente());
      terminar(container);
      expect(indicador()).toHaveTextContent(esperado);
    }
    expect(ordenes(container)).toEqual([0, 1, 2]);
    // Hacia atrás desde la primera: la última pasa a primera.
    fireEvent.click(anterior());
    expect(indicador()).toHaveTextContent("3 de 3");
    terminar(container);
    expect(ordenes(container)).toEqual([1, 2, 0]);
    fireEvent.click(anterior());
    terminar(container);
    expect(indicador()).toHaveTextContent("2 de 3");
  });

  it("mientras gira, una pulsación más no se come el giro ni lo duplica", () => {
    const { container } = montar();
    fireEvent.click(siguiente());
    fireEvent.click(siguiente());
    fireEvent.click(anterior());
    terminar(container);
    expect(indicador()).toHaveTextContent("2 de 3");
  });

  it("si `transitionend` no llega (pestaña en segundo plano), el giro termina igual", () => {
    vi.useFakeTimers();
    const { container } = montar();
    fireEvent.click(siguiente());
    expect(indicador()).toHaveTextContent("1 de 3");
    act(() => void vi.advanceTimersByTime(700));
    expect(indicador()).toHaveTextContent("2 de 3");
    expect(ordenes(container)).toEqual([2, 0, 1]);
  });

  it("con «reducir movimiento» el giro ocurre de una vez, sin animar", () => {
    hook.quieto = true;
    const { container } = montar();
    fireEvent.click(siguiente());
    expect(indicador()).toHaveTextContent("2 de 3");
    expect(ordenes(container)).toEqual([2, 0, 1]);
    expect(pista(container).style.transition).toBe("none");
    fireEvent.click(anterior());
    fireEvent.click(anterior());
    expect(indicador()).toHaveTextContent("3 de 3");
  });

  it("las flechas del teclado, en la pista, giran en los dos sentidos", () => {
    const { container } = montar();
    fireEvent.keyDown(pista(container), { key: "ArrowRight" });
    terminar(container);
    expect(indicador()).toHaveTextContent("2 de 3");
    fireEvent.keyDown(pista(container), { key: "ArrowLeft" });
    terminar(container);
    expect(indicador()).toHaveTextContent("1 de 3");
    // Con un modificador no es nuestra tecla.
    fireEvent.keyDown(pista(container), { key: "ArrowRight", ctrlKey: true });
    expect(indicador()).toHaveTextContent("1 de 3");
  });

  it("arrastrar con el dedo gira: a la izquierda avanza, a la derecha retrocede, y un roce no cuenta", () => {
    const { container } = montar();
    const p = pista(container);
    fireEvent.pointerDown(p, { clientX: 300 });
    fireEvent.pointerUp(p, { clientX: 240 });
    terminar(container);
    expect(indicador()).toHaveTextContent("2 de 3");
    fireEvent.pointerDown(p, { clientX: 100 });
    fireEvent.pointerUp(p, { clientX: 160 });
    terminar(container);
    expect(indicador()).toHaveTextContent("1 de 3");
    fireEvent.pointerDown(p, { clientX: 100 });
    fireEvent.pointerUp(p, { clientX: 120 });
    expect(indicador()).toHaveTextContent("1 de 3");
  });

  it("un arrastre que giró el carrusel no cuenta como clic sobre el enlace de la tarjeta; un toque sí", () => {
    const { container } = render(
      <CarruselDeMuestras etiquetas={etiquetas(N)}>
        {Array.from({ length: N }, (_, i) => (
          <article key={i}>
            <a href={`#app-${i + 1}`}>App {i + 1}</a>
          </article>
        ))}
      </CarruselDeMuestras>,
    );
    const p = pista(container);
    const enlace = screen.getByRole("link", { name: "App 1" });
    // Un toque (sin arrastre): el clic sigue su camino.
    fireEvent.pointerDown(p, { clientX: 300 });
    fireEvent.pointerUp(p, { clientX: 302 });
    expect(fireEvent.click(enlace)).toBe(true);
    // Un arrastre de 60 px: gira y su clic se descarta.
    fireEvent.pointerDown(p, { clientX: 300 });
    fireEvent.pointerUp(p, { clientX: 240 });
    expect(fireEvent.click(enlace)).toBe(false);
    terminar(container);
    expect(indicador()).toHaveTextContent("2 de 3");
    // Y el arrastre nativo del enlace se cancela para que el puntero no se pierda.
    expect(fireEvent.dragStart(enlace)).toBe(false);
  });

  it("la pista se alcanza con el teclado (foco) y tiene nombre", () => {
    const { container } = montar();
    const carrusel = container.querySelector(
      '[aria-roledescription="carousel"]',
    ) as HTMLElement;
    const grupo = within(carrusel).getAllByRole("group")[0];
    expect(grupo).toHaveAttribute("tabindex", "0");
    expect(grupo).toHaveAttribute("aria-label", "Apps profesionales");
  });

  it("nada se mueve solo: ningún temporizador ni rotación automática", () => {
    vi.useFakeTimers();
    const { container } = montar();
    act(() => void vi.advanceTimersByTime(60_000));
    expect(indicador()).toHaveTextContent("1 de 3");
    expect(ordenes(container)).toEqual([0, 1, 2]);
  });
});

describe("CarruselDeMuestras — con una sola tarjeta", () => {
  it("sin botones, sin indicador, sin velo, sin foco y sin roles de carrusel", () => {
    const { container } = montar(1);
    expect(screen.queryByRole("button")).toBeNull();
    expect(screen.queryByRole("status")).toBeNull();
    expect(container.querySelector("[aria-roledescription]")).toBeNull();
    expect(container.querySelector("[tabindex]")).toBeNull();
    expect(container.querySelector("[role]")).toBeNull();
    expect(container.querySelector(".after\\:absolute")).toBeNull();
    // La tarjeta sigue ahí.
    expect(container.querySelectorAll("[data-muestra-slug]")).toHaveLength(1);
  });
});
