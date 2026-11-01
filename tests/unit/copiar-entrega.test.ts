import {
  existsSync,
  mkdirSync,
  mkdtempSync,
  readFileSync,
  rmSync,
  writeFileSync,
} from "node:fs";
import { tmpdir } from "node:os";
import path from "node:path";
import { afterEach, beforeEach, describe, expect, it } from "vitest";
import {
  componerContenido,
  copiarContenido,
  copiarEntrega,
  destinosDe,
  sonIguales,
} from "../../scripts/copiar-entrega.mjs";

/**
 * `copiar-entrega.mjs` es la única mano que toca una entrega: las entregas se copian
 * byte a byte, nunca se editan. Estas pruebas corren sobre un árbol temporal y
 * fijan lo que importa: que la copia sea idéntica, que no deje imágenes viejas,
 * que la casa no entre al loader de las diez y que el contenido v2 se junte sin
 * las notas de la planeadora.
 */

let dir: string;
let entrega: string;
let raiz: string;

const escribir = (p: string, t: string | Buffer) => {
  mkdirSync(path.dirname(p), { recursive: true });
  writeFileSync(p, t);
};

beforeEach(() => {
  dir = mkdtempSync(path.join(tmpdir(), "copiar-entrega-"));
  entrega = path.join(dir, "entrega", "x");
  raiz = path.join(dir, "repo");
  mkdirSync(raiz);
  escribir(
    path.join(entrega, "brochure-export.json"),
    '{"app":{"slug":"x"},"_schema":{"a":1}}\n',
  );
  escribir(
    path.join(entrega, "capturas.yaml"),
    "portada: A.webp\ncapturas: []\n",
  );
  escribir(path.join(entrega, "complemento.yaml"), "app: x\n");
  escribir(path.join(entrega, "capturas", "A.webp"), Buffer.from([1, 2, 3, 4]));
  escribir(path.join(entrega, "capturas", "B.webp"), Buffer.from([5, 6, 7]));
});
afterEach(() => rmSync(dir, { recursive: true, force: true }));

describe("copiar una entrega", () => {
  it("copia cada archivo idéntico al origen y lo pone donde lo lee el loader", () => {
    const h = copiarEntrega({ entrega, raiz });
    expect(h.slug).toBe("x");
    const d = destinosDe("x");
    for (const [de, a] of [
      ["brochure-export.json", d.export],
      ["capturas.yaml", d.capturas],
      ["complemento.yaml", d.complemento],
      ["capturas/A.webp", `${d.imagenes}/A.webp`],
      ["capturas/B.webp", `${d.imagenes}/B.webp`],
    ] as const)
      expect(sonIguales(path.join(entrega, de), path.join(raiz, a)), a).toBe(
        true,
      );
    expect(d.export).toBe("content/vitrina/x.brochure-export.json");
    expect(d.complemento).toBe("data/fichas/x.yaml");
    expect(h.copiados).toHaveLength(5);
  });

  it("pisa lo que había y retira las imágenes que la entrega ya no trae", () => {
    escribir(
      path.join(raiz, "content/vitrina/x.brochure-export.json"),
      "viejo",
    );
    escribir(path.join(raiz, "public/vitrina/x/VIEJA.webp"), "vieja");
    escribir(
      path.join(raiz, "public/vitrina/x/nota.txt"),
      "no es una imagen: se queda",
    );
    const h = copiarEntrega({ entrega, raiz });
    expect(existsSync(path.join(raiz, "public/vitrina/x/VIEJA.webp"))).toBe(
      false,
    );
    expect(existsSync(path.join(raiz, "public/vitrina/x/nota.txt"))).toBe(true);
    expect(h.borrados).toEqual(["public/vitrina/x/VIEJA.webp"]);
    expect(
      readFileSync(
        path.join(raiz, "content/vitrina/x.brochure-export.json"),
        "utf8",
      ),
    ).toContain("_schema");
  });

  it("la casa va a content/vitrina/casa/ y nunca junto a las diez apps", () => {
    copiarEntrega({ entrega, raiz, casa: true });
    const d = destinosDe("x", { casa: true });
    expect(d.export).toBe("content/vitrina/casa/x.brochure-export.json");
    expect(d.complemento).toBe("content/vitrina/casa/x.complemento.yaml");
    expect(existsSync(path.join(raiz, d.export))).toBe(true);
    expect(
      existsSync(path.join(raiz, "content/vitrina/x.brochure-export.json")),
    ).toBe(false);
    expect(existsSync(path.join(raiz, "data/fichas/x.yaml"))).toBe(false);
  });

  it("se niega ante una entrega incompleta, una imagen que no es .webp o un slug raro", () => {
    rmSync(path.join(entrega, "capturas.yaml"));
    expect(() => copiarEntrega({ entrega, raiz })).toThrow(
      /falta capturas\.yaml/,
    );
    escribir(path.join(entrega, "capturas.yaml"), "portada: A.webp\n");
    escribir(path.join(entrega, "capturas", "nota.png"), "x");
    expect(() => copiarEntrega({ entrega, raiz })).toThrow(/solo \.webp/);
    rmSync(path.join(entrega, "capturas", "nota.png"));
    escribir(
      path.join(entrega, "brochure-export.json"),
      '{"app":{"slug":"../fuera"}}',
    );
    expect(() => copiarEntrega({ entrega, raiz })).toThrow(/slug inválido/);
    expect(() => destinosDe("")).toThrow(/slug inválido/);
  });

  it("detecta una copia que no quedó idéntica (el rojo del gate)", () => {
    copiarEntrega({ entrega, raiz });
    const copia = path.join(raiz, "public/vitrina/x/A.webp");
    writeFileSync(copia, Buffer.from([1, 2, 3, 9]));
    expect(sonIguales(path.join(entrega, "capturas/A.webp"), copia)).toBe(
      false,
    );
    expect(
      sonIguales(
        path.join(entrega, "capturas/A.webp"),
        path.join(raiz, "no-existe"),
      ),
    ).toBe(false);
  });
});

