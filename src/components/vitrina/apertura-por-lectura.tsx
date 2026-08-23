"use client";

import { useEffect } from "react";

/**
 * APERTURA POR LECTURA — adopción ENTERA del patrón del banco de técnicas §7
 * (`wiki/patterns/apertura-por-lectura.md`). Nacido en Velo tras 5 rondas de
 * gate visual y re-derivado a ciegas por nutri-kids en 5 más: por eso el método
 * exige adoptarlo completo y **no re-derivarlo por rondas**.
 *
 * La regla en una frase: **una tarjeta está abierta exactamente mientras está a
 * la vista.** El toque es el control, no el peaje.
 *
 * Comportamiento:
 *  - Abre SOLO bajando, cuando su cabecera cruza la línea de los dos tercios
 *    (queda ⅓ de pantalla por debajo: el hueco donde se la ve crecer).
 *  - Ancla superior: crece hacia abajo; nada de lo ya leído se mueve.
 *  - Cierra al salir ENTERA: por abajo con su transición; por arriba de golpe,
 *    reponiendo el scroll con el alto exacto perdido.
 *  - Subiendo no se abre nada, jamás.
 *  - El toque la saca del automático para el resto de la visita.
 *  - Corre TAMBIÉN con `prefers-reduced-motion`: desplegar es contenido, no
 *    decoración. Lo que se apaga (en CSS) es el movimiento, no la apertura.
 *
 * Trampas que este código evita (todas documentadas, todas pagadas por otros):
 *  T1 — el umbral es de PANTALLA, jamás de la tarjeta (⅓ de una cabecera son
 *       ~30 px: abriría asomando por el borde inferior, donde nadie la ve).
 *  T2 — el disparo es CONTINUO (por cuadro de scroll): al reposo se vuelve
 *       errático y por tick, aleatorio.
 *  T3 — `scrollBy(x, y)` a secas SE ANIMA bajo `scroll-behavior: smooth` y la
 *       página pega saltos de miles de píxeles. Va con `behavior: "instant"`, y
 *       `overflow-anchor: none` en <html> para que el navegador no compense
 *       TAMBIÉN. *El error original no fue compensar: fue compensar ANIMADO.*
 *  T4 — la reposición dispara su propio evento de scroll con la Y más chica;
 *       sin reasignar `yPrevia`, el detector la leería como "subiendo".
 *  T5 — el cierre por arriba debe ser ATÓMICO: una transición repartiría el
 *       encogido en 30 cuadros y la reposición quedaría desfasada 29.
 *  T6 — rectángulos, NO IntersectionObserver: gobierna dónde está la cabecera
 *       respecto a la pantalla, no cuánto de la tarjeta se ve — y con la
 *       coreografía de entrada la caja miente 18 px sobre su posición.
 *  T7 — la compensación del cierre por arriba se calcula midiendo la DERIVA
 *       de un ancla visible debajo, jamás restando el alto perdido a ciegas:
 *       el navegador también ajusta por su cuenta (anclaje de scroll, recorte
 *       en el fondo del documento) y la resta ciega DUPLICA la compensación —
 *       brinco arriba, reapertura bajando, bucle. (Cazada aquí, en M1.)
 */

const TERCIO = 1 / 3;

