//#region File Documentation
/**
 * File: src/types/dashboard.ts
 * Updated: 2026-10-31
 * Purpose: Types for the admin dashboard, sidebar navigation and report tabs.
 * Rendering model: Types only.
 * Changes: New file.
 * Safety: Types only. Dates are ISO strings.
 * Connected Modules: src/lib/dashboard-queries.ts, src/data/dashboard-copy.ts, src/components/dashboard/*
 * Dependencies: None.
 */
//#endregion

import type { AuditResult } from "@/types/audit";
import type { AuditDetail } from "@/types/audit-detail";
import type { AuditListItem } from "@/types/audit-list";

export type NavIconKey = "dashboard" | "clients" | "audits";

export interface NavItem {
  label: string;
  href: string;
  icon: NavIconKey;
}

export type BreakdownKey = keyof AuditResult["score_breakdown"];
export type RecommendationCategory = AuditResult["recommendations"][number]["category"];
export type DetailsTabKey = "overview" | "technical" | "onPage" | "content" | "all";

export interface DetailsTab {
  key: DetailsTabKey;
  label: string;
  categories: RecommendationCategory[];
}

export interface DashboardStats {
  total: number;
  completed: number;
  inProgress: number;
  running: number;
  failed: number;
  thisWeek: number;
  successRate: number | null;
}

export interface CategoryAverage {
  key: BreakdownKey;
  value: number;
}

export interface ScoreOverview {
  average: number | null;
  clientCount: number;
  categories: CategoryAverage[];
}

export interface TopIssue {
  text: string;
  count: number;
}

export interface QuickAuditClient {
  id: string;
  name: string;
  websiteUrl: string;
}

export interface DashboardData {
  stats: DashboardStats;
  scoreOverview: ScoreOverview;
  topIssues: TopIssue[];
  recentAudits: AuditListItem[];
  latestAudit: AuditDetail | null;
  clients: QuickAuditClient[];
}