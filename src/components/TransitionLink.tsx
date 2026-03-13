'use client';
import { usePageTransition } from '@/context/transition';

interface TransitionLinkProps {
  href: string;
  children: React.ReactNode;
  style?: React.CSSProperties;
  className?: string;
  onClick?: () => void;
  onMouseEnter?: () => void;
  onMouseLeave?: () => void;
}

export default function TransitionLink({
  href,
  children,
  style,
  className,
  onClick,
  onMouseEnter,
  onMouseLeave,
}: TransitionLinkProps) {
  const navigate = usePageTransition();

  const handleClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    // Let native anchor behavior handle hash links, external, mailto, tel
    if (
      href.includes('#') ||
      href.startsWith('http') ||
      href.startsWith('mailto:') ||
      href.startsWith('tel:')
    ) {
      onClick?.();
      return;
    }
    e.preventDefault();
    onClick?.();
    navigate(href);
  };

  return (
    <a
      href={href}
      onClick={handleClick}
      style={style}
      className={className}
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
    >
      {children}
    </a>
  );
}
