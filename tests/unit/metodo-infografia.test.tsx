import { renderToString } from "react-dom/server";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { InfografiaVista, fechaLarga } from "@/components/metodo/infografia";
import { MapaSvg, partirEtiqueta } from "@/components/metodo/mapa-svg";
import { RielDeFases } from "@/components/metodo/riel-de-fases";
import { leerPiezasDeDisco } from "@/lib/metodo/loader";
import { bloqueDe, BLOQUES, NIVELES, TIPOS_NODO } from "@/lib/metodo/schema";
import es from "../../messages/es.json";
import en from "../../messages/en.json";
import { ejemploSintetico, traductorDe } from "../fixtures/metodo/ayudas";

/**
 * LA PUBLICACIÓN DE «MÉTODOS» (S10): un solo renderizador, diez bloques, tres
 * voces, un mapa con texto real. Se renderiza como lo hace el servidor y se
 * lee el HTML — con la traducción REAL (`traductorDe` lanza si falta una clave).
 */

vi.mock("@/i18n/navigation", () => ({
  Link: (props: React.ComponentProps<"a">) => <a {...props} />,
}));

const pieza = ejemploSintetico();

function montar(idioma: "es" | "en") {
  const html = renderToString(
    <InfografiaVista pieza={pieza} idioma={idioma} t={traductorDe(idioma)} />,
  );
  document.body.innerHTML = html;
  return html;
}

