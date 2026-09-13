import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";

/**
 * Paridad de claves entre `messages/es.json` y `messages/en.json`. Nació
 * en rojo solo (revisión post-S8, bloque E): el namespace `listaDeEspera`
 * entró al español y no al inglés, y el build solo lo dijo con un
 * `MISSING_MESSAGE` en la consola del prerender — que nadie lee y que no
 * pone nada en rojo. Una clave que existe en un idioma existe en el otro.
 */
type Arbol = { [k: string]: string | Arbol };

function claves(nodo: Arbol, prefijo = ""): string[] {
  return Object.entries(nodo).flatMap(([k, v]) =>
    typeof v === "string" ? [`${prefijo}${k}`] : claves(v, `${prefijo}${k}.`),
  );
}

describe("messages/*.json — paridad ES/EN", () => {
  const es = JSON.parse(readFileSync("messages/es.json", "utf8")) as Arbol;
  const en = JSON.parse(readFileSync("messages/en.json", "utf8")) as Arbol;

  it("toda clave del español existe en inglés, y al revés", () => {
    const soloEs = claves(es).filter((k) => !claves(en).includes(k));
    const soloEn = claves(en).filter((k) => !claves(es).includes(k));
    expect({ soloEs, soloEn }).toEqual({ soloEs: [], soloEn: [] });
  });
});
