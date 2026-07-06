import { execFileSync } from "node:child_process";
import { existsSync, readFileSync } from "node:fs";
import { tmpdir } from "node:os";
import path from "node:path";
import { describe, expect, it } from "vitest";
import {
  buildChunks,
  checkHistoriaParity,
  parseHistoria,
} from "../../scripts/build-chat-index.mjs";
import { parseChatIndex } from "@/lib/ia/schemas";

const MD_BASE = `# Historia

<!-- preámbulo que no se indexa -->

## Vesting a fondo

<!-- seccion: vesting | ancla: /proyectos/vesting -->
<!-- guía: qué escribir -->

Construí el ecosistema de datos en Microsoft Fabric desde cero.

## Sección vacía

<!-- seccion: pendiente | ancla: #trayectoria -->
<!-- guía: aún sin rellenar -->
`;

describe("parseHistoria (marcas del esqueleto guiado)", () => {
  it("extrae id, ancla, título y texto sin comentarios", () => {
    const sections = parseHistoria(MD_BASE, "historia.es.md");
    expect(sections).toHaveLength(2);
    expect(sections[0]).toMatchObject({
      id: "vesting",
      ancla: "/proyectos/vesting",
      titulo: "Vesting a fondo",
    });
    expect(sections[0].texto).toContain("Microsoft Fabric");
    expect(sections[0].texto).not.toContain("guía");
  });

  it("una sección sin prosa queda con texto vacío (no bloquea)", () => {
    const sections = parseHistoria(MD_BASE, "historia.es.md");
    expect(sections[1].id).toBe("pendiente");
    expect(sections[1].texto).toBe("");
  });

  it("ancla por defecto cuando el comentario no la trae", () => {
    const md = "## Título\n\n<!-- seccion: libre -->\n\nTexto.\n";
    expect(parseHistoria(md, "x.md")[0].ancla).toBe("#trayectoria");
  });

  it("falla con diagnóstico si falta el comentario de sección", () => {
    const md = "## Sin marca\n\nTexto huérfano.\n";
    expect(() => parseHistoria(md, "historia.es.md")).toThrowError(
      /historia\.es\.md[\s\S]*Sin marca/,
    );
  });

  it("rechaza ids duplicados", () => {
    const md =
      "## A\n<!-- seccion: dup -->\nUno.\n## B\n<!-- seccion: dup -->\nDos.\n";
    expect(() => parseHistoria(md, "x.md")).toThrowError(/dup/);
  });
});

describe("checkHistoriaParity (regla de paridad ES/EN)", () => {
  const seccion = (id: string, texto: string) => ({
    id,
    ancla: "#trayectoria",
    titulo: id,
    texto,
  });

  it("sin problemas cuando ambas gemelas tienen (o no tienen) contenido", () => {
    expect(
      checkHistoriaParity(
        [seccion("a", "hola"), seccion("b", "")],
        [seccion("a", "hello"), seccion("b", "")],
      ),
    ).toEqual([]);
  });

  it("detecta contenido en un idioma con la gemela vacía", () => {
    const problems = checkHistoriaParity(
      [seccion("vesting", "contenido en español")],
      [seccion("vesting", "")],
    );
    expect(problems).toHaveLength(1);
    expect(problems[0]).toMatch(/vesting[\s\S]*historia\.en\.md/);
  });

  it("detecta una sección sin gemela en el otro archivo", () => {
    const problems = checkHistoriaParity([seccion("solo-es", "texto")], []);
    expect(problems[0]).toContain("solo-es");
  });
});

