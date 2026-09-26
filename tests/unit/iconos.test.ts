// @vitest-environment node
import { createHash } from "node:crypto";
import { readFileSync } from "node:fs";
import path from "node:path";
import { describe, expect, it } from "vitest";
import { NAVY } from "../../scripts/generate-cv-pdf.mjs";
import { COLORES, trazoDe } from "../../scripts/generate-icons.mjs";
import { MARCA_HR } from "../../src/lib/marca-hr";

/**
 * EL ÍCONO DEL SITIO (2026-09-26). Hasta ese día la pestaña del dominio
 * mostraba el triángulo de Vercel: el favicon de la plantilla de
 * create-next-app, que nadie cambió desde el Sprint 001. El dueño eligió la
 * opción A: «HR» en Helvetica Bold, blanco, sobre el navy del bloque del
 * dominio en el PDF. Lo que estas pruebas cuidan:
 *  - el favicon de la plantilla no vuelve;
 *  - el SVG son TRAZOS: un favicon no puede depender de las fuentes de quien
 *    lo mira, y un `<text>` caería a otra letra donde no haya Helvetica;
 *  - el fondo es el `NAVY` vigente del PDF y las letras van en blanco;
 *  - el .ico trae los tres tamaños de pestaña y el de iOS mide lo que iOS pide.
 *  - el botón de inicio del encabezado es la MISMA loseta (`src/lib/marca-hr.ts`).
 * Los archivos los escribe `pnpm iconos` (scripts/generate-icons.mjs).
 */

const APP = path.join(process.cwd(), "src/app");
const leer = (archivo: string) => readFileSync(path.join(APP, archivo));

/** sha256 del favicon.ico de create-next-app (el triángulo de Vercel). */
const FAVICON_DE_LA_PLANTILLA =
  "2b8ad2d33455a8f736fc3a8ebf8f0bdea8848ad4c0db48a2833bd0f9cd775932";

const FIRMA_PNG = Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]);

function medidasPng(png: Buffer) {
  expect(png.subarray(0, 8).equals(FIRMA_PNG), "no es un PNG").toBe(true);
  return { ancho: png.readUInt32BE(16), alto: png.readUInt32BE(20) };
}

function entradasIco(ico: Buffer) {
  expect(ico.readUInt16LE(2), "no es un .ico (tipo 1)").toBe(1);
  return Array.from({ length: ico.readUInt16LE(4) }, (_, i) => {
    const e = 6 + 16 * i;
    const inicio = ico.readUInt32LE(e + 12);
    const png = ico.subarray(inicio, inicio + ico.readUInt32LE(e + 8));
    return { declarado: ico.readUInt8(e) || 256, ...medidasPng(png) };
  });
}

describe("el ícono del sitio", () => {
  it("el favicon ya no es el de la plantilla (el triángulo de Vercel)", () => {
    const sha = createHash("sha256").update(leer("favicon.ico")).digest("hex");
    expect(
      sha,
      "src/app/favicon.ico volvió a ser el de create-next-app: corre `pnpm iconos`",
    ).not.toBe(FAVICON_DE_LA_PLANTILLA);
  });

  it("el .ico trae 16, 32 y 48 px, cada uno del tamaño que declara", () => {
    const entradas = entradasIco(leer("favicon.ico"));
    expect(entradas.map((e) => e.declarado)).toEqual([16, 32, 48]);
    for (const e of entradas)
      expect([e.ancho, e.alto]).toEqual([e.declarado, e.declarado]);
  });

  it("el ícono de iOS mide 180 × 180", () => {
    expect(medidasPng(leer("apple-icon.png"))).toEqual({
      ancho: 180,
      alto: 180,
    });
  });

  it("el SVG son trazos, no texto: un favicon no depende de las fuentes de quien lo mira", () => {
    const svg = leer("icon.svg").toString("utf8");
    expect(
      svg,
      "icon.svg usa <text>: donde no haya Helvetica, el navegador pintaría otra letra",
    ).not.toMatch(/<text\b/);
    expect(trazoDe(svg).length).toBeGreaterThan(100);
  });

  it("el SVG es la loseta navy del PDF con las letras en blanco", () => {
    const svg = leer("icon.svg").toString("utf8").toLowerCase();
    expect(COLORES.fondo, "el ícono no toma su navy del PDF").toBe(
      NAVY.toLowerCase(),
    );
    expect(
      svg,
      "el fondo de icon.svg no es el NAVY vigente del PDF: corre `pnpm iconos`",
    ).toMatch(new RegExp(`<rect\\b[^>]*fill="${NAVY.toLowerCase()}"`));
    expect(svg, "las letras de icon.svg no van en blanco").toMatch(
      /<path\b[^>]*fill="#ffffff"/,
    );
  });

  it("el botón de inicio del encabezado es la misma loseta de icon.svg", () => {
    const svg = leer("icon.svg").toString("utf8");
    const aviso =
      "src/lib/marca-hr.ts no es la loseta de icon.svg: corre `pnpm iconos`";
    expect(trazoDe(svg), aviso).toBe(MARCA_HR.d);
    expect(svg, aviso).toContain(`viewBox="${MARCA_HR.viewBox}"`);
    expect(svg, aviso).toContain(`rx="${MARCA_HR.rx}"`);
    expect([MARCA_HR.fondo, MARCA_HR.letras], aviso).toEqual([
      COLORES.fondo,
      COLORES.letras,
    ]);
  });
});
