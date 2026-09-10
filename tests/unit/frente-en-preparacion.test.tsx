import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { FrenteEnPreparacion } from "@/components/vitrina/frente-en-preparacion";

/**
 * La rama «en preparación» de `/vitrina/<frente>` se quedó SIN SUJETO cuando
 * los cuatro frentes abrieron (S7): ninguna prueba e2e la ejerce. Esta la
 * mantiene en la red hasta que nazca un quinto frente.
 */
describe("FrenteEnPreparacion — el inicio de un frente, sin disfraz", () => {
  it("es una sección con su encabezado accesible, el título y la línea", () => {
    render(
      <FrenteEnPreparacion
        titulo="Este frente empieza"
        linea="No hay fecha prometida. Si te interesa, la lista de espera está abajo."
      />,
    );
    const seccion = screen.getByRole("region", { name: "Este frente empieza" });
    expect(seccion).toHaveAttribute("data-frente-empieza");
    expect(seccion).toHaveTextContent("No hay fecha prometida");
    expect(screen.getByRole("heading", { level: 2 })).toHaveTextContent(
      "Este frente empieza",
    );
  });

  it("no promete nada: ni fecha, ni enlace hacia afuera", () => {
    const { container } = render(
      <FrenteEnPreparacion titulo="Empieza" linea="Sin fecha." />,
    );
    expect(container.querySelector("a[href^='http']")).toBeNull();
    expect(container.textContent).not.toMatch(/\d{4}/);
  });
});
