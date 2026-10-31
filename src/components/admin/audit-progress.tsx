//#region File Documentation
/**
 * File: src/components/admin/audit-progress.tsx
 * Updated: 2026-10-30
 *
 * Purpose:
 * - Progress bar with status badge, percentage and the current pipeline step.
 * - Rendering model: Presentational component (no hooks, usable in client components).
 *
 * Changes:
 * - New file.
 *
 * Safety:
 * - Exposed to assistive technology with role="progressbar" and a polite live region for the step.
 *
 * Connected Modules:
 * - src/components/admin/audit-controls.tsx, src/components/admin/status-badge.tsx
 *
 * Dependencies:
 * - None.
 */
//#endregion

import { StatusBadge } from "@/components/admin/status-badge";
import type { AuditStatusValue } from "@/types/client";

interface AuditProgressProps {
  status: AuditStatusValue;
  percent: number;
  stepLabel: string;
  label: string;
}

export function AuditProgress({ status, percent, stepLabel, label }: AuditProgressProps) {
  const safePercent = Math.min(100, Math.max(0, Math.round(percent)));

  return (
    <div className="space-y-1.5">
      <div className="flex items-center justify-between gap-2">
        <StatusBadge status={status} />
        <span className="text-xs tabular-nums text-muted-foreground">{safePercent}%</span>
      </div>
      <div
        role="progressbar"
        aria-label={label}
        aria-valuemin={0}
        aria-valuemax={100}
        aria-valuenow={safePercent}
        className="h-2 w-full overflow-hidden rounded-full bg-muted"
      >
        <div
          className="h-full rounded-full bg-primary transition-[width] duration-500"
          style={{ width: `${safePercent}%` }}
        />
      </div>
      <p aria-live="polite" className="break-words text-xs text-muted-foreground">
        {stepLabel}
      </p>
    </div>
  );
}