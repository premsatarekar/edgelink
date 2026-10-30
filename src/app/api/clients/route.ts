//#region File Documentation
/**
 * File: src/app/api/clients/route.ts
 * Updated: 2026-10-30
 *
 * Purpose:
 * - GET lists clients with their latest audit. POST creates a client.
 * - Rendering model: Route Handler (Node runtime).
 *
 * Changes:
 * - New file.
 *
 * Safety:
 * - Input is validated with zod before any database write.
 * - A website URL can belong to only one client (409 on duplicates).
 * - No authentication yet (out of scope for this assessment, documented in README).
 *
 * Connected Modules:
 * - src/lib/validations.ts, src/lib/api-response.ts, src/lib/prisma.ts
 *
 * Dependencies:
 * - @prisma/client: database access (via src/lib/prisma.ts).
 */
//#endregion

import { jsonError, jsonOk, parseJsonBody, serverError } from "@/lib/api-response";
import { prisma } from "@/lib/prisma";
import { createClientSchema } from "@/lib/validations";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const clients = await prisma.client.findMany({
      orderBy: { createdAt: "desc" },
      take: 100,
      select: {
        id: true,
        name: true,
        websiteUrl: true,
        businessType: true,
        city: true,
        state: true,
        contactEmail: true,
        whatsappNumber: true,
        createdAt: true,
        audits: {
          orderBy: { createdAt: "desc" },
          take: 1,
          select: {
            id: true,
            status: true,
            progress: true,
            overallScore: true,
            completedAt: true,
          },
        },
      },
    });
    return jsonOk(clients);
  } catch (error) {
    return serverError(error);
  }
}

export async function POST(request: Request) {
  try {
    const parsed = await parseJsonBody(request, createClientSchema);
    if (!parsed.success) return parsed.response;

    const existing = await prisma.client.findFirst({
      where: { websiteUrl: parsed.data.websiteUrl },
      select: { id: true },
    });
    if (existing) {
      return jsonError("A client with this website URL already exists", 409);
    }

    const client = await prisma.client.create({ data: parsed.data });
    return jsonOk(client, 201);
  } catch (error) {
    return serverError(error);
  }
}