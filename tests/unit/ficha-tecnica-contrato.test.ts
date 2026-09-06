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
 * LA PLANTILLA (v1.2.0, O3 del S7) — el esqueleto que cualquier casa
 * productora rellena para entregar una ficha. Se DERIVA del JSON Schema, que a
 * su vez se deriva del Zod: si mañana el contrato gana un campo, la plantilla
 * lo gana sola. Escrita a mano se desviaría en el primer cambio — y una
 * plantilla desviada enseña a producir fichas inválidas.
 *
 * No pretende validar: sus valores son MARCADORES que llevan su propia regla
 * («<texto · 1–240 caracteres>»), que es justo lo que un humano necesita ver.
 */
type Esquema = {
  type?: string;
  enum?: unknown[];
  anyOf?: Esquema[];
  pattern?: string;
  minLength?: number;
  maxLength?: number;
  minimum?: number;
  minItems?: number;
  maxItems?: number;
  items?: Esquema;
  properties?: Record<string, Esquema>;
  required?: string[];
};

const PATRONES: Record<string, string> = {
  "^\\d{4}-\\d{2}-\\d{2}$": "AAAA-MM-DD",
  "^1\\.\\d+\\.\\d+$": "1.2.0",
  "^[a-z0-9-]+$": "<kebab-case",
};

function marcador(e: Esquema): unknown {
  if (e.anyOf) {
    // `x | null`: se muestra la forma con valor y se avisa que null vale.
    const sinNull = e.anyOf.find((a) => a.type !== "null")!;
    const v = marcador(sinNull);
    if (typeof v !== "string") return v;
    // El marcador con forma «<…>» lleva la nota dentro; uno fijo («AAAA-MM-DD»)
    // la lleva al lado, porque partirlo lo dejaría ilegible.
    return v.endsWith(">") ? `${v.slice(0, -1)} · o null>` : `${v} · o null`;
  }
  if (e.enum) return `<uno de: ${e.enum.join(" | ")}>`;
  if (e.type === "integer" || e.type === "number")
    return e.minimum === 0 ? 0 : 1;
  if (e.type === "array") {
    const cuantos = Math.max(e.minItems ?? 1, 1);
    return Array.from({ length: cuantos }, () => marcador(e.items!));
  }
  if (e.type === "object") {
    const obj: Record<string, unknown> = {};
    for (const [k, v] of Object.entries(e.properties ?? {}))
      obj[k] = marcador(v);
    return obj;
  }
  // string
  const fijo = e.pattern && PATRONES[e.pattern];
  if (fijo)
    return fijo.startsWith("<") ? `${fijo} · máx ${e.maxLength}>` : fijo;
  const min = e.minLength ?? 0;
  return `<texto · ${min || 1}–${e.maxLength} caracteres>`;
}

function plantillaDesde(raiz: Esquema): Record<string, unknown> {
  const opcionales = Object.keys(raiz.properties ?? {}).filter(
    (k) => !(raiz.required ?? []).includes(k),
  );
  return {
    _plantilla: `Contrato «ficha técnica» v1.2.0. Reemplaza cada <marcador> y BORRA esta clave. Opcionales: ${opcionales.join(", ")} (el proceso y su procedencia van juntos o no van). Las cifras llevan SIEMPRE su fuente, y no se escribe ni un enlace ni un DOI.`,
    ...(marcador(raiz) as Record<string, unknown>),
  };
}

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
    "plantilla.ficha-tecnica.json": plantillaDesde(
      z.toJSONSchema(fichaTecnicaSchema, {
        unrepresentable: "any",
      }) as Esquema,
    ),
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

/**
 * v1.1.0 (orden del usuario, 2026-09-06): el proceso BPMN es OPCIONAL. Si
 * viene, trae su procedencia; si no viene, la procedencia sobra. Lo que sigue
 * siendo obligatorio no cambia (una ficha v1.0.0 válida sigue válida).
 */
describe("el proceso es opcional (contrato v1.1.0)", () => {
  function hablaSinProceso() {
    const c = habla() as Record<string, unknown>;
    delete c.proceso;
    delete c.procedencia;
    return c;
  }

  it("un complemento sin proceso valida y arma una ficha sin «Cómo funciona»", () => {
    const c = complementoSchema.parse(hablaSinProceso());
    const ft = armarFichaTecnica(getFicha("habla")!, c);
    expect(ft.schema_version).toBe("1.2.0");
    expect(ft.proceso).toBeUndefined();
    expect(ft.procedencia_proceso).toBeUndefined();
    expect(fichaTecnicaSchema.safeParse(ft).success).toBe(true);
  });

  it("procedencia sin proceso sobra — y se nombra", () => {
    const r = complementoSchema.safeParse({
      ...hablaSinProceso(),
      procedencia: "cv-viva",
    });
    expect(r.success).toBe(false);
    expect(JSON.stringify(r.error?.issues)).toContain(
      "«procedencia» sin proceso: sobra",
    );
  });

  it("un proceso sin procedencia es una cifra sin fuente — y se nombra", () => {
    const ft = getFichaTecnica("habla")!;
    const { procedencia_proceso: _sin, ...sinProcedencia } = ft;
    void _sin;
    const r = fichaTecnicaSchema.safeParse(sinProcedencia);
    expect(r.success).toBe(false);
    expect(JSON.stringify(r.error?.issues)).toContain(
      "el proceso necesita su «procedencia_proceso»",
    );
  });

  it("las seis apps siguen trayendo su proceso", () => {
    for (const ft of getFichasTecnicas()) {
      expect(ft.proceso, ft.pieza.slug).toBeDefined();
      expect(ft.procedencia_proceso).toBe("cv-viva");
    }
  });
});
