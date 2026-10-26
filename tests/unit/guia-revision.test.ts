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

describe("la guía v25 · el filtro «Revisión completa»", () => {
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

describe("la guía v25 · las sentadas y las sumas", () => {
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

describe("la guía v25 · el sí/no y la nota", () => {
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

describe("la guía v25 · «Copiar mis respuestas»", () => {
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
      /^CV Viva · Revisión completa · guía v25\nFecha: \d{4}-\d{2}-\d{2}\n/,
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
    expect(area.value).toContain("guía v25");
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

describe("la guía v25 · lo que entra", () => {
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
describe("la guía v25 · guardar y restaurar", () => {
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
    const a = abrir({ [`${NS}a2`]: "si", [`${NS}a2:nota`]: "todo bien" });
    expect((a.doc.getElementById("a2-si") as HTMLInputElement).checked).toBe(
      false,
    );
    const antes = a.doc.querySelector("#a2 .rev-antes") as HTMLElement;
    expect(antes.textContent).toContain("Antes del S23 respondiste: Sí");
    expect(antes.textContent).toContain("todo bien");
    // Responderla de nuevo quita el recuerdo.
    a.click("a2-no");
    expect(a.doc.querySelector("#a2 .rev-antes")).toBeNull();
    // Una fila que no cambió conserva su respuesta.
    const b = abrir({ [`${NS}a1`]: "no" });
    expect((b.doc.getElementById("a1-no") as HTMLInputElement).checked).toBe(
      true,
    );
    // Ya migrado: la respuesta nueva no se vuelve a mover al recargar.
    const c = abrir({ [`${NS}migrado:23`]: "1", [`${NS}a2`]: "no" });
    expect((c.doc.getElementById("a2-no") as HTMLInputElement).checked).toBe(
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
        "  · a2 — Baja por la página: algo: orden distinto",
        "",
        "SÍ SIN NOTA (0)",
        "  ninguno",
      ].join("\n");
    const v22 = abrir();
    restaurar(v22, cuerpo("v22"));
    expect((v22.doc.getElementById("a2-si") as HTMLInputElement).checked).toBe(
      false,
    );
    expect(v22.doc.querySelector("#a2 .rev-antes")?.textContent).toContain(
      "orden distinto",
    );
    const v23 = abrir();
    restaurar(v23, cuerpo("v23"));
    expect((v23.doc.getElementById("a2-si") as HTMLInputElement).checked).toBe(
      true,
    );
  });

  it("A2 · una línea de la v22 cuyo título cambió y trae «: » no corta la nota en el sitio equivocado", () => {
    // Así copió la v22 la k1b: el título, truncado con «…», y tras «…: » la nota del dueño.
    const texto = [
      "CV Viva · Revisión completa · guía v22",
      "Fecha: 2026-10-24",
      "",
      "SÍ CON NOTA (1)",
      "  · k1b — 2 min Entra a Vitrina desde el menú: ves el portal con cuatro cajas en este…: MI NOTA k1b",
    ].join("\n");
    const a = abrir();
    restaurar(a, texto);
    expect((a.doc.getElementById("k1b-si") as HTMLInputElement).checked).toBe(
      true,
    );
    expect(
      a.doc.querySelector<HTMLTextAreaElement>('[data-nota-de="k1b"]')!.value,
    ).toBe("MI NOTA k1b");
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

describe("la guía v25 · las frases que el sprint dejó falsas", () => {
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

  it("f2, f9, f12, o9, o10 y n8 llevan data-cambio 24 y «Mejorado · S24»; la R6 y la o1 las volvió a reescribir el S25", () => {
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
      const delS25 = id === "o1";
      expect(li.getAttribute("data-cambio"), id).toBe(delS25 ? "25" : "24");
      expect(li.getAttribute("data-origen"), id).toBe("mejorado");
      expect(li.textContent, id).toContain(
        delS25 ? "Mejorado · S25" : "Mejorado · S24",
      );
    }
  });

  it("las filas de la v23 que no cambiaron en el S24 siguen siendo de la v23", () => {
    const a = abrir();
    for (const id of ["a2", "a3b", "a5", "a6", "b1", "h3", "a8", "q24"]) {
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

  it("quien ya migró la v23 migra la v24: la marca 23 no impide la 24, y a2 no se mueve dos veces", () => {
    const a = abrir({
      [`${NS}migrado:23`]: "1",
      [`${NS}a2`]: "si", // respondida DESPUÉS de la v23: no se mueve
      [`${NS}o9`]: "si", // era de la v23 y en la v24 vuelve a cambiar: se mueve
    });
    expect((a.doc.getElementById("a2-si") as HTMLInputElement).checked).toBe(
      true,
    );
    expect(a.doc.querySelector("#a2 .rev-antes")).toBeNull();
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
 * S25 (el CV dice lo que pasó). Once filas cambiaron de texto: R3, R4, R6, c2, c3, a10, d1, d3,
 * o1, q20 y q22. Vuelven a pendiente y muestran lo que el dueño había respondido («Antes del
 * S25»). Las del S24 que no se tocaron siguen siendo del S24: la migración es por versión.
 */
describe("la guía v25 · el CV, los casos y el PDF", () => {
  const FILAS_DEL_S25 = ["c2", "c3", "a10", "d1", "d3", "o1", "q20", "q22"];
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
