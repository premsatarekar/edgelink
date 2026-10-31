//#region File Documentation
/**
 * File: src/app/dashboard/[clientId]/page.tsx
 * Updated: 2026-10-30
 *
 * Purpose:
 * - Client-facing dashboard: latest score, breakdown, critical issues, quick wins, PDF and history.
 * - Rendering model: Server Component (reads the database directly, dynamic rendering).
 *
 * Changes:
 * - New file.
 *
 * Safety:
 * - Invalid or unknown client ids render the 404 page. Clients with no completed audit see a friendly
 *   message. There is no login yet (documented as a known limitation in the README).
 *
 * Connected Modules:
 * - src/lib/audit-queries.ts, src/components/audit/*, src/data/audit-copy.ts, src/lib/format.ts
 *
 * Dependencies:
 * - None.
 */
//#endregion

import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { AuditReport } from "@/components/audit/audit-report";
import { LinkButton } from "@/components/audit/link-button";
import { Notice } from "@/components/audit/notice";
import { auditCopy } from "@/data/audit-copy";
import { getClientDashboard } from "@/lib/audit-queries";
import { formatDateTime } from "@/lib/format";
import { idSchema } from "@/lib/validations";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: auditCopy.dashboard.metaTitle,
};

interface ClientDashboardPageProps {
  params: { clientId: string };
}

export default async function ClientDashboardPage({ params }: ClientDashboardPageProps) {
  const id = idSchema.safeParse(params.clientId);
  if (!id.success) notFound();

  const data = await getClientDashboard(id.data);
  if (!data) notFound();

  const copy = auditCopy.dashboard;
  const { client, latest, history } = data;

  let body: React.ReactNode;
  if (latest?.result) {
    body = <AuditReport result={latest.result} variant="client" />;
  } else if (latest) {
    body = (
      <Notice title={copy.unavailableTitle} description={copy.unavailableDescription} />
    );
  } else {
    body = <Notice title={copy.emptyTitle} description={copy.emptyDescription} />;
  }

  return (
    <div className="space-y-8">
      <header className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div className="min-w-0 space-y-1">
          <p className="text-sm text-muted-foreground">{copy.title}</p>
          <h1 className="break-words text-xl font-semibold sm:text-2xl">{client.name}</h1>
          <p className="break-all text-sm text-muted-foreground">{client.websiteUrl}</p>
          {latest?.completedAt ? (
            <p className="text-xs text-muted-foreground">
              {copy.updated(formatDateTime(latest.completedAt))}
            </p>
          ) : null}
        </div>
        {latest?.hasPdf ? (
          <LinkButton href={`/api/audits/${latest.id}/pdf`} isFileDownload>
            {auditCopy.downloadPdf}
          </LinkButton>
        ) : null}
      </header>

      {body}

      {history.length > 1 ? (
        <section aria-labelledby="history-heading" className="space-y-3">
          <h2 id="history-heading" className="text-base font-semibold">
            {copy.historyTitle}
          </h2>
          <ul className="divide-y rounded-lg border">
            {history.map((item) => (
              <li
                key={item.id}
                className="flex items-center justify-between gap-3 px-4 py-3 text-sm"
              >
                <span className="text-muted-foreground">{formatDateTime(item.completedAt)}</span>
                <span className="font-semibold tabular-nums">{item.score}/100</span>
              </li>
            ))}
          </ul>
        </section>
      ) : null}
    </div>
  );
}