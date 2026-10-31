//#region File Documentation
/**
 * File: src/components/admin/audits-table.tsx
 * Updated: 2026-10-30
 *
 * Purpose:
 * - Audit history as a table on md and larger screens and as cards on smaller screens.
 * - Rendering model: Server Component (no hooks).
 *
 * Changes:
 * - The Report column now has a "View report" link to the audit detail page next to the PDF link.
 * - Everything else is unchanged.
 *
 * Safety:
 * - Dates are formatted in Asia/Kolkata so server and viewer always see the same time.
 * - Long text wraps, so the page never scrolls sideways.
 *
 * Connected Modules:
 * - src/components/admin/status-badge.tsx, src/data/admin-copy.ts, src/data/audit-copy.ts,
 *   src/types/audit-list.ts, /admin/audits/[id], /api/audits/[id]/pdf
 *
 * Dependencies:
 * - None.
 */
//#endregion

import Link from "next/link";
import { StatusBadge } from "@/components/admin/status-badge";
import { adminCopy } from "@/data/admin-copy";
import { auditCopy } from "@/data/audit-copy";
import type { AuditListItem } from "@/types/audit-list";

interface AuditsTableProps {
  audits: AuditListItem[];
}

const dateFormatter = new Intl.DateTimeFormat("en-IN", {
  dateStyle: "medium",
  timeStyle: "short",
  timeZone: "Asia/Kolkata",
});

const REPORT_LINK_CLASS =
  "inline-flex min-h-11 items-center text-sm font-medium underline underline-offset-2";

function formatDate(iso: string): string {
  return dateFormatter.format(new Date(iso));
}

function AuditClient({ audit }: { audit: AuditListItem }) {
  return (
    <div className="min-w-0">
      <p className="break-words font-medium">{audit.clientName}</p>
      <p className="break-all text-xs text-muted-foreground">{audit.websiteUrl}</p>
    </div>
  );
}

function AuditStatus({ audit }: { audit: AuditListItem }) {
  return (
    <div className="space-y-1">
      <StatusBadge status={audit.status} />
      {audit.status === "FAILED" && audit.errorMessage ? (
        <p className="break-words text-xs text-muted-foreground">{audit.errorMessage}</p>
      ) : null}
      {audit.status === "RUNNING" || audit.status === "QUEUED" ? (
        <p className="text-xs text-muted-foreground">{audit.progress}%</p>
      ) : null}
    </div>
  );
}

function AuditScore({ audit }: { audit: AuditListItem }) {
  return (
    <span className="font-medium">
      {audit.overallScore !== null
        ? adminCopy.clients.scoreOutOf(audit.overallScore)
        : adminCopy.audits.noScore}
    </span>
  );
}

function AuditReportLinks({ audit }: { audit: AuditListItem }) {
  return (
    <div className="flex flex-wrap items-center gap-x-4">
      <Link href={`/admin/audits/${audit.id}`} className={REPORT_LINK_CLASS}>
        {auditCopy.viewReport}
      </Link>
      {audit.hasPdf ? (
        <a href={`/api/audits/${audit.id}/pdf`} className={REPORT_LINK_CLASS}>
          {adminCopy.audits.downloadPdf}
        </a>
      ) : null}
    </div>
  );
}

export function AuditsTable({ audits }: AuditsTableProps) {
  if (audits.length === 0) {
    return (
      <div className="rounded-lg border border-dashed p-8 text-center">
        <p className="font-medium">{adminCopy.audits.emptyTitle}</p>
        <p className="mt-1 text-sm text-muted-foreground">
          {adminCopy.audits.emptyDescription}
        </p>
      </div>
    );
  }

  return (
    <>
      <div className="hidden overflow-hidden rounded-lg border md:block">
        <table className="w-full table-fixed border-collapse text-sm">
          <caption className="sr-only">{adminCopy.audits.tableCaption}</caption>
          <thead className="bg-muted text-left">
            <tr>
              <th scope="col" className="w-[26%] px-4 py-3 font-medium">
                {adminCopy.audits.columns.client}
              </th>
              <th scope="col" className="w-[20%] px-4 py-3 font-medium">
                {adminCopy.audits.columns.status}
              </th>
              <th scope="col" className="w-[10%] px-4 py-3 font-medium">
                {adminCopy.audits.columns.score}
              </th>
              <th scope="col" className="w-[18%] px-4 py-3 font-medium">
                {adminCopy.audits.columns.started}
              </th>
              <th scope="col" className="px-4 py-3 font-medium">
                {adminCopy.audits.columns.report}
              </th>
            </tr>
          </thead>
          <tbody>
            {audits.map((audit) => (
              <tr key={audit.id} className="border-t align-top">
                <td className="px-4 py-3">
                  <AuditClient audit={audit} />
                </td>
                <td className="px-4 py-3">
                  <AuditStatus audit={audit} />
                </td>
                <td className="px-4 py-3">
                  <AuditScore audit={audit} />
                </td>
                <td className="px-4 py-3 text-muted-foreground">{formatDate(audit.createdAt)}</td>
                <td className="px-4 py-1">
                  <AuditReportLinks audit={audit} />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <ul className="grid gap-3 md:hidden">
        {audits.map((audit) => (
          <li key={audit.id} className="space-y-3 rounded-lg border p-4">
            <AuditClient audit={audit} />
            <div className="flex flex-wrap items-start justify-between gap-3">
              <AuditStatus audit={audit} />
              <AuditScore audit={audit} />
            </div>
            <p className="text-xs text-muted-foreground">{formatDate(audit.createdAt)}</p>
            <AuditReportLinks audit={audit} />
          </li>
        ))}
      </ul>
    </>
  );
}