// @vitest-environment node
import {
  mkdirSync,
  mkdtempSync,
  readFileSync,
  rmSync,
  writeFileSync,
} from "node:fs";
import { tmpdir } from "node:os";
import path from "node:path";
import { afterEach, describe, expect, it } from "vitest";
import { parse } from "yaml";
import { TOPE_PALABRAS_CHUNK } from "../../scripts/a-fondo.mjs";
import { buildChunks } from "../../scripts/build-chat-index.mjs";
import {
  catalogoDeDestinos,
  destinoExiste,
  nombreDeDestino,
  nombresDeDestinos,
} from "../../scripts/destinos.mjs";
import {
  anclasDeBloques,
  chunksDeMetodo,
  chunksDePieza,
  leerMetodo,
  N_BLOQUES,
  PESO_METODO,
  problemasDeEvidencia,
} from "../../scripts/metodo-al-indice.mjs";

/**
 * «MÉTODOS» EN EL ÍNDICE DEL CHAT (S10, F3). Dos mitades, como las fichas:
 * el motor contra la pieza de juguete (cada regla, con su rojo) y el motor
 * contra las piezas REALES de `data/metodo/` (cada chunk cita a un bloque que
 * existe, en los dos idiomas).
 */

const EJEMPLO = parse(
  readFileSync("tests/fixtures/metodo/ejemplo-sintetico.yaml", "utf8"),
);
const metodo = leerMetodo();
const etiquetas = metodo.etiquetas;
const juguete = (extra: (p: typeof EJEMPLO) => void = () => {}) => {
  const pieza = structuredClone(EJEMPLO);
  extra(pieza);
  return { archivo: "data/metodo/ejemplo-sintetico.yaml", pieza };
};
const idDe = (c: { id: string }) => c.id;

describe("el motor, contra la pieza de juguete", () => {
  const chunks = chunksDePieza(juguete(), "es", etiquetas.es);

  it("cada uno de los diez bloques produce al menos un chunk, con su ancla #bloque-n", () => {
    for (let n = 1; n <= N_BLOQUES; n++) {
      const delBloque = chunks.filter(
        (c: { ancla: string }) =>
          c.ancla === `/metodos/ejemplo-sintetico#bloque-${n}`,
      );
      expect(delBloque.length, `bloque ${n}`).toBeGreaterThan(0);
    }
    expect(new Set(chunks.map((c: { ancla: string }) => c.ancla)).size).toBe(
      10,
    );
  });

  it("el código del chunk es el id del tema (T1…T9) y el peso es el de las fichas", () => {
    for (const c of chunks) {
      expect(c.codigo).toBe("T1");
      expect(c.peso).toBe(PESO_METODO);
    }
    expect(PESO_METODO).toBe(0.5);
  });

  it("la voz viaja DENTRO del texto: el estado del campo con su fuente, el criterio con su rótulo", () => {
    const todo = chunks.map((c: { texto: string }) => c.texto).join("\n");
    // El ejemplo cita la fuente 1 (Editor de ejemplo, 2026-09-01) en el bloque 4.
    expect(todo).toContain(
      "[Estado del campo — Editor de ejemplo, 2026-09-01]",
    );
    expect(todo).toContain("[Criterio]");
    expect(todo).toContain("[Evidencia]");
  });

  it("en inglés los rótulos y los textos salen en inglés", () => {
    const en = chunksDePieza(juguete(), "en", etiquetas.en)
      .map((c: { texto: string }) => c.texto)
      .join("\n");
    expect(en).toContain(
      "[State of the field — Editor de ejemplo, 2026-09-01]",
    );
    expect(en).toContain("[Judgment]");
    expect(en).toContain("start from the problem, not the tool");
    expect(en).not.toContain("Estado del campo");
  });

  it("los bloques de lista dan un chunk por elemento, con SU nombre en el título", () => {
    const decisiones = chunks.filter((c: { ancla: string }) =>
      c.ancla.endsWith("#bloque-4"),
    );
    expect(decisiones).toHaveLength(4);
    expect(decisiones.map(idDe)).toEqual([
      "metodo-ejemplo-sintetico-bloque-4~1",
      "metodo-ejemplo-sintetico-bloque-4~2",
      "metodo-ejemplo-sintetico-bloque-4~3",
      "metodo-ejemplo-sintetico-bloque-4~4",
    ]);
    expect(decisiones[0].titulo).toContain("Un agente o varios");
    expect(decisiones[0].titulo).toContain("Las decisiones de diseño");
  });

  it("el bloque de métricas dice que los umbrales son del método, no cifras de un proyecto", () => {
    const b7 = chunks
      .filter((c: { ancla: string }) => c.ancla.endsWith("#bloque-7"))
      .map((c: { texto: string }) => c.texto)
      .join("\n");
    expect(b7).toContain("no cifras de un proyecto concreto");
  });

  it("la evidencia lleva el nivel que el corpus le da", () => {
    const b8 = chunks
      .filter((c: { ancla: string }) => c.ancla.endsWith("#bloque-8"))
      .map((c: { texto: string }) => c.texto)
      .join("\n");
    expect(b8).toContain("Nivel: Uso real");
    expect(b8).toContain("Nivel: Prototipo");
  });

  it("el bloque de fuentes lleva título, editor y fecha, y la fecha de revisión", () => {
    const b10 = chunks
      .filter((c: { ancla: string }) => c.ancla.endsWith("#bloque-10"))
      .map((c: { texto: string }) => c.texto)
      .join("\n");
    expect(b10).toContain("Revisado el 2026-10-17");
    expect(b10).toContain(
      "Ejemplo uno (documento de relleno) — Editor de ejemplo, 2026-09-01",
    );
  });

  it("los ids no se repiten y ninguna ventana de prosa pasa del tope", () => {
    const ids = chunks.map(idDe);
    expect(new Set(ids).size).toBe(ids.length);
    const largos = chunks.filter(
      (c: { texto: string }) =>
        c.texto.split(/\s+/).length > TOPE_PALABRAS_CHUNK &&
        c.texto.includes("\n\n"),
    );
    expect(largos).toEqual([]);
  });
});

