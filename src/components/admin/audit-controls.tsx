//#region File Documentation
/**
 * File: src/components/admin/audit-controls.tsx
 * Updated: 2026-10-30
 *
 * Purpose:
 * - Shows a client's latest audit, the Run audit button and live progress while an audit runs.
 * - Rendering model: Client Component (state, effects, fetch polling).
 *
 * Changes:
 * - New file.
 *
 * Safety:
 * - Polls GET /api/audits/[id] every 2 seconds and stops when the audit ends, the component
 *   unmounts, or 10 minutes pass. Requests are aborted on cleanup, so nothing updates after unmount.
 * - A running audit is resumed after a page reload because the parent passes the latest audit.
 * - The button is disabled while starting or running, which prevents duplicate audits.
 *
 * Connected Modules:
 * - src/components/admin/clients-list.tsx, src/components/admin/audit-progress.tsx,
 *   /api/audits, /api/audits/[id]
 *
 * Dependencies:
 * - sonner: toast messages.
 */
//#endregion

"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { AuditProgress } from "@/components/admin/audit-progress";
import { StatusBadge } from "@/components/admin/status-badge";
import { Button } from "@/components/ui/button";
import { adminCopy } from "@/data/admin-copy";
import type { AuditProgressData } from "@/types/audit-list";
import type { ApiErrorBody, AuditStatusValue, LatestAuditSummary } from "@/types/client";

const POLL_INTERVAL_MS = 2_000;
const MAX_POLL_MS = 10 * 60 * 1_000;

interface AuditControlsProps {
  clientId: string;
  clientName: string;
  latestAudit: LatestAuditSummary | null;
}

interface StartAuditResponse extends Partial<ApiErrorBody> {
  data?: { id: string };
}

interface AuditStatusResponse {
  data: AuditProgressData;
}

function isActiveStatus(status: AuditStatusValue): boolean {
  return status === "QUEUED" || status === "RUNNING";
}

function toInitialProgress(audit: LatestAuditSummary | null): AuditProgressData | null {
  if (!audit || !isActiveStatus(audit.status)) return null;
  return {
    status: audit.status,
    progress: audit.progress,
    currentStep: null,
    errorMessage: null,
    overallScore: audit.overallScore,
  };
}

export function AuditControls({ clientId, clientName, latestAudit }: AuditControlsProps) {
  const router = useRouter();
  const [progress, setProgress] = useState<AuditProgressData | null>(() =>
    toInitialProgress(latestAudit),
  );
  const [activeAuditId, setActiveAuditId] = useState<string | null>(() =>
    latestAudit && isActiveStatus(latestAudit.status) ? latestAudit.id : null,
  );
  const [isStarting, setIsStarting] = useState(false);

  useEffect(() => {
    if (!activeAuditId) return;

    const auditId = activeAuditId;
    const controller = new AbortController();
    const startedAt = Date.now();
    let cancelled = false;
    let timer: ReturnType<typeof setTimeout> | undefined;

    async function poll(): Promise<void> {
      try {
        const response = await fetch(`/api/audits/${auditId}`, {
          signal: controller.signal,
          cache: "no-store",
        });
        if (!response.ok) throw new Error(`Status ${response.status}`);

        const body = (await response.json()) as AuditStatusResponse;
        if (cancelled) return;
        setProgress(body.data);

        if (body.data.status === "COMPLETED") {
          toast.success(adminCopy.toast.auditCompleted(clientName));
          setActiveAuditId(null);
          router.refresh();
          return;
        }
        if (body.data.status === "FAILED") {
          toast.error(body.data.errorMessage ?? adminCopy.toast.auditFailed(clientName));
          setActiveAuditId(null);
          router.refresh();
          return;
        }
      } catch {
        if (cancelled) return;
      }

      if (Date.now() - startedAt > MAX_POLL_MS) {
        toast.error(adminCopy.toast.auditTimeout);
        setActiveAuditId(null);
        return;
      }
      timer = setTimeout(() => void poll(), POLL_INTERVAL_MS);
    }

    void poll();

    return () => {
      cancelled = true;
      controller.abort();
      if (timer) clearTimeout(timer);
    };
  }, [activeAuditId, clientName, router]);

  async function handleRun(): Promise<void> {
    if (isStarting || activeAuditId) return;

    setIsStarting(true);
    try {
      const response = await fetch("/api/audits", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ clientId }),
      });
      const body = (await response.json().catch(() => null)) as StartAuditResponse | null;

      if (response.status === 202 && body?.data?.id) {
        toast.success(adminCopy.toast.auditStarted(clientName));
        setProgress({
          status: "QUEUED",
          progress: 0,
          currentStep: null,
          errorMessage: null,
          overallScore: null,
        });
        setActiveAuditId(body.data.id);
        return;
      }
      if (response.status === 409) {
        toast.error(adminCopy.toast.auditAlreadyRunning);
        router.refresh();
        return;
      }
      toast.error(body?.error ?? adminCopy.toast.auditGenericError);
    } catch {
      toast.error(adminCopy.toast.networkError);
    } finally {
      setIsStarting(false);
    }
  }

  const isActive = activeAuditId !== null;
  const buttonLabel = isStarting
    ? adminCopy.runAudit.starting
    : isActive
      ? adminCopy.runAudit.running
      : latestAudit
        ? adminCopy.runAudit.runAgain
        : adminCopy.runAudit.run;

  return (
    <div className="space-y-3">
      {isActive && progress ? (
        <AuditProgress
          status={progress.status}
          percent={progress.progress}
          stepLabel={progress.currentStep ?? adminCopy.runAudit.queuedStep}
          label={adminCopy.runAudit.progressLabel(clientName)}
        />
      ) : latestAudit ? (
        <div className="flex flex-wrap items-center gap-2">
          <StatusBadge status={latestAudit.status} />
          {latestAudit.overallScore !== null ? (
            <span className="text-sm font-medium">
              {adminCopy.clients.scoreOutOf(latestAudit.overallScore)}
            </span>
          ) : null}
        </div>
      ) : (
        <span className="text-sm text-muted-foreground">{adminCopy.clients.noAudit}</span>
      )}
      <Button
        type="button"
        variant="outline"
        size="sm"
        onClick={handleRun}
        disabled={isStarting || isActive}
        className="min-h-11 w-full sm:w-auto"
      >
        {buttonLabel}
      </Button>
    </div>
  );
}