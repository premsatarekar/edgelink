//#region File Documentation
/**
 * File: src/crawlers/fetcher.ts
 * Updated: 2026-10-30
 *
 * Purpose:
 * - Single HTTP helper for all crawlers: timeout, user agent, size cap, SSRF guard.
 * - Rendering model: Server-only module (Node worker or Route Handler).
 *
 * Changes:
 * - New file.
 *
 * Safety:
 * - Blocks non-http(s) protocols, localhost and private IP ranges.
 * - Does not throw on non-2xx responses, only on network failure, timeout or blocked URL.
 *
 * Connected Modules:
 * - src/crawlers/technical.ts, scripts/test-crawlers.ts, src/types/seo.ts
 *
 * Dependencies:
 * - None (uses the built-in fetch).
 */
//#endregion

import type { FetchResult } from "@/types/seo";

const USER_AGENT = "SeoAuditBot/1.0 (+https://example.com/bot)";
const DEFAULT_TIMEOUT_MS = 10_000;
const DEFAULT_MAX_CHARS = 2_000_000;

const BLOCKED_HOSTNAMES = new Set(["localhost", "0.0.0.0", "[::1]"]);
const PRIVATE_IPV4_PATTERNS: RegExp[] = [
  /^127\./,
  /^10\./,
  /^192\.168\./,
  /^172\.(1[6-9]|2\d|3[01])\./,
  /^169\.254\./,
  /^0\./,
];

const CAPTURED_HEADERS = [
  "content-type",
  "strict-transport-security",
  "x-frame-options",
  "x-content-type-options",
  "content-security-policy",
] as const;

interface FetchOptions {
  timeoutMs?: number;
  maxChars?: number;
}

export function assertPublicHttpUrl(rawUrl: string): URL {
  let parsed: URL;
  try {
    parsed = new URL(rawUrl);
  } catch {
    throw new Error(`Invalid URL: ${rawUrl}`);
  }

  if (parsed.protocol !== "http:" && parsed.protocol !== "https:") {
    throw new Error(`Only http and https URLs are allowed: ${rawUrl}`);
  }

  const host = parsed.hostname.toLowerCase();
  const isBlocked =
    BLOCKED_HOSTNAMES.has(host) ||
    host.endsWith(".local") ||
    host.endsWith(".internal") ||
    PRIVATE_IPV4_PATTERNS.some((pattern) => pattern.test(host));

  if (isBlocked) {
    throw new Error(`URL points to a private or local address: ${rawUrl}`);
  }

  return parsed;
}

export async function fetchResource(
  rawUrl: string,
  options: FetchOptions = {},
): Promise<FetchResult> {
  const { timeoutMs = DEFAULT_TIMEOUT_MS, maxChars = DEFAULT_MAX_CHARS } = options;
  const url = assertPublicHttpUrl(rawUrl);

  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), timeoutMs);
  const startedAt = Date.now();

  try {
    const response = await fetch(url, {
      signal: controller.signal,
      redirect: "follow",
      cache: "no-store",
      headers: {
        "User-Agent": USER_AGENT,
        Accept: "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8",
      },
    });

    const text = await response.text();
    const responseTimeMs = Date.now() - startedAt;
    const finalUrl = response.url || url.toString();
    assertPublicHttpUrl(finalUrl);

    const body = text.length > maxChars ? text.slice(0, maxChars) : text;

    const headers: Record<string, string> = {};
    for (const name of CAPTURED_HEADERS) {
      const value = response.headers.get(name);
      if (value) {
        headers[name] = value;
      }
    }

    return {
      requestedUrl: url.toString(),
      finalUrl,
      status: response.status,
      redirected: response.redirected,
      responseTimeMs,
      contentType: response.headers.get("content-type") ?? "",
      headers,
      body,
      sizeKb: Math.round((Buffer.byteLength(body) / 1024) * 10) / 10,
    };
  } catch (error) {
    if (error instanceof Error && error.name === "AbortError") {
      throw new Error(`Request timed out after ${timeoutMs}ms: ${rawUrl}`);
    }
    throw error;
  } finally {
    clearTimeout(timer);
  }
}