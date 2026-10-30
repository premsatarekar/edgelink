//#region File Documentation
/**
 * File: src/delivery/deliver-report.ts
 * Updated: 2026-10-30
 *
 * Purpose:
 * - Delivers the finished PDF report by WhatsApp and email (mock when USE_MOCKS is true).
 * - Rendering model: Server-only module.
 *
 * Changes:
 * - New file.
 *
 * Safety:
 * - Mock mode only logs. Real mode throws a clear error until real keys are wired in.
 *
 * Connected Modules:
 * - src/mocks/index.js, src/mocks/twilio.mock.js, src/mocks/email.mock.ts, src/workers/audit-pipeline.ts
 *
 * Dependencies:
 * - None.
 */
//#endregion

import { USE_MOCKS } from "@/mocks";
import { sendEmail } from "@/mocks/email.mock";
import { sendWhatsApp } from "@/mocks/twilio.mock";

export interface DeliveryInput {
  clientId: string;
  clientName: string;
  contactEmail: string | null;
  pdfPath: string;
  score: number;
}

export async function deliverReport(input: DeliveryInput): Promise<void> {
  if (!USE_MOCKS) {
    throw new Error("Real WhatsApp and email delivery is not implemented yet");
  }

  await sendWhatsApp(input.clientId, input.pdfPath, input.score);
  await sendEmail(
    input.contactEmail,
    `SEO audit report for ${input.clientName} (score ${input.score}/100)`,
    input.pdfPath,
  );
}