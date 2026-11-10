import { type HTMLAttributes } from 'react';
import { cn } from '@/shared/lib';

export function GlassPanel({ className, ...props }: HTMLAttributes<HTMLDivElement>) {
  return <div className={cn('glass rounded-xl', className)} {...props} />;
}
