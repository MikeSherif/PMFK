import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import { QueryError } from './QueryError';

describe('QueryError', () => {
  it('retries after a failed load', async () => {
    const onRetry = vi.fn();
    const user = userEvent.setup();
    render(
      <QueryError title="Не удалось загрузить данные." retryLabel="Повторить" onRetry={onRetry} />,
    );
    await user.click(screen.getByRole('button', { name: 'Повторить' }));
    expect(onRetry).toHaveBeenCalledOnce();
  });
});
