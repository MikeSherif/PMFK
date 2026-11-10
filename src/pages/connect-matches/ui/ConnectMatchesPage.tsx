import { EmptyState } from '@/shared/ui/empty-state';
import { Heading } from '@/shared/ui/heading';
import { matchesContent } from '../content';

export function ConnectMatchesPage() {
  return (
    <div>
      <p className="text-xs tracking-[0.2em] text-peach uppercase">{matchesContent.eyebrow}</p>
      <Heading as="h1" className="mt-3">
        {matchesContent.title}
      </Heading>
      <p className="mt-4 max-w-2xl text-pretty text-text-muted">{matchesContent.description}</p>
      <div className="mt-8">
        <EmptyState title={matchesContent.emptyTitle} description={matchesContent.emptyDescription} />
      </div>
    </div>
  );
}
