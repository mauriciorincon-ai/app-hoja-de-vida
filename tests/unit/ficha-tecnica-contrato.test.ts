import { readdirSync, readFileSync, writeFileSync } from "node:fs";
import { describe, expect, it } from "vitest";
import { parse } from "yaml";
import { z } from "zod";
import { armarFichaTecnica } from "@/lib/vitrina/ficha-tecnica/armar";
import {
  getFichasTecnicas,
  getFichaTecnica,
} from "@/lib/vitrina/ficha-tecnica/loader";
import {
  complementoSchema,
  fichaTecnicaSchema,
  procesoSchema,
} from "@/lib/vitrina/ficha-tecnica/schema";
import { getFicha } from "@/lib/vitrina/loader";

/**
 * El contrato «ficha técnica» (ADR-016): lo que CV Viva consume de otras casas
 * y lo que arma para sus apps. Un YAML que miente rompe el build.
 */

const complementos = readdirSync("data/fichas")
  .filter((f) => f.endsWith(".yaml"))
  .map(
    (f) =>
      parse(readFileSync(`data/fichas/${f}`, "utf8")) as Record<
        string,
        unknown
      >,
  );

function habla() {
  return structuredClone(complementos.find((c) => c.app === "habla")!) as {
    proceso: {
      pasos: { id: string; tipo: string }[];
      flujos: { de: string; a: string }[];
    };
    cifras_destacadas: string[];
    app: string;
  };
}

describe("complementos reales", () => {
  it("hay uno por app del escaparate y todos validan", () => {
    expect(complementos.map((c) => c.app).sort()).toEqual(
      readdirSync("content/vitrina")
        .filter((f) => f.endsWith(".brochure-export.json"))
        .map((f) => f.replace(".brochure-export.json", ""))
        .sort(),
    );
    for (const c of complementos)
      expect(complementoSchema.safeParse(c).success).toBe(true);
  });

  it("los seis procesos son BPMN válido y hoy los declara CV Viva", () => {
    for (const c of complementos) {
      expect(c.procedencia).toBe("cv-viva");
      expect(procesoSchema.safeParse(c.proceso).success).toBe(true);
    }
  });
});

describe("procesoSchema — lo que no es un proceso", () => {
  it("sin fin, no hay proceso", () => {
    const c = habla();
    c.proceso.pasos = c.proceso.pasos.filter((p) => p.tipo !== "fin");
    c.proceso.flujos = c.proceso.flujos.filter((f) => f.a !== "fin");
    const r = procesoSchema.safeParse(c.proceso);
    expect(r.success).toBe(false);
    expect(JSON.stringify(r.error?.issues)).toContain("al menos un fin");
  });

  it("una decisión con un solo camino no decide nada", () => {
    const c = habla();
    c.proceso.flujos = c.proceso.flujos.filter(
      (f) => !(f.de === "acierto" && f.a === "habla"),
    );
    const r = procesoSchema.safeParse(c.proceso);
    expect(r.success).toBe(false);
    expect(JSON.stringify(r.error?.issues)).toContain(
      "«acierto» necesita al menos dos caminos",
    );
  });

  it("un paso al que nadie llega se nombra", () => {
    const c = habla();
    c.proceso.flujos = c.proceso.flujos.filter((f) => f.a !== "rumbo");
    c.proceso.flujos.push({ de: "suma", a: "fin" });
    const r = procesoSchema.safeParse(c.proceso);
    expect(r.success).toBe(false);
    expect(JSON.stringify(r.error?.issues)).toContain(
      "«rumbo» no es alcanzable",
    );
  });

  it("una tarea que no cabe en 60 caracteres son dos tareas", () => {
    const c = habla();
    c.proceso.pasos[1] = {
      ...c.proceso.pasos[1],
      texto: "x".repeat(61),
    } as never;
    expect(procesoSchema.safeParse(c.proceso).success).toBe(false);
  });
});

describe("armarFichaTecnica", () => {
  it("arma la ficha de habla y pasa el contrato completo", () => {
    const ft = getFichaTecnica("habla")!;
    expect(fichaTecnicaSchema.safeParse(ft).success).toBe(true);
    expect(ft.cifras).toHaveLength(5);
    expect(ft.cifras.every((c) => c.fuente)).toBe(true);
    expect(ft.bloques).toHaveLength(8);
    expect(ft.hitos.map((h) => h.etiqueta)).toContain("sellada");
    expect(ft.procedencia_proceso).toBe("cv-viva");
  });

  it("una cifra destacada que no existe en el export rompe nombrándola", () => {
    const c = complementoSchema.parse({
      ...habla(),
      cifras_destacadas: ["funcionalidades", "pantallas", "no_existe"],
    });
    expect(() => armarFichaTecnica(getFicha("habla")!, c)).toThrow(
      /«no_existe» no existe en su export/,
    );
  });

  it("un complemento de otra app no se aplica", () => {
    const c = complementoSchema.parse(habla());
    expect(() => armarFichaTecnica(getFicha("ds")!, c)).toThrow(
      /«habla».*«ds»/,
    );
  });

  it("las seis fichas técnicas se arman (una sola fuente de piezas)", () => {
    expect(getFichasTecnicas()).toHaveLength(6);
  });

  it("más de cinco cifras no es infografía", () => {
    const ft = getFichaTecnica("habla")!;
    const r = fichaTecnicaSchema.safeParse({
      ...ft,
      cifras: [...ft.cifras, ft.cifras[0]],
    });
    expect(r.success).toBe(false);
  });
});

/**
 * Lo publicado en docs/contrato-ficha-tecnica/ se GENERA de aquí — una sola
 * fuente de verdad. Con `GENERAR_CONTRATO=1` (script `pnpm contrato:ficha`)
 * este test escribe los archivos; sin la variable, exige que coincidan.
 */
describe("lo publicado en docs/contrato-ficha-tecnica/ es este contrato", () => {
  const DIR = "docs/contrato-ficha-tecnica";
  const generado = {
    "ficha-tecnica.schema.json": z.toJSONSchema(fichaTecnicaSchema, {
      unrepresentable: "any",
    }),
    "ejemplo.habla.json": getFichaTecnica("habla")!,
  };
  for (const [archivo, contenido] of Object.entries(generado)) {
    it(`${archivo} coincide con el Zod de la app`, () => {
      if (process.env.GENERAR_CONTRATO) {
        writeFileSync(
          `${DIR}/${archivo}`,
          JSON.stringify(contenido, null, 2) + "\n",
        );
        return;
      }
      expect(JSON.parse(readFileSync(`${DIR}/${archivo}`, "utf8"))).toEqual(
        contenido,
      );
    });
  }
});
