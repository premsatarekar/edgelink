//#region File Documentation
/**
 * File: src/app/layout.tsx
 * Updated: 2026-10-29
 *
 * Purpose:
 * - Root layout: global font, global styles and the app-wide toast container.
 * - Rendering model: Server Component (the Toaster is a client component imported here).
 *
 * Changes:
 * - Added Toaster so toast messages work on every page.
 * - Updated metadata title and description.
 *
 * Safety:
 * - Font loading and globals.css import unchanged from the generated file.
 *
 * Connected Modules:
 * - src/components/ui/sonner.tsx, src/app/globals.css
 *
 * Dependencies:
 * - sonner (via shadcn): toast notifications.
 */
//#endregion

import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { Toaster } from "@/components/ui/sonner";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "SEO Automation Dashboard",
  description: "Automated SEO audits with AI-powered recommendations.",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body className={inter.className}>
        {children}
        <Toaster richColors position="top-right" />
      </body>
    </html>
  );
}