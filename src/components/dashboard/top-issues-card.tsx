//#region File Documentation
/**
 * File: src/components/dashboard/top-issues-card.tsx
 * Updated: 2026-10-31
 * Purpose: The most common critical issues across each client's latest report, with a count.
 * Rendering model: Server Component (no hooks).
 * Changes: New file.
 * Safety: The count is described in text for screen readers. Long issue text wraps.
 * Connected Modules: src/components/dashboard/panel.tsx, src/data/dashboard-copy.ts
 * Dependencies: None.
 */
//#endregion

import { Panel } from "@/components/dashboard/panel";
import { dashboardCopy } from "@/data/dashboard-copy";
import type { TopIssue } from "@/types/dashboard";

export function TopIssuesCard({ issues }: { issues: TopIssue[] }) {
  const copy = dashboardCopy.issues;

  return (
    <Panel id="top-issues-heading" title={copy.title}>
      <p className="-mt-3 mb-3 text-xs text-muted-foreground">{copy.subtitle}</p>
      {issues.length === 0 ? (
        <p className="text-sm text-muted-foreground">{copy.empty}</p>
      ) : (
        <ul className="divide-y">
          {issues.map((issue) => (
            <li key={issue.text} className="flex items-start justify-between gap-3 py-2.5 text-sm">
              <span className="min-w-0 break-words">{issue.text}</span>
              <span
                className="shrink-0 rounded-full bg-muted px-2 py-0.5 text-xs font-semibold tabular-nums"
                aria-label={copy.affected(issue.count)}
              >
                {issue.count}
              </span>
            </li>
          ))}
        </ul>
      )}
    </Panel>
  );
}