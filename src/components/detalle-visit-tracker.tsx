"use client";

import { useLocale } from "next-intl";
import { useEffect } from "react";
import { trackEvent } from "@/lib/analytics";

/** Dispara proyecto_detalle_visto una vez por carga de una página de detalle. */
export function DetalleVisitTracker({ slug }: { slug: string }) {
  const locale = useLocale();

  useEffect(() => {
    trackEvent("proyecto_detalle_visto", { proyecto: slug, locale });
    // Solo al montar: una visita = un evento
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return null;
}
