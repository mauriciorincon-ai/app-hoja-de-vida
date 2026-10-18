import { readFileSync } from "node:fs";
import { parse } from "yaml";
import type { Traductor } from "@/components/metodo/traductor";
import es from "../../../messages/es.json";
import en from "../../../messages/en.json";
import { parsePieza, type PiezaMetodo } from "@/lib/metodo/schema";

/**
 * Ayudas de las pruebas de «Mi método»: la pieza sintética ya validada y un
 * traductor que lee `messages/*.json` DE VERDAD. Una clave que falta LANZA, en
 * vez de pintar «metodo.fases.xx»: así el test de un componente también es el
 * gate de que cada etiqueta que usa existe en los dos idiomas.
 */

export function ejemploSintetico(): PiezaMetodo {
  const ruta = "tests/fixtures/metodo/ejemplo-sintetico.yaml";
  return parsePieza(parse(readFileSync(ruta, "utf8")), ruta);
}

export function traductorDe(idioma: "es" | "en"): Traductor {
  const raiz = (idioma === "es" ? es : en).metodo as unknown as Record<string, unknown>;
  return (clave, valores) => {
    let nodo: unknown = raiz;
    for (const parte of clave.split(".")) {
      if (typeof nodo !== "object" || nodo === null || !(parte in nodo))
        throw new Error(`metodo.${clave}: no existe en messages/${idioma}.json`);
      nodo = (nodo as Record<string, unknown>)[parte];
    }
    if (typeof nodo !== "string")
      throw new Error(`metodo.${clave}: en messages/${idioma}.json no es un texto`);
    return nodo.replace(/\{(\w+)\}/g, (_, k: string) =>
      valores && k in valores ? String(valores[k]) : `{${k}}`,
    );
  };
}