describe.each([
  ["es", es.metodo],
  ["en", en.metodo],
] as const)("InfografiaVista · %s", (idioma, textos) => {
  beforeEach(() => {
    montar(idioma);
  });

  it("pinta los diez bloques, del 1 al 10, cada uno con su ancla #bloque-n y su título", () => {
    const secciones = [...document.querySelectorAll("section[data-bloque]")];
    expect(secciones.map((s) => s.id)).toEqual(BLOQUES.map((b) => `bloque-${b.n}`));
    for (const b of BLOQUES) {
      const h2 = document.querySelector(`#bloque-${b.n}-titulo`);
      expect(h2?.textContent, `bloque ${b.n}`).toBe(textos.bloques[String(b.n) as keyof typeof textos.bloques]);
    }
  });

  it("un solo h1 (el nombre de la pieza) y ningún salto de nivel de encabezado", () => {
    const h1 = document.querySelectorAll("h1");
    expect(h1).toHaveLength(1);
    expect(h1[0].textContent).toBe(pieza.nombre[idioma]);
    let nivel = 1;
    for (const h of document.querySelectorAll("h1,h2,h3,h4")) {
      const n = Number(h.tagName[1]);
      expect(n - nivel, `«${h.textContent}» salta de h${nivel} a h${n}`).toBeLessThanOrEqual(1);
      nivel = n;
    }
  });

  it("dice su fecha de revisión, en el encabezado y en el bloque 10", () => {
    const tiempos = [...document.querySelectorAll("time[datetime='2026-10-17']")];
    expect(tiempos.length).toBeGreaterThanOrEqual(2);
    expect(tiempos[0].textContent).toContain(fechaLarga("2026-10-17", idioma));
  });

  it("las tres voces se distinguen con palabra Y símbolo, no solo con color", () => {
    const leyenda = document.querySelector("[data-leyenda-voces]");
    expect(leyenda).not.toBeNull();
    for (const [voz, simbolo] of [["hice", "●"], ["campo", "◆"], ["posicion", "▲"]] as const) {
      const rotulo = leyenda?.querySelector(`[data-voz-rotulo="${voz}"]`);
      expect(rotulo?.textContent, voz).toContain(textos.voces[voz].nombre);
      expect(rotulo?.textContent, voz).toContain(simbolo);
    }
    // Y cada afirmación de la pieza lleva SU rótulo.
    for (const voz of ["hice", "campo", "posicion"]) {
      const afirmaciones = document.querySelectorAll(`[data-voz="${voz}"]`);
      expect(afirmaciones.length, `afirmaciones de la voz ${voz}`).toBeGreaterThan(0);
      for (const a of afirmaciones) expect(a.querySelector("[data-voz-rotulo]")).not.toBeNull();
    }
  });

  it("lo que hice lleva su documento del corpus en el dato; lo del campo, su cita", () => {
    for (const a of document.querySelectorAll('[data-voz="hice"]'))
      expect(a.getAttribute("data-corpus"), "voz hice sin corpus").toBeTruthy();
    const campo = document.querySelector('[data-voz="campo"]');
    expect(campo?.querySelector('a[href^="#fuente-"]')).not.toBeNull();
  });

  it("cada cita [n] lleva a una fuente que existe, y toda fuente trae título, editor, fecha y enlace", () => {
    const citas = [...document.querySelectorAll('a[href^="#fuente-"]')];
    expect(citas.length).toBeGreaterThan(0);
    for (const c of citas) {
      const destino = document.getElementById(c.getAttribute("href")!.slice(1));
      expect(destino, `cita ${c.getAttribute("href")}`).not.toBeNull();
    }
    const fuentes = [...document.querySelectorAll("li[data-fuente]")];
    expect(fuentes).toHaveLength(bloqueDe(pieza, 10).fuentes.length);
    for (const f of fuentes) {
      expect(f.querySelector('a[href^="https://"]')?.textContent?.trim(), "título").toBeTruthy();
      expect(f.querySelector("time[datetime]"), "fecha").not.toBeNull();
      expect(f.textContent, "editor").toContain("Editor de ejemplo");
      expect(f.textContent, "enlace visible al imprimir").toContain("https://");
    }
  });

  it("la evidencia lleva el nivel que el corpus le da, con su palabra", () => {
    const niveles = [...document.querySelectorAll("[data-nivel]")];
    expect(niveles.length).toBeGreaterThan(0);
    for (const n of niveles) {
      const clave = n.getAttribute("data-nivel") as (typeof NIVELES)[number];
      expect(n.textContent).toContain(textos.niveles[clave]);
    }
  });

  it("no queda nada sin resolver: ni [CONFIRMAR], ni «undefined», ni una plantilla {n}", () => {
    const texto = document.body.textContent ?? "";
    expect(texto).not.toMatch(/\[CONFIRMAR|undefined|\{\w+\}/);
  });

  it("el índice de bloques lleva a las diez anclas", () => {
    const enlaces = [...document.querySelectorAll('nav a[href^="#bloque-"]')];
    expect(enlaces.map((a) => a.getAttribute("href"))).toEqual(BLOQUES.map((b) => `#bloque-${b.n}`));
  });
});

describe("la forma de la pieza es la misma en los dos idiomas", () => {
  it("mismos bloques, nodos, fases, decisiones, fuentes y voces en ES y EN", () => {
    const firma = (idioma: "es" | "en") => {
      montar(idioma);
      return ["[data-bloque]", "[data-nodo]", "[data-arista]", "[data-fase]", "[data-decision]", "[data-fuente]", "[data-voz]", "[data-nivel]"].map(
        (sel) => document.querySelectorAll(sel).length,
      );
    };
    expect(firma("en")).toEqual(firma("es"));
  });

  it("la forma del árbol no depende de nada del cliente: el HTML del servidor es determinista", () => {
    const a = renderToString(<InfografiaVista pieza={pieza} idioma="es" t={traductorDe("es")} />);
    const b = renderToString(<InfografiaVista pieza={pieza} idioma="es" t={traductorDe("es")} />);
    expect(a).toBe(b);
  });
});

describe("MapaSvg · texto real, alternativa textual, todo color con una palabra", () => {
  const b2 = bloqueDe(pieza, 2);
  const html = renderToString(<MapaSvg bloque={b2} idioma="es" t={traductorDe("es")} />);

  it("es un SVG con título y descripción, y su texto es texto, no una imagen", () => {
    document.body.innerHTML = html;
    const svg = document.querySelector('svg[role="img"]');
    expect(svg?.querySelector("title")?.textContent).toBe(b2.titulo.es);
    expect(svg?.querySelector("desc")?.textContent).toBe(b2.resumen.es);
    expect(svg?.getAttribute("aria-labelledby")).toBe("mapa-titulo mapa-desc");
    const textos = [...(svg?.querySelectorAll("text") ?? [])].map((t) => t.textContent);
    for (const n of b2.nodos) expect(textos.join(" ")).toContain(n.etiqueta.es.split(" ")[0]);
    expect(svg?.querySelectorAll("image, img").length).toBe(0);
  });

  it("dibuja un nodo y una arista por cada uno del dato, con su número", () => {
    document.body.innerHTML = html;
    expect(document.querySelectorAll("[data-nodo]")).toHaveLength(b2.nodos.length);
    expect(document.querySelectorAll("[data-arista]")).toHaveLength(b2.aristas.length);
    for (const n of b2.nodos)
      expect(document.querySelector(`[data-nodo="${n.n}"]`)?.textContent).toContain(String(n.n));
  });

  it("la leyenda nombra con palabra cada tipo de nodo, y la lectura enumera nodo por nodo", () => {
    document.body.innerHTML = html;
    const leyenda = document.querySelector("[data-mapa-leyenda]")?.textContent ?? "";
    for (const tipo of TIPOS_NODO) expect(leyenda).toContain(es.metodo.tipos[tipo].nombre);
    const lectura = document.querySelector("[data-mapa-lectura]");
    expect(lectura?.querySelectorAll("ol > li")).toHaveLength(b2.nodos.length);
    expect(lectura?.textContent).toContain(b2.resumen.es);
  });

  it("la región que se desliza en el teléfono es alcanzable con teclado y tiene nombre", () => {
    document.body.innerHTML = html;
    const region = document.querySelector('[role="region"]');
    expect(region?.getAttribute("tabindex")).toBe("0");
    expect(region?.getAttribute("aria-label")).toBe(b2.titulo.es);
  });

  it("`partirEtiqueta` parte en a lo sumo dos líneas y no pierde palabras", () => {
    expect(partirEtiqueta("Solicitud")).toEqual(["Solicitud"]);
    expect(partirEtiqueta("Revisión humana del paso")).toEqual(["Revisión humana", "del paso"]);
    const larga = partirEtiqueta("Una etiqueta bastante más larga que cabe");
    expect(larga.length).toBeLessThanOrEqual(2);
    expect(larga.join(" ")).toBe("Una etiqueta bastante más larga que cabe");
  });
});

// S10-M3: `partirEtiqueta` deja la 2.ª línea sin tope (no pierde palabras: la «Lectura del mapa»
// y las aristas ya repiten el nombre entero), así que lo que impide que una etiqueta se salga de su
// nodo es ESTE gate sobre los datos: dos líneas y ninguna más ancha que la más ancha que ya se ve
// entera en las capturas (20 caracteres). Una etiqueta nueva que no quepa falla nombrando pieza y nodo.
const LINEA_MAXIMA_DEL_NODO = 22;

describe("MapaSvg · ninguna etiqueta de nodo desborda su caja (todas las piezas, ES y EN)", () => {
  const piezas = leerPiezasDeDisco();

  it("hay piezas en disco (si no, esta prueba no mide nada)", () => {
    expect(piezas.length).toBeGreaterThan(0);
  });

  for (const p of piezas) {
    for (const idioma of ["es", "en"] as const) {
      it(`${p.slug} (${idioma}): cada etiqueta cabe en dos líneas de ≤ ${LINEA_MAXIMA_DEL_NODO} caracteres`, () => {
        const mapa = bloqueDe(p, 2);
        const largas = mapa.nodos
          .map((n) => ({ n: n.id, lineas: partirEtiqueta(n.etiqueta[idioma]) }))
          .filter((x) => x.lineas.length > 2 || x.lineas.some((l) => l.length > LINEA_MAXIMA_DEL_NODO));
        expect(
          largas,
          `${p.slug} (${idioma}): etiquetas que no caben en su nodo: ` +
            largas.map((x) => `nodo ${x.n} «${x.lineas.join(" / ")}»`).join(" · "),
        ).toEqual([]);
      });
    }
  }
});

describe("RielDeFases · el relleno existe siempre (regla 5a)", () => {
  const fases = [
    { nombre: "Uno", entradas: ["a"], actividades: ["b"], artefactos: ["c"], decide: "X", control: "Y" },
    { nombre: "Dos", entradas: ["a"], actividades: ["b"], artefactos: ["c"], decide: "X", control: "Y" },
  ];
  const etiquetas = {
    fase: "Fase {n}", avance: "Avance", entradas: "Entradas", actividades: "Actividades",
    artefactos: "Artefactos", decide: "Decide", control: "Control",
  };

  it("pinta una lista de fases numeradas y el relleno nace en el HTML del servidor, quieto", () => {
    document.body.innerHTML = renderToString(<RielDeFases fases={fases} etiquetas={etiquetas} />);
    expect(document.querySelectorAll("ol > li[data-fase]")).toHaveLength(2);
    expect(document.body.textContent).toContain("Fase 1");
    expect(document.body.textContent).toContain("Fase 2");
    const relleno = document.querySelector("[data-riel-relleno]");
    expect(relleno).not.toBeNull();
    expect(relleno?.hasAttribute("data-motion")).toBe(true); // el cinturón CSS lo deja entero con «reducir movimiento»
  });
});

describe("fechaLarga", () => {
  it("formatea en el idioma de la página sin depender de la zona horaria", () => {
    expect(fechaLarga("2026-10-17", "es")).toMatch(/17 de octubre de 2026/);
    expect(fechaLarga("2026-10-17", "en")).toMatch(/October 17, 2026/);
    expect(fechaLarga("2026-01-01", "en")).toMatch(/January 1, 2026/);
  });
});
