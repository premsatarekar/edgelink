//#region File Documentation
/**
 * File: src/components/dashboard/quick-audit-form.tsx
 * Updated: 2026-10-31
 * Purpose: URL bar that starts an audit for an existing client, then opens the Clients page.
 * Rendering model: Client Component (state, events, router, fetch).
 * Changes: New file.
 * Safety: URL is validated with the same zod rule as the API. A missing scheme is treated as https.
 * Unknown websites are rejected with a clear message. The button is disabled while the request runs.
 * Connected Modules: src/lib/validations.ts, /api/audits, src/data/dashboard-copy.ts, src/data/admin-copy.ts
 * Dependencies: sonner (toasts), zod (via validations).
 */
//#endregion

"use client";

import { useRouter } from "next/navigation";
import { useState, type FormEvent } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { adminCopy } from "@/data/admin-copy";
import { dashboardCopy } from "@/data/dashboard-copy";
import { createClientSchema } from "@/lib/validations";
import type { QuickAuditClient } from "@/types/dashboard";

function normalizeUrl(value: string): string {
  try {
    const url = new URL(value);
    return `${url.hostname.replace(/^www\./i, "").toLowerCase()}${url.pathname.replace(/\/+$/, "")}`;
  } catch {
    return value.toLowerCase();
  }
}

export function QuickAuditForm({ clients }: { clients: QuickAuditClient[] }) {
  const router = useRouter();
  const copy = dashboardCopy.quickAudit;
  const [url, setUrl] = useState("");
  const [error, setError] = useState<string | undefined>(undefined);
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>): Promise<void> {
    event.preventDefault();
    if (isSubmitting) return;

    const raw = url.trim();
    const candidate = /^https?:\/\//i.test(raw) ? raw : `https://${raw}`;
    const parsed = createClientSchema.shape.websiteUrl.safeParse(candidate);
    if (!raw || !parsed.success) {
      setError(copy.invalid);
      return;
    }

    const target = normalizeUrl(parsed.data);
    const client = clients.find((item) => normalizeUrl(item.websiteUrl) === target);
    if (!client) {
      setError(copy.notFound);
      toast.error(copy.notFound);
      return;
    }

    setError(undefined);
    setIsSubmitting(true);
    try {
      const response = await fetch("/api/audits", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ clientId: client.id }),
      });

      if (response.status === 202) {
        toast.success(adminCopy.toast.auditStarted(client.name));
        setUrl("");
        router.push("/admin/clients");
        return;
      }
      if (response.status === 409) {
        toast.error(adminCopy.toast.auditAlreadyRunning);
        return;
      }
      toast.error(adminCopy.toast.auditGenericError);
    } catch {
      toast.error(adminCopy.toast.networkError);
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <form
      onSubmit={handleSubmit}
      noValidate
      className="rounded-xl border bg-card p-3 shadow-sm sm:p-4"
    >
      <Label htmlFor="quick-audit-url" className="sr-only">
        {copy.label}
      </Label>
      <div className="flex flex-col gap-2 sm:flex-row">
        <Input
          id="quick-audit-url"
          type="text"
          inputMode="url"
          list="quick-audit-urls"
          autoComplete="off"
          value={url}
          placeholder={copy.placeholder}
          disabled={isSubmitting}
          aria-invalid={error ? true : undefined}
          aria-describedby={error ? "quick-audit-error" : undefined}
          onChange={(event) => {
            setUrl(event.target.value);
            setError(undefined);
          }}
          className="h-11 flex-1"
        />
        <datalist id="quick-audit-urls">
          {clients.map((client) => (
            <option key={client.id} value={client.websiteUrl} />
          ))}
        </datalist>
        <Button type="submit" disabled={isSubmitting} className="min-h-11 sm:px-6">
          {isSubmitting ? copy.starting : copy.submit}
        </Button>
      </div>
      {error ? (
        <p id="quick-audit-error" className="mt-2 text-sm text-destructive">
          {error}
        </p>
      ) : null}
    </form>
  );
}