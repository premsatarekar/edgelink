//#region File Documentation
/**
 * File: src/components/dashboard/score-overview-card.tsx
 * Updated: 2026-10-31
 * Purpose: Donut chart of the average score plus the average of each of the five categories.
 * Rendering model: Server Component (no hooks).
 * Changes: New file.
 * Safety: The SVG has a text alternative; every value is also printed as text, never colour only.
 * Connected Modules: src/lib/format.ts, src/data/audit-copy.ts, src/data/dashboard-copy.ts
 * Dependencies: None.
 */
//#endregion

import { Panel } from "@/components/dashboard/panel";
import { auditCopy } from "@/data/audit-copy";
import { dashboardCopy } from "@/data/dashboard-copy";
import { getScoreBand, SCORE_BAND_STYLES } from "@/lib/format";
import { cn } from "@/lib/utils";
import type { ScoreBand } from "@/types/audit-detail";
import type { ScoreOverview } from "@/types/dashboard";

const RADIUS = 54;
const CIRCUMFERENCE = 2 * Math.PI * RADIUS;

const STROKE_STYLES: Record<ScoreBand, string> = {
  good: "stroke-green-600",
  fair: "stroke-amber-600",
  poor: "stroke-red-600",
};

function Donut({ score }: { score: number }) {
  const band = getScoreBand(score);

  return (
    <svg
      viewBox="0 0 140 140"
      role="img"
      aria-label={dashboardCopy.score.ariaLabel(score)}
      className="size-36 shrink-0"
    >
      <circle cx="70" cy="70" r={RADIUS} fill="none" strokeWidth="12" className="stroke-muted" />
      <circle
        cx="70"
        cy="70"
        r={RADIUS}
        fill="none"
        strokeWidth="12"
        strokeLinecap="round"
        strokeDasharray={`${(score / 100) * CIRCUMFERENCE} ${CIRCUMFERENCE}`}
        transform="rotate(-90 70 70)"
        className={STROKE_STYLES[band]}
      />
      <text x="70" y="72" textAnchor="middle" className="fill-foreground text-3xl font-bold">
        {score}
      </text>
      <text x="70" y="90" textAnchor="middle" className="fill-muted-foreground text-[9px]">
        {dashboardCopy.score.average}
      </text>
    </svg>
  );
}

export function ScoreOverviewCard({ overview }: { overview: ScoreOverview }) {
  const copy = dashboardCopy.score;

  return (
    <Panel id="score-overview-heading" title={copy.title}>
      {overview.average === null ? (
        <p className="text-sm text-muted-foreground">{copy.empty}</p>
      ) : (
        <div className="flex flex-col items-center gap-4">
          <Donut score={overview.average} />
          <ul className="w-full space-y-2">
            {overview.categories.map((category) => (
              <li key={category.key} className="flex items-center justify-between gap-3 text-sm">
                <span className="flex items-center gap-2">
                  <span
                    aria-hidden="true"
                    className={cn(
                      "size-2.5 rounded-full",
                      SCORE_BAND_STYLES[getScoreBand(category.value)].bar,
                    )}
                  />
                  {auditCopy.breakdownLabels[category.key]}
                </span>
                <span className="font-semibold tabular-nums">{category.value}</span>
              </li>
            ))}
          </ul>
          <p className="text-center text-xs text-muted-foreground">
            {copy.basedOn(overview.clientCount)}
          </p>
        </div>
      )}
    </Panel>
  );
}