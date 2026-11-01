import { describe, expect, it } from "vitest";
import { rutaEnIdioma } from "@/lib/brochure/ruta";

/**
 * UN ENLACE INTERNO JAMÁS LLEVA A UNA REDIRECCIÓN (S30, hallazgo de la auditoría). El botón «Escríbeme» de
 * la casa salía `/es/#contacto`: la barra final se redirige con un 308 a `/es`. La ancla de la HOME se
 * escribe `/es#contacto`.
 */
describe("rutaEnIdioma", () => {
  it("una ruta del sitio recibe el prefijo del idioma", () => {
    expect(rutaEnIdioma("es", "/portafolio/apps")).toBe("/es/portafolio/apps");
    expect(rutaEnIdioma("en", "/portafolio/apps/habla")).toBe(
      "/en/portafolio/apps/habla",
    );
  });

  it("una ancla de la HOME no lleva barra antes del # (esa barra redirige)", () => {
    expect(rutaEnIdioma("es", "/#contacto")).toBe("/es#contacto");
    expect(rutaEnIdioma("en", "/#contacto")).toBe("/en#contacto");
  });

  it("el rojo del gate: la forma vieja SÍ llevaba la barra", () => {
    expect(`/${"es"}${"/#contacto"}`).toBe("/es/#contacto");
    expect(rutaEnIdioma("es", "/#contacto")).not.toMatch(/\/#/);
  });
});
