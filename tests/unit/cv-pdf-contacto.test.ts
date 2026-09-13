import { describe, expect, it } from "vitest";
import { lineaDeContacto } from "../../scripts/generate-cv-pdf.mjs";

/**
 * La cabecera del PDF (revisión post-S8, bloque D): el dominio del sitio va
 * PRIMERO cuando existe —llega por `NEXT_PUBLIC_SITE_URL` en el build, nunca
 * escrito en el repo (regla 16)— y no aparece en local ni sin variable.
 */
const identidad = {
  email: "correo@ejemplo.test",
  enlaces: [
    { etiqueta: "LinkedIn", url: "https://www.linkedin.com/in/alguien" },
    { etiqueta: "GitHub", url: "https://github.com/alguien/" },
  ],
};

describe("lineaDeContacto del PDF", () => {
  it("con URL pública, el dominio va destacado y primero; el resto sin protocolo", () => {
    const linea = lineaDeContacto(identidad, "https://www.ejemplo.test/");
    expect(linea.destacado).toBe("ejemplo.test");
    expect(linea.resto).toEqual([
      "correo@ejemplo.test",
      "linkedin.com/in/alguien",
      "github.com/alguien",
    ]);
  });

  it("sin variable, o en localhost, no hay dominio que destacar", () => {
    expect(lineaDeContacto(identidad, undefined).destacado).toBeNull();
    expect(
      lineaDeContacto(identidad, "http://localhost:3000").destacado,
    ).toBeNull();
    expect(lineaDeContacto(identidad, "no es una url").destacado).toBeNull();
  });
});
