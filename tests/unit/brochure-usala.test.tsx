import { renderToString } from "react-dom/server";
import { NextIntlClientProvider } from "next-intl";
import { describe, expect, it, vi } from "vitest";
import { FormularioContacto } from "@/components/forms/formulario-contacto";
import { PropuestaForm } from "@/components/forms/propuesta-form";
import { RoadmapVoting } from "@/components/home/roadmap-voting";
import { Cierre } from "@/components/brochure/secciones";
import { rutaEnIdioma } from "@/lib/brochure/ruta";
import {
  mensajes,
  textosDe,
  textosDeUsalaDe,
  vistaDe,
} from "../fixtures/brochure/vista";

/**
 * «ÚSALA» COMO LO ESCRIBE EL SERVIDOR (S30). Los formularios de la app, el voto y las vecinas viven en el
 * cierre del brochure: aquí se mira el HTML que un rastreador (y quien no tiene JavaScript) lee, y que
 * el tono `tinta` no se cuela en la ficha, donde los mismos formularios son de fondo claro.
 */
vi.mock("@/i18n/navigation", () => ({
  Link: (props: React.ComponentProps<"a">) => <a {...props} />,
  useRouter: () => ({ push: () => {} }),
}));
vi.mock("@/lib/analytics", () => ({ trackEvent: () => {} }));

const es = mensajes("es");
const html = (nodo: React.ReactNode, locale: "es" | "en" = "es") =>
  renderToString(
    <NextIntlClientProvider
      locale={locale}
      messages={{
        form: mensajes(locale).form,
        listaDeEspera: mensajes(locale).listaDeEspera,
        propuesta: mensajes(locale).propuesta,
        roadmap: mensajes(locale).roadmap,
      }}
    >
      {nodo}
    </NextIntlClientProvider>,
  );

function cierre(slug: string, locale: "es" | "en" = "es") {
  const v = vistaDe(slug, locale);
  return html(
    <Cierre
      v={v}
      t={textosDe(locale)}
      s={v.secciones.find((x) => x.id === "cierre")!}
      href={(d) => rutaEnIdioma(locale, d)}
      u={textosDeUsalaDe(locale)}
    />,
    locale,
  );
}

const cuenta = (texto: string, re: RegExp) => (texto.match(re) ?? []).length;
// React separa los nodos de texto contiguos con `<!-- -->`: no cuentan para quien lee la página.
const leido = (h: string) => h.replace(/<!-- -->/g, "");

