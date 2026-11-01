/* eslint-disable @typescript-eslint/no-explicit-any --
   Justificado (regla 1): cada caso muta un JSON CRUDO para fabricar su entrada inválida;
   tiparlo campo a campo sería reescribir el esquema que se está probando. */
import { existsSync, readdirSync, readFileSync } from "node:fs";
import path from "node:path";
import { describe, expect, it } from "vitest";
import { parse } from "yaml";
import { ICONOS as DIBUJOS } from "@/components/brochure/iconos";
import {
  ACENTOS,
  ACTORES,
  ICONOS,
  contenidoSchema,
  leerContenido,
  problemasDeContenido,
  type Contenido,
  type EntregaDeApp,
} from "@/lib/brochure/contenido";

/**
 * EL CONTRATO v2 DEL BROCHURE (borrador, S28).
 *
 * Dos capas, como el resto del contenido: la FORMA (zod estricto, con un rojo por regla)
 * y la COHERENCIA contra la entrega de la app (¿existe esa funcionalidad?, ¿tiene
 * captura?, ¿el mapa cubre todos los grupos?, ¿el inglés cubre todo?). Al final, el
 * contenido REAL que haya en `content/vitrina/`: valida y es coherente con su entrega.
 */

const bi = (s: string) => ({ es: s, en: `${s} (en)` });

const ENTREGA = {
  export: {
    app: { slug: "x" },
    funcionalidades: {
      grupos: [
        { orden: 1, features: [{ id: "A1" }, { id: "A2" }] },
        { orden: 2, features: [{ id: "B1" }] },
      ],
    },
    metricas: [{ clave: "pantallas" }, { clave: "peso_brochure" }],
    stack: [{ nombre: "n", papel: "p" }],
    promesa: {},
  },
  capturas: { capturas: [{ funcionalidad: "A1" }, { funcionalidad: "B1" }] },
  complemento: {
    limites: ["l1", "l2"],
    nunca: ["n1", "n2"],
    proceso: {
      carriles: [{ id: "app" }],
      pasos: [{ id: "ini" }, { id: "fin" }],
      flujos: [{ de: "ini", a: "fin", etiqueta: "sí" }],
      anotaciones: [{ paso: "ini" }],
    },
  },
} as unknown as EntregaDeApp;

const valido = (): Record<string, unknown> => ({
  schema_version: "2.0.0-borrador",
  app: "x",
  acento: "sage",
  portada: {
    resalta: bi("R"),
    pantallas: ["A1"],
    lugar: bi("L"),
    categoria: bi("C"),
    insignias: [
      { simbolo: "✓", texto: bi("I"), funcionalidad: "A1" },
      { simbolo: "$", texto: bi("J"), fuente: "promesa" },
    ],
  },
  antes_despues: {
    titulo: bi("T"),
    antes_rotulo: bi("Hoy"),
    despues_rotulo: bi("Con la app"),
    corto: bi("Lo que cambia"),
    para_quien_titulo: bi("Para quién"),
    prueba: {
      antes: bi("a"),
      despues: bi("d"),
      texto: bi("t"),
      fuente: "declarado",
      detalle: bi("de"),
      cita: "promesa",
    },
    pares: [
      { antes: bi("a"), despues: bi("d"), funcionalidad: "A1", fuente: "A1" },
    ],
  },
  mapa: {
    intro: bi("m"),
    capas: [{ nombre: bi("c"), sub: bi("s"), grupos: [1] }],
    transversal: {
      nombre: bi("t"),
      sub: bi("s"),
      grupos: [2],
      rasgos: [
        {
          titulo: bi("r"),
          texto: bi("r"),
          fuente: "metricas",
          metrica: "pantallas",
        },
      ],
    },
  },
  iconos: { "1": "lupa" },
  proceso_pantallas: { ini: "A1" },
  servicios: {
    titulo: bi("S"),
    texto: bi("s"),
    fuente: "declarado",
    nota: bi("n"),
    items: [{ funcionalidad: "A2", titulo: bi("i"), texto: bi("i") }],
  },
  metricas_texto: { pantallas: bi("p") },
  metodo: { ocultar: ["peso_brochure"] },
  grupos: [
    {
      orden: 1,
      que_resuelve: bi("q"),
      te_sirve: [{ texto: bi("t"), fuente: "A1" }],
      no_es: [],
      flujo: {
        titulo: bi("f"),
        nodos: [
          {
            id: "a",
            tipo: "inicio",
            actor: "app",
            texto: bi("n"),
            funcionalidad: "A1",
          },
          { id: "b", tipo: "fin", actor: "app", texto: bi("n") },
        ],
        aristas: [{ de: "a", a: "b" }],
      },
      fichas: [
        {
          tipo: "concepto",
          pregunta: bi("p"),
          respuesta: bi("r"),
          fuente: "A1",
        },
      ],
    },
  ],
  en: {
    promesa: { tagline: "t", intro: "i", para_quien: "p", diferencial: "d" },
    grupos: {
      "1": { nombre: "n", linea: "l" },
      "2": { nombre: "n", linea: "l" },
    },
    features: {
      A1: { nombre: "n", que_hace: "q" },
      A2: { nombre: "n", que_hace: "q" },
      B1: { nombre: "n", que_hace: "q" },
    },
    metricas: {
      pantallas: { etiqueta: "e", unidad: "u", detalle: "d" },
      peso_brochure: { etiqueta: "e", unidad: "u", detalle: "d" },
    },
    stack: [{ nombre: "n", papel: "p" }],
    privacidad: "p",
    enlaces_razon: "e",
    complemento: {
      titular: "t",
      limites: ["l1", "l2"],
      nunca: ["n1", "n2"],
      proceso: {
        titulo: "t",
        carriles: { app: "App" },
        pasos: { ini: "i", fin: "f" },
        etiquetas: { "ini>fin": "yes" },
        anotaciones: { ini: "a" },
      },
    },
  },
});

