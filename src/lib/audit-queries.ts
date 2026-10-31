//#region File Documentation
/**
 * File: src/lib/audit-queries.ts
 * Updated: 2026-10-30
 *
 * Purpose:
 * - Server-side database query for the audit history page.
 * - Rendering model: Server-only module (never import in a Client Component).
 *
 * Changes:
 * - New file.
 *
 * Safety:
 * - Read-only. The server file path of the PDF is not exposed, only a hasPdf flag.
 *
 * Connected Modules:
 * - src/lib/prisma.ts, src/types/audit-list.ts, src/app/admin/audits/page.tsx
 *
 * Dependencies:
 * - @prisma/client: database access (via src/lib/prisma.ts).
 */
//#endregion

import { prisma } from "@/lib/prisma";
import type { AuditListItem } from "@/types/audit-list";

export async function getAuditList(limit = 50): Promise<AuditListItem[]> {
  const audits = await prisma.audit.findMany({
    orderBy: { createdAt: "desc" },
    take: limit,
    select: {
      id: true,
      clientId: true,
      status: true,
      progress: true,
      currentStep: true,
      overallScore: true,
      errorMessage: true,
      pdfPath: true,
      createdAt: true,
      completedAt: true,
      client: { select: { name: true, websiteUrl: true } },
    },
  });

  return audits.map((audit) => ({
    id: audit.id,
    clientId: audit.clientId,
    clientName: audit.client.name,
    websiteUrl: audit.client.websiteUrl,
    status: audit.status,
    progress: audit.progress,
    currentStep: audit.currentStep,
    overallScore: audit.overallScore,
    errorMessage: audit.errorMessage,
    hasPdf: Boolean(audit.pdfPath),
    createdAt: audit.createdAt.toISOString(),
    completedAt: audit.completedAt ? audit.completedAt.toISOString() : null,
  }));
}