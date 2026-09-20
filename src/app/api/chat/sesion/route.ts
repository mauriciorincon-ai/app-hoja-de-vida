import { NextResponse } from "next/server";
import { secretoSesion } from "@/lib/chat-registro/codigo";
import { sesionDeRequest } from "@/lib/chat-registro/sesion";
import { gateHabilitado } from "@/lib/chat-registro/store";

/**
 * ¿Quién está chateando? El panel lo consulta al abrirse para decidir si
 * muestra el formulario o el chat. Devuelve solo el nombre: el correo no
 * vuelve al navegador.
 */
export async function GET(request: Request): Promise<NextResponse> {
  if (!gateHabilitado()) {
    return NextResponse.json({ gate: false, sesion: null });
  }
  const secreto = secretoSesion();
  const sesion = secreto ? sesionDeRequest(request, secreto) : null;
  return NextResponse.json(
    { gate: true, sesion: sesion ? { nombre: sesion.nombre } : null },
    { headers: { "Cache-Control": "no-store" } },
  );
}
