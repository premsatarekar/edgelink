//#region File Documentation
/**
 * File: src/app/admin/error.tsx
 * Updated: 2026-10-30
 *
 * Purpose:
 * - Error boundary for every admin page, with a retry button.
 * - Rendering model: Client Component (error boundaries must be client components).
 *
 * Changes:
 * - New file.
 *
 * Safety:
 * - Shows a friendly message only. The raw error goes to the browser console, not the UI.
 *
 * Connected Modules:
 * - src/data/admin-copy.ts, src/components/ui/button.tsx
 *
 * Dependencies:
 * - None.
 */
//#endregion

"use client";

import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { adminCopy } from "@/data/admin-copy";

interface AdminErrorProps {
  error: Error & { digest?: string };
  reset: () => void;
}

export default function AdminError({ error, reset }: AdminErrorProps) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div role="alert" className="rounded-lg border p-6 text-center">
      <h2 className="text-base font-semibold">{adminCopy.error.title}</h2>
      <p className="mt-1 text-sm text-muted-foreground">{adminCopy.error.description}</p>
      <Button onClick={reset} className="mt-4 min-h-11">
        {adminCopy.error.retry}
      </Button>
    </div>
  );
}