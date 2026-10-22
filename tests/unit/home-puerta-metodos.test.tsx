// @vitest-environment node
import { renderToString } from "react-dom/server";
import { describe, expect, it, vi } from "vitest";
import { PuertaMetodos } from "@/components/home/metodos";
import { leerPiezasDeDisco } from "@/lib/metodo/loader";
import es from "../../messages/es.json";
import en from "../../messages/en.json";
import { traductorDe } from "../fixtures/metodo/ayudas";

/**
 * LA PUERTA A «MÉTODOS» EN LA HOME (S19). La lista de la HOME no es un texto:
 * es `data/metodo/`. Este gate la mide CONTRA EL DISCO, no contra una cuenta
 * escrita aquí: una pieza nueva en `data/metodo/` tiene que aparecer sola en la
 * puerta, una pieza que desaparece de la puerta rompe el test nombrándola, y
 * ningún texto de la puerta escribe un total («nueve publicaciones»).
 */

// El enlace de next-intl arrastra `next/navigation`, que no vive en node.
vi.mock("@/i18n/navigation", () => ({
  Link: (props: React.ComponentProps<"a">) => <a {...props} />,
}));

const piezas = leerPiezasDeDisco();

function puerta(idioma: "es" | "en") {
  return renderToString(
    <PuertaMetodos piezas={piezas} locale={idioma} t={traductorDe(idioma)} />,
  );
}

describe("la puerta de la HOME nombra las publicaciones de data/metodo/", () => {
  it("hay piezas en disco (si no, esta prueba no mide nada)", () => {
    expect(piezas.length).toBeGreaterThan(0);
  });

  for (const idioma of ["es", "en"] as const) {
    it(`${idioma}: una entrada por pieza, una sola vez, en el orden de los temas`, () => {
      const html = puerta(idioma);
      const enLaPuerta = [...html.matchAll(/data-puerta-pieza="([^"]+)"/g)].map(
        (m) => m[1],
      );
      const faltan = piezas
        .map((p) => p.slug)
        .filter((s) => !enLaPuerta.includes(s));
      expect(faltan, `la puerta no nombra: ${faltan.join(", ")}`).toEqual([]);
      expect(enLaPuerta).toEqual(piezas.map((p) => p.slug));
    });

    it(`${idioma}: cada entrada lleva su tema, su título y su enlace a la publicación`, () => {
      const html = puerta(idioma);
      for (const p of piezas) {
        expect(html, p.slug).toContain(`href="/metodos/${p.slug}"`);
        expect(html, p.slug).toContain(p.nombre[idioma]);
        expect(html, p.slug).toContain(
          idioma === "es" ? `Tema ${p.id}` : `Topic ${p.id}`,
        );
      }
      // El botón lleva a la lista entera.
      expect(html).toContain('href="/metodos"');
    });
  }

  it("sin piezas, la puerta no pinta una sección vacía", () => {
    const vacia = renderToString(
      <PuertaMetodos piezas={[]} locale="es" t={traductorDe("es")} />,
    );
    expect(vacia).toBe("");
  });
});

describe("ningún texto de la puerta escribe un total", () => {
  // El conteo se MIDE (`/metodos` lo hace con `piezasPublicadas`); la HOME no
  // lo dice. Una cifra o un número en letras junto a «publicaciones» o «piezas»
  // sería un total escrito a mano.
  const TOTAL =
    /\b(\d+|uno|una|dos|tres|cuatro|cinco|seis|siete|ocho|nueve|diez|one|two|three|four|five|six|seven|eight|nine|ten)\b\s+(publicaci|piezas?|publications?|pieces?|temas?|topics?)/i;

  for (const [idioma, m] of [
    ["es", es],
    ["en", en],
  ] as const) {
    it(`${idioma}: puertaTitulo, puertaLinea y puertaIr`, () => {
      for (const clave of [
        "puertaTitulo",
        "puertaLinea",
        "puertaIr",
      ] as const) {
        const texto = m.metodo[clave];
        expect(texto, `metodo.${clave} (${idioma})`).not.toMatch(TOTAL);
        expect(texto, `metodo.${clave} (${idioma})`).not.toMatch(/\d/);
      }
    });
  }

  it("el HTML de la puerta, completo, tampoco lo escribe", () => {
    for (const idioma of ["es", "en"] as const) {
      const texto = puerta(idioma).replace(/<[^>]+>/g, " ");
      expect(texto, idioma).not.toMatch(TOTAL);
    }
  });
});
