//#region File Documentation
/**
 * File: src/crawlers/pagespeed.ts
 * Updated: 2026-10-30
 *
 * Purpose:
 * - Returns Google PageSpeed Insights data (mock when USE_MOCKS is true).
 * - Rendering model: Server-only module.
 *
 * Changes:
 * - New file.
 *
 * Safety:
 * - Mock mode returns the exact data from the assessment document.
 *
 * Connected Modules:
 * - src/mocks/index.js, src/mocks/pagespeed.mock.js, src/types/seo.ts
 *
 * Dependencies:
 * - None.
 */
//#endregion

import { USE_MOCKS } from "@/mocks";
import mockData from "@/mocks/pagespeed.mock";
import type { PageSpeedData } from "@/types/seo";

export async function getPageSpeed(url: string): Promise<PageSpeedData> {
  if (USE_MOCKS) return mockData;
  throw new Error(`Real PageSpeed Insights call is not implemented yet for ${url}`);
}