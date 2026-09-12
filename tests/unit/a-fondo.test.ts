import { describe, expect, it } from "vitest";
import {
  chunksDeAFondo,
  parseDocumento,
  problemasDeDestino,
  problemasDeNombre,
  problemasDeParidad,
  problemasDePrivacidad,
} from "../../scripts/a-fondo.mjs";

/**
 * LA ADUANA DEL CANAL «A FONDO» (S8, ADR-019).
 *
 * El motor vive en `scripts/`, junto al de la historia que reemplaza, porque
 * **no hay páginas**: sin rutas que lo consuman, el único cliente del canal es
 * el build. Se prueba desde vitest igual que se probaba `parseHistoria`.
 */

const FM = (extra = "", estado = "borrador") => `---
slug: vesting
titulo: "Vesting"
resumen: "Resumen de una línea."
estado: ${estado}
ancla: "/proyectos/vesting"
actualizado: 2026-09-12
preguntas_de_prueba:
  - "¿Qué hizo Henry en Vesting?"
  - "¿Qué es el proceso core?"
---
${extra}`;

const CUERPO = `
## La arquitectura

<!-- seccion: arquitectura -->
<!-- guía: no se indexa -->

Construí el ecosistema en Microsoft Fabric desde cero.

## El proceso core

<!-- seccion: proceso-core -->

Un patrón replicable para poner agentes en producción.
`;

const doc = (md: string, archivo = "data/a-fondo/vesting.es.md") =>
  parseDocumento(md, archivo);

