import { describe, expect, it } from "vitest";
import { numerarSecciones } from "@/lib/vitrina/ficha-tecnica/secciones";

/**
 * Tres secciones opcionales (proceso · conclusiones · galería). Sin ellas, las
 * demás se renumeran seguidas — nunca un hueco (01 · 03 · 04 · 05).
 */
const todas = { proceso: true, conclusiones: true, galeria: true };
const ninguna = { proceso: false, conclusiones: false, galeria: false };

describe("numerarSecciones", () => {
  it("con todo: las siete, 01…07, en el orden de la ficha", () => {
    expect(numerarSecciones(todas)).toEqual({
      s01: "01",
      s02: "02",
      conclusiones: "03",
      s03: "04",
      galeria: "05",
      s04: "06",
      s05: "07",
    });
  });

  it("una app sin conclusiones ni galería: cinco seguidas (lo de siempre)", () => {
    const n = numerarSecciones({
      ...todas,
      conclusiones: false,
      galeria: false,
    });
    expect([n.s01, n.s02, n.s03, n.s04, n.s05]).toEqual([
      "01",
      "02",
      "03",
      "04",
      "05",
    ]);
    expect(n.conclusiones).toBeUndefined();
    expect(n.galeria).toBeUndefined();
  });

  it("una investigación (nada opcional): cuatro seguidas", () => {
    const n = numerarSecciones(ninguna);
    expect([n.s01, n.s03, n.s04, n.s05]).toEqual(["01", "02", "03", "04"]);
    expect([n.s02, n.conclusiones, n.galeria]).toEqual([
      undefined,
      undefined,
      undefined,
    ]);
  });

  it("un tablero (conclusiones y galería, sin proceso): seis seguidas", () => {
    const n = numerarSecciones({ ...todas, proceso: false });
    expect([n.s01, n.conclusiones, n.s03, n.galeria, n.s04, n.s05]).toEqual([
      "01",
      "02",
      "03",
      "04",
      "05",
      "06",
    ]);
    expect(n.s02).toBeUndefined();
  });
});
