//#region File Documentation
/**
 * File: src/components/dashboard/panel.tsx
 * Updated: 2026-10-31
 * Purpose: Card container with a heading and an optional action, used by every dashboard section.
 * Rendering model: Server Component (no hooks).
 * Changes: New file.
 * Safety: Labelled by its heading; min-w-0 keeps wide content from overflowing.
 * Connected Modules: src/components/dashboard/*
 * Dependencies: None.
 */
//#endregion

interface PanelProps {
  id: string;
  title: string;
  action?: React.ReactNode;
  children: React.ReactNode;
}

export function Panel({ id, title, action, children }: PanelProps) {
  return (
    <section
      aria-labelledby={id}
      className="min-w-0 rounded-xl border bg-card p-4 shadow-sm sm:p-5"
    >
      <div className="mb-4 flex items-center justify-between gap-3">
        <h2 id={id} className="text-base font-semibold">
          {title}
        </h2>
        {action}
      </div>
      {children}
    </section>
  );
}