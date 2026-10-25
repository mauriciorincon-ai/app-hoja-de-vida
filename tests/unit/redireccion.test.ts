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
import { rutaNueva } from "@/lib/redireccion";
import proxy from "@/proxy";

/**
 * LAS RUTAS VIEJAS (S14 y S23). `/metodo` y `/vitrina`, con o sin idioma y con
 * cualquier resto, llegan por un 301 —permanente, no el 308 de `redirects()`—
 * a `/metodos` y `/portafolio`, en los dos idiomas y con la consulta intacta;
 * lo que solo se parece NO se toca; y con el sitio en mantenimiento manda el
 * 503, no la redirección. El ancla (`#bloque-n`) la conserva el navegador: lo
 * prueba el e2e `metodo.spec.ts`.
 */

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
    ["/en/vitrina/apps/habla/detalle", "/en/portafolio/apps/habla/detalle"],
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
