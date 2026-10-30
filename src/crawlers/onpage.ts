//#region File Documentation
/**
 * File: src/crawlers/onpage.ts
 * Updated: 2026-10-30
 *
 * Purpose:
 * - Parses page HTML with Cheerio and extracts on-page SEO signals.
 * - Rendering model: Server-only module.
 *
 * Changes:
 * - New file.
 *
 * Safety:
 * - Pure function. No network calls, no side effects.
 *
 * Connected Modules:
 * - src/crawlers/fetcher.ts (provides the HTML), src/types/seo.ts
 *
 * Dependencies:
 * - cheerio: server-side HTML parsing.
 */
//#endregion

import * as cheerio from "cheerio";
import type { OnPageData } from "@/types/seo";

const MAX_H1_TEXTS = 5;

function cleanText(value: string | undefined): string {
  return (value ?? "").replace(/\s+/g, " ").trim();
}

function normalizeHost(hostname: string): string {
  return hostname.toLowerCase().replace(/^www\./, "");
}

export function analyzeOnPage(html: string, pageUrl: string): OnPageData {
  const $ = cheerio.load(html);

  const title = cleanText($("title").first().text()) || null;
  const metaDescription =
    cleanText($('meta[name="description"]').attr("content")) || null;
  const canonicalUrl = $('link[rel="canonical"]').attr("href")?.trim() || null;
  const robotsMeta = $('meta[name="robots"]').attr("content")?.trim() || null;
  const language = $("html").attr("lang")?.trim() || null;
  const hasViewportMeta = $('meta[name="viewport"]').length > 0;

  const h1Texts: string[] = [];
  $("h1").each((_, element) => {
    const text = cleanText($(element).text());
    if (text && h1Texts.length < MAX_H1_TEXTS) {
      h1Texts.push(text);
    }
  });

  let missingAlt = 0;
  const images = $("img");
  images.each((_, element) => {
    if (typeof $(element).attr("alt") === "undefined") {
      missingAlt += 1;
    }
  });

  const pageHost = normalizeHost(new URL(pageUrl).hostname);
  let internal = 0;
  let external = 0;
  let emptyAnchorText = 0;

  $("a[href]").each((_, element) => {
    const href = ($(element).attr("href") ?? "").trim();
    if (!href || href.startsWith("#") || /^(mailto:|tel:|javascript:)/i.test(href)) {
      return;
    }

    let target: URL;
    try {
      target = new URL(href, pageUrl);
    } catch {
      return;
    }
    if (target.protocol !== "http:" && target.protocol !== "https:") {
      return;
    }

    if (normalizeHost(target.hostname) === pageHost) {
      internal += 1;
    } else {
      external += 1;
    }

    const hasText = cleanText($(element).text()).length > 0;
    const hasAriaLabel = Boolean($(element).attr("aria-label")?.trim());
    const hasImageAlt = $(element).find("img[alt]").length > 0;
    if (!hasText && !hasAriaLabel && !hasImageAlt) {
      emptyAnchorText += 1;
    }
  });

  const bodyClone = $("body").clone();
  bodyClone.find("script, style, noscript").remove();
  const bodyText = cleanText(bodyClone.text());
  const wordCount = bodyText ? bodyText.split(" ").length : 0;

  return {
    title,
    titleLength: title?.length ?? 0,
    metaDescription,
    metaDescriptionLength: metaDescription?.length ?? 0,
    canonicalUrl,
    robotsMeta,
    language,
    hasViewportMeta,
    headings: {
      h1Count: $("h1").length,
      h1Texts,
      h2Count: $("h2").length,
      h3Count: $("h3").length,
    },
    images: {
      total: images.length,
      missingAlt,
    },
    links: {
      internal,
      external,
      emptyAnchorText,
    },
    wordCount,
    openGraph: {
      hasTitle: $('meta[property="og:title"]').length > 0,
      hasDescription: $('meta[property="og:description"]').length > 0,
      hasImage: $('meta[property="og:image"]').length > 0,
    },
  };
}