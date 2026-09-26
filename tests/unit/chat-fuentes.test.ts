import { describe, expect, it } from "vitest";
import { agruparFuentes } from "@/lib/ia/fuentes";
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
