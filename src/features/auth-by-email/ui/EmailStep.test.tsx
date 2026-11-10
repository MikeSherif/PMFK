import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import { EmailStep } from './EmailStep';

describe('EmailStep', () => {
  it('keeps submit disabled until email and consent are valid', async () => {
    const user = userEvent.setup();
    const onSubmit = vi.fn();
    render(<EmailStep loading={false} onSubmit={onSubmit} />);

    const submit = screen.getByRole('button', { name: /получить код на email/i });
    expect(submit).toBeDisabled();

    await user.type(screen.getByLabelText(/email для входа/i), 'anna@demo.ru');
    expect(submit).toBeDisabled();

    await user.click(screen.getByLabelText(/даю отдельное согласие/i));
    expect(submit).toBeEnabled();

    await user.click(submit);
    expect(onSubmit).toHaveBeenCalledWith(
      { email: 'anna@demo.ru', consentPdn: true },
      expect.anything(),
    );
  });
});
