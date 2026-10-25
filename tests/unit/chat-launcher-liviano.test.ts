import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";

/**
 * EL LANZADOR VA EN EL LAYOUT, ASÍ QUE PESA EN TODAS LAS PÁGINAS (auditoría del
 * S24, A4). Desde que reabre el panel importó `chat-conversacion.ts`, que trae
 * Zod y los esquemas del chat: ≈ 28 KB gzip de JS inicial en cada URL de
 * `lighthouse-urls.json`, con el presupuesto de rendimiento al filo. El panel
 * entero es `dynamic`; el lanzador solo puede traer lo que no pesa.
 *
 * Lo que el lanzador necesita (el `sessionStorage` y la marca de «abierto») vive
 * en `chat-panel-abierto.ts`, sin importaciones.
 */

const raiz = (ruta: string) => readFileSync(ruta, "utf8");
const importaciones = (fuente: string) =>
  [...fuente.matchAll(/^import[^;]*?from\s+["']([^"']+)["']/gm)].map(
    (m) => m[1],
  );

describe("el lanzador del chat no arrastra el panel", () => {
  const lanzador = importaciones(raiz("src/components/chat/chat-launcher.tsx"));

  it("no importa Zod, los esquemas del chat ni el módulo de la conversación", () => {
    const prohibidas = lanzador.filter(
      (ruta) =>
        ruta === "zod" ||
        ruta.includes("ia/schemas") ||
        ruta.includes("chat-conversacion"),
    );
    expect(prohibidas).toEqual([]);
  });

  it("la marca de «abierto» viene de un módulo sin importaciones", () => {
    expect(lanzador).toContain("@/lib/chat-panel-abierto");
    expect(importaciones(raiz("src/lib/chat-panel-abierto.ts"))).toEqual([]);
  });

  it("el único import estático pesado permitido es el panel, y es `dynamic`", () => {
    expect(raiz("src/components/chat/chat-launcher.tsx")).toMatch(
      /dynamic\(\s*\(\)\s*=>\s*import\("\.\/chat-panel"\)/,
    );
    expect(lanzador).not.toContain("./chat-panel");
  });
});
