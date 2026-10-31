//#region File Documentation
/**
 * File: src/components/audit/recommendations-list.tsx
 * Updated: 2026-10-30
 *
 * Purpose:
 * - Every Claude recommendation as a card: priority, finding, fix, impact, effort, verification.
 * - Rendering model: Server Component (no hooks).
 *
 * Changes:
 * - New file.
 *
 * Safety:
 * - Priority is shown as text on a coloured badge. Cards work at every width, no horizontal scroll.
 *
 * Connected Modules:
 * - src/components/audit/audit-report.tsx, src/data/audit-copy.ts, src/types/audit.ts
 *
 * Dependencies:
 * - None.
 */
//#endregion

import { auditCopy } from "@/data/audit-copy";
import { cn } from "@/lib/utils";
import type { AuditResult } from "@/types/audit";

type Recommendation = AuditResult["recommendations"][number];

const PRIORITY_STYLES: Record<Recommendation["priority"], string> = {
  CRITICAL: "bg-red-100 text-red-900",
  HIGH: "bg-orange-100 text-orange-900",
  MEDIUM: "bg-amber-100 text-amber-900",
  LOW: "bg-muted text-foreground",
};

interface RecommendationsListProps {
  headingId: string;
  recommendations: Recommendation[];
}

export function RecommendationsList({ headingId, recommendations }: RecommendationsListProps) {
  return (
    <section aria-labelledby={headingId} className="space-y-3">
      <h2 id={headingId} className="text-base font-semibold">
        {auditCopy.sections.recommendations}
      </h2>
      <ol className="space-y-3">
        {recommendations.map((item, index) => (
          <li key={index} className="space-y-3 rounded-lg border p-4">
            <div className="flex flex-wrap items-center gap-2">
              <span
                className={cn(
                  "rounded-full px-2.5 py-0.5 text-xs font-medium",
                  PRIORITY_STYLES[item.priority],
                )}
              >
                {auditCopy.priority[item.priority]}
              </span>
              <span className="text-xs text-muted-foreground">
                {auditCopy.category[item.category]}
              </span>
            </div>
            <p className="break-words font-medium">{item.finding}</p>
            <dl className="grid gap-3 text-sm sm:grid-cols-2">
              <div className="sm:col-span-2">
                <dt className="text-xs text-muted-foreground">{auditCopy.recommendation.fix}</dt>
                <dd className="break-words">{item.fix}</dd>
              </div>
              <div className="sm:col-span-2">
                <dt className="text-xs text-muted-foreground">
                  {auditCopy.recommendation.verify}
                </dt>
                <dd className="break-words">{item.falsifiability_check}</dd>
              </div>
              <div>
                <dt className="text-xs text-muted-foreground">
                  {auditCopy.recommendation.impact}
                </dt>
                <dd>{item.estimated_impact}</dd>
              </div>
              <div>
                <dt className="text-xs text-muted-foreground">
                  {auditCopy.recommendation.effort}
                </dt>
                <dd>{item.effort}</dd>
              </div>
            </dl>
          </li>
        ))}
      </ol>
    </section>
  );
}