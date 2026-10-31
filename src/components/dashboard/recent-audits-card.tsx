//#region File Documentation
/**
 * File: src/components/dashboard/recent-audits-card.tsx
 * Updated: 2026-10-31
 * Purpose: The latest audits with website, date, status and score; each row opens the report.
 * Rendering model: Server Component (no hooks).
 * Changes: New file.
 * Safety: Rows stack on small screens and become a 4-column grid from md. Long text wraps.
 * Connected Modules: src/components/dashboard/panel.tsx, src/components/admin/status-badge.tsx
 * Dependencies: None.
 */
//#endregion

import Link from "next/link";
import { StatusBadge } from "@/components/admin/status-badge";
import { Panel } from "@/components/dashboard/panel";
import { adminCopy } from "@/data/admin-copy";
import { dashboardCopy } from "@/data/dashboard-copy";
import { formatDateTime } from "@/lib/format";
import type { AuditListItem } from "@/types/audit-list";

export function RecentAuditsCard({ audits }: { audits: AuditListItem[] }) {
  const copy = dashboardCopy.recent;

  return (
    <Panel
      id="recent-audits-heading"
      title={copy.title}
      action={
        <Link
          href="/admin/audits"
          className="inline-flex min-h-11 items-center text-sm font-medium text-indigo-700 underline-offset-2 hover:underline"
        >
          {copy.viewAll}
        </Link>
      }
    >
      {audits.length === 0 ? (
        <p className="text-sm text-muted-foreground">{copy.empty}</p>
      ) : (
        <ul className="divide-y">
          {audits.map((audit) => (
            <li key={audit.id}>
              <Link
                href={`/admin/audits/${audit.id}`}
                className="grid gap-2 rounded-md py-3 hover:bg-muted/50 md:grid-cols-[minmax(0,2fr)_minmax(0,1.3fr)_auto_3.5rem] md:items-center md:gap-4 md:px-2"
              >
                <div className="min-w-0">
                  <p className="break-words font-medium">{audit.clientName}</p>
                  <p className="break-all text-xs text-muted-foreground">{audit.websiteUrl}</p>
                </div>
                <p className="text-xs text-muted-foreground">{formatDateTime(audit.createdAt)}</p>
                <div className="flex items-center justify-between gap-3 md:contents">
                  <StatusBadge status={audit.status} />
                  <span className="text-sm font-semibold tabular-nums md:text-right">
                    {audit.overallScore !== null
                      ? adminCopy.clients.scoreOutOf(audit.overallScore)
                      : adminCopy.audits.noScore}
                  </span>
                </div>
              </Link>
            </li>
          ))}
        </ul>
      )}
    </Panel>
  );
}