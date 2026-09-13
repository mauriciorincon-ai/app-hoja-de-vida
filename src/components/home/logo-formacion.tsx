import Image from "next/image";
import { LOGO_ALTO, type IconoFormacion } from "@/lib/schemas";
import { IconoDeFormacion } from "./icono-formacion";

/**
 * El logo de la institución de un estudio o una certificación (revisión
 * post-S8, a pedido del dueño — el primer corte solo traía iconos de líneas).
 * Pequeño, en gris y algo translúcido, para que sea seña y no cartel: la
 * paleta editorial manda. La altura es dato (`logoAlto:`, 20 px por defecto):
 * un escudo cuadrado a 20 px se ve la mitad que un logotipo ancho, y el dueño
 * quiso el de su universidad al menos tan presente como el de IBM. Si el dato
 * no trae `logo:`, cae al icono monolínea por `icono:`. Decorativo (`alt=""`):
 * el nombre de la institución va en texto al lado. Procedencia y licencias:
 * `public/logos/LICENCIAS.md`.
 */
export function LogoDeFormacion({
  logo,
  icono,
  alto = LOGO_ALTO,
}: {
  logo?: string;
  icono: IconoFormacion;
  alto?: number;
}) {
  if (!logo) return <IconoDeFormacion nombre={icono} />;
  return (
    <Image
      src={`/logos/${logo}`}
      alt=""
      aria-hidden="true"
      width={alto * 4}
      height={alto}
      unoptimized
      data-logo={logo}
      data-logo-alto={alto}
      style={{ height: alto, maxWidth: alto * 5 }}
      className="w-auto shrink-0 opacity-80 grayscale"
    />
  );
}
