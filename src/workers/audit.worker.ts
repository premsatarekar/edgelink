//#region File Documentation
/**
 * File: src/workers/audit.worker.ts
 * Updated: 2026-10-30
 *
 * Purpose:
 * - Long-running BullMQ worker that picks jobs from seo-audit-jobs and runs the pipeline.
 * - Rendering model: Standalone Node process (not part of the Next.js app).
 *
 * Changes:
 * - New file.
 *
 * Safety:
 * - Concurrency 1 so Upstash command usage and crawl load stay small.
 * - drainDelay of 30 seconds reduces idle Redis polling (Upstash free tier is command-limited).
 * - Closes the worker and database cleanly on Ctrl+C.
 *
 * Connected Modules:
 * - src/queue/audit.queue.ts, src/queue/connection.ts, src/workers/audit-pipeline.ts
 *
 * Dependencies:
 * - bullmq: Worker class.
 */
//#endregion

import { Worker } from "bullmq";
import { prisma } from "@/lib/prisma";
import { AUDIT_QUEUE_NAME, type AuditJobData } from "@/queue/audit.queue";
import { getBullConnection } from "@/queue/connection";
import { runAuditPipeline } from "@/workers/audit-pipeline";

const worker = new Worker<AuditJobData>(
  AUDIT_QUEUE_NAME,
  async (job) => {
    console.log(`[worker] picked job ${job.id}`);
    await runAuditPipeline(job.data.auditId, async (percent) => {
      await job.updateProgress(percent);
    });
  },
  {
    connection: getBullConnection(),
    concurrency: 1,
    drainDelay: 30,
    lockDuration: 120_000,
  },
);

worker.on("completed", (job) => {
  console.log(`[worker] job ${job.id} completed`);
});

worker.on("failed", (job, error) => {
  console.error(`[worker] job ${job?.id ?? "unknown"} failed: ${error.message}`);
});

worker.on("error", (error) => {
  console.error("[worker] error:", error.message);
});

async function shutdown(signal: string): Promise<void> {
  console.log(`[worker] ${signal} received, shutting down`);
  await worker.close();
  await prisma.$disconnect();
  process.exit(0);
}

process.on("SIGINT", () => void shutdown("SIGINT"));
process.on("SIGTERM", () => void shutdown("SIGTERM"));

console.log(`[worker] listening on queue "${AUDIT_QUEUE_NAME}"`);