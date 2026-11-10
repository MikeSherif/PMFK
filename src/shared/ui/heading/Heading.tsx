import { type HTMLAttributes, type ReactNode } from 'react';
import { cn } from '@/shared/lib';

type HeadingProps = HTMLAttributes<HTMLHeadingElement> & {
  as?: 'h1' | 'h2' | 'h3';
  accent?: ReactNode;
  children: ReactNode;
};

export function Heading({
  as: Tag = 'h2',
  accent,
  className,
  children,
  ...props
}: HeadingProps) {
  return (
    <Tag
      className={cn(
        'font-display text-balance text-[clamp(1.75rem,5vw,3.75rem)] leading-[0.95] font-bold tracking-tight uppercase',
        className,
      )}
      {...props}
    >
      {children}
      {accent ? (
        <>
          {' '}
          <span className="text-accent">{accent}</span>
        </>
      ) : null}
    </Tag>
  );
}
