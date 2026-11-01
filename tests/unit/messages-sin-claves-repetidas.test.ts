import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";

/**
 * UNA CLAVE REPETIDA EN UN OBJETO JSON NO ES UN ERROR: GANA LA ÚLTIMA (S30). Al sumar «verBrochure» al namespace
 * `vitrina` choqué con una que ya existía y el rótulo cambió sin que nada avisara; la paridad es/en no lo ve
 * (las dos lenguas repiten igual). Este gate lee el texto crudo de `messages/*.json` y exige que ninguna clave se
 * repita dentro del mismo objeto.
 */

function repetidas(raw: string): string[] {
  const halladas: string[] = [];
  const pila: { claves: Set<string>; ruta: string }[] = [];
  // Un recorrido mínimo del JSON: llaves, cadenas y dos puntos; lo demás no importa para ver las claves.
  let i = 0;
  let ultimaCadena: string | null = null;
  let esperaClave = false;
  const leerCadena = () => {
    let j = i + 1;
    let t = "";
    while (raw[j] !== '"') {
      if (raw[j] === "\\") {
        t += raw[j]! + raw[j + 1]!;
        j += 2;
      } else t += raw[j++]!;
    }
    i = j + 1;
    return t;
  };
  while (i < raw.length) {
    const c = raw[i]!;
    if (c === "{") {
      const ruta = ultimaCadena && !esperaClave ? ultimaCadena : "";
      pila.push({ claves: new Set(), ruta });
      esperaClave = true;
      ultimaCadena = null;
      i++;
    } else if (c === "}") {
      pila.pop();
      esperaClave = false;
      i++;
    } else if (c === ",") {
      esperaClave = pila.length > 0;
      i++;
    } else if (c === '"') {
      const s = leerCadena();
      if (esperaClave && raw[raw.indexOf(":", i)] !== undefined) {
        const nivel = pila[pila.length - 1]!;
        if (nivel.claves.has(s))
          halladas.push(
            `${pila
              .map((p) => p.ruta)
              .filter(Boolean)
              .join(".")}.${s}`,
          );
        nivel.claves.add(s);
        ultimaCadena = s;
        esperaClave = false;
      }
    } else i++;
  }
  return halladas;
}

describe("messages/*.json: ninguna clave se repite dentro de un objeto", () => {
  it("el detector discrimina: una clave repetida aparece (el rojo del gate)", () => {
    expect(repetidas('{"a":{"x":1,"y":2,"x":3},"b":{"x":1}}')).toEqual(["a.x"]);
    expect(repetidas('{"a":{"x":"{y}"},"b":{"x":1}}')).toEqual([]);
  });

  it.each(["es", "en"])("%s no repite ninguna", (l) => {
    expect(repetidas(readFileSync(`messages/${l}.json`, "utf8"))).toEqual([]);
  });
});
