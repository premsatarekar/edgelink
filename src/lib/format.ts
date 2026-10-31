//#region File Documentation
/**
 * File: src/lib/format.ts
 * Updated: 2026-10-30
 *
 * Purpose:
 * - Shared date formatting and score band helpers for audit views.
 * - Rendering model: Shared module (server and client).
 *
 * Changes:
 * - New file.
 *
 * Safety:
 * - Dates use the Asia/Kolkata zone, so server and viewer always see the same time.
 *
 * Connected Modules:
 * - src/components/audit/*, src/app/admin/audits/[id]/page.tsx, src/app/dashboard/[clientId]/page.tsx
 *
 * Dependencies:
 * - None.
 */
//#endregion

import type { ScoreBand } from "@/types/audit-detail";

const dateTimeFormatter = new Intl.DateTimeFormat("en-IN", {
  dateStyle: "medium",
  timeStyle: "short",
  timeZone: "Asia/Kolkata",
});

export function formatDateTime(iso: string): string {
  return dateTimeFormatter.format(new Date(iso));
}

export function getScoreBand(score: number): ScoreBand {
  if (score >= 80) return "good";
  if (score >= 60) return "fair";
  return "poor";
}

export const SCORE_BAND_STYLES: Record<ScoreBand, { text: string; bar: string }> = {
  good: { text: "text-green-700", bar: "bg-green-600" },
  fair: { text: "text-amber-700", bar: "bg-amber-600" },
  poor: { text: "text-red-700", bar: "bg-red-600" },
};