describe("ROJO · sin la pieza completa no hay cita", () => {
  it("un bloque que falta rompe nombrando el archivo y el bloque", () => {
    const p = juguete(
      (x) => (x.bloques = x.bloques.filter((b: { n: number }) => b.n !== 7)),
    );
    expect(() => chunksDePieza(p, "es", etiquetas.es)).toThrowError(
      /data\/metodo\/ejemplo-sintetico\.yaml: faltan los bloques 7;/,
    );
  });

  it("una pieza sin slug o sin nombre en el idioma se planta", () => {
    const sinSlug = juguete((x) => delete x.slug);
    expect(() => chunksDePieza(sinSlug, "es", etiquetas.es)).toThrowError(
      /«id», «slug» o «nombre\.es»/,
    );
    const sinEn = juguete((x) => delete x.nombre.en);
    expect(() => chunksDePieza(sinEn, "en", etiquetas.en)).toThrowError(
      /nombre\.en/,
    );
  });
});

describe("las anclas de «Métodos» se validan, no solo la ruta", () => {
  const catalogo = catalogoDeDestinos();

  it("los diez bloques de una pieza real existen como destino", () => {
    for (const a of anclasDeBloques("sistema-de-agentes"))
      expect(destinoExiste(a, catalogo), a).toBe(true);
    expect(anclasDeBloques("x")).toHaveLength(10);
  });

  it("la lista y la página existen; el bloque 11, el bloque 0 y un slug inventado no", () => {
    expect(destinoExiste("/metodos", catalogo)).toBe(true);
    expect(destinoExiste("/metodos/sistema-de-agentes", catalogo)).toBe(true);
    expect(
      destinoExiste("/metodos/sistema-de-agentes#bloque-11", catalogo),
    ).toBe(false);
    expect(destinoExiste("/metodos/sistema-de-agentes#bloque-0", catalogo)).toBe(
      false,
    );
    expect(destinoExiste("/metodos/sistema-de-agentes#algo", catalogo)).toBe(
      false,
    );
    expect(destinoExiste("/metodos/inventada#bloque-1", catalogo)).toBe(false);
    expect(destinoExiste("/metodos/inventada", catalogo)).toBe(false);
  });

  it("los destinos de las demás rutas siguen juzgándose por la ruta (no se rompió lo anterior)", () => {
    expect(destinoExiste("/proyectos/vesting#cs-impacto", catalogo)).toBe(true);
    expect(destinoExiste("/proyectos/inventado#algo", catalogo)).toBe(false);
  });

  it("el destino tiene nombre en los dos idiomas: «Métodos» y el nombre de la pieza", () => {
    const es = nombresDeDestinos("es");
    const en = nombresDeDestinos("en");
    expect(nombreDeDestino("/metodos", es)).toBe("Métodos");
    expect(nombreDeDestino("/metodos", en)).toBe("Methods");
    expect(nombreDeDestino("/metodos/sistema-de-agentes#bloque-3", es)).toBe(
      "Cómo se debe estructurar un sistema de agentes",
    );
    expect(nombreDeDestino("/metodos/sistema-de-agentes#bloque-3", en)).toBe(
      "How an agent system should be structured",
    );
  });
});

