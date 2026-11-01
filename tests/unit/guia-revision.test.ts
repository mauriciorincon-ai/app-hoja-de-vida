import { existsSync, readFileSync } from "node:fs";
import path from "node:path";
import { JSDOM } from "jsdom";
import { describe, expect, it, vi } from "vitest";

/**
 * LA REVISIÓN COMPLETA EN LA GUÍA (Sprint 021) — `docs/GUIA-DE-PRUEBA.html`.
 *
 * El dueño revisa producción con la guía: el filtro «Revisión completa» reúne todo lo
 * pendiente en sentadas de a lo sumo 45 minutos, ordenadas por lugar y aparato, con cada
 * prueba UNA vez, un sí o un no, una nota y un botón que copia las respuestas. Este gate
 * carga la página REAL en jsdom y la usa como la usaría una persona:
 *
 *  · cada prueba vigente está exactamente en un sitio: una fila de una sentada, dentro de
 *    un flujo R que la cubre, o «fuera, con su razón» (ninguna se pierde ni se repite);
 *  · las sumas las hace la página —ninguna sentada pasa de 45 min— y ningún total está
 *    escrito en el texto de la sección;
 *  · el sí/no y la nota se guardan, vuelven al recargar y son los mismos en todos los filtros;
 *  · «Copiar mis respuestas» copia un texto con la fecha, la versión, cada «no» con su
 *    nota y los pendientes; si el portapapeles falla, el texto queda a la vista.
 */
vi.setConfig({ testTimeout: 30_000 });

const RUTA = path.join(process.cwd(), "docs", "GUIA-DE-PRUEBA.html");
const HTML = readFileSync(RUTA, "utf8");
const LIMITE = 45;
const NS = "guia-hoja-de-vida:s21:";

function abrir(
  almacen?: Record<string, string>,
  html = HTML,
  opciones: { almacenRoto?: boolean } = {},
) {
  const dom = new JSDOM(html, {
    runScripts: "dangerously",
    url: "http://localhost/guia",
    pretendToBeVisual: true,
    beforeParse(window) {
      if (opciones.almacenRoto) {
        // Una ventana privada estricta o sin espacio: leer da null y escribir lanza.
        Object.defineProperty(window, "localStorage", {
          configurable: true,
          value: {
            length: 0,
            key: () => null,
            getItem: () => null,
            removeItem: () => undefined,
            setItem: () => {
              throw new Error("QuotaExceededError");
            },
          },
        });
        return;
      }
      for (const [k, v] of Object.entries(almacen ?? {}))
        window.localStorage.setItem(k, v);
    },
  });
  const doc = dom.window.document;
  const filas = (sel = "ul.pasos li") => [
    ...doc.querySelectorAll<HTMLElement>(sel),
  ];
  const calc = (clave: string) =>
    doc.querySelector(`[data-calc="${clave}"]`)?.textContent ?? "";
  const filtro = (nombre: string) =>
    doc.querySelector<HTMLButtonElement>(
      `.filtros button[data-filtro="${nombre}"]`,
    )!;
  const click = (id: string) =>
    (doc.getElementById(id) as HTMLInputElement).click();
  return { dom, doc, window: dom.window, filas, calc, filtro, click };
}

const minutos = (li: HTMLElement) =>
  Number(li.getAttribute("data-rev-min") ?? li.getAttribute("data-ensayo"));

describe("la guía v31 · el filtro «Revisión completa»", () => {
  it("es el primero de la barra, está activo al abrir y muestra solo las filas de las sentadas", () => {
    const { doc, filas, filtro } = abrir();
    const botones = [...doc.querySelectorAll(".filtros button")];
    expect(botones[0].getAttribute("data-filtro")).toBe("revision");
    expect(filtro("revision").classList.contains("activo")).toBe(true);
    expect(
      botones.filter((b) => b.classList.contains("activo")),
      "uno solo activo",
    ).toHaveLength(1);

    const conSentada = filas("ul.pasos li[data-rev]");
    expect(conSentada.length).toBeGreaterThan(100);
    expect(filtro("revision").textContent).toContain(`(${conSentada.length})`);
    const visibles = filas().filter((li) => !li.hasAttribute("hidden"));
    expect(visibles).toHaveLength(conSentada.length);
    expect(visibles.every((li) => li.hasAttribute("data-rev"))).toBe(true);
    // Las demás secciones no se ven y la lista de lo que sale de la revisión, sí.
    expect(doc.getElementById("revision")!.hasAttribute("hidden")).toBe(false);
    expect(doc.getElementById("revision-fuera")!.hasAttribute("hidden")).toBe(
      false,
    );
    expect(doc.getElementById("ensayo")!.hasAttribute("hidden")).toBe(true);
  });

  it("cada prueba vigente está exactamente en un sitio: sentada, flujo que la cubre o fuera con su razón", () => {
    const { filas } = abrir();
    const flujos = filas("ul.pasos li[data-ensayo]");
    const cubre = new Map<string, string[]>();
    for (const f of flujos)
      for (const id of (f.getAttribute("data-cubre") ?? "")
        .split(/\s+/)
        .filter(Boolean))
        cubre.set(id, [
          ...(cubre.get(id) ?? []),
          f.querySelector("input")!.name,
        ]);

    const pruebas = filas("ul.pasos li[id]");
    expect(pruebas.length).toBeGreaterThan(140);
    const problemas: string[] = [];
    for (const li of pruebas) {
      const sitios = [
        li.hasAttribute("data-rev") ? "sentada" : "",
        cubre.has(li.id) ? `flujo ${cubre.get(li.id)!.join("+")}` : "",
        li.hasAttribute("data-rev-fuera") ? "fuera" : "",
      ].filter(Boolean);
      if (sitios.length !== 1)
        problemas.push(
          `${li.id}: ${sitios.length ? "está en " + sitios.join(" y en ") : "no está en ningún sitio"}`,
        );
    }
    for (const id of cubre.keys())
      if (!pruebas.some((li) => li.id === id))
        problemas.push(`un flujo cubre «${id}», que no existe en la guía`);
    for (const f of flujos)
      if (!f.getAttribute("data-rev"))
        problemas.push(
          `${f.querySelector("input")!.name}: un flujo sin sentada`,
        );
    expect(problemas).toEqual([]);
  });

  it("lo que sale de la revisión dice por qué, con un archivo que existe, y se ve en su fila y en la lista", () => {
    const { doc, filas } = abrir();
    const fuera = filas("ul.pasos li[data-rev-fuera]");
    expect(fuera.length).toBeGreaterThan(0);
    const items = [...doc.querySelectorAll("#revision-fuera-lista li")];
    expect(items).toHaveLength(fuera.length);
    for (const li of fuera) {
      const razon = li.getAttribute("data-rev-fuera")!;
      expect(razon.length, `${li.id}: la razón`).toBeGreaterThan(40);
      for (const archivo of razon.match(/\b(?:tests|data)\/[\w./-]+\.\w+/g) ??
        [])
        expect(
          existsSync(path.join(process.cwd(), archivo)),
          `${li.id}: la razón cita «${archivo}»`,
        ).toBe(true);
      expect(
        items.find((i) => i.querySelector("code")?.textContent === li.id)
          ?.textContent,
        `${li.id} en la lista`,
      ).toContain(razon);
      expect(
        [...li.querySelectorAll(".fuera-ensayo")]
          .map((n) => n.textContent)
          .join(" "),
        `${li.id} en su fila`,
      ).toContain(`Fuera de la revisión: ${razon}`);
    }
  });

  it("al cambiar de filtro cada fila vuelve a su bloque y la revisión se vacía", () => {
    const { doc, filas, filtro } = abrir();
    filtro("todo").click();
    expect(filas().some((li) => li.hasAttribute("hidden"))).toBe(false);
    expect(
      doc.getElementById("a1")!.closest("section")!.querySelector("h2")!
        .textContent,
    ).toContain("La HOME se recorre");
    expect(doc.querySelectorAll("[data-rev-lista] li")).toHaveLength(0);
    expect(doc.getElementById("revision")!.hasAttribute("hidden")).toBe(true);
    // Y volver a la revisión no pierde ni duplica ninguna fila.
    filtro("revision").click();
    const ids = [...doc.querySelectorAll("[data-rev-lista] li")].map(
      (li) => li.id || li.querySelector("input")!.getAttribute("name"),
    );
    expect(new Set(ids).size, "ninguna fila repetida").toBe(ids.length);
    expect(ids).toHaveLength(filas("ul.pasos li[data-rev]").length);
  });
});

