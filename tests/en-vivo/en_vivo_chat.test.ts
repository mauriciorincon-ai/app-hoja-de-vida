// @vitest-environment node
import { execFileSync } from "node:child_process";
import {
  chmodSync,
  existsSync,
  mkdirSync,
  readFileSync,
  writeFileSync,
} from "node:fs";
import path from "node:path";
import { afterAll, beforeAll, describe, expect, it } from "vitest";
import { streamRespuesta } from "@/lib/ia/client";
import {
  construirSystemPrompt,
  esOffTopic,
  RESPUESTA_OFFTOPIC,
} from "@/lib/ia/guardrails";
import { getChatIndex } from "@/lib/ia/index-server";
import { resolverProveedor } from "@/lib/ia/provider";
import { esPreguntaDeAusencia, RESPUESTA_REHUSO } from "@/lib/ia/rehuso";
import { TOP_K_CONTEXTO } from "@/lib/ia/retrieval";
import { esTemaAjeno } from "@/lib/ia/tema-ajeno";
import { marcarRespuesta, type Marcas } from "./marcas";

/**
 * LA PASADA EN VIVO DEL CHAT (S24, reglas 24 y 25; ampliada en el S25 con la marca de motivos). El banco y el golden NO
 * llaman al modelo, y la CI usa uno simulado: nada de lo que se prueba allí
 * puede ver si el modelo REAL habla en tercera persona, si afirma una ausencia
 * o si cita lo que usó. Esta pasada sí lo mira, UNA vez, con las preguntas de la
 * guía en español y en inglés.
 *
 * SOLO corre con `pnpm test:en-vivo`, en la máquina del dueño, con su «sí»
 * (matriz de la regla 24 en el STOP del sprint). Prefijo `en_vivo_`: ninguna
 * otra suite la ve.
 *
 * QUÉ TOCA (se declara al arrancar y aborta ante cualquier otra cosa):
 *  · LEE   `.env.local` (solo las claves del chat, en memoria; JAMÁS se imprimen),
 *          `data/` y `content/` (para regenerar el índice, igual que el build);
 *  · ESCRIBE `public/chat-index.{es,en}.json` (artefactos de build, ignorados por
 *          git) y `privado/pasada-en-vivo-s25.md` (ignorado por git, modo 600);
 *  · LLAMA al proveedor del chat — Groq, plan Free (≈ US$0, sin factura posible) —
 *          una vez por pregunta que llega al modelo (16 en total);
 *  · NO cruza la puerta ni el registro del chat: no hay sesión, no escribe en
 *          Supabase, no manda correo.
 */

const RAIZ = process.cwd();
/**
 * ENSAYO EN SECO (`EN_VIVO_SECO=1`): el mismo arnés con el modelo SIMULADO, sin
 * clave ni red. Sirve para ver que el arnés corre de punta a punta antes de gastar
 * la pasada real; su informe va a OTRO archivo para que nadie lo confunda con ella.
 */
const SECO = process.env.EN_VIVO_SECO === "1";
const INFORME = path.join(
  RAIZ,
  "privado",
  SECO ? "pasada-en-vivo-s25-en-seco.md" : "pasada-en-vivo-s25.md",
);
const PAUSA_MS = SECO ? 0 : 20_000; // el plan Free corta a 8 000 tokens/min
const proveedor = () =>
  SECO
    ? resolverProveedor({ ...process.env, CHAT_PROVIDER: "mock" })
    : resolverProveedor();
const ESPERA_429_MS = 65_000;

/** Solo estas claves se leen de `.env.local`; nada más entra al proceso. */
const CLAVES_PERMITIDAS = [
  "CHAT_PROVIDER",
  "CHAT_MODEL",
  "GROQ_API_KEY",
] as const;

type Ruta = "modelo" | "rehuso" | "ajena";
type Pregunta = {
  es: string;
  en: string;
  ruta: Ruta;
  /** Qué debe pasar con esta pregunta, para el informe. */
  espera: string;
  /** Un fragmento que DEBE estar entre las fuentes citadas (por su destino). */
  citaDestino?: RegExp;
  /** La respuesta no debe nombrar el AI-102 ni el DP-100 (nadie los preguntó). */
  sinCredenciales?: boolean;
  /** La pregunta pide un porqué que el corpus no da: se marcan las causas e intenciones que añada (S25). */
  vigilaMotivos?: boolean;
};

