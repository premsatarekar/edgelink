//#region File Documentation
/**
 * File: src/mocks/index.js
 * Updated: 2026-10-29
 *
 * Purpose:
 * - Single toggle switch for all mock integrations.
 * - Rendering model: Server-only module.
 *
 * Changes:
 * - New file, copied as specified in the assessment document.
 *
 * Safety:
 * - Reads USE_MOCKS from the environment only.
 *
 * Connected Modules:
 * - src/crawlers/*, src/mocks/*.mock.js
 *
 * Dependencies:
 * - None.
 */
//#endregion

const USE_MOCKS = process.env.USE_MOCKS === 'true';
module.exports = { USE_MOCKS };