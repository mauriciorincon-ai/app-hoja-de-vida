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
import { mkdirSync, mkdtempSync, rmSync, writeFileSync } from "node:fs";
import os from "node:os";
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

  /**
   * Velo: el estado vive EN LA PESTAÑA (nada se guarda — es su tesis), así que
   * las escenas del flujo se encadenan con `ir` (clics) en vez de `ruta`
   * (un goto recarga y el diagnóstico desaparece, a propósito).
   */
  anonimizador: {
    repo: "app-anonimizador",
    puerto: 3163,
    escenas: [
      {
        nombre: "diagnostico",
        async ir(p, base) {
          await p.goto(`${base}/`, { waitUntil: "networkidle" });
          // La tabla sintética viaja EN este script: NITs y teléfonos inventados.
          await p.setInputFiles('input[type="file"]', tablaSintetica());
          await p.waitForTimeout(2500);
        },
        desde: "top",
        foco: "main section",
      },
      {
        // Mismo diagnóstico, enfocado en el bloque del riesgo de reidentificación.
        // Sin `desde: "top"` — la cifra es la protagonista y el encabezado de
        // la página ya salió en la escena anterior.
        nombre: "riesgo",
        foco: "texto:Cuánta gente queda sola",
        bloque: "section",
      },
      {
        nombre: "transformar",
        async ir(p) {
          await p.click('a:has-text("Transformar este archivo")');
          await p.waitForTimeout(1500);
        },
        desde: "top",
        foco: "main section",
      },
      // El regreso es formulario puro: aguanta un goto limpio.
      { nombre: "regreso", ruta: "/regreso", desde: "top", foco: "main section" },
    ],
  },

  /**
   * Dash lee transcripts REALES del home — prohibido en un repo público. Su
   * propio kit lo resuelve: un árbol sintético con semilla + DASH_FUENTES, y
   * un CANDADO que aborta si una página llegara a contener el home real.
   */
  "dash-agent-ai": {
    repo: "app-dash-agent-ai",
    puerto: 3147,
    entorno(repo) {
      const raiz = mkdtempSync(path.join(os.tmpdir(), "vitrina-dash-"));
      const r = spawnSync(
        process.execPath,
        [
          "docs/kit-de-prueba/generador.mjs",
          "--destino",
          path.join(raiz, "arbol"),
          "--semilla",
          "vitrina-s5",
        ],
        { cwd: repo, stdio: "pipe" },
      );
      if (r.status !== 0)
        throw new Error(`el generador de dash falló:\n${r.stderr}`);
      return {
        DASH_FUENTES: path.join(raiz, "arbol", "claude"),
        DASH_INDICE_DIR: path.join(raiz, "indice"),
      };
    },
    async alIniciar(p, base) {
      // Sin índice las pantallas están vacías y la captura no dice nada.
      await p.goto(`${base}/`, { waitUntil: "networkidle" });
      const boton = p.getByRole("button", { name: "Indexar ahora" });
      if (await boton.isVisible().catch(() => false)) {
        await boton.click();
        await p
          .getByText(/índice al día · \d+ sesiones/)
          .waitFor({ timeout: 60000 });
      }
    },
    prohibidos: [os.homedir(), "/.claude/projects"],
    escenas: [
      { nombre: "auditor", ruta: "/auditor", desde: "top", foco: "main section" },
      { nombre: "costos", ruta: "/costos", desde: "top", foco: "main section" },
      { nombre: "atribucion", ruta: "/atribucion", desde: "top", foco: "main section" },
      { nombre: "timeline", ruta: "/timeline", desde: "top", foco: "main section" },
      { nombre: "confianza", ruta: "/confianza", desde: "top", foco: "main section" },
    ],
  },

  /** Probeta DS: una sola página; el experimento se conduce con sus ejemplos. */
  ds: {
    repo: "app-ds",
    puerto: 3301,
    escenas: [
      {
        // El ejemplo embebido de la app: datos sintéticos de fábrica.
        nombre: "datos",
        async ir(p, base) {
          await p.goto(`${base}/`, { waitUntil: "networkidle" });
          await p.click("text=Campaña de marketing");
          await p.waitForTimeout(2500);
        },
        desde: "top",
        foco: "texto:VISTA PREVIA",
        bloque: "section,div",
      },
      {
        nombre: "veredicto",
        async ir(p) {
          await p.selectOption("select", { label: "convirtio" });
          await p.click('button:has-text("Entrenar modelo")');
          await p.waitForTimeout(9000);
        },
        foco: "texto:baseline",
        bloque: "section",
      },
      { nombre: "porque", foco: "texto:Por qué predice", bloque: "section" },
      { nombre: "usar", foco: "texto:Usa tu modelo", bloque: "section" },
    ],
  },

  /** Nutri-Kids trae su «Dieta demo» de fábrica: datos sintéticos propios. */
  "nutri-kids": {
    repo: "app-nutri-kids",
    puerto: 3284,
    async alIniciar(p, base) {
      // El aviso de primeros pasos tapa todas las rutas hasta aceptarse.
      await p.goto(`${base}/`, { waitUntil: "networkidle" });
      const boton = p.getByRole("button", { name: /Entendido/ });
      if (await boton.isVisible().catch(() => false)) await boton.click();
      await p.waitForTimeout(600);
    },
    escenas: [
      { nombre: "hoy", ruta: "/", desde: "top", foco: "main section, main div" },
      { nombre: "dieta", ruta: "/dieta", desde: "top", foco: "main section, main div" },
      { nombre: "cargar", ruta: "/cargar", desde: "top", foco: "main section, main div" },
      { nombre: "ajustes", ruta: "/ajustes", desde: "top", foco: "main section, main div" },
    ],
  },

  inmobiliaria: {
    repo: "app-inmobiliaria",
    puerto: 3135,
    escenas: [
      { nombre: "campana", ruta: "/", desde: "top", foco: "main section, main div" },
      {
        // Paso 1 del formulario: la fricción cero que promete el grupo.
        nombre: "publicar",
        ruta: "/publicar",
        desde: "top",
        foco: "main form, main section",
      },
      {
        // El anuncio armado, en su paso «Revisa y publica». Se conduce el
        // formulario entero con un inmueble INVENTADO: `/mi-anuncio` a secas
        // pide el enlace privado y muestra una pantalla vacía que no cuenta
        // nada de este grupo.
        nombre: "anuncio",
        async ir(p, base) {
          await p.goto(`${base}/publicar`, { waitUntil: "networkidle" });
          await p.fill('input[placeholder="Tu nombre"]', "Ana Restrepo");
          await p.fill('input[placeholder="300 123 4567"]', "3001234567");
          await p.click('button:has-text("Continuar")');
          await p.waitForTimeout(1200);
          // El radio va `sr-only` y su label intercepta el clic: `force`.
          await p.check('input[value="venta"]', { force: true });
          for (const s of await p.$$("select")) {
            const v = await s.$$eval("option", (o) => o[1]?.value);
            if (v) await s.selectOption(v);
          }
          await p.fill('input[placeholder="Ej: Cedritos"]', "Cedritos");
          await p.fill('input[placeholder="78"]', "78");
          await p.fill('input[placeholder="3"]', "3");
          await p.fill('input[placeholder="420.000.000"]', "420000000");
          await p.click('button:has-text("Continuar")');
          await p.waitForTimeout(2500);
        },
        desde: "top",
        foco: "main form, main section",
      },
      // El panel del operador se muestra en su puerta: «acceso solo para el
      // equipo» ES el mensaje del grupo «quién opera».
      { nombre: "operador", ruta: "/operador", desde: "top", foco: "main form, main section" },
    ],
  },
};