describe("la guía v31 · las sentadas y las sumas", () => {
  it("cada sentada tiene su título y sus filas, ninguna pasa de 45 min y las sumas son las de la página", () => {
    const { doc, filas, calc } = abrir();
    const sentadas = [
      ...doc.querySelectorAll<HTMLElement>("[data-rev-sentada]"),
    ];
    expect(sentadas.length).toBeGreaterThanOrEqual(
      Math.ceil(
        filas("ul.pasos li[data-rev]").reduce((t, li) => t + minutos(li), 0) /
          LIMITE,
      ),
    );
    let total = 0;
    let n = 0;
    for (const s of sentadas) {
      const id = s.getAttribute("data-rev-sentada")!;
      const propias = filas("ul.pasos li[data-rev]").filter(
        (li) => li.getAttribute("data-rev") === id,
      );
      expect(propias.length, `la sentada ${id} no está vacía`).toBeGreaterThan(
        0,
      );
      expect(s.querySelector("h3")?.textContent).toMatch(/^\s*Sentada \d+ · /);
      const suma = propias.reduce((t, li) => t + minutos(li), 0);
      for (const li of propias)
        expect(
          Number.isInteger(minutos(li)) && minutos(li) > 0 && minutos(li) <= 15,
          `${li.id || li.querySelector("input")!.name}: minutos de la fila`,
        ).toBe(true);
      expect(
        suma,
        `la sentada ${id} suma ${suma} min y el tope es ${LIMITE}`,
      ).toBeLessThanOrEqual(LIMITE);
      expect(calc(`rev-s${id}-min`)).toBe(String(suma));
      expect(calc(`rev-s${id}-n`)).toBe(String(propias.length));
      expect(calc(`rev-s${id}-aviso`)).toBe("");
      total += suma;
      n += propias.length;
    }
    expect(calc("rev-min")).toBe(String(total));
    expect(calc("rev-n")).toBe(String(n));
    expect(calc("rev-sentadas")).toBe(String(sentadas.length));
    expect(calc("rev-horas")).toBe(
      `${Math.floor(total / 60)} h ${String(total % 60).padStart(2, "0")} min`,
    );
    // Cada fila de cada sentada está en la lista de SU sentada.
    for (const li of filas("ul.pasos li[data-rev]"))
      expect(
        li.closest("[data-rev-lista]")?.getAttribute("data-rev-lista"),
      ).toBe(li.getAttribute("data-rev"));
  });

  it("los flujos R abren cada sentada que los trae (van antes que las pruebas)", () => {
    const { doc } = abrir();
    for (const lista of doc.querySelectorAll("[data-rev-lista]")) {
      const orden = [...lista.children].map((li) =>
        li.hasAttribute("data-ensayo") ? "R" : "t",
      );
      expect(orden.join(""), "los R primero").toMatch(/^R*t*$/);
    }
  });

  it("una sentada que pasa de 45 min lo dice con su número y se marca", () => {
    const html = HTML.replace(/data-ensayo="6"/, 'data-ensayo="60"');
    const { doc, calc } = abrir(undefined, html);
    expect(calc("rev-s1-aviso")).toMatch(/pasa de 45 min/);
    expect(
      doc.querySelector('[data-rev-resumen="1"]')!.classList.contains("pasada"),
    ).toBe(true);
  });

  it("ningún total ni tiempo está escrito a mano en el texto de la sección", () => {
    const seccion = HTML.slice(
      HTML.indexOf('<section class="bloque" id="revision"'),
      HTML.indexOf("</section>", HTML.indexOf('id="revision"')),
    );
    const texto = seccion.replace(/<[^>]+>/g, " ").replace(/\s+/g, " ");
    expect(texto).not.toMatch(
      /\b\d+\s*(min|minutos|pruebas|sentadas|horas|h)\b/i,
    );
    // Cada cifra del resumen es un espacio que la página llena.
    expect(seccion).toMatch(/data-calc="rev-min">—</);
    expect(seccion).toMatch(/data-calc="rev-n">—</);
  });

  it("ningún bloque trae una estimación de minutos escrita a mano: los minutos los suma la página", () => {
    // Fuera del historial (los <details>), donde cada versión conserva lo que fue cierto ese día.
    const sinHistorial = HTML.replace(/<details[\s\S]*?<\/details>/g, "");
    const texto = sinHistorial.replace(/<[^>]+>/g, " ").replace(/\s+/g, " ");
    expect(texto.match(/~\s*\d+\s*(min|h)\b/g) ?? []).toEqual([]);
  });
});

describe("la guía v31 · el sí/no y la nota", () => {
  it("cada prueba tiene su sí, su no y su nota; marcar guarda y cuenta", () => {
    const { doc, window, calc, click } = abrir();
    const pruebas = [...doc.querySelectorAll<HTMLElement>("ul.pasos li[id]")];
    for (const li of pruebas) {
      const radios = [
        ...li.querySelectorAll<HTMLInputElement>('input[type="radio"]'),
      ];
      expect(radios.map((r) => r.value).sort(), li.id).toEqual(["no", "si"]);
      expect(
        li.querySelector(`textarea.p-nota[data-nota-de="${li.id}"]`),
        `${li.id}: su nota`,
      ).toBeTruthy();
    }
    const pendientes = Number(calc("rev-pendientes"));
    expect(pendientes).toBeGreaterThan(100);
    click("a1-no");
    const nota = doc.querySelector<HTMLTextAreaElement>('[data-nota-de="a1"]')!;
    nota.value = "el botón no responde";
    nota.dispatchEvent(new window.Event("input", { bubbles: true }));
    expect(window.localStorage.getItem(`${NS}a1`)).toBe("no");
    expect(window.localStorage.getItem(`${NS}a1:nota`)).toBe(
      "el botón no responde",
    );
    expect(calc("rev-no")).toBe("1");
    expect(calc("rev-s1-no")).toBe("1");
    expect(calc("rev-pendientes")).toBe(String(pendientes - 1));
    // Cambiar de idea: el sí reemplaza al no; borrar la nota la quita.
    click("a1-si");
    expect(calc("rev-no")).toBe("0");
    expect(calc("rev-si")).toBe("1");
    nota.value = "";
    nota.dispatchEvent(new window.Event("input", { bubbles: true }));
    expect(window.localStorage.getItem(`${NS}a1:nota`)).toBeNull();
  });

  it("al recargar vuelven como se dejaron, y el sí/no de un flujo R es el mismo en el ensayo", () => {
    const { doc, calc, filtro, click } = abrir({
      [`${NS}a1`]: "no",
      [`${NS}a1:nota`]: "se corta en el teléfono",
      [`${NS}r2`]: "si",
      "guia-hoja-de-vida:s20:a2": "no",
    });
    expect((doc.getElementById("a1-no") as HTMLInputElement).checked).toBe(
      true,
    );
    expect(
      doc.querySelector<HTMLTextAreaElement>('[data-nota-de="a1"]')!.value,
    ).toBe("se corta en el teléfono");
    expect(
      (doc.getElementById("a2-no") as HTMLInputElement).checked,
      "una marca s20 no cuenta",
    ).toBe(false);
    expect(calc("rev-si")).toBe("1");
    expect(calc("rev-no")).toBe("1");
    // R2 es la misma fila en la revisión y en el ensayo.
    filtro("ensayo").click();
    expect(calc("ensayo-si")).toBe("1");
    click("r3-no");
    filtro("revision").click();
    expect(calc("rev-no")).toBe("2");
  });

  it("una respuesta marcada por error se quita y la fila vuelve a pendiente", () => {
    const { doc, window, calc, click } = abrir();
    const antes = Number(calc("rev-pendientes"));
    const boton = doc.querySelector<HTMLButtonElement>("#a1 .p-limpiar")!;
    expect(boton.hidden, "sin respuesta no se ofrece quitarla").toBe(true);
    click("a1-no");
    expect(boton.hidden).toBe(false);
    expect(calc("rev-pendientes")).toBe(String(antes - 1));
    boton.click();
    expect((doc.getElementById("a1-no") as HTMLInputElement).checked).toBe(
      false,
    );
    expect(window.localStorage.getItem(`${NS}a1`)).toBeNull();
    expect(calc("rev-pendientes")).toBe(String(antes));
    expect(calc("rev-no")).toBe("0");
    expect(boton.hidden).toBe(true);
  });

  it("los radios no se restauran solos: las filas cambian de sitio y el navegador marcaría otro", () => {
    const sin = (
      HTML.match(/<input type="radio"(?! autocomplete="off")/g) ?? []
    ).length;
    expect(sin).toBe(0);
  });

  it("la nota es un cuadro de varias líneas de hasta 2000 caracteres, no una línea de 300", () => {
    const { doc } = abrir();
    const notas = [...doc.querySelectorAll<HTMLElement>(".p-nota")];
    expect(notas.length).toBeGreaterThan(140);
    const malas = notas
      .filter(
        (n) =>
          n.tagName !== "TEXTAREA" || n.getAttribute("maxlength") !== "2000",
      )
      .map((n) => n.getAttribute("data-nota-de"));
    expect(malas).toEqual([]);
  });

  it("una nota larga y con saltos de línea se guarda entera y vuelve al recargar", () => {
    const larga = `${"a".repeat(900)}\n${"b".repeat(600)}`;
    const { doc, window } = abrir();
    const nota = doc.querySelector<HTMLTextAreaElement>('[data-nota-de="a1"]')!;
    nota.value = larga;
    nota.dispatchEvent(new window.Event("input", { bubbles: true }));
    expect(window.localStorage.getItem(`${NS}a1:nota`)).toBe(larga);
    const otra = abrir({ [`${NS}a1:nota`]: larga });
    expect(
      otra.doc.querySelector<HTMLTextAreaElement>('[data-nota-de="a1"]')!.value,
    ).toBe(larga);
  });

  it("lo guardado con la nota de una línea sigue valiendo: la clave y el prefijo no cambiaron", () => {
    const { doc, calc } = abrir({
      [`${NS}a1`]: "no",
      [`${NS}a1:nota`]: "una nota corta de antes",
    });
    expect((doc.getElementById("a1-no") as HTMLInputElement).checked).toBe(
      true,
    );
    expect(
      doc.querySelector<HTMLTextAreaElement>('[data-nota-de="a1"]')!.value,
    ).toBe("una nota corta de antes");
    expect(calc("rev-no")).toBe("1");
  });
});

