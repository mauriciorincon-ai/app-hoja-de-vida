import "server-only";
import { Resend } from "resend";
import type { Solicitud } from "./schemas";

/**
 * Envío de la solicitud de acceso por email (Resend free tier).
 * Sin RESEND_API_KEY configurada (dev/preview sin secrets) el envío se
 * simula y queda solo en logs — el llamador decide cómo registrarlo.
 */
export type SendResult = { sent: boolean; simulated: boolean; id?: string };

export async function sendSolicitudEmail(
  solicitud: Solicitud,
): Promise<SendResult> {
  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) {
    return { sent: false, simulated: true };
  }

  const resend = new Resend(apiKey);
  const to = process.env.SOLICITUDES_TO_EMAIL ?? "mauriciorinconai@gmail.com";
  const from =
    process.env.SOLICITUDES_FROM_EMAIL ?? "CV Viva <onboarding@resend.dev>";

  const { data, error } = await resend.emails.send({
    from,
    to,
    replyTo: solicitud.email,
    subject: `[CV Viva] Solicitud de acceso: ${solicitud.app}`,
    text: [
      `Nombre: ${solicitud.nombre}`,
      `Email: ${solicitud.email}`,
      `App: ${solicitud.app}`,
      "",
      solicitud.mensaje || "(sin mensaje)",
    ].join("\n"),
  });

  if (error) {
    throw new Error(`Resend: ${error.message}`);
  }
  return { sent: true, simulated: false, id: data?.id };
}
