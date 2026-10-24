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

function abrir(almacen?: Record<string, string>, html = HTML) {
  const dom = new JSDOM(html, {
    runScripts: "dangerously",
    url: "http://localhost/guia",
    pretendToBeVisual: true,
    beforeParse(window) {
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

describe("la guía v21 · el filtro «Revisión completa»", () => {
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

describe("la guía v21 · las sentadas y las sumas", () => {
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

describe("la guía v21 · el sí/no y la nota", () => {
  it("cada prueba tiene su sí, su no y su nota; marcar guarda y cuenta", () => {
    const { doc, window, calc, click } = abrir();
    const pruebas = [...doc.querySelectorAll<HTMLElement>("ul.pasos li[id]")];
    for (const li of pruebas) {
      const radios = [
        ...li.querySelectorAll<HTMLInputElement>('input[type="radio"]'),
      ];
      expect(radios.map((r) => r.value).sort(), li.id).toEqual(["no", "si"]);
      expect(
        li.querySelector(`input.p-nota[data-nota-de="${li.id}"]`),
        `${li.id}: su nota`,
      ).toBeTruthy();
    }
    const pendientes = Number(calc("rev-pendientes"));
    expect(pendientes).toBeGreaterThan(100);
    click("a1-no");
    const nota = doc.querySelector<HTMLInputElement>('[data-nota-de="a1"]')!;
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
      [`${NS}r1`]: "si",
      "guia-hoja-de-vida:s20:a2": "no",
    });
    expect((doc.getElementById("a1-no") as HTMLInputElement).checked).toBe(
      true,
    );
    expect(
      doc.querySelector<HTMLInputElement>('[data-nota-de="a1"]')!.value,
    ).toBe("se corta en el teléfono");
    expect(
      (doc.getElementById("a2-no") as HTMLInputElement).checked,
      "una marca s20 no cuenta",
    ).toBe(false);
    expect(calc("rev-si")).toBe("1");
    expect(calc("rev-no")).toBe("1");
    // R1 es la misma fila en la revisión y en el ensayo.
    filtro("ensayo").click();
    expect(calc("ensayo-si")).toBe("1");
    click("r2-no");
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
});

describe("la guía v21 · «Copiar mis respuestas»", () => {
  function conRespuestas(portapapeles?: unknown) {
    const a = abrir();
    if (portapapeles !== undefined)
      Object.defineProperty(a.window.navigator, "clipboard", {
        value: portapapeles,
        configurable: true,
      });
    a.click("a1-no");
    const nota = a.doc.querySelector<HTMLInputElement>('[data-nota-de="a1"]')!;
    nota.value = "el botón no responde";
    nota.dispatchEvent(new a.window.Event("input", { bubbles: true }));
    a.click("a2-si");
    const nota2 = a.doc.querySelector<HTMLInputElement>('[data-nota-de="a2"]')!;
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
      /^CV Viva · Revisión completa · guía v21\nFecha: \d{4}-\d{2}-\d{2}\n/,
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

  it("si el portapapeles falla, el texto queda a la vista y seleccionado", async () => {
    const { doc } = conRespuestas({
      writeText: () => Promise.reject(new Error("denegado")),
    });
    (doc.getElementById("rev-copiar") as HTMLButtonElement).click();
    await new Promise((r) => setTimeout(r, 0));
    const area = doc.getElementById("rev-texto") as HTMLTextAreaElement;
    expect(area.hasAttribute("hidden")).toBe(false);
    expect(area.value).toContain("guía v21");
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

describe("la guía v21 · lo que entra", () => {
  it("las seis pruebas nuevas existen, son del S21, tienen sentada y la opcional lo dice", () => {
    const { doc } = abrir();
    for (const id of ["m15", "f12", "q25", "q26", "o15", "o16"]) {
      const li = doc.getElementById(id)!;
      expect(li, id).toBeTruthy();
      expect(li.getAttribute("data-origen"), id).toBe("nuevo");
      expect(li.textContent, id).toContain("Nuevo · S21");
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