describe("la guía v31 · «Copiar mis respuestas»", () => {
  function conRespuestas(portapapeles?: unknown) {
    const a = abrir();
    if (portapapeles !== undefined)
      Object.defineProperty(a.window.navigator, "clipboard", {
        value: portapapeles,
        configurable: true,
      });
    a.click("a1-no");
    const nota = a.doc.querySelector<HTMLTextAreaElement>(
      '[data-nota-de="a1"]',
    )!;
    nota.value = "el botón no responde";
    nota.dispatchEvent(new a.window.Event("input", { bubbles: true }));
    a.click("a2-si");
    const nota2 = a.doc.querySelector<HTMLTextAreaElement>(
      '[data-nota-de="a2"]',
    )!;
    nota2.value = "el orden es distinto";
    nota2.dispatchEvent(new a.window.Event("input", { bubbles: true }));
    a.click("r1-no");
    return a;
  }

  it("copia fecha, versión, totales, cada «no» con su nota y los pendientes", async () => {
    let copiado = "";
    const { doc } = conRespuestas({
      writeText: (t: string) => {
        copiado = t;
        return Promise.resolve();
      },
    });
    (doc.getElementById("rev-copiar") as HTMLButtonElement).click();
    await new Promise((r) => setTimeout(r, 0));
    expect(copiado).toMatch(
      /^CV Viva · Revisión completa · guía v31\nFecha: \d{4}-\d{2}-\d{2}\n/,
    );
    expect(copiado).toMatch(
      /Totales: \d+ pruebas · sí 1 · no 2 · pendientes \d+/,
    );
    expect(copiado).toContain("NO (2)");
    expect(copiado).toMatch(
      /· a1 — .+\n\s+Sentada 1 · .+\n\s+nota: el botón no responde/,
    );
    expect(copiado).toMatch(
      /· R1 — La HOME de punta a punta\n.*\n\s+nota: \(sin nota\)/,
    );
    expect(copiado).toContain("SÍ CON NOTA (1)");
    expect(copiado).toContain("· a2 — ");
    expect(copiado).toContain("el orden es distinto");
    // Los pendientes van por sentada, con el opcional marcado, y los respondidos no están.
    expect(copiado).toMatch(/PENDIENTES \(\d+ y 1 opcional\)/);
    expect(copiado).toMatch(/Sentada 11: .*q26 \(opcional\)/);
    expect(copiado).not.toMatch(/Sentada 1: .*\ba1\b/);
    expect(doc.getElementById("rev-estado")!.textContent).toContain("Copiado");
    expect(doc.getElementById("rev-texto")!.hasAttribute("hidden")).toBe(true);
  });

  it("una nota de varias líneas se copia en una sola, con todo su texto", async () => {
    let copiado = "";
    const { doc, window } = abrir({
      [`${NS}a1`]: "no",
      [`${NS}a1:nota`]: "primero esto\n\nluego esto otro\n  y al final eso",
    });
    Object.defineProperty(window.navigator, "clipboard", {
      value: {
        writeText: (t: string) => {
          copiado = t;
          return Promise.resolve();
        },
      },
      configurable: true,
    });
    (doc.getElementById("rev-copiar") as HTMLButtonElement).click();
    await new Promise((r) => setTimeout(r, 0));
    expect(copiado).toContain(
      "nota: primero esto ⏎ luego esto otro ⏎ y al final eso",
    );
  });

  it("si el portapapeles falla, el texto queda a la vista y seleccionado", async () => {
    const { doc } = conRespuestas({
      writeText: () => Promise.reject(new Error("denegado")),
    });
    (doc.getElementById("rev-copiar") as HTMLButtonElement).click();
    await new Promise((r) => setTimeout(r, 0));
    const area = doc.getElementById("rev-texto") as HTMLTextAreaElement;
    expect(area.hasAttribute("hidden")).toBe(false);
    expect(area.value).toContain("guía v31");
    expect(area.value).toContain("nota: el botón no responde");
    expect(area.selectionStart).toBe(0);
    expect(area.selectionEnd).toBe(area.value.length);
    expect(doc.getElementById("rev-estado")!.textContent).toMatch(
      /Cópialo con Cmd\+C/,
    );
  });

  it("sin portapapeles en el navegador pasa lo mismo", () => {
    const { doc } = conRespuestas();
    (doc.getElementById("rev-copiar") as HTMLButtonElement).click();
    const area = doc.getElementById("rev-texto") as HTMLTextAreaElement;
    expect(area.hasAttribute("hidden")).toBe(false);
    expect(area.value).toContain("NO (2)");
  });
});

describe("la guía v31 · lo que entra", () => {
  it("las seis pruebas nuevas existen, son del S21, tienen sentada y la opcional lo dice", () => {
    const { doc } = abrir();
    for (const id of ["m15", "f12", "q25", "q26", "o15", "o16"]) {
      const li = doc.getElementById(id)!;
      expect(li, id).toBeTruthy();
      // La f12 nació en el S21 y se reescribió en el S24 (AI-102): hoy es «Mejorado · S24».
      const reescrita = id === "f12";
      expect(li.getAttribute("data-origen"), id).toBe(
        reescrita ? "mejorado" : "nuevo",
      );
      expect(li.textContent, id).toContain(
        reescrita ? "Mejorado · S24" : "Nuevo · S21",
      );
      expect(li.hasAttribute("data-rev"), `${id}: sentada`).toBe(true);
    }
    expect(doc.getElementById("q26")!.hasAttribute("data-rev-opcional")).toBe(
      true,
    );
    expect(doc.getElementById("q26")!.textContent).toContain("opcional");
    expect(doc.getElementById("q25")!.hasAttribute("data-rev-opcional")).toBe(
      false,
    );
  });

  it("el prefijo de las respuestas es el del sprint (s21) y el filtro «Todo» sigue mostrándolo todo", () => {
    expect(HTML).toContain(`"${NS}"`);
    expect(HTML).not.toContain("guia-hoja-de-vida:s20:");
    const { filas, filtro } = abrir();
    filtro("todo").click();
    expect(filas().every((li) => !li.hasAttribute("hidden"))).toBe(true);
  });
});

/**
 * GUARDAR Y RESTAURAR (S23, OM-35). Tras reiniciar el equipo el navegador del dueño perdió
 * las respuestas de dos sentadas y la guía no dijo nada: se recuperaron del registro a mano.
 * Ahora la guía avisa a la vista si no guarda o está vacía, y «Restaurar desde texto» vuelve
 * a cargar lo que «Copiar mis respuestas» copió, de cualquier versión, casando por id.
 */
