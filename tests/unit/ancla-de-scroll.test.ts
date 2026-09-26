import { describe, expect, it } from "vitest";
import { medirAncla, resolverAncla } from "@/lib/ancla-de-scroll";

/**
 * El cambio de idioma conserva un ANCLA DE CONTENIDO, no píxeles ni hash
 * (revisión post-S8, bloque B). Aquí la aritmética; el DOM lo prueba
 * `tests/e2e/idioma.spec.ts`.
 */
describe("ancla de scroll al cambiar de idioma", () => {
  const es = [0, 800, 1600, 2000, 2400, 3300]; // hitos en español
  const en = [0, 700, 1350, 1700, 2050, 2800]; // los MISMOS hitos, en inglés (más corto)

  it("elige el último hito que ya pasó el borde y guarda el desfase", () => {
    expect(medirAncla(1650, es)).toEqual({ indice: 2, desfase: 50, y: 1650 });
    expect(medirAncla(1600, es).indice).toBe(2); // tocar el borde cuenta
    expect(medirAncla(3900, es)).toEqual({ indice: 5, desfase: 600, y: 3900 });
  });

  it("un candidato fijo (sticky) fuera de orden no corta la búsqueda (2026-09-26)", () => {
    // El año del índice de la trayectoria va en el orden del documento ANTES
    // de los hitos, pero se queda a media pantalla: su top va por delante del
    // scroll. Cortar ahí anclaba al título de la sección, y en móvil el hito
    // que se leía se corría 42–87 px al cambiar de idioma.
    const conFijo = [0, 400, 2050, 800, 1600, 2000]; // [2] = el año fijo
    expect(medirAncla(1650, conFijo)).toEqual({
      indice: 4,
      desfase: 50,
      y: 1650,
    });
  });

  it("sin hito por encima, el ancla es el scrollY tal cual", () => {
    expect(medirAncla(0, [])).toEqual({ indice: -1, desfase: 0, y: 0 });
    expect(medirAncla(120, [500, 900])).toEqual({
      indice: -1,
      desfase: 120,
      y: 120,
    });
  });

  it("al otro lado reproduce el MISMO hito con el mismo desfase, no los mismos píxeles", () => {
    const ancla = medirAncla(1650, es); // a 50 px del tercer hito
    expect(resolverAncla(ancla, en)).toBe(1400); // 1350 + 50, no 1650
    expect(resolverAncla(medirAncla(2450, es), en)).toBe(2100);
  });

  it("si el hito no existe al otro lado, cae al scrollY de respaldo; nunca negativo", () => {
    expect(resolverAncla(medirAncla(2450, es), [0, 700])).toBe(2450);
    expect(resolverAncla({ indice: 0, desfase: -40, y: 10 }, [0])).toBe(0);
  });
});
