import { existsSync, readFileSync } from "node:fs";
import path from "node:path";
import { describe, expect, it } from "vitest";
import {
  DIR_A_FONDO,
  leerDocumentos,
  problemasDeDestino,
  problemasDeNombre,
  problemasDeParidad,
  problemasDePrivacidad,
} from "../../scripts/a-fondo.mjs";
import { catalogoDeDestinos } from "../../scripts/destinos.mjs";
import esqueleto from "../fixtures/historia-esqueleto-s3.json";

/**
 * EL CANAL «A FONDO» CONTRA LOS DOCUMENTOS REALES.
 *
 * Hermano de `content-fichas.test.ts`: el nombre de cada caso es la ruta del
 * archivo, para que un rojo diga QUÉ documento y no «uno de los 24».
 *
 * Y el TEST DE CONSERVACIÓN de la migración. La orden pedía un «test de
 * igualdad de prosa» entre la historia y el canal nuevo; **no había prosa que
 * comparar** —el esqueleto del S3 eran 12 encabezados con su guía y cero
 * contenido—, así que probar igualdad habría probado el vacío. Lo que sí se
 * puede conservar, y es lo que valía, son los 12 ids, sus títulos, sus destinos
 * y las guías que escribió el dueño. Eso es lo que se exige aquí, contra
 * `tests/fixtures/historia-esqueleto-s3.json`, que congela el esqueleto el día
 * que se retiró.
 */

type Sub = { id: string; titulo: string; texto: string };
type Doc = {
  slug: string;
  titulo: string;
  estado: string;
  ancla: string;
  archivo: string;
  preguntas_de_prueba: string[];
  subsecciones: Sub[];
};

const catalogo = catalogoDeDestinos();
const docs: Record<"es" | "en", Doc[]> = {
  es: leerDocumentos("es"),
  en: leerDocumentos("en"),
};
const todos = (["es", "en"] as const).flatMap((l) =>
  docs[l].map((d) => [l, d] as const),
);

describe("los documentos de data/a-fondo/", () => {
  it("hay documentos que validar (si no, este gate no vigila nada)", () => {
    expect(docs.es.length).toBeGreaterThan(0);
  });

  it.each(todos.map(([l, d]) => [d.archivo, l, d] as const))(
    "%s se llama como su slug",
    (_ruta, locale, d) => {
      expect(problemasDeNombre(d, locale)).toEqual([]);
    },
  );

  it.each(todos.map(([, d]) => [d.archivo, d] as const))(
    "%s cita hacia un destino que EXISTE",
    (_ruta, d) => {
      expect(problemasDeDestino(d, catalogo)).toEqual([]);
    },
  );

  it.each(todos.map(([, d]) => [d.archivo, d] as const))(
    "%s no trae un dato de contacto ni de un tercero (lo mecánico)",
    (_ruta, d) => {
      const crudo = readFileSync(path.join(process.cwd(), d.archivo), "utf8");
      expect(problemasDePrivacidad(crudo, d.archivo)).toEqual([]);
    },
  );

  it("la paridad ES/EN de los documentos aprobados está sana", () => {
    expect(problemasDeParidad(docs.es, docs.en)).toEqual([]);
  });

  it.each(todos.map(([, d]) => [d.archivo, d] as const))(
    "%s declara al menos dos preguntas de prueba",
    (_ruta, d) => {
      expect(d.preguntas_de_prueba.length).toBeGreaterThanOrEqual(2);
    },
  );

  it("ningún slug se repite dentro de un idioma", () => {
    for (const locale of ["es", "en"] as const) {
      const slugs = docs[locale].map((d) => d.slug);
      expect(new Set(slugs).size, `slugs repetidos en ${locale}`).toBe(
        slugs.length,
      );
    }
  });
});

describe("conservación de la historia retirada (S3 → S8)", () => {
  const porSlug = new Map(docs.es.map((d) => [d.slug, d]));
  const crudos = new Map(
    docs.es.map((d) => [
      d.slug,
      readFileSync(path.join(process.cwd(), d.archivo), "utf8"),
    ]),
  );

  it("el esqueleto congelado tiene las 12 secciones de las que se parte", () => {
    expect(esqueleto.es).toHaveLength(12);
    expect(esqueleto.en).toHaveLength(12);
  });

  it.each(esqueleto.es.map((s) => [s.id, s] as const))(
    "la sección «%s» sobrevive a la migración con su título y su destino",
    (id, s) => {
      const d = porSlug.get(id);
      expect(
        d,
        `data/a-fondo/${id}.es.md no existe: la migración perdió una sección de la historia`,
      ).toBeDefined();
      expect(d!.titulo).toBe(s.titulo);
      // El único destino que cambió, y con razón declarada: «#apps» murió en la
      // revisión post-S7 (la sección se retiró y el roadmap se fue a la vitrina).
      expect(d!.ancla).toBe(s.ancla === "#apps" ? "#vitrina" : s.ancla);
    },
  );

  it.each(esqueleto.es.map((s) => [s.id, s] as const))(
    "la guía de «%s» sigue en el documento, palabra por palabra",
    (id, s) => {
      const crudo = crudos.get(id);
      expect(crudo, `falta data/a-fondo/${id}.es.md`).toBeDefined();
      const normalizar = (t: string) => t.replace(/\s+/g, " ").trim();
      expect(
        normalizar(crudo!),
        `la guía que escribió el dueño para «${id}» se perdió en la migración`,
      ).toContain(normalizar(s.guia));
    },
  );

  it("no queda rastro de data/historia/ — el canal viejo se retiró de verdad", () => {
    expect(existsSync(path.join(process.cwd(), "data", "historia"))).toBe(false);
  });

  it("los documentos migrados viven donde dice el canal", () => {
    expect(path.basename(DIR_A_FONDO)).toBe("a-fondo");
  });
});
