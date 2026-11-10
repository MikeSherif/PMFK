import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { render, screen } from '@testing-library/react';
import { type ReactNode } from 'react';
import { describe, expect, it, vi } from 'vitest';
import type { FeedPage } from '@/entities/profile';
import { FeedDeck } from './FeedDeck';

const feed: FeedPage = {
  total: 1,
  nextCursor: null,
  items: [
    {
      id: 'catalog-igor',
      fullName: 'Игорь Соколов',
      company: 'FMCG-бренд',
      role: 'Бренд-директор',
      industry: 'FMCG',
      city: 'Москва',
      lookingFor: 'Коллаборации с HoReCa.',
      offering: 'Дистрибуцию и промо.',
      tags: ['FMCG', 'Кросс-промо'],
      about: 'Пилоты на полке.',
      saved: false,
    },
  ],
};

vi.mock('@/entities/profile', async (importOriginal) => {
  const actual = await importOriginal<typeof import('@/entities/profile')>();
  return {
    ...actual,
    feedQuery: () => ({
      queryKey: ['profiles', 'feed', { cursor: null }],
      queryFn: async () => feed,
    }),
  };
});

vi.mock('@/entities/viewer', () => ({
  Can: ({ children }: { children: ReactNode }) => children,
  useAbility: () => false,
}));

function Wrapper({ children }: { children: ReactNode }) {
  const client = new QueryClient({ defaultOptions: { queries: { retry: false }, mutations: { retry: false } } });
  return <QueryClientProvider client={client}>{children}</QueryClientProvider>;
}

describe('FeedDeck', () => {
  it('renders the current catalog card and actions', async () => {
    render(<FeedDeck emptyTitle="Пусто" emptyDescription="Нет карточек" />, { wrapper: Wrapper });
    expect(await screen.findByText('Игорь Соколов')).toBeInTheDocument();
    expect(screen.getAllByRole('button', { name: /хочу познакомиться/i }).length).toBeGreaterThan(0);
    expect(screen.getByText(/доступно: 1 профиль/i)).toBeInTheDocument();
  });
});
