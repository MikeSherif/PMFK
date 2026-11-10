'use client';

import { Button } from '@/shared/ui/button';
import { type CatalogProfile } from '@/entities/profile';
import { Can } from '@/entities/viewer';
import { browseFeedCopy } from '../model/content';
import { useCatalogActions } from '../model/use-catalog-actions';

type FeedActionsProps = {
  profile: CatalogProfile;
  sticky?: boolean;
};

export function FeedActions({ profile, sticky = false }: FeedActionsProps) {
  const { skip, save, unsave, interest } = useCatalogActions();
  const pending = skip.isPending || save.isPending || unsave.isPending || interest.isPending;

  const buttons = (
    <>
      <Button
        variant="secondary"
        size="sm"
        aria-label={browseFeedCopy.skip}
        disabled={pending}
        onClick={() => skip.mutate(profile.id)}
      >
        ×
      </Button>
      <Button
        variant="secondary"
        size="sm"
        aria-label={profile.saved ? browseFeedCopy.unsave : browseFeedCopy.save}
        disabled={pending}
        onClick={() => (profile.saved ? unsave.mutate(profile.id) : save.mutate(profile.id))}
      >
        {profile.saved ? '★' : '☆'}
      </Button>
      <Can ability="canSendInterest" paywall>
        <Button
          size="sm"
          disabled={pending}
          onClick={() => interest.mutate(profile.id)}
        >
          {browseFeedCopy.interest}
        </Button>
      </Can>
    </>
  );

  if (sticky) {
    return (
      <div className="fixed inset-x-0 z-30 border-t border-border bg-bg/95 px-4 py-3 backdrop-blur-md lg:hidden bottom-[calc(3.5rem+env(safe-area-inset-bottom))]">
        <div className="flex items-center justify-center gap-3">{buttons}</div>
      </div>
    );
  }

  return <div className="hidden items-center gap-3 lg:flex">{buttons}</div>;
}
