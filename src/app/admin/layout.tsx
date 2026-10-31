//#region File Documentation
/**
 * File: src/app/admin/layout.tsx
 * Updated: 2026-10-31
 * Purpose: Shell for every admin page: dark sidebar from lg, top bar with navigation below lg.
 * Rendering model: Server Component.
 * Changes: Replaced the top header with a sidebar layout. Skip link and main landmark are kept.
 * Safety: The sidebar stays fixed while content scrolls; content never exceeds the viewport width.
 * Connected Modules: src/components/admin/admin-nav.tsx, src/data/dashboard-copy.ts, src/data/admin-copy.ts
 * Dependencies: None.
 */
//#endregion

import { AdminNav } from '@/components/admin/admin-nav';
import { adminCopy } from '@/data/admin-copy';
import { dashboardCopy } from '@/data/dashboard-copy';

export default function AdminLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  const { brand, subtitle } = dashboardCopy.sidebar;

  return (
    <div className="min-h-screen bg-muted/30 lg:flex">
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:fixed focus:left-3 focus:top-3 focus:z-50 focus:rounded-md focus:bg-background focus:px-3 focus:py-2 focus:text-sm focus:shadow"
      >
        {adminCopy.skipLink}
      </a>

      <aside className="hidden w-60 shrink-0 flex-col gap-6 bg-slate-900 p-4 text-slate-100 lg:sticky lg:top-0 lg:flex lg:h-screen">
        <div className="px-3 pt-2">
          <p className="text-base font-semibold">{brand}</p>
          <p className="text-xs text-slate-400">{subtitle}</p>
        </div>
        <AdminNav orientation="vertical" />
      </aside>

      <div className="min-w-0 flex-1">
        <header className="border-b bg-card lg:hidden">
          <div className="flex flex-wrap items-center justify-between gap-2 px-3 py-2 xs:px-4 sm:px-6">
            <div>
              <p className="text-sm font-semibold">{brand}</p>
              <p className="text-xs text-muted-foreground">{subtitle}</p>
            </div>
            <AdminNav orientation="horizontal" />
          </div>
        </header>
        <main
          id="main-content"
          tabIndex={-1}
          className="mx-auto w-full max-w-7xl px-3 py-6 outline-none xs:px-4 sm:px-6 sm:py-8"
        >
          {children}
        </main>
      </div>
    </div>
  );
}
