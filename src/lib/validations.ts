//#region File Documentation
/**
 * File: src/lib/validations.ts
 * Updated: 2026-10-30
 *
 * Purpose:
 * - Zod schemas for every API input (client create, audit create, list query, id param).
 * - Rendering model: Shared module (safe for server and client forms).
 *
 * Changes:
 * - New file.
 *
 * Safety:
 * - Empty optional fields become null. URLs must be http or https.
 *
 * Connected Modules:
 * - src/lib/api-response.ts, src/app/api/**
 *
 * Dependencies:
 * - zod: runtime validation.
 */
//#endregion

import { z } from "zod";

function optionalField(schema: z.ZodString) {
  return z
    .union([z.literal(""), schema])
    .optional()
    .transform((value) => (value ? value : null));
}

const requiredText = (label: string) =>
  z
    .string()
    .trim()
    .min(2, `${label} must be at least 2 characters`)
    .max(100, `${label} must be at most 100 characters`);

export const idSchema = z
  .string()
  .regex(/^[A-Za-z0-9_-]{1,64}$/, "Invalid id");

export const createClientSchema = z.object({
  name: requiredText("Client name"),
  websiteUrl: z
    .string()
    .trim()
    .min(1, "Website URL is required")
    .max(2048, "Website URL is too long")
    .url("Enter a valid URL")
    .refine((value) => /^https?:\/\//i.test(value), "URL must start with http:// or https://"),
  businessType: requiredText("Business type"),
  city: requiredText("City"),
  state: requiredText("State"),
  contactEmail: optionalField(
    z.string().trim().email("Enter a valid email address").max(254),
  ),
  whatsappNumber: optionalField(
    z
      .string()
      .trim()
      .regex(/^\+[1-9]\d{7,14}$/, "Use international format, for example +919876543210"),
  ),
});

export const createAuditSchema = z.object({
  clientId: idSchema,
});

export const listAuditsQuerySchema = z.object({
  clientId: idSchema.optional(),
  limit: z.coerce.number().int().min(1).max(100).default(20),
});

export type CreateClientInput = z.output<typeof createClientSchema>;
export type CreateAuditInput = z.output<typeof createAuditSchema>;