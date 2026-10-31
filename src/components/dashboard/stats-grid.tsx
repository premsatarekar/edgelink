//#region File Documentation
/**
 * File: src/components/dashboard/stats-grid.tsx
 * Updated: 2026-10-31
 * Purpose: Four summary cards: total, completed, in progress and failed audits.
 * Rendering model: Server Component (no hooks).
 * Changes: New file.
 * Safety: Icons are decorative (aria-hidden); every figure is also plain text.
 * Connected Modules: src/data/dashboard-copy.ts, src/types/dashboard.ts
 * Dependencies: lucide-react (already installed with shadcn): icons.
 */
//#endregion

import Link from "next/link";
import { CircleCheck, CircleX, ClipboardList, Hourglass, type LucideIcon } from "lucide-react";
import { dashboardCopy } from "@/data/dashboard-copy";
import type { DashboardStats } from "@/types/dashboard";

interface StatCardProps {
  label: string;
  value: number;
  note: React.ReactNode;
  Icon: LucideIcon;
  tint: string;
}

function StatCard({ label, value, note, Icon, tint }: StatCardProps) {
  return (
    <li className="flex items-start gap-3 rounded-xl border bg-card p-4 shadow-sm">
      <span
        aria-hidden="true"
        className={`flex size-10 shrink-0 items-center justify-center rounded-lg ${tint}`}
      >
        <Icon className="size-5" />
      </span>
      <div className="min-w-0">
        <p className="text-sm text-muted-foreground">{label}</p>
        <p className="text-2xl font-semibold tabular-nums">{value}</p>
        <p className="break-words text-xs text-muted-foreground">{note}</p>
      </div>
    </li>
  );
}

export function StatsGrid({ stats }: { stats: DashboardStats }) {
  const copy = dashboardCopy.stats;

  return (
    <ul className="grid grid-cols-1 gap-4 xs:grid-cols-2 xl:grid-cols-4">
      <StatCard
        label={copy.total}
        value={stats.total}
        note={copy.thisWeek(stats.thisWeek)}
        Icon={ClipboardList}
        tint="bg-indigo-100 text-indigo-700"
      />
      <StatCard
        label={copy.completed}
        value={stats.completed}
        note={stats.successRate !== null ? copy.successRate(stats.successRate) : copy.noRate}
        Icon={CircleCheck}
        tint="bg-green-100 text-green-700"
      />
      <StatCard
        label={copy.inProgress}
        value={stats.inProgress}
        note={copy.running(stats.running)}
        Icon={Hourglass}
        tint="bg-blue-100 text-blue-700"
      />
      <StatCard
        label={copy.failed}
        value={stats.failed}
        note={
          <Link
            href="/admin/audits"
            className="inline-flex min-h-6 items-center text-indigo-700 underline underline-offset-2"
          >
            {copy.viewDetails}
          </Link>
        }
        Icon={CircleX}
        tint="bg-red-100 text-red-700"
      />
    </ul>
  );
}