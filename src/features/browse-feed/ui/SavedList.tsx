'use client';

import { useQuery } from '@tanstack/react-query';
import { Button } from '@/shared/ui/button';
import { EmptyState } from '@/shared/ui/empty-state';
import { Skeleton } from '@/shared/ui/skeleton';
import { CatalogCard, savedProfilesQuery } from '@/entities/profile';
import { Can } from '@/entities/viewer';
import { browseFeedCopy } from '../model/content';
import { useCatalogActions } from '../model/use-catalog-actions';

type SavedListProps = {
  emptyTitle: string;
  emptyDescription: string;
  savedBadge: string;
  unsaveLabel: string;
};

export function SavedList({ emptyTitle, emptyDescription, savedBadge, unsaveLabel }: SavedListProps) {
  const savedQuery = useQuery(savedProfilesQuery());
  const { unsave, interest } = useCatalogActions();
  const items = savedQuery.data ?? [];

  if (savedQuery.isPending) {
    return <Skeleton className="h-64 w-full" />;
  }

  if (items.length === 0) {
    return <EmptyState title={emptyTitle} description={emptyDescription} />;
  }

  return (
    <div className="flex flex-col gap-6">
      {items.map((profile) => (
        <CatalogCard
          key={profile.id}
          profile={profile}
          savedLabel={savedBadge}
          lookingLabel={browseFeedCopy.looking}
          offeringLabel={browseFeedCopy.offering}
          detailsLabel={browseFeedCopy.details}
          footer={
            <div className="flex flex-col gap-3 sm:flex-row">
              <Can ability="canSendInterest" paywall>
                <Button onClick={() => interest.mutate(profile.id)}>{browseFeedCopy.interest}</Button>
              </Can>
              <Button variant="secondary" onClick={() => unsave.mutate(profile.id)}>
                {unsaveLabel}
              </Button>
            </div>
          }
        />
      ))}
    </div>
  );
}
