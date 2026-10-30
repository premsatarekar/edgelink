//#region File Documentation
/**
 * File: src/app/api/cron/audit/route.ts
 * Updated: 2026-10-30
 *
 * Purpose:
 * - Called by cron-job.org. Queues audits for clients with no audit in the last 30 days.
 * - Rendering model: Route Handler (Node runtime).
 *
 * Changes:
 * - New file.
 *
 * Safety:
 * - Requires the header "Authorization: Bearer <CRON_SECRET>", compared in constant time.
 * - Queues at most 3 clients per call so the route stays under Vercel's 10 second limit.
 * - Any audit in the last 30 days (even a failed one) counts, so a broken site is not
 *   retried on every cron call.
 *
 * Connected Modules:
 * - src/queue/audit.queue.ts, src/lib/env.ts, src/lib/prisma.ts
 *
 * Dependencies:
 * - bullmq: queue (via src/queue/audit.queue.ts).
 */
//#endregion

import { timingSafeEqual } from "node:crypto";
import { AuditStatus } from "@prisma/client";
import { jsonError, jsonOk, serverError } from "@/lib/api-response";
import { env } from "@/lib/env";
import { prisma } from "@/lib/prisma";
import { enqueueAudit } from "@/queue/audit.queue";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

const AUDIT_INTERVAL_MS = 30 * 24 * 60 * 60 * 1000;
const MAX_CLIENTS_PER_RUN = 3;

function isAuthorized(request: Request): boolean {
  const provided = Buffer.from(request.headers.get("authorization") ?? "");
  const expected = Buffer.from(`Bearer ${env.CRON_SECRET}`);
  return provided.length === expected.length && timingSafeEqual(provided, expected);
}

export async function GET(request: Request) {
  try {
    if (!isAuthorized(request)) {
      return jsonError("Unauthorized", 401);
    }

    const cutoff = new Date(Date.now() - AUDIT_INTERVAL_MS);
    const dueClients = await prisma.client.findMany({
      where: { NOT: { audits: { some: { createdAt: { gte: cutoff } } } } },
      take: MAX_CLIENTS_PER_RUN,
      select: { id: true },
    });

    const queuedAuditIds: string[] = [];

    for (const client of dueClients) {
      const audit = await prisma.audit.create({ data: { clientId: client.id } });
      try {
        await enqueueAudit(audit.id);
        queuedAuditIds.push(audit.id);
      } catch (queueError) {
        console.error("[cron] could not queue audit:", queueError);
        await prisma.audit.update({
          where: { id: audit.id },
          data: {
            status: AuditStatus.FAILED,
            currentStep: "Failed",
            errorMessage: "Could not add the audit to the queue",
          },
        });
      }
    }

    return jsonOk({ dueClients: dueClients.length, queued: queuedAuditIds.length, queuedAuditIds });
  } catch (error) {
    return serverError(error);
  }
}