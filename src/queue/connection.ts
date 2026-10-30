//#region File Documentation
/**
 * File: src/queue/connection.ts
 * Updated: 2026-10-30
 *
 * Purpose:
 * - Builds BullMQ connection options from REDIS_URL (Upstash, TLS supported).
 * - Rendering model: Server-only module.
 *
 * Changes:
 * - New file.
 *
 * Safety:
 * - Returns plain options so BullMQ creates its own connections (no ioredis version clash).
 * - maxRetriesPerRequest is null as BullMQ workers require.
 *
 * Connected Modules:
 * - src/lib/env.ts, src/queue/audit.queue.ts, src/workers/audit.worker.ts
 *
 * Dependencies:
 * - bullmq: type of the connection options.
 */
//#endregion

import type { ConnectionOptions } from "bullmq";
import { env } from "@/lib/env";

export function getBullConnection(): ConnectionOptions {
  const url = new URL(env.REDIS_URL);

  return {
    host: url.hostname,
    port: Number(url.port) || 6379,
    username: url.username ? decodeURIComponent(url.username) : undefined,
    password: url.password ? decodeURIComponent(url.password) : undefined,
    tls: url.protocol === "rediss:" ? {} : undefined,
    maxRetriesPerRequest: null,
  };
}