describe("la guía v31 · guardar y restaurar", () => {
  /** Copia con el botón y devuelve el texto que quedó en el portapapeles. */
  async function copiar(a: ReturnType<typeof abrir>) {
    let copiado = "";
    Object.defineProperty(a.window.navigator, "clipboard", {
      value: {
        writeText: (t: string) => {
          copiado = t;
          return Promise.resolve();
        },
      },
      configurable: true,
    });
    (a.doc.getElementById("rev-copiar") as HTMLButtonElement).click();
    await new Promise((r) => setTimeout(r, 0));
    return copiado;
  }
  const escribirNota = (
    a: ReturnType<typeof abrir>,
    id: string,
    texto: string,
  ) => {
    const n = a.doc.querySelector<HTMLTextAreaElement>(
      `[data-nota-de="${id}"]`,
    )!;
    n.value = texto;
    n.dispatchEvent(new a.window.Event("input", { bubbles: true }));
  };
  /** El estado de todas las filas con sentada: id → «si|no|» + nota. */
  const foto = (a: ReturnType<typeof abrir>) =>
    Object.fromEntries(
      a
        .filas("ul.pasos li[data-rev]")
        .map((li) => {
          const r = li.querySelector<HTMLInputElement>(
            'input[type="radio"]:checked',
          );
          const n = li.querySelector<HTMLTextAreaElement>("textarea.p-nota");
          const id = (
            li.id || li.querySelector<HTMLInputElement>("input")!.name
          ).toLowerCase();
          return [id, `${r?.value ?? ""}|${n?.value ?? ""}`];
        })
        .filter(([, v]) => v !== "|"),
    );
  const restaurar = (a: ReturnType<typeof abrir>, texto: string) => {
    (a.doc.getElementById("rev-restaurar-abrir") as HTMLButtonElement).click();
    (a.doc.getElementById("rev-restaurar-texto") as HTMLTextAreaElement).value =
      texto;
    (
      a.doc.getElementById("rev-restaurar-aplicar") as HTMLButtonElement
    ).click();
  };
  const aviso = (a: ReturnType<typeof abrir>) =>
    a.doc.getElementById("rev-aviso") as HTMLElement;

  it("copiar → empezar de cero → restaurar da el MISMO estado, con las notas de varias líneas", async () => {
    const a = abrir();
    a.click("a1-no");
    escribirNota(
      a,
      "a1",
      "el botón no responde\nsegunda línea: con dos puntos",
    );
    a.click("a3b-si"); // un sí SIN nota: sin su sección no volvería
    a.click("a5-si");
    escribirNota(a, "a5", "se ve bien");
    a.click("r2-si");
    a.click("r3-no");
    escribirNota(a, "r3", "falla en el teléfono");
    const texto = await copiar(a);
    expect(texto).toMatch(/SÍ SIN NOTA \(\d+\)\n  · .*a3b/);

    const b = abrir(); // otro navegador, o el mismo tras reiniciar: nada guardado
    expect(Object.keys(foto(b))).toEqual([]);
    restaurar(b, texto);
    expect(foto(b)).toEqual(foto(a));
    expect(b.calc("rev-si")).toBe(a.calc("rev-si"));
    expect(b.calc("rev-no")).toBe(a.calc("rev-no"));
    // Y quedó GUARDADO, no solo en pantalla: recargar lo conserva.
    const c = abrir(
      Object.fromEntries(
        Array.from({ length: b.window.localStorage.length }, (_, i) => {
          const k = b.window.localStorage.key(i)!;
          return [k, b.window.localStorage.getItem(k)!];
        }),
      ),
    );
    expect(foto(c)).toEqual(foto(a));
    expect(
      (b.doc.getElementById("rev-restaurar-estado") as HTMLElement).textContent,
    ).toMatch(/Restauradas \d+ de \d+/);
  });

  it("lee el texto de la v21 y de la v22 (sin la sección de los «sí» sin nota)", () => {
    const viejo = [
      "CV Viva · Revisión completa · guía v22",
      "Fecha: 2026-10-24",
      "Totales: 115 pruebas · sí 2 · no 1 · pendientes 112",
      "",
      "NO (1)",
      "  · a1 — Abre la raíz…",
      "      Sentada 1 · en escritorio: la casa y el inglés",
      "      nota: se corta ⏎ en dos",
      "",
      "SÍ CON NOTA (1)",
      "  · a1b — Algo: una nota con: dos puntos",
      "",
      "PENDIENTES (112)",
      "  · Sentada 1: a2",
    ].join("\n");
    const a = abrir();
    restaurar(a, viejo);
    expect((a.doc.getElementById("a1-no") as HTMLInputElement).checked).toBe(
      true,
    );
    expect(
      a.doc.querySelector<HTMLTextAreaElement>('[data-nota-de="a1"]')!.value,
    ).toBe("se corta\nen dos");
    // Un id que la guía ya no tiene se dice, no se inventa.
    expect(
      (a.doc.getElementById("rev-restaurar-estado") as HTMLElement).textContent,
    ).toContain("no encontré: a1b");
  });

  it("avisa a la vista si el navegador no guarda, en cuanto se marca algo", () => {
    const a = abrir(undefined, HTML, { almacenRoto: true });
    a.click("a1-si");
    expect(aviso(a).hasAttribute("hidden")).toBe(false);
    expect(aviso(a).textContent).toContain("no está guardando tus respuestas");
    expect(aviso(a).classList.contains("suave")).toBe(false);
    // Y a la vista por texto, no solo por color.
    expect(aviso(a).textContent).toContain("⚠");
  });

  it("si no hay nada guardado lo dice, con calma, y deja de decirlo al responder", () => {
    const a = abrir();
    expect(aviso(a).hasAttribute("hidden")).toBe(false);
    expect(aviso(a).classList.contains("suave")).toBe(true);
    expect(aviso(a).textContent).toContain("Restaurar desde texto");
    a.click("a1-si");
    expect(aviso(a).hasAttribute("hidden")).toBe(true);
    // Con respuestas guardadas, al abrir no avisa de nada.
    const b = abrir({ [`${NS}a1`]: "si" });
    expect(aviso(b).hasAttribute("hidden")).toBe(true);
  });

  it("una fila reescrita en el S23 vuelve a pendiente y muestra lo que decías (una sola vez por navegador)", () => {
    const a = abrir({ [`${NS}a5`]: "si", [`${NS}a5:nota`]: "todo bien" });
    expect((a.doc.getElementById("a5-si") as HTMLInputElement).checked).toBe(
      false,
    );
    const antes = a.doc.querySelector("#a5 .rev-antes") as HTMLElement;
    expect(antes.textContent).toContain("Antes del S23 respondiste: Sí");
    expect(antes.textContent).toContain("todo bien");
    // Responderla de nuevo quita el recuerdo.
    a.click("a5-no");
    expect(a.doc.querySelector("#a5 .rev-antes")).toBeNull();
    // Una fila que no cambió conserva su respuesta.
    const b = abrir({ [`${NS}a1`]: "no" });
    expect((b.doc.getElementById("a1-no") as HTMLInputElement).checked).toBe(
      true,
    );
    // Ya migrado: la respuesta nueva no se vuelve a mover al recargar.
    const c = abrir({ [`${NS}migrado:23`]: "1", [`${NS}a5`]: "no" });
    expect((c.doc.getElementById("a5-no") as HTMLInputElement).checked).toBe(
      true,
    );
  });

  it("restaurar un texto de la v22 deja las filas reescritas pendientes, a la vista; uno de la v23 las aplica", () => {
    const cuerpo = (version: string) =>
      [
        `CV Viva · Revisión completa · guía ${version}`,
        "Fecha: 2026-10-25",
        "Totales: 1 pruebas · sí 1 · no 0 · pendientes 0",
        "",
        "NO (0)",
        "  ninguno",
        "",
        "SÍ CON NOTA (1)",
        "  · a5 — Baja por la página: algo: orden distinto",
        "",
        "SÍ SIN NOTA (0)",
        "  ninguno",
      ].join("\n");
    const v22 = abrir();
    restaurar(v22, cuerpo("v22"));
    expect((v22.doc.getElementById("a5-si") as HTMLInputElement).checked).toBe(
      false,
    );
    expect(v22.doc.querySelector("#a5 .rev-antes")?.textContent).toContain(
      "orden distinto",
    );
    const v23 = abrir();
    restaurar(v23, cuerpo("v23"));
    expect((v23.doc.getElementById("a5-si") as HTMLInputElement).checked).toBe(
      true,
    );
  });

  it("A2 · una línea de la v22 cuyo título cambió y trae «: » no corta la nota en el sitio equivocado", () => {
    // Así copió la v22 la c1 (la k1b dejó de servir de vehículo: el S26 la reescribió y su respuesta vieja va a «Antes del S26»): el título, truncado con «…», y tras «…: » la nota del dueño.
    const texto = [
      "CV Viva · Revisión completa · guía v22",
      "Fecha: 2026-10-24",
      "",
      "SÍ CON NOTA (1)",
      "  · c1 — 1 min En un hito de la Trayectoria, pulsa «Ver logros completos»: se despliegan los bullets; vuelve a pulsar y se…: MI NOTA c1",
    ].join("\n");
    const a = abrir();
    restaurar(a, texto);
    expect((a.doc.getElementById("c1-si") as HTMLInputElement).checked).toBe(
      true,
    );
    expect(
      a.doc.querySelector<HTMLTextAreaElement>('[data-nota-de="c1"]')!.value,
    ).toBe("MI NOTA c1");
  });

  it("M3 · el aviso de que no guarda se ve bajo CUALQUIER filtro, no solo en «Revisión completa»", () => {
    const a = abrir(undefined, HTML, { almacenRoto: true });
    a.filtro("ensayo").click();
    a.click("r1-si");
    expect(aviso(a).hasAttribute("hidden")).toBe(false);
    // Ningún ancestro lo esconde: el aviso vive fuera de la sección que el filtro oculta.
    expect(aviso(a).closest("[hidden]")).toBeNull();
    expect(aviso(a).textContent).toContain("no está guardando tus respuestas");
  });
});

describe("la guía v31 · las frases que el sprint dejó falsas", () => {
  it("A1 · fuera del historial, nada dice que «Métodos» está entre el portafolio y los Estudios", () => {
    const vigente = HTML.slice(
      0,
      HTML.indexOf("<summary>Historial de la guía</summary>"),
    );
    expect(vigente.length).toBeGreaterThan(10_000);
    expect(vigente).not.toMatch(
      /entre\s+(?:el|la)\s+(?:portafolio|vitrina)\s+y\s+los\s+Estudios/i,
    );
  });

  it("A1 · las dos filas que lo decían (R10 y q24) están reescritas, dicen dónde está hoy y llevan «Mejorado · S23»", () => {
    const { doc } = abrir();
    for (const id of ["q24"]) {
      const li = doc.getElementById(id)!;
      expect(li.getAttribute("data-cambio"), id).toBe("23");
      expect(li.getAttribute("data-origen"), id).toBe("mejorado");
      expect(li.textContent, id).toMatch(/después de Skills/);
    }
    // R10 no tiene id propio: es la fila que cubre q2, q7 y q24.
    const r10 = [...doc.querySelectorAll<HTMLElement>("li[data-cubre]")].find(
      (li) => li.getAttribute("data-cubre") === "q2 q7 q24",
    )!;
    expect(r10.getAttribute("data-cambio")).toBe("23");
    expect(r10.getAttribute("data-origen")).toBe("mejorado");
    expect(r10.textContent).toMatch(/después de Skills/);
  });
});

/**
 * S24 (el chat). Ocho filas cambiaron de texto: R6, f2, f9, f12, o1, o9, o10 y n8. Vuelven a
 * pendiente y muestran lo que el dueño había respondido («Antes del S24»). La
 * migración ya no está escrita para UNA versión: cada `data-cambio="N"` tiene su marca
 * `migrado:N`, y la v24 no mueve dos veces lo de la v23 ni se salta lo suyo.
 */
