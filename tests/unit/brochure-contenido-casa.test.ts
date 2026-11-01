// @vitest-environment node
import { beforeEach, describe, expect, it, vi } from "vitest";

/**
 * LA CASA LEE SU CONTENIDO v2 (S30). Hasta el S30 el brochure de CV Viva y el de su chat se pintaban
 * siempre con el v1: `getContenido` exigía la ficha de una app del Portafolio, que la casa no tiene, y
 * el v2 aprobado de la casa no podía copiarse. Ahora se lee de `content/vitrina/casa/<slug>.contenido.json`
 * (donde lo deja `copiar-entrega.mjs --casa --contenido`) y su coherencia se comprueba contra la entrega
 * de la casa. Como hoy no hay un v2 de la casa en el repo, el archivo se simula: el resto (export,
 * capturas, complemento de la casa) es el real.
 */

const ARCHIVO = "content/vitrina/casa/hoja-de-vida.contenido.json";
let crudo: unknown = null;

vi.mock("node:fs", async (original) => {
  const fs = await original<typeof import("node:fs")>();
  const esElV2 = (p: unknown) => String(p).endsWith(ARCHIVO);
  const existsSync = (p: Parameters<typeof fs.existsSync>[0]) =>
    esElV2(p) ? crudo !== null : fs.existsSync(p);
  const readFileSync = ((
    p: Parameters<typeof fs.readFileSync>[0],
    ...r: unknown[]
  ) =>
    esElV2(p)
      ? JSON.stringify(crudo)
      : (fs.readFileSync as (...a: unknown[]) => unknown)(
          p,
          ...r,
        )) as typeof fs.readFileSync;
  return {
    ...fs,
    default: { ...fs, existsSync, readFileSync },
    existsSync,
    readFileSync,
  };
});

const cargar = async () =>
  (await import("@/lib/brochure/contenido-loader")).getContenido;

const v2 = (extra: Record<string, unknown> = {}) => ({
  schema_version: "2.0.0-borrador",
  app: "hoja-de-vida",
  acento: "rose",
  enlaces_razon: {
    es: "Es el sitio que estás recorriendo.",
    en: "It is the site you are browsing.",
  },
  ...extra,
});

describe("el contenido v2 de la casa", () => {
  beforeEach(() => {
    vi.resetModules();
    crudo = null;
  });

  it("sin archivo, la casa sigue con su v1 (y no es un error)", async () => {
    expect((await cargar())("hoja-de-vida")).toBeUndefined();
  });

  it("se lee de content/vitrina/casa/ y se valida contra la entrega de la casa", async () => {
    // CV-01 es una funcionalidad del export de CV Viva con su captura: solo existe en la casa.
    crudo = v2({
      portada: {
        resalta: { es: "r", en: "r" },
        lugar: { es: "l", en: "l" },
        categoria: { es: "c", en: "c" },
        pantallas: ["CV-01"],
      },
    });
    const c = (await cargar())("hoja-de-vida");
    expect(c?.enlaces_razon?.es).toBe("Es el sitio que estás recorriendo.");
    expect(c?.portada?.pantallas).toEqual(["CV-01"]);
  });

  it("una funcionalidad que la casa no tiene rompe el build, nombrando su archivo", async () => {
    crudo = v2({
      portada: {
        resalta: { es: "r", en: "r" },
        lugar: { es: "l", en: "l" },
        categoria: { es: "c", en: "c" },
        pantallas: ["NO-EXISTE"],
      },
    });
    const leer = await cargar();
    expect(() => leer("hoja-de-vida")).toThrow(ARCHIVO);
  });

  it("una forma inválida también, con el mismo nombre", async () => {
    crudo = v2({ inventada: 1 });
    const leer = await cargar();
    expect(() => leer("hoja-de-vida")).toThrow(
      `Contenido v2 inválido en ${ARCHIVO}`,
    );
  });
});
