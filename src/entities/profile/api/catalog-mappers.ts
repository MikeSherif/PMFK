import type { CatalogProfileDto, FeedPageDto } from '@/shared/api';
import type { CatalogProfile, FeedPage } from '../model/types';

export function mapCatalogProfile(dto: CatalogProfileDto): CatalogProfile {
  return { ...dto };
}

export function mapFeedPage(dto: FeedPageDto): FeedPage {
  return {
    items: dto.items.map(mapCatalogProfile),
    nextCursor: dto.nextCursor,
    total: dto.total,
  };
}
