/**
 * EL BANCO DE PREGUNTAS (S8, fase 4b) — la prueba del CONTENIDO.
 *
 * La aduana de `a-fondo.mjs` vigila la FORMA de un documento (frontmatter,
 * ids, paridad, privacidad). El golden set de `a-fondo-golden.test.ts` vigila
 * que cada documento conteste **sus propias** preguntas. Ninguno de los dos
 * responde la pregunta que importa de verdad: **¿qué pasa cuando pregunta
 * alguien que no escribió el corpus?**
 *
 * Eso es este banco: un cuerpo de preguntas reales —las que hace quien
 * entrevista, quien recluta y quien visita el sitio—, cada una con la fuente
 * que DEBERÍA contestarla, medido contra el retriever real.
 *
 * **Por qué el banco encuentra cosas que el golden set no puede.** Las
 * `preguntas_de_prueba` de un documento las escribí yo con el documento
 * delante: usan sus palabras. Un reclutador usa las suyas —«MLOps»,
 * «stakeholders», «posgrado», «series de tiempo»— y la recuperación de este
 * chat es LÉXICA (ADR-010): si una palabra no está en el corpus, no hay
 * resultado. Por eso el banco es, además de una prueba de contenido, una
 * **auditoría de vocabulario**: cada pregunta que falla nombra o un hueco de
 * contenido, o un término que el corpus no dice con las palabras de quien
 * pregunta.
 *
 * Este módulo es el MOTOR (puro y sin `@/`); quien lo cablea con el retriever
 * de verdad —que vive en TypeScript— es `tests/unit/banco-de-preguntas.test.ts`,
 * el mismo patrón con el que `docs/contrato-ficha-tecnica/` se genera desde el
 * Zod: el artefacto publicado lo produce el test, no la mano.
 */

import { readFileSync } from "node:fs";
import process from "node:process";
import { parse } from "yaml";
import { z } from "zod";
import { leerDocumentos, simularAprobacion } from "./a-fondo.mjs";
import { buildChunks } from "./build-chat-index.mjs";

export const RUTA_BANCO = "tests/fixtures/banco-de-preguntas.es.yaml";
export const RUTA_INFORME = "sprints/SPRINT_008-banco-de-preguntas.md";

const preguntaSchema = z.object({
  pregunta: z.string().min(8),
  /**
   * Las fuentes que contestarían bien. **Con que UNA entre en el top-k, la
   * pregunta acierta** — varias fuentes pueden ser una buena respuesta y
   * exigir una sola convierte el gate en una lotería de empates.
   */
  espera: z.array(z.string().min(2)).min(1),
  familia: z.string().min(3),
  nota: z.string().optional(),
});

const bancoSchema = z.object({
  preguntas: z.array(preguntaSchema).min(1),
  /**
   * Cada ajena declara QUÉ le hace el guardrail, porque hay dos resultados
   * legítimos y confundirlos sería mentir sobre la garantía (`guardrails.ts`):
   *  · `bloquea` — no casa nada sustantivo: respuesta fija, cero tokens.
   *  · `pasa`    — comparte vocabulario con el corpus, llega al modelo, y ahí
   *                la para el prompt grounding-only. Medido, no supuesto.
   */
  ajenas: z
    .array(
      z.object({
        pregunta: z.string().min(5),
        guardrail: z.enum(["bloquea", "pasa"]),
        porque: z.string().optional(),
      }),
    )
    .min(1),
  sin_cobertura: z
    .array(
      z.object({
        pregunta: z.string().min(8),
        porque: z.string().min(20),
        donde_iria: z.string().min(2),
      }),
    )
    .default([]),
});

/** Lee y VALIDA el banco. Un banco malformado rompe con archivo y campo. */
export function leerBanco(ruta = RUTA_BANCO) {
  const r = bancoSchema.safeParse(parse(readFileSync(ruta, "utf8")));
  if (!r.success) {
    throw new Error(
      `${ruta}: banco de preguntas inválido:\n` +
        r.error.issues
          .map((i) => `  - ${i.path.join(".") || "(raíz)"}: ${i.message}`)
          .join("\n"),
    );
  }
  return r.data;
}

