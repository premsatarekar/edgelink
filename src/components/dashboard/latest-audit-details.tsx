//#region File Documentation
/**
 * File: src/components/dashboard/latest-audit-details.tsx
 * Updated: 2026-10-31
 * Purpose: Latest completed audit with tabs: Overview, Technical, On-page, Content, AI recommendations.
 * Rendering model: Client Component (tab state and keyboard handling).
 * Changes: New file.
 * Safety: Accessible tabs: role tablist/tab/tabpanel, aria-selected, roving tabindex, arrow keys,
 * Home and End. The tab row scrolls inside its own container, so the page never scrolls sideways.
 * Connected Modules: src/components/audit/score-breakdown.tsx, src/components/audit/link-button.tsx,
 * src/data/dashboard-copy.ts, src/types/audit-detail.ts
 * Dependencies: None.
 */
//#endregion

"use client";

import { useRef, useState, type KeyboardEvent } from "react";
import { ScoreBreakdown } from "@/components/audit/score-breakdown";
import { LinkButton } from "@/components/audit/link-button";
import { Panel } from "@/components/dashboard/panel";
import { auditCopy } from "@/data/audit-copy";
import { DETAILS_TABS, dashboardCopy } from "@/data/dashboard-copy";
import { formatDateTime } from "@/lib/format";
import { cn } from "@/lib/utils";
import type { AuditResult } from "@/types/audit";
import type { AuditDetail } from "@/types/audit-detail";
import type { DetailsTabKey } from "@/types/dashboard";

interface LatestAuditDetailsProps {
  audit: AuditDetail & { result: AuditResult };
}

export function LatestAuditDetails({ audit }: LatestAuditDetailsProps) {
  const copy = dashboardCopy.details;
  const [activeKey, setActiveKey] = useState<DetailsTabKey>("overview");
  const tabRefs = useRef<Partial<Record<DetailsTabKey, HTMLButtonElement | null>>>({});

  const activeTab = DETAILS_TABS.find((tab) => tab.key === activeKey) ?? DETAILS_TABS[0];
  const items = audit.result.recommendations.filter((item) =>
    activeTab.categories.includes(item.category),
  );

  function handleKeyDown(event: KeyboardEvent<HTMLButtonElement>, index: number): void {
    const last = DETAILS_TABS.length - 1;
    let next = index;
    if (event.key === "ArrowRight") next = index === last ? 0 : index + 1;
    else if (event.key === "ArrowLeft") next = index === 0 ? last : index - 1;
    else if (event.key === "Home") next = 0;
    else if (event.key === "End") next = last;
    else return;

    event.preventDefault();
    const key = DETAILS_TABS[next].key;
    setActiveKey(key);
    tabRefs.current[key]?.focus();
  }

  return (
    <Panel
      id="latest-audit-heading"
      title={copy.title}
      action={
        <LinkButton href={`/admin/audits/${audit.id}`}>{copy.viewFull}</LinkButton>
      }
    >
      <div className="mb-4 min-w-0">
        <p className="break-words font-medium">{audit.clientName}</p>
        <p className="break-all text-xs text-muted-foreground">
          {audit.websiteUrl}
          {audit.completedAt ? ` | ${formatDateTime(audit.completedAt)}` : ""}
        </p>
      </div>

      <div
        role="tablist"
        aria-label={copy.tabsLabel}
        className="mb-4 flex gap-1 overflow-x-auto border-b"
      >
        {DETAILS_TABS.map((tab, index) => {
          const isActive = tab.key === activeKey;
          return (
            <button
              key={tab.key}
              ref={(element) => {
                tabRefs.current[tab.key] = element;
              }}
              type="button"
              role="tab"
              id={`details-tab-${tab.key}`}
              aria-selected={isActive}
              aria-controls={`details-panel-${tab.key}`}
              tabIndex={isActive ? 0 : -1}
              onClick={() => setActiveKey(tab.key)}
              onKeyDown={(event) => handleKeyDown(event, index)}
              className={cn(
                "min-h-11 shrink-0 whitespace-nowrap border-b-2 px-3 text-sm font-medium focus-visible:outline-2 focus-visible:outline-offset-[-2px] focus-visible:outline-ring",
                isActive
                  ? "border-indigo-600 text-indigo-700"
                  : "border-transparent text-muted-foreground hover:text-foreground",
              )}
            >
              {tab.label}
            </button>
          );
        })}
      </div>

      <div
        role="tabpanel"
        id={`details-panel-${activeTab.key}`}
        aria-labelledby={`details-tab-${activeTab.key}`}
        tabIndex={0}
        className="outline-none focus-visible:outline-2 focus-visible:outline-ring"
      >
        {activeTab.key === "overview" ? (
          <div className="grid gap-6 lg:grid-cols-2">
            <p className="break-words text-sm leading-relaxed">
              {audit.result.executive_summary}
            </p>
            <ScoreBreakdown breakdown={audit.result.score_breakdown} />
          </div>
        ) : items.length === 0 ? (
          <p className="text-sm text-muted-foreground">{copy.noItems}</p>
        ) : (
          <ul className="space-y-3">
            {items.map((item, index) => (
              <li key={index} className="rounded-lg border p-3 text-sm">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="rounded-full bg-muted px-2 py-0.5 text-xs font-medium">
                    {auditCopy.priority[item.priority]}
                  </span>
                  <span className="text-xs text-muted-foreground">
                    {auditCopy.category[item.category]}
                  </span>
                </div>
                <p className="mt-2 break-words font-medium">{item.finding}</p>
                <p className="mt-1 break-words text-muted-foreground">{item.fix}</p>
              </li>
            ))}
          </ul>
        )}
      </div>
    </Panel>
  );
}