import { queryOptions } from '@tanstack/react-query';
import { mapMeetingDto } from '../api/mappers';
import { getMeetings } from '../api/meeting-api';

export const meetingKeys = {
  all: ['meetings'] as const,
  list: () => [...meetingKeys.all, 'list'] as const,
};

export const meetingsQuery = () =>
  queryOptions({
    queryKey: meetingKeys.list(),
    queryFn: () => getMeetings().then((payload) => payload.items.map(mapMeetingDto)),
  });
