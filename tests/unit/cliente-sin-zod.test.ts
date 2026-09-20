import { readdirSync, readFileSync, statSync } from "node:fs";
import { join } from "node:path";
import { describe, expect, it } from "vitest";

/**
 * Un client component jamás importa VALORES de un módulo que arrastre Zod
 * (`@/lib/schemas`, `@/lib/propuestas`): Zod entra al bundle del navegador y
 * el presupuesto de scripts de Lighthouse (300 KB) se rompe en TODAS las
 * rutas. Nació en rojo solo (revisión post-S8, PR #32): tres formularios
 * cliente importaban `MOTIVOS`, `APP_OTRA` y `PROPUESTA_MIN` desde ahí y la CI
 * lo cazó con +20–30 KB por ruta. Las constantes que el cliente necesita
 * viven en `@/lib/contacto-constantes` (sin Zod). `import type` sigue
 * permitido: se borra al compilar.
 */
const MODULOS_CON_ZOD = ["@/lib/schemas", "@/lib/propuestas"];

function archivos(dir: string): string[] {
  return readdirSync(dir).flatMap((n) => {
    const p = join(dir, n);
    return statSync(p).isDirectory()
      ? archivos(p)
      : /\.tsx?$/.test(n)
        ? [p]
        : [];
  });
}

describe("client components sin Zod", () => {
  it("ningún archivo «use client» importa valores de un módulo con Zod", () => {
    const culpables: string[] = [];
    for (const f of archivos("src")) {
      const s = readFileSync(f, "utf8");
      if (!/^\s*["']use client["']/m.test(s)) continue;
      for (const m of MODULOS_CON_ZOD) {
        const re = new RegExp(
          `import\\s+(?!type\\s)[^;]*from\\s+["']${m.replace("/", "\\/")}["']`,
        );
        if (re.test(s)) culpables.push(`${f} → ${m}`);
      }
    }
    expect(culpables).toEqual([]);
  });
});
