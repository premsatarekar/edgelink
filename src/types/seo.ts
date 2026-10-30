//#region File Documentation
/**
 * File: src/types/seo.ts
 * Updated: 2026-10-30
 *
 * Purpose:
 * - Shared TypeScript types for crawl results and third-party (mocked) data.
 * - Rendering model: Types only, no runtime code.
 *
 * Changes:
 * - New file.
 *
 * Safety:
 * - Types only. No runtime behaviour.
 *
 * Connected Modules:
 * - src/crawlers/*, scripts/test-crawlers.ts
 *
 * Dependencies:
 * - None.
 */
//#endregion

export interface FetchResult {
  requestedUrl: string;
  finalUrl: string;
  status: number;
  redirected: boolean;
  responseTimeMs: number;
  contentType: string;
  headers: Record<string, string>;
  body: string;
  sizeKb: number;
}

export interface OnPageData {
  title: string | null;
  titleLength: number;
  metaDescription: string | null;
  metaDescriptionLength: number;
  canonicalUrl: string | null;
  robotsMeta: string | null;
  language: string | null;
  hasViewportMeta: boolean;
  headings: {
    h1Count: number;
    h1Texts: string[];
    h2Count: number;
    h3Count: number;
  };
  images: {
    total: number;
    missingAlt: number;
  };
  links: {
    internal: number;
    external: number;
    emptyAnchorText: number;
  };
  wordCount: number;
  openGraph: {
    hasTitle: boolean;
    hasDescription: boolean;
    hasImage: boolean;
  };
}

export interface SchemaItem {
  type: string;
  missingProperties: string[];
}

export interface SchemaData {
  blockCount: number;
  parseErrors: number;
  types: string[];
  items: SchemaItem[];
  hasLocalBusinessSchema: boolean;
}

export interface RobotsInfo {
  exists: boolean;
  blocksAllCrawlers: boolean;
  sitemapUrls: string[];
  error: string | null;
}

export interface SitemapInfo {
  url: string;
  exists: boolean;
  isIndex: boolean;
  urlCount: number;
  error: string | null;
}

export interface TechnicalData {
  isHttps: boolean;
  statusCode: number;
  redirected: boolean;
  finalUrl: string;
  responseTimeMs: number;
  htmlSizeKb: number;
  securityHeaders: {
    hsts: boolean;
    xFrameOptions: boolean;
    xContentTypeOptions: boolean;
    contentSecurityPolicy: boolean;
  };
  robots: RobotsInfo;
  sitemap: SitemapInfo;
}

export interface PageSpeedAudit {
  score: number;
  displayValue?: string;
  description?: string;
}

export interface PageSpeedData {
  url: string;
  strategy: string;
  categories: Record<string, { score: number }>;
  audits: Record<string, PageSpeedAudit>;
}

export interface GscRow {
  query: string;
  clicks: number;
  impressions: number;
  ctr: number;
  position: number;
}

export interface GscData {
  rows: GscRow[];
  totalClicks: number;
  totalImpressions: number;
  indexCoverageErrors: number;
}

export interface RankingItem {
  type: string;
  rank_group: number;
  rank_absolute: number;
  domain: string;
}

export interface RankingsData {
  tasks: Array<{
    result: Array<{
      keyword: string;
      items: RankingItem[];
    }>;
  }>;
  client_rank_position: number;
  keyword_search_volume: number;
}