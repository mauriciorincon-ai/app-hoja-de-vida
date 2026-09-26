import { MARCA_HR } from "@/lib/marca-hr";

/**
 * La loseta HR del ícono de la pestaña, en vector, para el encabezado
 * (2026-09-26: el dueño la quiso también como botón para volver al inicio).
 * Los datos los escribe `pnpm iconos` desde el mismo trazo que `icon.svg`.
 * Es decorativa: el enlace que la contiene se nombra con el nombre del dueño.
 */
export function MarcaHR({ className }: { className?: string }) {
  return (
    <svg
      viewBox={MARCA_HR.viewBox}
      aria-hidden="true"
      focusable="false"
      className={className}
    >
      <rect
        x={MARCA_HR.x}
        y={MARCA_HR.y}
        width={MARCA_HR.lado}
        height={MARCA_HR.lado}
        rx={MARCA_HR.rx}
        fill={MARCA_HR.fondo}
      />
      <path d={MARCA_HR.d} fill={MARCA_HR.letras} />
    </svg>
  );
}
