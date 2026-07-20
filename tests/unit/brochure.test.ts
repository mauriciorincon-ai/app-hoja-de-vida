import { describe, expect, it } from "vitest";
import { appsConBrochure, getBrochureApp } from "@/lib/brochure";

/**
 * Deriva de data/apps.yaml real. Solo apps con funcionalidad real ("solo lo
 * real") llevan brochure; las cifras cambian con el contenido — intencional.
 */

describe("lib/brochure", () => {
  it("appsConBrochure devuelve solo apps con brochure", () => {
    const apps = appsConBrochure();
    expect(apps.length).toBeGreaterThan(0);
    for (const app of apps) {
      expect(app.brochure).toBeDefined();
      expect(app.brochure.funcionalidades.length).toBeGreaterThan(0);
    }
    // Las apps en-exploracion (sin funcionalidad real) no tienen brochure.
    expect(apps.map((a) => a.id)).not.toContain("fabric-analitica-e2e");
  });

  it("solo apps en-produccion llevan brochure (regla 'solo lo real')", () => {
    for (const app of appsConBrochure()) {
      expect(app.estado).toBe("en-produccion");
    }
  });

  it("getBrochureApp resuelve por slug y devuelve undefined si no existe", () => {
    const primera = appsConBrochure()[0];
    expect(getBrochureApp(primera.id)?.id).toBe(primera.id);
    expect(getBrochureApp("no-existe")).toBeUndefined();
    // Una app sin brochure no se resuelve por esta vía.
    expect(getBrochureApp("fabric-analitica-e2e")).toBeUndefined();
  });
});
