"use client";

import { useLocale } from "next-intl";
import { useEffect } from "react";
import { trackEvent } from "@/lib/analytics";

/** Dispara brochure_vista una vez por carga de una página de brochure. */
export function BrochureVisitTracker({ app }: { app: string }) {
  const locale = useLocale();

  useEffect(() => {
    trackEvent("brochure_vista", { app, locale });
    // Solo al montar: una visita = un evento
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return null;
}
