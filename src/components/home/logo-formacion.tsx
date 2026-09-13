import Image from "next/image";
import type { IconoFormacion } from "@/lib/schemas";
import { IconoDeFormacion } from "./icono-formacion";

/**
 * El logo de la institución de un estudio o una certificación (revisión
 * post-S8, a pedido del dueño — el primer corte solo traía iconos de líneas).
 * Pequeño (20 px de alto), en gris y algo translúcido, para que sea seña y no
 * cartel: la paleta editorial manda. Si el dato no trae `logo:`, cae al icono
 * monolínea por `icono:`. Decorativo (`alt=""`): el nombre de la institución
 * va en texto al lado. Procedencia y licencias: `public/logos/LICENCIAS.md`.
 */
export function LogoDeFormacion({
  logo,
  icono,
}: {
  logo?: string;
  icono: IconoFormacion;
}) {
  if (!logo) return <IconoDeFormacion nombre={icono} />;
  return (
    <Image
      src={`/logos/${logo}`}
      alt=""
      aria-hidden="true"
      width={80}
      height={20}
      unoptimized
      data-logo={logo}
      className="h-5 w-auto max-w-24 shrink-0 opacity-80 grayscale"
    />
  );
}
