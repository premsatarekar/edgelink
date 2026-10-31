//#region File Documentation
/**
 * File: src/types/audit-list.ts
 * Updated: 2026-10-30
 *
 * Purpose:
 * - Types for live audit progress (polling) and the audit history list.
 * - Rendering model: Types only, no runtime code.
 *
 * Changes:
 * - New file.
 *
 * Safety:
 * - Types only. Dates are ISO strings so data can cross the server/client boundary.
 *
 * Connected Modules:
 * - src/lib/audit-queries.ts, src/components/admin/audit-controls.tsx,
 *   src/components/admin/audits-table.tsx
 *
 * Dependencies:
 * - None.
 */
//#endregion

import type { AuditStatusValue } from "@/types/client";

export interface AuditProgressData {
  status: AuditStatusValue;
  progress: number;
  currentStep: string | null;
  errorMessage: string | null;
  overallScore: number | null;
}

export interface AuditListItem {
  id: string;
  clientId: string;
  clientName: string;
  websiteUrl: string;
  status: AuditStatusValue;
  progress: number;
  currentStep: string | null;
  overallScore: number | null;
  errorMessage: string | null;
  hasPdf: boolean;
  createdAt: string;
  completedAt: string | null;
}