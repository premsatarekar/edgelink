//#region File Documentation
/**
 * File: src/lib/env.ts
 * Updated: 2026-10-29
 *
 * Purpose:
 * - Validates all environment variables once with zod and exports a typed env object.
 * - Rendering model: Server-only module (never import in a Client Component).
 *
 * Changes:
 * - New file.
 *
 * Safety:
 * - No existing logic touched. Fails fast with a clear message when a variable is missing.
 *
 * Connected Modules:
 * - src/lib/redis.ts, scripts/check-connections.ts
 *
 * Dependencies:
 * - zod: runtime schema validation of process.env.
 */
//#endregion

import { z } from "zod";

const envSchema = z.object({
  DATABASE_URL: z.string().url(),
  DIRECT_URL: z.string().url(),
  REDIS_URL: z.string().url(),
  ANTHROPIC_API_KEY: z.string().optional(),
  CRON_SECRET: z.string().min(16, "CRON_SECRET must be at least 16 characters"),
  USE_MOCKS: z
    .enum(["true", "false"])
    .default("true")
    .transform((value) => value === "true"),
});

const parsed = envSchema.safeParse(process.env);

if (!parsed.success) {
  const details = parsed.error.issues
    .map((issue) => `${issue.path.join(".")}: ${issue.message}`)
    .join("\n");
  throw new Error(`Invalid environment variables:\n${details}`);
}

export const env = parsed.data;