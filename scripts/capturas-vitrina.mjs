#!/usr/bin/env node
/**
 * CAPTURAS DE LA VITRINA — las pantallas reales de las apps hermanas.
 *
 * El banco de técnicas §7 (enmienda kit v1.23.0) es tajante: **si la pieza
 * enseña LA APP, van capturas de la app CORRIENDO o no va.** Nada de maquetas
 * dibujadas a mano — «una maqueta impecable puede MENTIR». Y exige que sean
 * reproducibles: por eso esto es un script del repo y no un puñado de PNG que
 * nadie sabe de dónde salieron.
 *
 * Qué hace: levanta el servidor de desarrollo de cada app hermana, conduce su
 * UI real con datos SINTÉTICOS (jamás datos de una persona — repo público),
 * fotografía las escenas declaradas y las guarda en `public/vitrina/` como WebP.
 *
 *   pnpm capturas:vitrina            # todas las apps configuradas
 *   pnpm capturas:vitrina habla      # solo una
 *
 * Requisitos: las apps hermanas clonadas como hermanas de este repo y con sus
 * dependencias instaladas, y `cwebp` en el PATH (`brew install webp`).
 *
 * Cero datos reales: los apodos, objetivos y textos que se teclean aquí son
 * inventados y viven en este archivo, a la vista.
 */

import { spawn, spawnSync } from "node:child_process";
import { mkdirSync, rmSync } from "node:fs";
import path from "node:path";
import process from "node:process";
import { chromium } from "playwright";

const RAIZ = process.cwd();
const HERMANAS = path.resolve(RAIZ, "..");
const DESTINO = path.join(RAIZ, "public", "vitrina");
const TEMP = path.join(RAIZ, ".capturas-tmp");

/**
 * APAISADA (decisión del usuario en el gate M1): dentro de las tarjetas la
 * imagen va a lo ancho, así que se fotografía la vista de escritorio.
 * 1.5 de DPR: la captura se pinta a ~560px en la ficha — 1536 ya es su 2×,
 * y el DPR 2 solo engordaría el WebP sin ganancia visible.
 */
const PANTALLA = { width: 1024, height: 640 };
const DPR = 1.5;

/**
 * Una escena = una pantalla que vale la pena enseñar. `preparar` conduce la UI
 * real hasta ese estado (onboarding, formularios); si no hace falta, se omite.
 */
const APPS = {
  habla: {
    repo: "app-habla",
    puerto: 3101,
    escenas: [
      {
        nombre: "hoy",
        ruta: "/",
        // La protagonista es la cápsula del día, ENTERA (el encabezado de la
        // página no cabe con ella y la cápsula se basta sola).
        foco: "main article",
        async preparar(p) {
          // Onboarding con datos inventados: un apodo y dos intereses.
          await p.fill('input[placeholder="Su apodo"]', "Santi");
          await p.click('button:has-text("Animales")');
          await p.click('button:has-text("El espacio")');
          await p.click('button:has-text("Empezar")');
          await p.waitForTimeout(1200);
        },
      },
      // Título + los cuatro juegos completos.
      { nombre: "jugar", ruta: "/jugar", foco: "main ul", desde: "top" },
      // Título + el formulario del objetivo entero.
      { nombre: "objetivo", ruta: "/objetivo", foco: "main section", desde: "top" },
      // El contexto es el mismo: el onboarding de la escena 1 ya quedó hecho.
      // Del techo al CTA «Grabar mi voz» (el último botón de acento).
      {
        nombre: "estudio",
        ruta: "/estudio",
        foco: "main .bg-acento",
        cual: "ultimo",
        desde: "top",
      },
      // El rumbo sale VACÍO a propósito: es lo que la app enseña de verdad
      // antes de jugar — y lo honesto es no fabricarle un historial.
      { nombre: "rumbo", ruta: "/rumbo", foco: "main section", desde: "top" },
      // Título + la primera tarjeta («¿Cómo habla su hijo hoy?») completa.
      { nombre: "ajustes", ruta: "/ajustes", foco: "main section", desde: "top" },
    ],
  },
};

function esperarPuerto(puerto, intentos = 120) {
  return new Promise((resolve, reject) => {
    let n = 0;
    const tic = setInterval(async () => {
      n += 1;
      try {
        const r = await fetch(`http://localhost:${puerto}/`);
        if (r.ok) {
          clearInterval(tic);
          resolve();
        }
      } catch {
        if (n >= intentos) {
          clearInterval(tic);
          reject(new Error(`el servidor del puerto ${puerto} nunca respondió`));
        }
      }
    }, 1000);
  });
}

