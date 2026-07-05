"use client";

import { trackEvent } from "@/lib/analytics";

/** CTA de card de app: único fragmento client del showcase (tracking). */
export function AppCardCta({ appId, label }: { appId: string; label: string }) {
  return (
    <a
      href="#contacto"
      onClick={() => trackEvent("app_card_clicked", { app: appId })}
      className="mt-auto flex min-h-11 items-center gap-1.5 pt-2 text-sm font-medium text-sage-ink transition-colors duration-[120ms] hover:text-ink-0"
    >
      {label}
      <span aria-hidden="true">→</span>
    </a>
  );
}
