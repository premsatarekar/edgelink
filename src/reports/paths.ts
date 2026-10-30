//#region File Documentation
/**
 * File: src/reports/paths.ts
 * Updated: 2026-10-30
 *
 * Purpose:
 * - Single place for the folder where generated PDF reports are stored.
 * - Rendering model: Server-only module.
 *
 * Changes:
 * - New file. Split out of generate-pdf.ts so API routes do not import puppeteer.
 *
 * Safety:
 * - Constant only. /tmp/reports replaces Cloudflare R2 as the assessment document requires.
 *
 * Connected Modules:
 * - src/reports/generate-pdf.ts, src/app/api/audits/[id]/pdf/route.ts
 *
 * Dependencies:
 * - None.
 */
//#endregion

export const REPORTS_DIR = "/tmp/reports";