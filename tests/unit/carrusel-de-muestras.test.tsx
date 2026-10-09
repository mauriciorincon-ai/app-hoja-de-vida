import {
  act,
  cleanup,
  fireEvent,
  render,
  screen,
} from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import {
  CarruselDeMuestras,
  type EtiquetasCarruselMuestras,
} from "@/components/vitrina/carrusel-de-muestras";

/**
 * EL CARRUSEL DE MUESTRAS DE APP (post-S9) — tres posiciones y vuelta con barrido.
 *
 * `i` es la primera tarjeta visible y `k` cuántas enteras caben; `max = N − k`.
 * INICIO (`i = 0`): borde izquierdo limpio. INTERMEDIO: pedazos a los dos lados.
 * FINAL (`i = max`): el espejo del inicio. Desde el final «siguiente» regresa
 * al inicio con un barrido rápido; desde el inicio «anterior» barre al final.
 * jsdom no mide: el test fija los anchos que el componente lee (`offsetWidth`)
 * para que `k` salga como en un navegador. El DOM siempre tiene las N tarjetas
 * reales, sin copias.
 */
const hook = vi.hoisted(() => ({ quieto: false as boolean | null }));
vi.mock("@/components/motion/use-prefiere-quieto", () => ({
  usePrefiereQuieto: () => hook.quieto,
}));

/** Anchos que lee el componente: la pista y cada tarjeta. */
const ancho = vi.hoisted(() => ({ pista: 976, tarjeta: 425 }));
let offsetWidth: PropertyDescriptor | undefined;

beforeEach(() => {
  hook.quieto = false;
  offsetWidth = Object.getOwnPropertyDescriptor(
    HTMLElement.prototype,
    "offsetWidth",
  );
  Object.defineProperty(HTMLElement.prototype, "offsetWidth", {
    configurable: true,
    get(this: HTMLElement) {
      if (this.hasAttribute("data-pista")) return ancho.pista;
      if (this.hasAttribute("data-tarjeta")) return ancho.tarjeta;
      return 0;
    },
  });
});
afterEach(() => {
  cleanup();
  vi.useRealTimers();
  if (offsetWidth)
    Object.defineProperty(HTMLElement.prototype, "offsetWidth", offsetWidth);
});

/** Escritorio: caben 2 enteras (con 3 tarjetas: max = 1). */
const escritorio = () => Object.assign(ancho, { pista: 976, tarjeta: 425 });
/** Teléfono: cabe 1 entera (con 3 tarjetas: max = 2). */
const telefono = () => Object.assign(ancho, { pista: 358, tarjeta: 286 });

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
const envoltura = (c: HTMLElement) => pista(c).parentElement as HTMLElement;
const raiz = (c: HTMLElement) =>
  c.querySelector("[data-carrusel-apps]") as HTMLElement;
const siguiente = () =>
  screen.getByRole("button", { name: "Tarjeta siguiente" });
const anterior = () => screen.getByRole("button", { name: "Tarjeta anterior" });
const indicador = () => screen.getByRole("status");
const lejos = (c: HTMLElement) => envoltura(c).hasAttribute("data-lejos");
const final = (c: HTMLElement) => envoltura(c).hasAttribute("data-final");
const posicion = (c: HTMLElement) => Number(raiz(c).getAttribute("data-i"));

