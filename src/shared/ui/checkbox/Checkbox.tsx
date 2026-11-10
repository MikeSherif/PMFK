'use client';

import * as CheckboxPrimitive from '@radix-ui/react-checkbox';
import { type ComponentPropsWithoutRef } from 'react';
import { cn } from '@/shared/lib';

type CheckboxProps = ComponentPropsWithoutRef<typeof CheckboxPrimitive.Root> & {
  label: string;
};

export function Checkbox({ label, className, id, ...props }: CheckboxProps) {
  return (
    <label className={cn('flex cursor-pointer items-start gap-3 text-sm text-text-muted', className)}>
      <CheckboxPrimitive.Root
        id={id}
        className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-[4px] border border-border-strong bg-bg-input data-[state=checked]:border-accent data-[state=checked]:bg-accent"
        {...props}
      >
        <CheckboxPrimitive.Indicator className="text-xs text-text">✓</CheckboxPrimitive.Indicator>
      </CheckboxPrimitive.Root>
      <span>{label}</span>
    </label>
  );
}