const PREGUNTAS: Pregunta[] = [
  {
    es: "¿Qué hizo Henry en Vesting?",
    en: "What did Henry do at Vesting?",
    ruta: "modelo",
    espera: "responde con evidencia, tercera persona, cita",
  },
  {
    es: "¿Cómo ha sido la trayectoria profesional de Henry?",
    en: "How has Henry's career evolved?",
    ruta: "modelo",
    espera: "responde con evidencia, tercera persona, cita",
  },
  {
    es: "¿Qué experiencia tiene con IA y agentes?",
    en: "What experience does he have with AI and agents?",
    ruta: "modelo",
    espera:
      "responde con evidencia, tercera persona, cita; Foundry con su forma completa",
  },
  {
    es: "¿Cómo se debe gobernar la IA en una organización?",
    en: "How should AI be governed in an organization?",
    ruta: "modelo",
    espera: "cita la publicación de «Métodos»",
  },
  {
    es: "¿Qué no ha hecho nunca?",
    en: "What has he never done?",
    ruta: "rehuso",
    espera: "respuesta fija de rehúso, sin llamar al modelo y sin fuentes",
  },
  {
    es: "¿Qué datos guardan sobre mí?",
    en: "What data do you keep about me?",
    ruta: "modelo",
    espera:
      "trae «Qué datos guarda este chat» (también en inglés, con «keep») y contesta con eso, sin afirmar ausencias",
  },
  {
    es: "¿Por qué salió de Vesting?",
    en: "Why did he leave Vesting?",
    ruta: "modelo",
    espera:
      "cuenta cómo cerró la etapa (enero de 2025, ecosistema y proceso documentados), en tercera persona, SIN añadir un motivo que el documento no da",
    vigilaMotivos: true,
  },
  {
    es: "¿Tiene el AI-102?",
    en: "Does he have the AI-102?",
    ruta: "rehuso",
    espera: "respuesta fija de rehúso (no cuenta nada del examen), sin fuentes",
  },
  {
    es: "¿Cómo está el clima?",
    en: "How is the weather?",
    ruta: "ajena",
    espera: "respuesta estática, sin fuentes (OM-16)",
  },
  {
    es: "¿Qué certificaciones tiene?",
    en: "Which certifications does he hold?",
    ruta: "modelo",
    espera:
      "enumera las que constan; no narra el AI-102 ni el DP-100 si nadie los preguntó",
    sinCredenciales: true,
  },
  {
    es: "¿Qué estudió Henry?",
    en: "What did Henry study?",
    ruta: "modelo",
    espera: "responde con la Javeriana y CITA «Estudios» (OM-17)",
    citaDestino: /estudios|education/i,
  },
];

type Resultado = {
  locale: "es" | "en";
  pregunta: string;
  ruta: Ruta;
  espera: string;
  usada: Ruta | "offtopic-lexico";
  respuesta: string;
  fuentes: string[];
  marcas: Marcas | null;
  tokens?: { entrada?: number; salida?: number };
  ms: number;
  error?: string;
  /** Lo que la pasada considera un defecto (no solo una marca). */
  defectos: string[];
};

const resultados: Resultado[] = [];
const dormir = (ms: number) => new Promise((r) => setTimeout(r, ms));

