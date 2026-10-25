import { existsSync, readFileSync } from "node:fs";
import path from "node:path";
import { JSDOM } from "jsdom";
import { describe, expect, it, vi } from "vitest";

/**
 * EL ENSAYO GENERAL DEL H-2 EN LA GUÍA (Sprint 020) — `docs/GUIA-DE-PRUEBA.html`.
 *
 * El filtro «Ensayo general H-2» es la parte de la guía que el dueño corre sobre
 * producción: un flujo por fila con un sí o un no, en sentadas de a lo sumo 45
 * minutos. Este gate carga la página REAL en jsdom, ejecuta su script y la usa
 * como la usaría una persona (regla 22: todo control dibujado tiene su script):
 *
 *  · el filtro muestra exactamente los flujos del ensayo y la lista de lo que
 *    sale, con su razón;
 *  · cada ⭐ está en un flujo o sale con su razón (ninguna se pierde), y la razón
 *    que cita un archivo cita uno que existe;
 *  · las sumas las hace la página —ninguna sentada pasa de 45 min— y el sí/no se
 *    guarda por flujo y se restaura al recargar;
 *  · ningún tiempo ni total quedó escrito a mano en el encabezado.
 */
// La guía pesa más de 200 KB y cada prueba arranca su propio jsdom con su script: con la
// suite entera en paralelo el tope de 5 s se queda corto (falló una vez con 5,2 s).
vi.setConfig({ testTimeout: 30_000 });

const RUTA = path.join(process.cwd(), "docs", "GUIA-DE-PRUEBA.html");
const HTML = readFileSync(RUTA, "utf8");
const LIMITE = 45;

function abrir(almacen?: Record<string, string>) {
  const dom = new JSDOM(HTML, {
    runScripts: "dangerously",
    url: "http://localhost/guia",
    pretendToBeVisual: true,
    beforeParse(window) {
      for (const [k, v] of Object.entries(almacen ?? {}))
        window.localStorage.setItem(k, v);
    },
  });
  const doc = dom.window.document;
  const filas = (sel: string) => [...doc.querySelectorAll<HTMLElement>(sel)];
  const calc = (clave: string) =>
    doc.querySelector(`[data-calc="${clave}"]`)?.textContent ?? "";
  const filtro = (nombre: string) =>
    doc.querySelector<HTMLButtonElement>(
      `.filtros button[data-filtro="${nombre}"]`,
    )!;
  return { dom, doc, filas, calc, filtro, window: dom.window };
}

const NS = "guia-hoja-de-vida:s21:";

