import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { type ReactNode } from 'react';
import { describe, expect, it, vi } from 'vitest';
import { AuthByEmail } from './AuthByEmail';

vi.mock('next/navigation', () => ({
  useRouter: () => ({ replace: vi.fn(), refresh: vi.fn() }),
  useSearchParams: () => new URLSearchParams(),
}));

vi.mock('../api/auth-api', () => ({
  requestOtpCode: vi.fn(async () => ({ expiresInSec: 300 })),
  verifyOtpCode: vi.fn(),
  logoutSession: vi.fn(),
}));

function Wrapper({ children }: { children: ReactNode }) {
  const client = new QueryClient({ defaultOptions: { queries: { retry: false }, mutations: { retry: false } } });
  return <QueryClientProvider client={client}>{children}</QueryClientProvider>;
}

describe('AuthByEmail', () => {
  it('moves to the OTP step after a successful email request', async () => {
    const user = userEvent.setup();
    const view = render(<AuthByEmail />, { wrapper: Wrapper });

    await user.type(screen.getByLabelText(/email для входа/i), 'anna@demo.ru');
    await user.click(screen.getByLabelText(/даю отдельное согласие/i));
    await user.click(screen.getByRole('button', { name: /получить код на email/i }));

    expect(await screen.findByText(/код отправлен на/i)).toBeInTheDocument();
    expect(screen.getByText(/демо-код: 123456/i)).toBeInTheDocument();
    view.unmount();
  });
});
