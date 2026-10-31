//#region File Documentation
/**
 * File: src/app/admin/audits/[id]/page.tsx
 * Updated: 2026-10-30
 *
 * Purpose:
 * - Admin audit detail: full report, status, PDF download and a link to the client dashboard.
 * - Rendering model: Server Component (reads the database directly, dynamic rendering).
 *
 * Changes:
 * - New file.
 *
 * Safety:
 * - An invalid id or unknown audit renders the 404 page. Running and failed audits show a message
 *   instead of an empty report.
 *
 * Connected Modules:
 * - src/lib/audit-queries.ts, src/components/audit/*, src/components/admin/status-badge.tsx,
 *   src/data/audit-copy.ts
 *
 * Dependencies:
 * - None.
 */
//#endregion

import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { StatusBadge } from "@/components/admin/status-badge";
import { AuditReport } from "@/components/audit/audit-report";
import { LinkButton } from "@/components/audit/link-button";
import { Notice } from "@/components/audit/notice";
import { auditCopy } from "@/data/audit-copy";
import { getAuditDetail } from "@/lib/audit-queries";
import { formatDateTime } from "@/lib/format";
import { idSchema } from "@/lib/validations";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: auditCopy.admin.metaTitle,
};

interface AuditDetailPageProps {
  params: { id: string };
}

export default async function AuditDetailPage({ params }: AuditDetailPageProps) {
  const id = idSchema.safeParse(params.id);
  if (!id.success) notFound();

  const audit = await getAuditDetail(id.data);
  if (!audit) notFound();

  const copy = auditCopy.admin;
  const isActive = audit.status === "QUEUED" || audit.status === "RUNNING";

  return (
    <div className="space-y-6">
      <Link
        href="/admin/audits"
        className="inline-flex min-h-11 items-center text-sm text-muted-foreground hover:text-foreground"
      >
        {copy.back}
      </Link>

      <header className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div className="min-w-0 space-y-1">
          <h1 className="break-words text-xl font-semibold sm:text-2xl">{audit.clientName}</h1>
          <a
            href={audit.websiteUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="break-all text-sm text-muted-foreground underline-offset-2 hover:underline"
          >
            {audit.websiteUrl}
          </a>
          <p className="text-sm text-muted-foreground">
            {copy.businessLine(audit.businessType, audit.city, audit.state)}
          </p>
          <div className="flex flex-wrap items-center gap-2 pt-1">
            <StatusBadge status={audit.status} />
            {audit.completedAt ? (
              <span className="text-xs text-muted-foreground">
                {copy.generated(formatDateTime(audit.completedAt))}
              </span>
            ) : null}
          </div>
        </div>
        <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
          {audit.hasPdf ? (
            <LinkButton href={`/api/audits/${audit.id}/pdf`} isFileDownload>
              {auditCopy.downloadPdf}
            </LinkButton>
          ) : null}
          <LinkButton href={`/dashboard/${audit.clientId}`}>{auditCopy.clientDashboard}</LinkButton>
        </div>
      </header>

      {audit.status === "COMPLETED" && audit.result ? (
        <AuditReport result={audit.result} variant="admin" />
      ) : isActive ? (
        <Notice
          title={copy.inProgressTitle}
          description={copy.inProgressDescription(audit.progress)}
        />
      ) : audit.status === "FAILED" ? (
        <Notice
          title={copy.failedTitle}
          description={audit.errorMessage ?? copy.failedFallback}
          isError
        />
      ) : (
        <Notice title={copy.unavailableTitle} description={copy.unavailableDescription} />
      )}
    </div>
  );
}