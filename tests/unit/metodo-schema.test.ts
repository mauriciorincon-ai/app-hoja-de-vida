// @vitest-environment node
import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";
import { parse } from "yaml";
import {
  BLOQUES,
  bloqueDe,
  cifrasDe,
  corpusNombrado,
  parsePieza,
  type PiezaMetodo,
} from "@/lib/metodo/schema";

/**
 * «MÉTODOS» — el esquema de una publicación (S10). Cada `it` con rojo es la
 * demo de la regla 15: una pieza deliberadamente rota que el esquema debe
 * rechazar NOMBRANDO el campo y la regla, no con un «inválido» genérico.
 */

type Crudo = Record<string, unknown> & { bloques: Record<string, unknown>[] };
const EJEMPLO = "tests/fixtures/metodo/ejemplo-sintetico.yaml";
const crudo = (): Crudo => parse(readFileSync(EJEMPLO, "utf8")) as Crudo;
/** Una copia del ejemplo con una mutación. */
const con = (mutar: (c: Crudo) => void): Crudo => {
  const c = structuredClone(crudo());
  mutar(c);
  return c;
};
// `any` a propósito (regla 1): son objetos CRUDOS de YAML que cada rojo muta a mano; tiparlos
// campo a campo sería reescribir el esquema dentro del test.
const bloque = (c: Crudo, n: number) =>
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  c.bloques.find((b) => b.n === n) as Record<string, any>;
const rojo = (c: unknown, mundo?: Parameters<typeof parsePieza>[2]) => () =>
  parsePieza(c, "data/metodo/ejemplo-sintetico.yaml", mundo);

describe("el esquema acepta la pieza completa", () => {
  const pieza = parsePieza(crudo(), EJEMPLO);

  it("trae los diez bloques en orden, del 1 al 10", () => {
    expect(pieza.bloques.map((b) => b.n)).toEqual([
      1, 2, 3, 4, 5, 6, 7, 8, 9, 10,
    ]);
    expect(BLOQUES).toHaveLength(10);
  });

  it("las fechas YAML llegan como texto YYYY-MM-DD, no como Date", () => {
    const b10 = bloqueDe(pieza, 10);
    expect(b10.revisado).toBe("2026-10-17");
    expect(typeof b10.fuentes[0].fecha).toBe("string");
  });

  it("nombra los slugs del corpus que la pieza usa", () => {
    expect(corpusNombrado(pieza).sort()).toEqual(["como-trabajo", "vesting"]);
  });

  it("`bloqueDe` devuelve el bloque pedido, tipado", () => {
    expect(bloqueDe(pieza, 1).respuesta).toHaveLength(3);
    expect(() => bloqueDe({ ...pieza, bloques: [] } as PiezaMetodo, 3)).toThrow(
      /no tiene el bloque 3/,
    );
  });
});

describe("ROJO · los diez bloques son fijos", () => {
  it("una pieza con 9 bloques rompe y dice CUÁL falta", () => {
    const c = con((x) => (x.bloques = x.bloques.filter((b) => b.n !== 7)));
    expect(rojo(c)).toThrowError(/bloques: .*faltan: 7 \(metricas\)/);
  });

  it("dos bloques que faltan se nombran juntos, en una sola pasada", () => {
    const c = con(
      (x) => (x.bloques = x.bloques.filter((b) => b.n !== 3 && b.n !== 9)),
    );
    expect(rojo(c)).toThrowError(/faltan: 3 \(fases\), 9 \(limites\)/);
  });

  it("un bloque fuera de orden rompe nombrando la posición", () => {
    const c = con((x) => {
      const [a, b] = [x.bloques[2], x.bloques[3]];
      x.bloques[2] = b;
      x.bloques[3] = a;
    });
    expect(rojo(c)).toThrowError(
      /bloques\.2\.n: el bloque en la posición 3 debe ser el 3 \(fases\), no el 4/,
    );
  });

  it("un bloque que no existe (el 11) rompe", () => {
    const c = con((x) => x.bloques.push({ n: 11 }));
    expect(rojo(c)).toThrow(
      /Contenido inválido en data\/metodo\/ejemplo-sintetico\.yaml/,
    );
  });

  it("la respuesta del bloque 1 es de tres líneas, ni dos ni cuatro", () => {
    const dos = con(
      (x) => (bloque(x, 1).respuesta = bloque(x, 1).respuesta.slice(0, 2)),
    );
    expect(rojo(dos)).toThrowError(/respuesta: la síntesis es de tres líneas/);
  });
});

