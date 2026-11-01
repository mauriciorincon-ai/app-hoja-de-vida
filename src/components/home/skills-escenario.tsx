"use client";

import { useEffect, useLayoutEffect, useRef, useState } from "react";
import * as M from "@/lib/skills/explorador";
import { colorDeArea, RED } from "@/lib/skills/paleta";
import { anotarVistas, vistasVigentes } from "./skills-memoria";
import { DibujoSkill } from "./skills-iconos";

/**
 * EL ESCENARIO DE SKILLS (S29, OM-02): las nueve áreas flotando en un rectángulo oscuro, uno a uno con la
 * pieza 1 de `referencias-ui/home/maqueta/` (aprobada el 2026-10-31 tras cinco vueltas).
 *
 * Vive en su propio chunk: la isla (`skills-explorador.tsx`) lo carga con `next/dynamic` cuando la sección
 * se acerca a la vista, así que la home no paga este código al cargar (el presupuesto de TBT es el más
 * justo del sitio). Las cuentas son del motor puro (`src/lib/skills/explorador.ts`); aquí se mide, se
 * pinta y se escucha.
 *
 * Reglas de la casa:
 *  - lo que cambia cuadro a cuadro (la posición, la que se detiene, la que se arrastra) se escribe en el
 *    DOM con `transform` y atributos `data-*`, sin pasar por React; lo que cambia por una decisión del
 *    visitante (la elegida, las vistas, el aviso) es estado de React;
 *  - la FORMA del árbol nunca depende de «reducir movimiento» (regla 7): esa preferencia solo se lee en
 *    los efectos y los manejadores; con ella no flota, no se arrastra (el clic sigue eligiendo), la red
 *    queda quieta y todo cambia sin viaje (la hoja);
 *  - el cuadro se detiene cuando el rectángulo no se ve, la pestaña está oculta o la lista está puesta;
 *  - ninguna librería (ADR-027).
 */

export type AreaExplorador = {
  id: string;
  nombre: string;
  items: M.ItemPartido[];
};

/** Los textos del escenario, con sus plantillas («{n} de {t}»). Vienen de `messages/*.json` → `skills.explorador`. */
export type TextosEscenario = {
  invita: string;
  todas: string;
  progreso: string;
  volver: string;
  lista: string;
  cuantas: string;
  anuncio: string;
  yaVista: string;
  pasos: string;
  cual: string;
  anterior: string;
  siguiente: string;
};

type Props = {
  areas: AreaExplorador[];
  textos: TextosEscenario;
  /** La vista de áreas está puesta (no la lista). */
  activo: boolean;
  /** Una cita del chat (`#skills-<id>`) que pide abrir un área; `n` cambia con cada pedido. */
  pedido: { id: string; n: number } | null;
  onVerLista: () => void;
};

type Arrastre = {
  i: number;
  id: number;
  dedo: boolean;
  armada: boolean;
  x0: number;
  y0: number;
  dx: number;
  dy: number;
  movido: boolean;
  muestras: M.Muestra[];
  vx: number;
  vy: number;
  reloj?: number;
};

const QUIETO = "(prefers-reduced-motion: reduce)";
const prefiereQuieto = () => window.matchMedia(QUIETO).matches;

