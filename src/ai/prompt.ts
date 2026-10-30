//#region File Documentation
/**
 * File: src/ai/prompt.ts
 * Updated: 2026-10-30
 *
 * Purpose:
 * - Holds the master SEO audit system prompt and builds the user prompt at runtime.
 * - Rendering model: Server-only module.
 *
 * Changes:
 * - New file. Prompt text is taken from the assessment document.
 *
 * Safety:
 * - Pure functions. All template variables are replaced from typed input.
 *
 * Connected Modules:
 * - src/ai/analyze.ts, src/types/audit.ts
 *
 * Dependencies:
 * - None.
 */
//#endregion

import type { AnalysisInput } from "@/types/audit";

export const AUDIT_MODEL = "claude-sonnet-4-6";

export const SYSTEM_PROMPT = `You are a senior SEO analyst with 15+ years experience specialising in
Indian local business websites, healthcare, dental, and real estate sectors.
You produce honest, falsifiable, prioritised SEO audit reports.
Your output must be valid JSON only — no markdown, no preamble.
Every recommendation must include: finding, fix, estimated_impact (High/Medium/Low),
effort (Hours/Days/Weeks), falsifiability_check (how we know if this worked).`;

function toJson(value: unknown): string {
  return JSON.stringify(value, null, 2);
}

export function buildUserPrompt(input: AnalysisInput): string {
  return `Analyse the following SEO signals for: ${input.url}
Business type: ${input.businessType}
Business location: ${input.city}, ${input.state}, India

=== ON-PAGE DATA ===
${toJson(input.onPage)}

=== TECHNICAL DATA ===
${toJson(input.technical)}

=== CORE WEB VITALS ===
${toJson(input.coreWebVitals)}

=== SCHEMA.ORG DATA ===
${toJson(input.schema)}

=== GOOGLE SEARCH CONSOLE ===
${toJson(input.searchConsole)}

=== KEYWORD RANKINGS ===
${toJson(input.rankings)}

Respond ONLY with this JSON structure — no other text:
{
  "audit_version": "v1.0",
  "overall_score": <integer 0-100>,
  "score_breakdown": { "technical": <0-100>, "on_page": <0-100>,
    "content": <0-100>, "core_web_vitals": <0-100>, "schema": <0-100> },
  "critical_issues": [<max 5 items>],
  "important_issues": [<max 8 items>],
  "quick_wins": [<max 5 items — effort <= 2 hours>],
  "recommendations": [{
    "priority": "CRITICAL|HIGH|MEDIUM|LOW",
    "category": "Technical|OnPage|Content|Schema|CWV",
    "finding": "<what is wrong>",
    "fix": "<exact action to take>",
    "estimated_impact": "High|Medium|Low",
    "effort": "Hours|Days|Weeks",
    "falsifiability_check": "<how to verify this worked>"
  }],
  "executive_summary": "<3 sentences max, plain English>"
}`;
}