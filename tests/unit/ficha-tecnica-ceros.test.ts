import { describe, expect, it } from "vitest";
import { getFichasTecnicas } from "@/lib/vitrina/ficha-tecnica/loader";
import { ESPERAN_SU_ENTREGA } from "../fixtures/esperan-su-entrega";

/**
 * LA REGLA DE LOS CEROS (OM-22, pedido 026): a lo sumo UN cero en la tira de
 * cifras de una app.
 *
 * «Las cifras están bien, pero muchos ceros juntos dan la impresión de algo a
 * medias» (el dueño, sobre Dash Agent: «costo de operación 0» está bien, «0
 * llamadas de red» ya suma demasiados). Un cero es una virtud cuando es LA
 * promesa de la app —«cero IA», «cero llamadas de red»—, y entonces va uno solo,
 * el que la propia app declara; los demás ceros siguen completos en la ficha de
 * detalle, donde se leen con su fuente. La tira la elige el complemento
 * (`cifras_destacadas`), no el código: por eso la regla es un gate de contenido.
 *
 * Nació con su rojo (regla 15): antes del 026, 7 de las 10 fichas tenían dos o
 * más ceros en su tira.
 */

const MAX_CEROS_EN_LA_TIRA = 1;

type Cifra = { clave: string; valor: number | string };

/** Las claves de la tira cuyo valor es cero. */
function cerosDeLaTira(cifras: Cifra[]): string[] {
  return cifras.filter((c) => Number(c.valor) === 0).map((c) => c.clave);
}

describe("a lo sumo un cero en la tira de cada app", () => {
  const fichas = getFichasTecnicas().filter(
    (f) => !ESPERAN_SU_ENTREGA.includes(f.pieza.slug),
  );

  it("hay fichas de apps que revisar", () => {
    expect(fichas.length).toBeGreaterThanOrEqual(10);
  });

  for (const f of fichas) {
    it(`${f.pieza.slug}: ${MAX_CEROS_EN_LA_TIRA} cero como máximo`, () => {
      const ceros = cerosDeLaTira(f.cifras);
      expect(
        ceros.length,
        `${f.pieza.slug} lleva ${ceros.length} ceros en su tira (${ceros.join(", ")})`,
      ).toBeLessThanOrEqual(MAX_CEROS_EN_LA_TIRA);
    });
  }

  it("la regla nombra los ceros que sobran (su rojo)", () => {
    const tira: Cifra[] = [
      { clave: "funcionalidades", valor: 73 },
      { clave: "filas_del_usuario_en_la_red", valor: 0 },
      { clave: "gpu_requerida", valor: 0 },
      { clave: "costo_operacion_mensual", valor: 0 },
    ];
    expect(cerosDeLaTira(tira)).toEqual([
      "filas_del_usuario_en_la_red",
      "gpu_requerida",
      "costo_operacion_mensual",
    ]);
    expect(cerosDeLaTira(tira).length).toBeGreaterThan(MAX_CEROS_EN_LA_TIRA);
    expect(cerosDeLaTira(tira.slice(0, 2)).length).toBe(1);
  });

  it("un valor cero escrito como texto cuenta igual", () => {
    expect(cerosDeLaTira([{ clave: "x", valor: "0" }])).toEqual(["x"]);
  });
});