describe("la guía S24 · las filas del chat", () => {
  const FILAS_DEL_S24 = ["f2", "f9", "f12", "o1", "o9", "o10", "n8"];

  it("f2, f9, f12, o9, o10 y n8 llevan data-cambio 24 y «Mejorado · S24»; la R6 la volvió a reescribir el S25 y la o1 el S27", () => {
    const a = abrir();
    const r6 = a
      .filas()
      .find((li) =>
        li.textContent?.includes("R6 · El chat, como visitante nuevo"),
      );
    expect(r6?.getAttribute("data-cambio")).toBe("25");
    expect(r6?.textContent).toContain("Mejorado · S25");
    for (const id of FILAS_DEL_S24) {
      const li = a.doc.getElementById(id) as HTMLElement;
      const delS27 = id === "o1";
      expect(li.getAttribute("data-cambio"), id).toBe(delS27 ? "27" : "24");
      expect(li.getAttribute("data-origen"), id).toBe("mejorado");
      expect(li.textContent, id).toContain(
        delS27 ? "Mejorado · S27" : "Mejorado · S24",
      );
    }
  });

  it("las filas de la v23 que no cambiaron en el S24 siguen siendo de la v23", () => {
    const a = abrir();
    // La h3 la reescribió después el S28 (el brochure) y la a2 y la a8 el S29: ya viven allí.
    for (const id of ["a3b", "a5", "a6", "b1", "q24"]) {
      expect(a.doc.getElementById(id)?.getAttribute("data-cambio"), id).toBe(
        "23",
      );
    }
  });

  it("la R6 pasa de 12 a 13 minutos (el tope de la tanda 1 del ensayo es 45) y la sentada 3 sigue dentro de los 45", () => {
    const a = abrir();
    const r6 = a
      .filas()
      .find((li) =>
        li.textContent?.includes("R6 · El chat, como visitante nuevo"),
      )!;
    expect(minutos(r6)).toBe(13);
    expect(r6.querySelector(".ens-min")?.textContent).toBe("13 min");
    const min = Number(a.calc("rev-s3-min"));
    expect(min, "minutos de la sentada 3").toBeGreaterThan(38);
    expect(min).toBeLessThanOrEqual(LIMITE);
  });

  it("una fila reescrita en el S24 vuelve a pendiente y muestra «Antes del S24» (una sola vez)", () => {
    const a = abrir({ [`${NS}f2`]: "si", [`${NS}f2:nota`]: "se veía bien" });
    expect((a.doc.getElementById("f2-si") as HTMLInputElement).checked).toBe(
      false,
    );
    const antes = a.doc.querySelector("#f2 .rev-antes") as HTMLElement;
    expect(antes.textContent).toContain("Antes del S24 respondiste: Sí");
    expect(antes.textContent).toContain("se veía bien");
    // Ya migrado: la respuesta nueva no se vuelve a mover al recargar.
    const b = abrir({ [`${NS}migrado:24`]: "1", [`${NS}f2`]: "no" });
    expect((b.doc.getElementById("f2-no") as HTMLInputElement).checked).toBe(
      true,
    );
  });

  it("quien ya migró la v23 migra la v24: la marca 23 no impide la 24, y a5 no se mueve dos veces", () => {
    const a = abrir({
      [`${NS}migrado:23`]: "1",
      [`${NS}a5`]: "si", // respondida DESPUÉS de la v23: no se mueve
      [`${NS}o9`]: "si", // era de la v23 y en la v24 vuelve a cambiar: se mueve
    });
    expect((a.doc.getElementById("a5-si") as HTMLInputElement).checked).toBe(
      true,
    );
    expect(a.doc.querySelector("#a5 .rev-antes")).toBeNull();
    expect((a.doc.getElementById("o9-si") as HTMLInputElement).checked).toBe(
      false,
    );
    expect(a.doc.querySelector("#o9 .rev-antes")?.textContent).toContain(
      "Antes del S24",
    );
    expect(a.window.localStorage.getItem(`${NS}migrado:24`)).toBe("1");
  });

  it("restaurar un texto de la v23 deja pendientes las filas del S24 y aplica las demás", () => {
    const texto = [
      "CV Viva · Revisión completa · guía v23",
      "Fecha: 2026-10-25",
      "",
      "SÍ SIN NOTA",
      "  a1 · sí",
      "  f2 · sí",
    ].join("\n");
    const a = abrir();
    const area = a.doc.querySelector<HTMLTextAreaElement>(
      "#rev-restaurar-texto, textarea[data-restaurar]",
    );
    if (!area) return; // la forma del restaurador la prueba el bloque «guardar y restaurar»
    area.value = texto;
  });

  it("las frases que el S24 dejó falsas: ninguna fila viva dice «Avísame» ni «Recibí tu aviso»", () => {
    const a = abrir();
    const vivas = a.filas().map((li) => ({
      id: li.id || li.textContent?.slice(0, 20),
      t: li.textContent ?? "",
    }));
    const caducas = vivas
      .filter((f) =>
        /Algo no funciona\? Avísame|Recibí tu aviso|Te escribo a|Pregúntale a mi HV|respuesta\s+suena a\s+ti|la declina el modelo|deja\s+pasar a propósito/.test(
          f.t,
        ),
      )
      .map((f) => f.id);
    expect(
      caducas,
      "filas con el botón o el mensaje del chat de antes del S24",
    ).toEqual([]);
  });
});

/**
 * S25 (el CV dice lo que pasó). Doce filas cambiaron de texto: R3, R4, R6, c2, c3, a10, d1, d3, g1d,
 * o1, q20 y q22. Vuelven a pendiente y muestran lo que el dueño había respondido («Antes del
 * S25»). Las del S24 que no se tocaron siguen siendo del S24: la migración es por versión.
 */
describe("la guía v31 · el CV, los casos y el PDF", () => {
  // La o1 también era del S25: la reescribió el S27 y ya vive allí.
  // La a10 la reescribió después el S29 (los Logros son doce): ya vive allí.
  // La g1d la reescribió después el S31 (el roadmap vive en «Úsala»): ya vive allí.
  const FILAS_DEL_S25 = ["c2", "c3", "d1", "d3", "q20", "q22"];
  const FLUJOS_DEL_S25 = [
    "R3 · Dos casos de estudio",
    "R4 · El CV en PDF",
    "R6 · El chat, como visitante nuevo",
  ];

  it("las once filas llevan data-cambio 25, «mejorado» y «Mejorado · S25»", () => {
    const a = abrir();
    for (const id of FILAS_DEL_S25) {
      const li = a.doc.getElementById(id) as HTMLElement;
      expect(li.getAttribute("data-cambio"), id).toBe("25");
      expect(li.getAttribute("data-origen"), id).toBe("mejorado");
      expect(li.textContent, id).toContain("Mejorado · S25");
    }
    for (const titulo of FLUJOS_DEL_S25) {
      const li = a.filas().find((x) => x.textContent?.includes(titulo))!;
      expect(li.getAttribute("data-cambio"), titulo).toBe("25");
      expect(li.textContent, titulo).toContain("Mejorado · S25");
    }
  });

  it("las filas del S24 que no se tocaron siguen siendo del S24 (la migración no las mueve dos veces)", () => {
    const a = abrir();
    for (const id of ["f2", "f9", "f12", "o9", "o10", "n8"]) {
      expect(a.doc.getElementById(id)?.getAttribute("data-cambio"), id).toBe(
        "24",
      );
    }
  });

  it("una fila reescrita en el S25 vuelve a pendiente y muestra «Antes del S25» (una sola vez)", () => {
    const a = abrir({
      [`${NS}migrado:24`]: "1",
      [`${NS}d1`]: "si",
      [`${NS}d1:nota`]: "dos páginas, bien",
      [`${NS}f2`]: "si", // del S24, ya migrado: no se mueve
    });
    expect((a.doc.getElementById("d1-si") as HTMLInputElement).checked).toBe(
      false,
    );
    const antes = a.doc.querySelector("#d1 .rev-antes") as HTMLElement;
    expect(antes.textContent).toContain("Antes del S25 respondiste: Sí");
    expect(antes.textContent).toContain("dos páginas, bien");
    expect((a.doc.getElementById("f2-si") as HTMLInputElement).checked).toBe(
      true,
    );
    // Ya migrado: la respuesta nueva no se vuelve a mover al recargar.
    const b = abrir({ [`${NS}migrado:25`]: "1", [`${NS}d1`]: "no" });
    expect((b.doc.getElementById("d1-no") as HTMLInputElement).checked).toBe(
      true,
    );
  });

  it("la sentada 2 sigue dentro de los 45 minutos con la tercera hoja del PDF (d1 pasa de 2 a 3)", () => {
    const a = abrir();
    expect(minutos(a.doc.getElementById("d1") as HTMLElement)).toBe(3);
    const min = Number(a.calc("rev-s2-min"));
    expect(min, "minutos de la sentada 2").toBeGreaterThan(0);
    expect(min).toBeLessThanOrEqual(LIMITE);
  });

  it("las frases que el S25 dejó falsas: ninguna fila viva dice «dos páginas», «los ocho», «Proyectos propios no lo tiene» ni los viejos modelos", () => {
    const a = abrir();
    const vivas = a.filas().map((li) => ({
      id: li.id || li.textContent?.slice(0, 24),
      t: li.textContent ?? "",
    }));
    const caducas = vivas
      .filter((f) =>
        /dos páginas exactas|Sigue siendo de dos páginas|sigue en dos páginas|«1 \/ 2»|Proyectos propios no lo tiene|Juicio de contenido de los ocho|integraciones en VB[A] de Cafam|fuga, mora y\s+riesg[o]/.test(
          f.t.replace(/\s+/g, " "),
        ),
      )
      .map((f) => f.id);
    expect(caducas, "filas con la frase de antes del S25").toEqual([]);
  });
});

/**
 * S26 (las fichas de las apps, a la altura). Ocho filas cambiaron de texto: k1b, k10, k11, k13, k15f, k17, l6 y m6. Vuelven a
 * pendiente y muestran lo que el dueño había respondido («Antes del S26»). Las del S25 siguen siendo del S25: la
 * migración es por versión y no las mueve dos veces.
 */
describe("la guía v26 · las fichas de las apps", () => {
  // El S27 reescribió después la k15f y la k17 (y la k6, la o1) y el S28 la k10 y la l6: ya viven allí. Del S26 quedan cuatro.
  // La k1b la reescribió después el S29 (Investigaciones al final): ya vive allí.
  const FILAS_DEL_S26 = ["k11", "k13", "m6"];

  it("las cuatro filas que siguen siendo del S26 llevan data-cambio 26, «mejorado» y «Mejorado · S26»", () => {
    const a = abrir();
    for (const id of FILAS_DEL_S26) {
      const li = a.doc.getElementById(id) as HTMLElement;
      expect(li.getAttribute("data-cambio"), id).toBe("26");
      expect(li.getAttribute("data-origen"), id).toBe("mejorado");
      expect(li.textContent, id).toContain("Mejorado · S26");
    }
    expect(a.doc.querySelectorAll('[data-cambio="26"]').length).toBe(
      FILAS_DEL_S26.length,
    );
  });

  it("las frases que el sprint dejó falsas ya no están: k17 ya no dice que planlang y Big-D no traen «Cómo funciona», k11 no dice «declarado por CV Viva»", () => {
    const a = abrir();
    const k17 = a.doc.getElementById("k17")!.textContent ?? "";
    expect(k17).not.toMatch(/no tienen el bloque/);
    expect(k17).not.toMatch(/solo las seis apps/);
    // La tarjeta del escaparate ya no lleva una tira dibujada sino la portada de la app (Innmobiliaria conserva la tira
    // hasta que llegue su entrega): las dos filas que describían el escaparate no pueden seguir diciendo «dibujada».
    for (const id of ["k1b", "k15f"]) {
      const texto = (a.doc.getElementById(id)!.textContent ?? "").replace(
        /\s+/g,
        " ",
      );
      expect(texto, id).toContain("portada");
      expect(texto, id).not.toMatch(/su tira dibujada|un esquema dibujado/);
    }
    expect(a.doc.getElementById("k11")!.textContent).not.toContain(
      "declarado por CV Viva",
    );
    expect(a.doc.getElementById("k13")!.textContent).not.toMatch(
      /derivó CV Viva/,
    );
  });

  it("las filas del S25 que no se tocaron siguen siendo del S25 (la migración no las mueve dos veces)", () => {
    const a = abrir();
    for (const id of ["c2", "c3", "d1", "d3", "q20", "q22"]) {
      expect(a.doc.getElementById(id)?.getAttribute("data-cambio"), id).toBe(
        "25",
      );
    }
  });

  it("lo que respondió el dueño en una fila reescrita por el S26 pasa a «Antes del S26» y la fila vuelve a pendiente", () => {
    const a = abrir({ [NS + "k11"]: "si", [NS + "k11:nota"]: "se veía bien" });
    const k11 = a.doc.getElementById("k11") as HTMLElement;
    expect(
      (k11.querySelector('input[value="si"]') as HTMLInputElement).checked,
    ).toBe(false);
    expect(k11.textContent).toContain("Antes del S26 respondiste: Sí");
    expect(k11.textContent).toContain("se veía bien");
  });
});

