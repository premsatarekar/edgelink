//#region File Documentation
/**
 * File: src/data/dashboard-copy.ts
 * Updated: 2026-10-31
 * Purpose: All text, sidebar navigation items and report tab config for the admin dashboard.
 * Rendering model: Shared data module.
 * Changes: New file.
 * Safety: Data only. Components never hardcode strings.
 * Connected Modules: src/components/dashboard/*, src/components/admin/admin-nav.tsx, src/app/admin/*
 * Dependencies: None.
 */
//#endregion

import type { DetailsTab, NavItem } from "@/types/dashboard";

export const NAV_ITEMS: NavItem[] = [
  { label: "Dashboard", href: "/admin", icon: "dashboard" },
  { label: "Clients", href: "/admin/clients", icon: "clients" },
  { label: "Audits", href: "/admin/audits", icon: "audits" },
];

export const DETAILS_TABS: DetailsTab[] = [
  { key: "overview", label: "Overview", categories: [] },
  { key: "technical", label: "Technical SEO", categories: ["Technical", "CWV", "Schema"] },
  { key: "onPage", label: "On-page SEO", categories: ["OnPage"] },
  { key: "content", label: "Content", categories: ["Content"] },
  { key: "all", label: "AI recommendations", categories: ["Technical", "OnPage", "Content", "Schema", "CWV"] },
];

export const dashboardCopy = {
  metaTitle: "Dashboard | SEO Automation",
  title: "Dashboard",
  description: "Overview of your SEO audits and website performance.",
  sidebar: { brand: "SEO Automation", subtitle: "Admin portal" },
  quickAudit: {
    label: "Website URL",
    placeholder: "Enter website URL (e.g. example.com)",
    submit: "Start audit",
    starting: "Starting...",
    invalid: "Enter a valid website URL",
    notFound: "This website is not a client yet. Add it under Clients first.",
  },
  stats: {
    total: "Total audits",
    completed: "Completed",
    inProgress: "In progress",
    failed: "Failed",
    thisWeek: (count: number) => `${count} this week`,
    successRate: (percent: number) => `${percent}% success rate`,
    noRate: "No finished audits yet",
    running: (count: number) => `${count} running`,
    viewDetails: "View details",
  },
  recent: {
    title: "Recent audits",
    viewAll: "View all",
    empty: "No audits yet. Run your first audit to see it here.",
  },
  score: {
    title: "SEO score overview",
    average: "Average score",
    basedOn: (count: number) =>
      `Based on the latest report of ${count} ${count === 1 ? "client" : "clients"}`,
    empty: "Complete an audit to see your average score.",
    ariaLabel: (score: number) => `Average SEO score ${score} out of 100`,
  },
  issues: {
    title: "Top issues",
    subtitle: "Across the latest report of each client",
    empty: "No issues to show yet.",
    affected: (count: number) => `${count} ${count === 1 ? "client" : "clients"} affected`,
  },
  details: {
    title: "Recent audit details",
    viewFull: "View full report",
    tabsLabel: "Report sections",
    noItems: "No recommendations in this section.",
  },
} as const;