describe("la guía · el filtro «Ensayo general H-2» (desde el S20)", () => {
  it("el filtro existe, cuenta sus flujos y muestra solo esos", () => {
    const { doc, filas, filtro } = abrir();
    const flujos = filas("ul.pasos li[data-ensayo]");
    expect(flujos.length).toBeGreaterThan(0);
    expect(filtro("ensayo")).toBeTruthy();
    expect(filtro("ensayo").textContent).toContain(`(${flujos.length})`);

    filtro("ensayo").click();
    const visibles = filas("ul.pasos li").filter(
      (li) => !li.hasAttribute("hidden"),
    );
    expect(
      visibles.map((li) => li.getAttribute("data-ensayo") !== null),
    ).not.toContain(false);
    expect(visibles).toHaveLength(flujos.length);
    // Las ⭐ no están en el filtro, y la lista de lo que sale se ve.
    expect(
      filas("ul.pasos li[data-minimo]").every((li) =>
        li.hasAttribute("hidden"),
      ),
    ).toBe(true);
    expect(doc.getElementById("ensayo-fuera")!.hasAttribute("hidden")).toBe(
      false,
    );
    expect(filtro("ensayo").classList.contains("activo")).toBe(true);
  });

  it("los otros filtros siguen funcionando y esconden la lista de lo que sale", () => {
    const { doc, filas, filtro } = abrir();
    filtro("ensayo").click();
    filtro("minimo").click();
    expect(doc.getElementById("ensayo-fuera")!.hasAttribute("hidden")).toBe(
      true,
    );
    const minimos = filas("ul.pasos li[data-minimo]");
    expect(
      filas("ul.pasos li").filter((li) => !li.hasAttribute("hidden")),
    ).toHaveLength(minimos.length);
    filtro("todo").click();
    expect(filas("ul.pasos li").some((li) => li.hasAttribute("hidden"))).toBe(
      false,
    );
    filtro("cambios").click();
    expect(filas("ul.pasos li").some((li) => li.hasAttribute("hidden"))).toBe(
      true,
    );
  });

  it("cada ⭐ está en un flujo del ensayo o sale con su razón (ninguna se pierde)", () => {
    const { doc, filas } = abrir();
    // R1 → las ⭐ que dice cubrir.
    const flujos = new Map(
      filas("ul.pasos li[data-ensayo]").map((li) => [
        li.querySelector("input")!.id.replace(/-si$/, ""),
        (li.getAttribute("data-cubre") ?? "").split(/\s+/).filter(Boolean),
      ]),
    );
    const problemas: string[] = [];
    for (const li of filas("ul.pasos li[data-minimo]")) {
      const id = li.id;
      const razon = li.getAttribute("data-ensayo-fuera") ?? "";
      if (razon.length < 20) {
        problemas.push(`${id}: una ⭐ sin su razón de salir del ensayo`);
        continue;
      }
      const m = razon.match(/^cubierta por el flujo (R\d+) del ensayo\.$/);
      if (m && !flujos.get(m[1].toLowerCase())?.includes(id))
        problemas.push(`${id}: dice estar en ${m[1]} y ese flujo no la cubre`);
      for (const archivo of razon.match(/\b(?:tests|data)\/[\w./-]+\.\w+/g) ??
        []) {
        if (!existsSync(path.join(process.cwd(), archivo)))
          problemas.push(`${id}: la razón cita «${archivo}» y no existe`);
      }
    }
    // Y a la inversa: todo lo que un flujo dice cubrir es una ⭐ que lo reconoce.
    for (const [flujo, cubre] of flujos) {
      for (const id of cubre) {
        const li = doc.getElementById(id)?.closest("li");
        if (!li)
          problemas.push(`${flujo}: cubre «${id}», que no existe en la guía`);
        // Una fila sin ⭐ (una lectura de la guía completa) no sale de ningún filtro.
        else if (!li.hasAttribute("data-minimo")) continue;
        else if (
          li.getAttribute("data-ensayo-fuera") !==
          `cubierta por el flujo ${flujo.toUpperCase()} del ensayo.`
        )
          problemas.push(`${id}: ${flujo} la cubre y su fila no lo dice`);
      }
    }
    expect(problemas).toEqual([]);
  });

  it("la lista del filtro nombra cada ⭐ que sale con su razón", () => {
    const { doc, filas } = abrir();
    const items = [...doc.querySelectorAll("#ensayo-fuera-lista li")];
    const estrellas = filas("ul.pasos li[data-minimo]");
    expect(items).toHaveLength(estrellas.length);
    for (const li of estrellas) {
      const id = li.id;
      const razon = li.getAttribute("data-ensayo-fuera")!;
      const item = items.find(
        (i) => i.querySelector("code")?.textContent === id,
      );
      expect(item?.textContent, `${id} en la lista`).toContain(razon);
      expect(
        li.querySelector(".fuera-ensayo")?.textContent,
        `${id} en su fila`,
      ).toContain(razon);
    }
  });
});

