//#region File Documentation
/**
 * File: src/app/admin/audits/page.tsx
 * Updated: 2026-10-30
 *
 * Purpose:
 * - Audit history page: every audit with status, score, date and PDF download.
 * - Rendering model: Server Component (reads the database directly, dynamic rendering).
 *
 * Changes:
 * - New file.
 *
 * Safety:
 * - Data errors are caught by src/app/admin/error.tsx.
 *
 * Connected Modules:
 * - src/lib/audit-queries.ts, src/components/admin/audits-table.tsx, src/data/admin-copy.ts
 *
 * Dependencies:
 * - None.
 */
//#endregion

import type { Metadata } from "next";
import { AuditsTable } from "@/components/admin/audits-table";
import { adminCopy } from "@/data/admin-copy";
import { getAuditList } from "@/lib/audit-queries";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: adminCopy.audits.metaTitle,
};

export default async function AuditsPage() {
  const audits = await getAuditList();

  return (
    <div className="space-y-6">
      <header>
        <h1 className="text-xl font-semibold sm:text-2xl">{adminCopy.audits.title}</h1>
        <p className="mt-1 text-sm text-muted-foreground">{adminCopy.audits.description}</p>
      </header>
      <AuditsTable audits={audits} />
    </div>
  );
}