/**
 * S27 (las diez fichas al día y Vesting con su respuesta fija). Cuatro filas cambiaron de texto: k6 (las descartadas ya no se
 * pintan), k15f (el orden de las profesionales y la portada de las diez), k17 (los cruces entre filas de «Cómo funciona») y o1
 * (la salida de Vesting es una respuesta fija). Vuelven a pendiente y muestran lo que el dueño había respondido («Antes del S27»).
 * Las del S26 que no se tocaron siguen siendo del S26: la migración es por versión y no las mueve dos veces.
 */
describe("la guía v31 · las diez fichas al día y Vesting", () => {
  // El S28 reescribió después la k6 (las descartadas, ahora en el brochure) y el S31 la k17 (ninguna app tiene ficha): ya viven allí.
  const FILAS_DEL_S27 = ["k15f", "o1"];

  it("las dos filas que siguen siendo del S27 llevan data-cambio 27, «mejorado» y «Mejorado · S27»", () => {
    const a = abrir();
    for (const id of FILAS_DEL_S27) {
      const li = a.doc.getElementById(id) as HTMLElement;
      expect(li.getAttribute("data-cambio"), id).toBe("27");
      expect(li.getAttribute("data-origen"), id).toBe("mejorado");
      expect(li.textContent, id).toContain("Mejorado · S27");
    }
    expect(a.doc.querySelectorAll('[data-cambio="27"]').length).toBe(
      FILAS_DEL_S27.length,
    );
  });

  it("las frases que el sprint dejó falsas ya no están: k15f no dice el orden de antes ni «solo Innmobiliaria», o1 no dice que responde «con la prosa»", () => {
    const a = abrir();
    const texto = (id: string) =>
      (a.doc.getElementById(id)!.textContent ?? "").replace(/\s+/g, " ");
    expect(texto("k15f")).not.toContain("solo Innmobiliaria conserva");
    expect(texto("k15f")).not.toContain(
      "Probeta DS · Dash Agent · Anonimizador Velo",
    );
    // El orden del YAML (OM-27) está escrito en la fila, tal cual.
    expect(texto("k15f")).toContain(
      "Probeta DS · planlang · HackGuard · Anonimizador Velo · Big-D · Dash Agent · AngelGhost",
    );
    expect(texto("o1")).toContain("una respuesta fija, sin modelo");
    expect(texto("o1")).not.toContain(
      "La de Vesting cuenta cómo cerró la etapa",
    );
  });

  it("las filas del S26 que no se tocaron siguen siendo del S26 (la migración no las mueve dos veces)", () => {
    const a = abrir();
    for (const id of ["k11", "k13", "m6"]) {
      expect(a.doc.getElementById(id)?.getAttribute("data-cambio"), id).toBe(
        "26",
      );
    }
  });

  it("lo que respondió el dueño en una fila reescrita por el S27 pasa a «Antes del S27»; una del S26 ya migrada no se mueve", () => {
    const a = abrir({
      [NS + "migrado:26"]: "1",
      [NS + "k15f"]: "si",
      [NS + "k15f:nota"]: "el orden se veía bien",
      [NS + "k11"]: "si", // del S26, ya migrado: se queda como estaba
    });
    const k15f = a.doc.getElementById("k15f") as HTMLElement;
    expect(
      (k15f.querySelector('input[value="si"]') as HTMLInputElement).checked,
    ).toBe(false);
    expect(k15f.textContent).toContain("Antes del S27 respondiste: Sí");
    expect(k15f.textContent).toContain("el orden se veía bien");
    expect(
      (
        a.doc
          .getElementById("k11")!
          .querySelector('input[value="si"]') as HTMLInputElement
      ).checked,
    ).toBe(true);
  });
});

/**
 * S28 (el brochure de las doce y la puerta de la HOME). Salen las cuatro pruebas de la «apertura por lectura» (las tarjetas que se
 * abrían solas se fueron con el detalle); entran ocho pruebas nuevas del brochure; y trece filas y el flujo R8 cambian de texto:
 * h1 a h4, k2, k6, k10, m3, l5b, l6, l7, a4 y n4b (las dos últimas las reescribió después el S29). Vuelven a pendiente y muestran lo que el dueño había respondido («Antes del S28»).
 */
describe("la guía v31 · el brochure de las doce y la puerta de la HOME", () => {
  // La h3 y la m3 las reescribió después el S31 (ninguna app tiene ficha): ya viven allí.
  const FILAS_DEL_S28 = ["h1", "h4", "k6", "k10", "l6", "l7"];
  const FILAS_NUEVAS = ["h5", "h6", "h7", "h8", "h9", "h10", "h11", "h12"];

  it("las filas que el S29 y el S30 no volvieron a tocar llevan data-cambio 28, «mejorado» y «Mejorado · S28»", () => {
    const a = abrir();
    for (const id of FILAS_DEL_S28) {
      const li = a.doc.getElementById(id) as HTMLElement;
      expect(li.getAttribute("data-cambio"), id).toBe("28");
      expect(li.getAttribute("data-origen"), id).toBe("mejorado");
      expect(li.textContent, id).toContain("Mejorado · S28");
    }
    // Las ocho filas (la a4 y la n4b las reescribió después el S29, y la h2, la k2 y la l5b, el S30) y el flujo R8 (que recorre el portafolio de apps) son las únicas del S28.
    const conCambio = [...a.doc.querySelectorAll('[data-cambio="28"]')];
    expect(conCambio.length).toBe(FILAS_DEL_S28.length + 1);
    expect(
      a.doc.querySelector('li[data-ensayo="9"]')?.getAttribute("data-cambio"),
    ).toBe("28");
  });

  it("las ocho pruebas nuevas existen, son del S28, tienen sentada y minutos, y la ⭐ de fidelidad está entre ellas", () => {
    const a = abrir();
    for (const id of FILAS_NUEVAS) {
      const li = a.doc.getElementById(id) as HTMLElement;
      expect(li, id).not.toBeNull();
      // La h10 la reescribió después el S31 (su destino es la entrada): conserva «Nuevo · S28» y suma «Mejorado · S31».
      expect(li.getAttribute("data-origen"), id).toBe(
        id === "h10" ? "mejorado" : "nuevo",
      );
      expect(li.textContent, id).toContain("Nuevo · S28");
      expect(Number(li.getAttribute("data-rev")), id).toBeGreaterThan(0);
      expect(Number(li.getAttribute("data-rev-min")), id).toBeGreaterThan(0);
    }
    expect(a.doc.getElementById("h11")!.textContent).toContain(
      "Fidelidad con la maqueta",
    );
    // La del teléfono va a la sentada del teléfono; las demás, a la del portafolio de apps.
    expect(a.doc.getElementById("h12")!.getAttribute("data-rev")).toBe("8");
    for (const id of FILAS_NUEVAS.filter((x) => x !== "h12"))
      expect(a.doc.getElementById(id)!.getAttribute("data-rev"), id).toBe("4");
  });

  it("las pruebas de la «apertura por lectura» ya no están: l1 a l4 salen con las tarjetas que se abrían solas", () => {
    const a = abrir();
    for (const id of ["l1", "l2", "l3", "l4"])
      expect(a.doc.getElementById(id), id).toBeNull();
  });

  it("las frases que el sprint dejó falsas ya no están: ninguna fila viva manda a la «ficha completa», al detalle, a «Qué tiene» ni a las tarjetas que se abren solas", () => {
    const a = abrir();
    const vivas = [...a.doc.querySelectorAll("ul.pasos li[id]")].filter(
      (li) => !li.closest("#revision-fuera-lista"),
    );
    for (const li of vivas) {
      const texto = (li.querySelector(".p-texto")?.textContent ?? "").replace(
        /\s+/g,
        " ",
      );
      expect(texto, li.id).not.toMatch(
        /Ver la ficha completa|Los detalles finos|se abren solas|\(<code>…\/detalle<\/code>\)/,
      );
      expect(texto, li.id).not.toMatch(/\/es\/apps\/fabric/);
    }
    // k10 dice «Qué aporta» y avisa de que antes se llamaba «Qué tiene».
    expect(a.doc.getElementById("k10")!.textContent).toContain("Qué aporta");
    // La puerta de la HOME ya no habla de cajas ni del chip que se encoge.
    const n4b = (a.doc.getElementById("n4b")!.textContent ?? "").replace(
      /\s+/g,
      " ",
    );
    expect(n4b).toContain("puerta");
    expect(n4b).not.toContain("cuatro cajas");
    expect(a.doc.getElementById("a4")!.textContent).not.toContain(
      "se encoge a su tamaño",
    );
  });

  it("lo que respondió el dueño en una fila reescrita por el S28 pasa a «Antes del S28»; una del S27 ya migrada no se mueve", () => {
    const a = abrir({
      [NS + "migrado:27"]: "1",
      [NS + "k6"]: "si",
      [NS + "k6:nota"]: "el botón de la ficha completa estaba bien",
      [NS + "k15f"]: "si", // del S27, ya migrado: se queda como estaba
    });
    const k6 = a.doc.getElementById("k6") as HTMLElement;
    expect(
      (k6.querySelector('input[value="si"]') as HTMLInputElement).checked,
    ).toBe(false);
    expect(k6.textContent).toContain("Antes del S28 respondiste: Sí");
    expect(k6.textContent).toContain(
      "el botón de la ficha completa estaba bien",
    );
    expect(
      (
        a.doc
          .getElementById("k15f")!
          .querySelector('input[value="si"]') as HTMLInputElement
      ).checked,
    ).toBe(true);
  });

  it("la sentada del portafolio sigue dentro de los 45 minutos con las pruebas nuevas", () => {
    const a = abrir();
    const min = [...a.doc.querySelectorAll('li[data-rev="4"]')].reduce(
      (t, li) => t + Number(li.getAttribute("data-rev-min") ?? 0),
      0,
    );
    expect(min).toBeGreaterThan(0);
    expect(min).toBeLessThanOrEqual(45);
  });
});

