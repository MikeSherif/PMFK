import { Suspense } from 'react';
import { Card } from '@/shared/ui/card';
import { Container } from '@/shared/ui/container';
import { Heading } from '@/shared/ui/heading';
import { AuthByEmail } from '@/features/auth-by-email';
import { ConnectHeader, DemoBanner } from '@/widgets/connect-shell';
import { SiteFooter } from '@/widgets/site-footer';
import { loginContent } from '../content';

function LoginFormFallback() {
  return <div className="h-64 animate-pulse rounded-lg bg-surface" />;
}

export function ConnectLoginPage() {
  return (
    <div className="min-h-dvh bg-mesh">
      <ConnectHeader />
      <DemoBanner />
      <Container className="max-w-3xl py-16">
        <p className="text-xs tracking-[0.2em] text-peach uppercase">{loginContent.eyebrow}</p>
        <Heading as="h1" className="mt-4" accent={loginContent.accent}>
          {loginContent.title}
        </Heading>
        <p className="mt-4 max-w-xl text-pretty text-text-muted">{loginContent.lead}</p>
        <Card className="mt-8 max-w-xl">
          <Suspense fallback={<LoginFormFallback />}>
            <AuthByEmail />
          </Suspense>
        </Card>
        <ol className="mt-10 grid gap-4 md:grid-cols-3">
          {loginContent.steps.map((step) => (
            <li key={step.n} className="glass rounded-lg p-5">
              <p className="font-display text-2xl text-accent">{step.n}</p>
              <p className="font-display mt-3 text-lg font-bold uppercase">{step.title}</p>
              <p className="mt-2 text-sm text-text-muted">{step.text}</p>
            </li>
          ))}
        </ol>
      </Container>
      <SiteFooter />
    </div>
  );
}
