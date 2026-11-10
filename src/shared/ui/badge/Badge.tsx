import { cva, type VariantProps } from 'class-variance-authority';
import { type HTMLAttributes } from 'react';
import { cn } from '@/shared/lib';

const badgeVariants = cva(
  'inline-flex items-center rounded-pill border px-3 py-1 text-xs tracking-wide uppercase',
  {
    variants: {
      tone: {
        muted: 'border-border text-text-muted',
        accent: 'border-accent/40 text-accent',
        peach: 'border-peach/30 text-peach',
        demo: 'border-demo-fg/20 bg-demo text-demo-fg',
      },
    },
    defaultVariants: { tone: 'muted' },
  },
);

export type BadgeProps = HTMLAttributes<HTMLSpanElement> & VariantProps<typeof badgeVariants>;

export function Badge({ className, tone, ...props }: BadgeProps) {
  return <span className={cn(badgeVariants({ tone }), className)} {...props} />;
}
