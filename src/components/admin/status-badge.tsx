//#region File Documentation
/**
 * File: src/components/admin/status-badge.tsx
 * Updated: 2026-10-30
 *
 * Purpose:
 * - Small coloured label for an audit status (Queued, Running, Completed, Failed).
 * - Rendering model: Server Component (no hooks, also usable inside client components).
 *
 * Changes:
 * - New file.
 *
 * Safety:
 * - Status is shown as text, never by colour alone.
 *
 * Connected Modules:
 * - src/data/admin-copy.ts, src/types/client.ts, src/components/admin/clients-list.tsx
 *
 * Dependencies:
 * - None.
 */
//#endregion

import { adminCopy } from '@/data/admin-copy';
import { cn } from '@/lib/utils';
import type { AuditStatusValue } from '@/types/client';

const STATUS_STYLES: Record<AuditStatusValue, string> = {
  QUEUED: 'bg-muted text-foreground',
  RUNNING: 'bg-blue-100 text-blue-900',
  COMPLETED: 'bg-green-100 text-green-900',
  FAILED: 'bg-red-100 text-red-900',
};

interface StatusBadgeProps {
  status: AuditStatusValue;
}

export function StatusBadge({ status }: StatusBadgeProps) {
  return (
    <span
      className={cn(
        'inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium',
        STATUS_STYLES[status]
      )}
    >
      {adminCopy.status[status]}
    </span>
  );
}
