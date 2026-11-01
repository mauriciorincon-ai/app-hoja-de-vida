// @vitest-environment node
import { NextRequest, NextResponse } from "next/server";
import { afterEach, describe, expect, it, vi } from "vitest";

// Igual que `mantenimiento.test.ts`: next-intl importa `next/server` sin
// extensión y el ESM de Node no lo resuelve en el runner, así que se simula.
// Lo que se prueba aquí es lo que el proxy hace ANTES de delegarle la petición.
const delegadas: string[] = [];
vi.mock("next-intl/middleware", () => ({
  default: () => (request: NextRequest) => {
    delegadas.push(request.nextUrl.pathname);
    return NextResponse.next();
  },
}));
import { entradasBrochure } from "../../scripts/entradas-brochure.mjs";
import { SLUGS_CASA } from "@/lib/brochure/config";
import { entradasDelEntorno, rutaNueva } from "@/lib/redireccion";
import proxy from "@/proxy";

/**
 * LAS RUTAS VIEJAS (S14 y S23). `/metodo` y `/vitrina`, con o sin idioma y con
 * cualquier resto, llegan por un 301 —permanente, no el 308 de `redirects()`—
 * a `/metodos` y `/portafolio`, en los dos idiomas y con la consulta intacta;
 * lo que solo se parece NO se toca; y con el sitio en mantenimiento manda el
 * 503, no la redirección. El ancla (`#bloque-n`) la conserva el navegador: lo
 * prueba el e2e `metodo.spec.ts`.
 *
 * Y las páginas que reemplazó el brochure (S28): el detalle de una app y la página
 * de la casa llegan a su `/brochure` **en un solo salto**, también desde la ruta
 * de la «vitrina» de antes del S23. Desde el S30 el brochure es la ENTRADA de la casa
 * y de las apps con su contenido v2: para ellas, ese salto único llega a la entrada.
 */

/** Las apps que abren en su brochure HOY, medidas del disco como las mide el build. */
const ENTRADAS = entradasBrochure();

const pedir = (ruta: string) =>
  proxy(new NextRequest(new URL(ruta, "https://sitio.test")));

afterEach(() => {
  vi.unstubAllEnvs();
  delegadas.length = 0;
});

describe("la ruta nueva de una ruta vieja, como función", () => {
  it.each([
    ["/es/metodo", "/es/metodos"],
    ["/en/metodo", "/en/metodos"],
    ["/es/metodo/sistema-de-agentes", "/es/metodos/sistema-de-agentes"],
    ["/en/metodo/ciclo-de-vida-de-datos", "/en/metodos/ciclo-de-vida-de-datos"],
    ["/es/metodo/", "/es/metodos/"],
    // Sin idioma: la raíz del sitio abre en español.
    ["/metodo", "/es/metodos"],
    ["/metodo/rag-sin-inventar", "/es/metodos/rag-sin-inventar"],
    // La «vitrina» pasó a «Portafolio» (S23): el portal, el escaparate de apps,
    // una ficha, su detalle, su simulación y las piezas de los otros frentes.
    ["/es/vitrina", "/es/portafolio"],
    ["/en/vitrina", "/en/portafolio"],
    ["/es/vitrina/apps", "/es/portafolio/apps"],
    ["/es/vitrina/apps/habla", "/es/portafolio/apps/habla"],
    [
      "/es/vitrina/apps/planlang/simulacion",
      "/es/portafolio/apps/planlang/simulacion",
    ],
    [
      "/es/vitrina/agentes/hr-develop-ai-apps",
      "/es/portafolio/agentes/hr-develop-ai-apps",
    ],
    ["/en/vitrina/tableros", "/en/portafolio/tableros"],
    ["/es/vitrina/", "/es/portafolio/"],
    // Sin idioma: la raíz del sitio abre en español.
    ["/vitrina", "/es/portafolio"],
    ["/vitrina/apps/habla", "/es/portafolio/apps/habla"],
  ])("%s → %s", (vieja, nueva) => {
    expect(rutaNueva(vieja)).toBe(nueva);
  });

  it.each([
    "/es/metodos",
    "/es/metodos/sistema-de-agentes",
    "/en/metodos",
    "/es/metodo-x",
    "/es/metodologia",
    "/esmetodo",
    // Barras de más y mayúsculas no son la ruta vieja (S14-B3, S14-B9).
    "//metodo",
    "/es//metodo",
    "/Metodo",
    "/es/Metodo",
    "/es/portafolio/metodo",
    "/es/portafolio",
    "/en/portafolio/apps/habla",
    "/es/vitrina-x",
    "/es/vitrinas",
    "/esvitrina",
    "//vitrina",
    "/es//vitrina",
    "/Vitrina",
    "/es/Vitrina",
    "/es/cv/vitrina",
    "/es/cv",
    "/",
  ])("%s no es la ruta vieja: no se toca", (ruta) => {
    expect(rutaNueva(ruta)).toBeNull();
  });
});