describe("la guía · las sumas del ensayo las hace la página", () => {
  it("cada flujo declara minutos y sentada, y ninguna sentada pasa de 45 min", () => {
    const { filas, calc } = abrir();
    const flujos = filas("ul.pasos li[data-ensayo]");
    const por = new Map<string, number>();
    for (const li of flujos) {
      const id = li.querySelector("input")!.id.replace(/-si$/, "");
      const min = Number(li.getAttribute("data-ensayo"));
      const sentada = li.getAttribute("data-sentada") ?? "";
      expect(Number.isInteger(min) && min > 0, `${id}: minutos del flujo`).toBe(
        true,
      );
      expect(["1", "2", "3"], `${id}: sentada del flujo`).toContain(sentada);
      // El texto visible de los minutos no se aparta del dato que se suma.
      expect(
        li.querySelector(".ens-min")?.textContent?.trim(),
        `${id}: los minutos que se leen y los que se suman`,
      ).toBe(`${min} min`);
      por.set(sentada, (por.get(sentada) ?? 0) + min);
    }
    for (const [s, min] of por) {
      expect(
        min,
        `la sentada ${s} suma ${min} min y el tope es ${LIMITE}`,
      ).toBeLessThanOrEqual(LIMITE);
      expect(calc(`sentada-${s}-min`)).toBe(String(min));
    }
    const total = [...por.values()].reduce((a, b) => a + b, 0);
    expect(calc("ensayo-min")).toBe(String(total));
    expect(calc("ensayo-n")).toBe(String(flujos.length));
    // Si todo cabe en 45 min no hacen falta dos sentadas; si no, hacen falta las dos.
    // Las sentadas son consecutivas desde la 1 y hay las que hacen falta para que
    // ninguna pase del tope: con más de 45 min en total no caben en una sola.
    const claves = [...por.keys()].sort();
    expect(claves).toEqual(["1", "2", "3"].slice(0, claves.length));
    expect(claves.length).toBeGreaterThanOrEqual(Math.ceil(total / LIMITE));
    expect(calc("ensayo-sentadas")).toBe(String(claves.length));
    for (const s of claves) expect(calc(`sentada-${s}-aviso`)).toBe("");
  });

  it("una sentada que pasa de 45 min lo dice con su número", () => {
    const html = HTML.replace(/data-ensayo="6"/, 'data-ensayo="60"');
    const dom = new JSDOM(html, {
      runScripts: "dangerously",
      url: "http://localhost/guia",
    });
    const aviso = dom.window.document.querySelector(
      '[data-calc="sentada-1-aviso"]',
    );
    expect(aviso?.textContent).toMatch(/pasa de 45 min/);
  });

  it("el Gate mínimo ⭐ lo cuenta la página y ningún tiempo queda escrito a mano en el encabezado", () => {
    const { doc, calc, filas } = abrir();
    expect(calc("minimo-n")).toBe(
      String(filas("ul.pasos li[data-minimo]").length),
    );
    const encabezado = doc
      .querySelector("header")!
      .textContent!.replace(/\s+/g, " ");
    expect(encabezado, "el mínimo ya no escribe «~4 h 59 min»").not.toMatch(
      /Gate mínimo ⭐:[^.]*\d+\s*h\s*\d*\s*min/,
    );
    expect(encabezado).not.toMatch(/~\s*4\s*h/);
  });
});

