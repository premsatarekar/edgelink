//#region File Documentation
/**
 * File: src/app/api/audits/[id]/route.ts
 * Updated: 2026-10-30
 *
 * Purpose:
 * - GET returns one audit: status, progress, scores and the full Claude result.
 * - Rendering model: Route Handler (Node runtime).
 *
 * Changes:
 * - New file.
 *
 * Safety:
 * - The server file path of the PDF is never exposed; only a hasPdf flag is returned.
 *
 * Connected Modules:
 * - src/lib/validations.ts, src/lib/api-response.ts, src/lib/prisma.ts
 *
 * Dependencies:
 * - @prisma/client: database access (via src/lib/prisma.ts).
 */
//#endregion

import { jsonError, jsonOk, serverError } from "@/lib/api-response";
import { prisma } from "@/lib/prisma";
import { idSchema } from "@/lib/validations";

export const dynamic = "force-dynamic";

interface RouteContext {
  params: { id: string };
}

export async function GET(_request: Request, { params }: RouteContext) {
  try {
    const id = idSchema.safeParse(params.id);
    if (!id.success) {
      return jsonError("Invalid audit id", 400);
    }

    const audit = await prisma.audit.findUnique({
      where: { id: id.data },
      select: {
        id: true,
        clientId: true,
        status: true,
        progress: true,
        currentStep: true,
        overallScore: true,
        scoreBreakdown: true,
        result: true,
        pdfPath: true,
        errorMessage: true,
        createdAt: true,
        startedAt: true,
        completedAt: true,
        client: {
          select: { name: true, websiteUrl: true, businessType: true, city: true, state: true },
        },
      },
    });
    if (!audit) {
      return jsonError("Audit not found", 404);
    }

    const { pdfPath, ...rest } = audit;
    return jsonOk({ ...rest, hasPdf: Boolean(pdfPath) });
  } catch (error) {
    return serverError(error);
  }
}