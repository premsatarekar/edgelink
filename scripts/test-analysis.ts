//#region File Documentation
/**
 * File: scripts/test-analysis.ts
 * Updated: 2026-10-30
 *
 * Purpose:
 * - Developer script: runs all crawlers on a URL, then the Claude analysis, and prints the result.
 * - Rendering model: Node script (not part of the Next.js bundle).
 *
 * Changes:
 * - New file.
 *
 * Safety:
 * - Read-only. Pass --real to call the real Claude API (needs ANTHROPIC_API_KEY).
 *
 * Connected Modules:
 * - src/crawlers/*, src/ai/analyze.ts
 *
 * Dependencies:
 * - tsx: runs this TypeScript file directly.
 */
//#endregion

import { analyzeWithClaude } from "../src/ai/analyze";
import { getKeywordRankings } from "../src/crawlers/dataforseo";
import { fetchResource } from "../src/crawlers/fetcher";
import { getSearchConsoleData } from "../src/crawlers/gsc";
import { analyzeOnPage } from "../src/crawlers/onpage";
import { getPageSpeed } from "../src/crawlers/pagespeed";
import { analyzeSchema } from "../src/crawlers/schema";
import { analyzeTechnical } from "../src/crawlers/technical";

async function main(): Promise<void> {
  const args = process.argv.slice(2);
  const forceReal = args.includes("--real");
  const url = args.find((arg) => !arg.startsWith("--")) ?? "https://example.com";

  console.log(`Testing URL: ${url} | Claude: ${forceReal ? "REAL" : "per USE_MOCKS"}`);

  const page = await fetchResource(url);

  const result = await analyzeWithClaude(
    {
      url,
      businessType: "Dental clinic",
      city: "Pune",
      state: "Maharashtra",
      onPage: analyzeOnPage(page.body, page.finalUrl),
      technical: await analyzeTechnical(page),
      coreWebVitals: await getPageSpeed(url),
      schema: analyzeSchema(page.body),
      searchConsole: await getSearchConsoleData(url),
      rankings: await getKeywordRankings(url),
    },
    { forceReal },
  );

  console.log("\nOverall score:", result.overall_score);
  console.log("Breakdown:", result.score_breakdown);
  console.log(
    `Critical: ${result.critical_issues.length} | Important: ${result.important_issues.length} | Quick wins: ${result.quick_wins.length} | Recommendations: ${result.recommendations.length}`,
  );
  console.log("\nFull result:\n", JSON.stringify(result, null, 2));
}

main().catch((error: unknown) => {
  console.error("Analysis test failed:", error);
  process.exitCode = 1;
});