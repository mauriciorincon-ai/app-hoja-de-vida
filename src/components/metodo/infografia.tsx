import { getTranslations } from "next-intl/server";
import type { ReactNode } from "react";
import { Reveal } from "@/components/motion/reveal";
import { Link } from "@/i18n/navigation";
import type { Locale } from "@/i18n/routing";
import {
  BLOQUES,
  bloqueDe,
  type Nivel,
  type PiezaMetodo,
} from "@/lib/metodo/schema";
import { MapaSvg } from "./mapa-svg";
import { RielDeFases, type FaseVista } from "./riel-de-fases";
import type { IdiomaMetodo, Traductor } from "./traductor";
import { AfirmacionConVoz, Citas, LeyendaDeVoces, RotuloDeVoz } from "./voz";

/**
 * LA PUBLICACIÓN (S10): UN renderizador para las nueve piezas de «Métodos».
 * Pinta, en orden y sin saltarse ninguno, los diez bloques del dato:
 * el problema · el mapa · las fases · las decisiones · lo innovador en 2026 ·
 * los modos de falla · las métricas y controles · la evidencia en proyectos ·
 * los límites y el alcance · las fuentes y la fecha de revisión. (El campo
 * `pregunta` del esquema guarda hoy el planteamiento del problema: conserva su
 * nombre para no tocar medio centenar de puntos.) Nada específico de un tema
 * vive aquí: lo específico es el dato (`data/metodo/<slug>.yaml`).
 *
 * Cada bloque lleva su ancla estable `#bloque-n` (para abrir la pieza
 * donde se quiera, y para la cita del chat) y la hoja de impresión
 * mantiene cada tarjeta entera: la pieza cabe en PDF desde el navegador, con el
 * mapa legible.
 *
 * Movimiento: `Reveal` solo en el encabezado de cada bloque — un elemento
 * pequeño que SÍ cruza el umbral del observador. Envolver el bloque entero
 * habría dejado oculto uno más alto que la ventana (el umbral es una fracción
 * del elemento). La forma del árbol no depende de `useReducedMotion()`.
 *
 * `InfografiaVista` es síncrona y recibe el traductor: se prueba con la
 * traducción real. `Infografia` es el envoltorio asíncrono de la página.
 */

const TARJETA =
  "rounded-[14px] border border-paper-2 bg-paper-0 p-5 shadow-sh-1 print:break-inside-avoid print:shadow-none";
const ROTULO = "font-mono text-[11px] tracking-[0.08em] text-ink-2 uppercase";
const CUERPO = "text-[15px] leading-relaxed text-ink-1";

const NIVEL_ESTILO: Record<Nivel, string> = {
  "uso-real": "bg-sage text-sage-ink",
  prototipo: "bg-lilac text-lilac-ink",
  "en-estudio": "bg-sky text-sky-ink",
  exploracion: "bg-citron text-citron-ink",
};

/** «17 de octubre de 2026» / «October 17, 2026», sin depender de la zona horaria. */
export function fechaLarga(iso: string, idioma: IdiomaMetodo): string {
  return new Date(`${iso}T00:00:00Z`).toLocaleDateString(
    idioma === "es" ? "es-CO" : "en-US",
    { year: "numeric", month: "long", day: "numeric", timeZone: "UTC" },
  );
}

function Bloque({
  n,
  t,
  children,
}: {
  n: number;
  t: Traductor;
  children: ReactNode;
}) {
  return (
    <section
      id={`bloque-${n}`}
      aria-labelledby={`bloque-${n}-titulo`}
      data-bloque={n}
      className="scroll-mt-24 border-t border-paper-2 pt-10 print:pt-6"
    >
      <Reveal variant="fadeInUp" amount={0.5}>
        <header className="mb-6 flex flex-col gap-2">
          <span className={`${ROTULO} tabular-nums`}>{t("bloque", { n })}</span>
          <h2
            id={`bloque-${n}-titulo`}
            className="font-display text-[clamp(1.5rem,3vw,2rem)] leading-[1.15] font-medium tracking-[-0.01em] text-ink-0 [text-wrap:balance]"
          >
            {t(`bloques.${n}`)}
          </h2>
        </header>
      </Reveal>
      {children}
    </section>
  );
}

