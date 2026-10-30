//#region File Documentation
/**
 * File: src/crawlers/gsc.ts
 * Updated: 2026-10-30
 *
 * Purpose:
 * - Returns Google Search Console data (mock when USE_MOCKS is true).
 * - Rendering model: Server-only module.
 *
 * Changes:
 * - New file.
 *
 * Safety:
 * - Mock mode returns the exact data from the assessment document.
 *
 * Connected Modules:
 * - src/mocks/index.js, src/mocks/gsc.mock.js, src/types/seo.ts
 *
 * Dependencies:
 * - None.
 */
//#endregion

import { USE_MOCKS } from "@/mocks";
import mockData from "@/mocks/gsc.mock";
import type { GscData } from "@/types/seo";

export async function getSearchConsoleData(url: string): Promise<GscData> {
  if (USE_MOCKS) return mockData;
  throw new Error(`Real Search Console call is not implemented yet for ${url}`);
}