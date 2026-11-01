/**
 * LOS ÍCONOS DEL BROCHURE (S28): los de la maqueta aprobada, como datos. Son marcado SVG constante
 * de esta casa (ningún dato de una app pasa por aquí), por eso se insertan tal cual.
 *
 * `ICONOS` dibuja el ícono de cada grupo del mapa (el contrato v2 elige uno por grupo; `pantalla` es
 * el de respaldo); `SVG` son los de la interfaz: buscar, PDF, reproducir, flechas, la cita…
 */
import type { ICONOS as NOMBRES } from "@/lib/brochure/contenido";

export const ICONOS: Record<(typeof NOMBRES)[number], string> = {
  megafono:
    '<path d="M3 10.5v3a1 1 0 0 0 1 1h2.5L12 19V5L6.5 9.5H4a1 1 0 0 0-1 1z"/><path d="M15.5 9a4 4 0 0 1 0 6M18.5 6.2a8 8 0 0 1 0 11.6"/>',
  lista:
    '<rect x="5" y="3.5" width="14" height="17" rx="2"/><path d="m8.2 8.4 1.3 1.3 2.3-2.4M13.8 8.6H16M8.2 13.4l1.3 1.3 2.3-2.4M13.8 13.6H16"/>',
  foto: '<path d="M4 8.5h3.2L9 5.5h6l1.8 3H20v10.5H4z"/><circle cx="12" cy="13.3" r="3.4"/>',
  escudo:
    '<path d="M12 3 5 6v5.6c0 4.2 2.9 7.6 7 9.4 4.1-1.8 7-5.2 7-9.4V6z"/><path d="m9 12.2 2.1 2.1 4-4.2"/>',
  lupa: '<circle cx="10.5" cy="10.5" r="6.3"/><path d="m15.3 15.3 5.2 5.2"/>',
  sello:
    '<circle cx="12" cy="9.5" r="6"/><path d="m9.4 9.6 1.8 1.8 3.5-3.6"/><path d="M8.6 14.6 7.2 21l4.8-2.4 4.8 2.4-1.4-6.4"/>',
  calendario:
    '<rect x="3.5" y="5" width="17" height="15.5" rx="2"/><path d="M3.5 10h17M8 3v4M16 3v4"/><path d="m9 15.2 2 2 4-4"/>',
  calculadora:
    '<rect x="5" y="3" width="14" height="18" rx="2"/><path d="M8 6.5h8v3.2H8z"/><path d="M8.5 13.5h.01M12 13.5h.01M15.5 13.5h.01M8.5 17h.01M12 17h.01M15.5 17h.01"/>',
  edificio:
    '<path d="M4 21V9.5l6-3.5v15M10 21V3l10 4v14M2 21h20"/><path d="M13.5 10h3M13.5 13.5h3M13.5 17h3M6.5 12.5h1M6.5 16h1"/>',
  idiomas:
    '<path d="M3.5 5.5h9M8 3.5v2M5.6 5.5c.6 3.1 2.6 5.6 5.6 7.1M10.4 5.5c-.6 3.1-2.6 5.6-5.6 7.1"/><path d="m13 20.5 4-9 4 9M14.4 17.5h5.2"/>',
  pantalla:
    '<rect x="2.5" y="4" width="19" height="13" rx="2"/><path d="M8 20.5h8M12 17v3.5"/>',
  // S30, los que pidió la tanda 1: la conversación (un globo con dos líneas) y la llave.
  conversacion:
    '<path d="M4 5h16v10.5H10L5.5 19.5v-4H4z"/><path d="M8 9h8M8 12h5"/>',
  llave:
    '<circle cx="8" cy="15.5" r="4"/><path d="m10.9 12.6 8.6-8.6M16.2 6.9l2.4 2.4M13.6 9.5l2 2"/>',
};

export const SVG = {
  buscar:
    '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" aria-hidden="true"><circle cx="10.5" cy="10.5" r="6.5"/><path d="m15.5 15.5 5.5 5.5"/></svg>',
  pdf: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><path d="M14 2v6h6M12 11v6M9 14l3 3 3-3"/></svg>',
  play: '<svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M8 5.5v13l10.5-6.5z"/></svg>',
  pausa:
    '<svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M7 5h3.5v14H7zM13.5 5H17v14h-3.5z"/></svg>',
  izq: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="m15 5-7 7 7 7"/></svg>',
  der: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="m9 5 7 7-7 7"/></svg>',
  cerrar:
    '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" aria-hidden="true"><path d="M6 6l12 12M18 6 6 18"/></svg>',
  abajo:
    '<svg viewBox="0 0 16 16" aria-hidden="true"><path d="m4 6 4 4 4-4" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/></svg>',
  flecha:
    '<svg class="prueba-flecha" viewBox="0 0 64 64" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M8 32h46M40 18l14 14-14 14"/></svg>',
  pant: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><rect x="2.5" y="4" width="19" height="13" rx="2"/><path d="M8 20.5h8M12 17v3.5"/></svg>',
  cita: '<svg viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" aria-hidden="true"><path d="M3 2.5h7l3 3v8H3z"/><path d="M5.5 7h5M5.5 10h4"/></svg>',
  concepto:
    '<svg viewBox="0 0 16 16" aria-hidden="true"><circle cx="8" cy="8" r="5.5" fill="none" stroke="currentColor" stroke-width="1.6"/><circle cx="8" cy="8" r="1.8" fill="currentColor"/></svg>',
  diferencia:
    '<svg viewBox="0 0 16 16" aria-hidden="true"><path d="M2 5h9M8 2l3 3-3 3M14 11H5M8 8l-3 3 3 3" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"/></svg>',
  decision:
    '<svg viewBox="0 0 16 16" aria-hidden="true"><path d="M8 14V8M8 8 3 3M8 8l5-5M3 3v3M3 3h3M13 3v3M13 3h-3" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"/></svg>',
} as const;

export type NombreSvg = keyof typeof SVG;