describe("«Úsala» de una app con ideas en su roadmap (HackGuard: 11)", () => {
  const h = cierre("hackguard");

  it("las 11 ideas están en el HTML, las 5 primeras a la vista y las otras 6 plegadas", () => {
    expect(cuenta(h, /class="votable"/g)).toBe(11);
    expect(cuenta(h, /<li[^>]*data-plegada=""[^>]*class="votable"/g)).toBe(6);
    expect(h).toContain("Ver las 11 ideas");
    expect(h).toContain('aria-expanded="false"');
  });

  it("la lista de espera va con su app elegida y el botón dice «Avísame cuando abra»", () => {
    expect(h).toContain('id="lista-de-espera"');
    expect(h).toMatch(/<option value="hackguard" selected=""|<option selected="" value="hackguard"/);
    expect(h).toContain("Avísame cuando abra");
    expect(h).not.toContain("contacto-portafolio");
  });

  it("la propuesta cuelga del roadmap (`propon`) y el voto es de verdad (botón con su aria-label)", () => {
    expect(h).toContain('class="propon"');
    expect(h).toMatch(/aria-label="Votar por /);
    expect(h).toContain('data-formulario="propuesta"');
  });

  it("«Dónde está» trae su nota, y las vecinas, la ruta de cada app y «Volver a las apps»", () => {
    expect(leido(h)).toContain("Aquí se muestra; no se entrega.");
    expect(h).toContain("Volver a las apps");
    expect(h).toMatch(/href="\/es\/portafolio\/apps\/planlang"/);
    expect(h).toMatch(/href="\/es\/portafolio\/apps\/anonimizador"/);
    expect(h).toMatch(/href="\/es\/portafolio\/apps"/);
  });

  it("sin JavaScript las ideas plegadas se ven y el botón sobra (noscript)", () => {
    expect(h).toContain("<noscript>");
    expect(h).toContain(".votable[data-plegada]{display:grid!important}");
  });
});

describe("«Úsala» de una app sin ideas (Innmobiliaria)", () => {
  const h = cierre("inmobiliaria");

  it("no hay roadmap ni «Ver las N ideas»: la propuesta queda sola en su panel, que no se imprime", () => {
    expect(h).not.toContain('class="votable"');
    expect(h).not.toContain('class="ver-ideas"');
    expect(h).not.toContain("<noscript>");
    expect(h).toContain("usala-panel solo-propuesta");
    expect(h).not.toContain('class="propon"');
    expect(h).toContain('data-formulario="propuesta"');
  });

  it("la lista de espera sigue, con ella elegida", () => {
    expect(h).toMatch(/<option value="inmobiliaria" selected=""|<option selected="" value="inmobiliaria"/);
  });
});

describe("«Úsala» de una app con simulación (planlang)", () => {
  it("«Ver la simulación →» lleva a su simulación, y las demás no la traen", () => {
    expect(leido(cierre("planlang"))).toMatch(
      /href="\/es\/portafolio\/apps\/planlang\/simulacion"[^>]*>Ver la simulación →/,
    );
    expect(cierre("hackguard")).not.toContain("Ver la simulación");
  });
});

describe("«Úsala» de la casa", () => {
  const h = cierre("hoja-de-vida");

  it("cierra con «Escríbeme» al contacto, «Dónde está» y «Volver a las apps»; sin formularios ni roadmap", () => {
    expect(leido(h)).toMatch(/href="\/es#contacto"[^>]*>Escríbeme/);
    expect(h).toContain("Dónde está");
    expect(h).toContain("Volver a las apps");
    expect(h).not.toContain("<form");
    expect(h).not.toContain("usala-rejilla");
    expect(h).not.toContain('class="votable"');
    expect(h).not.toContain("<noscript>");
  });

  it("la casa en inglés cierra en inglés", () => {
    const en = cierre("hoja-de-vida", "en");
    expect(en).toContain("Write to me");
    expect(en).toContain("Back to the apps");
    expect(leido(en)).toContain("Shown here; not handed over.");
  });
});

describe("el tono `tinta` solo vive en el cierre del brochure", () => {
  const campo = {
    name: "app" as const,
    label: "App",
    placeholder: "Elige",
    opciones: [{ value: "ds", label: "DS" }],
  };
  const props = { titulo: "Lista", idPrefijo: "t", campo, nota: "Nota" };

  it("claro (la ficha): la tarjeta de siempre, sin una sola clase de la hoja del brochure", () => {
    const h = html(<FormularioContacto {...props} />);
    expect(h).toContain("rounded-[10px]");
    expect(h).toContain("<h3");
    expect(h).not.toMatch(/class="(campo|boton|usala-form)/);
  });

  it("tinta (el cierre): campos y botón de la hoja, sin utilidades de color en el campo y sin título propio", () => {
    const h = html(<FormularioContacto {...props} tono="tinta" textoEnviar="Avísame" />);
    expect(h).toContain('class="campo"');
    expect(h).toContain('class="boton"');
    expect(h).toContain("Avísame");
    expect(h).toContain('class="usala-nota"');
    expect(h).not.toContain("<h3");
    expect(h).not.toMatch(/border-input|bg-transparent|border-paper-3/);
  });

  it("la propuesta y el voto distinguen los dos tonos igual", () => {
    expect(html(<PropuestaForm app="ds" nombreApp="DS" />)).toContain(
      "rounded-[10px]",
    );
    const t = html(<PropuestaForm app="ds" nombreApp="DS" tono="tinta" />);
    expect(t).toContain("usala-form");
    expect(t).not.toMatch(/border-input|bg-transparent|border-paper-3/);

    const grupos = [
      {
        appId: "ds",
        appNombre: "DS",
        features: Array.from({ length: 7 }, (_, i) => ({
          app: "ds",
          feature: `f${i}`,
          titulo: `Idea ${i}`,
          descripcion: "d",
        })),
      },
    ];
    // Sin `visibles` (la ficha) nada se pliega; con él, las que pasan del corte nacen plegadas.
    const ficha = html(<RoadmapVoting grupos={grupos} />);
    expect(ficha).not.toContain("data-plegada");
    expect(ficha).not.toContain("Ver las");
    const brochure = html(
      <RoadmapVoting grupos={grupos} tono="tinta" visibles={5} />,
    );
    expect(cuenta(brochure, /data-plegada=""/g)).toBe(2);
    expect(brochure).toContain("Ver las 7 ideas");
    expect(es.roadmap.verIdeas).toContain("{n}");
  });
});
