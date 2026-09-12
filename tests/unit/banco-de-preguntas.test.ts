import { readFileSync, writeFileSync } from "node:fs";
import { describe, expect, it } from "vitest";
import { esOffTopic } from "@/lib/ia/guardrails";
import { createRetriever, TOP_K_CONTEXTO } from "@/lib/ia/retrieval";
import { chatChunkSchema } from "@/lib/ia/schemas";
import { leerDocumentos } from "../../scripts/a-fondo.mjs";
import {
  coberturaPorDocumento,
  corpusPublicado,
  corpusSimulado,
  evaluarBanco,
  informeMarkdown,
  leerBanco,
  ordenDeLaTabla,
  reescribirTabla,
  RUTA_BANCO,
  RUTA_INDICE,
  RUTA_INFORME,
  tablaDeDocumentos,
} from "../../scripts/evaluar-corpus.mjs";

/**
 * EL BANCO DE PREGUNTAS — la prueba del CONTENIDO (S8, fase 4b).
 *
 * El golden set (`a-fondo-golden.test.ts`) exige que cada documento conteste
 * **sus propias** preguntas, que las escribí yo con el documento delante: usan
 * sus palabras. Este banco pregunta con las palabras de AFUERA —las de quien
 * recluta y quien entrevista— y por eso encuentra lo que aquel no puede.
 *
 * Y encuentra una clase de fallo muy concreta. La recuperación de este chat es
 * **léxica** (ADR-010, decisión declarada): si el corpus no dice «MLOps», no
 * hay fragmento que traer por más que el trabajo esté hecho. Así que cada
 * pregunta roja de aquí nombra una de dos cosas, y las dos son del contenido:
 * un hueco real, o un término que el dueño usa distinto a como lo usa quien
 * pregunta.
 *
 * **Contra qué se mide.** Contra el índice que existirá cuando el dueño
 * apruebe: los 24 documentos forzados a `aprobado` (hoy están en borrador, y
 * medir el corpus contra un índice que no lo contiene sería un gate sin
 * sujeto — regla 14, tercera pregunta). Que un borrador NO entre al índice
 * publicado lo vigila `a-fondo.test.ts`; son dos preguntas distintas.
 *
 * El informe legible se GENERA desde aquí con `pnpm corpus:informe` (patrón de
 * `docs/contrato-ficha-tecnica/`: el artefacto publicado lo produce el test).
 * A propósito **no** hay gate de «informe desactualizado»: el dueño va a estar
 * corrigiendo los 24 documentos durante semanas, y un rojo que solo dice
 * «regenera el informe» le taparía los rojos que importan.
 */

const banco = leerBanco();

const chunksDe = (crudos: unknown[]) =>
  crudos.map((c) => chatChunkSchema.parse(c));

const chunksM2 = chunksDe(corpusSimulado("es"));
const chunksHoy = chunksDe(corpusPublicado("es"));
const retrieverM2 = createRetriever(chunksM2);
const retrieverHoy = createRetriever(chunksHoy);

const m2 = evaluarBanco(retrieverM2, banco, TOP_K_CONTEXTO, esOffTopic);
const hoy = evaluarBanco(retrieverHoy, banco, TOP_K_CONTEXTO, esOffTopic);

type Fila = (typeof m2.filas)[number];
type Ajena = { pregunta: string; guardrail: string; porque?: string };

/** Cuántas de las ajenas para en seco este índice. */
const bloqueadas = (r: typeof retrieverM2) =>
  banco.ajenas.filter((a: Ajena) =>
    esOffTopic(r.topKStrict(a.pregunta, TOP_K_CONTEXTO)),
  ).length;

const normaliza = (s: string) =>
  s
    .toLowerCase()
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/[^a-z0-9 ]/g, "")
    .trim();

