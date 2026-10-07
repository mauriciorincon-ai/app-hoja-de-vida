import { readdirSync, readFileSync, statSync } from "node:fs";
import path from "node:path";
import { describe, expect, it } from "vitest";
import { parse } from "yaml";
import { getCategoriasApps } from "@/lib/content";
import {
  CATEGORIAS_APPS,
  cambiarNombre,
  conNombreOficial,
  nombreOficial,
  palabraSuelta,
  ordenDeEscaparate,
  parseCategoriasApps,
  repartirApps,
} from "@/lib/vitrina/categorias-apps";
import { getFichaTecnica } from "@/lib/vitrina/ficha-tecnica/loader";
import { getFichasVitrina, getManifestVitrina } from "@/lib/vitrina/loader";
import { nombresDeDestinos } from "../../scripts/destinos.mjs";
import { chunksDeFichas, leerFichas } from "../../scripts/fichas-al-indice.mjs";

/**
 * LAS DOS CATEGORÍAS DE LAS APPS (Sprint 009).
 *
 * El gate real es de datos: cada export de `content/vitrina/` tiene categoría.
 * Si una app futura llega sin ella, el build FALLA nombrando su slug — se
 * demuestra aquí con un export sintético, porque con el árbol real ninguna
 * regla anterior puede ponerlo en rojo (regla 14, tercera pregunta: el estado
 * que lo rompe se fabrica en el test, no en el repo).
 */

const ficha = (slug: string) => ({
  ancla: { slug },
  export: { app: { nombre: slug } },
});

const YAML = {
  profesionales: [
    { slug: "ds", nombre: "Probeta DS" },
    { slug: "fantasma", nombre: "Fantasma" },
    { slug: "velo", nombre: "Anonimizador Velo" },
  ],
  personales: [{ slug: "habla", nombre: "Habla San" }],
};

describe("el YAML real de categorías", () => {
  const categorias = getCategoriasApps();
  const fichas = getFichasVitrina();

  it("todo export de content/vitrina/ tiene categoría (si no, el build falla)", () => {
    expect(() => repartirApps(fichas, categorias)).not.toThrow();
    const reparto = repartirApps(fichas, categorias);
    const repartidas = CATEGORIAS_APPS.flatMap((c) => reparto[c]);
    expect(repartidas).toHaveLength(fichas.length);
    // Y los exports que hay en disco son los mismos que el loader vio.
    const enDisco = readdirSync("content/vitrina").filter((f) =>
      f.endsWith(".brochure-export.json"),
    );
    expect(repartidas).toHaveLength(enDisco.length);
  });

  // Estos dos tests se calculan del YAML y de los exports, no de la lista de
  // hoy: el día que llegue el export de AngelGhost, planlang, Big-D o HackGuard,
  // esas apps «aparecen solas» (promesa del manual y del ADR-028) y la CI no
  // debe ponerse roja por eso. Un gate que se activa en el camino feliz del
  // diseño es un gate mal puesto (regla 14).
  it("cada app va en la categoría que el dueño declaró, en el orden del YAML", () => {
    const reparto = repartirApps(fichas, categorias);
    for (const c of CATEGORIAS_APPS) {
      const esperado = categorias[c]
        .map((e) => e.slug)
        .filter((s) => fichas.some((f) => f.ancla.slug === s));
      expect(
        reparto[c].map((f) => f.ancla.slug),
        c,
      ).toEqual(esperado);
    }
  });

  it("la clasificación que el dueño pidió se conserva: Probeta DS, Dash Agent y Anonimizador Velo son profesionales; Habla San, Innmobiliaria y Nutrikids, personales", () => {
    const de = (c: "profesionales" | "personales") =>
      categorias[c].map((e) => e.slug);
    for (const s of ["ds", "dash-agent-ai", "anonimizador"])
      expect(de("profesionales"), s).toContain(s);
    for (const s of ["habla", "inmobiliaria", "nutri-kids"])
      expect(de("personales"), s).toContain(s);
  });

  it("AngelGhost se declara UNA sola vez, y las apps declaradas sin export se ignoran", () => {
    const todos = [...categorias.profesionales, ...categorias.personales].map(
      (e) => e.slug,
    );
    expect(todos.filter((s) => s === "copiloto-consultor")).toHaveLength(1);
    expect(new Set(todos).size).toBe(todos.length);
    const reparto = repartirApps(fichas, categorias);
    const vistos = CATEGORIAS_APPS.flatMap((c) =>
      reparto[c].map((f) => f.ancla.slug),
    );
    const sinExport = todos.filter(
      (s) => !fichas.some((f) => f.ancla.slug === s),
    );
    for (const slug of sinExport) {
      expect(vistos, `${slug} no tiene export: no aparece`).not.toContain(slug);
    }
    // Y toda app que SÍ tiene export aparece una sola vez.
    expect(new Set(vistos).size).toBe(vistos.length);
    expect(vistos.sort()).toEqual(fichas.map((f) => f.ancla.slug).sort());
  });

  it("el orden del escaparate es profesionales y después personales: el de las vecinas", () => {
    const reparto = repartirApps(fichas, categorias);
    const esperado = [...reparto.profesionales, ...reparto.personales].map(
      (f) => f.ancla.slug,
    );
    expect(
      ordenDeEscaparate(fichas, (f) => f.ancla.slug, categorias).map(
        (f) => f.ancla.slug,
      ),
    ).toEqual(esperado);
  });

  it("el YAML declara UN nombre por app: el mismo en español y en inglés", () => {
    const crudo = parse(
      readFileSync("data/categorias-apps.yaml", "utf8"),
    ) as typeof YAML;
    for (const e of [...crudo.profesionales, ...crudo.personales]) {
      expect(typeof e.nombre, e.slug).toBe("string");
    }
    expect(nombreOficial(categorias, "habla")).toBe("Habla San");
    expect(nombreOficial(categorias, "anonimizador")).toBe("Anonimizador Velo");
    expect(nombreOficial(categorias, "no-existe")).toBeUndefined();
  });
});

