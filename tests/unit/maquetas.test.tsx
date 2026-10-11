// @vitest-environment node
import { renderToString } from "react-dom/server";
import { describe, expect, it, vi } from "vitest";
import { Maqueta, tieneMaqueta } from "@/components/vitrina/maquetas";
import { MuestraApp } from "@/components/vitrina/muestra";
import { getFichasVitrina } from "@/lib/vitrina/loader";

/**
 * LAS TIRAS DE LA VITRINA (2026-10-11).
 *
 * La muestra de cada app lleva una tira: un dibujo esquemático de esta casa
 * (`src/components/vitrina/maquetas/`), no una captura. Cuando entraron cuatro
 * apps sin tira (PR #73), la muestra pintó el MARCO de la tira vacío: una caja
 * sin nada, porque `Maqueta` devolvía null pero el `div` que la enmarca se
 * pintaba igual. Este archivo cierra las dos puertas:
 *
 *  1. Toda app con export tiene su tira — una app nueva sin dibujo cae aquí
 *     (y en el e2e del escaparate), no en producción.
 *  2. Sin tira no hay marco: la muestra de una app sin dibujo no pinta la caja.
 *
 * Y vigila la gramática común de las tiras, que es lo que hace que las diez se
 * vean de la misma familia: viewBox 320×92, `role="img"` con su descripción,
 * cuatro rótulos mono centrados en 40 · 120 · 200 · 280 y de 13 caracteres
 * como máximo (a 6px, uno más largo se toca con el vecino).
 */

// El enlace del título no es el sujeto: un <a> plano (next-intl arrastra
// `next/navigation`, que no vive en node). Las traducciones devuelven la clave.
vi.mock("@/i18n/navigation", () => ({
  Link: (props: React.ComponentProps<"a">) => <a {...props} />,
}));
vi.mock("next-intl/server", () => ({
  getTranslations: async () => (clave: string) => clave,
}));

const FICHAS = getFichasVitrina();
const ROTULO =
  /<text class="mq-rotulo" x="(\d+)" y="72" text-anchor="middle">([^<]*)<\/text>/g;

describe("las tiras de la vitrina", () => {
  it("toda app con export tiene su tira", () => {
    const sinTira = FICHAS.map((f) => f.ancla.slug).filter(
      (slug) => !tieneMaqueta(slug),
    );
    expect(sinTira, `apps sin tira: ${sinTira.join(", ")}`).toEqual([]);
  });

  it.each(FICHAS.map((f) => f.ancla.slug))(
    "la tira de «%s» sigue la gramática común",
    (slug) => {
      const html = renderToString(<Maqueta slug={slug} />);
      expect(html).toContain('viewBox="0 0 320 92"');
      expect(html).toContain('class="maqueta"');
      expect(html).toContain('role="img"');
      expect(html).toMatch(/aria-label="Esquema de [^"]{20,}"/);

      const rotulos = [...html.matchAll(ROTULO)].map((m) => ({
        x: Number(m[1]),
        texto: m[2],
      }));
      expect(rotulos.map((r) => r.x)).toEqual([40, 120, 200, 280]);
      for (const r of rotulos) {
        expect(r.texto.length, `rótulo «${r.texto}»`).toBeGreaterThan(0);
        expect(r.texto.length, `rótulo «${r.texto}»`).toBeLessThanOrEqual(13);
      }
    },
  );

  it("una app sin tira no pinta el marco vacío", async () => {
    const base = FICHAS[0];
    const ficha = { ...base, ancla: { ...base.ancla, slug: "sin-tira" } };
    expect(tieneMaqueta(ficha.ancla.slug)).toBe(false);

    const html = renderToString(await MuestraApp({ ficha }));
    expect(html).toContain('data-muestra-slug="sin-tira"');
    expect(html).not.toContain("<svg");
    expect(html).not.toContain('aria-hidden="true" class="overflow-hidden');
  });

  it("una app con tira la pinta dentro de su marco", async () => {
    const html = renderToString(await MuestraApp({ ficha: FICHAS[0] }));
    expect(html).toContain('aria-hidden="true" class="overflow-hidden');
    expect(html).toContain('class="maqueta"');
  });
});
