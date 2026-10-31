//#region File Documentation
/**
 * File: src/components/admin/admin-nav.tsx
 * Updated: 2026-10-31
 * Purpose: Main navigation with the current page highlighted. Vertical in the sidebar, horizontal on small screens.
 * Rendering model: Client Component (reads the current path with usePathname).
 * Changes: Now reads items from NAV_ITEMS (adds Dashboard), shows icons and takes an orientation prop.
 * Safety: Current page exposed with aria-current. Links are at least 44px high. The Dashboard link
 * is active only on /admin itself, so it does not light up on every admin page.
 * Connected Modules: src/data/dashboard-copy.ts, src/data/admin-copy.ts, src/app/admin/layout.tsx
 * Dependencies: lucide-react (already installed): icons.
 */
//#endregion

"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { History, LayoutDashboard, Users, type LucideIcon } from "lucide-react";
import { adminCopy } from "@/data/admin-copy";
import { NAV_ITEMS } from "@/data/dashboard-copy";
import { cn } from "@/lib/utils";
import type { NavIconKey } from "@/types/dashboard";

const NAV_ICONS: Record<NavIconKey, LucideIcon> = {
  dashboard: LayoutDashboard,
  clients: Users,
  audits: History,
};

interface AdminNavProps {
  orientation: "vertical" | "horizontal";
}

export function AdminNav({ orientation }: AdminNavProps) {
  const pathname = usePathname() ?? "";
  const isVertical = orientation === "vertical";

  return (
    <nav aria-label={adminCopy.navLabel}>
      <ul className={cn("flex gap-1", isVertical ? "flex-col" : "flex-wrap items-center")}>
        {NAV_ITEMS.map((item) => {
          const isActive =
            item.href === "/admin"
              ? pathname === "/admin"
              : pathname === item.href || pathname.startsWith(`${item.href}/`);
          const Icon = NAV_ICONS[item.icon];

          return (
            <li key={item.href}>
              <Link
                href={item.href}
                aria-current={isActive ? "page" : undefined}
                className={cn(
                  "flex min-h-11 items-center gap-3 rounded-md px-3 text-sm font-medium focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring",
                  isVertical
                    ? isActive
                      ? "bg-indigo-600 text-white"
                      : "text-slate-300 hover:bg-slate-800 hover:text-white"
                    : isActive
                      ? "bg-muted text-foreground"
                      : "text-muted-foreground hover:text-foreground",
                )}
              >
                <Icon aria-hidden="true" className="size-4 shrink-0" />
                {item.label}
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}