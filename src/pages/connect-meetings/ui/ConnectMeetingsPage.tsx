import { flags } from '@/shared/config';
import { EmptyState } from '@/shared/ui/empty-state';
import { Heading } from '@/shared/ui/heading';
import { meetingsContent } from '../content';

export function ConnectMeetingsPage() {
  return (
    <div>
      <p className="text-xs tracking-[0.2em] text-peach uppercase">{meetingsContent.eyebrow}</p>
      <Heading as="h1" className="mt-3">
        {meetingsContent.title}
      </Heading>
      <p className="mt-4 max-w-2xl text-pretty text-text-muted">{meetingsContent.description}</p>
      {flags.bookingEnabled ? null : (
        <p className="glass mt-6 rounded-lg p-4 text-sm text-peach">{meetingsContent.bookingClosed}</p>
      )}
      <h2 className="font-display mt-10 text-xl font-bold uppercase">{meetingsContent.listTitle}</h2>
      <div className="mt-4">
        <EmptyState title={meetingsContent.emptyTitle} />
      </div>
    </div>
  );
}
