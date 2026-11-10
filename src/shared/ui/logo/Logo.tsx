import { cn } from '@/shared/lib';

type LogoProps = {
  className?: string;
  withWordmark?: boolean;
  wordmark?: string;
  size?: 'sm' | 'md' | 'lg';
};

const sizes = {
  sm: 28,
  md: 40,
  lg: 72,
} as const;

export function Logo({
  className,
  withWordmark = false,
  wordmark = 'ПМФК',
  size = 'md',
}: LogoProps) {
  const px = sizes[size];
  return (
    <span className={cn('inline-flex items-center gap-3 text-text', className)}>
      <svg
        width={px}
        height={px}
        viewBox="0 0 40 40"
        fill="none"
        aria-hidden="true"
        className="shrink-0"
      >
        <MarkCell x={1} y={1} rotate={0} />
        <MarkCell x={21} y={1} rotate={90} />
        <MarkCell x={1} y={21} rotate={270} />
        <MarkCell x={21} y={21} rotate={180} />
      </svg>
      {withWordmark ? (
        <span className="font-display text-[1.35em] font-bold tracking-tight uppercase">{wordmark}</span>
      ) : (
        <span className="sr-only">{wordmark}</span>
      )}
    </span>
  );
}

function MarkCell({ x, y, rotate }: { x: number; y: number; rotate: number }) {
  return (
    <g transform={`translate(${x} ${y}) rotate(${rotate} 9 9)`}>
      <rect width="18" height="18" rx="5" fill="#FC5820" />
      <path d="M18 0C18 9.941 9.941 18 0 18V13C6.627 13 12 7.627 12 1V0H18Z" fill="#100018" />
    </g>
  );
}
