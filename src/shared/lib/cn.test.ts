import { describe, expect, it } from 'vitest';
import { cn } from './cn';

describe('cn', () => {
  it('merges tailwind classes', () => {
    expect(cn('p-2', 'p-4', 'text-white')).toBe('p-4 text-white');
  });
});
