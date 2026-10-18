// @vitest-environment node
import { mkdirSync, mkdtempSync, readFileSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import path from "node:path";
import { afterEach, describe, expect, it } from "vitest";
import { getPiezaMetodo, getPiezasMetodo, leerPiezasDeDisco } from "@/lib/metodo/loader";

/**
 * EL CARGADOR DE «MI MÉTODO» (S10). Dos mitades: los datos REALES de
 * `data/metodo/` (el gate que rompe el build si una pieza se malforma) y las
 * carpetas de prueba (cada rojo del cargador, sin tocar los datos reales).
 */

describe("los datos reales de data/metodo/", () => {
  const piezas = getPiezasMetodo();

  it("hay al menos una pieza publicada y todas validan (fail-safe del build)", () => {
    expect(piezas.length).toBeGreaterThan(0);
    for (const p of piezas) expect(p.bloques).toHaveLength(10);
  });

  it("cada archivo se llama como su slug (la ruta sale del slug) y cada tema es una sola pieza", () => {
    expect(new Set(piezas.map((p) => p.slug)).size).toBe(piezas.length);
    expect(new Set(piezas.map((p) => p.id)).size).toBe(piezas.length);
  });

  it("`getPiezaMetodo` encuentra por slug y devuelve undefined si no existe", () => {
    expect(getPiezaMetodo(piezas[0].slug)?.id).toBe(piezas[0].id);
    expect(getPiezaMetodo("no-existe")).toBeUndefined();
  });

  it("la lista sale en el orden de los temas (T1…T9), no en el de construcción", () => {
    const ids = piezas.map((p) => p.id);
    expect(ids).toEqual([...ids].sort());
  });
});

describe("ROJO · el cargador contra carpetas de prueba", () => {
  const EJEMPLO = readFileSync("tests/fixtures/metodo/ejemplo-sintetico.yaml", "utf8");
  const carpetas: string[] = [];
  afterEach(() => {
    for (const c of carpetas.splice(0)) rmSync(c, { recursive: true, force: true });
  });

  const APROBADO = "---\nestado: aprobado\n---\n# doc\n";
  const BORRADOR = "---\nestado: borrador\n---\n# doc\n";

  /**
   * Una raíz de prueba con `data/metodo/<archivo>` y los documentos del corpus dados
   * (aprobados en ES y EN; `docs` deja escribir uno concreto, p. ej. un borrador).
   */
  function raiz(
    archivos: Record<string, string>,
    corpus: string[] = ["como-trabajo", "vesting"],
    docs: Record<string, string> = {},
  ): string {
    const r = mkdtempSync(path.join(tmpdir(), "metodo-"));
    carpetas.push(r);
    mkdirSync(path.join(r, "data", "metodo"), { recursive: true });
    mkdirSync(path.join(r, "data", "a-fondo"), { recursive: true });
    for (const [n, c] of Object.entries(archivos)) writeFileSync(path.join(r, "data", "metodo", n), c);
    for (const s of corpus)
      for (const l of ["es", "en"]) writeFileSync(path.join(r, "data", "a-fondo", `${s}.${l}.md`), APROBADO);
    for (const [n, c] of Object.entries(docs)) writeFileSync(path.join(r, "data", "a-fondo", n), c);
    return r;
  }

  it("una carpeta sin data/metodo es una sección que empieza, no un repo roto", () => {
    const r = mkdtempSync(path.join(tmpdir(), "metodo-vacio-"));
    carpetas.push(r);
    expect(leerPiezasDeDisco(r)).toEqual([]);
  });

  it("carga una pieza válida cuyo archivo se llama como su slug", () => {
    const piezas = leerPiezasDeDisco(raiz({ "ejemplo-sintetico.yaml": EJEMPLO }));
    expect(piezas.map((p) => p.slug)).toEqual(["ejemplo-sintetico"]);
  });

  it("un archivo que no se llama como su slug rompe, nombrando los dos", () => {
    const r = raiz({ "otro-nombre.yaml": EJEMPLO });
    expect(() => leerPiezasDeDisco(r)).toThrowError(
      /data\/metodo\/otro-nombre\.yaml[\s\S]*se llama «otro-nombre\.yaml» y el slug es «ejemplo-sintetico»/,
    );
  });

  it("dos piezas con el mismo tema (id) rompen: cada tema es una sola infografía", () => {
    const copia = EJEMPLO.replace("slug: ejemplo-sintetico", "slug: copia");
    const r = raiz({ "ejemplo-sintetico.yaml": EJEMPLO, "copia.yaml": copia });
    expect(() => leerPiezasDeDisco(r)).toThrowError(/id: «T1» lo declaran dos piezas/);
  });

  it("un documento del corpus que no existe en data/a-fondo/ rompe, nombrando archivo y slug", () => {
    const r = raiz({ "ejemplo-sintetico.yaml": EJEMPLO }, ["vesting"]); // falta como-trabajo
    expect(() => leerPiezasDeDisco(r)).toThrowError(
      /data\/metodo\/ejemplo-sintetico\.yaml[\s\S]*«como-trabajo» no es un documento de data\/a-fondo\//,
    );
  });

  it("un documento del corpus en borrador rompe: lo que hice sale de un documento aprobado", () => {
    const r = raiz({ "ejemplo-sintetico.yaml": EJEMPLO }, ["vesting"], {
      "como-trabajo.es.md": BORRADOR,
      "como-trabajo.en.md": APROBADO,
    });
    expect(() => leerPiezasDeDisco(r)).toThrowError(
      /data\/metodo\/ejemplo-sintetico\.yaml[\s\S]*«como-trabajo» existe en data\/a-fondo\/ pero no se puede citar: como-trabajo\.es\.md está en estado «borrador», no «aprobado»/,
    );
  });

  it("un documento del corpus sin su gemelo en inglés rompe, nombrando el que falta", () => {
    const r = raiz({ "ejemplo-sintetico.yaml": EJEMPLO }, ["vesting"], {
      "como-trabajo.es.md": APROBADO,
    });
    expect(() => leerPiezasDeDisco(r)).toThrowError(
      /«como-trabajo» existe en data\/a-fondo\/ pero no se puede citar: le falta el gemelo como-trabajo\.en\.md/,
    );
  });

  it("una pieza con 9 bloques rompe el cargador (el rojo del esquema llega hasta el build)", () => {
    const sin7 = EJEMPLO.replace(/ {2}- n: 7\n[\s\S]*? {2}- n: 8\n/, "  - n: 8\n");
    expect(sin7).not.toBe(EJEMPLO);
    const r = raiz({ "ejemplo-sintetico.yaml": sin7 });
    expect(() => leerPiezasDeDisco(r)).toThrowError(/faltan: 7 \(metricas\)/);
  });

  it("una fuente sin fecha rompe el cargador nombrando archivo y fuente", () => {
    const sinFecha = EJEMPLO.replace("fecha: 2026-09-15, ", "");
    expect(sinFecha).not.toBe(EJEMPLO);
    const r = raiz({ "ejemplo-sintetico.yaml": sinFecha });
    expect(() => leerPiezasDeDisco(r)).toThrowError(
      /data\/metodo\/ejemplo-sintetico\.yaml[\s\S]*bloques\.9\.fuentes\.1\.fecha/,
    );
  });

  it("ignora lo que no es .yaml (un README en la carpeta no es una pieza)", () => {
    const r = raiz({ "ejemplo-sintetico.yaml": EJEMPLO, "LEEME.md": "# nota\n" });
    expect(leerPiezasDeDisco(r)).toHaveLength(1);
  });
});

