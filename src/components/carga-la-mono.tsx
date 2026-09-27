"use client";

import { useEffect } from "react";

/**
 * ENCIENDE JETBRAINS MONO DESPUÉS DE LA CARGA (2026-09-26).
 *
 * `font-mono` arranca con el fallback calibrado (`--fuente-mono` en
 * globals.css) y ningún texto usa JetBrains hasta que esto marca `mono-lista`
 * en `<html>`. Como una fuente solo se descarga cuando algún texto la usa, la
 * petición sale después del evento `load` y no antes de la primera pintura,
 * que es lo que el simulador de Lighthouse le cobraba al LCP de todas las
 * páginas. Sin JavaScript, las cifras quedan en el fallback, que ocupa la
 * misma caja.
 *
 * No pinta nada: vive en el layout de cada idioma y en el 404 de la raíz.
 */
export function CargaLaMono() {
  useEffect(() => {
    const encender = () => document.documentElement.classList.add("mono-lista");
    if (document.readyState === "complete") {
      encender();
      return;
    }
    window.addEventListener("load", encender, { once: true });
    return () => window.removeEventListener("load", encender);
  }, []);
  return null;
}
