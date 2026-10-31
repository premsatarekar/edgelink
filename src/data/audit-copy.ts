//#region File Documentation
/**
 * File: src/data/audit-copy.ts
 * Updated: 2026-10-30
 *
 * Purpose:
 * - All text for the audit report views, the audit detail page and the client dashboard.
 * - Rendering model: Shared data module (server and client components).
 *
 * Changes:
 * - New file.
 *
 * Safety:
 * - Data only. Components never hardcode strings.
 *
 * Connected Modules:
 * - src/components/audit/*, src/app/admin/audits/[id]/page.tsx, src/app/dashboard/*
 *
 * Dependencies:
 * - None.
 */
//#endregion

import type { AuditResult } from "@/types/audit";
import type { ScoreBand } from "@/types/audit-detail";

type Recommendation = AuditResult["recommendations"][number];

export const auditCopy = {
  scoreOutOf: "out of 100",
  scoreBand: {
    good: "Good",
    fair: "Needs work",
    poor: "Poor",
  } satisfies Record<ScoreBand, string>,
  sections: {
    summary: "Executive summary",
    breakdown: "Score breakdown",
    critical: "Critical issues",
    important: "Important issues",
    quickWins: "Quick wins",
    recommendations: "Recommendations",
  },
  empty: {
    critical: "No critical issues found.",
    important: "No important issues found.",
    quickWins: "No quick wins identified.",
  },
  breakdownLabels: {
    technical: "Technical",
    on_page: "On-page",
    content: "Content",
    core_web_vitals: "Core Web Vitals",
    schema: "Schema",
  } satisfies Record<keyof AuditResult["score_breakdown"], string>,
  recommendation: {
    fix: "How to fix",
    verify: "How to verify",
    impact: "Impact",
    effort: "Effort",
  },
  priority: {
    CRITICAL: "Critical",
    HIGH: "High",
    MEDIUM: "Medium",
    LOW: "Low",
  } satisfies Record<Recommendation["priority"], string>,
  category: {
    Technical: "Technical",
    OnPage: "On-page",
    Content: "Content",
    Schema: "Schema",
    CWV: "Core Web Vitals",
  } satisfies Record<Recommendation["category"], string>,
  downloadPdf: "Download PDF report",
  viewReport: "View report",
  clientDashboard: "Client dashboard",
  admin: {
    metaTitle: "Audit report | SEO Automation",
    back: "Back to audits",
    generated: (date: string) => `Generated ${date}`,
    businessLine: (type: string, city: string, state: string) => `${type} | ${city}, ${state}`,
    inProgressTitle: "This audit is still running",
    inProgressDescription: (percent: number) =>
      `Progress is at ${percent}%. The report will appear here when it finishes.`,
    failedTitle: "This audit failed",
    failedFallback: "No error details were saved.",
    unavailableTitle: "Report details are not available",
    unavailableDescription: "This audit has no saved analysis. Run a new audit from the Clients page.",
  },
  dashboard: {
    metaTitle: "Client dashboard | SEO Automation",
    skipLink: "Skip to main content",
    brand: "SEO Automation",
    portalLabel: "Client dashboard",
    title: "SEO health report",
    updated: (date: string) => `Last updated ${date}`,
    emptyTitle: "Your first report is on its way",
    emptyDescription: "We are preparing your first SEO audit. Please check back soon.",
    unavailableTitle: "Report details are not available",
    unavailableDescription: "Please contact your account manager for the latest report.",
    historyTitle: "Score history",
    error: {
      title: "Something went wrong",
      description: "We could not load your report. Please try again.",
      retry: "Try again",
    },
  },
} as const;