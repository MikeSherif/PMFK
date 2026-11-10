import { describe, expect, it } from 'vitest';
import { formatMessageTime } from './format';

describe('formatMessageTime', () => {
  it('formats as dd.mm.yyyy, hh:mm:ss', () => {
    const value = formatMessageTime('2026-12-10T11:30:05.000Z');
    expect(value).toMatch(/\d{2}\.\d{2}\.\d{4}/);
    expect(value).toMatch(/\d{2}:\d{2}:\d{2}/);
  });
});
