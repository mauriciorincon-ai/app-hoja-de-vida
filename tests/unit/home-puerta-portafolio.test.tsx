// @vitest-environment node
import { readdirSync, readFileSync } from "node:fs";
import { renderToString } from "react-dom/server";
import { describe, expect, it, vi } from "vitest";
import { parse } from "yaml";
import {
  PuertaPortafolio,
  type TraductorPuerta,
} from "@/components/home/vitrina";
import { getFrentes, type Frente } from "@/lib/vitrina/categorias";
import es from "../../messages/es.json";
import en from "../../messages/en.json";

/**
 * LA PUERTA AL PORTAFOLIO EN LA HOME (S28, OM-18). Como la de «Métodos», no escribe un solo total:
 * las cuatro cifras se MIDEN del disco, y este gate las mide por su cuenta —contando los archivos
 * de `content/` sin pasar por `getFrentes()`— para compararlas con las que la puerta pinta. Un frente
 * que gana una pieza cambia su cifra sin tocar el código; uno en preparación dice «En preparación»
 * y no enseña una cuenta.
 */

// El enlace de next-intl arrastra `next/navigation`, que no vive en node.
vi.mock("@/i18n/navigation", () => ({
  Link: (props: React.ComponentProps<"a">) => <a {...props} />,
}));

type FrenteYaml = {
  id: string;
  estado: "abierta" | "en-preparacion";
  nombre: { es: string; en: string };
  intro: { es: string; en: string };
};
const FRENTES_YAML = (
  parse(readFileSync("data/vitrina.yaml", "utf8")) as {
    categorias: FrenteYaml[];
  }
).categorias;

/** Las piezas de un frente, contadas a mano del disco. */
function piezasEnDisco(id: string): number {
  const [dir, sufijo] =
    id === "apps"
      ? ["content/vitrina", ".brochure-export.json"]
      : [`content/${id}`, ".ficha-tecnica.json"];
  try {
    return readdirSync(dir).filter((f) => f.endsWith(sufijo)).length;
  } catch {
    return 0;
  }
}

function traductorDe(idioma: "es" | "en"): TraductorPuerta {
  const raiz = (idioma === "es" ? es : en).vitrinaHome as Record<
    string,
    string
  >;
  return (clave, valores) => {
    const texto = raiz[clave];
    if (typeof texto !== "string")
      throw new Error(
        `vitrinaHome.${clave}: no existe en messages/${idioma}.json`,
      );
    return texto.replace(/\{(\w+)\}/g, (_, k) => String(valores?.[k] ?? ""));
  };
}

function puerta(idioma: "es" | "en", frentes: Frente[] = getFrentes()) {
  return renderToString(
    <PuertaPortafolio
      frentes={frentes}
      locale={idioma}
      t={traductorDe(idioma)}
    />,
  );
}

/** El HTML de la fila de un frente. */
function fila(html: string, id: string): string {
  const m = new RegExp(`<a [^>]*data-frente="${id}"[\\s\\S]*?</a>`).exec(html);
  if (!m) throw new Error(`la puerta no tiene la fila de «${id}»`);
  return m[0];
}