const leerYaml = (f) => parse(readFileSync(`data/${f}`, "utf8"));

/**
 * El índice TAL COMO ESTÁ EN DISCO: hoy, con los 24 documentos en borrador,
 * son los 28 fragmentos de los YAML. Es lo que contesta producción ahora.
 */
export function corpusPublicado(locale = "es") {
  return buildChunks({
    cv: leerYaml(`cv.${locale}.yaml`),
    apps: leerYaml("apps.yaml"),
    aFondo: leerDocumentos(locale),
    locale,
  });
}

/**
 * El índice que EXISTIRÁ cuando el dueño apruebe: los mismos documentos
 * forzados a `aprobado` y **sin sus preguntas abiertas**, porque aprobar es
 * justamente haberlas resuelto (`simularAprobacion`). Es contra este que se
 * mide el contenido — medir el corpus contra un índice que no lo contiene
 * sería un gate sin sujeto.
 */
export function corpusSimulado(locale = "es") {
  return buildChunks({
    cv: leerYaml(`cv.${locale}.yaml`),
    apps: leerYaml("apps.yaml"),
    aFondo: simularAprobacion(leerDocumentos(locale)),
    locale,
  });
}

/**
 * ¿Este fragmento es la fuente esperada? `vesting` casa con todos los
 * fragmentos del documento a fondo de Vesting; `trayectoria`, con cualquier
 * hito; `estudios`, con el fragmento exacto de los YAML.
 */
export function casa(idChunk, esperado) {
  return (
    idChunk === esperado ||
    idChunk.startsWith(`${esperado}-`) ||
    idChunk.startsWith(`a-fondo-${esperado}-`)
  );
}

/** Una pregunta contra un retriever: qué trajo, si acertó y en qué puesto. */
export function evaluarPregunta(retriever, entrada, k, esOffTopic) {
  const hits = retriever.topK(entrada.pregunta, k);
  const puesto = hits.findIndex((h) =>
    entrada.espera.some((e) => casa(h.chunk.id, e)),
  );
  return {
    ...entrada,
    ids: hits.map((h) => h.chunk.id),
    primerTexto: hits[0]?.chunk.texto ?? "",
    puesto, // -1 = no apareció
    acierta: puesto >= 0,
    aciertaPrimero: puesto === 0,
    offTopic: esOffTopic(retriever.topKStrict(entrada.pregunta, k)),
  };
}

/** El banco entero contra un retriever. */
export function evaluarBanco(retriever, banco, k, esOffTopic) {
  const filas = banco.preguntas.map((p) =>
    evaluarPregunta(retriever, p, k, esOffTopic),
  );
  const familias = [...new Set(filas.map((f) => f.familia))];
  return {
    filas,
    resumen: {
      total: filas.length,
      aciertos: filas.filter((f) => f.acierta).length,
      primeros: filas.filter((f) => f.aciertaPrimero).length,
      offTopic: filas.filter((f) => f.offTopic).length,
      porFamilia: familias.map((familia) => {
        const suyas = filas.filter((f) => f.familia === familia);
        return {
          familia,
          total: suyas.length,
          aciertos: suyas.filter((f) => f.acierta).length,
          primeros: suyas.filter((f) => f.aciertaPrimero).length,
        };
      }),
    },
  };
}

/** Cuántas veces cada documento a fondo es la fuente esperada de alguna pregunta. */
export function coberturaPorDocumento(banco, slugs) {
  return slugs.map((slug) => ({
    slug,
    preguntas: banco.preguntas.filter((p) => p.espera.includes(slug)).length,
  }));
}

const pct = (n, total) => (total === 0 ? "—" : `${Math.round((n / total) * 100)} %`);
const recorta = (t, n) => (t.length > n ? `${t.slice(0, n).trimEnd()}…` : t);

/**
 * El informe legible. Se genera; no se escribe a mano. Lo escribe el test con
 * `GENERAR_INFORME=1` (script `pnpm corpus:informe`).
 */
