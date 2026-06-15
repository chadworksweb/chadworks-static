// COMPARE TABLE -- the switch-page signature visual (septic comparison-table
// lineage). A three-column "old platform vs a custom static site" scan: the
// "us" column is highlighted as the recommended side. Rendered in the
// problemArt slot, so it sits in its own clean section under the problem band.
// Decorative-but-real: plain semantic markup, no JS.

import type { ReactNode } from "react";

export type CompareRow = { feature: string; them: ReactNode; us: ReactNode };

export function CompareTable({
  them,
  usLabel = "A custom static site",
  rows,
}: {
  them: string; // the old platform's column label (e.g. "Squarespace")
  usLabel?: string;
  rows: CompareRow[];
}) {
  return (
    <div className="cw-compare" role="table" aria-label={`${them} compared with a custom static site`}>
      <div className="cw-compare__row cw-compare__row--head" role="row">
        <span className="cw-compare__cell cw-compare__feature" role="columnheader" />
        <span className="cw-compare__cell cw-compare__them" role="columnheader">
          {them}
        </span>
        <span className="cw-compare__cell cw-compare__us" role="columnheader">
          {usLabel}
        </span>
      </div>
      {rows.map((r, i) => (
        <div key={i} className="cw-compare__row" role="row">
          <span className="cw-compare__cell cw-compare__feature" role="rowheader">
            {r.feature}
          </span>
          <span className="cw-compare__cell cw-compare__them-val" role="cell">
            {r.them}
          </span>
          <span className="cw-compare__cell cw-compare__us-val" role="cell">
            {r.us}
          </span>
        </div>
      ))}
    </div>
  );
}
