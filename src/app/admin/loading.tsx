//#region File Documentation
/**
 * File: src/app/admin/loading.tsx
 * Updated: 2026-10-30
 *
 * Purpose:
 * - Skeleton shown while an admin page loads.
 * - Rendering model: Server Component.
 *
 * Changes:
 * - New file.
 *
 * Safety:
 * - Announced to screen readers with role="status".
 *
 * Connected Modules:
 * - src/data/admin-copy.ts
 *
 * Dependencies:
 * - None.
 */
//#endregion

import { adminCopy } from "@/data/admin-copy";

export default function AdminLoading() {
  return (
    <div role="status" aria-busy="true" className="animate-pulse space-y-4">
      <span className="sr-only">{adminCopy.loading.clients}</span>
      <div className="h-7 w-40 rounded bg-muted" />
      <div className="h-4 w-64 max-w-full rounded bg-muted" />
      <div className="grid gap-6 lg:grid-cols-3">
        <div className="h-64 rounded-lg bg-muted lg:col-span-2" />
        <div className="h-64 rounded-lg bg-muted" />
      </div>
    </div>
  );
}