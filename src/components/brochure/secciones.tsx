import type { CSSProperties } from "react";
import { ListaDeEsperaForm } from "@/components/forms/lista-de-espera-form";
import { PropuestaForm } from "@/components/forms/propuesta-form";
import { RoadmapVoting } from "@/components/home/roadmap-voting";
import type { TextosDeUsala } from "@/lib/brochure/usala-textos";
import type {
  Afirmacion,
  Capitulo,
  FlujoVista,
  Seccion,
  Textos,
  VistaBrochure,
} from "@/lib/brochure/modelo";
import { FlujoDibujo } from "./flujo-dibujo";
import {
  Previa as PreviaCliente,
  Recorrido as RecorridoCliente,
} from "./recorrido";
import { SVG } from "./iconos";
import {
  Cabeza,
  Captura,
  ChipFuente,
  CitaBoton,
  Icono,
  Svg,
  Valor,
} from "./piezas";

/**
 * LAS SECCIONES DEL BROCHURE (S28), de la portada al cierre: el HTML de la maqueta aprobada
 * (`htmlPortada`, `htmlAntes`, `htmlMapa`, `htmlCapitulo`, `htmlProceso`, `htmlMetodo`, `htmlCierre`),
 * escrito por el servidor con los mismos nombres de clase para que la hoja sea la de la maqueta.
 *
 * Cambios de estructura, todos por accesibilidad o por la regla de la isla (solo atributos):
 *  - los capítulos son `<details>`: se abren sin JavaScript, Ctrl+F los abre y axe los recorre;
 *  - la ficha no anida botones: un botón de volteo cubre la ficha y la cita va encima;
 *  - lo que la maqueta reescribía (el pie de la pantalla de la portada, el detalle de una cifra, el
 *    rótulo del índice) ya viene escrito y se alterna con `hidden`; las diapositivas del Recorrido y
 *    los textos de la vista previa los pinta el cliente la primera vez que se abren (`recorrido.tsx`).
 */

/** El ancho del marco de un flujo en escritorio (1440 px): el primer dibujo que escribe el servidor. */
const ANCHO_CAPITULO = 1086;
const ANCHO_PROCESO = 1382;

type P = { v: VistaBrochure; t: Textos };
const st = (o: Record<string, string | number>) => o as CSSProperties;

/* ── la barra ─────────────────────────────────────────────────────────────────────────── */
export function Barra({ v, t, buscador }: P & { buscador: React.ReactNode }) {
  return (
    <nav className="barra" data-b-oscura="" aria-label={v.nombre}>
      {/* Sin aria-label: su nombre sale del texto visible (`<i>` es decorativo) y así axe no ve una
          etiqueta que no contiene lo que se lee (label-content-name-mismatch). */}
      <button type="button" className="marca" data-ir-sec="top">
        <i aria-hidden="true">{v.inicial}</i>
        <span>{v.nombre}</span>
      </button>
      <div className="indice">
        <button
          type="button"
          aria-expanded="false"
          aria-controls="indice-lista"
          id="indice-boton"
        >
          <b data-b-indice="top">00</b>
          <span data-b-indice="top">{t("indice")}</span>
          {v.secciones.map((s) => [
            <b key={`n-${s.id}`} data-b-indice={s.id} hidden>
              {s.n}
            </b>,
            <span key={`t-${s.id}`} data-b-indice={s.id} hidden>
              {s.corto}
            </span>,
          ])}
          <span
            className="b-svg"
            aria-hidden="true"
            dangerouslySetInnerHTML={{
              __html: SVG.abajo.replace(
                "<svg",
                '<svg style="width:14px;height:14px;flex:none"',
              ),
            }}
          />
        </button>
        <ol id="indice-lista" hidden>
          {v.secciones.map((s) => (
            <li key={s.id} className={s.sub ? "sub" : undefined}>
              <button type="button" data-ir-sec={s.id} data-n={s.n}>
                <b>{s.n}</b>
                <span>{s.corto}</span>
              </button>
            </li>
          ))}
        </ol>
      </div>
      <div className="barra-der">
        {buscador}
        <button
          type="button"
          className="icono-boton"
          data-recorrido=""
          aria-label={t("recorrido")}
        >
          <span
            className="b-svg"
            aria-hidden="true"
            dangerouslySetInnerHTML={{
              __html: SVG.play.replace(
                "<svg",
                '<svg style="width:14px;height:14px"',
              ),
            }}
          />
          <span>{t("recorrido")}</span>
        </button>
      </div>
    </nav>
  );
}

