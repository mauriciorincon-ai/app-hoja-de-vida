"use client";

import { useTranslations } from "next-intl";
import { APP_OTRA } from "@/lib/contacto-constantes";
import type { Tono } from "./campos";
import { FormularioContacto } from "./formulario-contacto";

/**
 * La LISTA DE ESPERA de las apps (decisión del dueño, 2026-09-13): el único
 * frente de la vitrina con vocación comercial. Lista las apps publicadas en
 * `content/vitrina/` más «Otra», que nunca sobra. Los agentes, las
 * investigaciones y los tableros NO tienen lista de espera: se muestran para
 * enseñar capacidades, no se entregan.
 */
export function ListaDeEsperaForm({
  apps,
  appInicial,
  tono = "claro",
  textoEnviar,
}: {
  apps: { slug: string; nombre: string }[];
  appInicial?: string;
  /** `tinta` en el cierre del brochure (S30). */
  tono?: Tono;
  /** El rótulo del botón («Avísame cuando abra»); sin él, el «Enviar» del formulario. */
  textoEnviar?: string;
}) {
  const t = useTranslations("listaDeEspera");
  return (
    <FormularioContacto
      titulo={t("titulo")}
      idPrefijo="lista-de-espera"
      campo={{
        name: "app",
        label: t("app"),
        placeholder: t("elige"),
        opciones: [
          ...apps.map((a) => ({ value: a.slug, label: a.nombre })),
          { value: APP_OTRA, label: t("otra") },
        ],
        inicial: appInicial,
      }}
      nota={t("nota")}
      tono={tono}
      textoEnviar={textoEnviar}
    />
  );
}
