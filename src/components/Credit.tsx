/** Studio credit: the site is designed and built by Pearl Web Studio. */
export const PEARL_URL = 'https://pearl-umber.vercel.app/';

export default function Credit({ className, label = 'Site by' }: { className?: string; label?: string }) {
  return (
    <a href={PEARL_URL} target="_blank" rel="noopener noreferrer" className={`credit ${className ?? ''}`}>
      {label} <b>Pearl Web Studio</b> <span aria-hidden>↗</span>
    </a>
  );
}