/** Aplica un cambio a una copia del contenido válido (un objeto nuevo en cada llamada). */
const con = (cambia: (c: Record<string, any>) => void) => {
  const c = valido();
  cambia(c);
  return c;
};

const coherencia = (crudo: unknown) => {
  const r = leerContenido(crudo);
  if (!r.ok)
    throw new Error(`la forma debía ser válida: ${r.problemas.join(" | ")}`);
  return problemasDeContenido(r.contenido, ENTREGA);
};

describe("la FORMA del contenido v2", () => {
  it("un contenido completo y bien formado valida y es coherente", () => {
    expect(leerContenido(valido()).ok).toBe(true);
    expect(coherencia(valido())).toEqual([]);
  });

  it("solo exige la versión, la app y el acento: todo lo demás es opcional (un bloque sin datos no se pinta)", () => {
    const r = leerContenido({
      schema_version: "2.0.0",
      app: "x",
      acento: "sky",
    });
    expect(r.ok).toBe(true);
    expect(
      coherencia({ schema_version: "2.0.0", app: "x", acento: "sky" }),
    ).toEqual([]);
  });

  it.each([
    [
      "una clave que el contrato no conoce",
      (c: any) => (c.inventada = 1),
      /Unrecognized key/i,
    ],
    [
      "una clave de más dentro de un bloque",
      (c: any) => (c.portada.extra = 1),
      /portada.*Unrecognized key/i,
    ],
    [
      "un acento fuera de la paleta",
      (c: any) => (c.acento = "menta"),
      /acento/,
    ],
    [
      "una versión que no es la 2",
      (c: any) => (c.schema_version = "1.0.0"),
      /schema_version/,
    ],
    [
      "un texto sin su inglés",
      (c: any) => delete c.portada.resalta.en,
      /portada\.resalta\.en/,
    ],
    [
      "un texto vacío",
      (c: any) => (c.portada.lugar.es = "  "),
      /portada\.lugar\.es/,
    ],
    [
      "una insignia con funcionalidad Y fuente",
      (c: any) => (c.portada.insignias[0].fuente = "promesa"),
      /exactamente una/,
    ],
    [
      "una insignia sin ninguna",
      (c: any) => delete c.portada.insignias[1].fuente,
      /exactamente una/,
    ],
    [
      "un ícono que la hoja no dibuja",
      (c: any) => (c.iconos["1"] = "cohete"),
      /iconos/,
    ],
    [
      "un tipo de nodo desconocido",
      (c: any) => (c.grupos[0].flujo.nodos[0].tipo = "evento"),
      /tipo/,
    ],
    [
      "un actor desconocido",
      (c: any) => (c.grupos[0].flujo.nodos[0].actor = "robot"),
      /actor/,
    ],
    [
      "una ficha con un solo lado",
      (c: any) =>
        (c.grupos[0].fichas[0].lados = [{ titulo: bi("a"), texto: bi("b") }]),
      /lados/,
    ],
    [
      "una procedencia inventada",
      (c: any) => (c.servicios.fuente = "adivinado"),
      /servicios\.fuente/,
    ],
  ])("rechaza %s", (_nombre, cambia, esperado) => {
    const r = leerContenido(con(cambia));
    expect(r.ok).toBe(false);
    if (!r.ok) expect(r.problemas.join("\n")).toMatch(esperado);
  });

  it("un paso final sin rótulo en el complemento admite su inglés vacío (paridad), pero no un texto vacío en otro campo", () => {
    expect(
      leerContenido(con((c) => (c.en.complemento.proceso.pasos.fin = ""))).ok,
    ).toBe(true);
    expect(
      leerContenido(con((c) => (c.en.complemento.proceso.carriles.app = "")))
        .ok,
    ).toBe(false);
  });

  it("la paleta es de seis acentos, los de la maqueta", () => {
    expect([...ACENTOS]).toEqual([
      "sage",
      "sky",
      "lilac",
      "peach",
      "rose",
      "citron",
    ]);
    expect(contenidoSchema.shape.acento.options).toHaveLength(6);
  });
});