/* ── 00 · la portada ──────────────────────────────────────────────────────────────────── */
export function Portada({ v, t }: P) {
  const P = v.portada;
  const top = v.secciones.filter((s) => !s.sub);
  return (
    <>
      <header className="portada" id="s-top" data-sec="top">
        <div className="envoltura portada-rejilla">
          <div>
            <div className="eyebrow entra" data-motion="">
              <span className="nombre">
                <i aria-hidden="true">{v.inicial}</i>
                {v.nombre}
              </span>
              {P.chips.map((c) => (
                <span key={c} className="chip-o">
                  {c}
                </span>
              ))}
            </div>
            <h1 className="entra" data-motion="" style={st({ "--d": ".08s" })}>
              {P.titular.antes}
              {P.titular.resalta ? <mark>{P.titular.resalta}</mark> : null}
              {P.titular.despues}
            </h1>
            <p
              className="lead entra"
              data-motion=""
              style={st({ "--d": ".16s" })}
            >
              {P.intro}
            </p>
            {v.textoEnEs ? (
              <p
                className="aviso-idioma entra"
                data-motion=""
                style={st({ "--d": ".2s" })}
              >
                {t("soloEs")}
              </p>
            ) : null}
            <div
              className="acciones entra"
              data-motion=""
              style={st({ "--d": ".26s" })}
            >
              <button type="button" className="boton" data-recorrido="">
                <Svg nombre="play" />
                {t("recorrido")}
              </button>
              <button type="button" className="boton linea" data-imprimir="">
                <Svg nombre="pdf" />
                {t("pdf")}
              </button>
            </div>
            <nav
              className="menu-portada entra"
              data-motion=""
              style={st({ "--d": ".32s" })}
              aria-label={t("secciones")}
            >
              {top.map((s) => (
                <button
                  key={s.id}
                  type="button"
                  className="chip-menu"
                  data-ir-sec={s.id}
                >
                  <b>{s.n}</b>
                  {s.corto}
                </button>
              ))}
            </nav>
          </div>
          <div
            className="escena entra"
            data-motion=""
            style={st({ "--d": ".2s" })}
          >
            {P.tras.map((p, i) => (
              <div
                key={p.id}
                className={`tras tras-${i + 1}`}
                aria-hidden="true"
              >
                <Captura src={p.src} extra={{ "data-b-luego": "" }} />
              </div>
            ))}
            <div className="dispositivo">
              <div className="dispositivo-barra" aria-hidden="true">
                <i />
                <i />
                <i />
                <span id="hero-rotulo">
                  {P.hero.map((p, i) => (
                    <span key={p.id} data-b-hero={i} hidden={i > 0}>
                      {p.rotuloGrupo}
                    </span>
                  ))}
                </span>
              </div>
              <button
                type="button"
                className="pantalla"
                id="hero-pantalla"
                data-recorrido={P.hero[0]?.id ?? ""}
                aria-label={t("verEnRecorrido")}
                data-pista={`⤢ ${t("verEnRecorrido")}`}
                style={{
                  display: "block",
                  width: "100%",
                  border: 0,
                  padding: 0,
                  cursor: "zoom-in",
                }}
              >
                {P.hero.map((p, i) => (
                  <Captura
                    key={p.id}
                    src={p.src}
                    alt={p.pie}
                    extra={{
                      "data-id": p.id,
                      ...(i === 0
                        ? { "data-b-activa": "" }
                        : { "data-b-luego": "" }),
                    }}
                  />
                ))}
              </button>
            </div>
            {P.insignias.map((x, i) => (
              <div key={x.texto} className={`insignia ins-${i}`}>
                <b aria-hidden="true">{x.simbolo}</b>
                {x.texto}
              </div>
            ))}
            <div
              className="puntos"
              role="group"
              aria-label={t("pantallasRotulo")}
            >
              <button
                type="button"
                className="hero-flecha"
                data-hero-paso="-1"
                aria-label={t("ant")}
              >
                <Svg nombre="izq" />
              </button>
              {P.hero.map((p, i) => (
                <button
                  key={p.id}
                  type="button"
                  className="punto"
                  data-hero={i}
                  aria-label={p.nombre}
                  aria-current={i === 0 ? "true" : "false"}
                />
              ))}
              <button
                type="button"
                className="hero-flecha"
                data-hero-paso="1"
                aria-label={t("sig")}
              >
                <Svg nombre="der" />
              </button>
            </div>
            <p className="pie-pantalla" id="hero-pie" aria-live="polite">
              {P.hero.map((p, i) => (
                <span key={p.id} data-b-hero={i} hidden={i > 0}>
                  {p.pie}
                </span>
              ))}
            </p>
          </div>
        </div>
        <div className="envoltura banda-cifras">
          <div
            className="cifras-p entra"
            data-motion=""
            style={st({ "--d": ".36s" })}
          >
            {P.cifras.map((m) => (
              <button
                key={m.clave}
                type="button"
                className="cifra-p"
                data-cifra={m.clave}
                aria-expanded="false"
                aria-controls="cifra-detalle"
              >
                <b>
                  <Valor cifra={m} />
                </b>
                <span>{m.etiqueta}</span>
                <ChipFuente fuente={m.fuente} t={t} />
              </button>
            ))}
          </div>
          <p className="cifra-detalle" id="cifra-detalle" aria-live="polite">
            {P.cifras.map((m) => (
              <span key={m.clave} data-cifra-detalle={m.clave} hidden>
                {m.etiqueta}: {m.explica}
              </span>
            ))}
          </p>
        </div>
        <div className="cinta">
          <div className="envoltura cinta-rotulo">
            <span>{P.rotuloCinta}</span>
            <div>
              <button
                type="button"
                className="pausa"
                data-b-pausa=""
                aria-pressed="false"
              >
                <span data-b-pausa-texto="mueve">
                  <Svg nombre="pausa" />
                  {t("pausar")}
                </span>
                <span data-b-pausa-texto="quieto" hidden>
                  <Svg nombre="play" />
                  {t("reanudar")}
                </span>
              </button>
              <button type="button" data-recorrido="">
                {t("verTodas")}
              </button>
            </div>
          </div>
          <div className="cinta-mueve">
            <div className="cinta-pista">
              {[...v.pantallas, ...v.pantallas].map((p, i) => {
                const copia = i >= v.pantallas.length;
                return (
                  <button
                    key={`${p.id}-${i}`}
                    type="button"
                    className="cinta-item"
                    data-recorrido={p.id}
                    data-previa={p.id}
                    {...(copia
                      ? { tabIndex: -1, "aria-hidden": true }
                      : { "aria-label": p.nombre })}
                  >
                    <Captura src={p.src} />
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      </header>
      <div className="envoltura">
        <div className="uso">
          {[1, 2, 3, 4].map((k) => (
            <div key={k}>
              <span className="n" aria-hidden="true">
                {k}
              </span>
              <span>
                <b>{t(`uso${k}T`)}</b>
                {t(`uso${k}`)}
              </span>
            </div>
          ))}
        </div>
      </div>
    </>
  );
}

/* ── 01 · lo que cambia ───────────────────────────────────────────────────────────────── */
export function Antes({ v, t, s }: P & { s: Seccion }) {
  const A = v.antes;
  return (
    <section className="sec" id="s-antes" data-sec="antes">
      <div className="envoltura">
        <Cabeza s={s} titulo={A.titulo} />
        {A.prueba ? (
          <div className="prueba aparece" data-motion="">
            <div>
              <small>{A.rotuloAntes}</small>
              <span className="antes-n">{A.prueba.antes}</span>
            </div>
            <Svg nombre="flecha" />
            <div>
              <small>{A.rotuloDespues}</small>
              <span className="despues-n">{A.prueba.despues}</span>
            </div>
            <p className="prueba-texto">
              <span>{A.prueba.texto}</span>
              <ChipFuente fuente={A.prueba.fuente} t={t} />
              <CitaBoton cita={A.prueba.cita} />
            </p>
            {A.prueba.detalle ? (
              <p className="prueba-detalle">{A.prueba.detalle}</p>
            ) : null}
          </div>
        ) : null}
        {A.pares.length ? (
          <>
            <div className="pares-cabeza" aria-hidden="true">
              <span>{A.rotuloAntes}</span>
              <span />
              <span>{A.rotuloDespues}</span>
            </div>
            <ol className="pares">
              {A.pares.map((x, i) => (
                <li
                  key={x.antes}
                  className="par aparece"
                  data-motion=""
                  style={st({ "--d": `${i * 90}ms`, "--i": i })}
                >
                  <div className="a">
                    <span className="marca-no" aria-hidden="true">
                      ✕
                    </span>
                    <span>
                      <span className="sr">{A.rotuloAntes}: </span>
                      {x.antes}
                    </span>
                  </div>
                  <span className="par-flecha" aria-hidden="true">
                    →
                  </span>
                  <div className="d">
                    <span className="marca-si" aria-hidden="true">
                      ✓
                    </span>
                    <span>
                      <span className="sr">{A.rotuloDespues}: </span>
                      {x.despues}
                    </span>
                    {x.mini ? (
                      <button
                        type="button"
                        className="mini"
                        data-recorrido={x.mini.id}
                        data-previa={x.mini.id}
                        aria-label={`${t("verGrande")}: ${x.mini.nombre}`}
                      >
                        <Captura src={x.mini.src} />
                      </button>
                    ) : null}
                  </div>
                </li>
              ))}
            </ol>
          </>
        ) : null}
        {A.servicios ? (
          <div className="servicios aparece" data-motion="" id="servicios">
            <div className="servicios-txt">
              <h3>{A.servicios.titulo}</h3>
              <p>{A.servicios.texto}</p>
              <ChipFuente fuente={A.servicios.fuente} t={t} />
            </div>
            <div className="servicios-menu">
              <small>{A.servicios.nota}</small>
              <ul>
                {A.servicios.items.map((it, i) => (
                  <li
                    key={it.titulo}
                    className="servicio"
                    style={st({ "--i": i })}
                  >
                    <span className="marca-si" aria-hidden="true">
                      ✓
                    </span>
                    <span>
                      <b>{it.titulo}</b>
                      <span>{it.texto}</span>
                      <CitaBoton cita={it.cita} />
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        ) : null}
        <div className="promesa aparece" data-motion="" id="promesa">
          <h3>{A.paraQuienTitulo}</h3>
          <div className="promesa-col">
            <div>
              <small>{t("paraQuien")}</small>
              <p>{A.paraQuien}</p>
            </div>
            <div>
              <small>{t("diferencial")}</small>
              <p>{A.diferencial}</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ── 02 · el mapa y sus capítulos ─────────────────────────────────────────────────────── */
function Loseta({
  l,
  t,
}: {
  l: VistaBrochure["mapa"]["capas"][number]["losetas"][number];
  t: Textos;
}) {
  return (
    <button
      type="button"
      className="loseta"
      id={`t-g${l.orden}`}
      data-abre={l.orden}
    >
      <span className="loseta-img">
        {l.imagen ? <Captura src={l.imagen} modo="lazy" /> : null}
      </span>
      <span className="loseta-txt">
        <span className="ico-c">
          <Icono nombre={l.icono} />
        </span>
        <span>
          <span className="loseta-n">
            {l.n}
            {l.estrella ? (
              <span className="loseta-estrella">★ {t("estrella")}</span>
            ) : null}
          </span>
          <b>{l.nombre}</b>
          <span className="resumen">{l.linea}</span>
        </span>
      </span>
      <span className="loseta-pie">
        <span>{t("nFuncionalidades", { n: l.nFuncionalidades })}</span>
        <span>{t("nPantallas", { n: l.nPantallas })}</span>
      </span>
    </button>
  );
}

function Leyenda({ f, t }: { f: FlujoVista; t: Textos }) {
  const tipos = [
    ["inicio", "nodoInicio"],
    ["tarea", "nodoTarea"],
    ["decision", "nodoDecision"],
    ["paralelo", "nodoParalelo"],
    ["fin", "nodoFin"],
  ] as const;
  return (
    <div className="leyenda" aria-hidden="true">
      {tipos.map(([tipo, clave]) => (
        <span key={tipo}>
          <i className={`lg t-${tipo}`} />
          {t(clave)}
        </span>
      ))}
      {f.actores.map((a) => (
        <span
          key={a.clase}
          className={`nodo-actor ${a.clase}`}
          style={{ fontSize: 11 }}
        >
          <i />
          {a.nombre}
        </span>
      ))}
      <span>
        <span
          className="b-svg"
          dangerouslySetInnerHTML={{
            __html: SVG.pant.replace(
              "<svg",
              '<svg style="width:15px;height:15px"',
            ),
          }}
        />
        {t("conPantalla")}
      </span>
    </div>
  );
}

function ListaCuando({
  items,
  clase,
  titulo,
  marca,
  c,
}: {
  items: Afirmacion[];
  clase: "si" | "no";
  titulo: string;
  marca: React.ReactNode;
  c: Capitulo;
}) {
  if (!items.length) return null;
  return (
    <div className={clase}>
      <h4>{titulo}</h4>
      <ul>
        {items.map((x) => (
          <li
            key={x.texto}
            data-b-buscar={clase === "si" ? "s" : "x"}
            data-b-n={c.n}
            data-b-titulo={x.texto}
            data-b-ir-sec={c.id}
          >
            {marca}
            <span>
              {x.texto} <CitaBoton cita={x.cita} />
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
}

function CapituloVista({ c, t }: { c: Capitulo; t: Textos }) {
  return (
    <details
      className="capitulo"
      id={`s-${c.id}`}
      data-sec={c.id}
      data-orden={c.orden}
    >
      <summary className="cap-cabeza">
        <span className="cap-num" aria-hidden="true">
          {c.n}
        </span>
        <span className="cap-ico">
          <Icono nombre={c.icono} />
        </span>
        <h3 className="cap-titulo">
          <b>
            <span className="sr">{c.n} · </span>
            {c.nombre}
            {c.estrella ? (
              <span className="estrella">★ {t("estrella")}</span>
            ) : null}
          </b>
          <small>
            {c.linea} · {t("nFuncionalidades", { n: c.nFuncionalidades })}
          </small>
        </h3>
        <span className="cap-miniaturas" aria-hidden="true">
          {c.miniaturas.map((src) => (
            <Captura key={src} src={src} modo="lazy" />
          ))}
        </span>
        <span className="cap-abre" aria-hidden="true">
          <span className="txt-abrir">{t("abrir")}</span>
          <span className="txt-cerrar">{t("cerrar")}</span>
          <Svg nombre="abajo" />
        </span>
      </summary>
      <div className="cap-cuerpo" id={`b-${c.id}`}>
        <div className="cap-intro">
          <div>
            <h4>{t("queResuelve")}</h4>
            <p className="resuelve">{c.queResuelve}</p>
          </div>
          <div className="cuando">
            <ListaCuando
              items={c.teSirve}
              clase="si"
              titulo={t("teSirve")}
              c={c}
              marca={
                <span className="marca-si" aria-hidden="true">
                  ✓
                </span>
              }
            />
            <ListaCuando
              items={c.noEs}
              clase="no"
              titulo={t("noEs")}
              c={c}
              marca={
                <span className="marca-no" aria-hidden="true">
                  ✕
                </span>
              }
            />
          </div>
        </div>
        {c.flujo ? (
          <div className="cap-flujo">
            <h4>
              {t("asi")} · <em>{c.flujo.titulo}</em>
            </h4>
            <Leyenda f={c.flujo} t={t} />
            <FlujoDibujo
              vista={c.flujo}
              ancho={ANCHO_CAPITULO}
              n={c.n}
              buscable
              verEnRecorrido={t("verEnRecorrido")}
            />
          </div>
        ) : null}
        <div className="cap-piezas">
          <h4>
            {t("piezas")} <span className="cuenta">{c.piezas.length}</span>
          </h4>
          <div className="piezas">
            {c.piezas.map((p) => (
              <article
                key={p.id}
                className={p.captura ? "pieza" : "pieza sin"}
                id={`p-${p.id}`}
                data-b-buscar="f"
                data-b-n={c.n}
                data-b-titulo={p.nombre}
                data-b-ir-sec={c.id}
                data-b-ir-el={`p-${p.id}`}
              >
                {p.captura ? (
                  <button
                    type="button"
                    className="pieza-img"
                    data-recorrido={p.id}
                    aria-label={`${t("verGrande")}: ${p.nombre}`}
                  >
                    <Captura
                      src={p.captura.src}
                      alt={p.captura.pie}
                      modo="lazy"
                    />
                    <span className="ampliar" aria-hidden="true">
                      ⤢ {t("verGrande")}
                    </span>
                  </button>
                ) : (
                  <span className="sin-marca">
                    <span
                      className="b-svg"
                      aria-hidden="true"
                      dangerouslySetInnerHTML={{
                        __html: SVG.pant.replace(
                          "<svg",
                          '<svg style="width:15px;height:15px"',
                        ),
                      }}
                    />
                    {t("sinPantalla")}
                  </span>
                )}
                <div className="pieza-txt">
                  <span className="pid">{p.id}</span>
                  <b>{p.nombre}</b>
                  <p>{p.queHace}</p>
                  <span className="pieza-pie">
                    {p.captura ? <Svg nombre="pant" /> : null}
                    {p.captura ? p.captura.pie : t("sinPantallaD")}
                  </span>
                </div>
              </article>
            ))}
          </div>
        </div>
        {c.fichas.length ? (
          <div className="cap-fichas">
            <div className="fichas-cabeza">
              <h4>
                {t("fichas")} <span className="cuenta">{c.fichas.length}</span>
              </h4>
              <div className="filtros" role="group" aria-label={t("fichas")}>
                <button
                  type="button"
                  className="filtro"
                  data-tipo="todas"
                  aria-pressed="true"
                >
                  {t("todas")}
                </button>
                {c.tiposFicha.map((tp) => (
                  <button
                    key={tp.tipo}
                    type="button"
                    className="filtro"
                    data-tipo={tp.tipo}
                    aria-pressed="false"
                  >
                    {tp.nombre}
                  </button>
                ))}
              </div>
              <button type="button" className="boton chico linea voltear-todas">
                {t("voltearTodas")}
              </button>
            </div>
            <div className="fichas">
              {c.fichas.map((f) => (
                <article
                  key={f.id}
                  className="ficha"
                  id={f.id}
                  data-tipo={f.tipo}
                  data-b-buscar="fi"
                  data-b-n={c.n}
                  data-b-titulo={f.pregunta}
                  data-b-ir-sec={c.id}
                  data-b-ir-el={f.id}
                >
                  <button
                    type="button"
                    className="ficha-voltea"
                    aria-pressed="false"
                    aria-label={`${f.tipoNombre}: ${f.pregunta} · ${t("voltear")}`}
                  />
                  <div className="cara frente">
                    <span
                      className={`tipo t-${f.tipo === "decision" ? "decision-f" : f.tipo}`}
                    >
                      <Svg nombre={f.tipo} />
                      {f.tipoNombre}
                    </span>
                    <p className="pregunta">{f.pregunta}</p>
                    <span className="toque" aria-hidden="true">
                      {t("voltear")}
                    </span>
                  </div>
                  <div className="cara dorso">
                    <span className="tipo">{t("respuesta")}</span>
                    <p className="respuesta">{f.respuesta}</p>
                    {f.lados.length ? (
                      <div className="contraste">
                        {f.lados.map((l) => (
                          <div key={l.titulo} className="lado">
                            <b>{l.titulo}</b>
                            <p>{l.texto}</p>
                          </div>
                        ))}
                      </div>
                    ) : null}
                    <div className="ficha-pie">
                      <CitaBoton cita={f.cita} />
                    </div>
                  </div>
                </article>
              ))}
            </div>
          </div>
        ) : null}
        <div className="cap-nav">
          <button type="button" data-volver={c.orden}>
            {t("volverMapa")}
          </button>
          {c.siguiente ? (
            <button type="button" data-abre={c.siguiente.orden}>
              {t("siguiente")}: {c.siguiente.rotulo} →
            </button>
          ) : null}
        </div>
      </div>
    </details>
  );
}

export function Mapa({ v, t, s }: P & { s: Seccion }) {
  const M = v.mapa;
  return (
    <section className="sec" id="s-mapa" data-sec="mapa">
      <div className="envoltura">
        <Cabeza s={s} titulo={t("mapa")} intro={M.intro || undefined} />
        <div className="mapa">
          <div>
            {M.capas.map((c, i) => (
              <div key={c.nombre + i}>
                {i ? (
                  <div className="conector" aria-hidden="true">
                    <span />
                  </div>
                ) : null}
                <div className="capa aparece" data-motion="">
                  <div className="capa-rotulo">
                    <span className="num">{i + 1}</span>
                    <span>
                      <b>{c.nombre}</b>
                      {c.sub ? <small>{c.sub}</small> : null}
                    </span>
                  </div>
                  <div className="losetas">
                    {c.losetas.map((l) => (
                      <Loseta key={l.orden} l={l} t={t} />
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
          {M.transversal ? (
            <aside
              className="transversal aparece"
              data-motion=""
              aria-label={M.transversal.nombre}
            >
              <div className="capa-rotulo">
                <span className="num" aria-hidden="true">
                  ∞
                </span>
                <span>
                  <b>{M.transversal.nombre}</b>
                  {M.transversal.sub ? (
                    <small>{M.transversal.sub}</small>
                  ) : null}
                </span>
              </div>
              <div className="losetas">
                {M.transversal.losetas.map((l) => (
                  <Loseta key={l.orden} l={l} t={t} />
                ))}
              </div>
              <ul className="rasgos">
                {M.transversal.rasgos.map((r) => (
                  <li key={r.titulo} className="rasgo">
                    <span className="marca-si" aria-hidden="true">
                      ✓
                    </span>
                    <span>
                      <b>{r.titulo}</b>
                      {r.texto} <CitaBoton cita={r.cita} />
                    </span>
                  </li>
                ))}
              </ul>
            </aside>
          ) : null}
        </div>
        <div className="capitulos" id="capitulos">
          <div className="capitulos-cabeza aparece" data-motion="">
            <span className="sec-ceja">
              {s.n} · {t("capitulosT")}
            </span>
            <p>{t("capitulosIntro")}</p>
          </div>
          <div className="riel">
            {v.capitulos.map((c) => (
              <CapituloVista key={c.id} c={c} t={t} />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

/* ── 03 · de punta a punta ────────────────────────────────────────────────────────────── */
export function Proceso({ v, t, s }: P & { s: Seccion }) {
  const Pr = v.proceso;
  if (!Pr) return null;
  return (
    <section className="sec" id="s-proceso" data-sec="proceso">
      <div className="envoltura">
        <Cabeza s={s} titulo={s.titulo} intro={t("procesoIntro")} />
      </div>
      <div className="proceso-marco">
        <Leyenda f={Pr.flujo} t={t} />
        <FlujoDibujo
          vista={Pr.flujo}
          ancho={ANCHO_PROCESO}
          verEnRecorrido={t("verEnRecorrido")}
        />
        {Pr.notas.length ? (
          <>
            <h3 className="sr">{t("notas")}</h3>
            <ol className="notas">
              {Pr.notas.map((x) => (
                <li key={x.n}>
                  <b aria-hidden="true">{x.n}</b>
                  <span>
                    <strong>{x.paso}.</strong> {x.texto}
                  </span>
                </li>
              ))}
            </ol>
          </>
        ) : null}
      </div>
    </section>
  );
}

/* ── 04 · hecho con método ────────────────────────────────────────────────────────────── */
export function Metodo({ v, t, s }: P & { s: Seccion }) {
  const M = v.metodo;
  return (
    <section className="sec" id="s-metodo" data-sec="metodo">
      <div className="envoltura">
        <Cabeza s={s} titulo={t("metodo")} intro={t("metodoIntro")} />
        <h3 className="sr">{t("cifras")}</h3>
        <div className="metricas" id="m-cifras">
          {M.cifras.map((m, i) => (
            <div
              key={m.clave}
              className="metrica aparece"
              data-motion=""
              id={`mt-${m.clave}`}
              style={st({ "--d": `${i * 50}ms` })}
            >
              <b>
                <Valor cifra={m} />
              </b>
              <span>{m.etiqueta}</span>
              <ChipFuente fuente={m.fuente} t={t} />
              <details>
                <summary>{t("deDonde")}</summary>
                <p>{m.explica}</p>
              </details>
            </div>
          ))}
        </div>
        <div className="dos-col">
          <div className="panel aparece" data-motion="" id="m-stack">
            <h3>{t("stackT")}</h3>
            <ul className="stack">
              {M.stack.map((x) => (
                <li key={x.nombre}>
                  <b>{x.nombre}</b>
                  <span>{x.papel}</span>
                </li>
              ))}
            </ul>
          </div>
          <div className="panel aparece" data-motion="" id="m-privacidad">
            <h3>{t("privacidad")}</h3>
            <ul className="lista">
              {M.privacidad.map((f) => (
                <li key={f}>
                  <span className="marca-si" aria-hidden="true">
                    ✓
                  </span>
                  <span>{f}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
        <div className="dos-col">
          {M.nunca.length ? (
            <div className="panel aparece" data-motion="" id="m-nunca">
              <h3>{t("nunca")}</h3>
              <ul className="lista">
                {M.nunca.map((x) => (
                  <li key={x}>
                    <span className="marca-no" aria-hidden="true">
                      ✕
                    </span>
                    <span>{x}</span>
                  </li>
                ))}
              </ul>
            </div>
          ) : null}
          {M.limites.length ? (
            <div className="panel aparece" data-motion="" id="m-limites">
              <h3>{t("limites")}</h3>
              <ul className="lista">
                {M.limites.map((x) => (
                  <li key={x}>
                    <span className="marca-limite" aria-hidden="true">
                      !
                    </span>
                    <span>{x}</span>
                  </li>
                ))}
              </ul>
            </div>
          ) : null}
        </div>
      </div>
    </section>
  );
}

/* ── 05 · úsala ──────────────────────────────────────────────────────────────────────── */
/** Las ideas que se ven antes de «Ver las N ideas». */
const IDEAS_VISIBLES = 5;

/**
 * «ÚSALA» (S30, «1b»): el cierre del brochure recibe lo que vivía en la página de la ficha —la lista de
 * espera, el roadmap votable, las propuestas, la simulación, «Dónde está» y las vecinas— porque el brochure
 * es ahora la entrada de la app. Uno a uno con `htmlCierre` de la maqueta aprobada; los formularios,
 * el voto y las vecinas funcionan de verdad (en la maqueta solo mostraban una nota). La casa (CV Viva y su
 * chat) cierra con «Escríbeme», «Dónde está» y «Volver a las apps», sin lista de espera ni roadmap.
 *
 * Al imprimir (la hoja): sin formularios, sin votar, sin «Ver las N ideas» y con todas las ideas.
 */
export function Cierre({
  v,
  t,
  s,
  href,
  u,
}: P & {
  s: Seccion;
  href: (destino: string) => string;
  u: TextosDeUsala;
}) {
  const C = v.cierre;
  const hayIdeas = !!C.roadmap;
  return (
    <footer className="cierre" id="s-cierre" data-sec="cierre">
      {/* Sin JavaScript el botón «Ver las N ideas» no abre nada: las ideas nacen todas a la vista. */}
      {C.roadmap && C.roadmap.features.length > IDEAS_VISIBLES ? (
        <noscript>
          <style>{`.votable[data-plegada]{display:grid!important}.ver-ideas{display:none!important}`}</style>
        </noscript>
      ) : null}
      <div className="envoltura">
        <Cabeza s={s} titulo={C.titulo} intro={C.razon} />
        <div className="cierre-acciones">
          {C.contacto ? (
            <a className="boton" href={href(C.contacto.href)} data-cta="">
              {C.contacto.texto}
            </a>
          ) : null}
          {C.simulacion ? (
            <a
              className="boton"
              href={href(C.simulacion.href)}
              data-cta="simulacion"
            >
              {u.verSimulacion} →
            </a>
          ) : null}
          <button type="button" className="boton linea" data-recorrido="">
            <Svg nombre="play" />
            {t("recorrido")}
          </button>
          <button type="button" className="boton linea" data-imprimir="">
            <Svg nombre="pdf" />
            {t("pdf")}
          </button>
          <button type="button" className="boton linea" data-ir-sec="top">
            ↑ {t("arriba")}
          </button>
        </div>

        {C.lista ? (
          <div className="usala-rejilla">
            {/* La lista de espera: el mismo formulario de la ficha, con esta app ya elegida. */}
            <section
              className="usala-panel"
              id="lista-de-espera"
              aria-labelledby="t-lista"
            >
              <span className="usala-ceja">{u.acceso}</span>
              <h3 id="t-lista">{u.listaTitulo}</h3>
              <p className="usala-ayuda">{u.listaLinea}</p>
              <ListaDeEsperaForm
                apps={C.lista.apps}
                appInicial={C.lista.appInicial}
                tono="tinta"
                textoEnviar={u.cta}
              />
            </section>
            {/* El roadmap votable y, debajo, la propuesta: «qué viene» y «qué más». */}
            <section
              className={
                hayIdeas ? "usala-panel" : "usala-panel solo-propuesta"
              }
              aria-label={hayIdeas ? u.roadmapEyebrow : u.propuestaEyebrow}
            >
              {C.roadmap ? (
                <>
                  <span className="usala-ceja">{u.roadmapEyebrow}</span>
                  <h3>{u.roadmapTitulo}</h3>
                  <p className="usala-ayuda">{u.roadmapSubtitulo}</p>
                  <RoadmapVoting
                    grupos={[
                      {
                        appId: C.roadmap.app,
                        appNombre: C.roadmap.nombre,
                        features: C.roadmap.features.map((f) => ({
                          app: C.roadmap!.app,
                          ...f,
                        })),
                      },
                    ]}
                    conNombreDeApp={false}
                    tono="tinta"
                    visibles={IDEAS_VISIBLES}
                    diferido
                  />
                </>
              ) : null}
              {C.propuesta ? (
                <PropuestaForm
                  app={C.propuesta.app}
                  nombreApp={C.propuesta.nombre}
                  tono="tinta"
                  conIdeas={hayIdeas}
                />
              ) : null}
            </section>
          </div>
        ) : null}

        <section className="donde" aria-labelledby="t-donde">
          <div>
            <h3 id="t-donde">{u.dondeTitulo}</h3>
            <p>
              {u.dondeSub} {u.dondeNota}
            </p>
          </div>
          <ol>
            {C.hitos.map((h) => (
              <li key={`${h.etiqueta}-${h.valor}`}>
                <b>{h.valor}</b>
                <span>{u.hitos[h.etiqueta] ?? h.etiqueta}</span>
              </li>
            ))}
          </ol>
        </section>

        <nav className="vecinas" aria-label={u.volverApps}>
          {C.vecinas.anterior ? (
            <a className="vecina" href={href(C.vecinas.anterior.href)}>
              <small>← {u.appAnterior}</small>
              <b>{C.vecinas.anterior.nombre}</b>
            </a>
          ) : (
            <span />
          )}
          <a className="vecina centro" href={href("/portafolio/apps")}>
            <small>↑ {t("vecApps")}</small>
            <b>{u.volverApps}</b>
          </a>
          {C.vecinas.siguiente ? (
            <a className="vecina der" href={href(C.vecinas.siguiente.href)}>
              <small>{u.appSiguiente} →</small>
              <b>{C.vecinas.siguiente.nombre}</b>
            </a>
          ) : (
            <span />
          )}
        </nav>

        <div className="pie-final">
          <span>{C.pie}</span>
          <span>{t("pieDerecha")}</span>
        </div>
      </div>
    </footer>
  );
}

/* ── la vista previa y el Recorrido: los pinta el cliente al primer uso (`recorrido.tsx`) ── */
export function Previa({ v }: { v: VistaBrochure }) {
  return <PreviaCliente pantallas={v.pantallas} />;
}

export function Recorrido({ v, t }: P) {
  const grupos = v.capitulos
    .map((c) => ({
      orden: c.orden,
      nombre: c.nombre,
      n: v.pantallas.filter((p) => p.grupo === c.orden).length,
    }))
    .filter((g) => g.n);
  return (
    <RecorridoCliente
      nombre={v.nombre}
      inicial={v.inicial}
      pantallas={v.pantallas}
      grupos={grupos}
      x={{
        etiqueta: `${t("recorrido")} · ${v.nombre}`,
        cuenta: t("rCuenta", { i: "{i}", n: "{n}" }),
        play: t("rPlay"),
        pausa: t("rPausa"),
        cerrar: t("rCerrar"),
        ant: t("rAnt"),
        sig: t("rSig"),
        capitulo: t("rCapitulo"),
        teclas: t("rTeclas"),
      }}
    />
  );
}
