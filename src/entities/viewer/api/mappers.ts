import type { ViewerDto } from '@/shared/api';
import type { Viewer } from '../model/types';

export function mapViewerDto(dto: ViewerDto): Viewer {
  return {
    id: dto.id,
    email: dto.email,
    abilities: dto.abilities,
    ticket: dto.ticket,
    profile: dto.profile,
  };
}
