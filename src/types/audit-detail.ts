//#region File Documentation
/**
 * File: src/types/audit-detail.ts
 * Updated: 2026-10-30
 *
 * Purpose:
 * - Types for the audit detail page and the client dashboard.
 * - Rendering model: Types only, no runtime code.
 *
 * Changes:
 * - New file.
 *
 * Safety:
 * - Types only. Dates are ISO strings so data can cross the server/client boundary.
 *
 * Connected Modules:
 * - src/lib/audit-queries.ts, src/components/audit/*, src/app/admin/audits/[id]/page.tsx,
 *   src/app/dashboard/[clientId]/page.tsx
 *
 * Dependencies:
 * - None.
 */
//#endregion

import type { AuditResult } from "@/types/audit";
import type { AuditStatusValue } from "@/types/client";

export type ScoreBand = "good" | "fair" | "poor";

export interface AuditDetail {
  id: string;
  clientId: string;
  clientName: string;
  websiteUrl: string;
  businessType: string;
  city: string;
  state: string;
  status: AuditStatusValue;
  progress: number;
  currentStep: string | null;
  errorMessage: string | null;
  overallScore: number | null;
  hasPdf: boolean;
  createdAt: string;
  startedAt: string | null;
  completedAt: string | null;
  result: AuditResult | null;
}

export interface ScoreHistoryItem {
  id: string;
  score: number;
  completedAt: string;
}

export interface ClientDashboardData {
  client: {
    id: string;
    name: string;
    websiteUrl: string;
    businessType: string;
    city: string;
    state: string;
  };
  latest: AuditDetail | null;
  history: ScoreHistoryItem[];
}