async function capturarApp(slug, config) {
  const repo = path.join(HERMANAS, config.repo);
  console.log(`\n▸ ${slug} — levantando ${config.repo} en :${config.puerto}`);

  const servidor = spawn("pnpm", ["dev"], {
    cwd: repo,
    env: { ...process.env, PORT: String(config.puerto) },
    stdio: "ignore",
    detached: true,
  });

  try {
    await esperarPuerto(config.puerto);
    const nav = await chromium.launch();
    // `reducedMotion` para fotografiar el estado final, no un cuadro a media
    // animación: una captura a media opacidad miente sobre el producto.
    const ctx = await nav.newContext({
      viewport: PANTALLA,
      deviceScaleFactor: DPR,
      reducedMotion: "reduce",
    });
    const p = await ctx.newPage();

    for (const escena of config.escenas) {
      await p.goto(`http://localhost:${config.puerto}${escena.ruta}`, {
        waitUntil: "networkidle",
      });
      if (escena.preparar) await escena.preparar(p);
      await p.waitForTimeout(600);
      // NADA SALE CORTADO (gate M1, ronda 2): la escena declara con `foco` el
      // bloque que debe verse COMPLETO (con `desde: "top"` la región arranca en
      // el techo de la página e incluye el encabezado). Si la región no cabe en
      // el cuadro, se encoge la página con zoom hasta que quepa — el sobrante
      // del cuadro lo llena el fondo de la app, jamás un bloque rebanado.
      await p.evaluate(
        ({ sel, cual, desde, vh }) => {
          const MARGEN = 20;
          // Abajo casi a ras: el hueco entre tarjetas es ~24px y un margen
          // holgado deja asomar el filo del bloque siguiente.
          const MARGEN_INF = 8;
          const candidatos = sel
            ? Array.from(document.querySelectorAll(sel))
            : [];
          const el =
            cual === "ultimo" ? candidatos.at(-1) : candidatos[0];
          if (!el) {
            window.scrollTo(0, 0);
            return;
          }
          const r = el.getBoundingClientRect();
          const techo =
            desde === "top" ? 0 : r.top + window.scrollY - MARGEN;
          const piso = r.bottom + window.scrollY + MARGEN_INF;
          const alto = piso - techo;
          const z = Math.min(1, vh / alto);
          if (z < 1) document.body.style.zoom = String(z);
          // Tras el zoom la página entera se re-escala: se vuelve a medir.
          const r2 = el.getBoundingClientRect();
          const techo2 =
            desde === "top" ? 0 : r2.top + window.scrollY - MARGEN * z;
          const alto2 = alto * z;
          window.scrollTo(
            0,
            Math.max(0, techo2 - Math.max(0, (vh - alto2) / 2)),
          );
        },
        {
          sel: escena.foco,
          cual: escena.cual,
          desde: escena.desde,
          vh: PANTALLA.height,
        },
      );
      await p.waitForTimeout(200);

      const png = path.join(TEMP, `${slug}-${escena.nombre}.png`);
      await p.screenshot({ path: png });

      const webp = path.join(DESTINO, `${slug}-${escena.nombre}.webp`);
      const r = spawnSync("cwebp", ["-q", "72", "-quiet", png, "-o", webp]);
      if (r.status !== 0) throw new Error(`cwebp falló en ${escena.nombre}`);
      console.log(`  ✓ ${slug}-${escena.nombre}.webp`);
    }

    await nav.close();
  } finally {
    // El grupo entero: `pnpm dev` deja hijos (next, tsc) que sobreviven al padre.
    try {
      process.kill(-servidor.pid, "SIGTERM");
    } catch {
      /* ya murió */
    }
  }
}

const pedidas = process.argv.slice(2);
const objetivo = pedidas.length ? pedidas : Object.keys(APPS);

mkdirSync(DESTINO, { recursive: true });
mkdirSync(TEMP, { recursive: true });

for (const slug of objetivo) {
  const config = APPS[slug];
  if (!config) {
    console.error(`sin configuración para "${slug}"`);
    process.exitCode = 1;
    continue;
  }
  await capturarApp(slug, config);
}

rmSync(TEMP, { recursive: true, force: true });
console.log(`\nlisto — las capturas viven en public/vitrina/`);
