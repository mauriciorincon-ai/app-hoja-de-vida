import { describe, expect, it } from "vitest";
import { calcularRetrasos } from "@/components/motion/retrasos";

/**
 * EL MODELO DE RETRASOS REPRODUCE LO MEDIDO (2026-09-27, ADR-027).
 *
 * Antes de quitar la librería se midió con Playwright cuándo arrancaba cada
 * pieza de la HOME (`muestras/2026-09-27-tbt/arranques-antes.txt`): los ítems
 * directos a `stagger × i`; en Skills, la cabecera de la tarjeta i a
 * `0,2·i + 0,8` y sus chips detrás cada 0,1 s en la MISMA cuenta que la
 * cabecera; el trazo de los iconos y el pulso de las cifras con retraso
 * absoluto desde el disparo, sin ocupar turno. Este test le exige eso al
 * modelo sobre un DOM con la forma de la página.
 */
const retraso = (el: Element | null) =>
  (el as HTMLElement | null)?.style.getPropertyValue("--reveal-delay") ?? null;

function skills() {
  document.body.innerHTML = `
    <div id="g" data-reveal-group data-stagger="0.2">
      ${[0, 1, 2]
        .map(
          (i) => `
        <div id="card${i}" data-reveal-item="liftIn" data-hijos="0.8,0.1">
          <article>
            <div id="cab${i}" data-reveal-item="fadeInUp">
              <svg>
                <path id="p${i}a" data-reveal-item="trazo" data-retraso style="--reveal-delay: 1s"></path>
                <path id="p${i}b" data-reveal-item="trazo" data-retraso style="--reveal-delay: 1.2s"></path>
              </svg>
            </div>
            <div class="chips">
              <div id="c${i}0" data-reveal-item="scaleInBlur"></div>
              <div id="c${i}1" data-reveal-item="scaleInBlur"></div>
              <div id="c${i}2" data-reveal-item="scaleInBlur"></div>
            </div>
          </article>
        </div>`,
        )
        .join("")}
    </div>`;
  calcularRetrasos(document.getElementById("g")!);
  return (id: string) => retraso(document.getElementById(id));
}

describe("calcularRetrasos: el reparto medido sobre la versión con la librería", () => {
  it("ítems directos: stagger × i, y el retraso del grupo se suma a todos", () => {
    document.body.innerHTML = `
      <div id="g" data-reveal-group data-stagger="0.08" data-delay="0.3">
        <div id="a" data-reveal-item="fadeInUp"></div>
        <div id="b" data-reveal-item="fadeInUp"></div>
        <div id="c" data-reveal-item="fadeInUp"></div>
      </div>`;
    calcularRetrasos(document.getElementById("g")!);
    expect(retraso(document.getElementById("a"))).toBe("0.3s");
    expect(retraso(document.getElementById("b"))).toBe("0.38s");
    expect(retraso(document.getElementById("c"))).toBe("0.46s");
  });

  it("Skills: la tarjeta orquesta a su cabecera y sus chips en una sola cuenta, desplazada por su propio retraso", () => {
    const r = skills();
    expect([r("card0"), r("card1"), r("card2")]).toEqual([
      "0s",
      "0.2s",
      "0.4s",
    ]);
    // cabecera = tarjeta + 0,8; chips = cabecera + 0,1 · (j + 1)
    expect([r("cab0"), r("c00"), r("c01"), r("c02")]).toEqual([
      "0.8s",
      "0.9s",
      "1s",
      "1.1s",
    ]);
    expect([r("cab1"), r("c10")]).toEqual(["1s", "1.1s"]);
    expect([r("cab2"), r("c20")]).toEqual(["1.2s", "1.3s"]);
  });

  it("un ítem con data-retraso conserva su retraso absoluto y no ocupa turno", () => {
    const r = skills();
    // El trazo: 1,0 s y 1,2 s en TODAS las tarjetas (medido), tal como llegó inline.
    expect([r("p0a"), r("p0b"), r("p2a")]).toEqual(["1s", "1.2s", "1s"]);
    // Si los paths ocuparan turno, el primer chip caería en 1,1 s y no en 0,9 s.
    expect(r("c00")).toBe("0.9s");
  });

  it("la vitrina asomada: las cajas escalonadas y el pulso de cada una con su retraso propio", () => {
    document.body.innerHTML = `
      <ul id="g" data-reveal-group data-stagger="0.14">
        <li id="l0" data-reveal-item="fadeInSlow"><span id="s0" data-reveal-item="pulso" data-retraso style="--reveal-delay: 0s"></span></li>
        <li id="l1" data-reveal-item="fadeInSlow"><span id="s1" data-reveal-item="pulso" data-retraso style="--reveal-delay: 0.14s"></span></li>
      </ul>`;
    calcularRetrasos(document.getElementById("g")!);
    expect(retraso(document.getElementById("l0"))).toBe("0s");
    expect(retraso(document.getElementById("l1"))).toBe("0.14s");
    expect(retraso(document.getElementById("s1"))).toBe("0.14s");
  });
});
