'use client';

import { useMutation, useQueryClient } from '@tanstack/react-query';
import type { Route } from 'next';
import { useRouter, useSearchParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import { isApiError } from '@/shared/api';
import { env, flags, routes } from '@/shared/config';
import { mapViewerDto, viewerKeys } from '@/entities/viewer';
import { requestOtpCode, verifyOtpCode } from '../api/auth-api';
import { authCopy } from '../model/content';
import type { EmailStepValues, OtpStepValues } from '../model/schema';
import { EmailStep } from './EmailStep';
import { OtpStep } from './OtpStep';

function safeNextPath(raw: string | null) {
  if (raw && raw.startsWith('/connect') && !raw.startsWith('/connect/login')) {
    return raw;
  }
  return routes.connect.feed;
}

export function AuthByEmail() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const queryClient = useQueryClient();
  const [email, setEmail] = useState('');
  const [step, setStep] = useState<'email' | 'otp'>('email');
  const [secondsLeft, setSecondsLeft] = useState(0);

  useEffect(() => {
    if (secondsLeft <= 0) {
      return;
    }
    const id = globalThis.setTimeout(() => setSecondsLeft((value) => value - 1), 1000);
    return () => globalThis.clearTimeout(id);
  }, [secondsLeft]);

  const requestMutation = useMutation({
    mutationFn: (values: EmailStepValues) =>
      requestOtpCode({
        email: values.email,
        consentPdn: true,
        consentVersion: env.NEXT_PUBLIC_PDN_POLICY_VERSION,
      }),
    onSuccess: (_data, values) => {
      setEmail(values.email);
      setStep('otp');
      setSecondsLeft(authCopy.resendSec);
    },
  });

  const verifyMutation = useMutation({
    mutationFn: (values: OtpStepValues) => verifyOtpCode({ email, code: values.code }),
    onSuccess: (data) => {
      queryClient.setQueryData(viewerKeys.me(), mapViewerDto(data.viewer));
      router.replace(safeNextPath(searchParams?.get('next') ?? null) as Route);
      router.refresh();
    },
  });

  const resendMutation = useMutation({
    mutationFn: () =>
      requestOtpCode({
        email,
        consentPdn: true,
        consentVersion: env.NEXT_PUBLIC_PDN_POLICY_VERSION,
      }),
    onSuccess: () => setSecondsLeft(authCopy.resendSec),
  });

  const otpError = mutationMessage(verifyMutation.error) ?? mutationMessage(resendMutation.error);
  const emailError = mutationMessage(requestMutation.error);

  if (step === 'otp') {
    return (
      <OtpStep
        email={email}
        loading={verifyMutation.isPending}
        resending={resendMutation.isPending}
        secondsLeft={secondsLeft}
        {...(otpError ? { serverError: otpError } : {})}
        {...(flags.demoMode ? { demoHint: authCopy.demoHint } : {})}
        onSubmit={(values) => verifyMutation.mutate(values)}
        onResend={() => resendMutation.mutate()}
        onBack={() => {
          setStep('email');
          verifyMutation.reset();
          resendMutation.reset();
        }}
      />
    );
  }

  return (
    <EmailStep
      defaultEmail={email}
      loading={requestMutation.isPending}
      {...(emailError ? { serverError: emailError } : {})}
      onSubmit={(values) => requestMutation.mutate(values)}
    />
  );
}

function mutationMessage(error: unknown) {
  if (!error) {
    return undefined;
  }
  if (isApiError(error)) {
    return error.message;
  }
  return 'Не удалось выполнить запрос';
}
