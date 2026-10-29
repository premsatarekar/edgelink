//#region File Documentation
/**
 * File: src/mocks/dataforseo.mock.js
 * Updated: 2026-10-29
 *
 * Purpose:
 * - Mock DataForSEO keyword rankings response.
 * - Rendering model: Server-only module.
 *
 * Changes:
 * - New file, data copied as-is from the assessment document.
 *
 * Safety:
 * - Static data, no side effects.
 *
 * Connected Modules:
 * - src/crawlers/dataforseo.ts (to be created)
 *
 * Dependencies:
 * - None.
 */
//#endregion

module.exports = {
  tasks: [{
    result: [{
      keyword: 'dental clinic pune',
      items: [
        { type: 'organic', rank_group: 1, rank_absolute: 4, domain: 'example-dental-clinic.com' },
        { type: 'organic', rank_group: 2, rank_absolute: 8, domain: 'competitorA.com' },
        { type: 'organic', rank_group: 3, rank_absolute: 12, domain: 'competitorB.com' }
      ]
    }]
  }],
  client_rank_position: 4,
  keyword_search_volume: 1900
};