import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { render, screen } from '@testing-library/react';
import { type ReactNode } from 'react';
import { describe, expect, it, vi } from 'vitest';
import type { Profile } from '@/entities/profile';
import { ProfileForm } from './ProfileForm';

const profile: Profile = {
  status: 'approved',
  fullName: 'Анна (демо)',
  company: 'Маркетинговое агентство · тест',
  role: 'Руководитель партнёрств',
  industry: 'Маркетинг и PR',
  city: 'Москва',
  website: '',
  lookingFor: 'Партнёрства FMCG и HoReCa для совместных проектов.',
  offering: 'Контент, комьюнити и организацию промоакций.',
  tags: ['Кросс-промо', 'Совместный продукт', 'HoReCa'],
  catalogConsent: true,
  publishConsent: false,
};

vi.mock('@/entities/profile', async (importOriginal) => {
  const actual = await importOriginal<typeof import('@/entities/profile')>();
  return {
    ...actual,
    myProfileQuery: () => ({
      queryKey: ['profiles', 'me'],
      queryFn: async () => profile,
    }),
  };
});

function Wrapper({ children }: { children: ReactNode }) {
  const client = new QueryClient({ defaultOptions: { queries: { retry: false }, mutations: { retry: false } } });
  return <QueryClientProvider client={client}>{children}</QueryClientProvider>;
}

describe('ProfileForm', () => {
  it('enables save for a valid loaded profile and keeps publish consent unchecked', async () => {
    render(<ProfileForm />, { wrapper: Wrapper });
    expect(await screen.findByDisplayValue('Анна (демо)')).toBeInTheDocument();
    expect(screen.getByRole('checkbox', { name: /отдельно даю согласие на публикацию/i })).not.toBeChecked();
    expect(screen.getByRole('button', { name: /сохранить профиль/i })).toBeEnabled();
  });
});
