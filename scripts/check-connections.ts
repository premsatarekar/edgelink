//#region File Documentation
/**
 * File: scripts/check-connections.ts
 * Updated: 2026-10-29
 *
 * Purpose:
 * - One-off developer script that verifies Postgres, Redis and env validation work.
 * - Rendering model: Node script (not part of the Next.js app bundle).
 *
 * Changes:
 * - New file.
 *
 * Safety:
 * - Read-only checks (SELECT 1 and PING). Writes nothing.
 *
 * Connected Modules:
 * - src/lib/env.ts, src/lib/prisma.ts, src/lib/redis.ts
 *
 * Dependencies:
 * - tsx: runs this TypeScript file directly.
 */
//#endregion

import { env } from "../src/lib/env";
import { prisma } from "../src/lib/prisma";
import { redis } from "../src/lib/redis";

async function main(): Promise<void> {
  console.log("USE_MOCKS:", env.USE_MOCKS);

  const rows = await prisma.$queryRaw<{ ok: number }[]>`SELECT 1 AS ok`;
  console.log("Postgres OK:", rows[0]?.ok === 1);

  const pong = await redis.ping();
  console.log("Redis OK:", pong === "PONG");
}

main()
  .catch((error: unknown) => {
    console.error("Connection check failed:", error);
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
    redis.disconnect();
  });