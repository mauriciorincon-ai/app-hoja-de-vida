import { existsSync, readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";
import { NUMEROS_ES, normalizar } from "../../scripts/a-fondo-coherencia.mjs";
import { nombreCortoDeProyecto as nombreCortoMjs } from "../../scripts/destinos.mjs";
import { getCv } from "@/lib/content";
import { nombreCortoDeProyecto, vecinosDeCaso } from "@/lib/casos";
import type { Cv } from "@/lib/schemas";

/**
 * LOS CASOS DE ESTUDIO (revisión 2026-09-24, ADR-009 enmendado).
 *
 * Nace de un reclamo justo del dueño: el 13 de septiembre pidió los casos de
 * C&M Consorcio, Ceinfes e Inglopres «cuando termine el a fondo», el a fondo se
 * terminó y aprobó (25 documentos, 148 mil palabras) y los casos no llegaron. Y
 * los cinco que existían seguían siendo cuatro frases por lista: la profundidad
 * estaba escrita y la página no la mostraba.
 *
 * El esquema ya exige la forma completa (titular, cifras, capítulos, lección).
 * Estos gates exigen lo que un esquema no puede ver:
 *
 *  1. **Cada hito de la trayectoria tiene su caso.** Un hito sin caso es la
 *     promesa del 13 de septiembre sin cumplir, y ahora rompe el test.
 *  2. **Cada cifra sale de su documento a fondo.** La banda de cifras es lo más
 *     visible de la página; un número que no está en el corpus que el dueño
 *     aprobó es un número inventado. Se busca en cifras o en letras
 *     («seis meses»), que es como escribe el corpus.
 *  3. **Minimalismo medido.** El dueño lo pidió «minimalista y elegante»: un
 *     capítulo que crece hasta ser un ensayo pasa el esquema y rompe la página.
 *  4. **Paridad ES/EN.** Mismas cifras con los mismos valores, mismo número de
 *     capítulos: un idioma no cuenta un caso distinto del otro.
 */

type Proyecto = Cv["proyectos"][number];
type Caso = NonNullable<Proyecto["casestudy"]>;

const es = getCv("es");
const en = getCv("en");
const conCaso = (cv: Cv) => cv.proyectos.filter((p) => p.casestudy);
const palabras = (t: string) => t.split(/\s+/).filter(Boolean).length;

/** Los que el inglés de los logros escribe en letras («ten months in use»). */
const NUMEROS_EN = new Map(
  Object.entries({
    one: 1,
    two: 2,
    three: 3,
    four: 4,
    five: 5,
    six: 6,
    seven: 7,
    eight: 8,
    nine: 9,
    ten: 10,
    eleven: 11,
    twelve: 12,
    twenty: 20,
  }),
);

/** Las cifras de un texto, en dígitos o en letras, como número. */
function numerosDelTexto(
  bruto: string,
  enLetras: Map<string, number> = NUMEROS_ES,
): Set<number> {
  const texto = normalizar(bruto);
  const numeros = new Set<number>();
  // «1.000», «1,000» y «120» → 1000, 1000 y 120: el separador de miles primero.
  for (const m of texto.matchAll(/\d{1,3}(?:[.,]\d{3})+|\d+/g)) {
    numeros.add(Number(m[0].replace(/[.,]/g, "")));
  }
  for (const [palabra, valor] of enLetras) {
    if (new RegExp(`\\b${palabra}\\b`).test(texto)) numeros.add(valor);
  }
  return numeros;
}

const numerosDelDocumento = (md: string) => numerosDelTexto(md);

/**
 * Las cifras de UN caso que los logros de su hito no dicen — puro, para verlo
 * fallar. El PDF no lista los casos (cuenta cada experiencia una vez, ver
 * `generate-cv-pdf.mjs`): lo que el caso destaca y su hito calla, el PDF lo
 * deja por fuera.
 */
export function cifrasFueraDeSuHito(
  slug: string,
  caso: Caso,
  logros: string[],
  locale: "es" | "en",
): string[] {
  const numeros = numerosDelTexto(
    logros.join(" "),
    locale === "es" ? NUMEROS_ES : NUMEROS_EN,
  );
  return caso.cifras
    .filter((c) => !numeros.has(c.valor))
    .map(
      (c) =>
        `${slug} (${locale}): la cifra ${c.prefijo}${c.valor}${c.sufijo} «${c.etiqueta}» no está ` +
        `en los logros de su experiencia (data/cv.${locale}.yaml, trayectoria), así que el PDF ` +
        `la deja por fuera.`,
    );
}

/** Los problemas de UN caso contra su documento — puro, para poder verlo fallar. */
export function cifrasSinFuente(
  slug: string,
  caso: Caso,
  md: string,
): string[] {
  const numeros = numerosDelDocumento(md);
  return caso.cifras
    .filter((c) => !numeros.has(c.valor))
    .map(
      (c) =>
        `${slug}: la cifra ${c.prefijo}${c.valor}${c.sufijo} «${c.etiqueta}» no aparece en ` +
        `data/a-fondo/${slug}.es.md — una cifra que el corpus aprobado no dice es una cifra inventada.`,
    );
}

/** Los límites que hacen minimalista a un caso. */
export const LIMITES = {
  titular: 40,
  capituloTitulo: 8,
  capituloTexto: 70,
  cifraEtiqueta: 9,
  leccion: 45,
} as const;

export function excesos(slug: string, caso: Caso): string[] {
  const fuera: string[] = [];
  if (palabras(caso.titular) > LIMITES.titular)
    fuera.push(
      `${slug}: el titular tiene ${palabras(caso.titular)} palabras (máx. ${LIMITES.titular})`,
    );
  if (palabras(caso.leccion) > LIMITES.leccion)
    fuera.push(
      `${slug}: la lección tiene ${palabras(caso.leccion)} palabras (máx. ${LIMITES.leccion})`,
    );
  caso.capitulos.forEach((c, i) => {
    if (palabras(c.titulo) > LIMITES.capituloTitulo)
      fuera.push(
        `${slug} · capítulo ${i + 1}: título de ${palabras(c.titulo)} palabras (máx. ${LIMITES.capituloTitulo})`,
      );
    if (palabras(c.texto) > LIMITES.capituloTexto)
      fuera.push(
        `${slug} · capítulo ${i + 1}: texto de ${palabras(c.texto)} palabras (máx. ${LIMITES.capituloTexto})`,
      );
  });
  caso.cifras.forEach((c) => {
    if (palabras(c.etiqueta) > LIMITES.cifraEtiqueta)
      fuera.push(
        `${slug}: la etiqueta «${c.etiqueta}» tiene ${palabras(c.etiqueta)} palabras (máx. ${LIMITES.cifraEtiqueta})`,
      );
  });
  return fuera;
}

describe("los casos de estudio", () => {
  it("hay casos que vigilar (si no, estos gates no vigilan nada)", () => {
    expect(conCaso(es).length).toBeGreaterThan(0);
  });

  it("cada hito de la trayectoria tiene su caso de estudio", () => {
    const sinCaso = es.trayectoria
      .filter((h) => !h.proyecto)
      .map((h) => `${h.periodo} · ${h.rol} · ${h.organizacion}`);
    expect(
      sinCaso,
      `Hitos sin caso de estudio (el dueño los pidió el 2026-09-13):\n${sinCaso.join("\n")}`,
    ).toEqual([]);
  });

  it("cada cifra de un caso sale de su documento a fondo", () => {
    const problemas: string[] = [];
    for (const p of conCaso(es)) {
      const archivo = `data/a-fondo/${p.slug}.es.md`;
      if (!existsSync(archivo)) {
        problemas.push(
          `${p.slug}: no existe ${archivo}, así que sus cifras no tienen fuente`,
        );
        continue;
      }
      problemas.push(
        ...cifrasSinFuente(p.slug, p.casestudy!, readFileSync(archivo, "utf8")),
      );
    }
    expect(problemas.join("\n")).toBe("");
  });

  // «Que no deje por fuera ninguna de mis experiencias y logros más
  // importantes» (el dueño, 2026-09-24, sobre el PDF). Las cifras de la banda
  // son, por definición, lo más importante de cada caso; el PDF solo tiene los
  // logros de la trayectoria. Nació en rojo: las 120 máquinas de Inglopres, las
  // cinco fuentes de C&M Consorcio y, en inglés, los diez meses de TransMilenio.
  it("cada cifra de un caso está también en los logros de su experiencia (ES y EN)", () => {
    const problemas: string[] = [];
    for (const [locale, cv] of [
      ["es", es],
      ["en", en],
    ] as const) {
      for (const hito of cv.trayectoria) {
        const p = cv.proyectos.find((x) => x.slug === hito.proyecto);
        if (!p?.casestudy) continue;
        problemas.push(
          ...cifrasFueraDeSuHito(p.slug, p.casestudy, hito.bullets, locale),
        );
      }
    }
    expect(problemas.join("\n")).toBe("");
  });

  it("cada caso cabe en una página minimalista (ES y EN)", () => {
    const fuera = [...conCaso(es), ...conCaso(en)].flatMap((p) =>
      excesos(p.slug, p.casestudy!),
    );
    expect(fuera.join("\n")).toBe("");
  });

  it("ES y EN cuentan el mismo caso: mismos valores y mismo número de capítulos", () => {
    const enPorSlug = new Map(conCaso(en).map((p) => [p.slug, p.casestudy!]));
    for (const p of conCaso(es)) {
      const gemelo = enPorSlug.get(p.slug);
      expect(gemelo, `${p.slug} no tiene caso en inglés`).toBeDefined();
      expect(
        gemelo!.cifras.map((c) => c.valor),
        p.slug,
      ).toEqual(p.casestudy!.cifras.map((c) => c.valor));
      expect(gemelo!.capitulos.length, p.slug).toBe(
        p.casestudy!.capitulos.length,
      );
      expect(gemelo!.impacto.length, p.slug).toBe(p.casestudy!.impacto.length);
    }
  });
});

describe("los motores del gate, uno a uno (sus rojos)", () => {
  const base: Caso = {
    titular: "Una tesis corta.",
    contexto: "Contexto.",
    reto: "Reto.",
    cifras: [
      {
        valor: 120,
        prefijo: "",
        sufijo: "",
        decimales: 0,
        etiqueta: "unidades",
      },
      { valor: 6, prefijo: "", sufijo: "", decimales: 0, etiqueta: "meses" },
      {
        valor: 95,
        prefijo: "",
        sufijo: "%",
        decimales: 0,
        etiqueta: "satisfacción",
      },
    ],
    capitulos: [
      { titulo: "Uno", texto: "Texto." },
      { titulo: "Dos", texto: "Texto." },
      { titulo: "Tres", texto: "Texto." },
    ],
    impacto: ["Algo."],
    leccion: "Una frase.",
  };
  const doc =
    "Un parque de 120 unidades, seis meses de pruebas y un 95 % de satisfacción.";

  it("una cifra en dígitos o en letras cuenta como fuente", () => {
    expect(cifrasSinFuente("x", base, doc)).toEqual([]);
  });

  it("una cifra que el documento no dice se nombra con su etiqueta", () => {
    const inventada = {
      ...base,
      cifras: [...base.cifras.slice(0, 2), { ...base.cifras[2], valor: 97 }],
    };
    const problemas = cifrasSinFuente("x", inventada, doc);
    expect(problemas).toHaveLength(1);
    expect(problemas[0]).toContain("97%");
    expect(problemas[0]).toContain("satisfacción");
  });

  it("un número con separador de miles se lee entero", () => {
    const miles = {
      ...base,
      cifras: [{ ...base.cifras[0], valor: 1000 }, ...base.cifras.slice(1)],
    };
    expect(cifrasSinFuente("x", miles, `1.000 eventos, ${doc}`)).toEqual([]);
  });

  it("una cifra del caso que los logros del hito callan se nombra; en letras cuenta, en los dos idiomas", () => {
    const logrosEs = [
      "Un parque de unas 120 unidades.",
      "Seis meses de pruebas.",
    ];
    const faltan = cifrasFueraDeSuHito("x", base, logrosEs, "es");
    expect(faltan).toHaveLength(1);
    expect(faltan[0]).toContain("95%");
    expect(faltan[0]).toContain("el PDF");
    expect(
      cifrasFueraDeSuHito(
        "x",
        base,
        ["A fleet of 120 units, six months of testing, 95% satisfaction."],
        "en",
      ),
    ).toEqual([]);
  });

  it("un capítulo que crece hasta ser un ensayo se nombra", () => {
    const largo = {
      ...base,
      capitulos: [
        { titulo: "Uno", texto: "palabra ".repeat(LIMITES.capituloTexto + 1) },
        ...base.capitulos.slice(1),
      ],
    };
    expect(excesos("x", largo).join("\n")).toContain("capítulo 1: texto de");
    expect(excesos("x", base)).toEqual([]);
  });
});

describe("la navegación entre casos", () => {
  it("el nombre corto es el «dónde» del nombre, igual que el chip del chat", () => {
    for (const p of [...es.proyectos, ...en.proyectos]) {
      expect(nombreCortoDeProyecto(p.nombre), p.slug).toBe(
        nombreCortoMjs(p.nombre),
      );
    }
    expect(
      nombreCortoDeProyecto(
        "Plataforma de datos para agentes de IA — Vesting (2023–2025)",
      ),
    ).toBe("Vesting");
  });

  it("los vecinos siguen el orden de la trayectoria; los extremos no tienen del otro lado", () => {
    const orden = es.trayectoria
      .map((h) => h.proyecto)
      .filter(Boolean) as string[];
    const primero = vecinosDeCaso(es, orden[0]);
    expect(primero.anterior).toBeUndefined();
    expect(primero.siguiente?.slug).toBe(orden[1]);
    const ultimo = vecinosDeCaso(es, orden[orden.length - 1]);
    expect(ultimo.siguiente).toBeUndefined();
    expect(ultimo.anterior?.slug).toBe(orden[orden.length - 2]);
  });
});
