//#region File Documentation
/**
 * File: src/mocks/claude.mock.ts
 * Updated: 2026-10-30
 *
 * Purpose:
 * - Realistic fake Claude audit result matching the dental clinic mock data.
 * - Rendering model: Server-only module.
 *
 * Changes:
 * - New file.
 *
 * Safety:
 * - Static data. Validated against auditResultSchema before use in analyze.ts.
 *
 * Connected Modules:
 * - src/ai/analyze.ts, src/types/audit.ts
 *
 * Dependencies:
 * - None.
 */
//#endregion

import type { AuditResult } from "@/types/audit";

export const mockAuditResult: AuditResult = {
  audit_version: "v1.0",
  overall_score: 68,
  score_breakdown: {
    technical: 72,
    on_page: 70,
    content: 60,
    core_web_vitals: 55,
    schema: 65,
  },
  critical_issues: [
    "Largest Contentful Paint is 4.2 s on mobile, well above the 2.5 s good threshold.",
    "Google Search Console reports 3 index coverage errors, so some pages may not appear in search.",
    "Mobile performance score is 61, driven by 420 KiB of unused JavaScript and 2 render-blocking resources.",
  ],
  important_issues: [
    "No complete Dentist or LocalBusiness schema with address, phone and opening hours.",
    "Query 'dental implants cost pune' ranks at position 11.3, just off page one.",
    "Query 'dentist near me' has 2100 impressions but only a 3.2% click-through rate.",
    "Interaction to Next Paint is 280 ms, which needs improvement.",
  ],
  quick_wins: [
    "Defer or inline the 2 render-blocking resources.",
    "Rewrite the title and meta description for pages ranking between positions 8 and 12.",
    "Add FAQ schema to the main service page.",
  ],
  recommendations: [
    {
      priority: "CRITICAL",
      category: "Technical",
      finding: "Google Search Console shows 3 index coverage errors.",
      fix: "Open the Pages report in Search Console, group the errors by reason, fix each cause (404, noindex or redirect error), then request validation.",
      estimated_impact: "High",
      effort: "Days",
      falsifiability_check: "Index coverage errors drop to 0 in Search Console within 14 days and the affected URLs appear in a site: search.",
    },
    {
      priority: "CRITICAL",
      category: "CWV",
      finding: "Mobile Largest Contentful Paint is 4.2 s (score 0.4).",
      fix: "Compress and resize the hero image, serve it as WebP or AVIF, add a preload hint for it and remove lazy loading from the above-the-fold image.",
      estimated_impact: "High",
      effort: "Days",
      falsifiability_check: "PageSpeed Insights mobile LCP is 2.5 s or lower on three consecutive runs.",
    },
    {
      priority: "HIGH",
      category: "CWV",
      finding: "420 KiB of unused JavaScript and 2 render-blocking resources slow the first render.",
      fix: "Remove unused libraries, code-split the bundle and add defer or async to non-critical scripts and stylesheets.",
      estimated_impact: "Medium",
      effort: "Days",
      falsifiability_check: "The unused-javascript audit falls below 100 KiB and render-blocking resources show 0 in Lighthouse.",
    },
    {
      priority: "HIGH",
      category: "Schema",
      finding: "The site has no complete Dentist or LocalBusiness structured data.",
      fix: "Add JSON-LD of type Dentist with name, address, telephone, opening hours, geo coordinates and sameAs links to the home page.",
      estimated_impact: "Medium",
      effort: "Hours",
      falsifiability_check: "The Rich Results Test reports the Dentist item as valid with no missing required properties.",
    },
    {
      priority: "HIGH",
      category: "OnPage",
      finding: "Keywords such as 'dental implants cost pune' sit at positions 8 to 12 with low click-through.",
      fix: "Rewrite the title and meta description to include the exact query and a clear value proposition, and expand the page with a pricing section.",
      estimated_impact: "High",
      effort: "Hours",
      falsifiability_check: "Average position for the target queries improves by at least 2 places and CTR rises above 4% within 30 days in Search Console.",
    },
    {
      priority: "MEDIUM",
      category: "Content",
      finding: "Generic queries like 'dentist near me' bring impressions but few clicks, which suggests thin local-intent content.",
      fix: "Create dedicated service and locality pages with an FAQ section, doctor profiles and patient reviews.",
      estimated_impact: "Medium",
      effort: "Weeks",
      falsifiability_check: "Clicks for 'dentist near me' increase by 25% over 60 days compared with the current 67 clicks.",
    },
  ],
  executive_summary:
    "The site is reasonably solid on basic SEO, but slow mobile loading and 3 index coverage errors are holding it back. Fixing page speed and adding proper local business schema should give the biggest gains. Several keywords are close to page one and can be lifted with focused on-page work.",
};