export function informeMarkdown({
  hoy,
  m2,
  banco,
  k,
  nChunksHoy,
  nChunksM2,
  bloqueoHoy,
  bloqueoM2,
}) {
  const L = [];
  const fecha = new Date().toISOString().slice(0, 10);

  L.push("# Banco de preguntas — el corpus medido con preguntas de afuera");
  L.push("");
  L.push(
    `> **Generado por \`pnpm corpus:informe\` el ${fecha}. No se edita a mano.**`,
  );
  L.push(
    `> Banco: \`${RUTA_BANCO}\` — **${banco.preguntas.length} preguntas** de ` +
      `${new Set(banco.preguntas.map((p) => p.familia)).size} familias, ` +
      `${banco.ajenas.length} preguntas ajenas y ${banco.sin_cobertura.length} ` +
      `huecos declarados.`,
  );
  L.push(">");
  L.push(
    `> **HOY** = el índice publicado, tal como está en disco: **${nChunksHoy} fragmentos** ` +
      `(los 24 documentos siguen en \`borrador\`, así que el chat todavía no ve nada de ellos).\n` +
      `> **M2** = el índice que existirá cuando los apruebes: **${nChunksM2} fragmentos**.\n` +
      `> El \`top-${k}\` es el que de verdad entra al contexto del modelo.`,
  );
  L.push("");
  L.push("---");
  L.push("");
  L.push("## El número");
  L.push("");
  L.push("| | HOY | M2 |");
  L.push("| --- | --- | --- |");
  L.push(
    `| Preguntas con su fuente en el top-${k} | ${hoy.resumen.aciertos}/${hoy.resumen.total} (${pct(hoy.resumen.aciertos, hoy.resumen.total)}) | **${m2.resumen.aciertos}/${m2.resumen.total} (${pct(m2.resumen.aciertos, m2.resumen.total)})** |`,
  );
  L.push(
    `| …y además de primeras | ${hoy.resumen.primeros} (${pct(hoy.resumen.primeros, hoy.resumen.total)}) | **${m2.resumen.primeros} (${pct(m2.resumen.primeros, m2.resumen.total)})** |`,
  );
  L.push(
    `| Preguntas que reciben «eso se me escapa» | ${hoy.resumen.offTopic} | **${m2.resumen.offTopic}** |`,
  );
  L.push("");
  L.push("");
  L.push(
    "**Cómo leer las dos filas.** La primera es el gate: la fuente que declaré para esa pregunta " +
      `entra al top-${k}, que es lo que el modelo ve. La segunda es más dura de lo que parece: ` +
      "cuenta solo cuando esa fuente llega **de primeras**, y no cuenta los casos —muchos— en que " +
      "la primera es otra fuente igual de buena («¿Qué hizo en Cafam?» arranca por el hito de la " +
      "trayectoria y no por el documento a fondo). Se deja estricta a propósito: así el número " +
      "solo sube cuando el contenido mejora de verdad.");
  L.push("");
  L.push(
    "**Y la columna HOY no es una nota baja: es el tamaño del cambio.** Está en " +
      `${pct(hoy.resumen.aciertos, hoy.resumen.total)} porque las ` +
      "fuentes que estas preguntas necesitan son justo los 24 documentos que todavía no están " +
      "aprobados. Lo que dice esa columna es cuántas de estas preguntas contesta hoy la hoja de " +
      "vida sola.");
  L.push("");
  L.push("### Por familia (M2)");
  L.push("");
  L.push(`| Familia | Preguntas | Con su fuente en top-${k} | De primeras |`);
  L.push("| --- | --- | --- | --- |");
  for (const f of m2.resumen.porFamilia) {
    L.push(
      `| ${f.familia} | ${f.total} | ${f.aciertos} (${pct(f.aciertos, f.total)}) | ${f.primeros} (${pct(f.primeros, f.total)}) |`,
    );
  }
  L.push("");

  const fallos = m2.filas.filter((f) => !f.acierta);
  L.push("## Las que no traen su fuente");
  L.push("");
  if (fallos.length === 0) {
    L.push(
      "Ninguna: las " +
        m2.resumen.total +
        ` preguntas del banco traen al menos una de sus fuentes esperadas dentro del top-${k}.`,
    );
  } else {
    for (const f of fallos) {
      L.push(`- **${f.pregunta}**`);
      L.push(`  - esperaba: ${f.espera.join(" · ")}`);
      L.push(`  - trajo: ${f.ids.join(", ") || "nada"}`);
    }
  }
  L.push("");

  const ganadas = m2.filas.filter((f) => {
    const gemela = hoy.filas.find((h) => h.pregunta === f.pregunta);
    return gemela?.offTopic && !f.offTopic;
  });
  L.push("## Lo que cambia al aprobar");
  L.push("");
  L.push(
    `**${ganadas.length} preguntas** que hoy reciben la respuesta fija «eso se me escapa» pasan a ` +
      "tener respuesta con fuente:",
  );
  L.push("");
  for (const f of ganadas) L.push(`- ${f.pregunta}`);
  L.push("");

  if (banco.sin_cobertura.length > 0) {
    L.push("## Huecos declarados");
    L.push("");
    L.push(
      "Preguntas que un reclutador hace y que **el corpus no contesta hoy**, con el documento " +
        "donde iría la respuesta. No las inventé: cada una necesita algo que solo tú sabes.",
    );
    L.push("");
    for (const h of banco.sin_cobertura) {
      L.push(`- **${h.pregunta}** → \`${h.donde_iria}\``);
      L.push(`  - ${h.porque}`);
    }
    L.push("");
  }

  L.push("---");
  L.push("");
  L.push("## El detalle, pregunta por pregunta (M2)");
  L.push("");
  for (const familia of m2.resumen.porFamilia.map((f) => f.familia)) {
    L.push(`### ${familia}`);
    L.push("");
    for (const f of m2.filas.filter((x) => x.familia === familia)) {
      const marca = f.acierta ? (f.aciertaPrimero ? "✅" : "☑️") : "❌";
      L.push(`**${marca} ${f.pregunta}**`);
      L.push("");
      L.push(`- top-${k}: ${f.ids.join(", ") || "nada"}`);
      L.push(`- primer fragmento: «${recorta(f.primerTexto, 220)}»`);
      if (f.nota) L.push(`- nota: ${f.nota}`);
      L.push("");
    }
  }

  L.push("---");
  L.push("");
  const bloqueadas = banco.ajenas.filter((a) => a.guardrail === "bloquea");
  const pasan = banco.ajenas.filter((a) => a.guardrail === "pasa");
  L.push("## Preguntas ajenas: dónde está la frontera de verdad");
  L.push("");
  L.push(
    `De las ${banco.ajenas.length} preguntas ajenas del banco, **${bloqueadas.length} se paran en ` +
      `el guardrail** —respuesta fija, cero tokens— y **${pasan.length} llegan al modelo**, donde ` +
      "las para el prompt grounding-only. Eso no es un fallo: está escrito como decisión en " +
      "`src/lib/ia/guardrails.ts`. Una pregunta ajena que comparte una palabra con el contenido " +
      "pasa, y subir el umbral hasta bloquearla bloquearía también preguntas legítimas cortas.",
  );
  L.push("");
  L.push(
    `**Y hay un precio de crecer, medido aquí:** el índice de hoy bloquea ${bloqueoHoy} de las ` +
      `${banco.ajenas.length}; el corpus completo, ${bloqueoM2}. Más texto es más vocabulario ` +
      "compartido con cualquier pregunta. Por eso la garantía de corrección es el prompt " +
      "grounding-only y no este umbral.",
  );
  L.push("");
  for (const a of pasan) {
    L.push(`- **${a.pregunta}** — ${a.porque ?? "comparte vocabulario con el corpus"}`);
  }
  L.push("");
  L.push("✅ Leyenda: la fuente esperada llegó de primeras · ☑️ llegó dentro del top-" + k + " · ❌ no llegó.");
  L.push("");
  return L.join("\n");
}

