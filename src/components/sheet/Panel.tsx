import type { ReactNode, CSSProperties } from 'react';

/**
 * One "bay" of the drawing sheet. On desktop it is a fixed-height, custom-width
 * column in the horizontal track; on mobile it becomes a normal block.
 * Every bay carries a dimension line along its top like a real elevation.
 */
export default function Panel({
  id, width, sheet, label, mm, children, className, style,
}: {
  id: string;
  width: string;        // desktop width, e.g. '120vw'
  sheet: string;        // '01'
  label: string;        // 'STUDIO'
  mm: string;           // fake drawing dimension '12 000'
  children: ReactNode;
  className?: string;
  style?: CSSProperties;
}) {
  return (
    <section
      id={id}
      data-panel={id}
      className={`bay ${className ?? ''}`}
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
