'use client';

import * as SelectPrimitive from '@radix-ui/react-select';
import { type ReactNode } from 'react';
import { cn } from '@/shared/lib';

type SelectProps = {
  id?: string;
  value: string;
  onValueChange: (value: string) => void;
  onBlur?: () => void;
  placeholder?: string;
  disabled?: boolean;
  invalid?: boolean;
  children: ReactNode;
  className?: string;
};

export function Select({
  id,
  value,
  onValueChange,
  onBlur,
  placeholder = 'Выберите',
  disabled = false,
  invalid = false,
  children,
  className,
}: SelectProps) {
  const unset = '__unset';
  const rootValue = value || unset;

  return (
    <SelectPrimitive.Root
      value={rootValue}
      disabled={disabled}
      onValueChange={(next) => {
        if (next === unset) {
          return;
        }
        onValueChange(next);
      }}
    >
      <SelectPrimitive.Trigger
        id={id}
        onBlur={onBlur}
        data-invalid={invalid ? 'true' : 'false'}
        aria-invalid={invalid}
        className={cn(
          'flex w-full items-center justify-between rounded-md border border-border bg-bg-input px-4 py-3 text-left text-text data-[placeholder]:text-text-muted/60 data-[invalid=true]:border-danger',
          className,
        )}
      >
        <SelectPrimitive.Value placeholder={placeholder} />
        <span aria-hidden className="text-text-muted">
          ▾
        </span>
      </SelectPrimitive.Trigger>
      <SelectPrimitive.Portal>
        <SelectPrimitive.Content
          position="popper"
          sideOffset={6}
          className="z-50 max-h-72 w-[var(--radix-select-trigger-width)] overflow-hidden rounded-md border border-border bg-bg-elevated shadow-lg"
        >
          <SelectPrimitive.Viewport className="p-1">
            <SelectPrimitive.Item value={unset} disabled className="hidden">
              <SelectPrimitive.ItemText>{placeholder}</SelectPrimitive.ItemText>
            </SelectPrimitive.Item>
            {children}
          </SelectPrimitive.Viewport>
        </SelectPrimitive.Content>
      </SelectPrimitive.Portal>
    </SelectPrimitive.Root>
  );
}

function SelectItem({ value, children }: { value: string; children: ReactNode }) {
  return (
    <SelectPrimitive.Item
      value={value}
      className="cursor-pointer rounded-sm px-3 py-2 text-sm text-text outline-none data-[highlighted]:bg-surface data-[state=checked]:text-accent"
    >
      <SelectPrimitive.ItemText>{children}</SelectPrimitive.ItemText>
    </SelectPrimitive.Item>
  );
}

Select.Item = SelectItem;
