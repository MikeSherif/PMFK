import { queryOptions } from '@tanstack/react-query';
import { getFeedPage, getSavedProfiles } from '../api/catalog-api';
import { mapCatalogProfile, mapFeedPage } from '../api/catalog-mappers';
import { getMyProfile } from '../api/profile-api';
import { mapProfileDto } from '../api/mappers';
import type { FeedFilters } from './types';

export const profileKeys = {
  all: ['profiles'] as const,
  me: () => [...profileKeys.all, 'me'] as const,
  feed: (filters: FeedFilters) => [...profileKeys.all, 'feed', filters] as const,
  saved: () => [...profileKeys.all, 'saved'] as const,
};

export const myProfileQuery = () =>
  queryOptions({
    queryKey: profileKeys.me(),
    queryFn: () => getMyProfile().then(mapProfileDto),
  });

export const defaultFeedFilters: FeedFilters = { cursor: null };

export const feedQuery = (filters: FeedFilters = defaultFeedFilters) =>
  queryOptions({
    queryKey: profileKeys.feed(filters),
    queryFn: () => getFeedPage(filters.cursor).then(mapFeedPage),
  });

export const savedProfilesQuery = () =>
  queryOptions({
    queryKey: profileKeys.saved(),
    queryFn: () => getSavedProfiles().then((payload) => payload.items.map(mapCatalogProfile)),
  });
