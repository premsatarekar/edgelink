//#region File Documentation
/**
 * File: src/lib/redis.ts
 * Updated: 2026-10-29
 *
 * Purpose:
 * - Exposes a single shared ioredis connection to Upstash Redis.
 * - Rendering model: Server-only module.
 *
 * Changes:
 * - New file.
 *
 * Safety:
 * - No existing logic touched. maxRetriesPerRequest is null as BullMQ requires.
 *
 * Connected Modules:
 * - src/lib/env.ts (REDIS_URL), scripts/check-connections.ts
 *
 * Dependencies:
 * - ioredis: Redis client, also used by BullMQ later.
 */
//#endregion

import IORedis from "ioredis";
import { env } from "./env";

const globalForRedis = globalThis as unknown as { redis?: IORedis };

export const redis =
  globalForRedis.redis ??
  new IORedis(env.REDIS_URL, {
    maxRetriesPerRequest: null,
    lazyConnect: true,
  });

if (process.env.NODE_ENV !== "production") {
  globalForRedis.redis = redis;
}