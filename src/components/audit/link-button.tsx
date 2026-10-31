//#region File Documentation
/**
 * File: src/components/audit/link-button.tsx
 * Updated: 2026-10-30
 *
 * Purpose:
 * - A link that looks like a button: next/link for pages, a plain anchor for file downloads.
 * - Rendering model: Server Component (no hooks).
 *
 * Changes:
 * - New file.
 *
 * Safety:
 * - 44px minimum height for touch, visible keyboard focus, full width on small screens.
 *
 * Connected Modules:
 * - src/app/admin/audits/[id]/page.tsx, src/app/dashboard/[clientId]/page.tsx
 *
 * Dependencies:
 * - None.
 */
//#endregion

import Link from "next/link";

const LINK_BUTTON_CLASS =
  "inline-flex min-h-11 w-full items-center justify-center rounded-md border px-4 text-sm font-medium transition-colors hover:bg-muted focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring sm:w-auto";

interface LinkButtonProps {
  href: string;
  children: React.ReactNode;
  isFileDownload?: boolean;
}

export function LinkButton({ href, children, isFileDownload = false }: LinkButtonProps) {
  if (isFileDownload) {
    return (
      <a href={href} className={LINK_BUTTON_CLASS}>
        {children}
      </a>
    );
  }
  return (
    <Link href={href} className={LINK_BUTTON_CLASS}>
      {children}
    </Link>
  );
}