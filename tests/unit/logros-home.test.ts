import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";
import { parse } from "yaml";
import { getCv } from "@/lib/content";
import { getFrentes } from "@/lib/vitrina/categorias";
import { getPiezas } from "@/lib/vitrina/piezas";

/**
 * LOS DOCE LOGROS DE LA HOME Y LOS CUATRO BULLETS DE LA TRAYECTORIA (S29, OM-03).
 *
 * El dueño aprobó doce logros (2026-10-31, «1a 2a» y su orden) y cuatro bullets de la trayectoria. Su
 * redacción vive en la planeadora (`referencias-ui/home/logros/aprobado.md`) y se copió por script, textual;
 * aquí se vigila lo que la app puede vigilar sin leer la casa ajena: la CUENTA, el ORDEN por filas, que el
 * total de agentes se mida y no se escriba, y que los bullets nuevos estén.
 */

const LOCALES = ["es", "en"] as const;
type Crudo = {
  logros: Record<string, unknown>[];
  trayectoria: { organizacion: string; bullets?: string[] }[];
};
const crudo = (l: (typeof LOCALES)[number]) =>
  parse(readFileSync(`data/cv.${l}.yaml`, "utf8")) as Crudo;

describe("los doce logros", () => {
  for (const l of LOCALES) {
    it(`cv.${l}: son doce (tres filas de cuatro), con etiquetas distintas`, () => {
      const logros = getCv(l).logros;
      expect(logros).toHaveLength(12);
      expect(logros.length % 4, "tres filas completas de cuatro").toBe(0);
      expect(new Set(logros.map((x) => x.etiqueta)).size).toBe(12);
    });

    it(`cv.${l}: el primero se calcula desde una fecha, y el logro de las 3 certificaciones ya no está`, () => {
      const c = crudo(l);
      expect(c.logros[0]!.desde).toMatch(/^\d{4}-\d{2}$/);
      expect(c.logros[0]!.valor).toBeUndefined();
      // La sección de certificaciones no cambia; el logro que la repetía, sí salió.
      expect(
        c.logros.some((x) =>
          /certificaciones|certifications/i.test(String(x.etiqueta)),
        ),
      ).toBe(false);
    });

    it(`cv.${l}: el total de agentes se MIDE (contar), y es el de la puerta de la home`, () => {
      const c = crudo(l);
      const agentes = c.logros.filter((x) => x.contar === "agentes");
      expect(agentes, "exactamente un logro cuenta agentes").toHaveLength(1);
      expect(
        agentes[0]!.valor,
        "escrito a mano caducaría en días",
      ).toBeUndefined();
      const puerta = getFrentes().find((f) => f.id === "agentes")!.piezas;
      const resuelto = getCv(l).logros.find(
        (x) => x.etiqueta === agentes[0]!.etiqueta,
      );
      expect(resuelto?.valor).toBe(puerta);
      expect(puerta).toBeGreaterThan(0);
    });
  }

  it("ES y EN dicen lo mismo, logro por logro: misma cifra, mismo prefijo y mismo sufijo", () => {
    const es = crudo("es").logros;
    const en = crudo("en").logros;
    const cifra = (x: Record<string, unknown>) => ({
      valor: x.valor,
      desde: x.desde,
      contar: x.contar,
      prefijo: x.prefijo,
      sufijo: x.sufijo,
    });
    expect(en.map(cifra)).toEqual(es.map(cifra));
  });

  it("el orden por filas: 1 escala y liderazgo · 2 IA · 3 impacto en datos", () => {
    // Fila 1: años de trayectoria, el mayor equipo, productos en Power BI y usuarios (escala y liderazgo);
    // fila 2: 27 agentes de Vesting, los propios (medidos), ARKHÉ y la precisión de los modelos (IA);
    // fila 3: 70 % · ~60 % · −35 % · +25 % (impacto en datos).
    const claves = getCv("es").logros.map(
      (x) => `${x.prefijo}${x.valor}${x.sufijo}`,
    );
    const anios = getCv("es").logros[0]!.valor;
    const agentes = getFrentes().find((f) => f.id === "agentes")!.piezas;
    expect(claves).toEqual([
      `${anios}`,
      "20",
      "45+",
      "170+",
      "27",
      `${agentes}`,
      "52%",
      ">90%",
      "70%",
      "~60%",
      "−35%",
      "+25%",
    ]);
  });

  it("los totales son sumas de lo que sus descripciones nombran (45+ = 25+10+5+5 · 170+ = 75+50+25+20 · 60+ = 50+10)", () => {
    const logros = getCv("es").logros;
    const productos = logros.find((x) => x.valor === 45)!;
    const usuarios = logros.find((x) => x.valor === 170)!;
    const indicadores = logros.find(
      (x) => x.valor === 25 && x.prefijo === "+",
    )!;
    expect(productos.descripcion).toMatch(/25\+.*10\+.*5\+.*5\+/);
    expect(usuarios.descripcion).toMatch(/75.*50\+.*25\+.*20/);
    expect(indicadores.descripcion).toMatch(/60\+.*50\+.*10\+/);
    expect(25 + 10 + 5 + 5).toBe(45);
    expect(75 + 50 + 25 + 20).toBe(170);
    expect(50 + 10).toBe(60);
  });
});