describe("ROJO · toda fuente trae título, editor, fecha y enlace", () => {
  it("una fuente SIN fecha rompe nombrando la fuente y el campo", () => {
    const c = con((x) => delete bloque(x, 10).fuentes[1].fecha);
    expect(rojo(c)).toThrowError(/bloques\.9\.fuentes\.1\.fecha/);
  });

  it("una fecha mal escrita (2026-10) rompe: va como YYYY-MM-DD", () => {
    const c = con((x) => (bloque(x, 10).fuentes[0].fecha = "2026-10"));
    expect(rojo(c)).toThrowError(
      /fuentes\.0\.fecha: la fecha va como YYYY-MM-DD/,
    );
  });

  it("una fecha imposible (2026-02-31) rompe: no es una fecha real", () => {
    const c = con((x) => (bloque(x, 10).fuentes[0].fecha = "2026-02-31"));
    expect(rojo(c)).toThrowError(/fuentes\.0\.fecha: no es una fecha real/);
  });

  it("una fuente sin editor o sin enlace rompe", () => {
    expect(
      rojo(con((x) => delete bloque(x, 10).fuentes[0].editor)),
    ).toThrowError(/fuentes\.0\.editor/);
    expect(rojo(con((x) => delete bloque(x, 10).fuentes[0].url))).toThrowError(
      /fuentes\.0\.url/,
    );
    expect(
      rojo(
        con((x) => (bloque(x, 10).fuentes[0].url = "http://insegura.example")),
      ),
    ).toThrowError(/con https:\/\//);
  });

  it("una fuente más nueva que la revisión de la pieza rompe: no se cita el futuro", () => {
    const c = con((x) => (bloque(x, 10).revisado = "2026-08-01"));
    expect(rojo(c)).toThrowError(
      /posterior a la revisión de la pieza \(2026-08-01\)/,
    );
  });

  it("las fuentes se numeran 1…n en orden", () => {
    const c = con((x) => (bloque(x, 10).fuentes[1].id = 7));
    expect(rojo(c)).toThrowError(/esta es la 7 en la posición 2/);
  });

  it("una fuente que ningún bloque cita rompe: una fuente sin uso es ruido", () => {
    const c = con((x) =>
      bloque(x, 10).fuentes.push({
        id: 4,
        titulo: "Huérfana",
        editor: "Ed",
        fecha: "2026-09-01",
        url: "https://example.org/h",
      }),
    );
    expect(rojo(c)).toThrowError(
      /la fuente 4 \(«Huérfana»\) no la cita ningún bloque/,
    );
  });

  it("citar una fuente que no existe rompe nombrando el bloque que la cita", () => {
    const c = con((x) => (bloque(x, 5).elementos[0].fuentes = [9]));
    expect(rojo(c)).toThrowError(
      /bloques\.4\.elementos\.0\.fuentes: cita la fuente 9, que no está en el bloque 10/,
    );
  });

  it("un elemento de frontera (bloque 5) sin fuente no entra", () => {
    const c = con((x) => (bloque(x, 5).elementos[1].fuentes = []));
    expect(rojo(c)).toThrowError(
      /elementos\.1\.fuentes: un elemento de frontera sin fuente no entra/,
    );
  });
});

describe("ROJO · las tres voces no se mezclan y nada se inventa", () => {
  it("lo que el campo hace, sin fuente, no entra", () => {
    const c = con((x) => (bloque(x, 4).decisiones[1].porQue.fuentes = []));
    expect(rojo(c)).toThrowError(
      /porQue\.fuentes: lo que el campo hace lleva su fuente numerada/,
    );
  });

  it("lo que hice, sin slug del corpus, no entra", () => {
    const c = con((x) => (bloque(x, 3).fases[1].nota.corpus = []));
    expect(rojo(c)).toThrowError(
      /nota\.corpus: lo que hice sale del corpus del sitio/,
    );
  });

  it("una posición con fuente es un hecho disfrazado: rompe", () => {
    const c = con((x) => (bloque(x, 4).decisiones[0].porQue.fuentes = [1]));
    expect(rojo(c)).toThrowError(
      /porQue\.voz: una posición no se disfraza de hecho/,
    );
  });

  it("una fuente no respalda lo que hice, ni el corpus lo que hace el campo", () => {
    expect(
      rojo(con((x) => (bloque(x, 3).fases[1].nota.fuentes = [1]))),
    ).toThrowError(/una fuente respalda lo que hace el campo/);
    expect(
      rojo(
        con((x) => (bloque(x, 4).decisiones[1].porQue.corpus = ["vesting"])),
      ),
    ).toThrowError(/el corpus respalda lo que hice/);
  });

  it("la evidencia del bloque 8 sin corpus no entra", () => {
    const c = con((x) => (bloque(x, 8).evidencia[0].corpus = []));
    expect(rojo(c)).toThrowError(
      /evidencia\.0\.corpus: la evidencia sale del corpus/,
    );
  });

  it("un documento del corpus que no existe en disco rompe, nombrándolo", () => {
    const mundo = { corpus: new Set(["vesting"]) };
    expect(rojo(crudo(), mundo)).toThrowError(
      /corpus: «como-trabajo» no es un documento de data\/a-fondo\//,
    );
    expect(() =>
      parsePieza(crudo(), EJEMPLO, {
        corpus: new Set(["vesting", "como-trabajo"]),
      }),
    ).not.toThrow();
  });

  it("el nivel de una herramienta es uno de los cuatro del corpus: no se inventa otro", () => {
    const c = con((x) => (bloque(x, 8).evidencia[0].nivel = "experto"));
    expect(rojo(c)).toThrowError(/evidencia\.0\.nivel/);
  });

  it("la evidencia enlaza solo a rutas del sitio, no a URLs externas", () => {
    const c = con(
      (x) => (bloque(x, 8).evidencia[0].href = "https://example.org/x"),
    );
    expect(rojo(c)).toThrowError(
      /evidencia\.0\.href: una ruta interna del sitio/,
    );
  });
});

describe("ROJO · el mapa es coherente", () => {
  it("una arista a un nodo que no existe rompe", () => {
    const c = con((x) => (bloque(x, 2).aristas[0].a = 99));
    expect(rojo(c)).toThrowError(
      /aristas\.0\.a: la arista llega al nodo 99, que no existe/,
    );
  });

  it("dos nodos en la misma celda rompen: se taparían", () => {
    const c = con((x) =>
      Object.assign(bloque(x, 2).nodos[3], { col: 2, fila: 0 }),
    );
    expect(rojo(c)).toThrowError(
      /el nodo 4 cae en la misma celda \(col 2, fila 0\) que el 3/,
    );
  });

  it("los nodos se numeran 1…n en orden", () => {
    const c = con((x) => (bloque(x, 2).nodos[2].n = 9));
    expect(rojo(c)).toThrowError(
      /nodos\.2\.n: los nodos se numeran 1…7 en orden/,
    );
  });

  it("una arista de un nodo a sí mismo no dice nada", () => {
    const c = con((x) =>
      Object.assign(bloque(x, 2).aristas[0], { de: 2, a: 2 }),
    );
    expect(rojo(c)).toThrowError(/del nodo 2 a sí mismo no dice nada/);
  });

  it("el tipo de nodo es uno de los cinco con palabra: no hay un sexto color suelto", () => {
    const c = con((x) => (bloque(x, 2).nodos[0].tipo = "decorativo"));
    expect(rojo(c)).toThrowError(/nodos\.0\.tipo/);
  });
});

describe("ROJO · paridad y limpieza del texto", () => {
  it("un texto sin su versión en inglés rompe nombrando el campo", () => {
    const c = con((x) => delete bloque(x, 1).pregunta.en);
    expect(rojo(c)).toThrowError(/bloques\.0\.pregunta\.en/);
  });

  it("un texto vacío en un idioma rompe", () => {
    const c = con((x) => (bloque(x, 6).fallas[0].senal.es = "   "));
    expect(rojo(c)).toThrowError(/fallas\.0\.senal\.es/);
  });

  it("un [CONFIRMAR] dentro de la pieza rompe: va en el cierre, nunca aquí", () => {
    const c = con(
      (x) =>
        (bloque(x, 9).limites[1].texto.en =
          "Something [CONFIRMAR: ask the owner]."),
    );
    expect(rojo(c)).toThrowError(
      /limites\.1\.texto\.en: un \[CONFIRMAR\] va en el cierre/,
    );
  });

  it("un campo que el esquema no conoce rompe (strict): nada se cuela", () => {
    const c = con((x) => (x.extra = "sorpresa"));
    expect(rojo(c)).toThrow(/extra/);
  });

  it("el id es T1…T9 y el slug es kebab-case", () => {
    expect(rojo(con((x) => (x.id = "T10")))).toThrowError(/id: el id es T1…T9/);
    expect(rojo(con((x) => (x.slug = "Sistema de Agentes")))).toThrowError(
      /slug/,
    );
  });

  it("junta TODOS los problemas de una pasada, no de a uno por build", () => {
    const c = con((x) => {
      x.bloques = x.bloques.filter((b) => b.n !== 7);
      x.id = "X";
    });
    try {
      parsePieza(c, "data/metodo/x.yaml");
      expect.unreachable();
    } catch (e) {
      const m = (e as Error).message;
      expect(m).toMatch(/id:/);
      expect(m).toMatch(/faltan: 7/);
    }
  });
});

describe("ROJO · las cifras gemelas: una traducción no cambia un número", () => {
  it("cifrasDe quita el formato: 99,5 % y 99.5%, 1.405 y 1,405 son la misma cifra", () => {
    expect(cifrasDe("el 99,5 % de 1.405 obras")).toEqual(
      cifrasDe("99.5% of 1,405 works"),
    );
    expect(cifrasDe("sin cifras")).toEqual([]);
    // El punto final de una frase no es un separador.
    expect(cifrasDe("son 27.")).toEqual(["27"]);
  });

  it("una cifra distinta en inglés rompe nombrando el texto y las dos cifras", () => {
    const c = con(
      (x) =>
        (bloque(x, 7).metricas[1].umbral.en =
          "Example threshold: fewer than 2 in 10."),
    );
    expect(rojo(c)).toThrowError(
      /bloques\.6\.metricas\.1\.umbral: las cifras de ES y EN no coinciden \(es: 1, 10 · en: 10, 2\)/,
    );
  });

  it("una cifra que falta en un idioma rompe", () => {
    const c = con(
      (x) =>
        (bloque(x, 7).metricas[0].umbral.es = "Umbral de ejemplo: el tope."),
    );
    expect(rojo(c)).toThrowError(/umbral: las cifras de ES y EN no coinciden/);
  });

  it("el formato distinto del mismo número NO es un rojo", () => {
    const c = con((x) => {
      bloque(x, 7).metricas[0].umbral.es = "Umbral de ejemplo: 99,5 %.";
      bloque(x, 7).metricas[0].umbral.en = "Example threshold: 99.5%.";
    });
    expect(rojo(c)).not.toThrow();
  });
});

describe("ROJO · Foundry: la primera mención lleva su nombre completo", () => {
  /** El ejemplo con una frase de Foundry en la decisión 1 del bloque 4. */
  const conFoundry = (es: string, en: string) =>
    con((x) => {
      bloque(x, 4).decisiones[0].cuandoSi.es = es;
      bloque(x, 4).decisiones[0].cuandoSi.en = en;
    });

  it("la primera mención como «Microsoft Foundry» a secas rompe", () => {
    const c = conFoundry(
      "Se aloja en Microsoft Foundry.",
      "It is hosted in Microsoft Foundry.",
    );
    expect(rojo(c)).toThrowError(
      /decisiones\.0\.cuandoSi\.es: la primera mención de Foundry en la pieza lleva su nombre completo, «Microsoft Foundry \(antes Azure AI Foundry\)»/,
    );
    expect(rojo(c)).toThrowError(
      /decisiones\.0\.cuandoSi\.en: .*«Microsoft Foundry \(formerly Azure AI Foundry\)»/,
    );
  });

  it("con el nombre completo la primera vez, pasa; y después va «Microsoft Foundry» a secas", () => {
    const c = con((x) => {
      bloque(x, 4).decisiones[0].cuandoSi.es =
        "Se aloja en Microsoft Foundry (antes Azure AI Foundry).";
      bloque(x, 4).decisiones[0].cuandoSi.en =
        "It is hosted in Microsoft Foundry (formerly Azure AI Foundry).";
      bloque(x, 4).decisiones[1].cuandoSi.es = "Y sigue en Microsoft Foundry.";
      bloque(x, 4).decisiones[1].cuandoSi.en = "And it stays in Microsoft Foundry.";
    });
    expect(rojo(c)).not.toThrow();
  });

  it("una mención suelta ANTES de la que lleva el nombre completo rompe", () => {
    const c = con((x) => {
      bloque(x, 3).fases[0].decide.es = "Foundry decide el alojamiento.";
      bloque(x, 3).fases[0].decide.en = "Foundry decides the hosting.";
      bloque(x, 4).decisiones[0].cuandoSi.es =
        "Se aloja en Microsoft Foundry (antes Azure AI Foundry).";
      bloque(x, 4).decisiones[0].cuandoSi.en =
        "It is hosted in Microsoft Foundry (formerly Azure AI Foundry).";
    });
    expect(rojo(c)).toThrowError(/fases\.0\.decide\.es: la primera mención de Foundry/);
  });

  it("el título de una fuente que dice Foundry no cuenta: es el título de la fuente", () => {
    const c = con((x) => {
      bloque(x, 10).fuentes[0].titulo = "Hosted agents in Microsoft Foundry";
    });
    expect(rojo(c)).not.toThrow();
  });

  it("una pieza que no habla de Foundry no tiene nada que nombrar", () => {
    expect(rojo(crudo())).not.toThrow();
  });
});
