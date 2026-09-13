import "server-only";
import { Resend } from "resend";
import type { Propuesta } from "./propuestas";
import { ETIQUETAS_MOTIVO, type Solicitud } from "./schemas";

/**
 * Envío del mensaje del formulario por email (Resend free tier). Desde la
 * revisión post-S8 el formulario es el contacto general: el asunto lleva el
 * motivo que el visitante eligió («Una asesoría», «Un rol»…), o la app de la
 * lista de espera («Lista de espera: Habla») y, sin ninguno, «Mensaje desde
 * la hoja de vida».
 * Sin RESEND_API_KEY configurada (dev/preview sin secrets) el envío se
 * simula y queda solo en logs — el llamador decide cómo registrarlo.
 */
export type SendResult = { sent: boolean; simulated: boolean; id?: string };

export async function sendSolicitudEmail(
  solicitud: Solicitud,
  /** Nombre legible de la app pedida (lista de espera); lo resuelve el endpoint. */
  etiquetaApp?: string,
): Promise<SendResult> {
  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) {
    return { sent: false, simulated: true };
  }

  const resend = new Resend(apiKey);
  const to = process.env.SOLICITUDES_TO_EMAIL ?? "mauriciorinconai@gmail.com";
  const from =
    process.env.SOLICITUDES_FROM_EMAIL ?? "CV Viva <onboarding@resend.dev>";

  const motivo = solicitud.motivo ? ETIQUETAS_MOTIVO[solicitud.motivo] : "";
  const { data, error } = await resend.emails.send({
    from,
    to,
    replyTo: solicitud.email,
    subject: etiquetaApp
      ? `[CV Viva] Lista de espera: ${etiquetaApp}`
      : motivo
        ? `[CV Viva] ${motivo}`
        : "[CV Viva] Mensaje desde la hoja de vida",
    text: [
      `Nombre: ${solicitud.nombre}`,
      `Email: ${solicitud.email}`,
      etiquetaApp
        ? `Lista de espera: ${etiquetaApp}`
        : `Motivo: ${motivo || "(sin motivo)"}`,
      "",
      solicitud.mensaje || "(sin mensaje)",
    ].join("\n"),
  });

  if (error) {
    throw new Error(`Resend: ${error.message}`);
  }
  return { sent: true, simulated: false, id: data?.id };
}

/**
 * Propuesta de funcionalidad para una app hermana (2026-09-13). Sin correo del
 * visitante no hay reply-to: la propuesta es anónima a propósito.
 */
export async function sendPropuestaEmail(
  propuesta: Propuesta,
  nombreApp: string,
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
    ...(propuesta.email ? { replyTo: propuesta.email } : {}),
    subject: `[CV Viva] Propuesta para ${nombreApp}`,
    text: [
      `App: ${nombreApp} (${propuesta.app})`,
      `Correo: ${propuesta.email || "(no dejó correo)"}`,
      "",
      propuesta.propuesta,
    ].join("\n"),
  });

  if (error) {
    throw new Error(`Resend: ${error.message}`);
  }
  return { sent: true, simulated: false, id: data?.id };
}
