import { describe, expect, it } from "vitest";
import {
  agruparFuentes,
  fuentesCitadas,
  numerosCitados,
} from "@/lib/ia/fuentes";
import type { Fuente } from "@/lib/ia/schemas";

/**
 * LOS CHIPS DE CITA (2026-09-26). El buscador devuelve fragmentos, y dos
 * fragmentos del mismo documento pintaban dos chips idénticos
 * (`[3] AF-17 · Skills` `[4] AF-17 · Skills`). Un chip por documento y
 * destino, con todos sus números: la respuesta cita por número y ninguno se
 * puede perder.
 */

const f = (
  n: number,
  codigo: string,
  ancla: string,
  titulo = `t${n}`,
): Fuente => ({
  n,
  codigo,
  titulo,
  ancla,
  destino: ancla,
});

describe("agruparFuentes", () => {
  it("dos fragmentos del mismo documento y destino son UN chip con sus dos números", () => {
    const chips = agruparFuentes([
      f(1, "AF-09", "/proyectos/vesting"),
      f(2, "CV", "#trayectoria"),
      f(3, "AF-17", "#skills-bi-y-decision"),
      f(4, "AF-17", "#skills-bi-y-decision"),
    ]);
    expect(chips.map((c) => [c.ns, c.codigo])).toEqual([
      [[1], "AF-09"],
      [[2], "CV"],
      [[3, 4], "AF-17"],
    ]);
  });

  it("no se pierde ningún número, y el orden es el de la primera aparición", () => {
    const fuentes = [
      f(1, "AF-14", "#skills-plataforma-de-datos"),
      f(2, "AF-09", "/proyectos/vesting"),
      f(3, "AF-14", "#skills-plataforma-de-datos"),
      f(4, "AF-09", "/proyectos/vesting"),
    ];
    const chips = agruparFuentes(fuentes);
    expect(chips.map((c) => c.codigo)).toEqual(["AF-14", "AF-09"]);
    expect(chips.flatMap((c) => c.ns).sort()).toEqual([1, 2, 3, 4]);
  });

  it("el mismo código hacia destinos distintos sigue siendo dos chips", () => {
    const chips = agruparFuentes([
      f(1, "CV", "#trayectoria"),
      f(2, "CV", "#skills"),
    ]);
    expect(chips).toHaveLength(2);
  });

  it("el tooltip junta los títulos distintos, sin repetir", () => {
    const [chip] = agruparFuentes([
      f(1, "AF-09", "/proyectos/vesting", "Vesting · Monitoreo"),
      f(2, "AF-09", "/proyectos/vesting", "Vesting · Arquitectura"),
      f(3, "AF-09", "/proyectos/vesting", "Vesting · Monitoreo"),
    ]);
    expect(chip.titulo).toBe("Vesting · Monitoreo\nVesting · Arquitectura");
  });

  it("sin fuentes, sin chips", () => {
    expect(agruparFuentes([])).toEqual([]);
  });
});

/**
 * SOLO LAS FUENTES CITADAS (S24, OM-16). El servidor manda las recuperadas
 * antes de que el modelo hable; el panel pinta un chip por cada fuente que el
 * TEXTO cita con `[n]`. «¿Cómo está el clima?» recuperaba el tablero de
 * energía y clima y lo mostraba como fuente de una respuesta que no lo usaba.
 */
describe("fuentesCitadas", () => {
  const recuperadas = [
    f(1, "AF-09", "/proyectos/vesting"),
    f(2, "CV", "#trayectoria"),
    f(3, "FT", "/portafolio/tableros/energia-y-clima"),
    f(4, "AF-17", "#skills"),
  ];

  it("una respuesta que no cita nada no trae chips, aunque se hayan recuperado cuatro fuentes", () => {
    expect(
      fuentesCitadas("Ese tema se me escapa: solo sé de la trayectoria de Henry.", recuperadas),
    ).toEqual([]);
  });

  it("trae solo las fuentes cuyo número aparece, en el orden de la recuperación", () => {
    const citadas = fuentesCitadas(
      "Henry lideró la estrategia de datos [2] y construyó el ecosistema en Fabric [1].",
      recuperadas,
    );
    expect(citadas.map((c) => c.n)).toEqual([1, 2]);
  });

  it("lee las tres formas de citar: [1], [1, 3] y [2][4]", () => {
    expect([...numerosCitados("a [1] b [2, 3] c [4][1]")].sort()).toEqual([1, 2, 3, 4]);
    expect([...numerosCitados("a [1,3]; b [2 , 4]")].sort()).toEqual([1, 2, 3, 4]);
  });

  it("un número citado que no se recuperó no inventa un chip", () => {
    expect(fuentesCitadas("Eso consta [9].", recuperadas)).toEqual([]);
  });

  it("los corchetes que no son citas no cuentan", () => {
    expect(fuentesCitadas("[AF-09] y [n] y [ ]", recuperadas)).toEqual([]);
  });

  it("la ajena que cita el tablero de energía y clima ya no lo muestra si el texto no lo cita", () => {
    const texto = "El clima no es mi tema, pero puedo hablar de la trayectoria de Henry [1].";
    expect(fuentesCitadas(texto, recuperadas).map((c) => c.codigo)).toEqual(["AF-09"]);
  });

  it("el fallback local, que cita todo lo que enseña, enseña todos sus chips", () => {
    const texto = recuperadas.map((r) => `[${r.n}] fragmento`).join("\n\n");
    expect(fuentesCitadas(texto, recuperadas)).toHaveLength(4);
  });
});
