//#region File Documentation
/**
 * File: postcss.config.mjs
 * Updated: 2026-10-29
 *
 * Purpose:
 * - PostCSS configuration that enables Tailwind CSS v4.
 * - Rendering model: Build-time config (not part of the runtime bundle).
 *
 * Changes:
 * - Switched the plugin from tailwindcss (v3) to @tailwindcss/postcss (v4).
 *
 * Safety:
 * - No application logic touched.
 *
 * Connected Modules:
 * - src/app/globals.css
 *
 * Dependencies:
 * - @tailwindcss/postcss: Tailwind v4 PostCSS plugin.
 */
//#endregion

const config = {
  plugins: {
    "@tailwindcss/postcss": {},
  },
};

export default config;