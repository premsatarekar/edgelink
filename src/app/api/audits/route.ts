//#region File Documentation
/**
 * File: src/app/api/audits/route.ts
 * Updated: 2026-10-30
 *
 * Purpose:
 * - POST creates an audit and queues it in BullMQ. GET lists audits.
 * - Rendering model: Route Handler (Node runtime).
 *
 * Changes:
 * - New file.
 *
 * Safety:
 * - Returns 202 immediately; the worker does the long job. Keeps the route well under 10 seconds.
 * - Blocks a second audit while one is active (409). Audits older than 30 minutes are ignored
 *   here so a stuck QUEUED row cannot block a client forever.
 * - If queueing fails, the audit is marked FAILED and 503 is returned.
 *
 * Connected Modules:
 * - src/queue/audit.queue.ts, src/lib/validations.ts, src/lib/api-response.ts
 *
 * Dependencies:
 * - @prisma/client: database access (via src/lib/prisma.ts).
 * - bullmq: queue (via src/queue/audit.queue.ts).
 */
//#endregion

import { AuditStatus } from "@prisma/client";
import { formatIssues, jsonError, jsonOk, parseJsonBody, serverError } from "@/lib/api-response";
import { prisma } from "@/lib/prisma";
import { createAuditSchema, listAuditsQuerySchema } from "@/lib/validations";
import { enqueueAudit } from "@/queue/audit.queue";

export const dynamic = "force-dynamic";

const ACTIVE_WINDOW_MS = 30 * 60 * 1000;

export async function GET(request: Request) {
  try {
    const query = listAuditsQuerySchema.safeParse(
      Object.fromEntries(new URL(request.url).searchParams),
    );
    if (!query.success) {
      return jsonError("Invalid query", 400, formatIssues(query.error.issues));
    }

    const audits = await prisma.audit.findMany({
      where: query.data.clientId ? { clientId: query.data.clientId } : undefined,
      orderBy: { createdAt: "desc" },
      take: query.data.limit,
      select: {
        id: true,
        clientId: true,
        status: true,
        progress: true,
        currentStep: true,
        overallScore: true,
        errorMessage: true,
        createdAt: true,
        startedAt: true,
        completedAt: true,
        client: { select: { name: true, websiteUrl: true } },
      },
    });
    return jsonOk(audits);
  } catch (error) {
    return serverError(error);
  }
}

export async function POST(request: Request) {
  try {
    const parsed = await parseJsonBody(request, createAuditSchema);
    if (!parsed.success) return parsed.response;

    const client = await prisma.client.findUnique({
      where: { id: parsed.data.clientId },
      select: { id: true },
    });
    if (!client) {
      return jsonError("Client not found", 404);
    }

    const activeAudit = await prisma.audit.findFirst({
      where: {
        clientId: client.id,
        status: { in: [AuditStatus.QUEUED, AuditStatus.RUNNING] },
        createdAt: { gte: new Date(Date.now() - ACTIVE_WINDOW_MS) },
      },
      select: { id: true },
    });
    if (activeAudit) {
      return jsonError("An audit is already running for this client", 409);
    }

    const audit = await prisma.audit.create({ data: { clientId: client.id } });

    try {
      await enqueueAudit(audit.id);
    } catch (queueError) {
      console.error("[api] could not queue audit:", queueError);
      await prisma.audit.update({
        where: { id: audit.id },
        data: {
          status: AuditStatus.FAILED,
          currentStep: "Failed",
          errorMessage: "Could not add the audit to the queue",
        },
      });
      return jsonError("Could not queue the audit. Please try again.", 503);
    }

    return jsonOk(
      {
        id: audit.id,
        clientId: audit.clientId,
        status: audit.status,
        progress: audit.progress,
        createdAt: audit.createdAt,
      },
      202,
    );
  } catch (error) {
    return serverError(error);
  }
}