describe("la puerta de la HOME nombra los frentes de data/vitrina.yaml", () => {
  it("hay frentes en disco (si no, esta prueba no mide nada)", () => {
    expect(FRENTES_YAML.length).toBeGreaterThan(0);
  });

  for (const idioma of ["es", "en"] as const) {
    it(`${idioma}: una fila por frente, una sola vez, en el orden del YAML`, () => {
      const html = puerta(idioma);
      const enLaPuerta = [...html.matchAll(/data-frente="([^"]+)"/g)].map(
        (m) => m[1],
      );
      expect(enLaPuerta).toEqual(FRENTES_YAML.map((f) => f.id));
    });

    it(`${idioma}: cada fila lleva su nombre, su enlace y la cifra que cuenta el disco`, () => {
      const html = puerta(idioma);
      for (const f of FRENTES_YAML) {
        const una = fila(html, f.id);
        expect(una, f.id).toContain(`href="/portafolio/${f.id}"`);
        expect(una, f.id).toContain(f.nombre[idioma]);
        if (f.estado === "abierta") {
          const n = piezasEnDisco(f.id);
          expect(n, `${f.id} está abierto: tiene piezas`).toBeGreaterThan(0);
          // La cifra se ve, y el lector de pantalla oye «N publicados».
          expect(una, f.id).toContain(`aria-hidden="true">${n}</span>`);
          expect(una, f.id).toContain(
            idioma === "es" ? `${n} publicados` : `${n} published`,
          );
          expect(una, f.id).toContain(
            f.intro[idioma].replace(/&/g, "&amp;").replace(/'/g, "&#x27;"),
          );
        } else {
          // En preparación: sin cuenta inventada, y lo dice donde los demás dicen su frase.
          expect(una, f.id).toContain("…");
          expect(una, f.id).toContain(
            idioma === "es" ? "En preparación" : "In preparation",
          );
          expect(una, f.id).not.toContain(f.intro[idioma]);
          expect(una, f.id).not.toMatch(/publicados|published/);
        }
      }
    });

    it(`${idioma}: el botón lleva al portafolio y la sección conserva su ancla`, () => {
      const html = puerta(idioma);
      expect(html).toContain('id="portafolio"');
      expect(html).toMatch(
        /<a [^>]*href="\/portafolio"[^>]*data-ir-vitrina|<a [^>]*data-ir-vitrina[^>]*href="\/portafolio"/,
      );
    });
  }

  it("las cifras vienen de los datos, no del texto: un frente con otra cuenta la cambia sola", () => {
    // El rojo del gate: si la cifra estuviera escrita en la puerta, esto no cambiaría.
    const frentes = getFrentes().map((f) =>
      f.id === "agentes" ? { ...f, piezas: 97 } : f,
    );
    const una = fila(puerta("es", frentes), "agentes");
    expect(una).toContain('aria-hidden="true">97</span>');
    expect(una).toContain("97 publicados");
  });

  it("sin frentes, la puerta no pinta una sección vacía", () => {
    expect(puerta("es", [])).toBe("");
  });
});

describe("ningún texto de la puerta escribe un total de piezas", () => {
  // La cuenta se MIDE; el texto no la dice. «Cuatro frentes» cuenta frentes (la estructura del
  // portal), no piezas: lo que no puede aparecer es un número junto a lo que se publica.
  const TOTAL =
    /\b(\d+|uno|una|dos|tres|cuatro|cinco|seis|siete|ocho|nueve|diez|once|doce|one|two|three|four|five|six|seven|eight|nine|ten|eleven|twelve)\b\s+(productos?|piezas?|apps?|aplicaciones|agentes|investigaciones|tableros|products?|pieces?|agents|research|dashboards)/i;

  for (const [idioma, m] of [
    ["es", es],
    ["en", en],
  ] as const) {
    it(`${idioma}: titulo, linea e ir`, () => {
      for (const clave of ["titulo", "linea", "ir"] as const) {
        const texto = m.vitrinaHome[clave];
        expect(texto, `vitrinaHome.${clave} (${idioma})`).not.toMatch(TOTAL);
        expect(texto, `vitrinaHome.${clave} (${idioma})`).not.toMatch(/\d/);
      }
    });
  }

  it("el patrón caza un total y no la cuenta de frentes", () => {
    expect("27 piezas publicadas").toMatch(TOTAL);
    expect("diez apps hermanas").toMatch(TOTAL);
    expect(
      "Cuatro frentes: apps, agentes, investigaciones y tableros.",
    ).not.toMatch(TOTAL);
  });

  it("el HTML de la puerta, sin la cifra de cada fila, tampoco lo escribe", () => {
    for (const idioma of ["es", "en"] as const) {
      const texto = puerta(idioma)
        .replace(/<span class="sr-only">[^<]*<\/span>/g, " ")
        .replace(/<span aria-hidden="true">[^<]*<\/span>/g, " ")
        .replace(/<[^>]+>/g, " ");
      expect(texto, idioma).not.toMatch(TOTAL);
    }
  });
});
