//#region File Documentation
/**
 * File: src/types/audit.ts
 * Updated: 2026-10-30
 *
 * Purpose:
 * - Types for the Claude analysis input and the validated audit result.
 * - Rendering model: Types only, no runtime code.
 *
 * Changes:
 * - New file.
 *
 * Safety:
 * - Types only. AuditResult is inferred from the zod schema so the two can never drift apart.
 *
 * Connected Modules:
 * - src/lib/audit-schema.ts, src/ai/prompt.ts, src/ai/analyze.ts, src/types/seo.ts
 *
 * Dependencies:
 * - zod: type inference only.
 */
//#endregion

import type { z } from "zod";
import type { auditResultSchema } from "@/lib/audit-schema";
import type {
  GscData,
  OnPageData,
  PageSpeedData,
  RankingsData,
  SchemaData,
  TechnicalData,
} from "@/types/seo";

export interface AnalysisInput {
  url: string;
  businessType: string;
  city: string;
  state: string;
  onPage: OnPageData;
  technical: TechnicalData;
  coreWebVitals: PageSpeedData;
  schema: SchemaData;
  searchConsole: GscData;
  rankings: RankingsData;
}

export type AuditResult = z.infer<typeof auditResultSchema>;