import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { render, screen } from '@testing-library/react';
import { type ReactNode } from 'react';
import { describe, expect, it, vi } from 'vitest';
import { MatchList } from './MatchList';

vi.mock('next/navigation', () => ({
  useRouter: () => ({ push: vi.fn() }),
}));

vi.mock('@/entities/match', async (importOriginal) => {
  const actual = await importOriginal<typeof import('@/entities/match')>();
  return {
    ...actual,
    matchesQuery: () => ({
      queryKey: ['matches', 'list'],
      queryFn: async () => [
        {
          id: 'match-1',
          createdAt: '2026-12-10T10:00:00.000Z',
          peer: { id: 'catalog-maria', fullName: 'Мария Левина', company: 'Сеть кофеен', role: 'Маркетинг' },
        },
      ],
    }),
  };
});

vi.mock('@/entities/viewer', () => ({
  Can: ({ children }: { children: ReactNode }) => children,
}));

function Wrapper({ children }: { children: ReactNode }) {
  const client = new QueryClient({ defaultOptions: { queries: { retry: false } } });
  return <QueryClientProvider client={client}>{children}</QueryClientProvider>;
}

describe('MatchList', () => {
  it('renders a mutual interest card', async () => {
    render(<MatchList emptyTitle="Пусто" emptyDescription="Нет мэтчей" />, { wrapper: Wrapper });
    expect(await screen.findByText('Мария Левина')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /открыть диалог/i })).toBeInTheDocument();
  });
});
