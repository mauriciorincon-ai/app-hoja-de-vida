import { existsSync, readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";
import { parse } from "yaml";
import { getCasa } from "@/lib/brochure/casa";
import type { Contenido } from "@/lib/brochure/contenido";
import {
  textoEnEspanol,
  type Cita,
  type VistaBrochure,
} from "@/lib/brochure/modelo";
import { getComplemento } from "@/lib/vitrina/ficha-tecnica/loader";
import { hitosDe } from "@/lib/vitrina/ficha-tecnica/hitos";
import { getFichasVitrina } from "@/lib/vitrina/loader";
import { config, vistaDe as vista } from "../fixtures/brochure/vista";

/**
 * EL MODELO DEL BROCHURE (S28), sobre las doce apps reales en los dos idiomas: la numeración va
 * seguida (01–05 y 2.1…, OM-29), toda cita resuelve a algo que la página pinta, ningún texto queda
 * en `undefined` ni vacío donde se pinta, la piloto trae todos sus bloques v2 y las demás su 01.
 */

const SLUGS = Object.keys(config.apps).sort();
const CASOS = SLUGS.flatMap((s) =>
  (["es", "en"] as const).map((l) => [`${s} · ${l}`, s, l] as const),
);

/** Todas las citas de la vista, recorriendo el objeto. */
function citas(o: unknown, acc: Cita[] = []): Cita[] {
  if (Array.isArray(o)) o.forEach((x) => citas(x, acc));
  else if (o && typeof o === "object") {
    const r = o as Record<string, unknown>;
    if (typeof r.texto === "string" && typeof r.sec === "string")
      acc.push(r as Cita);
    else Object.values(r).forEach((x) => citas(x, acc));
  }
  return acc;
}

/** Los textos de la vista con su ruta. */
function textos(
  o: unknown,
  ruta = "",
  acc: [string, string][] = [],
): [string, string][] {
  if (typeof o === "string") acc.push([ruta, o]);
  else if (Array.isArray(o))
    o.forEach((x, i) => textos(x, `${ruta}[${i}]`, acc));
  else if (o && typeof o === "object")
    for (const [k, v] of Object.entries(o))
      textos(v, ruta ? `${ruta}.${k}` : k, acc);
  return acc;
}

/** Los ids de elemento que la página pinta (destinos de una cita). */
function idsPintados(v: VistaBrochure): Set<string> {
  const ids = new Set(["promesa", "m-privacidad", "m-stack", "m-cifras"]);
  if (v.metodo.nunca.length) ids.add("m-nunca");
  if (v.metodo.limites.length) ids.add("m-limites");
  for (const m of v.metodo.cifras) ids.add(`mt-${m.clave}`);
  for (const c of v.capitulos) for (const p of c.piezas) ids.add(`p-${p.id}`);
  return ids;
}

describe.each(CASOS)("%s", (_n, slug, locale) => {
  const v = vista(slug, locale);

  it("numeración seguida: 01–05 y los grupos como 2.1… (OM-29)", () => {
    const top = v.secciones.filter((s) => !s.sub);
    expect(top.map((s) => s.n)).toEqual(
      top.map((_s, i) => String(i + 1).padStart(2, "0")),
    );
    expect(top[0]!.id).toBe("antes");
    expect(top[1]!.id).toBe("mapa");
    expect(top.at(-1)!.id).toBe("cierre");
    const subs = v.secciones.filter((s) => s.sub);
    expect(subs.map((s) => s.n)).toEqual(
      subs.map((_s, i) => `02.${i + 1}`.replace(/^0/, "")),
    );
    expect(subs).toHaveLength(v.capitulos.length);
    expect(v.capitulos.map((c) => c.n)).toEqual(subs.map((s) => s.n));
  });

  it("toda cita lleva a una sección y a un elemento que la página pinta, con su número", () => {
    const secs = new Set(v.secciones.map((s) => s.id));
    const ids = idsPintados(v);
    for (const c of citas(v)) {
      expect(secs.has(c.sec), `${c.texto} → ${c.sec}`).toBe(true);
      if (c.el) expect(ids.has(c.el), `${c.texto} → #${c.el}`).toBe(true);
      const n = v.secciones.find((s) => s.id === c.sec)!.n;
      expect(c.texto.startsWith(`${n} · `), c.texto).toBe(true);
    }
  });

  it("ningún texto en undefined, null, NaN ni [object Object]", () => {
    for (const [ruta, s] of textos(v))
      expect(s, ruta).not.toMatch(/undefined|null|NaN|\[object Object\]/);
  });

  it("los bloques que se pintan no van vacíos", () => {
    const vacios = textos(v).filter(
      ([ruta, s]) =>
        s === "" &&
        // lo que puede ir vacío: el resto del titular, el rótulo «con la app» y la intro del mapa sin v2,
        // y el texto de un fin sin rótulo
        !/^portada\.titular\.(antes|despues)$|^antes\.rotuloDespues$|^mapa\.intro$|flujo\.(flujo\.nodos|nodos)\[\d+\]\.texto$|aristas\[\d+\]\.etq$/.test(
          ruta,
        ),
    );
    expect(vacios.map(([r]) => r)).toEqual([]);
    expect(v.pantallas.length).toBeGreaterThan(0);
    expect(v.portada.hero.length).toBeGreaterThan(0);
    expect(v.portada.cifras.length).toBeGreaterThanOrEqual(3);
    expect(v.metodo.cifras.length).toBeGreaterThan(0);
    expect(v.metodo.stack.length).toBeGreaterThan(0);
    expect(v.antes.paraQuien.length).toBeGreaterThan(0);
    expect(v.antes.diferencial.length).toBeGreaterThan(0);
  });

  it("los actores se nombran: ninguno queda como un id suelto del contrato", () => {
    const complemento =
      getCasa().find((p) => p.slug === slug)?.complemento ??
      getComplemento(slug);
    const idsProceso = new Set(
      (complemento.proceso?.carriles ?? []).map((c) => c.id),
    );
    const idsV2 = new Set(["dueno", "comprador", "equipo", "app"]);
    const flujos = [
      ...v.capitulos.flatMap((c) =>
        c.flujo ? [[c.flujo, idsV2] as const] : [],
      ),
      ...(v.proceso ? [[v.proceso.flujo, idsProceso] as const] : []),
    ];
    for (const [f, ids] of flujos)
      for (const a of f.actores) {
        expect(a.nombre.length, f.clave).toBeGreaterThan(0);
        if (a.nombre !== v.nombre)
          expect(ids.has(a.nombre), `${f.clave}: «${a.nombre}»`).toBe(false);
      }
  });
});

describe("lo que cambia entre la piloto, las v1 y la casa", () => {
  it("Innmobiliaria trae todos sus bloques v2", () => {
    const v = vista("inmobiliaria", "es");
    expect(v.acento).toBe("sage");
    expect(v.antes.prueba).toBeDefined();
    expect(v.antes.pares).toHaveLength(6);
    expect(v.antes.servicios?.items.length).toBe(4);
    expect(v.mapa.capas).toHaveLength(3);
    expect(v.mapa.transversal?.rasgos.length).toBe(4);
    expect(v.capitulos.filter((c) => c.flujo)).toHaveLength(10);
    expect(v.capitulos.reduce((n, c) => n + c.fichas.length, 0)).toBe(31);
    expect(v.portada.insignias).toHaveLength(3);
    expect(v.portada.titular.resalta).toBeTruthy();
    expect(v.proceso?.notas.length).toBeGreaterThan(0);
    expect(v.buscarPh).toBe("Busca: sello, cuota, WhatsApp…");
  });

  it("en inglés, los textos del export salen del bloque en del v2", () => {
    const v = vista("inmobiliaria", "en");
    const en = JSON.parse(
      readFileSync("content/vitrina/inmobiliaria.contenido.json", "utf8"),
    ).en;
    expect(v.portada.intro).toBe(en.promesa.intro);
    expect(v.antes.paraQuien).toBe(en.promesa.para_quien);
    const p = v.capitulos[0]!.piezas[0]!;
    expect(p.nombre).toBe(en.features[p.id].nombre);
    expect(v.secciones.find((s) => s.id === "antes")!.corto).toBe(
      "What changes",
    );
  });

  it("en inglés avisa que el texto es español donde el v2 no trae su bloque en; en español, nunca", () => {
    // El bloque `en` lo trae el v2 de quien ya lo recibió (hoy, la piloto y la casa); las demás leen el export, que
    // es español. Se mide del disco: una copia nueva (S30: la casa) cambia la respuesta sin tocar esta prueba.
    const conEn = (slug: string) => {
      const ruta = [
        `content/vitrina/${slug}.contenido.json`,
        `content/vitrina/casa/${slug}.contenido.json`,
      ].find((r) => existsSync(r));
      return ruta
        ? (JSON.parse(readFileSync(ruta, "utf8")).en as object | undefined)
        : undefined;
    };
    expect(conEn("inmobiliaria")).toBeTruthy();
    expect(
      SLUGS.some((s) => !conEn(s)),
      "alguna aún en español",
    ).toBe(true);
    for (const slug of SLUGS) {
      expect(vista(slug, "es").textoEnEs, `${slug} · es`).toBe(false);
      expect(vista(slug, "en").textoEnEs, `${slug} · en`).toBe(!conEn(slug));
    }
    // La función pura que usa también la metadata de la página.
    expect(textoEnEspanol("en", undefined)).toBe(true);
    expect(textoEnEspanol("en", {})).toBe(true);
    expect(textoEnEspanol("es", undefined)).toBe(false);
  });

  it("una app v1 conserva su 01 con «Para quién y por qué», sin los bloques que no tiene", () => {
    const v = vista("ds", "es");
    expect(v.secciones[0]).toMatchObject({
      id: "antes",
      n: "01",
      corto: "Lo que cambia",
    });
    expect(v.antes.prueba).toBeUndefined();
    expect(v.antes.pares).toEqual([]);
    expect(v.antes.servicios).toBeUndefined();
    expect(v.antes.paraQuienTitulo).toBe("Para quién y por qué");
    expect(v.mapa.capas).toHaveLength(1);
    expect(v.capitulos.every((c) => !c.flujo && c.fichas.length === 0)).toBe(
      true,
    );
    // el proceso nombra a sus actores con el nombre del carril, no con su id
    expect(v.proceso?.flujo.actores.map((a) => a.nombre)).toContain(
      "Quien defiende el modelo",
    );
    expect(v.cierre.lista?.appInicial).toBe("ds");
    expect(v.portada.rotuloCinta).toMatch(/datos sintéticos$/);
  });

  it("la razón de «Úsala»: la del contenido manda sobre la de `en` y sobre la del export (S30)", () => {
    const razones = {
      es: "Se conoce por este brochure.",
      en: "Known by this brochure.",
    };
    for (const l of ["es", "en"] as const)
      expect(
        vista("inmobiliaria", l, (c) => ({ ...c!, enlaces_razon: razones }))
          .cierre.razon,
        l,
      ).toBe(razones[l]);
    // Sin ella, la de antes: la del export en español y la de su bloque `en` en inglés.
    const sinRazon = (c?: Contenido) => {
      const copia = structuredClone(c!);
      delete copia.enlaces_razon;
      return copia;
    };
    const ficha = getFichasVitrina().find(
      (f) => f.ancla.slug === "inmobiliaria",
    )!;
    expect(vista("inmobiliaria", "es", sinRazon).cierre.razon).toBe(
      ficha.export.enlaces.razon,
    );
    const v2 = JSON.parse(
      readFileSync("content/vitrina/inmobiliaria.contenido.json", "utf8"),
    ) as Contenido;
    expect(vista("inmobiliaria", "en", sinRazon).cierre.razon).toBe(
      v2.en!.enlaces_razon,
    );
  });

  it("la casa no lleva lista de espera ni «datos sintéticos», y su nombre sale de apps.yaml", () => {
    const v = vista("hoja-de-vida", "en");
    expect(v.nombre).toBe("Living CV");
    expect(v.casa).toBe(true);
    expect(v.cierre.contacto?.href).toBe("/#contacto");
    expect(v.cierre.lista).toBeUndefined();
    expect(v.cierre.roadmap).toBeUndefined();
    expect(v.cierre.propuesta).toBeUndefined();
    expect(v.portada.rotuloCinta).not.toMatch(/synthetic/);
    expect(v.cierre.pie).not.toMatch(/synthetic/);
    expect(v.acento).toBe("rose");
  });
});

/**
 * «ÚSALA» (S30): el brochure es la entrada de la app y su cierre recibe lo que vivía en la ficha. El modelo
 * arma lo que cada app tiene: la lista de espera con ella elegida, su roadmap (si lo trae), la propuesta, su
 * simulación (si la tiene), «Dónde está» y las vecinas del escaparate. La casa no es una app: «Escríbeme».
 */
describe("«Úsala»: lo que cada brochure trae en su cierre", () => {
  const DE_CASA = new Set<string>(getCasa().map((p) => p.slug));
  const APPS = SLUGS.filter((s) => !DE_CASA.has(s));
  const categorias = parse(
    readFileSync("data/categorias-apps.yaml", "utf8"),
  ) as Record<"profesionales" | "personales", { slug: string }[]>;
  // El orden del escaparate: profesionales primero, como lo ve el visitante.
  const ESCAPARATE = [...categorias.profesionales, ...categorias.personales]
    .map((a) => a.slug)
    .filter((s) => APPS.includes(s));
  const CON_SIMULACION = new Set(
    (
      parse(readFileSync("data/simulaciones.yaml", "utf8")) as {
        simulaciones: { slug: string }[];
      }
    ).simulaciones.map((x) => x.slug),
  );

  it("hay diez apps y dos de la casa (si no, este bloque no mide nada)", () => {
    expect(APPS).toHaveLength(10);
    expect(DE_CASA.size).toBe(2);
    expect(ESCAPARATE).toHaveLength(10);
  });

  describe.each(APPS)("%s", (slug) => {
    it("la lista de espera lleva a las diez en el orden del escaparate, con esta elegida", () => {
      const { lista } = vista(slug, "es").cierre;
      expect(lista?.appInicial).toBe(slug);
      expect(lista?.apps.map((a) => a.slug)).toEqual(ESCAPARATE);
      // El nombre es el oficial (uno por app, el mismo en los dos idiomas).
      expect(vista(slug, "en").cierre.lista?.apps).toEqual(lista?.apps);
    });

    it("las vecinas son la anterior y la siguiente del escaparate, a su entrada", () => {
      const i = ESCAPARATE.indexOf(slug);
      const { vecinas } = vista(slug, "es").cierre;
      expect(vecinas.anterior?.href).toBe(
        i > 0 ? `/portafolio/apps/${ESCAPARATE[i - 1]}` : undefined,
      );
      expect(vecinas.siguiente?.href).toBe(
        i < ESCAPARATE.length - 1
          ? `/portafolio/apps/${ESCAPARATE[i + 1]}`
          : undefined,
      );
    });

    it("la simulación solo la tiene quien la tiene", () => {
      expect(vista(slug, "es").cierre.simulacion?.href).toBe(
        CON_SIMULACION.has(slug)
          ? `/portafolio/apps/${slug}/simulacion`
          : undefined,
      );
    });

    it.each(["es", "en"] as const)(
      "el roadmap es el de su complemento, en %s (sin ideas, no hay roadmap)",
      (l) => {
        const ideas = getComplemento(slug).roadmap;
        const { roadmap } = vista(slug, l).cierre;
        if (ideas.length === 0) return expect(roadmap).toBeUndefined();
        expect(roadmap?.app).toBe(slug);
        expect(roadmap?.features).toEqual(
          ideas.map((f) => ({
            feature: f.id,
            titulo: f.titulo[l],
            descripcion: f.descripcion[l],
          })),
        );
      },
    );

    it("la propuesta y «Dónde está» no faltan nunca", () => {
      const v = vista(slug, "es");
      expect(v.cierre.propuesta).toEqual({ app: slug, nombre: v.nombre });
      expect(v.cierre.contacto).toBeUndefined();
      const ficha = getFichasVitrina().find((f) => f.ancla.slug === slug)!;
      expect(v.cierre.hitos).toEqual(hitosDe(ficha.export));
    });
  });

  it("el escaparate empieza sin «anterior» y termina sin «siguiente»", () => {
    expect(vista(ESCAPARATE[0]!, "es").cierre.vecinas.anterior).toBeUndefined();
    expect(
      vista(ESCAPARATE.at(-1)!, "es").cierre.vecinas.siguiente,
    ).toBeUndefined();
  });

  it.each([...DE_CASA])(
    "%s (la casa): «Escríbeme», «Dónde está» y nada más (ni lista, ni roadmap, ni propuesta, ni vecinas)",
    (slug) => {
      const v = vista(slug, "es");
      const pieza = getCasa().find((p) => p.slug === slug)!;
      expect(v.cierre.casa).toBe(true);
      expect(v.cierre.contacto).toEqual({
        texto: "Escríbeme",
        href: "/#contacto",
      });
      expect(v.cierre.hitos).toEqual(hitosDe(pieza.export));
      expect(v.cierre.hitos.length).toBeGreaterThanOrEqual(4);
      expect(v.cierre.lista).toBeUndefined();
      expect(v.cierre.roadmap).toBeUndefined();
      expect(v.cierre.propuesta).toBeUndefined();
      expect(v.cierre.simulacion).toBeUndefined();
      expect(v.cierre.vecinas).toEqual({});
    },
  );
});
