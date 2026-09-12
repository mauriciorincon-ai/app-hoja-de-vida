import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";
import { parse } from "yaml";
import { createRetriever, TOP_K_CONTEXTO } from "@/lib/ia/retrieval";
import { chatChunkSchema } from "@/lib/ia/schemas";
import { leerDocumentos, simularAprobacion } from "../../scripts/a-fondo.mjs";
import { buildChunks } from "../../scripts/build-chat-index.mjs";

/**
 * EL GOLDEN SET DEL CORPUS (S8).
 *
 * Cada documento declara sus `preguntas_de_prueba` en el frontmatter, y este
 * test exige que **cada pregunta traiga SU documento dentro del top-k del
 * retriever real**. La prueba viaja con el contenido: sumar un documento a
 * `data/a-fondo/` suma sus preguntas al gate sin que nadie edite `tests/`.
 *
 * **Por qué se mide con los borradores forzados a aprobado.** Hoy los 24
 * documentos están en `borrador` y por tanto fuera del índice publicado. Si el
 * golden set solo mirara los aprobados, tendría CERO sujetos y pasaría en verde
 * sin vigilar nada — exactamente el gate decorativo que la regla 14 persigue
 * (tercera pregunta: ¿puede fallar siquiera?). Así que aquí se construye el
 * índice que existirá cuando el dueño apruebe: los 24 documentos más los
 * fragmentos de los YAML. Es además la simulación con la que se recalibró el
 * top-k, y por eso el número que este test defiende es el mismo que corre en
 * producción.
 *
 * Que un borrador NO entre al índice publicado lo vigila `a-fondo.test.ts`; son
 * dos preguntas distintas y cada una tiene su gate.
 */

const leer = (f: string) => parse(readFileSync(`data/${f}`, "utf8"));

type Doc = {
  slug: string;
  titulo: string;
  estado: string;
  ancla: string;
  preguntas_de_prueba: string[];
};

const docs: Doc[] = leerDocumentos("es");
const aprobados = simularAprobacion(docs);
const chunks = buildChunks({
  cv: leer("cv.es.yaml"),
  apps: leer("apps.yaml"),
  aFondo: aprobados,
  locale: "es",
}).map((c: unknown) => chatChunkSchema.parse(c));
const retriever = createRetriever(chunks);

const casos = docs.flatMap((d) =>
  d.preguntas_de_prueba.map((q) => [d.slug, q, d] as const),
);

describe("golden set — cada pregunta trae su documento", () => {
  it("hay preguntas que ejercitar (si no, este gate no vigila nada)", () => {
    expect(casos.length).toBeGreaterThanOrEqual(48);
    expect(chunks.length).toBeGreaterThan(100);
  });

  it.each(casos.map(([slug, q, d]) => [`${slug} ← ${q}`, q, d] as const))(
    "%s",
    (_titulo, pregunta, doc) => {
      const hits = retriever.topK(pregunta, TOP_K_CONTEXTO);
      const traeSuDocumento = hits.some((h) =>
        h.chunk.id.startsWith(`a-fondo-${doc.slug}-`),
      );
      expect(
        traeSuDocumento,
        `«${pregunta}» no trajo «${doc.slug}» en el top-${TOP_K_CONTEXTO}.\n` +
          `  Trajo: ${hits.map((h) => h.chunk.id).join(", ")}\n` +
          `  O la pregunta describe mejor a otro documento —y entonces se corrige la PREGUNTA—, ` +
          `o el documento no dice lo que su pregunta promete —y entonces se corrige el DOCUMENTO—.`,
      ).toBe(true);
    },
  );

  it("la cita de un documento lleva a su ancla, no a un id de fragmento", () => {
    // Lo que el visitante ve al hacer clic en [n] es el `ancla` del documento.
    // Las ventanas de una subsección troceada conservan la MISMA: la cita
    // siempre lleva al mismo sitio visible.
    for (const doc of aprobados) {
      const suyos = chunks.filter((c) =>
        c.id.startsWith(`a-fondo-${doc.slug}-`),
      );
      expect(suyos.length, `${doc.slug} no aportó ni un fragmento`).toBeGreaterThan(0);
      for (const c of suyos) expect(c.ancla, c.id).toBe(doc.ancla);
    }
  });

  it("una pregunta AJENA no trae ningún documento a fondo", () => {
    // El rojo de este gate: si el retriever trajera cualquier cosa para
    // cualquier consulta, las 48 aserciones de arriba pasarían por casualidad.
    for (const ajena of [
      "cuéntame un chiste sobre gatos",
      "¿va a llover mañana en Madrid?",
      "¿cuál es la receta del ajiaco?",
    ]) {
      expect(
        retriever.topKStrict(ajena),
        `«${ajena}» no debería casar con nada del corpus`,
      ).toHaveLength(0);
    }
  });
});
