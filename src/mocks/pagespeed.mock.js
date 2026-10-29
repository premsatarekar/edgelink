//#region File Documentation
/**
 * File: src/mocks/pagespeed.mock.js
 * Updated: 2026-10-29
 *
 * Purpose:
 * - Mock Google PageSpeed Insights response.
 * - Rendering model: Server-only module.
 *
 * Changes:
 * - New file, data copied as-is from the assessment document.
 *
 * Safety:
 * - Static data, no side effects.
 *
 * Connected Modules:
 * - src/crawlers/pagespeed.ts (to be created)
 *
 * Dependencies:
 * - None.
 */
//#endregion

module.exports = {
  url: 'https://example-dental-clinic.com',
  strategy: 'mobile',
  categories: {
    performance: { score: 0.61 },
    seo: { score: 0.89 },
    accessibility: { score: 0.74 }
  },
  audits: {
    'largest-contentful-paint': { score: 0.4, displayValue: '4.2 s' },
    'cumulative-layout-shift': { score: 0.9, displayValue: '0.08' },
    'interaction-to-next-paint': { score: 0.6, displayValue: '280 ms' },
    'render-blocking-resources': { score: 0.5, description: '2 blocking resources' },
    'unused-javascript': { score: 0.4, displayValue: '420 KiB' }
  }
};