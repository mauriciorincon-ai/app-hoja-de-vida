import { describe, expect, it } from "vitest";
import {
  chunksDeAFondo,
  leerDocumentos,
  problemasDePreguntasAbiertas,
  simularAprobacion,
  sinPreguntasAbiertas,
  MINIMO_PALABRAS_VENTANA,
  TOPE_PALABRAS_CHUNK,
  ventanasPorParrafo,
  parseDocumento,
  problemasDeDestino,
  problemasDeNombre,
  problemasDeParidad,
  problemasDePrivacidad,
  revisarAduana,
} from "../../scripts/a-fondo.mjs";
import { catalogoDeDestinos } from "../../scripts/destinos.mjs";

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

describe("el tope de tamaño y las ventanas por párrafo", () => {
  const parrafo = (n: number, palabra = "dato") =>
    Array.from({ length: n }, () => palabra).join(" ");
  const cuenta = (t: string) => t.split(/\s+/).filter(Boolean).length;

  it("un texto por debajo del tope no se parte", () => {
    const v = ventanasPorParrafo(parrafo(50), 180);
    expect(v).toHaveLength(1);
  });

  it("corta por párrafo, jamás a media frase", () => {
    // Tres párrafos de 100 con tope 180: cada ventana se cierra ANTES de
    // pasarse, así que salen tres de 100 y no dos de 100 y 200. La ventana
    // nunca excede el tope juntando párrafos — solo cuando uno solo ya lo pasa.
    const v = ventanasPorParrafo([parrafo(100), parrafo(100), parrafo(100)].join("\n\n"), 180);
    expect(v).toHaveLength(3);
    expect(v.map(cuenta)).toEqual([100, 100, 100]);
  });

  it("junta párrafos mientras quepan", () => {
    const v = ventanasPorParrafo([parrafo(80), parrafo(80), parrafo(80)].join("\n\n"), 180);
    expect(v.map(cuenta)).toEqual([160, 80]);
  });

  it("un párrafo más largo que el tope viaja SOLO, sin partirse", () => {
    // Cortar dentro de un párrafo produce fragmentos que citados se leen
    // truncados: el tope cede antes que la legibilidad de la cita.
    const v = ventanasPorParrafo(parrafo(300), 180);
    expect(v).toHaveLength(1);
    expect(cuenta(v[0])).toBe(300);
  });

  it("la cola corta se funde con su vecina en vez de quedar huérfana", () => {
    const texto = [parrafo(170), parrafo(20)].join("\n\n");
    const v = ventanasPorParrafo(texto, 180);
    expect(v, "20 palabras está por debajo del suelo: se funde").toHaveLength(1);
    expect(cuenta(v[0])).toBe(190);
    expect(MINIMO_PALABRAS_VENTANA).toBeGreaterThan(20);
  });

  it("una cola que llega al suelo sí se queda como ventana propia", () => {
    const texto = [parrafo(170), parrafo(60)].join("\n\n");
    expect(ventanasPorParrafo(texto, 180)).toHaveLength(2);
  });

  it("las ventanas de un chunk troceado comparten ancla y se distinguen por «~»", () => {
    const largo = [parrafo(170), parrafo(60)].join("\n\n");
    const doc = {
      slug: "vesting",
      titulo: "Vesting",
      estado: "aprobado",
      ancla: "/proyectos/vesting",
      subsecciones: [{ id: "arquitectura", titulo: "La arquitectura", texto: largo }],
    };
    const chunks = chunksDeAFondo([doc], "A fondo");
    expect(chunks).toHaveLength(2);
    expect(chunks.map((c: { id: string }) => c.id)).toEqual([
      "a-fondo-vesting-arquitectura~1",
      "a-fondo-vesting-arquitectura~2",
    ]);
    // El separador es «~» y no «-» a propósito: un id de subsección solo admite
    // [a-z0-9-], así que la colisión con una subsección «arquitectura-1» es
    // imposible por construcción.
    expect(chunks[0].id).not.toContain("arquitectura-1");
    // Misma ancla: la cita lleva al mismo sitio visible.
    expect(new Set(chunks.map((c: { ancla: string }) => c.ancla)).size).toBe(1);
    // Y el título dice qué ventana es, para que el chip del chat no repita.
    expect(chunks[0].titulo).toContain("(1/2)");
  });

  it("el tope vigente acota el peor caso del contexto", () => {
    // Con k=4, el contexto del modelo no puede crecer sin techo. El único
    // texto que puede pasarse del tope es un párrafo suelto más largo que él.
    expect(TOPE_PALABRAS_CHUNK).toBeGreaterThan(100);
    expect(TOPE_PALABRAS_CHUNK).toBeLessThanOrEqual(250);
  });
});

/**
 * LAS PREGUNTAS ABIERTAS (fase 2 de la auditoría).
 *
 * `[CONFIRMAR: …]` es el mecanismo con el que un documento declara lo que no
 * tiene fuente, y tiene dos consecuencias mecánicas: un aprobado no puede
 * llevar ninguna, y la simulación las quita antes de medir. Las dos vivían sin
 * un solo test, y la auditoría encontró que el borrado se comía prosa cuando la
 * marca iba **en medio de una frase** — justo la forma en que el dueño la va a
 * escribir durante semanas de corrección.
 */
