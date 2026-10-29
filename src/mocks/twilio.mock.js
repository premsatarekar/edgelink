//#region File Documentation
/**
 * File: src/mocks/twilio.mock.js
 * Updated: 2026-10-29
 *
 * Purpose:
 * - Mock Twilio WhatsApp delivery that logs to the console.
 * - Rendering model: Server-only module.
 *
 * Changes:
 * - New file, code copied as-is from the assessment document.
 *
 * Safety:
 * - Only logs, sends nothing.
 *
 * Connected Modules:
 * - Audit worker (to be created)
 *
 * Dependencies:
 * - None.
 */
//#endregion

async function sendWhatsApp(clientId, pdfPath, score) {
  console.log('[MOCK WHATSAPP] → Client:', clientId);
  console.log('[MOCK WHATSAPP] → Score: ', score + '/100');
  console.log('[MOCK WHATSAPP] → Report:', pdfPath);
  return { status: 'mock_sent', sid: 'MOCK_SID_' + Date.now() };
}

module.exports = { sendWhatsApp };