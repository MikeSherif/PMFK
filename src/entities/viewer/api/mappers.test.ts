import { describe, expect, it } from 'vitest';
import type { ViewerDto } from '@/shared/api';
import { mapViewerDto } from './mappers';

const dto: ViewerDto = {
  id: '1',
  email: 'anna@demo.ru',
  abilities: { canSendInterest: false, canChat: false, canBook: false },
  ticket: { status: 'none', label: 'Нет доступа' },
  profile: {
    status: 'approved',
    fullName: 'Анна (демо)',
    company: 'Тест',
    role: 'Руководитель',
    industry: 'Маркетинг и PR',
    city: 'Москва',
    website: '',
    lookingFor: 'Партнёрства',
    offering: 'Контент',
    tags: ['HoReCa'],
    catalogConsent: true,
    publishConsent: true,
  },
};

describe('mapViewerDto', () => {
  it('maps dto fields onto the viewer model', () => {
    const viewer = mapViewerDto(dto);
    expect(viewer.email).toBe(dto.email);
    expect(viewer.abilities.canChat).toBe(false);
    expect(viewer.profile.tags).toEqual(['HoReCa']);
  });
});
