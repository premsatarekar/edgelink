//#region File Documentation
/**
 * File: src/lib/dashboard-queries.ts
 * Updated: 2026-10-31
 * Purpose: Server-side queries and aggregation for the admin dashboard.
 * Rendering model: Server-only module (never import in a Client Component).
 * Changes: New file.
 * Safety: Read-only. Each client's latest completed result is re-validated with zod; invalid ones are skipped.
 * Connected Modules: src/lib/audit-queries.ts, src/lib/audit-schema.ts, src/lib/prisma.ts, src/app/admin/page.tsx
 * Dependencies: @prisma/client (via src/lib/prisma.ts), zod (via audit-schema).
 */
//#endregion

import { AuditStatus } from "@prisma/client";
import { getAuditDetail, getAuditList } from "@/lib/audit-queries";
import { auditResultSchema } from "@/lib/audit-schema";
import { prisma } from "@/lib/prisma";
import type { AuditStatusValue } from "@/types/client";
import type { BreakdownKey, DashboardData, TopIssue } from "@/types/dashboard";

const BREAKDOWN_KEYS: BreakdownKey[] = [
  "technical",
  "on_page",
  "content",
  "core_web_vitals",
  "schema",
];
const WEEK_MS = 7 * 24 * 60 * 60 * 1000;
const TOP_ISSUE_LIMIT = 5;
const RECENT_AUDIT_LIMIT = 5;

export async function getDashboardData(): Promise<DashboardData> {
  const [grouped, thisWeek, clientRows, recentAudits, latestCompleted] = await Promise.all([
    prisma.audit.groupBy({ by: ["status"], _count: { _all: true } }),
    prisma.audit.count({ where: { createdAt: { gte: new Date(Date.now() - WEEK_MS) } } }),
    prisma.client.findMany({
      orderBy: { createdAt: "desc" },
      take: 100,
      select: {
        id: true,
        name: true,
        websiteUrl: true,
        audits: {
          where: { status: AuditStatus.COMPLETED },
          orderBy: { createdAt: "desc" },
          take: 1,
          select: { result: true },
        },
      },
    }),
    getAuditList(RECENT_AUDIT_LIMIT),
    prisma.audit.findFirst({
      where: { status: AuditStatus.COMPLETED },
      orderBy: { createdAt: "desc" },
      select: { id: true },
    }),
  ]);

  const counts: Record<AuditStatusValue, number> = {
    QUEUED: 0,
    RUNNING: 0,
    COMPLETED: 0,
    FAILED: 0,
  };
  for (const row of grouped) {
    counts[row.status] = row._count._all;
  }
  const finished = counts.COMPLETED + counts.FAILED;

  const sums: Record<BreakdownKey, number> = {
    technical: 0,
    on_page: 0,
    content: 0,
    core_web_vitals: 0,
    schema: 0,
  };
  const issueCounts = new Map<string, number>();
  let overallSum = 0;
  let reportCount = 0;

  for (const client of clientRows) {
    const row = client.audits[0];
    if (!row) continue;
    const parsed = auditResultSchema.safeParse(row.result);
    if (!parsed.success) continue;

    reportCount += 1;
    overallSum += parsed.data.overall_score;
    for (const key of BREAKDOWN_KEYS) {
      sums[key] += parsed.data.score_breakdown[key];
    }
    for (const issue of parsed.data.critical_issues) {
      issueCounts.set(issue, (issueCounts.get(issue) ?? 0) + 1);
    }
  }

  const topIssues: TopIssue[] = Array.from(issueCounts.entries())
    .map(([text, count]) => ({ text, count }))
    .sort((a, b) => b.count - a.count)
    .slice(0, TOP_ISSUE_LIMIT);

  return {
    stats: {
      total: grouped.reduce((sum, row) => sum + row._count._all, 0),
      completed: counts.COMPLETED,
      inProgress: counts.QUEUED + counts.RUNNING,
      running: counts.RUNNING,
      failed: counts.FAILED,
      thisWeek,
      successRate: finished > 0 ? Math.round((counts.COMPLETED / finished) * 100) : null,
    },
    scoreOverview: {
      average: reportCount > 0 ? Math.round(overallSum / reportCount) : null,
      clientCount: reportCount,
      categories:
        reportCount > 0
          ? BREAKDOWN_KEYS.map((key) => ({ key, value: Math.round(sums[key] / reportCount) }))
          : [],
    },
    topIssues,
    recentAudits,
    latestAudit: latestCompleted ? await getAuditDetail(latestCompleted.id) : null,
    clients: clientRows.map(({ id, name, websiteUrl }) => ({ id, name, websiteUrl })),
  };
}