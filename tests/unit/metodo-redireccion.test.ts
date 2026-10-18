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
import { rutaNuevaDeMetodo } from "@/lib/metodo/redireccion";
import proxy from "@/proxy";

/**
 * LA RUTA VIEJA DE «MÉTODOS» (S14). `/metodo` y `/metodo/<slug>` llegan por un
 * 301 —permanente, no el 308 de `redirects()`— a `/metodos/…`, en los dos
 * idiomas y con la consulta intacta; lo que solo se parece NO se toca; y con
 * el sitio en mantenimiento manda el 503, no la redirección. El ancla
 * (`#bloque-n`) la conserva el navegador: lo prueba el e2e `metodo.spec.ts`.
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
  ])("%s → %s", (vieja, nueva) => {
    expect(rutaNuevaDeMetodo(vieja)).toBe(nueva);
  });

  it.each([
    "/es/metodos",
    "/es/metodos/sistema-de-agentes",
    "/en/metodos",
    "/es/metodo-x",
    "/es/metodologia",
    "/esmetodo",
    "/es/vitrina/metodo",
    "/es/cv",
    "/",
  ])("%s no es la ruta vieja: no se toca", (ruta) => {
    expect(rutaNuevaDeMetodo(ruta)).toBeNull();
  });
});

describe("el proxy responde el 301 de la sección", () => {
  it("la lista vieja y una pieza vieja redirigen con 301 y conservan la consulta", () => {
    for (const [vieja, nueva] of [
      ["/es/metodo", "https://sitio.test/es/metodos"],
      ["/en/metodo/de-prototipo-a-produccion?utm=x", "https://sitio.test/en/metodos/de-prototipo-a-produccion?utm=x"],
    ]) {
      const res = pedir(vieja);
      expect(res.status, vieja).toBe(301);
      expect(res.headers.get("location"), vieja).toBe(nueva);
    }
    expect(delegadas, "la redirección va antes de next-intl").toEqual([]);
  });

  it("la ruta nueva sigue su camino: se delega a next-intl, sin redirigir", () => {
    const res = pedir("/es/metodos/sistema-de-agentes");
    expect(res.status).toBe(200);
    expect(res.headers.get("location")).toBeNull();
    expect(delegadas).toEqual(["/es/metodos/sistema-de-agentes"]);
  });

  it("con el sitio en mantenimiento manda el 503, no la redirección", () => {
    vi.stubEnv("MANTENIMIENTO", "on");
    const res = pedir("/es/metodo/sistema-de-agentes");
    expect(res.status).toBe(503);
    expect(res.headers.get("location")).toBeNull();
  });
});
