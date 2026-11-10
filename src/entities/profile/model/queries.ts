import { queryOptions } from '@tanstack/react-query';
import { getMyProfile } from '../api/profile-api';
import { mapProfileDto } from '../api/mappers';

export const profileKeys = {
  all: ['profiles'] as const,
  me: () => [...profileKeys.all, 'me'] as const,
};

export const myProfileQuery = () =>
  queryOptions({
    queryKey: profileKeys.me(),
    queryFn: () => getMyProfile().then(mapProfileDto),
  });
