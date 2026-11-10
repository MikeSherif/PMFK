import { queryOptions } from '@tanstack/react-query';
import { getMe } from '../api/viewer-api';
import { mapViewerDto } from '../api/mappers';

export const viewerKeys = {
  all: ['viewer'] as const,
  me: () => [...viewerKeys.all, 'me'] as const,
};

export const viewerQuery = () =>
  queryOptions({
    queryKey: viewerKeys.me(),
    queryFn: () => getMe().then(mapViewerDto),
  });
