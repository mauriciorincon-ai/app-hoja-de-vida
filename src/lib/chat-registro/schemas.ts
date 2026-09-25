import { z } from "zod";

/**
 * La barrera del chat (ADR-024): antes de preguntar, el visitante deja nombre
 * y correo, recibe un código de seis dígitos por email y lo escribe. Sin
 * código no hay chat. Estos esquemas son el borde de los endpoints; la lógica
 * vive en `codigo.ts`, `sesion.ts` y `store.ts`.
 */

export const CODIGO_DIGITOS = 6;
export const CODIGO_VIGENCIA_MS = 10 * 60_000;
export const CODIGO_INTENTOS_MAX = 5;
export const SESION_VIGENCIA_MS = 30 * 24 * 60 * 60_000;

/** Paso 1 — pedir el código. `website` es el honeypot; `acepta` es el aviso de datos. */
export const registroSchema = z.object({
  nombre: z.string().trim().min(2).max(120),
  email: z.string().trim().toLowerCase().email().max(254),
  locale: z.enum(["es", "en"]),
  acepta: z.literal(true),
  website: z.literal("").default(""),
});
export type Registro = z.infer<typeof registroSchema>;

/** Paso 2 — verificar el código. */
export const verificacionSchema = z.object({
  email: z.string().trim().toLowerCase().email().max(254),
  codigo: z
    .string()
    .trim()
    .regex(/^[0-9]{6}$/, "seis dígitos"),
});
export type Verificacion = z.infer<typeof verificacionSchema>;

/** El paso 2 lleva también el nombre: el código certifica el correo; el nombre es lo que dijo llamarse. */
export const verificacionConNombreSchema = verificacionSchema.extend({
  nombre: z.string().trim().min(2).max(120),
});

/**
 * «¿Algo no funciona? Avísame» (revisión 2026-09-24). El visitante atascado en
 * la puerta avisa sin salir del panel. El correo es obligatorio porque es a
 * quien el dueño responde; el detalle, opcional, porque «no me llega» ya dice
 * mucho. `paso` dice dónde se atascó: al pedir el código o al escribirlo.
 */
export const DETALLE_PROBLEMA_MAX = 600;
export const problemaSchema = z.object({
  nombre: z.string().trim().max(120).default(""),
  email: z.string().trim().toLowerCase().email().max(254),
  locale: z.enum(["es", "en"]),
  paso: z.enum(["datos", "codigo"]),
  detalle: z.string().trim().max(DETALLE_PROBLEMA_MAX).default(""),
  website: z.literal("").default(""),
});
export type Problema = z.infer<typeof problemaSchema>;

/** Lo que el cliente manda cuando respondió en modo búsqueda local (sin proveedor). */
export const registroLocalSchema = z.object({
  locale: z.enum(["es", "en"]),
  pregunta: z.string().trim().min(1).max(800),
  respuesta: z.string().trim().min(1).max(4000),
  fuentes: z
    .array(
      z.object({
        // El código de la fuente («AF-09», «CV»…) viaja al registro para que
        // el dueño sepa qué archivo corregir al leer una conversación.
        codigo: z.string().min(1).optional(),
        titulo: z.string().min(1),
        ancla: z.string().min(1),
      }),
    )
    .max(8)
    .default([]),
});
export type RegistroLocal = z.infer<typeof registroLocalSchema>;

/** La sesión firmada que viaja en la cookie: quién es y hasta cuándo. */
export const sesionSchema = z.object({
  nombre: z.string().min(1).max(120),
  email: z.string().email().max(254),
  exp: z.number().int().positive(),
});
export type Sesion = z.infer<typeof sesionSchema>;

/** Una fila del registro de conversaciones (lo que el dueño lee en Supabase). */
export type EntradaRegistro = {
  nombre: string;
  email: string;
  locale: "es" | "en";
  pregunta: string;
  respuesta: string;
  fuentes: { codigo?: string; titulo: string; ancla: string }[];
  modo: "ia" | "offtopic" | "local";
  proveedor?: string;
  modelo?: string;
  tokensIn?: number;
  tokensOut?: number;
  ms?: number;
};