describe("UN solo nombre por app, en todo el sitio (ADR-028)", () => {
  const categorias = getCategoriasApps();
  const crudos = readdirSync("content/vitrina")
    .filter((f) => f.endsWith(".brochure-export.json"))
    .map(
      (f) =>
        JSON.parse(readFileSync(path.join("content/vitrina", f), "utf8")) as {
          app: { slug: string; nombre: string };
        },
    );

  // La puerta contra el desfase: el nombre que trae cada export y que el
  // oficial REEMPLAZA no puede seguir en los textos propios del sitio ni en el
  // código. Se calcula de los exports, no de una lista: el día que llegue el
  // export de otra app con otro nombre, esta puerta la vigila sola.
  const retirados = crudos
    .map((c) => ({
      slug: c.app.slug,
      viejo: c.app.nombre,
      oficial: nombreOficial(categorias, c.app.slug) ?? c.app.nombre,
    }))
    .filter((n) => n.oficial !== n.viejo);
  /** Las veces que `texto` dice el nombre viejo SIN ser el oficial («Velo» suelto, no «Anonimizador Velo»). */
  const sueltas = (texto: string, r: (typeof retirados)[number]) =>
    r.oficial.includes(r.viejo)
      ? texto.split(r.oficial).filter((p) => palabraSuelta(r.viejo).test(p))
          .length
      : (texto.match(palabraSuelta(r.viejo)) ?? []).length;

  function archivos(dir: string, out: string[] = []): string[] {
    for (const e of readdirSync(dir)) {
      const p = path.join(dir, e);
      if (statSync(p).isDirectory()) archivos(p, out);
      else if (/\.(ya?ml|md|json|tsx?|css)$/.test(e)) out.push(p);
    }
    return out;
  }

  it("el loader entrega a cada app su nombre oficial —ancla, export, manifest y ficha técnica—, y el archivo de content/ queda intacto", () => {
    for (const crudo of crudos) {
      const oficial = nombreOficial(categorias, crudo.app.slug);
      expect(oficial, crudo.app.slug).toBeDefined();
      const ficha = getFichasVitrina().find(
        (f) => f.ancla.slug === crudo.app.slug,
      );
      expect(ficha?.ancla.nombre, crudo.app.slug).toBe(oficial);
      expect(ficha?.export.app.nombre, crudo.app.slug).toBe(oficial);
      expect(
        getManifestVitrina().find((a) => a.slug === crudo.app.slug)?.nombre,
      ).toBe(oficial);
      expect(getFichaTecnica(crudo.app.slug)?.pieza.nombre).toBe(oficial);
    }
    // El archivo no se editó: sigue diciendo lo que dijo su casa.
    expect(crudos.find((c) => c.app.slug === "habla")?.app.nombre).toBe(
      "Hablemos San",
    );
  });

  it("el chat dice lo mismo: el índice de las fichas y los nombres de destino llevan el nombre oficial", () => {
    const chunks = chunksDeFichas(leerFichas());
    const texto = chunks.map((c) => `${c.titulo}\n${c.texto}`).join("\n");
    const destinos = nombresDeDestinos("es");
    for (const crudo of crudos) {
      const oficial = nombreOficial(categorias, crudo.app.slug)!;
      expect(texto, crudo.app.slug).toContain(oficial);
      expect(destinos.get(`/vitrina/apps/${crudo.app.slug}`)).toBe(oficial);
      expect(destinos.get(`/vitrina/apps/${crudo.app.slug}/detalle`)).toBe(
        oficial,
      );
    }
    for (const viejo of ["Hablemos San", "Nutri-Kids", "Dash Agent AI"]) {
      expect(texto).not.toContain(viejo);
    }
    // «Velo» solo aparece completo: «Anonimizador Velo».
    expect(texto.match(palabraSuelta("Velo"))).not.toBeNull();
    expect(
      sueltas(
        texto,
        retirados.find((r) => r.viejo === "Velo")!,
      ),
    ).toBe(0);
  });

  it("conNombreOficial cambia el nombre en cada texto, a cualquier profundidad, y nada más", () => {
    const antes = {
      app: { nombre: "Viejo", version: 2, activa: true },
      lista: ["El acceso a Viejo se pide por lista", "otra cosa"],
      anidado: { a: { b: "Viejo y Viejo" } },
      nulo: null,
    };
    expect(conNombreOficial(antes, "Nuevo")).toEqual({
      app: { nombre: "Nuevo", version: 2, activa: true },
      lista: ["El acceso a Nuevo se pide por lista", "otra cosa"],
      anidado: { a: { b: "Nuevo y Nuevo" } },
      nulo: null,
    });
    // No muta el original.
    expect(antes.app.nombre).toBe("Viejo");
  });

  it("si el oficial CONTIENE al nombre del export («Velo» en «Anonimizador Velo»), lo suelto se completa y lo que ya es el oficial no se duplica", () => {
    const antes = {
      app: { nombre: "Velo" },
      texto: "Velo no sube nada; Anonimizador Velo tampoco.",
    };
    expect(conNombreOficial(antes, "Anonimizador Velo")).toEqual({
      app: { nombre: "Anonimizador Velo" },
      texto: "Anonimizador Velo no sube nada; Anonimizador Velo tampoco.",
    });
  });

  it("solo cambia el nombre como palabra suelta: «Velocidad», «velo» y «Velo-x» quedan como están", () => {
    expect(
      cambiarNombre(
        "La Velocidad, el velo y Velo-x; pero Velo sí.",
        "Velo",
        "Anonimizador Velo",
      ),
    ).toBe("La Velocidad, el velo y Velo-x; pero Anonimizador Velo sí.");
  });

  it("hay nombres retirados que vigilar (si no, esta puerta no puede fallar)", () => {
    expect(retirados.map((r) => r.viejo).sort()).toEqual(
      ["Dash Agent AI", "Hablemos San", "Nutri-Kids", "Velo"].sort(),
    );
  });

  it("ROJO si vuelve a colarse: ningún dato, mensaje ni código propio dice el nombre del export", () => {
    const hallazgos: string[] = [];
    for (const dir of ["data", "messages", "src"]) {
      for (const archivo of archivos(dir)) {
        const texto = readFileSync(archivo, "utf8");
        for (const r of retirados) {
          if (sueltas(texto, r) > 0) {
            hallazgos.push(`${archivo}: «${r.viejo}» → «${r.oficial}»`);
          }
        }
      }
    }
    expect(hallazgos).toEqual([]);
  });
});

