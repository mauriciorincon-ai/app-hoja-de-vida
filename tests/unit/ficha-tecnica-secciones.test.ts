import { describe, expect, it } from "vitest";
import { numerarSecciones } from "@/lib/vitrina/ficha-tecnica/secciones";

/**
 * v1.1.0: el proceso es opcional. Sin él, «Cómo funciona» no existe y las
 * demás secciones se renumeran — nunca un hueco (01 · 03 · 04 · 05).
 */
describe("numerarSecciones", () => {
  it("con proceso: las cinco, 01…05", () => {
    expect(numerarSecciones(true)).toEqual({
      s01: "01",
      s02: "02",
      s03: "03",
      s04: "04",
      s05: "05",
    });
  });

  it("sin proceso: cuatro seguidas y el proceso sin número", () => {
    const n = numerarSecciones(false);
    expect(n.s02).toBeUndefined();
    expect([n.s01, n.s03, n.s04, n.s05]).toEqual(["01", "02", "03", "04"]);
  });
});
