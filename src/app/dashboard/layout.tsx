//#region File Documentation
/**
 * File: src/app/dashboard/layout.tsx
 * Updated: 2026-10-30
 *
 * Purpose:
 * - Shell for the client-facing dashboard: simple header and a narrower content column.
 * - Rendering model: Server Component.
 *
 * Changes:
 * - New file.
 *
 * Safety:
 * - Separate from the admin shell, so clients never see admin navigation. Skip link and landmarks included.
 *
 * Connected Modules:
 * - src/data/audit-copy.ts, src/app/dashboard/[clientId]/page.tsx
 *
 * Dependencies:
 * - None.
 */
//#endregion

import { auditCopy } from "@/data/audit-copy";

export default function DashboardLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  const copy = auditCopy.dashboard;

  return (
    <div className="min-h-screen bg-background">
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:fixed focus:left-3 focus:top-3 focus:z-50 focus:rounded-md focus:bg-background focus:px-3 focus:py-2 focus:text-sm focus:shadow"
      >
        {copy.skipLink}
      </a>
      <header className="border-b bg-card">
        <div className="mx-auto w-full max-w-4xl px-3 py-3 xs:px-4 sm:px-6">
          <p className="text-sm font-semibold">{copy.brand}</p>
          <p className="text-xs text-muted-foreground">{copy.portalLabel}</p>
        </div>
      </header>
      <main
        id="main-content"
        tabIndex={-1}
        className="mx-auto w-full max-w-4xl px-3 py-6 outline-none xs:px-4 sm:px-6 sm:py-8"
      >
        {children}
      </main>
    </div>
  );
}