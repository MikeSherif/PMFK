import { queryOptions } from '@tanstack/react-query';
import { mapMatchDto } from '../api/mappers';
import { getMatchById, getMatches } from '../api/match-api';

export const matchKeys = {
  all: ['matches'] as const,
  list: () => [...matchKeys.all, 'list'] as const,
  detail: (id: string) => [...matchKeys.all, 'detail', id] as const,
};

export const matchesQuery = () =>
  queryOptions({
    queryKey: matchKeys.list(),
    queryFn: () => getMatches().then((payload) => payload.items.map(mapMatchDto)),
  });

export const matchQuery = (id: string) =>
  queryOptions({
    queryKey: matchKeys.detail(id),
    queryFn: () => getMatchById(id).then(mapMatchDto),
  });
