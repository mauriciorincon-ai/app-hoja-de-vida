import { describe, expect, it } from "vitest";
import { casa } from "../../scripts/evaluar-corpus.mjs";

/**
 * `casa()` decide si un fragmento del índice es la fuente que una fila del banco
 * espera. Es la regla que separa «la fila acierta» de «la fila no acierta»: si
 * deja fuera un fragmento que sí es la fuente, la fila exige más de lo que dice.
 */
describe("casa(): ¿este fragmento es la fuente esperada?", () => {
  it("el id exacto casa", () => {
    expect(casa("estudios", "estudios")).toBe(true);
    expect(casa("perfil", "perfil")).toBe(true);
  });

  it("un documento a fondo casa con todos sus fragmentos, por sección y por tramo", () => {
    expect(casa("a-fondo-vesting-el-proceso-core", "vesting")).toBe(true);
    expect(casa("a-fondo-vesting-el-proceso-core~2", "vesting")).toBe(true);
  });

  it("un id casa con sus fragmentos con guion (los bloques de una pieza de «Métodos»)", () => {
    expect(casa("metodo-bi-que-se-usa-bloque-4~6", "metodo-bi-que-se-usa")).toBe(true);
    expect(casa("agentes-constructor-tableros-powerbi-bloques", "agentes-constructor-tableros-powerbi")).toBe(true);
  });

  it("el primer tramo de un texto partido en `~N` también es la fuente (bajo del S15)", () => {
    expect(casa("agentes-constructor-tableros-powerbi~1", "agentes-constructor-tableros-powerbi")).toBe(true);
    expect(casa("agentes-constructor-tableros-powerbi~2", "agentes-constructor-tableros-powerbi")).toBe(true);
  });

  it("no casa con otro id que solo comparte el comienzo", () => {
    expect(casa("agentes-constructor-tableros-powerbix", "agentes-constructor-tableros-powerbi")).toBe(false);
    expect(casa("los-tableros-datos-para-agentes", "los-tablero")).toBe(false);
    expect(casa("metodo-bi~1", "metodo-bi-que-se-usa")).toBe(false);
  });
});
