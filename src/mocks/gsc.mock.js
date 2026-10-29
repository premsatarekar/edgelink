//#region File Documentation
/**
 * File: src/mocks/gsc.mock.js
 * Updated: 2026-10-29
 *
 * Purpose:
 * - Mock Google Search Console response.
 * - Rendering model: Server-only module.
 *
 * Changes:
 * - New file, data copied as-is from the assessment document.
 *
 * Safety:
 * - Static data, no side effects.
 *
 * Connected Modules:
 * - src/crawlers/gsc.ts (to be created)
 *
 * Dependencies:
 * - None.
 */
//#endregion

module.exports = {
  rows: [
    { query: 'dental clinic in pune', clicks: 42, impressions: 980, ctr: 0.043, position: 6.2 },
    { query: 'best dentist pune', clicks: 28, impressions: 740, ctr: 0.038, position: 8.1 },
    { query: 'tooth extraction pune', clicks: 19, impressions: 430, ctr: 0.044, position: 5.7 },
    { query: 'dental implants cost pune', clicks: 11, impressions: 310, ctr: 0.035, position: 11.3 },
    { query: 'dentist near me', clicks: 67, impressions: 2100, ctr: 0.032, position: 9.4 }
  ],
  totalClicks: 167,
  totalImpressions: 4560,
  indexCoverageErrors: 3
};