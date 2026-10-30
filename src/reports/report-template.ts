//#region File Documentation
/**
 * File: src/reports/report-template.ts
 * Updated: 2026-10-30
 *
 * Purpose:
 * - Builds the printable HTML for the audit PDF report.
 * - Rendering model: Server-only module (pure function, no browser APIs).
 *
 * Changes:
 * - New file.
 *
 * Safety:
 * - Every dynamic value is HTML-escaped. No external resources are loaded.
 *
 * Connected Modules:
 * - src/reports/generate-pdf.ts, src/types/audit.ts
 *
 * Dependencies:
 * - None.
 */
//#endregion

import type { AuditResult } from "@/types/audit";

export interface ReportInput {
  clientName: string;
  websiteUrl: string;
  businessType: string;
  city: string;
  state: string;
  generatedAt: Date;
  result: AuditResult;
}

const BREAKDOWN_LABELS: Array<{ key: keyof AuditResult["score_breakdown"]; label: string }> = [
  { key: "technical", label: "Technical" },
  { key: "on_page", label: "On-page" },
  { key: "content", label: "Content" },
  { key: "core_web_vitals", label: "Core Web Vitals" },
  { key: "schema", label: "Schema" },
];

function esc(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

function scoreColor(score: number): string {
  if (score >= 80) return "#15803d";
  if (score >= 60) return "#b45309";
  return "#b91c1c";
}

function renderList(items: string[], emptyText: string): string {
  if (items.length === 0) {
    return `<p class="muted">${esc(emptyText)}</p>`;
  }
  return `<ul>${items.map((item) => `<li>${esc(item)}</li>`).join("")}</ul>`;
}

function renderBreakdown(breakdown: AuditResult["score_breakdown"]): string {
  return BREAKDOWN_LABELS.map(({ key, label }) => {
    const value = breakdown[key];
    return `<div class="bar-row">
      <span class="bar-label">${esc(label)}</span>
      <span class="bar-track"><span class="bar-fill" style="width:${value}%;background:${scoreColor(value)}"></span></span>
      <span class="bar-value">${value}</span>
    </div>`;
  }).join("");
}

function renderRecommendations(recommendations: AuditResult["recommendations"]): string {
  const rows = recommendations
    .map(
      (item) => `<tr>
        <td><span class="badge badge-${item.priority.toLowerCase()}">${esc(item.priority)}</span><div class="muted">${esc(item.category)}</div></td>
        <td>${esc(item.finding)}</td>
        <td>${esc(item.fix)}</td>
        <td>${esc(item.estimated_impact)} impact<div class="muted">${esc(item.effort)}</div></td>
        <td>${esc(item.falsifiability_check)}</td>
      </tr>`,
    )
    .join("");

  return `<table>
    <thead><tr><th>Priority</th><th>Finding</th><th>Fix</th><th>Impact / Effort</th><th>How to verify</th></tr></thead>
    <tbody>${rows}</tbody>
  </table>`;
}

export function buildReportHtml(input: ReportInput): string {
  const { result } = input;
  const dateText = input.generatedAt.toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });

  return `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="utf-8" />
<title>SEO Audit Report - ${esc(input.clientName)}</title>
<style>
  * { box-sizing: border-box; }
  body { font-family: -apple-system, "Segoe UI", Roboto, Helvetica, Arial, sans-serif; color: #111827; font-size: 11px; line-height: 1.5; margin: 0; }
  h1 { font-size: 22px; margin: 0 0 4px; }
  h2 { font-size: 14px; margin: 22px 0 8px; padding-bottom: 4px; border-bottom: 1px solid #e5e7eb; }
  p { margin: 0 0 6px; }
  ul { margin: 0; padding-left: 18px; }
  li { margin-bottom: 3px; }
  .muted { color: #6b7280; font-size: 10px; }
  .header { display: flex; justify-content: space-between; align-items: flex-start; gap: 16px; }
  .score-box { text-align: center; min-width: 96px; }
  .score-number { font-size: 40px; font-weight: 700; line-height: 1; }
  .bar-row { display: flex; align-items: center; gap: 8px; margin-bottom: 6px; }
  .bar-label { width: 110px; }
  .bar-track { flex: 1; height: 8px; background: #e5e7eb; border-radius: 4px; overflow: hidden; }
  .bar-fill { display: block; height: 100%; }
  .bar-value { width: 28px; text-align: right; font-weight: 600; }
  table { width: 100%; border-collapse: collapse; table-layout: fixed; }
  th, td { border: 1px solid #e5e7eb; padding: 6px; vertical-align: top; text-align: left; word-wrap: break-word; }
  th { background: #f3f4f6; font-size: 10px; }
  tr { page-break-inside: avoid; }
  .badge { display: inline-block; padding: 1px 6px; border-radius: 3px; font-size: 9px; font-weight: 700; color: #ffffff; }
  .badge-critical { background: #b91c1c; }
  .badge-high { background: #c2410c; }
  .badge-medium { background: #b45309; }
  .badge-low { background: #4b5563; }
</style>
</head>
<body>
  <div class="header">
    <div>
      <h1>SEO Audit Report</h1>
      <p><strong>${esc(input.clientName)}</strong></p>
      <p class="muted">${esc(input.websiteUrl)}</p>
      <p class="muted">${esc(input.businessType)} | ${esc(input.city)}, ${esc(input.state)} | ${esc(dateText)}</p>
    </div>
    <div class="score-box">
      <div class="score-number" style="color:${scoreColor(result.overall_score)}">${result.overall_score}</div>
      <div class="muted">out of 100</div>
    </div>
  </div>

  <h2>Executive summary</h2>
  <p>${esc(result.executive_summary)}</p>

  <h2>Score breakdown</h2>
  ${renderBreakdown(result.score_breakdown)}

  <h2>Critical issues</h2>
  ${renderList(result.critical_issues, "No critical issues found.")}

  <h2>Important issues</h2>
  ${renderList(result.important_issues, "No important issues found.")}

  <h2>Quick wins</h2>
  ${renderList(result.quick_wins, "No quick wins identified.")}

  <h2>Recommendations</h2>
  ${renderRecommendations(result.recommendations)}
</body>
</html>`;
}