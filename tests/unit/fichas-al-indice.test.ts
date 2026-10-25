import { readFileSync, readdirSync } from "node:fs";
import { parse } from "yaml";
import { describe, expect, it } from "vitest";
import {
  chunksDeApp,
  chunksDeFichas,
  chunksDePieza,
  leerFichas,
} from "../../scripts/fichas-al-indice.mjs";
import { catalogoDeDestinos, destinoExiste } from "../../scripts/destinos.mjs";
import { TOPE_PALABRAS_CHUNK } from "../../scripts/a-fondo.mjs";

/**
 * LAS FICHAS DE LA VITRINA EN EL ÍNDICE DEL CHAT (a fondo v2, D3).
 *
 * Dos bloques: el motor contra fichas de juguete —sabe aprobar y sabe
 * plantarse— y el motor contra las piezas reales (las que hay en disco): cada chunk cita a una
 * página que existe, ningún id se repite y ninguna ventana pasa del tope salvo
 * que un solo párrafo lo pase por sí mismo (regla de `ventanasPorParrafo`).
 */

const ficha = (extra: Record<string, unknown> = {}) => ({
  frente: "tableros",
  ficha: {
    pieza: {
      slug: "banca",
      nombre: "Banca bajo la lupa",
      estado: "sellado",
      version: "1.0.0",
    },
    promesa: { tagline: "La banca, verificada." },
    titular: "El balance cierra en 7 779 combinaciones.",
    cifras: [
      {
        etiqueta: "Combinaciones",
        valor: 7779,
        unidad: "casos",
        fuente: "medido",
      },
    ],
    stack: [{ nombre: "Power BI Desktop", papel: "el reporte" }],
    limites: ["Foto fechada."],
    nunca: ["Suma niveles del plan de cuentas."],
    bloques: [{ nombre: "Cifras", linea: "Cuánto pesa la banca." }],
    ...extra,
  },
});

describe("el motor, contra fichas de juguete", () => {
  it("una pieza produce promesa, cifras, límites y bloques, todos citando a su página", () => {
    const chunks = chunksDePieza(ficha());
    expect(chunks.map((c) => c.id)).toEqual([
      "tableros-banca",
      "tableros-banca-cifras",
      "tableros-banca-limites",
      "tableros-banca-bloques",
    ]);
    expect(new Set(chunks.map((c) => c.ancla))).toEqual(
      new Set(["/portafolio/tableros/banca"]),
    );
    expect(chunks[1].texto).toContain("Combinaciones: 7779 casos (medido)");
    expect(chunks[2].texto).toContain("Nunca: Suma niveles");
  });

  it("una ficha sin slug se planta: una cita sin destino no entra al índice", () => {
    expect(() =>
      chunksDePieza({ frente: "tableros", ficha: { pieza: { nombre: "x" } } }),
    ).toThrow(/pieza.slug/);
  });

  it("una app usa el brochure y su complemento, y cita a /portafolio/apps/<slug>", () => {
    const chunks = chunksDeApp({
      brochure: {
        app: { slug: "habla", nombre: "Habla San", estado: "sellado" },
        promesa: { tagline: "Su voz mueve el mundo." },
        funcionalidades: {
          grupos: [
            {
              nombre: "Juegos",
              linea: "Se juegan hablando.",
              features: [{ nombre: "Cápsula", que_hace: "Una idea al día." }],
            },
          ],
        },
        metricas: [
          {
            etiqueta: "Pruebas",
            valor: 261,
            unidad: "pruebas",
            fuente: "medido",
          },
        ],
        privacidad: { detalle: "La voz nunca se graba." },
      },
      complemento: {
        titular: "Solo afirma lo que midió.",
        limites: ["Acompaña la terapia."],
        nunca: ["Usa la cámara."],
      },
    });
    expect(chunks.map((c) => c.id)).toEqual([
      "pieza-apps-habla",
      "pieza-apps-habla-funcionalidades",
      "pieza-apps-habla-cifras",
      "pieza-apps-habla-limites",
    ]);
    expect(chunks.every((c) => c.ancla === "/portafolio/apps/habla")).toBe(true);
    expect(chunks[3].texto).toContain("Privacidad: La voz nunca se graba.");
  });

  it("un bloque largo se parte en ventanas con la misma ancla y sufijo en el id", () => {
    const largo = Array.from({ length: 6 }, (_, i) => ({
      nombre: `Bloque ${i}`,
      linea: "palabra ".repeat(60),
    }));
    const chunks = chunksDePieza(ficha({ bloques: largo }));
    const bloques = chunks.filter((c) =>
      c.id.startsWith("tableros-banca-bloques"),
    );
    expect(bloques.length).toBeGreaterThan(1);
    expect(bloques.every((c) => c.ancla === "/portafolio/tableros/banca")).toBe(
      true,
    );
    expect(bloques[0].id).toBe("tableros-banca-bloques~1");
  });
});

