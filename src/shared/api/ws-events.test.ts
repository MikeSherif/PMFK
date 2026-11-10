import { describe, expect, it } from 'vitest';
import { parseWsEvent } from './ws-events';

describe('parseWsEvent', () => {
  it('accepts known events and ignores unknown ones', () => {
    expect(
      parseWsEvent({
        type: 'match.created',
        payload: {
          id: 'm1',
          createdAt: '2026-12-10T10:00:00.000Z',
          peer: { id: 'p', fullName: 'Игорь', company: 'FMCG', role: 'Директор' },
        },
      })?.type,
    ).toBe('match.created');
    expect(parseWsEvent({ type: 'unknown', payload: {} })).toBeNull();
  });
});