describe("lo que pidió la tanda 1 (S30)", () => {
  it("`enlaces_razon` de primer nivel va en los dos idiomas, o no va", () => {
    expect(
      leerContenido(
        con((c) => (c.enlaces_razon = bi("Se conoce por este brochure"))),
      ).ok,
    ).toBe(true);
    expect(
      leerContenido(con((c) => (c.enlaces_razon = { es: "solo español" }))).ok,
    ).toBe(false);
  });

  it("quien visita y el proveedor son actores; uno inventado sigue fuera", () => {
    expect(ACTORES).toEqual(expect.arrayContaining(["visita", "proveedor"]));
    for (const actor of ["visita", "proveedor"])
      expect(
        leerContenido(con((c) => (c.grupos[0].flujo.nodos[0].actor = actor)))
          .ok,
        actor,
      ).toBe(true);
    expect(
      leerContenido(con((c) => (c.grupos[0].flujo.nodos[0].actor = "cliente")))
        .ok,
    ).toBe(false);
  });

  it("la conversación y la llave son íconos, y la hoja sabe dibujarlos", () => {
    for (const i of ["conversacion", "llave"] as const) {
      expect(ICONOS, i).toContain(i);
      expect(leerContenido(con((c) => (c.iconos["1"] = i))).ok, i).toBe(true);
      expect(DIBUJOS[i], i).toMatch(/<(path|circle) /);
    }
  });
});

