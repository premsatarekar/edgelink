//#region File Documentation
/**
 * File: src/lib/audit-queries.ts
 * Updated: 2026-10-30
 *
 * Purpose:
 * - Server-side database queries for the audit history, audit detail and client dashboard.
 * - Rendering model: Server-only module (never import in a Client Component).
 *
 * Changes:
 * - Added getAuditDetail and getClientDashboard. getAuditList is unchanged.
 *
 * Safety:
 * - Read-only. The Claude result is re-validated with zod; invalid data becomes result: null.
 * - The server file path of the PDF is never exposed, only a hasPdf flag.
 *
 * Connected Modules:
 * - src/lib/prisma.ts, src/lib/audit-schema.ts, src/types/audit-list.ts, src/types/audit-detail.ts,
 *   src/app/admin/audits/page.tsx, src/app/admin/audits/[id]/page.tsx,
 *   src/app/dashboard/[clientId]/page.tsx
 *
 * Dependencies:
 * - @prisma/client: database access (via src/lib/prisma.ts).
 * - zod (via audit-schema): result validation.
 */
//#endregion

import { auditResultSchema } from '@/lib/audit-schema';
import { prisma } from '@/lib/prisma';
import type {
  AuditDetail,
  ClientDashboardData,
  ScoreHistoryItem,
} from '@/types/audit-detail';
import type { AuditListItem } from '@/types/audit-list';
import { AuditStatus, type Prisma } from '@prisma/client';

const auditDetailSelect = {
  id: true,
  clientId: true,
  status: true,
  progress: true,
  currentStep: true,
  overallScore: true,
  result: true,
  pdfPath: true,
  errorMessage: true,
  createdAt: true,
  startedAt: true,
  completedAt: true,
  client: {
    select: {
      name: true,
      websiteUrl: true,
      businessType: true,
      city: true,
      state: true,
    },
  },
} satisfies Prisma.AuditSelect;

type AuditDetailRow = Prisma.AuditGetPayload<{
  select: typeof auditDetailSelect;
}>;

function toAuditDetail(row: AuditDetailRow): AuditDetail {
  const parsed = auditResultSchema.safeParse(row.result);

  return {
    id: row.id,
    clientId: row.clientId,
    clientName: row.client.name,
    websiteUrl: row.client.websiteUrl,
    businessType: row.client.businessType,
    city: row.client.city,
    state: row.client.state,
    status: row.status,
    progress: row.progress,
    currentStep: row.currentStep,
    errorMessage: row.errorMessage,
    overallScore: row.overallScore,
    hasPdf: Boolean(row.pdfPath),
    createdAt: row.createdAt.toISOString(),
    startedAt: row.startedAt ? row.startedAt.toISOString() : null,
    completedAt: row.completedAt ? row.completedAt.toISOString() : null,
    result: parsed.success ? parsed.data : null,
  };
}

export async function getAuditList(limit = 50): Promise<AuditListItem[]> {
  const audits = await prisma.audit.findMany({
    orderBy: { createdAt: 'desc' },
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

export async function getAuditDetail(id: string): Promise<AuditDetail | null> {
  const row = await prisma.audit.findUnique({
    where: { id },
    select: auditDetailSelect,
  });
  return row ? toAuditDetail(row) : null;
}

export async function getClientDashboard(
  clientId: string
): Promise<ClientDashboardData | null> {
  const client = await prisma.client.findUnique({
    where: { id: clientId },
    select: {
      id: true,
      name: true,
      websiteUrl: true,
      businessType: true,
      city: true,
      state: true,
    },
  });
  if (!client) return null;

  const [latest, historyRows] = await Promise.all([
    prisma.audit.findFirst({
      where: { clientId, status: AuditStatus.COMPLETED },
      orderBy: { createdAt: 'desc' },
      select: auditDetailSelect,
    }),
    prisma.audit.findMany({
      where: {
        clientId,
        status: AuditStatus.COMPLETED,
        overallScore: { not: null },
        completedAt: { not: null },
      },
      orderBy: { createdAt: 'desc' },
      take: 6,
      select: { id: true, overallScore: true, completedAt: true },
    }),
  ]);

  const history: ScoreHistoryItem[] = historyRows.flatMap((row) =>
    row.overallScore !== null && row.completedAt
      ? [
          {
            id: row.id,
            score: row.overallScore,
            completedAt: row.completedAt.toISOString(),
          },
        ]
      : []
  );

  return { client, latest: latest ? toAuditDetail(latest) : null, history };
}