/** La tabla sintética de Velo se escribe al vuelo — inventada, a la vista. */
function tablaSintetica() {
  const ruta = path.join(TEMP, "tabla-sintetica.csv");
  writeFileSync(
    ruta,
    [
      "nombre,documento,telefono,ciudad,puntaje",
      "Comercial Andina SAS,900123456-8,3001234567,Bogotá,0.82",
      "Distribuidora del Sur,830045210-5,3109876543,Cali,0.41",
      "Insumos La Palma,901447038-7,3155551234,Medellín,0.77",
      "Ferretería El Puente,900884201-1,3012223344,Bogotá,0.35",
    ].join("\n"),
  );
  return ruta;
}

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

  // `entorno` prepara datos sintéticos ANTES de arrancar (dash: árbol con
  // semilla) y devuelve las variables que lo apuntan.
  const extra = config.entorno ? config.entorno(repo) : {};

  const servidor = spawn("pnpm", ["dev"], {
    cwd: repo,
    env: { ...process.env, PORT: String(config.puerto), ...extra },
    stdio: "ignore",
    detached: true,
  });

  try {
    await esperarPuerto(config.puerto);
    const base = `http://localhost:${config.puerto}`;
    const nav = await chromium.launch();
    // `reducedMotion` para fotografiar el estado final, no un cuadro a media
    // animación: una captura a media opacidad miente sobre el producto.
    const ctx = await nav.newContext({
      viewport: PANTALLA,
      deviceScaleFactor: DPR,
      reducedMotion: "reduce",
    });
    // El overlay de desarrollo de Next (el badge rojo de «Issues») NO es el
    // producto: fuera de toda captura.
    await ctx.addInitScript(() => {
      const s = document.createElement("style");
      s.textContent = "nextjs-portal{display:none!important}";
      document.documentElement.appendChild(s);
    });
    const p = await ctx.newPage();

    // Preparación única de la app (indexar dash, aceptar el aviso de nutri…).
    if (config.alIniciar) await config.alIniciar(p, base);

    for (const escena of config.escenas) {
      // `ir` conduce (clics con estado en la pestaña); `ruta` navega limpio;
      // sin ninguno, la escena continúa sobre la página donde quedó la anterior.
      if (escena.ir) await escena.ir(p, base);
      else if (escena.ruta)
        await p.goto(`${base}${escena.ruta}`, { waitUntil: "networkidle" });
      if (escena.preparar) await escena.preparar(p);
      await p.waitForTimeout(600);

      // CANDADO (patrón de dash): si la página contiene un dato de la lista
      // prohibida, se aborta ANTES de escribir un solo byte de imagen.
      if (config.prohibidos?.length) {
        const html = await p.content();
        const filtrado = config.prohibidos.find((s) => html.includes(s));
        if (filtrado)
          throw new Error(
            `CANDADO en ${slug}/${escena.nombre}: la página contiene "${filtrado}". Nada se guardó.`,
          );
      }
      // NADA SALE CORTADO (gate M1, ronda 2): la escena declara con `foco` el
      // bloque que debe verse COMPLETO (con `desde: "top"` la región arranca en
      // el techo de la página e incluye el encabezado). Si la región no cabe en
      // el cuadro, se encoge la página con zoom hasta que quepa — el sobrante
      // del cuadro lo llena el fondo de la app, jamás un bloque rebanado.
      await p.evaluate(
        ({ sel, cual, desde, vh, bloque }) => {
          const MARGEN = 20;
          // Abajo casi a ras: el hueco entre tarjetas es ~24px y un margen
          // holgado deja asomar el filo del bloque siguiente.
          const MARGEN_INF = 8;
          let candidatos = [];
          if (sel?.startsWith("texto:")) {
            // Foco por TEXTO: el encabezado que lo contiene, subido al bloque
            // que lo envuelve (`bloque`) para encuadrar la sección entera.
            const aguja = sel.slice(6).toLowerCase();
            const h = Array.from(
              document.querySelectorAll("h1,h2,h3,h4,p"),
            ).find((e) => (e.textContent || "").toLowerCase().includes(aguja));
            const cont = h?.closest(bloque || "section") ?? h;
            if (cont) candidatos = [cont];
          } else if (sel) {
            candidatos = Array.from(document.querySelectorAll(sel));
          }
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
          bloque: escena.bloque,
        },
      );
      await p.waitForTimeout(200);

      // Barrido final anti-overlay: el indicador de dev de Next (el badge de
      // «Issues») NO es el producto. Cambia de nombre y de sitio entre
      // versiones —`nextjs-portal`, `next-devtools-indicator`, anidado o no—,
      // así que se barre por lo único estable: es un CUSTOM ELEMENT, y estas
      // apps son React puro sin ninguno propio. Barrido de TODO el documento
      // (el primer intento solo miró los hijos del body y el badge sobrevivió).
      await p.evaluate(() => {
        for (const el of document.querySelectorAll("*")) {
          if (el.tagName.includes("-"))
            el.style.setProperty("display", "none", "important");
        }
      });

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
