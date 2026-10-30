//#region File Documentation
/**
 * File: src/reports/generate-pdf.ts
 * Updated: 2026-10-30
 *
 * Purpose:
 * - Renders the report HTML to an A4 PDF with Puppeteer and saves it locally.
 * - Rendering model: Server-only module (worker process).
 *
 * Changes:
 * - REPORTS_DIR now comes from src/reports/paths.ts instead of being defined here.
 * - PDF output and rendering logic are unchanged.
 *
 * Safety:
 * - The browser is always closed, even when rendering fails.
 * - The no-sandbox flag is used only on Linux, where servers usually run as root.
 *
 * Connected Modules:
 * - src/reports/report-template.ts, src/reports/paths.ts, src/workers/audit-pipeline.ts
 *
 * Dependencies:
 * - puppeteer: headless Chrome used to print HTML to PDF.
 */
//#endregion

import { mkdir } from "node:fs/promises";
import path from "node:path";
import puppeteer from "puppeteer";
import { REPORTS_DIR } from "@/reports/paths";
import { buildReportHtml, type ReportInput } from "@/reports/report-template";

export async function generatePdfReport(
  auditId: string,
  input: ReportInput,
): Promise<string> {
  await mkdir(REPORTS_DIR, { recursive: true });
  const pdfPath = path.join(REPORTS_DIR, `${auditId}.pdf`);

  const browser = await puppeteer.launch({
    headless: true,
    args: process.platform === "linux" ? ["--no-sandbox", "--disable-setuid-sandbox"] : [],
  });

  try {
    const page = await browser.newPage();
    await page.setContent(buildReportHtml(input), { waitUntil: "load" });
    await page.pdf({
      path: pdfPath,
      format: "A4",
      printBackground: true,
      margin: { top: "16mm", bottom: "16mm", left: "14mm", right: "14mm" },
    });
  } finally {
    await browser.close();
  }

  return pdfPath;
}