describe("el motor (con fixtures: aquí viven los rojos)", () => {
  const categorias = parseCategoriasApps(YAML, "fixture");

  it("ROJO: un export sin categoría rompe el build y nombra su slug", () => {
    expect(() =>
      repartirApps([ficha("ds"), ficha("zzz-nueva")], categorias),
    ).toThrow(/zzz-nueva/);
    expect(() =>
      repartirApps([ficha("ds"), ficha("zzz-nueva")], categorias),
    ).toThrow(/sin categoría/);
  });

  it("VERDE: con todos clasificados reparte en el orden del YAML, no en el de las fichas", () => {
    const r = repartirApps(
      [ficha("habla"), ficha("velo"), ficha("ds")],
      categorias,
    );
    expect(r.profesionales.map((f) => f.ancla.slug)).toEqual(["ds", "velo"]);
    expect(r.personales.map((f) => f.ancla.slug)).toEqual(["habla"]);
  });

  it("un slug declarado sin export se ignora (aparece cuando llegue su export)", () => {
    const r = repartirApps([ficha("ds")], categorias);
    expect(r.profesionales.map((f) => f.ancla.slug)).toEqual(["ds"]);
    expect(r.personales).toEqual([]);
  });

  it("ROJO: un slug en las dos categorías lo rechaza el esquema", () => {
    const repetido = {
      profesionales: [{ slug: "ds", nombre: "A" }],
      personales: [{ slug: "ds", nombre: "A" }],
    };
    expect(() => parseCategoriasApps(repetido, "fixture")).toThrow(
      /una sola categoría/,
    );
  });

  it("ROJO: un nombre oficial vacío o un slug mal formado lo rechaza el esquema", () => {
    const vacio = {
      profesionales: [{ slug: "ds", nombre: " " }],
      personales: [],
    };
    expect(() => parseCategoriasApps(vacio, "fixture")).toThrow(/nombre/);
    const mal = {
      profesionales: [{ slug: "Mala Ruta", nombre: "A" }],
      personales: [],
    };
    expect(() => parseCategoriasApps(mal, "fixture")).toThrow(/slug/);
  });

  it("ordenDeEscaparate reordena cualquier lista: profesionales primero, cada una en el orden del YAML", () => {
    const desordenadas = ["habla", "velo", "ds"].map(ficha);
    expect(
      ordenDeEscaparate(desordenadas, (f) => f.ancla.slug, categorias).map(
        (f) => f.ancla.slug,
      ),
    ).toEqual(["ds", "velo", "habla"]);
  });

  it("ROJO: ordenDeEscaparate también falla si una app no tiene categoría", () => {
    expect(() =>
      ordenDeEscaparate(
        [ficha("ds"), ficha("zzz-nueva")],
        (f) => f.ancla.slug,
        categorias,
      ),
    ).toThrow(/zzz-nueva/);
  });
});
