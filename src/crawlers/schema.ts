//#region File Documentation
/**
 * File: src/crawlers/schema.ts
 * Updated: 2026-10-30
 *
 * Purpose:
 * - Extracts JSON-LD blocks and checks required properties for common Schema.org types.
 * - Rendering model: Server-only module.
 *
 * Changes:
 * - New file.
 *
 * Safety:
 * - Pure function. Invalid JSON is counted as a parse error, never thrown.
 *
 * Connected Modules:
 * - src/crawlers/fetcher.ts (provides the HTML), src/types/seo.ts
 *
 * Dependencies:
 * - cheerio: finds the JSON-LD script tags.
 */
//#endregion

import * as cheerio from "cheerio";
import type { SchemaData, SchemaItem } from "@/types/seo";

const LOCAL_BUSINESS_TYPES = new Set([
  "LocalBusiness",
  "Dentist",
  "MedicalBusiness",
  "MedicalClinic",
  "Physician",
  "Hospital",
  "RealEstateAgent",
]);

const REQUIRED_PROPERTIES: Record<string, string[]> = {
  LocalBusiness: ["name", "address", "telephone"],
  Dentist: ["name", "address", "telephone"],
  MedicalBusiness: ["name", "address", "telephone"],
  MedicalClinic: ["name", "address", "telephone"],
  Physician: ["name", "address", "telephone"],
  Hospital: ["name", "address", "telephone"],
  RealEstateAgent: ["name", "address", "telephone"],
  Organization: ["name", "url"],
  WebSite: ["name", "url"],
  BreadcrumbList: ["itemListElement"],
  FAQPage: ["mainEntity"],
};

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function isEmptyValue(value: unknown): boolean {
  if (value === undefined || value === null) return true;
  if (typeof value === "string") return value.trim().length === 0;
  if (Array.isArray(value)) return value.length === 0;
  return false;
}

function collectNodes(value: unknown, nodes: Record<string, unknown>[]): void {
  if (Array.isArray(value)) {
    value.forEach((entry) => collectNodes(entry, nodes));
    return;
  }
  if (!isRecord(value)) return;

  if (Array.isArray(value["@graph"])) {
    collectNodes(value["@graph"], nodes);
  }
  if (value["@type"] !== undefined) {
    nodes.push(value);
  }
}

function readTypes(node: Record<string, unknown>): string[] {
  const rawType = node["@type"];
  if (typeof rawType === "string") return [rawType];
  if (Array.isArray(rawType)) {
    return rawType.filter((entry): entry is string => typeof entry === "string");
  }
  return [];
}

export function analyzeSchema(html: string): SchemaData {
  const $ = cheerio.load(html);
  const scripts = $('script[type="application/ld+json"]');

  const nodes: Record<string, unknown>[] = [];
  let parseErrors = 0;

  scripts.each((_, element) => {
    const raw = $(element).contents().text();
    try {
      collectNodes(JSON.parse(raw), nodes);
    } catch {
      parseErrors += 1;
    }
  });

  const typeSet = new Set<string>();
  const items: SchemaItem[] = [];

  for (const node of nodes) {
    const types = readTypes(node);
    types.forEach((type) => typeSet.add(type));

    const checkedType = types.find((type) => type in REQUIRED_PROPERTIES);
    if (!checkedType) continue;

    const missingProperties = REQUIRED_PROPERTIES[checkedType].filter((property) =>
      isEmptyValue(node[property]),
    );
    items.push({ type: checkedType, missingProperties });
  }

  const types = Array.from(typeSet);

  return {
    blockCount: scripts.length,
    parseErrors,
    types,
    items,
    hasLocalBusinessSchema: types.some((type) => LOCAL_BUSINESS_TYPES.has(type)),
  };
}