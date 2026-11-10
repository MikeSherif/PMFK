'use client';

import { Heading } from '@/shared/ui/heading';
import { SavedList } from '@/features/browse-feed';
import { savedContent } from '../content';

export function ConnectSavedPage() {
  return (
    <div>
      <p className="text-xs tracking-[0.2em] text-peach uppercase">{savedContent.eyebrow}</p>
      <Heading as="h1" className="mt-3">
        {savedContent.title}
      </Heading>
      <p className="mt-4 max-w-2xl text-pretty text-text-muted">{savedContent.description}</p>
      <div className="mt-8">
        <SavedList
          emptyTitle={savedContent.emptyTitle}
          emptyDescription={savedContent.emptyDescription}
          savedBadge={savedContent.savedBadge}
          unsaveLabel={savedContent.unsave}
        />
      </div>
    </div>
  );
}