/**
 * S29 (Skills como explorador, los doce logros y el portafolio en su orden). Entran tres pruebas nuevas (n12 el teclado y el movimiento
 * reducido, n13 el dedo en el teléfono, n14 la fidelidad con las maquetas); once filas y el flujo R1 cambian de texto: a2, a4, a8, a10, f1,
 * k1b, n4b, n5, n6, n7 y n10. Vuelven a pendiente y muestran lo que el dueño había respondido («Antes del S29»).
 */
describe("la guía v31 · Skills como explorador y los doce logros", () => {
  const FILAS_DEL_S29 = [
    "a2",
    "a4",
    "a8",
    "a10",
    "f1",
    "k1b",
    "n4b",
    "n5",
    "n6",
    "n7",
    "n10",
  ];
  const FILAS_NUEVAS = ["n12", "n13", "n14"];

  it("las filas reescritas llevan data-cambio 29, «mejorado» y «Mejorado · S29»", () => {
    const a = abrir();
    for (const id of FILAS_DEL_S29) {
      const li = a.doc.getElementById(id) as HTMLElement;
      expect(li.getAttribute("data-cambio"), id).toBe("29");
      expect(li.getAttribute("data-origen"), id).toBe("mejorado");
      expect(li.textContent, id).toContain("Mejorado · S29");
    }
    // Las once filas y el flujo R1 (la HOME de punta a punta) son las únicas del S29.
    const conCambio = [...a.doc.querySelectorAll('[data-cambio="29"]')];
    expect(conCambio.length).toBe(FILAS_DEL_S29.length + 1);
    const r1 = a
      .filas()
      .find((li) => li.textContent?.includes("R1 · La HOME de punta a punta"));
    expect(r1?.getAttribute("data-cambio")).toBe("29");
    expect(r1?.textContent).toContain("explorador");
  });

  it("las tres pruebas nuevas existen, son del S29 y tienen sentada y minutos: el teclado en la de accesibilidad, el dedo en la del teléfono y la fidelidad en la de la HOME", () => {
    const a = abrir();
    for (const id of FILAS_NUEVAS) {
      const li = a.doc.getElementById(id) as HTMLElement;
      expect(li, id).not.toBeNull();
      expect(li.getAttribute("data-origen"), id).toBe("nuevo");
      expect(li.textContent, id).toContain("Nuevo · S29");
      expect(Number(li.getAttribute("data-rev-min")), id).toBeGreaterThan(0);
    }
    expect(a.doc.getElementById("n12")!.getAttribute("data-rev")).toBe("7");
    expect(a.doc.getElementById("n13")!.getAttribute("data-rev")).toBe("8");
    expect(a.doc.getElementById("n14")!.getAttribute("data-rev")).toBe("1");
    expect(a.doc.getElementById("n14")!.textContent).toContain(
      "Fidelidad con las maquetas",
    );
  });

  it("las frases que el sprint dejó falsas ya no están: ocho logros, dos filas de cuatro, el logro de las certificaciones, el trazo de los iconos, las cajas en el orden viejo", () => {
    const a = abrir();
    const vigente = HTML.slice(
      0,
      HTML.indexOf("<summary>Historial de la guía</summary>"),
    );
    const vivas = [...a.doc.querySelectorAll("ul.pasos li[id]")].filter(
      (li) => !li.closest("#revision-fuera-lista"),
    );
    for (const li of vivas) {
      const texto = (li.querySelector(".p-texto")?.textContent ?? "").replace(
        /\s+/g,
        " ",
      );
      expect(texto, li.id).not.toMatch(
        /Logros son ocho|dos filas de cuatro|3 certificaciones profesionales|aterriza vacía|el trazo (?:del icono )?se dibuja|se termina de dibujar|aparecen ya dibujados|Apps · Agentes especializados · Investigaciones · Tableros|25\+<\/strong> productos/,
      );
    }
    expect(vigente).not.toMatch(/Logros son ocho/);
    // El portal y la puerta de la HOME nombran Investigaciones al final.
    const orden = (a.doc.getElementById("k1b")!.textContent ?? "").replace(
      /\s+/g,
      " ",
    );
    expect(orden.indexOf("Tableros de datos")).toBeGreaterThan(0);
    expect(orden.indexOf("Investigaciones")).toBeGreaterThan(
      orden.indexOf("Tableros de datos"),
    );
    // La cita del chat abre el área en el explorador: f1 ya no dice «su tarjeta de Skills, con el título a la vista».
    expect(a.doc.getElementById("f1")!.textContent).toContain("su área");
    // Las cifras de a8 y de a10 son las de Logros hoy.
    expect(a.doc.getElementById("a8")!.textContent).toContain("45+");
    expect(a.doc.getElementById("a10")!.textContent).toContain("45+");
  });

  it("lo que respondió el dueño en una fila reescrita por el S29 pasa a «Antes del S29»; una del S28 ya migrada no se mueve", () => {
    const a = abrir({
      [NS + "migrado:28"]: "1",
      [NS + "n6"]: "si",
      [NS + "n6:nota"]: "las tarjetas con el trazo se veían bien",
      [NS + "k6"]: "si", // del S28, ya migrado: se queda como estaba
    });
    const n6 = a.doc.getElementById("n6") as HTMLElement;
    expect(
      (n6.querySelector('input[value="si"]') as HTMLInputElement).checked,
    ).toBe(false);
    expect(n6.textContent).toContain("Antes del S29 respondiste: Sí");
    expect(n6.textContent).toContain("las tarjetas con el trazo se veían bien");
    expect(
      (
        a.doc
          .getElementById("k6")!
          .querySelector('input[value="si"]') as HTMLInputElement
      ).checked,
    ).toBe(true);
  });

  it("las sentadas que recibieron pruebas (1, 7 y 8) siguen dentro de los 45 minutos", () => {
    const a = abrir();
    for (const n of [1, 7, 8]) {
      const min = [...a.doc.querySelectorAll(`li[data-rev="${n}"]`)].reduce(
        (t, li) => t + Number(li.getAttribute("data-rev-min") ?? 0),
        0,
      );
      expect(min, `sentada ${n}`).toBeGreaterThan(0);
      // La suma la hace la página (las filas y los flujos R de la sentada): ninguna pasa del límite.
      expect(
        Number(a.calc(`rev-s${n}-min`)),
        `sentada ${n}`,
      ).toBeLessThanOrEqual(LIMITE);
    }
  });
});

/**
 * S30 (el brochure como entrada de las apps y «Úsala»). Entran cinco pruebas nuevas (n15 la entrada, n16 «Úsala» de una app, n17 el
 * roadmap, la simulación y la impresión, n18 la casa en sus dos idiomas y n19 la fidelidad ⭐); tres filas cambian de texto, h2, k2 y l5b.
 * Vuelven a pendiente y muestran lo que el dueño había respondido («Antes del S30»).
 */
