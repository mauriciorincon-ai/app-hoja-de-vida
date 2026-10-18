// @vitest-environment node
import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";
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
} from "../../scripts/metodo-al-indice.mjs";

/**
 * «MI MÉTODO» EN EL ÍNDICE DEL CHAT (S10, F3). Dos mitades, como las fichas:
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
          c.ancla === `/metodo/ejemplo-sintetico#bloque-${n}`,
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

  it("la voz viaja DENTRO del texto: el campo con su fuente, lo mío con su rótulo", () => {
    const todo = chunks.map((c: { texto: string }) => c.texto).join("\n");
    // El ejemplo cita la fuente 1 (Editor de ejemplo, 2026-09-01) en el bloque 4.
    expect(todo).toContain(
      "[Lo que el campo hace — Editor de ejemplo, 2026-09-01]",
    );
    expect(todo).toContain("[Mi posición]");
    expect(todo).toContain("[Lo que hice]");
  });

  it("en inglés los rótulos y los textos salen en inglés", () => {
    const en = chunksDePieza(juguete(), "en", etiquetas.en)
      .map((c: { texto: string }) => c.texto)
      .join("\n");
    expect(en).toContain(
      "[What the field does — Editor de ejemplo, 2026-09-01]",
    );
    expect(en).toContain("[My position]");
    expect(en).toContain("start from the problem, not the tool");
    expect(en).not.toContain("Lo que el campo hace");
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
    expect(b7).toContain("no cifras de un proyecto mío");
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

describe("las anclas de «Mi método» se validan, no solo la ruta", () => {
  const catalogo = catalogoDeDestinos();

  it("los diez bloques de una pieza real existen como destino", () => {
    for (const a of anclasDeBloques("sistema-de-agentes"))
      expect(destinoExiste(a, catalogo), a).toBe(true);
    expect(anclasDeBloques("x")).toHaveLength(10);
  });

  it("la lista y la página existen; el bloque 11, el bloque 0 y un slug inventado no", () => {
    expect(destinoExiste("/metodo", catalogo)).toBe(true);
    expect(destinoExiste("/metodo/sistema-de-agentes", catalogo)).toBe(true);
    expect(
      destinoExiste("/metodo/sistema-de-agentes#bloque-11", catalogo),
    ).toBe(false);
    expect(destinoExiste("/metodo/sistema-de-agentes#bloque-0", catalogo)).toBe(
      false,
    );
    expect(destinoExiste("/metodo/sistema-de-agentes#algo", catalogo)).toBe(
      false,
    );
    expect(destinoExiste("/metodo/inventada#bloque-1", catalogo)).toBe(false);
    expect(destinoExiste("/metodo/inventada", catalogo)).toBe(false);
  });

  it("los destinos de las demás rutas siguen juzgándose por la ruta (no se rompió lo anterior)", () => {
    expect(destinoExiste("/proyectos/vesting#cs-impacto", catalogo)).toBe(true);
    expect(destinoExiste("/proyectos/inventado#algo", catalogo)).toBe(false);
  });

  it("el destino tiene nombre en los dos idiomas: «Mi método» y el nombre de la pieza", () => {
    const es = nombresDeDestinos("es");
    const en = nombresDeDestinos("en");
    expect(nombreDeDestino("/metodo", es)).toBe("Mi método");
    expect(nombreDeDestino("/metodo", en)).toBe("My method");
    expect(nombreDeDestino("/metodo/sistema-de-agentes#bloque-3", es)).toBe(
      "Cómo estructuro un sistema de agentes",
    );
    expect(nombreDeDestino("/metodo/sistema-de-agentes#bloque-3", en)).toBe(
      "How I structure an agent system",
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
                  c.ancla === `/metodo/${pieza.slug}#bloque-${n}`,
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
          locale === "es" ? "What the field does" : "Lo que el campo hace";
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

describe("buildChunks mete «Mi método» al índice, con su código y su destino", () => {
  const cv = parse(readFileSync("data/cv.es.yaml", "utf8"));
  const apps = parse(readFileSync("data/apps.yaml", "utf8"));
  const indice = buildChunks({ cv, apps, aFondo: [], locale: "es", metodo });
  const delMetodo = indice.filter((c: { id: string }) =>
    c.id.startsWith("metodo-"),
  );

  it("los chunks de la pieza están, con código T2 y el destino con el nombre de la pieza", () => {
    expect(delMetodo.length).toBeGreaterThanOrEqual(10);
    for (const c of delMetodo) {
      expect(c.codigo).toBe("T2");
      expect(c.destino).toBe("Cómo estructuro un sistema de agentes");
    }
  });

  it("sin el argumento `metodo`, el índice no los trae (los tests del builder no lo arrastran)", () => {
    const sin = buildChunks({ cv, apps, aFondo: [], locale: "es" });
    expect(sin.some((c: { id: string }) => c.id.startsWith("metodo-"))).toBe(
      false,
    );
  });
});
