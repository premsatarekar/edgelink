//#region File Documentation
/**
 * File: src/components/admin/admin-nav.tsx
 * Updated: 2026-10-30
 *
 * Purpose:
 * - Main navigation links with the current page highlighted.
 * - Rendering model: Client Component (reads the current path with usePathname).
 *
 * Changes:
 * - New file.
 *
 * Safety:
 * - The current page is exposed with aria-current. Links are at least 44px high.
 *
 * Connected Modules:
 * - src/data/admin-copy.ts, src/app/admin/layout.tsx
 *
 * Dependencies:
 * - None.
 */
//#endregion

"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { adminCopy } from "@/data/admin-copy";
import { cn } from "@/lib/utils";

export function AdminNav() {
  const pathname = usePathname() ?? "";

  return (
    <nav aria-label={adminCopy.navLabel}>
      <ul className="flex items-center gap-1">
        {adminCopy.nav.map((item) => {
          const isActive = pathname === item.href || pathname.startsWith(`${item.href}/`);
          return (
            <li key={item.href}>
              <Link
                href={item.href}
                aria-current={isActive ? "page" : undefined}
                className={cn(
                  "inline-flex min-h-11 items-center rounded-md px-3 text-sm font-medium focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring",
                  isActive
                    ? "bg-muted text-foreground"
                    : "text-muted-foreground hover:text-foreground",
                )}
              >
                {item.label}
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}