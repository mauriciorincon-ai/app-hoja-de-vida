import type { FichaVitrina } from "../loader";
import {
  fichaTecnicaSchema,
  type Complemento,
  type FichaTecnica,
} from "./schema";

/**
 * Arma la ficha técnica de una app a partir de su `brochure-export.json` (lo
 * que la app declaró de sí misma) y su complemento (lo que al export v1.0.0 le
 * falta). El resultado pasa por el MISMO esquema que una ficha que llegara
 * completa desde otra casa: un solo renderizador, un solo contrato.
 */
export function armarFichaTecnica(
  ficha: FichaVitrina,
  comp: Complemento,
): FichaTecnica {
  const { export: exp, ancla } = ficha;
  if (comp.app !== ancla.slug)
    throw new Error(
      `Complemento de «${comp.app}» aplicado a la app «${ancla.slug}»`,
    );

  const cifras = comp.cifras_destacadas.map((clave) => {
    const m = exp.metricas.find((x) => x.clave === clave);
    if (!m)
      throw new Error(
        `Ficha técnica de «${ancla.slug}»: la cifra destacada «${clave}» no existe en su export ` +
          `(disponibles: ${exp.metricas.map((x) => x.clave).join(", ")})`,
      );
    return {
      clave: m.clave,
      valor: m.valor,
      unidad: m.unidad,
      etiqueta: m.etiqueta,
      fuente: m.fuente,
      detalle: m.detalle,
    };
  });

  // Las etiquetas son CLAVES (`ciclo` · `sprints` · `sellada` · `construccion` ·
  // `version` · `decisiones`): el componente las traduce; una ficha externa
  // puede traer texto libre y se pinta tal cual.
  const hitos: FichaTecnica["hitos"] = [
    { valor: ancla.ciclo, etiqueta: "ciclo" },
    { valor: String(ancla.sprintsCerrados), etiqueta: "sprints" },
    ancla.selladoEn
      ? { valor: ancla.selladoEn, etiqueta: "sellada" }
      : { valor: "—", etiqueta: "construccion" },
    { valor: `v${ancla.versionRepo}`, etiqueta: "version" },
  ];
  const decisiones = exp.metricas.find(
    (m) => m.clave === "decisiones_registradas",
  );
  if (decisiones)
    hitos.push({
      valor: String(decisiones.valor),
      etiqueta: "decisiones registradas",
    });

  return fichaTecnicaSchema.parse({
    schema_version: "1.2.0",
    actualizado: exp.actualizado,
    pieza: {
      slug: ancla.slug,
      nombre: exp.app.nombre,
      frente: "apps",
      estado: ancla.estado,
      ciclo: ancla.ciclo,
      version: ancla.versionRepo,
      sellado_en: ancla.selladoEn,
      sprints_cerrados: ancla.sprintsCerrados,
    },
    promesa: {
      tagline: exp.promesa.tagline,
      intro: exp.promesa.intro,
      para_quien: exp.promesa.para_quien,
    },
    titular: comp.titular,
    stack: exp.stack.map((s) => ({ nombre: s.nombre, papel: s.papel })),
    cifras,
    bloques: exp.funcionalidades.grupos.map((g) => ({
      orden: g.orden,
      nombre: g.nombre,
      linea: g.linea,
      cuenta: g.features.length,
    })),
    // v1.1.0: el proceso es opcional; si el complemento no lo trae, la ficha
    // sale sin él y sin procedencia (el esquema exige que vayan juntos).
    ...(comp.proceso
      ? { proceso: comp.proceso, procedencia_proceso: comp.procedencia }
      : {}),
    limites: comp.limites,
    nunca: comp.nunca,
    hitos,
  } satisfies FichaTecnica);
}
