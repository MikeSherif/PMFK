'use client';

import { OTPInput, REGEXP_ONLY_DIGITS, type OTPInputProps } from 'input-otp';
import { cn } from '@/shared/lib';

type OtpInputProps = {
  id?: string;
  value: string;
  onChange: (value: string) => void;
  onComplete?: (value: string) => void;
  disabled?: boolean;
  invalid?: boolean;
  length?: number;
};

export function OtpInput({
  id,
  value,
  onChange,
  onComplete,
  disabled = false,
  invalid = false,
  length = 6,
}: OtpInputProps) {
  const props: OTPInputProps = {
    value,
    onChange,
    maxLength: length,
    disabled,
    inputMode: 'numeric',
    autoComplete: 'one-time-code',
    pattern: REGEXP_ONLY_DIGITS,
    containerClassName: 'flex justify-center',
    'aria-invalid': invalid,
    render: ({ slots }) => (
      <div className="flex gap-2" data-invalid={invalid ? 'true' : 'false'}>
        {slots.map((slot, index) => (
          <div
            key={index}
            className={cn(
              'flex h-12 w-10 items-center justify-center rounded-md border border-border bg-bg-input text-lg',
              slot.isActive && 'border-accent',
              invalid && 'border-danger',
            )}
          >
            {slot.char ?? slot.placeholderChar}
            {slot.hasFakeCaret ? (
              <span className="animate-pulse text-accent" aria-hidden>
                |
              </span>
            ) : null}
          </div>
        ))}
      </div>
    ),
  };
  if (id) {
    props.id = id;
  }
  if (onComplete) {
    props.onComplete = onComplete;
  }

  return <OTPInput {...props} />;
}