describe("el banco tiene cuerpo suficiente para vigilar algo", () => {
  it("cien preguntas de afuera, como mínimo", () => {
    expect(banco.preguntas.length).toBeGreaterThanOrEqual(100);
    expect(banco.ajenas.length).toBeGreaterThanOrEqual(10);
    expect(chunksM2.length).toBeGreaterThan(100);
  });

  it("ninguna pregunta está dos veces", () => {
    const vistas = new Map<string, string>();
    const repetidas: string[] = [];
    for (const p of banco.preguntas) {
      const clave = normaliza(p.pregunta);
      if (vistas.has(clave))
        repetidas.push(`«${p.pregunta}» ≈ «${vistas.get(clave)}»`);
      vistas.set(clave, p.pregunta);
    }
    expect(repetidas, "preguntas duplicadas en el banco").toEqual([]);
  });

  it("cada documento a fondo es la fuente esperada de al menos tres preguntas", () => {
    const slugs = leerDocumentos("es").map((d: { slug: string }) => d.slug);
    const flojos = coberturaPorDocumento(banco, slugs)
      .filter((c: { preguntas: number }) => c.preguntas < 3)
      .map(
        (c: { slug: string; preguntas: number }) =>
          `${c.slug} (${c.preguntas})`,
      );
    expect(
      flojos,
      "documentos que casi nadie pregunta: o el banco los ignora, o el documento no le importa a nadie de afuera",
    ).toEqual([]);
  });

  it("las familias de preguntas no son una sola bolsa", () => {
    expect(m2.resumen.porFamilia.length).toBeGreaterThanOrEqual(6);
    for (const f of m2.resumen.porFamilia)
      expect(f.total).toBeGreaterThanOrEqual(6);
  });
});

const casos: [string, Fila][] = m2.filas.map((f: Fila) => [f.pregunta, f]);

describe(`cada pregunta trae su fuente en el top-${TOP_K_CONTEXTO}`, () => {
  it.each(casos)(
    "%s",
    (_titulo: string, fila: Fila) => {
      expect(
        fila.acierta,
        `«${fila.pregunta}» no trajo ninguna de sus fuentes esperadas.\n` +
          `  esperaba: ${fila.espera.join(" · ")}\n` +
          `  trajo:    ${fila.ids.join(", ") || "nada"}\n` +
          `  La recuperación es LÉXICA: si el corpus no dice esa palabra, no hay nada que traer.\n` +
          `  O el contenido no lo dice con las palabras de quien pregunta —y se corrige el ` +
          `DOCUMENTO—, o lo contesta mejor otra fuente —y se corrige «espera» en ${RUTA_BANCO}—.\n` +
          `  Inventar contenido para que pase el gate no es una de las dos salidas.`,
      ).toBe(true);
    },
  );
});

describe("qué recibe quien pregunta", () => {
  it("ninguna pregunta legítima recibe «eso se me escapa»", () => {
    const mudas = m2.filas
      .filter((f: Fila) => f.offTopic)
      .map((f: Fila) => f.pregunta);
    expect(
      mudas,
      "el peor fallo posible de este chat es callarse ante una pregunta legítima",
    ).toEqual([]);
  });

  /**
   * PISO, no promedio. Que la fuente esperada llegue **de primeras** es lo que
   * decide el tono de la respuesta: el modelo redacta sobre lo que ve arriba.
   * El piso se fija por debajo de lo medido para dejar aire a una corrección
   * del dueño que mueva un ranking, y solo puede SUBIR con el tiempo.
   */
  it("la fuente esperada llega de primeras en al menos el 60 % de las preguntas", () => {
    const tasa = m2.resumen.primeros / m2.resumen.total;
    expect(
      Math.round(tasa * 100),
      `bajó el acierto en la PRIMERA fuente: ${m2.resumen.primeros}/${m2.resumen.total}. ` +
        `Mira el informe (${RUTA_INFORME}) para ver qué preguntas cambiaron de dueño.`,
    ).toBeGreaterThanOrEqual(60);
  });

  /**
   * LA FRONTERA MEDIDA, no la deseada. Cada ajena declara si el guardrail la
   * bloquea (cero tokens) o la deja pasar al modelo, donde la para el prompt
   * grounding-only. Fijar las dos listas es lo que convierte una promesa
   * imprecisa en algo que se puede romper: mover el umbral rompe este test y
   * obliga a decir hacia qué lado se movió.
   */
  it("cada pregunta ajena se comporta como está declarado", () => {
    const desviadas = banco.ajenas
      .map((a: Ajena) => ({
        ...a,
        real: esOffTopic(retrieverM2.topKStrict(a.pregunta, TOP_K_CONTEXTO))
          ? "bloquea"
          : "pasa",
      }))
      .filter((a: Ajena & { real: string }) => a.real !== a.guardrail)
      .map(
        (a: Ajena & { real: string }) =>
          `«${a.pregunta}» está declarada como «${a.guardrail}» y el guardrail la ${a.real}`,
      );
    expect(
      desviadas,
      "el umbral de off-topic se movió: di hacia qué lado y comprueba que no bloqueaste una legítima",
    ).toEqual([]);
  });

  /**
   * El rojo de este gate. Si el retriever trajera cualquier cosa para
   * cualquier consulta, las +100 aserciones de arriba pasarían por casualidad.
   */
  it("una ajena declarada «bloquea» no trae ni un fragmento del corpus", () => {
    for (const a of banco.ajenas.filter((x: Ajena) => x.guardrail === "bloquea")) {
      expect(
        retrieverM2.topKStrict(a.pregunta, TOP_K_CONTEXTO),
        `«${a.pregunta}» no debería casar con nada del corpus`,
      ).toHaveLength(0);
    }
  });

  /**
   * EL PRECIO DE CRECER, medido. Esta capa se debilita a medida que el corpus
   * crece: más texto es más vocabulario compartido con cualquier pregunta. No
   * es un fallo a reparar subiendo el umbral —eso callaría preguntas
   * legítimas—, es la razón por la que la garantía de corrección vive en el
   * prompt y no aquí.
   */
  it("el guardrail se vuelve más permeable con el corpus grande, y queda medido", () => {
    const bloquea = (r: typeof retrieverM2, q: string) =>
      esOffTopic(r.topKStrict(q, TOP_K_CONTEXTO));
    const conHoy = banco.ajenas.filter((a: Ajena) => bloquea(retrieverHoy, a.pregunta)).length;
    const conM2 = banco.ajenas.filter((a: Ajena) => bloquea(retrieverM2, a.pregunta)).length;
    expect(conM2).toBeLessThan(conHoy);
    expect(conM2).toBe(banco.ajenas.filter((a: Ajena) => a.guardrail === "bloquea").length);
  });
});