export function InfografiaVista({
  pieza,
  idioma,
  t,
}: {
  pieza: PiezaMetodo;
  idioma: IdiomaMetodo;
  t: Traductor;
}) {
  const b1 = bloqueDe(pieza, 1);
  const b2 = bloqueDe(pieza, 2);
  const b3 = bloqueDe(pieza, 3);
  const b4 = bloqueDe(pieza, 4);
  const b5 = bloqueDe(pieza, 5);
  const b6 = bloqueDe(pieza, 6);
  const b7 = bloqueDe(pieza, 7);
  const b8 = bloqueDe(pieza, 8);
  const b9 = bloqueDe(pieza, 9);
  const b10 = bloqueDe(pieza, 10);

  const fases: FaseVista[] = b3.fases.map((f) => ({
    nombre: f.nombre[idioma],
    entradas: f.entradas.map((x) => x[idioma]),
    actividades: f.actividades.map((x) => x[idioma]),
    artefactos: f.artefactos.map((x) => x[idioma]),
    decide: f.decide[idioma],
    control: f.control[idioma],
    nota: f.nota ? (
      <AfirmacionConVoz a={f.nota} idioma={idioma} t={t} />
    ) : undefined,
  }));

  return (
    <article
      data-metodo={pieza.slug}
      data-tema={pieza.id}
      className="flex flex-col gap-10"
    >
      <header className="flex flex-col gap-3">
        <p className={ROTULO}>
          {t("eyebrow")} · {t("tema", { id: pieza.id })}
        </p>
        <h1 className="max-w-[24ch] font-display text-[clamp(2rem,5vw,3.25rem)] leading-[1.05] font-medium tracking-[-0.02em] text-ink-0 [text-wrap:balance]">
          {pieza.nombre[idioma]}
        </h1>
        <p className="text-[15px] text-ink-2">
          <time dateTime={b10.revisado}>
            {t("revisado", { fecha: fechaLarga(b10.revisado, idioma) })}
          </time>
        </p>
        <p className="text-[13px] text-ink-2 print:hidden">
          {t("imprimirAyuda")}
        </p>
      </header>

      <LeyendaDeVoces t={t} />

      <nav aria-label={t("indiceEtiqueta")} className="print:hidden">
        <ol className="flex flex-wrap gap-2">
          {BLOQUES.map((b) => (
            <li key={b.n}>
              <a
                href={`#bloque-${b.n}`}
                className="flex min-h-11 items-center gap-2 rounded-full border border-paper-3 bg-paper-0 px-3.5 text-[13px] text-ink-1 transition-colors duration-[120ms] hover:bg-paper-2"
              >
                <span className="font-mono text-[11px] text-ink-2 tabular-nums">
                  {b.n}
                </span>
                {t(`bloques.${b.n}`)}
              </a>
            </li>
          ))}
        </ol>
      </nav>

      {/* 1 · La pregunta */}
      <Bloque n={1} t={t}>
        <p className="max-w-[40ch] font-display text-[clamp(1.35rem,3vw,1.9rem)] leading-snug font-medium text-ink-0 [text-wrap:balance]">
          {b1.pregunta[idioma]}
        </p>
        <h3 className={`${ROTULO} mt-6`}>{t("respuestaEnTres")}</h3>
        <ol className="mt-3 flex max-w-[62ch] flex-col gap-3">
          {b1.respuesta.map((r, i) => (
            <li key={i} className={`flex gap-3 ${CUERPO}`}>
              <span
                aria-hidden="true"
                className="mt-0.5 font-mono text-[13px] text-lilac-ink tabular-nums"
              >
                {i + 1}
              </span>
              {r[idioma]}
            </li>
          ))}
        </ol>
      </Bloque>

      {/* 2 · El mapa */}
      <Bloque n={2} t={t}>
        <h3 className="mb-4 font-display text-[1.15rem] font-medium text-ink-0">
          {b2.titulo[idioma]}
        </h3>
        <MapaSvg bloque={b2} idioma={idioma} t={t} />
      </Bloque>

      {/* 3 · Las fases */}
      <Bloque n={3} t={t}>
        <RielDeFases
          fases={fases}
          etiquetas={{
            fase: t("fases.fase", { n: "{n}" }),
            avance: t("fases.avance"),
            entradas: t("fases.entradas"),
            actividades: t("fases.actividades"),
            artefactos: t("fases.artefactos"),
            decide: t("fases.decide"),
            control: t("fases.control"),
          }}
        />
      </Bloque>

      {/* 4 · Las decisiones de diseño */}
      <Bloque n={4} t={t}>
        <ol className="flex flex-col gap-5">
          {b4.decisiones.map((d, i) => (
            <li key={i}>
              <article data-decision={i + 1} className={TARJETA}>
                <h3 className="font-display text-[1.2rem] leading-snug font-medium text-ink-0">
                  {d.titulo[idioma]}
                </h3>
                <dl className="mt-4 grid gap-4 md:grid-cols-2">
                  <div>
                    <dt className={ROTULO}>{t("decisiones.cuandoSi")}</dt>
                    <dd className={`mt-1 ${CUERPO}`}>{d.cuandoSi[idioma]}</dd>
                  </div>
                  <div>
                    <dt className={ROTULO}>{t("decisiones.cuandoNo")}</dt>
                    <dd className={`mt-1 ${CUERPO}`}>{d.cuandoNo[idioma]}</dd>
                  </div>
                </dl>
                <div className="mt-4 flex flex-col gap-3">
                  <h4 className={ROTULO}>{t("decisiones.porQue")}</h4>
                  <AfirmacionConVoz a={d.porQue} idioma={idioma} t={t} />
                  {d.nota && (
                    <AfirmacionConVoz a={d.nota} idioma={idioma} t={t} />
                  )}
                </div>
              </article>
            </li>
          ))}
        </ol>
      </Bloque>

      {/* 5 · Lo innovador en 2026 */}
      <Bloque n={5} t={t}>
        <ul className="flex flex-col gap-5">
          {b5.elementos.map((e, i) => (
            <li key={i}>
              <article data-innovador={i + 1} className={TARJETA}>
                <RotuloDeVoz voz="campo" t={t} />
                <h3 className="mt-3 font-display text-[1.2rem] leading-snug font-medium text-ink-0">
                  {e.titulo[idioma]}
                </h3>
                <p className={`${ROTULO} mt-4`}>{t("innovador.queCambia")}</p>
                <p className={`mt-1 ${CUERPO}`}>
                  {e.queCambia[idioma]}
                  <Citas ids={e.fuentes} t={t} />
                </p>
                {e.nota && (
                  <div className="mt-4">
                    <AfirmacionConVoz a={e.nota} idioma={idioma} t={t} />
                  </div>
                )}
              </article>
            </li>
          ))}
        </ul>
      </Bloque>

      {/* 6 · Modos de falla y cómo se ven venir */}
      <Bloque n={6} t={t}>
        <ul className="flex flex-col gap-5">
          {b6.fallas.map((f, i) => (
            <li key={i}>
              <article data-falla={i + 1} className={TARJETA}>
                <dl className="grid gap-4 md:grid-cols-3">
                  <div>
                    <dt className={ROTULO}>{t("fallas.falla")}</dt>
                    <dd className={`mt-1 font-medium text-ink-0 ${CUERPO}`}>
                      {f.falla[idioma]}
                    </dd>
                  </div>
                  <div>
                    <dt className={ROTULO}>{t("fallas.senal")}</dt>
                    <dd className={`mt-1 ${CUERPO}`}>{f.senal[idioma]}</dd>
                  </div>
                  <div>
                    <dt className={ROTULO}>{t("fallas.control")}</dt>
                    <dd className={`mt-1 ${CUERPO}`}>{f.control[idioma]}</dd>
                  </div>
                </dl>
              </article>
            </li>
          ))}
        </ul>
      </Bloque>

      {/* 7 · Métricas y controles */}
      <Bloque n={7} t={t}>
        <ul className="flex flex-col gap-5">
          {b7.metricas.map((m, i) => (
            <li key={i}>
              <article data-metrica={i + 1} className={TARJETA}>
                <dl className="grid gap-4 md:grid-cols-3">
                  <div>
                    <dt className={ROTULO}>{t("metricas.metrica")}</dt>
                    <dd className={`mt-1 font-medium text-ink-0 ${CUERPO}`}>
                      {m.metrica[idioma]}
                    </dd>
                  </div>
                  <div>
                    <dt className={ROTULO}>{t("metricas.umbral")}</dt>
                    <dd className={`mt-1 font-mono text-[14px] text-ink-1`}>
                      {m.umbral[idioma]}
                    </dd>
                  </div>
                  <div>
                    <dt className={ROTULO}>{t("metricas.aprueba")}</dt>
                    <dd className={`mt-1 ${CUERPO}`}>{m.aprueba[idioma]}</dd>
                  </div>
                </dl>
              </article>
            </li>
          ))}
        </ul>
        <p className="mt-4 text-[13px] leading-snug text-ink-2">
          {t("metricas.nota")}
        </p>
      </Bloque>

      {/* 8 · Evidencia en proyectos */}
      <Bloque n={8} t={t}>
        <ul className="grid gap-5 md:grid-cols-2">
          {b8.evidencia.map((e, i) => (
            <li key={i}>
              <article
                data-evidencia={i + 1}
                data-corpus={e.corpus.join(" ")}
                className={`${TARJETA} h-full`}
              >
                <div className="flex flex-wrap items-center gap-2">
                  <RotuloDeVoz voz="hice" t={t} />
                  <span
                    data-nivel={e.nivel}
                    className={`rounded-full px-2.5 py-1 font-mono text-[11px] tracking-[0.02em] uppercase ${NIVEL_ESTILO[e.nivel]}`}
                  >
                    <span className="sr-only">{t("evidencia.nivel")}: </span>
                    {t(`niveles.${e.nivel}`)}
                  </span>
                </div>
                <h3 className="mt-3 font-display text-[1.15rem] leading-snug font-medium text-ink-0">
                  {e.nombre[idioma]}
                </h3>
                <p className={`mt-2 ${CUERPO}`}>{e.texto[idioma]}</p>
                {e.href && (
                  <Link
                    href={e.href}
                    className="mt-3 inline-flex min-h-11 items-center gap-1.5 text-sm font-medium text-sage-ink transition-colors duration-[120ms] hover:text-ink-0"
                  >
                    {t("evidencia.ver")}
                    <span aria-hidden="true">→</span>
                  </Link>
                )}
              </article>
            </li>
          ))}
        </ul>
      </Bloque>

      {/* 9 · Límites y alcance */}
      <Bloque n={9} t={t}>
        <ul className="flex flex-col gap-4">
          {b9.limites.map((l, i) => (
            <li key={i} data-limite={i + 1}>
              <AfirmacionConVoz a={l} idioma={idioma} t={t} />
            </li>
          ))}
        </ul>
      </Bloque>

      {/* 10 · Fuentes y fecha de revisión */}
      <Bloque n={10} t={t}>
        <p className={`mb-4 ${CUERPO}`}>
          <time dateTime={b10.revisado}>
            {t("revisado", { fecha: fechaLarga(b10.revisado, idioma) })}
          </time>
        </p>
        <ol className="flex flex-col gap-4">
          {b10.fuentes.map((f) => (
            <li
              key={f.id}
              id={`fuente-${f.id}`}
              data-fuente={f.id}
              className="scroll-mt-24 flex gap-3 print:break-inside-avoid"
            >
              <span className="mt-0.5 min-w-[4ch] shrink-0 font-mono text-[13px] text-sky-ink tabular-nums">
                [{f.id}]
              </span>
              <div className="flex flex-col gap-1">
                <a
                  href={f.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-[15px] font-medium text-ink-0 underline decoration-paper-3 underline-offset-4 hover:decoration-ink-1"
                >
                  {f.titulo}
                </a>
                <p className="text-[13px] text-ink-2">
                  {f.editor} ·{" "}
                  <time dateTime={f.fecha}>{fechaLarga(f.fecha, idioma)}</time>
                </p>
                <p className="font-mono text-[12px] break-all text-ink-2">
                  {f.url}
                </p>
              </div>
            </li>
          ))}
        </ol>
      </Bloque>
    </article>
  );
}

export async function Infografia({
  pieza,
  locale,
}: {
  pieza: PiezaMetodo;
  locale: Locale;
}) {
  const t = await getTranslations("metodo");
  return <InfografiaVista pieza={pieza} idioma={locale} t={t as Traductor} />;
}
