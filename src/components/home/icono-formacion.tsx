import {
  Award,
  BookOpen,
  CodeXml,
  Database,
  GraduationCap,
  Languages,
  type LucideIcon,
} from "lucide-react";
import type { IconoFormacion } from "@/lib/schemas";

/**
 * El icono de un estudio o una certificación (revisión post-S8): pequeño,
 * sin color, solo líneas — Lucide a 16 px y trazo 1.5, en `ink-2`, como pide
 * el design system para iconografía. Va POR DATO (`icono:` en el YAML, con
 * enum en el schema), no por palabra clave de la institución: un logo real de
 * marca ajena no entra aquí; si un día llegan las insignias de Credly, entran
 * junto al enlace `verificacion:` como imagen, no como icono.
 */
const ICONOS: Record<IconoFormacion, LucideIcon> = {
  universidad: GraduationCap,
  idiomas: Languages,
  curso: BookOpen,
  insignia: Award,
  datos: Database,
  codigo: CodeXml,
};

export function IconoDeFormacion({
  nombre,
  className = "shrink-0 text-ink-2",
}: {
  nombre: IconoFormacion;
  className?: string;
}) {
  const Icono = ICONOS[nombre];
  return (
    <Icono
      size={16}
      strokeWidth={1.5}
      aria-hidden="true"
      focusable="false"
      data-icono={nombre}
      className={className}
    />
  );
}
