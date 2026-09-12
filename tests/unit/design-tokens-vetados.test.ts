import { readdirSync, readFileSync, statSync } from "node:fs";
import path from "node:path";
import { describe, expect, it } from "vitest";
import { parse } from "yaml";

/**
 * GATE DE TOKENS DE TINTA VETADOS COMO TEXTO (kit v1.26.0 → regla 5).
 *
 * `ink-3` no alcanza AA sobre papel (2,7:1) y axe ya lo cazó DOS veces en esta
 * misma app —S6 en las doce rutas de la vitrina, post-S7 en la tarjeta de
 * estudio—. Las dos veces la defensa fue prosa en `design-system.md`, y las dos
 * veces volvió: la prosa no corre. Esto sí.
 *
 * Tres decisiones deliberadas:
 *
 *  1. **La lista vive en `design-system.md`, no aquí.** El design system es la
 *     fuente de verdad visual (regla 10); un gate que guarda su propia copia de
 *     la regla es un segundo original que se desincroniza. El test la LEE.
 *  2. **Vetado como TEXTO no es vetado a secas.** `border-ink-3`, `bg-ink-3`,
 *     `decoration-ink-3`, `fill` y `stroke` son usos legítimos del mismo token
 *     —bordes, rellenos y trazos decorativos no son texto—. Prohibirlos todos
 *     habría obligado a diez excepciones, y una lista de excepciones es una
 *     lista que nadie mantiene.
 *  3. **Se barren las TRES formas de pintar texto** con el token: la clase de
 *     Tailwind (con cualquier variante: `hover:`, `placeholder:`, `md:`), la
 *     propiedad CSS contra la variable, y la propiedad CSS contra el hex suelto
 *     — la puerta de atrás que deja abierta cualquier gate que solo mire clases.
 */

const RAIZ = process.cwd();
const DS = path.join(RAIZ, "design-system.md");
const SRC = path.join(RAIZ, "src");
const EXTENSIONES = new Set([".ts", ".tsx", ".css"]);

type Vetado = {
  token: string;
  hex: string;
  contraste: string;
  minimo: string;
  porque: string;
};

/**
 * El bloque legible por máquina del design system, entre sus dos marcas. Si
 * alguien mueve o borra el bloque, este test se pone rojo ANTES de dejar de
 * vigilar — un gate que se queda sin lista no puede quedarse en silencio.
 */
function leerVetados(): Vetado[] {
  const ds = readFileSync(DS, "utf8");
  const bloque = ds.match(
    /<!-- tokens-vetados-como-texto:inicio -->\s*```yaml\n([\s\S]*?)```\s*<!-- tokens-vetados-como-texto:fin -->/,
  );
  if (!bloque) {
    throw new Error(
      "design-system.md ya no declara el bloque «tokens-vetados-como-texto». " +
        "La lista es la fuente del gate: si se movió, este test se actualiza con ella; " +
        "si se borró, se borró el gate y eso es una decisión de sprint, no un descuido.",
    );
  }
  return (parse(bloque[1]) as { vetados_como_texto: Vetado[] })
    .vetados_como_texto;
}

function archivosDe(dir: string): string[] {
  return readdirSync(dir).flatMap((entrada) => {
    const completo = path.join(dir, entrada);
    if (statSync(completo).isDirectory()) return archivosDe(completo);
    return EXTENSIONES.has(path.extname(entrada)) ? [completo] : [];
  });
}

const archivos = archivosDe(SRC).sort();

/**
 * Las tres formas, armadas desde el token para que el literal prohibido no
 * viva escrito en este archivo (si viviera, el barrido se cazaría a sí mismo
 * el día que alguien amplíe su alcance a `tests/`).
 */
function patrones(v: Vetado): { nombre: string; re: RegExp }[] {
  const t = v.token.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  return [
    {
      nombre: `clase de Tailwind «text-${v.token}» (con o sin variante)`,
      re: new RegExp(String.raw`(?<![\w-])text-${t}(?![\w-])`),
    },
    {
      nombre: `CSS «color: var(--color-${v.token})»`,
      re: new RegExp(
        String.raw`(?<![-\w])color\s*:\s*var\(\s*--color-${t}\s*\)`,
        "i",
      ),
    },
    {
      nombre: `CSS «color: ${v.hex}» (el hex suelto, por la puerta de atrás)`,
      re: new RegExp(String.raw`(?<![-\w])color\s*:\s*${v.hex}\b`, "i"),
    },
  ];
}

describe("los tokens de tinta vetados como color de texto", () => {
  const vetados = leerVetados();

  it("hay lista que aplicar y árbol que barrer (si no, esto no vigila nada)", () => {
    expect(vetados.length).toBeGreaterThan(0);
    expect(archivos.length).toBeGreaterThan(0);
  });

  it.each(vetados.map((v) => [v.token, v] as const))(
    "«%s» no pinta texto en ningún archivo de src/",
    (_token, v) => {
      const hallazgos: string[] = [];
      for (const archivo of archivos) {
        const lineas = readFileSync(archivo, "utf8").split("\n");
        for (const { nombre, re } of patrones(v)) {
          lineas.forEach((linea, i) => {
            if (re.test(linea)) {
              hallazgos.push(
                `  ${path.relative(RAIZ, archivo)}:${i + 1} — ${nombre}`,
              );
            }
          });
        }
      }
      expect(
        hallazgos.join("\n"),
        `«${v.token}» mide ${v.contraste} y NO es color de texto (design-system.md). ` +
          `El mínimo para texto es «${v.minimo}». ${v.porque}.\n` +
          `Usos legítimos que este gate SÍ permite: border-${v.token}, bg-${v.token}, ` +
          `decoration-${v.token}, fill y stroke.\nDonde está:\n${hallazgos.join("\n")}`,
      ).toBe("");
    },
  );
});
