import { existsSync, readdirSync, readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";
import { parse } from "yaml";
import { parseVitrina, vitrinaSchema } from "@/lib/schemas";
import { getFrente, getFrentes } from "@/lib/vitrina/categorias";

/**
 * Los frentes de la vitrina (ADR-015): `data/vitrina.yaml` es contenido
 * versionado y pasa por el mismo fail-safe que el resto — un YAML que miente
 * sobre un frente rompe el build, no la vitrina.
 *
 * **S7 — la regla se levanta POR FRENTE.** Hasta el S6, «abierta» estaba
 * reservada a «apps» porque era el único con renderizador. Ahora el criterio es
 * medido: abre el frente que TIENE piezas, y ninguno puede abrir a mano. Por eso
 * la regla salió del esquema —que valida forma, y la forma no sabe qué hay en
 * disco— y vive en `parseVitrina`, que recibe la lista medida.
 */

/** Lo que hay HOY en el repo, medido: los exports de apps y las fichas del S7. */
const MEDIDOS = ["apps", "agentes", "investigaciones", "tableros"];

const real = parse(readFileSync("data/vitrina.yaml", "utf8")) as {
  categorias: { id: string; estado: string }[];
};

function conCambio(
  mutar: (c: { id: string; estado: string }[]) => void,
): unknown {
  const copia = structuredClone(real);
  mutar(copia.categorias);
  return copia;
}

describe("data/vitrina.yaml — los frentes", () => {
  it("el YAML real valida y trae los cuatro frentes en orden", () => {
    const v = parseVitrina(real, "data/vitrina.yaml", MEDIDOS);
    expect(v.categorias.map((c) => c.id)).toEqual([
      "apps",
      "agentes",
      "investigaciones",
      "tableros",
    ]);
  });

  it("«apps» es obligatorio: es el único frente con fuente de piezas", () => {
    const sinApps = conCambio((cs) => cs.splice(0, 1));
    const r = vitrinaSchema.safeParse(sinApps);
    expect(r.success).toBe(false);
    expect(JSON.stringify(r.error?.issues)).toContain("falta el frente «apps»");
  });

  it("un frente SIN piezas no puede declararse abierto, y el error lo nombra", () => {
    const tramposo = conCambio((cs) => {
      const t = cs.find((c) => c.id === "tableros");
      if (t) t.estado = "abierta";
    });
    // Se simula que «tableros» no tiene piezas quitándolo de la lista medida:
    // el YAML lo declara abierto y la medición lo desmiente.
    expect(() =>
      parseVitrina(
        tramposo,
        "data/vitrina.yaml",
        MEDIDOS.filter((m) => m !== "tableros"),
      ),
    ).toThrowError(/tableros: está marcada «abierta» y no tiene ni una pieza/);
  });

  it("un frente CON piezas SÍ puede abrir: la regla se levanta por frente", () => {
    const abierto = conCambio((cs) => {
      const i = cs.find((c) => c.id === "investigaciones");
      if (i) i.estado = "abierta";
    });
    const v = parseVitrina(abierto, "data/vitrina.yaml", MEDIDOS);
    expect(v.categorias.find((c) => c.id === "investigaciones")?.estado).toBe(
      "abierta",
    );
    // Y el mismo YAML, con ese frente fuera de la lista medida, rompe.
    expect(() =>
      parseVitrina(
        abierto,
        "data/vitrina.yaml",
        MEDIDOS.filter((m) => m !== "investigaciones"),
      ),
    ).toThrowError(/investigaciones: está marcada «abierta»/);
  });

  it("dos frentes con el mismo id rompen (serían la misma ruta)", () => {
    const repetido = conCambio((cs) => {
      cs[2].id = "agentes";
    });
    const r = vitrinaSchema.safeParse(repetido);
    expect(r.success).toBe(false);
    expect(JSON.stringify(r.error?.issues)).toContain("frente repetido");
  });

  it("un estado fuera del vocabulario honesto rompe", () => {
    const inventado = conCambio((cs) => {
      cs[1].estado = "casi-lista";
    });
    expect(vitrinaSchema.safeParse(inventado).success).toBe(false);
  });
});

describe("lib/vitrina/categorias — la cuenta de piezas", () => {
  it("todo frente declarado en el YAML cuenta alguna pieza", () => {
    // El número exacto lo comprueba la prueba siguiente contra el disco. Aquí
    // solo se exige que la medición esté viva: un frente que cuenta 0 estando
    // abierto es el fallo que `parseVitrina` tiene que haber cazado antes.
    for (const f of getFrentes())
      expect(f.piezas, `${f.id}: la cuenta no puede ser cero`).toBeGreaterThan(
        0,
      );
  });

  it("la cuenta mide contenido, no promesas: sale del disco en todo estado", () => {
    for (const f of getFrentes()) {
      if (f.id === "apps") continue; // sus piezas son los exports, no fichas
      const dir = `content/${f.id}`;
      const enDisco = existsSync(dir)
        ? readdirSync(dir).filter((x) => x.endsWith(".ficha-tecnica.json"))
            .length
        : 0;
      expect(f.piezas, `${f.id}: la cuenta debe ser la de ${dir}`).toBe(
        enDisco,
      );
    }
  });

  it("el estado de cada frente es el del YAML, y solo abre el que tiene piezas", () => {
    const estados = Object.fromEntries(
      getFrentes().map((f) => [f.id, f.estado]),
    );
    // No se clava el mapa de hoy: declarar un frente nuevo en el YAML es un
    // cambio de datos, no debe romper esta prueba. Lo que se exige es que el
    // estado salga del YAML y sea uno de los dos del contrato.
    for (const [id, estado] of Object.entries(estados))
      expect(["abierta", "en-preparacion"], id).toContain(estado);
    // Ninguno abierto sin piezas: la regla, comprobada sobre el YAML real.
    for (const f of getFrentes())
      if (f.estado === "abierta") expect(f.piezas).toBeGreaterThan(0);
  });

  it("el orden del portal es el del YAML", () => {
    expect(getFrentes().map((f) => f.id)).toEqual(
      real.categorias.map((c) => c.id),
    );
  });

  it("un frente que no existe es undefined, no un error", () => {
    expect(getFrente("no-existe")).toBeUndefined();
  });
});
