//#region File Documentation
/**
 * File: src/queue/audit.queue.ts
 * Updated: 2026-10-30
 *
 * Purpose:
 * - Defines the seo-audit-jobs queue and the enqueueAudit helper.
 * - Rendering model: Server-only module (Route Handlers, scripts, workers).
 *
 * Changes:
 * - New file.
 *
 * Safety:
 * - jobId equals auditId, so the same audit can never be queued twice at once.
 * - Finished jobs are removed automatically to save Upstash storage and commands.
 *
 * Connected Modules:
 * - src/queue/connection.ts, src/workers/audit.worker.ts, scripts/enqueue-test-audit.ts
 *
 * Dependencies:
 * - bullmq: job queue on top of Redis.
 */
//#endregion

import { Queue } from "bullmq";
import { getBullConnection } from "@/queue/connection";

export const AUDIT_QUEUE_NAME = "seo-audit-jobs";

export interface AuditJobData {
  auditId: string;
}

const globalForQueue = globalThis as unknown as {
  auditQueue?: Queue<AuditJobData>;
};

export function getAuditQueue(): Queue<AuditJobData> {
  if (!globalForQueue.auditQueue) {
    globalForQueue.auditQueue = new Queue<AuditJobData>(AUDIT_QUEUE_NAME, {
      connection: getBullConnection(),
    });
  }
  return globalForQueue.auditQueue;
}

export async function enqueueAudit(auditId: string): Promise<void> {
  await getAuditQueue().add(
    "run-audit",
    { auditId },
    {
      jobId: auditId,
      attempts: 1,
      removeOnComplete: { age: 24 * 60 * 60, count: 100 },
      removeOnFail: { age: 7 * 24 * 60 * 60, count: 100 },
    },
  );
}