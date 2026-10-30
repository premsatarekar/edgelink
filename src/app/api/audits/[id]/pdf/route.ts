//#region File Documentation
/**
 * File: src/app/api/audits/[id]/pdf/route.ts
 * Updated: 2026-10-30
 *
 * Purpose:
 * - GET downloads the generated PDF report for an audit.
 * - Rendering model: Route Handler (Node runtime, reads from the local file system).
 *
 * Changes:
 * - New file.
 *
 * Safety:
 * - The file path is built from the validated audit id and REPORTS_DIR, never from user input.
 * - Works where the API and the worker share a file system (local, VPS). On Vercel the file
 *   would need real storage such as R2, which this assessment mocks with /tmp/reports.
 *
 * Connected Modules:
 * - src/reports/paths.ts, src/lib/validations.ts, src/lib/prisma.ts
 *
 * Dependencies:
 * - None beyond Node built-ins.
 */
//#endregion

import { readFile } from "node:fs/promises";
import path from "node:path";
import { NextResponse } from "next/server";
import { jsonError, serverError } from "@/lib/api-response";
import { prisma } from "@/lib/prisma";
import { REPORTS_DIR } from "@/reports/paths";
import { idSchema } from "@/lib/validations";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

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
      select: { pdfPath: true },
    });
    if (!audit?.pdfPath) {
      return jsonError("Report is not available yet", 404);
    }

    let file: Buffer;
    try {
      file = await readFile(path.join(REPORTS_DIR, `${id.data}.pdf`));
    } catch {
      return jsonError("The report file is no longer available", 404);
    }

    return new NextResponse(new Uint8Array(file), {
      status: 200,
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": `attachment; filename="seo-audit-${id.data}.pdf"`,
        "Cache-Control": "private, no-store",
      },
    });
  } catch (error) {
    return serverError(error);
  }
}