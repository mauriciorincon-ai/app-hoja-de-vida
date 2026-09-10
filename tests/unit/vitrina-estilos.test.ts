import { describe, expect, it } from "vitest";
import { COLOR_ESTADO, intlLocale } from "@/lib/vitrina/estilos";

describe("lib/vitrina/estilos — lo que antes vivía repetido en tres componentes", () => {
  it("cada estado de pieza tiene su pareja de clases, y solo esas dos", () => {
    expect(Object.keys(COLOR_ESTADO).sort()).toEqual(["inicial", "sellado"]);
    expect(COLOR_ESTADO.sellado).toMatch(/sage/);
    expect(COLOR_ESTADO.inicial).toMatch(/citron/);
  });

  it("las cifras se formatean en es-CO y en-US — no en el «es» genérico", () => {
    expect(intlLocale("es")).toBe("es-CO");
    expect(intlLocale("en")).toBe("en-US");
    // Los separadores se invierten de verdad entre los dos: punto de miles y
    // coma decimal en Colombia; al revés en EE. UU.
    expect((1234.5).toLocaleString(intlLocale("es"))).toBe("1.234,5");
    expect((1234.5).toLocaleString(intlLocale("en"))).toBe("1,234.5");
  });
});
