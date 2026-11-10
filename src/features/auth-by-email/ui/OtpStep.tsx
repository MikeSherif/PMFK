'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { Controller, useForm } from 'react-hook-form';
import { Button } from '@/shared/ui/button';
import { Field } from '@/shared/ui/field';
import { OtpInput } from '@/shared/ui/otp-input';
import { otpStepSchema, type OtpStepValues } from '../model/schema';
import { authCopy } from '../model/content';

type OtpStepProps = {
  email: string;
  loading: boolean;
  resending: boolean;
  secondsLeft: number;
  serverError?: string;
  demoHint?: string;
  onSubmit: (values: OtpStepValues) => void;
  onResend: () => void;
  onBack: () => void;
};

export function OtpStep({
  email,
  loading,
  resending,
  secondsLeft,
  serverError,
  demoHint,
  onSubmit,
  onResend,
  onBack,
}: OtpStepProps) {
  const {
    control,
    handleSubmit,
    formState: { errors, isValid },
  } = useForm<OtpStepValues>({
    resolver: zodResolver(otpStepSchema),
    mode: 'onChange',
    reValidateMode: 'onChange',
    defaultValues: { code: '' },
  });

  return (
    <form className="flex flex-col gap-4" onSubmit={handleSubmit(onSubmit)} noValidate>
      <p className="text-sm text-text-muted">
        Код отправлен на <span className="text-text">{email}</span>
      </p>
      <Controller
        name="code"
        control={control}
        render={({ field }) => (
          <Field id="otp" label={authCopy.otpTitle} hint={authCopy.otpHint} error={errors.code?.message ?? ''}>
            <OtpInput
              id="otp"
              value={field.value}
              onChange={field.onChange}
              invalid={Boolean(errors.code) || Boolean(serverError)}
              disabled={loading}
            />
          </Field>
        )}
      />
      {demoHint ? <p className="text-center text-sm text-peach">{demoHint}</p> : null}
      {serverError ? (
        <p className="text-sm text-danger" role="alert">
          {serverError}
        </p>
      ) : null}
      <Button type="submit" fullWidth loading={loading} disabled={!isValid || loading}>
        {authCopy.submitOtp}
      </Button>
      {secondsLeft > 0 ? (
        <p className="text-center text-xs text-text-muted">{authCopy.resendWait(secondsLeft)}</p>
      ) : (
        <Button type="button" variant="ghost" fullWidth loading={resending} onClick={onResend}>
          {authCopy.resend}
        </Button>
      )}
      <Button type="button" variant="link" onClick={onBack}>
        {authCopy.back}
      </Button>
    </form>
  );
}
