import { execFileSync } from "node:child_process";
import { existsSync, readFileSync } from "node:fs";
import { tmpdir } from "node:os";
import path from "node:path";
import { describe, expect, it } from "vitest";
import { buildChunks } from "../../scripts/build-chat-index.mjs";
import { catalogoDeDestinos, destinoExiste } from "../../scripts/destinos.mjs";
import { parseChatIndex } from "@/lib/ia/schemas";

describe("buildChunks (YAML + «a fondo» → chunks con ancla)", () => {
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
    estudios: [
      {
        titulo: "Ingeniería Industrial",
        institucion: "Javeriana",
        periodo: "",
        nota: "Énfasis en analítica.",
      },
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
    aFondo: [
      {
        slug: "vesting",
        titulo: "Vesting",
        estado: "aprobado",
        ancla: "/proyectos/vesting",
        subsecciones: [
          { id: "arquitectura", titulo: "La arquitectura", texto: "Fabric desde cero." },
          { id: "vacia", titulo: "Vacía", texto: "" },
        ],
      },
      {
        slug: "en-borrador",
        titulo: "Aún sin aprobar",
        estado: "borrador",
        ancla: "#trayectoria",
        subsecciones: [{ id: "algo", titulo: "Algo", texto: "Prosa del borrador." }],
      },
    ],
    locale: "es",
  });
  const porId = new Map(chunks.map((c) => [c.id, c]));

  it("el proyecto con casestudy ancla a su página; el resto, a la trayectoria", () => {
    expect(porId.get("proyecto-vesting")?.ancla).toBe("/proyectos/vesting");
    expect(porId.get("casestudy-vesting")?.ancla).toBe("/proyectos/vesting");
    // La HOME ya no tiene sección «Proyectos» (revisión post-S7): una cita
    // que apuntara a #proyectos llevaría a ninguna parte.
    expect(porId.get("proyecto-sin-detalle")?.ancla).toBe("#trayectoria");
    expect(porId.get("trayectoria-0")?.ancla).toBe("#trayectoria");
  });

  it("los estudios tienen su chunk, con su ancla y sin inventar un periodo", () => {
    const e = porId.get("estudios");
    expect(e?.ancla).toBe("#estudios");
    expect(e?.texto).toContain("Ingeniería Industrial, Javeriana");
    expect(e?.texto).not.toContain("()");
  });

  it("el «a fondo» aprobado entra por subsección; la vacía y el borrador no", () => {
    expect(porId.get("a-fondo-vesting-arquitectura")?.texto).toContain(
      "Fabric desde cero",
    );
    expect(porId.get("a-fondo-vesting-arquitectura")?.ancla).toBe(
      "/proyectos/vesting",
    );
    expect(porId.has("a-fondo-vesting-vacia")).toBe(false);
    // Un borrador es material de trabajo del dueño, no evidencia citable.
    expect([...porId.keys()].filter((k) => k.includes("en-borrador"))).toEqual([]);
  });

  it("las apps ya no citan «#apps»: esa sección de la HOME murió en la revisión post-S7", () => {
    expect(porId.get("app-hoja-de-vida")?.ancla).toBe("#vitrina");
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

      // EL DESTINO DE TODA CITA EXISTE. La regla nació de encontrar «#apps»
      // —muerto desde la revisión post-S7— vivo en el índice publicado.
      const catalogo = catalogoDeDestinos();
      const rotos = index.chunks
        .filter((c) => !destinoExiste(c.ancla, catalogo))
        .map((c) => `${c.id} → ${c.ancla}`);
      expect(rotos, "chunks que citan hacia algo que no existe").toEqual([]);
    }
  });
});
