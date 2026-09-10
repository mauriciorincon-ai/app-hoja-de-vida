import { existsSync, readdirSync, readFileSync } from "node:fs";
import path from "node:path";
import { describe, expect, it } from "vitest";
import {
  fichaTecnicaSchema,
  frentes,
} from "@/lib/vitrina/ficha-tecnica/schema";

/**
 * GATE DEL CANAL DE CONTENIDO (S7) — las fichas técnicas que llegan de otras
 * casas a `content/<frente>/`.
 *
 * Aquí no se editan, ni para que quepan: si una no cumple, este test la nombra
 * con archivo y campo y se corrige EN ORIGEN. Vigila cuatro cosas que ninguna
 * revisión a ojo sostiene con 20 archivos y menos con 200:
 *
 *  1. **El contrato** (`fichaTecnicaSchema`) — forma, no vigencia.
 *  2. **Archivo = slug y carpeta = frente** — el nombre del archivo no puede
 *     mentir sobre lo que hay dentro: la ruta pública sale del CONTENIDO.
 *  3. **Slugs únicos GLOBALES**, incluidos los exports de `content/vitrina/`.
 *     Dos piezas con el mismo slug producen params repetidos en
 *     `generateStaticParams` y un `getPieza()` que devuelve la primera **en
 *     silencio** (hallazgos M1 y M2 de la auditoría retroactiva S5+S6).
 *  4. **Cero enlaces y cero DOI** (regla dura 16): la producción se muestra,
 *     jamás se entrega — y una investigación es justo donde se cuela un DOI.
 *  5. **Toda captura de la galería existe** en `public/piezas/<frente>/`
 *     (v1.3.0): una ficha que apunta a una imagen que no está no publica un
 *     hueco con un alt — rompe aquí, nombrando el archivo.
 */

const SUFIJO = ".ficha-tecnica.json";
const VITRINA_DIR = path.join(process.cwd(), "content", "vitrina");

/** Un frente sin carpeta no es un error: es un frente que aún no tiene piezas. */
function archivosDe(frente: string): string[] {
  const dir = path.join(process.cwd(), "content", frente);
  if (!existsSync(dir)) return [];
  return readdirSync(dir)
    .filter((f) => f.endsWith(SUFIJO))
    .sort();
}

const entradas = frentes.flatMap((frente) =>
  archivosDe(frente).map((archivo) => ({
    frente,
    archivo,
    ruta: `content/${frente}/${archivo}`,
    crudo: readFileSync(
      path.join(process.cwd(), "content", frente, archivo),
      "utf8",
    ),
  })),
);

/**
 * `https://…` · `www.` · un DOI (`10.1234/loquesea`) · y los hosts de
 * despliegue **escritos sin esquema**, que es como se cuelan de verdad:
 * un «mi-tablero.vercel[.]app» no tiene `https://` ni `www.`, así que pasaba entero
 * por el gate de la regla 16. Los patrones van con clase de carácter para que
 * este mismo archivo no dispare el barrido que lo vigila.
 */
const ENLACE =
  /https?:\/\/|www\.|10\.\d{4,}\/|vercel[.]app|workers[.]dev|pages[.]dev/i;

describe("las fichas técnicas de content/<frente>/", () => {
  it("hay piezas que validar (si no, este gate no está vigilando nada)", () => {
    expect(entradas.length).toBeGreaterThan(0);
  });

  it.each(entradas.map((e) => [e.ruta, e] as const))(
    "%s cumple el contrato",
    (_ruta, e) => {
      const r = fichaTecnicaSchema.safeParse(JSON.parse(e.crudo));
      if (!r.success) {
        throw new Error(
          `${e.ruta} incumple el contrato de la ficha técnica:\n` +
            r.error.issues
              .map((i) => `  - ${i.path.join(".") || "(raíz)"}: ${i.message}`)
              .join("\n") +
            `\n  ⚠ Las fichas de otras casas NO se editan aquí: se corrige en origen y se vuelve a entregar.`,
        );
      }
    },
  );

  it.each(entradas.map((e) => [e.ruta, e] as const))(
    "%s se llama como su slug y vive en la carpeta de su frente",
    (_ruta, e) => {
      const ficha = fichaTecnicaSchema.parse(JSON.parse(e.crudo));
      expect(
        e.archivo,
        `${e.ruta}: el archivo debería llamarse «${ficha.pieza.slug}${SUFIJO}» — la ruta pública sale del contenido, no del nombre`,
      ).toBe(`${ficha.pieza.slug}${SUFIJO}`);
      expect(
        e.frente,
        `${e.ruta}: la ficha declara «pieza.frente: ${ficha.pieza.frente}» pero está en content/${e.frente}/`,
      ).toBe(ficha.pieza.frente);
    },
  );

  it("ninguna pieza repite slug con otra, ni con una app de content/vitrina/", () => {
    const dueño = new Map<string, string>();
    for (const e of entradas) {
      const slug = fichaTecnicaSchema.parse(JSON.parse(e.crudo)).pieza.slug;
      const previo = dueño.get(slug);
      expect(
        previo,
        `slug repetido «${slug}»: ${previo} y ${e.ruta}. Dos piezas con el mismo slug chocan en la ruta pública y una queda invisible.`,
      ).toBeUndefined();
      dueño.set(slug, e.ruta);
    }
    for (const archivo of readdirSync(VITRINA_DIR).filter((f) =>
      f.endsWith(".brochure-export.json"),
    )) {
      const slug = (
        JSON.parse(readFileSync(path.join(VITRINA_DIR, archivo), "utf8")) as {
          app: { slug: string };
        }
      ).app.slug;
      const previo = dueño.get(slug);
      expect(
        previo,
        `slug repetido «${slug}»: ${previo} y content/vitrina/${archivo} (una app). Chocarían en la vitrina.`,
      ).toBeUndefined();
      dueño.set(slug, `content/vitrina/${archivo}`);
    }
  });

  it.each(entradas.map((e) => [e.ruta, e] as const))(
    "%s: cada captura de su galería existe en public/piezas/",
    (_ruta, e) => {
      const ficha = fichaTecnicaSchema.parse(JSON.parse(e.crudo));
      for (const g of ficha.galeria ?? []) {
        const enDisco = path.join(
          process.cwd(),
          "public",
          "piezas",
          e.frente,
          g.archivo,
        );
        expect(
          existsSync(enDisco),
          `${e.ruta} apunta a «${g.archivo}» y no existe public/piezas/${e.frente}/${g.archivo}: la galería no puede publicar un hueco`,
        ).toBe(true);
      }
    },
  );

  it.each(entradas.map((e) => [e.ruta, e] as const))(
    "%s no trae un solo enlace ni un DOI",
    (_ruta, e) => {
      const m = e.crudo.match(ENLACE);
      expect(
        m?.[0],
        `${e.ruta} trae «${m?.[0]}»: la producción se MUESTRA, jamás se entrega (regla 16). Ni URL, ni repositorio, ni DOI — se corrige en origen.`,
      ).toBeUndefined();
    },
  );
});
