//#region File Documentation
/**
 * File: src/data/admin-copy.ts
 * Updated: 2026-10-30
 *
 * Purpose:
 * - All user-facing text and form field configuration for the admin portal.
 * - Rendering model: Shared data module (server and client components).
 *
 * Changes:
 * - Added the Audits nav link, the audits history copy, run-audit labels and audit toast messages.
 * - All existing keys and the client form fields are unchanged.
 *
 * Safety:
 * - Data only. Components never hardcode strings.
 *
 * Connected Modules:
 * - src/types/client.ts, src/components/admin/*, src/app/admin/*
 *
 * Dependencies:
 * - None.
 */
//#endregion

import type { AuditStatusValue, ClientFormFieldConfig } from "@/types/client";

export const adminCopy = {
  brand: "SEO Automation",
  portalLabel: "Admin portal",
  skipLink: "Skip to main content",
  navLabel: "Main navigation",
  nav: [
    { label: "Clients", href: "/admin/clients" },
    { label: "Audits", href: "/admin/audits" },
  ],
  error: {
    title: "Something went wrong",
    description: "We could not load this page. Please try again.",
    retry: "Try again",
  },
  loading: {
    clients: "Loading clients",
  },
  clients: {
    metaTitle: "Clients | SEO Automation",
    title: "Clients",
    description: "Manage the websites you run SEO audits for.",
    listTitle: "All clients",
    tableCaption: "Clients and their latest audit",
    emptyTitle: "No clients yet",
    emptyDescription: "Add your first client to start running SEO audits.",
    columns: {
      client: "Client",
      business: "Business",
      lastAudit: "Latest audit",
    },
    noAudit: "No audit yet",
    scoreOutOf: (score: number) => `${score}/100`,
  },
  audits: {
    metaTitle: "Audits | SEO Automation",
    title: "Audits",
    description: "History of every audit and its result.",
    tableCaption: "Audit history",
    emptyTitle: "No audits yet",
    emptyDescription: "Run an audit from the Clients page and it will appear here.",
    columns: {
      client: "Client",
      status: "Status",
      score: "Score",
      started: "Started",
      report: "Report",
    },
    downloadPdf: "Download PDF",
    noReport: "Not available",
    noScore: "-",
  },
  runAudit: {
    run: "Run audit",
    runAgain: "Run again",
    running: "Audit running",
    starting: "Starting...",
    queuedStep: "Waiting for the worker",
    progressLabel: (name: string) => `Audit progress for ${name}`,
  },
  form: {
    title: "Add client",
    description: "Enter the website details you want to audit.",
    optional: "(optional)",
    submit: "Add client",
    submitting: "Adding client...",
  },
  toast: {
    created: (name: string) => `${name} was added`,
    fixErrors: "Please fix the highlighted fields",
    duplicate: "A client with this website already exists",
    genericError: "Could not add the client. Please try again.",
    networkError: "Network error. Check your connection and try again.",
    auditStarted: (name: string) => `Audit started for ${name}`,
    auditCompleted: (name: string) => `Audit finished for ${name}`,
    auditFailed: (name: string) => `Audit failed for ${name}`,
    auditAlreadyRunning: "An audit is already running for this client",
    auditTimeout: "The audit is taking longer than expected. Check that the worker is running.",
    auditGenericError: "Could not start the audit. Please try again.",
  },
  status: {
    QUEUED: "Queued",
    RUNNING: "Running",
    COMPLETED: "Completed",
    FAILED: "Failed",
  } satisfies Record<AuditStatusValue, string>,
} as const;

export const CLIENT_FORM_FIELDS: ClientFormFieldConfig[] = [
  {
    name: "name",
    label: "Client name",
    type: "text",
    inputMode: "text",
    placeholder: "Sunrise Dental Clinic",
    autoComplete: "organization",
    optional: false,
    wide: true,
  },
  {
    name: "websiteUrl",
    label: "Website URL",
    type: "url",
    inputMode: "url",
    placeholder: "https://www.example.com",
    autoComplete: "url",
    optional: false,
    wide: true,
  },
  {
    name: "businessType",
    label: "Business type",
    type: "text",
    inputMode: "text",
    placeholder: "Dental clinic",
    autoComplete: "off",
    optional: false,
    wide: true,
  },
  {
    name: "city",
    label: "City",
    type: "text",
    inputMode: "text",
    placeholder: "Pune",
    autoComplete: "address-level2",
    optional: false,
    wide: false,
  },
  {
    name: "state",
    label: "State",
    type: "text",
    inputMode: "text",
    placeholder: "Maharashtra",
    autoComplete: "address-level1",
    optional: false,
    wide: false,
  },
  {
    name: "contactEmail",
    label: "Contact email",
    type: "email",
    inputMode: "email",
    placeholder: "owner@example.com",
    autoComplete: "email",
    optional: true,
    wide: false,
  },
  {
    name: "whatsappNumber",
    label: "WhatsApp number",
    type: "tel",
    inputMode: "tel",
    placeholder: "+919876543210",
    autoComplete: "tel",
    optional: true,
    wide: false,
  },
];