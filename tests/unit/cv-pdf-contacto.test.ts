import { describe, expect, it } from "vitest";
import {
  inicioCentrado,
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
    // Lo que se muestra va sin protocolo; a donde lleva el enlace, completo.
    expect(linea.origen).toBe("https://www.ejemplo.test");
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
    expect(lineaDeContacto(identidad, "no es una url").origen).toBeNull();
  });
});

describe("perfilParaPdf: el cierre del chat se vuelve el sitio", () => {
  const labels = {
    masEnMiSitio: "Más en mi sitio:",
    masEnMiSitioWeb: "Más en mi sitio web.",
    cierreChat: /\s*¿Quieres saber algo más\?[^.]*\./,
  };
  const perfil =
    "Ingeniero con diez años. ¿Quieres saber algo más? Pregúntaselo al chat de esta hoja de vida.";

  it("con dominio, la frase del chat se reemplaza por «Más en mi sitio: dominio»", () => {
    expect(perfilParaPdf(perfil, labels, "ejemplo.test")).toBe(
      "Ingeniero con diez años. Más en mi sitio: ejemplo.test.",
    );
  });

  it("sin dominio todavía, el anuncio va igual: «Más en mi sitio web.»", () => {
    expect(perfilParaPdf(perfil, labels, null)).toBe(
      "Ingeniero con diez años. Más en mi sitio web.",
    );
  });

  it("un perfil sin la frase del chat también recibe el anuncio", () => {
    expect(perfilParaPdf("Texto plano.", labels, null)).toBe(
      "Texto plano. Más en mi sitio web.",
    );
  });
});

// El rótulo bajo el bloque del dominio (2026-09-26, pedido del dueño):
// centrado respecto al recuadro azul, nunca más allá del margen derecho.
describe("inicioCentrado: el rótulo, centrado bajo el recuadro del dominio", () => {
  it("una línea más angosta que el bloque queda con el mismo aire a cada lado", () => {
    // Bloque de 400 a 550; línea de 100 → empieza en 425 y termina en 525.
    expect(inicioCentrado(400, 150, 100, 555)).toBe(425);
  });

  it("una línea más ancha que el bloque se centra igual si cabe", () => {
    expect(inicioCentrado(400, 100, 140, 600)).toBe(380);
  });

  it("si centrada pasaría el margen derecho, se corre lo justo", () => {
    // Centrada empezaría en 380 y terminaría en 560: el borde es 555.
    expect(inicioCentrado(400, 150, 180, 555)).toBe(375);
  });
});
