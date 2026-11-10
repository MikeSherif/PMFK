import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { render, screen } from '@testing-library/react';
import { type ReactNode } from 'react';
import { describe, expect, it, vi } from 'vitest';
import { MeetingList } from './MeetingList';

vi.mock('@/entities/meeting', async (importOriginal) => {
  const actual = await importOriginal<typeof import('@/entities/meeting')>();
  return {
    ...actual,
    meetingsQuery: () => ({
      queryKey: ['meetings', 'list'],
      queryFn: async () => [],
    }),
  };
});

function Wrapper({ children }: { children: ReactNode }) {
  const client = new QueryClient({ defaultOptions: { queries: { retry: false } } });
  return <QueryClientProvider client={client}>{children}</QueryClientProvider>;
}

describe('MeetingList', () => {
  it('shows the empty state when booking has no requests', async () => {
    render(<MeetingList emptyTitle="Назначенных встреч пока нет." />, { wrapper: Wrapper });
    expect(await screen.findByText('Назначенных встреч пока нет.')).toBeInTheDocument();
  });
});