describe("la COHERENCIA contra la entrega de la app", () => {
  it.each([
    [
      "una funcionalidad que el export no tiene (te sirve si)",
      (c: any) => (c.grupos[0].te_sirve[0].fuente = "Z9"),
      /te_sirve\[0\]\.fuente: «Z9» no es una funcionalidad/,
    ],
    [
      "una pantalla de la portada sin captura",
      (c: any) => (c.portada.pantallas = ["A2"]),
      /portada\.pantallas\[0\]: «A2» no tiene captura/,
    ],
    [
      "una pantalla de la portada que no existe",
      (c: any) => (c.portada.pantallas = ["Z9"]),
      /portada\.pantallas\[0\]: «Z9» no está en el export/,
    ],
    [
      "un par sin captura",
      (c: any) => (c.antes_despues.pares[0].funcionalidad = "A2"),
      /pares\[0\]\.funcionalidad: «A2» no tiene captura/,
    ],
    [
      "una cita que no es una fuente",
      (c: any) => (c.antes_despues.prueba.cita = "rumor"),
      /prueba\.cita: «rumor»/,
    ],
    [
      "una caja del flujo sin captura",
      (c: any) => (c.grupos[0].flujo.nodos[0].funcionalidad = "A2"),
      /nodos\[0\]\.funcionalidad: «A2» no tiene captura/,
    ],
    [
      "una arista a un nodo que no existe",
      (c: any) => (c.grupos[0].flujo.aristas[0].a = "zz"),
      /aristas\[0\]\.a: «zz» no es un nodo/,
    ],
    [
      "dos nodos con el mismo id",
      (c: any) => (c.grupos[0].flujo.nodos[1].id = "a"),
      /el id «a» se repite/,
    ],
    [
      "un grupo que el export no tiene",
      (c: any) => (c.grupos[0].orden = 7),
      /grupos\[0\]\.orden: 7/,
    ],
    [
      "un grupo repetido",
      (c: any) => c.grupos.push({ ...c.grupos[0], flujo: undefined }),
      /el orden 1 se repite/,
    ],
    [
      "un grupo del export que el mapa no cubre",
      (c: any) => (c.mapa.transversal.grupos = []),
      /el grupo 2 del export no está en ninguna capa/,
    ],
    [
      "un grupo en dos capas",
      (c: any) =>
        c.mapa.capas.push({ nombre: bi("x"), sub: bi("y"), grupos: [1] }),
      /el grupo 1 aparece más de una vez/,
    ],
    [
      "una métrica que el export no tiene (rasgo)",
      (c: any) => (c.mapa.transversal.rasgos[0].metrica = "magia"),
      /rasgos\[0\]\.metrica: «magia»/,
    ],
    [
      "un texto de métrica que sobra",
      (c: any) => (c.metricas_texto.magia = bi("m")),
      /metricas_texto\.magia/,
    ],
    [
      "un método que oculta una métrica inexistente",
      (c: any) => (c.metodo.ocultar = ["magia"]),
      /metodo\.ocultar\[0\]/,
    ],
    [
      "un ícono de un grupo que no existe",
      (c: any) => (c.iconos["9"] = "foto"),
      /iconos\.9/,
    ],
    [
      "una pantalla de un paso que no es del proceso",
      (c: any) => (c.proceso_pantallas.zz = "A1"),
      /proceso_pantallas\.zz: no es un paso/,
    ],
    ["otra app", (c: any) => (c.app = "y"), /app: «y» no es la del export/],
    [
      "un servicio con una funcionalidad inexistente",
      (c: any) => (c.servicios.items[0].funcionalidad = "Z9"),
      /servicios\.items\[0\]\.funcionalidad: «Z9»/,
    ],
  ])("avisa de %s", (_nombre, cambia, esperado) => {
    expect(coherencia(con(cambia)).join("\n")).toMatch(esperado);
  });

  it.each([
    [
      "una funcionalidad sin traducir",
      (c: any) => delete c.en.features.B1,
      /en\.features: falta «B1»/,
    ],
    [
      "una traducción que sobra",
      (c: any) => (c.en.features.Z9 = { nombre: "n", que_hace: "q" }),
      /en\.features: sobra «Z9»/,
    ],
    [
      "un grupo sin traducir",
      (c: any) => delete c.en.grupos["2"],
      /en\.grupos: falta «2»/,
    ],
    [
      "una métrica sin traducir",
      (c: any) => delete c.en.metricas.peso_brochure,
      /en\.metricas: falta «peso_brochure»/,
    ],
    [
      "una fila de stack de menos",
      (c: any) => (c.en.stack = []),
      /en\.stack: 0 filas/,
    ],
    [
      "un límite de menos",
      (c: any) => c.en.complemento.limites.pop(),
      /en\.complemento\.limites: 1/,
    ],
    [
      "un paso sin traducir",
      (c: any) => delete c.en.complemento.proceso.pasos.fin,
      /pasos: falta «fin»/,
    ],
    [
      "una etiqueta de flecha sin traducir",
      (c: any) => (c.en.complemento.proceso.etiquetas = {}),
      /etiquetas: falta «ini>fin»/,
    ],
    [
      "el proceso entero sin traducir",
      (c: any) => delete c.en.complemento.proceso,
      /proceso: falta/,
    ],
  ])(
    "el inglés tiene que cubrir todo: avisa de %s",
    (_nombre, cambia, esperado) => {
      expect(coherencia(con(cambia)).join("\n")).toMatch(esperado);
    },
  );
});

describe.skipIf(
  !readdirSync("content/vitrina").some((f) => f.endsWith(".contenido.json")),
)("el contenido v2 REAL de content/vitrina/", () => {
  const DIR = "content/vitrina";
  const leerJson = (f: string) =>
    JSON.parse(readFileSync(path.join(DIR, f), "utf8"));
  const leerYaml = (f: string) => parse(readFileSync(f, "utf8"));
  const archivos = readdirSync(DIR).filter((f) =>
    f.endsWith(".contenido.json"),
  );

  it("la piloto, Innmobiliaria, tiene su contenido v2", () => {
    expect(archivos).toContain("inmobiliaria.contenido.json");
  });

  it.each(archivos)(
    "%s valida y es coherente con su export, sus capturas y su complemento",
    (f) => {
      const slug = f.replace(".contenido.json", "");
      const r = leerContenido(leerJson(f));
      if (!r.ok) throw new Error(`${f}:\n  - ${r.problemas.join("\n  - ")}`);
      const c: Contenido = r.contenido;
      expect(c.app).toBe(slug);
      const entrega = {
        export: leerJson(`${slug}.brochure-export.json`),
        capturas: leerYaml(path.join(DIR, `${slug}.capturas.yaml`)),
        complemento: leerYaml(path.join("data/fichas", `${slug}.yaml`)),
      } as unknown as EntregaDeApp;
      expect(problemasDeContenido(c, entrega), `${f}`).toEqual([]);
      // Sin sobras: el archivo que no es de una app del Portafolio no vive junto a sus exports.
      expect(existsSync(path.join(DIR, `${slug}.brochure-export.json`))).toBe(
        true,
      );
    },
  );
});
