import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";
import { RESPUESTA_OFFTOPIC } from "@/lib/ia/guardrails";
import { RESPUESTA_REHUSO } from "@/lib/ia/rehuso";
import { vozDelDueno } from "@/lib/ia/voz-del-dueno";
import { cadenasConRuta } from "@/lib/metodo/voz-impersonal";

/**
 * EL CHAT HABLA EN TERCERA PERSONA DE HENRY (S24, OM-13). La CI no ve lo que
 * el modelo real dice —lo mide la pasada en vivo—, pero SÍ ve todo lo que el
 * chat dice con texto escrito: las cadenas del espacio `chat` de `messages/`
 * (el panel entero) y las respuestas fijas.
 *
 * Se prohíbe la voz del DUEÑO («mi», «hice», «escríbeme», «I built»); el
 * asistente puede hablar de sí mismo («dame un minuto», «I can't answer
 * that»). Decisión del dueño, 2026-10-25 (3).
 */

describe("lo que SÍ es la voz del dueño", () => {
  const SI: [string, string][] = [
    ["es", "Pregúntale a mi HV"],
    ["es", "Lideré la estrategia de datos en Vesting"],
    ["es", "Construí el ecosistema desde cero"],
    ["es", "Escríbeme desde Contacto"],
    ["es", "¿Algo no funciona? Avísame"],
    ["es", "Si me interesa lo que buscas, te escribo"],
    ["es", "He liderado equipos pequeños"],
    ["es", "Mis proyectos"],
    // Auditoría S24 (M1): el primer ejemplo de la decisión y sus parientes.
    ["es", "Hice la migración completa"],
    ["es", "Tuve a cargo un equipo de cinco personas"],
    ["es", "Fui el líder técnico del proyecto"],
    ["es", "Reduje el tiempo de entrega a la mitad"],
    ["es", "Me encargué de la arquitectura"],
    ["es", "Me gradué en 2019"],
    ["es", "Ayudé a la empresa a ahorrar costos"],
    ["es", "Mi paso por CTIC me enseñó a medir"],
    ["es", "Mi rol era liderar el equipo"],
    ["en", "Ask my résumé"],
    ["en", "I built the ecosystem from scratch"],
    ["en", "I led the data strategy"],
    ["en", "Write to me from the Contact section"],
    ["en", "Something not working? Let me know"],
    ["en", "I'm interested in what you're looking for"],
    ["en", "I have led small teams"],
    ["en", "My projects"],
    ["en", "I was the lead engineer on the project"],
    ["en", "I had a team of five"],
    ["en", "I reduced delivery time by half"],
    ["en", "I left the company in 2025"],
    ["en", "I graduated in 2019"],
    ["en", "I've built three apps"],
    ["en", "I'm the lead on this"],
    ["en", "My role was to lead the team"],
  ];
  it.each(SI)("[%s] «%s»", (idioma, texto) => {
    expect(vozDelDueno(texto, idioma as "es" | "en").length).toBeGreaterThan(0);
  });

  const NO: [string, string][] = [
    ["es", "Ese tema se me escapa."],
    [
      "es",
      "Muchas preguntas muy seguidas — dame un minuto de respiro y seguimos.",
    ],
    ["es", "No pude responder esa pregunta. Intenta de nuevo."],
    ["es", "Henry lideró la estrategia de datos en Vesting [2]."],
    ["es", "Te envié un código de seis dígitos a {email}."],
    [
      "es",
      "Acepto que se guarden el nombre, el correo y las preguntas de esta conversación.",
    ],
    ["en", "That's outside my lane."],
    ["en", "I couldn't answer that one. Please try again."],
    ["en", "I was unable to find that in the résumé."],
    ["en", "I was not able to answer that."],
    ["en", "I can't answer that from Henry's résumé."],
    ["en", "Henry led the data strategy at Vesting [2]."],
    [
      "en",
      "I agree that the name, email and questions of this conversation are stored.",
    ],
  ];
  it.each(NO)(
    "[%s] «%s» es la voz del asistente o de un tercero",
    (idioma, texto) => {
      expect(vozDelDueno(texto, idioma as "es" | "en")).toEqual([]);
    },
  );

  it("«mi correo» es del visitante y «my lane» del asistente: no son la voz del dueño", () => {
    expect(vozDelDueno("el código no llega a mi correo", "es")).toEqual([]);
    expect(vozDelDueno("That's outside my lane", "en")).toEqual([]);
  });

  it("devuelve los hallazgos en el orden en que aparecen", () => {
    expect(
      vozDelDueno("Escríbeme sobre mi trayectoria", "es").map((h) => h.termino),
    ).toEqual(["Escríbeme", "mi"]);
  });
});

describe("el panel y las respuestas fijas no usan la voz del dueño", () => {
  for (const idioma of ["es", "en"] as const) {
    const mensajes = JSON.parse(
      readFileSync(`messages/${idioma}.json`, "utf8"),
    ) as {
      chat: Record<string, string>;
    };
    const cadenas = cadenasConRuta(mensajes.chat, "chat");

    it(`[${idioma}] ${cadenas.length} cadenas del espacio «chat», ninguna en la voz del dueño`, () => {
      expect(cadenas.length).toBeGreaterThan(40);
      const halladas = cadenas
        .map((c) => ({ ruta: c.ruta, h: vozDelDueno(c.texto, idioma) }))
        .filter((c) => c.h.length > 0)
        .map((c) => `${c.ruta}: ${c.h.map((x) => x.termino).join(", ")}`);
      expect(
        halladas,
        "el chat habla en tercera persona de Henry (OM-13); el asistente puede hablar de sí mismo",
      ).toEqual([]);
    });

    it(`[${idioma}] las respuestas fijas tampoco`, () => {
      expect(vozDelDueno(RESPUESTA_OFFTOPIC[idioma], idioma)).toEqual([]);
      expect(vozDelDueno(RESPUESTA_REHUSO[idioma], idioma)).toEqual([]);
    });
  }

  it("el barrido sí ve una regresión: un «escríbeme» plantado en el panel lo delata", () => {
    const sembrada = "Vuelve mañana, o escríbeme desde Contacto";
    expect(vozDelDueno(sembrada, "es").map((h) => h.termino)).toEqual([
      "escríbeme",
    ]);
  });
});
