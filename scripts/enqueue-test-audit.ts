//#region File Documentation
/**
 * File: scripts/enqueue-test-audit.ts
 * Updated: 2026-10-30
 *
 * Purpose:
 * - Developer script: creates a client and audit, queues it, and prints progress until it ends.
 * - Rendering model: Node script (not part of the Next.js bundle).
 *
 * Changes:
 * - New file.
 *
 * Safety:
 * - Only inserts one test client (reused on later runs) and one audit row per run.
 *
 * Connected Modules:
 * - src/queue/audit.queue.ts, src/lib/prisma.ts
 *
 * Dependencies:
 * - tsx: runs this TypeScript file directly.
 */
//#endregion

import { AuditStatus } from "@prisma/client";
import { prisma } from "../src/lib/prisma";
import { enqueueAudit, getAuditQueue } from "../src/queue/audit.queue";

const POLL_INTERVAL_MS = 1_000;
const TIMEOUT_MS = 120_000;

function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function main(): Promise<void> {
  const websiteUrl = process.argv[2] ?? "https://example.com";

  const existingClient = await prisma.client.findFirst({ where: { websiteUrl } });
  const client =
    existingClient ??
    (await prisma.client.create({
      data: {
        name: "Test Client",
        websiteUrl,
        businessType: "Dental clinic",
        city: "Pune",
        state: "Maharashtra",
      },
    }));

  const audit = await prisma.audit.create({ data: { clientId: client.id } });
  await enqueueAudit(audit.id);
  console.log(`Queued audit ${audit.id} for ${websiteUrl}`);

  let lastLine = "";
  const startedAt = Date.now();

  while (Date.now() - startedAt < TIMEOUT_MS) {
    const current = await prisma.audit.findUnique({ where: { id: audit.id } });
    if (!current) throw new Error("Audit disappeared from the database");

    const line = `${current.status} ${current.progress}% ${current.currentStep ?? ""}`;
    if (line !== lastLine) {
      console.log(line);
      lastLine = line;
    }

    if (current.status === AuditStatus.COMPLETED) {
      console.log("Overall score:", current.overallScore);
      return;
    }
    if (current.status === AuditStatus.FAILED) {
      console.log("Failed:", current.errorMessage);
      process.exitCode = 1;
      return;
    }
    await sleep(POLL_INTERVAL_MS);
  }

  console.log("Timed out. Is the worker running? (npm run worker)");
  process.exitCode = 1;
}

main()
  .catch((error: unknown) => {
    console.error("Enqueue test failed:", error);
    process.exitCode = 1;
  })
  .finally(async () => {
    await getAuditQueue().close();
    await prisma.$disconnect();
  });