import "server-only";
import { Resend } from "resend";

/**
 * El correo con el código. Mismo proveedor que el formulario (Resend). Sin
 * RESEND_API_KEY el envío se simula y el código queda solo en el log del
 * servidor (nivel warn) — sirve en dev y preview sin secretos, nunca en
 * producción. OJO (documentado en el manual): el remitente de cortesía de
 * Resend solo entrega al correo del dueño de la cuenta; para que el código
 * llegue a cualquier visitante hace falta un dominio verificado en Resend y
 * SOLICITUDES_FROM_EMAIL con ese dominio.
 */
export type EnvioCodigo = { sent: boolean; simulated: boolean; id?: string };

const TEXTOS = {
  es: {
    asunto: "Tu código para chatear con la hoja de vida de Henry",
    cuerpo: (nombre: string, codigo: string) =>
      [
        `Hola, ${nombre}.`,
        "",
        `Tu código es: ${codigo}`,
        "",
        "Vale por diez minutos. Escríbelo en el chat de la hoja de vida y podrás preguntar.",
        "Si no pediste este código, ignora este mensaje.",
      ].join("\n"),
  },
  en: {
    asunto: "Your code to chat with Henry's CV",
    cuerpo: (nombre: string, codigo: string) =>
      [
        `Hi, ${nombre}.`,
        "",
        `Your code is: ${codigo}`,
        "",
        "It is valid for ten minutes. Type it into the CV chat and you can start asking.",
        "If you did not request this code, ignore this message.",
      ].join("\n"),
  },
} as const;

export async function enviarCodigo({
  to,
  nombre,
  codigo,
  locale,
}: {
  to: string;
  nombre: string;
  codigo: string;
  locale: "es" | "en";
}): Promise<EnvioCodigo> {
  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) return { sent: false, simulated: true };

  const resend = new Resend(apiKey);
  const from =
    process.env.SOLICITUDES_FROM_EMAIL ?? "CV Viva <onboarding@resend.dev>";
  const t = TEXTOS[locale];
  const { data, error } = await resend.emails.send({
    from,
    to,
    subject: t.asunto,
    text: t.cuerpo(nombre, codigo),
  });
  if (error) throw new Error(`Resend: ${error.message}`);
  return { sent: true, simulated: false, id: data?.id };
}
