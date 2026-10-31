"use client";

import { useEffect } from "react";

/**
 * LA ISLA DEL BROCHURE (S28): el comportamiento de la maqueta aprobada («comportamiento» y «eventos
 * delegados» de `plantilla.html`), sobre el HTML que ya escribió el servidor.
 *
 * Regla de esta isla: SOLO CAMBIA ATRIBUTOS — `open`, `hidden`, `aria-*`, `data-b-*`, el `src` de una
 * imagen diferida y el `style` de nodos que React no estiliza—, nunca texto ni hijos de un nodo de
 * React. Por eso todo lo que se alterna (el pie de cada pantalla de la portada, el detalle de cada
 * cifra, cada diapositiva del Recorrido) ya viene en el HTML, y aquí se muestra uno y se esconden los
 * demás. Escucha por delegación dentro de `[data-brochure]` y lo suelta todo al desmontarse.
 *
 * Con el movimiento reducido no rota la portada ni crece la cinta; con la pausa (`data-b-quieto`,
 * WCAG 2.2.2) se detiene todo lo que se mueve solo.
 */
export function BrochureInteractivo({ slug }: { slug: string }) {
  useEffect(() => {
    const raiz = document.querySelector<HTMLElement>("[data-brochure]");
    if (!raiz) return;
    const ac = new AbortController();
    const o = { signal: ac.signal };
    const $ = <T extends Element = HTMLElement>(
      s: string,
      r: ParentNode = raiz,
    ) => r.querySelector<T>(s);
    const $$ = <T extends Element = HTMLElement>(
      s: string,
      r: ParentNode = raiz,
    ) => [...r.querySelectorAll<T>(s)];
    const RM = () => matchMedia("(prefers-reduced-motion: reduce)").matches;
    const sinHover = () => matchMedia("(hover: none)").matches;
    const conducta = (): ScrollBehavior => (RM() ? "auto" : "smooth");
    const quieto = () => raiz.hasAttribute("data-b-quieto");
    const observadores: IntersectionObserver[] = [];
    const relojes: number[] = [];
    const sí = (el: Element | null, attr: string, v: boolean) => {
      if (!el) return;
      if (v) el.setAttribute(attr, "");
      else el.removeAttribute(attr);
    };

    // ── las imágenes diferidas: el src llega al acercarse a la vista ─────────────────────────
    const cargar = (img: HTMLImageElement) => {
      if (!img.getAttribute("src") && img.dataset.bSrc)
        img.setAttribute("src", img.dataset.bSrc);
    };
    const obsImg = new IntersectionObserver(
      (xs) => {
        for (const x of xs)
          if (x.isIntersecting) {
            cargar(x.target as HTMLImageElement);
            obsImg.unobserve(x.target);
          }
      },
      { rootMargin: "300px" },
    );
    observadores.push(obsImg);
    for (const img of $$<HTMLImageElement>("img[data-b-src]"))
      if (!img.closest("dialog") && !img.hasAttribute("data-b-luego"))
        obsImg.observe(img);
    // las pantallas que rotan en la portada y las de detrás: cuando la página ya cargó
    const luego = () =>
      $$<HTMLImageElement>("img[data-b-luego]").forEach(cargar);
    if (document.readyState === "complete")
      relojes.push(window.setTimeout(luego, 1200));
    else
      addEventListener(
        "load",
        () => relojes.push(window.setTimeout(luego, 1200)),
        o,
      );

    // ── aparecer al entrar en pantalla ─────────────────────────────────────────────────────
    const obsAp = new IntersectionObserver(
      (xs) => {
        for (const x of xs)
          if (x.isIntersecting) {
            x.target.setAttribute("data-b-visto", "");
            obsAp.unobserve(x.target);
          }
      },
      { rootMargin: "0px 0px -8% 0px" },
    );
    observadores.push(obsAp);
    for (const el of $$(".aparece")) obsAp.observe(el);

    // ── la barra: oscura mientras va sobre la portada ──────────────────────────────────────
    const barra = $(".barra");
    const portada = $(".portada");
    if (barra && portada) {
      const tope =
        (barra.getBoundingClientRect().top || 0) + barra.offsetHeight;
      const obsP = new IntersectionObserver(
        ([x]) => sí(barra, "data-b-oscura", !!x?.isIntersecting),
        {
          rootMargin: `-${Math.round(tope)}px 0px -100% 0px`,
        },
      );
      observadores.push(obsP);
      obsP.observe(portada);
    }

    // ── el índice: la sección en curso ─────────────────────────────────────────────────────
    const marcarSeccion = (id: string) => {
      for (const el of $$("[data-b-indice]"))
        el.hidden = el.dataset.bIndice !== id;
      for (const b of $$("#indice-lista button"))
        b.setAttribute("aria-current", String(b.dataset.irSec === id));
    };
    const obsSec = new IntersectionObserver(
      (xs) => {
        for (const x of xs)
          if (x.isIntersecting)
            marcarSeccion((x.target as HTMLElement).dataset.sec ?? "top");
      },
      { rootMargin: "-40% 0px -55% 0px" },
    );
    observadores.push(obsSec);
    for (const el of $$("[data-sec]")) obsSec.observe(el);
    const cerrarIndice = () => {
      const b = $("#indice-boton");
      if (!b) return;
      b.setAttribute("aria-expanded", "false");
      const l = $("#indice-lista");
      if (l) l.hidden = true;
    };

    // ── la portada: pantallas que se alternan ──────────────────────────────────────────────
    const heroImgs = $$<HTMLImageElement>("#hero-pantalla img");
    let heroI = 0;
    let heroPausa = 0;
    let encima = false;
    const heroA = (i: number) => {
      if (!heroImgs.length) return;
      heroI = (i + heroImgs.length) % heroImgs.length;
      heroImgs.forEach((im, k) => {
        if (k === heroI) cargar(im);
        sí(im, "data-b-activa", k === heroI);
      });
      $$(".punto").forEach((p, k) =>
        p.setAttribute("aria-current", String(k === heroI)),
      );
      for (const s of $$("[data-b-hero]"))
        s.hidden = Number(s.dataset.bHero) !== heroI;
      const boton = $("#hero-pantalla");
      if (boton && heroImgs[heroI]?.dataset.id)
        boton.dataset.recorrido = heroImgs[heroI].dataset.id;
    };
    const escena = $(".escena");
    escena?.addEventListener("mouseenter", () => (encima = true), o);
    escena?.addEventListener("mouseleave", () => (encima = false), o);
    // tocar una flecha o un punto deja la pantalla quieta 15 s; después sigue sola
    const heroManual = () => (heroPausa = Date.now() + 15000);
    if (!RM() && heroImgs.length > 1)
      relojes.push(
        window.setInterval(() => {
          if (
            !encima &&
            !document.hidden &&
            Date.now() > heroPausa &&
            !quieto()
          )
            heroA(heroI + 1);
        }, 4200),
      );

    // ── capítulos y saltos ─────────────────────────────────────────────────────────────────
    const CLAVE = `brochure-abiertos:${slug}`;
    const guardarAbiertos = () => {
      try {
        sessionStorage.setItem(
          CLAVE,
          JSON.stringify(
            $$<HTMLDetailsElement>("details.capitulo[open]").map((d) => d.id),
          ),
        );
      } catch {
        /* sin almacenamiento: los capítulos solo no se recuerdan */
      }
    };
    let imprimiendo = false;
    raiz.addEventListener(
      "toggle",
      (e) => {
        const d = e.target as HTMLElement;
        if (!d.matches?.("details.capitulo")) return;
        if ((d as HTMLDetailsElement).open)
          for (const el of $$(".aparece", d))
            el.setAttribute("data-b-visto", "");
        if (!imprimiendo) guardarAbiertos();
        igualarFichas();
      },
      { capture: true, signal: ac.signal },
    );
    const irA = (id: string, destino?: string) => {
      cerrarIndice();
      if (id === "top") {
        window.scrollTo({ top: 0, behavior: conducta() });
        return;
      }
      const sec = document.getElementById(`s-${id}`);
      if (!sec) return;
      if (sec instanceof HTMLDetailsElement) sec.open = true;
      requestAnimationFrame(() => {
        const el = (destino && document.getElementById(destino)) || sec;
        el.scrollIntoView({
          block: destino ? "center" : "start",
          behavior: conducta(),
        });
        if (destino && el !== sec) {
          el.removeAttribute("data-b-destello");
          void el.offsetWidth;
          el.setAttribute("data-b-destello", "");
          relojes.push(
            window.setTimeout(
              () => el.removeAttribute("data-b-destello"),
              1900,
            ),
          );
        }
      });
    };
    // «↩ Volver a donde estabas»: cada salto guarda de dónde salió; el botón aparece y regresa ahí
    let regresoY: number | null = null;
    const regreso = $<HTMLButtonElement>("#regreso");
    const ocultarRegreso = () => {
      if (regreso) {
        regreso.removeAttribute("data-b-ver");
        regreso.hidden = true;
      }
      regresoY = null;
    };
    const saltar = (ir: () => void) => {
      regresoY = window.scrollY;
      ir();
      relojes.push(
        window.setTimeout(() => {
          if (regreso && regresoY != null) {
            regreso.hidden = false;
            requestAnimationFrame(() => regreso.setAttribute("data-b-ver", ""));
          }
        }, 700),
      );
    };
    const volverAtras = () => {
      const y = regresoY;
      ocultarRegreso();
      if (y != null) window.scrollTo({ top: y, behavior: conducta() });
    };
    addEventListener(
      "scroll",
      () => {
        if (
          regreso?.hasAttribute("data-b-ver") &&
          regresoY != null &&
          Math.abs(window.scrollY - regresoY) < 140
        )
          ocultarRegreso();
        ocultarPrevia();
      },
      { passive: true, signal: ac.signal },
    );
    document.addEventListener(
      "brochure:ir",
      (e) => {
        const d = (e as CustomEvent<{ sec: string; el?: string }>).detail;
        saltar(() => irA(d.sec, d.el));
      },
      o,
    );

    // ── fichas que se voltean, todas de la misma altura ─────────────────────────────────────
    const voltear = (f: HTMLElement, v?: boolean) => {
      const x = v ?? !f.hasAttribute("data-b-volteada");
      sí(f, "data-b-volteada", x);
      $(".ficha-voltea", f)?.setAttribute("aria-pressed", String(x));
    };
    // la altura de la cara más larga, medida fuera de pantalla con el ancho que tendrá cada ficha
    // (los capítulos cerrados no se pueden medir en su sitio)
    function igualarFichas() {
      const cap = $("details.capitulo");
      const caras = $$(".fichas .ficha .cara");
      if (!cap || !caras.length) return;
      const ancho = cap.clientWidth - 52;
      const gap = 16;
      const cols = Math.max(1, Math.floor((ancho + gap) / (400 + gap)));
      const caja = document.createElement("div");
      caja.setAttribute("data-brochure", "");
      caja.style.cssText = `position:absolute;left:-10000px;top:0;visibility:hidden;width:${(ancho - (cols - 1) * gap) / cols}px`;
      for (const c of caras) {
        const f = document.createElement("div");
        f.className = "ficha medida";
        const copia = c.cloneNode(true) as HTMLElement;
        copia.removeAttribute("id");
        f.appendChild(copia);
        caja.appendChild(f);
      }
      document.body.appendChild(caja);
      const alto = Math.max(
        230,
        ...[...caja.querySelectorAll<HTMLElement>(".cara")].map(
          (c) => c.offsetHeight,
        ),
      );
      caja.remove();
      raiz!.style.setProperty("--alto-ficha", `${Math.ceil(alto)}px`);
    }
    igualarFichas();
    void document.fonts?.ready.then(igualarFichas);
    let tF = 0;
    addEventListener(
      "resize",
      () => {
        clearTimeout(tF);
        tF = window.setTimeout(igualarFichas, 200);
      },
      o,
    );

    // ── la vista previa de una pantalla (cajas del flujo, citas, cinta con movimiento reducido) ───
    const previa = $("#previa");
    const ocultarPrevia = () => previa?.removeAttribute("data-b-ver");
    const mostrarPrevia = (el: HTMLElement) => {
      const id = el.dataset.previa;
      if (!previa || !id || sinHover()) return;
      const grande = el.classList.contains("cinta-item");
      // en la cinta la pantalla crece en su sitio; la tarjeta flotante queda solo con el movimiento reducido
      if (grande && !RM()) return;
      const p = $(`[data-b-previa="${CSS.escape(id)}"]`, previa);
      if (!p) return;
      sí(previa, "data-b-grande", grande);
      const img = $<HTMLImageElement>("img", previa);
      if (img && p.dataset.src) img.setAttribute("src", p.dataset.src);
      for (const x of $$("[data-b-previa]", previa)) x.hidden = x !== p;
      const r = el.getBoundingClientRect();
      const W = grande ? Math.min(600, innerWidth - 20) : 330;
      const H = W / 1.6 + 66;
      let left = r.left + r.width / 2 - W / 2;
      let top = r.top - H - 12;
      if (top < 70) top = r.bottom + 12;
      left = Math.max(10, Math.min(left, innerWidth - W - 10));
      previa.style.left = `${left}px`;
      previa.style.top = `${top}px`;
      previa.setAttribute("data-b-ver", "");
    };

    // ── la cinta como un dock ─────────────────────────────────────────────────────────────
    // la pantalla crece centrada en su sitio, las de antes y las de después se apartan, y si queda
    // contra un borde, toda la cinta se corre lo justo para que se vea entera
    const crecerCinta = (item: HTMLElement) => {
      if (RM() || sinHover()) return;
      const pista = item.parentElement!;
      const mueve = pista.parentElement!;
      const cinta = mueve.parentElement!;
      const cs = getComputedStyle(cinta);
      const w = parseFloat(cs.getPropertyValue("--cinta-w"));
      const x = parseFloat(cs.getPropertyValue("--cinta-x"));
      const caja = cinta.getBoundingClientRect();
      const tx = new DOMMatrix(getComputedStyle(pista).transform).m41;
      const izq = caja.left + item.offsetLeft + tx + w / 2 - (w * x) / 2;
      const corre =
        Math.min(Math.max(izq, caja.left + 16), caja.right - 16 - w * x) - izq;
      let paso = "antes";
      for (const c of pista.children) {
        if (c === item) {
          paso = "despues";
          c.setAttribute("data-b-dock", "crece");
        } else c.setAttribute("data-b-dock", paso);
      }
      mueve.style.transform = corre ? `translateX(${corre.toFixed(1)}px)` : "";
      pista.setAttribute("data-b-abierta", "");
    };
    const cerrarCinta = (pista: HTMLElement) => {
      pista.removeAttribute("data-b-abierta");
      pista.parentElement!.style.transform = "";
    };

    // ── el Recorrido ───────────────────────────────────────────────────────────────────────
    const rec = $<HTMLDialogElement>("dialog.recorrido");
    const diapos = rec ? $$("[data-b-r]", rec) : [];
    const total = rec ? $$<HTMLImageElement>(".r-marco img", rec).length : 0;
    const R = { i: 0, auto: 0 };
    const rMostrar = (i: number) => {
      if (!rec || !total) return;
      R.i = (i + total) % total;
      for (const el of diapos) {
        const es = Number(el.dataset.bR) === R.i;
        if (el.tagName === "IMG") {
          if (es) cargar(el as HTMLImageElement);
          sí(el, "data-b-activa", es);
        } else el.hidden = !es;
      }
      const sig = $<HTMLImageElement>(
        `.r-marco img[data-b-r="${(R.i + 1) % total}"]`,
        rec,
      );
      if (sig) cargar(sig);
      const actual = $(`.r-marco img[data-b-r="${R.i}"]`, rec);
      const g = Number(actual?.dataset.g);
      for (const s of $$(".r-seg", rec)) {
        const og = Number(s.dataset.g);
        const deG = $$(`.r-marco img[data-g="${og}"]`, rec).map((x) =>
          Number(x.dataset.bR),
        );
        const p = og < g ? 1 : og > g ? 0 : (deG.indexOf(R.i) + 1) / deG.length;
        const barra = $("i", s);
        if (barra) barra.style.transform = `scaleX(${p})`;
      }
      $$(".r-tira", rec).forEach((t, k) => {
        t.setAttribute("aria-current", String(k === R.i));
        if (k === R.i)
          t.scrollIntoView({
            inline: "center",
            block: "nearest",
            behavior: conducta(),
          });
      });
    };
    const rAuto = (v?: boolean) => {
      const on = v ?? !R.auto;
      clearInterval(R.auto);
      R.auto = on ? window.setInterval(() => rMostrar(R.i + 1), 4500) : 0;
      const b = rec && $("#r-auto", rec);
      if (b) {
        b.setAttribute("aria-pressed", String(on));
        for (const s of $$("[data-b-auto]", b))
          s.hidden = (s.dataset.bAuto === "on") !== on;
      }
    };
    const rAbrir = (id?: string) => {
      if (!rec) return;
      ocultarPrevia();
      const imgs = $$(".r-marco img", rec);
      const i = id ? imgs.findIndex((x) => x.dataset.id === id) : 0;
      rec.showModal();
      rMostrar(i < 0 ? 0 : i);
    };
    rec?.addEventListener("close", () => rAuto(false), o);

    // ── el movimiento: la pausa (WCAG 2.2.2) ────────────────────────────────────────────────
    const pausar = (b: HTMLElement) => {
      const v = !quieto();
      sí(raiz, "data-b-quieto", v);
      b.setAttribute("aria-pressed", String(v));
      for (const s of $$("[data-b-pausa-texto]", b))
        s.hidden = (s.dataset.bPausaTexto === "quieto") !== v;
    };

    // ── eventos (delegados) ────────────────────────────────────────────────────────────────
    raiz.addEventListener(
      "click",
      (e) => {
        const t = e.target as HTMLElement;
        if (rec?.open && rec.contains(t)) {
          if (t.closest("#r-cerrar")) return rec.close();
          if (t.closest("#r-ant")) return rMostrar(R.i - 1);
          if (t.closest("#r-sig")) return rMostrar(R.i + 1);
          if (t.closest("#r-auto")) return rAuto();
          const tira = t.closest<HTMLElement>("[data-ri]");
          if (tira) return rMostrar(Number(tira.dataset.ri));
          const seg = t.closest<HTMLElement>(".r-seg");
          if (seg) {
            const primera = $(`.r-marco img[data-g="${seg.dataset.g}"]`, rec);
            return rMostrar(Number(primera?.dataset.bR ?? 0));
          }
          if (t.closest("#r-capitulo")) {
            const img = $(`.r-marco img[data-b-r="${R.i}"]`, rec);
            rec.close();
            if (img?.dataset.id && img.dataset.g)
              irA(`g${img.dataset.g}`, `p-${img.dataset.id}`);
          }
          return;
        }
        if (!t.closest(".indice")) cerrarIndice();
        const ib = t.closest("#indice-boton");
        if (ib) {
          const v = ib.getAttribute("aria-expanded") !== "true";
          ib.setAttribute("aria-expanded", String(v));
          const l = $("#indice-lista");
          if (l) l.hidden = !v;
          return;
        }
        if (t.closest("#regreso")) return volverAtras();
        const pa = t.closest<HTMLElement>("[data-b-pausa]");
        if (pa) return pausar(pa);
        const vu = t.closest<HTMLElement>("[data-volver]");
        if (vu) {
          ocultarRegreso();
          return irA("mapa", `t-g${vu.dataset.volver}`);
        }
        const r = t.closest<HTMLElement>("[data-recorrido]");
        if (r) {
          e.preventDefault();
          return rAbrir(r.dataset.recorrido || undefined);
        }
        const ab = t.closest<HTMLElement>("[data-abre]");
        if (ab) return saltar(() => irA(`g${ab.dataset.abre}`));
        const is = t.closest<HTMLElement>("[data-ir-sec]");
        if (is) {
          e.stopPropagation();
          return saltar(() => irA(is.dataset.irSec!, is.dataset.irEl));
        }
        const hp = t.closest<HTMLElement>("[data-hero-paso]");
        if (hp) {
          heroManual();
          return heroA(heroI + Number(hp.dataset.heroPaso));
        }
        const ci = t.closest<HTMLElement>("[data-cifra]");
        if (ci) {
          const ya = ci.getAttribute("aria-expanded") === "true";
          for (const b of $$("[data-cifra]"))
            b.setAttribute("aria-expanded", "false");
          for (const s of $$("[data-cifra-detalle]"))
            s.hidden = ya || s.dataset.cifraDetalle !== ci.dataset.cifra;
          if (!ya) ci.setAttribute("aria-expanded", "true");
          return;
        }
        const pu = t.closest<HTMLElement>("[data-hero]");
        if (pu) {
          heroManual();
          return heroA(Number(pu.dataset.hero));
        }
        if (t.closest("[data-imprimir]")) return window.print();
        const vt = t.closest<HTMLElement>(".voltear-todas");
        if (vt) {
          const fs = $$(
            ".ficha:not([data-b-oculta])",
            vt.closest(".cap-fichas") ?? raiz,
          );
          const v = !fs.every((f) => f.hasAttribute("data-b-volteada"));
          return fs.forEach((f) => voltear(f, v));
        }
        const fil = t.closest<HTMLElement>(".filtro");
        if (fil) {
          const caja = fil.closest(".cap-fichas") ?? raiz;
          for (const x of $$(".filtro", caja))
            x.setAttribute("aria-pressed", String(x === fil));
          for (const f of $$(".ficha", caja))
            sí(
              f,
              "data-b-oculta",
              fil.dataset.tipo !== "todas" &&
                f.dataset.tipo !== fil.dataset.tipo,
            );
          return;
        }
        const fv = t.closest<HTMLElement>(".ficha-voltea");
        if (fv) return voltear(fv.closest<HTMLElement>(".ficha")!);
      },
      o,
    );
    raiz.addEventListener(
      "keydown",
      (e) => {
        if (rec?.open) {
          if (e.key === "ArrowRight") rMostrar(R.i + 1);
          else if (e.key === "ArrowLeft") rMostrar(R.i - 1);
          else if (e.key === "Home") rMostrar(0);
          else if (e.key === "End") rMostrar(total - 1);
          else if (
            e.key === " " &&
            !(e.target as HTMLElement).closest("button")
          ) {
            e.preventDefault();
            rAuto();
          }
          return;
        }
        if (e.key === "Escape") cerrarIndice();
      },
      o,
    );
    // «/» busca, desde cualquier parte de la página que no sea un campo
    document.addEventListener(
      "keydown",
      (e) => {
        const tag = (e.target as HTMLElement).tagName;
        if (
          e.key === "/" &&
          !/input|textarea|select/i.test(tag) &&
          !rec?.open
        ) {
          e.preventDefault();
          $<HTMLInputElement>("#buscar")?.focus();
        }
      },
      o,
    );
    const conPrevia = (t: EventTarget | null) =>
      (t as HTMLElement)?.closest?.<HTMLElement>("[data-previa]");
    const deCinta = (t: EventTarget | null) =>
      (t as HTMLElement)?.closest?.<HTMLElement>(".cinta-item");
    raiz.addEventListener(
      "focusin",
      (e) => {
        const el = conPrevia(e.target);
        if (el?.dataset.previa) mostrarPrevia(el);
        const ci = deCinta(e.target);
        if (ci) crecerCinta(ci);
      },
      o,
    );
    raiz.addEventListener(
      "focusout",
      (e) => {
        if (conPrevia(e.target)) ocultarPrevia();
        const pi = (e.target as HTMLElement).closest?.<HTMLElement>(
          ".cinta-pista",
        );
        if (pi && !pi.contains(e.relatedTarget as Node)) cerrarCinta(pi);
      },
      o,
    );
    raiz.addEventListener(
      "mouseover",
      (e) => {
        const el = conPrevia(e.target);
        if (el?.dataset.previa) mostrarPrevia(el);
        const ci = deCinta(e.target);
        if (ci) crecerCinta(ci);
      },
      o,
    );
    raiz.addEventListener(
      "mouseout",
      (e) => {
        const el = conPrevia(e.target);
        if (el && !el.contains(e.relatedTarget as Node)) ocultarPrevia();
        const pi = (e.target as HTMLElement).closest?.<HTMLElement>(
          ".cinta-pista",
        );
        if (pi && !pi.contains(e.relatedTarget as Node)) cerrarCinta(pi);
      },
      o,
    );

    // ── el PDF: todo abierto ───────────────────────────────────────────────────────────────
    let cerradosAntes: HTMLDetailsElement[] = [];
    addEventListener(
      "beforeprint",
      () => {
        imprimiendo = true;
        cerradosAntes = $$<HTMLDetailsElement>("details.capitulo:not([open])");
        for (const d of cerradosAntes) d.open = true;
        for (const el of $$(".aparece")) el.setAttribute("data-b-visto", "");
        for (const img of $$<HTMLImageElement>("img[data-b-src]:not([src])"))
          if (!img.closest("dialog")) cargar(img);
      },
      o,
    );
    addEventListener(
      "afterprint",
      () => {
        for (const d of cerradosAntes) d.open = false;
        cerradosAntes = [];
        imprimiendo = false;
      },
      o,
    );

    // ── al llegar: los capítulos que estaban abiertos (también al cambiar de idioma) y el ancla ───
    try {
      const abiertos = JSON.parse(
        sessionStorage.getItem(CLAVE) ?? "[]",
      ) as string[];
      for (const id of abiertos) {
        const d = document.getElementById(id);
        if (d instanceof HTMLDetailsElement) d.open = true;
      }
    } catch {
      /* sin almacenamiento: se empieza con todo cerrado */
    }
    if (location.hash.startsWith("#s-")) irA(location.hash.slice(3));
    raiz.setAttribute("data-b-listo", "");

    return () => {
      ac.abort();
      for (const ob of observadores) ob.disconnect();
      for (const r of relojes) {
        clearTimeout(r);
        clearInterval(r);
      }
      clearInterval(R.auto);
    };
  }, [slug]);

  return null;
}
