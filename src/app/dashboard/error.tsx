//#region File Documentation
/**
 * File: src/app/dashboard/error.tsx
 * Updated: 2026-10-30
 *
 * Purpose:
 * - Error boundary for the client dashboard, with a retry button.
 * - Rendering model: Client Component (error boundaries must be client components).
 *
 * Changes:
 * - New file.
 *
 * Safety:
 * - Shows a friendly message only. The raw error goes to the browser console, not the UI.
 *
 * Connected Modules:
 * - src/data/audit-copy.ts, src/components/ui/button.tsx
 *
 * Dependencies:
 * - None.
 */
//#endregion

"use client";

import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { auditCopy } from "@/data/audit-copy";

interface DashboardErrorProps {
  error: Error & { digest?: string };
  reset: () => void;
}

export default function DashboardError({ error, reset }: DashboardErrorProps) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  const copy = auditCopy.dashboard.error;

  return (
    <div role="alert" className="rounded-lg border p-6 text-center">
      <h2 className="text-base font-semibold">{copy.title}</h2>
      <p className="mt-1 text-sm text-muted-foreground">{copy.description}</p>
      <Button onClick={reset} className="mt-4 min-h-11">
        {copy.retry}
      </Button>
    </div>
  );
}