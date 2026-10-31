//#region File Documentation
/**
 * File: src/app/admin/layout.tsx
 * Updated: 2026-10-30
 *
 * Purpose:
 * - Shell for every admin page: header, navigation and main content area.
 * - Rendering model: Server Component.
 *
 * Changes:
 * - New file.
 *
 * Safety:
 * - Includes a skip link, semantic header and main landmarks, and stays inside the viewport width.
 *
 * Connected Modules:
 * - src/components/admin/admin-nav.tsx, src/data/admin-copy.ts
 *
 * Dependencies:
 * - None.
 */
//#endregion

import { AdminNav } from "@/components/admin/admin-nav";
import { adminCopy } from "@/data/admin-copy";

export default function AdminLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <div className="min-h-screen bg-background">
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:fixed focus:left-3 focus:top-3 focus:z-50 focus:rounded-md focus:bg-background focus:px-3 focus:py-2 focus:text-sm focus:shadow"
      >
        {adminCopy.skipLink}
      </a>
      <header className="border-b bg-card">
        <div className="mx-auto flex w-full max-w-6xl flex-wrap items-center justify-between gap-2 px-3 py-2 xs:px-4 sm:px-6">
          <div>
            <p className="text-sm font-semibold">{adminCopy.brand}</p>
            <p className="text-xs text-muted-foreground">{adminCopy.portalLabel}</p>
          </div>
          <AdminNav />
        </div>
      </header>
      <main
        id="main-content"
        tabIndex={-1}
        className="mx-auto w-full max-w-6xl px-3 py-6 outline-none xs:px-4 sm:px-6 sm:py-8"
      >
        {children}
      </main>
    </div>
  );
}