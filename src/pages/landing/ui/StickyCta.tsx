'use client';

import { AppLink } from '@/shared/lib';
import { heroContent } from '../content/hero';
import { Button } from '@/shared/ui/button';

export function StickyCta() {
  return (
    <div className="pointer-events-none fixed inset-x-0 bottom-0 z-40 p-4 pb-[max(1rem,env(safe-area-inset-bottom))] md:hidden">
      <Button asChild fullWidth className="pointer-events-auto">
        <AppLink href={heroContent.primaryCta.href}>{heroContent.primaryCta.label} ↗</AppLink>
      </Button>
    </div>
  );
}
