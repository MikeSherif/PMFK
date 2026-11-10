import { type ReactNode } from 'react';
import { Badge } from '@/shared/ui/badge';
import { Card } from '@/shared/ui/card';
import type { CatalogProfile } from '../model/types';
import { avatarLetter } from '../lib/format';

type CatalogCardProps = {
  profile: CatalogProfile;
  savedLabel?: string;
  lookingLabel: string;
  offeringLabel: string;
  detailsLabel: string;
  footer?: ReactNode;
};

export function CatalogCard({
  profile,
  savedLabel,
  lookingLabel,
  offeringLabel,
  detailsLabel,
  footer,
}: CatalogCardProps) {
  return (
    <Card className="flex flex-col">
      <div className="flex items-start gap-4">
        <div
          className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full bg-accent/15 font-display text-2xl font-bold text-accent"
          aria-hidden
        >
          {avatarLetter(profile.fullName)}
        </div>
        <div className="min-w-0">
          {profile.saved && savedLabel ? (
            <Badge tone="peach" className="mb-2">
              {savedLabel}
            </Badge>
          ) : null}
          <p className="font-display text-2xl leading-none font-bold tracking-tight uppercase">
            {profile.fullName}
          </p>
          <p className="mt-2 text-sm text-text-muted">
            {profile.role} · {profile.company}
          </p>
        </div>
      </div>
      <ul className="mt-5 flex flex-wrap gap-2">
        {profile.tags.map((tag) => (
          <li key={tag}>
            <Badge>{tag}</Badge>
          </li>
        ))}
      </ul>
      <div className="mt-6 grid gap-4 md:grid-cols-2">
        <section>
          <p className="text-xs tracking-[0.2em] text-peach uppercase">{lookingLabel}</p>
          <p className="mt-2 text-pretty">{profile.lookingFor}</p>
        </section>
        <section>
          <p className="text-xs tracking-[0.2em] text-peach uppercase">{offeringLabel}</p>
          <p className="mt-2 text-pretty">{profile.offering}</p>
        </section>
      </div>
      <details className="mt-5 border-t border-border pt-4">
        <summary className="cursor-pointer text-sm text-accent">{detailsLabel}</summary>
        <p className="mt-3 text-sm text-text-muted">
          {profile.city} · {profile.industry}
        </p>
        <p className="mt-2 text-pretty text-sm text-text-muted">{profile.about}</p>
      </details>
      {footer ? <div className="mt-6">{footer}</div> : null}
    </Card>
  );
}
