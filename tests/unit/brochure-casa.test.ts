import { existsSync, readdirSync, readFileSync, statSync } from "node:fs";
import path from "node:path";
import { describe, expect, it } from "vitest";
import { getCasa, getPiezaDeCasa } from "@/lib/brochure/casa";
import { SLUGS_CASA } from "@/lib/brochure/config";
import { getApps } from "@/lib/content";
import {
  CAPTURA_ALTO,
  CAPTURA_ANCHO,
  CAPTURA_MAX_KB,
  dimensionesWebp,
} from "@/lib/vitrina/capturas";
import { getFichasVitrina } from "@/lib/vitrina/loader";

/**
 * LAS DOS DE LA CASA: CV Viva y su chat (S28). Llegan a `content/vitrina/casa/` y no entran al
 * loader de las diez apps: aquí se prueba que validan con los mismos esquemas y gates de imagen, que
 * toman su nombre de `data/apps.yaml` y que la cuenta de apps del Portafolio sigue en diez.
 */

describe("la casa", () => {
  const casa = getCasa();

  it("son exactamente CV Viva y su chat, y las dos validan (export, capturas y complemento)", () => {
    expect(casa.map((p) => p.slug)).toEqual([...SLUGS_CASA]);
    for (const p of casa) {
      expect(p.export.app.slug).toBe(p.slug);
      expect(p.complemento.app).toBe(p.slug);
      expect(p.capturas.capturas.length).toBeGreaterThan(0);
    }
    expect(getPiezaDeCasa("hoja-de-vida")?.slug).toBe("hoja-de-vida");
    expect(getPiezaDeCasa("ds")).toBeUndefined();
  });

  it("el nombre en los dos idiomas sale de data/apps.yaml (el export solo lo trae en español)", () => {
    const apps = getApps().apps;
    for (const p of casa) {
      const card = apps.find((a) => a.id === p.slug)!;
      expect(p.nombre).toEqual(card.nombre);
      expect(p.nombre.es.length).toBeGreaterThan(0);
      expect(p.nombre.en.length).toBeGreaterThan(0);
    }
    expect(casa[0]!.nombre).toEqual({ es: "CV Viva", en: "Living CV" });
  });

  it("su descripción en los dos idiomas sale de data/apps.yaml: es la línea en inglés de «De esta casa»", () => {
    const apps = getApps().apps;
    for (const p of casa) {
      const card = apps.find((a) => a.id === p.slug)!;
      expect(p.descripcion).toEqual(card.descripcion);
      // El export de la casa es solo español: la línea inglesa no puede ser su tagline.
      expect(p.descripcion.en).not.toBe(p.export.promesa.tagline);
      expect(p.descripcion.en.length).toBeGreaterThan(0);
    }
  });

  it("nunca entran a la cuenta de las diez apps del Portafolio", () => {
    const apps = getFichasVitrina().map((f) => f.ancla.slug);
    expect(apps).toHaveLength(10);
    for (const slug of SLUGS_CASA) expect(apps).not.toContain(slug);
    const enDisco = readdirSync("content/vitrina").filter((f) =>
      f.endsWith(".brochure-export.json"),
    );
    expect(enDisco).toHaveLength(10);
    expect(existsSync("data/fichas/hoja-de-vida.yaml")).toBe(false);
  });

  describe.each([...SLUGS_CASA])("%s: sus imágenes", (slug) => {
    const pieza = () => getPiezaDeCasa(slug)!;

    it(`cada una es un WebP de ${CAPTURA_ANCHO}×${CAPTURA_ALTO} y de ${CAPTURA_MAX_KB} KB como máximo`, () => {
      const archivos = [
        pieza().capturas.portada,
        ...pieza().capturas.capturas.map((c) => c.archivo),
      ];
      const mal: string[] = [];
      for (const a of archivos) {
        const f = path.join("public/vitrina", slug, a);
        const kb = statSync(f).size / 1024;
        if (kb > CAPTURA_MAX_KB) mal.push(`${a}: ${kb.toFixed(1)} KB`);
        const d = dimensionesWebp(readFileSync(f));
        if (!d || d[0] !== CAPTURA_ANCHO || d[1] !== CAPTURA_ALTO)
          mal.push(`${a}: ${d ? d.join("×") : "no es WebP"}`);
      }
      expect(mal).toEqual([]);
    });

    it("no sobra ninguna: toda imagen de la carpeta está en su tabla", () => {
      const tabla = new Set([
        pieza().capturas.portada,
        ...pieza().capturas.capturas.map((c) => c.archivo),
      ]);
      const enDisco = readdirSync(path.join("public/vitrina", slug)).filter(
        (f) => f.endsWith(".webp"),
      );
      expect(enDisco.filter((f) => !tabla.has(f))).toEqual([]);
    });
  });
});