/** Cuántos archivos reales de una carpeta de `content/` terminan en `sufijo`. */
const enDisco = (carpeta: string, sufijo: string) =>
  readdirSync(`content/${carpeta}`).filter((f) => f.endsWith(sufijo)).length;

/** Los frentes que HOY publican sus piezas, de `data/vitrina.yaml`. */
const frentesAbiertos = (): Set<string> =>
  new Set(
    (
      parse(readFileSync("data/vitrina.yaml", "utf8")).categorias as {
        id: string;
        estado: string;
      }[]
    )
      .filter((c) => c.estado === "abierta")
      .map((c) => c.id),
  );

describe("un frente en pausa no se cita", () => {
  it("el índice no trae ninguna cita a las piezas de un frente en-preparacion", () => {
    const pausados = ["agentes", "investigaciones", "tableros"].filter(
      (f) => !frentesAbiertos().has(f),
    );
    // Sin sujeto cuando ningún frente está en pausa: el rojo del índice con una ancla a un frente
    // pausado se demostró al nacer el gate (S22) y vuelve a tener sujeto con la próxima pausa.
    const { piezas } = leerFichas();
    const citadas = piezas.filter((p: { frente: string }) =>
      pausados.includes(p.frente),
    );
    expect(citadas).toEqual([]);
    const anclas = chunksDeFichas(leerFichas(), "es").map((c) => c.ancla);
    for (const f of pausados)
      expect(
        anclas.filter((a) => a.startsWith(`/portafolio/${f}/`)),
        f,
      ).toEqual([]);
  });
});

describe("las piezas reales", () => {
  const fichas = leerFichas();
  const chunks = chunksDeFichas(fichas, "es");
  const catalogo = catalogoDeDestinos();

  it("hay tantas piezas como archivos de los frentes abiertos y todas producen chunks", () => {
    // El conteo sale de `content/`, no de un número escrito a mano: una pieza
    // nueva no debe romper este test, pero una que no llegue al índice, sí. Un
    // frente en pausa (`en-preparacion`) no tiene página y no se cita: no cuenta.
    const abiertos = frentesAbiertos();
    const enContent =
      enDisco("vitrina", ".brochure-export.json") +
      ["agentes", "investigaciones", "tableros"]
        .filter((f) => abiertos.has(f))
        .reduce((n, f) => n + enDisco(f, ".ficha-tecnica.json"), 0);
    expect(enContent).toBeGreaterThan(0);
    expect(fichas.apps.length + fichas.piezas.length).toBe(enContent);
    expect(new Set(chunks.map((c) => c.ancla)).size).toBe(enContent);
  });

  it("cada chunk cita a una página que existe en el sitio", () => {
    const rotas = chunks
      .filter((c) => !destinoExiste(c.ancla, catalogo))
      .map((c) => `${c.id} → ${c.ancla}`);
    expect(rotas).toEqual([]);
  });

  it("ningún id se repite", () => {
    const ids = chunks.map((c) => c.id);
    expect(new Set(ids).size).toBe(ids.length);
  });

  it("ninguna ventana pasa del tope, salvo un párrafo que lo pasa solo", () => {
    const largos = chunks.filter(
      (c) =>
        c.texto.split(/\s+/).length > TOPE_PALABRAS_CHUNK &&
        c.texto.includes("\n\n"),
    );
    expect(largos.map((c) => c.id)).toEqual([]);
  });
});
