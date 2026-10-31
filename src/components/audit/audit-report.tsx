//#region File Documentation
/**
 * File: src/components/audit/audit-report.tsx
 * Updated: 2026-10-30
 *
 * Purpose:
 * - Full audit report layout used by both portals.
 * - Admin variant: everything. Client variant: summary, score, breakdown, critical issues, quick wins.
 * - Rendering model: Server Component (no hooks).
 *
 * Changes:
 * - New file.
 *
 * Safety:
 * - Presentational only. The result is already validated by zod before it reaches this component.
 *
 * Connected Modules:
 * - src/components/audit/*, src/data/audit-copy.ts, src/types/audit.ts
 *
 * Dependencies:
 * - None.
 */
//#endregion

import { IssueList } from "@/components/audit/issue-list";
import { RecommendationsList } from "@/components/audit/recommendations-list";
import { ScoreBreakdown } from "@/components/audit/score-breakdown";
import { ScoreSummary } from "@/components/audit/score-summary";
import { auditCopy } from "@/data/audit-copy";
import type { AuditResult } from "@/types/audit";

interface AuditReportProps {
  result: AuditResult;
  variant: "admin" | "client";
}

export function AuditReport({ result, variant }: AuditReportProps) {
  const isAdmin = variant === "admin";

  return (
    <div className="space-y-8">
      <div className="grid gap-6 lg:grid-cols-3 lg:items-start">
        <ScoreSummary score={result.overall_score} />
        <section aria-labelledby="summary-heading" className="space-y-2 lg:col-span-2">
          <h2 id="summary-heading" className="text-base font-semibold">
            {auditCopy.sections.summary}
          </h2>
          <p className="break-words text-sm leading-relaxed">{result.executive_summary}</p>
        </section>
      </div>

      <section aria-labelledby="breakdown-heading" className="space-y-3">
        <h2 id="breakdown-heading" className="text-base font-semibold">
          {auditCopy.sections.breakdown}
        </h2>
        <ScoreBreakdown breakdown={result.score_breakdown} />
      </section>

      <IssueList
        headingId="critical-heading"
        title={auditCopy.sections.critical}
        items={result.critical_issues}
        emptyText={auditCopy.empty.critical}
      />

      {isAdmin ? (
        <IssueList
          headingId="important-heading"
          title={auditCopy.sections.important}
          items={result.important_issues}
          emptyText={auditCopy.empty.important}
        />
      ) : null}

      <IssueList
        headingId="quick-wins-heading"
        title={auditCopy.sections.quickWins}
        items={result.quick_wins}
        emptyText={auditCopy.empty.quickWins}
      />

      {isAdmin ? (
        <RecommendationsList
          headingId="recommendations-heading"
          recommendations={result.recommendations}
        />
      ) : null}
    </div>
  );
}