describe("CarruselDeMuestras — con varias tarjetas", () => {
  it("es un grupo «carousel» con nombre y cada tarjeta es un «slide» con su «n de N» por su índice real", () => {
    escritorio();
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
    // El DOM tiene EXACTAMENTE las N tarjetas, sin copias, en su orden.
    expect(
      [...carrusel.querySelectorAll("[data-muestra-slug]")].map((a) =>
        a.getAttribute("data-muestra-slug"),
      ),
    ).toEqual(["app-1", "app-2", "app-3"]);
  });

  it("los dos botones tienen nombre accesible y NINGUNO se deshabilita nunca, en ninguna posición", () => {
    escritorio();
    const { container } = montar();
    for (let n = 0; n < 2 * N; n++) {
      expect(anterior()).toBeEnabled();
      expect(siguiente()).toBeEnabled();
      fireEvent.click(siguiente());
    }
    expect(container.querySelectorAll("[data-tarjeta]")).toHaveLength(N);
  });

  it("el indicador es un «status» educado y arranca en «1 de N»", () => {
    escritorio();
    montar();
    expect(indicador()).toHaveAttribute("aria-live", "polite");
    expect(indicador()).toHaveTextContent("1 de 3");
  });

  it("EL INICIO: borde izquierdo limpio —sin velo izquierdo— y velo derecho encendido, con la transición apagada", () => {
    escritorio();
    const { container } = montar();
    expect(posicion(container)).toBe(0);
    expect(raiz(container)).toHaveAttribute("data-max", "1");
    expect(lejos(container)).toBe(false);
    expect(final(container)).toBe(false);
    expect(pista(container).style.transform).toContain("0 * var(--paso)");
    expect(pista(container).style.transform).toContain("0 * var(--o)");
    expect(pista(container).style.transition).toBe("none");
  });

  it("EL FINAL es el espejo del inicio: velo izquierdo sí, velo derecho no y la pista pegada a la derecha (2·o)", () => {
    escritorio();
    const { container } = montar();
    fireEvent.click(siguiente());
    expect(posicion(container)).toBe(1);
    expect(lejos(container)).toBe(true);
    expect(final(container)).toBe(true);
    expect(pista(container).style.transform).toContain("-1 * var(--paso)");
    expect(pista(container).style.transform).toContain("2 * var(--o)");
    expect(pista(container).style.transition).toContain("320ms");
    expect(indicador()).toHaveTextContent("2 de 3");
  });

  it("en el INTERMEDIO (teléfono: 3 posiciones) hay velo a los dos lados y la pista va centrada (1·o)", () => {
    telefono();
    const { container } = montar();
    expect(raiz(container)).toHaveAttribute("data-max", "2");
    fireEvent.click(siguiente());
    expect(posicion(container)).toBe(1);
    expect(lejos(container)).toBe(true);
    expect(final(container)).toBe(false);
    expect(pista(container).style.transform).toContain("1 * var(--o)");
    fireEvent.click(siguiente());
    expect(posicion(container)).toBe(2);
    expect(final(container)).toBe(true);
    expect(pista(container).style.transform).toContain("2 * var(--o)");
  });

  it("desde el FINAL, «siguiente» regresa al inicio con un BARRIDO acelerado (560 ms)", () => {
    escritorio();
    const { container } = montar();
    fireEvent.click(siguiente()); // inicio → final: paso normal
    expect(pista(container).style.transition).toContain("320ms");
    fireEvent.click(siguiente()); // final → inicio: barrido
    expect(posicion(container)).toBe(0);
    expect(pista(container).style.transition).toContain("560ms");
    expect(pista(container).style.transition).toContain("ease-in-out");
    expect(lejos(container)).toBe(false);
    expect(final(container)).toBe(false);
    expect(indicador()).toHaveTextContent("1 de 3");
  });

  it("desde el INICIO, «anterior» barre hasta el final", () => {
    escritorio();
    const { container } = montar();
    fireEvent.click(anterior());
    expect(posicion(container)).toBe(1);
    expect(pista(container).style.transition).toContain("560ms");
    expect(final(container)).toBe(true);
    // Un paso hacia atrás desde el final es normal.
    fireEvent.click(anterior());
    expect(posicion(container)).toBe(0);
    expect(pista(container).style.transition).toContain("320ms");
  });

  it("con «reducir movimiento» el giro ocurre sin transición, en las mismas posiciones", () => {
    hook.quieto = true;
    escritorio();
    const { container } = montar();
    fireEvent.click(siguiente());
    expect(posicion(container)).toBe(1);
    expect(pista(container).style.transition).toBe("none");
    fireEvent.click(siguiente());
    expect(posicion(container)).toBe(0);
    expect(pista(container).style.transition).toBe("none");
  });

  it("si caben todas las tarjetas los botones siguen habilitados pero no mueven nada", () => {
    Object.assign(ancho, { pista: 1500, tarjeta: 425 }); // k = 3 = N → max 0
    const { container } = montar();
    expect(raiz(container)).toHaveAttribute("data-max", "0");
    fireEvent.click(siguiente());
    expect(posicion(container)).toBe(0);
    expect(final(container)).toBe(true); // nada detrás ni delante: sin velos
    expect(lejos(container)).toBe(false);
    expect(siguiente()).toBeEnabled();
  });

  it("las flechas del teclado, en la pista, giran en los dos sentidos", () => {
    telefono();
    const { container } = montar();
    fireEvent.keyDown(pista(container), { key: "ArrowRight" });
    expect(indicador()).toHaveTextContent("2 de 3");
    fireEvent.keyDown(pista(container), { key: "ArrowLeft" });
    expect(indicador()).toHaveTextContent("1 de 3");
    // Con un modificador no es nuestra tecla.
    fireEvent.keyDown(pista(container), { key: "ArrowRight", ctrlKey: true });
    expect(indicador()).toHaveTextContent("1 de 3");
  });

  it("arrastrar con el dedo gira: a la izquierda avanza, a la derecha retrocede, y un roce no cuenta", () => {
    telefono();
    const { container } = montar();
    const p = pista(container);
    fireEvent.pointerDown(p, { clientX: 300 });
    fireEvent.pointerUp(p, { clientX: 240 });
    expect(indicador()).toHaveTextContent("2 de 3");
    fireEvent.pointerDown(p, { clientX: 100 });
    fireEvent.pointerUp(p, { clientX: 160 });
    expect(indicador()).toHaveTextContent("1 de 3");
    fireEvent.pointerDown(p, { clientX: 100 });
    fireEvent.pointerUp(p, { clientX: 120 });
    expect(indicador()).toHaveTextContent("1 de 3");
  });

  it("un arrastre que giró el carrusel no cuenta como clic sobre el enlace de la tarjeta; un toque sí", () => {
    telefono();
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
    fireEvent.pointerDown(p, { clientX: 300 });
    fireEvent.pointerUp(p, { clientX: 302 });
    expect(fireEvent.click(enlace)).toBe(true);
    fireEvent.pointerDown(p, { clientX: 300 });
    fireEvent.pointerUp(p, { clientX: 240 });
    expect(fireEvent.click(enlace)).toBe(false);
    expect(indicador()).toHaveTextContent("2 de 3");
    // Y el arrastre nativo del enlace se cancela para que el puntero no se pierda.
    expect(fireEvent.dragStart(enlace)).toBe(false);
  });

  it("la pista se alcanza con el teclado (foco) y tiene nombre", () => {
    escritorio();
    const { container } = montar();
    expect(pista(container)).toHaveAttribute("tabindex", "0");
    expect(pista(container)).toHaveAttribute(
      "aria-label",
      "Apps profesionales",
    );
  });

  it("si el foco cae en una tarjeta fuera de la vista, el carrusel la trae a la vista", () => {
    escritorio();
    const { container } = montar();
    const tercera = container.querySelector('[data-tarjeta="3"]')!;
    vi.spyOn(tercera, "getBoundingClientRect").mockReturnValue({
      left: 900,
      right: 1325,
    } as DOMRect);
    vi.spyOn(envoltura(container), "getBoundingClientRect").mockReturnValue({
      left: 0,
      right: 1024,
    } as DOMRect);
    fireEvent.focus(tercera.querySelector("h3")!);
    expect(posicion(container)).toBe(1); // la última posición: la 3.ª queda entera a la derecha
  });

  it("nada se mueve solo: ningún temporizador ni rotación automática", () => {
    vi.useFakeTimers();
    escritorio();
    const { container } = montar();
    act(() => void vi.advanceTimersByTime(60_000));
    expect(indicador()).toHaveTextContent("1 de 3");
    expect(posicion(container)).toBe(0);
  });
});

