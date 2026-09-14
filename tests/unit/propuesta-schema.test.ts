import { describe, expect, it } from "vitest";
import { propuestaSchema } from "@/lib/propuestas";

/**
 * Propuesta de funcionalidad (2026-09-13, dueño): una caja de texto debajo
 * del roadmap de cada app hermana. Solo el texto es obligatorio; el correo es
 * opcional (por si quiere enterarse). Nada se publica ni se guarda en BD.
 */
const valida = {
  app: "habla",
  propuesta: "Que la app lea cuentos con la voz de la abuela.",
  email: "",
  website: "",
};

describe("propuestaSchema", () => {
  it("accepts a proposal with only the text and the app", () => {
    const p = propuestaSchema.parse(valida);
    expect(p.email).toBe("");
    expect(p.propuesta).toContain("abuela");
  });

  it("trims and requires a real text: fewer than 10 characters is not a proposal", () => {
    expect(() =>
      propuestaSchema.parse({ ...valida, propuesta: "   hola   " }),
    ).toThrow(/propuesta/);
  });

  it("caps the text at 500 characters", () => {
    expect(() =>
      propuestaSchema.parse({ ...valida, propuesta: "x".repeat(501) }),
    ).toThrow();
  });

  it("email is optional but, if present, must be valid", () => {
    expect(
      propuestaSchema.parse({ ...valida, email: "ana@example.com" }).email,
    ).toBe("ana@example.com");
    expect(() =>
      propuestaSchema.parse({ ...valida, email: "no-es-correo" }),
    ).toThrow();
  });

  it("rejects a filled honeypot and a non-slug app", () => {
    expect(() =>
      propuestaSchema.parse({ ...valida, website: "http://spam.example" }),
    ).toThrow();
    expect(() =>
      propuestaSchema.parse({ ...valida, app: "Habla App" }),
    ).toThrow();
  });
});