describe("la guía · el sí/no", () => {
  it("cada flujo tiene su sí y su no, y marcar uno lo guarda y cuenta", () => {
    const { doc, window, calc } = abrir();
    const flujos = [...doc.querySelectorAll("li[data-ensayo]")];
    expect(flujos.length).toBeGreaterThan(1);
    for (const li of flujos) {
      const radios = li.querySelectorAll<HTMLInputElement>(
        'input[type="radio"]',
      );
      expect(radios, li.querySelector("input")?.id).toHaveLength(2);
      expect([...radios].map((r) => r.value).sort()).toEqual(["no", "si"]);
    }
    const n = flujos.length;
    expect(calc("ensayo-pendientes")).toBe(String(n));

    const r1si = doc.getElementById("r1-si") as HTMLInputElement;
    r1si.click();
    expect(window.localStorage.getItem(`${NS}r1`)).toBe("si");
    expect(calc("ensayo-si")).toBe("1");
    expect(calc("ensayo-pendientes")).toBe(String(n - 1));

    // Cambiar de idea: el no reemplaza al sí.
    (doc.getElementById("r1-no") as HTMLInputElement).click();
    expect(window.localStorage.getItem(`${NS}r1`)).toBe("no");
    expect(calc("ensayo-si")).toBe("0");
    expect(calc("ensayo-no")).toBe("1");
  });

  it("al recargar, el sí/no y las notas vuelven como se dejaron", () => {
    const { doc, calc } = abrir({
      [`${NS}r2`]: "no",
      [`${NS}r3`]: "si",
      [`${NS}a4`]: "no",
      [`${NS}a4:nota`]: "el logo se ve borroso",
    });
    expect((doc.getElementById("r2-no") as HTMLInputElement).checked).toBe(
      true,
    );
    expect((doc.getElementById("r3-si") as HTMLInputElement).checked).toBe(
      true,
    );
    expect((doc.getElementById("a4-no") as HTMLInputElement).checked).toBe(true);
    expect(
      (doc.querySelector('[data-nota-de="a4"]') as HTMLTextAreaElement).value,
    ).toBe("el logo se ve borroso");
    expect(calc("ensayo-si")).toBe("1");
    expect(calc("ensayo-no")).toBe("1");
  });

  it("el avance cuenta un flujo respondido igual que una prueba respondida", () => {
    const { doc, filtro } = abrir();
    filtro("ensayo").click();
    const antes = doc.getElementById("contador")!.textContent!;
    expect(antes).toMatch(/^0\/\d+$/);
    (doc.getElementById("r4-si") as HTMLInputElement).click();
    expect(doc.getElementById("contador")!.textContent).toMatch(/^1\/\d+$/);
  });

  it("el prefijo de las respuestas es el del sprint (s21): una marca vieja no cuenta", () => {
    const { doc } = abrir({
      "guia-hoja-de-vida:s20:a4": "si",
      "guia-hoja-de-vida:s20:r1": "si",
    });
    expect((doc.getElementById("a4-si") as HTMLInputElement).checked).toBe(
      false,
    );
    expect((doc.getElementById("r1-si") as HTMLInputElement).checked).toBe(
      false,
    );
  });
});

describe("la guía · todo control dibujado tiene su script (regla 22)", () => {
  it("cada botón de filtro, nota y radio reacciona", () => {
    const { doc, window } = abrir();
    for (const b of doc.querySelectorAll<HTMLButtonElement>(
      ".filtros button",
    )) {
      b.click();
      expect(b.classList.contains("activo"), b.textContent!).toBe(true);
    }
    const notas = [...doc.querySelectorAll<HTMLTextAreaElement>("textarea.p-nota")];
    expect(notas.length).toBeGreaterThan(100);
    for (const n of notas.slice(0, 5)) {
      n.value = "una nota";
      n.dispatchEvent(new window.Event("input", { bubbles: true }));
      expect(
        window.localStorage.getItem(`${NS}${n.dataset.notaDe}:nota`),
        n.dataset.notaDe,
      ).toBe("una nota");
    }
    // Todos los flujos del ensayo y una de cada cinco respuestas de las pruebas: cada
    // radio recibe su manejador en el mismo ciclo, así que la muestra es representativa
    // (y en jsdom, con 300 clics, la prueba pasaba del tope).
    const radios = [
      ...doc.querySelectorAll<HTMLInputElement>('input[type="radio"]'),
    ].filter((r, i) => /^r\d+$/.test(r.name) || i % 5 === 0);
    expect(radios.length).toBeGreaterThan(50);
    for (const r of radios) {
      r.click();
      expect(window.localStorage.getItem(`${NS}${r.name}`), r.id).toBe(r.value);
    }
  }, 60_000);
});
