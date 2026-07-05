import { notFound } from "next/navigation";

/** Cualquier ruta desconocida bajo /es o /en cae al 404 localizado. */
export default function CatchAllPage() {
  notFound();
}