export function SkillsEscenario({
  areas,
  textos,
  activo,
  pedido,
  onVerLista,
}: Props) {
  const [elegida, setElegida] = useState(-1);
  const [viaja, setViaja] = useState(-1);
  const [vistas, setVistas] = useState<string[]>(() => vistasVigentes());
  const [anuncio, setAnuncio] = useState("");

  const escRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const invitaRef = useRef<HTMLParagraphElement>(null);
  const lineasRef = useRef<SVGSVGElement>(null);
  const chipsRef = useRef<HTMLUListElement>(null);
  const medidorRef = useRef<HTMLDivElement>(null);
  const burbujas = useRef<(HTMLButtonElement | null)[]>([]);

  // El estado del motor que corre cuadro a cuadro: fuera de React a propósito.
  const motor = useRef({
    cuerpos: [] as M.Cuerpo[],
    sem: { W: 0, H: 0 },
    W: 0,
    techoInv: 0,
    sobre: -1,
    foco: -1,
    puntero: null as M.Punto | null,
    arr: null as Arrastre | null,
    suelta: -1,
    soltadaEn: -1e9,
    raf: 0,
    ult: 0,
    visible: false,
    activo: true,
    elegida: -1,
    centro: { x: 0, y: 0 } as M.Punto,
    origenChips: { x: 0, y: 0 } as M.Punto,
    enfocarElegida: false,
    enfocarVuelta: -1,
    red: [] as M.PuntoRed[],
    redT: { W: 0, H: 0 },
    tListo: 0,
    tViaja: 0,
  });

  // Las funciones del escenario leen los elementos y el motor por referencia; los manejadores que se
  // instalan una sola vez llegan a la versión vigente por `acciones`.
  const medidasActuales = () =>
    M.medidas(motor.current.W, motor.current.techoInv, areas.length);

  const medirTecho = () => {
    const p = invitaRef.current;
    if (p) motor.current.techoInv = p.offsetTop + p.offsetHeight + 10;
  };

  const pintar = () => {
    const mo = motor.current;
    const r = medidasActuales().d / 2;
    burbujas.current.forEach((b, i) => {
      const c = mo.cuerpos[i];
      if (b && c && i !== mo.elegida)
        b.style.transform = `translate(${(c.x - r).toFixed(1)}px,${(c.y - r).toFixed(1)}px)`;
    });
  };

  const marcarSobre = () => {
    const mo = motor.current;
    const r = medidasActuales().d / 2;
    if (mo.suelta >= 0 && !M.enCirculo(mo.cuerpos[mo.suelta]!, r, mo.puntero))
      mo.suelta = -1;
    const s = M.cualSeDetiene(mo.cuerpos, r, mo.puntero, {
      agarrada: mo.arr ? { i: mo.arr.i, movido: mo.arr.movido } : null,
      elegida: mo.elegida,
      suelta: mo.suelta,
      foco: mo.foco,
    });
    if (s !== mo.sobre) {
      if (mo.sobre >= 0)
        burbujas.current[mo.sobre]?.removeAttribute("data-sobre");
      if (s >= 0) burbujas.current[s]?.setAttribute("data-sobre", "");
      mo.sobre = s;
    }
  };

  const dibujarRed = (dt: number) => {
    const mo = motor.current;
    const ctx = canvasRef.current?.getContext("2d");
    if (!ctx || !mo.redT.W) return;
    const { W, H } = mo.redT;
    M.pasoRed(mo.red, dt, W, H);
    ctx.clearRect(0, 0, W, H);
    ctx.lineWidth = 0.7;
    for (const { a, b, alfa } of M.enlacesDeRed(mo.red, M.alcanceDeRed(W))) {
      ctx.strokeStyle = `rgba(${RED.linea},${alfa.toFixed(3)})`;
      ctx.beginPath();
      ctx.moveTo(a.x, a.y);
      ctx.lineTo(b.x, b.y);
      ctx.stroke();
    }
    ctx.fillStyle = RED.punto;
    for (const p of mo.red) {
      ctx.beginPath();
      ctx.arc(p.x, p.y, 1.2, 0, Math.PI * 2);
      ctx.fill();
    }
  };

  const ajustarRed = () => {
    const mo = motor.current;
    const esc = escRef.current;
    const cv = canvasRef.current;
    if (!esc || !cv) return;
    const W = esc.clientWidth;
    const H = esc.clientHeight;
    if (!W || !H) return;
    const dpr = Math.min(2, window.devicePixelRatio || 1);
    cv.width = Math.round(W * dpr);
    cv.height = Math.round(H * dpr);
    cv.getContext("2d")?.setTransform(dpr, 0, 0, dpr, 0, 0);
    M.ajustarRed(mo.red, mo.redT, W, H, Math.random);
    mo.redT = { W, H };
    dibujarRed(0);
  };

  const cuadro = (t: number) => {
    const mo = motor.current;
    mo.raf = 0;
    if (!mo.visible || document.hidden || prefiereQuieto() || !mo.activo)
      return;
    const dt = Math.min(0.05, (t - (mo.ult || t)) / 1000);
    mo.ult = t;
    if (mo.elegida < 0) {
      marcarSobre();
      const a = mo.arr;
      // la mano se quedó quieta: la arrastrada no empuja con un golpe viejo (`t` es el reloj de
      // `performance.now()`, el mismo de las muestras)
      if (
        a?.movido &&
        t - a.muestras[a.muestras.length - 1]![0] > M.MANO_QUIETA_MS
      ) {
        a.vx = 0;
        a.vy = 0;
      }
      M.paso(
        mo.cuerpos,
        dt,
        medidasActuales(),
        {
          sobre: mo.sobre,
          arrastre: a?.movido ? { i: a.i, vx: a.vx, vy: a.vy } : null,
        },
        Math.random,
      );
      pintar();
    }
    dibujarRed(dt);
    mo.raf = requestAnimationFrame(acciones.current.cuadro);
  };

  const animar = () => {
    const mo = motor.current;
    if (prefiereQuieto()) {
      dibujarRed(0);
      return;
    }
    if (!mo.raf) {
      mo.ult = 0;
      mo.raf = requestAnimationFrame(acciones.current.cuadro);
    }
  };

  /** Los nombres siempre caben: se achican hasta caber, y todos llevan el tamaño del que más se achicó. */
  const ajustarNombres = (d: number) => {
    const med = medidorRef.current;
    if (!med) return;
    med.style.width = `${d * 0.8}px`;
    const tam = areas.map((a) => {
      med.textContent = a.nombre;
      let fs = M.NOMBRE_FS.inicial(d);
      const cabe = () => {
        med.style.fontSize = `${fs}px`;
        const rg = document.createRange();
        rg.selectNodeContents(med);
        return M.nombreCabe(d, {
          anchoPalabras: med.scrollWidth,
          anchoTexto: rg.getBoundingClientRect().width,
          altoTexto: med.offsetHeight,
        });
      };
      while (!cabe() && fs > M.NOMBRE_FS.minimo) fs -= M.NOMBRE_FS.paso;
      return fs;
    });
    const fs = Math.min(...tam);
    for (const b of burbujas.current) {
      const n = b?.querySelector<HTMLElement>(".nombre");
      if (n) n.style.fontSize = `${fs}px`;
    }
  };

  /** La elegida al centro y sus herramientas alrededor, conectadas (las cuentas: `M.colocarChips`). */
  const colocar = () => {
    const mo = motor.current;
    const esc = escRef.current;
    const ul = chipsRef.current;
    const svg = lineasRef.current;
    const b = burbujas.current[mo.elegida];
    if (!esc || !ul || !svg || !b) return;
    const m = medidasActuales();
    const est = M.estiloDeChips(m.angosto);
    esc.style.setProperty("--chip-max", `${est.max}px`);
    esc.style.setProperty("--chip-fs", `${est.fs}px`);
    const chips = [...ul.children] as HTMLElement[];
    const cajas = chips.map((el) => ({
      w: el.offsetWidth,
      h: el.offsetHeight,
    }));
    const c = M.colocarChips(cajas, m.W, m.angosto, m.d);
    esc.style.height = `${c.H}px`;
    esc.style.setProperty("--sc", String(c.sc));
    mo.centro = c.centro;
    b.style.transform = `translate(${c.centro.x - m.d / 2}px,${c.centro.y - m.d / 2}px)`;
    svg.setAttribute("viewBox", `0 0 ${m.W} ${c.H}`);
    svg.innerHTML = c.lineas
      .map(
        (l) =>
          `<line x1="${l.x1.toFixed(1)}" y1="${l.y1.toFixed(1)}" x2="${l.x2.toFixed(1)}" y2="${l.y2.toFixed(1)}"/>`,
      )
      .join("");
    chips.forEach((el, j) => {
      const p = c.posiciones[j]!;
      el.style.transform = `translate(${(p.x - cajas[j]!.w / 2).toFixed(1)}px,${(p.y - cajas[j]!.h / 2).toFixed(1)}px)`;
    });
    requestAnimationFrame(() => {
      svg.setAttribute("data-ver", "");
      chips.forEach((el) => el.setAttribute("data-ver", ""));
    });
    ajustarRed();
  };

  /** Las herramientas arrancan donde está la burbuja (o el centro, si llega desde otra), chicas. */
  const sacarChips = () => {
    const mo = motor.current;
    const esc = escRef.current;
    const ul = chipsRef.current;
    if (!esc || !ul) return;
    const est = M.estiloDeChips(medidasActuales().angosto);
    esc.style.setProperty("--chip-max", `${est.max}px`);
    esc.style.setProperty("--chip-fs", `${est.fs}px`);
    const { x: x0, y: y0 } = mo.origenChips;
    ul.querySelectorAll<HTMLElement>(".chip").forEach((el) => {
      el.style.transform = `translate(${x0 - el.offsetWidth / 2}px,${y0 - el.offsetHeight / 2}px) scale(.4)`;
    });
    void ul.offsetHeight;
  };

  const disponer = () => {
    const mo = motor.current;
    const esc = escRef.current;
    if (!esc) return;
    mo.W = esc.clientWidth;
    medirTecho(); // con las fuentes ya cargadas, la invitación puede cambiar de alto
    const m = medidasActuales();
    esc.style.setProperty("--d", `${m.d}px`);
    esc.toggleAttribute("data-angosto", m.angosto);
    ajustarNombres(m.d);
    if (mo.elegida < 0) {
      esc.style.height = `${m.H}px`;
      if (!M.reescalar(mo.cuerpos, mo.sem, m)) {
        if (m.W >= 200) {
          mo.cuerpos = M.sembrar(areas.length, m, Math.random);
          mo.sem = { W: m.W, H: m.H };
        }
      } else mo.sem = { W: m.W, H: m.H };
      pintar();
      ajustarRed();
      animar();
    } else colocar();
  };

  /** La entrada escalonada (menos de un segundo); terminada, el escalón se quita para que el realce no espere. */
  const entrar = () => {
    const mo = motor.current;
    const esc = escRef.current;
    if (!esc) return;
    window.clearTimeout(mo.tListo);
    esc.removeAttribute("data-visto");
    esc.removeAttribute("data-listo");
    void esc.offsetHeight;
    esc.setAttribute("data-visto", "");
    mo.tListo = window.setTimeout(
      () => esc.setAttribute("data-listo", ""),
      700,
    );
  };

  /** Elegir un área. `desdeOtra`: llega con «← 2 · 4 →» o las flechas, y aparece donde estaba la anterior. */
  const elegir = (i: number, desdeOtra = false) => {
    const mo = motor.current;
    const area = areas[i];
    if (!area) return;
    const foco = document.activeElement;
    mo.enfocarElegida = !!foco?.closest?.(".burbuja");
    mo.origenChips = desdeOtra
      ? { ...mo.centro }
      : { x: mo.cuerpos[i]!.x, y: mo.cuerpos[i]!.y };
    mo.elegida = i;
    mo.sobre = -1;
    if (mo.arr) window.clearTimeout(mo.arr.reloj);
    mo.arr = null;
    for (const b of burbujas.current) {
      b?.removeAttribute("data-sobre");
      b?.removeAttribute("data-agarrada");
    }
    escRef.current?.removeAttribute("data-arrastrando");
    lineasRef.current?.removeAttribute("data-ver");
    window.clearTimeout(mo.tViaja);
    setViaja(desdeOtra ? -1 : i);
    setElegida(i);
    setVistas((v) => (v.includes(area.id) ? v : [...v, area.id]));
    setAnuncio(
      M.rellenar(textos.anuncio, { grupo: area.nombre, n: area.items.length }),
    );
  };

  const cambiar = (paso: number) => {
    const mo = motor.current;
    if (mo.elegida >= 0) elegir(M.vecina(mo.elegida, paso, areas.length), true);
  };

  const volverATodas = (foco = true) => {
    const mo = motor.current;
    const esc = escRef.current;
    if (mo.elegida < 0 || !esc) return;
    const antes = mo.elegida;
    mo.elegida = -1;
    const svg = lineasRef.current;
    svg?.removeAttribute("data-ver");
    if (svg) svg.innerHTML = "";
    // la elegida vuelve flotando desde el centro: su cuerpo arranca ahí
    const m = medidasActuales();
    mo.cuerpos[antes]!.x = m.W / 2;
    mo.cuerpos[antes]!.y = m.H / 2;
    esc.style.height = `${m.H}px`;
    ajustarRed();
    mo.tViaja = window.setTimeout(() => setViaja(-1), 650);
    mo.enfocarVuelta = foco ? antes : -1;
    setElegida(-1);
    setAnuncio("");
    pintar();
    animar();
  };

  /** `ahora`: el `timeStamp` del clic, en el reloj de `performance.now()`. */
  const alClicDeBurbuja = (i: number, ahora: number) => {
    const mo = motor.current;
    if (ahora - mo.soltadaEn < M.GRACIA_SOLTAR_MS) return; // soltar tras arrastrar no elige
    if (i === mo.elegida) volverATodas();
    else elegir(i);
  };

  const acciones = useRef({
    cuadro,
    disponer,
    colocar,
    sacarChips,
    entrar,
    animar,
    marcarSobre,
    pintar,
    elegir,
    volverATodas,
    cambiar,
  });
  // Cada render deja a mano la versión vigente para los manejadores instalados una sola vez.
  useLayoutEffect(() => {
    acciones.current = {
      cuadro,
      disponer,
      colocar,
      sacarChips,
      entrar,
      animar,
      marcarSobre,
      pintar,
      elegir,
      volverATodas,
      cambiar,
    };
  });

  // Montaje: sembrar, disponer y escuchar. Todo lo que se instala aquí se quita al desmontar.
  useEffect(() => {
    const esc = escRef.current;
    if (!esc) return;
    const mo = motor.current;
    const A = () => acciones.current;
    let vivo = true;

    mo.W = esc.clientWidth;
    medirTecho();
    const m0 = M.medidas(mo.W, mo.techoInv, areas.length);
    esc.style.setProperty("--d", `${m0.d}px`);
    mo.cuerpos = M.sembrar(areas.length, m0, Math.random);
    mo.sem = { W: m0.W, H: m0.H };
    A().disponer();

    // entra al verse, rápido, y solo se mueve mientras se ve
    const io = new IntersectionObserver(
      (es) => {
        mo.visible = es.some((x) => x.isIntersecting);
        if (mo.visible) {
          if (!esc.hasAttribute("data-visto")) A().entrar();
          A().animar();
        }
      },
      { threshold: 0.15 },
    );
    io.observe(esc);
    // si el rectángulo cambia de ancho (la ventana, o un panel que se abre angosto y luego crece), se reparte
    let anchoVisto = esc.clientWidth;
    const ro = new ResizeObserver(() => {
      const w = esc.clientWidth;
      if (!mo.activo || !w || Math.abs(w - anchoVisto) < 1) return;
      anchoVisto = w;
      requestAnimationFrame(() => A().disponer());
    });
    ro.observe(esc);

    const punto = (e: PointerEvent): M.Punto => {
      const R = esc.getBoundingClientRect();
      return { x: e.clientX - R.left, y: e.clientY - R.top };
    };
    const burbujaDe = (e: Event) =>
      (e.target as Element | null)?.closest?.<HTMLButtonElement>(".burbuja") ??
      null;

    // el cursor solo detiene la burbuja que tiene encima; el teclado, la que tiene el foco (visible)
    const alSalir = () => {
      mo.puntero = null;
      if (mo.raf === 0 && mo.elegida < 0) A().marcarSobre();
    };
    const alEnfocar = (e: FocusEvent) => {
      const b = burbujaDe(e);
      mo.foco =
        b && mo.elegida < 0 && b.matches(":focus-visible")
          ? Number(b.dataset.i)
          : -1;
    };
    const alDesenfocar = () => {
      mo.foco = -1;
    };
    // Agarrar con clic sostenido, arrastrar y soltar: sale con la velocidad de tu mano. Si no se movió
    // más de 6 px, fue un clic y elige el área. Con el dedo, la burbuja se arma tras 0,3 s quieto: antes,
    // un deslizamiento es de la página y la burbuja no se toca.
    const alApretar = (e: PointerEvent) => {
      const b = burbujaDe(e);
      if (!b || mo.elegida >= 0 || e.button !== 0 || prefiereQuieto()) return;
      const i = Number(b.dataset.i);
      const c = mo.cuerpos[i];
      if (!c) return;
      const p = punto(e);
      const dedo = e.pointerType === "touch";
      const arr: Arrastre = {
        i,
        id: e.pointerId,
        dedo,
        armada: !dedo,
        x0: p.x,
        y0: p.y,
        dx: c.x - p.x,
        dy: c.y - p.y,
        movido: false,
        muestras: [[performance.now(), c.x, c.y]],
        vx: 0,
        vy: 0,
      };
      mo.arr = arr;
      if (dedo)
        arr.reloj = window.setTimeout(() => {
          if (mo.arr === arr && !arr.armada) {
            arr.armada = true;
            burbujas.current[i]?.setAttribute("data-agarrada", "");
          }
        }, M.ESPERA_DEDO_MS);
      else {
        e.preventDefault();
        b.setPointerCapture(e.pointerId);
      }
    };
    // armada, el dedo ya no desplaza la página: arrastra la burbuja
    const alTocarMover = (e: TouchEvent) => {
      if (mo.arr?.armada) e.preventDefault();
    };
    const sinMenu = (e: Event) => {
      if (burbujaDe(e)) e.preventDefault();
    };
    const alMover = (e: PointerEvent) => {
      const p = punto(e);
      mo.puntero = e.pointerType === "touch" ? null : p;
      if (mo.raf === 0 && mo.elegida < 0) A().marcarSobre(); // con movimiento reducido no hay cuadros: crece igual
      const a = mo.arr;
      if (!a || e.pointerId !== a.id) return;
      const corrido = Math.hypot(p.x - a.x0, p.y - a.y0);
      if (!a.armada) {
        if (corrido > M.HOLGURA_DEDO_PX) {
          window.clearTimeout(a.reloj);
          mo.arr = null; // el dedo se fue antes: era la página
        }
        return;
      }
      if (
        !a.movido &&
        corrido < (a.dedo ? M.UMBRAL_CLIC_DEDO_PX : M.UMBRAL_CLIC_PX)
      )
        return; // un clic que tiembla sigue siendo un clic
      if (!a.movido) {
        a.movido = true;
        burbujas.current[a.i]?.removeAttribute("data-sobre");
        burbujas.current[a.i]?.setAttribute("data-agarrada", "");
        esc.setAttribute("data-arrastrando", "");
      }
      const c = mo.cuerpos[a.i]!;
      const m = M.medidas(mo.W, mo.techoInv, areas.length);
      const q = M.dentro(p.x + a.dx, p.y + a.dy, (m.d / 2) * c.k, m);
      c.x = q.x;
      c.y = q.y;
      const v = M.velocidadDeMano(a.muestras, performance.now(), c.x, c.y);
      if (v) {
        a.vx = v.vx;
        a.vy = v.vy;
      }
      if (mo.raf === 0) A().pintar();
    };
    const soltar = (e: PointerEvent) => {
      const a = mo.arr;
      if (!a || e.pointerId !== a.id) return;
      window.clearTimeout(a.reloj);
      const c = mo.cuerpos[a.i]!;
      if (a.dedo && a.armada && !a.movido) {
        mo.soltadaEn = performance.now(); // la sostuvo sin moverla: no elige
        burbujas.current[a.i]?.removeAttribute("data-agarrada");
      }
      if (a.movido) {
        const quieta =
          performance.now() - a.muestras[a.muestras.length - 1]![0] >
          M.MANO_QUIETA_MS;
        M.lanzar(c, a.vx, a.vy, quieta);
        mo.suelta = a.i;
        mo.soltadaEn = performance.now();
        burbujas.current[a.i]?.removeAttribute("data-agarrada");
        esc.removeAttribute("data-arrastrando");
      }
      mo.arr = null;
    };
    // Escape y las flechas ← →, con un área abierta, cuando el foco está en el escenario (o en ningún
    // lado y el escenario se ve): en el resto de la página las flechas son de quien tenga el foco.
    const alTeclear = (e: KeyboardEvent) => {
      if (mo.elegida < 0 || !mo.activo) return;
      const foco = document.activeElement;
      const libre = !foco || foco === document.body;
      if (!esc.contains(foco) && !(libre && mo.visible)) return;
      if (e.key === "Escape") {
        A().volverATodas();
        return;
      }
      const paso = e.key === "ArrowRight" ? 1 : e.key === "ArrowLeft" ? -1 : 0;
      if (paso) {
        e.preventDefault();
        A().cambiar(paso);
      }
    };
    const alVolverAPestana = () => {
      if (!document.hidden) A().animar();
    };
    const mq = window.matchMedia(QUIETO);
    const alCambiarQuieto = () => A().animar();

    esc.addEventListener("pointerleave", alSalir);
    esc.addEventListener("focusin", alEnfocar);
    esc.addEventListener("focusout", alDesenfocar);
    esc.addEventListener("pointerdown", alApretar);
    esc.addEventListener("touchmove", alTocarMover, { passive: false });
    esc.addEventListener("contextmenu", sinMenu);
    esc.addEventListener("pointermove", alMover);
    esc.addEventListener("pointerup", soltar);
    esc.addEventListener("pointercancel", soltar);
    esc.addEventListener("lostpointercapture", soltar);
    document.addEventListener("keydown", alTeclear);
    document.addEventListener("visibilitychange", alVolverAPestana);
    mq.addEventListener("change", alCambiarQuieto);
    void document.fonts?.ready.then(() => {
      if (vivo) A().disponer();
    });

    return () => {
      vivo = false;
      io.disconnect();
      ro.disconnect();
      cancelAnimationFrame(mo.raf);
      mo.raf = 0;
      window.clearTimeout(mo.tListo);
      window.clearTimeout(mo.tViaja);
      if (mo.arr) window.clearTimeout(mo.arr.reloj);
      esc.removeEventListener("pointerleave", alSalir);
      esc.removeEventListener("focusin", alEnfocar);
      esc.removeEventListener("focusout", alDesenfocar);
      esc.removeEventListener("pointerdown", alApretar);
      esc.removeEventListener("touchmove", alTocarMover);
      esc.removeEventListener("contextmenu", sinMenu);
      esc.removeEventListener("pointermove", alMover);
      esc.removeEventListener("pointerup", soltar);
      esc.removeEventListener("pointercancel", soltar);
      esc.removeEventListener("lostpointercapture", soltar);
      document.removeEventListener("keydown", alTeclear);
      document.removeEventListener("visibilitychange", alVolverAPestana);
      mq.removeEventListener("change", alCambiarQuieto);
    };
    // Se instala una sola vez: las áreas de un idioma no cambian sin volver a montar.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // La lista puesta detiene todo; al volver a las áreas, se reparte y entra de nuevo.
  const primeraVez = useRef(true);
  useEffect(() => {
    const mo = motor.current;
    mo.activo = activo;
    if (primeraVez.current) {
      primeraVez.current = false;
      return;
    }
    if (activo) {
      acciones.current.disponer();
      acciones.current.entrar();
    } else {
      cancelAnimationFrame(mo.raf);
      mo.raf = 0;
    }
  }, [activo]);

  // Una cita del chat abre su área.
  useEffect(() => {
    if (!pedido) return;
    const i = areas.findIndex((a) => a.id === pedido.id);
    const mo = motor.current;
    if (i < 0 || i === mo.elegida) return;
    acciones.current.elegir(i, mo.elegida >= 0);
  }, [pedido, areas]);

  // Elegida una: sus herramientas salen de ella (arrancan donde está y viajan a su sitio).
  useLayoutEffect(() => {
    const mo = motor.current;
    if (elegida < 0) {
      if (mo.enfocarVuelta >= 0) {
        burbujas.current[mo.enfocarVuelta]?.focus({ preventScroll: true });
        mo.enfocarVuelta = -1;
      }
      return;
    }
    acciones.current.sacarChips();
    acciones.current.colocar();
    if (mo.enfocarElegida) {
      burbujas.current[elegida]?.focus({ preventScroll: true });
      mo.enfocarElegida = false;
    }
  }, [elegida]);

  // Las vistas: se anotan en la memoria del módulo, y la invitación puede cambiar de alto.
  useLayoutEffect(() => {
    anotarVistas(vistas);
    medirTecho();
  }, [vistas]);

  const n = areas.length;
  const nVistas = areas.filter((a) => vistas.includes(a.id)).length;
  const todas = nVistas === n;
  const ant = elegida >= 0 ? M.vecina(elegida, -1, n) : -1;
  const sig = elegida >= 0 ? M.vecina(elegida, 1, n) : -1;
  const conArea = elegida >= 0;

  return (
    <div
      ref={escRef}
      className="escenario"
      data-elegido={conArea ? "" : undefined}
    >
      <canvas ref={canvasRef} className="red" aria-hidden="true" />
      <p ref={invitaRef} className="invita">
        <span className="invita-txt">
          {todas ? textos.todas : textos.invita}
        </span>
        <span className="progreso" hidden={nVistas === 0 || todas}>
          {M.rellenar(textos.progreso, { n: nVistas, t: n })}
        </span>
        <button
          type="button"
          className="ver-lista"
          hidden={!todas}
          onClick={onVerLista}
        >
          {textos.lista}
        </button>
      </p>
      <svg ref={lineasRef} className="lineas" aria-hidden="true" />
      <button
        type="button"
        className="volver"
        tabIndex={conArea ? 0 : -1}
        onClick={() => volverATodas()}
      >
        {textos.volver}
      </button>
      <nav className="pasos" aria-label={textos.pasos}>
        <button
          type="button"
          tabIndex={conArea ? 0 : -1}
          onClick={() => cambiar(-1)}
        >
          {/* El nombre del botón contiene su texto visible (WCAG 2.5.3): el prefijo es solo para el
              lector de pantalla, y en el celular el nombre del área se oculta a la vista, no a él. */}
          {conArea && (
            <>
              <span className="sr-only">{textos.anterior}: </span>← {ant + 1}
              <span className="nom"> · {areas[ant]!.nombre}</span>
            </>
          )}
        </button>
        <span className="cual">
          {conArea ? M.rellenar(textos.cual, { n: elegida + 1, t: n }) : ""}
        </span>
        <button
          type="button"
          tabIndex={conArea ? 0 : -1}
          onClick={() => cambiar(1)}
        >
          {conArea && (
            <>
              <span className="sr-only">{textos.siguiente}: </span>
              <span className="nom">{areas[sig]!.nombre} · </span>
              {sig + 1} →
            </>
          )}
        </button>
      </nav>
      {areas.map((a, i) => {
        const yaVista = vistas.includes(a.id);
        return (
          <button
            key={a.id}
            ref={(el) => {
              burbujas.current[i] = el;
            }}
            type="button"
            className="burbuja"
            data-i={i}
            data-color={colorDeArea(i)}
            data-centro={elegida === i ? "" : undefined}
            data-viaja={viaja === i ? "" : undefined}
            data-abierta={yaVista ? "" : undefined}
            aria-pressed={elegida === i}
            tabIndex={!conArea || elegida === i ? 0 : -1}
            style={{ "--i": i } as React.CSSProperties}
            onClick={(e) => alClicDeBurbuja(i, e.timeStamp)}
          >
            <span className="disco">
              <span className="num">
                {i + 1}
                <i aria-hidden="true">✓</i>
              </span>
              <DibujoSkill id={a.id} />
              <span className="nombre">{a.nombre}</span>
              <span className="cuantas">
                {M.rellenar(textos.cuantas, { n: a.items.length })}
              </span>
              <span className="sr-only">{yaVista ? textos.yaVista : ""}</span>
            </span>
          </button>
        );
      })}
      <ul
        ref={chipsRef}
        className="chips"
        aria-label={conArea ? areas[elegida]!.nombre : undefined}
      >
        {conArea &&
          areas[elegida]!.items.map((it, j) => (
            <li
              key={`${elegida}-${j}`}
              className="chip"
              style={{ "--j": j } as React.CSSProperties}
            >
              {it.nombre}
              {it.nota && <small>{it.nota}</small>}
              {it.estado && <span className="estado">{it.estado}</span>}
            </li>
          ))}
      </ul>
      <p className="sr-only" aria-live="polite">
        {anuncio}
      </p>
      <div ref={medidorRef} className="medidor" aria-hidden="true" />
    </div>
  );
}