describe("buildChunks (YAML + historia → chunks con ancla)", () => {
  const cvMinimo = {
    identidad: {
      nombre: "Henry",
      eyebrow: "Data & AI",
      titular: "Titular.",
      resumen: "Resumen.",
      perfil: "Perfil largo.",
      ubicacion: "Bogotá",
      email: "x@example.com",
      enlaces: [{ etiqueta: "GitHub", url: "https://github.com/x" }],
    },
    trayectoria: [
      {
        periodo: "2023",
        rol: "Líder de Datos",
        organizacion: "Vesting",
        descripcion: "Ecosistema de datos.",
        bullets: ["Fabric desde cero."],
      },
    ],
    logros: [
      { valor: 8, sufijo: "+", etiqueta: "años", descripcion: "En datos." },
    ],
    proyectos: [
      {
        slug: "vesting",
        nombre: "Plataforma Vesting",
        resumen: "Resumen del proyecto.",
        stack: ["Fabric"],
        casestudy: {
          contexto: "Contexto.",
          reto: "Reto.",
          acciones: ["Acción."],
          impacto: ["Impacto."],
        },
      },
      { slug: "sin-detalle", nombre: "Otro", resumen: "Sin casestudy." },
    ],
    certificaciones: [{ nombre: "AI-102", fecha: "2024", nota: "" }],
    skills: [{ grupo: "IA", items: ["Azure AI"] }],
  };
  const appsMinimas = {
    apps: [
      {
        id: "hoja-de-vida",
        estado: "en-produccion",
        nombre: { es: "CV Viva", en: "Living CV" },
        descripcion: { es: "Esta página.", en: "This page." },
      },
    ],
  };

  const chunks = buildChunks({
    cv: cvMinimo,
    apps: appsMinimas,
    historia: [
      {
        id: "vesting",
        ancla: "/proyectos/vesting",
        titulo: "Vesting a fondo",
        texto: "La historia completa.",
      },
      { id: "vacia", ancla: "#trayectoria", titulo: "Vacía", texto: "" },
    ],
    locale: "es",
  });
  const porId = new Map(chunks.map((c) => [c.id, c]));

  it("el proyecto con casestudy ancla a su página; el resto a la HOME", () => {
    expect(porId.get("proyecto-vesting")?.ancla).toBe("/proyectos/vesting");
    expect(porId.get("casestudy-vesting")?.ancla).toBe("/proyectos/vesting");
    expect(porId.get("proyecto-sin-detalle")?.ancla).toBe("#proyectos");
    expect(porId.get("trayectoria-0")?.ancla).toBe("#trayectoria");
  });

  it("la historia con contenido entra con su ancla; la vacía se ignora", () => {
    expect(porId.get("historia-vesting")?.texto).toContain("historia completa");
    expect(porId.has("historia-vacia")).toBe(false);
  });

  it("los bullets de trayectoria y el casestudy quedan indexados", () => {
    expect(porId.get("trayectoria-0")?.texto).toContain("Fabric desde cero");
    expect(porId.get("casestudy-vesting")?.texto).toContain("Impacto.");
  });

  it("las apps usan el nombre/descripción del locale", () => {
    expect(porId.get("app-hoja-de-vida")?.texto).toContain("Esta página");
  });
});

describe("script real contra los data/ reales (integración del build)", () => {
  const outDir = path.join(tmpdir(), `chat-index-test-${process.pid}`);

  it("genera índices ES y EN válidos con el contenido vigente", () => {
    execFileSync(process.execPath, ["scripts/build-chat-index.mjs", outDir], {
      cwd: process.cwd(),
    });
    for (const locale of ["es", "en"] as const) {
      const file = path.join(outDir, `chat-index.${locale}.json`);
      expect(existsSync(file)).toBe(true);
      const index = parseChatIndex(
        JSON.parse(readFileSync(file, "utf8")),
        file,
      );
      expect(index.locale).toBe(locale);
      // identidad(2) + 9 hitos + logros + 5×2 proyectos + certs + skills + 4 apps
      expect(index.chunks.length).toBeGreaterThan(20);
      expect(index.chunks.some((c) => c.ancla === "/proyectos/vesting")).toBe(
        true,
      );
    }
  });
});
