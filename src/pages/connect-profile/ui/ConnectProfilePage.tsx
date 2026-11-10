'use client';

import { useQuery } from '@tanstack/react-query';
import { Card } from '@/shared/ui/card';
import { Heading } from '@/shared/ui/heading';
import { Skeleton } from '@/shared/ui/skeleton';
import { myProfileQuery, profileStatusMeta } from '@/entities/profile';
import { DeleteAccountButton } from '@/features/delete-account';
import { ProfileForm } from '@/features/edit-profile';
import { profileContent } from '../content';

export function ConnectProfilePage() {
  const profileQuery = useQuery(myProfileQuery());
  const status = profileQuery.data ? profileStatusMeta[profileQuery.data.status] : null;

  return (
    <div>
      <p className="text-xs tracking-[0.2em] text-peach uppercase">{profileContent.eyebrow}</p>
      <Heading as="h1" className="mt-3" accent={profileContent.accent}>
        {profileContent.title}
      </Heading>
      <p className="mt-4 max-w-2xl text-pretty text-text-muted">{profileContent.description}</p>
      <div className="mt-8 grid items-start gap-6 lg:grid-cols-[minmax(0,1fr)_20rem]">
        <Card>
          {profileQuery.isPending ? (
            <div className="flex flex-col gap-4">
              <Skeleton className="h-12 w-full" />
              <Skeleton className="h-12 w-full" />
              <Skeleton className="h-28 w-full" />
            </div>
          ) : (
            <ProfileForm footer={<DeleteAccountButton />} />
          )}
        </Card>
        <aside className="flex flex-col gap-4">
          <Card>
            <p className="text-xs tracking-[0.2em] text-peach uppercase">{profileContent.statusLabel}</p>
            <p className="font-display mt-3 text-2xl leading-none font-bold uppercase">
              {status?.label ?? '…'}
            </p>
            <p className="mt-4 text-pretty text-sm text-text-muted">{status?.feedHint}</p>
            <p className="mt-4 rounded-md border border-border px-4 py-3 text-sm text-text">
              {profileContent.accessHint}
            </p>
          </Card>
          <Card>
            <p className="text-xs tracking-[0.2em] text-peach uppercase">{profileContent.privacyEyebrow}</p>
            <p className="mt-3 text-pretty text-sm text-text-muted">{profileContent.privacyBody}</p>
          </Card>
        </aside>
      </div>
    </div>
  );
}