describe("los cuatro bullets nuevos de la trayectoria", () => {
  const esperados = {
    es: {
      "Fundación CTIC":
        "50+ indicadores intervenidos y cerca de 60 % menos esfuerzo",
      "Banco Pichincha":
        "5+ productos analíticos en Power BI adoptados por 50+ usuarios, 10+ indicadores intervenidos",
      "C&M Consultores":
        "10+ productos analíticos y +35% de eficiencia con 25+ usuarios clave",
      Vesting:
        "Tableros en Power BI: 5+ productos analíticos, con unos 20 usuarios.",
    },
    en: {
      "Fundación CTIC": "50+ indicators addressed and close to 60% less effort",
      "Banco Pichincha":
        "5+ analytics products in Power BI adopted by 50+ users, 10+ indicators addressed",
      "C&M Consultores":
        "10+ analytics products and +35% efficiency with 25+ key users",
      Vesting:
        "Power BI dashboards: 5+ analytics products, with about 20 users.",
    },
  } as const;

  for (const l of LOCALES)
    for (const [empresa, texto] of Object.entries(esperados[l])) {
      it(`cv.${l} · ${empresa}: lleva su bullet aprobado`, () => {
        const hito = crudo(l).trayectoria.find((t) =>
          t.organizacion.startsWith(empresa),
        );
        expect(hito, `sin hito de ${empresa}`).toBeDefined();
        expect(hito!.bullets?.some((b) => b.includes(texto))).toBe(true);
      });
    }

  it("Vesting pasó de cuatro a cinco bullets, en los dos idiomas", () => {
    for (const l of LOCALES) {
      const v = crudo(l).trayectoria.find((t) =>
        t.organizacion.startsWith("Vesting"),
      );
      expect(v?.bullets).toHaveLength(5);
    }
  });
});

describe("el «cinco sellados» del logro de agentes se vigila (S29, M4)", () => {
  // La cuenta del total se mide; la de las selladas la escribió el dueño en palabras. Hoy es cierta:
  // la regla dura 2 pide que un conteo de estado se mida, no que se escriba y envejezca.
  const PALABRAS = {
    es: {
      uno: 1,
      dos: 2,
      tres: 3,
      cuatro: 4,
      cinco: 5,
      seis: 6,
      siete: 7,
      ocho: 8,
      nueve: 9,
      diez: 10,
      once: 11,
    },
    en: {
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
    },
  } as const;
  const PATRON = {
    es: /\b(\w+) sellad[oa]s?\b/i,
    en: /\b(\w+) sealed\b/i,
  } as const;

  /** El número que el texto dice antes de «sellados» / «sealed», o null si no dice ninguno. */
  function selladosDichos(texto: string, l: "es" | "en"): number | null {
    const palabra = PATRON[l].exec(texto)?.[1]?.toLowerCase();
    return palabra && palabra in PALABRAS[l]
      ? PALABRAS[l][palabra as keyof (typeof PALABRAS)[typeof l]]
      : null;
  }

  for (const l of LOCALES) {
    it(`cv.${l}: lo que el logro dice de selladas es lo que hay en content/agentes`, () => {
      const logro = crudo(l).logros.find((x) => x.contar === "agentes");
      const dichos = selladosDichos(String(logro?.descripcion), l);
      expect(
        dichos,
        "el logro ya no dice cuántos están sellados",
      ).not.toBeNull();
      const selladas = getPiezas("agentes").filter(
        (f) => f.pieza.estado === "sellado",
      ).length;
      expect(dichos, "selladas en disco").toBe(selladas);
    });
  }

  it("el lector del texto distingue una cuenta falsa", () => {
    expect(selladosDichos("…lo que «nunca» hace; seis sellados.", "es")).toBe(
      6,
    );
    expect(selladosDichos("…what it «never» does; five sealed.", "en")).toBe(5);
    expect(selladosDichos("sin cuenta", "es")).toBeNull();
  });
});
