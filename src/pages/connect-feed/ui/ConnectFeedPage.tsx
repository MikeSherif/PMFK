import { EmptyState } from '@/shared/ui/empty-state';
import { Heading } from '@/shared/ui/heading';
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
        <EmptyState title={feedContent.emptyTitle} description={feedContent.emptyDescription} />
      </div>
    </div>
  );
}
