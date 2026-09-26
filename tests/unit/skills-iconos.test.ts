import { describe, expect, it } from "vitest";
import { tieneDibujo } from "@/components/home/skills-iconos";
import { getCv } from "@/lib/content";

/**
 * CADA GRUPO DE SKILLS TIENE SU ICONO (2026-09-26). Los iconos iban por
 * posición, y el 2026-09-20 un grupo nuevo entró quinto: «Procesos y
 * simulación» se quedó con el dibujo de «Cómo trabajo» y «Cómo trabajo» con
 * el rombo de reserva, en producción, sin que nada lo dijera. Ahora van por
 * `id`, y este test no deja pasar un grupo sin su dibujo: el rombo sigue ahí
 * para que la página no se rompa, pero no llega a `main`.
 */
describe("iconos de los grupos de skills", () => {
  for (const locale of ["es", "en"] as const) {
    it(`cada grupo de cv.${locale}.yaml tiene su propio dibujo`, () => {
      const sinDibujo = getCv(locale)
        .skills.map((g) => g.id)
        .filter((id) => !tieneDibujo(id));
      expect(
        sinDibujo,
        "grupos que caerían en el rombo de reserva: dibuja su icono en src/components/home/skills-iconos.tsx",
      ).toEqual([]);
    });
  }

  it("un id que no existe no tiene dibujo (el test de arriba puede fallar)", () => {
    expect(tieneDibujo("grupo-inventado")).toBe(false);
    // `constructor` existe en todo objeto: sin `Object.hasOwn` pasaría.
    expect(tieneDibujo("constructor")).toBe(false);
  });
});
