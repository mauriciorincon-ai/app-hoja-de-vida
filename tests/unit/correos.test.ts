// @vitest-environment node
import { describe, expect, it } from "vitest";
import { correosPublicos, dominioPropio } from "../../scripts/correos.mjs";
import { getCv } from "@/lib/content";
import { cvSchema } from "@/lib/schemas";

/**
 * LOS CORREOS PÚBLICOS (2026-09-26). El sitio y el PDF muestran dos: el del
 * dominio y el Gmail. El del dominio se ARMA con el dominio de la URL del
 * sitio, porque la regla 16 no deja escribirlo en el repo; y donde no hay
 * dominio propio no se inventa una dirección que no recibe.
 */
const identidad = { email: "correo@ejemplo.test", emailDelDominio: "hola" };

describe("dominioPropio — solo un dominio que de verdad recibe correo", () => {
  it("toma el host de la URL, sin www", () => {
    expect(dominioPropio("https://www.misitio.test/es")).toBe("misitio.test");
    expect(dominioPropio("https://misitio.test")).toBe("misitio.test");
  });

  it("local, una IP, un host sin punto o el subdominio del proveedor: no hay dominio", () => {
    expect(dominioPropio("http://localhost:3000")).toBeNull();
    expect(dominioPropio("http://127.0.0.1:3000")).toBeNull();
    expect(dominioPropio("http://intranet")).toBeNull();
    expect(dominioPropio(`https://mi-proyecto.${"vercel"}.app`)).toBeNull();
    expect(dominioPropio(undefined)).toBeNull();
    expect(dominioPropio("no es una url")).toBeNull();
  });
});

describe("correosPublicos", () => {
  it("con dominio propio: el del dominio primero, el Gmail después", () => {
    expect(correosPublicos(identidad, "https://misitio.test")).toEqual([
      "hola@misitio.test",
      "correo@ejemplo.test",
    ]);
  });

  it("sin dominio propio, solo el Gmail: nunca una dirección que no recibe", () => {
    expect(correosPublicos(identidad, "http://localhost:3000")).toEqual([
      "correo@ejemplo.test",
    ]);
    expect(
      correosPublicos(identidad, `https://mi-proyecto.${"vercel"}.app`),
    ).toEqual(["correo@ejemplo.test"]);
  });

  it("sin emailDelDominio en los datos, solo el Gmail", () => {
    expect(
      correosPublicos({ email: "correo@ejemplo.test" }, "https://misitio.test"),
    ).toEqual(["correo@ejemplo.test"]);
  });
});

describe("emailDelDominio en cv.yaml — la parte local y nada más", () => {
  it("los dos idiomas llevan la misma", () => {
    expect(getCv("en").identidad.emailDelDominio).toBe(
      getCv("es").identidad.emailDelDominio,
    );
    expect(getCv("es").identidad.emailDelDominio).toBeTruthy();
  });

  it("una dirección entera (con arroba y dominio) no pasa el esquema: el dominio no entra al repo", () => {
    const base = getCv("es");
    const conDominio = {
      ...base,
      identidad: { ...base.identidad, emailDelDominio: "hola@misitio.test" },
    };
    expect(cvSchema.safeParse(conDominio).success).toBe(false);
  });
});
