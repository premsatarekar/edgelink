//#region File Documentation
/**
 * File: src/components/admin/clients-list.tsx
 * Updated: 2026-10-30
 *
 * Purpose:
 * - Shows clients as a table on md and larger screens and as cards on smaller screens.
 * - Rendering model: Server Component (renders the AuditControls client component inside).
 *
 * Changes:
 * - The latest-audit area now uses AuditControls (Run audit button and live progress).
 * - The key on AuditControls resets its state when the latest audit changes after a refresh.
 * - Layout, empty state and client details are unchanged.
 *
 * Safety:
 * - Long names and URLs wrap, so the page never scrolls sideways.
 * - External site links open in a new tab with rel="noopener noreferrer".
 *
 * Connected Modules:
 * - src/components/admin/audit-controls.tsx, src/data/admin-copy.ts, src/types/client.ts
 *
 * Dependencies:
 * - None.
 */
//#endregion

import { AuditControls } from '@/components/admin/audit-controls';
import { adminCopy } from '@/data/admin-copy';
import type { ClientListItem } from '@/types/client';

interface ClientsListProps {
  clients: ClientListItem[];
}

function ClientIdentity({ client }: { client: ClientListItem }) {
  return (
    <div className="min-w-0">
      <p className="break-words font-medium">{client.name}</p>
      <a
        href={client.websiteUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="break-all text-xs text-muted-foreground underline-offset-2 hover:underline"
      >
        {client.websiteUrl}
      </a>
    </div>
  );
}

function ClientAuditControls({ client }: { client: ClientListItem }) {
  const audit = client.latestAudit;
  return (
    <AuditControls
      key={`${client.id}-${audit?.id ?? 'none'}-${audit?.status ?? 'none'}`}
      clientId={client.id}
      clientName={client.name}
      latestAudit={audit}
    />
  );
}

export function ClientsList({ clients }: ClientsListProps) {
  if (clients.length === 0) {
    return (
      <div className="rounded-lg border border-dashed p-8 text-center">
        <p className="font-medium">{adminCopy.clients.emptyTitle}</p>
        <p className="mt-1 text-sm text-muted-foreground">
          {adminCopy.clients.emptyDescription}
        </p>
      </div>
    );
  }

  return (
    <>
      <div className="hidden overflow-hidden rounded-lg border md:block">
        <table className="w-full table-fixed border-collapse text-sm">
          <caption className="sr-only">
            {adminCopy.clients.tableCaption}
          </caption>
          <thead className="bg-muted text-left">
            <tr>
              <th scope="col" className="w-[32%] px-4 py-3 font-medium">
                {adminCopy.clients.columns.client}
              </th>
              <th scope="col" className="w-[24%] px-4 py-3 font-medium">
                {adminCopy.clients.columns.business}
              </th>
              <th scope="col" className="px-4 py-3 font-medium">
                {adminCopy.clients.columns.lastAudit}
              </th>
            </tr>
          </thead>
          <tbody>
            {clients.map((client) => (
              <tr key={client.id} className="border-t align-top">
                <td className="px-4 py-3">
                  <ClientIdentity client={client} />
                </td>
                <td className="px-4 py-3">
                  <p className="break-words">{client.businessType}</p>
                  <p className="break-words text-xs text-muted-foreground">
                    {client.city}, {client.state}
                  </p>
                </td>
                <td className="px-4 py-3">
                  <ClientAuditControls client={client} />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <ul className="grid gap-3 md:hidden">
        {clients.map((client) => (
          <li key={client.id} className="space-y-3 rounded-lg border p-4">
            <ClientIdentity client={client} />
            <p className="break-words text-sm text-muted-foreground">
              {client.businessType} | {client.city}, {client.state}
            </p>
            <ClientAuditControls client={client} />
          </li>
        ))}
      </ul>
    </>
  );
}
