import { cleanup, fireEvent, render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it } from "vitest";
import { MarcoDeSimulacion } from "@/components/vitrina/marco-de-simulacion";

/**
 * EL MARCO DE UNA SIMULACIÓN (2026-10-12): fachada. El paquete no se carga
 * hasta que el visitante lo pide, y el foco no se pierde al abrirlo.
 */
const montar = () =>
  render(
    <MarcoDeSimulacion
      src="/piezas/planlang/es.html"
      titulo="Simulación de planlang"
      etiquetas={{
        abrirAqui: "Abrir la simulación aquí",
        abrirCompleta: "Abrir la simulación a pantalla completa",
        panelLinea: "Se carga cuando la abres.",
      }}
    />,
  );

afterEach(cleanup);

describe("MarcoDeSimulacion", () => {
  it("de entrada no hay marco: el panel ofrece abrirla aquí o a pantalla completa", () => {
    const { container } = montar();
    expect(container.querySelector("iframe")).toBeNull();
    expect(
      screen.getByRole("button", { name: "Abrir la simulación aquí" }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("link", {
        name: "Abrir la simulación a pantalla completa",
      }),
    ).toHaveAttribute("href", "/piezas/planlang/es.html");
  });

  it("al pulsar, nace el marco con su archivo y su nombre, y recibe el foco", () => {
    montar();
    const boton = screen.getByRole("button", {
      name: "Abrir la simulación aquí",
    });
    boton.focus();
    fireEvent.click(boton);
    const marco = screen.getByTitle("Simulación de planlang");
    expect(marco.tagName).toBe("IFRAME");
    expect(marco).toHaveAttribute("src", "/piezas/planlang/es.html");
    expect(document.activeElement).toBe(marco);
    expect(
      screen.queryByRole("button", { name: "Abrir la simulación aquí" }),
    ).toBeNull();
    // Abierto, la pantalla completa sigue a mano.
    expect(
      screen.getByRole("link", {
        name: "Abrir la simulación a pantalla completa",
      }),
    ).toHaveAttribute("href", "/piezas/planlang/es.html");
  });
});