describe("parseDocumento — frontmatter y subsecciones", () => {
  it("extrae el frontmatter y las subsecciones sin los comentarios", () => {
    const d = doc(FM(CUERPO));
    expect(d.slug).toBe("vesting");
    expect(d.estado).toBe("borrador");
    expect(d.subsecciones.map((s: { id: string }) => s.id)).toEqual([
      "arquitectura",
      "proceso-core",
    ]);
    expect(d.subsecciones[0].texto).toContain("Microsoft Fabric");
    expect(d.subsecciones[0].texto).not.toContain("guía");
  });

  it("falla nombrando el archivo si no hay frontmatter", () => {
    expect(() => doc(CUERPO)).toThrowError(
      /vesting\.es\.md: falta el frontmatter/,
    );
  });

  it("falla campo por campo cuando el frontmatter no cumple", () => {
    const sinTitulo = FM(CUERPO).replace('titulo: "Vesting"\n', "");
    expect(() => doc(sinTitulo)).toThrowError(/- titulo:/);
    const estadoRaro = FM(CUERPO, "casi-listo");
    expect(() => doc(estadoRaro)).toThrowError(/- estado:/);
  });

  it("exige al menos dos preguntas de prueba — la prueba viaja con el contenido", () => {
    const una = FM(CUERPO).replace('  - "¿Qué es el proceso core?"\n', "");
    expect(() => doc(una)).toThrowError(/preguntas_de_prueba/);
  });

  it("rechaza ids de subsección duplicados", () => {
    const dup = FM(CUERPO.replace("seccion: proceso-core", "seccion: arquitectura"));
    expect(() => doc(dup)).toThrowError(/duplicado "arquitectura"/);
  });

  it("exige el comentario de subsección en cada «##»", () => {
    const sinMarca = FM("\n## Huérfana\n\nTexto sin marca.\n");
    expect(() => doc(sinMarca)).toThrowError(/## Huérfana/);
  });

  it("un BORRADOR puede no tener ni una subsección; un APROBADO no", () => {
    expect(doc(FM("\nSolo cabecera.\n")).subsecciones).toEqual([]);
    expect(() => doc(FM("\nSolo cabecera.\n", "aprobado"))).toThrowError(
      /aprobado[\s\S]*ni una subsección/,
    );
  });
});

describe("problemasDeNombre — el archivo no puede mentir sobre su slug", () => {
  it("acepta <slug>.<locale>.md y rechaza cualquier otro nombre", () => {
    expect(problemasDeNombre(doc(FM(CUERPO)), "es")).toEqual([]);
    const mal = doc(FM(CUERPO), "data/a-fondo/otro-nombre.es.md");
    expect(problemasDeNombre(mal, "es")[0]).toContain("vesting.es.md");
  });
});

describe("problemasDeDestino — la cita tiene que llevar a alguna parte", () => {
  const catalogo = new Set(["#trayectoria", "/proyectos/vesting"]);

  it("acepta un destino del catálogo", () => {
    expect(problemasDeDestino(doc(FM(CUERPO)), catalogo)).toEqual([]);
  });

  it("rechaza el ancla que no existe — el caso real del «#apps» muerto", () => {
    const muerta = FM(CUERPO).replace(
      'ancla: "/proyectos/vesting"',
      'ancla: "#apps"',
    );
    expect(problemasDeDestino(doc(muerta), catalogo)[0]).toContain("#apps");
  });
});

describe("problemasDePrivacidad — lo mecánico, que es lo que un regex sí caza", () => {
  it.each([
    ["un correo", "Escríbeme a henry.ejemplo@correo.com cuando quieras."],
    ["un teléfono internacional", "Mi celular es +57 300 111 2233."],
    ["un teléfono agrupado", "Llámame al 300-111-2233."],
    ["siete dígitos seguidos", "Mi documento es 10254889 de Bogotá."],
    ["una dirección web", "Está en https://ejemplo.com/algo."],
    ["un dominio suelto", "Lo publiqué en ejemplo.com y se ve bien."],
  ])("caza %s", (_que, linea) => {
    const p = problemasDePrivacidad(linea, "x.md");
    expect(p.length).toBeGreaterThan(0);
    expect(p[0]).toContain("x.md:1");
  });

  it.each([
    ["un periodo con guion largo", "Estudié entre 2009 — 2016 en Bogotá."],
    ["un periodo con guion corto", "Trabajé de 2016-2017 en la planta."],
    ["una norma con dos puntos", "Implementé ISO 9001:2015 en la operación."],
    ["un código de certificación", "Aprobé el DP-600 en cinco meses."],
    ["una cifra con separador", "Procesamos 1.234.567 registros al mes."],
    ["una versión", "Next.js 16.3.4 y Tailwind v4."],
    ["un archivo del repo", "Vive en data/cv.es.yaml y en apps.yaml."],
  ])("NO se inventa un falso positivo con %s", (_que, linea) => {
    expect(problemasDePrivacidad(linea, "x.md")).toEqual([]);
  });

  it("nombra el archivo y la línea exacta", () => {
    const md = "línea uno\nlínea dos\nescríbeme a x.y@z.com\n";
    expect(problemasDePrivacidad(md, "data/a-fondo/x.es.md")[0]).toContain(
      "data/a-fondo/x.es.md:3",
    );
  });
});

describe("problemasDeParidad — solo se le exige a un APROBADO", () => {
  const es = (estado: string, ids: string[]) => ({
    slug: "vesting",
    estado,
    archivo: "data/a-fondo/vesting.es.md",
    subsecciones: ids.map((id) => ({ id, titulo: id, texto: "prosa" })),
  });
  const en = (estado: string, ids: string[]) => ({
    slug: "vesting",
    estado,
    archivo: "data/a-fondo/vesting.en.md",
    subsecciones: ids.map((id) => ({ id, titulo: id, texto: "prose" })),
  });

  it("un borrador vive solo en español sin romper nada", () => {
    expect(problemasDeParidad([es("borrador", ["a", "b"])], [])).toEqual([]);
  });

  it("un aprobado sin gemelo en inglés rompe", () => {
    const p = problemasDeParidad([es("aprobado", ["a"])], []);
    expect(p[0]).toContain("vesting.en.md");
  });

  it("un aprobado cuyo gemelo sigue en borrador rompe", () => {
    const p = problemasDeParidad(
      [es("aprobado", ["a"])],
      [en("borrador", ["a"])],
    );
    expect(p[0]).toContain("borrador");
  });

  it("la paridad es SUBSECCIÓN POR SUBSECCIÓN, no por documento", () => {
    const p = problemasDeParidad(
      [es("aprobado", ["a", "b"])],
      [en("aprobado", ["a"])],
    );
    expect(p[0]).toContain("falta(n) en inglés: b");
  });

  it("una subsección con prosa en un idioma y vacía en el otro rompe", () => {
    const esDoc = es("aprobado", ["a"]);
    const enDoc = en("aprobado", ["a"]);
    enDoc.subsecciones[0].texto = "";
    const p = problemasDeParidad([esDoc], [enDoc]);
    expect(p[0]).toContain('subsección "a"');
  });

  it("dos aprobados gemelos y completos no producen problema", () => {
    expect(
      problemasDeParidad([es("aprobado", ["a", "b"])], [en("aprobado", ["a", "b"])]),
    ).toEqual([]);
  });
});

describe("chunksDeAFondo — el borrador NO se indexa", () => {
  const aprobado = { ...doc(FM(CUERPO, "aprobado")) };
  const borrador = { ...doc(FM(CUERPO)) };

  it("un aprobado entra con un chunk por subsección, con el ancla del documento", () => {
    const chunks = chunksDeAFondo([aprobado], "A fondo");
    expect(chunks).toHaveLength(2);
    expect(chunks[0].id).toBe("a-fondo-vesting-arquitectura");
    expect(chunks[0].ancla).toBe("/proyectos/vesting");
    expect(chunks[0].titulo).toContain("A fondo — Vesting");
  });

  it("un BORRADOR no aporta ni un chunk — es material de trabajo, no evidencia", () => {
    expect(chunksDeAFondo([borrador], "A fondo")).toEqual([]);
    expect(chunksDeAFondo([aprobado, borrador], "A fondo")).toHaveLength(2);
  });
});
