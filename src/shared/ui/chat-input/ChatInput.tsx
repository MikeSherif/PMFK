import { type InputHTMLAttributes, forwardRef } from 'react';
import { cn } from '@/shared/lib';
import { Button } from '@/shared/ui/button';
import { Field, Input } from '@/shared/ui/field';

type ChatInputProps = Omit<InputHTMLAttributes<HTMLInputElement>, 'id'> & {
  id: string;
  label: string;
  sendLabel: string;
  error?: string;
  sending?: boolean;
};

export const ChatInput = forwardRef<HTMLInputElement, ChatInputProps>(function ChatInput(
  { id, label, sendLabel, error, sending, placeholder, disabled, className, ...props },
  ref,
) {
  return (
    <div className={cn('flex flex-col gap-3 sm:flex-row sm:items-end', className)}>
      <div className="flex-1">
        <Field id={id} label={label} error={error ?? ''}>
          <Input
            id={id}
            ref={ref}
            placeholder={placeholder}
            autoComplete="off"
            invalid={Boolean(error)}
            {...props}
            disabled={disabled}
          />
        </Field>
      </div>
      <Button type="submit" loading={Boolean(sending)} disabled={Boolean(sending) || Boolean(disabled)}>
        {sendLabel}
      </Button>
    </div>
  );
});
