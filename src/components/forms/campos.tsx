import type { ComponentProps, ReactNode } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";

/**
 * LOS CAMPOS DE LOS FORMULARIOS, EN DOS TONOS (S30, «Úsala»).
 *
 * Los formularios de la app (lista de espera, propuesta, voto) son de fondo claro y viven en la ficha.
 * El brochure los recibe en su cierre, que es de tinta: allí la hoja del brochure pinta los campos con
 * las clases de la maqueta aprobada (`.campo`, `.boton`…). Esa hoja vive en `@layer components` y no puede
 * pisar las utilidades de Tailwind, que van en una capa posterior; por eso el tono `tinta` NO lleva
 * ninguna utilidad de color en el campo (nada de `border-input`, `bg-transparent`…) y deja que la hoja
 * lo pinte. El tono `claro` es el de siempre, sin un solo cambio.
 */
export type Tono = "claro" | "tinta";

export function Campo({
  tono,
  className,
  children,
}: {
  tono: Tono;
  className?: string;
  children: ReactNode;
}) {
  return (
    <div
      className={
        tono === "tinta" ? "campo" : cn("flex flex-col gap-2", className)
      }
    >
      {children}
    </div>
  );
}

export function Etiqueta({
  tono,
  className,
  ...p
}: ComponentProps<"label"> & { tono: Tono }) {
  return tono === "tinta" ? (
    <label {...p} className={className} />
  ) : (
    <Label className={className} {...p} />
  );
}

export function Entrada({
  tono,
  className,
  ...p
}: ComponentProps<"input"> & { tono: Tono }) {
  return tono === "tinta" ? (
    <input {...p} />
  ) : (
    <Input className={className} {...p} />
  );
}

export function AreaDeTexto({
  tono,
  className,
  ...p
}: ComponentProps<"textarea"> & { tono: Tono }) {
  return tono === "tinta" ? (
    <textarea {...p} />
  ) : (
    <Textarea className={className} {...p} />
  );
}

/** El botón de enviar: en tinta, el `.boton` de la hoja (relleno, o `linea` para la acción secundaria). */
export function Enviar({
  tono,
  linea = false,
  className,
  ...p
}: ComponentProps<"button"> & { tono: Tono; linea?: boolean }) {
  return tono === "tinta" ? (
    <button {...p} className={linea ? "boton linea" : "boton"} />
  ) : (
    <Button className={className} {...p} />
  );
}

/** El error de un campo: en tinta, el rosa de la hoja (el `text-rose-ink` no se lee sobre tinta). */
export function ErrorDeCampo({
  tono,
  id,
  children,
}: {
  tono: Tono;
  id: string;
  children: ReactNode;
}) {
  return (
    <p
      id={id}
      role="alert"
      className={tono === "tinta" ? "usala-error" : "text-sm text-rose-ink"}
    >
      {children}
    </p>
  );
}

/** El aviso de que el envío falló. */
export function AvisoDeError({
  tono,
  children,
}: {
  tono: Tono;
  children: ReactNode;
}) {
  return (
    <div
      role="alert"
      className={
        tono === "tinta"
          ? "usala-error usala-error-caja"
          : "rounded-md border border-danger/40 bg-rose px-4 py-3 text-sm text-rose-ink"
      }
    >
      {children}
    </div>
  );
}