describe("las piezas reales de data/metodo/", () => {
  const catalogo = catalogoDeDestinos();

  for (const locale of ["es", "en"] as const) {
    describe(locale, () => {
      const chunks = chunksDeMetodo(metodo, locale);

      it("hay piezas y todas producen chunks para sus diez bloques", () => {
        expect(metodo.piezas.length).toBeGreaterThan(0);
        for (const { pieza } of metodo.piezas) {
          for (let n = 1; n <= N_BLOQUES; n++) {
            expect(
              chunks.some(
                (c: { ancla: string }) =>
                  c.ancla === `/metodos/${pieza.slug}#bloque-${n}`,
              ),
              `${pieza.slug} bloque ${n}`,
            ).toBe(true);
          }
        }
      });

      it("cada chunk cita a un bloque que existe en el sitio", () => {
        const rotos = chunks
          .filter((c: { ancla: string }) => !destinoExiste(c.ancla, catalogo))
          .map((c: { id: string; ancla: string }) => `${c.id} → ${c.ancla}`);
        expect(rotos).toEqual([]);
      });

      it("ningún id se repite y ninguna ventana de prosa pasa del tope", () => {
        const ids = chunks.map(idDe);
        expect(new Set(ids).size).toBe(ids.length);
        const largos = chunks.filter(
          (c: { texto: string }) =>
            c.texto.split(/\s+/).length > TOPE_PALABRAS_CHUNK &&
            c.texto.includes("\n\n"),
        );
        expect(largos.map(idDe)).toEqual([]);
      });

      it("el texto del chunk está en el idioma del índice, sin [CONFIRMAR] ni rótulos del otro", () => {
        const todo = chunks.map((c: { texto: string }) => c.texto).join("\n");
        expect(todo).not.toMatch(/\[CONFIRMAR/i);
        const otro =
          locale === "es" ? "State of the field" : "Estado del campo";
        expect(todo).not.toContain(otro);
        expect(todo).toContain(etiquetas[locale].voces.campo.nombre);
        expect(todo).toContain(etiquetas[locale].voces.hice.nombre);
      });

      it("ninguna URL entra al índice: el enlace vive en la página, la cita lleva a ella", () => {
        const todo = chunks.map((c: { texto: string }) => c.texto).join("\n");
        expect(todo).not.toMatch(/https?:\/\//);
      });
    });
  }
});

describe("buildChunks mete «Métodos» al índice, con su código y su destino", () => {
  const cv = parse(readFileSync("data/cv.es.yaml", "utf8"));
  const apps = parse(readFileSync("data/apps.yaml", "utf8"));
  const indice = buildChunks({ cv, apps, aFondo: [], locale: "es", metodo });
  const delMetodo = indice.filter((c: { id: string }) =>
    c.id.startsWith("metodo-"),
  );

  it("cada pieza trae sus chunks, con SU código (T1…T9) y su nombre como destino", () => {
    expect(metodo.piezas.length).toBeGreaterThan(0);
    for (const { pieza } of metodo.piezas) {
      const suyos = delMetodo.filter((c: { id: string }) =>
        c.id.startsWith(`metodo-${pieza.slug}-`),
      );
      expect(suyos.length, pieza.slug).toBeGreaterThanOrEqual(10);
      for (const c of suyos) {
        expect(c.codigo).toBe(pieza.id);
        expect(c.destino).toBe(pieza.nombre.es);
      }
    }
    // Y ningún chunk del método queda sin pieza que lo reclame.
    const slugs = metodo.piezas.map(
      ({ pieza }: { pieza: { slug: string } }) => pieza.slug,
    );
    for (const c of delMetodo)
      expect(
        slugs.some((s: string) => c.id.startsWith(`metodo-${s}-`)),
        c.id,
      ).toBe(true);
  });

  it("sin el argumento `metodo`, el índice no los trae (los tests del builder no lo arrastran)", () => {
    const sin = buildChunks({ cv, apps, aFondo: [], locale: "es" });
    expect(sin.some((c: { id: string }) => c.id.startsWith("metodo-"))).toBe(
      false,
    );
  });
});

// ───────────────────────────────────────────────────────────────────────────
// S11 · EL ÍNDICE PASA POR ZOD ANTES DE ARMARSE, Y LOS ENLACES DE LA EVIDENCIA EXISTEN
// ───────────────────────────────────────────────────────────────────────────

describe("ROJO · leerMetodo valida con el esquema antes de armar el índice (S11)", () => {
  const TEXTO = readFileSync(
    "tests/fixtures/metodo/ejemplo-sintetico.yaml",
    "utf8",
  );
  const APROBADO = "---\nestado: aprobado\n---\n# doc\n";
  const carpetas: string[] = [];
  afterEach(() => {
    for (const c of carpetas.splice(0))
      rmSync(c, { recursive: true, force: true });
  });

  /** Una raíz de prueba con la pieza dada y el corpus que ella cita, aprobado en ES y EN. */
  function raiz(yaml: string): string {
    const r = mkdtempSync(path.join(tmpdir(), "metodo-indice-"));
    carpetas.push(r);
    mkdirSync(path.join(r, "data", "metodo"), { recursive: true });
    mkdirSync(path.join(r, "data", "a-fondo"), { recursive: true });
    writeFileSync(
      path.join(r, "data", "metodo", "ejemplo-sintetico.yaml"),
      yaml,
    );
    for (const slug of ["como-trabajo", "vesting"])
      for (const l of ["es", "en"])
        writeFileSync(
          path.join(r, "data", "a-fondo", `${slug}.${l}.md`),
          APROBADO,
        );
    return r;
  }

  it("la pieza de juguete válida se lee (el control: sin esto, los rojos no prueban nada)", () => {
    expect(leerMetodo(raiz(TEXTO)).piezas.map((p) => p.pieza.slug)).toEqual([
      "ejemplo-sintetico",
    ]);
  });

  it("un tipo de nodo que no existe rompe nombrando archivo y campo, no con un TypeError", () => {
    const malo = TEXTO.replace("tipo: humano", "tipo: persona");
    expect(malo).not.toBe(TEXTO);
    expect(() => leerMetodo(raiz(malo))).toThrowError(
      /data\/metodo\/ejemplo-sintetico\.yaml[\s\S]*nodos\.6\.tipo/,
    );
  });

  it("una voz que no existe rompe nombrando el campo", () => {
    const malo = TEXTO.replace("voz: hice", "voz: otra");
    expect(malo).not.toBe(TEXTO);
    expect(() => leerMetodo(raiz(malo))).toThrowError(
      /data\/metodo\/ejemplo-sintetico\.yaml[\s\S]*voz/,
    );
  });

  it("un nivel que no existe rompe en vez de escribir «undefined» en un fragmento", () => {
    const malo = TEXTO.replace("nivel: uso-real", "nivel: produccion");
    expect(malo).not.toBe(TEXTO);
    expect(() => leerMetodo(raiz(malo))).toThrowError(
      /data\/metodo\/ejemplo-sintetico\.yaml[\s\S]*evidencia\.0\.nivel/,
    );
  });

  it("un documento del corpus en borrador rompe también aquí (el índice no lo citaría)", () => {
    const r = raiz(TEXTO);
    writeFileSync(
      path.join(r, "data", "a-fondo", "vesting.es.md"),
      "---\nestado: borrador\n---\n# doc\n",
    );
    expect(() => leerMetodo(r)).toThrowError(
      /«vesting» existe en data\/a-fondo\/ pero no se puede citar/,
    );
  });
});

describe("ROJO · los enlaces de la evidencia llevan a un destino que existe (S11)", () => {
  const piezas = (hrefs: (string | undefined)[]) => {
    const pieza = structuredClone(EJEMPLO);
    const b8 = pieza.bloques.find((b: { n: number }) => b.n === 8);
    b8.evidencia.forEach((e: { href?: string }, i: number) => {
      e.href = hrefs[i];
    });
    return [{ archivo: "data/metodo/ejemplo-sintetico.yaml", pieza }];
  };

  it("los enlaces reales de data/metodo/ existen en el catálogo de destinos", () => {
    // El catálogo se arma UNA vez: `destinoExiste(d)` sin él lo reconstruye por
    // cada enlace (decenas, entre todas las piezas) y en un runner cargado pasaba de 5 s.
    const catalogo = catalogoDeDestinos();
    const problemas = problemasDeEvidencia(metodo.piezas, (d: string) =>
      destinoExiste(d, catalogo),
    );
    expect(problemas, "\n" + problemas.join("\n")).toEqual([]);
  });

  it("un enlace con un typo rompe nombrando archivo, campo y el valor", () => {
    const malos = problemasDeEvidencia(
      piezas(["/proyectos/vestin"]),
      (d: string) => destinoExiste(d),
    );
    expect(malos).toHaveLength(1);
    expect(malos[0]).toMatch(
      /data\/metodo\/ejemplo-sintetico\.yaml: bloques\.7\.evidencia\.0\.href = «\/proyectos\/vestin» no es un destino del sitio/,
    );
  });

  it("una evidencia sin enlace es válida (el enlace es opcional)", () => {
    expect(
      problemasDeEvidencia(piezas([undefined, undefined]), (d: string) =>
        destinoExiste(d),
      ),
    ).toEqual([]);
  });

  it("un enlace con ancla se juzga por su ruta (la página es lo que decide)", () => {
    expect(
      problemasDeEvidencia(
        piezas(["/proyectos/vesting#cs-impacto"]),
        (d: string) => destinoExiste(d),
      ),
    ).toEqual([]);
  });
});
