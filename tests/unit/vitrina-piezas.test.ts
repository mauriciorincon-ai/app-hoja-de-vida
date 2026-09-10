import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";
import {
  frentesConPiezas,
  getPieza,
  getPiezas,
  parseFicha,
} from "@/lib/vitrina/piezas";

/**
 * EL LOADER GENÉRICO DE PIEZAS (S7) — `content/<frente>/`.
 *
 * Cuatro gates, y cada uno nació con su rojo (bitácora del S7, fase 2):
 * el fail-safe que nombra archivo y campo · la puerta de mayor · la carpeta
 * ausente que devuelve `[]` en vez de romper · el orden determinista.
 */

const habla = () =>
  JSON.parse(
    readFileSync("docs/contrato-ficha-tecnica/ejemplo.habla.json", "utf8"),
  ) as Record<string, unknown>;

describe("parseFicha — el núcleo puro del loader", () => {
  it("una ficha real del contrato pasa", () => {
    expect(parseFicha(habla(), "x.json").pieza.slug).toBe("habla");
  });

  it("una ficha inválida nombra el ARCHIVO y el CAMPO, no «invalid input»", () => {
    const rota = habla();
    (rota.promesa as Record<string, unknown>).tagline = "";
    expect(() =>
      parseFicha(rota, "content/agentes/x.ficha-tecnica.json"),
    ).toThrowError(/content\/agentes\/x\.ficha-tecnica\.json/);
    expect(() =>
      parseFicha(rota, "content/agentes/x.ficha-tecnica.json"),
    ).toThrowError(/promesa\.tagline/);
  });

  it("el error dice que NO se edita aquí: se corrige en origen", () => {
    const rota = habla();
    delete rota.titular;
    expect(() => parseFicha(rota, "x.json")).toThrowError(/NO se editan aquí/);
  });

  it("un mayor distinto se rechaza diciendo POR QUÉ, no con el patrón del regex", () => {
    const futura = { ...habla(), schema_version: "2.0.0" };
    expect(() => parseFicha(futura, "content/agentes/x.json")).toThrowError(
      /schema_version 2\.0\.0 — esta vitrina renderiza el mayor 1\.x\.x/,
    );
  });

  it("una ficha 1.1.0 sigue valiendo: v1.2.0 es aditivo", () => {
    expect(
      parseFicha({ ...habla(), schema_version: "1.1.0" }, "x").pieza.slug,
    ).toBe("habla");
  });
});

describe("getPiezas — lo que hay en content/<frente>/", () => {
  it("lee las piezas de cada frente entregado", () => {
    expect(getPiezas("agentes")).toHaveLength(13);
    expect(getPiezas("investigaciones")).toHaveLength(7);
    expect(getPiezas("tableros")).toHaveLength(6);
  });

  it("un frente SIN carpeta devuelve [] — es un frente que empieza, no un error", () => {
    // Hoy los cuatro frentes tienen carpeta, así que el caso se ejercita con
    // uno que no existe en disco: es exactamente lo que verá el quinto frente
    // el día que se declare en el YAML antes de recibir su primera ficha.
    expect(
      getPiezas("un-frente-que-empieza" as Parameters<typeof getPiezas>[0]),
    ).toEqual([]);
  });

  it("el orden es explícito: selladas primero, luego alfabético es-CO", () => {
    const agentes = getPiezas("agentes");
    const selladas = agentes.filter((p) => p.pieza.estado === "sellado");
    // Todas las selladas van antes que la primera inicial.
    expect(
      agentes
        .slice(0, selladas.length)
        .every((p) => p.pieza.estado === "sellado"),
    ).toBe(true);
    for (const grupo of [
      agentes.slice(0, selladas.length),
      agentes.slice(selladas.length),
    ]) {
      const nombres = grupo.map((p) => p.pieza.nombre);
      expect(nombres).toEqual(
        [...nombres].sort((a, b) => a.localeCompare(b, "es-CO")),
      );
    }
  });

  it("el orden NO depende del sistema de archivos: es el mismo en cada llamada", () => {
    expect(getPiezas("investigaciones").map((p) => p.pieza.slug)).toEqual(
      getPiezas("investigaciones").map((p) => p.pieza.slug),
    );
  });

  it("toda pieza vive en la carpeta que declara", () => {
    for (const frente of ["agentes", "investigaciones", "tableros"] as const)
      for (const p of getPiezas(frente)) expect(p.pieza.frente).toBe(frente);
  });
});

describe("getPieza y frentesConPiezas", () => {
  it("encuentra una pieza por su slug dentro de su frente", () => {
    expect(getPieza("investigaciones", "forja")?.pieza.nombre).toContain(
      "FORJA",
    );
  });

  it("un slug que no está en ese frente es undefined, no un error", () => {
    expect(getPieza("investigaciones", "hiring-copilot")).toBeUndefined();
    expect(getPieza("agentes", "no-existe")).toBeUndefined();
  });

  it("los frentes con piezas se MIDEN de content/<frente>/ — «apps» no sale de ahí", () => {
    expect(frentesConPiezas()).toEqual([
      "agentes",
      "investigaciones",
      "tableros",
    ]);
  });
});