describe("la guía v31 · el brochure como entrada de las apps y «Úsala»", () => {
  // La k2 y la l5b las reescribió después el S31 (las diez abren en su brochure): ya viven allí.
  const FILAS_DEL_S30 = ["h2"];
  const FILAS_NUEVAS = ["n15", "n16", "n17", "n18", "n19"];

  it("las filas que el S31 no volvió a tocar llevan data-cambio 30, «mejorado» y «Mejorado · S30»", () => {
    const a = abrir();
    for (const id of FILAS_DEL_S30) {
      const li = a.doc.getElementById(id) as HTMLElement;
      expect(li.getAttribute("data-cambio"), id).toBe("30");
      expect(li.getAttribute("data-origen"), id).toBe("mejorado");
      expect(li.textContent, id).toContain("Mejorado · S30");
    }
    // Solo esa: ninguna otra fila ni flujo se reescribió en el S30 sin que el S31 la volviera a tocar.
    expect(a.doc.querySelectorAll('[data-cambio="30"]').length).toBe(
      FILAS_DEL_S30.length,
    );
  });

  it("las cinco pruebas nuevas existen, son del S30 y tienen sentada y minutos: la casa en la primera, el roadmap y la lista de espera en la del chat, y la entrada y la fidelidad en la del portafolio de apps", () => {
    const a = abrir();
    for (const id of FILAS_NUEVAS) {
      const li = a.doc.getElementById(id) as HTMLElement;
      expect(li, id).not.toBeNull();
      // La n15 y la n17 las reescribió después el S31: conservan «Nuevo · S30» y suman «Mejorado · S31».
      expect(li.getAttribute("data-origen"), id).toBe(
        id === "n15" || id === "n17" ? "mejorado" : "nuevo",
      );
      expect(li.textContent, id).toContain("Nuevo · S30");
      expect(Number(li.getAttribute("data-rev-min")), id).toBeGreaterThan(0);
    }
    expect(a.doc.getElementById("n18")!.getAttribute("data-rev")).toBe("1");
    for (const id of ["n16", "n17"])
      expect(a.doc.getElementById(id)!.getAttribute("data-rev"), id).toBe("3");
    for (const id of ["n15", "n19"])
      expect(a.doc.getElementById(id)!.getAttribute("data-rev"), id).toBe("4");
    expect(a.doc.getElementById("n19")!.textContent).toContain(
      "Fidelidad de «Úsala» con la maqueta",
    );
  });

  it("las frases que el sprint dejó falsas ya no están: ninguna fila viva manda a «la lista de espera de la ficha» desde el brochure ni usa el nombre inglés de antes", () => {
    const a = abrir();
    const vivas = [...a.doc.querySelectorAll("ul.pasos li[id]")].filter(
      (li) => !li.closest("#revision-fuera-lista"),
    );
    for (const li of vivas) {
      const texto = (li.querySelector(".p-texto")?.textContent ?? "").replace(
        /\s+/g,
        " ",
      );
      expect(texto, li.id).not.toMatch(
        new RegExp(
          `último botón lleva a la lista de espera de la ficha|recorre las diez fichas|${["Living", "CV"].join(" ")}`,
        ),
      );
    }
    expect(a.doc.getElementById("h2")!.textContent).toContain("05 Úsala");
    expect(a.doc.getElementById("h2")!.textContent).toContain("Escríbeme");
    // S31: ninguna app abre ya en su ficha, así que la aprobación visual recorre el brochure de las diez.
    expect(a.doc.getElementById("l5b")!.textContent).toContain(
      "recorre el brochure de las diez apps",
    );
  });

  it("n15 a n17 piden lo que la CI prueba, con las direcciones y los números de hoy (las once ideas de HackGuard, la simulación de planlang)", () => {
    const a = abrir();
    const n15 = a.doc.getElementById("n15")!.textContent ?? "";
    for (const ruta of [
      "/es/portafolio/apps/inmobiliaria",
      "/es/portafolio/apps/ds",
      // Las rutas retiradas no se escriben enteras en el código (`rutas-retiradas.test.ts`): sus dos tramos.
      "ds/brochure",
      "ds/detalle",
    ])
      expect(n15, ruta).toContain(ruta);
    const n17 = a.doc.getElementById("n17")!.textContent ?? "";
    expect(n17).toContain("Ver las 11 ideas");
    expect(n17).toContain("Ver la simulación");
    expect(a.doc.getElementById("n16")!.textContent).toContain(
      "Avísame cuando abra",
    );
  });

  it("lo que respondió el dueño en una fila reescrita por el S30 pasa a «Antes del S30»; una del S29 ya migrada no se mueve", () => {
    const a = abrir({
      [NS + "migrado:29"]: "1",
      [NS + "h2"]: "si",
      [NS + "h2:nota"]: "el último botón llevaba a la lista",
      [NS + "n6"]: "si", // del S29, ya migrado: se queda como estaba
    });
    const h2 = a.doc.getElementById("h2") as HTMLElement;
    expect(
      (h2.querySelector('input[value="si"]') as HTMLInputElement).checked,
    ).toBe(false);
    expect(h2.textContent).toContain("Antes del S30 respondiste: Sí");
    expect(h2.textContent).toContain("el último botón llevaba a la lista");
    expect(
      (
        a.doc
          .getElementById("n6")!
          .querySelector('input[value="si"]') as HTMLInputElement
      ).checked,
    ).toBe(true);
  });

  it("las sentadas que recibieron pruebas (1, 3 y 4) siguen dentro de los 45 minutos, sumadas por la página", () => {
    const a = abrir();
    for (const n of [1, 3, 4]) {
      const min = [...a.doc.querySelectorAll(`li[data-rev="${n}"]`)].reduce(
        (t, li) => t + Number(li.getAttribute("data-rev-min") ?? 0),
        0,
      );
      expect(min, `sentada ${n}`).toBeGreaterThan(0);
      expect(
        Number(a.calc(`rev-s${n}-min`)),
        `sentada ${n}`,
      ).toBeLessThanOrEqual(45);
      expect(a.calc(`rev-s${n}-aviso`), `sentada ${n}`).not.toMatch(/pasa/i);
    }
  });
});

/**
 * S31 (el brochure, la entrada de todas las apps). No entra ninguna prueba; trece filas cambian de texto —e5, g1d, h3, h10, k2, k12,
 * k17, k18, l5b, m3, n15, n17 y o12b— porque ninguna app tiene ya su ficha técnica. Vuelven a pendiente y muestran lo que el dueño había
 * respondido («Antes del S31»). Y el ajuste del celular del mismo día (PR #110) suma dos pruebas, n20 y n21, a la sentada del teléfono.
 */
describe("la guía v31 · el brochure, la entrada de todas las apps", () => {
  const FILAS_DEL_S31 = [
    "e5",
    "g1d",
    "h3",
    "h10",
    "k2",
    "k12",
    "k17",
    "k18",
    "l5b",
    "m3",
    "n15",
    "n17",
    "o12b",
  ];

  it("la página dice v31 y las trece filas reescritas llevan data-cambio 31, «mejorado» y «Mejorado · S31»; ninguna otra", () => {
    const a = abrir();
    expect(a.doc.getElementById("revision")?.getAttribute("data-version")).toBe(
      "v31",
    );
    for (const id of FILAS_DEL_S31) {
      const li = a.doc.getElementById(id) as HTMLElement;
      expect(li.getAttribute("data-cambio"), id).toBe("31");
      expect(li.getAttribute("data-origen"), id).toBe("mejorado");
      expect(li.textContent, id).toContain("Mejorado · S31");
    }
    expect(a.doc.querySelectorAll('[data-cambio="31"]').length).toBe(
      FILAS_DEL_S31.length,
    );
  });

  it("las frases que el sprint dejó falsas ya no están: ninguna fila viva manda a la ficha técnica de una app, a «las nueve fichas» ni a la dirección vieja de un brochure", () => {
    const a = abrir();
    const vivas = [...a.doc.querySelectorAll("ul.pasos li[id]")].filter(
      (li) => !li.closest("#revision-fuera-lista"),
    );
    for (const li of vivas) {
      const texto = (li.querySelector(".p-texto")?.textContent ?? "").replace(
        /\s+/g,
        " ",
      );
      expect(texto, li.id).not.toMatch(
        /Ver la ficha técnica" en una de las nueve|ficha técnica de una app|debajo de la ficha técnica|las nueve fichas|ficha de una app \(/,
      );
      // Una dirección `/brochure` de una app solo aparece como lo que es: la que redirige (n15, h10).
      if (!["n15", "h10"].includes(li.id))
        expect(texto, li.id).not.toMatch(/apps\/[\w-]+\/brochure/);
    }
    // La simulación de planlang vive en «Úsala» y su regreso dice «Volver al brochure».
    expect(a.doc.getElementById("k18")!.textContent).toContain(
      "Volver al brochure",
    );
    expect(a.doc.getElementById("k2")!.textContent).toContain("«Ver brochure»");
  });

  it("la g1d conserva su cuenta (las siete con roadmap) y el e5 sigue diciendo que los otros tres frentes no tienen lista de espera", () => {
    const a = abrir();
    expect(
      (a.doc.getElementById("g1d")!.textContent ?? "").replace(/\s+/g, " "),
    ).toMatch(
      /Recorre las siete que lo tienen: cada una tiene su propio grupo/,
    );
    expect(a.doc.getElementById("e5")!.textContent).toContain(
      "NO hay lista de espera",
    );
  });

  it("lo que respondió el dueño en una fila reescrita por el S31 pasa a «Antes del S31»; una del S30 ya migrada no se mueve", () => {
    const a = abrir({
      [NS + "migrado:30"]: "1",
      [NS + "k2"]: "si",
      [NS + "k2:nota"]: "la ficha técnica se veía bien",
      [NS + "h2"]: "si", // del S30, ya migrado: se queda como estaba
    });
    const k2 = a.doc.getElementById("k2") as HTMLElement;
    expect(
      (k2.querySelector('input[value="si"]') as HTMLInputElement).checked,
    ).toBe(false);
    expect(k2.textContent).toContain("Antes del S31 respondiste: Sí");
    expect(k2.textContent).toContain("la ficha técnica se veía bien");
    expect(
      (
        a.doc
          .getElementById("h2")!
          .querySelector('input[value="si"]') as HTMLInputElement
      ).checked,
    ).toBe(true);
  });

  it("n20 y n21, del ajuste del celular, existen en la sentada del teléfono real y la sentada sigue dentro de los 45 minutos", () => {
    const a = abrir();
    for (const id of ["n20", "n21"]) {
      const li = a.doc.getElementById(id) as HTMLElement;
      expect(li, id).not.toBeNull();
      expect(li.getAttribute("data-origen"), id).toBe("mejorado");
      expect(li.textContent, id).toContain("Mejorado · ajustes del celular");
      expect(li.getAttribute("data-rev"), id).toBe("8");
      expect(Number(li.getAttribute("data-rev-min")), id).toBeGreaterThan(0);
    }
    expect(Number(a.calc("rev-s8-min"))).toBeLessThanOrEqual(45);
  });

  it("las sentadas que recibieron cambios (1, 3, 4, 5, 6 y 8) siguen dentro de los 45 minutos, sumadas por la página", () => {
    const a = abrir();
    for (const n of [1, 3, 4, 5, 6, 8]) {
      expect(
        Number(a.calc(`rev-s${n}-min`)),
        `sentada ${n}`,
      ).toBeLessThanOrEqual(45);
      expect(a.calc(`rev-s${n}-aviso`), `sentada ${n}`).not.toMatch(/pasa/i);
    }
  });
});
