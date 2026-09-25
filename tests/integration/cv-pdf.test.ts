// @vitest-environment node
import { execFileSync } from "node:child_process";
import { existsSync, readFileSync, statSync } from "node:fs";
import { tmpdir } from "node:os";
import path from "node:path";
import { beforeAll, describe, expect, it } from "vitest";

// pdfjs-dist (dentro de pdf-parse) referencia DOMMatrix al evaluar el módulo,
// pero la extracción de TEXTO no usa canvas: basta un stub para importar.
type PDFParseCtor = new (opts: { data: Uint8Array }) => {
  getText(): Promise<{ text: string }>;
};
let PDFParse: PDFParseCtor;

beforeAll(async () => {
  const g = globalThis as Record<string, unknown>;
  g.DOMMatrix ??= class DOMMatrix {};
  g.ImageData ??= class ImageData {};
  g.Path2D ??= class Path2D {};
  ({ PDFParse } = (await import("pdf-parse")) as unknown as {
    PDFParse: PDFParseCtor;
  });
});

/**
 * Criterio de aceptación del PDF ATS (ADR-008): el texto se puede
 * copiar/parsear, refleja los YAML vigentes y NO es una imagen.
 * Se genera a un directorio temporal con el script real de build.
 */
const outDir = path.join(tmpdir(), `cv-pdf-test-${process.pid}`);
const files = {
  es: path.join(outDir, "Henry-Rincon-CV-ES.pdf"),
  en: path.join(outDir, "Henry-Rincon-CV-EN.pdf"),
};

async function extractText(file: string): Promise<string> {
  const parser = new PDFParse({ data: new Uint8Array(readFileSync(file)) });
  const { text } = await parser.getText();
  return text;
}

describe("PDF ATS generado en build desde los YAML", () => {
  beforeAll(() => {
    execFileSync(process.execPath, ["scripts/generate-cv-pdf.mjs", outDir], {
      cwd: process.cwd(),
    });
  });

  it("genera ambos PDFs con tamaño > 0", () => {
    for (const file of Object.values(files)) {
      expect(existsSync(file)).toBe(true);
      expect(statSync(file).size).toBeGreaterThan(1000);
    }
  });

  // DOS PÁGINAS (2026-09-24). Un CV que lee un ATS y que se imprime tiene un
  // techo, y nadie lo vigilaba: al darle a cada experiencia su caso de estudio,
  // la sección «Proyectos» repitió los ocho y el PDF pasó a tres páginas sin
  // que ninguna prueba se enterara. Se cuentan los objetos `/Type /Page` del
  // archivo —pdfkit los escribe sin comprimir—, que es lo que ve una impresora.
  it("cabe en dos páginas, en los dos idiomas", () => {
    for (const [locale, file] of Object.entries(files)) {
      const paginas = (
        readFileSync(file)
          .toString("latin1")
          .match(/\/Type\s*\/Page[^s]/g) ?? []
      ).length;
      expect(
        paginas,
        `el PDF ${locale} tiene ${paginas} páginas`,
      ).toBeGreaterThan(0);
      expect(
        paginas,
        `el PDF ${locale} tiene ${paginas} páginas`,
      ).toBeLessThanOrEqual(2);
    }
  });

  it("el texto del PDF ES es parseable y refleja el YAML", async () => {
    const text = await extractText(files.es);
    expect(text).toContain("Henry Mauricio Rincón Caro");
    expect(text).toContain("EXPERIENCIA");
    // Métrica real de un bullet (capa de profundidad). Indiferente al salto de
    // línea: desde 2026-09-24 el bullet es más largo y el PDF parte «50+» y
    // «usuarios» en dos renglones, que es maquetación y no contenido.
    expect(text.replace(/\s+/g, " ")).toContain("50+ usuarios");
    expect(text).toContain("DP-600");
    // Formación desde `cv.estudios` (post-S7), con sus años (2026-09-10).
    expect(text).toContain("FORMACIÓN");
    expect(text).toContain("Pontificia Universidad Javeriana");
    expect(text).toContain("2009 — 2016");
  });

  it("el texto del PDF EN es parseable y refleja el YAML", async () => {
    const text = await extractText(files.en);
    expect(text).toContain("Henry Mauricio Rincón Caro");
    expect(text).toContain("EXPERIENCE");
    expect(text.replace(/\s+/g, " ")).toContain("50+ users");
    expect(text).toContain("DP-600");
    expect(text).toContain("EDUCATION");
    expect(text).toContain("2009 — 2016");
  });

  // Revisión post-S8, bloque D: una certificación «en curso» no lleva fecha,
  // y el PDF viejo imprimía «(AI-103) ()». Ahora dice «(en curso)». El nombre largo
  // del AI-103 (a fondo v3) parte «(en curso)» en dos líneas de la columna: el
  // salto es legítimo, el paréntesis vacío no.
  it("una certificación en curso dice «en curso», nunca un paréntesis vacío", async () => {
    const es = await extractText(files.es);
    const en = await extractText(files.en);
    expect(es).not.toContain("()");
    expect(en).not.toContain("()");
    expect(es).toMatch(/\(AI-103\)\s*\(en\s+curso\)/);
    expect(en).toMatch(/\(AI-103\)\s*\(in\s+progress\)/);
  });

  // El dominio del sitio va PRIMERO en la cabecera cuando el build lo conoce
  // por `NEXT_PUBLIC_SITE_URL` (regla 16: nunca escrito en el repo).
  it("con NEXT_PUBLIC_SITE_URL, el dominio encabeza la línea de contacto", async () => {
    const dir = path.join(tmpdir(), `cv-pdf-test-sitio-${process.pid}`);
    execFileSync(process.execPath, ["scripts/generate-cv-pdf.mjs", dir], {
      cwd: process.cwd(),
      env: { ...process.env, NEXT_PUBLIC_SITE_URL: "https://ejemplo.test" },
    });
    const text = await extractText(path.join(dir, "Henry-Rincon-CV-ES.pdf"));
    expect(text.indexOf("ejemplo.test")).toBeGreaterThan(-1);
    expect(text.indexOf("ejemplo.test")).toBeLessThan(text.indexOf("@"));
    // Y el perfil cierra con el sitio en vez de con el chat.
    expect(text).toMatch(/Más en mi sitio:\s*ejemplo\.test/);
    expect(text).not.toMatch(/Pregúntaselo\s+al\s+chat/);
    // Sin dominio, el anuncio va igual, sin dominio inventado.
    expect(await extractText(files.es)).toMatch(/Más en mi sitio web\./);
    // Sin dominio, el anuncio va igual, sin dominio inventado.
    expect(await extractText(files.es)).toMatch(/Más en mi sitio web\./);
    // Y sin la variable (los PDFs de `files`), no hay dominio inventado.
    expect(await extractText(files.es)).not.toContain("ejemplo.test");
  });

  it("sin caracteres fuera de WinAnsi que rompan el render (− → ⭐)", async () => {
    const text = await extractText(files.es);
    expect(text).not.toContain("−"); // − minus sign
    expect(text).not.toContain("→"); // →
  });
});