function cargarEnvLocal(): string[] {
  const ruta = path.join(RAIZ, ".env.local");
  if (!existsSync(ruta)) return [];
  const cargadas: string[] = [];
  for (const linea of readFileSync(ruta, "utf8").split("\n")) {
    const m = linea.match(/^\s*([A-Z0-9_]+)\s*=\s*(.*)\s*$/);
    if (!m) continue;
    const clave = m[1] as (typeof CLAVES_PERMITIDAS)[number];
    if (!CLAVES_PERMITIDAS.includes(clave)) continue;
    if (process.env[clave]) continue;
    process.env[clave] = m[2].replace(/^["']|["']$/g, "");
    cargadas.push(clave);
  }
  return cargadas;
}

beforeAll(() => {
  // Las dos puertas de la regla 25: solo con la orden explícita y nunca en la CI.
  if (process.env.EN_VIVO !== "1") {
    throw new Error(
      "La pasada en vivo solo corre con `pnpm test:en-vivo` (EN_VIVO=1), en la máquina del dueño y con su «sí» (reglas 24 y 25).",
    );
  }
  if (process.env.CI) {
    throw new Error("La pasada en vivo no corre en la CI (regla 25).");
  }
  const cargadas = SECO ? [] : cargarEnvLocal();
  if (!SECO) {
    const elegido = process.env.CHAT_PROVIDER ?? "groq";
    if (elegido !== "groq") {
      throw new Error(
        `La pasada está autorizada contra Groq (plan Free), no contra «${elegido}».`,
      );
    }
    if (!process.env.GROQ_API_KEY) {
      throw new Error(
        "Falta GROQ_API_KEY en .env.local: sin la clave no hay pasada (y nunca se imprime).",
      );
    }
  }
  const modelo = proveedor();
  if (!modelo) throw new Error("No se pudo resolver el proveedor del chat.");
  // Se declara el árbol ANTES de tocar nada (regla 17-bis).
  const lineas = [
    SECO
      ? "── ENSAYO EN SECO · S25 (modelo simulado, sin red) ──"
      : "── PASADA EN VIVO · S25 ──",
    SECO
      ? "  lee:     data/ · content/ (no lee .env.local en el ensayo en seco)"
      : `  lee:     .env.local (${cargadas.length ? cargadas.join(", ") : "variables ya en el entorno"}; los valores no se imprimen) · data/ · content/`,
    `  escribe: public/chat-index.{es,en}.json (artefactos de build) · privado/${path.basename(INFORME)}`,
    `  llama:   ${modelo.proveedor} · ${modelo.modelId} — una vez por pregunta que llega al modelo${SECO ? " (simulado: no sale a la red)" : ""}`,
    "  no toca: la puerta del chat, el registro, Supabase, el correo",
  ];
  process.stdout.write(`${lineas.join("\n")}\n`);

  execFileSync(process.execPath, ["scripts/build-chat-index.mjs"], {
    cwd: RAIZ,
    stdio: "ignore",
  });
}, 5 * 60_000);

async function responderConModelo(
  locale: "es" | "en",
  pregunta: string,
): Promise<{
  texto: string;
  recuperadas: number;
  fuentes: string[];
  tokens: { entrada?: number; salida?: number };
}> {
  const { retriever } = getChatIndex(locale);
  const contexto = retriever.topK(pregunta, TOP_K_CONTEXTO);
  const modelo = proveedor();
  if (!modelo) throw new Error("proveedor sin resolver");
  const system = construirSystemPrompt(locale, contexto);
  const llamar = async () => {
    const r = streamRespuesta({
      modelo,
      system,
      messages: [{ role: "user", content: pregunta }],
    });
    const [texto, uso] = await Promise.all([r.text, r.totalUsage]);
    return { texto, uso };
  };
  let salida;
  try {
    salida = await llamar();
  } catch (primero) {
    // UN reintento, y solo si el plan Free cortó por ritmo (429). Segundo fallo: se registra y se sigue.
    if (!/429|rate/i.test(String(primero))) throw primero;
    await dormir(ESPERA_429_MS);
    salida = await llamar();
  }
  return {
    texto: salida.texto,
    recuperadas: contexto.length,
    fuentes: contexto.map(
      (c, i) =>
        `[${i + 1}] ${c.chunk.codigo} · ${c.chunk.destino} (${c.chunk.ancla})`,
    ),
    tokens: {
      entrada: salida.uso.inputTokens,
      salida: salida.uso.outputTokens,
    },
  };
}

function defectosDe(
  p: Pregunta,
  usada: Resultado["usada"],
  respuesta: string,
  marcas: Marcas | null,
  fuentes: string[],
): string[] {
  const d: string[] = [];
  if (p.ruta === "rehuso" && usada !== "rehuso")
    d.push("debió rehusarse y no se rehusó");
  if (p.ruta === "ajena" && usada !== "ajena" && usada !== "offtopic-lexico")
    d.push("debió declinarse como ajena y llegó al modelo");
  if (!marcas) return d;
  if (marcas.voz.length) d.push(`voz del dueño: ${marcas.voz.join(", ")}`);
  if (marcas.ausencia.length)
    d.push(`ausencia afirmada: ${marcas.ausencia.join(" | ")}`);
  if (marcas.motivos.length)
    d.push(
      `motivo que las fuentes quizá no dan (léelo): ${marcas.motivos.join(" | ")}`,
    );
  if (marcas.inventadas.length)
    d.push(`cita [${marcas.inventadas.join(", ")}] que no existe`);
  if (
    marcas.citadas.length === 0 &&
    respuesta.trim() !== RESPUESTA_REHUSO.es &&
    respuesta.trim() !== RESPUESTA_REHUSO.en
  )
    d.push("no cita ninguna fuente");
  if (p.sinCredenciales && marcas.credencialesSinObtener.length)
    d.push(
      `nombra ${marcas.credencialesSinObtener.join(", ")} sin que nadie lo preguntara`,
    );
  if (p.citaDestino) {
    const citadas = marcas.citadas.map((n) => fuentes[n - 1] ?? "");
    if (!citadas.some((f) => p.citaDestino!.test(f)))
      d.push("no cita «Estudios»");
  }
  if (marcas.foundrySinForma)
    d.push(
      "Foundry sin «Microsoft Foundry (antes Azure AI Foundry)» la primera vez",
    );
  return d;
}

describe("la pasada en vivo · el chat contra el proveedor real", () => {
  for (const locale of ["es", "en"] as const) {
    for (const p of PREGUNTAS) {
      const pregunta = p[locale];
      it(`en_vivo_[${locale}] ${pregunta}`, async () => {
        const t0 = Date.now();
        const base = { locale, pregunta, ruta: p.ruta, espera: p.espera };
        // 1) Los mismos filtros que la ruta, en el mismo orden.
        if (esPreguntaDeAusencia(pregunta)) {
          resultados.push({
            ...base,
            usada: "rehuso",
            respuesta: RESPUESTA_REHUSO[locale],
            fuentes: [],
            marcas: null,
            ms: Date.now() - t0,
            defectos: defectosDe(
              p,
              "rehuso",
              RESPUESTA_REHUSO[locale],
              null,
              [],
            ),
          });
          return;
        }
        if (esTemaAjeno(pregunta)) {
          resultados.push({
            ...base,
            usada: "ajena",
            respuesta: RESPUESTA_OFFTOPIC[locale],
            fuentes: [],
            marcas: null,
            ms: Date.now() - t0,
            defectos: defectosDe(
              p,
              "ajena",
              RESPUESTA_OFFTOPIC[locale],
              null,
              [],
            ),
          });
          return;
        }
        const { retriever } = getChatIndex(locale);
        if (esOffTopic(retriever.topKStrict(pregunta))) {
          resultados.push({
            ...base,
            usada: "offtopic-lexico",
            respuesta: RESPUESTA_OFFTOPIC[locale],
            fuentes: [],
            marcas: null,
            ms: Date.now() - t0,
            defectos: defectosDe(
              p,
              "offtopic-lexico",
              RESPUESTA_OFFTOPIC[locale],
              null,
              [],
            ),
          });
          return;
        }
        // 2) Llega al modelo real. Pausa antes (menos la primera) para no pasar de 8 000 tokens/min.
        if (resultados.some((r) => r.usada === "modelo"))
          await dormir(PAUSA_MS);
        const t1 = Date.now();
        try {
          const r = await responderConModelo(locale, pregunta);
          const marcas = marcarRespuesta(r.texto, locale, r.fuentes.length);
          // Los motivos solo se miran donde la pregunta pide un porqué (S25): «porque» sobra en cualquier otra.
          if (!p.vigilaMotivos) marcas.motivos = [];
          resultados.push({
            ...base,
            usada: "modelo",
            respuesta: r.texto,
            fuentes: r.fuentes,
            marcas,
            tokens: r.tokens,
            ms: Date.now() - t1,
            defectos: defectosDe(p, "modelo", r.texto, marcas, r.fuentes),
          });
        } catch (error) {
          resultados.push({
            ...base,
            usada: "modelo",
            respuesta: "",
            fuentes: [],
            marcas: null,
            ms: Date.now() - t1,
            error:
              error instanceof Error
                ? error.message.slice(0, 300)
                : String(error).slice(0, 300),
            defectos: ["el proveedor no respondió"],
          });
        }
      });
    }
  }

  it("en_vivo_resumen · ninguna respuesta con defecto", () => {
    const conDefecto = resultados.filter((r) => r.defectos.length > 0);
    expect(
      conDefecto.map(
        (r) => `[${r.locale}] ${r.pregunta}: ${r.defectos.join("; ")}`,
      ),
      "defectos de la pasada en vivo (el informe en privado/ trae cada respuesta)",
    ).toEqual([]);
  });
});

afterAll(() => {
  if (resultados.length === 0) return;
  const modelo = proveedor();
  const llamadas = resultados.filter((r) => r.usada === "modelo" && !r.error);
  const tokens = llamadas.reduce(
    (t, r) => ({
      entrada: t.entrada + (r.tokens?.entrada ?? 0),
      salida: t.salida + (r.tokens?.salida ?? 0),
    }),
    { entrada: 0, salida: 0 },
  );
  const L: string[] = [];
  L.push("# Pasada en vivo del chat · Sprint 025");
  L.push("");
  L.push(
    `Proveedor: ${modelo?.proveedor ?? "?"} · modelo: ${modelo?.modelId ?? "?"} · ` +
      `${resultados.length} preguntas (ES + EN) · ${llamadas.length} llegaron al modelo · ` +
      `tokens: ${tokens.entrada} de entrada, ${tokens.salida} de salida.`,
  );
  L.push("");
  L.push(
    "| Idioma | Pregunta | Ruta | Voz del dueño | Ausencia | Motivos | Fuentes citadas | Defectos |",
  );
  L.push("|---|---|---|---|---|---|---|---|");
  for (const r of resultados) {
    const m = r.marcas;
    L.push(
      `| ${r.locale} | ${r.pregunta} | ${r.usada} | ${m ? (m.voz.length ? m.voz.join(", ") : "—") : "—"} | ` +
        `${m ? (m.ausencia.length ? m.ausencia.join(" · ") : "—") : "—"} | ` +
        `${m ? (m.motivos.length ? m.motivos.join(" · ") : "—") : "—"} | ` +
        `${m ? (m.citadas.length ? m.citadas.map((n) => `[${n}]`).join(" ") : "ninguna") : "—"} | ` +
        `${r.defectos.length ? r.defectos.join("; ") : "ninguno"} |`,
    );
  }
  L.push("");
  for (const r of resultados) {
    L.push(`## [${r.locale}] ${r.pregunta}`);
    L.push("");
    L.push(`Ruta: ${r.usada} · espera: ${r.espera} · ${r.ms} ms`);
    if (r.error) L.push(`Error: ${r.error}`);
    L.push("");
    L.push(
      r.respuesta
        ? r.respuesta
            .split("\n")
            .map((l) => `> ${l}`)
            .join("\n")
        : "> (sin respuesta)",
    );
    if (r.fuentes.length) {
      L.push("");
      L.push("Fuentes que recibió el modelo:");
      for (const f of r.fuentes) L.push(`- ${f}`);
    }
    L.push("");
  }
  mkdirSync(path.dirname(INFORME), { recursive: true });
  writeFileSync(INFORME, `${L.join("\n")}\n`, { mode: 0o600 });
  chmodSync(INFORME, 0o600);
  process.stdout.write(`\nInforme: privado/${path.basename(INFORME)}\n`);
});
