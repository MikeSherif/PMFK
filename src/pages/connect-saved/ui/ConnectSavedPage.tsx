import { EmptyState } from '@/shared/ui/empty-state';
import { Heading } from '@/shared/ui/heading';
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
        <EmptyState title={savedContent.emptyTitle} description={savedContent.emptyDescription} />
      </div>
    </div>
  );
}
