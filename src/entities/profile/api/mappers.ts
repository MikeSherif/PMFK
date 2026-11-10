import type { ProfileDto } from '@/shared/api';
import type { Profile } from '../model/types';

export function mapProfileDto(dto: ProfileDto): Profile {
  return {
    status: dto.status,
    fullName: dto.fullName,
    company: dto.company,
    role: dto.role,
    industry: dto.industry,
    city: dto.city,
    website: dto.website,
    lookingFor: dto.lookingFor,
    offering: dto.offering,
    tags: dto.tags,
    catalogConsent: dto.catalogConsent,
    publishConsent: dto.publishConsent,
  };
}
