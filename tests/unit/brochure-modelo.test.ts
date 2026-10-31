import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";
import { getCasa } from "@/lib/brochure/casa";
import type { Cita, VistaBrochure } from "@/lib/brochure/modelo";
import { getComplemento } from "@/lib/vitrina/ficha-tecnica/loader";
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
    expect(v.cierre.cta.href).toBe("/portafolio/apps/ds#contacto-portafolio");
    expect(v.portada.rotuloCinta).toMatch(/datos sintéticos$/);
  });

  it("la casa no lleva lista de espera ni «datos sintéticos», y su nombre sale de apps.yaml", () => {
    const v = vista("hoja-de-vida", "en");
    expect(v.nombre).toBe("Living CV");
    expect(v.casa).toBe(true);
    expect(v.cierre.cta.href).toBe("/#contacto");
    expect(v.portada.rotuloCinta).not.toMatch(/synthetic/);
    expect(v.cierre.pie).not.toMatch(/synthetic/);
    expect(v.acento).toBe("rose");
  });
});