describe("los huecos declarados", () => {
  /**
   * TECHO DE DEUDA. Cada entrada es una pregunta que el corpus no contesta
   * porque la respuesta solo la tiene el dueño. La lista puede encoger —cuando
   * él conteste— pero no crecer sin que este gate lo diga: sin techo, «no
   * cubierto» se vuelve el cajón donde va a parar todo lo incómodo.
   */
  it("no crecen: cinco es el techo", () => {
    expect(
      banco.sin_cobertura.map((h: { pregunta: string }) => h.pregunta),
      "un hueco nuevo es una decisión, no un detalle: decláralo en la bitácora",
    ).toHaveLength(banco.sin_cobertura.length);
    expect(banco.sin_cobertura.length).toBeLessThanOrEqual(5);
  });

  it("cada hueco dice a qué documento iría y por qué no está", () => {
    const slugs = new Set(
      leerDocumentos("es").map((d: { slug: string }) => d.slug),
    );
    for (const h of banco.sin_cobertura) {
      expect(
        slugs.has(h.donde_iria),
        `${h.donde_iria} no es un documento a fondo`,
      ).toBe(true);
    }
  });
});

/**
 * El informe publicado se genera desde aquí — `pnpm corpus:informe`.
 * Sin la variable, este test no escribe nada y no afirma nada: es el único
 * «it» del archivo que no es un gate, y está marcado como tal.
 */
describe("el informe legible", () => {
  it("se genera con GENERAR_INFORME=1 (no es un gate)", () => {
    if (!process.env.GENERAR_INFORME) return;
    writeFileSync(
      RUTA_INFORME,
      informeMarkdown({
        hoy,
        m2,
        banco,
        k: TOP_K_CONTEXTO,
        nChunksHoy: chunksHoy.length,
        nChunksM2: chunksM2.length,
        bloqueoHoy: bloqueadas(retrieverHoy),
        bloqueoM2: bloqueadas(retrieverM2),
      }),
      "utf8",
    );

    // …y la tabla del índice con el que el dueño se organiza, entre sus marcas.
    const indice = readFileSync(RUTA_INDICE, "utf8");
    writeFileSync(
      RUTA_INDICE,
      reescribirTabla(
        indice,
        tablaDeDocumentos(leerDocumentos("es"), ordenDeLaTabla(indice)),
      ),
      "utf8",
    );
  });
});
