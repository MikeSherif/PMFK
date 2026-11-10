'use client';

import { useQuery } from '@tanstack/react-query';
import { Card } from '@/shared/ui/card';
import { Heading } from '@/shared/ui/heading';
import { viewerQuery } from '@/entities/viewer';
import { profileContent } from '../content';

export function ConnectProfilePage() {
  const { data } = useQuery(viewerQuery());
  const profile = data?.profile;

  return (
    <div>
      <p className="text-xs tracking-[0.2em] text-peach uppercase">{profileContent.eyebrow}</p>
      <Heading as="h1" className="mt-3" accent={profileContent.accent}>
        {profileContent.title}
      </Heading>
      <p className="mt-4 max-w-2xl text-pretty text-text-muted">{profileContent.description}</p>
      {profile ? (
        <Card className="mt-8 max-w-xl">
          <p className="text-xs tracking-[0.2em] text-peach uppercase">{profileContent.statusLabel}</p>
          <p className="font-display mt-2 text-2xl font-bold uppercase">{profileContent.status[profile.status]}</p>
          <p className="mt-4 text-text">{profile.fullName}</p>
          <p className="text-sm text-text-muted">
            {profile.role} · {profile.company}
          </p>
        </Card>
      ) : null}
    </div>
  );
}
