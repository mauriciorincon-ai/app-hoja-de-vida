import { readdirSync, readFileSync, statSync } from "node:fs";
import { join } from "node:path";
import { describe, expect, it } from "vitest";

/**
 * CADA VARIANTE DE ENTRADA TIENE SU CSS, Y NADIE VUELVE A TRAER LA LIBRERÍA
 * (2026-09-27, ADR-027).
 *
 * Las entradas al hacer scroll son atributos (`data-reveal`, `data-reveal-item`)
 * y su movimiento vive en globals.css. Una variante que un componente escriba
 * y el CSS no conozca no falla en ningún sitio: el bloque nace visible y
 * quieto, y nadie lo nota hasta que el dueño pregunta por qué esa sección ya
 * no entra. Y la razón de todo esto es el JavaScript antes de la pintura:
 * volver a importar `motion/react` en UN componente devuelve a la HOME los
 * 45 KB que se le quitaron.
 */
const RAIZ = join(__dirname, "../..");
const css = readFileSync(join(RAIZ, "src/app/globals.css"), "utf8");

function archivos(dir: string): string[] {
  return readdirSync(dir).flatMap((n) => {
    const p = join(dir, n);
    return statSync(p).isDirectory()
      ? archivos(p)
      : /\.(tsx?|mjs)$/.test(n)
        ? [p]
        : [];
  });
}
const fuentes = archivos(join(RAIZ, "src")).map((p) => ({
  ruta: p.slice(RAIZ.length + 1),
  texto: readFileSync(p, "utf8"),
}));

/**
 * Las variantes son el contrato: las uniones `RevealVariant` y
 * `StaggerVariant` de las primitivas, más las que un componente escribe a
 * mano en `data-reveal-item` (el trazo de los iconos, el pulso de las cifras).
 */
const variantes = new Set<string>();
for (const { texto } of fuentes) {
  for (const union of texto.matchAll(
    /export type (?:Reveal|Stagger)Variant =([^;]+);/g,
  )) {
    for (const m of union[1].matchAll(/"([A-Za-z]+)"/g)) variantes.add(m[1]);
  }
  for (const m of texto.matchAll(/data-reveal-item="([A-Za-z]+)"/g)) {
    variantes.add(m[1]);
  }
}

const escapar = (s: string) => s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

describe("las entradas en CSS", () => {
  it("encuentra las variantes en el código (si no, el barrido está roto)", () => {
    expect([...variantes].sort()).toEqual(
      expect.arrayContaining([
        "fadeInUp",
        "liftIn",
        "scaleInBlur",
        "trazo",
        "pulso",
      ]),
    );
  });

  for (const v of [...variantes].sort()) {
    it(`«${v}» tiene estado oculto y duración en globals.css`, () => {
      const sel = escapar(`="${v}"]`);
      expect(
        css.match(
          new RegExp(
            `\\[data-reveal(-item)?${sel}:not\\(\\[data-visto\\]\\)|\\[data-reveal-group\\]:not\\(\\[data-visto\\]\\) \\[data-reveal-item${sel}`,
          ),
        ),
        `«${v}» no tiene estado oculto (regla :not([data-visto])) en globals.css`,
      ).not.toBeNull();
      expect(
        css.match(
          new RegExp(
            `\\[data-reveal(-item)?${sel}[^{]*\\{[^}]*transition-duration:\\s*[0-9.]+s`,
          ),
        ),
        `«${v}» no tiene transition-duration en globals.css`,
      ).not.toBeNull();
    });
  }

  it("ningún archivo de src importa motion/react, y package.json no lo trae", () => {
    const importan = fuentes
      .filter(({ texto }) => /from "motion(\/|")/.test(texto))
      .map((f) => f.ruta);
    expect(importan, "vuelven a traer la librería de motion").toEqual([]);
    const pkg = JSON.parse(readFileSync(join(RAIZ, "package.json"), "utf8"));
    expect(
      pkg.dependencies?.motion ?? pkg.devDependencies?.motion,
    ).toBeUndefined();
  });
});
