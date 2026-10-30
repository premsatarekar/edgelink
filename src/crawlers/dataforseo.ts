//#region File Documentation
/**
 * File: src/crawlers/dataforseo.ts
 * Updated: 2026-10-30
 *
 * Purpose:
 * - Returns DataForSEO keyword rankings (mock when USE_MOCKS is true).
 * - Rendering model: Server-only module.
 *
 * Changes:
 * - New file.
 *
 * Safety:
 * - Mock mode returns the exact data from the assessment document.
 *
 * Connected Modules:
 * - src/mocks/index.js, src/mocks/dataforseo.mock.js, src/types/seo.ts
 *
 * Dependencies:
 * - None.
 */
//#endregion

import { USE_MOCKS } from "@/mocks";
import mockData from "@/mocks/dataforseo.mock";
import type { RankingsData } from "@/types/seo";

export async function getKeywordRankings(url: string): Promise<RankingsData> {
  if (USE_MOCKS) return mockData;
  throw new Error(`Real DataForSEO call is not implemented yet for ${url}`);
}