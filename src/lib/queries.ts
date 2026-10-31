//#region File Documentation
/**
 * File: src/lib/queries.ts
 * Updated: 2026-10-30
 *
 * Purpose:
 * - Server-side database queries used directly by Server Components.
 * - Rendering model: Server-only module (never import in a Client Component).
 *
 * Changes:
 * - New file.
 *
 * Safety:
 * - Read-only. Dates are converted to ISO strings so they can be passed to client components.
 *
 * Connected Modules:
 * - src/lib/prisma.ts, src/types/client.ts, src/app/admin/clients/page.tsx
 *
 * Dependencies:
 * - @prisma/client: database access (via src/lib/prisma.ts).
 */
//#endregion

import { prisma } from "@/lib/prisma";
import type { ClientListItem } from "@/types/client";

export async function getClientList(): Promise<ClientListItem[]> {
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

  return clients.map((client) => {
    const latest = client.audits[0];
    return {
      id: client.id,
      name: client.name,
      websiteUrl: client.websiteUrl,
      businessType: client.businessType,
      city: client.city,
      state: client.state,
      contactEmail: client.contactEmail,
      whatsappNumber: client.whatsappNumber,
      createdAt: client.createdAt.toISOString(),
      latestAudit: latest
        ? {
            id: latest.id,
            status: latest.status,
            progress: latest.progress,
            overallScore: latest.overallScore,
            completedAt: latest.completedAt ? latest.completedAt.toISOString() : null,
          }
        : null,
    };
  });
}