describe("preguntas abiertas", () => {
  it("una marca EN LÍNEA solo se borra a sí misma: la frase y el resto sobreviven", () => {
    const texto =
      "Primera frase con [CONFIRMAR: falta el dato] y sigue el párrafo aquí.\n\n" +
      "Segundo párrafo con prosa que no debería desaparecer.\n\n" +
      "Tercero y [CONFIRMAR: otro hueco]";
    expect(sinPreguntasAbiertas(texto)).toBe(
      "Primera frase con y sigue el párrafo aquí.\n\n" +
        "Segundo párrafo con prosa que no debería desaparecer.\n\n" +
        "Tercero y",
    );
  });

  it("un bloque de varios párrafos se borra entero y no deja hueco de líneas", () => {
    const texto =
      "Antes.\n\n[CONFIRMAR — dos cosas:\n1. la primera\n2. la segunda]\n\nDespués.";
    expect(sinPreguntasAbiertas(texto)).toBe("Antes.\n\nDespués.");
  });

  it("un texto sin marcas sale igual que entró", () => {
    const texto = "Un párrafo.\n\nOtro párrafo con [corchetes] normales.";
    expect(sinPreguntasAbiertas(texto)).toBe(texto);
  });

  it("sobre el corpus REAL, la simulación no borra más de lo que las marcas ocupan", () => {
    // El contrato que de verdad importa: lo que se mide (golden set y banco)
    // tiene que ser el corpus del dueño menos sus preguntas, ni una palabra más.
    for (const doc of leerDocumentos("es")) {
      const simulado = simularAprobacion([doc])[0];
      doc.subsecciones.forEach((s: { id: string; texto: string }, i: number) => {
        const marcas = s.texto.match(/\[CONFIRMAR[^\]]*\]/g) ?? [];
        const palabras = (t: string) => t.split(/\s+/).filter(Boolean).length;
        const borradas =
          palabras(s.texto) - palabras(simulado.subsecciones[i].texto);
        const enLasMarcas = marcas.reduce((n, m) => n + palabras(m), 0);
        expect(
          borradas,
          `${doc.slug} · ${s.id}: la simulación borró ${borradas} palabras y las marcas solo ocupan ${enLasMarcas}`,
        ).toBe(enLasMarcas);
      });
    }
  });

  it("un aprobado con una pregunta abierta no pasa la aduana; un borrador sí", () => {
    const doc = {
      archivo: "data/a-fondo/x.es.md",
      estado: "aprobado",
      subsecciones: [{ id: "a", titulo: "A", texto: "Algo. [CONFIRMAR: qué falta]" }],
    };
    expect(problemasDePreguntasAbiertas(doc)).toHaveLength(1);
    expect(problemasDePreguntasAbiertas(doc)[0]).toContain('subsección "a"');
    expect(problemasDePreguntasAbiertas({ ...doc, estado: "borrador" })).toEqual([]);
  });
});

/**
 * LA ADUANA COMPLETA, la que corre en el build (fase 2 de la auditoría).
 *
 * `revisarAduana` existía con un comentario que decía que se separaba de
 * `main()` «para poder ejercerla desde vitest»… y **no la llamaba nadie**: ni
 * un test, ni el build, que reimplementaba la misma lista a mano. Dos
 * originales que divergen, y el probado no era el que corría. Ahora el build la
 * usa y esto la ejerce.
 */
describe("revisarAduana — la lista entera, de una", () => {
  const catalogo = catalogoDeDestinos();
  const sano = {
    slug: "x",
    titulo: "X",
    estado: "borrador",
    ancla: "#skills",
    archivo: "data/a-fondo/x.es.md",
    subsecciones: [{ id: "a", titulo: "A", texto: "Prosa." }],
  };

  it("un corpus sano no produce ni un problema", () => {
    expect(
      revisarAduana({ docsEs: [sano], docsEn: [], crudos: new Map(), catalogo }),
    ).toEqual([]);
  });

  it("junta los problemas de TODAS las reglas, cada uno nombrando su archivo", () => {
    const malo = {
      ...sano,
      slug: "otro", // el archivo se llama x.es.md → el nombre miente
      estado: "aprobado",
      ancla: "#apps", // destino muerto
      subsecciones: [
        { id: "a", titulo: "A", texto: "Algo. [CONFIRMAR: qué falta]" },
      ],
    };
    const crudos = new Map([
      ["data/a-fondo/x.es.md", "Escríbeme a alguien@ejemplo.com"],
    ]);
    const problemas = revisarAduana({
      docsEs: [malo],
      docsEn: [],
      crudos,
      catalogo,
    });
    const junto = problemas.join("\n");
    expect(junto).toContain("debería ser «otro.es.md»");
    expect(junto).toContain("no existe en el sitio");
    expect(junto).toContain("[CONFIRMAR");
    expect(junto).toContain("un correo electrónico");
    expect(junto).toContain("no existe su gemelo");
    for (const p of problemas) expect(p).toContain("x.es.md");
  });

  it("un inglés aprobado con su español en borrador NO pasa", () => {
    // El chat inglés citaría un documento que el español no tiene.
    const es = { ...sano, estado: "borrador" };
    const en = {
      ...sano,
      estado: "aprobado",
      archivo: "data/a-fondo/x.en.md",
    };
    const problemas = revisarAduana({
      docsEs: [es],
      docsEn: [en],
      crudos: new Map(),
      catalogo,
    });
    expect(problemas.join("\n")).toContain("sigue en «borrador»");
  });
});