export const RUTA_INDICE = "data/a-fondo/README.md";
const MARCA = "tabla-de-documentos";

/**
 * LA TABLA DEL ÍNDICE, GENERADA. Era una tabla a mano y mentía: contaba como
 * `[CONFIRMAR]` la línea de la plantilla que llevan los 24 archivos en su
 * comentario de cabecera, así que declaraba 53 preguntas abiertas donde hay 30
 * —y ponía una en seis documentos que no tienen ninguna—. Es justo la columna
 * con la que el dueño decide por dónde empezar.
 *
 * El ORDEN lo manda la tabla que ya está escrita (es el orden en que se
 * pensaron los documentos, de la trayectoria a las capacidades); un documento
 * nuevo entra al final. Así regenerar no le pisa el criterio a nadie.
 */
export function tablaDeDocumentos(docs, ordenPrevio = []) {
  const pos = (slug) => {
    const i = ordenPrevio.indexOf(slug);
    return i === -1 ? ordenPrevio.length + docs.length : i;
  };
  const ordenados = [...docs].sort((a, b) => pos(a.slug) - pos(b.slug));
  const abiertas = (d) =>
    d.subsecciones.reduce(
      (n, s) => n + (s.texto.match(/\[CONFIRMAR/g) ?? []).length,
      0,
    );
  const L = [
    "| #  | Documento | Estado | Subsec. | `[CONFIRMAR]` | Cita hacia |",
    "| -- | --------- | ------ | ------: | ------------: | ---------- |",
  ];
  ordenados.forEach((d, i) => {
    L.push(
      `| ${i + 1} | \`${d.slug}\` | ${d.estado} | ${d.subsecciones.length} | ` +
        `${abiertas(d)} | \`${d.ancla}\` |`,
    );
  });
  const subs = ordenados.reduce((n, d) => n + d.subsecciones.length, 0);
  const conf = ordenados.reduce((n, d) => n + abiertas(d), 0);
  const palabras = ordenados.reduce(
    (n, d) =>
      n +
      d.subsecciones.reduce(
        (m, s) => m + s.texto.split(/\s+/).filter(Boolean).length,
        0,
      ),
    0,
  );
  const aprobados = ordenados.filter((d) => d.estado === "aprobado").length;
  L.push("");
  L.push(
    `**${ordenados.length} documentos · ${subs} subsecciones · ${palabras.toLocaleString("es-CO")} ` +
      `palabras · ${conf} \`[CONFIRMAR]\` por resolver · ${aprobados} aprobados.**`,
  );
  const limpios = ordenados.filter((d) => abiertas(d) === 0 && d.estado !== "aprobado");
  if (limpios.length > 0) {
    L.push("");
    L.push(
      `**Sin ninguna pregunta abierta, listos para que los leas y decidas:** ` +
        limpios.map((d) => `\`${d.slug}\``).join(" · ") + ".",
    );
  }
  return L.join("\n");
}

/** Reescribe el bloque entre marcas, dejando intacto el resto del archivo. */
export function reescribirTabla(contenido, tabla) {
  const re = new RegExp(
    `(<!-- ${MARCA}:inicio -->)[\\s\\S]*?(<!-- ${MARCA}:fin -->)`,
  );
  if (!re.test(contenido)) {
    throw new Error(
      `${RUTA_INDICE}: faltan las marcas <!-- ${MARCA}:inicio --> … <!-- ${MARCA}:fin -->.`,
    );
  }
  return contenido.replace(re, `$1\n\n${tabla}\n\n$2`);
}

/** El orden de los slugs tal como está hoy en la tabla del índice. */
export function ordenDeLaTabla(contenido) {
  return [...contenido.matchAll(/^\|\s*\d+\s*\|\s*`([a-z0-9-]+)`/gm)].map(
    (m) => m[1],
  );
}

/** Uso desde la línea de comandos: sin retriever, solo valida el banco. */
if (process.argv[1] && process.argv[1].endsWith("evaluar-corpus.mjs")) {
  const banco = leerBanco();
  console.log(
    `✓ ${RUTA_BANCO} — ${banco.preguntas.length} preguntas, ` +
      `${banco.ajenas.length} ajenas, ${banco.sin_cobertura.length} huecos declarados. ` +
      `El informe lo genera «pnpm corpus:informe».`,
  );
}