describe("las páginas que reemplazó el brochure, en un solo salto", () => {
  it.each([
    // El detalle de una app.
    ["/es/portafolio/apps/habla/detalle", "/es/portafolio/apps/habla/brochure"],
    // Innmobiliaria abre en su brochure (S30): su detalle llega a la entrada, no a `/brochure`.
    [
      "/en/portafolio/apps/inmobiliaria/detalle",
      "/en/portafolio/apps/inmobiliaria",
    ],
    [
      "/es/portafolio/apps/habla/detalle/",
      "/es/portafolio/apps/habla/brochure",
    ],
    // Sin idioma: la raíz del sitio abre en español.
    ["/portafolio/apps/ds/detalle", "/es/portafolio/apps/ds/brochure"],
    // Desde la «vitrina» de antes del S23: UN salto, no dos.
    ["/es/vitrina/apps/habla/detalle", "/es/portafolio/apps/habla/brochure"],
    ["/en/vitrina/apps/habla/detalle", "/en/portafolio/apps/habla/brochure"],
    ["/vitrina/apps/habla/detalle", "/es/portafolio/apps/habla/brochure"],
    // La página de la casa (el brochure del S4): desde el S30, su brochure es su entrada.
    ["/es/apps/hoja-de-vida", "/es/portafolio/apps/hoja-de-vida"],
    ["/en/apps/hoja-de-vida", "/en/portafolio/apps/hoja-de-vida"],
    ["/es/apps/chat-hoja-de-vida", "/es/portafolio/apps/chat-hoja-de-vida"],
    ["/apps/chat-hoja-de-vida", "/es/portafolio/apps/chat-hoja-de-vida"],
    ["/es/apps/hoja-de-vida/", "/es/portafolio/apps/hoja-de-vida"],
  ])("%s → %s", (vieja, nueva) => {
    expect(rutaNueva(vieja, ENTRADAS)).toBe(nueva);
    // Un solo salto: la ruta a la que llega no vuelve a redirigir.
    expect(rutaNueva(nueva, ENTRADAS), `${nueva} redirige otra vez`).toBeNull();
  });

  it.each([
    "/es/portafolio/apps/habla/brochure",
    "/es/portafolio/apps/habla/simulacion",
    "/es/portafolio/apps/habla",
    // Solo las dos de la casa tuvieron `/apps/<slug>`: las demás siguen dando 404.
    "/es/apps/habla",
    "/es/apps",
    "/es/apps/hoja-de-vida/otra-cosa",
    "/es/apps/hoja-de-vida-2",
    "/es/portafolio/apps/habla/detalle/otra-cosa",
    "/es/portafolio/apps//detalle",
    "/es/cv/portafolio/apps/habla/detalle",
    "/es/portafolio/apps/habla/Detalle",
    "/es/portafolio/agentes/hr-develop-ai-apps/detalle",
  ])("%s no es una página retirada: no se toca", (ruta) => {
    expect(rutaNueva(ruta, ENTRADAS)).toBeNull();
  });

  it("las dos de la casa son las mismas que las del brochure", () => {
    for (const slug of SLUGS_CASA)
      expect(rutaNueva(`/es/apps/${slug}`), slug).toBe(
        `/es/portafolio/apps/${slug}`,
      );
    // Ni una más: la tabla del proxy no puede quedarse con un slug que el brochure ya no sirve.
    expect(rutaNueva("/es/apps/otra-app-de-la-casa")).toBeNull();
  });
});

describe("el brochure como entrada (S30): su `/brochure` llega a la entrada en un salto", () => {
  it("las apps que abren en su brochure son la casa y las que tienen su contenido v2", () => {
    expect(ENTRADAS).toEqual(expect.arrayContaining([...SLUGS_CASA]));
    expect(ENTRADAS).toContain("inmobiliaria");
  });

  it.each([
    [
      "/es/portafolio/apps/inmobiliaria/brochure",
      "/es/portafolio/apps/inmobiliaria",
    ],
    [
      "/en/portafolio/apps/inmobiliaria/brochure/",
      "/en/portafolio/apps/inmobiliaria",
    ],
    [
      "/portafolio/apps/hoja-de-vida/brochure",
      "/es/portafolio/apps/hoja-de-vida",
    ],
    [
      "/en/portafolio/apps/chat-hoja-de-vida/brochure",
      "/en/portafolio/apps/chat-hoja-de-vida",
    ],
    // Desde la «vitrina» de antes del S23 y desde el detalle: también UN salto.
    [
      "/en/vitrina/apps/inmobiliaria/brochure",
      "/en/portafolio/apps/inmobiliaria",
    ],
    ["/vitrina/apps/inmobiliaria/detalle", "/es/portafolio/apps/inmobiliaria"],
  ])("%s → %s", (vieja, nueva) => {
    expect(rutaNueva(vieja, ENTRADAS)).toBe(nueva);
    expect(rutaNueva(nueva, ENTRADAS), `${nueva} redirige otra vez`).toBeNull();
  });

  it("el brochure de una app que sigue con su ficha no se toca", () => {
    for (const ruta of [
      "/es/portafolio/apps/habla/brochure",
      "/en/portafolio/apps/hackguard/brochure",
      "/es/portafolio/apps/inmobiliaria",
      "/es/portafolio/apps/inmobiliaria/simulacion",
    ])
      expect(rutaNueva(ruta, ENTRADAS), ruta).toBeNull();
  });

  it("el interruptor es la lista: una app con contenido v2 nuevo pasa sola", () => {
    expect(rutaNueva("/es/portafolio/apps/habla/brochure", ["habla"])).toBe(
      "/es/portafolio/apps/habla",
    );
    // Sin lista, solo la casa (que no tiene ficha) abre en su brochure.
    expect(
      rutaNueva("/es/portafolio/apps/inmobiliaria/brochure", []),
    ).toBeNull();
    expect(rutaNueva("/es/portafolio/apps/hoja-de-vida/brochure", [])).toBe(
      "/es/portafolio/apps/hoja-de-vida",
    );
  });

  it("la lista llega al proxy por el entorno que `next.config.ts` calcula en build", () => {
    vi.stubEnv("CV_ENTRADAS_BROCHURE", "inmobiliaria,hoja-de-vida");
    expect(entradasDelEntorno()).toEqual(["inmobiliaria", "hoja-de-vida"]);
    expect(rutaNueva("/es/portafolio/apps/inmobiliaria/brochure")).toBe(
      "/es/portafolio/apps/inmobiliaria",
    );
    vi.stubEnv("CV_ENTRADAS_BROCHURE", "");
    expect(entradasDelEntorno()).toEqual([]);
    vi.unstubAllEnvs();
  });
});

