import type { MeetingDto } from '@/shared/api';
import type { Meeting } from '../model/types';

export function mapMeetingDto(dto: MeetingDto): Meeting {
  return {
    id: dto.id,
    matchId: dto.matchId,
    createdAt: dto.createdAt,
    status: dto.status,
    slotLabel: dto.slotLabel,
    peer: { ...dto.peer },
  };
}
