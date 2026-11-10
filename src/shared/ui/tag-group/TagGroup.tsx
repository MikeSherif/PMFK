'use client';

import { useState } from 'react';
import { cn } from '@/shared/lib';

type TagGroupProps = {
  options: readonly string[];
  value: string[];
  onChange: (value: string[]) => void;
  max?: number;
  disabled?: boolean;
  limitMessage?: string;
};

export function TagGroup({
  options,
  value,
  onChange,
  max = 8,
  disabled = false,
  limitMessage,
}: TagGroupProps) {
  const message = limitMessage ?? `Можно выбрать не больше ${max} тегов.`;
  const [limitError, setLimitError] = useState(false);

  function toggle(tag: string) {
    if (disabled) {
      return;
    }
    if (value.includes(tag)) {
      setLimitError(false);
      onChange(value.filter((item) => item !== tag));
      return;
    }
    if (value.length >= max) {
      setLimitError(true);
      return;
    }
    setLimitError(false);
    onChange([...value, tag]);
  }

  return (
    <div>
      <div className="flex flex-wrap gap-2">
        {options.map((tag) => {
          const selected = value.includes(tag);
          return (
            <button
              key={tag}
              type="button"
              disabled={disabled}
              aria-pressed={selected}
              onClick={() => toggle(tag)}
              className={cn(
                'rounded-pill border px-3 py-2 text-sm transition-colors',
                selected
                  ? 'border-accent bg-accent text-text'
                  : 'border-border text-text-muted hover:border-border-strong hover:text-text',
              )}
            >
              {tag}
            </button>
          );
        })}
      </div>
      {limitError ? (
        <p className="mt-2 text-xs text-danger" role="alert">
          {message}
        </p>
      ) : null}
    </div>
  );
}
