'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { Controller, useForm } from 'react-hook-form';
import { Button } from '@/shared/ui/button';
import { Checkbox } from '@/shared/ui/checkbox';
import { Field, Input } from '@/shared/ui/field';
import { emailStepSchema, type EmailStepValues } from '../model/schema';
import { authCopy } from '../model/content';

type EmailStepProps = {
  defaultEmail?: string;
  loading: boolean;
  serverError?: string;
  onSubmit: (values: EmailStepValues) => void;
};

export function EmailStep({ defaultEmail = '', loading, serverError, onSubmit }: EmailStepProps) {
  const {
    register,
    control,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<EmailStepValues>({
    resolver: zodResolver(emailStepSchema),
    mode: 'onTouched',
    reValidateMode: 'onChange',
    defaultValues: { email: defaultEmail, consentPdn: false },
  });

  const canSubmit = emailStepSchema.safeParse(watch()).success;

  return (
    <form className="flex flex-col gap-4" onSubmit={handleSubmit(onSubmit)} noValidate>
      <Field id="email" label={authCopy.emailLabel} error={errors.email?.message ?? ''}>
        <Input
          id="email"
          type="email"
          autoComplete="email"
          placeholder={authCopy.emailPlaceholder}
          invalid={Boolean(errors.email)}
          {...register('email')}
        />
      </Field>
      <Controller
        name="consentPdn"
        control={control}
        render={({ field }) => (
          <div>
            <Checkbox
              id="consentPdn"
              name={field.name}
              checked={field.value}
              onCheckedChange={(value) => field.onChange(value === true)}
              onBlur={field.onBlur}
              label={authCopy.consent}
            />
            {errors.consentPdn?.message ? (
              <p className="mt-2 text-xs text-danger" role="alert">
                {errors.consentPdn.message}
              </p>
            ) : null}
          </div>
        )}
      />
      {serverError ? (
        <p className="text-sm text-danger" role="alert">
          {serverError}
        </p>
      ) : null}
      <Button type="submit" fullWidth loading={loading} disabled={!canSubmit || loading}>
        {authCopy.submitEmail}
      </Button>
      <p className="text-xs text-text-muted">{authCopy.hint}</p>
    </form>
  );
}
