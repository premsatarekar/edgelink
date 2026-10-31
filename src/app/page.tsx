//#region File Documentation
/**
 * File: src/app/page.tsx
 * Updated: 2026-10-31
 * Purpose: Home route: sends visitors to the admin dashboard.
 * Rendering model: Server Component (server-side redirect).
 * Changes: Redirect target changed from /admin/clients to /admin.
 * Safety: No logic besides the redirect.
 * Connected Modules: src/app/admin/page.tsx
 * Dependencies: None.
 */
//#endregion

import { redirect } from 'next/navigation';

export default function HomePage() {
  redirect('/admin');
}
