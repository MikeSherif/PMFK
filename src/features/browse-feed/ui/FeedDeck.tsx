'use client';

import { useQuery } from '@tanstack/react-query';
import Link from 'next/link';
import { routes } from '@/shared/config';
import { EmptyState } from '@/shared/ui/empty-state';
import { Skeleton } from '@/shared/ui/skeleton';
import { CatalogCard, feedQuery, profileWord } from '@/entities/profile';
import { browseFeedCopy } from '../model/content';
import { FeedActions } from './FeedActions';
import { FeedSidebar } from './FeedSidebar';

type FeedDeckProps = {
  emptyTitle: string;
  emptyDescription: string;
};

export function FeedDeck({ emptyTitle, emptyDescription }: FeedDeckProps) {
  const feedQueryResult = useQuery(feedQuery());
  const items = feedQueryResult.data?.items ?? [];
  const total = feedQueryResult.data?.total ?? 0;
  const current = items[0];

  return (
    <div className="grid items-start gap-6 lg:grid-cols-[minmax(0,1fr)_18rem]">
      <div className="pb-24 lg:pb-0">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <p className="text-xs tracking-[0.2em] text-peach uppercase">
            {browseFeedCopy.available(total, profileWord(total))}
          </p>
          <Link href={routes.connect.saved} className="text-sm text-accent">
            {browseFeedCopy.savedLink}
          </Link>
        </div>
        <div className="mt-6">
          {feedQueryResult.isPending ? (
            <Skeleton className="h-80 w-full" />
          ) : current ? (
            <>
              <CatalogCard
                profile={current}
                lookingLabel={browseFeedCopy.looking}
                offeringLabel={browseFeedCopy.offering}
                detailsLabel={browseFeedCopy.details}
                footer={<FeedActions profile={current} />}
              />
              <FeedActions profile={current} sticky />
            </>
          ) : (
            <EmptyState title={emptyTitle} description={emptyDescription} />
          )}
        </div>
      </div>
      <FeedSidebar />
    </div>
  );
}
