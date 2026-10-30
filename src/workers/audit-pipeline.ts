//#region File Documentation
/**
 * File: src/workers/audit-pipeline.ts
 * Updated: 2026-10-30
 *
 * Purpose:
 * - Runs one audit end to end: crawl, 7 signal steps, Claude analysis, DB save.
 * - Rendering model: Server-only module (called by the BullMQ worker).
 *
 * Changes:
 * - New file.
 *
 * Safety:
 * - Any failure sets the audit to FAILED with a short message, then rethrows for BullMQ.
 * - Progress is written to the database after every step so the admin portal can poll it.
 *
 * Connected Modules:
 * - src/crawlers/*, src/ai/analyze.ts, src/lib/prisma.ts, src/workers/audit.worker.ts
 *
 * Dependencies:
 * - @prisma/client: audit and client records.
 */
//#endregion

import { AuditStatus, type Prisma } from "@prisma/client";
import { analyzeWithClaude } from "@/ai/analyze";
import { getKeywordRankings } from "@/crawlers/dataforseo";
import { fetchResource } from "@/crawlers/fetcher";
import { getSearchConsoleData } from "@/crawlers/gsc";
import { analyzeOnPage } from "@/crawlers/onpage";
import { getPageSpeed } from "@/crawlers/pagespeed";
import { analyzeSchema } from "@/crawlers/schema";
import { analyzeTechnical } from "@/crawlers/technical";
import { prisma } from "@/lib/prisma";

export type ProgressReporter = (percent: number) => Promise<void>;

const MAX_ERROR_LENGTH = 500;

function toErrorMessage(error: unknown): string {
  const message = error instanceof Error ? error.message : "Unknown error";
  return message.slice(0, MAX_ERROR_LENGTH);
}

export async function runAuditPipeline(
  auditId: string,
  reportProgress: ProgressReporter,
): Promise<void> {
  const audit = await prisma.audit.findUnique({
    where: { id: auditId },
    include: { client: true },
  });

  if (!audit) {
    throw new Error(`Audit not found: ${auditId}`);
  }

  const { client } = audit;

  async function setStep(percent: number, step: string): Promise<void> {
    await prisma.audit.update({
      where: { id: auditId },
      data: { progress: percent, currentStep: step },
    });
    await reportProgress(percent);
    console.log(`[audit ${auditId}] ${percent}% - ${step}`);
  }

  await prisma.audit.update({
    where: { id: auditId },
    data: {
      status: AuditStatus.RUNNING,
      startedAt: new Date(),
      completedAt: null,
      progress: 0,
      currentStep: "Starting",
      errorMessage: null,
    },
  });

  try {
    await setStep(10, "Step 1: Crawling page");
    const page = await fetchResource(client.websiteUrl);
    if (page.status >= 400) {
      throw new Error(`Website returned HTTP ${page.status}`);
    }

    await setStep(25, "Step 2: PageSpeed Insights");
    const coreWebVitals = await getPageSpeed(client.websiteUrl);

    await setStep(35, "Step 3: Google Search Console");
    const searchConsole = await getSearchConsoleData(client.websiteUrl);

    await setStep(45, "Step 4: Schema.org validation");
    const schema = analyzeSchema(page.body);

    await setStep(55, "Step 5: On-page analysis");
    const onPage = analyzeOnPage(page.body, page.finalUrl);

    await setStep(65, "Step 6: robots.txt and sitemap.xml");
    const technical = await analyzeTechnical(page);

    await setStep(75, "Step 7: Keyword rankings");
    const rankings = await getKeywordRankings(client.websiteUrl);

    await setStep(85, "Claude: analysing all signals");
    const result = await analyzeWithClaude({
      url: client.websiteUrl,
      businessType: client.businessType,
      city: client.city,
      state: client.state,
      onPage,
      technical,
      coreWebVitals,
      schema,
      searchConsole,
      rankings,
    });

    await setStep(95, "Saving audit result");
    await prisma.audit.update({
      where: { id: auditId },
      data: {
        status: AuditStatus.COMPLETED,
        progress: 100,
        currentStep: "Completed",
        overallScore: result.overall_score,
        scoreBreakdown: result.score_breakdown as unknown as Prisma.InputJsonObject,
        result: result as unknown as Prisma.InputJsonObject,
        completedAt: new Date(),
      },
    });
    await reportProgress(100);
    console.log(`[audit ${auditId}] 100% - Completed (score ${result.overall_score})`);
  } catch (error) {
    try {
      await prisma.audit.update({
        where: { id: auditId },
        data: {
          status: AuditStatus.FAILED,
          currentStep: "Failed",
          errorMessage: toErrorMessage(error),
        },
      });
    } catch (updateError) {
      console.error(`[audit ${auditId}] could not save failure state:`, updateError);
    }
    throw error;
  }
}