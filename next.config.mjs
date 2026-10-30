//#region File Documentation
/**
 * File: next.config.mjs
 * Updated: 2026-10-30
 *
 * Purpose:
 * - Next.js build configuration.
 * - Rendering model: Build-time config (not part of the runtime bundle).
 *
 * Changes:
 * - Added bullmq and ioredis to serverComponentsExternalPackages so they load from
 *   node_modules at runtime instead of being bundled (bullmq reads its own lua files).
 *
 * Safety:
 * - No other settings changed.
 *
 * Connected Modules:
 * - src/queue/audit.queue.ts, src/app/api/audits/route.ts
 *
 * Dependencies:
 * - None.
 */
//#endregion

/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    serverComponentsExternalPackages: ['bullmq', 'ioredis'],
  },
};

export default nextConfig;
