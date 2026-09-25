import createMiddleware from "next-intl/middleware";
import { NextResponse, type NextRequest } from "next/server";
import { routing } from "./i18n/routing";
import {
  REINTENTO_SEGUNDOS,
  enMantenimiento,
  idiomaDeRuta,
} from "./lib/mantenimiento";

const intl = createMiddleware(routing);

/**
 * Con `MANTENIMIENTO=on` en Production, TODA página responde la de
 * mantenimiento de su idioma con un 503 temporal (ver `src/lib/mantenimiento.ts`).
 * Lo que el matcher deja fuera sigue sirviéndose: los PDF del CV (que la
 * página ofrece), las fuentes, `/_next`, `robots.txt` y el sitemap.
 */
export default function proxy(request: NextRequest) {
  if (enMantenimiento()) {
    const destino = new URL(
      `/${idiomaDeRuta(request.nextUrl.pathname)}/mantenimiento`,
      request.url,
    );
    return NextResponse.rewrite(destino, {
      status: 503,
      headers: {
        "Retry-After": String(REINTENTO_SEGUNDOS),
        "Cache-Control": "no-store",
      },
    });
  }
  return intl(request);
}

export const config = {
  // Todo excepto /api, internals de Next y archivos estáticos
  matcher: "/((?!api|_next|_vercel|.*\\..*).*)",
};
