import { type HTMLAttributes, type ReactNode } from 'react';
import { cn } from '@/shared/lib';
import { Container } from '@/shared/ui/container';

type SectionHeaderProps = {
  kicker: string;
  id?: string;
};

export function SectionHeader({ kicker, id }: SectionHeaderProps) {
  return (
    <p
      id={id}
      className="mb-6 flex items-center gap-4 font-display text-[11px] tracking-[0.2em] text-peach uppercase"
    >
      {kicker}
      <span className="h-px max-w-24 flex-1 bg-border" aria-hidden />
    </p>
  );
}

type SectionProps = HTMLAttributes<HTMLElement> & {
  containerClassName?: string;
  children: ReactNode;
};

export function Section({ className, containerClassName, children, ...props }: SectionProps) {
  return (
    <section className={cn('py-16 md:py-24', className)} {...props}>
      <Container className={containerClassName}>{children}</Container>
    </section>
  );
}
