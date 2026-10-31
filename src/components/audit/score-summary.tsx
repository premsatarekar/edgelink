//#region File Documentation
/**
 * File: src/components/audit/score-summary.tsx
 * Updated: 2026-10-30
 *
 * Purpose:
 * - Large overall score with a text label for its band.
 * - Rendering model: Server Component (no hooks).
 *
 * Changes:
 * - New file.
 *
 * Safety:
 * - The band is written as text, so meaning never depends on colour alone.
 *
 * Connected Modules:
 * - src/components/audit/audit-report.tsx, src/lib/format.ts, src/data/audit-copy.ts
 *
 * Dependencies:
 * - None.
 */
//#endregion

import { auditCopy } from "@/data/audit-copy";
import { getScoreBand, SCORE_BAND_STYLES } from "@/lib/format";
import { cn } from "@/lib/utils";

interface ScoreSummaryProps {
  score: number;
}

export function ScoreSummary({ score }: ScoreSummaryProps) {
  const band = getScoreBand(score);

  return (
    <div className="rounded-lg border p-5 text-center">
      <p className={cn("text-5xl font-bold tabular-nums", SCORE_BAND_STYLES[band].text)}>
        {score}
      </p>
      <p className="text-sm text-muted-foreground">{auditCopy.scoreOutOf}</p>
      <p className="mt-2 text-sm font-medium">{auditCopy.scoreBand[band]}</p>
    </div>
  );
}