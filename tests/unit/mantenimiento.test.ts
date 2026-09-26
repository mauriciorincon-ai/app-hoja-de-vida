// @vitest-environment node
import { NextRequest, NextResponse } from "next/server";
import { afterEach, describe, expect, it, vi } from "vitest";

// next-intl importa `next/server` sin extensión y el ESM de Node no lo
// resuelve en el runner. Se simula: lo que se prueba aquí es que el proxy le
// DELEGA la petición cuando el sitio está arriba. Lo que next-intl hace con
// ella (la raíz abre en español) lo prueba el e2e `tests/e2e/idioma.spec.ts`.
const delegadas: string[] = [];
vi.mock("next-intl/middleware", () => ({
  default: () => (request: NextRequest) => {
    delegadas.push(request.nextUrl.pathname);
    return NextResponse.next();
  },
}));
import {
  REINTENTO_SEGUNDOS,
  enMantenimiento,
  idiomaDeRuta,
} from "@/lib/mantenimiento";
import proxy from "@/proxy";

/**
 * MODO MANTENIMIENTO (2026-09-24). El dueño lo quiso «fácil de poner y
 * quitar»: `MANTENIMIENTO=on` en Production + Redeploy. Lo que estas pruebas
 * cuidan es lo que no se ve desde el panel de Vercel:
 *  - solo `on` apaga el sitio; un error de tipeo lo deja ARRIBA;
 *  - con `on`, toda página responde la de mantenimiento de su idioma con un
 *    503 temporal y `Retry-After` (Google no la indexa en lugar del sitio);
 *  - con cualquier otro valor, el proxy es el de siempre (next-intl).
 * El 404 de `/es/mantenimiento` con el sitio arriba lo prueba el e2e
 * (`tests/e2e/mantenimiento.spec.ts`).
 */

const pedir = (ruta: string) =>
  proxy(new NextRequest(new URL(ruta, "https://sitio.test")));

afterEach(() => {
  vi.unstubAllEnvs();
  delegadas.length = 0;
});

describe("el interruptor", () => {
  it("solo «on» lo enciende, sin importar mayúsculas ni espacios", () => {
    for (const v of ["on", "ON", " On ", "on\n"]) {
      expect(enMantenimiento(v), JSON.stringify(v)).toBe(true);
    }
  });

  it("cualquier otro valor deja el sitio arriba: el error barato es no apagar", () => {
    for (const v of [undefined, "", "off", "OFF", "onn", "true", "1", "sí"]) {
      expect(enMantenimiento(v), JSON.stringify(v)).toBe(false);
    }
  });

  it("el idioma sale de la ruta; la raíz y lo demás, en español", () => {
    expect(idiomaDeRuta("/en")).toBe("en");
    expect(idiomaDeRuta("/en/proyectos/vesting")).toBe("en");
    expect(idiomaDeRuta("/es/cv")).toBe("es");
    expect(idiomaDeRuta("/")).toBe("es");
    expect(idiomaDeRuta("/english")).toBe("es");
  });
});

describe("el proxy", () => {
  it("con MANTENIMIENTO=on, toda página responde la de su idioma con un 503 temporal", async () => {
    vi.stubEnv("MANTENIMIENTO", "on");
    for (const [ruta, destino] of [
      ["/", "/es/mantenimiento"],
      ["/es", "/es/mantenimiento"],
      ["/es/proyectos/vesting", "/es/mantenimiento"],
      ["/en/cv", "/en/mantenimiento"],
      ["/en/vitrina/apps", "/en/mantenimiento"],
    ]) {
      const r = await pedir(ruta);
      expect(r.status, ruta).toBe(503);
      expect(r.headers.get("x-middleware-rewrite"), ruta).toBe(
        `https://sitio.test${destino}`,
      );
      expect(r.headers.get("retry-after"), ruta).toBe(
        String(REINTENTO_SEGUNDOS),
      );
      expect(r.headers.get("cache-control"), ruta).toBe("no-store");
    }
    // Y next-intl ni se entera: en mantenimiento no hay redirecciones de idioma.
    expect(delegadas).toEqual([]);
  });

  it("con cualquier otro valor, el proxy le delega todo a next-intl, como siempre", async () => {
    for (const valor of ["off", "", "onn"]) {
      vi.stubEnv("MANTENIMIENTO", valor);
      delegadas.length = 0;
      for (const ruta of ["/", "/es/cv", "/en/proyectos/vesting"]) {
        const r = await pedir(ruta);
        expect(r.status, `${valor} ${ruta}`).not.toBe(503);
        expect(
          r.headers.get("x-middleware-rewrite") ?? "",
          `${valor} ${ruta}`,
        ).not.toContain("mantenimiento");
      }
      expect(delegadas, valor).toEqual([
        "/",
        "/es/cv",
        "/en/proyectos/vesting",
      ]);
    }
  });
});
