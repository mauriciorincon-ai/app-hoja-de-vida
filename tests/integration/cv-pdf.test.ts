// @vitest-environment node
import { execFileSync } from "node:child_process";
import { existsSync, readFileSync, statSync } from "node:fs";
import { tmpdir } from "node:os";
import path from "node:path";
import { beforeAll, describe, expect, it } from "vitest";
import { LABELS, ansi } from "../../scripts/generate-cv-pdf.mjs";
import { getCv } from "@/lib/content";

// pdfjs-dist (dentro de pdf-parse) referencia DOMMatrix al evaluar el módulo,
// pero la extracción de TEXTO no usa canvas: basta un stub para importar.
type PDFParseCtor = new (opts: { data: Uint8Array }) => {
  getText(): Promise<{ text: string; pages: { text: string }[] }>;
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

/**
 * Y el MISMO PDF con dominio, que es el que baja un reclutador en producción:
 * la cabecera crece con el bloque del dominio y cada página gana su pie, así
 * que las dos páginas y la cobertura se miden también aquí. Un dominio largo a
 * propósito: si cabe este, cabe el real (que jamás se escribe aquí, regla 16).
 */
const DOMINIO = "nombreyapellidolargo.test";
const outDirDominio = path.join(tmpdir(), `cv-pdf-test-dominio-${process.pid}`);
const filesDominio = {
  es: path.join(outDirDominio, "Henry-Rincon-CV-ES.pdf"),
  en: path.join(outDirDominio, "Henry-Rincon-CV-EN.pdf"),
};
const variantes = [
  ["sin dominio", files],
  ["con dominio", filesDominio],
] as const;

/**
 * Sin saltos de línea ni guiones: dónde parte un renglón es maquetación, no
 * contenido, y pdfkit parte «cross-referencing» en el guion —el extractor lo
 * devuelve como «crossreferencing»—.
 */
const plano = (t: string) => t.replace(/-\s*/g, "").replace(/\s+/g, " ").trim();

async function extractPages(file: string): Promise<string[]> {
  const parser = new PDFParse({ data: new Uint8Array(readFileSync(file)) });
  const { pages } = await parser.getText();
  return pages.map((p) => p.text);
}

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
    execFileSync(
      process.execPath,
      ["scripts/generate-cv-pdf.mjs", outDirDominio],
      {
        cwd: process.cwd(),
        env: { ...process.env, NEXT_PUBLIC_SITE_URL: `https://${DOMINIO}` },
      },
    );
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
  it("cabe en dos páginas, en los dos idiomas, con dominio y sin él", () => {
    for (const [variante, archivos] of variantes) {
      for (const [locale, file] of Object.entries(archivos)) {
        const paginas = (
          readFileSync(file)
            .toString("latin1")
            .match(/\/Type\s*\/Page[^s]/g) ?? []
        ).length;
        const nombre = `el PDF ${locale} ${variante} tiene ${paginas} páginas`;
        expect(paginas, nombre).toBeGreaterThan(0);
        expect(paginas, nombre).toBeLessThanOrEqual(2);
      }
    }
  });

  // EL CRITERIO DEL DUEÑO (2026-09-24): «que no repita, pero también que no
  // deje por fuera ninguna de mis experiencias y logros más importantes». Dos
  // pruebas, una por mitad. La que exige que cada cifra de un caso esté en los
  // logros de su hito vive en `tests/unit/casos-de-estudio.test.ts`; estas
  // miran el PDF de verdad.
  it("no deja nada por fuera: cada experiencia y cada uno de sus logros está en el PDF", async () => {
    for (const [variante, archivos] of variantes) {
      for (const locale of ["es", "en"] as const) {
        const texto = plano(await extractText(archivos[locale]));
        const faltan = getCv(locale).trayectoria.flatMap((h) =>
          [h.rol, h.organizacion, ...h.bullets]
            .filter((t) => !texto.includes(plano(ansi(t))))
            .map((t) => `${locale} ${variante} · ${h.organizacion}: «${t}»`),
        );
        expect(faltan.join("\n")).toBe("");
      }
    }
  });

  it("no repite: ningún caso de estudio vuelve a contarse como proyecto", async () => {
    for (const locale of ["es", "en"] as const) {
      const cv = getCv(locale);
      const texto = plano(await extractText(files[locale]));
      const conHito = new Set(cv.trayectoria.map((h) => h.proyecto));
      // El «qué» del nombre, antes de « — Dónde (cuándo)»: no está en ningún
      // logro, así que solo aparece si el caso se lista otra vez.
      const repetidos = cv.proyectos
        .filter((p) => conHito.has(p.slug))
        .map((p) => plano(ansi(p.nombre.split(" — ")[0])))
        .filter((titulo) => texto.includes(titulo));
      expect(
        repetidos,
        `el PDF ${locale} cuenta dos veces estas experiencias`,
      ).toEqual([]);
    }
  });

  // EL DOMINIO, MUY RESALTADO (2026-09-24, pedido del dueño). Lo que una
  // prueba puede ver: que va arriba —antes del correo—, que cierra el perfil,
  // que firma el pie de CADA página y que las tres cosas se pueden pulsar y
  // llevan al sitio en el idioma del PDF. Lo grande y lo resaltado es juicio
  // visual: la d1 de la guía.
  it("el dominio encabeza, cierra el perfil, firma cada página y lleva al sitio en su idioma", async () => {
    for (const locale of ["es", "en"] as const) {
      const paginas = await extractPages(filesDominio[locale]);
      const primera = plano(paginas[0]);
      expect(primera.indexOf(DOMINIO)).toBeGreaterThan(-1);
      expect(primera.indexOf(DOMINIO)).toBeLessThan(primera.indexOf("@"));
      expect(primera).toContain(`${LABELS[locale].masEnMiSitio} ${DOMINIO}.`);
      // Bajo el bloque, en dos líneas: qué se encuentra en el sitio.
      expect(primera).toContain(plano(LABELS[locale].rotuloSitio.join(" ")));
      paginas.forEach((texto, i) => {
        expect(
          plano(texto).endsWith(`${DOMINIO} · ${i + 1} / ${paginas.length}`),
          `el pie de la página ${i + 1} (${locale})`,
        ).toBe(true);
      });
      const enlaces =
        readFileSync(filesDominio[locale])
          .toString("latin1")
          .match(new RegExp(`/URI \\(https://${DOMINIO}/${locale}\\)`, "g")) ??
        [];
      // Cabecera + perfil + un pie por página.
      expect(enlaces.length, `enlaces al sitio (${locale})`).toBe(
        2 + paginas.length,
      );
    }
    // Sin dominio no hay pie ni enlaces: nada inventado.
    for (const file of Object.values(files)) {
      expect(readFileSync(file).toString("latin1")).not.toContain("/URI");
    }
  });

  // NINGÚN TÍTULO HUÉRFANO (2026-09-24). «SKILLS» —o el primer grupo, «IA &
  // ML»— se quedaba solo al pie de la página 1 con su contenido en la 2: en
  // `main` ya pasaba con el grupo, y la cabecera con dominio lo empeoró. Cada
  // título tiene que ir, en su página, pegado a lo primero que encabeza.
  it("ningún título se queda solo al pie de una página", async () => {
    const quitaVineta = (t: string) => plano(t.replace(/•/g, " "));
    const primeras = (t: string, n = 2) =>
      ansi(t).split(/\s+/).slice(0, n).join(" ");
    for (const [variante, archivos] of variantes) {
      for (const locale of ["es", "en"] as const) {
        const cv = getCv(locale);
        const L = LABELS[locale];
        const paginas = (await extractPages(archivos[locale])).map(quitaVineta);
        const pares: [string, string][] = [
          [L.experiencia, cv.trayectoria[0].rol],
          [L.formacion, primeras(cv.estudios![0].titulo)],
          [L.certificaciones, primeras(cv.certificaciones[0].nombre)],
          [L.skills, cv.skills[0].grupo],
          ...cv.trayectoria.map(
            (h) => [h.rol, primeras(h.organizacion)] as [string, string],
          ),
          ...cv.skills.map(
            (g) => [g.grupo, primeras(g.items[0])] as [string, string],
          ),
        ];
        const huerfanos = pares
          .map(([titulo, sigue]) => quitaVineta(`${ansi(titulo)} ${sigue}`))
          .filter((junto) => !paginas.some((p) => p.includes(junto)));
        expect(
          huerfanos,
          `títulos separados de lo que encabezan (${locale}, ${variante})`,
        ).toEqual([]);
      }
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
