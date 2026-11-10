import { type InputHTMLAttributes, type ReactNode, type TextareaHTMLAttributes, forwardRef } from 'react';
import { cn } from '@/shared/lib';

const controlClass =
  'w-full rounded-md border border-border bg-bg-input px-4 py-3 text-text placeholder:text-text-muted/60 data-[invalid=true]:border-danger';

type FieldShellProps = {
  id: string;
  label: string;
  hint?: string;
  error?: string;
  children: ReactNode;
};

export function Field({ id, label, hint, error, children }: FieldShellProps) {
  const hintId = hint ? `${id}-hint` : undefined;
  const errorId = error ? `${id}-error` : undefined;
  const describedBy = [hintId, errorId].filter(Boolean).join(' ') || undefined;
  return (
    <div className="flex flex-col gap-2" data-invalid={error ? 'true' : 'false'}>
      <label htmlFor={id} className="text-sm text-text">
        {label}
      </label>
      <div data-describedby={describedBy}>{children}</div>
      {hint ? (
        <p id={hintId} className="text-xs text-text-muted">
          {hint}
        </p>
      ) : null}
      {error ? (
        <p id={errorId} className="text-xs text-danger" role="alert">
          {error}
        </p>
      ) : null}
    </div>
  );
}

type InputProps = InputHTMLAttributes<HTMLInputElement> & { invalid?: boolean };

export const Input = forwardRef<HTMLInputElement, InputProps>(function Input(
  { className, invalid, ...props },
  ref,
) {
  return (
    <input
      ref={ref}
      className={cn(controlClass, className)}
      data-invalid={invalid ? 'true' : 'false'}
      aria-invalid={invalid}
      {...props}
    />
  );
});

type TextareaProps = TextareaHTMLAttributes<HTMLTextAreaElement> & { invalid?: boolean };

export const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(function Textarea(
  { className, invalid, ...props },
  ref,
) {
  return (
    <textarea
      ref={ref}
      className={cn(controlClass, 'min-h-28 resize-y', className)}
      data-invalid={invalid ? 'true' : 'false'}
      aria-invalid={invalid}
      {...props}
    />
  );
});
