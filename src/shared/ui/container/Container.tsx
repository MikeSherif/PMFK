import { type HTMLAttributes } from 'react';
import { cn } from '@/shared/lib';

export function Container({ className, ...props }: HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn('mx-auto w-full max-w-(--container-site) px-5 md:px-8', className)}
      {...props}
    />
  );
}
