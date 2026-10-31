//#region File Documentation
/**
 * File: src/app/admin/page.tsx
 * Updated: 2026-10-31
 * Purpose: Admin dashboard: quick audit bar, stats, recent audits, score overview, top issues, details.
 * Rendering model: Server Component (reads the database directly, dynamic rendering).
 * Changes: New file.
 * Safety: Data errors are caught by src/app/admin/error.tsx. Empty states are handled by each card.
 * Connected Modules: src/lib/dashboard-queries.ts, src/components/dashboard/*, src/data/dashboard-copy.ts
 * Dependencies: None.
 */
//#endregion

import type { Metadata } from "next";
import { LatestAuditDetails } from "@/components/dashboard/latest-audit-details";
import { QuickAuditForm } from "@/components/dashboard/quick-audit-form";
import { RecentAuditsCard } from "@/components/dashboard/recent-audits-card";
import { ScoreOverviewCard } from "@/components/dashboard/score-overview-card";
import { StatsGrid } from "@/components/dashboard/stats-grid";
import { TopIssuesCard } from "@/components/dashboard/top-issues-card";
import { dashboardCopy } from "@/data/dashboard-copy";
import { getDashboardData } from "@/lib/dashboard-queries";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: dashboardCopy.metaTitle,
};

export default async function AdminDashboardPage() {
  const data = await getDashboardData();
  const latest = data.latestAudit;

  return (
    <div className="space-y-6">
      <header>
        <h1 className="text-xl font-semibold sm:text-2xl">{dashboardCopy.title}</h1>
        <p className="mt-1 text-sm text-muted-foreground">{dashboardCopy.description}</p>
      </header>

      <QuickAuditForm clients={data.clients} />
      <StatsGrid stats={data.stats} />

      <div className="grid gap-6 xl:grid-cols-3 xl:items-start">
        <div className="min-w-0 xl:col-span-2">
          <RecentAuditsCard audits={data.recentAudits} />
        </div>
        <div className="min-w-0 space-y-6">
          <ScoreOverviewCard overview={data.scoreOverview} />
          <TopIssuesCard issues={data.topIssues} />
        </div>
      </div>

      {latest && latest.result ? (
        <LatestAuditDetails audit={{ ...latest, result: latest.result }} />
      ) : null}
    </div>
  );
}