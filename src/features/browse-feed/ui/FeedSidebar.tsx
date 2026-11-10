import Link from 'next/link';
import { routes } from '@/shared/config';
import { Card } from '@/shared/ui/card';
import { browseFeedCopy } from '../model/content';

export function FeedSidebar() {
  return (
    <aside className="hidden lg:block">
      <Card>
        <p className="text-xs tracking-[0.2em] text-peach uppercase">{browseFeedCopy.howEyebrow}</p>
        <p className="font-display mt-3 text-2xl leading-none font-bold tracking-tight uppercase">
          {browseFeedCopy.howTitle}
        </p>
        <ol className="mt-6 flex flex-col gap-4">
          {browseFeedCopy.howSteps.map((step) => (
            <li key={step.n}>
              <p className="font-display text-xl text-accent">{step.n}</p>
              <p className="font-display mt-1 font-bold uppercase">{step.title}</p>
              <p className="mt-1 text-sm text-text-muted">{step.text}</p>
            </li>
          ))}
        </ol>
        <Link href={routes.profilePublication} className="mt-6 inline-flex text-sm text-accent">
          {browseFeedCopy.terms}
        </Link>
      </Card>
    </aside>
  );
}
