import { EmptyState } from '@/shared/ui/empty-state';
import { Heading } from '@/shared/ui/heading';
import { matchesContent } from '../content';

export function ConnectChatPage() {
  return (
    <div>
      <p className="text-xs tracking-[0.2em] text-peach uppercase">{matchesContent.eyebrow}</p>
      <Heading as="h1" className="mt-3">
        {matchesContent.chatTitle}
      </Heading>
      <p className="mt-4 max-w-2xl text-pretty text-text-muted">{matchesContent.chatDescription}</p>
      <div className="mt-8">
        <EmptyState title={matchesContent.chatEmpty} />
      </div>
    </div>
  );
}
