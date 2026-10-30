//#region File Documentation
/**
 * File: src/crawlers/technical.ts
 * Updated: 2026-10-30
 *
 * Purpose:
 * - Technical SEO checks: HTTPS, response time, security headers, robots.txt, sitemap.xml.
 * - Rendering model: Server-only module.
 *
 * Changes:
 * - New file.
 *
 * Safety:
 * - robots.txt and sitemap failures are captured in the result, never thrown.
 *
 * Connected Modules:
 * - src/crawlers/fetcher.ts, src/types/seo.ts
 *
 * Dependencies:
 * - None.
 */
//#endregion

import { fetchResource } from "@/crawlers/fetcher";
import type {
  FetchResult,
  RobotsInfo,
  SitemapInfo,
  TechnicalData,
} from "@/types/seo";

function getErrorMessage(error: unknown): string {
  return error instanceof Error ? error.message : "Unknown error";
}

function parseRobots(text: string): {
  blocksAllCrawlers: boolean;
  sitemapUrls: string[];
} {
  const sitemapUrls: string[] = [];
  let appliesToAll = false;
  let blocksAllCrawlers = false;

  for (const rawLine of text.split(/\r?\n/)) {
    const line = rawLine.split("#")[0].trim();
    if (!line) continue;

    const separatorIndex = line.indexOf(":");
    if (separatorIndex === -1) continue;

    const field = line.slice(0, separatorIndex).trim().toLowerCase();
    const value = line.slice(separatorIndex + 1).trim();

    if (field === "user-agent") {
      appliesToAll = value === "*";
    } else if (field === "disallow" && appliesToAll && value === "/") {
      blocksAllCrawlers = true;
    } else if (field === "sitemap" && value) {
      sitemapUrls.push(value);
    }
  }

  return { blocksAllCrawlers, sitemapUrls };
}

async function checkRobots(origin: string): Promise<RobotsInfo> {
  try {
    const result = await fetchResource(`${origin}/robots.txt`);
    const exists = result.status === 200 && !result.contentType.includes("text/html");
    if (!exists) {
      return { exists: false, blocksAllCrawlers: false, sitemapUrls: [], error: null };
    }
    const parsed = parseRobots(result.body);
    return { exists: true, ...parsed, error: null };
  } catch (error) {
    return {
      exists: false,
      blocksAllCrawlers: false,
      sitemapUrls: [],
      error: getErrorMessage(error),
    };
  }
}

async function checkSitemap(origin: string, declared: string[]): Promise<SitemapInfo> {
  const url = declared[0] ?? `${origin}/sitemap.xml`;
  try {
    const result = await fetchResource(url);
    const isIndex = /<sitemapindex/i.test(result.body);
    const isUrlSet = /<urlset/i.test(result.body);
    const exists = result.status === 200 && (isIndex || isUrlSet);
    const urlCount = exists ? (result.body.match(/<loc>/gi) ?? []).length : 0;
    return { url, exists, isIndex, urlCount, error: null };
  } catch (error) {
    return {
      url,
      exists: false,
      isIndex: false,
      urlCount: 0,
      error: getErrorMessage(error),
    };
  }
}

export async function analyzeTechnical(page: FetchResult): Promise<TechnicalData> {
  const origin = new URL(page.finalUrl).origin;

  const robots = await checkRobots(origin);
  const sitemap = await checkSitemap(origin, robots.sitemapUrls);

  return {
    isHttps: page.finalUrl.startsWith("https://"),
    statusCode: page.status,
    redirected: page.redirected,
    finalUrl: page.finalUrl,
    responseTimeMs: page.responseTimeMs,
    htmlSizeKb: page.sizeKb,
    securityHeaders: {
      hsts: "strict-transport-security" in page.headers,
      xFrameOptions: "x-frame-options" in page.headers,
      xContentTypeOptions: "x-content-type-options" in page.headers,
      contentSecurityPolicy: "content-security-policy" in page.headers,
    },
    robots,
    sitemap,
  };
}