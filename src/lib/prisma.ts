//#region File Documentation
/**
 * File: src/lib/prisma.ts
 * Updated: 2026-10-29
 *
 * Purpose:
 * - Exposes a single shared PrismaClient instance for the whole app.
 * - Rendering model: Server-only module.
 *
 * Changes:
 * - New file.
 *
 * Safety:
 * - No existing logic touched. Reuses one client across hot reloads in development.
 *
 * Connected Modules:
 * - prisma/schema.prisma, scripts/check-connections.ts
 *
 * Dependencies:
 * - @prisma/client: database access.
 */
//#endregion

import { PrismaClient } from "@prisma/client";

const globalForPrisma = globalThis as unknown as { prisma?: PrismaClient };

export const prisma =
  globalForPrisma.prisma ??
  new PrismaClient({
    log: process.env.NODE_ENV === "development" ? ["error", "warn"] : ["error"],
  });

if (process.env.NODE_ENV !== "production") {
  globalForPrisma.prisma = prisma;
}