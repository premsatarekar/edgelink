//#region File Documentation
/**
 * File: src/components/audit/score-breakdown.tsx
 * Updated: 2026-10-30
 *
 * Purpose:
 * - The five category scores as labelled bars.
 * - Rendering model: Server Component (no hooks).
 *
 * Changes:
 * - New file.
 *
 * Safety:
 * - Every score is also printed as a number; the bar is decorative (aria-hidden).
 * - On small screens the bar sits under the label, from sm upwards it sits between label and value.
 *
 * Connected Modules:
 * - src/components/audit/audit-report.tsx, src/lib/format.ts, src/data/audit-copy.ts
 *
 * Dependencies:
 * - None.
 */
//#endregion

import { auditCopy } from "@/data/audit-copy";
import { getScoreBand, SCORE_BAND_STYLES } from "@/lib/format";
import { cn } from "@/lib/utils";
import type { AuditResult } from "@/types/audit";

type BreakdownKey = keyof AuditResult["score_breakdown"];

const BREAKDOWN_KEYS: BreakdownKey[] = [
  "technical",
  "on_page",
  "content",
  "core_web_vitals",
  "schema",
];

interface ScoreBreakdownProps {
  breakdown: AuditResult["score_breakdown"];
}

export function ScoreBreakdown({ breakdown }: ScoreBreakdownProps) {
  return (
    <ul className="space-y-4">
      {BREAKDOWN_KEYS.map((key) => {
        const value = breakdown[key];
        const band = getScoreBand(value);

        return (
          <li key={key} className="space-y-1.5 sm:flex sm:items-center sm:gap-4 sm:space-y-0">
            <div className="flex items-center justify-between gap-3 sm:contents">
              <span className="text-sm sm:order-1 sm:w-40 sm:shrink-0">
                {auditCopy.breakdownLabels[key]}
              </span>
              <span className="text-sm font-semibold tabular-nums sm:order-3 sm:w-10 sm:text-right">
                {value}
              </span>
            </div>
            <span
              aria-hidden="true"
              className="block h-2 overflow-hidden rounded-full bg-muted sm:order-2 sm:flex-1"
            >
              <span
                className={cn("block h-full rounded-full", SCORE_BAND_STYLES[band].bar)}
                style={{ width: `${value}%` }}
              />
            </span>
          </li>
        );
      })}
    </ul>
  );
}