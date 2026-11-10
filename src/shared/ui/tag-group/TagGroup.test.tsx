import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { useState } from 'react';
import { describe, expect, it } from 'vitest';
import { TagGroup } from './TagGroup';

const options = ['A', 'B', 'C'] as const;

function Harness() {
  const [value, setValue] = useState<string[]>(['A', 'B']);
  return <TagGroup options={options} value={value} onChange={setValue} max={2} />;
}

describe('TagGroup', () => {
  it('blocks a tag beyond the limit and shows a message', async () => {
    const user = userEvent.setup();
    render(<Harness />);
    await user.click(screen.getByRole('button', { name: 'C' }));
    expect(screen.getByRole('alert')).toHaveTextContent(/не больше 2 тегов/i);
    expect(screen.getByRole('button', { name: 'C' })).toHaveAttribute('aria-pressed', 'false');
  });
});
