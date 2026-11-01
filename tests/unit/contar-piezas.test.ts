import {
  mkdirSync,
  mkdtempSync,
  readFileSync,
  rmSync,
  writeFileSync,
} from "node:fs";
import { tmpdir } from "node:os";
import path from "node:path";
import { describe, expect, it } from "vitest";
import { parse } from "yaml";
import {
  contarPiezas,
  FRENTES_CONTABLES,
} from "../../scripts/contar-piezas.mjs";
import { cvSchema } from "@/lib/schemas";
import { getFrentes } from "@/lib/vitrina/categorias";
import { getPiezas } from "@/lib/vitrina/piezas";
import { getCv } from "@/lib/content";
import { buildChunks } from "../../scripts/build-chat-index.mjs";

/**
 * EL LOGRO «AGENTES DE IA PROPIOS» SE CUENTA, NO SE ESCRIBE (S29, OM-03).
 *
 * `contar: "agentes"` tiene TRES lectores —el esquema Zod, el índice del chat y el PDF—, y los dos
 * últimos leen el YAML sin pasar por el esquema: con la cuenta solo en el esquema, el chat habría dicho
 * «undefined agentes». Los tres usan `scripts/contar-piezas.mjs`, y esta prueba exige que esa cuenta sea
 * la MISMA que la puerta de la home mide de `content/` (decisión del dueño, 2026-10-04: «un total escrito
 * aquí caducaría en días»).
 */

// El CV real, crudo: lo que leen el chat y el PDF (sin esquema), con los logros que cada prueba pone.
const base = parse(readFileSync("data/cv.es.yaml", "utf8")) as Record<
  string,
  unknown
>;
const conLogro = (logro: Record<string, unknown>) =>
  cvSchema.parse({
    ...base,
    logros: [{ etiqueta: "agentes", descripcion: "Desc", ...logro }],
  });

describe("contarPiezas", () => {
  it("cuenta lo mismo que la puerta de la home, frente por frente", () => {
    const puerta = new Map(getFrentes().map((f) => [f.id, f.piezas]));
    for (const frente of FRENTES_CONTABLES) {
      expect(contarPiezas(frente), frente).toBe(puerta.get(frente));
    }
    // y no es un cero que coincide: hay agentes publicados
    expect(contarPiezas("agentes")).toBe(getPiezas("agentes").length);
    expect(contarPiezas("agentes")).toBeGreaterThan(0);
  });

  it("cuenta fichas y exports, y vale 0 sin carpeta (un frente que empieza no es un repo roto)", () => {
    const raiz = mkdtempSync(path.join(tmpdir(), "contar-"));
    try {
      expect(contarPiezas("agentes", raiz)).toBe(0);
      mkdirSync(path.join(raiz, "content", "agentes"), { recursive: true });
      for (const n of ["a", "b", "c"])
        writeFileSync(
          path.join(raiz, "content", "agentes", `${n}.ficha-tecnica.json`),
          "{}",
        );
      // lo que no es una ficha no cuenta
      writeFileSync(path.join(raiz, "content", "agentes", "LEEME.md"), "x");
      expect(contarPiezas("agentes", raiz)).toBe(3);
      mkdirSync(path.join(raiz, "content", "vitrina"), { recursive: true });
      writeFileSync(
        path.join(raiz, "content", "vitrina", "x.brochure-export.json"),
        "{}",
      );
      expect(contarPiezas("apps", raiz)).toBe(1);
    } finally {
      rmSync(raiz, { recursive: true, force: true });
    }
  });

  it("un frente que no existe rompe, con su nombre (el rojo del gate)", () => {
    expect(() => contarPiezas("constructor")).toThrow(/no es un frente/);
    expect(() => contarPiezas("robots")).toThrow(/no es un frente/);
  });
});

describe("el esquema: `contar` calcula el valor en build", () => {
  it("un logro con `contar` trae el valor medido, sin que nadie lo escriba", () => {
    expect(conLogro({ contar: "agentes" }).logros[0]!.valor).toBe(
      getPiezas("agentes").length,
    );
  });

  it("`contar` y `valor`, `contar` y `desde`, o un frente inexistente: el build falla", () => {
    expect(() => conLogro({ contar: "agentes", valor: 11 })).toThrow(
      /UNA sola fuente/,
    );
    expect(() => conLogro({ contar: "agentes", desde: "2020-01" })).toThrow(
      /UNA sola fuente/,
    );
    expect(() => conLogro({ contar: "dragones" })).toThrow();
    // y sin ninguna de las tres, también
    expect(() => conLogro({})).toThrow(/`contar`/);
  });
});

describe("los tres lectores dicen la misma cifra", () => {
  it("el logro de la home, el índice del chat y el de la puerta coinciden", () => {
    const n = getPiezas("agentes").length;
    const logro = getCv("es").logros.find((l) =>
      /agentes de IA propios/i.test(l.etiqueta),
    );
    expect(logro?.valor, "la home").toBe(n);
    // El índice del chat lee el YAML crudo: sin `contar` resuelto diría «undefined».
    const chunks = buildChunks({
      cv: {
        ...base,
        logros: [
          {
            contar: "agentes",
            etiqueta: "agentes propios",
            descripcion: "Desc",
          },
        ],
      },
      apps: { apps: [] },
      aFondo: [],
      locale: "es",
    }) as { id: string; texto: string }[];
    const texto = chunks.find((c) => c.id === "logros")?.texto ?? "";
    expect(texto).toContain(`${n} agentes propios`);
    expect(texto).not.toContain("undefined");
  });
});
