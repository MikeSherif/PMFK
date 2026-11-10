'use client';

import { Heading } from '@/shared/ui/heading';
import { FeedDeck } from '@/features/browse-feed';
import { feedContent } from '../content';

export function ConnectFeedPage() {
  return (
    <div>
      <p className="text-xs tracking-[0.2em] text-peach uppercase">{feedContent.eyebrow}</p>
      <Heading as="h1" className="mt-3">
        {feedContent.title}
      </Heading>
      <p className="mt-4 max-w-2xl text-pretty text-text-muted">{feedContent.description}</p>
      <div className="mt-8">
        <FeedDeck emptyTitle={feedContent.emptyTitle} emptyDescription={feedContent.emptyDescription} />
      </div>
    </div>
  );
}