describe("CarruselDeMuestras — la rueda y el trackpad", () => {
  const rueda = (c: HTMLElement, init: WheelEventInit) =>
    fireEvent.wheel(envoltura(c), init);

  it("el gesto LATERAL avanza UNA tarjeta, y la cola de inercia no gira más", () => {
    vi.useFakeTimers();
    telefono();
    const { container } = montar();
    // Un deslizamiento con inercia: muchos eventos seguidos y decrecientes.
    for (const dx of [40, 80, 60, 40, 30, 20, 10, 5]) {
      rueda(container, { deltaX: dx });
      act(() => void vi.advanceTimersByTime(16));
    }
    expect(indicador()).toHaveTextContent("2 de 3");
  });

  it("tras un instante de silencio un gesto nuevo gira otra vez, y hacia el otro lado retrocede", () => {
    vi.useFakeTimers();
    telefono();
    const { container } = montar();
    rueda(container, { deltaX: 60 });
    expect(indicador()).toHaveTextContent("2 de 3");
    act(() => void vi.advanceTimersByTime(250));
    rueda(container, { deltaX: -60 });
    expect(indicador()).toHaveTextContent("1 de 3");
  });

  it("un roce por debajo del umbral no gira", () => {
    telefono();
    const { container } = montar();
    rueda(container, { deltaX: 8 });
    expect(indicador()).toHaveTextContent("1 de 3");
  });

  it("el gesto lateral se cancela (preventDefault): no dispara el «atrás» del navegador", () => {
    telefono();
    const { container } = montar();
    expect(rueda(container, { deltaX: 60, cancelable: true })).toBe(false);
  });

  it("la rueda VERTICAL no gira y no se cancela: la página sigue bajando", () => {
    telefono();
    const { container } = montar();
    expect(rueda(container, { deltaY: 300, cancelable: true })).toBe(true);
    expect(indicador()).toHaveTextContent("1 de 3");
    // Un gesto diagonal con más vertical que lateral tampoco.
    expect(
      rueda(container, { deltaX: 40, deltaY: 120, cancelable: true }),
    ).toBe(true);
    expect(indicador()).toHaveTextContent("1 de 3");
  });

  it("Shift + rueda de un ratón (vertical) hace de lateral", () => {
    telefono();
    const { container } = montar();
    rueda(container, { deltaY: 100, shiftKey: true });
    expect(indicador()).toHaveTextContent("2 de 3");
  });

  it("desde el final, el gesto lateral también regresa al inicio con el barrido", () => {
    vi.useFakeTimers();
    escritorio();
    const { container } = montar();
    rueda(container, { deltaX: 60 });
    expect(final(container)).toBe(true);
    act(() => void vi.advanceTimersByTime(250));
    rueda(container, { deltaX: 60 });
    expect(posicion(container)).toBe(0);
    expect(pista(container).style.transition).toContain("560ms");
  });
});

describe("CarruselDeMuestras — con una sola tarjeta", () => {
  it("sin botones, sin indicador, sin velos, sin foco y sin roles de carrusel", () => {
    escritorio();
    const { container } = montar(1);
    expect(screen.queryByRole("button")).toBeNull();
    expect(screen.queryByRole("status")).toBeNull();
    expect(container.querySelector("[aria-roledescription]")).toBeNull();
    expect(container.querySelector("[tabindex]")).toBeNull();
    expect(container.querySelector("[role]")).toBeNull();
    expect(container.querySelector(".after\\:absolute")).toBeNull();
    expect(container.querySelector("[data-lejos],[data-final]")).toBeNull();
    // La tarjeta sigue ahí.
    expect(container.querySelectorAll("[data-muestra-slug]")).toHaveLength(1);
  });
});
