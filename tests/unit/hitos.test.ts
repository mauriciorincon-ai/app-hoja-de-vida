import { describe, expect, it } from "vitest";
import { getCasa } from "@/lib/brochure/casa";
import { armarFichaTecnica } from "@/lib/vitrina/ficha-tecnica/armar";
import { getComplemento } from "@/lib/vitrina/ficha-tecnica/loader";
import { HITOS_CONOCIDOS, hitosDe } from "@/lib/vitrina/ficha-tecnica/hitos";
import { getFichasVitrina } from "@/lib/vitrina/loader";

/**
 * «DÓNDE ESTÁ» (S30). `hitosDe` salió de `armarFichaTecnica` para que el cierre «Úsala» del brochure —y
 * la casa, que no tiene ficha— cuenten lo mismo desde el export. Aquí se fija que la ficha sigue diciendo
 * lo mismo que antes y que cada rama del cálculo se mide.
 */

const base = (selladoEn: string | null, metricas: object[] = []) =>
  ({
    app: {
      ciclo: "H-1",
      sprints_cerrados: 7,
      sellado_en: selladoEn,
      version_repo: "1.4.0",
    },
    metricas,
  }) as unknown as Parameters<typeof hitosDe>[0];

describe("hitosDe", () => {
  it("una app sellada cuenta ciclo, sprints, fecha de sello y versión", () => {
    expect(hitosDe(base("2026-10-02"))).toEqual([
      { valor: "H-1", etiqueta: "ciclo" },
      { valor: "7", etiqueta: "sprints" },
      { valor: "2026-10-02", etiqueta: "sellada" },
      { valor: "v1.4.0", etiqueta: "version" },
    ]);
  });

  it("sin sello, el tercer hito dice que la construcción sigue (y no inventa una fecha)", () => {
    expect(hitosDe(base(null))[2]).toEqual({
      valor: "—",
      etiqueta: "construccion",
    });
  });

  it("las decisiones registradas se suman al final, con la CLAVE como etiqueta", () => {
    const h = hitosDe(
      base(null, [{ clave: "decisiones_registradas", valor: 12 }]),
    );
    expect(h.at(-1)).toEqual({ valor: "12", etiqueta: "decisiones" });
  });

  it("toda etiqueta que produce es una de las que el renderizador traduce", () => {
    for (const exp of [
      ...getFichasVitrina().map((f) => f.export),
      ...getCasa().map((p) => p.export),
    ])
      for (const h of hitosDe(exp))
        expect(HITOS_CONOCIDOS.has(h.etiqueta), h.etiqueta).toBe(true);
  });

  it("la ficha técnica de cada app dice los mismos hitos (no cambió al extraerlos)", () => {
    for (const f of getFichasVitrina())
      expect(
        armarFichaTecnica(f, getComplemento(f.ancla.slug)).hitos,
        f.ancla.slug,
      ).toEqual(hitosDe(f.export));
  });
});
