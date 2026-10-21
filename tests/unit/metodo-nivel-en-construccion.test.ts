import { readdirSync, readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";
import { parse } from "yaml";
import { NIVELES } from "@/lib/metodo/schema";
import { problemasDeNivelDelSistemaDeGestion } from "@/lib/metodo/nivel-en-construccion";

/**
 * EL SISTEMA DE GESTIÓN DE CTIC, «EN CONSTRUCCIÓN» (S17, G-Plan 2a). El corpus lo
 * describe en estructuración (más de 20 instrumentos, un tercio terminados, sin
 * certificación); rotularlo «Uso real» sube su nivel. Toda tarjeta de Evidencia que
 * cite `fundacion-ctic` y hable del sistema de gestión lleva `en-construccion`.
 * Una pieza nueva entra a este barrido SOLA. El motor se prueba por los dos lados.
 */

const archivos = readdirSync("data/metodo").filter((f) => f.endsWith(".yaml"));

const tarjeta = (extra: Record<string, unknown>) => ({
  bloques: [
    {
      n: 8,
      evidencia: [
        {
          nombre: {
            es: "Fundación CTIC: el sistema de gestión bajo ISO/IEC 42001",
            en: "Fundación CTIC: the management system under ISO/IEC 42001",
          },
          nivel: "uso-real",
          texto: { es: "x", en: "x" },
          corpus: ["fundacion-ctic"],
          ...extra,
        },
      ],
    },
  ],
});

describe("el nivel existe en el esquema", () => {
  it("«en-construccion» es uno de los niveles", () => {
    expect(NIVELES).toContain("en-construccion");
  });
});

describe("las piezas de data/metodo/: el sistema de gestión de CTIC va «en construcción»", () => {
  it("hay piezas que barrer", () => {
    expect(archivos.length).toBeGreaterThan(0);
  });

  for (const f of archivos) {
    it(`data/metodo/${f}`, () => {
      const pieza = parse(readFileSync(`data/metodo/${f}`, "utf8"));
      const problemas = problemasDeNivelDelSistemaDeGestion(
        `data/metodo/${f}`,
        pieza,
      );
      expect(problemas, "\n" + problemas.join("\n")).toEqual([]);
    });
  }
});

describe("el motor, contra piezas de juguete", () => {
  const juzgar = (pieza: unknown) =>
    problemasDeNivelDelSistemaDeGestion("x.yaml", pieza);

  it("caza el sistema de gestión de CTIC con «uso real» y nombra el bloque, la tarjeta y el nivel", () => {
    const rojo = juzgar(tarjeta({}));
    expect(rojo).toHaveLength(1);
    expect(rojo[0]).toContain("bloque 8, evidencia 1");
    expect(rojo[0]).toContain("«uso-real»");
  });

  it("caza la forma inglesa aunque el español no lo diga", () => {
    const rojo = juzgar(
      tarjeta({
        nombre: {
          es: "Fundación CTIC: la norma",
          en: "Fundación CTIC: the AI management system",
        },
      }),
    );
    expect(rojo).toHaveLength(1);
  });

  it("aprueba el mismo texto con «en construcción»", () => {
    expect(juzgar(tarjeta({ nivel: "en-construccion" }))).toEqual([]);
  });

  it("no juzga la cartera ni los productos de CTIC (no hablan del sistema de gestión)", () => {
    expect(
      juzgar(
        tarjeta({
          nombre: {
            es: "Fundación CTIC: una cartera de IA con criterios comunes",
            en: "Fundación CTIC: an AI portfolio with shared criteria",
          },
        }),
      ),
    ).toEqual([]);
  });

  it("no juzga lo que otro proyecto dice de un sistema de gestión", () => {
    expect(juzgar(tarjeta({ corpus: ["banco-pichincha"] }))).toEqual([]);
  });

  it("no se rompe con una pieza sin bloque 8 ni evidencia", () => {
    expect(juzgar({ bloques: [] })).toEqual([]);
    expect(juzgar(null)).toEqual([]);
    expect(juzgar({ bloques: [{ n: 8 }] })).toEqual([]);
  });
});
