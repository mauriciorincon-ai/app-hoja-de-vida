"use client";

import { useTranslations } from "next-intl";
import { MOTIVOS } from "@/lib/contacto-constantes";
import { FormularioContacto } from "./formulario-contacto";

/**
 * El formulario GENERAL de la HOME («Escríbeme»). Su desplegable responde la
 * pregunta del bloque de contacto —«¿Un proyecto, una asesoría, una
 * capacitación, una charla o un rol?»— y nada más: la lista de espera de las
 * apps tiene su propio formulario en la vitrina (`ListaDeEsperaForm`).
 */
export function SolicitarAccesoForm() {
  const t = useTranslations("form");
  return (
    <FormularioContacto
      titulo={t("titulo")}
      idPrefijo="solicitud"
      campo={{
        name: "motivo",
        label: t("motivo"),
        placeholder: t("motivoElige"),
        opciones: MOTIVOS.map((m) => ({ value: m, label: t(`motivos.${m}`) })),
      }}
    />
  );
}
