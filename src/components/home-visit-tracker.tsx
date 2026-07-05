"use client";

import { useEffect } from "react";
import { useLocale } from "next-intl";
import { trackEvent } from "@/lib/analytics";

/** Dispara el evento home_visit una vez por carga de la HOME. */
export function HomeVisitTracker() {
  const locale = useLocale();

  useEffect(() => {
    trackEvent("home_visit", { locale });
    // Solo al montar: una visita = un evento
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return null;
}
