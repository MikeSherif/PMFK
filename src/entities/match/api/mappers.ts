import type { MatchDto } from '@/shared/api';
import type { Match } from '../model/types';

export function mapMatchDto(dto: MatchDto): Match {
  return {
    id: dto.id,
    createdAt: dto.createdAt,
    peer: { ...dto.peer },
  };
}
