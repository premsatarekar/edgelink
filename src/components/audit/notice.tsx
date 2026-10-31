//#region File Documentation
/**
 * File: src/components/audit/notice.tsx
 * Updated: 2026-10-30
 *
 * Purpose:
 * - Centered message box for empty, running, failed and unavailable states.
 * - Rendering model: Server Component (no hooks).
 *
 * Changes:
 * - New file.
 *
 * Safety:
 * - Errors use role="alert", other messages use role="status".
 *
 * Connected Modules:
 * - src/app/admin/audits/[id]/page.tsx, src/app/dashboard/[clientId]/page.tsx
 *
 * Dependencies:
 * - None.
 */
//#endregion

interface NoticeProps {
  title: string;
  description: string;
  isError?: boolean;
}

export function Notice({ title, description, isError = false }: NoticeProps) {
  return (
    <div
      role={isError ? "alert" : "status"}
      className="rounded-lg border border-dashed p-8 text-center"
    >
      <p className="font-medium">{title}</p>
      <p className="mt-1 break-words text-sm text-muted-foreground">{description}</p>
    </div>
  );
}