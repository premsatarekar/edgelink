//#region File Documentation
/**
 * File: src/types/client.ts
 * Updated: 2026-10-30
 *
 * Purpose:
 * - Types for client list data, the add-client form and API error responses.
 * - Rendering model: Types only, no runtime code.
 *
 * Changes:
 * - New file.
 *
 * Safety:
 * - Types only. Dates are ISO strings so data can cross the server/client boundary.
 *
 * Connected Modules:
 * - src/lib/queries.ts, src/data/admin-copy.ts, src/components/admin/*
 *
 * Dependencies:
 * - None.
 */
//#endregion

export type AuditStatusValue = "QUEUED" | "RUNNING" | "COMPLETED" | "FAILED";

export interface LatestAuditSummary {
  id: string;
  status: AuditStatusValue;
  progress: number;
  overallScore: number | null;
  completedAt: string | null;
}

export interface ClientListItem {
  id: string;
  name: string;
  websiteUrl: string;
  businessType: string;
  city: string;
  state: string;
  contactEmail: string | null;
  whatsappNumber: string | null;
  createdAt: string;
  latestAudit: LatestAuditSummary | null;
}

export interface ClientFormValues {
  name: string;
  websiteUrl: string;
  businessType: string;
  city: string;
  state: string;
  contactEmail: string;
  whatsappNumber: string;
}

export type ClientFormErrors = Partial<Record<keyof ClientFormValues, string>>;

export interface ClientFormFieldConfig {
  name: keyof ClientFormValues;
  label: string;
  type: "text" | "email" | "url" | "tel";
  inputMode: "text" | "email" | "url" | "tel";
  placeholder: string;
  autoComplete: string;
  optional: boolean;
  wide: boolean;
}

export interface ApiFieldIssue {
  field: string;
  message: string;
}

export interface ApiErrorBody {
  error: string;
  details?: ApiFieldIssue[];
}