export function AperturaPorLectura({
  selector,
  trazos = "[data-traza]",
}: {
  selector: string;
  /**
   * Dibujos que se trazan solos al entrar en pantalla (`stroke-dashoffset`, un
   * disparo). Se marcan con `data-vista` — el trazado es CSS, aquí solo se
   * dice cuándo. Van por la misma pasada de rectángulos porque ya la hay: un
   * IntersectionObserver extra para esto sería un segundo mecanismo mirando lo
   * mismo.
   */
  trazos?: string;
}) {
  useEffect(() => {
    const tarjetas = Array.from(
      document.querySelectorAll<HTMLElement>(selector),
    );
    const dibujos = Array.from(document.querySelectorAll<HTMLElement>(trazos));
    if (tarjetas.length === 0 && dibujos.length === 0) return;

    // T3: sin esto Chrome compensa por su cuenta y el ajuste se aplica dos veces.
    const htmlPrevio = document.documentElement.style.overflowAnchor;
    document.documentElement.style.overflowAnchor = "none";

    function abrir(tarjeta: HTMLElement, si: boolean) {
      // Idempotente: `repasar` corre por cuadro.
      if (tarjeta.hasAttribute("data-abierta") === si) return;
      const btn = tarjeta.querySelector<HTMLElement>(".tarjeta-boton");
      if (si) tarjeta.setAttribute("data-abierta", "");
      else tarjeta.removeAttribute("data-abierta");
      btn?.setAttribute("aria-expanded", String(si));
    }

    const quitarClicks = tarjetas.map((tarjeta) => {
      const btn = tarjeta.querySelector<HTMLElement>(".tarjeta-boton");
      if (!btn) return () => {};
      const onClick = () => {
        // Tocarla la saca del automático para el resto de la visita.
        tarjeta.setAttribute("data-manual", "");
        abrir(tarjeta, !tarjeta.hasAttribute("data-abierta"));
      };
      btn.addEventListener("click", onClick);
      return () => btn.removeEventListener("click", onClick);
    });

    let yPrevia = window.scrollY;
    let bajando = true;

    function repasar() {
      const vh = window.innerHeight || document.documentElement.clientHeight;
      // T1: la línea es de PANTALLA. Deja ⅓ de viewport por debajo.
      const linea = vh * (1 - TERCIO);

      // Trazado: un disparo, cuando el dibujo asoma por el borde inferior.
      for (const d of dibujos) {
        if (d.hasAttribute("data-vista")) continue;
        const caja = d.getBoundingClientRect();
        if (caja.top < vh && caja.bottom > 0) d.setAttribute("data-vista", "");
      }

      for (const t of tarjetas) {
        if (t.hasAttribute("data-manual")) continue;
        const caja = t.getBoundingClientRect();
        const abierta = t.hasAttribute("data-abierta");

        if (!abierta) {
          if (bajando && caja.top >= 0 && caja.top <= linea) abrir(t, true);
          continue;
        }
        if (caja.top >= vh) {
          // Salió por abajo: se recoge con su transición, fuera de la vista.
          abrir(t, false);
        } else if (caja.bottom <= 0) {
          // T5: salió por arriba ⇒ atómico, y se repone el alto en el mismo cuadro.
          // T7: la compensación se calcula midiendo la DERIVA REAL de un ancla
          //     visible DEBAJO de la tarjeta — jamás restando el alto perdido a
          //     ciegas. El navegador también ajusta el scroll por su cuenta
          //     (anclaje de scroll, recorte cerca del fondo del documento) y
          //     restar `perdido` encima de ese ajuste DUPLICA la compensación:
          //     la página brinca hacia arriba, la tarjeta re-entra en zona de
          //     apertura bajando, se reabre… y el visitante queda atrapado en
          //     un bucle que no lo deja pasar (cazado en M1 entre las tarjetas
          //     06 y 07: 260 pasos de rueda sin alcanzar el fondo).
          let ancla: Element | null = null;
          for (let n: Element | null = t; n && !ancla; n = n.parentElement)
            ancla = n.nextElementSibling;
          const topAntes = ancla?.getBoundingClientRect().top;
          t.classList.add("sin-transicion");
          abrir(t, false);
          if (ancla && topAntes !== undefined) {
            // Leer el rect fuerza el reflow: aquí ya actuaron el encogido Y el
            // ajuste propio del navegador. Lo que falte (o sobre) es la deriva.
            const deriva = ancla.getBoundingClientRect().top - topAntes;
            if (deriva) {
              window.scrollBy({ top: deriva, left: 0, behavior: "instant" });
              yPrevia = window.scrollY; // T4
            }
          }
          window.requestAnimationFrame(() =>
            t.classList.remove("sin-transicion"),
          );
        }
      }
    }

    let revisando = false;
    function onScroll() {
      const y = window.scrollY;
      if (y !== yPrevia) bajando = y > yPrevia;
      yPrevia = y;
      if (!revisando) {
        revisando = true;
        window.requestAnimationFrame(() => {
          revisando = false;
          repasar();
        });
      }
    }

    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    // Primera pasada: lo que ya está en la zona al cargar se abre igual.
    repasar();

    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      for (const quitar of quitarClicks) quitar();
      document.documentElement.style.overflowAnchor = htmlPrevio;
    };
  }, [selector, trazos]);

  return null;
}
