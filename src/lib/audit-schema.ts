//#region File Documentation
/**
 * File: src/lib/audit-schema.ts
 * Updated: 2026-10-30
 *
 * Purpose:
 * - Zod schema for the JSON structure Claude must return (from the assessment document).
 * - Rendering model: Shared module (safe for server and client).
 *
 * Changes:
 * - New file.
 *
 * Safety:
 * - Limits match the prompt: max 5 critical, 8 important, 5 quick wins, scores 0 to 100.
 *
 * Connected Modules:
 * - src/types/audit.ts, src/ai/analyze.ts, src/mocks/claude.mock.ts
 *
 * Dependencies:
 * - zod: runtime validation of the AI response.
 */
//#endregion

import { z } from "zod";

const scoreSchema = z.number().int().min(0).max(100);

export const recommendationSchema = z.object({
  priority: z.enum(["CRITICAL", "HIGH", "MEDIUM", "LOW"]),
  category: z.enum(["Technical", "OnPage", "Content", "Schema", "CWV"]),
  finding: z.string().min(1),
  fix: z.string().min(1),
  estimated_impact: z.enum(["High", "Medium", "Low"]),
  effort: z.enum(["Hours", "Days", "Weeks"]),
  falsifiability_check: z.string().min(1),
});

export const auditResultSchema = z.object({
  audit_version: z.string().min(1),
  overall_score: scoreSchema,
  score_breakdown: z.object({
    technical: scoreSchema,
    on_page: scoreSchema,
    content: scoreSchema,
    core_web_vitals: scoreSchema,
    schema: scoreSchema,
  }),
  critical_issues: z.array(z.string().min(1)).max(5),
  important_issues: z.array(z.string().min(1)).max(8),
  quick_wins: z.array(z.string().min(1)).max(5),
  recommendations: z.array(recommendationSchema).min(1),
  executive_summary: z.string().min(1),
});