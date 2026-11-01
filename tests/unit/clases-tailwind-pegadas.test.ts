import { readdirSync, readFileSync, statSync } from "node:fs";
import path from "node:path";
import { describe, expect, it } from "vitest";

/**
 * GATE DE CLASES PEGADAS A UNA INTERPOLACIÓN (S28).
 *
 * Tailwind lee el código como texto: un «candidato» termina en un espacio o en una comilla. Si una
 * clase va pegada a `${…}`, el candidato es `bg-paper-0/95${sinImprimir` —no existe— y la clase NO se
 * genera, sin error ni aviso. Así estuvo el header del sitio transparente (`bg-paper-0/95${…}` en
 * `header.tsx`) desde que se escribió: nadie lo vio hasta que el brochure puso una sección oscura
 * debajo y axe midió texto oscuro sobre fondo oscuro.
 *
 * La regla es una sola: dentro de un `className={`…`}`, ningún carácter que no sea espacio puede ir
 * inmediatamente antes de un `${`. Una clase armada (`grid-cols-${n}`) cae igual: Tailwind tampoco la
 * ve. Lo variable se elige entre clases completas.
 */

const RAIZ = path.join(process.cwd(), "src");

/**
 * El brochure escribe sus clases (`arista`, `f-<fuente>`, `t-<tipo>`…) en su hoja propia,
 * `brochure.css`, que el build lee tal cual: ahí `arista${…}` no pierde nada, porque no es una
 * utilidad que Tailwind deba generar. Es la única exención, y es de carpeta, no de línea.
 */
const HOJA_PROPIA = path.join("src", "components", "brochure") + path.sep;

function archivos(dir: string): string[] {
  return readdirSync(dir).flatMap((nombre) => {
    const ruta = path.join(dir, nombre);
    if (statSync(ruta).isDirectory()) return archivos(ruta);
    return ruta.endsWith(".tsx") ? [ruta] : [];
  });
}

/** Los `className={`…`}` de un texto, hasta la primera comilla invertida que cierra. */
const PLANTILLA_DE_CLASES = /className=\{`([^`]*)`/g;
/** Un carácter que no es espacio, pegado a una interpolación. */
const PEGADA = /\S\$\{/;

function clasesPegadas(fuente: string): string[] {
  return [...fuente.matchAll(PLANTILLA_DE_CLASES)]
    .map((m) => m[1])
    .filter((plantilla) => PEGADA.test(plantilla));
}

describe("ninguna clase de Tailwind va pegada a una interpolación", () => {
  it("hay archivos que barrer (si no, esta prueba no mide nada)", () => {
    expect(archivos(RAIZ).length).toBeGreaterThan(50);
  });

  it("el patrón caza la clase pegada y deja pasar la separada", () => {
    // El rojo del gate: el header tal como estuvo, y el mismo con su espacio.
    const pegada =
      'className={`sticky top-0 bg-paper-0/95${sinImprimir ? " print:hidden" : ""}`}';
    const separada =
      'className={`sticky top-0 bg-paper-0/95 ${sinImprimir ? "print:hidden" : ""}`}';
    expect(clasesPegadas(pegada)).toHaveLength(1);
    expect(clasesPegadas(separada)).toHaveLength(0);
    // Y una clase armada con la interpolación en medio.
    expect(clasesPegadas("className={`grid grid-cols-${n}`}")).toHaveLength(1);
    // Un id armado fuera de un className no es asunto de Tailwind.
    expect(clasesPegadas("id={`t-g${orden}`}")).toHaveLength(0);
  });

  it("ningún className del código las pega", () => {
    const culpables = archivos(RAIZ)
      .filter(
        (archivo) =>
          !path.relative(process.cwd(), archivo).startsWith(HOJA_PROPIA),
      )
      .flatMap((archivo) =>
        clasesPegadas(readFileSync(archivo, "utf8")).map(
          (plantilla) =>
            `${path.relative(process.cwd(), archivo)}: ${plantilla}`,
        ),
      );
    expect(culpables).toEqual([]);
  });
});
