//#region File Documentation
/**
 * File: src/components/audit/issue-list.tsx
 * Updated: 2026-10-30
 *
 * Purpose:
 * - A titled list of short issue texts with an empty state.
 * - Rendering model: Server Component (no hooks).
 *
 * Changes:
 * - New file.
 *
 * Safety:
 * - The section is labelled by its heading. Long text wraps.
 *
 * Connected Modules:
 * - src/components/audit/audit-report.tsx
 *
 * Dependencies:
 * - None.
 */
//#endregion

interface IssueListProps {
  headingId: string;
  title: string;
  items: string[];
  emptyText: string;
}

export function IssueList({ headingId, title, items, emptyText }: IssueListProps) {
  return (
    <section aria-labelledby={headingId} className="space-y-3">
      <h2 id={headingId} className="text-base font-semibold">
        {title}
      </h2>
      {items.length === 0 ? (
        <p className="text-sm text-muted-foreground">{emptyText}</p>
      ) : (
        <ul className="space-y-2">
          {items.map((item, index) => (
            <li key={index} className="break-words rounded-lg border p-3 text-sm">
              {item}
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}