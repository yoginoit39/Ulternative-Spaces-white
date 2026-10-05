import type { ReactNode, CSSProperties } from 'react';

/** Surfaces a sheet can be printed on — see app/materials.css. */
export type Mat = 'white' | 'paper' | 'black' | 'gold';

/**
 * One "bay" of the drawing sheet. On desktop it is a fixed-height, custom-width
 * column in the horizontal track; on mobile it becomes a normal block.
 * Every bay carries a dimension line along its top like a real elevation,
 * and is one flat material (`mat`).
 */
export default function Panel({
  id, width, sheet, label, mm, mat, depth, children, className, style,
}: {
  id: string;
  width: string;        // desktop width, e.g. '120vw'
  sheet: string;        // '01'
  label: string;        // 'STUDIO'
  mm: string;           // fake drawing dimension '12 000'
  mat?: Mat;            // surface + ink of this bay
  depth?: number;       // content sits this far behind the bay's walls (1 = standard)
  children: ReactNode;
  className?: string;
  style?: CSSProperties;
}) {
  return (
    <section
      id={id}
      data-panel={id}
      data-mat={mat}
      data-depth={depth}
      className={`bay ${mat ? `mat mat-${mat}` : ''} ${className ?? ''}`}
      style={{ ['--bay-w' as string]: width, ...style }}
    >
      <div className="bay-dim" aria-hidden>
        <span className="bay-dim-line" />
        <span className="bay-dim-txt">{sheet} — {label} · {mm}</span>
      </div>
      {children}
    </section>
  );
}