describe("el proxy responde el 301 de las secciones renombradas", () => {
  it("la lista vieja y una pieza vieja redirigen con 301 y conservan la consulta", () => {
    for (const [vieja, nueva] of [
      ["/es/metodo", "https://sitio.test/es/metodos"],
      [
        "/en/metodo/de-prototipo-a-produccion?utm=x",
        "https://sitio.test/en/metodos/de-prototipo-a-produccion?utm=x",
      ],
    ]) {
      const res = pedir(vieja);
      expect(res.status, vieja).toBe(301);
      expect(res.headers.get("location"), vieja).toBe(nueva);
    }
    expect(delegadas, "la redirección va antes de next-intl").toEqual([]);
  });

  it("la vitrina vieja redirige con 301 a Portafolio y conserva la consulta", () => {
    for (const [vieja, nueva] of [
      ["/es/vitrina", "https://sitio.test/es/portafolio"],
      [
        "/vitrina/apps/habla?utm=x",
        "https://sitio.test/es/portafolio/apps/habla?utm=x",
      ],
      [
        "/en/vitrina/apps/planlang/simulacion",
        "https://sitio.test/en/portafolio/apps/planlang/simulacion",
      ],
    ]) {
      const res = pedir(vieja);
      expect(res.status, vieja).toBe(301);
      expect(res.headers.get("location"), vieja).toBe(nueva);
    }
    expect(delegadas, "la redirección va antes de next-intl").toEqual([]);
  });

  it("el detalle y la página de la casa redirigen con 301 a donde vive su brochure y conservan la consulta", () => {
    for (const [vieja, nueva] of [
      [
        "/es/portafolio/apps/habla/detalle",
        "https://sitio.test/es/portafolio/apps/habla/brochure",
      ],
      [
        "/en/vitrina/apps/habla/detalle?utm=x",
        "https://sitio.test/en/portafolio/apps/habla/brochure?utm=x",
      ],
      // La casa abre en su brochure (S30): su página vieja llega a la entrada.
      [
        "/apps/hoja-de-vida",
        "https://sitio.test/es/portafolio/apps/hoja-de-vida",
      ],
      [
        "/en/portafolio/apps/chat-hoja-de-vida/brochure?utm=x",
        "https://sitio.test/en/portafolio/apps/chat-hoja-de-vida?utm=x",
      ],
    ]) {
      const res = pedir(vieja);
      expect(res.status, vieja).toBe(301);
      expect(res.headers.get("location"), vieja).toBe(nueva);
    }
    expect(delegadas, "la redirección va antes de next-intl").toEqual([]);
  });

  it("la ruta nueva sigue su camino: se delega a next-intl, sin redirigir", () => {
    for (const ruta of [
      "/es/metodos/sistema-de-agentes",
      "/es/portafolio/apps",
    ]) {
      const res = pedir(ruta);
      expect(res.status, ruta).toBe(200);
      expect(res.headers.get("location"), ruta).toBeNull();
    }
    expect(delegadas).toEqual([
      "/es/metodos/sistema-de-agentes",
      "/es/portafolio/apps",
    ]);
  });

  it("con el sitio en mantenimiento manda el 503, no la redirección", () => {
    vi.stubEnv("MANTENIMIENTO", "on");
    for (const ruta of ["/es/metodo/sistema-de-agentes", "/es/vitrina/apps"]) {
      const res = pedir(ruta);
      expect(res.status, ruta).toBe(503);
      expect(res.headers.get("location"), ruta).toBeNull();
    }
  });
});
