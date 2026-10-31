//#region File Documentation
/**
 * File: src/app/page.tsx
 * Updated: 2026-10-30
 *
 * Purpose:
 * - Home route: sends visitors to the admin clients page.
 * - Rendering model: Server Component (server-side redirect).
 *
 * Changes:
 * - Replaced the generated starter page with a redirect to /admin/clients.
 *
 * Safety:
 * - No logic besides the redirect.
 *
 * Connected Modules:
 * - src/app/admin/clients/page.tsx
 *
 * Dependencies:
 * - None.
 */
//#endregion

import { redirect } from "next/navigation";

export default function HomePage() {
  redirect("/admin/clients");
}