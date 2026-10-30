//#region File Documentation
/**
 * File: scripts/test-crawlers.ts
 * Updated: 2026-10-30
 *
 * Purpose:
 * - Developer script that runs every crawler step on one URL and prints the result.
 * - Rendering model: Node script (not part of the Next.js bundle).
 *
 * Changes:
 * - New file.
 *
 * Safety:
 * - Read-only. Only fetches public pages and prints to the console.
 *
 * Connected Modules:
 * - src/crawlers/*
 *
 * Dependencies:
 * - tsx: runs this TypeScript file directly.
 */
//#endregion

import { fetchResource } from "../src/crawlers/fetcher";
import { analyzeOnPage } from "../src/crawlers/onpage";
import { analyzeSchema } from "../src/crawlers/schema";
import { analyzeTechnical } from "../src/crawlers/technical";
import { getPageSpeed } from "../src/crawlers/pagespeed";
import { getSearchConsoleData } from "../src/crawlers/gsc";
import { getKeywordRankings } from "../src/crawlers/dataforseo";

function printStep(label: string, data: unknown): void {
  console.log(`\n=== ${label} ===`);
  console.log(JSON.stringify(data, null, 2));
}

async function main(): Promise<void> {
  const url = process.argv[2] ?? "https://example.com";
  console.log("Testing URL:", url);

  const page = await fetchResource(url);
  printStep("Step 1: Fetch", {
    status: page.status,
    finalUrl: page.finalUrl,
    responseTimeMs: page.responseTimeMs,
    sizeKb: page.sizeKb,
  });

  printStep("Step 5: On-page", analyzeOnPage(page.body, page.finalUrl));
  printStep("Step 4: Schema", analyzeSchema(page.body));
  printStep("Step 6: Technical", await analyzeTechnical(page));
  printStep("Step 2: PageSpeed (mock)", await getPageSpeed(url));
  printStep("Step 3: GSC (mock)", await getSearchConsoleData(url));
  printStep("Step 7: Rankings (mock)", await getKeywordRankings(url));
}

main().catch((error: unknown) => {
  console.error("Crawler test failed:", error);
  process.exitCode = 1;
});