describe("el contenido v2 se junta sin las notas de la planeadora", () => {
  const maqueta = () => {
    const m = path.join(dir, "maqueta", "x");
    escribir(
      path.join(m, "contenido.json"),
      JSON.stringify({
        _lee_esto: "nota",
        schema_version: "2.0.0-borrador",
        app: "x",
        acento: "sage",
      }),
    );
    escribir(
      path.join(m, "grupos.json"),
      JSON.stringify({
        grupos: [{ orden: 1 }],
        gaps: ["una nota de la planeadora"],
      }),
    );
    escribir(
      path.join(m, "traduccion-en.json"),
      JSON.stringify({ promesa: { tagline: "t" } }),
    );
    return m;
  };

  it("une contenido + grupos + inglés y deja fuera _lee_esto y gaps", () => {
    const h = copiarEntrega({ entrega, raiz, contenido: maqueta() });
    expect(h.contenido).toBe("content/vitrina/x.contenido.json");
    const salida = JSON.parse(
      readFileSync(path.join(raiz, h.contenido!), "utf8"),
    );
    expect(salida).toEqual({
      schema_version: "2.0.0-borrador",
      app: "x",
      acento: "sage",
      grupos: [{ orden: 1 }],
      en: { promesa: { tagline: "t" } },
    });
    expect(JSON.stringify(salida)).not.toMatch(/_lee_esto|gaps/);
  });

  it("sin grupos ni inglés, lo que hay se copia tal cual; sin contenido.json se niega", () => {
    const m = path.join(dir, "maqueta", "y");
    escribir(path.join(m, "contenido.json"), '{"app":"y","acento":"sky"}');
    expect(componerContenido(m).compuesto).toEqual({ app: "y", acento: "sky" });
    expect(() => componerContenido(path.join(dir, "maqueta", "z"))).toThrow(
      /falta contenido\.json/,
    );
  });

  it("--solo-contenido: copia solo el v2 (S30), con el slug de su contenido, y no toca la entrega", () => {
    escribir(
      path.join(raiz, "content", "vitrina", "x.brochure-export.json"),
      "ya estaba",
    );
    const h = copiarContenido({ contenido: maqueta(), raiz });
    expect(h.slug).toBe("x");
    expect(h.copiados).toEqual([]);
    expect(h.contenido).toBe("content/vitrina/x.contenido.json");
    expect(
      readFileSync(
        path.join(raiz, "content/vitrina/x.brochure-export.json"),
        "utf8",
      ),
    ).toBe("ya estaba");
    expect(
      JSON.parse(readFileSync(path.join(raiz, h.contenido), "utf8")),
    ).toEqual({
      schema_version: "2.0.0-borrador",
      app: "x",
      acento: "sage",
      grupos: [{ orden: 1 }],
      en: { promesa: { tagline: "t" } },
    });
    // La casa, al suyo: nunca junto a las diez.
    expect(
      copiarContenido({ contenido: maqueta(), raiz, casa: true }).contenido,
    ).toBe("content/vitrina/casa/x.contenido.json");
  });

  it("--solo-contenido se niega con un slug raro o sin contenido.json", () => {
    const m = path.join(dir, "maqueta", "raro");
    escribir(path.join(m, "contenido.json"), '{"app":"../afuera"}');
    expect(() => copiarContenido({ contenido: m, raiz })).toThrow(
      /slug inválido/,
    );
    expect(() =>
      copiarContenido({ contenido: path.join(dir, "maqueta", "nada"), raiz }),
    ).toThrow(/falta contenido\.json/);
  });
});
