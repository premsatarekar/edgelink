//#region File Documentation
/**
 * File: src/mocks/email.mock.ts
 * Updated: 2026-10-30
 *
 * Purpose:
 * - Mock email delivery that logs to the console instead of sending.
 * - Rendering model: Server-only module.
 *
 * Changes:
 * - New file, same style as src/mocks/twilio.mock.js.
 *
 * Safety:
 * - Only logs, sends nothing.
 *
 * Connected Modules:
 * - src/delivery/deliver-report.ts
 *
 * Dependencies:
 * - None.
 */
//#endregion

export async function sendEmail(
  to: string | null,
  subject: string,
  pdfPath: string,
): Promise<{ status: string; id: string }> {
  console.log("[MOCK EMAIL] -> To:", to ?? "(no email on file)");
  console.log("[MOCK EMAIL] -> Subject:", subject);
  console.log("[MOCK EMAIL] -> Attachment:", pdfPath);
  return { status: "mock_sent", id: `MOCK_EMAIL_${Date.now()}` };
}