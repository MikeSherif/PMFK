import { type ReactNode } from 'react';
import { cn } from '@/shared/lib';

type EmptyStateProps = {
  title: string;
  description?: string;
  action?: ReactNode;
  className?: string;
};

export function EmptyState({ title, description, action, className }: EmptyStateProps) {
  return (
    <div className={cn('glass rounded-lg px-6 py-10 text-center', className)}>
      <p className="font-display text-xl font-bold tracking-tight uppercase">{title}</p>
      {description ? <p className="mt-3 text-pretty text-text-muted">{description}</p> : null}
      {action ? <div className="mt-6">{action}</div> : null}
    </div>
  );
}
