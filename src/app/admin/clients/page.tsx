//#region File Documentation
/**
 * File: src/app/admin/clients/page.tsx
 * Updated: 2026-10-30
 *
 * Purpose:
 * - Clients page: list of clients plus the add-client form.
 * - Rendering model: Server Component (reads the database directly, dynamic rendering).
 *
 * Changes:
 * - New file.
 *
 * Safety:
 * - Data errors are caught by src/app/admin/error.tsx. The form refreshes this page after saving.
 *
 * Connected Modules:
 * - src/lib/queries.ts, src/components/admin/clients-list.tsx,
 *   src/components/admin/add-client-form.tsx, src/data/admin-copy.ts
 *
 * Dependencies:
 * - None.
 */
//#endregion

import type { Metadata } from "next";
import { AddClientForm } from "@/components/admin/add-client-form";
import { ClientsList } from "@/components/admin/clients-list";
import { adminCopy } from "@/data/admin-copy";
import { getClientList } from "@/lib/queries";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: adminCopy.clients.metaTitle,
};

export default async function ClientsPage() {
  const clients = await getClientList();

  return (
    <div className="space-y-6">
      <header>
        <h1 className="text-xl font-semibold sm:text-2xl">{adminCopy.clients.title}</h1>
        <p className="mt-1 text-sm text-muted-foreground">{adminCopy.clients.description}</p>
      </header>

      <div className="grid gap-6 lg:grid-cols-3 lg:items-start">
        <section
          aria-labelledby="clients-heading"
          className="order-2 min-w-0 space-y-3 lg:order-1 lg:col-span-2"
        >
          <h2 id="clients-heading" className="text-base font-semibold">
            {adminCopy.clients.listTitle}
          </h2>
          <ClientsList clients={clients} />
        </section>
        <div className="order-1 min-w-0 lg:order-2">
          <AddClientForm />
        </div>
      </div>
    </div>
  );
}