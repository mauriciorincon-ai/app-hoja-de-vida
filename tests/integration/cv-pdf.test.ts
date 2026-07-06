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

  it("el texto del PDF ES es parseable y refleja el YAML", async () => {
    const text = await extractText(files.es);
    expect(text).toContain("Henry Mauricio Rincón Caro");
    expect(text).toContain("EXPERIENCIA");
    // Métrica real de un bullet (capa de profundidad)
    expect(text).toContain("50+ usuarios");
    expect(text).toContain("AI-102");
    expect(text).toContain("Pontificia Universidad Javeriana");
  });

  it("el texto del PDF EN es parseable y refleja el YAML", async () => {
    const text = await extractText(files.en);
    expect(text).toContain("Henry Mauricio Rincón Caro");
    expect(text).toContain("EXPERIENCE");
    expect(text).toContain("50+ users");
    expect(text).toContain("DP-600");
  });

  it("sin caracteres fuera de WinAnsi que rompan el render (− → ⭐)", async () => {
    const text = await extractText(files.es);
    expect(text).not.toContain("−"); // − minus sign
    expect(text).not.toContain("→"); // →
  });
});
