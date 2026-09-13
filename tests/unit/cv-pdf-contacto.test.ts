import { describe, expect, it } from "vitest";
import {
  lineaDeContacto,
  perfilParaPdf,
} from "../../scripts/generate-cv-pdf.mjs";

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

describe("perfilParaPdf: el cierre del chat se vuelve el sitio", () => {
  const labels = {
    masEnMiSitio: "Más en mi sitio:",
    cierreChat: /\s*¿Quieres saber algo más\?[^.]*\./,
  };
  const perfil =
    "Ingeniero con diez años. ¿Quieres saber algo más? Pregúntaselo al chat de esta hoja de vida.";

  it("con dominio, la frase del chat se reemplaza por «Más en mi sitio: dominio»", () => {
    expect(perfilParaPdf(perfil, labels, "ejemplo.test")).toBe(
      "Ingeniero con diez años. Más en mi sitio: ejemplo.test.",
    );
  });

  it("sin dominio, la frase del chat simplemente no va", () => {
    expect(perfilParaPdf(perfil, labels, null)).toBe(
      "Ingeniero con diez años.",
    );
  });

  it("un perfil sin esa frase queda intacto", () => {
    expect(perfilParaPdf("Texto plano.", labels, null)).toBe("Texto plano.");
  });
});
